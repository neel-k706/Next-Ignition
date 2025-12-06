import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { PersonalInfoStep } from '@/components/onboarding/PersonalInfoStep';
import { RoleSpecificStep } from '@/components/onboarding/RoleSpecificStep';
import { SkillsStep } from '@/components/onboarding/SkillsStep';
import { ReviewStep } from '@/components/onboarding/ReviewStep';
import { COLORS, SPACING } from '@/constants/theme';
import { OnboardingData } from '@/types/onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const STEPS = [
  { id: 'personal', label: 'Personal' },
  { id: 'role', label: 'Role Info' },
  { id: 'skills', label: 'Skills' },
  { id: 'review', label: 'Review' },
];

export default function OnboardingScreen() {
  const { profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    location: '',
    bio: '',
    skills: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.full_name || '',
        location: prev.location || profile.location || '',
        bio: prev.bio || profile.bio || '',
        linkedinUrl: prev.linkedinUrl || profile.linkedin_url || '',
        twitterUrl: prev.twitterUrl || profile.twitter_url || '',
        websiteUrl: prev.websiteUrl || profile.website_url || '',
        ventureName: prev.ventureName || profile.venture_name || '',
        ventureDescription: prev.ventureDescription || profile.venture_description || '',
        ventureIndustry: prev.ventureIndustry || profile.venture_industry || '',
        ventureStage: prev.ventureStage || profile.venture_stage || '',
        investmentFocus: prev.investmentFocus || profile.investment_focus || '',
        investmentRange: prev.investmentRange || profile.investment_range || '',
        portfolioSize: prev.portfolioSize || profile.portfolio_size || '',
        expertiseAreas: prev.expertiseAreas || profile.expertise_areas || [],
        yearsExperience: prev.yearsExperience || profile.years_experience || undefined,
        hourlyRate: prev.hourlyRate || profile.hourly_rate || undefined,
        skills: prev.skills && prev.skills.length > 0 ? prev.skills : profile.skills || [],
      }));
    }
  }, [profile]);

  const handleChange = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof OnboardingData, string>> = {};

    if (currentStep === 0) {
      if (!data.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!data.location.trim()) {
        newErrors.location = 'Location is required';
      }
      if (!data.bio.trim()) {
        newErrors.bio = 'Bio is required';
      }
    }

    if (currentStep === 1) {
      if (profile?.role === 'founder' || profile?.role === 'cofounder') {
        if (!data.ventureName?.trim()) {
          newErrors.ventureName = 'Venture name is required';
        }
        if (!data.ventureDescription?.trim()) {
          newErrors.ventureDescription = 'Venture description is required';
        }
      } else if (profile?.role === 'investor' || profile?.role === 'expert') {
        if (!data.investmentFocus?.trim()) {
          newErrors.investmentFocus = 'This field is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      const payload: Record<string, any> = {
        full_name: data.fullName,
        location: data.location,
        bio: data.bio,
        linkedin_url: data.linkedinUrl || null,
        twitter_url: data.twitterUrl || null,
        website_url: data.websiteUrl || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
        skills: data.skills && data.skills.length > 0 ? data.skills : null,
      };

      if (profile?.role === 'founder' || profile?.role === 'cofounder') {
        payload.venture_name = data.ventureName || null;
        payload.venture_description = data.ventureDescription || null;
        payload.venture_industry = data.ventureIndustry || null;
        payload.venture_stage = data.ventureStage || null;
      }

      if (profile?.role === 'investor') {
        payload.investment_focus = data.investmentFocus || null;
        payload.investment_range = data.investmentRange || null;
        payload.portfolio_size = data.portfolioSize || null;
      }

      if (profile?.role === 'expert') {
        payload.expertise_areas = data.expertiseAreas ?? null;
        payload.years_experience = data.yearsExperience ?? null;
        payload.hourly_rate = data.hourlyRate ?? null;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // For founders/cofounders, also create startup_profiles entry
      if (profile?.role === 'founder' || profile?.role === 'cofounder') {
        const startupPayload = {
          owner_id: user.id,
          name: data.ventureName || '',
          description: data.ventureDescription || null,
          industry: data.ventureIndustry || null,
          stage: data.ventureStage || null,
          is_public: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: startupError } = await supabase
          .from('startup_profiles')
          .upsert(startupPayload, { onConflict: 'owner_id' });

        if (startupError) {
          console.error('Error creating startup profile:', startupError);
          // Don't throw - allow onboarding to complete even if startup_profiles fails
        }
      }

      await refreshProfile();
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to complete onboarding. Please try again.';
      setSubmitError(message);
      Alert.alert('Something went wrong', message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            data={data}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <RoleSpecificStep
            role={profile?.role || 'founder'}
            data={data}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return <SkillsStep data={data} onChange={handleChange} />;
      case 3:
        return <ReviewStep data={data} role={profile?.role || 'founder'} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <ProgressIndicator steps={STEPS} currentStep={currentStep} />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {renderStep()}
          </ScrollView>

          <View style={styles.footer}>
            {submitError && <Text style={styles.submitError}>{submitError}</Text>}
            <View style={styles.buttonRow}>
              {currentStep > 0 && (
                <Button
                  title="Back"
                  onPress={handleBack}
                  variant="outline"
                  style={styles.backButton}
                />
              )}
              <Button
                title={currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}
                onPress={currentStep === STEPS.length - 1 ? handleComplete : handleNext}
                loading={loading}
                style={styles.nextButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  footer: {
    gap: SPACING.md,
    paddingTop: SPACING.lg,
  },
  submitError: {
    color: COLORS.error,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
