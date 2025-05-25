
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'info' | 'action';
}

export type ChatBotState = 'welcome' | 'conversation' | 'closed';
