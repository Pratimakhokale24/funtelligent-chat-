
import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div className="bg-wa-light-gray p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-grow bg-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wa-teal-green transition"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="bg-wa-light-green text-white rounded-full p-3 flex items-center justify-center hover:bg-wa-teal-green disabled:bg-wa-gray disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
