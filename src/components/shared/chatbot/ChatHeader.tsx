
import { motion } from 'framer-motion';
import { X, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-brand to-brand-dark text-white p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/30">
            <div className="bg-white/20 h-full w-full rounded-full flex items-center justify-center">
              <Stethoscope size={24} className="text-white" />
            </div>
          </Avatar>
          
          <div>
            <h3 className="text-xl font-bold">مساعد تعافي الذكي</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm opacity-90">متاح الآن لخدمتك</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
