import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
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
  UserCheck,
  Flag,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react-native';

export default function AdminDashboard() {
  const { isMobile } = useResponsive();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Overview of platform activity</Text>
        </View>

        <View style={[styles.widgetsGrid, isMobile && styles.widgetsGridMobile]}>
          <AnalyticsWidget
            title="Total Users"
            value={1247}
            change={12.5}
            trend="up"
            icon={Users}
            gradient={GRADIENTS.primary}
          />
          <AnalyticsWidget
            title="Pending Approvals"
            value={23}
            change={-5.2}
            trend="down"
            icon={UserCheck}
            gradient={GRADIENTS.accent}
          />
          <AnalyticsWidget
            title="Active Reports"
            value={8}
            change={0}
            trend="neutral"
            icon={Flag}
            gradient={GRADIENTS.navy}
          />
          <AnalyticsWidget
            title="Revenue"
            value={125000}
            change={18.3}
            trend="up"
            icon={DollarSign}
            gradient={GRADIENTS.primary}
          />
        </View>

        <View style={styles.chartsSection}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>User Growth</Text>
              <Activity size={20} color={COLORS.primary} strokeWidth={2} />
            </View>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Chart visualization</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Revenue Trends</Text>
              <TrendingUp size={20} color={COLORS.primary} strokeWidth={2} />
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
  widgetsGridMobile: {
    flexDirection: 'column',
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

