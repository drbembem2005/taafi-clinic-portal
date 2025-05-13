
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingActionButtons = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/201119007403', '_blank');
  };

  const makePhoneCall = () => {
    window.location.href = 'tel:+201091003965';
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 flex flex-col gap-3 lg:bottom-8">
      <motion.button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700"
        onClick={openWhatsApp}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <MessageCircle size={24} />
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
        <Phone size={24} />
      </motion.button>
    </div>
  );
};

export default FloatingActionButtons;
