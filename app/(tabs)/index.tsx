import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS } from '@/constants/theme';

// Import role-specific dashboards
import FounderDashboard from './founder-dashboard';
import InvestorDashboard from './investor-dashboard';
import ExpertDashboard from './expert-dashboard';

export default function HomeScreen() {
  const { profile, loading } = useAuth();

  // Show loading state while profile is being fetched
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Render the appropriate dashboard based on user role
  const role = profile?.role;

  if (role === 'founder' || role === 'cofounder') {
    return <FounderDashboard />;
  }

  if (role === 'investor') {
    return <InvestorDashboard />;
  }

  if (role === 'expert') {
    return <ExpertDashboard />;
  }

  // Fallback for users without a role (shouldn't happen normally)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

