
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'info' | 'action' | 'specialties' | 'doctors' | 'booking' | 'options';
  data?: {
    richContent?: string;
    specialties?: Array<{
      id: number;
      name: string;
      description?: string;
    }>;
    doctors?: Array<{
      id: number;
      name: string;
      specialty: string;
      experience?: string;
      image?: string;
    }>;
    options?: QuickOption[];
    links?: ActionLink[];
  };
}

export interface ActionLink {
  type: 'booking' | 'whatsapp' | 'phone' | 'link';
  text: string;
  url: string;
  icon: 'phone' | 'message' | 'link';
  specialtyId?: number;
}

export interface QuickOption {
  id: string;
  text: string;
  action: string;
}

export type ChatBotState = 'welcome' | 'conversation' | 'closed' | 'specialties' | 'doctors' | 'booking' | 'main-menu';
