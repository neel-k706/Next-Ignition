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
  Shield,
  Bell,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  CheckCircle,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const { profile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password changed successfully!');
    }, 1500);
  };

  const handleEnable2FA = () => {
    Alert.alert(
      'Two-Factor Authentication',
      '2FA setup will be available in a future update.',
      [{ text: 'OK' }]
    );
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
              <Text style={styles.heroTitle}>Settings</Text>
              <Text style={styles.heroSubtitle}>
                Manage your account preferences and security
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
          <View style={styles.settingsCard}>
            <Text style={styles.subsectionTitle}>Change Password</Text>
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                setPasswordError('');
              }}
              placeholder="Enter current password"
              secureTextEntry={!showCurrentPassword}
              icon={
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  activeOpacity={0.7}>
                  {showCurrentPassword ? (
                    <EyeOff size={20} color={COLORS.textSecondary} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={COLORS.textSecondary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              }
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError('');
              }}
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
              icon={
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}>
                  {showNewPassword ? (
                    <EyeOff size={20} color={COLORS.textSecondary} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={COLORS.textSecondary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              }
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError('');
              }}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              icon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={COLORS.textSecondary} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={COLORS.textSecondary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              }
            />
            {passwordError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{passwordError}</Text>
              </View>
            )}
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              loading={saving}
              disabled={saving}
              style={styles.changePasswordButton}
            />
          </View>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Lock size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>
                    Add an extra layer of security to your account
                  </Text>
                </View>
              </View>
              <View style={styles.settingAction}>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={(value) => {
                    if (value) {
                      handleEnable2FA();
                    } else {
                      setTwoFactorEnabled(false);
                    }
                  }}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.background}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={24} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive push notifications on your device
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive email notifications for important updates
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
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={24} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Device Management</Text>
          </View>
          <View style={styles.settingsCard}>
            <View style={styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <Smartphone size={20} color={COLORS.primary} strokeWidth={2} />
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>iPhone 14 Pro</Text>
                  <Text style={styles.deviceMeta}>Current Device • Last active: Now</Text>
                </View>
              </View>
              <View style={styles.currentBadge}>
                <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            </View>
            <View style={styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <Smartphone size={20} color={COLORS.textSecondary} strokeWidth={2} />
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>MacBook Pro</Text>
                  <Text style={styles.deviceMeta}>Last active: 2 hours ago</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeDeviceButton}
                onPress={() => Alert.alert('Remove Device', 'Are you sure?')}
                activeOpacity={0.7}>
                <Text style={styles.removeDeviceText}>Remove</Text>
              </TouchableOpacity>
            </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
  subsectionTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  settingAction: {
    marginLeft: SPACING.md,
  },
  errorContainer: {
    backgroundColor: `${COLORS.error}15`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  changePasswordButton: {
    marginTop: SPACING.sm,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  deviceMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success + '20',
  },
  currentBadgeText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  removeDeviceButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.error + '15',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  removeDeviceText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    fontFamily: FONT_FAMILY.bodyBold,
  },
});
