
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import { Message, ChatState } from './types';
import { newChatbotService } from './newChatbotService';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    currentFlow: 'welcome',
    selectedData: {}
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Initialize with welcome message and main menu
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: 'مرحبًا بك في عيادات تعافي التخصصية! 👋\nأنا تعافي بوت | TAAFE Assistant\nكيف يمكنني مساعدتك اليوم؟',
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      };
      
      setMessages([welcomeMessage]);
      
      // Add main menu after a short delay
      setTimeout(async () => {
        try {
          newChatbotService.resetState();
          const { message: mainMenuMessage, newState } = await newChatbotService.handleAction('main-menu');
          const mainMenuMessageWithId: Message = {
            ...mainMenuMessage,
            id: 2,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, mainMenuMessageWithId]);
          setChatState(newState);
        } catch (error) {
          console.error('Error initializing main menu:', error);
        }
      }, 1000);
    }
  }, [isOpen, messages.length]);

  // Listen for close chatbot event
  useEffect(() => {
    const handleCloseChatbot = () => {
      setIsOpen(false);
    };

    window.addEventListener('closeChatbot', handleCloseChatbot);
    return () => window.removeEventListener('closeChatbot', handleCloseChatbot);
  }, []);

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
      // Get response from chatbot service - treat as main menu for text input
      const { message: response, newState } = await newChatbotService.handleAction('main-menu');
      setTimeout(() => {
        addMessage(response);
        setChatState(newState);
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
    console.log('=== QUICK ACTION ===');
    console.log('Action:', action);

    // Handle external actions
    if (action.startsWith('external:')) {
      await newChatbotService.handleExternalAction(action);
      return;
    }

    setIsLoading(true);
    try {
      // Update service state
      newChatbotService.updateState(chatState);
      
      // Get response
      const { message: response, newState } = await newChatbotService.handleAction(action);
      
      // Add user message based on action
      const actionTexts: { [key: string]: string } = {
        'main-menu': 'القائمة الرئيسية',
        'booking:start': 'احجز موعد'
      };
      
      addMessage({
        text: actionTexts[action] || action,
        sender: 'user'
      });

      setTimeout(() => {
        addMessage(response);
        setChatState(newState);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error handling quick action:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className={`fixed z-50 ${
          isMobile 
            ? 'bottom-20 left-4' 
            : 'bottom-6 left-6'
        }`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl transform hover:scale-110 transition-all duration-300 group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-50 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 ${
              isMobile 
                ? 'bottom-40 left-4 right-4 max-w-none' 
                : 'bottom-28 left-6 w-96 max-w-[calc(100vw-3rem)]'
            }`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className={`flex flex-col ${isMobile ? 'h-[45rem]' : 'h-[48rem]'} max-h-[85vh]`}>
              <ChatHeader onClose={handleClose} />
              
              <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-gray-50/50 to-white/50">
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
