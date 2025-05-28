
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, ChatBotState } from './types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { RefObject, useEffect } from 'react';

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
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        setTimeout(() => {
          scrollableNode.scrollTop = scrollableNode.scrollHeight;
        }, 100);
      }
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-3 py-2" ref={scrollAreaRef}>
      <div className="space-y-3 min-h-full">
        {messages.map((message) => (
          <MessageBubble 
            key={`message-${message.id}-${message.timestamp.getTime()}`}
            message={message}
            onAddMessage={onAddMessage}
            onSetLoading={onSetLoading}
            chatState={chatState}
            onSetChatState={onSetChatState}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
