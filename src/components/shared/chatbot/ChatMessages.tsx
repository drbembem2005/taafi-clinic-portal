
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, ChatBotState } from './types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { RefObject } from 'react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onSetLoading: (loading: boolean) => void;
  chatState: ChatBotState;
  onSetChatState: (state: ChatBotState) => void;
  scrollAreaRef: RefObject<HTMLDivElement>;
}

const ChatMessages = ({ 
  messages, 
  isLoading, 
  onAddMessage, 
  onSetLoading,
  chatState,
  onSetChatState,
  scrollAreaRef 
}: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 px-3 py-2 md:px-4" ref={scrollAreaRef}>
      <div className="space-y-3 md:space-y-4 pb-2">
        {messages.map((message, index) => (
          <MessageBubble 
            key={`message-${message.id}-${index}`}
            message={message}
            onAddMessage={onAddMessage}
            onSetLoading={onSetLoading}
            chatState={chatState}
            onSetChatState={onSetChatState}
          />
        ))}
        
        {isLoading && (
          <div key="typing-indicator" className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
