
import { useEffect, useState } from 'react';
import HeroCarousel from '@/components/shared/HeroCarousel';
import SpecialtyCard from '@/components/shared/SpecialtyCard';
import DoctorCard from '@/components/shared/DoctorCard';
import ClinicFeatures from '@/components/shared/ClinicFeatures';
import HealthToolsSection from '@/components/shared/HealthToolsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Users, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getSpecialties } from '@/services/specialtyService';
import { getDoctors } from '@/services/doctorService';

const Index = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [specialtiesData, doctorsData] = await Promise.all([
        getSpecialties(),
        getDoctors()
      ]);
      setSpecialties(specialtiesData.slice(0, 6));
      setDoctors(doctorsData.slice(0, 6));
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">مريض راض</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">تخصص طبي</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25+</h3>
              <p className="text-gray-600">طبيب متخصص</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5+</h3>
              <p className="text-gray-600">سنوات خبرة</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Health Tools Section */}
      <HealthToolsSection />

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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </div>
          
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
