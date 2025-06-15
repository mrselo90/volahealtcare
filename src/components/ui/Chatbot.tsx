'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      text: 'Hello! How can I help you with your medical tourism needs at Vola Health Istanbul today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  // Generate a session ID when the component mounts
  useEffect(() => {
    // Check if we already have a session ID in localStorage
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate a new session ID
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  // Save initial bot message to database when session ID is available
  useEffect(() => {
    if (sessionId && messages.length === 1) {
      saveMessageToDatabase(messages[0]);
    }
  }, [sessionId, messages]);

  const saveMessageToDatabase = async (message: Message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          content: message.text,
          type: message.sender === 'user' ? 'user' : 'bot',
          name: userName,
          email: userEmail,
          phone: userPhone,
          country: userCountry,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save message to database');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Save user message to database
    await saveMessageToDatabase(userMessage);

    // If this is the first user message, ask for contact info
    if (!showContactForm && messages.length === 1) {
      setTimeout(() => {
        const contactRequestMessage: Message = {
          id: uuidv4(),
          text: 'Thank you for your message. To better assist you, could you please provide your contact information?',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, contactRequestMessage]);
        saveMessageToDatabase(contactRequestMessage);
        setShowContactForm(true);
      }, 1000);
    } else {
      // Standard bot response
      setTimeout(() => {
        const botMessage: Message = {
          id: uuidv4(),
          text: 'Thank you for your message. One of our medical consultants will get back to you shortly.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        saveMessageToDatabase(botMessage);
      }, 1000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a message summarizing the contact info
    const contactInfoMessage: Message = {
      id: uuidv4(),
      text: `Contact information received:
Name: ${userName}
Email: ${userEmail}
Phone: ${userPhone}
Country: ${userCountry}`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, contactInfoMessage]);
    saveMessageToDatabase(contactInfoMessage);
    setShowContactForm(false);
    
    // Bot response after contact info submission
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        text: 'Thank you for providing your contact information. How else can I assist you with your medical tourism needs at Vola Health Istanbul?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      saveMessageToDatabase(botMessage);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500"
      >
        <svg
          className={`h-8 w-8 transition-transform ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          )}
        </svg>
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-24 z-40 w-96 rounded-lg bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Vola Health Istanbul Chat</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close chat</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className="mt-1 text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showContactForm ? (
              <form onSubmit={handleContactSubmit} className="border-t p-4">
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="mb-1 block text-sm font-medium">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={userCountry}
                      onChange={(e) => setUserCountry(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                >
                  Submit Contact Information
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 