import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface StartupDetail {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  industry: string | null;
  stage: string | null;
  website: string | null;
  is_public: boolean;
  pitch_deck_url: string | null;
  pitch_deck_uploaded_at: string | null;
  pitch_video_url: string | null;
  pitch_video_uploaded_at: string | null;
  created_at: string;
  updated_at: string;
  // Profile data from joined profiles table
  founder_name: string | null;
  founder_email: string | null;
  location: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  bio: string | null;
  venture_name: string | null;
  venture_description: string | null;
  venture_industry: string | null;
  venture_stage: string | null;
}

export interface PitchMaterial {
  id: string;
  owner_profile_id: string;
  type: 'deck' | 'video';
  filename: string | null;
  storage_path: string | null;
  url: string | null;
  pages: number | null;
  duration_seconds: number | null;
  visibility: 'public' | 'private';
  reviewed: boolean;
  created_at: string;
  updated_at: string;
}

export function useStartupDetail(startupId?: string) {
  const [startup, setStartup] = useState<StartupDetail | null>(null);
  const [pitchDecks, setPitchDecks] = useState<PitchMaterial[]>([]);
  const [pitchVideos, setPitchVideos] = useState<PitchMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startupId) {
      fetchStartupDetail(startupId);
    } else {
      // If no ID provided, try to fetch current user's startup
      fetchCurrentUserStartup();
    }
  }, [startupId]);

  const fetchCurrentUserStartup = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching current user startup');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Failed to get authenticated user: ' + userError.message);
      }

      if (!user) {
        throw new Error('No authenticated user found. Please log in.');
      }

      console.log('Current user ID:', user.id);

      // Fetch startup for current user
      const { data: startupData, error: startupError } = await supabase
        .from('startup_profiles')
        .select(`
          *,
          profiles:owner_id (
            full_name,
            email,
            location,
            linkedin_url,
            twitter_url,
            bio,
            venture_name,
            venture_description,
            venture_industry,
            venture_stage
          )
        `)
        .eq('owner_id', user.id)
        .maybeSingle();

      if (startupError) {
        console.error('Startup fetch error:', startupError);
        throw new Error('Database error: ' + startupError.message);
      }

      if (!startupData) {
        console.log('No startup profile found for current user');
        throw new Error('No startup profile found. Please create one from your profile page.');
      }

      console.log('Current user startup data fetched:', startupData);

      const profile = Array.isArray(startupData.profiles) 
        ? startupData.profiles[0] 
        : startupData.profiles;

      setStartup({
        id: startupData.id,
        owner_id: startupData.owner_id,
        name: startupData.name,
        description: startupData.description,
        industry: startupData.industry,
        stage: startupData.stage,
        website: startupData.website,
        is_public: startupData.is_public ?? true,
        pitch_deck_url: startupData.pitch_deck_url,
        pitch_deck_uploaded_at: startupData.pitch_deck_uploaded_at,
        pitch_video_url: startupData.pitch_video_url,
        pitch_video_uploaded_at: startupData.pitch_video_uploaded_at,
        created_at: startupData.created_at,
        updated_at: startupData.updated_at,
        founder_name: profile?.full_name || null,
        founder_email: profile?.email || null,
        location: profile?.location || null,
        linkedin_url: profile?.linkedin_url || null,
        twitter_url: profile?.twitter_url || null,
        bio: profile?.bio || null,
        venture_name: profile?.venture_name || null,
        venture_description: profile?.venture_description || null,
        venture_industry: profile?.venture_industry || null,
        venture_stage: profile?.venture_stage || null,
      });

      // Fetch pitch materials for this startup owner
      await fetchPitchMaterials(startupData.owner_id);
    } catch (err: any) {
      console.error('Error fetching current user startup:', err);
      setError(err.message || 'Failed to load startup details');
      setStartup(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStartupDetail = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching startup with ID:', id);

      // Fetch startup profile with founder details
      const { data: startupData, error: startupError } = await supabase
        .from('startup_profiles')
        .select(`
          *,
          profiles:owner_id (
            full_name,
            email,
            location,
            linkedin_url,
            twitter_url,
            bio,
            venture_name,
            venture_description,
            venture_industry,
            venture_stage
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (startupError) {
        console.error('Startup fetch error:', startupError);
        throw new Error('Database error: ' + startupError.message);
      }

      if (!startupData) {
        throw new Error('Startup not found with ID: ' + id);
      }

      console.log('Startup data fetched:', startupData);

      const profile = Array.isArray(startupData.profiles) 
        ? startupData.profiles[0] 
        : startupData.profiles;

      setStartup({
        id: startupData.id,
        owner_id: startupData.owner_id,
        name: startupData.name,
        description: startupData.description,
        industry: startupData.industry,
        stage: startupData.stage,
        website: startupData.website,
        is_public: startupData.is_public ?? true,
        pitch_deck_url: startupData.pitch_deck_url,
        pitch_deck_uploaded_at: startupData.pitch_deck_uploaded_at,
        pitch_video_url: startupData.pitch_video_url,
        pitch_video_uploaded_at: startupData.pitch_video_uploaded_at,
        created_at: startupData.created_at,
        updated_at: startupData.updated_at,
        founder_name: profile?.full_name || null,
        founder_email: profile?.email || null,
        location: profile?.location || null,
        linkedin_url: profile?.linkedin_url || null,
        twitter_url: profile?.twitter_url || null,
        bio: profile?.bio || null,
        venture_name: profile?.venture_name || null,
        venture_description: profile?.venture_description || null,
        venture_industry: profile?.venture_industry || null,
        venture_stage: profile?.venture_stage || null,
      });

      // Fetch pitch materials for this startup owner
      await fetchPitchMaterials(startupData.owner_id);
    } catch (err: any) {
      console.error('Error fetching startup detail:', err);
      setError(err.message || 'Failed to load startup details');
      setStartup(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPitchMaterials = async (ownerId: string) => {
    try {
      console.log('Fetching pitch materials for owner:', ownerId);

      const { data, error } = await supabase
        .from('pitch_materials')
        .select('*')
        .eq('owner_profile_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Pitch materials fetch error:', error);
        throw error;
      }

      console.log('Pitch materials fetched:', data);

      if (data) {
        // Refresh signed URLs for all materials
        const materialsWithFreshUrls = await Promise.all(
          data.map(async (material) => {
            if (material.storage_path) {
              try {
                const { data: urlData } = await supabase.storage
                  .from('pitch-materials')
                  .createSignedUrl(material.storage_path, 157680000); // 5 years
                
                if (urlData?.signedUrl) {
                  return { ...material, url: urlData.signedUrl };
                }
              } catch (err) {
                console.error('Error refreshing signed URL:', err);
              }
            }
            return material;
          })
        );
        
        const decks = materialsWithFreshUrls.filter(item => item.type === 'deck');
        const videos = materialsWithFreshUrls.filter(item => item.type === 'video');
        
        setPitchDecks(decks);
        setPitchVideos(videos);
      }
    } catch (err: any) {
      console.error('Error fetching pitch materials:', err);
      // Don't throw error, just log it - pitch materials are optional
    }
  };

  const refresh = () => {
    if (startupId) {
      fetchStartupDetail(startupId);
    } else {
      fetchCurrentUserStartup();
    }
  };

  return {
    startup,
    pitchDecks,
    pitchVideos,
    loading,
    error,
    refresh,
  };
}
