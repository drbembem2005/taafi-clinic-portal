
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpecialtySelection from './SpecialtySelection';
import DoctorSelection from './DoctorSelection';
import AppointmentSelection from './AppointmentSelection';
import ContactInfoForm from './ContactInfoForm';
import BookingConfirmation from './BookingConfirmation';
import BookingSuccess from './BookingSuccess';
import { Specialty } from '@/services/specialtyService';
import { Doctor } from '@/services/doctorService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  UserCircle, 
  CalendarClock, 
  ClipboardPen, 
  CheckCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface BookingFormData {
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

const BookingWizardContainer = () => {
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
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [stepTransition, setStepTransition] = useState<'next' | 'prev'>('next');

  // Refs for scroll behavior
  const wizardContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top when step changes
  useEffect(() => {
    if (wizardContainerRef.current) {
      wizardContainerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [currentStep]);

  // Navigation methods
  const goToNextStep = () => {
    setStepTransition('next');
    setCurrentStep(prev => prev + 1);
  };

  const goToPrevStep = () => {
    setStepTransition('prev');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Go to a specific step
  const goToStep = (step: number) => {
    if (step < currentStep) {
      setStepTransition('prev');
    } else {
      setStepTransition('next');
    }
    setCurrentStep(step);
  };

  // Handle specialty selection
  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setFormData(prev => ({
      ...prev,
      specialty_id: specialty.id,
      doctor_id: null // Reset doctor when changing specialty
    }));
    setSelectedDoctor(null);
    // Auto-navigation is handled inside SpecialtySelection component
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      doctor_id: doctor.id
    }));
  };

  // Handle appointment selection
  const handleAppointmentSelect = (day: string, time: string, formattedDateStr: string) => {
    setFormData(prev => ({
      ...prev,
      booking_day: day,
      booking_time: time
    }));
    setFormattedDate(formattedDateStr);
  };

  // Handle contact info update
  const handleContactInfoUpdate = (
    name: string,
    phone: string,
    email: string | null,
    notes: string | null
  ) => {
    setFormData(prev => ({
      ...prev,
      user_name: name,
      user_phone: phone,
      user_email: email,
      notes: notes
    }));
  };

  // Handle booking success
  const handleBookingSuccess = (reference: string) => {
    setBookingReference(reference);
    setBookingComplete(true);
  };

  // Reset the booking process
  const handleReset = () => {
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
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setBookingComplete(false);
    setCurrentStep(1);
    setBookingReference('');
    setFormattedDate('');
  };

  // Check if we can proceed to the next step
  const canProceed = () => {
    switch(currentStep) {
      case 1:
        return !!formData.specialty_id;
      case 2:
        return !!formData.doctor_id;
      case 3:
        return !!formData.booking_day && !!formData.booking_time;
      case 4:
        return !!formData.user_name && !!formData.user_phone;
      default:
        return true;
    }
  };

  // Get step title
  const getStepTitle = (step: number) => {
    switch(step) {
      case 1: return 'اختيار التخصص';
      case 2: return 'اختيار الطبيب';
      case 3: return 'تحديد الموعد';
      case 4: return 'بيانات المريض';
      case 5: return 'تأكيد الحجز';
      default: return '';
    }
  };

  // Get step icon
  const getStepIcon = (step: number) => {
    switch(step) {
      case 1: return <UserCircle className="w-5 h-5" />;
      case 2: return <UserCircle className="w-5 h-5" />;
      case 3: return <CalendarClock className="w-5 h-5" />;
      case 4: return <ClipboardPen className="w-5 h-5" />;
      case 5: return <CheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  // If booking is complete, show success screen
  if (bookingComplete) {
    return (
      <BookingSuccess 
        bookingReference={bookingReference}
        doctorName={selectedDoctor?.name || ''}
        appointmentDate={formattedDate}
        appointmentTime={formData.booking_time}
        userPhone={formData.user_phone}
        userEmail={formData.user_email}
        onReset={handleReset}
      />
    );
  }

  // Transition variants for the main content
  const contentVariants = {
    hidden: (direction: string) => ({
      x: direction === 'next' ? 50 : -50,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: (direction: string) => ({
      x: direction === 'next' ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div ref={wizardContainerRef} className="mt-4 mb-12">
      {/* Booking Summary */}
      {(selectedSpecialty || selectedDoctor || formData.booking_day) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 rounded-xl overflow-hidden shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">ملخص الحجز:</span>
                </div>
                
                {selectedSpecialty && (
                  <div className="bg-white/80 px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
                    <span className="text-gray-500 ml-1">التخصص:</span>
                    <span className="font-medium text-gray-800">{selectedSpecialty.name}</span>
                  </div>
                )}
                
                {selectedDoctor && (
                  <div className="bg-white/80 px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
                    <span className="text-gray-500 ml-1">الطبيب:</span>
                    <span className="font-medium text-gray-800">{selectedDoctor.name}</span>
                  </div>
                )}
                
                {formData.booking_day && formattedDate && (
                  <div className="bg-white/80 px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
                    <span className="text-gray-500 ml-1">الموعد:</span>
                    <span className="font-medium text-gray-800">
                      {formattedDate} - {formData.booking_time}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Modern Step Indicator */}
      <div className="mb-8">
        <div className="hidden md:flex justify-between items-center relative">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0">
            <motion.div 
              className="h-full bg-brand rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentStep - 1) / 4) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Step indicators */}
          {[1, 2, 3, 4, 5].map((step) => (
            <TooltipProvider key={step} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    onClick={() => step < currentStep && goToStep(step)}
                    className={`
                      relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${step < currentStep 
                        ? 'bg-brand text-white cursor-pointer hover:shadow-md' 
                        : step === currentStep
                          ? 'bg-brand text-white ring-4 ring-brand/20' 
                          : 'bg-white border-2 border-gray-300 text-gray-400'}
                    `}
                    whileHover={step < currentStep ? { scale: 1.1 } : {}}
                    whileTap={step < currentStep ? { scale: 0.95 } : {}}
                  >
                    {step < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                    
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={step === currentStep ? { 
                        scale: [1, 1.2, 1], 
                        transition: { 
                          repeat: Infinity, 
                          repeatType: 'loop', 
                          duration: 2,
                          repeatDelay: 1
                        } 
                      } : { scale: 1 }}
                      className={`
                        absolute w-full h-full rounded-full 
                        ${step === currentStep ? 'bg-brand/30' : 'bg-transparent'} 
                        -z-10
                      `}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">
                    {getStepTitle(step)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        {/* Mobile Steps Indicator */}
        <div className="md:hidden">
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step}
                className={`h-1.5 rounded-full ${
                  step <= currentStep ? 'bg-brand' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 px-2">
            <p className="text-sm font-medium text-gray-700">الخطوة {currentStep} من 5</p>
            <p className="text-sm text-gray-500">{getStepTitle(currentStep)}</p>
          </div>
        </div>
      </div>
      
      {/* Main content with smooth transitions */}
      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <AnimatePresence mode="wait" custom={stepTransition}>
            <motion.div
              key={currentStep}
              custom={stepTransition}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="min-h-[380px]"
            >
              {currentStep === 1 && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <UserCircle className="w-6 h-6 text-brand ml-2" />
                    اختر التخصص المناسب
                  </h2>
                  <SpecialtySelection
                    selectedSpecialtyId={formData.specialty_id}
                    onSelectSpecialty={handleSpecialtySelect}
                    className="w-full"
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <UserCircle className="w-6 h-6 text-brand ml-2" />
                    اختر الطبيب المناسب
                  </h2>
                  <DoctorSelection
                    specialtyId={formData.specialty_id}
                    selectedDoctorId={formData.doctor_id}
                    onSelectDoctor={handleDoctorSelect}
                    className="w-full"
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <CalendarClock className="w-6 h-6 text-brand ml-2" />
                    اختر موعد الكشف
                  </h2>
                  <AppointmentSelection
                    doctorId={formData.doctor_id}
                    doctorName={selectedDoctor?.name || ''}
                    selectedDay={formData.booking_day}
                    selectedTime={formData.booking_time}
                    onSelectDateTime={handleAppointmentSelect}
                    onUpdateFormattedDate={setFormattedDate}
                  />
                </>
              )}

              {currentStep === 4 && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <ClipboardPen className="w-6 h-6 text-brand ml-2" />
                    أدخل بيانات المريض
                  </h2>
                  <ContactInfoForm
                    doctorName={selectedDoctor?.name || ''}
                    appointmentDate={formattedDate}
                    appointmentTime={formData.booking_time}
                    initialValues={{
                      name: formData.user_name,
                      phone: formData.user_phone,
                      email: formData.user_email || '',
                      notes: formData.notes || ''
                    }}
                    onUpdateContactInfo={handleContactInfoUpdate}
                  />
                </>
              )}

              {currentStep === 5 && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 text-brand ml-2" />
                    تأكيد الحجز
                  </h2>
                  <BookingConfirmation
                    formData={formData}
                    doctorName={selectedDoctor?.name || ''}
                    specialtyName={selectedSpecialty?.name || ''}
                    formattedDate={formattedDate}
                    onBookingSuccess={handleBookingSuccess}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Navigation buttons with improved UX */}
      <div className="flex justify-between mt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStep > 1 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={goToPrevStep}
              className="flex items-center gap-2 px-6 py-2 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
              السابق
            </Button>
          )}
        </motion.div>
        
        <motion.div
          whileHover={canProceed() ? { scale: 1.03 } : {}}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
        >
          {currentStep < 5 ? (
            <Button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-xl shadow-md next-step-button
                ${canProceed() 
                  ? 'bg-gradient-to-r from-brand to-brand-light text-white hover:opacity-90' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              aria-label="التالي"
            >
              التالي
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : null}
        </motion.div>
      </div>
      
      {/* Helper text based on current step */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-gray-500">
          {currentStep === 1 && 'اختر التخصص المناسب لحالتك الطبية'}
          {currentStep === 2 && 'اختر الطبيب المناسب من قائمة الأطباء المتخصصين'}
          {currentStep === 3 && 'اختر يوم وساعة الموعد المناسبة لك'}
          {currentStep === 4 && 'أدخل بياناتك الشخصية لإكمال عملية الحجز'}
          {currentStep === 5 && 'يمكنك الآن تأكيد الحجز إما عبر الموقع أو عبر واتساب'}
        </p>
      </motion.div>
    </div>
  );
};

export default BookingWizardContainer;
