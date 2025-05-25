
import { Calendar, Clock, Stethoscope, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsGridProps {
  onAction: (action: string) => void;
}

const QuickActionsGrid = ({ onAction }: QuickActionsGridProps) => {
  const quickActions = [
    { text: 'حجز موعد', icon: Calendar, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { text: 'مواعيد العمل', icon: Clock, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { text: 'التخصصات', icon: Stethoscope, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { text: 'الموقع', icon: MapPin, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' }
  ];

  const contactActions = [
    { 
      text: 'اتصل بنا', 
      icon: Phone, 
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      action: () => window.location.href = 'tel:+201119007403'
    },
    { 
      text: 'واتساب', 
      icon: MessageSquare, 
      color: 'bg-green-600 text-white hover:bg-green-700',
      action: () => window.open('https://wa.me/201119007403', '_blank')
    }
  ];

  return (
    <div className="p-4 border-t bg-gray-50/50">
      {/* Quick Info Actions */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {quickActions.map((action) => (
          <Button
            key={action.text}
            variant="ghost"
            size="sm"
            onClick={() => onAction(action.text)}
            className={`${action.color} h-auto py-3 flex-col gap-1 text-xs`}
          >
            <action.icon size={18} />
            <span>{action.text}</span>
          </Button>
        ))}
      </div>

      {/* Contact Actions */}
      <div className="flex gap-2">
        {contactActions.map((action) => (
          <Button
            key={action.text}
            size="sm"
            onClick={action.action}
            className={`${action.color} flex-1 h-9`}
          >
            <action.icon size={16} className="ml-1" />
            <span className="text-xs">{action.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
