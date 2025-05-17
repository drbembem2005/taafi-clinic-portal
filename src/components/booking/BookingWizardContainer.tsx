
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import SpecialtySelection from './SpecialtySelection';
import DoctorSelection from './DoctorSelection';
import AppointmentSelection from './AppointmentSelection';
import ContactInfoForm from './ContactInfoForm';
import BookingConfirmation from './BookingConfirmation';
import BookingSuccess from './BookingSuccess';
import BookingProgress from './BookingProgress';
import { Specialty } from '@/services/specialtyService';
import { Doctor, getDoctor } from '@/services/doctorService';

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
  // Get doctor_id from query params if available
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor_id');
  
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

  // Load preselected doctor if applicable
  useEffect(() => {
    const loadPreselectedDoctor = async () => {
      if (preselectedDoctorId) {
        const doctorId = parseInt(preselectedDoctorId);
        if (!isNaN(doctorId)) {
          try {
            const doctor = await getDoctor(doctorId);
            if (doctor) {
              handleDoctorSelect(doctor);
              // Automatically move to step 2 (appointment selection)
              setCurrentStep(2);
            }
          } catch (error) {
            console.error('Error loading preselected doctor:', error);
          }
        }
      }
    };
    
    loadPreselectedDoctor();
  }, [preselectedDoctorId]);

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
      doctor_id: doctor.id,
      specialty_id: doctor.specialty_id // Also set the specialty
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

  // Open WhatsApp with booking details - now separate from database saving
  const handleOpenWhatsApp = () => {
    import('@/services/bookingService').then(({ openWhatsAppWithBookingDetails }) => {
      openWhatsAppWithBookingDetails({
        doctorName: selectedDoctor?.name || '',
        date: formattedDate,
        time: formData.booking_time,
        userName: formData.user_name,
        phone: formData.user_phone,
        email: formData.user_email,
        notes: formData.notes
      });
    });
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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Progress bar and indicators - now with 5 steps instead of 4 */}
      <BookingProgress currentStep={currentStep} totalSteps={5} />
      
      {/* Main content area */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Full width specialty selection */}
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
            >
              {/* Doctor selection as its own step */}
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
            >
              <BookingConfirmation
                formData={formData}
                doctorName={selectedDoctor?.name || ''}
                specialtyName={selectedSpecialty?.name || ''}
                formattedDate={formattedDate}
                onBookingSuccess={handleBookingSuccess}
                onWhatsAppBooking={handleOpenWhatsApp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons */}
      <div className="p-4 border-t bg-gray-50 flex justify-between">
        {currentStep > 1 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={goToPrevStep}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:transform rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            السابق
          </motion.button>
        )}
        
        {currentStep < 5 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white transition-colors ${
              (currentStep === 1 && !formData.specialty_id) || 
              (currentStep === 2 && !formData.doctor_id) || 
              (currentStep === 3 && (!formData.booking_day || !formData.booking_time))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand hover:bg-brand-dark'
            }`}
            onClick={goToNextStep}
            disabled={
              (currentStep === 1 && !formData.specialty_id) || 
              (currentStep === 2 && !formData.doctor_id) || 
              (currentStep === 3 && (!formData.booking_day || !formData.booking_time))
            }
          >
            التالي
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:transform rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default BookingWizardContainer;
