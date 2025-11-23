import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmptyState } from '@/components/EmptyState';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '@/constants/theme';
import { BriefcaseBusiness, BarChart3, Target, Building2 } from 'lucide-react-native';

const FEATURES = [
  {
    icon: BriefcaseBusiness,
    title: 'Partnerships',
    description: 'Strategic alliances and joint ventures',
  },
  {
    icon: BarChart3,
    title: 'Investments',
    description: 'Equity and debt financing opportunities',
  },
  {
    icon: Target,
    title: 'Acquisitions',
    description: 'M&A opportunities and exits',
  },
];

export default function OpportunitiesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.accent} style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Building2 size={28} color={COLORS.background} strokeWidth={2.5} />
          </View>
          <Text style={styles.heroTitle}>Investment Opportunities</Text>
          <Text style={styles.heroSubtitle}>
            Discover funding opportunities, partnerships, and collaborations for your venture
          </Text>
        </LinearGradient>

        <View style={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <feature.icon size={24} color={COLORS.primary} strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <EmptyState
          icon={BriefcaseBusiness}
          title="Explore Opportunities"
          message="Browse curated investment opportunities, partnerships, and strategic collaborations tailored to your venture stage and industry."
          actionLabel="Browse Opportunities"
          onAction={() => console.log('Browse opportunities')}
        />
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
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 28,
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  featureCard: {
    flex: 1,
    minWidth: 160,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  featureDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
