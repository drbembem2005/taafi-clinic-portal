
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getDoctors, getDoctorsBySpecialty, Doctor } from '@/services/doctorService';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import DoctorCard from '@/components/shared/DoctorCard';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Doctors = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
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
      const fetchedSpecialties = await getSpecialties();
      setSpecialties(fetchedSpecialties);
    };

    fetchSpecialties();
  }, []);

  // Fetch doctors based on selected specialty
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      
      let fetchedDoctors: Doctor[] = [];
      
      if (selectedSpecialty) {
        // Find specialty ID by name
        const specialty = specialties.find(s => s.name === selectedSpecialty);
        if (specialty) {
          fetchedDoctors = await getDoctorsBySpecialty(specialty.id);
        }
      } else {
        fetchedDoctors = await getDoctors();
      }
      
      setDoctors(fetchedDoctors);
      setLoading(false);
    };

    if (specialties.length > 0) {
      fetchDoctors();
    }
  }, [selectedSpecialty, specialties]);

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
  };

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
              <SelectItem value="">جميع التخصصات</SelectItem>
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
      ) : doctors.length > 0 ? (
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <DoctorCard 
              key={doctor.id} 
              doctor={{
                ...doctor,
                specialty: specialties.find(s => s.id === doctor.specialty_id)?.name || ''
              }} 
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
