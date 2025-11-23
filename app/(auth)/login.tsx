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
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
  GRADIENTS,
} from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, ShieldCheck, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react-native';
import { Logo } from '@/components/Logo';

const HERO_STATS = [
  { label: 'Active investors', value: '70+' },
  { label: 'Global founders', value: '12k' },
  { label: 'Capital raised', value: '$180M' },
];

// Test credentials for all user roles
const TEST_CREDENTIALS = [
  {
    role: 'Founder',
    email: 'founder@nextignition.com',
    password: 'Founder123!',
    description: 'Startup founder with Pro subscription',
  },
  {
    role: 'Co-founder',
    email: 'cofounder@nextignition.com',
    password: 'CoFounder123!',
    description: 'Co-founder with Elite subscription',
  },
  {
    role: 'Investor',
    email: 'investor@nextignition.com',
    password: 'Investor123!',
    description: 'Angel investor with Elite subscription',
  },
  {
    role: 'Expert',
    email: 'expert@nextignition.com',
    password: 'Expert123!',
    description: 'Business advisor with Pro subscription',
  },
  {
    role: 'Admin',
    email: 'admin@nextignition.com',
    password: 'Admin123!',
    description: 'Platform administrator',
  },
];

// Test mode - bypasses Supabase
const TEST_MODE = true;

