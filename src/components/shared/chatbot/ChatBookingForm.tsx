
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createBooking } from '@/services/bookingService';
import { toast } from '@/hooks/use-toast';
import { getDoctorSchedule } from '@/services/doctorService';

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
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Arabic day names mapping
  const arabicDayNames = {
    'Sat': 'السبت',
    'Sun': 'الأحد',
    'Mon': 'الاثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس',
    'Fri': 'الجمعة'
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const doctorSchedule = await getDoctorSchedule(doctorId);
        setSchedule(doctorSchedule);
        console.log('Fetched doctor schedule:', doctorSchedule);
      } catch (error) {
        console.error('Error fetching doctor schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchSchedule();
    }
  }, [doctorId]);

  const handleTimeSelection = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    
    // Create a simple formatted date for display
    const arabicDay = arabicDayNames[day as keyof typeof arabicDayNames] || day;
    setFormattedDate(`${arabicDay} في ${time}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !selectedDay || !selectedTime) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع البيانات المطلوبة واختيار موعد",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        user_name: formData.name,
        user_phone: formData.phone,
        user_email: null,
        notes: formData.notes || null,
        specialty_id: specialtyId || null,
        doctor_id: doctorId,
        booking_day: selectedDay,
        booking_time: selectedTime,
        booking_method: 'online' as const
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
                📅 {formattedDate}
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
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor Info Header */}
            <div className="text-center pb-3 border-b border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-1">
                حجز موعد مع د. {doctorName}
              </h3>
              <p className="text-sm text-blue-600">
                يرجى ملء البيانات أدناه لإتمام الحجز
              </p>
            </div>

            {/* Unified Schedule Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <Label className="text-blue-800 font-medium text-sm">اختر موعد الكشف</Label>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <Clock className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">جاري تحميل المواعيد...</p>
                </div>
              ) : Object.keys(schedule).length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-700">لا توجد مواعيد متاحة حالياً</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-white border-green-300 hover:bg-green-50 text-green-600"
                    onClick={() => window.open('https://wa.me/201119007403', '_blank')}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    تواصل مع العيادة
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(schedule).map(([day, times]) => {
                    const arabicDay = arabicDayNames[day as keyof typeof arabicDayNames] || day;
                    return (
                      <div key={day} className="bg-white/70 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">{arabicDay}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {times.map((time, index) => (
                            <Button
                              key={`${day}-${time}-${index}`}
                              type="button"
                              variant={selectedDay === day && selectedTime === time ? "default" : "outline"}
                              size="sm"
                              className={`text-xs h-8 px-3 ${
                                selectedDay === day && selectedTime === time 
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                                  : 'border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white'
                              }`}
                              onClick={() => handleTimeSelection(day, time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <Label className="text-blue-800 font-medium text-sm">بيانات المريض</Label>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs text-gray-700 mb-1 block">
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                    className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-xs text-gray-700 mb-1 block">
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm"
                    required
                  />
                </div>
              
                <div>
                  <Label htmlFor="notes" className="text-xs text-gray-700 mb-1 block">
                    ملاحظات إضافية
                  </Label>
                  <Input
                    id="notes"
                    type="text"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي ملاحظات أو تفاصيل إضافية"
                    className="bg-white border-gray-300 focus:border-blue-500 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !selectedDay || !selectedTime || !formData.name.trim() || !formData.phone.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 h-10 text-sm font-medium transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  جاري الحجز...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  تأكيد الحجز
                </>
              )}
            </Button>

            {/* Contact fallback */}
            <div className="text-center pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600 mb-2">
                أو يمكنك التواصل معنا مباشرة
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://wa.me/201119007403', '_blank')}
                  className="border-green-500 text-green-600 hover:bg-green-50 text-xs h-8"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  واتساب
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('tel:+201119007403', '_self')}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 text-xs h-8"
                >
                  <Phone className="h-3 w-3 mr-1" />
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
