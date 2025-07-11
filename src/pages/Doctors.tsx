import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getDoctors, getDoctorsBySpecialtyId, Doctor, getDoctorSchedule } from '@/services/doctorService';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import DoctorCard from '@/components/shared/DoctorCard';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Filter, Calendar, X, Tag, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Doctors = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<Record<number, Record<string, string[]>>>({});
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(5);

  const DOCTORS_PER_PAGE = 5;

  const daysOfWeek = [
    { value: "all", label: "جميع الأيام" },
    { value: "saturday", label: "السبت" },
    { value: "sunday", label: "الأحد" },
    { value: "monday", label: "الاثنين" },
    { value: "tuesday", label: "الثلاثاء" },
    { value: "wednesday", label: "الأربعاء" },
    { value: "thursday", label: "الخميس" },
    { value: "friday", label: "الجمعة" }
  ];

  // Handle specialty filter from URL state
  useEffect(() => {
    if (location.state?.specialty) {
      setSelectedSpecialty(location.state.specialty);
    }
  }, [location.state]);

  // Fetch specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const fetchedSpecialties = await getSpecialties();
        console.log("Fetched specialties:", fetchedSpecialties);
        setSpecialties(fetchedSpecialties);
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل التخصصات",
          variant: "destructive",
        });
      }
    };

    fetchSpecialties();
  }, []);

  // Fetch all doctors
  useEffect(() => {
    const fetchAllDoctors = async () => {
      setLoading(true);
      
      try {
        let fetchedDoctors: Doctor[] = [];
        
        if (selectedSpecialty && selectedSpecialty !== "all") {
          const specialty = specialties.find(s => s.name === selectedSpecialty);
          if (specialty) {
            fetchedDoctors = await getDoctorsBySpecialtyId(specialty.id);
            console.log(`Fetched doctors by specialty (${specialty.name}):`, fetchedDoctors);
          }
        } else {
          // Get 5 random doctors first, then all doctors
          const randomDoctors = await getDoctors(5, true);
          const allDoctorsData = await getDoctors();
          
          // Combine random doctors first, then add remaining doctors
          const remainingDoctors = allDoctorsData.filter(
            doctor => !randomDoctors.some(randomDoc => randomDoc.id === doctor.id)
          );
          
          fetchedDoctors = [...randomDoctors, ...remainingDoctors];
          console.log("Fetched doctors (random first):", fetchedDoctors);
        }
        
        setAllDoctors(fetchedDoctors);
        setDisplayedCount(5);
        
        // Set initial doctors (first 5)
        const initialDoctors = fetchedDoctors.slice(0, 5);
        setDoctors(initialDoctors);
        
        // Fetch schedules for initial doctors only
        const schedules: Record<number, Record<string, string[]>> = {};
        for (const doctor of initialDoctors) {
          console.log(`Fetching schedule for doctor: ${doctor.name} (ID: ${doctor.id})`);
          const doctorSchedule = await getDoctorSchedule(doctor.id);
          console.log(`Schedule for doctor ${doctor.name}:`, doctorSchedule);
          schedules[doctor.id] = doctorSchedule;
        }
        setDoctorSchedules(schedules);
        console.log("Initial doctor schedules:", schedules);
        
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات الأطباء",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (specialties.length > 0) {
      setDoctors([]);
      setAllDoctors([]);
      setDoctorSchedules({});
      fetchAllDoctors();
    }
  }, [selectedSpecialty, specialties]);

  // Load more doctors function
  const loadMoreDoctors = useCallback(async () => {
    if (loadingMore || displayedCount >= allDoctors.length) return;

    setLoadingMore(true);
    try {
      const nextBatch = allDoctors.slice(displayedCount, displayedCount + DOCTORS_PER_PAGE);
      
      if (nextBatch.length === 0) {
        setLoadingMore(false);
        return;
      }

      // Fetch schedules for new doctors
      const newSchedules: Record<number, Record<string, string[]>> = {};
      for (const doctor of nextBatch) {
        const doctorSchedule = await getDoctorSchedule(doctor.id);
        newSchedules[doctor.id] = doctorSchedule;
      }

      setDoctors(prev => [...prev, ...nextBatch]);
      setDoctorSchedules(prev => ({ ...prev, ...newSchedules }));
      setDisplayedCount(prev => prev + DOCTORS_PER_PAGE);
      
    } catch (error) {
      console.error("Error loading more doctors:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل المزيد من الأطباء",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [displayedCount, allDoctors, loadingMore]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1000 >= 
        document.documentElement.scrollHeight
      ) {
        loadMoreDoctors();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreDoctors]);

  const handleSpecialtyChange = (value: string) => {
    console.log("Specialty changed to:", value);
    setSelectedSpecialty(value);
  };

  const handleDayChange = (value: string) => {
    console.log("Day changed to:", value);
    setSelectedDay(value);
  };

  // Map day names to schedule keys
  const mapDayToScheduleKey = (dayValue: string): string => {
    const dayMapping = {
      "saturday": "Sat",
      "sunday": "Sun", 
      "monday": "Mon",
      "tuesday": "Tue",
      "wednesday": "Wed",
      "thursday": "Thu",
      "friday": "Fri"
    };
    return dayMapping[dayValue as keyof typeof dayMapping] || dayValue;
  };

  // Format doctors with their specialties for display
  const formattedDoctors = doctors.map(doctor => {
    const doctorSpecialty = specialties.find(s => s.id === doctor.specialty_id);
    return {
      ...doctor,
      specialty: doctorSpecialty ? doctorSpecialty.name : 'تخصص غير محدد',
      schedule: doctorSchedules[doctor.id] || {}
    };
  });

  // Filter doctors by selected day
  const filteredDoctors = selectedDay === "all" 
    ? formattedDoctors 
    : formattedDoctors.filter(doctor => {
        const schedule = doctor.schedule;
        const scheduleKey = mapDayToScheduleKey(selectedDay);
        console.log(`Filtering doctor ${doctor.name} for day ${selectedDay} (key: ${scheduleKey})`);
        console.log(`Doctor schedule:`, schedule);
        const hasScheduleForDay = schedule && schedule[scheduleKey] && schedule[scheduleKey].length > 0;
        console.log(`Has schedule for day: ${hasScheduleForDay}`);
        return hasScheduleForDay;
      });

  console.log(`Filtered doctors for day ${selectedDay}:`, filteredDoctors);

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <Label className="text-xl font-bold text-brand flex items-center gap-2">
          <Filter className="w-5 h-5" />
          تصفية حسب التخصص
        </Label>
        <RadioGroup value={selectedSpecialty} onValueChange={handleSpecialtyChange} className="space-y-3">
          <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-brand/30 hover:bg-blue-50/50 transition-all cursor-pointer">
            <RadioGroupItem value="all" id="specialty-all" className="border-brand text-brand" />
            <Label htmlFor="specialty-all" className="text-gray-800 font-medium cursor-pointer flex-1">
              جميع التخصصات
            </Label>
          </div>
          {specialties.map((specialty) => (
            <div key={specialty.id} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-brand/30 hover:bg-blue-50/50 transition-all cursor-pointer">
              <RadioGroupItem value={specialty.name} id={`specialty-${specialty.id}`} className="border-brand text-brand" />
              <Label htmlFor={`specialty-${specialty.id}`} className="text-gray-800 font-medium cursor-pointer flex-1">
                {specialty.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-6">
        <Label className="text-xl font-bold text-brand flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          تصفية حسب اليوم
        </Label>
        <RadioGroup value={selectedDay} onValueChange={handleDayChange} className="space-y-3">
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-brand/30 hover:bg-blue-50/50 transition-all cursor-pointer">
              <RadioGroupItem value={day.value} id={`day-${day.value}`} className="border-brand text-brand" />
              <Label htmlFor={`day-${day.value}`} className="text-gray-800 font-medium cursor-pointer flex-1">
                {day.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  // Get display text for selected filters
  const getSelectedSpecialtyText = () => {
    if (selectedSpecialty === "all") return "جميع التخصصات";
    return selectedSpecialty;
  };

  const getSelectedDayText = () => {
    const day = daysOfWeek.find(d => d.value === selectedDay);
    return day ? day.label : "جميع الأيام";
  };

  const hasActiveFilters = selectedSpecialty !== "all" || selectedDay !== "all";

  const clearFilters = () => {
    setSelectedSpecialty("all");
    setSelectedDay("all");
  };

  const hasMoreToLoad = displayedCount < allDoctors.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">فريقنا الطبي</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          نخبة من الأطباء الاستشاريين والأخصائيين لتقديم أفضل رعاية طبية لك ولعائلتك
        </p>
      </motion.div>
      
      {/* Filter Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isMobile ? (
          // Mobile Filter with Sheet
          <div className="flex justify-center">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-white shadow-lg border-2 border-brand/20 hover:border-brand hover:bg-brand/5 text-brand font-semibold px-6 py-3 rounded-xl transition-all duration-200">
                  <Filter className="w-5 h-5" />
                  تصفية النتائج
                  <Calendar className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] bg-white border-t-4 border-brand">
                <SheetHeader className="border-b border-gray-100 pb-4 mb-6">
                  <SheetTitle className="text-brand text-2xl font-bold text-center">تصفية الأطباء</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-24">
                  <FilterContent />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Button 
                    onClick={() => setIsFilterOpen(false)} 
                    className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200"
                  >
                    تطبيق التصفية
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          // Desktop Filter - enhanced styling
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-brand/20 transition-all duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label htmlFor="specialty" className="text-lg font-bold text-brand flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  تصفية حسب التخصص
                </Label>
                <select 
                  value={selectedSpecialty} 
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand bg-white font-medium text-gray-700 hover:border-brand/50 transition-all duration-200"
                >
                  <option value="all">جميع التخصصات</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="day" className="text-lg font-bold text-brand flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  تصفية حسب اليوم
                </Label>
                <select 
                  value={selectedDay} 
                  onChange={(e) => handleDayChange(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand bg-white font-medium text-gray-700 hover:border-brand/50 transition-all duration-200"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Selected Filters Display */}
      {hasActiveFilters && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand" />
                <span className="text-sm font-semibold text-brand">الفلاتر المحددة:</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-brand hover:bg-blue-100 text-xs px-2 py-1 h-auto"
              >
                مسح الكل
                <X className="w-3 h-3 mr-1" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedSpecialty !== "all" && (
                <div className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-sm">
                  <Filter className="w-3 h-3 text-brand" />
                  <span className="text-gray-700 font-medium">التخصص:</span>
                  <span className="text-brand font-semibold">{getSelectedSpecialtyText()}</span>
                  <button
                    onClick={() => setSelectedSpecialty("all")}
                    className="mr-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {selectedDay !== "all" && (
                <div className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-sm">
                  <Calendar className="w-3 h-3 text-brand" />
                  <span className="text-gray-700 font-medium">اليوم:</span>
                  <span className="text-brand font-semibold">{getSelectedDayText()}</span>
                  <button
                    onClick={() => setSelectedDay("all")}
                    className="mr-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {loading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-6"
        >
          <div className="text-center mb-4">
            <p className="text-gray-600 text-lg">
              عرض <span className="font-bold text-brand">{filteredDoctors.length}</span> من {allDoctors.length} طبيب
              {hasMoreToLoad && !hasActiveFilters && (
                <span className="text-sm text-gray-500 block mt-1">
                  (يتم تحميل المزيد تلقائياً عند التمرير)
                </span>
              )}
            </p>
          </div>
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand mr-2" />
              <span className="text-brand font-medium">جاري تحميل المزيد من الأطباء...</span>
            </div>
          )}
          
          {/* Load more button (fallback for infinite scroll) */}
          {hasMoreToLoad && !loadingMore && !hasActiveFilters && (
            <div className="flex justify-center py-8">
              <Button 
                onClick={loadMoreDoctors}
                variant="outline"
                className="bg-white border-2 border-brand text-brand hover:bg-brand hover:text-white transition-all duration-200"
              >
                تحميل المزيد من الأطباء
              </Button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gray-50 p-8 rounded-lg max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-1">لا يوجد أطباء متاحين</p>
            <p className="text-gray-500">يرجى تعديل خيارات التصفية</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Doctors;
