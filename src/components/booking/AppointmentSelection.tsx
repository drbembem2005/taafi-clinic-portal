
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, UserCheck } from 'lucide-react';
import NextAvailableDaysPicker from './NextAvailableDaysPicker';
import { Button } from '@/components/ui/button';

interface AppointmentSelectionProps {
  doctorId: number | null;
  doctorName: string;
  selectedDay: string;
  selectedTime: string;
  onSelectDateTime: (day: string, time: string, formattedDate: string) => void;
  onUpdateFormattedDate: (formattedDate: string) => void;
}

const AppointmentSelection = ({
  doctorId,
  doctorName,
  selectedDay,
  selectedTime,
  onSelectDateTime,
  onUpdateFormattedDate
}: AppointmentSelectionProps) => {
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  // Handler for date and time selection
  const handleDateTimeSelect = (day: string, time: string, formattedDateStr: string) => {
    setFormattedDate(formattedDateStr);
    onUpdateFormattedDate(formattedDateStr);
    onSelectDateTime(day, time, formattedDateStr);
  };
  
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
          {doctorId && (
            <NextAvailableDaysPicker
              doctorId={doctorId}
              onSelectDateTime={handleDateTimeSelect}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
            />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {selectedDay && selectedTime && formattedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-1.5 mr-3">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">تم تحديد الموعد</p>
                  <p className="font-bold text-gray-800">
                    {formattedDate} - {selectedTime}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost"
                size="sm" 
                className="text-green-600 hover:text-green-700 hover:bg-green-100 mr-2"
                onClick={() => {
                  onSelectDateTime('', '', '');
                  onUpdateFormattedDate('');
                  setFormattedDate('');
                }}
              >
                تغيير
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentSelection;
