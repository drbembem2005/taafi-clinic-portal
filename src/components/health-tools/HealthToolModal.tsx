
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
          ${isMobile ? 'w-full h-full max-w-none max-h-none m-0 rounded-none' : 'max-w-4xl max-h-[90vh]'}
          overflow-y-auto p-0
        `}
      >
        <DialogHeader className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg md:text-xl font-bold text-brand">
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthToolModal;
