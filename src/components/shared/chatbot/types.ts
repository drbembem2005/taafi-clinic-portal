
export interface Doctor {
  id: number;
  name: string;
  specialty_id: number;
  image?: string;
  bio?: string;
  specialty?: string;
  fees?: {
    examination: number;
    consultation: number | null;
  };
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'options' | 'doctors' | 'specialties' | 'info' | 'booking';
  data?: {
    doctors?: Doctor[];
    specialties?: Specialty[];
    links?: ActionLink[];
    richContent?: string;
    options?: QuickOption[];
    bookingForm?: {
      doctorId: number;
      doctorName: string;
      specialtyId?: number;
    };
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
