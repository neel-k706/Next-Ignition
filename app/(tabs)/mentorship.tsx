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
  Award,
  Users,
  MessageSquare,
  Calendar,
  Star,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react-native';

const AVAILABLE_EXPERTS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    expertise: 'Product Strategy, Go-to-Market',
    experience: '10+ years',
    rating: 4.9,
    sessions: 48,
    hourlyRate: '$150',
    available: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    expertise: 'Fundraising, Financial Planning',
    experience: '8+ years',
    rating: 4.8,
    sessions: 32,
    hourlyRate: '$200',
    available: true,
  },
];

const MENTORSHIP_SESSIONS = [
  {
    id: '1',
    expert: 'Sarah Johnson',
    topic: 'Product-Market Fit',
    date: '2024-02-15',
    time: '2:00 PM',
    status: 'upcoming',
    type: 'scheduled',
  },
  {
    id: '2',
    expert: 'Michael Chen',
    topic: 'Fundraising Strategy',
    date: '2024-01-20',
    time: '3:00 PM',
    status: 'completed',
    type: 'past',
    rating: 5,
  },
];

const RECEIVED_REVIEWS = [
  {
    id: '1',
    from: 'Sarah Johnson',
    rating: 5,
    comment: 'Great founder with clear vision and strong execution. Highly recommend!',
    date: '2024-01-20',
  },
  {
    id: '2',
    from: 'Michael Chen',
    rating: 4,
    comment: 'Very engaged and prepared. Great potential for growth.',
    date: '2024-01-15',
  },
];

export default function MentorshipScreen() {
  const [activeTab, setActiveTab] = useState<'experts' | 'sessions' | 'reviews'>('experts');
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
        <LinearGradient colors={GRADIENTS.navy} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Award size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Mentorship & Networking</Text>
              <Text style={styles.heroSubtitle}>
                Connect with experts and grow your startup
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'experts' && styles.tabActive]}
            onPress={() => setActiveTab('experts')}
            activeOpacity={0.7}>
            <Users size={18} color={activeTab === 'experts' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'experts' && styles.tabTextActive,
              ]}>
              Experts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sessions' && styles.tabActive]}
            onPress={() => setActiveTab('sessions')}
            activeOpacity={0.7}>
            <Calendar size={18} color={activeTab === 'sessions' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'sessions' && styles.tabTextActive,
              ]}>
              Sessions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
            onPress={() => setActiveTab('reviews')}
            activeOpacity={0.7}>
            <Star size={18} color={activeTab === 'reviews' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'reviews' && styles.tabTextActive,
              ]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'experts' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Experts</Text>
            <View style={styles.expertsList}>
              {AVAILABLE_EXPERTS.map((expert) => (
                <View key={expert.id} style={styles.expertCard}>
                  <View style={styles.expertHeader}>
                    <View style={styles.expertIcon}>
                      <Award size={24} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.expertInfo}>
                      <View style={styles.expertNameRow}>
                        <Text style={styles.expertName}>{expert.name}</Text>
                        {expert.available && (
                          <View style={styles.availableBadge}>
                            <View style={styles.availableDot} />
                            <Text style={styles.availableText}>Available</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.expertExpertise}>{expert.expertise}</Text>
                      <View style={styles.expertMeta}>
                        <View style={styles.expertRating}>
                          <Star size={14} color={COLORS.warning} fill={COLORS.warning} strokeWidth={2} />
                          <Text style={styles.expertRatingText}>{expert.rating}</Text>
                        </View>
                        <Text style={styles.expertMetaText}>{expert.experience}</Text>
                        <Text style={styles.expertMetaText}>{expert.sessions} sessions</Text>
                        <Text style={styles.expertMetaText}>{expert.hourlyRate}/hr</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.expertActions}>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => router.push(`/(tabs)/chat?expert=${expert.id}`)}
                      activeOpacity={0.7}>
                      <MessageSquare size={18} color={COLORS.primary} strokeWidth={2} />
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.requestButton}
                      onPress={() => router.push('/(tabs)/request-mentorship')}
                      activeOpacity={0.7}>
                      <Send size={18} color={COLORS.background} strokeWidth={2} />
                      <Text style={styles.requestButtonText}>Request Session</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'sessions' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mentorship Sessions</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/request-mentorship')}>
                <Text style={styles.newButtonText}>New Request</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sessionsList}>
              {MENTORSHIP_SESSIONS.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionIcon}>
                      <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionExpert}>{session.expert}</Text>
                      <Text style={styles.sessionTopic}>{session.topic}</Text>
                    </View>
                    {session.status === 'upcoming' ? (
                      <View style={styles.upcomingBadge}>
                        <Clock size={14} color={COLORS.warning} strokeWidth={2} />
                        <Text style={styles.upcomingText}>Upcoming</Text>
                      </View>
                    ) : (
                      <View style={styles.completedBadge}>
                        <CheckCircle size={14} color={COLORS.success} strokeWidth={2} />
                        <Text style={styles.completedText}>Completed</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.sessionDetails}>
                    <Text style={styles.sessionDateTime}>
                      {session.date} at {session.time}
                    </Text>
                    {session.rating && (
                      <View style={styles.sessionRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color={star <= session.rating! ? COLORS.warning : COLORS.border}
                            fill={star <= session.rating! ? COLORS.warning : 'none'}
                            strokeWidth={2}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews Received</Text>
            <View style={styles.reviewsList}>
              {RECEIVED_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewIcon}>
                      <Award size={20} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewFrom}>{review.from}</Text>
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            color={star <= review.rating ? COLORS.warning : COLORS.border}
                            fill={star <= review.rating ? COLORS.warning : 'none'}
                            strokeWidth={2}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
    backgroundColor: 'rgba(255,255,255,0.12)',
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    gap: SPACING.xs,
    ...SHADOWS.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
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
  newButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
  },
  expertsList: {
    gap: SPACING.md,
  },
  expertCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  expertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  expertIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertInfo: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  expertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  expertName: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success + '20',
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success,
  },
  availableText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  expertExpertise: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  expertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  expertRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  expertRatingText: {
    ...TYPOGRAPHY.caption,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  expertMetaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  expertActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  messageButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  requestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  requestButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  sessionsList: {
    gap: SPACING.md,
  },
  sessionCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  sessionExpert: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  sessionTopic: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.warning + '20',
  },
  upcomingText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success + '20',
  },
  completedText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sessionDateTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  sessionRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewsList: {
    gap: SPACING.md,
  },
  reviewCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  reviewIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewFrom: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
  },
});

