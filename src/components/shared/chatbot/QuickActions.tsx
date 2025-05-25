
import { Calendar, Phone, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBotState } from './types';

interface QuickActionsProps {
  onAction: (action: string) => void;
  chatState: ChatBotState;
}

const QuickActions = ({ onAction, chatState }: QuickActionsProps) => {
  const quickActions = [
    { id: 'booking', text: 'حجز', icon: Calendar, color: 'bg-brand hover:bg-brand-dark' },
    { id: 'whatsapp', text: 'واتساب', icon: MessageCircle, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'call', text: 'اتصال', icon: Phone, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'info', text: 'معلومات', icon: Info, color: 'bg-gray-600 hover:bg-gray-700' }
  ];

  return (
    <div className="p-2 md:p-3 border-t border-gray-100 bg-white">
      <div className="flex gap-1.5 md:gap-2 justify-center">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            onClick={() => onAction(action.text)}
            className={`${action.color} text-white h-7 md:h-8 px-2 md:px-3 flex items-center gap-1 md:gap-1.5 text-xs md:text-sm flex-1 max-w-20 md:max-w-none`}
          >
            <action.icon size={12} className="md:w-3.5 md:h-3.5" />
            <span className="truncate">{action.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
