import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/Input';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, COLORS } from '@/constants/theme';
import { OnboardingData } from '@/types/onboarding';
import { UserRole } from '@/types/user';
import { Picker } from '@/components/Picker';

interface RoleSpecificStepProps {
  role: UserRole;
  data: OnboardingData;
  onChange: (field: keyof OnboardingData, value: string) => void;
  errors: Partial<Record<keyof OnboardingData, string>>;
}

const VENTURE_STAGES = [
  { label: 'Select stage', value: '' },
  { label: 'Idea', value: 'idea' },
  { label: 'MVP', value: 'mvp' },
  { label: 'Growth', value: 'growth' },
  { label: 'Scale', value: 'scale' },
];

const INDUSTRIES = [
  { label: 'Select industry', value: '' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'Other', value: 'other' },
];

export function RoleSpecificStep({ role, data, onChange, errors }: RoleSpecificStepProps) {
  const renderFounderFields = () => (
    <>
      <Input
        label="Venture Name"
        value={data.ventureName || ''}
        onChangeText={(text) => onChange('ventureName', text)}
        error={errors.ventureName}
        placeholder="Your startup name"
      />

      <Input
        label="Venture Description"
        value={data.ventureDescription || ''}
        onChangeText={(text) => onChange('ventureDescription', text)}
        error={errors.ventureDescription}
        placeholder="What problem are you solving?"
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <Picker
        label="Industry"
        selectedValue={data.ventureIndustry || ''}
        onValueChange={(value) => onChange('ventureIndustry', value)}
        items={INDUSTRIES}
      />

      <Picker
        label="Current Stage"
        selectedValue={data.ventureStage || ''}
        onValueChange={(value) => onChange('ventureStage', value)}
        items={VENTURE_STAGES}
      />
    </>
  );

  const renderInvestorFields = () => (
    <>
      <Input
        label="Investment Focus"
        value={data.investmentFocus || ''}
        onChangeText={(text) => onChange('investmentFocus', text)}
        error={errors.investmentFocus}
        placeholder="e.g., SaaS, Healthcare, B2B"
      />

      <Input
        label="Typical Investment Range"
        value={data.investmentRange || ''}
        onChangeText={(text) => onChange('investmentRange', text)}
        placeholder="e.g., $50K - $500K"
      />

      <Input
        label="Portfolio Size"
        value={data.portfolioSize || ''}
        onChangeText={(text) => onChange('portfolioSize', text)}
        placeholder="Number of active investments"
        keyboardType="numeric"
      />
    </>
  );

  const renderExpertFields = () => (
    <>
      <Input
        label="Primary Expertise"
        value={data.investmentFocus || ''}
        onChangeText={(text) => onChange('investmentFocus', text)}
        error={errors.investmentFocus}
        placeholder="e.g., Marketing, Product, Engineering"
      />

      <Input
        label="Years of Experience"
        value={data.yearsExperience?.toString() || ''}
        onChangeText={(text) => onChange('yearsExperience', text)}
        placeholder="10"
        keyboardType="numeric"
      />

      <Input
        label="Hourly Rate (Optional)"
        value={data.hourlyRate?.toString() || ''}
        onChangeText={(text) => onChange('hourlyRate', text)}
        placeholder="$150"
        keyboardType="numeric"
      />
    </>
  );

  const getTitle = () => {
    switch (role) {
      case 'founder':
      case 'cofounder':
        return 'Tell us about your venture';
      case 'investor':
        return 'Your investment profile';
      case 'expert':
        return 'Share your expertise';
      default:
        return 'Additional information';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'founder':
      case 'cofounder':
        return 'Help potential investors and partners understand your startup';
      case 'investor':
        return 'Let founders know what you\'re looking for';
      case 'expert':
        return 'Show how you can help others succeed';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>
      <Text style={styles.subtitle}>{getSubtitle()}</Text>

      {(role === 'founder' || role === 'cofounder') && renderFounderFields()}
      {role === 'investor' && renderInvestorFields()}
      {role === 'expert' && renderExpertFields()}
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
});
