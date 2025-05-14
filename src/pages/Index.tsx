import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '@/components/shared/HeroCarousel';
import ClinicFeatures from '@/components/shared/ClinicFeatures';
import BookingSteps from '@/components/shared/BookingSteps';
import SpecialtyCard from '@/components/shared/SpecialtyCard';
import DoctorCard from '@/components/shared/DoctorCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { getDoctors, Doctor, getDoctorSchedule } from '@/services/doctorService';

const Index = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<Record<number, Record<string, string[]>>>({});
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch specialties
        const fetchedSpecialties = await getSpecialties();
        setSpecialties(fetchedSpecialties.slice(0, 6)); // Show only first 6 specialties
        
        // Fetch doctors
        const fetchedDoctors = await getDoctors();
        // Get only 3 doctors for the featured section
        const featuredDoctors = fetchedDoctors.slice(0, 3);
        setDoctors(featuredDoctors);
        console.log("Index page - Fetched doctors:", fetchedDoctors);
        
        // Fetch schedules for featured doctors
        const schedules: Record<number, Record<string, string[]>> = {};
        for (const doctor of featuredDoctors) {
          const doctorSchedule = await getDoctorSchedule(doctor.id);
          schedules[doctor.id] = doctorSchedule;
        }
        setDoctorSchedules(schedules);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform doctors data to match DoctorWithSpecialty type
  const formattedDoctors = doctors.map((doctor) => ({
    ...doctor,
    specialty: specialties.find(s => s.id === doctor.specialty_id)?.name || 'تخصص غير محدد',
    schedule: doctorSchedules[doctor.id] || {}
  }));

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <ClinicFeatures />

      {/* Booking Steps */}
      <BookingSteps />

      {/* Specialties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">تخصصاتنا الطبية</h2>
            <p className="text-gray-600 mb-4">نقدم مجموعة واسعة من التخصصات الطبية تحت سقف واحد</p>
            <div className="w-24 h-1 bg-brand mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {specialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              className="bg-brand hover:bg-brand-dark text-white px-6 py-3"
              onClick={() => navigate('/specialties')}
            >
              عرض جميع التخصصات
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">نخبة من الأطباء</h2>
            <p className="text-gray-600 mb-4">فريقنا الطبي المتميز من الاستشاريين والأخصائيين</p>
            <div className="w-24 h-1 bg-brand mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <p className="text-center col-span-3">جاري تحميل بيانات الأطباء...</p>
            ) : formattedDoctors.length > 0 ? (
              formattedDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} compact />
              ))
            ) : (
              <p className="text-center col-span-3">لا يوجد أطباء متاحين حالياً</p>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              className="bg-brand hover:bg-brand-dark text-white px-6 py-3"
              onClick={() => navigate('/doctors')}
            >
              عرض جميع الأطباء
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-brand text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/93b2823f-8ba0-45e0-83bd-fd27bb5535d9.png" 
                alt="عيادات تعافي التخصصية" 
                className="h-24 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">نحن هنا لتقديم أفضل رعاية طبية لك ولعائلتك</h2>
            <p className="text-xl mb-8 text-white/90">
              احجز موعدك الآن واختر الرعاية المثلى مع نخبة من الأطباء المتخصصين
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-brand hover:bg-gray-100 text-lg px-6 py-6"
                asChild
              >
                <a href="/booking">احجز موعداً</a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 text-lg px-6 py-6"
                asChild
              >
                <a href="/contact">تواصل معنا</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
