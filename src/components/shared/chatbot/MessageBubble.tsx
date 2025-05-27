
import { motion } from 'framer-motion';
import { User, Bot, Clock } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Message, ChatState } from './types';
import { newChatbotService } from './newChatbotService';
import UserInfoForm from './UserInfoForm';

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
  const isUser = message.sender === 'user';

  const handleButtonClick = async (action: string, buttonData?: any) => {
    console.log('=== BUTTON CLICKED ===');
    console.log('Action:', action);
    console.log('Button Data:', buttonData);

    // Handle external actions first
    if (action.startsWith('external:')) {
      await newChatbotService.handleExternalAction(action);
      return;
    }

    // Add user message for the action
    const buttonText = message.data?.buttons?.find(b => b.action === action)?.text || action;
    onAddMessage({ text: buttonText, sender: 'user' });
    onSetLoading(true);

    try {
      // Update service state with current chat state
      newChatbotService.updateState(chatState);
      
      // Get response from service
      const { message: responseMessage, newState } = await newChatbotService.handleAction(action, buttonData);
      
      setTimeout(() => {
        onAddMessage(responseMessage);
        onSetChatState(newState);
        onSetLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error handling button action:', error);
      onAddMessage({
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        sender: 'bot'
      });
      onSetLoading(false);
    }
  };

  const handleUserInfoSubmit = async (userInfo: { name: string; phone: string; email?: string }) => {
    console.log('=== USER INFO SUBMITTED ===');
    console.log('User Info:', userInfo);

    onSetLoading(true);

    try {
      // Update service state with current chat state
      newChatbotService.updateState(chatState);
      
      // Handle booking confirmation
      const { message: responseMessage, newState } = await newChatbotService.handleAction('booking:confirm', userInfo);
      
      setTimeout(() => {
        onAddMessage(responseMessage);
        onSetChatState(newState);
        onSetLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting user info:', error);
      onAddMessage({
        text: 'عذراً، حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.',
        sender: 'bot'
      });
      onSetLoading(false);
    }
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
      className={`flex gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
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
        <Avatar className="h-8 w-8 flex-shrink-0 border-2 border-white shadow-lg">
          {isUser ? (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full w-full rounded-full flex items-center justify-center">
              <User size={14} className="text-gray-600" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-full w-full rounded-full flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
          )}
        </Avatar>
      </motion.div>

      {/* Message Content */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {/* Text Bubble */}
        <motion.div
          className={`rounded-2xl px-3 py-2 shadow-lg backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md border border-blue-400'
              : 'bg-white/90 text-gray-800 border border-gray-200 rounded-bl-md'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
            {message.text}
          </div>
          
          {/* Timestamp */}
          <div className={`flex items-center gap-1 mt-1 text-xs opacity-70 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <Clock size={10} />
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </motion.div>

        {/* User Info Form */}
        {message.data?.userForm && (
          <motion.div 
            className="w-full mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <UserInfoForm onSubmit={handleUserInfoSubmit} />
          </motion.div>
        )}

        {/* Action Buttons */}
        {message.data?.buttons && (
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {message.data.buttons.map((button, index) => (
              <motion.button
                key={button.id}
                onClick={() => handleButtonClick(button.action, button.data)}
                className="px-3 py-1.5 text-xs rounded-lg border bg-white/90 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm backdrop-blur-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {button.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
