
import React, { useState } from 'react';
import { DatabaseProvider } from './hooks/useDatabase';
import Login from './components/Login';
import ChatLayout from './components/ChatLayout';
import { databaseService } from './services/databaseService';
import { User, Message } from './types';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    () => localStorage.getItem('chat_app_current_user_id')
  );

  const handleLogin = (id: string, name: string) => {
    const existingUser = databaseService.getUserById(id);
    if (!existingUser) {
      const newUser: User = {
        id,
        name,
        avatar: `https://i.pravatar.cc/150?u=${id}`,
      };
      databaseService.addUser(newUser);

      // For new users, automatically start conversations with all bots
      // and add a welcome message from each bot.
      const bots = MOCK_USERS.filter(u => u.id.startsWith('bot-'));
      bots.forEach(bot => {
        const newConversation = databaseService.createConversation([newUser.id, bot.id]);
        
        const welcomeMessage: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          conversationId: newConversation.id,
          senderId: bot.id,
          text: `Hi ${name}! I'm ${bot.name}, ready to chat.`,
          timestamp: Date.now(),
          status: 'delivered',
        };
        databaseService.addMessage(welcomeMessage);
      });
    }
    localStorage.setItem('chat_app_current_user_id', id);
    setCurrentUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_app_current_user_id');
    setCurrentUserId(null);
  };

  if (!currentUserId) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <DatabaseProvider userId={currentUserId}>
      <ChatLayout onLogout={handleLogout} />
    </DatabaseProvider>
  );
};

export default App;
