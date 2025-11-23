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
import { Button } from '@/components/Button';
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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  UserRound,
  MessageSquare,
  TrendingUp,
} from 'lucide-react-native';

const PENDING_REQUESTS = [
  {
    id: '1',
    founder: 'John Smith',
    company: 'TechStart Inc',
    topic: 'Product-Market Fit Strategy',
    requestedAt: '2024-01-20',
    duration: '60 min',
    status: 'pending',
  },
  {
    id: '2',
    founder: 'Sarah Johnson',
    company: 'HealthTech Solutions',
    topic: 'Go-to-Market Planning',
    requestedAt: '2024-01-19',
    duration: '45 min',
    status: 'pending',
  },
];

const UPCOMING_SESSIONS = [
  {
    id: '1',
    founder: 'Michael Chen',
    company: 'FinTech Innovations',
    topic: 'Fundraising Strategy',
    date: '2024-02-15',
    time: '2:00 PM',
    duration: '60 min',
    status: 'confirmed',
  },
  {
    id: '2',
    founder: 'Emily Davis',
    company: 'EduTech Platform',
    topic: 'Team Building',
    date: '2024-02-18',
    time: '3:00 PM',
    duration: '45 min',
    status: 'confirmed',
  },
];

const PAST_SESSIONS = [
  {
    id: '1',
    founder: 'David Wilson',
    company: 'SaaS Startup',
    topic: 'Growth Strategy',
    date: '2024-01-15',
    rating: 5,
    review: 'Excellent session, very insightful!',
    canReview: true,
  },
  {
    id: '2',
    founder: 'Lisa Anderson',
    company: 'E-commerce Platform',
    topic: 'Marketing Strategy',
    date: '2024-01-10',
    rating: null,
    review: null,
    canReview: true,
  },
];

export default function ExpertSessionsScreen() {
  const [activeTab, setActiveTab] = useState<'requests' | 'upcoming' | 'past'>('requests');
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAccept = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    alert('Session accepted! Schedule a meeting time.');
  };

  const handleDecline = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    alert('Session request declined.');
  };

  const handleReview = (sessionId: string) => {
    router.push(`/(tabs)/review-founder?session=${sessionId}`);
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
              <Calendar size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Session Management</Text>
              <Text style={styles.heroSubtitle}>
                Manage mentorship requests and sessions
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
            onPress={() => setActiveTab('requests')}
            activeOpacity={0.7}>
            <Clock size={18} color={activeTab === 'requests' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'requests' && styles.tabTextActive,
              ]}>
              Requests
            </Text>
            {requests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.7}>
            <Calendar size={18} color={activeTab === 'upcoming' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.tabTextActive,
              ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.7}>
            <TrendingUp size={18} color={activeTab === 'past' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.tabTextActive,
              ]}>
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'requests' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {requests.length > 0 ? (
              <View style={styles.requestsList}>
                {requests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <View style={styles.requestIcon}>
                        <UserRound size={20} color={COLORS.primary} strokeWidth={2} />
                      </View>
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestFounder}>{request.founder}</Text>
                        <Text style={styles.requestCompany}>{request.company}</Text>
                        <Text style={styles.requestTopic}>{request.topic}</Text>
                      </View>
                    </View>
                    <View style={styles.requestDetails}>
                      <View style={styles.requestDetailItem}>
                        <Clock size={14} color={COLORS.textSecondary} strokeWidth={2} />
                        <Text style={styles.requestDetailText}>{request.duration}</Text>
                      </View>
                      <Text style={styles.requestDate}>Requested {request.requestedAt}</Text>
                    </View>
                    <View style={styles.requestActions}>
                      <Button
                        title="Accept"
                        onPress={() => handleAccept(request.id)}
                        variant="primary"
                        style={styles.acceptButton}
                      />
                      <Button
                        title="Decline"
                        onPress={() => handleDecline(request.id)}
                        variant="outline"
                        style={styles.declineButton}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No pending requests</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'upcoming' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <View style={styles.sessionsList}>
              {UPCOMING_SESSIONS.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionIcon}>
                      <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionFounder}>{session.founder}</Text>
                      <Text style={styles.sessionCompany}>{session.company}</Text>
                      <Text style={styles.sessionTopic}>{session.topic}</Text>
                    </View>
                    <View style={styles.confirmedBadge}>
                      <CheckCircle size={14} color={COLORS.success} strokeWidth={2} />
                      <Text style={styles.confirmedText}>Confirmed</Text>
                    </View>
                  </View>
                  <View style={styles.sessionDetails}>
                    <Text style={styles.sessionDateTime}>
                      {session.date} at {session.time}
                    </Text>
                    <Text style={styles.sessionDuration}>{session.duration}</Text>
                  </View>
                  <View style={styles.sessionActions}>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => router.push(`/(tabs)/chat?founder=${session.founder}`)}
                      activeOpacity={0.7}>
                      <MessageSquare size={16} color={COLORS.primary} strokeWidth={2} />
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.scheduleButton}
                      onPress={() => router.push('/(tabs)/schedule-meeting')}
                      activeOpacity={0.7}>
                      <Calendar size={16} color={COLORS.primary} strokeWidth={2} />
                      <Text style={styles.scheduleButtonText}>Reschedule</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'past' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Sessions</Text>
            <View style={styles.sessionsList}>
              {PAST_SESSIONS.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionIcon}>
                      <UserRound size={20} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionFounder}>{session.founder}</Text>
                      <Text style={styles.sessionCompany}>{session.company}</Text>
                      <Text style={styles.sessionTopic}>{session.topic}</Text>
                    </View>
                    <Text style={styles.sessionDate}>{session.date}</Text>
                  </View>
                  {session.rating && (
                    <View style={styles.sessionRating}>
                      <Text style={styles.ratingLabel}>Rating received:</Text>
                      <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            color={star <= session.rating! ? COLORS.warning : COLORS.border}
                            fill={star <= session.rating! ? COLORS.warning : 'none'}
                            strokeWidth={2}
                          />
                        ))}
                      </View>
                      {session.review && (
                        <Text style={styles.sessionReview}>{session.review}</Text>
                      )}
                    </View>
                  )}
                  {session.canReview && !session.rating && (
                    <Button
                      title="Leave Review"
                      onPress={() => handleReview(session.id)}
                      variant="outline"
                      style={styles.reviewButton}
                    />
                  )}
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
    position: 'relative',
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
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
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
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  requestsList: {
    gap: SPACING.md,
  },
  requestCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
  },
  requestFounder: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  requestCompany: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  requestTopic: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  requestDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  requestDetailText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  requestDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  requestActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  acceptButton: {
    flex: 1,
  },
  declineButton: {
    flex: 1,
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
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionFounder: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  sessionCompany: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  sessionTopic: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success + '20',
  },
  confirmedText: {
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
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  sessionDuration: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: SPACING.md,
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
  scheduleButton: {
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
  scheduleButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  sessionDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  sessionRating: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  ratingLabel: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  sessionReview: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 20,
  },
  reviewButton: {
    marginTop: SPACING.sm,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});

