
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { weekDays, dayMappings } from '@/data/doctors';
import { Doctor, getDoctors, getDoctorsBySpecialty } from '@/services/doctorService';
import { specialties } from '@/data/specialties';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface BookingFormData {
  specialty: string | null;
  doctor: Doctor | null;
  day: string | null;
  time: string | null;
  name: string;
  phone: string;
  email?: string;
  notes: string;
}

const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    specialty: null,
    doctor: null,
    day: null,
    time: null,
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [bookingMethod, setBookingMethod] = useState<'whatsapp' | 'form'>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Step 1: Select specialty
  const handleSpecialtySelect = async (specialtyName: string) => {
    // Find the specialty ID
    const specialty = specialties.find(s => s.name === specialtyName);
    
    if (!specialty) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على التخصص",
        variant: "destructive"
      });
      return;
    }

    // Filter doctors by specialty ID
    const doctorsInSpecialty = await getDoctorsBySpecialty(specialty.id);

    setFormData({ ...formData, specialty: specialtyName, doctor: null, day: null, time: null });
    setFilteredDoctors(doctorsInSpecialty);
    setAvailableTimes([]);
    setStep(2);
  };

  // Step 2: Select doctor
  const handleDoctorSelect = (doctor: Doctor) => {
    setFormData({ ...formData, doctor, day: null, time: null });
    setStep(3);
  };

  // Step 3: Select day and time
  const handleDaySelect = (day: string) => {
    if (!formData.doctor) return;

    const englishDay = Object.entries({
      'السبت': 'Sat',
      'الأحد': 'Sun',
      'الاثنين': 'Mon',
      'الثلاثاء': 'Tue',
      'الأربعاء': 'Wed',
      'الخميس': 'Thu',
      'الجمعة': 'Fri'
    }).find(([arabicDay]) => arabicDay === day)?.[1];

    if (!englishDay) return;

    // Get available times for the selected doctor and day
    const schedule = formData.doctor.schedule;
    const times = (schedule && schedule[englishDay]) || [];
    
    setFormData({ ...formData, day, time: null });
    setAvailableTimes(times);
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, time });
  };

  const handleScheduleConfirm = () => {
    setStep(4);
  };

  // Find specialty ID by specialty name
  const findSpecialtyId = (specialtyName: string | null): number | null => {
    if (!specialtyName) return null;
    const specialty = specialties.find(s => s.name === specialtyName);
    return specialty ? specialty.id : null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bookingMethod === 'whatsapp') {
      // Format message for WhatsApp
      const { specialty, doctor, day, time } = formData;
      const message = `مرحباً، أود حجز موعد مع ${doctor?.name} (${specialty}) يوم ${day} الساعة ${time}.`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/201119007403?text=${encodedMessage}`, '_blank');
    } else {
      // Handle form submission to Supabase
      try {
        setIsSubmitting(true);
        
        // Find specialty ID
        const specialtyId = findSpecialtyId(formData.specialty);
        
        const bookingData = {
          user_name: formData.name,
          user_phone: formData.phone,
          user_email: formData.email || null,
          doctor_id: formData.doctor?.id || null,
          specialty_id: specialtyId,
          booking_day: formData.day,
          booking_time: formData.time,
          notes: formData.notes || null,
          booking_method: 'form'
        };
        
        console.log('Submitting booking data:', bookingData);
        
        const { error } = await supabase
          .from('bookings')
          .insert(bookingData);
          
        if (error) throw error;
        
        // Show success toast
        toast({
          title: "تم إرسال طلب الحجز بنجاح!",
          description: "سنتواصل معك قريباً لتأكيد الموعد.",
        });
        
        // Reset form
        setFormData({
          specialty: null,
          doctor: null,
          day: null,
          time: null,
          name: '',
          phone: '',
          email: '',
          notes: '',
        });
        
        // Go back to first step
        setStep(1);
      } catch (error) {
        console.error('Error submitting booking:', error);
        toast({
          title: "حدث خطأ أثناء إرسال طلب الحجز",
          description: "يرجى المحاولة مرة أخرى لاحقاً.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Check if doctor is available on a specific day
  const isDoctorAvailableOnDay = (doctor: Doctor, arabicDay: string): boolean => {
    const englishDay = dayMappings[arabicDay as keyof typeof dayMappings];
    const schedule = doctor.schedule || {};
    return !!schedule[englishDay]?.length;
  };

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Helper function to get specialty name by ID
  const getSpecialtyNameById = (specialtyId: number | undefined): string => {
    if (!specialtyId) return '';
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.name : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === i 
                  ? 'bg-brand text-white' 
                  : step > i 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > i ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i
              )}
            </div>
          ))}
        </div>
        <div className="flex">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1 flex-grow ${step > i ? 'bg-green-500' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div className="w-10 text-center">التخصص</div>
          <div className="w-10 text-center">الطبيب</div>
          <div className="w-10 text-center">الموعد</div>
          <div className="w-10 text-center">التأكيد</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">اختر التخصص الطبي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialties.map((specialty) => (
                <div
                  key={specialty.id}
                  className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors"
                  onClick={() => handleSpecialtySelect(specialty.name)}
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{specialty.name}</h3>
                  <p className="text-gray-600 text-sm">{specialty.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">اختر الطبيب</h2>
              <Button variant="outline" onClick={() => setStep(1)}>
                تغيير التخصص
              </Button>
            </div>
            
            <p className="text-gray-600 mb-6">
              التخصص المختار: <span className="font-bold text-brand">{formData.specialty}</span>
            </p>

            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.name}
                    className="bg-white border border-gray-200 hover:border-brand rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                        <p className="text-gray-600 text-sm">{getSpecialtyNameById(doctor.specialty_id)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-gray-500">
                        رسوم الكشف: 
                        <span className="font-medium text-gray-700 mr-1">
                          {typeof doctor.fees.examination === 'number' 
                            ? `${doctor.fees.examination} جنيه` 
                            : doctor.fees.examination}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">لا يوجد أطباء متاحين في هذا التخصص حالياً.</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && formData.doctor && (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">اختر الموعد</h2>
              <Button variant="outline" onClick={() => setStep(2)}>
                تغيير الطبيب
              </Button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{formData.doctor.name}</h3>
              <p className="text-gray-600">{getSpecialtyNameById(formData.doctor.specialty_id)}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">اختر اليوم:</h3>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isAvailable = isDoctorAvailableOnDay(formData.doctor!, day);
                  return (
                    <Button
                      key={day}
                      variant={formData.day === day ? "default" : "outline"}
                      className={!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
                      onClick={() => isAvailable && handleDaySelect(day)}
                      disabled={!isAvailable}
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
            </div>

            {formData.day && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">اختر الوقت:</h3>
                {availableTimes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={formData.time === time ? "default" : "outline"}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لا توجد مواعيد متاحة في هذا اليوم.</p>
                )}
              </div>
            )}

            {formData.time && (
              <div className="text-center mt-8">
                <Button 
                  className="bg-brand hover:bg-brand-dark w-full sm:w-auto" 
                  size="lg"
                  onClick={handleScheduleConfirm}
                >
                  تأكيد الموعد
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">أكمل الحجز</h2>
              <Button variant="outline" onClick={() => setStep(3)}>
                تغيير الموعد
              </Button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">تفاصيل الموعد</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>الطبيب:</strong> {formData.doctor?.name}</li>
                <li><strong>التخصص:</strong> {formData.specialty}</li>
                <li><strong>اليوم:</strong> {formData.day}</li>
                <li><strong>الوقت:</strong> {formData.time}</li>
                <li><strong>رسوم الكشف:</strong> {typeof formData.doctor?.fees.examination === 'number' 
                  ? `${formData.doctor?.fees.examination} جنيه` 
                  : formData.doctor?.fees.examination}
                </li>
              </ul>
            </div>

            <Tabs defaultValue="whatsapp" className="mb-6" onValueChange={(value) => setBookingMethod(value as 'whatsapp' | 'form')}>
              <TabsList className="w-full">
                <TabsTrigger value="whatsapp" className="w-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  حجز عبر واتساب
                </TabsTrigger>
                <TabsTrigger value="form" className="w-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  تعبئة نموذج
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="whatsapp" className="mt-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="mb-4">سيتم تحويلك إلى واتساب لإتمام عملية الحجز</p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    size="lg"
                    onClick={handleSubmit}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    إكمال الحجز عبر واتساب
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="form" className="mt-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="block text-gray-700 mb-1" htmlFor="name">الاسم الكامل</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border-gray-300 p-3 bg-white border focus:outline-none focus:ring-2 focus:ring-brand"
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div className="form-group">
                        <label className="block text-gray-700 mb-1" htmlFor="phone">رقم الهاتف</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border-gray-300 p-3 bg-white border focus:outline-none focus:ring-2 focus:ring-brand"
                          placeholder="أدخل رقم هاتفك"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-gray-700 mb-1" htmlFor="email">البريد الإلكتروني (اختياري)</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 p-3 bg-white border focus:outline-none focus:ring-2 focus:ring-brand"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-gray-700 mb-1" htmlFor="notes">ملاحظات إضافية (اختياري)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-md border-gray-300 p-3 bg-white border focus:outline-none focus:ring-2 focus:ring-brand"
                        placeholder="أضف أي ملاحظات إضافية مثل سبب الزيارة أو أعراض المرض"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="bg-brand hover:bg-brand-dark w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingWizard;
