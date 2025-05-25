
import { motion } from 'framer-motion';
import { X, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-brand to-brand-dark text-white p-3 md:p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-16 h-16 md:w-24 md:h-24 border border-white/20 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 md:w-16 md:h-16 border border-white/20 rounded-full"></div>
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white/30">
            <div className="bg-white/20 h-full w-full rounded-full flex items-center justify-center">
              <Stethoscope size={16} className="text-white md:w-5 md:h-5" />
            </div>
          </Avatar>
          
          <div>
            <h3 className="text-base md:text-lg font-bold">مساعد تعافي</h3>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs md:text-sm opacity-90">متاح الآن</p>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 h-7 w-7 md:h-8 md:w-8 p-0 rounded-full"
        >
          <X size={16} className="md:w-4 md:h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
