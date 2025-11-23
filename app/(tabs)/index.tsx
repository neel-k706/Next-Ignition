import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MOCK_PROFILE, useMockSessions, useMockActivities } from '@/hooks/useMockData';
import { useDiscover } from '@/hooks/useDiscover';
import { useRoleDashboard } from '@/hooks/useRoleDashboard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '@/constants/theme';
import {
  CalendarDays,
  BarChart3,
  UsersRound,
  MessageSquare,
  BellRing,
  ChevronRight,
  Building2,
  BriefcaseBusiness,
  ArrowRight,
} from 'lucide-react-native';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'connection_request':
      return <UsersRound size={18} color={COLORS.primary} strokeWidth={2} />;
    case 'message':
      return <MessageSquare size={18} color={COLORS.primary} strokeWidth={2} />;
    case 'investment_opp':
      return <BarChart3 size={18} color={COLORS.primary} strokeWidth={2} />;
    default:
      return <BellRing size={18} color={COLORS.primary} strokeWidth={2} />;
  }
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default function HomeScreen() {
  const profile = MOCK_PROFILE;
  const { sessions } = useMockSessions();
  const { activities } = useMockActivities();
  const { discover, refetch: refetchDiscover } = useDiscover();
  const [refreshing, setRefreshing] = useState(false);
  const { dashboardRoute, isFounder, isInvestor, isExpert } = useRoleDashboard();

  // Redirect to role-specific dashboard if user has completed onboarding
  useEffect(() => {
    if (profile?.onboarding_completed) {
      if (isFounder) {
        router.replace('/(tabs)/founder-dashboard');
      } else if (isInvestor) {
        router.replace('/(tabs)/investor-dashboard');
      } else if (isExpert) {
        router.replace('/(tabs)/expert-dashboard');
      }
    }
  }, [profile?.onboarding_completed, isFounder, isInvestor, isExpert]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchDiscover(),
        new Promise(resolve => setTimeout(resolve, 1000)),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{profile?.full_name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <BellRing size={22} color={COLORS.text} strokeWidth={2} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <LinearGradient colors={GRADIENTS.primary} style={styles.subscriptionCard}>
          <View style={styles.subscriptionContent}>
            <View style={styles.subscriptionIcon}>
              <Building2 size={20} color={COLORS.background} strokeWidth={2.5} />
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>
                {profile?.subscription_tier?.toUpperCase() || 'FREE'} Plan
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {profile?.subscription_tier === 'free'
                  ? 'Upgrade to unlock premium features'
                  : 'All premium features unlocked'}
              </Text>
            </View>
          </View>
          {profile?.subscription_tier === 'free' && (
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
              <ArrowRight size={16} color={COLORS.background} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon={<BriefcaseBusiness size={24} color={COLORS.primary} strokeWidth={2} />}
            title="New Venture"
            subtitle="Start a project"
          />
          <QuickActionCard
            icon={<UsersRound size={24} color={COLORS.primary} strokeWidth={2} />}
            title="Find Partner"
            subtitle="Browse network"
          />
          <QuickActionCard
            icon={<CalendarDays size={24} color={COLORS.primary} strokeWidth={2} />}
            title="Book Session"
            subtitle="Schedule meeting"
          />
          <QuickActionCard
            icon={<MessageSquare size={24} color={COLORS.primary} strokeWidth={2} />}
            title="Messages"
            subtitle="View chats"
          />
        </View>

        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        {sessions.length > 0 ? (
          sessions.slice(0, 2).map((session) => (
            <SessionCard
              key={session.id}
              title={session.title}
              time={session.time}
              duration={session.duration}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming sessions</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activities.length > 0 ? (
          activities.slice(0, 3).map((activity) => (
            <ActivityCard
              key={activity.id}
              icon={getActivityIcon(activity.type)}
              title={activity.title}
              subtitle={activity.subtitle || ''}
              time={formatTime(activity.created_at)}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Discover</Text>
        {discover.length > 0 ? (
          discover.slice(0, 2).map((item) => (
            <DiscoverCard
              key={item.id}
              title={item.title}
              category={item.category}
              description={item.description || ''}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No content available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickActionCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.85}>
      <View style={styles.quickActionIcon}>{icon}</View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function SessionCard({ title, time, duration }: { title: string; time: string; duration: string }) {
  return (
    <TouchableOpacity style={styles.sessionCard} activeOpacity={0.85}>
      <View style={styles.sessionIcon}>
        <CalendarDays size={20} color={COLORS.primary} strokeWidth={2} />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>{title}</Text>
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionTime}>{time}</Text>
          <View style={styles.dot} />
          <Text style={styles.sessionDuration}>{duration}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
    </TouchableOpacity>
  );
}

function ActivityCard({ icon, title, subtitle, time }: { icon: React.ReactNode; title: string; subtitle: string; time: string }) {
  return (
    <TouchableOpacity style={styles.activityCard} activeOpacity={0.85}>
      <View style={styles.activityIcon}>{icon}</View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

function DiscoverCard({ title, category, description }: { title: string; category: string; description: string }) {
  return (
    <TouchableOpacity style={styles.discoverCard} activeOpacity={0.85}>
      <View style={styles.discoverContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <Text style={styles.discoverTitle}>{title}</Text>
        <Text style={styles.discoverDescription}>{description}</Text>
      </View>
      <ChevronRight size={20} color={COLORS.textSecondary} strokeWidth={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  userName: {
    ...TYPOGRAPHY.heading,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  notificationText: {
    fontSize: 10,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.background,
  },
  subscriptionCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.md,
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  subscriptionSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  quickActionCard: {
    width: '48%',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sessionTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.textSecondary,
  },
  sessionDuration: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
    gap: SPACING.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  activitySubtitle: {
    ...TYPOGRAPHY.body,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  activityTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.subtle,
  },
  discoverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  discoverContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: `${COLORS.accent}20`,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    ...TYPOGRAPHY.label,
    color: COLORS.accent,
  },
  discoverTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  discoverDescription: {
    ...TYPOGRAPHY.body,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyCard: {
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
