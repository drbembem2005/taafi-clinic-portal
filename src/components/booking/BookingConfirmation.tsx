
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingFormData } from './BookingWizardContainer';
import { createBooking, openWhatsAppWithBookingDetails } from '@/services/bookingService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Calendar, 
  User,
  MessageSquare,
  Phone,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappSubmitting, setWhatsappSubmitting] = useState(false);
  
  // Function to handle online booking submission
  const handleOnlineBooking = async () => {
    setIsSubmitting(true);
    
    try {
      // Set booking method to online
      const bookingData = {
        ...formData,
        booking_method: 'online'
      };
      
      // Make API call to create booking
      const response = await createBooking(bookingData);
      
      // Show success toast
      toast({
        title: "تم الحجز بنجاح",
        description: "سيتم التواصل معك قريبًا لتأكيد الحجز.",
      });
      
      // Call onBookingSuccess with the booking reference
      if (response && response.id) {
        onBookingSuccess(response.id);
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "فشل الحجز",
        description: "حدث خطأ أثناء إنشاء الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to handle WhatsApp booking
  const handleWhatsAppBooking = async () => {
    setWhatsappSubmitting(true);
    
    try {
      // First create the booking in our database
      const bookingData = {
        ...formData,
        booking_method: 'whatsapp'
      };
      
      // Save the booking to the database (don't wait)
      const saveBookingPromise = createBooking(bookingData)
        .then(response => {
          // Handle success silently
          if (response && response.id) {
            onBookingSuccess(response.id);
          }
        })
        .catch(error => {
          console.error('Error saving WhatsApp booking to database:', error);
          // Show a toast but don't block the WhatsApp opening
          toast({
            title: "تنبيه",
            description: "تم فتح واتساب لكن هناك مشكلة في حفظ الحجز بقاعدة البيانات.",
            variant: "destructive",
          });
        });
      
      // Immediately open WhatsApp regardless of database save success
      openWhatsAppWithBookingDetails({
        doctorName,
        date: formattedDate,
        time: formData.booking_time,
        userName: formData.user_name,
        phone: formData.user_phone,
        email: formData.user_email,
        notes: formData.notes
      });
      
      // Show success toast
      toast({
        title: "تم فتح واتساب",
        description: "يرجى إكمال الحجز عبر واتساب.",
      });
      
    } catch (error) {
      console.error('Error with WhatsApp booking:', error);
      toast({
        title: "تعذر فتح واتساب",
        description: "حدث خطأ أثناء محاولة فتح واتساب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setWhatsappSubmitting(false);
    }
  };
  
  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold text-center mb-4">تأكيد الحجز</h2>
        
        <Card className="bg-gradient-to-b from-white to-gray-50 shadow-md border border-gray-200 overflow-hidden">
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-brand/5 rounded-lg">
                <User className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">الطبيب:</p>
                  <p className="font-medium">{doctorName}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-brand/5 rounded-lg">
                <User className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">التخصص:</p>
                  <p className="font-medium">{specialtyName}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-brand/5 rounded-lg">
                <Calendar className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">الموعد:</p>
                  <p className="font-medium">{formattedDate} - {formData.booking_time}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-brand/5 rounded-lg">
                <User className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">اسم المريض:</p>
                  <p className="font-medium">{formData.user_name}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-brand/5 rounded-lg">
                <Phone className="h-5 w-5 text-brand ml-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">رقم الهاتف:</p>
                  <p className="font-medium">{formData.user_phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-800">
            اختر طريقة تأكيد الحجز المناسبة لك
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleWhatsAppBooking}
              disabled={whatsappSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg rounded-xl flex items-center justify-center"
            >
              {whatsappSubmitting ? (
                <Loader2 className="h-5 w-5 ml-2 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              )}
              تأكيد عبر واتساب
              <ArrowRight className="mr-2 h-5 w-5 opacity-70" />
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleOnlineBooking}
              disabled={isSubmitting}
              className="w-full bg-brand hover:bg-brand/90 py-6 text-lg rounded-xl"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 ml-2 animate-spin" />
              ) : (
                <Check className="h-5 w-5 ml-2" />
              )}
              تأكيد الحجز عبر الموقع
            </Button>
          </motion.div>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-2">
          سيتم التواصل معك قريبًا لتأكيد الحجز
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
