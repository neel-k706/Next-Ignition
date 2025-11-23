import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
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
  Settings,
  Key,
  Flag,
  Mail,
  MessageSquare,
  Database,
  Shield,
  Save,
  Download,
  Upload,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function AdminSettingsScreen() {
  const [stripeKey, setStripeKey] = useState('sk_live_...');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_...');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Success', 'Settings saved successfully!');
    }, 1000);
  };

  const handleBackup = () => {
    Alert.alert('Backup', 'Creating system backup...', [
      { text: 'OK', onPress: () => alert('Backup created successfully!') },
    ]);
  };

  const handleRestore = () => {
    Alert.alert('Restore', 'Select backup file to restore', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Select File', onPress: () => alert('Restore initiated...') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.navy} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Settings size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Platform Settings</Text>
              <Text style={styles.heroSubtitle}>
                Manage configuration and integrations
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Integrations</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <Key size={20} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.settingLabel}>Stripe API Key</Text>
              </View>
              <Input
                value={stripeKey}
                onChangeText={setStripeKey}
                placeholder="Enter Stripe API key"
                secureTextEntry
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <Key size={20} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.settingLabel}>Razorpay API Key</Text>
              </View>
              <Input
                value={razorpayKey}
                onChangeText={setRazorpayKey}
                placeholder="Enter Razorpay API key"
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Flags</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Flag size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Maintenance Mode</Text>
                  <Text style={styles.settingDescription}>
                    Enable to put platform in maintenance mode
                  </Text>
                </View>
              </View>
              <Switch
                value={maintenanceMode}
                onValueChange={setMaintenanceMode}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Mail size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Send email notifications to users
                  </Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <MessageSquare size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>SMS Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Send SMS notifications to users
                  </Text>
                </View>
              </View>
              <Switch
                value={smsNotifications}
                onValueChange={setSmsNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email/SMS Templates</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => alert('Manage email templates')}
              activeOpacity={0.7}>
              <Mail size={20} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.templateButtonText}>Manage Email Templates</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => alert('Manage SMS templates')}
              activeOpacity={0.7}>
              <MessageSquare size={20} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.templateButtonText}>Manage SMS Templates</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Management</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <Database size={20} color={COLORS.primary} strokeWidth={2} />
                <Text style={styles.settingLabel}>Backup & Restore</Text>
              </View>
              <View style={styles.backupActions}>
                <TouchableOpacity
                  style={styles.backupButton}
                  onPress={handleBackup}
                  activeOpacity={0.7}>
                  <Download size={18} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.backupButtonText}>Create Backup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backupButton}
                  onPress={handleRestore}
                  activeOpacity={0.7}>
                  <Upload size={18} color={COLORS.primary} strokeWidth={2} />
                  <Text style={styles.backupButtonText}>Restore Backup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Roles & Permissions</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => alert('Manage admin roles')}
              activeOpacity={0.7}>
              <Shield size={20} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.templateButtonText}>Manage Admin Roles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => alert('Manage moderator permissions')}
              activeOpacity={0.7}>
              <Shield size={20} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.templateButtonText}>Manage Moderator Permissions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Save All Settings"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
          icon={<Save size={20} color={COLORS.background} strokeWidth={2} />}
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
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  settingsCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.lg,
  },
  settingItem: {
    gap: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  settingDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  templateButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  backupActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  backupButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  backupButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

