import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { AnimatedCard } from './AnimatedCard';
import { UserRound, MapPin, Building2, Calendar, Mail } from 'lucide-react-native';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    location?: string;
    company?: string;
    createdAt: string;
    avatar?: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

export function UserCard({ user, onApprove, onReject, onView }: UserCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AnimatedCard>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={onView}
        accessibilityRole="button"
        accessibilityLabel={`User ${user.name}, ${user.status}`}
        accessibilityHint="Double tap to view user details">
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <UserRound size={24} color={COLORS.primary} strokeWidth={2} />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userMeta}>
            <Mail size={14} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            user.status === 'pending' && styles.statusPending,
            user.status === 'approved' && styles.statusApproved,
            user.status === 'rejected' && styles.statusRejected,
          ]}>
          <Text
            style={[
              styles.statusText,
              user.status === 'approved' && styles.statusTextApproved,
              user.status === 'rejected' && styles.statusTextRejected,
            ]}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Building2 size={16} color={COLORS.textSecondary} strokeWidth={2} />
          <Text style={styles.infoText}>{user.role}</Text>
        </View>
        {user.location && (
          <View style={styles.infoRow}>
            <MapPin size={16} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.infoText}>{user.location}</Text>
          </View>
        )}
        {user.company && (
          <View style={styles.infoRow}>
            <Building2 size={16} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.infoText}>{user.company}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Calendar size={16} color={COLORS.textSecondary} strokeWidth={2} />
          <Text style={styles.infoText}>Joined {formatDate(user.createdAt)}</Text>
        </View>
      </View>

      {user.status === 'pending' && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onReject}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Reject ${user.name}`}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={onApprove}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Approve ${user.name}`}>
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
      </Pressable>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
    transition: 'all 0.2s ease',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
  },
  userInfo: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  userName: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.warning + '20',
  },
  statusPending: {
    backgroundColor: COLORS.warning + '20',
  },
  statusApproved: {
    backgroundColor: COLORS.success + '20',
  },
  statusRejected: {
    backgroundColor: COLORS.error + '20',
  },
  statusText: {
    ...TYPOGRAPHY.label,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.warning,
    fontSize: FONT_SIZES.xs,
  },
  statusTextApproved: {
    color: COLORS.success,
  },
  statusTextRejected: {
    color: COLORS.error,
  },
  cardBody: {
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  rejectButton: {
    backgroundColor: COLORS.error + '15',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  rejectButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.error,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  approveButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
});

