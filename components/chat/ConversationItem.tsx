import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Hash } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '@/constants/theme';
import { Conversation } from '@/types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
  isSelected?: boolean;
}

export function ConversationItem({ conversation, onPress, isSelected }: ConversationItemProps) {
  const Icon = conversation.type === 'channel' ? Hash : User;
  const time = conversation.last_message_at
    ? new Date(conversation.last_message_at).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={isSelected ? COLORS.background : COLORS.primary} />
        {conversation.is_online && <View style={styles.onlineBadge} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, isSelected && styles.selectedText]} numberOfLines={1}>
            {conversation.name}
          </Text>
          {time && (
            <Text style={[styles.time, isSelected && styles.selectedText]}>{time}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              styles.lastMessage,
              isSelected && styles.selectedText,
              conversation.unread_count > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}>
            {conversation.typing_users && conversation.typing_users.length > 0
              ? `${conversation.typing_users[0]} is typing...`
              : conversation.last_message || 'No messages yet'}
          </Text>
          {conversation.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs / 2,
  },
  name: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  unreadMessage: {
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs / 2,
  },
  unreadText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
  },
  selectedText: {
    color: COLORS.background,
  },
});
