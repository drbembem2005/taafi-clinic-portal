
import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <motion.div 
      className="flex gap-3 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-full w-full rounded-full flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
      </Avatar>
      
      <motion.div 
        className="bg-white/90 rounded-2xl rounded-bl-md px-4 py-3 border-2 border-gray-200 shadow-lg backdrop-blur-sm"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="text-xs text-gray-500 mt-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          يكتب...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TypingIndicator;
