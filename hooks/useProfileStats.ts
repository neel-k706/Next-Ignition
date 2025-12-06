import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileStats {
  connectionsCount: number;
  activeChatsCount: number;
  investorViewsCount: number;
  pitchMaterialsCount: number;
  fundingRequestsCount: number;
  notificationsCount: number;
  unreadNotificationsCount: number;
}

export function useProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({
    connectionsCount: 0,
    activeChatsCount: 0,
    investorViewsCount: 0,
    pitchMaterialsCount: 0,
    fundingRequestsCount: 0,
    notificationsCount: 0,
    unreadNotificationsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all stats in parallel
      const [
        connectionsResult,
        chatsResult,
        viewsResult,
        pitchesResult,
        fundingResult,
        notificationsResult,
      ] = await Promise.all([
        // Count accepted connections
        supabase
          .from('connections')
          .select('id', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},target_id.eq.${user.id}`)
          .eq('status', 'accepted'),

        // Count active conversations
        supabase
          .from('conversation_members')
          .select('conversation_id', { count: 'exact', head: true })
          .eq('profile_id', user.id),

        // Count investor views on user's pitch materials (will use RPC function if available)
        Promise.resolve({ data: 0, error: null }), // Placeholder - RPC function needs to be created

        // Count pitch materials
        supabase
          .from('pitch_materials')
          .select('id', { count: 'exact', head: true })
          .eq('owner_profile_id', user.id),

        // Count funding requests
        supabase
          .from('funding_requests')
          .select('id', { count: 'exact', head: true })
          .eq('founder_id', user.id),

        // Count notifications
        supabase
          .from('notifications')
          .select('id, read', { count: 'exact' })
          .eq('profile_id', user.id),
      ]);

      const connectionsCount = connectionsResult.count || 0;
      const activeChatsCount = chatsResult.count || 0;
      const investorViewsCount = viewsResult.data || 0;
      const pitchMaterialsCount = pitchesResult.count || 0;
      const fundingRequestsCount = fundingResult.count || 0;
      
      const notifications = notificationsResult.data || [];
      const notificationsCount = notifications.length;
      const unreadNotificationsCount = notifications.filter((n: any) => !n.read).length;

      setStats({
        connectionsCount,
        activeChatsCount,
        investorViewsCount,
        pitchMaterialsCount,
        fundingRequestsCount,
        notificationsCount,
        unreadNotificationsCount,
      });
    } catch (err: any) {
      console.error('Error fetching profile stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}
