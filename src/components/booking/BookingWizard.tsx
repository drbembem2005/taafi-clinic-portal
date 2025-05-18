
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
  formattedDate: string;
  patientInfo: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  bookingReference: string | null;
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
  onUpdateFormattedDate: (date: string) => void;
  onBookingSuccess: (reference: string) => void;
  onResetBooking: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpecialtyStepComplete?: () => void;
  doctorSectionRef?: React.RefObject<HTMLDivElement>;
}

const BookingWizard = ({
  activeStep,
  selectedSpecialty,
  selectedDoctor,
  selectedDate,
  selectedTime,
  formattedDate,
  patientInfo,
  bookingReference,
  onSpecialtySelect,
  onDoctorSelect,
  onDateSelect,
  onTimeSelect,
  onPatientInfoChange,
  onUpdateFormattedDate,
  onBookingSuccess,
  onResetBooking,
  onNext,
  onPrevious,
  onSpecialtyStepComplete,
  doctorSectionRef
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
              onStepComplete={onSpecialtyStepComplete}
            />
          </TabsContent>
          
          <TabsContent value="step-1">
            <div ref={doctorSectionRef}>
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
              doctorName={selectedDoctor?.name || ''}
              selectedDay={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              selectedTime={selectedTime || ''}
              onSelectDateTime={(day, time, formattedDate) => {
                const date = new Date(day + 'T00:00:00');
                onDateSelect(date);
                onTimeSelect(time);
                onUpdateFormattedDate(formattedDate);
              }}
              onUpdateFormattedDate={onUpdateFormattedDate}
            />
          </TabsContent>
          
          <TabsContent value="step-3">
            <ContactInfoForm
              doctorName={selectedDoctor?.name || ''}
              appointmentDate={formattedDate}
              appointmentTime={selectedTime || ''}
              initialValues={patientInfo}
              onUpdateContactInfo={(name, phone, email, notes) => {
                onPatientInfoChange({
                  name,
                  phone,
                  email: email || '',
                  notes: notes || ''
                });
              }}
            />
          </TabsContent>
          
          <TabsContent value="step-4">
            <BookingConfirmation
              formData={{
                booking_time: selectedTime || '',
                user_name: patientInfo.name,
                user_phone: patientInfo.phone,
                user_email: patientInfo.email || null,
                notes: patientInfo.notes || null
              }}
              doctorName={selectedDoctor?.name || ''}
              specialtyName={selectedSpecialty?.name || ''}
              formattedDate={formattedDate}
              onBookingSuccess={onBookingSuccess}
            />
          </TabsContent>
          
          <TabsContent value="step-5">
            <BookingSuccess
              bookingReference={bookingReference || ''}
              doctorName={selectedDoctor?.name || ''}
              appointmentDate={formattedDate}
              appointmentTime={selectedTime || ''}
              userPhone={patientInfo.phone}
              userEmail={patientInfo.email || null}
              onReset={onResetBooking}
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
        currentStep={activeStep + 1} 
      />
      {renderStepContent()}
    </div>
  );
};

export default BookingWizard;
