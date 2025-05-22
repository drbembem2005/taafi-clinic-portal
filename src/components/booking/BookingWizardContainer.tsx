import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpecialtySelection from './SpecialtySelection';
import DoctorSelection from './DoctorSelection';
import AppointmentSelection from './AppointmentSelection';
import ContactInfoForm from './ContactInfoForm';
import BookingConfirmation from './BookingConfirmation';
import BookingSuccess from './BookingSuccess';
import BookingProgress from './BookingProgress';
import { Specialty } from '@/services/specialtyService';
import { Doctor } from '@/services/doctorService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BookingFormData {
  user_name: string;
  user_phone: string;
  user_email: null;
  notes: string | null;
  specialty_id: number | null;
  doctor_id: number | null;
  booking_day: string;
  booking_time: string;
  booking_method: 'whatsapp' | 'phone' | 'online';
}

const BookingWizardContainer = () => {
  // State for wizard steps - now we have 5 steps instead of 4
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Navigation methods
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      doctor_id: doctor.id
    }));
  };

  // Handle appointment selection - update to use uniqueId and store the selected date object
  const handleAppointmentSelect = (uniqueId: string, time: string, formattedDateStr: string, selectedDateObj: Date) => {
    setFormData(prev => ({
      ...prev,
      booking_day: uniqueId, // Now using uniqueId instead of just day code
      booking_time: time
    }));
    setFormattedDate(formattedDateStr);
    setSelectedDate(selectedDateObj); // Store the selected date object
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
    setSelectedDate(null); // Reset selected date
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

  // More modern and compact container design
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Progress bar with enhanced visuals */}
      <div className="relative h-1 bg-gray-200">
        <motion.div 
          className="h-full bg-gradient-to-r from-brand to-brand-light"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Step indicators with improved styling */}
      <div className="flex justify-between px-4 pt-4 pb-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step} 
            className={`flex flex-col items-center ${currentStep >= step ? 'text-brand' : 'text-gray-400'}`}
          >
            <motion.div 
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs mb-1 transition-colors ${
                currentStep === step 
                  ? 'bg-gradient-to-r from-brand to-brand-light text-white' 
                  : currentStep > step 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-gray-100 text-gray-400'
              }`}
              animate={{
                scale: currentStep === step ? [1, 1.1, 1] : 1,
                transition: { duration: 0.3, repeat: currentStep === step ? Infinity : 0, repeatDelay: 3 }
              }}
            >
              {currentStep > step ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </motion.div>
            <span className="text-[10px] hidden md:block">
              {step === 1 && 'التخصص'}
              {step === 2 && 'الطبيب'}
              {step === 3 && 'الموعد'}
              {step === 4 && 'البيانات'}
              {step === 5 && 'التأكيد'}
            </span>
          </div>
        ))}
      </div>
      
      {/* Main content area with smoother transitions */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {/* Specialty selection */}
              <SpecialtySelection
                selectedSpecialtyId={formData.specialty_id}
                onSelectSpecialty={handleSpecialtySelect}
                className="w-full"
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {/* Doctor selection */}
              <DoctorSelection
                specialtyId={formData.specialty_id}
                selectedDoctorId={formData.doctor_id}
                onSelectDoctor={handleDoctorSelect}
                className="w-full"
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              <AppointmentSelection
                doctorId={formData.doctor_id}
                doctorName={selectedDoctor?.name || ''}
                selectedDay={formData.booking_day}
                selectedTime={formData.booking_time}
                onSelectDateTime={handleAppointmentSelect}
                onUpdateFormattedDate={setFormattedDate}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
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
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              <BookingConfirmation
                formData={formData}
                doctorName={selectedDoctor?.name || ''}
                specialtyName={selectedSpecialty?.name || ''}
                formattedDate={formattedDate}
                selectedDate={selectedDate} // Pass the selected date to BookingConfirmation
                onBookingSuccess={handleBookingSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons with enhanced design */}
      <div className="p-4 border-t bg-gradient-to-b from-gray-50 to-gray-100 flex justify-between">
        {currentStep > 1 ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
            onClick={goToPrevStep}
            aria-label="السابق"
          >
            <ChevronRight className="h-5 w-5 rtl:transform rtl:rotate-180" />
            السابق
          </motion.button>
        ) : (
          <div></div> // Empty div for layout
        )}
        
        {currentStep < 5 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white transition-colors shadow-sm next-step-button ${
              (currentStep === 1 && !formData.specialty_id) || 
              (currentStep === 2 && !formData.doctor_id) || 
              (currentStep === 3 && (!formData.booking_day || !formData.booking_time))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand to-brand-light hover:opacity-90'
            }`}
            onClick={goToNextStep}
            disabled={
              (currentStep === 1 && !formData.specialty_id) || 
              (currentStep === 2 && !formData.doctor_id) || 
              (currentStep === 3 && (!formData.booking_day || !formData.booking_time))
            }
            aria-label="التالي"
          >
            التالي
            <ChevronLeft className="h-5 w-5 rtl:transform rtl:rotate-180" />
          </motion.button>
        )}
      </div>
      
      {/* Step summary - helps users understand where they are */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-center text-sm text-gray-500">
        {currentStep === 1 && 'اختر التخصص المناسب لك من القائمة أعلاه'}
        {currentStep === 2 && 'اختر الطبيب الذي تريد حجز موعد معه'}
        {currentStep === 3 && 'حدد اليوم والوقت المناسب لموعدك'}
        {currentStep === 4 && 'أدخل بياناتك الشخصية لإتمام الحجز'}
        {currentStep === 5 && 'تأكد من بيانات الحجز وأكد الحجز'}
      </div>
    </div>
  );
};

export default BookingWizardContainer;
