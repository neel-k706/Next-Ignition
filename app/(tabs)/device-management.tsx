import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
  Smartphone,
  Monitor,
  Tablet,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';

const DEVICES = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    type: 'mobile',
    os: 'iOS 17.0',
    lastActive: '2 hours ago',
    current: true,
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS 14.0',
    lastActive: '1 day ago',
    current: false,
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    os: 'iPadOS 17.0',
    lastActive: '3 days ago',
    current: false,
    location: 'New York, NY',
  },
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'mobile':
      return Smartphone;
    case 'desktop':
      return Monitor;
    case 'tablet':
      return Tablet;
    default:
      return Smartphone;
  }
};

export default function DeviceManagementScreen() {
  const [devices, setDevices] = useState(DEVICES);

  const handleRemoveDevice = (id: string) => {
    Alert.alert('Remove Device', 'Are you sure you want to remove this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setDevices(devices.filter((d) => d.id !== id));
          Alert.alert('Success', 'Device removed successfully');
        },
      },
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
              <Smartphone size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Device Management</Text>
              <Text style={styles.heroSubtitle}>
                Manage devices connected to your account
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.infoCard}>
          <AlertTriangle size={20} color={COLORS.warning} strokeWidth={2} />
          <Text style={styles.infoText}>
            If you notice any suspicious activity, remove the device immediately and change your
            password.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          <View style={styles.devicesList}>
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <View key={device.id} style={styles.deviceCard}>
                  <View style={styles.deviceHeader}>
                    <View style={styles.deviceIcon}>
                      <DeviceIcon size={24} color={COLORS.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.deviceInfo}>
                      <View style={styles.deviceNameRow}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        {device.current && (
                          <View style={styles.currentBadge}>
                            <CheckCircle size={14} color={COLORS.success} strokeWidth={2} />
                            <Text style={styles.currentBadgeText}>Current</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.deviceOS}>{device.os}</Text>
                      <View style={styles.deviceMeta}>
                        <Text style={styles.deviceMetaText}>{device.location}</Text>
                        <View style={styles.metaDivider} />
                        <Text style={styles.deviceMetaText}>Last active: {device.lastActive}</Text>
                      </View>
                    </View>
                  </View>
                  {!device.current && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveDevice(device.id)}
                      activeOpacity={0.7}>
                      <Trash2 size={18} color={COLORS.error} strokeWidth={2} />
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  devicesList: {
    gap: SPACING.md,
  },
  deviceCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    marginBottom: SPACING.xs / 2,
  },
  deviceName: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
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
  deviceOS: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    flexWrap: 'wrap',
  },
  deviceMetaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.error + '15',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
  },
  removeButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.error,
    fontFamily: FONT_FAMILY.bodyBold,
  },
});

