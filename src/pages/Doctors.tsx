
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoctors, getDoctorsBySpecialtyId, Doctor, getDoctorSchedule } from '@/services/doctorService';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import DoctorCard from '@/components/shared/DoctorCard';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Doctors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<Record<number, Record<string, string[]>>>({});
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [loading, setLoading] = useState(true);

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
    setSelectedSpecialty(value);
  };

  const handleBookingClick = () => {
    navigate('/booking');
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

        <Button 
          onClick={handleBookingClick}
          className="mt-4 bg-brand hover:bg-brand-dark text-white"
        >
          احجز موعدك الآن
        </Button>
      </motion.div>
      
      <motion.div 
        className="mb-8 max-w-md mx-auto bg-white rounded-lg shadow-sm p-4 border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col space-y-2">
          <Label htmlFor="specialty" className="text-gray-700">تصفية حسب التخصص</Label>
          <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="جميع التخصصات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التخصصات</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>
      
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : formattedDoctors.length > 0 ? (
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
          {formattedDoctors.map((doctor, index) => (
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
            <p className="text-xl text-gray-600 mb-1">لا يوجد أطباء متاحين حالياً</p>
            <p className="text-gray-500">يرجى تحديد تخصص آخر</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Doctors;
