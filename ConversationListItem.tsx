
import React from 'react';
import { Conversation } from '../types';
import { useDatabase } from '../hooks/useDatabase';
import CheckIcon from './icons/CheckIcon';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isSelected, onClick }) => {
  const { currentUser, getUserById } = useDatabase();
  if (!currentUser) return null;

  const contactId = conversation.participantIds.find(id => id !== currentUser.id);
  const contact = contactId ? getUserById(contactId) : null;

  if (!contact) return null;

  const lastMessage = conversation.lastMessage;
  const lastMessageTime = lastMessage
    ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    : '';
  
  const isLastMessageSentByUser = lastMessage?.senderId === currentUser.id;
  const messagePreview = lastMessage ? lastMessage.text : 'No messages yet';

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-colors border-b border-gray-100 ${
        isSelected ? 'bg-gray-200' : 'hover:bg-wa-light-gray'
      }`}
    >
      <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-800 truncate">{contact.name}</h4>
          <span className={`text-xs ${isSelected ? 'text-wa-dark-gray' : 'text-wa-teal-green'}`}>{lastMessageTime}</span>
        </div>
        <div className="flex items-center text-sm text-wa-dark-gray mt-1">
          {isLastMessageSentByUser && lastMessage && (
            <div className="relative w-4 h-4 mr-1 flex-shrink-0">
               <CheckIcon className={`absolute w-4 h-4 ${lastMessage.status === 'read' ? 'text-wa-teal-green' : 'text-wa-gray'}`} />
              {lastMessage.status !== 'sent' && <CheckIcon className={`absolute w-4 h-4 left-[5px] ${lastMessage.status === 'read' ? 'text-wa-teal-green' : 'text-wa-gray'}`} />}
            </div>
          )}
          <p className="truncate">{messagePreview}</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;
