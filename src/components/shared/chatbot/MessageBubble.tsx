
import { useState } from 'react';
import { Message, ChatState } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { newChatbotService } from './newChatbotService';
import UserInfoForm from './UserInfoForm';
import ActionButton from './ActionButton';
import SpecialtyCard from './SpecialtyCard';
import DoctorCard from './DoctorCard';

interface MessageBubbleProps {
  message: Message;
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onSetLoading: (loading: boolean) => void;
  chatState: ChatState;
  onSetChatState: (state: ChatState) => void;
}

const MessageBubble = ({ 
  message, 
  onAddMessage, 
  onSetLoading, 
  chatState, 
  onSetChatState 
}: MessageBubbleProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleButtonClick = async (action: string, buttonData?: any) => {
    console.log('=== BUTTON CLICKED ===');
    console.log('Action:', action);
    console.log('Button Data:', buttonData);
    console.log('Current Chat State:', chatState);

    // Handle external actions
    if (action.startsWith('external:')) {
      await newChatbotService.handleExternalAction(action);
      return;
    }

    setSelectedAction(action);
    onSetLoading(true);

    try {
      // Update service state
      newChatbotService.updateState(chatState);
      
      // Get response from service
      const { message: response, newState } = await newChatbotService.handleAction(action, buttonData);
      
      // Add user message based on the button text
      const buttonText = message.data?.buttons?.find(b => b.action === action)?.text || action;
      onAddMessage({
        text: buttonText,
        sender: 'user'
      });

      // Add bot response after delay
      setTimeout(() => {
        onAddMessage(response);
        onSetChatState(newState);
        onSetLoading(false);
        setSelectedAction(null);
      }, 800);
    } catch (error) {
      console.error('Error handling button action:', error);
      onSetLoading(false);
      setSelectedAction(null);
    }
  };

  const handleSpecialtySelect = (id: number, name: string) => {
    handleButtonClick('booking:select-doctor', { specialtyId: id, specialtyName: name });
  };

  const handleDoctorSelect = (doctorId: number, doctorName: string) => {
    handleButtonClick('booking:select-day', { doctorId, doctorName });
  };

  const handleUserInfoSubmit = (userInfo: any) => {
    console.log('=== USER INFO SUBMITTED ===');
    console.log('User Info:', userInfo);
    handleButtonClick('booking:confirm', userInfo);
  };

  const isUser = message.sender === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[85%] ${isUser ? 'ml-4' : 'mr-4'}`}>
        <motion.div
          className={`px-4 py-3 rounded-2xl text-sm shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-auto' 
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
        </motion.div>

        {/* Render specialties as cards */}
        {!isUser && message.data?.specialties && message.data.specialties.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.data.specialties.map((specialty: any) => (
              <SpecialtyCard 
                key={specialty.id} 
                specialty={specialty} 
                onSelect={handleSpecialtySelect}
              />
            ))}
          </div>
        )}

        {/* Render doctors as cards */}
        {!isUser && message.data?.doctors && message.data.doctors.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.data.doctors.map((doctor: any) => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onBook={handleDoctorSelect}
              />
            ))}
          </div>
        )}

        {/* Render action buttons */}
        {!isUser && message.data?.buttons && message.data.buttons.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.data.buttons.map((button: any) => (
              <ActionButton
                key={button.id}
                button={button}
                onClick={handleButtonClick}
                isLoading={selectedAction === button.action}
              />
            ))}
          </div>
        )}

        {/* Render user info form */}
        {!isUser && message.data?.userForm && (
          <Card className="mt-4 border-2 border-blue-200 shadow-xl">
            <CardContent className="p-4">
              <UserInfoForm onSubmit={handleUserInfoSubmit} />
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
