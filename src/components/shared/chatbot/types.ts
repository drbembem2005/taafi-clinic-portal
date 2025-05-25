
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'options' | 'doctors' | 'specialties' | 'info' | 'booking';
  data?: {
    doctors?: any[];
    specialties?: any[];
    links?: ActionLink[];
    richContent?: string;
    options?: QuickOption[];
  };
}

export interface ActionLink {
  type: 'booking' | 'whatsapp' | 'phone' | 'link';
  text: string;
  url: string;
  icon: 'phone' | 'message' | 'link';
  doctorId?: number;
  specialtyId?: number;
}

export interface QuickOption {
  id: string;
  text: string;
  action: string;
  icon?: string;
}

export type ChatBotState = 
  | 'welcome' 
  | 'main-menu' 
  | 'specialties' 
  | 'doctors' 
  | 'booking' 
  | 'contact' 
  | 'info';
