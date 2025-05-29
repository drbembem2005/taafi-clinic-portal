

import { useEffect, useState } from 'react';
import HeroCarousel from '@/components/shared/HeroCarousel';
import SpecialtyCard from '@/components/shared/SpecialtyCard';
import DoctorCard from '@/components/shared/DoctorCard';
import ClinicFeatures from '@/components/shared/ClinicFeatures';
import HealthToolsSection from '@/components/shared/HealthToolsSection';
import BookingSteps from '@/components/shared/BookingSteps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getSpecialties } from '@/services/specialtyService';
import { getDoctors, getDoctorSchedule } from '@/services/doctorService';

const Index = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [specialtiesData, doctorsData] = await Promise.all([
          getSpecialties(6, true), // Get 6 random specialties
          getDoctors(6, true) // Get 6 random doctors
        ]);
        
        console.log('Specialties data:', specialtiesData);
        console.log('Doctors data:', doctorsData);
        
        // Create a specialty lookup map for quick access
        const specialtyMap = specialtiesData.reduce((map, specialty) => {
          map[specialty.id] = specialty.name;
          return map;
        }, {});
        
        console.log('Specialty map:', specialtyMap);
        
        // Fetch schedule data for each doctor and format properly
        const doctorsWithSpecialtyAndSchedule = await Promise.all(
          doctorsData.map(async (doctor) => {
            const schedule = await getDoctorSchedule(doctor.id);
            const specialtyName = specialtyMap[doctor.specialty_id];
            
            console.log(`Doctor ${doctor.name} (ID: ${doctor.id}):`, {
              specialty_id: doctor.specialty_id,
              specialtyName: specialtyName,
              foundInMap: !!specialtyName
            });
            
            return {
              ...doctor,
              specialty: specialtyName || 'غير محدد',
              schedule: schedule || {}
            };
          })
        );
        
        console.log('Final doctors with specialty and schedule:', doctorsWithSpecialtyAndSchedule);
        
        setSpecialties(specialtiesData);
        setDoctors(doctorsWithSpecialtyAndSchedule);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Enhanced Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-brand/5 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">أرقامنا تتحدث</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نفخر بتقديم خدمات طبية شاملة عبر تخصصات متنوعة بأيدي أفضل الأطباء المتخصصين
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-brand to-brand-light mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">15+</h3>
                  <p className="text-xl font-medium text-gray-700 mb-2">تخصص طبي</p>
                  <p className="text-gray-600">شامل لجميع احتياجاتك الصحية</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">25+</h3>
                  <p className="text-xl font-medium text-gray-700 mb-2">طبيب متخصص</p>
                  <p className="text-gray-600">من أفضل الأطباء في مصر</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Steps Section */}
      <BookingSteps />

      {/* Medical Specialties Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">التخصصات الطبية</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              نقدم خدمات طبية شاملة في مختلف التخصصات على يد فريق من أمهر الأطباء المتخصصين
            </p>
            <div className="w-24 h-1 bg-brand mx-auto mt-6 rounded-full"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {specialties.map((specialty, index) => (
              <motion.div
                key={specialty.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SpecialtyCard specialty={specialty} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/specialties">
              <Button 
                size="lg" 
                className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>عرض جميع التخصصات</span>
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Doctors Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">أطبائنا المتميزون</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              نضم نخبة من أفضل الأطباء المتخصصين الذين يتمتعون بخبرة واسعة وكفاءة عالية في تقديم أفضل الخدمات الطبية
            </p>
            <div className="w-24 h-1 bg-brand mx-auto mt-6 rounded-full"></div>
          </motion.div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <DoctorCard doctor={doctor} compact={true} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link to="/doctors">
              <Button 
                size="lg" 
                className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>عرض جميع الأطباء</span>
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Clinic Features */}
      <ClinicFeatures />

      {/* Health Tools Section - Moved to Bottom */}
      <HealthToolsSection />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              احجز موعدك الآن واحصل على أفضل رعاية طبية
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              نحن هنا لخدمتك على مدار الساعة. احجز موعدك الآن واستمتع بخدمة طبية متميزة
            </p>
            <Link to="/booking">
              <Button 
                size="lg" 
                className="bg-brand hover:bg-brand-dark text-white px-10 py-4 rounded-xl font-medium text-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                احجز موعدك الآن
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;

