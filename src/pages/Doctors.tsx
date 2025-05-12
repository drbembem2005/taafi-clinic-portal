
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DoctorCard from '@/components/shared/DoctorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Doctor, doctors, weekDays, isDoctorAvailableOnDay } from '@/data/doctors';
import { specialties } from '@/data/specialties';
import { motion } from 'framer-motion';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);

  // Function to filter doctors based on search term, specialty and day
  useEffect(() => {
    let results = [...doctors];

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (doctor) => doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty) {
      results = results.filter((doctor) =>
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    // Filter by day
    if (selectedDay) {
      results = results.filter((doctor) => isDoctorAvailableOnDay(doctor, selectedDay));
    }

    setFilteredDoctors(results);
  }, [searchTerm, selectedSpecialty, selectedDay]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty(null);
    setSelectedDay(null);
  };

  // Get unique specialties from doctors for the filter
  const uniqueSpecialties = [...new Set(specialties.map(specialty => specialty.name))];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-light to-brand-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              الأطباء المتخصصون
            </motion.h1>
            <motion.p 
              className="text-xl mb-6 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              تعرف على نخبة الأطباء والاستشاريين في عيادات تعافي التخصصية
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">البحث والتصفية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-gray-700 mb-1">البحث بالاسم</label>
                <Input
                  id="search"
                  type="text"
                  placeholder="اسم الطبيب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="specialty" className="block text-gray-700 mb-1">التخصص</label>
                <Select value={selectedSpecialty || undefined} onValueChange={(value) => setSelectedSpecialty(value || null)}>
                  <SelectTrigger id="specialty" className="w-full">
                    <SelectValue placeholder="جميع التخصصات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-specialties">جميع التخصصات</SelectItem>
                    {uniqueSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="day" className="block text-gray-700 mb-1">اليوم</label>
                <Select value={selectedDay || undefined} onValueChange={(value) => setSelectedDay(value || null)}>
                  <SelectTrigger id="day" className="w-full">
                    <SelectValue placeholder="جميع الأيام" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-days">جميع الأيام</SelectItem>
                    {weekDays.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredDoctors.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-6">
                {filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DoctorCard doctor={doctor} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600 mb-6">
                لم يتم العثور على أطباء مطابقين لمعايير البحث الخاصة بك.
              </p>
              <Button onClick={resetFilters}>عرض جميع الأطباء</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Doctors;
