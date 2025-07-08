
import React, { useEffect, useRef, useState } from 'react';
import { Conversation, Message } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useDatabase } from '../hooks/useDatabase';
import { geminiService } from '../services/geminiService';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ChatViewProps {
  conversation?: Conversation;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, onBack }) => {
  const { currentUser, messages, getUserById, addMessage, loadMessages } = useDatabase();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const contact = conversation && currentUser
    ? getUserById(conversation.participantIds.find(id => id !== currentUser.id)!)
    : null;
    
  const conversationMessages = conversation ? messages.get(conversation.id) || [] : [];
  
  useEffect(() => {
    if (conversation && !messages.has(conversation.id)) {
      loadMessages(conversation.id);
    }
  }, [conversation, messages, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, isTyping]);
  
  const handleSendMessage = async (text: string) => {
    if (!conversation || !contact || !currentUser) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUser.id,
      text,
      timestamp: Date.now(),
      status: 'sent',
    };
    addMessage(userMessage);
    
    // Only get bot response if the contact is a bot
    if (contact.id.startsWith('bot-')) {
      setIsTyping(true);
      const botResponseText = await geminiService.getBotResponse(text, contact.name);
      setIsTyping(false);
      
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: conversation.id,
        senderId: contact.id,
        text: botResponseText,
        timestamp: Date.now(),
        status: 'delivered',
      };
      addMessage(botMessage);
    }
  };

  if (!conversation || !contact) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-wa-chat-bg bg-opacity-75" style={{backgroundImage: `url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')`}}>
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <h2 className="text-2xl font-light text-wa-dark-gray">Welcome to Funtelligent Chat</h2>
          <p className="mt-2 text-wa-dark-gray">Select a conversation or start a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-wa-chat-bg" style={{backgroundImage: `url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')`}}>
      <header className="bg-wa-light-gray p-3 flex items-center shadow-sm z-10">
        <button onClick={onBack} className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-200">
          <ArrowLeftIcon className="w-6 h-6 text-wa-dark-gray" />
        </button>
        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">{contact.name}</h3>
          <p className="text-xs text-wa-dark-gray">{isTyping ? 'typing...' : (contact.id.startsWith('bot-') ? 'online' : 'Active')}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {conversationMessages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
           {isTyping && (
            <div className="self-start bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatView;