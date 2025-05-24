
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

  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md";
  
  const getButtonClasses = () => {
    switch (link.type) {
      case 'booking':
        return `${baseClasses} bg-gradient-to-r from-brand to-brand-light text-white hover:from-brand-dark hover:to-brand`;
      case 'whatsapp':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
      case 'phone':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
      default:
        return `${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-700`;
    }
  };

  const handleClick = () => {
    if (link.type === 'booking') {
      // Auto-close chatbot when navigating to booking
      window.dispatchEvent(new CustomEvent('closeChatbot'));
    }
  };

  if (link.url.startsWith('http') || link.url.startsWith('tel:') || link.url.startsWith('mailto:')) {
    return (
      <a 
        href={link.url}
        target={link.url.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        onClick={handleClick}
        className={getButtonClasses()}
      >
        <IconComponent size={16} />
        <span>{link.text}</span>
      </a>
    );
  }
  
  return (
    <Link
      to={link.url}
      onClick={handleClick}
      className={getButtonClasses()}
    >
      <IconComponent size={16} />
      <span>{link.text}</span>
    </Link>
  );
};

export default ActionButton;
