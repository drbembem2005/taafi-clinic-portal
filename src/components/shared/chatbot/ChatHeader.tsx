
import { motion } from 'framer-motion';
import { X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-1.5 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.div 
            className="relative"
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Bot size={10} className="text-white" />
            </div>
          </motion.div>
          
          <div>
            <motion.h3 
              className="text-xs font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              مساعد تعافي الذكي
            </motion.h3>
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-[9px] opacity-90 font-medium">متاح الآن</p>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-5 w-5 p-0 rounded-full backdrop-blur-sm border border-white/20"
          >
            <X size={10} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatHeader;
