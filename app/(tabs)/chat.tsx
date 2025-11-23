import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useConversations, useMessages, useTypingIndicator } from '@/hooks/useChat';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConversationItem } from '@/components/chat/ConversationItem';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { LoadingScreen } from '@/components/LoadingScreen';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, FONT_FAMILY, TYPOGRAPHY } from '@/constants/theme';
import { Hash, MessageSquare, ChevronLeft } from 'lucide-react-native';
import { Conversation } from '@/types/chat';

type TabType = 'channels' | 'direct';

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('channels');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { channels, directMessages, loading: conversationsLoading } = useConversations();
  const { messages, sendMessage } = useMessages(selectedConversation?.id || null);
  const { typingUsers } = useTypingIndicator(selectedConversation?.id || null);

  if (conversationsLoading) {
    return <LoadingScreen />;
  }

  const currentList = activeTab === 'channels' ? channels : directMessages;

  if (selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={0}>
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedConversation(null)}
              activeOpacity={0.7}>
              <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatTitle}>{selectedConversation.name}</Text>
              {selectedConversation.description && (
                <Text style={styles.chatSubtitle} numberOfLines={1}>
                  {selectedConversation.description}
                </Text>
              )}
              {selectedConversation.is_online !== undefined && (
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      selectedConversation.is_online && styles.statusDotOnline,
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {selectedConversation.is_online ? 'Online' : 'Offline'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            inverted={false}
            ListFooterComponent={<TypingIndicator typingUsers={typingUsers} />}
          />

          <ChatInput onSend={sendMessage} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'channels' && styles.activeTab]}
          onPress={() => setActiveTab('channels')}
          activeOpacity={0.7}>
          <Hash
            size={20}
            color={activeTab === 'channels' ? COLORS.primary : COLORS.textSecondary}
            strokeWidth={2}
          />
          <Text
            style={[styles.tabText, activeTab === 'channels' && styles.activeTabText]}>
            Channels
          </Text>
          {channels.some((c) => c.unread_count > 0) && <View style={styles.tabBadge} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'direct' && styles.activeTab]}
          onPress={() => setActiveTab('direct')}
          activeOpacity={0.7}>
          <MessageSquare
            size={20}
            color={activeTab === 'direct' ? COLORS.primary : COLORS.textSecondary}
            strokeWidth={2}
          />
          <Text style={[styles.tabText, activeTab === 'direct' && styles.activeTabText]}>
            Direct
          </Text>
          {directMessages.some((c) => c.unread_count > 0) && <View style={styles.tabBadge} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentList}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => setSelectedConversation(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.inputBackground,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  tabText: {
    fontFamily: FONT_FAMILY.bodyMedium,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  tabBadge: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error,
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    ...SHADOWS.xs,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatTitle: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  chatSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.textSecondary,
  },
  statusDotOnline: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  messagesList: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
});
