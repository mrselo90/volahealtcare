'use client';

import { useState, useEffect } from 'react';
import { RiMailLine, RiSearchLine, RiReplyLine, RiDeleteBinLine, RiMailOpenLine, RiMailUnreadLine, RiCheckboxBlankLine, RiCheckboxLine } from 'react-icons/ri';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sessionId: string;
  content: string;
  type: 'user' | 'admin';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/messages')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
      })
      .then((data) => {
        setMessages(data);
        // Select the first message by default if available
        if (data.length > 0 && !selectedMessage) {
          setSelectedMessage(data[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Group messages by session
  const groupedMessages = messages.reduce<Record<string, Message[]>>((acc, message) => {
    if (!acc[message.sessionId]) {
      acc[message.sessionId] = [];
    }
    acc[message.sessionId].push(message);
    return acc;
  }, {});

  // Get the latest message from each session
  const latestMessages = Object.values(groupedMessages).map(sessionMessages => {
    return sessionMessages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  });

  const filteredMessages = latestMessages.filter(message => {
    const userName = message.user?.name || 'Unknown';
    const userEmail = message.user?.email || '';
    const matchesSearch = userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || !message.isRead;
    return matchesSearch && matchesFilter;
  });
  
  // Find all messages for the selected conversation
  const selectedConversation = selectedMessage 
    ? groupedMessages[selectedMessage.sessionId]?.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ) 
    : [];

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      console.log('Attempting to delete message:', id);
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert(`Failed to delete message: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      const result = await response.json();
      console.log('Delete successful:', result);
      
      // Update local state only if delete was successful
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(filteredMessages[0] || null);
      }
      
      alert('Message deleted successfully!');
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const handleBulkSelect = (messageId: string, checked: boolean) => {
    const newSelected = new Set(selectedMessages);
    if (checked) {
      newSelected.add(messageId);
    } else {
      newSelected.delete(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(filteredMessages.map(msg => msg.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedMessages.size} message(s)?`)) return;
    
    setBulkDeleteLoading(true);
    try {
      // Delete messages one by one
      const deletePromises = Array.from(selectedMessages).map(id =>
        fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      // Update local state
      setMessages(messages.filter(msg => !selectedMessages.has(msg.id)));
      setSelectedMessages(new Set());
      
      // Update selected message if it was deleted
      if (selectedMessage && selectedMessages.has(selectedMessage.id)) {
        const remainingMessages = filteredMessages.filter(msg => !selectedMessages.has(msg.id));
        setSelectedMessage(remainingMessages[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete messages:', error);
      alert('Some messages could not be deleted. Please try again.');
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
            {selectedMessages.size > 0 && (
              <span className="ml-2 text-blue-600">
                ({selectedMessages.size} selected)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedMessages.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteLoading}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <RiDeleteBinLine className="w-4 h-4 mr-2" />
              {bulkDeleteLoading ? 'Deleting...' : `Delete ${selectedMessages.size}`}
            </button>
          )}
          
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <RiMailLine className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md">
            When you receive messages, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${activeFilter === 'all' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All Messages
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${activeFilter === 'unread' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Unread
              </button>
            </div>

            {/* Bulk Select Header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
              <button
                onClick={handleSelectAll}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {selectedMessages.size === filteredMessages.length && filteredMessages.length > 0 ? (
                  <RiCheckboxLine className="w-5 h-5 mr-2 text-blue-600" />
                ) : (
                  <RiCheckboxBlankLine className="w-5 h-5 mr-2" />
                )}
                {selectedMessages.size === filteredMessages.length && filteredMessages.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <li 
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${!message.isRead ? 'bg-blue-50' : ''} ${
                    selectedMessage?.id === message.id ? 'bg-amber-50 border-r-4 border-amber-500' : ''
                  } ${selectedMessages.has(message.id) ? 'bg-blue-100' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBulkSelect(message.id, !selectedMessages.has(message.id));
                      }}
                      className="mt-1 text-gray-400 hover:text-blue-600"
                    >
                      {selectedMessages.has(message.id) ? (
                        <RiCheckboxLine className="w-5 h-5 text-blue-600" />
                      ) : (
                        <RiCheckboxBlankLine className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div 
                      className="flex-1 cursor-pointer min-w-0"
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) markAsRead(message.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {message.user?.name || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{message.user?.email || 'No email'}</p>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Message Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {selectedMessage ? (
              <>
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedMessage.user?.name || 'Unknown User'}</h2>
                      <p className="text-sm text-gray-500">{selectedMessage.user?.email || 'No email'}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAsRead(selectedMessage.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        title={selectedMessage.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {selectedMessage.isRead ? (
                          <RiMailUnreadLine className="h-5 w-5" />
                        ) : (
                          <RiMailOpenLine className="h-5 w-5" />
                        )}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50" title="Reply">
                        <RiReplyLine className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <RiDeleteBinLine className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <div className="space-y-4">
                      {selectedConversation.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-4 rounded-lg ${msg.type === 'admin' ? 'bg-amber-50 ml-8' : 'bg-gray-50 mr-8'}`}
                        >
                          <p className="whitespace-pre-line text-gray-700">{msg.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                            {msg.type === 'admin' ? ' (You)' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter' && selectedMessage && e.currentTarget.value.trim()) {
                          const content = e.currentTarget.value.trim();
                          e.currentTarget.value = '';
                          
                          try {
                            const response = await fetch('/api/admin/messages', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                sessionId: selectedMessage.sessionId,
                                content: content,
                              }),
                            });

                            if (response.ok) {
                              const newMessage = await response.json();
                              setMessages(prev => [...prev, newMessage]);
                            }
                          } catch (error) {
                            console.error('Failed to send message:', error);
                          }
                        }
                      }}
                    />
                    <button
                      className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      onClick={async (e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (selectedMessage && input?.value.trim()) {
                          const content = input.value.trim();
                          input.value = '';
                          
                          try {
                            const response = await fetch('/api/admin/messages', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                sessionId: selectedMessage.sessionId,
                                content: content,
                              }),
                            });

                            if (response.ok) {
                              const newMessage = await response.json();
                              setMessages(prev => [...prev, newMessage]);
                            }
                          } catch (error) {
                            console.error('Failed to send message:', error);
                          }
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <RiMailLine className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No message selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a message to view its contents
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}