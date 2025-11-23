import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { LucideIcon } from 'lucide-react-native';

interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  gradient?: string[];
  trend?: 'up' | 'down' | 'neutral';
}

export function AnalyticsWidget({
  title,
  value,
  change,
  icon: Icon,
  gradient = GRADIENTS.primary,
  trend = 'neutral',
}: AnalyticsWidgetProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [value, scaleAnim]);

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toString();
    }
    return val;
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
      accessibilityLabel={`${title}: ${value}`}
      accessibilityRole="text">
      <LinearGradient colors={gradient} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon size={24} color={COLORS.background} strokeWidth={2} />
            </View>
            {change !== undefined && (
              <View
                style={[
                  styles.changeBadge,
                  trend === 'up' && styles.changeUp,
                  trend === 'down' && styles.changeDown,
                ]}>
                <Text
                  style={[
                    styles.changeText,
                    trend === 'up' && styles.changeTextUp,
                    trend === 'down' && styles.changeTextDown,
                  ]}>
                  {trend === 'up' ? '+' : ''}
                  {change}%
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.value}>{formatValue(value)}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 200,
  },
  gradient: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  content: {
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  changeUp: {
    backgroundColor: COLORS.success + '40',
  },
  changeDown: {
    backgroundColor: COLORS.error + '40',
  },
  changeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: FONT_SIZES.xs,
  },
  changeTextUp: {
    color: COLORS.background,
  },
  changeTextDown: {
    color: COLORS.background,
  },
  value: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 32,
    color: COLORS.background,
    lineHeight: 40,
  },
  title: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
});

