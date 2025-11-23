import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
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
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  Search,
  Plus,
  FileCheck,
  Zap,
} from 'lucide-react-native';
import { Button } from '@/components/Button';

const DOCUMENT_TEMPLATES = [
  {
    id: '1',
    name: 'Pitch Deck Template',
    description: 'Professional pitch deck with all essential slides',
    icon: FileText,
    category: 'Pitch',
  },
  {
    id: '2',
    name: 'Term Sheet',
    description: 'Standard investment term sheet template',
    icon: FileCheck,
    category: 'Legal',
  },
  {
    id: '3',
    name: 'NDA Template',
    description: 'Non-disclosure agreement template',
    icon: FileText,
    category: 'Legal',
  },
];

const RECENT_DOCUMENTS = [
  {
    id: '1',
    name: 'Pitch_Deck_Final.pdf',
    type: 'Pitch Deck',
    created: '2 days ago',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Term_Sheet_Draft.pdf',
    type: 'Term Sheet',
    created: '1 week ago',
    size: '1.8 MB',
  },
];

export default function DocumentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = (templateId: string) => {
    // Simulate document generation
    alert(`Generating ${DOCUMENT_TEMPLATES.find((t) => t.id === templateId)?.name}...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.navy} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <FileText size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Document Center</Text>
              <Text style={styles.heroSubtitle}>
                Generate, manage, and share your documents
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search documents..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Document Generator</Text>
            <View style={styles.aiBadge}>
              <Sparkles size={14} color={COLORS.accent} strokeWidth={2} />
              <Text style={styles.aiBadgeText}>AI Powered</Text>
            </View>
          </View>
          <View style={styles.generatorCard}>
            <View style={styles.generatorHeader}>
              <Zap size={24} color={COLORS.accent} strokeWidth={2} />
              <Text style={styles.generatorTitle}>Profile Summarizer</Text>
            </View>
            <Text style={styles.generatorDescription}>
              Generate a comprehensive profile summary using AI. Perfect for investors reviewing
              founders or founders researching investors.
            </Text>
            <Button
              title="Generate Summary"
              onPress={() => alert('Generating profile summary...')}
              variant="secondary"
              style={styles.generateButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Templates</Text>
          <View style={styles.templatesGrid}>
            {DOCUMENT_TEMPLATES.map((template) => {
              const IconComponent = template.icon;
              return (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() => handleGenerate(template.id)}
                  activeOpacity={0.7}>
                  <View style={styles.templateIcon}>
                    <IconComponent size={24} color={COLORS.primary} strokeWidth={2} />
                  </View>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                  <View style={styles.templateCategory}>
                    <Text style={styles.templateCategoryText}>{template.category}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Documents</Text>
            <TouchableOpacity style={styles.newButton}>
              <Plus size={18} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.newButtonText}>New</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.documentsList}>
            {RECENT_DOCUMENTS.map((doc) => (
              <View key={doc.id} style={styles.documentCard}>
                <View style={styles.documentIcon}>
                  <FileText size={20} color={COLORS.primary} strokeWidth={2} />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentMeta}>
                    {doc.type} • {doc.size} • {doc.created}
                  </Text>
                </View>
                <View style={styles.documentActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Download size={18} color={COLORS.primary} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={18} color={COLORS.primary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  searchSection: {
    gap: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  section: {
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent + '20',
  },
  aiBadgeText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  generatorCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  generatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  generatorTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  generatorDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  generateButton: {
    marginTop: SPACING.sm,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  templateCard: {
    width: '48%',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  templateName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  templateDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  templateCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    marginTop: SPACING.xs,
  },
  templateCategoryText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  newButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  documentsList: {
    gap: SPACING.md,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
    gap: SPACING.md,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  documentMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  documentActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
});

