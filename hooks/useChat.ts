import { useState, useEffect } from 'react';
import { Message, Conversation, TypingIndicator } from '@/types/chat';
import { MOCK_USER_ID } from './useMockData';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'channel-1',
    type: 'channel',
    name: 'General',
    description: 'General discussions and announcements',
    last_message: 'Welcome to NextIgnition!',
    last_message_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread_count: 2,
    members: ['user-1', 'user-2', 'user-3'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'channel-2',
    type: 'channel',
    name: 'Founders',
    description: 'Connect with fellow founders',
    last_message: 'Anyone working on SaaS products?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread_count: 5,
    members: ['user-1', 'user-2', 'user-3', 'user-4'],
    typing_users: ['Sarah Chen'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'channel-3',
    type: 'channel',
    name: 'Investors',
    description: 'Investment opportunities and discussions',
    last_message: 'Looking for seed stage startups',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unread_count: 0,
    members: ['user-1', 'user-5', 'user-6'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'dm-1',
    type: 'direct',
    name: 'Sarah Chen',
    last_message: 'Thanks for the intro!',
    last_message_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    unread_count: 1,
    members: [MOCK_USER_ID, 'user-2'],
    is_online: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'dm-2',
    type: 'direct',
    name: 'Michael Rodriguez',
    last_message: 'Let me know if you need any help',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread_count: 0,
    members: [MOCK_USER_ID, 'user-3'],
    is_online: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'channel-1': [
    {
      id: 'msg-1',
      conversation_id: 'channel-1',
      sender_id: 'admin',
      sender_name: 'NextIgnition Team',
      content: 'Welcome to NextIgnition! This is the general channel for all members.',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read_by: [MOCK_USER_ID],
    },
    {
      id: 'msg-2',
      conversation_id: 'channel-1',
      sender_id: 'user-2',
      sender_name: 'Sarah Chen',
      content: 'Excited to be here! Looking forward to connecting with everyone.',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      read_by: [MOCK_USER_ID],
    },
    {
      id: 'msg-3',
      conversation_id: 'channel-1',
      sender_id: 'user-3',
      sender_name: 'Michael Rodriguez',
      content: 'Great to see so many founders here!',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read_by: [],
    },
  ],
  'channel-2': [
    {
      id: 'msg-4',
      conversation_id: 'channel-2',
      sender_id: 'user-4',
      sender_name: 'Emma Thompson',
      content: 'Anyone working on SaaS products?',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read_by: [],
    },
    {
      id: 'msg-5',
      conversation_id: 'channel-2',
      sender_id: MOCK_USER_ID,
      sender_name: 'Alex Johnson',
      content: 'I am! Currently building CloudSync.',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read_by: [],
    },
  ],
  'dm-1': [
    {
      id: 'msg-6',
      conversation_id: 'dm-1',
      sender_id: MOCK_USER_ID,
      sender_name: 'Alex Johnson',
      content: 'Hey Sarah! I wanted to introduce you to a potential investor.',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read_by: ['user-2'],
    },
    {
      id: 'msg-7',
      conversation_id: 'dm-1',
      sender_id: 'user-2',
      sender_name: 'Sarah Chen',
      content: 'Thanks for the intro!',
      type: 'text',
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      read_by: [],
    },
  ],
};

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const channels = conversations.filter((c) => c.type === 'channel');
  const directMessages = conversations.filter((c) => c.type === 'direct');
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return { conversations, channels, directMessages, totalUnread, loading };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setMessages(MOCK_MESSAGES[conversationId] || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [conversationId]);

  const sendMessage = (content: string) => {
    if (!conversationId || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: MOCK_USER_ID,
      sender_name: 'Alex Johnson',
      content: content.trim(),
      type: 'text',
      created_at: new Date().toISOString(),
      read_by: [MOCK_USER_ID],
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return { messages, loading, sendMessage };
}

export function useTypingIndicator(conversationId: string | null) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!conversationId) {
      setTypingUsers([]);
      return;
    }

    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    if (conversation?.typing_users) {
      setTypingUsers(conversation.typing_users);
    } else {
      setTypingUsers([]);
    }
  }, [conversationId]);

  return { typingUsers };
}
