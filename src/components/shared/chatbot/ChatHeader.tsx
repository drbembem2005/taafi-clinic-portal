
import { motion } from 'framer-motion';
import { X, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <motion.div 
          className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative"
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Bot size={16} className="text-white" />
            </div>
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles size={8} className="text-yellow-800" />
            </motion.div>
          </motion.div>
          
          <div>
            <motion.h3 
              className="text-sm font-bold mb-0.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              مساعد تعافي الذكي
            </motion.h3>
            <motion.div 
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs opacity-90 font-medium">متاح الآن • مدعوم بالذكاء الاصطناعي</p>
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
            className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full backdrop-blur-sm border border-white/20"
          >
            <X size={16} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatHeader;
