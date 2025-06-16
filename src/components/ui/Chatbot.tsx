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

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      {/* Chat button - Mobile optimized */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-24 right-4 z-30 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <svg
          className={`h-6 w-6 sm:h-8 sm:w-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
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

      {/* Chat window - Mobile responsive */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[35] md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed z-40 bg-white shadow-2xl 
                         bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh] 
                         md:bottom-24 md:right-4 md:left-auto md:w-96 md:max-h-[600px] md:rounded-lg md:max-w-sm
                         lg:right-6 lg:w-[400px] lg:max-w-md"
            >
              {/* Header - Mobile optimized */}
              <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:p-4 rounded-t-2xl md:rounded-t-lg">
                <h3 className="text-base sm:text-lg font-semibold truncate">Vola Health Istanbul Chat</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
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

              {/* Messages container - Mobile responsive height */}
              <div className="overflow-y-auto p-3 sm:p-4 mobile-scroll" 
                   style={{ 
                     height: 'calc(60vh - 120px)', 
                     maxHeight: window.innerWidth < 768 ? 'calc(85vh - 180px)' : '400px' 
                   }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 sm:mb-4 flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 sm:px-4 sm:py-2 max-w-[85%] sm:max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm sm:text-base break-words">{message.text}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact form - Mobile responsive */}
              {showContactForm ? (
                <form onSubmit={handleContactSubmit} className="border-t p-3 sm:p-4 bg-gray-50">
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-xs sm:text-sm font-medium">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-xs sm:text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-xs sm:text-sm font-medium">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="mb-1 block text-xs sm:text-sm font-medium">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={userCountry}
                        onChange={(e) => setUserCountry(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-3 text-white transition-all duration-300 transform hover:scale-[1.02] min-h-[44px] font-medium"
                  >
                    Submit Contact Information
                  </button>
                </form>
              ) : (
                /* Message input - Mobile responsive */
                <form onSubmit={handleSubmit} className="border-t p-3 sm:p-4">
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base min-h-[44px]"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-3 py-2 sm:px-4 sm:py-2 text-white transition-all duration-300 transform hover:scale-105 min-h-[44px] min-w-[60px] flex items-center justify-center"
                      aria-label="Send message"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 