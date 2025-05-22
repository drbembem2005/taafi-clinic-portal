import { useState, memo, useCallback, useEffect } from 'react';
import { CalendarDays, UserCheck } from 'lucide-react';
import NextAvailableDaysPicker, { DayInfo } from './NextAvailableDaysPicker';

interface AppointmentSelectionProps {
  doctorId: number | null;
  doctorName: string;
  selectedDay: string;
  selectedTime: string;
  onSelectDateTime: (day: string, time: string, formattedDate: string, selectedDate: Date) => void;
  onUpdateFormattedDate: (formattedDate: string) => void;
}

// Using memo with equality check to prevent unnecessary re-renders
const AppointmentSelection = memo(({
  doctorId,
  doctorName,
  selectedDay,
  selectedTime,
  onSelectDateTime,
  onUpdateFormattedDate
}: AppointmentSelectionProps) => {
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  // Memoize handler to prevent recreating on each render
  const handleDateTimeSelect = useCallback((uniqueId: string, time: string, formattedDateStr: string, availableDays: DayInfo[], selectedDate: Date) => {
    setFormattedDate(formattedDateStr);
    onUpdateFormattedDate(formattedDateStr);
    onSelectDateTime(uniqueId, time, formattedDateStr, selectedDate);
  }, [onUpdateFormattedDate, onSelectDateTime]);
  
  // No doctor selected view
  if (!doctorId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <UserCheck className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">يرجى اختيار طبيب أولاً</h3>
        <p className="text-gray-600 max-w-md">
          للمتابعة، يرجى الرجوع والقيام باختيار التخصص والطبيب أولاً.
        </p>
      </div>
    );
  }

  // Keep previous value to avoid unnecessary refreshes
  useEffect(() => {
    if (!formattedDate && selectedDay && selectedTime) {
      // This ensures we maintain the formatted date when component remounts
      onUpdateFormattedDate(formattedDate);
    }
  }, [formattedDate, selectedDay, selectedTime, onUpdateFormattedDate]);
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">اختر موعدًا مناسبًا</h2>
        <p className="text-gray-600">حدد اليوم والوقت المناسب لموعدك مع د. {doctorName}</p>
      </div>
      
      <div className="bg-brand/5 border border-brand/20 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <UserCheck className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
          <p className="text-gray-700">
            الطبيب المختار: <span className="font-bold">{doctorName}</span>
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-brand" />
          <h3 className="font-medium text-gray-800">المواعيد المتاحة</h3>
        </div>
        
        <div className="p-4">
          {/* Key with doctorId to avoid re-rendering unless doctor changes */}
          <NextAvailableDaysPicker
            key={`doctor-${doctorId}`}
            doctorId={doctorId}
            onSelectDateTime={handleDateTimeSelect}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom equality check to prevent unnecessary re-renders
  return (
    prevProps.doctorId === nextProps.doctorId &&
    prevProps.selectedDay === nextProps.selectedDay &&
    prevProps.selectedTime === nextProps.selectedTime &&
    prevProps.doctorName === nextProps.doctorName
  );
});

// Display name for debugging
AppointmentSelection.displayName = 'AppointmentSelection';

export default AppointmentSelection;
