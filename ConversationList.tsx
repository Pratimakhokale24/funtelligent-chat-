
import React from 'react';
import ConversationListItem from './ConversationListItem';
import { useDatabase } from '../hooks/useDatabase';
import PlusIcon from './icons/PlusIcon';
import LogoutIcon from './icons/LogoutIcon';

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  activeConversationId?: string;
  onStartNewChat: () => void;
  onLogout: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation, activeConversationId, onStartNewChat, onLogout }) => {
  const { conversations, currentUser } = useDatabase();

  return (
    <div className="bg-white flex flex-col h-full border-r border-gray-200">
      <header className="bg-wa-light-gray p-3 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center">
            {currentUser && (
              <img src={currentUser.avatar} alt={currentUser.name} title={currentUser.name} className="w-10 h-10 rounded-full" />
            )}
            <h2 className="text-xl font-semibold text-gray-800 ml-4">Chats</h2>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onStartNewChat} title="New Chat" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <PlusIcon className="w-6 h-6 text-wa-dark-gray"/>
            </button>
            <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <LogoutIcon className="w-6 h-6 text-wa-dark-gray"/>
            </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map(convo => (
            <ConversationListItem
              key={convo.id}
              conversation={convo}
              isSelected={convo.id === activeConversationId}
              onClick={() => onSelectConversation(convo.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No conversations yet. <br /> Start one by clicking the '+' icon!
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
