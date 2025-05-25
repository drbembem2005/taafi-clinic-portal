
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-2 md:p-3 border-t border-gray-100 bg-white">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 rounded-full border-gray-200 focus:border-brand text-sm h-9 md:h-10"
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className="bg-brand hover:bg-brand-dark rounded-full w-9 h-9 md:w-10 md:h-10 p-0"
        >
          <Send size={14} className="transform rotate-180 md:w-4 md:h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
