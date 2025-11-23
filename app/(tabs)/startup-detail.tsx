import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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
  MapPin,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  FileText,
  Video,
  MessageSquare,
  Eye,
  Calendar,
  UserRound,
  ArrowLeft,
  Play,
} from 'lucide-react-native';
import { Button } from '@/components/Button';

const STARTUP_DETAIL = {
  id: '1',
  name: 'TechStart Inc',
  founder: 'John Smith',
  stage: 'Seed',
  industry: 'Technology',
  location: 'San Francisco, CA',
  fundingRequired: '$500K',
  description:
    'AI-powered SaaS platform for enterprise automation. We help businesses streamline their operations through intelligent automation and machine learning.',
  founded: '2023',
  employees: '5-10',
  website: 'https://techstart.com',
  hasPitchDeck: true,
  hasPitchVideo: true,
  views: 45,
  bookmarked: false,
  pitchHistory: [
    { date: '2024-01-15', action: 'Pitch deck uploaded', investor: 'You' },
    { date: '2024-01-10', action: 'Profile viewed', investor: 'Sarah Johnson' },
  ],
};

export default function StartupDetailScreen() {
  const params = useLocalSearchParams();
  const [bookmarked, setBookmarked] = useState(STARTUP_DETAIL.bookmarked);
  const [viewingDeck, setViewingDeck] = useState(false);
  const [viewingVideo, setViewingVideo] = useState(false);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    alert(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <ArrowLeft size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={toggleBookmark}
            activeOpacity={0.7}>
            {bookmarked ? (
              <BookmarkCheck size={24} color={COLORS.primary} fill={COLORS.primary} strokeWidth={2} />
            ) : (
              <Bookmark size={24} color={COLORS.text} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Building2 size={32} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{STARTUP_DETAIL.name}</Text>
              <View style={styles.heroMeta}>
                <UserRound size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                <Text style={styles.heroMetaText}>by {STARTUP_DETAIL.founder}</Text>
                <View style={styles.heroDivider} />
                <MapPin size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                <Text style={styles.heroMetaText}>{STARTUP_DETAIL.location}</Text>
              </View>
            </View>
          </View>
          <View style={styles.heroTags}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{STARTUP_DETAIL.stage}</Text>
            </View>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{STARTUP_DETAIL.industry}</Text>
            </View>
            <View style={[styles.heroTag, styles.fundingTag]}>
              <TrendingUp size={14} color={COLORS.accent} strokeWidth={2} />
              <Text style={[styles.heroTagText, styles.fundingTagText]}>
                {STARTUP_DETAIL.fundingRequired}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{STARTUP_DETAIL.description}</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Founded</Text>
              <Text style={styles.detailValue}>{STARTUP_DETAIL.founded}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Team Size</Text>
              <Text style={styles.detailValue}>{STARTUP_DETAIL.employees}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Website</Text>
              <Text style={styles.detailValueLink}>{STARTUP_DETAIL.website}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pitch Materials</Text>
          <View style={styles.materialsList}>
            {STARTUP_DETAIL.hasPitchDeck && (
              <TouchableOpacity
                style={styles.materialCard}
                onPress={() => setViewingDeck(true)}
                activeOpacity={0.7}>
                <View style={styles.materialIcon}>
                  <FileText size={24} color={COLORS.primary} strokeWidth={2} />
                </View>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialTitle}>Pitch Deck</Text>
                  <Text style={styles.materialSubtitle}>PDF Document</Text>
                </View>
                <View style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </View>
              </TouchableOpacity>
            )}

            {STARTUP_DETAIL.hasPitchVideo && (
              <TouchableOpacity
                style={styles.materialCard}
                onPress={() => setViewingVideo(true)}
                activeOpacity={0.7}>
                <View style={styles.materialIcon}>
                  <Video size={24} color={COLORS.primary} strokeWidth={2} />
                </View>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialTitle}>Pitch Video</Text>
                  <Text style={styles.materialSubtitle}>2 minutes</Text>
                </View>
                <View style={styles.viewButton}>
                  <Play size={18} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.viewButtonText}>Play</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {viewingDeck && (
          <View style={styles.viewerModal}>
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerTitle}>Pitch Deck</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewingDeck(false)}
                activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewerContent}>
              <FileText size={64} color={COLORS.textSecondary} strokeWidth={2} />
              <Text style={styles.viewerText}>PDF Viewer</Text>
              <Text style={styles.viewerSubtext}>
                In production, this would display the embedded PDF
              </Text>
            </View>
          </View>
        )}

        {viewingVideo && (
          <View style={styles.viewerModal}>
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerTitle}>Pitch Video</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewingVideo(false)}
                activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewerContent}>
              <View style={styles.videoPlayer}>
                <Play size={48} color={COLORS.background} strokeWidth={2} />
              </View>
              <Text style={styles.viewerText}>Video Player</Text>
              <Text style={styles.viewerSubtext}>
                In production, this would display the embedded video player
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement History</Text>
          <View style={styles.historyList}>
            {STARTUP_DETAIL.pitchHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Eye size={18} color={COLORS.primary} strokeWidth={2} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyAction}>{item.action}</Text>
                  <View style={styles.historyMeta}>
                    <Calendar size={14} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <View style={styles.historyDivider} />
                    <Text style={styles.historyInvestor}>{item.investor}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Connect with Founder"
            onPress={() => router.push(`/(tabs)/chat?founder=${STARTUP_DETAIL.founder}`)}
            variant="primary"
            style={styles.connectButton}
            icon={<MessageSquare size={20} color={COLORS.background} strokeWidth={2} />}
          />
          <Button
            title="Schedule Meeting"
            onPress={() => router.push('/(tabs)/schedule-meeting')}
            variant="outline"
            style={styles.scheduleButton}
            icon={<Calendar size={20} color={COLORS.primary} strokeWidth={2} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  bookmarkButton: {
    padding: SPACING.xs,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  heroIcon: {
    width: 72,
    height: 72,
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
    marginBottom: SPACING.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    flexWrap: 'wrap',
  },
  heroMetaText: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  heroDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: SPACING.xs,
  },
  heroTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  heroTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  fundingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroTagText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  fundingTagText: {
    color: COLORS.accent,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  detailItem: {
    width: '48%',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  detailValueLink: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  materialsList: {
    gap: SPACING.md,
  },
  materialCard: {
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
  materialIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  materialSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  viewButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  viewerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    zIndex: 1000,
    padding: SPACING.lg,
  },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  viewerTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  viewerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  videoPlayer: {
    width: width - SPACING.xl * 2,
    height: (width - SPACING.xl * 2) * 0.5625,
    backgroundColor: COLORS.navy,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerText: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  viewerSubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  historyList: {
    gap: SPACING.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyAction: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  historyDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  historyDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  historyInvestor: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  actionsSection: {
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  connectButton: {
    marginBottom: 0,
  },
  scheduleButton: {
    marginBottom: 0,
  },
});

