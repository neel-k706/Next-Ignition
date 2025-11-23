import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Building2 } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, GRADIENTS } from '@/constants/theme';

export function LoadingScreen() {
  return (
    <LinearGradient colors={GRADIENTS.navy} style={styles.container}>
      <View style={styles.badge}>
        <Building2 size={28} color={COLORS.accent} strokeWidth={2} />
      </View>
      <Text style={styles.label}>NextIgnition</Text>
      <ActivityIndicator size="large" color={COLORS.background} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  label: {
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.background,
    fontSize: 20,
    marginBottom: 16,
  },
});
