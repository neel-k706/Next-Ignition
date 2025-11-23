import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

interface LogoProps {
  size?: number;
  variant?: 'full' | 'icon';
  color?: string;
}

export function Logo({ size = 64, variant = 'full', color }: LogoProps) {
  const iconSize = variant === 'icon' ? size : size * 0.6;
  const logoColor = color || COLORS.primary;

  if (variant === 'icon') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none">
          <Defs>
            <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primary} />
              <Stop offset="100%" stopColor={COLORS.accent} />
            </LinearGradient>
          </Defs>
          {/* Modern geometric logo - represents growth and innovation */}
          <Path
            d="M32 8L48 20V44L32 56L16 44V20L32 8Z"
            fill="url(#logoGradient)"
            stroke={logoColor}
            strokeWidth="2"
          />
          <Circle cx="32" cy="32" r="8" fill={COLORS.background} />
          <Path
            d="M32 24L36 28L32 32L28 28L32 24Z"
            fill={logoColor}
            opacity="0.8"
          />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none">
        <Defs>
          <LinearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.primary} />
            <Stop offset="100%" stopColor={COLORS.accent} />
          </LinearGradient>
        </Defs>
        {/* Refined geometric logo */}
        <Path
          d="M32 6L52 20V44L32 58L12 44V20L32 6Z"
          fill="url(#logoGradientFull)"
          stroke={logoColor}
          strokeWidth="1.5"
        />
        <Circle cx="32" cy="32" r="10" fill={COLORS.background} />
        <Path
          d="M32 22L38 28L32 34L26 28L32 22Z"
          fill={logoColor}
        />
        <Circle cx="32" cy="32" r="3" fill={logoColor} opacity="0.6" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

