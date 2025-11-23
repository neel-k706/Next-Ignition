import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  FONT_FAMILY,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from '@/constants/theme';
import {
  LayoutDashboard,
  UsersRound,
  MessageSquare,
  BarChart3,
  BriefcaseBusiness,
  UserRound,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useChat';
import { useResponsive } from '@/hooks/useResponsive';

interface NavItem {
  icon: any;
  label: string;
  route: string;
  badge?: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { totalUnread } = useConversations();
  const { isDesktop } = useResponsive();

  if (!isDesktop) return null; // Only show on desktop

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        route: '/(tabs)',
      },
      {
        icon: UsersRound,
        label: 'Network',
        route: '/(tabs)/network',
      },
      {
        icon: MessageSquare,
        label: 'Chat',
        route: '/(tabs)/chat',
        badge: totalUnread,
      },
      {
        icon: BarChart3,
        label: 'Funding',
        route: '/(tabs)/funding',
      },
      {
        icon: BriefcaseBusiness,
        label: 'Opportunities',
        route: '/(tabs)/opportunities',
      },
    ];

    // Add role-specific items
    if (profile?.role === 'founder' || profile?.role === 'cofounder') {
      baseItems.push({
        icon: BriefcaseBusiness,
        label: 'Startup Profile',
        route: '/(tabs)/startup-profile',
      });
    }

    if (profile?.role === 'expert') {
      baseItems.push({
        icon: BriefcaseBusiness,
        label: 'Sessions',
        route: '/(tabs)/expert-sessions',
      });
    }

    if (profile?.role === 'investor') {
      baseItems.push({
        icon: BriefcaseBusiness,
        label: 'Discovery',
        route: '/(tabs)/startup-discovery',
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const isActive = (route: string) => {
    if (route === '/(tabs)') {
      return pathname === '/(tabs)' || pathname?.startsWith('/(tabs)/index');
    }
    return pathname?.startsWith(route);
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>NextIgnition</Text>
      </View>

      <View style={styles.navItems}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}>
              <View style={styles.navItemContent}>
                <Icon
                  size={20}
                  color={active ? COLORS.primary : COLORS.textSecondary}
                  strokeWidth={2.5}
                />
                <Text
                  style={[
                    styles.navItemText,
                    active && styles.navItemTextActive,
                  ]}>
                  {item.label}
                </Text>
              </View>
              {item.badge && item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sidebarFooter}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/(tabs)/notifications')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Notifications">
          <Bell size={20} color={COLORS.textSecondary} strokeWidth={2} />
          <Text style={styles.footerItemText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Settings">
          <Settings size={20} color={COLORS.textSecondary} strokeWidth={2} />
          <Text style={styles.footerItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/(tabs)/help')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Help">
          <HelpCircle size={20} color={COLORS.textSecondary} strokeWidth={2} />
          <Text style={styles.footerItemText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerItem, styles.logoutItem]}
          onPress={signOut}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sign out">
          <LogOut size={20} color={COLORS.error} strokeWidth={2} />
          <Text style={[styles.footerItemText, styles.logoutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  sidebarHeader: {
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sidebarTitle: {
    ...TYPOGRAPHY.heading,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.text,
  },
  navItems: {
    flex: 1,
    gap: SPACING.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  navItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  navItemTextActive: {
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.primary,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.background,
  },
  sidebarFooter: {
    gap: SPACING.xs,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  footerItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  logoutItem: {
    marginTop: SPACING.sm,
  },
  logoutText: {
    color: COLORS.error,
  },
});

