
import { motion } from 'framer-motion';
import { Calendar, Phone, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBotState } from './types';

interface QuickActionsProps {
  onAction: (action: string) => void;
  chatState: ChatBotState;
}

const QuickActions = ({ onAction, chatState }: QuickActionsProps) => {
  const quickActions = [
    { 
      id: 'booking', 
      text: 'حجز سريع', 
      icon: Calendar, 
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-700'
    },
    { 
      id: 'whatsapp', 
      text: 'واتساب', 
      icon: MessageCircle, 
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700'
    },
    { 
      id: 'call', 
      text: 'اتصل بنا', 
      icon: Phone, 
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'hover:from-blue-600 hover:to-indigo-700'
    },
    { 
      id: 'info', 
      text: 'معلومات', 
      icon: Info, 
      gradient: 'from-purple-500 to-pink-600',
      hoverGradient: 'hover:from-purple-600 hover:to-pink-700'
    }
  ];

  return (
    <div className="p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm border-t border-gray-200/30">
      <motion.div 
        className="flex gap-2 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              onClick={() => onAction(action.text)}
              className={`bg-gradient-to-r ${action.gradient} ${action.hoverGradient} text-white h-10 px-4 flex items-center gap-2 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-200 font-medium`}
            >
              <action.icon size={16} />
              <span className="text-xs hidden sm:inline">{action.text}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-gray-500">اختر إجراء سريع أو اكتب رسالتك</span>
      </motion.div>
    </div>
  );
};

export default QuickActions;
