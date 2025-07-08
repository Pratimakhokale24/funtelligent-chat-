import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatView from './ChatView';
import { useDatabase } from '../hooks/useDatabase';
import NewChatView from './NewChatView';

interface ChatLayoutProps {
  onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ onLogout }) => {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const { conversations, startConversation, currentUser } = useDatabase();

  const handleSelectConversation = (id: string) => {
    setIsCreatingNewChat(false);
    setActiveConversationId(id);
  };
  
  const handleStartNewChat = () => {
    setActiveConversationId(undefined); // Deselect active chat when opening contact list
    setIsCreatingNewChat(true);
  };

  const handleCancelNewChat = () => {
    setIsCreatingNewChat(false);
  };

  const handleSelectUserForNewChat = async (targetUserId: string) => {
    if (!currentUser) return;

    if (targetUserId === currentUser.id) {
        alert("You cannot start a conversation with yourself.");
        return;
    }

    // Check if a 1-on-1 conversation with this user already exists.
    const existingConversation = conversations.find(c => 
        c.participantIds.length === 2 && 
        c.participantIds.includes(targetUserId)
    );

    if (existingConversation) {
        // If it exists, just make it active.
        setActiveConversationId(existingConversation.id);
    } else {
        // Otherwise, create a new one.
        const newConversation = await startConversation(targetUserId);
        if (newConversation) {
            setActiveConversationId(newConversation.id);
        }
    }
    
    // Hide the new chat screen and show the conversation.
    setIsCreatingNewChat(false);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const handleBackFromChat = () => setActiveConversationId(undefined);

  // On mobile, the chat view is shown only when a conversation is active
  // AND the user is not in the process of creating a new chat.
  const showChatViewOnMobile = activeConversationId && !isCreatingNewChat;

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full h-full max-w-7xl mx-auto shadow-2xl rounded-none sm:rounded-lg overflow-hidden grid grid-cols-12">
        {/* --- Left Panel: Conversation List or New Chat View --- */}
        <div className={`
          ${showChatViewOnMobile ? 'hidden md:block' : 'block'} 
          col-span-12 md:col-span-4 lg:col-span-3 h-full
        `}>
          {isCreatingNewChat ? (
            <NewChatView onSelectUser={handleSelectUserForNewChat} onCancel={handleCancelNewChat} />
          ) : (
            <ConversationList
              onSelectConversation={handleSelectConversation}
              activeConversationId={activeConversationId}
              onStartNewChat={handleStartNewChat}
              onLogout={onLogout}
            />
          )}
        </div>
        
        {/* --- Right Panel: Chat View or Placeholder --- */}
        <div className={`
          ${showChatViewOnMobile ? 'block' : 'hidden md:block'} 
          col-span-12 md:col-span-8 lg:col-span-9 h-full
        `}>
          <ChatView conversation={activeConversation} onBack={handleBackFromChat} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;