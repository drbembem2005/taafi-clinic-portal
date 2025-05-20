import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  StickyNote, 
  CheckCircle2 
} from 'lucide-react';
import { BookingFormData } from './BookingWizardContainer';
import { createBooking, openWhatsAppWithBookingDetails } from '@/services/bookingService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface BookingConfirmationProps {
  formData: BookingFormData;
  doctorName: string;
  specialtyName: string;
  formattedDate: string;
  onBookingSuccess: (reference: string) => void;
}

const BookingConfirmation = ({
  formData,
  doctorName,
  specialtyName,
  formattedDate,
  onBookingSuccess
}: BookingConfirmationProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Handle direct booking
  const handleDirectBooking = async () => {
    setSubmitting(true);
    try {
      // Set booking method
      const bookingData = {
        ...formData,
        booking_method: 'online' as 'online' | 'whatsapp' | 'phone'
      };
      
      // Make API call to create booking
      const response = await createBooking(bookingData);
      
      // Show success message
      toast({
        title: "تم إرسال طلب الحجز",
        description: "سيتم التواصل معك قريبًا لتأكيد الحجز.",
      });
      
      // Generate a reference ID using the booking ID
      const referenceId = `REF-${response.id.substring(0, 8)}`;
      
      // Notify parent component of success with booking reference
      onBookingSuccess(referenceId);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "فشل الحجز",
        description: "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle WhatsApp booking - modified to ensure WhatsApp opens regardless of database status
  const handleWhatsAppBooking = async () => {
    setSubmitting(true);
    
    // Always open WhatsApp with booking details first
    openWhatsAppWithBookingDetails({
      doctorName,
      specialtyName,
      date: formattedDate,
      time: formData.booking_time,
      userName: formData.user_name,
      phone: formData.user_phone,
      email: formData.user_email,
      notes: formData.notes
    });
    
    try {
      // Then try to save to database in the background
      const bookingData = {
        ...formData,
        booking_method: 'whatsapp' as 'online' | 'whatsapp' | 'phone'
      };
      
      // Make API call to create booking
      const response = await createBooking(bookingData);
      
      // Generate a reference ID using the booking ID
      const referenceId = `REF-${response.id.substring(0, 8)}`;
      
      // Notify parent component of success with booking reference
      onBookingSuccess(referenceId);
      
      // Success toast
      toast({
        title: "تم إرسال طلب الحجز",
        description: "تم فتح الواتساب وحفظ بيانات الحجز بنجاح.",
      });
    } catch (error) {
      console.error('WhatsApp booking database error:', error);
      toast({
        title: "تنبيه",
        description: "تم فتح الواتساب، لكن هناك مشكلة في حفظ البيانات. لا تقلق، يمكنك متابعة الحجز عبر الواتساب.",
        variant: "default",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">تأكيد الحجز</h2>
        <p className="text-gray-600">تأكد من صحة البيانات ثم قم بتأكيد الحجز</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-600 px-4 py-3 border-b border-blue-300 text-white">
          <h3 className="font-medium flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            تفاصيل الحجز
          </h3>
        </div>
        
        <div className="p-4">
          <ul className="space-y-4">
            <li className="flex items-start border-b border-dashed border-blue-200 pb-3">
              <Users className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">الطبيب:</p>
                <p className="font-medium">{doctorName}</p>
              </div>
            </li>
            <li className="flex items-start border-b border-dashed border-blue-200 pb-3">
              <Users className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">التخصص:</p>
                <p className="font-medium">{specialtyName}</p>
              </div>
            </li>
            <li className="flex items-start border-b border-dashed border-blue-200 pb-3">
              <Calendar className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">الموعد:</p>
                <p className="font-medium">{formattedDate} - {formData.booking_time}</p>
              </div>
            </li>
            <li className="flex items-start border-b border-dashed border-blue-200 pb-3">
              <Users className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">الاسم:</p>
                <p className="font-medium">{formData.user_name}</p>
              </div>
            </li>
            <li className="flex items-start border-b border-dashed border-blue-200 pb-3">
              <Phone className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">رقم الهاتف:</p>
                <p className="font-medium" dir="ltr">{formData.user_phone}</p>
              </div>
            </li>
            {formData.user_email && (
              <li className="flex items-start border-b border-dashed border-blue-200 pb-3">
                <Mail className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">البريد الإلكتروني:</p>
                  <p className="font-medium">{formData.user_email}</p>
                </div>
              </li>
            )}
            {formData.notes && (
              <li className="flex items-start">
                <StickyNote className="h-5 w-5 text-blue-600 ml-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">ملاحظات:</p>
                  <p className="font-medium">{formData.notes}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
        <p className="text-sm text-yellow-800 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            <span className="font-bold">ملاحظة: </span>
            سيتم تأكيد حجزك عبر الهاتف أو الواتساب، ويمكنك التواصل مع العيادة في أي وقت.
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Button 
          onClick={handleDirectBooking} 
          className="bg-brand hover:bg-brand-dark text-white py-6 text-lg rounded-xl"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] ml-2"></span>
              جاري إرسال طلب الحجز...
            </>
          ) : (
            <>
              <CheckCircle2 className="ml-2 h-5 w-5" />
              تأكيد الحجز
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleWhatsAppBooking} 
          className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2"
          disabled={submitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          تأكيد عبر واتساب
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-500">
        بالضغط على تأكيد الحجز، أنت توافق على سياسة الخصوصية والشروط والأحكام الخاصة بالعيادة
      </p>
    </div>
  );
};

export default BookingConfirmation;
