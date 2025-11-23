import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AnalyticsWidget } from '@/components/admin/AnalyticsWidget';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  DollarSign,
  Activity,
  MessageSquare,
  Flag,
} from 'lucide-react-native';

export default function AdminAnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Platform insights and metrics</Text>
        </View>

        <View style={styles.widgetsGrid}>
          <AnalyticsWidget
            title="Total Users"
            value={1247}
            change={12.5}
            trend="up"
            icon={Users}
            gradient={GRADIENTS.primary}
          />
          <AnalyticsWidget
            title="New Users"
            value={89}
            change={8.2}
            trend="up"
            icon={UserPlus}
            gradient={GRADIENTS.accent}
          />
          <AnalyticsWidget
            title="Active Users"
            value={856}
            change={5.1}
            trend="up"
            icon={Activity}
            gradient={GRADIENTS.primary}
          />
          <AnalyticsWidget
            title="Churn Rate"
            value={2.3}
            change={-1.2}
            trend="down"
            icon={UserMinus}
            gradient={GRADIENTS.navy}
          />
        </View>

        <View style={styles.widgetsGrid}>
          <AnalyticsWidget
            title="Revenue"
            value={125000}
            change={18.3}
            trend="up"
            icon={DollarSign}
            gradient={GRADIENTS.accent}
          />
          <AnalyticsWidget
            title="Messages"
            value={3456}
            change={22.1}
            trend="up"
            icon={MessageSquare}
            gradient={GRADIENTS.primary}
          />
          <AnalyticsWidget
            title="Reports"
            value={23}
            change={-5.2}
            trend="down"
            icon={Flag}
            gradient={GRADIENTS.navy}
          />
          <AnalyticsWidget
            title="Growth"
            value={15.8}
            change={3.4}
            trend="up"
            icon={TrendingUp}
            gradient={GRADIENTS.accent}
          />
        </View>

        <View style={styles.chartsSection}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>User Growth Trend</Text>
              <TrendingUp size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Chart visualization</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Revenue Analytics</Text>
              <DollarSign size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Chart visualization</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Engagement Metrics</Text>
              <Activity size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Chart visualization</Text>
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
  header: {
    gap: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.text,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  chartsSection: {
    gap: SPACING.lg,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    gap: SPACING.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});

