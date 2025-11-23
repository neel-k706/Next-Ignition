import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from './Logo';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS, SPACING } from '@/constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 500,
        useNativeDriver: true,
        }),
      ]).start(() => onFinish());
    }, 2800);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, rotateAnim, onFinish]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={GRADIENTS.navy}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate },
            ],
          },
        ]}>
        <View style={styles.logoContainer}>
          <Logo size={96} variant="full" color={COLORS.background} />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <Text style={styles.title}>NextIgnition</Text>
        <Text style={styles.tagline}>Where startups meet capital</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.background,
    marginBottom: SPACING.xs,
    letterSpacing: -1.2,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: FONT_FAMILY.bodyMedium,
    letterSpacing: 0.3,
  },
});
