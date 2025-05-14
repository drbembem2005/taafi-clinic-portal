
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { weekDays, dayMappings } from '@/data/doctors';
import { Doctor, getDoctors, getDoctorsBySpecialty } from '@/services/doctorService';
import { specialties } from '@/data/specialties';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Calendar, Phone, User, CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';

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

  // Reorder weekDays to start with Saturday
  const orderedWeekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

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

  // Go back one step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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

  // Get color for specialty badges
  const getSpecialtyColor = (specialtyName: string) => {
    const colorMap: Record<string, string> = {
      "طب الأطفال وحديثي الولادة": "bg-blue-500",
      "النساء والتوليد والعقم": "bg-pink-500",
      "الجلدية والتجميل": "bg-purple-500",
      "الجراحة العامة والمناظير": "bg-red-500",
      "الذكورة وتأخر الإنجاب": "bg-indigo-500",
      "الباطنة والسكري والغدد والكلى": "bg-green-500",
      "الأمراض النفسية وتعديل السلوك": "bg-violet-500",
      "علاج الأورام والمناظير": "bg-amber-500",
      "جراحة المخ والأعصاب والعمود الفقري": "bg-cyan-500",
      "الأنف والأذن والحنجرة": "bg-orange-500",
      "العظام والمفاصل وإصابات الملاعب": "bg-lime-500",
      "الروماتيزم والمفاصل": "bg-teal-500",
      "التغذية العلاجية والعلاج الطبيعي": "bg-emerald-500",
      "طب وجراحة الأسنان": "bg-sky-500",
    };
    return colorMap[specialtyName] || "bg-gray-500";
  };

  // Progress step components
  const ProgressBar = () => (
    <div className="relative mt-2 mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>
      <div className="relative flex justify-between">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step === i 
                ? 'bg-brand text-white' 
                : step > i 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step > i ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
        <div className="text-center">التخصص</div>
        <div className="text-center">الطبيب</div>
        <div className="text-center">الموعد</div>
        <div className="text-center">التأكيد</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 md:p-6">
        <ProgressBar />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">اختر التخصص الطبي</h2>
                <p className="text-gray-500 text-sm mt-1">الخطوة الأولى: تحديد نوع التخصص المطلوب</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialties.map((specialty) => (
                  <motion.div
                    key={specialty.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all border shadow-sm hover:shadow-md hover:border-brand/50 flex items-center`}
                    onClick={() => handleSpecialtySelect(specialty.name)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-10 h-10 rounded-full ${getSpecialtyColor(specialty.name)} text-white flex items-center justify-center shrink-0 ml-3`}>
                      <span className="text-lg font-bold">{specialty.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{specialty.name}</h3>
                      <p className="text-gray-500 text-xs line-clamp-1">{specialty.description}</p>
                    </div>
                  </motion.div>
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
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">اختر الطبيب</h2>
                <p className="text-gray-500 text-sm mt-1">الخطوة الثانية: تحديد الطبيب المناسب لحالتك</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 flex items-center mb-3">
                <div className={`w-8 h-8 rounded-full ${getSpecialtyColor(formData.specialty || '')} text-white flex items-center justify-center mr-3`}>
                  <span className="text-sm font-bold">{formData.specialty?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    التخصص المختار: <span className="font-bold text-brand">{formData.specialty}</span>
                  </p>
                </div>
              </div>
              
              {filteredDoctors.length > 0 ? (
                <div className="space-y-3">
                  {filteredDoctors.map((doctor) => (
                    <motion.div
                      key={doctor.id}
                      className="border rounded-lg p-3 cursor-pointer transition-all hover:border-brand/50 hover:shadow-sm"
                      onClick={() => handleDoctorSelect(doctor)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ml-3 shrink-0">
                          {doctor.image ? (
                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <User className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                          <p className="text-gray-500 text-xs">
                            {getSpecialtyNameById(doctor.specialty_id)}
                          </p>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="mt-2 pt-2 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          رسوم الكشف: 
                          <span className="font-medium text-gray-700 mr-1">
                            {typeof doctor.fees.examination === 'number' 
                              ? `${doctor.fees.examination} جنيه` 
                              : doctor.fees.examination}
                          </span>
                        </span>
                        <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full">
                          متاح
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                    <User className="h-8 w-8" />
                  </div>
                  <p className="text-gray-500">لا يوجد أطباء متاحين في هذا التخصص حالياً.</p>
                </div>
              )}
              
              <div className="mt-6 flex">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                  رجوع
                </Button>
              </div>
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
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">اختر الموعد</h2>
                <p className="text-gray-500 text-sm mt-1">الخطوة الثالثة: تحديد يوم وتوقيت الزيارة</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center ml-3 shrink-0">
                  {formData.doctor.image ? (
                    <img src={formData.doctor.image} alt={formData.doctor.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-md">{formData.doctor.name}</h3>
                  <p className="text-xs text-gray-600">{getSpecialtyNameById(formData.doctor.specialty_id)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white">
                  <h3 className="text-md font-bold text-gray-800 mb-2">اختر اليوم:</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {orderedWeekDays.map((day) => {
                      const isAvailable = isDoctorAvailableOnDay(formData.doctor!, day);
                      return (
                        <Button
                          key={day}
                          variant={formData.day === day ? "default" : "outline"}
                          className={`text-xs ${!isAvailable ? "opacity-40 cursor-not-allowed" : ""}`}
                          onClick={() => isAvailable && handleDaySelect(day)}
                          disabled={!isAvailable}
                          size="sm"
                        >
                          {day}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {formData.day && (
                  <div className="bg-white">
                    <h3 className="text-md font-bold text-gray-800 mb-2">اختر الوقت:</h3>
                    {availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={formData.time === time ? "default" : "outline"}
                            onClick={() => handleTimeSelect(time)}
                            size="sm"
                            className="text-xs"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">لا توجد مواعيد متاحة في هذا اليوم.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                  رجوع
                </Button>
                
                {formData.time && (
                  <Button 
                    className="bg-brand hover:bg-brand-dark flex-1" 
                    onClick={handleScheduleConfirm}
                  >
                    متابعة
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                )}
              </div>
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
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">أكمل الحجز</h2>
                <p className="text-gray-500 text-sm mt-1">الخطوة الرابعة: تأكيد بيانات الحجز</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-3 text-center">تفاصيل الموعد</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full">
                      <User className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">الطبيب</p>
                      <p className="font-medium">{formData.doctor?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">الموعد</p>
                      <p className="font-medium">{formData.day} - {formData.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">التخصص</p>
                      <p className="font-medium">{formData.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full">
                      <Phone className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">رسوم الكشف</p>
                      <p className="font-medium">
                        {typeof formData.doctor?.fees.examination === 'number' 
                          ? `${formData.doctor?.fees.examination} جنيه` 
                          : formData.doctor?.fees.examination}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs 
                defaultValue="whatsapp" 
                className="mt-6" 
                onValueChange={(value) => setBookingMethod(value as 'whatsapp' | 'form')}
              >
                <div className="bg-gray-50 rounded-lg p-1">
                  <TabsList className="w-full bg-transparent grid grid-cols-2 gap-1">
                    <TabsTrigger value="whatsapp" className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      حجز عبر واتساب
                    </TabsTrigger>
                    <TabsTrigger value="form" className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      تعبئة نموذج
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="whatsapp" className="mt-4">
                  <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
                    <div className="text-green-600 bg-green-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <p className="mb-4 text-gray-600 text-sm">سيتم تحويلك إلى واتساب لإتمام عملية الحجز</p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white w-full" 
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
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="form-group">
                          <label className="block text-gray-700 mb-1 text-sm" htmlFor="name">الاسم الكامل</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-md border-gray-300 p-2 bg-white border focus:outline-none focus:ring-1 focus:ring-brand text-sm"
                            placeholder="أدخل اسمك الكامل"
                          />
                        </div>
                        <div className="form-group">
                          <label className="block text-gray-700 mb-1 text-sm" htmlFor="phone">رقم الهاتف</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-md border-gray-300 p-2 bg-white border focus:outline-none focus:ring-1 focus:ring-brand text-sm"
                            placeholder="أدخل رقم هاتفك"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-gray-700 mb-1 text-sm" htmlFor="email">البريد الإلكتروني (اختياري)</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-md border-gray-300 p-2 bg-white border focus:outline-none focus:ring-1 focus:ring-brand text-sm"
                          placeholder="أدخل بريدك الإلكتروني"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-gray-700 mb-1 text-sm" htmlFor="notes">ملاحظات إضافية (اختياري)</label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full rounded-md border-gray-300 p-2 bg-white border focus:outline-none focus:ring-1 focus:ring-brand text-sm"
                          placeholder="أضف أي ملاحظات إضافية مثل سبب الزيارة أو أعراض المرض"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleBack}
                        type="button"
                        className="flex-1"
                      >
                        <ChevronRight className="h-4 w-4 ml-1" />
                        رجوع
                      </Button>
                      
                      <Button 
                        type="submit" 
                        className="bg-brand hover:bg-brand-dark flex-1" 
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
    </div>
  );
};

export default BookingWizard;
