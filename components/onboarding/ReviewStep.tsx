import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User, Briefcase, Award } from 'lucide-react-native';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, COLORS, BORDER_RADIUS } from '@/constants/theme';
import { OnboardingData } from '@/types/onboarding';
import { UserRole } from '@/types/user';

interface ReviewStepProps {
  data: OnboardingData;
  role: UserRole;
}

export function ReviewStep({ data, role }: ReviewStepProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Review your profile</Text>
      <Text style={styles.subtitle}>
        Make sure everything looks good before completing your onboarding
      </Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        <InfoRow label="Full Name" value={data.fullName} />
        <InfoRow label="Location" value={data.location} />
        <InfoRow label="Bio" value={data.bio} />
        {data.linkedinUrl && <InfoRow label="LinkedIn" value={data.linkedinUrl} />}
        {data.twitterUrl && <InfoRow label="Twitter" value={data.twitterUrl} />}
        {data.websiteUrl && <InfoRow label="Website" value={data.websiteUrl} />}
      </View>

      {(role === 'founder' || role === 'cofounder') && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Venture Information</Text>
          </View>
          {data.ventureName && <InfoRow label="Venture Name" value={data.ventureName} />}
          {data.ventureDescription && <InfoRow label="Description" value={data.ventureDescription} />}
          {data.ventureIndustry && <InfoRow label="Industry" value={data.ventureIndustry} />}
          {data.ventureStage && <InfoRow label="Stage" value={data.ventureStage} />}
        </View>
      )}

      {role === 'investor' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Investment Profile</Text>
          </View>
          {data.investmentFocus && <InfoRow label="Focus Areas" value={data.investmentFocus} />}
          {data.investmentRange && <InfoRow label="Investment Range" value={data.investmentRange} />}
          {data.portfolioSize && <InfoRow label="Portfolio Size" value={data.portfolioSize} />}
        </View>
      )}

      {role === 'expert' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Expertise</Text>
          </View>
          {data.investmentFocus && <InfoRow label="Primary Expertise" value={data.investmentFocus} />}
          {data.yearsExperience && <InfoRow label="Years of Experience" value={data.yearsExperience.toString()} />}
          {data.hourlyRate && <InfoRow label="Hourly Rate" value={`$${data.hourlyRate}`} />}
        </View>
      )}

      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Skills ({data.skills.length})</Text>
          </View>
          {data.skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>{skill.level}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  section: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  infoRow: {
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  skillName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  skillLevel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
});
