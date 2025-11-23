import { useState, useEffect } from 'react';

export interface Activity {
  id: string;
  type: 'connection_request' | 'message' | 'investment_opp';
  title: string;
  subtitle?: string;
  created_at: string;
}

const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'connection_request',
    title: 'New connection request',
    subtitle: 'Alex Martinez wants to connect',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    type: 'message',
    title: 'New message received',
    subtitle: 'Sarah Johnson sent you a message',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'investment_opp',
    title: 'Investment opportunity',
    subtitle: 'HealthTech startup looking for $500K',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    type: 'connection_request',
    title: 'Connection accepted',
    subtitle: 'David Kim accepted your connection request',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setActivities(DUMMY_ACTIVITIES);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  return { activities, loading, error, refetch: fetchActivities };
}
