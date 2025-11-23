import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  Star,
  MessageSquare,
  UserRound,
  Send,
  ThumbsUp,
  Clock,
} from 'lucide-react-native';
import { Button } from '@/components/Button';

const PENDING_REVIEWS = [
  {
    id: '1',
    sessionTitle: 'Mentorship Session',
    userName: 'John Smith',
    company: 'TechStart Inc',
    date: '2024-01-20',
    type: 'mentorship',
  },
  {
    id: '2',
    sessionTitle: 'Webinar: Scaling SaaS',
    userName: 'Sarah Johnson',
    company: 'NextIgnition',
    date: '2024-01-18',
    type: 'webinar',
  },
];

const PAST_REVIEWS = [
  {
    id: '1',
    userName: 'Michael Chen',
    company: 'HealthTech Solutions',
    rating: 5,
    comment: 'Excellent mentorship session. Very insightful and actionable advice.',
    date: '2024-01-15',
    helpful: 12,
  },
  {
    id: '2',
    userName: 'Emily Davis',
    company: 'Innovate Labs',
    rating: 4,
    comment: 'Great webinar with practical tips. Would definitely attend again.',
    date: '2024-01-10',
    helpful: 8,
  },
];

export default function ReviewsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'past'>('pending');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (reviewId: string) => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    alert('Review submitted successfully!');
    setRating(0);
    setComment('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.accent} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Star size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Reviews & Ratings</Text>
              <Text style={styles.heroSubtitle}>
                Share feedback and help others succeed
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
            activeOpacity={0.7}>
            <MessageSquare
              size={18}
              color={activeTab === 'pending' ? COLORS.primary : COLORS.textSecondary}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.tabTextActive,
              ]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.7}>
            <Star
              size={18}
              color={activeTab === 'past' ? COLORS.primary : COLORS.textSecondary}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.tabTextActive,
              ]}>
              Past Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'pending' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Reviews</Text>
            <View style={styles.reviewsList}>
              {PENDING_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserIcon}>
                      <UserRound size={20} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                      <Text style={styles.reviewCompany}>{review.company}</Text>
                      <Text style={styles.reviewSession}>{review.sessionTitle}</Text>
                    </View>
                    <View style={styles.reviewDate}>
                      <Clock size={14} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.reviewDateText}>{review.date}</Text>
                    </View>
                  </View>

                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>Rate this session:</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setRating(star)}
                          activeOpacity={0.7}>
                          <Star
                            size={32}
                            color={star <= rating ? COLORS.warning : COLORS.border}
                            fill={star <= rating ? COLORS.warning : 'none'}
                            strokeWidth={2}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.commentSection}>
                    <Text style={styles.commentLabel}>Add a comment (optional):</Text>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Share your experience..."
                      placeholderTextColor={COLORS.textSecondary}
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  <Button
                    title="Submit Review"
                    onPress={() => handleSubmitReview(review.id)}
                    disabled={rating === 0}
                    style={styles.submitButton}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Reviews</Text>
            <View style={styles.reviewsList}>
              {PAST_REVIEWS.map((review) => (
                <View key={review.id} style={styles.pastReviewCard}>
                  <View style={styles.pastReviewHeader}>
                    <View style={styles.pastReviewUserInfo}>
                      <View style={styles.pastReviewIcon}>
                        <UserRound size={20} color={COLORS.primary} strokeWidth={2} />
                      </View>
                      <View>
                        <Text style={styles.pastReviewUserName}>{review.userName}</Text>
                        <Text style={styles.pastReviewCompany}>{review.company}</Text>
                      </View>
                    </View>
                    <View style={styles.pastReviewRating}>
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
                  <Text style={styles.pastReviewComment}>{review.comment}</Text>
                  <View style={styles.pastReviewFooter}>
                    <Text style={styles.pastReviewDate}>{review.date}</Text>
                    <TouchableOpacity style={styles.helpfulButton}>
                      <ThumbsUp size={14} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.helpfulText}>{review.helpful} helpful</Text>
                    </TouchableOpacity>
                  </View>
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
    gap: SPACING.md,
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
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  reviewsList: {
    gap: SPACING.lg,
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
  reviewUserIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewUserInfo: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  reviewUserName: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  reviewCompany: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  reviewSession: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  reviewDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  reviewDateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  ratingSection: {
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ratingLabel: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  commentSection: {
    gap: SPACING.sm,
  },
  commentLabel: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  commentInput: {
    padding: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  pastReviewCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  pastReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pastReviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  pastReviewIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastReviewUserName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  pastReviewCompany: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  pastReviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  pastReviewComment: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  pastReviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  pastReviewDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  helpfulText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});

