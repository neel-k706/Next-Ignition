import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
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
  Video,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Send,
  Trash2,
  Archive,
  Edit,
  Play,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useResponsive } from '@/hooks/useResponsive';
import { AnimatedCard } from '@/components/admin/AnimatedCard';

const PENDING_WEBINARS = [
  {
    id: '1',
    title: 'Scaling Your SaaS Startup',
    host: 'Sarah Johnson',
    date: '2024-02-15',
    time: '2:00 PM',
    type: 'free',
    attendees: 0,
    status: 'pending',
  },
  {
    id: '2',
    title: 'Fundraising Strategies',
    host: 'Michael Chen',
    date: '2024-02-20',
    time: '3:00 PM',
    type: 'paid',
    price: '$49',
    attendees: 0,
    status: 'pending',
  },
];

const APPROVED_WEBINARS = [
  {
    id: '3',
    title: 'Product-Market Fit Essentials',
    host: 'Emily Davis',
    date: '2024-02-10',
    time: '1:00 PM',
    type: 'free',
    attendees: 45,
    status: 'approved',
  },
];

const RECORDINGS = [
  {
    id: '1',
    title: 'Growth Hacking Workshop',
    host: 'John Smith',
    recordedAt: '2024-01-15',
    duration: '55 min',
    views: 234,
    size: '450 MB',
  },
  {
    id: '2',
    title: 'Team Building Masterclass',
    host: 'Lisa Anderson',
    recordedAt: '2024-01-10',
    duration: '60 min',
    views: 189,
    size: '520 MB',
  },
];

