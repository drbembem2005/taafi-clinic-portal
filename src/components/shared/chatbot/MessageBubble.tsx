
import { motion } from 'framer-motion';
import { User, Bot, Clock } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Message, ChatBotState } from './types';
import DoctorCard from './DoctorCard';
import SpecialtyCard from './SpecialtyCard';
import { chatbotService } from './chatbotService';
import ChatBookingForm from './ChatBookingForm';

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
    if (action.startsWith('external-') || action.startsWith('contact-')) {
      await chatbotService.handleExternalAction(action);
      return;
    }

    onAddMessage({ text, sender: 'user' });
    onSetLoading(true);

    try {
      const response = await chatbotService.handleAction(action);
      setTimeout(() => {
        onAddMessage(response);
        onSetLoading(false);
        
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
            break;
        }
      }, 800);
    } catch (error) {
      console.error('Error handling action:', error);
      onSetLoading(false);
    }
  };

  const handleDoctorBooking = (doctorId: number, doctorName: string, specialtyId?: number) => {
    console.log('📅 MessageBubble: Starting booking flow for doctor:', { doctorId, doctorName, specialtyId });
    
    // Add user message first
    onAddMessage({
      text: `أريد حجز موعد مع د. ${doctorName}`,
      sender: 'user'
    });

    // Then add the booking form message
    setTimeout(() => {
      const bookingFormMessage = {
        text: `ممتاز! سأساعدك في حجز موعد مع د. ${doctorName}. الرجاء ملء البيانات التالية:`,
        sender: 'bot' as const,
        type: 'booking-form' as const,
        data: {
          doctorId,
          doctorName,
          specialtyId
        }
      };
      
      onAddMessage(bookingFormMessage);
      onSetChatState('booking');
    }, 500);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <motion.div
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-white shadow-lg">
          {isUser ? (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full w-full rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-full w-full rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
          )}
        </Avatar>
      </motion.div>

      {/* Message Content */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
        {/* Text Bubble */}
        <motion.div
          className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md border border-blue-400'
              : 'bg-white/95 text-gray-800 border border-gray-200 rounded-bl-md'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
            {message.text}
          </div>
          
          {/* Timestamp */}
          <div className={`flex items-center gap-1 mt-2 text-xs opacity-70 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <Clock size={10} />
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </motion.div>

        {/* Booking Form */}
        {message.type === 'booking-form' && message.data && (
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ChatBookingForm
              doctorId={message.data.doctorId}
              doctorName={message.data.doctorName}
              specialtyId={message.data.specialtyId}
              onBookingComplete={(success) => {
                if (success) {
                  setTimeout(() => {
                    onAddMessage({
                      text: 'شكراً لك! تم حجز موعدك بنجاح ✅\nسيتم التواصل معك قريباً لتأكيد الموعد.\n\nهل تحتاج مساعدة في أي شيء آخر؟',
                      sender: 'bot'
                    });
                  }, 2500);
                }
              }}
            />
          </motion.div>
        )}

        {/* Specialty Cards */}
        {message.data?.specialties && message.data.specialties.length > 0 && (
          <motion.div 
            className="w-full space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {message.data.specialties.map((specialty, index) => (
              <motion.div
                key={`specialty-${specialty.id}-${message.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <SpecialtyCard 
                  specialty={specialty} 
                  onSelect={(id, name) => handleOptionClick(`specialty-${id}`, name)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Doctor Cards */}
        {message.data?.doctors && message.data.doctors.length > 0 && (
          <motion.div 
            className="w-full space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {message.data.doctors.map((doctor, index) => (
              <motion.div
                key={`doctor-${doctor.id}-${message.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <DoctorCard 
                  doctor={doctor} 
                  onBook={(doctorId, doctorName) => {
                    handleDoctorBooking(doctorId, doctorName, doctor.specialty_id);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Option Buttons */}
        {message.data?.options && (
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {message.data.options.map((option, index) => (
              <motion.button
                key={`option-${option.id}-${message.id}`}
                onClick={() => handleOptionClick(option.action, option.text)}
                className="px-4 py-2 text-sm rounded-xl border bg-white/95 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm backdrop-blur-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
