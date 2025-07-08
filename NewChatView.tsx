
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SearchIcon from './icons/SearchIcon';

interface NewChatViewProps {
  onSelectUser: (userId: string) => void;
  onCancel: () => void;
}

const NewChatView: React.FC<NewChatViewProps> = ({ onSelectUser, onCancel }) => {
  const { users, currentUser } = useDatabase();
  const [searchQuery, setSearchQuery] = useState('');

  const availableContacts = useMemo(() => {
    if (!currentUser) return [];
    
    const otherUsers = users.filter(user => user.id !== currentUser.id);
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return otherUsers;
    }

    return otherUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
  }, [users, currentUser, searchQuery]);

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <header className="bg-wa-light-green text-white p-3 flex items-center shadow-md flex-shrink-0 z-10">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-white/20">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">New Chat</h2>
          <p className="text-sm opacity-90">{availableContacts.length} contacts</p>
        </div>
      </header>
      
      {/* Search Bar */}
      <div className="bg-wa-light-gray p-2 border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-full pl-10 pr-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-wa-teal-green"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {availableContacts.length > 0 ? (
          <ul>
            {availableContacts.map(user => (
              <li key={user.id}>
                <button
                  onClick={() => onSelectUser(user.id)}
                  className="w-full flex items-center p-3 text-left hover:bg-wa-light-gray transition-colors border-b border-gray-100"
                >
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black truncate">{user.name}</h4>
                    <p className="text-sm text-black truncate">User ID: {user.id}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-black">
            No contacts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChatView;
