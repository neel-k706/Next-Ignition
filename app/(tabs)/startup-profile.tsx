import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Picker } from '@/components/Picker';
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
  Building2,
  Eye,
  EyeOff,
  Share2,
  Download,
  FileText,
  Video,
  Link,
  CheckCircle,
  TrendingUp,
} from 'lucide-react-native';
import { MOCK_PROFILE } from '@/hooks/useMockData';

const STAGES = [
  { label: 'Select stage', value: '' },
  { label: 'Idea', value: 'idea' },
  { label: 'MVP', value: 'mvp' },
  { label: 'Growth', value: 'growth' },
  { label: 'Scale', value: 'scale' },
];

const INDUSTRIES = [
  { label: 'Select industry', value: '' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'E-commerce', value: 'ecommerce' },
];

export default function StartupProfileScreen() {
  const profile = MOCK_PROFILE;
  const [startupName, setStartupName] = useState(profile?.venture_name || '');
  const [description, setDescription] = useState(profile?.venture_description || '');
  const [stage, setStage] = useState(profile?.venture_stage || '');
  const [industry, setIndustry] = useState(profile?.venture_industry || '');
  const [website, setWebsite] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [hasPitchDeck, setHasPitchDeck] = useState(false);
  const [hasPitchVideo, setHasPitchVideo] = useState(false);
  const [saving, setSaving] = useState(false);

  const profileCompleteness = () => {
    let completed = 0;
    const total = 8;
    if (startupName) completed++;
    if (description) completed++;
    if (stage) completed++;
    if (industry) completed++;
    if (website) completed++;
    if (hasPitchDeck) completed++;
    if (hasPitchVideo) completed++;
    if (profile?.linkedin_url || profile?.twitter_url || profile?.website_url) completed++;
    return Math.round((completed / total) * 100);
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Success', 'Startup profile updated successfully!');
    }, 1000);
  };

  const handleShare = () => {
    Alert.alert('Share Profile', 'Choose sharing option', [
      { text: 'Copy Link', onPress: () => alert('Link copied!') },
      { text: 'Export PDF', onPress: () => alert('Generating PDF...') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Building2 size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Startup Profile</Text>
              <Text style={styles.heroSubtitle}>Manage your startup information</Text>
            </View>
          </View>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Profile Completeness</Text>
              <Text style={styles.progressValue}>{profileCompleteness()}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${profileCompleteness()}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Startup Details</Text>
          <Input
            label="Startup Name"
            value={startupName}
            onChangeText={setStartupName}
            placeholder="Your startup name"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What problem are you solving?"
            multiline
            numberOfLines={4}
          />
          <Picker
            label="Industry"
            selectedValue={industry}
            onValueChange={setIndustry}
            items={INDUSTRIES}
          />
          <Picker
            label="Current Stage"
            selectedValue={stage}
            onValueChange={setStage}
            items={STAGES}
          />
          <Input
            label="Website"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://yourstartup.com"
            type="url"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pitch Materials</Text>
          <View style={styles.materialsList}>
            <TouchableOpacity
              style={styles.materialCard}
              onPress={() => router.push('/(tabs)/pitch-upload')}
              activeOpacity={0.7}>
              <View style={styles.materialIcon}>
                <FileText size={24} color={hasPitchDeck ? COLORS.success : COLORS.primary} strokeWidth={2} />
              </View>
              <View style={styles.materialInfo}>
                <Text style={styles.materialTitle}>Pitch Deck</Text>
                <Text style={styles.materialStatus}>
                  {hasPitchDeck ? 'Uploaded' : 'Not uploaded'}
                </Text>
              </View>
              {hasPitchDeck ? (
                <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
              ) : (
                <Text style={styles.uploadLink}>Upload</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.materialCard}
              onPress={() => router.push('/(tabs)/pitch-video')}
              activeOpacity={0.7}>
              <View style={styles.materialIcon}>
                <Video size={24} color={hasPitchVideo ? COLORS.success : COLORS.primary} strokeWidth={2} />
              </View>
              <View style={styles.materialInfo}>
                <Text style={styles.materialTitle}>Pitch Video (2 min)</Text>
                <Text style={styles.materialStatus}>
                  {hasPitchVideo ? 'Recorded' : 'Not recorded'}
                </Text>
              </View>
              {hasPitchVideo ? (
                <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
              ) : (
                <Text style={styles.uploadLink}>Record</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visibility Settings</Text>
            <View style={styles.visibilityToggle}>
              <Eye size={18} color={isPublic ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
              <Text style={styles.visibilityLabel}>{isPublic ? 'Public' : 'Private'}</Text>
            </View>
          </View>
          <View style={styles.visibilityInfo}>
            <Text style={styles.visibilityInfoText}>
              {isPublic
                ? 'Your profile is visible to all investors on the platform'
                : 'Your profile is only visible to investors you connect with'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <View style={styles.socialLinks}>
            <View style={styles.socialLinkItem}>
              <Link size={18} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.socialLinkText}>
                {profile?.linkedin_url || 'LinkedIn not set'}
              </Text>
            </View>
            <View style={styles.socialLinkItem}>
              <Link size={18} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.socialLinkText}>
                {profile?.twitter_url || 'Twitter not set'}
              </Text>
            </View>
            <View style={styles.socialLinkItem}>
              <Link size={18} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.socialLinkText}>
                {profile?.website_url || 'Website not set'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editLinksButton}
            onPress={() => router.push('/(tabs)/edit-profile')}
            activeOpacity={0.7}>
            <Text style={styles.editLinksText}>Edit Social Links</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}>
            <Share2 size={20} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => alert('Exporting profile as PDF...')}
            activeOpacity={0.7}>
            <Download size={20} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
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
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: SPACING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
  },
  progressValue: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.background,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.full,
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
  visibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  visibilityLabel: {
    ...TYPOGRAPHY.body,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  visibilityInfo: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visibilityInfoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  materialsList: {
    gap: SPACING.md,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  materialIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  materialStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  uploadLink: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  socialLinks: {
    gap: SPACING.sm,
  },
  socialLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialLinkText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  editLinksButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  editLinksText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  shareButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  exportButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

