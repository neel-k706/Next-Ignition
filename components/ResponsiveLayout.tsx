import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { Sidebar } from './navigation/Sidebar';
import { COLORS } from '@/constants/theme';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

/**
 * Responsive layout wrapper that shows:
 * - Sidebar on desktop/web
 * - Bottom tabs on mobile (handled by expo-router tabs)
 */
export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { isDesktop } = useResponsive();

  if (!isDesktop) {
    // On mobile, just render children (tabs handle navigation)
    return <>{children}</>;
  }

  // On desktop, show sidebar + content
  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

