import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmptyState } from '@/components/EmptyState';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { UserPlus, Handshake, Globe2, Network } from 'lucide-react-native';

const INSIGHTS = [
  { label: 'Warm intros ready', value: '24' },
  { label: 'Investors online', value: '18' },
  { label: 'Expert AMAs', value: '3' },
];

const PILLARS = [
  {
    icon: UserPlus,
    title: 'Founder circles',
    copy: 'Curated peer groups by stage and sector.',
  },
  {
    icon: Handshake,
    title: 'Investor office hours',
    copy: 'Weekly sessions with partner-level VCs.',
  },
  {
    icon: Globe2,
    title: 'Global operators',
    copy: 'Mentors across product, GTM, and finance.',
  },
];

export default function NetworkScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>Private beta</Text>
            <Text style={styles.heroTitle}>Build meaningful relationships faster</Text>
            <Text style={styles.heroSubtitle}>
              Get signal-checked intros, tactical mentorship, and discovery moments with active
              investors.
            </Text>
          </View>
          <View style={styles.insightsRow}>
            {INSIGHTS.map((insight) => (
              <View key={insight.label} style={styles.insightCard}>
                <Text style={styles.insightValue}>{insight.value}</Text>
                <Text style={styles.insightLabel}>{insight.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.pillarGrid}>
          {PILLARS.map((pillar) => (
            <View key={pillar.title} style={styles.pillarCard}>
              <View style={styles.pillarIcon}>
                <pillar.icon size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.pillarTitle}>{pillar.title}</Text>
              <Text style={styles.pillarCopy}>{pillar.copy}</Text>
            </View>
          ))}
        </View>

        <EmptyState
          icon={Network}
          title="Curate your network"
          message="Complete onboarding to unlock curated intros, signal boosts, and warm connections tailored to your role."
          actionLabel="Explore Network"
          onAction={() => console.log('Explore network')}
        />

        <TouchableOpacity style={styles.ctaCard} activeOpacity={0.85}>
          <Text style={styles.ctaTitle}>Request a concierge intro</Text>
          <Text style={styles.ctaCopy}>
            Share who you&apos;re trying to meet and our team will broker the connection.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
  },
  heroText: {
    gap: SPACING.sm,
  },
  heroEyebrow: {
    ...TYPOGRAPHY.label,
    color: COLORS.background,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 32,
    color: COLORS.background,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  insightsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  insightCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  insightValue: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: 28,
    color: COLORS.background,
  },
  insightLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.75)',
    marginTop: SPACING.xs / 2,
  },
  pillarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  pillarCard: {
    flex: 1,
    minWidth: 160,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  pillarIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: 18,
    color: COLORS.text,
  },
  pillarCopy: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  ctaCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    ...SHADOWS.md,
    gap: SPACING.xs,
  },
  ctaTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: 22,
    color: COLORS.background,
  },
  ctaCopy: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.8)',
  },
});
