
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Message, Conversation } from '../types';
import { databaseService } from '../services/databaseService';

interface DatabaseContextType {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  messages: Map<string, Message[]>;
  getUserById: (id: string) => User | undefined;
  addMessage: (message: Message) => void;
  loadMessages: (conversationId: string) => void;
  startConversation: (targetUserId: string) => Promise<Conversation | null>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode; userId: string }> = ({ children, userId }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());

  useEffect(() => {
    const allUsers = databaseService.getUsers();
    setUsers(allUsers);
    const user = allUsers.find(u => u.id === userId);
    setCurrentUser(user || null);
  }, [userId]);

  useEffect(() => {
    if (currentUser) {
      setConversations(databaseService.getConversationsForUser(currentUser.id));
    } else {
      setConversations([]);
    }
  }, [currentUser, messages]); // Rerun when messages change to update lastMessage

  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(u => u.id === id);
  }, [users]);

  const addMessage = useCallback((message: Message) => {
    databaseService.addMessage(message);
    setMessages(prevMessages => {
      const newMessages = new Map(prevMessages);
      const currentMessages = newMessages.get(message.conversationId) || [];
      newMessages.set(message.conversationId, [...currentMessages, message]);
      return newMessages;
    });
    // Trigger conversation refresh by depending on 'messages' in the useEffect above
  }, []);

  const loadMessages = useCallback((conversationId: string) => {
    const loadedMessages = databaseService.getMessages(conversationId);
    setMessages(prevMessages => {
      const newMessages = new Map(prevMessages);
      newMessages.set(conversationId, loadedMessages);
      return newMessages;
    });
  }, []);

  const startConversation = useCallback(async (targetUserId: string): Promise<Conversation | null> => {
    if (!currentUser) return null;
    const newConversation = databaseService.createConversation([currentUser.id, targetUserId]);
    setConversations(databaseService.getConversationsForUser(currentUser.id));
    return newConversation;
  }, [currentUser]);

  const value = { currentUser, users, conversations, messages, getUserById, addMessage, loadMessages, startConversation };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
