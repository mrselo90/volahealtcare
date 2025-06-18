'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  sessionId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (sessionId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          content: replyContent,
          type: 'admin',
          isRead: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to send reply');
      setReplyContent('');
      await fetchMessages(); // Refresh the list
    } catch (err) {
      setError('Failed to send reply');
      console.error(err);
    }
  };

  const cleanupMessages = async (type: string, sessionId?: string) => {
    if (!confirm('Are you sure you want to delete these messages? This action cannot be undone.')) {
      return;
    }

    setCleanupLoading(true);
    try {
      const url = new URL('/api/admin/messages', window.location.origin);
      url.searchParams.append('type', type);
      if (sessionId) {
        url.searchParams.append('sessionId', sessionId);
      }

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cleanup messages');
      
      const result = await response.json();
      alert(result.message);
      await fetchMessages(); // Refresh the list
      setSelectedSessionId(null);
    } catch (err) {
      setError('Failed to cleanup messages');
      console.error(err);
    } finally {
      setCleanupLoading(false);
    }
  };

  // Group messages by sessionId
  const groupedMessages = messages.reduce((acc, message) => {
    const sessionId = message.sessionId;
    if (!acc[sessionId]) {
      acc[sessionId] = [];
    }
    acc[sessionId].push(message);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chat Messages</h1>
        <div className="flex gap-2">
          <button
            onClick={() => cleanupMessages('bot-messages')}
            disabled={cleanupLoading}
            className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            {cleanupLoading ? 'Cleaning...' : 'Clean Bot Messages'}
          </button>
          <button
            onClick={() => cleanupMessages('old-messages')}
            disabled={cleanupLoading}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {cleanupLoading ? 'Cleaning...' : 'Clean Old Messages (30+ days)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Users list */}
        <div className="col-span-4 rounded-lg border bg-white">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="divide-y">
            {Object.entries(groupedMessages).map(([sessionId, sessionMessages]) => {
              const lastMessage = sessionMessages[sessionMessages.length - 1];
              const userName = sessionMessages.find(msg => msg.name)?.name || 'Anonymous';
              const userEmail = sessionMessages.find(msg => msg.email)?.email;
              return (
                <button
                  key={sessionId}
                  onClick={() => setSelectedSessionId(sessionId)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                    selectedSessionId === sessionId ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {userName} {userEmail ? `(${userEmail})` : ''}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(lastMessage.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">{lastMessage.content}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat messages */}
        <div className="col-span-8 rounded-lg border bg-white">
          {selectedSessionId ? (
            <>
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="font-medium">Session: {selectedSessionId.slice(0, 8)}...</h3>
                <button
                  onClick={() => cleanupMessages('session', selectedSessionId)}
                  disabled={cleanupLoading}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {cleanupLoading ? 'Deleting...' : 'Delete This Session'}
                </button>
              </div>
              <div className="h-[calc(100vh-350px)] overflow-y-auto p-4">
                {groupedMessages[selectedSessionId]?.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.type === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.type === 'admin'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="mt-1 text-xs opacity-75">
                        {format(new Date(message.createdAt), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-lg border px-4 py-2 focus:border-indigo-500 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendReply(selectedSessionId);
                      }
                    }}
                  />
                  <button
                    onClick={() => sendReply(selectedSessionId)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-[calc(100vh-300px)] items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 