import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { showAlert } from '@/utils/platformAlert';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfileStats } from '@/hooks/useProfileStats';

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

export default function FounderDashboard() {
  const { profile } = useAuth();
  const { permissions, currentPlan, loading: subLoading } = useSubscription();
  const { stats, loading: statsLoading, refresh: refreshStats } = useProfileStats();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startup, setStartup] = useState<{ name?: string; stage?: string; pitch_deck_url?: string | null; pitch_video_url?: string | null; is_public?: boolean }>({});
  const [meetings, setMeetings] = useState<Array<{ id: string; title: string; participant_name: string | null; scheduled_for: string; status: string }>>([]);
  const [activities, setActivities] = useState<Array<{ id: string; title: string; subtitle: string | null; created_at: string; type: string }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; status: 'pending' | 'in_progress' }>>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  const canUploadPitchAssets = permissions.canUploadPitchDeck || permissions.canRecordPitchVideo;

  const buildTaskList = useCallback(
    (
      startupRecord?: { pitch_deck_url?: string | null; pitch_video_url?: string | null },
      activityList: Array<{ id: string }> = [],
    ) => {
      const items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' }> = [];
      if (!startupRecord?.pitch_deck_url) {
        items.push({ id: 'deck', title: 'Upload your pitch deck', status: 'pending' });
      }
      if (!startupRecord?.pitch_video_url) {
        items.push({ id: 'video', title: 'Record your 2-minute pitch video', status: 'pending' });
      }
      if (activityList.length < 3) {
        items.push({
          id: 'network',
          title: 'Engage with investors to boost activity',
          status: 'in_progress',
        });
      }
      return items;
    },
    [],
  );

  const fetchDashboardData = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const [startupRes, meetingsRes, activitiesRes] = await Promise.all([
        supabase
          .from('startup_profiles')
          .select('name, stage, pitch_deck_url, pitch_video_url, is_public')
          .eq('owner_id', profile.id)
          .maybeSingle(),
        supabase
          .from('founder_meetings')
          .select('id, title, participant_name, scheduled_for, status')
          .eq('founder_id', profile.id)
          .order('scheduled_for', { ascending: true })
          .limit(3),
        supabase
          .from('founder_activities')
          .select('id, title, subtitle, created_at, type')
          .eq('founder_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (startupRes.error && startupRes.error.code !== 'PGRST116') throw startupRes.error;
      if (meetingsRes.error) throw meetingsRes.error;
      if (activitiesRes.error) throw activitiesRes.error;

      const startupData = startupRes.data || {};
      const meetingsData = meetingsRes.data || [];
      const activityData = activitiesRes.data || [];

      setStartup(startupData);
      setMeetings(meetingsData);
      setActivities(activityData);
      setTasks(buildTaskList(startupData, activityData));
    } catch (err) {
      console.error('Error loading founder dashboard', err);
      Alert.alert('Error', 'Unable to load your dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.id, buildTaskList]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardData(), refreshStats()]);
  };

  const handleQuickAction = (route: string, requiresPremium = false) => {
    // Prevent multiple rapid clicks
    if (isNavigating) return;

    if (requiresPremium && !canUploadPitchAssets) {
      showAlert(
        'Upgrade required',
        'Pitch materials are part of the Pro plan and above. Upgrade to unlock this action.',
      );
      return;
    }

    setIsNavigating(true);
    router.push(route);
    // Reset after navigation completes
    setTimeout(() => setIsNavigating(false), 500);
  };

  const quickActions = QUICK_ACTIONS.map((action) => ({
    ...action,
    requiresPremium:
      action.route === '/(tabs)/pitch-upload' || action.route === '/(tabs)/pitch-video',
  }));

  const fundingVisibilityCopy = startup?.is_public
    ? 'Your pitch is visible across investor discovery'
    : 'Your pitch is only shared with approved investors';

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
                {startup?.name || profile?.venture_name || 'Your Startup'} •{' '}
                {startup?.stage || profile?.venture_stage || 'Early Stage'}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.connectionsCount}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.activeChatsCount}</Text>
              <Text style={styles.statLabel}>Active Chats</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.investorViewsCount}</Text>
              <Text style={styles.statLabel}>Investor Views</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.title}
                  style={styles.actionCard}
                  onPress={() => handleQuickAction(action.route, action.requiresPremium)}
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
            {tasks.length === 0 ? (
              <Text style={styles.emptyStateText}>Nice work! Your core tasks are up to date.</Text>
            ) : (
              tasks.map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskContent}>
                    <Clock
                      size={18}
                      color={task.status === 'pending' ? COLORS.warning : COLORS.accent}
                      strokeWidth={2}
                    />
                    <Text style={styles.taskText}>{task.title}</Text>
                  </View>
                  <View style={styles.taskStatus}>
                    <Text style={styles.taskStatusText}>
                      {task.status === 'pending' ? 'Pending' : 'In Progress'}
                    </Text>
                  </View>
                </View>
              ))
            )}
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
                <Text style={styles.fundingSubtitle}>{fundingVisibilityCopy}</Text>
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
          {meetings.length === 0 ? (
            <View style={styles.sessionCard}>
              <Calendar size={20} color={COLORS.textSecondary} strokeWidth={2} />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>No sessions scheduled</Text>
                <Text style={styles.sessionTime}>Use the Mentorship tab to book time</Text>
              </View>
            </View>
          ) : (
            meetings.map((meeting) => (
              <View key={meeting.id} style={styles.sessionCard}>
                <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{meeting.title}</Text>
                  <Text style={styles.sessionTime}>
                    {new Date(meeting.scheduled_for).toLocaleString()} •{' '}
                    {meeting.participant_name || 'TBD'}
                  </Text>
                </View>
                <CheckCircle
                  size={20}
                  color={meeting.status === 'completed' ? COLORS.success : COLORS.primary}
                  strokeWidth={2}
                />
              </View>
            ))
          )}

          {activities.length > 0 && (
            <View style={styles.activitiesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/feed')}>
                  <Text style={styles.seeAllText}>View Feed</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activitiesList}>
                {activities.map((activity) => (
                  <View key={activity.id} style={styles.activityCard}>
                    <View style={styles.activityBullet} />
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      {activity.subtitle ? (
                        <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                      ) : null}
                      <Text style={styles.activityTime}>
                        {new Date(activity.created_at).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
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
    paddingBottom: SPACING.xxl,
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
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.sm,
  },
  seeAllText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 0,
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
    marginBottom: SPACING.md,
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
    justifyContent: 'space-between',
    marginHorizontal: 0,
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
    marginBottom: SPACING.md,
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
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  activitiesList: {
    gap: SPACING.sm,
  },
  activitiesSection: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  activityCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityBullet: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.sm,
  },
  activityInfo: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  activityTitle: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
  },
  activitySubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  activityTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtle,
  },
});

