
import { useState } from 'react';
import { Check, Calendar, Users, Phone, Mail, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingFormData } from './BookingWizardContainer';

interface BookingConfirmationProps {
  formData: BookingFormData;
  doctorName: string;
  specialtyName: string;
  formattedDate: string;
  onBookingSuccess: (reference: string) => void;
  onWhatsAppBooking: () => void;
}

const BookingConfirmation = ({ 
  formData, 
  doctorName, 
  specialtyName, 
  formattedDate,
  onBookingSuccess,
  onWhatsAppBooking
}: BookingConfirmationProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Handle standard booking submission
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Import and use createBooking only when needed
      const { createBooking } = await import('@/services/bookingService');
      
      // Make API call to create booking
      const response = await createBooking(formData);
      
      // Pass the booking reference to parent component
      onBookingSuccess(response.id);
      
    } catch (error) {
      console.error('Booking error:', error);
      // Import toast only when needed
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "فشل الحجز",
        description: "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle WhatsApp booking - now passes to parent component
  const handleWhatsAppBooking = () => {
    onWhatsAppBooking();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">تأكيد الحجز</h2>
        <p className="text-gray-600 mt-2">يرجى مراجعة تفاصيل الحجز قبل التأكيد</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-medium mb-4 text-blue-800">تفاصيل الحجز:</h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <Users className="h-5 w-5 text-blue-700 ml-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">الطبيب:</p>
              <p className="font-medium text-blue-900">{doctorName}</p>
            </div>
          </li>
          <li className="flex items-start">
            <Users className="h-5 w-5 text-blue-700 ml-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">التخصص:</p>
              <p className="font-medium text-blue-900">{specialtyName}</p>
            </div>
          </li>
          <li className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-700 ml-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">الموعد:</p>
              <p className="font-medium text-blue-900">{formattedDate} - {formData.booking_time}</p>
            </div>
          </li>
          <li className="flex items-start">
            <Phone className="h-5 w-5 text-blue-700 ml-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">رقم الهاتف:</p>
              <p className="font-medium text-blue-900" dir="ltr">{formData.user_phone}</p>
            </div>
          </li>
          {formData.user_email && (
            <li className="flex items-start">
              <Mail className="h-5 w-5 text-blue-700 ml-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">البريد الإلكتروني:</p>
                <p className="font-medium text-blue-900">{formData.user_email}</p>
              </div>
            </li>
          )}
          {formData.notes && (
            <li className="flex items-start">
              <StickyNote className="h-5 w-5 text-blue-700 ml-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">ملاحظات:</p>
                <p className="font-medium text-blue-900">{formData.notes}</p>
              </div>
            </li>
          )}
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          اختر طريقة تأكيد الحجز المناسبة لك:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={handleSubmit} 
          className="bg-brand hover:bg-brand-dark text-white py-6"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] ml-2"></span>
              جاري إرسال طلب الحجز...
            </>
          ) : (
            'تأكيد الحجز عبر الموقع'
          )}
        </Button>
        
        <Button 
          onClick={handleWhatsAppBooking} 
          className="bg-green-600 hover:bg-green-700 text-white py-6 flex items-center justify-center gap-2"
          disabled={submitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          تأكيد الحجز عبر واتساب
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500">
        نوصي بالتأكيد عبر واتساب للتواصل المباشر مع العيادة
      </p>
    </div>
  );
};

export default BookingConfirmation;
