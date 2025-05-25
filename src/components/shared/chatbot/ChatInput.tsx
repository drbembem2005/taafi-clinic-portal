
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="w-full rounded-2xl border-2 border-gray-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-200 shadow-sm placeholder:text-gray-400"
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          
          {/* Character indicator */}
          {message.length > 0 && (
            <motion.div 
              className="absolute right-3 bottom-1 text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message.length}
            </motion.div>
          )}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl w-12 h-12 p-0 shadow-lg border-2 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <Send size={18} className="transform rotate-180 text-white" />
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Quick suggestion when empty */}
      {!message && !isLoading && (
        <motion.div 
          className="mt-2 text-xs text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          اضغط على الأزرار السريعة أسفل أو اكتب سؤالك
        </motion.div>
      )}
    </div>
  );
};

export default ChatInput;
