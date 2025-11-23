import { useState, useEffect } from 'react';

export interface Session {
  id: string;
  title: string;
  time: string;
  duration: string;
  participant_name?: string;
}

const DUMMY_SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Product Strategy Review',
    time: 'Today at 2:00 PM',
    duration: '45 min',
    participant_name: 'Sarah Johnson',
  },
  {
    id: '2',
    title: 'Investment Discussion',
    time: 'Tomorrow at 10:30 AM',
    duration: '60 min',
    participant_name: 'Michael Chen',
  },
  {
    id: '3',
    title: 'Marketing Consultation',
    time: 'Dec 20 at 3:00 PM',
    duration: '30 min',
    participant_name: 'Emma Davis',
  },
];

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSessions(DUMMY_SESSIONS);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  return { sessions, loading, error, refetch: fetchSessions };
}
