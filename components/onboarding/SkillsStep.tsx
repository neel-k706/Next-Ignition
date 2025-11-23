import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Picker } from '@/components/Picker';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, COLORS, BORDER_RADIUS } from '@/constants/theme';
import { OnboardingData } from '@/types/onboarding';

interface SkillsStepProps {
  data: OnboardingData;
  onChange: (field: keyof OnboardingData, value: any) => void;
}

const SKILL_LEVELS = [
  { label: 'Select level', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
];

export function SkillsStep({ data, onChange }: SkillsStepProps) {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');

  const skills = data.skills || [];

  const addSkill = () => {
    if (newSkillName && newSkillLevel) {
      const updatedSkills = [...skills, { name: newSkillName, level: newSkillLevel }];
      onChange('skills', updatedSkills);
      setNewSkillName('');
      setNewSkillLevel('');
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    onChange('skills', updatedSkills);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your skills</Text>
      <Text style={styles.subtitle}>
        Showcase your expertise to help others understand what you bring to the table
      </Text>

      <View style={styles.addSkillSection}>
        <Input
          label="Skill Name"
          value={newSkillName}
          onChangeText={setNewSkillName}
          placeholder="e.g., Product Management, React, Marketing"
        />

        <Picker
          label="Proficiency Level"
          selectedValue={newSkillLevel}
          onValueChange={setNewSkillLevel}
          items={SKILL_LEVELS}
        />

        <TouchableOpacity
          style={[styles.addButton, (!newSkillName || !newSkillLevel) && styles.addButtonDisabled]}
          onPress={addSkill}
          disabled={!newSkillName || !newSkillLevel}>
          <Plus size={20} color={COLORS.background} />
          <Text style={styles.addButtonText}>Add Skill</Text>
        </TouchableOpacity>
      </View>

      {skills.length > 0 && (
        <>
          <Text style={styles.skillsListTitle}>Your Skills ({skills.length})</Text>
          <ScrollView style={styles.skillsList}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>{skill.level}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeSkill(index)}
                  style={styles.removeButton}>
                  <X size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {skills.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No skills added yet. Add your first skill above!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  addSkillSection: {
    marginBottom: SPACING.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  skillsListTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  skillsList: {
    maxHeight: 200,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  skillLevel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  removeButton: {
    padding: SPACING.xs,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
