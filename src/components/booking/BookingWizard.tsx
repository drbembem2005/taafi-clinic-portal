
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  StickyNote,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { getDoctors, Doctor, getDoctor } from '@/services/doctorService';
import { createBooking, openWhatsAppWithBookingDetails } from '@/services/bookingService';
import { toast } from '@/hooks/use-toast';
import NextAvailableDaysPicker from './NextAvailableDaysPicker';

interface BookingFormData {
  user_name: string;
  user_phone: string;
  user_email: string | null;
  notes: string | null;
  specialty_id: number | null;
  doctor_id: number | null;
  booking_day: string;
  booking_time: string;
  booking_method: 'whatsapp' | 'phone' | 'online';
}

const BookingWizard = () => {
  // State for wizard steps
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<BookingFormData>({
    user_name: '',
    user_phone: '',
    user_email: null,
    notes: null,
    specialty_id: null,
    doctor_id: null,
    booking_day: '',
    booking_time: '',
    booking_method: 'whatsapp'
  });
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  const location = useLocation();
  
  // Load specialties and doctors from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedSpecialties = await getSpecialties();
        setSpecialties(fetchedSpecialties);
        
        // Check if there are any pre-selected values from state
        const state = location.state as { 
          selectedSpecialty?: number;
          selectedDoctor?: number;
        } | undefined;
        
        if (state?.selectedSpecialty) {
          setFormData(prev => ({
            ...prev,
            specialty_id: state.selectedSpecialty
          }));
          
          // Fetch doctors for this specialty
          const specialtyDoctors = await getDoctors();
          const filteredDoctors = specialtyDoctors.filter(d => d.specialty_id === state.selectedSpecialty);
          setDoctors(filteredDoctors);
          
          // If a doctor is also pre-selected
          if (state.selectedDoctor) {
            setFormData(prev => ({
              ...prev,
              doctor_id: state.selectedDoctor
            }));
            // Automatically move to time selection step
            setCurrentStep(2);
          }
        } else {
          // Just load all doctors if no specialty is selected
          const allDoctors = await getDoctors();
          setDoctors(allDoctors);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.state]);
  
  // Handle specialty change
  const handleSpecialtyChange = async (specialtyId: number) => {
    setFormData(prev => ({
      ...prev,
      specialty_id: specialtyId,
      doctor_id: null // Reset doctor when changing specialty
    }));
    
    setLoading(true);
    try {
      const filteredDoctors = await getDoctors();
      const matchingDoctors = filteredDoctors.filter(d => d.specialty_id === specialtyId);
      setDoctors(matchingDoctors);
      
      // Auto scroll to doctors section
      setTimeout(() => {
        const doctorsSection = document.getElementById('doctors-section');
        if (doctorsSection) {
          doctorsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل قائمة الأطباء",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle date and time selection
  const handleDateTimeSelect = (day: string, time: string, formattedDateStr: string) => {
    setFormData(prev => ({
      ...prev,
      booking_day: day,
      booking_time: time
    }));
    setFormattedDate(formattedDateStr);
  };
  
  // Handle doctor selection - no auto navigation
  const handleDoctorSelect = (doctorId: number) => {
    setFormData(prev => ({ ...prev, doctor_id: doctorId }));
  };
  
  // Go to next step
  const goToNextStep = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.doctor_id) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار طبيب للمتابعة",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && (!formData.booking_day || !formData.booking_time)) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار موعد للمتابعة",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 3) {
      // Validate contact info
      if (!formData.user_name || !formData.user_phone) {
        toast({
          title: "تنبيه",
          description: "يرجى إدخال الاسم ورقم الهاتف للمتابعة",
          variant: "destructive",
        });
        return;
      }
      
      // Validate phone number format
      const phoneRegex = /^[0-9+\s]{10,15}$/;
      if (!phoneRegex.test(formData.user_phone.replace(/\s/g, ''))) {
        toast({
          title: "تنبيه",
          description: "يرجى إدخال رقم هاتف صحيح",
          variant: "destructive",
        });
        return;
      }
      
      // Validate email if provided
      if (formData.user_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.user_email)) {
          toast({
            title: "تنبيه",
            description: "يرجى إدخال بريد إلكتروني صحيح أو تركه فارغًا",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    // All validations passed, go to next step
    setCurrentStep(currentStep + 1);
    
    // Scroll to top after step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Go to previous step
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top after step change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Get selected doctor name
  const getSelectedDoctorName = () => {
    const doctor = doctors.find(d => d.id === formData.doctor_id);
    return doctor ? doctor.name : 'غير محدد';
  };
  
  // Get selected specialty name
  const getSelectedSpecialtyName = () => {
    const specialty = specialties.find(s => s.id === formData.specialty_id);
    return specialty ? specialty.name : 'غير محدد';
  };
  
  // Open WhatsApp with booking details
  const handleWhatsAppBooking = () => {
    try {
      const doctorName = getSelectedDoctorName();
      const bookingDate = formattedDate;
      
      // Create booking in database first
      setFormData(prev => ({
        ...prev,
        booking_method: 'whatsapp'
      }));
      
      // Submit booking to database
      handleSubmit('whatsapp', true);
      
    } catch (error) {
      console.error('Error creating WhatsApp message:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء رسالة الواتساب",
        variant: "destructive",
      });
    }
  };
  
  // Submit booking
  const handleSubmit = async (method: 'online' | 'whatsapp' = 'online', openWhatsApp: boolean = false) => {
    setSubmitting(true);
    try {
      // Set booking method
      const bookingData = {
        ...formData,
        booking_method: method
      };
      
      // Make API call to create booking
      const response = await createBooking(bookingData);
      
      // Show success message
      toast({
        title: "تم الحجز بنجاح",
        description: "سيتم التواصل معك قريبًا لتأكيد الحجز.",
      });
      
      // Set booking reference for success screen
      setBookingReference(response.id);
      
      // If WhatsApp booking, open WhatsApp after successful database entry
      if (method === 'whatsapp' && openWhatsApp) {
        // Use the openWhatsAppWithBookingDetails function
        openWhatsAppWithBookingDetails({
          doctorName: getSelectedDoctorName(),
          date: formattedDate,
          time: formData.booking_time,
          userName: formData.user_name,
          phone: formData.user_phone,
          email: formData.user_email,
          notes: formData.notes
        });
      }
      
      // Only set booking complete if not WhatsApp
      if (!openWhatsApp) {
        setBookingComplete(true);
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "فشل الحجز",
        description: "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Reset the form
  const resetForm = () => {
    setFormData({
      user_name: '',
      user_phone: '',
      user_email: null,
      notes: null,
      specialty_id: null,
      doctor_id: null,
      booking_day: '',
      booking_time: '',
      booking_method: 'whatsapp'
    });
    setBookingComplete(false);
    setCurrentStep(1);
  };
  
  // Get progress percentage based on current step
  const getProgressPercentage = () => {
    return (currentStep / 4) * 100;
  };
  
  // If booking is complete, show success screen
  if (bookingComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح!</h2>
          <p className="text-gray-600">
            شكراً لك، تم استلام طلب حجزك بنجاح. سيتم التواصل معك قريباً عبر واتساب أو الهاتف لتأكيد الحجز.
          </p>
          
          {bookingReference && (
            <div className="mt-4 py-3 px-4 bg-gray-50 rounded-md inline-block">
              <p className="text-sm text-gray-500 mb-1">رقم مرجعي للحجز:</p>
              <p className="font-mono font-bold text-gray-800">{bookingReference.substring(0, 8)}</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">تفاصيل الحجز:</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Users className="h-5 w-5 text-brand ml-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">الطبيب:</p>
                <p className="font-medium">{getSelectedDoctorName()}</p>
              </div>
            </li>
            <li className="flex items-start">
              <Calendar className="h-5 w-5 text-brand ml-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">الموعد:</p>
                <p className="font-medium">{formattedDate} - {formData.booking_time}</p>
              </div>
            </li>
            <li className="flex items-start">
              <Phone className="h-5 w-5 text-brand ml-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف:</p>
                <p className="font-medium" dir="ltr">{formData.user_phone}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="text-center space-y-3">
          <Button 
            className="w-full bg-brand hover:bg-brand-dark text-white"
            onClick={resetForm}
          >
            حجز موعد آخر
          </Button>
          <p className="text-sm text-gray-500">
            للاستفسار أو تعديل الحجز، يرجى الاتصال بنا على الرقم 01091003965
          </p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Progress bar */}
      <div className="h-2 bg-gray-100">
        <div 
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between px-8 mt-4">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step} 
            className={`flex flex-col items-center justify-center ${
              currentStep >= step ? 'text-brand' : 'text-gray-400'
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mb-1 transition-all ${
              currentStep === step 
                ? 'bg-brand text-white shadow-md' 
                : currentStep > step 
                  ? 'bg-green-50 text-green-600 border border-green-200' 
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {currentStep > step ? <Check className="h-4 w-4" /> : step}
            </div>
            <span className="text-xs hidden md:block">
              {step === 1 && 'اختيار الطبيب'}
              {step === 2 && 'اختيار الموعد'}
              {step === 3 && 'بيانات الحجز'}
              {step === 4 && 'تأكيد الحجز'}
            </span>
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="p-6">
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center">اختر التخصص والطبيب</h2>
            
            {/* Specialties Selection */}
            <div className="mb-6">
              <Label className="block mb-4 text-lg">التخصص</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialties.map((specialty) => (
                  <Button
                    key={specialty.id}
                    variant={formData.specialty_id === specialty.id ? "default" : "outline"}
                    className={`justify-start h-auto py-2 ${
                      formData.specialty_id === specialty.id 
                        ? 'bg-brand hover:bg-brand/90' 
                        : 'hover:border-brand hover:text-brand'
                    }`}
                    onClick={() => handleSpecialtyChange(specialty.id)}
                  >
                    <span className="truncate">{specialty.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Doctors Selection */}
            <div id="doctors-section" className="mb-6">
              <Label className="block mb-4 text-lg">الطبيب</Label>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-brand motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-sm text-gray-500">جاري تحميل بيانات الأطباء...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctors.length > 0 ? (
                    doctors
                      .filter(doctor => !formData.specialty_id || doctor.specialty_id === formData.specialty_id)
                      .map((doctor) => {
                        // Find the specialty for this doctor
                        const doctorSpecialty = specialties.find(s => s.id === doctor.specialty_id);
                        const specialtyName = doctorSpecialty ? doctorSpecialty.name : 'تخصص غير محدد';
                        
                        return (
                          <Card 
                            key={doctor.id} 
                            className={`cursor-pointer transition-all hover:border-brand ${
                              formData.doctor_id === doctor.id ? 'border-brand ring-1 ring-brand' : ''
                            }`}
                            onClick={() => handleDoctorSelect(doctor.id)}
                          >
                            <CardContent className="p-3 flex items-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                                {doctor.image ? (
                                  <img 
                                    src={doctor.image} 
                                    alt={doctor.name} 
                                    className="w-full h-full rounded-full object-cover" 
                                  />
                                ) : (
                                  <Users className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="text-sm font-medium">{doctor.name}</div>
                                <div className="text-xs text-gray-500">{specialtyName}</div>
                              </div>
                              {formData.doctor_id === doctor.id && (
                                <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })
                  ) : (
                    <div className="text-center py-4 col-span-2 border border-dashed rounded-md p-8">
                      <p className="text-gray-500">يرجى اختيار تخصص لعرض الأطباء المتاحين</p>
                    </div>
                  )}
                </div>
              )}
            </div>
                        
            {formData.doctor_id && (
              <div className="bg-brand/5 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-brand ml-2" />
                  <span>تم اختيار الطبيب: <strong>{getSelectedDoctorName()}</strong></span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-brand hover:bg-brand/10 px-3"
                  onClick={goToNextStep}
                >
                  متابعة
                  <ChevronLeft className="mr-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
        
        {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center">حدد موعدًا للكشف</h2>
            
            {formData.doctor_id ? (
              <>
                <div className="bg-brand/5 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-brand ml-2" />
                    <div>
                      <p className="text-sm text-gray-500">الطبيب المختار:</p>
                      <p className="font-medium">{getSelectedDoctorName()}</p>
                    </div>
                  </div>
                </div>
                
                <NextAvailableDaysPicker
                  doctorId={formData.doctor_id}
                  onSelectDateTime={handleDateTimeSelect}
                  selectedDay={formData.booking_day}
                  selectedTime={formData.booking_time}
                />
                
                {formData.booking_day && formData.booking_time && (
                  <div className="bg-brand/5 rounded-lg p-4 mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 ml-2" />
                      <span>تم اختيار الموعد: <strong>{formattedDate} - {formData.booking_time}</strong></span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-brand hover:bg-brand/10 px-3"
                      onClick={goToNextStep}
                    >
                      متابعة
                      <ChevronLeft className="mr-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
                <p className="text-red-500 font-medium">يرجى الرجوع واختيار طبيب أولاً</p>
                <Button 
                  onClick={goToPrevStep} 
                  variant="outline" 
                  className="mt-4"
                >
                  <ChevronRight className="ml-2 h-4 w-4" /> العودة لاختيار الطبيب
                </Button>
              </div>
            )}
          </motion.div>
        )}
        
        {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">أدخل بياناتك</h2>
            
            <div className="bg-brand/5 rounded-lg p-4 mb-6">
              <div className="flex md:items-center flex-col md:flex-row">
                <div className="flex items-center ml-6 mb-2 md:mb-0">
                  <Users className="h-5 w-5 text-brand ml-2" />
                  <div>
                    <p className="text-xs text-gray-500">الطبيب:</p>
                    <p className="font-medium text-sm">{getSelectedDoctorName()}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-brand ml-2" />
                  <div>
                    <p className="text-xs text-gray-500">الموعد:</p>
                    <p className="font-medium text-sm">{formattedDate} - {formData.booking_time}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم بالكامل</Label>
                <Input 
                  id="name"
                  value={formData.user_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                  placeholder="أدخل اسمك هنا"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input 
                  id="phone"
                  value={formData.user_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_phone: e.target.value }))}
                  placeholder="01xxxxxxxxx"
                  className="mt-1 text-left"
                  dir="ltr"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                <Input 
                  id="email"
                  value={formData.user_email || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    user_email: e.target.value || null 
                  }))}
                  placeholder="example@example.com"
                  className="mt-1 text-left"
                  dir="ltr"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Textarea 
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notes: e.target.value || null 
                  }))}
                  placeholder="أي معلومات إضافية ترغب بإضافتها للحجز"
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={goToNextStep} 
                className="w-full bg-brand hover:bg-brand-dark text-white mt-2"
              >
                متابعة لتأكيد الحجز
                <ChevronLeft className="mr-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
        
        {currentStep === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">تأكيد الحجز</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">تفاصيل الحجز:</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <Users className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">الطبيب:</p>
                    <p className="font-medium">{getSelectedDoctorName()}</p>
                  </div>
                </li>
                <li className="flex">
                  <Users className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">التخصص:</p>
                    <p className="font-medium">{getSelectedSpecialtyName()}</p>
                  </div>
                </li>
                <li className="flex">
                  <Calendar className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">الموعد:</p>
                    <p className="font-medium">{formattedDate} - {formData.booking_time}</p>
                  </div>
                </li>
                <li className="flex">
                  <Phone className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف:</p>
                    <p className="font-medium" dir="ltr">{formData.user_phone}</p>
                  </div>
                </li>
                {formData.user_email && (
                  <li className="flex">
                    <Mail className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني:</p>
                      <p className="font-medium">{formData.user_email}</p>
                    </div>
                  </li>
                )}
                {formData.notes && (
                  <li className="flex">
                    <StickyNote className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">ملاحظات:</p>
                      <p className="font-medium">{formData.notes}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md mb-6">
              <p className="text-sm text-yellow-800">
                اختر طريقة تأكيد الحجز المناسبة لك:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Button 
                onClick={() => handleSubmit('online')} 
                className="bg-brand hover:bg-brand-dark text-white py-3"
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
                className="bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2"
                disabled={submitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                تأكيد الحجز عبر واتساب
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-2">
              نوصي بالتأكيد عبر واتساب للتواصل المباشر مع العيادة
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Navigation buttons - Updated UI */}
      {!bookingComplete && (
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          {currentStep > 1 ? (
            <Button 
              variant="outline"
              onClick={goToPrevStep}
              className="flex items-center gap-2 px-5 py-2 text-gray-700 hover:bg-gray-100 hover:text-brand transition-colors border border-gray-300 shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
              <span>السابق</span>
            </Button>
          ) : (
            <div></div> // Empty div for alignment
          )}
          
          {currentStep < 4 ? (
            <Button 
              onClick={goToNextStep}
              className="flex items-center gap-2 px-5 py-2 bg-brand hover:bg-brand-dark text-white transition-colors shadow-md"
            >
              <span>التالي</span>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div></div> // Empty div for alignment
          )}
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
