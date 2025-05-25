
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import { Message, ChatBotState } from './types';
import { chatbotService } from './chatbotService';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatBotState>('welcome');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

  const handleSendMessage = async (text: string) => {
    // Add user message
    addMessage({ text, sender: 'user' });
    setIsLoading(true);

    try {
      // Get response from chatbot service
      const response = await chatbotService.handleAction('main');
      setTimeout(() => {
        addMessage(response);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      addMessage({
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        sender: 'bot'
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleQuickAction = async (action: string) => {
    // Map quick action text to actual actions
    const actionMap: { [key: string]: string } = {
      'حجز سريع': 'booking',
      'واتساب': 'contact',
      'اتصل بنا': 'contact',
      'معلومات': 'hours'
    };

    const mappedAction = actionMap[action] || 'main';
    
    addMessage({
      text: action,
      sender: 'user'
    });

    setIsLoading(true);
    try {
      const response = await chatbotService.handleAction(mappedAction);
      setTimeout(() => {
        addMessage(response);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error handling quick action:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button - Positioned above mobile navigation */}
      <motion.div
        className={`fixed z-50 ${
          isMobile 
            ? 'bottom-20 left-4' // Above mobile navigation (16px + 64px navigation height)
            : 'bottom-6 left-6'   // Desktop position
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand shadow-xl transform hover:scale-105 transition-all duration-200"
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
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 ${
              isMobile 
                ? 'bottom-36 left-4 right-4 max-w-none' // Full width on mobile, above navigation
                : 'bottom-24 left-6 w-96 max-w-[calc(100vw-3rem)]' // Desktop position
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className={`flex flex-col ${isMobile ? 'h-96' : 'h-[32rem]'} max-h-[60vh]`}>
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
                  onSendMessage={handleSendMessage}
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
