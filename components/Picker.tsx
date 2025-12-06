import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, ScrollView, Pressable } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, FONT_FAMILY, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '@/constants/theme';
import { ChevronDown, X } from 'lucide-react-native';

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
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayValue = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}>
        <Text style={[styles.pickerText, !selectedItem && styles.pickerPlaceholder]}>
          {displayValue}
        </Text>
        <ChevronDown size={20} color={COLORS.textSecondary} strokeWidth={2} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select an option'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X size={24} color={COLORS.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.option,
                    selectedValue === item.value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item.value && styles.optionTextSelected,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '70%',
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionSelected: {
    backgroundColor: COLORS.primaryLight || COLORS.primary + '20',
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  optionTextSelected: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
});
