export type UserRole = 'founder' | 'cofounder' | 'investor' | 'expert' | 'admin';

export interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role?: UserRole;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  onboarding_completed?: boolean;
  subscription_tier?: string;
  subscription_status?: string;
  venture_name?: string;
  venture_description?: string;
  venture_industry?: string;
  venture_stage?: string;
  investment_focus?: string;
  investment_range?: string;
  portfolio_size?: string;
  expertise_areas?: string[];
  years_experience?: number;
  hourly_rate?: number;
  skills?: Array<{ name: string; level: string }>;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}
