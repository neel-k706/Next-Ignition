/*
  # Create Profiles Table

  ## Overview
  Creates a profiles table to store user information including email, role, and timestamps.
  This table extends Supabase Auth users with application-specific data.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - References auth.users(id), automatically set
  - `email` (text, not null) - User's email address
  - `role` (text, nullable) - User's selected role: founder, cofounder, investor, or expert
  - `created_at` (timestamptz, default now()) - Timestamp when profile was created
  - `updated_at` (timestamptz, default now()) - Timestamp when profile was last updated

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the profiles table
  - Users can only view their own profile data
  - Users can only update their own profile data
  - Users can insert their own profile during registration

  ## Important Notes
  - The id field must match the user's auth.users.id
  - Uses CASCADE delete to automatically remove profile when user is deleted
  - Role field is nullable to allow profile creation before role selection
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text,
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
