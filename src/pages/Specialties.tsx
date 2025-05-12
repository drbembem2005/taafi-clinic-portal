
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SpecialtyCard from '@/components/shared/SpecialtyCard';
import { Button } from '@/components/ui/button';
import { specialties } from '@/data/specialties';
import { motion } from 'framer-motion';

const Specialties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter specialties based on search term
  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-brand text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              التخصصات الطبية
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              نقدم 14 تخصصاً طبياً متكاملاً بأيدي نخبة من الأطباء المتخصصين
            </motion.p>
            
            {/* Search Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <input
                type="text"
                placeholder="ابحث عن تخصص..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-10 pr-10 rounded-lg border-none focus:ring-2 focus:ring-blue-300 text-gray-800 bg-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredSpecialties.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredSpecialties.map((specialty) => (
                <motion.div key={specialty.id} variants={item}>
                  <SpecialtyCard specialty={specialty} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600 mb-6">لم يتم العثور على تخصصات تطابق بحثك.</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
              >
                عرض جميع التخصصات
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              هل تريد حجز موعد مع أحد الأطباء المتخصصين؟
            </h2>
            <p className="text-gray-600 mb-8">
              يمكنك التواصل معنا مباشرة أو حجز موعد عبر الموقع بكل سهولة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-brand hover:bg-brand-dark text-white">
                <a href="/booking">احجز موعداً</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/doctors">عرض الأطباء</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Specialties;
