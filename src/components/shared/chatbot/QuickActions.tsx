
import { motion } from 'framer-motion';
import { Calendar, Phone, MessageCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBotState } from './types';

interface QuickActionsProps {
  onAction: (action: string) => void;
  chatState: ChatBotState;
}

const QuickActions = ({ onAction, chatState }: QuickActionsProps) => {
  const quickActions = [
    { 
      id: 'home', 
      text: 'القائمة', 
      icon: Home, 
      gradient: 'from-slate-500 to-slate-600'
    },
    { 
      id: 'booking', 
      text: 'حجز', 
      icon: Calendar, 
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'whatsapp', 
      text: 'واتساب', 
      icon: MessageCircle, 
      gradient: 'from-green-500 to-green-600'
    },
    { 
      id: 'call', 
      text: 'اتصال', 
      icon: Phone, 
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'home':
        onAction('القائمة الرئيسية');
        break;
      case 'booking':
        onAction('حجز موعد');
        break;
      case 'whatsapp':
        window.open('https://wa.me/201119007403?text=مرحباً، أود حجز موعد في عيادات تعافي', '_blank');
        break;
      case 'call':
        window.open('tel:+201119007403', '_self');
        break;
    }
  };

  return (
    <div className="p-1.5 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm border-t border-gray-200/30">
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
              onClick={() => handleAction(action.id)}
              className={`bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white h-7 px-2 flex items-center gap-1 rounded-lg shadow-md border border-white/20 backdrop-blur-sm transition-all duration-200 font-medium text-xs`}
            >
              <action.icon size={10} />
              <span>{action.text}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickActions;
