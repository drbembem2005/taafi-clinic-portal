import { motion } from 'framer-motion';
import { User, Stethoscope } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Message, ChatBotState } from './types';
import ActionButton from './ActionButton';
import DoctorCard from './DoctorCard';
import SpecialtyCard from './SpecialtyCard';
import { chatbotService } from './chatbotService';

interface MessageBubbleProps {
  message: Message;
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onSetLoading: (loading: boolean) => void;
  chatState: ChatBotState;
  onSetChatState: (state: ChatBotState) => void;
}

const MessageBubble = ({ 
  message, 
  onAddMessage, 
  onSetLoading,
  chatState,
  onSetChatState 
}: MessageBubbleProps) => {
  const isUser = message.sender === 'user';

  const handleOptionClick = async (action: string, text: string) => {
    // Add user message
    onAddMessage({ text, sender: 'user' });
    onSetLoading(true);

    try {
      const response = await chatbotService.handleAction(action);
      setTimeout(() => {
        onAddMessage(response);
        onSetLoading(false);
        
        // Handle state changes based on action type
        const [actionType] = action.split('-');
        switch (actionType) {
          case 'specialties':
            onSetChatState('specialties');
            break;
          case 'doctors':
            onSetChatState('doctors');
            break;
          case 'specialty':
            onSetChatState('doctors');
            break;
          case 'booking':
            onSetChatState('booking');
            break;
          case 'main':
            onSetChatState('main-menu');
            break;
          default:
            // Keep current state
            break;
        }
      }, 800);
    } catch (error) {
      console.error('Error handling action:', error);
      onSetLoading(false);
    }
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-brand to-brand-dark h-full w-full rounded-full flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
        )}
      </Avatar>

      {/* Message Content */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {/* Text Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-brand to-brand-dark text-white rounded-br-md'
              : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-md'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.text}
          </div>
          
          {/* Rich Content */}
          {message.data?.richContent && (
            <div className="mt-3 pt-3 border-t border-gray-200/30">
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {message.data.richContent}
              </div>
            </div>
          )}
        </div>

        {/* Specialty Cards */}
        {message.data?.specialties && message.data.specialties.length > 0 && (
          <div className="w-full space-y-2">
            {message.data.specialties.map((specialty) => (
              <SpecialtyCard 
                key={specialty.id} 
                specialty={specialty} 
                onSelect={(id, name) => handleOptionClick(`specialty-${id}`, name)}
              />
            ))}
          </div>
        )}

        {/* Doctor Cards */}
        {message.data?.doctors && message.data.doctors.length > 0 && (
          <div className="w-full space-y-2">
            {message.data.doctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onBook={(doctorId, doctorName) => handleOptionClick(`book-${doctorId}`, `حجز موعد مع ${doctorName}`)}
              />
            ))}
          </div>
        )}

        {/* Action Links */}
        {message.data?.links && message.data.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.data.links.map((link, index) => (
              <ActionButton 
                key={index} 
                link={link} 
              />
            ))}
          </div>
        )}

        {/* Quick Options */}
        {message.data?.options && message.data.options.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.data.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.action, option.text)}
                className="px-4 py-2 text-sm rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-brand/30 hover:text-brand transition-all duration-200 shadow-sm"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
