
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import { Message, ChatBotState } from './types';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatBotState>('welcome');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: 'مرحباً بك في عيادات تعافي التخصصية! 👋\nكيف يمكنني مساعدتك اليوم؟',
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      };
      setMessages([welcomeMessage]);
      setChatState('main-menu');
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleQuickAction = (action: string) => {
    // Handle quick actions like "حجز سريع", "اتصل بنا", etc.
    addMessage({
      text: action,
      sender: 'user'
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 left-6 z-50 bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-3rem)] overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className="flex flex-col h-[32rem] max-h-[80vh]">
              <ChatHeader onClose={handleClose} />
              
              <div className="flex-1 flex flex-col min-h-0">
                <ChatMessages 
                  messages={messages}
                  isLoading={isLoading}
                  onAddMessage={addMessage}
                  onSetLoading={setIsLoading}
                  chatState={chatState}
                  onSetChatState={setChatState}
                  scrollAreaRef={scrollAreaRef}
                />
                
                <QuickActions onAction={handleQuickAction} chatState={chatState} />
                
                <ChatInput 
                  onSendMessage={(text) => addMessage({ text, sender: 'user' })}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
