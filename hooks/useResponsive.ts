import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export function useResponsive() {
  const { width } = useWindowDimensions();

  return {
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    width,
    getColumns: () => {
      if (width >= BREAKPOINTS.desktop) return 3;
      if (width >= BREAKPOINTS.tablet) return 2;
      return 1;
    },
  };
}

