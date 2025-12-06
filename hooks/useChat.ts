import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation, TypingIndicator } from '@/types/chat';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get conversations where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations:conversation_id (
            id,
            title,
            is_group,
            metadata,
            created_at,
            updated_at
          )
        `)
        .eq('profile_id', user.id);

      if (memberError) throw memberError;

      // Get last message for each conversation and format data
      const conversationIds = memberData.map(m => m.conversation_id);
      
      const conversationsWithMessages = await Promise.all(
        memberData.map(async (member) => {
          const conv = (member as any).conversations;
          
          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count (simplified - messages created after last read)
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id);

          // Get other members for direct messages
          const { data: members } = await supabase
            .from('conversation_members')
            .select('profile_id, profiles:profile_id(full_name)')
            .eq('conversation_id', conv.id)
            .neq('profile_id', user.id);

          const isGroup = conv.is_group || (members && members.length > 1);
          const otherMember = members && members.length > 0 ? (members[0] as any).profiles?.full_name : null;

          return {
            id: conv.id,
            type: isGroup ? 'channel' : 'direct',
            name: conv.title || otherMember || 'Unknown',
            description: conv.metadata?.description || null,
            last_message: lastMsg?.content || null,
            last_message_at: lastMsg?.created_at || conv.created_at,
            unread_count: unreadCount || 0,
            members: [], // simplified
            created_at: conv.created_at,
          } as Conversation;
        })
      );

      setConversations(conversationsWithMessages.sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      ));
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const channels = conversations.filter((c) => c.type === 'channel');
  const directMessages = conversations.filter((c) => c.type === 'direct');
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return { conversations, channels, directMessages, totalUnread, loading, refresh: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user?.id) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          metadata,
          created_at,
          profiles:sender_id(full_name)
        `)
        .eq('conversation_id', conversationId)
        .eq('deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        sender_name: msg.profiles?.full_name || 'Unknown',
        content: msg.content,
        type: 'text',
        created_at: msg.created_at,
        read_by: [], // Simplified - would need separate read_receipts table
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user?.id]);

  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription
    if (conversationId && user?.id) {
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            fetchMessages(); // Refetch to get sender profile
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, user?.id, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || !user?.id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
        });

      if (error) throw error;
      // Message will be added via realtime subscription
    } catch (err) {
      console.error('Error sending message:', err);
    }
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
