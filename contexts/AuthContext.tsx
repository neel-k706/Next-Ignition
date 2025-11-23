import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';

// Test mode - set to true to bypass Supabase and use mock data
const TEST_MODE = true;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  testLogin: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  testLogin: () => {},
});

// Mock profiles for all roles
const MOCK_PROFILES: Record<string, UserProfile> = {
  founder: {
    id: 'founder-123',
    email: 'founder@nextignition.com',
    role: 'founder',
    full_name: 'Alex Johnson',
    location: 'San Francisco, CA',
    bio: 'Serial entrepreneur passionate about building products that solve real problems.',
    linkedin_url: 'https://linkedin.com/in/alexjohnson',
    twitter_url: 'https://twitter.com/alexjohnson',
    website_url: 'https://alexjohnson.com',
    subscription_tier: 'pro',
    subscription_status: 'active',
    onboarding_completed: true,
    venture_name: 'CloudSync',
    venture_description: 'A revolutionary cloud-based collaboration platform',
    venture_industry: 'SaaS',
    venture_stage: 'Growth',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  cofounder: {
    id: 'cofounder-123',
    email: 'cofounder@nextignition.com',
    role: 'cofounder',
    full_name: 'Sarah Chen',
    location: 'New York, NY',
    bio: 'Co-founder and CTO with 10+ years in tech startups.',
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    twitter_url: undefined,
    website_url: undefined,
    subscription_tier: 'elite',
    subscription_status: 'active',
    onboarding_completed: true,
    venture_name: 'TechVenture',
    venture_description: 'AI-powered solutions for enterprises',
    venture_industry: 'AI/ML',
    venture_stage: 'Seed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  investor: {
    id: 'investor-123',
    email: 'investor@nextignition.com',
    role: 'investor',
    full_name: 'Michael Rodriguez',
    location: 'Palo Alto, CA',
    bio: 'Angel investor and venture partner focused on early-stage startups.',
    linkedin_url: 'https://linkedin.com/in/michaelrodriguez',
    twitter_url: undefined,
    website_url: undefined,
    subscription_tier: 'elite',
    subscription_status: 'active',
    onboarding_completed: true,
    investment_focus: 'SaaS, FinTech, Healthcare',
    investment_range: '$50K - $500K',
    portfolio_size: '25+ companies',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  expert: {
    id: 'expert-123',
    email: 'expert@nextignition.com',
    role: 'expert',
    full_name: 'Emma Thompson',
    location: 'London, UK',
    bio: 'Business advisor and mentor with expertise in scaling startups.',
    linkedin_url: 'https://linkedin.com/in/emmathompson',
    twitter_url: undefined,
    website_url: undefined,
    subscription_tier: 'pro',
    subscription_status: 'active',
    onboarding_completed: true,
    expertise_areas: ['Strategy', 'Product Development', 'Marketing'],
    years_experience: 15,
    hourly_rate: 200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  admin: {
    id: 'admin-123',
    email: 'admin@nextignition.com',
    role: 'admin',
    full_name: 'Admin User',
    location: 'San Francisco, CA',
    bio: 'Platform administrator',
    linkedin_url: undefined,
    twitter_url: undefined,
    website_url: undefined,
    subscription_tier: 'elite',
    subscription_status: 'active',
    onboarding_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Test login function - bypasses Supabase
  const testLogin = (role: string) => {
    const mockProfile = MOCK_PROFILES[role.toLowerCase()];
    if (mockProfile) {
      // Create mock user object
      const mockUser = {
        id: mockProfile.id,
        email: mockProfile.email,
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      // Create mock session
      const mockSession = {
        access_token: 'test-token',
        refresh_token: 'test-refresh',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: mockUser,
      } as Session;

      setSession(mockSession);
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (TEST_MODE) {
      // In test mode, skip Supabase initialization
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (TEST_MODE) {
      setSession(null);
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, testLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
