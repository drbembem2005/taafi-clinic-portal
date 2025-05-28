
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBooking } from '@/services/bookingService';
import { CalendarDays, User, Phone, Mail, MessageSquare, Loader2, CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react';

interface ChatBookingFormProps {
  doctorId: number;
  doctorName: string;
  specialtyId?: number;
  onBookingComplete: (success: boolean) => void;
}

const ChatBookingForm = ({ doctorId, doctorName, specialtyId, onBookingComplete }: ChatBookingFormProps) => {
  console.log('📋 ChatBookingForm: Initialized with:', { doctorId, doctorName, specialtyId });
  
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, user_phone: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 ChatBookingForm: Form submission started');
    console.log('📝 Form data:', formData);
    
    if (!formData.user_name.trim()) {
      setError('الرجاء إدخال الاسم');
      return;
    }
    
    if (!formData.user_phone.trim() || formData.user_phone.length < 10) {
      setError('الرجاء إدخال رقم هاتف صحيح');
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
    
    console.log('📤 Sending booking data:', bookingData);
    
    try {
      const result = await createBooking(bookingData);
      console.log('✅ Booking created successfully:', result);
      
      setIsSuccess(true);
      setTimeout(() => {
        onBookingComplete(true);
      }, 2000);
    } catch (error) {
      console.error('❌ Booking error:', error);
      setError('حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى');
      onBookingComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
        </motion.div>
        <h3 className="text-green-800 font-bold text-lg mb-2">تم الحجز بنجاح! 🎉</h3>
        <p className="text-green-600">سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 p-3 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl">
        <CalendarDays className="w-6 h-6 text-blue-500" />
        <div>
          <h3 className="font-bold text-gray-800">حجز موعد</h3>
          <p className="text-sm text-gray-600">مع د. {doctorName}</p>
        </div>
      </div>

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Info Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            البيانات الشخصية
          </h4>
          
          <div className="space-y-3">
            <Input
              id="chat-booking-name"
              name="user_name"
              placeholder="الاسم الكامل *"
              value={formData.user_name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, user_name: e.target.value }));
                setError(null);
              }}
              className="h-12 rounded-xl border-gray-200 focus:border-blue-400"
              required
              autoComplete="name"
            />

            <Input
              id="chat-booking-phone"
              name="user_phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="رقم الهاتف *"
              value={formData.user_phone}
              onChange={handlePhoneChange}
              className="h-12 rounded-xl border-gray-200 focus:border-blue-400 text-left"
              dir="ltr"
              maxLength={15}
              required
              autoComplete="tel"
            />

            <Input
              id="chat-booking-email"
              name="user_email"
              placeholder="البريد الإلكتروني (اختياري)"
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
              className="h-12 rounded-xl border-gray-200 focus:border-blue-400"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Appointment Time Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            موعد الحجز المفضل
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <select
              id="chat-booking-day"
              name="booking_day"
              value={formData.booking_day}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_day: e.target.value }))}
              className="h-12 px-4 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white"
            >
              <option value="السبت">السبت</option>
              <option value="الأحد">الأحد</option>
              <option value="الاثنين">الاثنين</option>
              <option value="الثلاثاء">الثلاثاء</option>
              <option value="الأربعاء">الأربعاء</option>
              <option value="الخميس">الخميس</option>
            </select>

            <select
              id="chat-booking-time"
              name="booking_time"
              value={formData.booking_time}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_time: e.target.value }))}
              className="h-12 px-4 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white"
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
        </div>

        {/* Notes Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            ملاحظات إضافية
          </h4>
          
          <Textarea
            id="chat-booking-notes"
            name="notes"
            placeholder="اكتب أي ملاحظات أو أعراض تود ذكرها للطبيب (اختياري)"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="rounded-xl border-gray-200 focus:border-blue-400 min-h-[80px] resize-none"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.user_name.trim() || !formData.user_phone.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white rounded-xl font-medium h-12 text-base shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              جاري الحجز...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              تأكيد الحجز
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ChatBookingForm;
