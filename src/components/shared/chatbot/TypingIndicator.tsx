
import { Avatar } from '@/components/ui/avatar';
import { Stethoscope } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <div className="bg-gradient-to-br from-brand to-brand-dark h-full w-full rounded-full flex items-center justify-center">
          <Stethoscope size={16} className="text-white" />
        </div>
      </Avatar>
      
      <div className="bg-gray-50 rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
