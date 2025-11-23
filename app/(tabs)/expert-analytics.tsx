import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  BarChart3,
  Calendar,
  Star,
  Eye,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  UserRound,
} from 'lucide-react-native';
import { AnalyticsWidget } from '@/components/admin/AnalyticsWidget';

const STATS = {
  totalSessions: 85,
  upcomingSessions: 5,
  averageRating: 4.8,
  totalViews: 234,
  connections: 45,
  messages: 67,
};

const RECENT_FEEDBACK = [
  {
    id: '1',
    founder: 'John Smith',
    rating: 5,
    comment: 'Excellent mentorship session. Very insightful and actionable advice.',
    date: '2024-01-20',
  },
  {
    id: '2',
    founder: 'Sarah Johnson',
    rating: 5,
    comment: 'Great expert with deep knowledge. Highly recommend!',
    date: '2024-01-18',
  },
  {
    id: '3',
    founder: 'Michael Chen',
    rating: 4,
    comment: 'Helpful session, got valuable insights for our growth strategy.',
    date: '2024-01-15',
  },
];

export default function ExpertAnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <BarChart3 size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Analytics Dashboard</Text>
              <Text style={styles.heroSubtitle}>
                Track your mentorship performance and visibility
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Calendar size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{STATS.totalSessions}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
              <Text style={styles.statChange}>+12 this month</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{STATS.upcomingSessions}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
              <Text style={styles.statChange}>5 scheduled</Text>
            </View>
            <View style={styles.statCard}>
              <Star size={24} color={COLORS.warning} strokeWidth={2} />
              <Text style={styles.statValue}>{STATS.averageRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
              <Text style={styles.statChange}>Based on 85 reviews</Text>
            </View>
            <View style={styles.statCard}>
              <Eye size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{STATS.totalViews}</Text>
              <Text style={styles.statLabel}>Profile Views</Text>
              <Text style={styles.statChange}>+23 this week</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Metrics</Text>
          <View style={styles.engagementGrid}>
            <View style={styles.engagementCard}>
              <Users size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.engagementValue}>{STATS.connections}</Text>
              <Text style={styles.engagementLabel}>Founder Connections</Text>
            </View>
            <View style={styles.engagementCard}>
              <MessageSquare size={24} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.engagementValue}>{STATS.messages}</Text>
              <Text style={styles.engagementLabel}>Messages Exchanged</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Feedback</Text>
          <View style={styles.feedbackList}>
            {RECENT_FEEDBACK.map((feedback) => (
              <View key={feedback.id} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.feedbackIcon}>
                    <UserRound size={20} color={COLORS.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.feedbackInfo}>
                    <Text style={styles.feedbackFounder}>{feedback.founder}</Text>
                    <View style={styles.feedbackRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color={star <= feedback.rating ? COLORS.warning : COLORS.border}
                          fill={star <= feedback.rating ? COLORS.warning : 'none'}
                          strokeWidth={2}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.feedbackDate}>{feedback.date}</Text>
                </View>
                <Text style={styles.feedbackComment}>{feedback.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility Trends</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendItem}>
              <TrendingUp size={20} color={COLORS.success} strokeWidth={2} />
              <View style={styles.trendInfo}>
                <Text style={styles.trendLabel}>Profile Views</Text>
                <Text style={styles.trendValue}>+15% this month</Text>
              </View>
            </View>
            <View style={styles.trendItem}>
              <TrendingUp size={20} color={COLORS.success} strokeWidth={2} />
              <View style={styles.trendInfo}>
                <Text style={styles.trendLabel}>Session Requests</Text>
                <Text style={styles.trendValue}>+8% this month</Text>
              </View>
            </View>
            <View style={styles.trendItem}>
              <TrendingUp size={20} color={COLORS.success} strokeWidth={2} />
              <View style={styles.trendInfo}>
                <Text style={styles.trendLabel}>Average Rating</Text>
                <Text style={styles.trendValue}>+0.2 this month</Text>
              </View>
            </View>
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
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
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
  statValue: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
    textAlign: 'center',
  },
  statChange: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  engagementGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  engagementCard: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  engagementValue: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
  },
  engagementLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
    textAlign: 'center',
  },
  feedbackList: {
    gap: SPACING.md,
  },
  feedbackCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackInfo: {
    flex: 1,
  },
  feedbackFounder: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  feedbackRating: {
    flexDirection: 'row',
    gap: 2,
  },
  feedbackDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  feedbackComment: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  trendCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  trendInfo: {
    flex: 1,
  },
  trendLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  trendValue: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
});

