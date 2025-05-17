
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getNextAvailableDays } from '@/services/doctorService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface NextAvailableDaysPickerProps {
  doctorId: number;
  onSelectDateTime: (day: string, time: string, formattedDate: string) => void;
  selectedDay?: string;
  selectedTime?: string;
}

const NextAvailableDaysPicker = ({ 
  doctorId,
  onSelectDateTime,
  selectedDay,
  selectedTime
}: NextAvailableDaysPickerProps) => {
  const [loading, setLoading] = useState(true);
  const [availableDays, setAvailableDays] = useState<Array<{
    date: Date;
    dayName: string;
    dayCode: string;
    times: string[];
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!doctorId) {
          setError('يرجى اختيار طبيب أولاً');
          return;
        }
        
        const nextAvailableDays = await getNextAvailableDays(doctorId);
        console.log("NextAvailableDaysPicker received days:", nextAvailableDays);
        
        if (nextAvailableDays.length === 0) {
          setError('لا توجد مواعيد متاحة لهذا الطبيب');
        } else {
          setAvailableDays(nextAvailableDays);
          console.log("Available days set:", nextAvailableDays);
        }
      } catch (err) {
        console.error('Error fetching available days:', err);
        setError('حدث خطأ أثناء جلب المواعيد المتاحة');
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب المواعيد المتاحة",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDays();
  }, [doctorId]);

  const handleSelectDateTime = (dayCode: string, time: string, date: Date) => {
    // Format the date in a user-friendly way
    const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ar });
    onSelectDateTime(dayCode, time, formattedDate);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full mb-3" />
        <Skeleton className="h-32 w-full mb-3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
        <p>{error}</p>
        <p className="text-sm mt-2">يرجى التواصل مع العيادة مباشرة للحصول على موعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center mb-4">المواعيد المتاحة</h3>
      
      {availableDays.map((dayInfo, dayIndex) => (
        <Card key={dayIndex} className={`overflow-hidden transition-all ${
          selectedDay === dayInfo.dayCode ? 'border-brand ring-1 ring-brand' : ''
        }`}>
          <div className="bg-brand/5 px-4 py-2 border-b flex items-center">
            <Calendar className="h-4 w-4 text-brand ml-2" />
            <div className="font-medium">
              {dayInfo.dayName}, {format(dayInfo.date, 'd MMMM yyyy', { locale: ar })}
            </div>
          </div>
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              {dayInfo.times && Array.isArray(dayInfo.times) && dayInfo.times.map((time, timeIndex) => (
                <Button
                  key={timeIndex}
                  size="sm"
                  variant={selectedDay === dayInfo.dayCode && selectedTime === time ? "default" : "outline"}
                  className={`flex items-center ${
                    selectedDay === dayInfo.dayCode && selectedTime === time 
                      ? 'bg-brand hover:bg-brand/90' 
                      : 'hover:border-brand hover:text-brand'
                  }`}
                  onClick={() => handleSelectDateTime(dayInfo.dayCode, time, dayInfo.date)}
                >
                  <Clock className="h-3 w-3 ml-1" />
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {availableDays.length === 0 && !error && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">لا توجد مواعيد متاحة حاليًا</p>
          <p className="text-sm text-yellow-600 mt-2">يرجى التواصل مع العيادة مباشرة للحصول على موعد</p>
        </div>
      )}
    </div>
  );
};

export default NextAvailableDaysPicker;
