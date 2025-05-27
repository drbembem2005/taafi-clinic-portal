
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'main-menu' | 'specialty-selection' | 'doctor-selection' | 'day-selection' | 'time-selection' | 'user-info' | 'confirmation' | 'success' | 'info';
  data?: {
    buttons?: ButtonOption[];
    specialties?: any[];
    doctors?: any[];
    availableDays?: string[];
    availableTimes?: string[];
    userForm?: boolean;
    selectedData?: {
      specialtyId?: number;
      specialtyName?: string;
      doctorId?: number;
      doctorName?: string;
      selectedDay?: string;
      selectedTime?: string;
    };
  };
}

export interface ButtonOption {
  id: string;
  text: string;
  action: string;
  data?: any;
}

export type ChatFlow = 
  | 'welcome'
  | 'main-menu'
  | 'booking-specialty'
  | 'booking-doctor'
  | 'booking-day'
  | 'booking-time'
  | 'booking-info'
  | 'booking-confirm'
  | 'doctors-schedule-specialty'
  | 'doctors-schedule-list'
  | 'prices-list'
  | 'specialties-list'
  | 'location-info'
  | 'customer-service';

export interface ChatState {
  currentFlow: ChatFlow;
  selectedData: {
    specialtyId?: number;
    specialtyName?: string;
    doctorId?: number;
    doctorName?: string;
    selectedDay?: string;
    selectedTime?: string;
    userInfo?: {
      name: string;
      phone: string;
      email?: string;
    };
  };
}

// Legacy types for backward compatibility
export interface ActionLink {
  id: string;
  text: string;
  url: string;
  type: 'booking' | 'whatsapp' | 'phone' | 'external';
  icon?: string;
}

export interface QuickOption {
  id: string;
  text: string;
  action: string;
}
