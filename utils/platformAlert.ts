import { Alert, Platform } from 'react-native';

export function showAlert(title: string, message: string, buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>) {
  if (Platform.OS === 'web') {
    // Fallback to window alert on web
    try {
      window.alert(`${title}\n\n${message}`);
    } catch (e) {
      // If window undefined, fallback to console
      console.info('[Alert]', title, message);
    }

    if (buttons && buttons.length && typeof buttons[0]?.onPress === 'function') {
      // Execute first button's onPress for compatibility if it exists
      try {
        buttons[0].onPress?.();
      } catch (e) {
        console.error('Error executing alert button handler', e);
      }
    }

    return;
  }

  // Native platforms
  if (buttons && buttons.length > 0) {
    Alert.alert(title, message, buttons as any);
  } else {
    Alert.alert(title, message);
  }
}
