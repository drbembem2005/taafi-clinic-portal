
import { useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BookingProgress from './BookingProgress';
import SpecialtySelection from './SpecialtySelection';
import DoctorSelection from './DoctorSelection';
import AppointmentSelection from './AppointmentSelection';
import ContactInfoForm from './ContactInfoForm';
import BookingConfirmation from './BookingConfirmation';
import BookingSuccess from './BookingSuccess';
import { Doctor } from '@/services/doctorService';
import { Specialty } from '@/services/specialtyService';

interface BookingWizardProps {
  activeStep: number;
  selectedSpecialty: Specialty | null;
  selectedDoctor: Doctor | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  patientInfo: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  onSpecialtySelect: (specialty: Specialty) => void;
  onDoctorSelect: (doctor: Doctor) => void;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onPatientInfoChange: (info: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  }) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpecialtyStepComplete?: () => void; // New prop for auto navigation
  doctorSectionRef?: React.RefObject<HTMLDivElement>; // New ref for scrolling
}

const BookingWizard = ({
  activeStep,
  selectedSpecialty,
  selectedDoctor,
  selectedDate,
  selectedTime,
  patientInfo,
  onSpecialtySelect,
  onDoctorSelect,
  onDateSelect,
  onTimeSelect,
  onPatientInfoChange,
  onNext,
  onPrevious,
  onSpecialtyStepComplete, // Add the new callback
  doctorSectionRef // Add the ref
}: BookingWizardProps) => {
  // Steps for the booking process
  const steps = [
    "اختيار التخصص",
    "اختيار الطبيب",
    "اختيار الموعد",
    "معلومات المريض",
    "تأكيد الحجز"
  ];

  // Track if steps are completed
  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 0:
        return selectedSpecialty !== null;
      case 1:
        return selectedDoctor !== null;
      case 2:
        return selectedDate !== null && selectedTime !== null;
      case 3:
        return patientInfo.name.trim() !== '' && patientInfo.phone.trim() !== '';
      default:
        return false;
    }
  };

  // Render the active step content
  const renderStepContent = () => {
    return (
      <>
        <Tabs value={`step-${activeStep}`} className="mt-8">
          <TabsContent value="step-0">
            <SpecialtySelection
              selectedSpecialtyId={selectedSpecialty?.id || null}
              onSelectSpecialty={onSpecialtySelect}
              onStepComplete={onSpecialtyStepComplete} // Pass the callback
            />
          </TabsContent>
          
          <TabsContent value="step-1">
            <div ref={doctorSectionRef}> {/* Add the ref here */}
              <DoctorSelection
                specialtyId={selectedSpecialty?.id || null}
                selectedDoctorId={selectedDoctor?.id || null}
                onSelectDoctor={onDoctorSelect}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="step-2">
            <AppointmentSelection
              doctorId={selectedDoctor?.id || null}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={onDateSelect}
              onTimeSelect={onTimeSelect}
            />
          </TabsContent>
          
          <TabsContent value="step-3">
            <ContactInfoForm
              patientInfo={patientInfo}
              onChange={onPatientInfoChange}
            />
          </TabsContent>
          
          <TabsContent value="step-4">
            <BookingConfirmation
              doctor={selectedDoctor}
              specialty={selectedSpecialty}
              date={selectedDate}
              time={selectedTime}
              patientInfo={patientInfo}
            />
          </TabsContent>
          
          <TabsContent value="step-5">
            <BookingSuccess
              doctor={selectedDoctor}
              specialty={selectedSpecialty}
              date={selectedDate}
              time={selectedTime}
              patientInfo={patientInfo}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={activeStep === 0 || activeStep === 5}
            className={activeStep === 0 || activeStep === 5 ? 'invisible' : ''}
            aria-label="السابق"
          >
            السابق
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!isStepCompleted(activeStep) || activeStep === 5}
            className={activeStep === 5 ? 'invisible' : 'bg-brand hover:bg-brand-dark'}
            aria-label="التالي"
          >
            {activeStep === 4 ? 'تأكيد الحجز' : 'التالي'}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <BookingProgress 
        steps={steps} 
        currentStep={activeStep} 
        completedSteps={Array.from({ length: steps.length }, (_, i) => isStepCompleted(i))}
      />
      {renderStepContent()}
    </div>
  );
};

export default BookingWizard;
