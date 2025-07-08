
import { User, Message, Conversation } from '../types';
import { MOCK_USERS } from '../constants';

const USERS_KEY = 'chat_app_users';
const CONVERSATIONS_KEY = 'chat_app_conversations';
const MESSAGES_KEY = 'chat_app_messages';

const seedInitialData = () => {
  // Seed Bot Users if not present
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  }

  // Ensure conversation and message stores exist
  if (!localStorage.getItem(CONVERSATIONS_KEY)) {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  }
};

seedInitialData();

export const databaseService = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  getUserById: (id: string): User | undefined => {
    const users = databaseService.getUsers();
    return users.find(u => u.id === id);
  },

  addUser: (user: User): boolean => {
    const users = databaseService.getUsers();
    if (users.some(u => u.id === user.id)) {
      console.warn(`User with id ${user.id} already exists.`);
      return false;
    }
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  getConversationsForUser: (userId: string): Conversation[] => {
    const allConversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]') as Conversation[];
    return allConversations
      .filter(c => c.participantIds.includes(userId))
      .sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0));
  },

  createConversation: (participantIds: string[]): Conversation => {
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]') as Conversation[];

    const existingConversation = conversations.find(c =>
      c.participantIds.length === participantIds.length &&
      c.participantIds.every(pId => participantIds.includes(pId))
    );

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random()}`,
      participantIds,
    };
    conversations.push(newConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    return newConversation;
  },

  getMessages: (conversationId: string): Message[] => {
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') as Message[];
    return allMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp);
  },

  addMessage: (message: Message): void => {
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') as Message[];
    allMessages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]') as Conversation[];
    const conversationIndex = conversations.findIndex(c => c.id === message.conversationId);
    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage = message;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  },
};
