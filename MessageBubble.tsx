
import React from 'react';
import { Message } from '../types';
import CheckIcon from './icons/CheckIcon';
import { useDatabase } from '../hooks/useDatabase';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { currentUser } = useDatabase();
  const isSentByUser = message.senderId === currentUser?.id;

  const bubbleClasses = isSentByUser
    ? 'bg-wa-message-sent self-end'
    : 'bg-wa-message-received self-start';
  
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div
      className={`relative rounded-lg px-3 py-2 max-w-sm md:max-w-md shadow-sm ${bubbleClasses}`}
    >
      <p className="text-sm text-black break-words">{message.text}</p>
      <div className="flex items-center justify-end mt-1 h-4">
        <span className="text-xs text-wa-gray mr-1">
          {time}
        </span>
        {isSentByUser && (
          <div className="relative w-4 h-4">
            <CheckIcon className={`absolute w-4 h-4 text-wa-gray ${message.status === 'read' ? 'text-wa-teal-green' : ''}`} />
            {message.status !== 'sent' && <CheckIcon className={`absolute w-4 h-4 left-[5px] text-wa-gray ${message.status === 'read' ? 'text-wa-teal-green' : ''}`} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
