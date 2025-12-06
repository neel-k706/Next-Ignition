-- Create meetings table for video call scheduling
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_email TEXT,
  
  -- Meeting details
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT NOT NULL DEFAULT 'video', -- video, phone, in-person
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  timezone TEXT DEFAULT 'UTC',
  
  -- Video call details
  meeting_url TEXT, -- Google Meet link or custom link
  meeting_platform TEXT DEFAULT 'google-meet', -- google-meet, zoom, custom
  
  -- Status
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  
  -- Google Calendar integration
  google_calendar_event_id TEXT,
  google_meet_link TEXT,
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  
  -- Metadata
  notes TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meetings_organizer ON public.meetings(organizer_id);
CREATE INDEX idx_meetings_participant ON public.meetings(participant_id);
CREATE INDEX idx_meetings_scheduled_at ON public.meetings(scheduled_at);
CREATE INDEX idx_meetings_status ON public.meetings(status);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view meetings they organize or participate in
CREATE POLICY "Users can view their own meetings"
  ON public.meetings
  FOR SELECT
  USING (
    auth.uid() = organizer_id 
    OR auth.uid() = participant_id
  );

-- Users can create meetings
CREATE POLICY "Users can create meetings"
  ON public.meetings
  FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

-- Users can update their own organized meetings
CREATE POLICY "Organizers can update their meetings"
  ON public.meetings
  FOR UPDATE
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Users can delete their own organized meetings
CREATE POLICY "Organizers can delete their meetings"
  ON public.meetings
  FOR DELETE
  USING (auth.uid() = organizer_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_meetings_updated_at();

-- Create view for upcoming meetings
CREATE OR REPLACE VIEW public.upcoming_meetings AS
SELECT 
  m.id,
  m.organizer_id,
  m.participant_id,
  m.participant_email,
  m.title,
  m.description,
  m.meeting_type,
  m.scheduled_at,
  m.duration_minutes,
  m.timezone,
  m.meeting_url,
  m.meeting_platform,
  m.status,
  m.google_calendar_event_id,
  m.google_meet_link,
  m.reminder_sent,
  m.email_sent,
  m.notes,
  m.location,
  m.created_at,
  m.updated_at,
  organizer.full_name as organizer_name,
  organizer.email as organizer_email,
  participant.full_name as participant_name,
  COALESCE(participant.email, m.participant_email) as participant_contact_email
FROM public.meetings m
LEFT JOIN public.profiles organizer ON m.organizer_id = organizer.id
LEFT JOIN public.profiles participant ON m.participant_id = participant.id
WHERE m.scheduled_at > NOW()
  AND m.status = 'scheduled'
ORDER BY m.scheduled_at ASC;
