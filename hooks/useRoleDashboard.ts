import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

export function useRoleDashboard() {
  const { profile } = useAuth();
  const role = profile?.role;

  const dashboardData = useMemo(() => {
    const getDashboardRoute = (): string => {
      switch (role) {
        case 'founder':
        case 'cofounder':
          return '/(tabs)/founder-dashboard';
        case 'investor':
          return '/(tabs)/investor-dashboard';
        case 'expert':
          return '/(tabs)/expert-dashboard';
        default:
          return '/(tabs)';
      }
    };

    return {
      role,
      dashboardRoute: getDashboardRoute(),
      isFounder: role === 'founder' || role === 'cofounder',
      isInvestor: role === 'investor',
      isExpert: role === 'expert',
    };
  }, [role]);

  return dashboardData;
}

