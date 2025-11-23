import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import { Camera } from 'expo-camera';
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
import { Video, Play, Pause, Upload, CheckCircle, Clock } from 'lucide-react-native';

export default function PitchVideoScreen() {
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const cameraRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_DURATION = 120; // 2 minutes

  const startRecording = async () => {
    try {
      // Simulate recording for now
      // In production, use expo-camera
      setRecording(true);
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    // Simulate stop recording
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Simulate video recorded
    setTimeout(() => {
      setRecordedVideo('file://recorded-video.mp4');
    }, 500);
  };

  const handleStart = () => {
    startRecording();
  };

  const handleUpload = async () => {
    if (!recordedVideo) {
      Alert.alert('Error', 'Please record a video first');
      return;
    }

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      Alert.alert('Success', 'Pitch video uploaded successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Record Pitch Video</Text>
          <Text style={styles.headerSubtitle}>
            Create a 2-minute pitch video to showcase your startup
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Recording</Text>
          <View style={styles.cameraContainer}>
            {!recordedVideo ? (
              <View style={styles.cameraPlaceholder}>
                <Video size={48} color={COLORS.textSecondary} strokeWidth={2} />
                <Text style={styles.cameraPlaceholderText}>Camera Preview</Text>
                <Text style={styles.cameraHint}>
                  Tap record to start your 2-minute pitch
                </Text>
              </View>
            ) : (
              <View style={styles.videoPreview}>
                <Play size={32} color={COLORS.background} strokeWidth={2} />
                <Text style={styles.videoPreviewText}>Video Recorded</Text>
              </View>
            )}

            {recording && (
              <View style={styles.recordingOverlay}>
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingTime}>{formatTime(timeElapsed)}</Text>
                </View>
              </View>
            )}
          </View>

          {!recordedVideo && (
            <View style={styles.controls}>
              {!recording ? (
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={handleStart}
                  activeOpacity={0.7}>
                  <View style={styles.recordButtonInner} />
                  <Text style={styles.recordButtonText}>Start Recording</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={stopRecording}
                  activeOpacity={0.7}>
                  <Pause size={24} color={COLORS.background} strokeWidth={2} />
                  <Text style={styles.stopButtonText}>Stop Recording</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {recordedVideo && (
            <View style={styles.videoActions}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => {
                  setRecordedVideo(null);
                  setTimeElapsed(0);
                }}
                activeOpacity={0.7}>
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => {
                  // Play video
                }}
                activeOpacity={0.7}>
                <Play size={20} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.playButtonText}>Preview</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for a great pitch:</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
              <Text style={styles.tipText}>Keep it under 2 minutes</Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
              <Text style={styles.tipText}>Clearly explain your problem and solution</Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
              <Text style={styles.tipText}>Show enthusiasm and passion</Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
              <Text style={styles.tipText}>Practice before recording</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Clock size={20} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.infoText}>
            Maximum duration: 2 minutes. Your video will be reviewed before being made available
            to investors.
          </Text>
        </View>

        {recordedVideo && (
          <Button
            title={uploading ? 'Uploading...' : 'Upload Video'}
            onPress={handleUpload}
            loading={uploading}
            disabled={uploading}
            style={styles.uploadButton}
          />
        )}
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
  cameraContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.navy,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.md,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cameraPlaceholderText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  cameraHint: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  videoPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    gap: SPACING.sm,
  },
  videoPreviewText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  recordingOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
  },
  recordingTime: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  controls: {
    alignItems: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
  },
  recordButtonInner: {
    width: 16,
    height: 16,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
  },
  recordButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
  },
  stopButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  videoActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  retakeButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  playButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  tipsCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  tipsTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  tipsList: {
    gap: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
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

