import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react-native';

const UPCOMING_SESSIONS = [
  {
    id: '1',
    title: 'Funding Discussion',
    type: 'Video Call',
    date: '2024-02-15',
    time: '2:00 PM',
    duration: '1 hour',
    participants: ['Sarah Johnson', 'Michael Chen'],
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Product Review',
    type: 'In-Person',
    date: '2024-02-18',
    time: '10:00 AM',
    duration: '2 hours',
    participants: ['John Smith'],
    location: 'Tech Hub, San Francisco',
    status: 'pending',
  },
];

const PAST_SESSIONS = [
  {
    id: '3',
    title: 'Mentorship Session',
    type: 'Video Call',
    date: '2024-01-20',
    time: '3:00 PM',
    duration: '1 hour',
    participants: ['Sarah Johnson'],
    status: 'completed',
  },
];

export default function SessionsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call':
        return <Video size={20} color={COLORS.primary} strokeWidth={2} />;
      case 'In-Person':
        return <MapPin size={20} color={COLORS.primary} strokeWidth={2} />;
      default:
        return <Calendar size={20} color={COLORS.primary} strokeWidth={2} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Calendar size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Sessions</Text>
              <Text style={styles.heroSubtitle}>Manage your meetings and sessions</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.7}>
            <Clock size={18} color={activeTab === 'upcoming' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
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
            <CheckCircle size={18} color={activeTab === 'past' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.tabTextActive,
              ]}>
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'upcoming' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/schedule-meeting')}
                activeOpacity={0.7}>
                <Text style={styles.newButtonText}>+ Schedule New</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sessionsList}>
              {UPCOMING_SESSIONS.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionIcon}>
                      {getTypeIcon(session.type)}
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionType}>{session.type}</Text>
                    </View>
                    {session.status === 'confirmed' ? (
                      <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
                    ) : (
                      <Clock size={20} color={COLORS.warning} strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.sessionDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.detailText}>
                        {session.date} at {session.time}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.detailText}>{session.duration}</Text>
                    </View>
                    {session.location && (
                      <View style={styles.detailRow}>
                        <MapPin size={16} color={COLORS.textSecondary} strokeWidth={2} />
                        <Text style={styles.detailText}>{session.location}</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Users size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.detailText}>
                        {session.participants.join(', ')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.sessionActions}>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => router.push('/(tabs)/chat')}
                      activeOpacity={0.7}>
                      <MessageSquare size={16} color={COLORS.primary} strokeWidth={2} />
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                    {session.status === 'pending' && (
                      <TouchableOpacity
                        style={styles.rescheduleButton}
                        onPress={() => router.push('/(tabs)/schedule-meeting')}
                        activeOpacity={0.7}>
                        <Calendar size={16} color={COLORS.primary} strokeWidth={2} />
                        <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                      </TouchableOpacity>
                    )}
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
                      {getTypeIcon(session.type)}
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionType}>{session.type}</Text>
                    </View>
                    <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
                  </View>
                  <View style={styles.sessionDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.detailText}>
                        {session.date} at {session.time}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.detailText}>{session.duration}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.detailText}>
                        {session.participants.join(', ')}
                      </Text>
                    </View>
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
  sessionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  sessionType: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  sessionDetails: {
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  sessionActions: {
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
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  rescheduleButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
});

