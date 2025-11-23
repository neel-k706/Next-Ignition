import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_PROFILE } from '@/hooks/useMockData';
import { Button } from '@/components/Button';
import { ProfileMenu } from '@/components/ProfileMenu';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { UserRound, MapPin, Pencil, ExternalLink, MoreVertical } from 'lucide-react-native';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const profile = MOCK_PROFILE;
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/(tabs)/edit-profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.navy} style={styles.backgroundGradient} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
          <View style={styles.avatarContainer}>
              <UserRound size={44} color={COLORS.accent} />
          </View>
            <View style={styles.heroInfo}>
          <Text style={styles.name}>{profile?.full_name || 'No name set'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{profile.role}</Text>
            </View>
          )}
        </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Pencil size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
                activeOpacity={0.7}
                accessibilityLabel="Open profile menu">
                <MoreVertical size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroMetaRow}>
        {profile?.location && (
              <View style={styles.metaPill}>
                <MapPin size={18} color={COLORS.primary} />
                <Text style={styles.metaText}>{profile.location}</Text>
              </View>
            )}
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>
                {profile?.subscription_tier?.toUpperCase() || 'FREE'} plan
              </Text>
            </View>
          </View>
        </View>

        {profile?.bio && (
          <View style={styles.surfaceCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        )}

        {(profile?.linkedin_url || profile?.twitter_url || profile?.website_url) && (
          <View style={styles.surfaceCard}>
            <Text style={styles.sectionTitle}>Links</Text>
            {profile.linkedin_url && (
              <TouchableOpacity style={styles.linkItem}>
                <ExternalLink size={18} color={COLORS.primary} />
                <Text style={styles.linkText}>LinkedIn</Text>
              </TouchableOpacity>
            )}
            {profile.twitter_url && (
              <TouchableOpacity style={styles.linkItem}>
                <ExternalLink size={18} color={COLORS.primary} />
                <Text style={styles.linkText}>Twitter</Text>
              </TouchableOpacity>
            )}
            {profile.website_url && (
              <TouchableOpacity style={styles.linkItem}>
                <ExternalLink size={18} color={COLORS.primary} />
                <Text style={styles.linkText}>Website</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.surfaceCard}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTier}>
                {profile?.subscription_tier?.toUpperCase() || 'FREE'}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  profile?.subscription_status === 'active' && styles.statusActive,
                ]}>
                <Text style={styles.statusText}>{profile?.subscription_status || 'Active'}</Text>
              </View>
            </View>
            <Button
              title="Upgrade Plan"
              onPress={() => {}}
              variant="outline"
              style={styles.upgradeButton}
            />
          </View>
        </View>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          loading={loading}
          style={styles.signOutButton}
        />
      </ScrollView>
      <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    gap: SPACING.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
  },
  name: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  email: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.background,
    textTransform: 'capitalize',
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.inputBackground,
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  surfaceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  bioText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  linkText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  subscriptionCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  subscriptionTier: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusActive: {
    backgroundColor: `${COLORS.success}25`,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.success,
    textTransform: 'capitalize',
  },
  upgradeButton: {
    height: 40,
  },
  signOutButton: {
    marginTop: SPACING.lg,
  },
});
