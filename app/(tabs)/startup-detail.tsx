import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
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
  Video as VideoIcon,
  MessageSquare,
  Eye,
  Calendar,
  UserRound,
  ArrowLeft,
  Play,
  ExternalLink,
  Linkedin,
  Twitter,
  Globe,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useStartupDetail } from '@/hooks/useStartupDetail';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

export default function StartupDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const startupId = params.id;
  
  const { startup, pitchDecks, pitchVideos, loading, error, refresh } = useStartupDetail(startupId);
  const [bookmarked, setBookmarked] = useState(false);
  const [viewingDeck, setViewingDeck] = useState(false);
  const [viewingVideo, setViewingVideo] = useState(false);
  const [selectedDeckUrl, setSelectedDeckUrl] = useState<string | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    const message = bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks';
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      alert(message);
    }
  };

  const handleOpenLink = (url: string | null) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(fullUrl).catch(err => console.error('Failed to open URL:', err));
  };

  const handleViewDeck = (url: string) => {
    // For Supabase Storage URLs that might have bucket issues, open directly in browser
    // This allows the user to see the actual error or download the file
    if (url.includes('supabase.co/storage')) {
      // Open directly in browser - better than showing in modal
      handleOpenLink(url);
      return;
    }
    
    // For other URLs, show in modal
    setSelectedDeckUrl(url);
    setViewingDeck(true);
  };

  const handleViewVideo = (url: string) => {
    // For Supabase Storage URLs that might have bucket issues, open directly in browser
    if (url.includes('supabase.co/storage')) {
      handleOpenLink(url);
      return;
    }
    
    // For other URLs, show in video player
    setSelectedVideoUrl(url);
    setViewingVideo(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading startup details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !startup) {
    const isNoProfileError = error?.includes('No startup profile found');
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <ArrowLeft size={24} color={COLORS.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ErrorState
          title={isNoProfileError ? "No Startup Profile Yet" : "Startup Not Found"}
          message={error || "The startup you're looking for doesn't exist or you don't have permission to view it."}
          onRetry={startupId ? refresh : undefined}
        />
        {isNoProfileError && (
          <View style={styles.createProfileCTA}>
            <Button
              title="Create Startup Profile"
              onPress={() => router.push('/(tabs)/startup-profile')}
              variant="primary"
            />
          </View>
        )}
      </SafeAreaView>
    );
  }

  const hasPitchDeck = pitchDecks.length > 0 || !!startup.pitch_deck_url;
  const hasPitchVideo = pitchVideos.length > 0 || !!startup.pitch_video_url;
  const foundedYear = startup.created_at ? new Date(startup.created_at).getFullYear().toString() : 'N/A';

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
              <Text style={styles.heroTitle}>{startup.name}</Text>
              <View style={styles.heroMeta}>
                {startup.founder_name && (
                  <>
                    <UserRound size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                    <Text style={styles.heroMetaText}>by {startup.founder_name}</Text>
                  </>
                )}
                {startup.location && startup.founder_name && <View style={styles.heroDivider} />}
                {startup.location && (
                  <>
                    <MapPin size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                    <Text style={styles.heroMetaText}>{startup.location}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <View style={styles.heroTags}>
            {startup.stage && (
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{startup.stage}</Text>
              </View>
            )}
            {startup.industry && (
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{startup.industry}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {startup.description ? (
            <Text style={styles.description}>{startup.description}</Text>
          ) : (
            <Text style={[styles.description, { color: COLORS.textSecondary }]}>
              No description available
            </Text>
          )}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Founded</Text>
              <Text style={styles.detailValue}>{foundedYear}</Text>
            </View>
            {startup.website && (
              <TouchableOpacity 
                style={styles.detailItem}
                onPress={() => handleOpenLink(startup.website)}
                activeOpacity={0.7}>
                <Text style={styles.detailLabel}>Website</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.detailValueLink} numberOfLines={1}>
                    {startup.website.replace(/^https?:\/\//, '')}
                  </Text>
                  <ExternalLink size={14} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Social Links */}
          {(startup.linkedin_url || startup.twitter_url) && (
            <View style={styles.socialLinks}>
              {startup.linkedin_url && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(startup.linkedin_url)}
                  activeOpacity={0.7}>
                  <Linkedin size={20} color={COLORS.primary} />
                  <Text style={styles.socialButtonText}>LinkedIn</Text>
                </TouchableOpacity>
              )}
              {startup.twitter_url && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(startup.twitter_url)}
                  activeOpacity={0.7}>
                  <Twitter size={20} color={COLORS.primary} />
                  <Text style={styles.socialButtonText}>Twitter</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Pitch Materials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pitch Materials</Text>
          {!hasPitchDeck && !hasPitchVideo ? (
            <View style={styles.emptyMaterials}>
              <FileText size={48} color={COLORS.textSecondary} strokeWidth={1.5} />
              <Text style={styles.emptyText}>No pitch materials uploaded yet</Text>
            </View>
          ) : (
            <View style={styles.materialsList}>
              {/* Pitch Decks from pitch_materials table */}
              {pitchDecks.map((deck) => (
                <TouchableOpacity
                  key={deck.id}
                  style={styles.materialCard}
                  onPress={() => deck.url && handleViewDeck(deck.url)}
                  activeOpacity={0.7}>
                  <View style={styles.materialIcon}>
                    <FileText size={24} color={COLORS.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialTitle}>{deck.filename || 'Pitch Deck'}</Text>
                    <Text style={styles.materialSubtitle}>
                      {formatDate(deck.created_at)}
                      {deck.pages && ` • ${deck.pages} pages`}
                    </Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Pitch Deck from startup_profiles direct URL (if exists and not in pitch_materials) */}
              {startup.pitch_deck_url && pitchDecks.length === 0 && (
                <TouchableOpacity
                  style={styles.materialCard}
                  onPress={() => handleViewDeck(startup.pitch_deck_url!)}
                  activeOpacity={0.7}>
                  <View style={styles.materialIcon}>
                    <FileText size={24} color={COLORS.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialTitle}>Pitch Deck</Text>
                    <Text style={styles.materialSubtitle}>
                      {startup.pitch_deck_uploaded_at 
                        ? formatDate(startup.pitch_deck_uploaded_at) 
                        : 'Uploaded'}
                    </Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Pitch Videos from pitch_materials table */}
              {pitchVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.materialCard}
                  onPress={() => video.url && handleViewVideo(video.url)}
                  activeOpacity={0.7}>
                  <View style={styles.materialIcon}>
                    <VideoIcon size={24} color={COLORS.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialTitle}>{video.filename || 'Pitch Video'}</Text>
                    <Text style={styles.materialSubtitle}>
                      {formatDate(video.created_at)}
                      {video.duration_seconds && ` • ${Math.floor(video.duration_seconds / 60)}:${(video.duration_seconds % 60).toString().padStart(2, '0')}`}
                    </Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Play size={18} color={COLORS.primary} strokeWidth={2} />
                    <Text style={styles.viewButtonText}>Play</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Pitch Video from startup_profiles direct URL (if exists and not in pitch_materials) */}
              {startup.pitch_video_url && pitchVideos.length === 0 && (
                <TouchableOpacity
                  style={styles.materialCard}
                  onPress={() => handleViewVideo(startup.pitch_video_url!)}
                  activeOpacity={0.7}>
                  <View style={styles.materialIcon}>
                    <VideoIcon size={24} color={COLORS.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialTitle}>Pitch Video</Text>
                    <Text style={styles.materialSubtitle}>
                      {startup.pitch_video_uploaded_at 
                        ? formatDate(startup.pitch_video_uploaded_at) 
                        : 'Uploaded'}
                    </Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Play size={18} color={COLORS.primary} strokeWidth={2} />
                    <Text style={styles.viewButtonText}>Play</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Pitch Deck Viewer Modal */}
        {viewingDeck && selectedDeckUrl && (
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
              <Text style={styles.viewerText}>Pitch Deck</Text>
              <Text style={styles.viewerSubtext}>
                Click below to view or download the pitch deck
              </Text>
              <Button
                title="Open Pitch Deck"
                onPress={() => {
                  handleOpenLink(selectedDeckUrl);
                  setViewingDeck(false);
                }}
                variant="primary"
              />
              <Text style={[styles.viewerSubtext, { marginTop: SPACING.md, fontSize: FONT_SIZES.xs }]}>
                {selectedDeckUrl}
              </Text>
            </View>
          </View>
        )}

        {/* Pitch Video Viewer Modal */}
        {viewingVideo && selectedVideoUrl && (
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
            <View style={styles.videoPlayerContainer}>
              <Video
                source={{ uri: selectedVideoUrl }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Connect with Founder"
            onPress={() => router.push(`/(tabs)/chat?userId=${startup.owner_id}`)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  createProfileCTA: {
    padding: SPACING.xl,
    alignItems: 'center',
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
    minWidth: '48%',
    flex: 1,
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
  socialLinks: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  socialButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  emptyMaterials: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
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
  videoPlayerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
  },
  videoPlayer: {
    width: Platform.OS === 'web' ? '100%' : width - SPACING.xl * 2,
    height: Platform.OS === 'web' ? '100%' : (width - SPACING.xl * 2) * 0.5625,
    maxHeight: Platform.OS === 'web' ? '100%' : undefined,
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

