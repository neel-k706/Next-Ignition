import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from './Input';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@/constants/theme';
import { UserRole } from '@/types/user';

interface RoleSpecificFieldsProps {
  role?: UserRole;
  founderValues: {
    ventureName: string;
    ventureDescription: string;
    ventureIndustry: string;
    ventureStage: string;
  };
  investorValues: {
    investmentFocus: string;
    investmentRange: string;
    portfolioSize: string;
  };
  expertValues: {
    yearsExperience: string;
    hourlyRate: string;
    expertiseAreas: string;
  };
  onFounderChange: (field: string, value: string) => void;
  onInvestorChange: (field: string, value: string) => void;
  onExpertChange: (field: string, value: string) => void;
}

export function RoleSpecificFields({
  role,
  founderValues,
  investorValues,
  expertValues,
  onFounderChange,
  onInvestorChange,
  onExpertChange,
}: RoleSpecificFieldsProps) {
  if (!role) return null;

  const isFounderRole = role === 'founder' || role === 'cofounder';

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {isFounderRole ? 'Venture Information' : role === 'investor' ? 'Investment Profile' : 'Expertise'}
      </Text>

      {isFounderRole && (
        <>
          <Input
            label="Venture Name"
            value={founderValues.ventureName}
            onChangeText={(value) => onFounderChange('ventureName', value)}
            placeholder="Your startup name"
          />

          <Input
            label="Venture Description"
            value={founderValues.ventureDescription}
            onChangeText={(value) => onFounderChange('ventureDescription', value)}
            placeholder="What does your venture do?"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <Input
            label="Industry"
            value={founderValues.ventureIndustry}
            onChangeText={(value) => onFounderChange('ventureIndustry', value)}
            placeholder="e.g., SaaS, HealthTech, FinTech"
          />

          <Input
            label="Stage"
            value={founderValues.ventureStage}
            onChangeText={(value) => onFounderChange('ventureStage', value)}
            placeholder="e.g., Idea, MVP, Growth"
          />
        </>
      )}

      {role === 'investor' && (
        <>
          <Input
            label="Investment Focus"
            value={investorValues.investmentFocus}
            onChangeText={(value) => onInvestorChange('investmentFocus', value)}
            placeholder="e.g., SaaS, Biotech, Enterprise"
            multiline
            numberOfLines={2}
            style={styles.textArea}
          />

          <Input
            label="Investment Range"
            value={investorValues.investmentRange}
            onChangeText={(value) => onInvestorChange('investmentRange', value)}
            placeholder="e.g., $100K - $1M"
          />

          <Input
            label="Portfolio Size"
            value={investorValues.portfolioSize}
            onChangeText={(value) => onInvestorChange('portfolioSize', value)}
            placeholder="e.g., 15 companies"
          />
        </>
      )}

      {role === 'expert' && (
        <>
          <Input
            label="Years of Experience"
            value={expertValues.yearsExperience}
            onChangeText={(value) => onExpertChange('yearsExperience', value)}
            placeholder="e.g., 10"
            keyboardType="numeric"
          />

          <Input
            label="Hourly Rate (USD)"
            value={expertValues.hourlyRate}
            onChangeText={(value) => onExpertChange('hourlyRate', value)}
            placeholder="e.g., 150"
            keyboardType="decimal-pad"
          />

          <Input
            label="Expertise Areas"
            value={expertValues.expertiseAreas}
            onChangeText={(value) => onExpertChange('expertiseAreas', value)}
            placeholder="e.g., Product Strategy, Growth Hacking, Design (comma-separated)"
            multiline
            numberOfLines={2}
            style={styles.textArea}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },
});
