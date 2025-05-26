
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
      text: 'حجز', 
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
      text: 'اتصال', 
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
    <div className="p-2 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm border-t border-gray-200/30">
      <motion.div 
        className="flex gap-1 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              onClick={() => onAction(action.text)}
              className={`bg-gradient-to-r ${action.gradient} ${action.hoverGradient} text-white h-8 px-3 flex items-center gap-1 rounded-lg shadow-md border border-white/20 backdrop-blur-sm transition-all duration-200 font-medium`}
            >
              <action.icon size={12} />
              <span className="text-xs">{action.text}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickActions;
