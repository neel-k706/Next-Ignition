export type MessageType = 'text' | 'image' | 'file';
export type ConversationType = 'channel' | 'direct';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  type: MessageType;
  created_at: string;
  read_by: string[];
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  description?: string;
  avatar?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  members: string[];
  is_online?: boolean;
  typing_users?: string[];
  created_at: string;
}

export interface TypingIndicator {
  conversation_id: string;
  user_id: string;
  user_name: string;
  timestamp: string;
}
