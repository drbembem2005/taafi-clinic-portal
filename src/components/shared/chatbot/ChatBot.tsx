
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatMessage from './ChatMessage';
import QuickActionsGrid from './QuickActionsGrid';
import { Message } from './types';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: 'مرحباً بك في عيادات تعافي! 👋\nكيف يمكنني مساعدتك اليوم؟',
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      };
      setMessages([welcomeMessage]);
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    addMessage({ text: inputValue, sender: 'user' });
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      addMessage({
        text: 'شكراً لتواصلك معنا! سيتم الرد عليك في أقرب وقت ممكن.',
        sender: 'bot'
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    addMessage({ text: action, sender: 'user' });
    setIsTyping(true);

    let response = '';
    switch (action) {
      case 'حجز موعد':
        response = 'يمكنك حجز موعد من خلال:\n• الموقع الإلكتروني\n• الاتصال على: 01119007403\n• واتساب: 01119007403';
        break;
      case 'مواعيد العمل':
        response = 'مواعيد العمل:\n• السبت - الخميس: 10 صباحاً - 10 مساءً\n• الجمعة: مغلق';
        break;
      case 'التخصصات':
        response = 'التخصصات المتاحة:\n• طب الأسرة\n• الباطنة\n• الأطفال\n• النساء والتوليد\n• الجلدية\n• العظام';
        break;
      case 'الموقع':
        response = 'العنوان:\nميدان الحصري، أبراج برعي بلازا، برج رقم ٢\nبجوار محل شعبان للملابس، الدور الثالث\n6 أكتوبر، القاهرة';
        break;
      default:
        response = 'شكراً لك! كيف يمكنني مساعدتك أكثر؟';
    }

    setTimeout(() => {
      addMessage({ text: response, sender: 'bot' });
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className={`fixed z-50 ${
          isMobile 
            ? 'bottom-20 left-4' 
            : 'bottom-6 left-6'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-50 bg-white rounded-2xl shadow-2xl border ${
              isMobile 
                ? 'bottom-36 left-4 right-4 h-[70vh]' 
                : 'bottom-24 left-6 w-96 h-[32rem]'
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">مساعد تعافي</h3>
                    <p className="text-sm opacity-90">متاح الآن</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 w-8 h-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col h-[calc(100%-140px)]">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">يكتب...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <QuickActionsGrid onAction={handleQuickAction} />

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="اكتب رسالتك..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-3"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
