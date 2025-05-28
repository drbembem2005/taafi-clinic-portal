
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createBooking } from '@/services/bookingService';
import { toast } from '@/hooks/use-toast';
import NextAvailableDaysPicker, { DayInfo } from '@/components/booking/NextAvailableDaysPicker';

interface ChatBookingFormProps {
  doctorId: number;
  doctorName: string;
  specialtyId?: number;
  onBookingComplete: (success: boolean) => void;
}

const ChatBookingForm = ({
  doctorId,
  doctorName,
  specialtyId,
  onBookingComplete
}: ChatBookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<DayInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDateTimeSelection = (
    day: string,
    time: string,
    formatted: string,
    days: DayInfo[],
    date: Date
  ) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setFormattedDate(formatted);
    setAvailableDays(days);
    setSelectedDate(date);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !selectedDate || !selectedTime) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        doctor_id: doctorId,
        specialty_id: specialtyId || null,
        patient_name: formData.name,
        patient_phone: formData.phone,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
        notes: formData.notes || null,
        status: 'pending' as const
      };

      console.log('Submitting booking with data:', bookingData);

      const result = await createBooking(bookingData);
      
      if (result) {
        setIsSuccess(true);
        toast({
          title: "تم الحجز بنجاح!",
          description: `تم حجز موعدك مع د. ${doctorName} بنجاح`,
        });
        onBookingComplete(true);
      } else {
        throw new Error('فشل في إنشاء الحجز');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "خطأ في الحجز",
        description: "حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      onBookingComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-green-800 mb-2">تم الحجز بنجاح!</h3>
            <p className="text-green-700 mb-4">
              تم حجز موعدك مع د. {doctorName} بنجاح
            </p>
            <div className="bg-white/60 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-600">
                📅 {formattedDate} في {selectedTime}
              </p>
            </div>
            <p className="text-sm text-green-600">
              سيتم التواصل معك قريباً لتأكيد الموعد
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Info Header */}
            <div className="text-center pb-4 border-b border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-1">
                حجز موعد مع د. {doctorName}
              </h3>
              <p className="text-sm text-blue-600">
                يرجى ملء البيانات أدناه لإتمام الحجز
              </p>
            </div>

            {/* Schedule Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <Label className="text-blue-800 font-medium">اختر موعد الكشف</Label>
              </div>
              
              <NextAvailableDaysPicker
                doctorId={doctorId}
                onSelectDateTime={handleDateTimeSelection}
                selectedDay={selectedDay}
                selectedTime={selectedTime}
              />
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <Label className="text-blue-800 font-medium">بيانات المريض</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm text-gray-700 mb-1 block">
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                    className="bg-white border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm text-gray-700 mb-1 block">
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="bg-white border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-sm text-gray-700 mb-1 block">
                  ملاحظات إضافية
                </Label>
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="أي ملاحظات أو تفاصيل إضافية"
                  className="bg-white border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !selectedDate || !selectedTime || !formData.name.trim() || !formData.phone.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 h-12 text-lg font-medium transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  جاري الحجز...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  تأكيد الحجز
                </>
              )}
            </Button>

            {/* Contact fallback */}
            <div className="text-center pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                أو يمكنك التواصل معنا مباشرة
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://wa.me/201119007403', '_blank')}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  واتساب
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('tel:+201119007403', '_self')}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  اتصال
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatBookingForm;
