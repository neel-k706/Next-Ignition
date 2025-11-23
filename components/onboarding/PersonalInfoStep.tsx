import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/Input';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, COLORS } from '@/constants/theme';
import { OnboardingData } from '@/types/onboarding';

interface PersonalInfoStepProps {
  data: OnboardingData;
  onChange: (field: keyof OnboardingData, value: string) => void;
  errors: Partial<Record<keyof OnboardingData, string>>;
}

export function PersonalInfoStep({ data, onChange, errors }: PersonalInfoStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>
        Help others connect with you by sharing your basic information
      </Text>

      <Input
        label="Full Name"
        value={data.fullName}
        onChangeText={(text) => onChange('fullName', text)}
        error={errors.fullName}
        placeholder="John Doe"
        autoComplete="name"
      />

      <Input
        label="Location"
        value={data.location}
        onChangeText={(text) => onChange('location', text)}
        error={errors.location}
        placeholder="San Francisco, CA"
      />

      <Input
        label="Bio"
        value={data.bio}
        onChangeText={(text) => onChange('bio', text)}
        error={errors.bio}
        placeholder="Tell us about your journey..."
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <Text style={styles.sectionTitle}>Social Links (Optional)</Text>

      <Input
        label="LinkedIn"
        value={data.linkedinUrl || ''}
        onChangeText={(text) => onChange('linkedinUrl', text)}
        placeholder="https://linkedin.com/in/yourprofile"
        autoCapitalize="none"
      />

      <Input
        label="Twitter"
        value={data.twitterUrl || ''}
        onChangeText={(text) => onChange('twitterUrl', text)}
        placeholder="https://twitter.com/yourhandle"
        autoCapitalize="none"
      />

      <Input
        label="Website"
        value={data.websiteUrl || ''}
        onChangeText={(text) => onChange('websiteUrl', text)}
        placeholder="https://yourwebsite.com"
        autoCapitalize="none"
      />
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
});
