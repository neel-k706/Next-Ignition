import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { Upload, FileText, CheckCircle, X, Eye, EyeOff } from 'lucide-react-native';

export default function PitchUploadScreen() {
  const [pitchDeck, setPitchDeck] = useState<{ name: string; uri: string } | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [uploading, setUploading] = useState(false);

  const handlePickDocument = async () => {
    try {
      // Simulate document picker for now
      // In production, use: import * as DocumentPicker from 'expo-document-picker';
      Alert.alert(
        'Document Picker',
        'Select a PDF file',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Select Sample',
            onPress: () => {
              setPitchDeck({
                name: 'Pitch_Deck_Sample.pdf',
                uri: 'file://sample.pdf',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!pitchDeck) {
      Alert.alert('Error', 'Please select a pitch deck');
      return;
    }

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      Alert.alert('Success', 'Pitch deck uploaded successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upload Pitch Deck</Text>
          <Text style={styles.headerSubtitle}>
            Share your pitch deck with potential investors
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pitch Deck</Text>
          {pitchDeck ? (
            <View style={styles.fileCard}>
              <View style={styles.fileInfo}>
                <FileText size={24} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{pitchDeck.name}</Text>
                  <Text style={styles.fileSize}>PDF Document</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setPitchDeck(null)}
                activeOpacity={0.7}>
                <X size={20} color={COLORS.error} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadCard}
              onPress={handlePickDocument}
              activeOpacity={0.7}>
              <Upload size={32} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.uploadText}>Tap to select PDF</Text>
              <Text style={styles.uploadHint}>Maximum file size: 10MB</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility Settings</Text>
          <View style={styles.visibilityOptions}>
            <TouchableOpacity
              style={[
                styles.visibilityCard,
                visibility === 'public' && styles.visibilityCardActive,
              ]}
              onPress={() => setVisibility('public')}
              activeOpacity={0.7}>
              <Eye size={24} color={visibility === 'public' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
              <Text
                style={[
                  styles.visibilityTitle,
                  visibility === 'public' && styles.visibilityTitleActive,
                ]}>
                Public
              </Text>
              <Text style={styles.visibilityDescription}>
                Visible to all investors on the platform
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.visibilityCard,
                visibility === 'private' && styles.visibilityCardActive,
              ]}
              onPress={() => setVisibility('private')}
              activeOpacity={0.7}>
              <EyeOff size={24} color={visibility === 'private' ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
              <Text
                style={[
                  styles.visibilityTitle,
                  visibility === 'private' && styles.visibilityTitleActive,
                ]}>
                Private
              </Text>
              <Text style={styles.visibilityDescription}>
                Only visible to investors you connect with
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
          <Text style={styles.infoText}>
            Your pitch deck will be reviewed before being made available to investors. This usually
            takes 24-48 hours.
          </Text>
        </View>

        <Button
          title={uploading ? 'Uploading...' : 'Upload Pitch Deck'}
          onPress={handleUpload}
          loading={uploading}
          disabled={!pitchDeck || uploading}
          style={styles.uploadButton}
        />
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
  header: {
    gap: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.text,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  uploadCard: {
    padding: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  uploadText: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  uploadHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  fileSize: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  visibilityOptions: {
    gap: SPACING.md,
  },
  visibilityCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.xs,
  },
  visibilityCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  visibilityTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.textSecondary,
  },
  visibilityTitleActive: {
    color: COLORS.primary,
  },
  visibilityDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  uploadButton: {
    marginTop: SPACING.md,
  },
});

