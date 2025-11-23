import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = BORDER_RADIUS.sm,
  style
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonLoader height={120} borderRadius={BORDER_RADIUS.md} style={styles.marginBottom} />
      <SkeletonLoader height={20} width="80%" style={styles.marginBottom} />
      <SkeletonLoader height={16} width="60%" />
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={styles.profileContainer}>
      <SkeletonLoader
        width={96}
        height={96}
        borderRadius={BORDER_RADIUS.full}
        style={styles.avatar}
      />
      <SkeletonLoader height={24} width="60%" style={styles.marginBottom} />
      <SkeletonLoader height={16} width="40%" style={styles.marginBottom} />
      <SkeletonLoader height={32} width={100} borderRadius={BORDER_RADIUS.full} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.inputBackground,
  },
  card: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  marginBottom: {
    marginBottom: SPACING.sm,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  avatar: {
    marginBottom: SPACING.md,
  },
});
