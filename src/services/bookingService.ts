
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BookingData {
  user_name: string;
  user_phone: string;
  user_email: string | null;
  notes: string | null;
  specialty_id: number | null;
  doctor_id: number | null;
  booking_day: string;
  booking_time: string;
  booking_method: 'whatsapp' | 'phone' | 'online';
  booking_date?: string | null; // New field for the actual date
}

interface BookingResponse {
  id: string;
  created_at: string;
  status: string;
}

export async function createBooking(bookingData: BookingData): Promise<BookingResponse> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select('id, created_at, status')
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      throw new Error(error.message);
    }

    return data as BookingResponse;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
}

export async function getBookingsByPhone(phone: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, doctors(name)')
      .eq('user_phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBookingsByPhone:', error);
    return [];
  }
}

export async function cancelBooking(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    return false;
  }
}

export function openWhatsAppWithBookingDetails(bookingDetails: {
  doctorName: string;
  specialtyName?: string;
  date?: string;
  time?: string;
  userName?: string;
  phone?: string;
  email?: string | null;
  notes?: string | null;
}): boolean {
  // More friendly and conversational message format
  let message = `مرحباً! 👋 أتمنى أن تكون بخير!\n\n`;
  
  message += `أود تأكيد حجز موعدك مع د. ${bookingDetails.doctorName} `;
  if (bookingDetails.specialtyName) {
    message += `(${bookingDetails.specialtyName}) `;
  }
  
  if (bookingDetails.date && bookingDetails.time) {
    message += `\n\nموعدك يوم ${bookingDetails.date} في تمام الساعة ${bookingDetails.time} ✨`;
  } else if (bookingDetails.date) {
    message += `\n\nموعدك يوم ${bookingDetails.date} ✨`;
  } else if (bookingDetails.time) {
    message += `\n\nموعدك في تمام الساعة ${bookingDetails.time} ✨`;
  }
  
  message += `\n\nبياناتك:`;
  if (bookingDetails.userName) {
    message += `\n• الاسم: ${bookingDetails.userName}`;
  }
  
  if (bookingDetails.phone) {
    message += `\n• رقم الهاتف: ${bookingDetails.phone}`;
  }
  
  if (bookingDetails.email) {
    message += `\n• البريد الإلكتروني: ${bookingDetails.email}`;
  }
  
  if (bookingDetails.notes) {
    message += `\n\n💬 ملاحظاتك: ${bookingDetails.notes}`;
  }
  
  message += `\n\nنتطلع لرؤيتك قريباً! 😊 إذا كنت ترغب في تغيير موعدك أو لديك أي استفسار، لا تتردد في التواصل معنا على الرقم 01119007403 ❤️`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Open WhatsApp with the clinic's number and pre-filled message
  const whatsappURL = `https://wa.me/201119007403?text=${encodedMessage}`;
  
  try {
    // Use window.location.href for direct navigation without popup or notification
    window.location.href = whatsappURL;
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    // If there's an error, return false to indicate failure
    return false;
  }
}
