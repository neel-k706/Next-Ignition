import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, FONT_FAMILY, BORDER_RADIUS, FONT_SIZES } from '@/constants/theme';
import { ChevronDown } from 'lucide-react-native';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
}

export function Picker({ label, selectedValue, onValueChange, items, placeholder = 'Select...' }: PickerProps) {
  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayValue = selectedItem ? selectedItem.label : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.picker}
        onPress={() => {
          // In a real app, this would open a modal with options
          // For now, we'll just cycle through options
          const currentIndex = items.findIndex((item) => item.value === selectedValue);
          const nextIndex = (currentIndex + 1) % items.length;
          onValueChange(items[nextIndex].value);
        }}
        activeOpacity={0.7}>
        <Text style={[styles.pickerText, !selectedItem && styles.pickerPlaceholder]}>
          {displayValue}
        </Text>
        <ChevronDown size={20} color={COLORS.textSecondary} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.label,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 52,
  },
  pickerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  pickerPlaceholder: {
    color: COLORS.textSecondary,
  },
});
