import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
export const isDesktop = width >= BREAKPOINTS.desktop;
export const isMobile = width < BREAKPOINTS.tablet;

export const getResponsiveValue = <T,>(values: { mobile?: T; tablet?: T; desktop?: T }): T => {
  if (isDesktop && values.desktop !== undefined) return values.desktop;
  if (isTablet && values.tablet !== undefined) return values.tablet;
  return values.mobile as T;
};

export const getColumns = () => {
  if (isDesktop) return 3;
  if (isTablet) return 2;
  return 1;
};

