
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { getDoctorsBySpecialty, Doctor } from '@/services/doctorService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { dayMappings } from '@/data/doctors';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon, Clock, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface BookingFormData {
  specialtyId: number;
  doctorId: number;
  bookingDay: string;
  bookingDate: Date | undefined;
  bookingTime: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  notes?: string;
  bookingMethod: 'whatsapp' | 'call' | 'email';
  termsAccepted: boolean;
}

const BookingWizard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const [formData, setFormData] = useState<BookingFormData>({
    specialtyId: 0,
    doctorId: 0,
    bookingDay: '',
    bookingDate: undefined,
    bookingTime: '',
    userName: '',
    userPhone: '',
    userEmail: '',
    notes: '',
    bookingMethod: 'whatsapp',
    termsAccepted: false
  });

  // Day name translation functions
  const getArabicDay = (englishDay: string): string => {
    const arabicDay = Object.keys(dayMappings).find(
      key => dayMappings[key as keyof typeof dayMappings] === englishDay
    );
    return arabicDay || englishDay;
  };

  const getEnglishDay = (arabicDay: string): string => {
    return dayMappings[arabicDay as keyof typeof dayMappings] || arabicDay;
  };
  
  // Get day name from date
  const getDayNameFromDate = (date: Date): string => {
    const dayName = format(date, 'EEEE', { locale: ar });
    return dayName;
  };
  
  const getEnglishDayFromDate = (date: Date): string => {
    const dayName = format(date, 'EEEE');
    return dayName;
  };

  // Check for state from doctor card navigation
  useEffect(() => {
    if (location.state?.selectedDoctor) {
      const doctorId = location.state.selectedDoctor;
      const specialtyId = location.state.selectedSpecialty;
      
      console.log("Received state from navigation:", { doctorId, specialtyId });
      
      if (specialtyId) {
        setFormData(prev => ({
          ...prev,
          specialtyId: specialtyId
        }));
      }
      
      if (doctorId) {
        setFormData(prev => ({
          ...prev,
          doctorId: doctorId
        }));
      }
    }
  }, [location.state]);

  // Fetch specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const data = await getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل التخصصات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  // When specialty changes, fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!formData.specialtyId) return;
      try {
        setLoading(true);
        const data = await getDoctorsBySpecialty(formData.specialtyId);
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات الأطباء",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [formData.specialtyId]);

  // When doctor changes, fetch schedule from doctor_schedules table
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!formData.doctorId) return;
      
      try {
        setLoading(true);
        console.log(`Fetching schedule for doctor ID: ${formData.doctorId}`);
        
        // Get schedule from the doctor_schedules table
        const { data, error } = await supabase
          .from('doctor_schedules')
          .select('*')
          .eq('doctor_id', formData.doctorId);
          
        if (error) {
          console.error('Error fetching doctor schedule:', error);
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء تحميل جدول المواعيد",
            variant: "destructive",
          });
          setSchedule({});
          setAvailableDays([]);
          setLoading(false);
          return;
        }
        
        // Convert the flat structure to grouped by day format
        const scheduleData: Record<string, string[]> = {};
        data.forEach((item: any) => {
          if (!scheduleData[item.day]) {
            scheduleData[item.day] = [];
          }
          scheduleData[item.day].push(item.time);
        });
        
        console.log('Fetched and processed schedule:', scheduleData);
        
        setSchedule(scheduleData);
        
        // Get available days from schedule
        const days = Object.keys(scheduleData).filter(
          day => scheduleData[day] && scheduleData[day].length > 0
        );
        
        console.log('Available days:', days);
        const arabicDays = days.map(day => getArabicDay(day));
        setAvailableDays(arabicDays);
        
        // Reset booking day and time
        setFormData(prev => ({
          ...prev,
          bookingDay: '',
          bookingTime: '',
          bookingDate: undefined
        }));
        setAvailableTimes([]);
        setSelectedDate(undefined);
      } catch (error) {
        console.error('Error in fetchDoctorSchedule:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل جدول المواعيد",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorSchedule();
  }, [formData.doctorId]);

  // When date changes, update available times
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const englishDayName = getEnglishDayFromDate(selectedDate);
    const arabicDayName = getDayNameFromDate(selectedDate);
    console.log("Selected date day names:", { englishDayName, arabicDayName });

    // Update form data with the selected day (Arabic name)
    setFormData(prev => ({
      ...prev,
      bookingDay: arabicDayName,
      bookingDate: selectedDate,
      bookingTime: ''
    }));

    const times = schedule[englishDayName] || [];
    console.log("Available times for selected day:", times);
    setAvailableTimes(times);
  }, [selectedDate, schedule]);

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const isDateDisabled = (date: Date) => {
    const dayName = getEnglishDayFromDate(date);
    return !schedule[dayName] || schedule[dayName].length === 0;
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      toast({
        title: "الشروط والأحكام",
        description: "يرجى الموافقة على الشروط والأحكام للمتابعة",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitLoading(true);
    try {
      // Convert Arabic day to English before sending to backend
      const englishDay = getEnglishDay(formData.bookingDay);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            doctor_id: formData.doctorId,
            specialty_id: formData.specialtyId,
            booking_day: englishDay,
            booking_time: formData.bookingTime,
            user_name: formData.userName,
            user_phone: formData.userPhone,
            user_email: formData.userEmail || null,
            notes: formData.notes || null,
            booking_method: formData.bookingMethod
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting booking:', error);
        toast({
          title: "خطأ في الحجز",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم الحجز بنجاح",
          description: "سيتم التواصل معك قريباً لتأكيد الحجز",
        });
        setStep(5); // Success step
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء إرسال طلب الحجز، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper to find a doctor's name by ID
  const getDoctorName = (id: number) => {
    const doctor = doctors.find(d => d.id === id);
    return doctor ? doctor.name : 'طبيب غير معروف';
  };

  // Helper to find a specialty's name by ID
  const getSpecialtyName = (id: number) => {
    const specialty = specialties.find(s => s.id === id);
    return specialty ? specialty.name : 'تخصص غير معروف';
  };

  // Check if a step is completed
  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return !!formData.specialtyId;
      case 2:
        return !!formData.doctorId;
      case 3:
        return !!formData.bookingDay && !!formData.bookingTime;
      case 4:
        return !!formData.userName && !!formData.userPhone;
      default:
        return false;
    }
  };

  // Generate step status class based on current step and completion status
  const getStepClass = (stepNumber: number) => {
    if (step === stepNumber) return "bg-brand text-white border-brand";
    if (step > stepNumber && isStepCompleted(stepNumber)) return "bg-green-500 text-white border-green-500";
    if (step > stepNumber) return "bg-amber-500 text-white border-amber-500";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  // Generate content for each step
  const renderStepContent = () => {
    switch (step) {
      case 1: // Specialty Selection
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map((specialty) => (
                <motion.div
                  key={specialty.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.specialtyId === specialty.id
                      ? 'border-brand bg-brand/5'
                      : 'border-gray-200 hover:border-brand/50'
                  }`}
                  onClick={() => handleInputChange('specialtyId', specialty.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-lg">{specialty.name}</h3>
                      <p className="text-sm text-gray-600">{specialty.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.specialtyId === specialty.id ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {formData.specialtyId === specialty.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{specialty.id}</span>
                      )}
                    </div>
                  </div>
                  
                  {formData.specialtyId === specialty.id && (
                    <motion.div 
                      className="absolute -top-2 -left-2 bg-brand text-white rounded-full p-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 2: // Doctor Selection
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.doctorId === doctor.id
                      ? 'border-brand bg-brand/5'
                      : 'border-gray-200 hover:border-brand/50'
                  }`}
                  onClick={() => handleInputChange('doctorId', doctor.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-lg">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.bio || getSpecialtyName(doctor.specialty_id)}</p>
                      <div className="mt-1 flex items-center justify-end">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          الكشف: {doctor.fees.examination} ج.م
                        </span>
                        {doctor.fees.consultation && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full mr-2">
                            الاستشارة: {doctor.fees.consultation} ج.م
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.doctorId === doctor.id ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {formData.doctorId === doctor.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <ChevronLeft className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  
                  {formData.doctorId === doctor.id && (
                    <motion.div 
                      className="absolute -top-2 -left-2 bg-brand text-white rounded-full p-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 3: // Date and Time Selection
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-lg">اختر التاريخ</h3>
                  
                  <div className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-between text-right",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          {selectedDate ? (
                            format(selectedDate, "dd MMMM yyyy", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={isDateDisabled}
                          initialFocus
                          locale={ar}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {selectedDate && (
                    <div className="mt-4 p-3 bg-brand/10 rounded-lg text-center">
                      <p className="font-bold">
                        {format(selectedDate, "EEEE", { locale: ar })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(selectedDate, "dd MMMM yyyy", { locale: ar })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Time Selection */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-lg">اختر الوقت</h3>
                  
                  {!selectedDate ? (
                    <div className="text-center p-8 text-gray-500">
                      <Clock className="mx-auto h-8 w-8 mb-2 opacity-40" />
                      <p>اختر التاريخ أولاً</p>
                    </div>
                  ) : availableTimes.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <Clock className="mx-auto h-8 w-8 mb-2 opacity-40" />
                      <p>لا توجد مواعيد متاحة في هذا اليوم</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className={cn(
                            "h-12",
                            formData.bookingTime === time 
                              ? "bg-brand text-white hover:bg-brand hover:text-white border-brand" 
                              : "hover:border-brand"
                          )}
                          onClick={() => handleInputChange('bookingTime', time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 4: // Personal Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Personal Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-lg">بيانات الحجز الشخصية</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم بالكامل <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        placeholder="أدخل الاسم بالكامل"
                        value={formData.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        placeholder="أدخل رقم الهاتف"
                        value={formData.userPhone}
                        onChange={(e) => handleInputChange('userPhone', e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                      <Input
                        id="email"
                        placeholder="أدخل البريد الإلكتروني"
                        value={formData.userEmail || ''}
                        onChange={(e) => handleInputChange('userEmail', e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Booking Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-lg">تفاصيل إضافية</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                      <Textarea
                        id="notes"
                        placeholder="أي معلومات إضافية تود إضافتها"
                        value={formData.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="border-gray-300"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>طريقة التواصل المفضلة</Label>
                      <Tabs 
                        defaultValue={formData.bookingMethod} 
                        onValueChange={(value) => handleInputChange('bookingMethod', value as 'whatsapp' | 'call' | 'email')}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="whatsapp">واتساب</TabsTrigger>
                          <TabsTrigger value="call">هاتف</TabsTrigger>
                          <TabsTrigger value="email">بريد إلكتروني</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox 
                          id="terms" 
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          أوافق على <a href="#" className="text-brand hover:underline">الشروط والأحكام</a>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Booking Summary */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4 text-lg">ملخص الحجز</h3>
                  
                  <div className="space-y-3 text-right">
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">{getSpecialtyName(formData.specialtyId)}</span>
                      <span className="text-gray-600">التخصص:</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">{getDoctorName(formData.doctorId)}</span>
                      <span className="text-gray-600">الطبيب:</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">{formData.bookingDay}</span>
                      <span className="text-gray-600">اليوم:</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">{formData.bookingTime}</span>
                      <span className="text-gray-600">الوقت:</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">{format(selectedDate, "dd MMMM yyyy", { locale: ar })}</span>
                        <span className="text-gray-600">التاريخ:</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="font-medium">{
                        formData.bookingMethod === 'whatsapp' ? 'واتساب' :
                        formData.bookingMethod === 'call' ? 'هاتف' : 'بريد إلكتروني'
                      }</span>
                      <span className="text-gray-600">طريقة التواصل:</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 5: // Success
        return (
          <div className="text-center py-6">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">تم الحجز بنجاح</h2>
            <p className="text-gray-600 mb-8">سيتم التواصل معك قريباً لتأكيد الحجز</p>
            
            <Card className="mb-6">
              <CardContent className="p-4 text-right">
                <h3 className="font-bold mb-4 text-lg">تفاصيل الحجز</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">{getSpecialtyName(formData.specialtyId)}</span>
                    <span className="text-gray-600">التخصص:</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">{getDoctorName(formData.doctorId)}</span>
                    <span className="text-gray-600">الطبيب:</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">{formData.bookingDay}</span>
                    <span className="text-gray-600">اليوم:</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">{formData.bookingTime}</span>
                    <span className="text-gray-600">الوقت:</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">{format(selectedDate, "dd MMMM yyyy", { locale: ar })}</span>
                      <span className="text-gray-600">التاريخ:</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="font-medium">{formData.userName}</span>
                    <span className="text-gray-600">الاسم:</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3 justify-center">
              <Button 
                className="bg-brand hover:bg-brand-dark" 
                onClick={() => navigate('/')}
              >
                العودة للرئيسية
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Reset form and start over
                  setFormData({
                    specialtyId: 0,
                    doctorId: 0,
                    bookingDay: '',
                    bookingDate: undefined,
                    bookingTime: '',
                    userName: '',
                    userPhone: '',
                    userEmail: '',
                    notes: '',
                    bookingMethod: 'whatsapp',
                    termsAccepted: false
                  });
                  setStep(1);
                }}
              >
                حجز جديد
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* New progress steps */}
      {step !== 5 && (
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-lg">
              {/* Progress bar */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(step - 1) * 33.33}%` }}
              ></div>
              
              {/* Step circles */}
              <div className="flex justify-between relative">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <motion.div
                    key={stepNumber}
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${getStepClass(stepNumber)}`}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: step === stepNumber ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {step > stepNumber && isStepCompleted(stepNumber) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{stepNumber}</span>
                    )}
                    
                    <div className="absolute -bottom-7 right-1/2 translate-x-1/2 whitespace-nowrap text-xs">
                      {stepNumber === 1 && "التخصص"}
                      {stepNumber === 2 && "الطبيب"}
                      {stepNumber === 3 && "الموعد"}
                      {stepNumber === 4 && "البيانات"}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {step === 1 && "اختر التخصص"}
              {step === 2 && "اختر الطبيب"}
              {step === 3 && "اختر الموعد المناسب"}
              {step === 4 && "أدخل بياناتك الشخصية"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {step === 1 && "اختر التخصص المناسب لحالتك الصحية"}
              {step === 2 && "اختر الطبيب المناسب من قائمة الأطباء المتخصصين"}
              {step === 3 && "حدد اليوم والوقت المناسب لزيارتك"}
              {step === 4 && "أكمل بياناتك الشخصية وراجع تفاصيل الحجز"}
            </p>
          </div>
        </div>
      )}

      {/* Content of current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {step !== 5 && (
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="px-6"
            >
              <ChevronRight className="h-4 w-4 ml-2" />
              السابق
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={nextStep}
              disabled={
                (step === 1 && !formData.specialtyId) || 
                (step === 2 && !formData.doctorId) ||
                (step === 3 && (!formData.bookingDay || !formData.bookingTime))
              }
              className="bg-brand hover:bg-brand-dark px-6"
            >
              التالي
              <ChevronLeft className="h-4 w-4 mr-2" />
            </Button>
          ) : step === 4 ? (
            <Button 
              onClick={handleSubmit}
              disabled={!formData.userName || !formData.userPhone || submitLoading}
              className="bg-brand hover:bg-brand-dark px-6"
            >
              {submitLoading ? 'جاري الحجز...' : 'تأكيد الحجز'}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
