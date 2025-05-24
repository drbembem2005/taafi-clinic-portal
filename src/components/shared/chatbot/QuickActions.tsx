
import { Calendar, Phone, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBotState } from './types';

interface QuickActionsProps {
  onAction: (action: string) => void;
  chatState: ChatBotState;
}

const QuickActions = ({ onAction, chatState }: QuickActionsProps) => {
  const quickActions = [
    { id: 'booking', text: 'حجز سريع', icon: Calendar, color: 'bg-brand hover:bg-brand-dark' },
    { id: 'whatsapp', text: 'واتساب', icon: MessageCircle, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'call', text: 'اتصل بنا', icon: Phone, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'info', text: 'معلومات', icon: Info, color: 'bg-gray-600 hover:bg-gray-700' }
  ];

  return (
    <div className="p-3 border-t border-gray-100 bg-gray-50/50">
      <div className="flex gap-2 justify-center">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            onClick={() => onAction(action.text)}
            className={`${action.color} text-white h-8 px-3 flex items-center gap-1.5`}
          >
            <action.icon size={14} />
            <span className="text-xs">{action.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
