import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    location: '',
    bio: '',
    skills: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingData, string>>>({});

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

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          location: data.location,
          bio: data.bio,
          linkedin_url: data.linkedinUrl || null,
          twitter_url: data.twitterUrl || null,
          website_url: data.websiteUrl || null,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error completing onboarding:', err);
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
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.lg,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
