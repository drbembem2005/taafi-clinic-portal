
export type ChatBotState = 'welcome' | 'main-menu' | 'specialties' | 'doctors' | 'booking';

export interface QuickOption {
  id: string;
  text: string;
  action: string;
}

export interface ActionLink {
  id: string;
  text: string;
  action: string;
  type?: 'external' | 'internal' | 'booking' | 'whatsapp' | 'phone';
  url: string;
  icon?: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'options' | 'specialties' | 'doctors' | 'booking' | 'booking-form' | 'info';
  data?: {
    specialties?: any[];
    doctors?: any[];
    options?: QuickOption[];
    bookingForm?: {
      doctorId: number;
      doctorName: string;
      specialtyId?: number;
    };
    doctorId?: number;
    doctorName?: string;
    specialtyId?: number;
  };
}
