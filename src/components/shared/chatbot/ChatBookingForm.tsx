
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBooking } from '@/services/bookingService';
import { CalendarDays, User, Phone, Mail, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ChatBookingFormProps {
  doctorId: number;
  doctorName: string;
  specialtyId?: number;
  onBookingComplete: (success: boolean) => void;
}

const ChatBookingForm = ({ doctorId, doctorName, specialtyId, onBookingComplete }: ChatBookingFormProps) => {
  console.log('ChatBookingForm: Component rendered with props:', { doctorId, doctorName, specialtyId });
  
  const [formData, setFormData] = useState({
    user_name: '',
    user_phone: '',
    user_email: '',
    notes: '',
    booking_day: 'السبت',
    booking_time: '10:00'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle phone number input to only allow numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setFormData(prev => ({ ...prev, user_phone: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ChatBookingForm: Form submission started with data:', formData);
    
    // Validation
    if (!formData.user_name.trim()) {
      setError('الرجاء إدخال الاسم');
      console.log('ChatBookingForm: Validation failed - missing name');
      return;
    }
    
    if (!formData.user_phone.trim() || formData.user_phone.length < 10) {
      setError('الرجاء إدخال رقم هاتف صحيح');
      console.log('ChatBookingForm: Validation failed - invalid phone');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    const bookingData = {
      ...formData,
      doctor_id: doctorId,
      specialty_id: specialtyId || null,
      booking_method: 'online' as const
    };
    
    console.log('ChatBookingForm: Sending booking data to service:', bookingData);
    
    try {
      const result = await createBooking(bookingData);
      console.log('ChatBookingForm: Booking created successfully:', result);
      
      setIsSuccess(true);
      setTimeout(() => {
        console.log('ChatBookingForm: Calling onBookingComplete with success');
        onBookingComplete(true);
      }, 2000);
    } catch (error) {
      console.error('ChatBookingForm: Error creating booking:', error);
      setError('حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى');
      onBookingComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-green-800 font-bold mb-1">تم الحجز بنجاح!</h3>
        <p className="text-green-600 text-sm">سيتم التواصل معك قريباً</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-gray-800">حجز موعد مع {doctorName}</h3>
      </div>

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="الاسم الكامل *"
            value={formData.user_name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, user_name: e.target.value }));
              setError(null);
            }}
            className="text-sm"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="رقم الهاتف *"
            value={formData.user_phone}
            onChange={handlePhoneChange}
            className="text-sm text-left"
            dir="ltr"
            maxLength={15}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="البريد الإلكتروني (اختياري)"
            type="email"
            value={formData.user_email}
            onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={formData.booking_day}
            onChange={(e) => setFormData(prev => ({ ...prev, booking_day: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="السبت">السبت</option>
            <option value="الأحد">الأحد</option>
            <option value="الاثنين">الاثنين</option>
            <option value="الثلاثاء">الثلاثاء</option>
            <option value="الأربعاء">الأربعاء</option>
            <option value="الخميس">الخميس</option>
          </select>

          <select
            value={formData.booking_time}
            onChange={(e) => setFormData(prev => ({ ...prev, booking_time: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="10:00">10:00 ص</option>
            <option value="11:00">11:00 ص</option>
            <option value="12:00">12:00 ظ</option>
            <option value="14:00">2:00 م</option>
            <option value="15:00">3:00 م</option>
            <option value="16:00">4:00 م</option>
            <option value="17:00">5:00 م</option>
            <option value="18:00">6:00 م</option>
          </select>
        </div>

        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
          <Textarea
            placeholder="ملاحظات إضافية (اختياري)"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="text-sm min-h-[60px]"
            rows={2}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.user_name.trim() || !formData.user_phone.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري الحجز...
            </>
          ) : (
            'تأكيد الحجز'
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ChatBookingForm;
