
import { useState, useCallback, useEffect } from 'react';
import { CalendarDays, UserCheck, CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getNextAvailableDays } from '@/services/doctorService';
import { toast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

export interface DayInfo {
  date: Date;
  dayName: string;
  dayCode: string;
  times: string[];
  uniqueId: string;
}

interface AppointmentSelectionProps {
  doctorId: number | null;
  doctorName: string;
  selectedDay: string;
  selectedTime: string;
  onSelectDateTime: (day: string, time: string, formattedDate: string, selectedDate: Date) => void;
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
  const [availableDays, setAvailableDays] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const isMobile = useIsMobile();
  
  // Fetch available days whenever doctorId changes
  useEffect(() => {
    const fetchAvailableDays = async () => {
      if (!doctorId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching available days for doctor ID: ${doctorId}`);
        const days = await getNextAvailableDays(doctorId);
        
        console.log("Available days returned:", days);
        setAvailableDays(days);
        
        // If we have a selected day, find and update the formatted date
        if (selectedDay && days.length > 0) {
          const dayInfo = days.find(d => d.uniqueId === selectedDay);
          if (dayInfo && dayInfo.date instanceof Date) {
            try {
              const dateStr = format(dayInfo.date, 'EEEE, d MMMM yyyy', { locale: ar });
              console.log(`Setting formatted date to: ${dateStr}`);
              setFormattedDate(dateStr);
              onUpdateFormattedDate(dateStr);
            } catch (err) {
              console.error('Error formatting date:', err);
            }
          }
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
  }, [doctorId, selectedDay, onUpdateFormattedDate]);
  
  const handleSelectDateTime = useCallback((dayInfo: DayInfo, time: string) => {
    try {
      // Check if date is valid
      if (!(dayInfo.date instanceof Date) || isNaN(dayInfo.date.getTime())) {
        console.error("Invalid date:", dayInfo.date);
        return;
      }
      
      const dateStr = format(dayInfo.date, 'EEEE, d MMMM yyyy', { locale: ar });
      console.log(`Selected date: ${dateStr}, time: ${time}`);
      setFormattedDate(dateStr);
      onUpdateFormattedDate(dateStr);
      onSelectDateTime(dayInfo.uniqueId, time, dateStr, dayInfo.date);
    } catch (err) {
      console.error("Error selecting date time:", err, dayInfo);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء اختيار الموعد",
        variant: "destructive",
      });
    }
  }, [onSelectDateTime, onUpdateFormattedDate]);
  
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
  
  // Loading state
    
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button
          variant="outline"
          className="mt-4 bg-white border-red-300 hover:bg-red-50 text-red-600"
          onClick={() => window.open('https://wa.me/201119007403', '_blank')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          تواصل مع العيادة
        </Button>
      </div>
    );
  }
  
  // No available days
  if (availableDays.length === 0) {
    return (
      <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700 mb-3">لا توجد مواعيد متاحة حاليًا</p>
        <Button
          variant="outline"
          size="sm"
          className="bg-white border-green-300 hover:bg-green-50 text-green-600 text-sm"
          onClick={() => window.open('https://wa.me/201119007403', '_blank')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          تواصل مع العيادة
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">اختر موعدًا مناسبًا</h2>
        <p className="text-sm text-gray-600">حدد اليوم والوقت المناسب لموعدك مع د. {doctorName}</p>
      </div>
      
      {/* Doctor info card */}
      <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 mb-4 flex items-center">
        <UserCheck className="h-5 w-5 text-brand ml-2 flex-shrink-0" />
        <p className="text-sm md:text-base text-gray-700 truncate">
          الطبيب المختار: <span className="font-bold">{doctorName}</span>
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-brand" />
          <h3 className="font-medium text-gray-800 text-sm md:text-base">المواعيد المتاحة - {availableDays.length} أيام</h3>
        </div>
        
        <div className="p-4">
          {isMobile ? (
            <MobileAppointmentView 
              days={availableDays}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              onSelect={handleSelectDateTime}
            />
          ) : (
            <DesktopAppointmentView 
              days={availableDays}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              onSelect={handleSelectDateTime}
            />
          )}
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
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Mobile view with carousel
const MobileAppointmentView = ({ 
  days, 
  selectedDay, 
  selectedTime,
  onSelect 
}: { 
  days: DayInfo[], 
  selectedDay: string, 
  selectedTime: string,
  onSelect: (day: DayInfo, time: string) => void 
}) => {
  console.log("Mobile view - available days:", days);
  console.log("Mobile view - selectedDay:", selectedDay);
  
  // Fix circular reference issue by ensuring we're dealing with valid day objects
  const validDays = days.map(day => {
    // Create a copy of the day object to avoid circular reference issues
    const validDay = {...day};
    
    // Ensure times is an array
    if (!Array.isArray(validDay.times)) {
      validDay.times = [];
    }
    
    return validDay;
  });

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {validDays.map((day) => {
          const isDaySelected = selectedDay === day.uniqueId;
          const availableTime = day.times[0] || null;
          
          console.log(`Day ${day.dayName}, isDaySelected:`, isDaySelected);
          
          return (
            <CarouselItem key={day.uniqueId} className="md:basis-1/1">
              <div className="p-1">
                <Card 
                  className={`overflow-hidden transition-all border cursor-pointer ${
                    isDaySelected ? 'border-brand ring-1 ring-brand' : 'border-gray-200'
                  }`}
                  onClick={() => availableTime && onSelect(day, availableTime)}
                >
                  <div className={`p-3 flex items-center justify-center ${
                    isDaySelected ? 'bg-brand text-white' : 'bg-brand/5'
                  }`}>
                    <div className="text-center">
                      <p className="font-medium">{day.dayName}</p>
                      <p className="text-sm">
                        {day.date instanceof Date && format(day.date, 'd MMMM', { locale: ar })}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 text-center">
                    {availableTime ? (
                      <div className="flex flex-col items-center justify-center">
                        <p className="mb-3 text-sm text-gray-500">موعد الكشف</p>
                        <Button
                          size="sm"
                          variant={isDaySelected && selectedTime === availableTime ? "default" : "outline"}
                          className={`py-2 px-6 ${
                            isDaySelected && selectedTime === availableTime 
                              ? 'bg-brand hover:bg-brand/90' 
                              : 'hover:border-brand hover:text-brand'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(day, availableTime);
                          }}
                        >
                          {availableTime}
                        </Button>
                        
                        {isDaySelected && selectedTime === availableTime && (
                          <Badge className="mt-3 text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            تم الاختيار
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">لا توجد مواعيد متاحة</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="flex items-center justify-center mt-4 gap-2">
        <CarouselPrevious className="relative static mr-2 h-8 w-8 translate-y-0 translate-x-0" />
        <CarouselNext className="relative static translate-y-0 translate-x-0 h-8 w-8 ml-2" />
      </div>
    </Carousel>
  );
};

// Desktop view with grid
const DesktopAppointmentView = ({ 
  days, 
  selectedDay, 
  selectedTime,
  onSelect 
}: { 
  days: DayInfo[], 
  selectedDay: string, 
  selectedTime: string,
  onSelect: (day: DayInfo, time: string) => void 
}) => {
  console.log("Desktop view - available days:", days);
  console.log("Desktop view - selectedDay:", selectedDay);
  
  // Fix circular reference issue by ensuring we're dealing with valid day objects
  const validDays = days.map(day => {
    // Create a copy of the day object to avoid circular reference issues
    const validDay = {...day};
    
    // Ensure times is an array
    if (!Array.isArray(validDay.times)) {
      validDay.times = [];
    }
    
    return validDay;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {validDays.map((day) => {
        const isDaySelected = selectedDay === day.uniqueId;
        const availableTime = day.times[0] || null;
        
        console.log(`Day ${day.dayName}, isDaySelected:`, isDaySelected);
        
        return (
          <Card 
            key={day.uniqueId} 
            className={`overflow-hidden transition-all hover:shadow-md cursor-pointer
              ${isDaySelected ? 'border-brand ring-1 ring-brand shadow-md' : ''}`}
            onClick={() => availableTime && onSelect(day, availableTime)}
          >
            <div className={`p-3 flex flex-col items-center justify-center 
              ${isDaySelected ? 'bg-brand text-white' : 'bg-brand/5'}`}>
              <CalendarDays className={`h-5 w-5 ${isDaySelected ? 'text-white' : 'text-brand'} mb-1`} />
              <div className="font-bold text-center">
                {day.dayName}
              </div>
              <div className="text-sm text-center">
                {day.date instanceof Date && format(day.date, 'd MMMM', { locale: ar })}
              </div>
            </div>
            
            <CardContent className="p-4 text-center">
              {availableTime ? (
                <>
                  <p className="mb-3 text-sm text-gray-500">موعد الكشف</p>
                  <Button
                    size="sm" 
                    variant={isDaySelected && selectedTime === availableTime ? "default" : "outline"}
                    className={`py-2 px-4 ${
                      isDaySelected && selectedTime === availableTime 
                        ? 'bg-brand hover:bg-brand/90' 
                        : 'hover:border-brand hover:text-brand'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(day, availableTime);
                    }}
                  >
                    {availableTime}
                  </Button>
                  
                  {isDaySelected && selectedTime === availableTime && (
                    <Badge className="mt-3 text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      تم الاختيار
                    </Badge>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">لا توجد مواعيد متاحة</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AppointmentSelection;
