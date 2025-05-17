
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getNextAvailableDays } from '@/services/doctorService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <p className="text-sm mt-2 text-red-600">يرجى التواصل مع العيادة مباشرة للحصول على موعد</p>
        <Button
          variant="outline"
          className="mt-4 bg-white border-red-300 hover:bg-red-50 text-red-600"
          onClick={() => window.open('https://wa.me/201119007403', '_blank')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          تواصل مع العيادة عبر واتساب
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center mb-2">المواعيد المتاحة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableDays.map((dayInfo, dayIndex) => (
          <Card 
            key={dayIndex} 
            className={`overflow-hidden transition-all hover:shadow-md ${
              selectedDay === dayInfo.dayCode ? 'border-brand ring-1 ring-brand shadow-md' : ''
            }`}
          >
            <div className={`p-3 flex items-center justify-center ${
              selectedDay === dayInfo.dayCode ? 'bg-brand text-white' : 'bg-brand/5'
            }`}>
              <Calendar className={`h-4 w-4 ${selectedDay === dayInfo.dayCode ? 'text-white' : 'text-brand'} ml-2`} />
              <div className="font-bold text-center">
                {dayInfo.dayName}
                <div className="text-sm font-normal">
                  {format(dayInfo.date, 'd MMMM yyyy', { locale: ar })}
                </div>
              </div>
            </div>
            
            <CardContent className="p-3">
              <div className="mb-2 text-center">
                <Badge variant="outline" className="text-xs bg-brand/5 text-brand border-brand/20">
                  أوقات الكشف المتاحة
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 justify-center">
                {dayInfo.times && Array.isArray(dayInfo.times) && dayInfo.times.map((time, timeIndex) => (
                  <Button
                    key={timeIndex}
                    size="sm"
                    variant={selectedDay === dayInfo.dayCode && selectedTime === time ? "default" : "outline"}
                    className={`text-xs py-1 px-2 h-auto ${
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
              
              {selectedDay === dayInfo.dayCode && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-brand">تم اختيار هذا اليوم</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {availableDays.length === 0 && !error && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">لا توجد مواعيد متاحة حاليًا</p>
          <p className="text-sm text-yellow-600 mt-2">يرجى التواصل مع العيادة مباشرة للحصول على موعد</p>
          <Button
            variant="outline"
            className="mt-4 bg-white border-green-300 hover:bg-green-50 text-green-600"
            onClick={() => window.open('https://wa.me/201119007403', '_blank')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            تواصل مع العيادة عبر واتساب
          </Button>
        </div>
      )}
      
      {selectedDay && selectedTime && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
          <p className="text-green-700">
            تم اختيار موعدك: <strong>{format(availableDays.find(d => d.dayCode === selectedDay)?.date || new Date(), 'EEEE, d MMMM yyyy', { locale: ar })} - {selectedTime}</strong>
          </p>
          <p className="text-sm text-green-600 mt-2">يرجى إكمال بيانات الحجز في الخطوة التالية</p>
        </div>
      )}
    </div>
  );
};

export default NextAvailableDaysPicker;
