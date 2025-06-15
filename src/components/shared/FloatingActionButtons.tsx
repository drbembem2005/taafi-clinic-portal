
```tsx
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingActionButtons = () => {
  const isMobile = useIsMobile();

  const openWhatsApp = () => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('Click: FAB WhatsApp');
    }
    window.open('https://wa.me/201119007403', '_blank');
  };

  const makePhoneCall = () => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('Click: FAB Phone Call');
    }
    window.location.href = 'tel:+201091003965';
  };

  return (
    <div className={`fixed z-40 flex ${
      isMobile 
        ? 'bottom-20 right-4 flex-row gap-2' // Horizontal layout above mobile nav
        : 'bottom-8 right-4 flex-col gap-3'  // Vertical layout on desktop
    }`}>
      <motion.button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700"
        onClick={openWhatsApp}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <MessageCircle size={20} />
      </motion.button>
      
      <motion.button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        onClick={makePhoneCall}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Phone size={20} />
      </motion.button>
    </div>
  );
};

export default FloatingActionButtons;
```
