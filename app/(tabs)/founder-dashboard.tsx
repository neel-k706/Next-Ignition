import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
import {
  Building2,
  Upload,
  Video,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Bell,
  BarChart3,
} from 'lucide-react-native';
import { MOCK_PROFILE } from '@/hooks/useMockData';

const QUICK_ACTIONS = [
  {
    icon: Upload,
    title: 'Upload Pitch Deck',
    subtitle: 'Share your deck',
    route: '/(tabs)/pitch-upload',
    color: COLORS.primary,
  },
  {
    icon: Video,
    title: 'Record Pitch Video',
    subtitle: '2-minute pitch',
    route: '/(tabs)/pitch-video',
    color: COLORS.accent,
  },
  {
    icon: Users,
    title: 'Find Investors',
    subtitle: 'Browse network',
    route: '/(tabs)/network',
    color: COLORS.primary,
  },
  {
    icon: MessageSquare,
    title: 'Messages',
    subtitle: 'View chats',
    route: '/(tabs)/chat',
    color: COLORS.primary,
  },
];

const PENDING_TASKS = [
  { id: '1', title: 'Complete your pitch deck', status: 'pending' },
  { id: '2', title: 'Record 2-minute pitch video', status: 'pending' },
  { id: '3', title: 'Connect with 5 investors', status: 'in_progress' },
];

export default function FounderDashboard() {
  const profile = MOCK_PROFILE;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Building2 size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Welcome back, {profile?.full_name || 'Founder'}</Text>
              <Text style={styles.heroSubtitle}>
                {profile?.venture_name || 'Your Startup'} • {profile?.venture_stage || 'Early Stage'}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Active Chats</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Investor Views</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.title}
                  style={styles.actionCard}
                  onPress={() => router.push(action.route)}
                  activeOpacity={0.7}>
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                    <IconComponent size={24} color={action.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Features</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/startup-profile')}
              activeOpacity={0.7}>
              <Building2 size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.featureTitle}>Startup Profile</Text>
              <Text style={styles.featureSubtitle}>Manage your profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/funding-status')}
              activeOpacity={0.7}>
              <TrendingUp size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.featureTitle}>Funding Status</Text>
              <Text style={styles.featureSubtitle}>Track progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/mentorship')}
              activeOpacity={0.7}>
              <Award size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.featureTitle}>Mentorship</Text>
              <Text style={styles.featureSubtitle}>Find experts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/webinars')}
              activeOpacity={0.7}>
              <Video size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.featureTitle}>Webinars</Text>
              <Text style={styles.featureSubtitle}>Events & sessions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/feed')}
              activeOpacity={0.7}>
              <BarChart3 size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.featureTitle}>Activity Feed</Text>
              <Text style={styles.featureSubtitle}>Network updates</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/notifications')}
              activeOpacity={0.7}>
              <Bell size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.featureTitle}>Notifications</Text>
              <Text style={styles.featureSubtitle}>View updates</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Tasks</Text>
          <View style={styles.tasksList}>
            {PENDING_TASKS.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskContent}>
                  <Clock size={18} color={COLORS.warning} strokeWidth={2} />
                  <Text style={styles.taskText}>{task.title}</Text>
                </View>
                <View style={styles.taskStatus}>
                  <Text style={styles.taskStatusText}>
                    {task.status === 'pending' ? 'Pending' : 'In Progress'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Funding Portal</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/funding')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fundingCard}>
            <View style={styles.fundingHeader}>
              <TrendingUp size={24} color={COLORS.primary} strokeWidth={2} />
              <View style={styles.fundingInfo}>
                <Text style={styles.fundingTitle}>Your Pitch Status</Text>
                <Text style={styles.fundingSubtitle}>Visible to 24 investors</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.fundingButton}
              onPress={() => router.push('/(tabs)/funding')}>
              <Text style={styles.fundingButtonText}>Manage Pitch</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/sessions')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sessionCard}>
            <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Mentorship Session</Text>
              <Text style={styles.sessionTime}>Tomorrow at 2:00 PM</Text>
            </View>
            <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.75)',
  },
  section: {
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  seeAllText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '48%',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tasksList: {
    gap: SPACING.sm,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  taskText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  taskStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.warning + '20',
  },
  taskStatusText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  fundingCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  fundingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  fundingInfo: {
    flex: 1,
  },
  fundingTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  fundingSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  fundingButton: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  fundingButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
      sessionTime: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
      },
      featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
      },
      featureCard: {
        width: '48%',
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.sm,
        alignItems: 'center',
        gap: SPACING.sm,
      },
      featureTitle: {
        ...TYPOGRAPHY.bodyStrong,
        fontFamily: FONT_FAMILY.bodyBold,
        color: COLORS.text,
        textAlign: 'center',
      },
      featureSubtitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        textAlign: 'center',
      },
});

