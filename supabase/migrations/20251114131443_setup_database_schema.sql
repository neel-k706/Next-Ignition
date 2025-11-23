/*
  # Setup Complete Database Schema

  ## Overview
  Creates profiles table for user data with role-specific fields, and supporting tables
  for sessions, activities, and discover content.

  ## New Tables

  ### `profiles`
  - User profile data including general info and role-specific fields
  - Columns: id, email, role, full_name, location, bio, social links
  - Role-specific: venture info (founders), investment data (investors), expertise (experts)
  - Subscription: tier and status tracking

  ### `sessions`
  - User sessions and meetings
  
  ### `activities`
  - User activity feed

  ### `discover`
  - Public content recommendations

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data except discover content
*/

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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

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

CREATE POLICY "Users can view own sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  subtitle text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS discover (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE discover ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view discover content"
  ON discover
  FOR SELECT
  TO authenticated
  USING (true);
