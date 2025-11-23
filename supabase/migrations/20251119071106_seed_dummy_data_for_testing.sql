/*
  # Seed Dummy Data for UI Testing

  ## Overview
  Populates the database with sample data for testing the UI without real authentication.
  Creates tables if they don't exist and inserts test data for sessions, activities, and discover content.

  ## Tables Created/Modified
  - `profiles` - User profile with complete data for a test founder
  - `sessions` - Sample upcoming sessions
  - `activities` - Sample activity feed items
  - `discover` - Sample content recommendations

  ## Security
  - RLS enabled on all tables
  - Policies allow authenticated users to access their own data
  - Discover content is publicly accessible to authenticated users

  ## Test Data
  - 1 complete founder profile
  - 3 upcoming sessions
  - 5 recent activities
  - 5 discover content items
*/

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text,
  full_name text,
  location text,
  bio text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  onboarding_completed boolean DEFAULT false,
  venture_name text,
  venture_description text,
  venture_industry text,
  venture_stage text,
  investment_focus text,
  investment_range text,
  portfolio_size text,
  expertise_areas text[] DEFAULT '{}',
  years_experience integer,
  hourly_rate numeric(10, 2),
  skills jsonb DEFAULT '[]'::jsonb,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create sessions table if not exists
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  time text NOT NULL,
  duration text NOT NULL,
  participant_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can view own sessions'
  ) THEN
    CREATE POLICY "Users can view own sessions"
      ON sessions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can insert own sessions'
  ) THEN
    CREATE POLICY "Users can insert own sessions"
      ON sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can update own sessions'
  ) THEN
    CREATE POLICY "Users can update own sessions"
      ON sessions
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can delete own sessions'
  ) THEN
    CREATE POLICY "Users can delete own sessions"
      ON sessions
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create activities table if not exists
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  subtitle text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Users can view own activities'
  ) THEN
    CREATE POLICY "Users can view own activities"
      ON activities
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Users can insert own activities'
  ) THEN
    CREATE POLICY "Users can insert own activities"
      ON activities
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create discover table if not exists
CREATE TABLE IF NOT EXISTS discover (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE discover ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'discover' AND policyname = 'Authenticated users can view discover content'
  ) THEN
    CREATE POLICY "Authenticated users can view discover content"
      ON discover
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert sample discover content (public content - accessible to all authenticated users)
INSERT INTO discover (title, category, description) 
SELECT * FROM (VALUES
  ('Fundraising Best Practices', 'Education', 'Learn proven strategies for raising your first round of funding'),
  ('SaaS Growth Metrics Guide', 'Resources', 'Essential metrics every SaaS founder should track'),
  ('Building MVP in 30 Days', 'Tutorial', 'A step-by-step guide to launching your minimum viable product'),
  ('Investor Pitch Deck Template', 'Resources', 'Professional pitch deck template used by successful startups'),
  ('Finding Co-founders', 'Community', 'Tips for finding the perfect co-founder for your venture')
) AS v(title, category, description)
WHERE NOT EXISTS (SELECT 1 FROM discover LIMIT 1);
