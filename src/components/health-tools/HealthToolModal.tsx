
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HealthToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const HealthToolModal = ({ isOpen, onClose, title, children }: HealthToolModalProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          ${isMobile ? 'w-full h-full max-w-none max-h-none m-0 rounded-none' : 'max-w-5xl max-h-[95vh] w-[95vw]'}
          overflow-hidden p-0 bg-gradient-to-br from-white to-blue-50/30
        `}
      >
        <DialogHeader className="sticky top-0 bg-gradient-to-r from-brand/5 to-brand/10 backdrop-blur-sm border-b border-gray-200 p-4 md:p-6 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-brand">
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-4 md:p-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthToolModal;
