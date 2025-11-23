import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/utils/validation';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react-native';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setEmailError('');
    setGeneralError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: 'myapp://reset-password',
        }
      );

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : 'Failed to send reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={GRADIENTS.navy} style={StyleSheet.absoluteFill} />
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Mail size={48} color={COLORS.accent} />
          </View>
          <Text style={styles.successTitle}>Check your inbox</Text>
          <Text style={styles.successText}>
            We&apos;ve sent password reset instructions to {email}. Follow the secure link to set a
            new password.
          </Text>
          <Button
            title="Return to login"
            onPress={() => router.push('/(auth)/login')}
            variant="secondary"
            style={styles.successCta}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.navy} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.background} />
          </TouchableOpacity>

          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Sparkles size={16} color={COLORS.accent} />
              <Text style={styles.heroBadgeText}>Security first</Text>
            </View>
            <Text style={styles.title}>Reset your access</Text>
            <Text style={styles.subtitle}>
              We’ll email you a secure magic link to update your password. The link stays live for 10
              minutes.
            </Text>
            <View style={styles.supportList}>
              <Text style={styles.supportItem}>• Zero-knowledge reset flow</Text>
              <Text style={styles.supportItem}>• Support team on standby</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
                setGeneralError('');
              }}
              error={emailError}
              placeholder="your@email.com"
              autoComplete="email"
            />

            {generalError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            )}

            <Button
              title="Send reset instructions"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.submitButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.footerLink}>Back to login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    ...SHADOWS.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  heroBadgeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.background,
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.background,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 26,
  },
  supportList: {
    marginTop: SPACING.lg,
    gap: SPACING.xs,
  },
  supportItem: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    opacity: 0.9,
  },
  form: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    gap: SPACING.md,
  },
  errorContainer: {
    backgroundColor: `${COLORS.error}15`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  footerLink: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  successIconContainer: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.background,
    textAlign: 'center',
  },
  successText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    textAlign: 'center',
    opacity: 0.85,
  },
  successCta: {
    minWidth: 200,
  },
});
