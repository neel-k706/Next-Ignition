import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { X, Filter } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '@/constants/theme';
import { FilterOptions, IndustryType, FundingStage, FundingStatus } from '@/types/funding';

interface FilterModalProps {
  visible: boolean;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  onClose: () => void;
}

const INDUSTRIES: { label: string; value: IndustryType }[] = [
  { label: 'SaaS', value: 'saas' },
  { label: 'FinTech', value: 'fintech' },
  { label: 'HealthTech', value: 'healthtech' },
  { label: 'EdTech', value: 'edtech' },
  { label: 'E-Commerce', value: 'ecommerce' },
  { label: 'AI', value: 'ai' },
  { label: 'Blockchain', value: 'blockchain' },
  { label: 'Other', value: 'other' },
];

const STAGES: { label: string; value: FundingStage }[] = [
  { label: 'Pre-Seed', value: 'pre-seed' },
  { label: 'Seed', value: 'seed' },
  { label: 'Series A', value: 'series-a' },
  { label: 'Series B', value: 'series-b' },
  { label: 'Series C', value: 'series-c' },
];

const STATUSES: { label: string; value: FundingStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Funded', value: 'funded' },
  { label: 'Closed', value: 'closed' },
];

export function FilterModal({ visible, filters, onApply, onReset, onClose }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const toggleArrayFilter = <T,>(array: T[], value: T): T[] => {
    if (array.includes(value)) {
      return array.filter((item) => item !== value);
    }
    return [...array, value];
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Filter size={24} color={COLORS.primary} />
                  <Text style={styles.title}>Filters</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Industry</Text>
                  <View style={styles.chipContainer}>
                    {INDUSTRIES.map((industry) => (
                      <TouchableOpacity
                        key={industry.value}
                        style={[
                          styles.chip,
                          localFilters.industries.includes(industry.value) && styles.chipActive,
                        ]}
                        onPress={() =>
                          setLocalFilters({
                            ...localFilters,
                            industries: toggleArrayFilter(localFilters.industries, industry.value),
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            localFilters.industries.includes(industry.value) && styles.chipTextActive,
                          ]}>
                          {industry.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Funding Stage</Text>
                  <View style={styles.chipContainer}>
                    {STAGES.map((stage) => (
                      <TouchableOpacity
                        key={stage.value}
                        style={[
                          styles.chip,
                          localFilters.stages.includes(stage.value) && styles.chipActive,
                        ]}
                        onPress={() =>
                          setLocalFilters({
                            ...localFilters,
                            stages: toggleArrayFilter(localFilters.stages, stage.value),
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            localFilters.stages.includes(stage.value) && styles.chipTextActive,
                          ]}>
                          {stage.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Status</Text>
                  <View style={styles.chipContainer}>
                    {STATUSES.map((status) => (
                      <TouchableOpacity
                        key={status.value}
                        style={[
                          styles.chip,
                          localFilters.statuses.includes(status.value) && styles.chipActive,
                        ]}
                        onPress={() =>
                          setLocalFilters({
                            ...localFilters,
                            statuses: toggleArrayFilter(localFilters.statuses, status.value),
                          })
                        }>
                        <Text
                          style={[
                            styles.chipText,
                            localFilters.statuses.includes(status.value) && styles.chipTextActive,
                          ]}>
                          {status.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <Button
                  title="Reset"
                  onPress={handleReset}
                  variant="outline"
                  style={styles.footerButton}
                />
                <Button
                  title="Apply Filters"
                  onPress={handleApply}
                  style={styles.footerButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: `${COLORS.primary}15`,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
  },
});
