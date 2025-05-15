
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { getDoctorsBySpecialty, Doctor, getDoctorSchedule } from '@/services/doctorService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { dayMappings } from '@/data/doctors';
import { useLocation } from 'react-router-dom';

interface BookingFormData {
  specialtyId: number;
  doctorId: number;
  bookingDay: string;
  bookingTime: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  notes?: string;
  bookingMethod: 'whatsapp' | 'call' | 'email';
}

const BookingWizard = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    specialtyId: 0,
    doctorId: 0,
    bookingDay: '',
    bookingTime: '',
    userName: '',
    userPhone: '',
    userEmail: '',
    notes: '',
    bookingMethod: 'whatsapp'
  });

  // Convert English day to Arabic
  const getArabicDay = (englishDay: string): string => {
    const arabicDay = Object.keys(dayMappings).find(
      key => dayMappings[key as keyof typeof dayMappings] === englishDay
    );
    return arabicDay || englishDay;
  };

  // Convert Arabic day to English
  const getEnglishDay = (arabicDay: string): string => {
    return dayMappings[arabicDay as keyof typeof dayMappings] || arabicDay;
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
          bookingTime: ''
        }));
        setAvailableTimes([]);
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

  // When day changes, update available times
  useEffect(() => {
    if (!formData.bookingDay) {
      setAvailableTimes([]);
      return;
    }

    const englishDay = getEnglishDay(formData.bookingDay);
    const times = schedule[englishDay] || [];
    setAvailableTimes(times);
    
    // Reset booking time
    setFormData(prev => ({
      ...prev,
      bookingTime: ''
    }));
  }, [formData.bookingDay, schedule]);

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
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

  const handleSubmit = async () => {
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

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-center mb-6">اختر التخصص</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">التخصص</Label>
                  <Select 
                    value={formData.specialtyId.toString()} 
                    onValueChange={(value) => handleInputChange('specialtyId', parseInt(value))}
                    disabled={loading}
                  >
                    <SelectTrigger id="specialty" className="w-full">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id.toString()}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={nextStep} 
                    disabled={!formData.specialtyId || loading}
                    className="bg-brand hover:bg-brand-dark"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 2:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-center mb-6">اختر الطبيب</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">الطبيب</Label>
                  <Select 
                    value={formData.doctorId.toString()} 
                    onValueChange={(value) => handleInputChange('doctorId', parseInt(value))}
                    disabled={loading}
                  >
                    <SelectTrigger id="doctor" className="w-full">
                      <SelectValue placeholder="اختر الطبيب" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={prevStep}>السابق</Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={!formData.doctorId || loading}
                    className="bg-brand hover:bg-brand-dark"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 3:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-center mb-6">اختر الموعد</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="day">اليوم</Label>
                  <Select 
                    value={formData.bookingDay} 
                    onValueChange={(value) => handleInputChange('bookingDay', value)}
                    disabled={loading || availableDays.length === 0}
                  >
                    <SelectTrigger id="day" className="w-full">
                      <SelectValue placeholder={availableDays.length ? "اختر اليوم" : "لا توجد أيام متاحة"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">الوقت</Label>
                  <Select 
                    value={formData.bookingTime} 
                    onValueChange={(value) => handleInputChange('bookingTime', value)}
                    disabled={loading || !formData.bookingDay || availableTimes.length === 0}
                  >
                    <SelectTrigger id="time" className="w-full">
                      <SelectValue placeholder={availableTimes.length ? "اختر الوقت" : "لا توجد أوقات متاحة"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={prevStep}>السابق</Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={!formData.bookingDay || !formData.bookingTime || loading}
                    className="bg-brand hover:bg-brand-dark"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 4:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-center mb-6">بيانات الحجز</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input 
                    id="name" 
                    value={formData.userName} 
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    placeholder="الاسم بالكامل"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input 
                    id="phone" 
                    value={formData.userPhone} 
                    onChange={(e) => handleInputChange('userPhone', e.target.value)}
                    placeholder="رقم الهاتف"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                  <Input 
                    id="email" 
                    value={formData.userEmail || ''} 
                    onChange={(e) => handleInputChange('userEmail', e.target.value)}
                    placeholder="البريد الإلكتروني"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                  <Textarea 
                    id="notes" 
                    value={formData.notes || ''} 
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي معلومات إضافية تود إضافتها"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">طريقة التواصل المفضلة</Label>
                  <Select 
                    value={formData.bookingMethod} 
                    onValueChange={(value) => handleInputChange('bookingMethod', value)}
                  >
                    <SelectTrigger id="method" className="w-full">
                      <SelectValue placeholder="اختر طريقة التواصل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">واتساب</SelectItem>
                      <SelectItem value="call">مكالمة هاتفية</SelectItem>
                      <SelectItem value="email">البريد الإلكتروني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-bold text-lg mb-2">ملخص الحجز</h3>
                  <p className="mb-1"><span className="font-bold">التخصص:</span> {getSpecialtyName(formData.specialtyId)}</p>
                  <p className="mb-1"><span className="font-bold">الطبيب:</span> {getDoctorName(formData.doctorId)}</p>
                  <p className="mb-1"><span className="font-bold">اليوم:</span> {formData.bookingDay}</p>
                  <p><span className="font-bold">الوقت:</span> {formData.bookingTime}</p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={prevStep}>السابق</Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-brand hover:bg-brand-dark"
                    disabled={!formData.userName || !formData.userPhone || submitLoading}
                  >
                    {submitLoading ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 5:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center my-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح</h2>
                <p className="text-gray-600 mb-6">
                  شكراً لك، سيتم التواصل معك قريباً لتأكيد الحجز
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-md text-right">
                  <h3 className="font-bold text-lg mb-2">تفاصيل الحجز</h3>
                  <p className="mb-1"><span className="font-bold">التخصص:</span> {getSpecialtyName(formData.specialtyId)}</p>
                  <p className="mb-1"><span className="font-bold">الطبيب:</span> {getDoctorName(formData.doctorId)}</p>
                  <p className="mb-1"><span className="font-bold">اليوم:</span> {formData.bookingDay}</p>
                  <p><span className="font-bold">الوقت:</span> {formData.bookingTime}</p>
                </div>
                <Button 
                  className="mt-6 bg-brand hover:bg-brand-dark"
                  onClick={() => window.location.href = '/'}
                >
                  العودة للرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return <div>خطأ غير متوقع</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div 
              key={stepNumber}
              className={`flex items-center ${step !== 5 ? 'w-1/4' : 'w-1/5'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber === step 
                    ? 'bg-brand text-white' 
                    : stepNumber < step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber < step ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 4 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    stepNumber < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 px-1">
          <span className="w-16 text-center">التخصص</span>
          <span className="w-16 text-center">الطبيب</span>
          <span className="w-16 text-center">الموعد</span>
          <span className="w-16 text-center">البيانات</span>
        </div>
      </div>

      {/* Current step content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </div>
  );
};

export default BookingWizard;
