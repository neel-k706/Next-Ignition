import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  FONT_FAMILY,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
} from '@/constants/theme';
import { X, ChevronRight, ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // Element to highlight
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NextIgnition!',
    description: 'Let\'s take a quick tour to help you get started.',
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'This is your main hub. Access all features from here.',
    target: 'dashboard',
  },
  {
    id: 'network',
    title: 'Build Your Network',
    description: 'Connect with founders, investors, and experts in your industry.',
    target: 'network',
  },
  {
    id: 'chat',
    title: 'Stay Connected',
    description: 'Message your connections and join group discussions.',
    target: 'chat',
  },
];

const ONBOARDING_STORAGE_KEY = '@nextignition_onboarding_completed';

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!completed) {
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setVisible(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setVisible(false);
    }
  };

  if (!visible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}>
      <View style={styles.overlay}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.tooltip}>
          <View style={styles.tooltipHeader}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleSkip}
              activeOpacity={0.7}
              accessibilityLabel="Skip onboarding">
              <X size={20} color={COLORS.background} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipTitle}>{step.title}</Text>
            <Text style={styles.tooltipDescription}>{step.description}</Text>
          </View>

          <View style={styles.tooltipFooter}>
            <View style={styles.stepIndicators}>
              {ONBOARDING_STEPS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index === currentStep && styles.stepDotActive,
                  ]}
                />
              ))}
            </View>
            <View style={styles.tooltipActions}>
              {currentStep > 0 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handlePrevious}
                  activeOpacity={0.7}
                  accessibilityLabel="Previous step">
                  <ChevronLeft size={20} color={COLORS.background} strokeWidth={2} />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.7}
                accessibilityLabel={currentStep === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Next step'}>
                <Text style={styles.nextButtonText}>
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                {currentStep < ONBOARDING_STEPS.length - 1 && (
                  <ChevronRight size={20} color={COLORS.background} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  tooltip: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
    gap: SPACING.lg,
  },
  tooltipHeader: {
    gap: SPACING.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.full,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: SPACING.xs,
  },
  tooltipContent: {
    gap: SPACING.sm,
  },
  tooltipTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.background,
  },
  tooltipDescription: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  tooltipFooter: {
    gap: SPACING.md,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: {
    backgroundColor: COLORS.accent,
    width: 24,
  },
  tooltipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accent,
  },
  nextButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
});

