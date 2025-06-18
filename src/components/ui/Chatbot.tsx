'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from '@/lib/i18n/hooks';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      text: t('chatbot.welcome') || 'Hello! How can I help you with your medical tourism needs at Vola Health Istanbul today?',
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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate a session ID when the component mounts
  useEffect(() => {
    // Check if we already have a session ID in localStorage
    let storedSessionId = localStorage.getItem('chatSessionId');
    const sessionExpiry = localStorage.getItem('chatSessionExpiry');
    
    // Check if session is expired (24 hours)
    if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
      localStorage.removeItem('chatSessionId');
      localStorage.removeItem('chatSessionExpiry');
      storedSessionId = null;
    }
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate a new session ID
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
      // Set expiry to 24 hours from now
      localStorage.setItem('chatSessionExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString());
    }
    setIsSessionInitialized(true);
  }, []);

  // Save initial bot message to database only once per session
  useEffect(() => {
    if (sessionId && isSessionInitialized && !hasUserInteracted) {
      const shouldSaveWelcome = localStorage.getItem(`chatWelcome_${sessionId}`);
      if (!shouldSaveWelcome) {
        saveMessageToDatabase(messages[0]);
        localStorage.setItem(`chatWelcome_${sessionId}`, 'true');
      }
    }
  }, [sessionId, isSessionInitialized]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const saveMessageToDatabase = async (message: Message) => {
    // Prevent duplicate saves
    if (message.id && localStorage.getItem(`saved_${message.id}`)) {
      return;
    }
    
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

      if (response.ok) {
        // Mark message as saved to prevent duplicates
        localStorage.setItem(`saved_${message.id}`, 'true');
      } else {
        console.error('Failed to save message to database');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Mark that user has interacted
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');

    // Save user message to database
    await saveMessageToDatabase(userMessage);

    // If this is the first user message, ask for contact info
    if (!showContactForm && !userName && !userEmail) {
      setTimeout(() => {
        const contactRequestMessage: Message = {
          id: uuidv4(),
          text: t('chatbot.contactRequest') || 'Thank you for your message. To better assist you, could you please provide your contact information?',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, contactRequestMessage]);
        // Only save contact request message to database (not standard responses)
        saveMessageToDatabase(contactRequestMessage);
        setShowContactForm(true);
      }, 1000);
    } else if (userName && userEmail) {
      // Only show standard response if contact info is already provided
      setTimeout(() => {
        const botMessage: Message = {
          id: uuidv4(),
          text: t('chatbot.standardResponse') || 'Thank you for your message. One of our medical consultants will get back to you shortly.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        // Don't save standard bot responses to reduce database clutter
      }, 1000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a message summarizing the contact info
    const contactInfoMessage: Message = {
      id: uuidv4(),
      text: t('chatbot.contactInfoReceived', {
        name: userName,
        email: userEmail,
        phone: userPhone,
        country: userCountry
      }) || `Contact information received:
Name: ${userName}
Email: ${userEmail}
Phone: ${userPhone}
Country: ${userCountry}`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, contactInfoMessage]);
    saveMessageToDatabase(contactInfoMessage);
    setShowContactForm(false);
    
    // Bot response after contact info submission (shown but not saved to reduce clutter)
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        text: t('chatbot.contactInfoResponse') || 'Thank you for providing your contact information. How else can I assist you with your medical tourism needs at Vola Health Istanbul?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      // Don't save standard bot responses to reduce database clutter
    }, 1000);
  };

  // Touch handlers for pull-to-close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -50; // At least 50px down swipe
    
    if (isDownSwipe) {
      setIsOpen(false);
    }
    
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      {/* Chat button - Mobile optimized */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-24 right-4 z-30 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
        aria-label={isOpen ? t('chatbot.closeChat') || 'Close chat' : t('chatbot.openChat') || 'Open chat'}
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
              initial={{ 
                opacity: 0, 
                y: window.innerWidth < 768 ? 100 : 20,
                scale: window.innerWidth < 768 ? 0.95 : 1 
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                y: window.innerWidth < 768 ? 100 : 20,
                scale: window.innerWidth < 768 ? 0.95 : 1 
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed z-40 bg-white shadow-2xl 
                         bottom-0 left-0 right-0 rounded-t-2xl max-h-[92vh] flex flex-col
                         md:bottom-24 md:right-4 md:left-auto md:w-[480px] md:max-h-[700px] md:rounded-lg
                         lg:right-6 lg:w-[520px] lg:max-h-[750px]
                         xl:w-[580px] xl:max-h-[800px]"
            >
              {/* Mobile pull indicator */}
              <div 
                className={`md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl flex justify-center py-3 cursor-pointer transition-all duration-200 touch-manipulation ${
                  isDragging ? 'bg-indigo-700 scale-105' : 'active:bg-indigo-700'
                }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex flex-col items-center gap-1">
                  <motion.div 
                    className="w-16 h-2 bg-white/60 rounded-full"
                    animate={{ 
                      scaleX: isDragging ? 1.2 : 1,
                      opacity: isDragging ? 0.8 : 0.6 
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div 
                    className="text-white/70 text-xs font-medium"
                    animate={{ 
                      scale: isDragging ? 0.95 : 1,
                      opacity: isDragging ? 1 : 0.7 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDragging ? 'Release to close' : 'Pull down to close'}
                  </motion.div>
                </div>
              </div>
              
              {/* Header - Mobile optimized */}
              <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:p-4 md:rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-base sm:text-lg font-semibold truncate">{t('chatbot.title') || 'Vola Health Chat'}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white transition-all p-2 hover:bg-white/20 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center bg-white/10 hover:scale-105 active:scale-95 shadow-lg"
                  aria-label={t('chatbot.closeChat') || 'Close chat'}
                >
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7 stroke-[3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Messages container - Mobile responsive height */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 mobile-scroll min-h-0 messages-container" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`mb-3 sm:mb-4 flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%] sm:max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {message.sender === 'user' ? 'U' : 'V'}
                      </div>
                      
                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm sm:text-base break-words leading-relaxed">{message.text}</div>
                        <div className={`mt-1 text-xs ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator placeholder */}
                <div className="h-4"></div>
              </div>

              {/* Contact form - Mobile responsive */}
              {showContactForm ? (
                <motion.form 
                  onSubmit={handleContactSubmit} 
                  className="border-t p-3 sm:p-4 bg-gray-50 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Please provide your contact information</p>
                  </div>
                  <div className="mb-3 grid grid-cols-1 gap-3">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px] transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px] transition-all"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px] transition-all"
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                        Country *
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={userCountry}
                        onChange={(e) => setUserCountry(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[44px] transition-all"
                        placeholder="Your country"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-3 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px] font-medium shadow-lg hover:shadow-xl"
                  >
                    ✓ Submit Contact Information
                  </button>
                  
                  {/* Mobile close button for contact form */}
                  <div className="mt-3 md:hidden">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      Close Chat
                    </button>
                  </div>
                </motion.form>
                              ) : (
                  /* Message input - Mobile responsive */
                  <form onSubmit={handleSubmit} className="border-t p-3 sm:p-4 bg-white flex-shrink-0">
                    <div className="flex gap-2 sm:gap-3 items-end">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full rounded-2xl border border-gray-300 px-4 py-3 sm:px-4 sm:py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base min-h-[44px] transition-all resize-none"
                          autoComplete="off"
                          autoFocus={false}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`rounded-full px-3 py-3 sm:px-4 sm:py-3 text-white transition-all duration-300 transform min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg ${
                          inputValue.trim()
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-105 active:scale-95 hover:shadow-xl'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        aria-label="Send message"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Quick action buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Dental Services', 'Hair Transplant', 'Plastic Surgery', 'Pricing Info'].map((quickAction) => (
                        <button
                          key={quickAction}
                          type="button"
                          onClick={() => setInputValue(quickAction)}
                          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 rounded-full transition-all duration-200 border border-gray-200 hover:border-indigo-200"
                        >
                          {quickAction}
                        </button>
                      ))}
                    </div>
                    
                    {/* Mobile close button */}
                    <div className="mt-3 md:hidden">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Close Chat
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