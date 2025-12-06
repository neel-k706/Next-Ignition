import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionPlan {
  id: number;
  key: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
}

export interface UserSubscription {
  id: string;
  profile_id: string;
  plan_key: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trial';
  started_at: string;
  ends_at: string | null;
  plan?: SubscriptionPlan;
}

export interface SubscriptionPermissions {
  canUploadPitchDeck: boolean;
  canRecordPitchVideo: boolean;
  canAccessPremiumFeatures: boolean;
  canSendUnlimitedMessages: boolean;
  canScheduleMeetings: boolean;
  maxConnections: number;
  maxPitchUploads: number;
}

const PLAN_PERMISSIONS: Record<string, SubscriptionPermissions> = {
  free: {
    canUploadPitchDeck: false,
    canRecordPitchVideo: false,
    canAccessPremiumFeatures: false,
    canSendUnlimitedMessages: false,
    canScheduleMeetings: false,
    maxConnections: 5,
    maxPitchUploads: 0,
  },
  basic: {
    canUploadPitchDeck: true,
    canRecordPitchVideo: false,
    canAccessPremiumFeatures: false,
    canSendUnlimitedMessages: false,
    canScheduleMeetings: true,
    maxConnections: 20,
    maxPitchUploads: 1,
  },
  pro: {
    canUploadPitchDeck: true,
    canRecordPitchVideo: true,
    canAccessPremiumFeatures: true,
    canSendUnlimitedMessages: true,
    canScheduleMeetings: true,
    maxConnections: 100,
    maxPitchUploads: 5,
  },
  premium: {
    canUploadPitchDeck: true,
    canRecordPitchVideo: true,
    canAccessPremiumFeatures: true,
    canSendUnlimitedMessages: true,
    canScheduleMeetings: true,
    maxConnections: -1, // unlimited
    maxPitchUploads: -1, // unlimited
  },
};

export function useSubscription() {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user's current subscription with plan details
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('profile_id', user.id)
        .eq('status', 'active')
        .single();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      setSubscription(subData);
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .order('monthly_price', { ascending: true });

      if (plansError) throw plansError;
      setPlans(data || []);
    } catch (err: any) {
      console.error('Error fetching plans:', err);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, [fetchSubscription, fetchPlans]);

  const currentPlanKey = subscription?.plan_key || 'free';
  
  // FOR TESTING: Grant all permissions to any registered user
  // TODO: Remove this override when ready for production
  const permissions: SubscriptionPermissions = {
    canUploadPitchDeck: true,
    canRecordPitchVideo: true,
    canAccessPremiumFeatures: true,
    canSendUnlimitedMessages: true,
    canScheduleMeetings: true,
    maxConnections: -1, // unlimited
    maxPitchUploads: -1, // unlimited
  };
  
  // Original permissions logic (commented out for testing)
  // const permissions = PLAN_PERMISSIONS[currentPlanKey] || PLAN_PERMISSIONS.free;

  const upgradePlan = async (newPlanKey: string) => {
    if (!user?.id) return;

    try {
      // Delete existing subscription
      await supabase
        .from('subscriptions')
        .delete()
        .eq('profile_id', user.id);

      // Create new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          profile_id: user.id,
          plan_key: newPlanKey,
          status: 'active',
        });

      if (insertError) throw insertError;

      await fetchSubscription();
      return { success: true };
    } catch (err: any) {
      console.error('Error upgrading plan:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    subscription,
    plans,
    loading,
    error,
    currentPlan: subscription?.plan || plans.find(p => p.key === 'free'),
    currentPlanKey,
    permissions,
    isFreePlan: currentPlanKey === 'free',
    isBasicPlan: currentPlanKey === 'basic',
    isProPlan: currentPlanKey === 'pro',
    isPremiumPlan: currentPlanKey === 'premium',
    upgradePlan,
    refreshSubscription: fetchSubscription,
  };
}
