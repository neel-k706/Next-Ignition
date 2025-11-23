import React from 'react';
import { router } from 'expo-router';

// Redirect to settings security section
export default function SecurityScreen() {
  React.useEffect(() => {
    router.replace('/(tabs)/settings');
  }, []);
  return null;
}

