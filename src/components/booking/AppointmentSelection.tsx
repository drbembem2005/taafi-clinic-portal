
import { useState, memo, useCallback, useEffect } from 'react';
import { CalendarDays, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import NextAvailableDaysPicker, { DayInfo } from './NextAvailableDaysPicker';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

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
  const isMobile = useIsMobile();
  
  // Memoize handler to prevent recreating on each render
  const handleDateTimeSelect = useCallback((uniqueId: string, time: string, formattedDateStr: string, availableDays: DayInfo[], selectedDate: Date) => {
    setFormattedDate(formattedDateStr);
    onUpdateFormattedDate(formattedDateStr);
    onSelectDateTime(uniqueId, time, formattedDateStr, selectedDate);
  }, [onUpdateFormattedDate, onSelectDateTime]);
  
  // No doctor selected view
  if (!doctorId) {
    return (
      <div className="flex flex-col items-center justify-center p-5 text-center">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <UserCheck className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">يرجى اختيار طبيب أولاً</h3>
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
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">اختر موعدًا مناسبًا</h2>
        <p className="text-sm text-gray-600">حدد اليوم والوقت المناسب لموعدك مع د. {doctorName}</p>
      </div>
      
      {/* Doctor info card - more compact on mobile */}
      <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 mb-4 flex items-center">
        <UserCheck className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
        <p className="text-sm md:text-base text-gray-700 truncate">
          الطبيب المختار: <span className="font-bold">{doctorName}</span>
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-brand" />
          <h3 className="font-medium text-gray-800 text-sm md:text-base">المواعيد المتاحة</h3>
        </div>
        
        <div className={isMobile ? "p-2" : "p-4"}>
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
      
      {/* Mobile navigation - Only show when a date is selected */}
      {isMobile && selectedDay && selectedTime && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-between items-center shadow-lg z-10">
          <div className="text-sm">
            <p className="font-medium text-brand">{formattedDate}</p>
            <p className="text-gray-700">{selectedTime}</p>
          </div>
          <Button
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            size="sm"
            className="flex items-center gap-2 bg-brand hover:bg-brand/90"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
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
