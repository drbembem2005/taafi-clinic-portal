
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Doctor } from '@/services/doctorService';
import { Specialty } from '@/services/specialtyService';
import BookingWizard from './BookingWizard';

// Define and export the BookingFormData type
export interface BookingFormData {
  booking_time: string;
  user_name: string;
  user_phone: string;
  user_email: string | null;
  notes: string | null;
}

const BookingWizardContainer = () => {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDayCode, setSelectedDayCode] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  
  // Reference for scrolling to doctor selection step
  const doctorSectionRef = useRef<HTMLDivElement>(null);

  // Handle location state for pre-selected doctor and specialty
  useEffect(() => {
    if (location.state) {
      const { selectedDoctor: doctorId, selectedSpecialty: specialtyId } = location.state;
      
      if (doctorId) {
        console.log('Pre-selected doctor from location state:', doctorId);
      }
      
      if (specialtyId) {
        console.log('Pre-selected specialty from location state:', specialtyId);
      }
    }
  }, [location.state]);

  const handleSpecialtySelected = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    console.log('Selected specialty:', specialty);
  };

  const handleDoctorSelected = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    console.log('Selected doctor:', doctor);
  };

  const handleDateSelected = (date: Date | null) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const handleTimeSelected = (time: string) => {
    setSelectedTime(time);
    console.log('Selected time:', time);
  };

  const handleDayCodeSelected = (dayCode: string) => {
    setSelectedDayCode(dayCode);
  };

  const handlePatientInfoChange = (info: typeof patientInfo) => {
    setPatientInfo(info);
    console.log('Patient info:', info);
  };
  
  const handleUpdateFormattedDate = (date: string) => {
    setFormattedDate(date);
  };
  
  const handleBookingSuccess = (reference: string) => {
    setBookingReference(reference);
    // Move to success step
    setActiveStep(5);
  };
  
  const handleResetBooking = () => {
    setActiveStep(0);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDayCode('');
    setFormattedDate('');
    setPatientInfo({
      name: '',
      phone: '',
      email: '',
      notes: '',
    });
    setBookingReference(null);
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };

  // Handle specialty step completion - auto navigate
  const handleSpecialtyStepComplete = () => {
    // Advance to the next step
    handleNextStep();
    
    // Scroll to the doctor selection section after a short delay
    setTimeout(() => {
      if (doctorSectionRef.current) {
        doctorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle date and time selection
  const handleSelectDateTime = (day: string, time: string, formattedDateStr: string) => {
    setSelectedDayCode(day);
    setSelectedTime(time);
    setFormattedDate(formattedDateStr);
    
    // Create a Date object for the selected day if needed
    // Note: We're mainly using the day code (e.g., 'Mon', 'Tue') for the backend
    // and the formatted date string for display purposes
    try {
      if (day && time) {
        // This is just to have a Date object if needed for other operations
        const today = new Date();
        const selectedDate = new Date(today);
        setSelectedDate(selectedDate);
      } else {
        setSelectedDate(null);
      }
    } catch (err) {
      console.error('Error creating date object:', err);
      setSelectedDate(null);
    }
  };

  return (
    <div>
      <BookingWizard
        activeStep={activeStep}
        selectedSpecialty={selectedSpecialty}
        selectedDoctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        formattedDate={formattedDate}
        patientInfo={patientInfo}
        bookingReference={bookingReference}
        onSpecialtySelect={handleSpecialtySelected}
        onDoctorSelect={handleDoctorSelected}
        onDateSelect={handleDateSelected}
        onTimeSelect={handleTimeSelected}
        onPatientInfoChange={handlePatientInfoChange}
        onNext={handleNextStep}
        onPrevious={handlePreviousStep}
        onSpecialtyStepComplete={handleSpecialtyStepComplete}
        onUpdateFormattedDate={handleUpdateFormattedDate}
        onBookingSuccess={handleBookingSuccess}
        onResetBooking={handleResetBooking}
        doctorSectionRef={doctorSectionRef}
      />
    </div>
  );
};

export default BookingWizardContainer;
