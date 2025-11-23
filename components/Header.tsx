import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { Bell, UserRound, Settings, LogOut, HelpCircle, Menu } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useChat';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

export function Header({ title, showBack = false, showMenu = false, onMenuPress }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const { totalUnread } = useConversations();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showMenu && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open menu">
            <Menu size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
        )}

        {title && <Text style={styles.title}>{title}</Text>}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/notifications')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notifications">
            <Bell size={22} color={COLORS.text} strokeWidth={2} />
            {totalUnread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalUnread > 99 ? '99+' : totalUnread}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setShowProfileMenu(!showProfileMenu)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Profile menu">
            <View style={styles.avatar}>
              <UserRound size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            {showProfileMenu && (
              <View style={styles.profileMenu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push('/(tabs)/profile');
                  }}
                  activeOpacity={0.7}>
                  <UserRound size={18} color={COLORS.text} strokeWidth={2} />
                  <Text style={styles.menuItemText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push('/(tabs)/settings');
                  }}
                  activeOpacity={0.7}>
                  <Settings size={18} color={COLORS.text} strokeWidth={2} />
                  <Text style={styles.menuItemText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push('/(tabs)/help');
                  }}
                  activeOpacity={0.7}>
                  <HelpCircle size={18} color={COLORS.text} strokeWidth={2} />
                  <Text style={styles.menuItemText}>Help Center</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                  activeOpacity={0.7}>
                  <LogOut size={18} color={COLORS.error} strokeWidth={2} />
                  <Text style={[styles.menuItemText, styles.logoutText]}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 64,
  },
  menuButton: {
    padding: SPACING.xs,
    marginRight: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMenu: {
    position: 'absolute',
    top: 52,
    right: 0,
    minWidth: 200,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.lg,
    padding: SPACING.xs,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  menuItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  logoutText: {
    color: COLORS.error,
  },
});

