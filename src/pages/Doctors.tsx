
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDoctors, getDoctorsBySpecialty, Doctor, getDoctorSchedule } from '@/services/doctorService';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import DoctorCard from '@/components/shared/DoctorCard';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

const Doctors = () => {
  const location = useLocation();
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
            fetchedDoctors = await getDoctorsBySpecialty(specialty.id);
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
      <h1 className="text-3xl font-bold text-center mb-10">الأطباء</h1>
      
      <div className="mb-8 max-w-md mx-auto">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="specialty">تصفية حسب التخصص</Label>
          <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
            <SelectTrigger>
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
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : formattedDoctors.length > 0 ? (
        <div className="space-y-6">
          {formattedDoctors.map((doctor) => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">لا يوجد أطباء متاحين حالياً للتخصص المحدد</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