export default function WebinarManagementScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'recordings'>('pending');
  const [webinars, setWebinars] = useState(PENDING_WEBINARS);
  const [refreshing, setRefreshing] = useState(false);
  const { isMobile } = useResponsive();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleApprove = (id: string) => {
    setWebinars(webinars.filter((w) => w.id !== id));
    alert('Webinar approved and scheduled!');
  };

  const handleReject = (id: string) => {
    setWebinars(webinars.filter((w) => w.id !== id));
    alert('Webinar rejected.');
  };

  const handleDelete = (id: string) => {
    alert('Recording deleted.');
  };

  const handleArchive = (id: string) => {
    alert('Recording archived.');
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
              <Video size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Webinar & Event Management</Text>
              <Text style={styles.heroSubtitle}>
                Manage webinars, recordings, and events
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
            activeOpacity={0.7}>
            <Clock size={18} color={activeTab === 'pending' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.tabTextActive,
              ]}>
              Pending
            </Text>
            {webinars.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{webinars.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'approved' && styles.tabActive]}
            onPress={() => setActiveTab('approved')}
            activeOpacity={0.7}>
            <CheckCircle size={18} color={activeTab === 'approved' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'approved' && styles.tabTextActive,
              ]}>
              Approved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recordings' && styles.tabActive]}
            onPress={() => setActiveTab('recordings')}
            activeOpacity={0.7}>
            <Play size={18} color={activeTab === 'recordings' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'recordings' && styles.tabTextActive,
              ]}>
              Recordings
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'pending' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Webinar Approvals</Text>
            <View style={styles.webinarsList}>
              {webinars.map((webinar, index) => (
                <AnimatedCard key={webinar.id} delay={index * 50}>
                  <View style={styles.webinarCard}>
                    <View style={styles.webinarHeader}>
                      <View style={styles.webinarIcon}>
                        <Video size={24} color={COLORS.primary} strokeWidth={2} />
                      </View>
                      <View style={styles.webinarInfo}>
                        <Text style={styles.webinarTitle}>{webinar.title}</Text>
                        <Text style={styles.webinarHost}>Host: {webinar.host}</Text>
                        <View style={styles.webinarDetails}>
                          <Calendar size={14} color={COLORS.textSecondary} strokeWidth={2} />
                          <Text style={styles.webinarDetailText}>
                            {webinar.date} at {webinar.time}
                          </Text>
                          <View style={styles.webinarType}>
                            <Text style={styles.webinarTypeText}>
                              {webinar.type === 'free' ? 'Free' : `Paid - ${webinar.price}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.webinarActions}>
                      <Button
                        title="Approve"
                        onPress={() => handleApprove(webinar.id)}
                        variant="primary"
                        style={styles.approveButton}
                      />
                      <Button
                        title="Reject"
                        onPress={() => handleReject(webinar.id)}
                        variant="outline"
                        style={styles.rejectButton}
                      />
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => alert('Edit webinar')}
                        activeOpacity={0.7}>
                        <Edit size={18} color={COLORS.primary} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'approved' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Approved Webinars</Text>
              <TouchableOpacity
                style={styles.notifyButton}
                onPress={() => alert('Send mass notifications')}
                activeOpacity={0.7}>
                <Send size={18} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.notifyButtonText}>Send Notifications</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.webinarsList}>
              {APPROVED_WEBINARS.map((webinar, index) => (
                <AnimatedCard key={webinar.id} delay={index * 50}>
                  <View style={styles.webinarCard}>
                    <View style={styles.webinarHeader}>
                      <View style={styles.webinarIcon}>
                        <Video size={24} color={COLORS.success} strokeWidth={2} />
                      </View>
                      <View style={styles.webinarInfo}>
                        <Text style={styles.webinarTitle}>{webinar.title}</Text>
                        <Text style={styles.webinarHost}>Host: {webinar.host}</Text>
                        <View style={styles.webinarDetails}>
                          <Calendar size={14} color={COLORS.textSecondary} strokeWidth={2} />
                          <Text style={styles.webinarDetailText}>
                            {webinar.date} at {webinar.time}
                          </Text>
                          <View style={styles.attendeesBadge}>
                            <Users size={14} color={COLORS.primary} strokeWidth={2} />
                            <Text style={styles.attendeesText}>{webinar.attendees} registered</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.approvedBadge}>
                        <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
                        <Text style={styles.approvedText}>Approved</Text>
                      </View>
                    </View>
                    <View style={styles.webinarActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => alert('Modify webinar')}
                        activeOpacity={0.7}>
                        <Edit size={18} color={COLORS.primary} strokeWidth={2} />
                        <Text style={styles.actionButtonText}>Modify</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => alert('Cancel webinar')}
                        activeOpacity={0.7}>
                        <XCircle size={18} color={COLORS.error} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'recordings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Recordings Library</Text>
            <View style={styles.recordingsList}>
              {RECORDINGS.map((recording, index) => (
                <AnimatedCard key={recording.id} delay={index * 50}>
                  <View style={styles.recordingCard}>
                    <View style={styles.recordingHeader}>
                      <View style={styles.recordingIcon}>
                        <Play size={24} color={COLORS.primary} strokeWidth={2} />
                      </View>
                      <View style={styles.recordingInfo}>
                        <Text style={styles.recordingTitle}>{recording.title}</Text>
                        <Text style={styles.recordingHost}>Host: {recording.host}</Text>
                        <View style={styles.recordingMeta}>
                          <Text style={styles.recordingMetaText}>
                            {recording.recordedAt} • {recording.duration} • {recording.size}
                          </Text>
                          <View style={styles.viewsBadge}>
                            <Users size={14} color={COLORS.textSecondary} strokeWidth={2} />
                            <Text style={styles.viewsText}>{recording.views} views</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.recordingActions}>
                      <TouchableOpacity
                        style={styles.recordingActionButton}
                        onPress={() => handleArchive(recording.id)}
                        activeOpacity={0.7}>
                        <Archive size={18} color={COLORS.warning} strokeWidth={2} />
                        <Text style={styles.recordingActionText}>Archive</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.recordingActionButton, styles.deleteButton]}
                        onPress={() => handleDelete(recording.id)}
                        activeOpacity={0.7}>
                        <Trash2 size={18} color={COLORS.error} strokeWidth={2} />
                        <Text style={[styles.recordingActionText, styles.deleteText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
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
  webinarsList: {
    gap: SPACING.md,
  },
  webinarCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  webinarHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  webinarIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webinarInfo: {
    flex: 1,
  },
  webinarTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  webinarHost: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  webinarDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  webinarDetailText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  webinarType: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
  },
  webinarTypeText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  attendeesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
  },
  attendeesText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success + '20',
  },
  approvedText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  webinarActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
  },
  editButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  notifyButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
  },
  actionButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  cancelText: {
    color: COLORS.error,
  },
  recordingsList: {
    gap: SPACING.md,
  },
  recordingCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  recordingIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  recordingHost: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  recordingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  recordingMetaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  viewsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
  },
  viewsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  recordingActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
  },
  recordingActionText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  deleteText: {
    color: COLORS.error,
  },
});

