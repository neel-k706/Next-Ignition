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
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react-native';

const FUNDING_REQUESTS = [
  {
    id: '1',
    status: 'pending',
    submittedAt: '2024-01-20',
    investorsViewed: 12,
    connections: 5,
    messages: 3,
  },
  {
    id: '2',
    status: 'approved',
    submittedAt: '2024-01-15',
    investorsViewed: 24,
    connections: 12,
    messages: 8,
  },
];

const INTERESTED_INVESTORS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    firm: 'Tech Ventures',
    status: 'interested',
    lastContact: '2 hours ago',
    messages: 3,
  },
  {
    id: '2',
    name: 'Michael Chen',
    firm: 'Growth Capital',
    status: 'reviewing',
    lastContact: '1 day ago',
    messages: 1,
  },
];

export default function FundingStatusScreen() {
  const [activeTab, setActiveTab] = useState<'status' | 'investors' | 'analytics'>('status');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} color={COLORS.success} strokeWidth={2} />;
      case 'pending':
        return <Clock size={18} color={COLORS.warning} strokeWidth={2} />;
      case 'rejected':
        return <XCircle size={18} color={COLORS.error} strokeWidth={2} />;
      default:
        return null;
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
              <TrendingUp size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Funding Status</Text>
              <Text style={styles.heroSubtitle}>Track your funding journey</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'status' && styles.tabActive]}
            onPress={() => setActiveTab('status')}
            activeOpacity={0.7}>
            <Clock size={18} color={activeTab === 'status' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'status' && styles.tabTextActive,
              ]}>
              Status
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'investors' && styles.tabActive]}
            onPress={() => setActiveTab('investors')}
            activeOpacity={0.7}>
            <Users size={18} color={activeTab === 'investors' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'investors' && styles.tabTextActive,
              ]}>
              Investors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'analytics' && styles.tabActive]}
            onPress={() => setActiveTab('analytics')}
            activeOpacity={0.7}>
            <BarChart3 size={18} color={activeTab === 'analytics' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'analytics' && styles.tabTextActive,
              ]}>
              Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'status' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding Requests</Text>
            <View style={styles.requestsList}>
              {FUNDING_REQUESTS.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View style={styles.requestStatus}>
                      {getStatusIcon(request.status)}
                      <Text
                        style={[
                          styles.requestStatusText,
                          { color: getStatusColor(request.status) },
                        ]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.requestDate}>Submitted {request.submittedAt}</Text>
                  </View>
                  <View style={styles.requestStats}>
                    <View style={styles.statItem}>
                      <Eye size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.statValue}>{request.investorsViewed}</Text>
                      <Text style={styles.statLabel}>Views</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Users size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.statValue}>{request.connections}</Text>
                      <Text style={styles.statLabel}>Connections</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageSquare size={16} color={COLORS.textSecondary} strokeWidth={2} />
                      <Text style={styles.statValue}>{request.messages}</Text>
                      <Text style={styles.statLabel}>Messages</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'investors' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interested Investors</Text>
            <View style={styles.investorsList}>
              {INTERESTED_INVESTORS.map((investor) => (
                <TouchableOpacity
                  key={investor.id}
                  style={styles.investorCard}
                  onPress={() => router.push(`/(tabs)/chat?investor=${investor.id}`)}
                  activeOpacity={0.7}>
                  <View style={styles.investorHeader}>
                    <View style={styles.investorIcon}>
                      <Users size={20} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.investorInfo}>
                      <Text style={styles.investorName}>{investor.name}</Text>
                      <Text style={styles.investorFirm}>{investor.firm}</Text>
                    </View>
                    <View
                      style={[
                        styles.investorStatusBadge,
                        investor.status === 'interested' && styles.investorStatusInterested,
                      ]}>
                      <Text
                        style={[
                          styles.investorStatusText,
                          investor.status === 'interested' && styles.investorStatusTextInterested,
                        ]}>
                        {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.investorFooter}>
                    <Text style={styles.investorLastContact}>Last contact: {investor.lastContact}</Text>
                    <View style={styles.investorActions}>
                      <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => router.push(`/(tabs)/chat?investor=${investor.id}`)}>
                        <MessageSquare size={16} color={COLORS.primary} strokeWidth={2} />
                        <Text style={styles.messageButtonText}>{investor.messages}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.scheduleButton}
                        onPress={() => router.push('/(tabs)/schedule-meeting')}>
                        <Calendar size={16} color={COLORS.primary} strokeWidth={2} />
                        <Text style={styles.scheduleButtonText}>Schedule</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'analytics' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding Analytics</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsCard}>
                <Eye size={24} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.analyticsValue}>36</Text>
                <Text style={styles.analyticsLabel}>Total Views</Text>
                <Text style={styles.analyticsChange}>+12% this week</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Users size={24} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.analyticsValue}>17</Text>
                <Text style={styles.analyticsLabel}>Connections</Text>
                <Text style={styles.analyticsChange}>+5 this week</Text>
              </View>
              <View style={styles.analyticsCard}>
                <MessageSquare size={24} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.analyticsValue}>11</Text>
                <Text style={styles.analyticsLabel}>Messages</Text>
                <Text style={styles.analyticsChange}>+3 this week</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Calendar size={24} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.analyticsValue}>4</Text>
                <Text style={styles.analyticsLabel}>Meetings</Text>
                <Text style={styles.analyticsChange}>2 scheduled</Text>
              </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  requestStatusText: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  requestDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  requestStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  statValue: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  investorsList: {
    gap: SPACING.md,
  },
  investorCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  investorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  investorIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  investorInfo: {
    flex: 1,
  },
  investorName: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  investorFirm: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  investorStatusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.border,
  },
  investorStatusInterested: {
    backgroundColor: COLORS.success + '20',
  },
  investorStatusText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  investorStatusTextInterested: {
    color: COLORS.success,
  },
  investorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  investorLastContact: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  investorActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  messageButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  scheduleButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  analyticsCard: {
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
  analyticsValue: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
  },
  analyticsLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  analyticsChange: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
});

