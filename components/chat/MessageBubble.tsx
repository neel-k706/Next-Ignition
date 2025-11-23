import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '@/constants/theme';
import { Message } from '@/types/chat';
import { MOCK_USER_ID } from '@/hooks/useMockData';
import { Check, CheckCheck } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOwnMessage = message.sender_id === MOCK_USER_ID;
  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}>
      <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
        {!isOwnMessage && <Text style={styles.senderName}>{message.sender_name}</Text>}
        <Text style={[styles.content, isOwnMessage && styles.ownContent]}>
          {message.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.time, isOwnMessage && styles.ownTime]}>{time}</Text>
          {isOwnMessage && (
            <View style={styles.readReceipt}>
              {message.read_by && message.read_by.length > 0 ? (
                <CheckCheck size={14} color={COLORS.primary} strokeWidth={2.5} />
              ) : (
                <Check size={14} color={COLORS.textSecondary} strokeWidth={2.5} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  otherBubble: {
    backgroundColor: COLORS.inputBackground,
    borderBottomLeftRadius: SPACING.xs,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SPACING.xs,
  },
  senderName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs / 2,
  },
  content: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.xs / 2,
  },
  ownContent: {
    color: COLORS.background,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    marginTop: SPACING.xs / 2,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  ownTime: {
    color: COLORS.background,
    opacity: 0.8,
  },
  readReceipt: {
    marginLeft: SPACING.xs / 2,
  },
});
