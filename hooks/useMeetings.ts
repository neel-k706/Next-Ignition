import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Meeting {
  id: string;
  organizer_id: string;
  participant_id: string | null;
  participant_email: string | null;
  title: string;
  description: string | null;
  meeting_type: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  meeting_url: string | null;
  meeting_platform: string;
  status: string;
  google_calendar_event_id: string | null;
  google_meet_link: string | null;
  created_at: string;
  updated_at: string;
}

export function useMeetings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduleMeeting = useCallback(
    async (meetingData: {
      title: string;
      description?: string;
      participantEmail: string;
      scheduledAt: string; // ISO string
      duration: number; // minutes
      timezone?: string;
    }) => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setLoading(true);
      setError(null);

      try {
        // Get auth token
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('No active session');
        }

        // Call Supabase Edge Function
        const { data, error: functionError } = await supabase.functions.invoke(
          'schedule-meeting',
          {
            body: { meetingData },
          }
        );

        console.log('=== Edge Function Response ===');
        console.log('Data:', data);
        console.log('Error:', functionError);

        // Check if there's an error in the response
        if (functionError) {
          console.error('Function error object:', JSON.stringify(functionError, null, 2));
          throw new Error(functionError.message || 'Function execution failed');
        }

        // Check if the data contains an error
        if (data && !data.success) {
          console.error('Function returned error:', data);
          throw new Error(data.error || 'Failed to schedule meeting');
        }

        setLoading(false);
        return {
          success: true,
          meeting: data.meeting,
          meetLink: data.meetLink,
          calendarEventId: data.calendarEventId,
          emailSent: data.emailSent || false,
        };
      } catch (err: any) {
        console.error('Error scheduling meeting:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        const errorMessage = err.context?.body || err.message || 'Failed to schedule meeting';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [user]
  );

  const getUpcomingMeetings = useCallback(async () => {
    if (!user?.id) return { success: false, error: 'Not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('meetings')
        .select('*')
        .or(`organizer_id.eq.${user.id},participant_id.eq.${user.id}`)
        .gte('scheduled_at', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true });

      if (fetchError) throw fetchError;

      setLoading(false);
      return { success: true, meetings: data as Meeting[] };
    } catch (err: any) {
      console.error('Error fetching meetings:', err);
      const errorMessage = err.message || 'Failed to fetch meetings';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const cancelMeeting = useCallback(
    async (meetingId: string) => {
      if (!user?.id) return { success: false, error: 'Not authenticated' };

      setLoading(true);
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from('meetings')
          .update({ status: 'cancelled' })
          .eq('id', meetingId)
          .eq('organizer_id', user.id);

        if (updateError) throw updateError;

        setLoading(false);
        return { success: true };
      } catch (err: any) {
        console.error('Error cancelling meeting:', err);
        const errorMessage = err.message || 'Failed to cancel meeting';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [user?.id]
  );

  return {
    scheduleMeeting,
    getUpcomingMeetings,
    cancelMeeting,
    loading,
    error,
  };
}
