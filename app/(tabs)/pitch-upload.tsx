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
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { usePitchMaterials } from '@/hooks/usePitchMaterials';
import { showAlert } from '@/utils/platformAlert';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { Upload, FileText, CheckCircle, X, Eye, EyeOff, AlertCircle } from 'lucide-react-native';

interface PickedDocument {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
}

export default function PitchUploadScreen() {
  const { user, profile } = useAuth();
  const { permissions, currentPlan } = useSubscription();
  const { uploadPitchMaterial, pitchDecks, refresh } = usePitchMaterials();
  
  const [pitchDeck, setPitchDeck] = useState<PickedDocument | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [uploading, setUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handlePickDocument = async () => {
    try {
      // Check permissions first
      if (!permissions.canUploadPitchDeck) {
        showAlert(
          'Upgrade Required',
          `Pitch deck upload is available for ${currentPlan?.name || 'Pro'} plan and above. Upgrade to unlock this feature.`
        );
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      // Check file size
      if (file.size && file.size > MAX_FILE_SIZE) {
        showAlert(
          'File Too Large',
          'Please select a PDF file smaller than 10MB.'
        );
        return;
      }

      // Validate file type
      if (file.mimeType && file.mimeType !== 'application/pdf') {
        showAlert(
          'Invalid File Type',
          'Please select a PDF file.'
        );
        return;
      }

      setPitchDeck({
        name: file.name,
        uri: file.uri,
        size: file.size,
        mimeType: file.mimeType,
      });
    } catch (error) {
      console.error('Error picking document:', error);
      showAlert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!pitchDeck) {
      showAlert('Error', 'Please select a pitch deck PDF file first.');
      return;
    }

    if (!user?.id) {
      showAlert('Error', 'You must be logged in to upload a pitch deck.');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase
      // On mobile: pass the URI string directly (usePitchMaterials handles file reading)
      // On web: fetch and convert to blob first
      let fileToUpload: File | Blob | string;
      
      if (Platform.OS === 'web') {
        // On web, fetch and convert to blob
        const response = await fetch(pitchDeck.uri);
        fileToUpload = await response.blob();
      } else {
        // On mobile, pass the URI string directly
        // The usePitchMaterials hook will read the file using expo-file-system
        fileToUpload = pitchDeck.uri;
      }

      const result = await uploadPitchMaterial(
        'deck',
        fileToUpload,
        pitchDeck.name,
        visibility
      );

      if (result.success) {
        showAlert(
          'Success',
          'Your pitch deck has been uploaded successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                refresh();
                router.back();
              },
            },
          ]
        );
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showAlert(
        'Upload Failed',
        error.message || 'Failed to upload pitch deck. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

        {/* Permission Notice */}
        {!permissions.canUploadPitchDeck && (
          <View style={styles.warningCard}>
            <AlertCircle size={20} color={COLORS.warning} strokeWidth={2} />
            <Text style={styles.warningText}>
              Pitch deck uploads require a Pro plan or higher
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Pitch Deck</Text>
          {pitchDeck ? (
            <View style={styles.fileCard}>
              <View style={styles.fileInfo}>
                <FileText size={24} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{pitchDeck.name}</Text>
                  <Text style={styles.fileSize}>
                    PDF • {formatFileSize(pitchDeck.size)}
                  </Text>
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  warningText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
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

