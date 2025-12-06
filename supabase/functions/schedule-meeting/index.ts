import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Schedule Meeting Function Started ===')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Unauthorized')
    }

    console.log('User authenticated:', user.email)

    const { meetingData, googleAccessToken } = await req.json()
    console.log('Meeting data received:', meetingData)
    console.log('googleAccessToken provided:', !!googleAccessToken)

    // Generate a unique meeting link using Jitsi (free, no API required)
    const meetingRoomId = `next-ignition-${crypto.randomUUID()}`
    const meetingLink = `https://meet.jit.si/${meetingRoomId}`
    console.log('Generated meeting link:', meetingLink)

    // 1. Create Google Calendar Event
    console.log('Creating Google Calendar event...')
    const googleCalendarEvent = await createGoogleCalendarEvent(meetingData, user.email, meetingLink)
    console.log('Calendar event created:', googleCalendarEvent.id)

    // 2. Save meeting to database
    const { data: meeting, error: dbError } = await supabaseClient
      .from('meetings')
      .insert({
        organizer_id: user.id,
        participant_email: meetingData.participantEmail,
        title: meetingData.title,
        description: meetingData.description,
        meeting_type: 'video',
        scheduled_at: meetingData.scheduledAt,
        duration_minutes: meetingData.duration,
        timezone: meetingData.timezone || 'UTC',
        google_calendar_event_id: googleCalendarEvent.id,
        google_meet_link: meetingLink,
        meeting_url: meetingLink,
        meeting_platform: 'jitsi',
      })
      .select()
      .single()

    if (dbError) throw dbError

    // 3. Send email invitation (optional - don't fail if email fails)
    let emailSent = false
    try {
      await sendEmailInvitation({
        to: meetingData.participantEmail,
        organizerName: user.user_metadata?.full_name || user.email,
        organizerEmail: user.email,
        meeting: {
          ...meeting,
          meetingUrl: meetingLink,
        },
      })
      emailSent = true
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError.message)
      // Don't throw - meeting is still created successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        meeting,
        calendarEventId: googleCalendarEvent.id,
        meetLink: meetingLink,
        emailSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('=== Error scheduling meeting ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    // Return detailed error for debugging
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        errorName: error.constructor.name,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Create Google Calendar Event with optional Meet link
// If googleAccessToken is provided (OAuth user token), we create a Meet link and add attendees.
// If not provided, we use the Service Account and create a plain event without conference data (to avoid errors).
async function createGoogleCalendarEvent(meetingData: any, organizerEmail: string, meetingLink: string) {
  console.log('=== Creating Google Calendar Event ===')

  const GOOGLE_SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')
  const GOOGLE_PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n')

  console.log('Service account email:', GOOGLE_SERVICE_ACCOUNT_EMAIL)
  console.log('Private key exists:', !!GOOGLE_PRIVATE_KEY)

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Google service account credentials not configured')
  }

  console.log('Creating Service Account JWT token...')
  const authToken = await createJWT(GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)
  console.log('Service Account JWT token created successfully')

  // Calculate end time
  const startTime = new Date(meetingData.scheduledAt)
  const endTime = new Date(startTime.getTime() + meetingData.duration * 60000)

  // Create calendar event with meeting link in description
  const event: any = {
    summary: meetingData.title,
    description: `${meetingData.description || ''}\n\n📹 Join Meeting: ${meetingLink}\n\nThis meeting is hosted on Jitsi Meet. Click the link above to join at the scheduled time.`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: meetingData.timezone || 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: meetingData.timezone || 'UTC',
    },
  }

  console.log('Event object:', JSON.stringify(event, null, 2))

  // Create the event (no conferenceData or attendees to avoid service account limitations)
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`

  const response = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  console.log('Google Calendar API response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    console.error('Google Calendar API error:', error)
    throw new Error(`Google Calendar API error: ${error}`)
  }

  const calendarEvent = await response.json()
  console.log('Calendar event created successfully:', calendarEvent.id)
  
  return {
    ...calendarEvent,
    id: calendarEvent.id
  }
}

// Create JWT for Google Service Account
async function createJWT(email: string, privateKey: string) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  // Base64 URL encode function
  function base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const headerBase64 = base64UrlEncode(JSON.stringify(header))
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload))
  const unsignedToken = `${headerBase64}.${payloadBase64}`

  // Import private key
  const keyData = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '')

  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )

  // Sign the token
  const encoder = new TextEncoder()
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(unsignedToken)
  )

  const signatureArray = new Uint8Array(signature)
  const signatureBase64 = base64UrlEncode(
    String.fromCharCode.apply(null, Array.from(signatureArray))
  )
  const jwt = `${unsignedToken}.${signatureBase64}`

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const tokenData = await tokenResponse.json()
  
  if (!tokenData.access_token) {
    throw new Error('No access token received from Google')
  }
  
  return tokenData.access_token
}

// Send email invitation using Resend
async function sendEmailInvitation(params: any) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

  if (!RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping email')
    return
  }

  const meetingDate = new Date(params.meeting.scheduled_at)
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = meetingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .meeting-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Meeting Invitation</h1>
          <p>You've been invited to a meeting</p>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p><strong>${params.organizerName}</strong> (${params.organizerEmail}) has invited you to a meeting.</p>
          
          <div class="meeting-details">
            <div class="detail-row">
              <span class="label">Title:</span> ${params.meeting.title}
            </div>
            <div class="detail-row">
              <span class="label">Date:</span> ${formattedDate}
            </div>
            <div class="detail-row">
              <span class="label">Time:</span> ${formattedTime}
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span> ${params.meeting.duration_minutes} minutes
            </div>
            ${params.meeting.description ? `
            <div class="detail-row">
              <span class="label">Description:</span><br/>
              ${params.meeting.description}
            </div>
            ` : ''}
          </div>

          ${params.meeting.meetingUrl ? `
            <center>
              <a href="${params.meeting.meetingUrl}" class="button">Join Video Meeting</a>
            </center>

            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              <strong>Meeting Link:</strong><br/>
              <a href="${params.meeting.meetingUrl}" style="color: #667eea;">${params.meeting.meetingUrl}</a>
            </p>

            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>ℹ️ About Jitsi Meet:</strong> This meeting uses Jitsi Meet, a free and secure video conferencing platform. No account or download required - just click the link to join!
              </p>
            </div>
          ` : `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Note:</strong> A Google Meet link could not be generated automatically. Please create a meeting link manually or the organizer will send one shortly.
              </p>
            </div>
          `}

          <div style="background: #f3f4f6; border-left: 4px solid #9ca3af; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📅 Add to Calendar:</strong> Manually add this event to your calendar using the date/time above.
            </p>
          </div>
        </div>
        <div class="footer">
          <p>Sent by Next Ignition Platform</p>
        </div>
      </div>
    </body>
    </html>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Next Ignition <onboarding@resend.dev>',
      to: [params.to],
      subject: `Meeting Invitation: ${params.meeting.title}`,
      html: emailHtml,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Email send error:', error)
    throw new Error('Failed to send email invitation')
  }

  return await response.json()
}
