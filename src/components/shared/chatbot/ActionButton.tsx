
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageCircle, ExternalLink, Calendar } from 'lucide-react';
import { ActionLink } from './types';

interface ActionButtonProps {
  link: ActionLink;
}

const ActionButton = ({ link }: ActionButtonProps) => {
  const IconComponent = 
    link.icon === 'phone' ? PhoneCall :
    link.icon === 'message' ? MessageCircle :
    link.type === 'booking' ? Calendar :
    ExternalLink;

  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20";
  
  const getButtonClasses = () => {
    switch (link.type) {
      case 'booking':
        return `${baseClasses} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white`;
      case 'whatsapp':
        return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white`;
      case 'phone':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700`;
    }
  };

  const handleClick = () => {
    if (link.type === 'booking') {
      // Auto-close chatbot when navigating to booking
      window.dispatchEvent(new CustomEvent('closeChatbot'));
    }
  };

  const ButtonContent = () => (
    <motion.div
      className={getButtonClasses()}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <IconComponent size={16} />
      </motion.div>
      <span className="font-semibold">{link.text}</span>
    </motion.div>
  );

  if (link.url.startsWith('http') || link.url.startsWith('tel:') || link.url.startsWith('mailto:')) {
    return (
      <a 
        href={link.url}
        target={link.url.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
      >
        <ButtonContent />
      </a>
    );
  }
  
  return (
    <Link to={link.url}>
      <ButtonContent />
    </Link>
  );
};

export default ActionButton;
