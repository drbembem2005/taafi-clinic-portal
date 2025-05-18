
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Doctor } from '@/services/doctorService';
import { Specialty } from '@/services/specialtyService';
import BookingWizard from './BookingWizard';

const BookingWizardContainer = () => {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  
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

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const handleTimeSelected = (time: string) => {
    setSelectedTime(time);
    console.log('Selected time:', time);
  };

  const handlePatientInfoChange = (info: typeof patientInfo) => {
    setPatientInfo(info);
    console.log('Patient info:', info);
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

  return (
    <div>
      <BookingWizard
        activeStep={activeStep}
        selectedSpecialty={selectedSpecialty}
        selectedDoctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        patientInfo={patientInfo}
        onSpecialtySelect={handleSpecialtySelected}
        onDoctorSelect={handleDoctorSelected}
        onDateSelect={handleDateSelected}
        onTimeSelect={handleTimeSelected}
        onPatientInfoChange={handlePatientInfoChange}
        onNext={handleNextStep}
        onPrevious={handlePreviousStep}
        onSpecialtyStepComplete={handleSpecialtyStepComplete} // Pass the new callback
        doctorSectionRef={doctorSectionRef} // Pass the ref for scrolling
      />
    </div>
  );
};

export default BookingWizardContainer;
