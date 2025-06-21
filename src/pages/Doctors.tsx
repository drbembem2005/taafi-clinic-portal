import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDoctors, getDoctorsBySpecialtyId, Doctor, getDoctorSchedule } from '@/services/doctorService';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import DoctorCard from '@/components/shared/DoctorCard';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Filter, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Doctors = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<Record<number, Record<string, string[]>>>({});
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Fetch doctors based on selected specialty
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      
      try {
        let fetchedDoctors: Doctor[] = [];
        
        if (selectedSpecialty && selectedSpecialty !== "all") {
          // Find specialty ID by name
          const specialty = specialties.find(s => s.name === selectedSpecialty);
          if (specialty) {
            fetchedDoctors = await getDoctorsBySpecialtyId(specialty.id);
            console.log(`Fetched doctors by specialty (${specialty.name}):`, fetchedDoctors);
          }
        } else {
          fetchedDoctors = await getDoctors();
          console.log("Fetched all doctors:", fetchedDoctors);
        }
        
        setDoctors(fetchedDoctors);
        
        // Fetch schedules for all doctors
        const schedules: Record<number, Record<string, string[]>> = {};
        for (const doctor of fetchedDoctors) {
          console.log(`Fetching schedule for doctor: ${doctor.name} (ID: ${doctor.id})`);
          const doctorSchedule = await getDoctorSchedule(doctor.id);
          console.log(`Schedule for doctor ${doctor.name}:`, doctorSchedule);
          schedules[doctor.id] = doctorSchedule;
        }
        setDoctorSchedules(schedules);
        console.log("All doctor schedules:", schedules);
        
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
      fetchDoctors();
    }
  }, [selectedSpecialty, specialties]);

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
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-800">تصفية حسب التخصص</Label>
        <div className="space-y-2">
          <div 
            className={`flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer ${selectedSpecialty === "all" ? 'bg-blue-50' : ''}`}
            onClick={() => handleSpecialtyChange("all")}
          >
            <span className="text-gray-700">جميع التخصصات</span>
            <div className={`w-5 h-5 rounded-full border-2 ${selectedSpecialty === "all" ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
              {selectedSpecialty === "all" && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
          {specialties.map((specialty) => (
            <div 
              key={specialty.id}
              className={`flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer ${selectedSpecialty === specialty.name ? 'bg-blue-50' : ''}`}
              onClick={() => handleSpecialtyChange(specialty.name)}
            >
              <span className="text-gray-700">{specialty.name}</span>
              <div className={`w-5 h-5 rounded-full border-2 ${selectedSpecialty === specialty.name ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                {selectedSpecialty === specialty.name && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-800">تصفية حسب اليوم</Label>
        <div className="space-y-2">
          {daysOfWeek.map((day) => (
            <div 
              key={day.value}
              className={`flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer ${selectedDay === day.value ? 'bg-blue-50' : ''}`}
              onClick={() => handleDayChange(day.value)}
            >
              <span className="text-gray-700">{day.label}</span>
              <div className={`w-5 h-5 rounded-full border-2 ${selectedDay === day.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                {selectedDay === day.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
                <Button variant="outline" className="flex items-center gap-2 bg-white shadow-sm border border-gray-300">
                  <Filter className="w-4 h-4" />
                  تصفية النتائج
                  <Calendar className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] bg-gray-800 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white text-center">تصفية الأطباء</SheetTitle>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto h-full pb-20">
                  <FilterContent />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Button 
                    onClick={() => setIsFilterOpen(false)} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    تطبيق التصفية
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          // Desktop Filter - keeping existing Select components
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-gray-700">تصفية حسب التخصص</Label>
                <select 
                  value={selectedSpecialty} 
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">جميع التخصصات</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="day" className="text-gray-700">تصفية حسب اليوم</Label>
                <select 
                  value={selectedDay} 
                  onChange={(e) => handleDayChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
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
            <p className="text-gray-600">
              عرض {filteredDoctors.length} من {formattedDoctors.length} طبيب
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