export default function LoginScreen() {
  const { testLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(true); // Show by default
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTestCredential = (credential: typeof TEST_CREDENTIALS[0]) => {
    setEmail(credential.email);
    setPassword(credential.password);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    // In test mode, auto-login immediately
    if (TEST_MODE && testLogin) {
      const role = credential.role.toLowerCase();
      testLogin(role);
      router.replace('/(tabs)');
    }
  };

  const copyCredential = (credential: typeof TEST_CREDENTIALS[0], index: number) => {
    const text = `Email: ${credential.email}\nPassword: ${credential.password}`;
    // In a real app, you'd use Clipboard API
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Test mode - check if it's a test credential and bypass Supabase
    if (TEST_MODE) {
      const testCredential = TEST_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase()
      );
      
      if (testCredential && testCredential.password === password) {
        setLoading(true);
        // Small delay for UX
        setTimeout(() => {
          const role = testCredential.role.toLowerCase();
          if (testLogin) {
            testLogin(role);
            router.replace('/(tabs)');
          }
          setLoading(false);
        }, 500);
        return;
      }
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!profile?.role) {
          router.replace('/(auth)/role-selection');
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : 'Failed to sign in'
      );
    } finally {
      setLoading(false);
    }
  };

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
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Zap size={14} color={COLORS.accent} strokeWidth={2.5} />
              <Text style={styles.heroBadgeText}>NextIgnition</Text>
            </View>
            <Text style={styles.heroTitle}>Ignite the next chapter of your startup</Text>
            <Text style={styles.heroSubtitle}>
              Tap into curated capital, operator knowledge, and a private network designed for
              breakout founders.
            </Text>
            <View style={styles.heroStats}>
              {HERO_STATS.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Logo size={48} variant="icon" />
              <View style={styles.formHeaderText}>
                <Text style={styles.formTitle}>Welcome back</Text>
                <Text style={styles.formSubtitle}>Let&apos;s pick up where you left off</Text>
              </View>
            </View>

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

            <Input
              label="Password"
              type="password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
                setGeneralError('');
              }}
              error={passwordError}
              placeholder="Enter your password"
              autoComplete="password"
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/reset-password')}
              style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {generalError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            )}

            <Button 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading} 
              style={styles.loginButton}
            />

            <View style={styles.securityCallout}>
              <ShieldCheck size={16} color={COLORS.primary} />
              <Text style={styles.securityText}>Enterprise-grade authentication secured by Supabase</Text>
            </View>

            {/* Test Credentials Section */}
            <View style={styles.testCredentialsSection}>
              <TouchableOpacity
                style={styles.testCredentialsHeader}
                onPress={() => setShowTestCredentials(!showTestCredentials)}
                activeOpacity={0.7}>
                <View style={styles.testCredentialsHeaderLeft}>
                  <Text style={styles.testCredentialsTitle}>🧪 Test Credentials</Text>
                  <Text style={styles.testCredentialsSubtitle}>
                    Click to auto-fill login form
                  </Text>
                </View>
                {showTestCredentials ? (
                  <ChevronUp size={20} color={COLORS.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={COLORS.textSecondary} />
                )}
              </TouchableOpacity>

              {showTestCredentials && (
                <View style={styles.testCredentialsList}>
                  {TEST_CREDENTIALS.map((credential, index) => (
                    <View key={credential.role} style={styles.testCredentialCard}>
                      <TouchableOpacity
                        style={styles.testCredentialContent}
                        onPress={() => handleTestCredential(credential)}
                        activeOpacity={0.7}>
                        <View style={styles.testCredentialInfo}>
                          <View style={styles.testCredentialHeader}>
                            <Text style={styles.testCredentialRole}>{credential.role}</Text>
                            <View
                              style={[
                                styles.testCredentialBadge,
                                credential.role === 'Admin' && styles.testCredentialBadgeAdmin,
                                credential.role === 'Investor' && styles.testCredentialBadgeInvestor,
                                credential.role === 'Expert' && styles.testCredentialBadgeExpert,
                              ]}>
                              <Text style={styles.testCredentialBadgeText}>
                                {credential.role === 'Admin'
                                  ? 'Admin'
                                  : credential.role === 'Investor'
                                  ? 'Elite'
                                  : credential.role === 'Expert'
                                  ? 'Pro'
                                  : credential.role === 'Co-founder'
                                  ? 'Elite'
                                  : 'Pro'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.testCredentialDescription}>
                            {credential.description}
                          </Text>
                          <View style={styles.testCredentialDetails}>
                            <Text style={styles.testCredentialEmail}>
                              📧 {credential.email}
                            </Text>
                            <Text style={styles.testCredentialPassword}>
                              🔒 {credential.password}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.copyButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            copyCredential(credential, index);
                          }}
                          activeOpacity={0.7}>
                          {copiedIndex === index ? (
                            <Check size={16} color={COLORS.success} />
                          ) : (
                            <Copy size={16} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={styles.testCredentialsNote}>
                    <Text style={styles.testCredentialsNoteText}>
                      💡 These are test accounts for development. Tap any credential to auto-fill the form above.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.footerLink}>Create one in minutes</Text>
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
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  hero: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    ...SHADOWS.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  heroBadgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyMedium,
    letterSpacing: 0.5,
  },
  heroTitle: {
    ...TYPOGRAPHY.display,
    color: COLORS.background,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: SPACING.lg,
  },
  heroStats: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  statCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flex: 1,
    minWidth: 120,
  },
  statValue: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 28,
    color: COLORS.background,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.76)',
    marginTop: SPACING.xs / 2,
  },
  formCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  formHeaderText: {
    flex: 1,
  },
  formTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
  },
  formSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.bodyStrong,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
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
  loginButton: {
    marginBottom: SPACING.lg,
  },
  securityCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  securityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  footer: {
    gap: SPACING.xs,
    flexDirection: 'row',
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
  testCredentialsSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceMuted,
    overflow: 'hidden',
  },
  testCredentialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  testCredentialsHeaderLeft: {
    flex: 1,
  },
  testCredentialsTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  testCredentialsSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  testCredentialsList: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  testCredentialCard: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  testCredentialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  testCredentialInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  testCredentialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs / 2,
  },
  testCredentialRole: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  testCredentialBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
  },
  testCredentialBadgeAdmin: {
    backgroundColor: COLORS.error + '20',
  },
  testCredentialBadgeInvestor: {
    backgroundColor: COLORS.accentLight,
  },
  testCredentialBadgeExpert: {
    backgroundColor: COLORS.primaryLight,
  },
  testCredentialBadgeText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  testCredentialDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  testCredentialDetails: {
    gap: SPACING.xs / 2,
    marginTop: SPACING.xs,
  },
  testCredentialEmail: {
    ...TYPOGRAPHY.caption,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.text,
    fontSize: FONT_SIZES.xs,
  },
  testCredentialPassword: {
    ...TYPOGRAPHY.caption,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
  },
  copyButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
  },
  testCredentialsNote: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primaryLight + '30',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  testCredentialsNoteText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    lineHeight: 18,
  },
});
