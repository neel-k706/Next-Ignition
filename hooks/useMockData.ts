import { useState, useEffect } from 'react';

export const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export const MOCK_PROFILE = {
  id: MOCK_USER_ID,
  email: 'demo@nextignition.com',
  role: 'founder' as const,
  full_name: 'Alex Johnson',
  location: 'San Francisco, CA',
  bio: 'Serial entrepreneur passionate about building products that solve real problems. Currently working on my third startup in the SaaS space.',
  linkedin_url: 'https://linkedin.com/in/alexjohnson',
  twitter_url: 'https://twitter.com/alexjohnson',
  website_url: 'https://alexjohnson.com',
  subscription_tier: 'pro',
  subscription_status: 'active',
  onboarding_completed: true,
  venture_name: 'CloudSync',
  venture_description: 'A revolutionary cloud-based collaboration platform for remote teams',
  venture_industry: 'SaaS',
  venture_stage: 'Growth',
  investment_focus: undefined as string | undefined,
  investment_range: undefined as string | undefined,
  portfolio_size: undefined as string | undefined,
  expertise_areas: [] as string[],
  years_experience: undefined as number | undefined,
  hourly_rate: undefined as number | undefined,
  avatar_url: undefined as string | undefined,
  skills: undefined as any,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_SESSIONS = [
  {
    id: '1',
    title: 'Investor Meeting - Series A Discussion',
    time: 'Tomorrow at 2:00 PM',
    duration: '1 hour',
    participant_name: 'Sarah Chen',
  },
  {
    id: '2',
    title: 'Product Strategy Session',
    time: 'Friday at 10:00 AM',
    duration: '45 minutes',
    participant_name: 'Michael Rodriguez',
  },
  {
    id: '3',
    title: 'Co-founder Sync',
    time: 'Next Monday at 3:00 PM',
    duration: '30 minutes',
    participant_name: 'Emma Thompson',
  },
];

export const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'connection_request',
    title: 'New Connection Request',
    subtitle: 'John Smith wants to connect',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    subtitle: 'Sarah Chen sent you a message about funding',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'investment_opp',
    title: 'Investment Opportunity',
    subtitle: 'Venture Capital Partners is interested in your pitch',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    type: 'connection_request',
    title: 'Connection Accepted',
    subtitle: 'Michael Rodriguez accepted your connection request',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    subtitle: 'Emma Thompson commented on your venture update',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function useMockSessions() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    sessions,
    loading,
    error,
    refetch: () => {},
  };
}

export function useMockActivities() {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    activities,
    loading,
    error,
    refetch: () => {},
  };
}
