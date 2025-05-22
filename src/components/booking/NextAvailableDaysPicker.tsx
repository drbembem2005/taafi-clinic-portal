
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getNextAvailableDays } from '@/services/doctorService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the interface for the day info
export interface DayInfo {
  date: Date;
  dayName: string;
  dayCode: string;
  times: string[];
  uniqueId: string; // Add a unique ID for each date
}

interface NextAvailableDaysPickerProps {
  doctorId: number;
  onSelectDateTime: (day: string, time: string, formattedDate: string, availableDays: DayInfo[], selectedDate: Date) => void;
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
  const [availableDays, setAvailableDays] = useState<DayInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayInfo, setSelectedDayInfo] = useState<DayInfo | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Memoize fetch function to prevent unnecessary re-renders
  const fetchAvailableDays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!doctorId) {
        setError('يرجى اختيار طبيب أولاً');
        return;
      }
      
      const nextAvailableDays = await getNextAvailableDays(doctorId);
      
      if (nextAvailableDays.length === 0) {
        setError('لا توجد مواعيد متاحة لهذا الطبيب');
      } else {
        // Ensure we're working with valid Date objects and add uniqueId
        const validatedDays = nextAvailableDays.map(day => {
          // Make sure the date is a valid Date object
          const validDate = day.date instanceof Date && !isNaN(day.date.getTime()) 
            ? day.date 
            : new Date(); // Default to current date if invalid
          
          // Create a unique ID using the date's timestamp
          const uniqueId = `${day.dayCode}-${validDate.getTime()}`;
            
          return {
            ...day,
            date: validDate,
            uniqueId // Add the unique ID
          };
        });
        
        setAvailableDays(validatedDays);
        
        // Find the previously selected day if it exists
        if (selectedDay) {
          const matchingDayInfo = validatedDays.find(d => d.uniqueId === selectedDay);
          setSelectedDayInfo(matchingDayInfo || null);
          
          // Find index of selected day for carousel positioning
          const selectedIndex = validatedDays.findIndex(d => d.uniqueId === selectedDay);
          if (selectedIndex >= 0) {
            setActiveIndex(selectedIndex);
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
  }, [doctorId, selectedDay]);

  // Use effect with dependencies on doctorId only to prevent constant re-renders
  useEffect(() => {
    fetchAvailableDays();
  }, [doctorId, fetchAvailableDays]);

  const handleSelectDateTime = (uniqueId: string, time: string, date: Date) => {
    // Format the date in a user-friendly way
    try {
      if (date instanceof Date && !isNaN(date.getTime())) {
        const formattedDate = format(date, 'EEEE, d MMMM yyyy', { locale: ar });
        
        // Find the selected day info by uniqueId for later use
        const dayInfo = availableDays.find(d => d.uniqueId === uniqueId);
        if (!dayInfo) {
          console.error("Could not find day with uniqueId:", uniqueId);
          return;
        }
        
        setSelectedDayInfo(dayInfo);
        
        // Pass the uniqueId as primary identifier
        onSelectDateTime(uniqueId, time, formattedDate, availableDays, date);
      } else {
        console.error("Invalid date object:", date);
        toast({
          title: "خطأ",
          description: "تاريخ غير صالح، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error handling date selection:", err);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء اختيار التاريخ",
        variant: "destructive",
      });
    }
  };

  // Navigation for mobile carousel
  const nextDay = useCallback(() => {
    if (activeIndex < availableDays.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, availableDays.length]);

  const prevDay = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">{error}</p>
        <Button
          variant="outline"
          className="mt-4 bg-white border-red-300 hover:bg-red-50 text-red-600 text-sm"
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

  // Mobile carousel view
  if (isMobile && availableDays.length > 0) {
    return (
      <div className="space-y-4">
        {/* Date carousel with navigation */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={prevDay}
              disabled={activeIndex === 0}
              className="p-1 h-8 w-8"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-600">
              {activeIndex + 1} من {availableDays.length}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextDay}
              disabled={activeIndex === availableDays.length - 1}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {availableDays.map((dayInfo, index) => {
            // Only render the active day
            if (index !== activeIndex) return null;
            
            const isValidDate = dayInfo.date instanceof Date && !isNaN(dayInfo.date.getTime());
            const isDaySelected = selectedDay === dayInfo.uniqueId;
            const availableTime = dayInfo.times && dayInfo.times.length > 0 ? dayInfo.times[0] : null;
            
            return (
              <Card
                key={dayInfo.uniqueId}
                className={`overflow-hidden transition-all ${
                  isDaySelected ? 'border-brand ring-1 ring-brand shadow-md' : ''
                }`}
              >
                <div className={`p-3 flex items-center justify-between ${
                  isDaySelected ? 'bg-brand text-white' : 'bg-brand/5'
                }`}>
                  <Calendar className={`h-5 w-5 ${isDaySelected ? 'text-white' : 'text-brand'}`} />
                  <div className="text-center">
                    <div className="font-bold">
                      {dayInfo.dayName}
                    </div>
                    <div className="text-sm">
                      {isValidDate ? format(dayInfo.date, 'd MMMM', { locale: ar }) : 'تاريخ غير صالح'}
                    </div>
                  </div>
                  <div className="w-5"></div> {/* Empty div for flex alignment */}
                </div>
                
                <CardContent className="p-3">
                  {availableTime ? (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 text-sm text-gray-500">موعد الكشف</p>
                      <Button
                        size="sm"
                        variant={isDaySelected && selectedTime === availableTime ? "default" : "outline"}
                        className={`py-1 px-3 ${
                          isDaySelected && selectedTime === availableTime 
                            ? 'bg-brand hover:bg-brand/90' 
                            : 'hover:border-brand hover:text-brand'
                        }`}
                        onClick={() => {
                          isValidDate && availableTime && handleSelectDateTime(dayInfo.uniqueId, availableTime, dayInfo.date);
                        }}
                      >
                        <Clock className="h-4 w-4 ml-1" />
                        {availableTime}
                      </Button>
                      
                      {isDaySelected && selectedTime === availableTime && (
                        <Badge className="mt-2 text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                          تم الاختيار
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500">لا توجد مواعيد متاحة</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Date list indicators */}
        <div className="flex justify-center gap-1 py-2">
          {availableDays.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-brand w-4' 
                  : 'bg-gray-300 w-1.5'
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop view - show days in grid
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableDays.map((dayInfo) => {
          const availableTime = dayInfo.times && dayInfo.times.length > 0 ? dayInfo.times[0] : null;
          const isValidDate = dayInfo.date instanceof Date && !isNaN(dayInfo.date.getTime());
          const isDaySelected = selectedDay === dayInfo.uniqueId;
          
          return (
            <Card 
              key={dayInfo.uniqueId} 
              className={`overflow-hidden transition-all hover:shadow-md ${
                isDaySelected ? 'border-brand ring-1 ring-brand shadow-md' : ''
              }`}
            >
              <div className={`p-3 flex flex-col items-center justify-center ${
                isDaySelected ? 'bg-brand text-white' : 'bg-brand/5'
              }`}>
                <Calendar className={`h-5 w-5 ${isDaySelected ? 'text-white' : 'text-brand'} mb-1`} />
                <div className="font-bold text-center">
                  {dayInfo.dayName}
                </div>
                <div className="text-sm text-center">
                  {isValidDate ? format(dayInfo.date, 'd MMMM yyyy', { locale: ar }) : 'تاريخ غير صالح'}
                </div>
              </div>
              
              <CardContent className="p-3 text-center">
                {availableTime ? (
                  <>
                    <p className="mb-2 text-sm text-gray-500">موعد الكشف</p>
                    <Button
                      size="sm" 
                      variant={isDaySelected && selectedTime === availableTime ? "default" : "outline"}
                      className={`py-1 px-3 ${
                        isDaySelected && selectedTime === availableTime 
                          ? 'bg-brand hover:bg-brand/90' 
                          : 'hover:border-brand hover:text-brand'
                      }`}
                      onClick={() => {
                        isValidDate && availableTime && handleSelectDateTime(dayInfo.uniqueId, availableTime, dayInfo.date);
                      }}
                    >
                      <Clock className="h-4 w-4 ml-1" />
                      {availableTime}
                    </Button>
                    
                    {isDaySelected && selectedTime === availableTime && (
                      <Badge className="mt-2 text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
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
      
      {availableDays.length === 0 && !error && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">لا توجد مواعيد متاحة حاليًا</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-white border-green-300 hover:bg-green-50 text-green-600 text-sm"
            onClick={() => window.open('https://wa.me/201119007403', '_blank')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            تواصل مع العيادة
          </Button>
        </div>
      )}
    </div>
  );
};

export default NextAvailableDaysPicker;
