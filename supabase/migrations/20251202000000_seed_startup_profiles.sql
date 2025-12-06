/*
  # Seed Startup Profiles for Testing

  This migration creates sample startup profiles for testing the startup detail page.
  It assumes you have existing user profiles in the profiles table.
*/

-- Insert sample startup profiles for existing users
-- Note: Replace the owner_id UUIDs with actual user IDs from your profiles table

INSERT INTO public.startup_profiles (
  owner_id,
  name,
  description,
  industry,
  stage,
  website,
  is_public,
  pitch_deck_url,
  pitch_video_url,
  created_at,
  updated_at
)
SELECT 
  p.id as owner_id,
  COALESCE(p.venture_name, p.full_name || '''s Startup', 'My Startup') as name,
  COALESCE(
    p.venture_description,
    p.bio,
    'An innovative startup focused on solving real-world problems through technology and creativity.'
  ) as description,
  COALESCE(p.venture_industry, 'Technology') as industry,
  COALESCE(p.venture_stage, 'Seed') as stage,
  p.website_url as website,
  true as is_public,
  NULL as pitch_deck_url,
  NULL as pitch_video_url,
  NOW() as created_at,
  NOW() as updated_at
FROM public.profiles p
WHERE p.role IN ('founder', 'cofounder')
  AND NOT EXISTS (
    SELECT 1 FROM public.startup_profiles sp WHERE sp.owner_id = p.id
  )
ON CONFLICT (owner_id) DO NOTHING;

-- If no startup profiles were created (no founders exist), create a generic one
-- This requires you to have at least one user in the profiles table
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the first user from profiles table
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.startup_profiles (
      owner_id,
      name,
      description,
      industry,
      stage,
      website,
      is_public,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'Demo Startup',
      'A revolutionary platform that connects founders with investors, experts, and resources to build successful companies.',
      'Technology',
      'Seed',
      'https://demo-startup.com',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (owner_id) DO NOTHING;
  END IF;
END $$;
