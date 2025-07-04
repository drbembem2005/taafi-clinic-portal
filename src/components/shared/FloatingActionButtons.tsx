
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalytics } from '@/hooks/useAnalytics';

const FloatingActionButtons = () => {
  const isMobile = useIsMobile();
  const { trackCTA, trackMobile } = useAnalytics();

  const openWhatsApp = () => {
    trackCTA('floating_whatsapp_button', 'whatsapp');
    if (isMobile) {
      trackMobile('whatsapp_click', 'floating_button');
    }
    window.open('https://wa.me/201119007403', '_blank');
  };

  const makePhoneCall = () => {
    trackCTA('floating_phone_button', 'phone');
    if (isMobile) {
      trackMobile('phone_click', 'floating_button');
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
