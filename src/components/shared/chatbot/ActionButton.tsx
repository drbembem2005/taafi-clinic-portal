
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ButtonOption } from './types';

interface ActionButtonProps {
  button: ButtonOption;
  onClick: (action: string, data?: any) => void;
  isLoading?: boolean;
}

const ActionButton = ({ button, onClick, isLoading }: ActionButtonProps) => {
  const handleClick = () => {
    if (!isLoading) {
      onClick(button.action, button.data);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="text-xs px-3 py-2 rounded-full border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
        {button.text}
      </Button>
    </motion.div>
  );
};

export default ActionButton;
