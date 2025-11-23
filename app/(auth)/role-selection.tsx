import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { RoleCard } from '@/components/RoleCard';
import { Button } from '@/components/Button';
import { ROLE_OPTIONS } from '@/constants/roles';
import { UserRole } from '@/types/user';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SPACING,
  TYPOGRAPHY,
  GRADIENTS,
} from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Building2 } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user found');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: selectedRole, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.replace('/(auth)/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.navy} style={StyleSheet.absoluteFill} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Building2 size={28} color={COLORS.accent} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select the role that best describes your journey with NextIgnition
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          {ROLE_OPTIONS.map((role) => (
            <RoleCard
              key={role.id}
              {...role}
              selected={selectedRole === role.id}
              onPress={() => {
                setSelectedRole(role.id);
                setError(null);
              }}
            />
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={!selectedRole}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.background,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  rolesContainer: {
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  errorContainer: {
    backgroundColor: `${COLORS.error}20`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  button: {
    marginBottom: SPACING.lg,
  },
});
