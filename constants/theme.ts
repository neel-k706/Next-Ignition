/**
 * Design tokens aligned with the Tamagui theme approach so the brand can scale
 * across platforms while staying consistent with the NextIgnition identity.
 */

export const COLORS = {
  // Brand palette
  primary: '#6666FF',
  primaryDark: '#4B4FDB',
  primaryLight: '#E3E4FF',
  accent: '#F78405',
  accentLight: '#FFD6A8',
  navy: '#242B64',
  navyMuted: '#2F3A88',
  // Surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F7FF',
  card: '#F1F3FF',
  overlay: 'rgba(18, 22, 51, 0.6)',
  // Content
  text: '#1A1A1A',
  textSecondary: '#4C4C66',
  subtle: '#7D7DA8',
  // State + feedback
  border: '#E1E4FF',
  borderStrong: '#C5C9F6',
  inputBackground: '#F8F8FF',
  success: '#16A34A',
  warning: '#FACC15',
  error: '#DC2626',
  focus: '#B8BBFF',
};

export const GRADIENTS = {
  primary: ['#6666FF', '#4B4FDB'],
  accent: ['#F78405', '#FF9E2C'],
  navy: ['#242B64', '#171C3E'],
  surface: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 44,
};

export const FONT_FAMILY = {
  displayMedium: 'FunnelDisplay_500Medium',
  displayBold: 'FunnelDisplay_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_600SemiBold',
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
};

export const TYPOGRAPHY = {
  hero: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -1,
  },
  display: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  heading: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: 28,
    lineHeight: 34,
  },
  title: {
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: 20,
    lineHeight: 26,
  },
  label: {
    fontFamily: FONT_FAMILY.bodyMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyStrong: {
    fontFamily: FONT_FAMILY.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    lineHeight: 20,
  },
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  lg: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12,
  },
};

export const ELEVATION = {
  card: {
    ...SHADOWS.sm,
  },
  overlay: {
    ...SHADOWS.md,
  },
};
