
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
}
