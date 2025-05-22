
import { motion } from 'framer-motion';
import BookingWizardContainer from '@/components/booking/BookingWizardContainer';

const Booking = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-light to-white py-6 md:py-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 1 }} // Start visible to avoid flash
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">احجز موعدك الآن</h1>
            <p className="text-base md:text-lg text-gray-700">
              اختر التخصص والطبيب والموعد المناسب لك بكل سهولة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Wizard - disable initial animation to prevent flashing */}
      <section className="py-4 md:py-8 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 1 }} // Start already visible
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <BookingWizardContainer />
          </motion.div>
        </div>
      </section>

      {/* Booking Benefits */}
      <section className="py-6 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-center text-gray-800 mb-4 md:mb-6">مزايا الحجز الإلكتروني</h2>
            
            <div className="grid gap-4 md:gap-6 md:grid-cols-3 text-center">
              <motion.div 
                className="bg-white rounded-lg shadow-md p-4"
                whileHover={{ y: -3 }}
                initial={{ opacity: 1, y: 0 }} // Start already visible
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">توفير الوقت</h3>
                <p className="text-gray-600 text-sm">احجز موعدك في دقائق معدودة دون الحاجة للانتظار</p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg shadow-md p-4"
                whileHover={{ y: -3 }}
                initial={{ opacity: 1, y: 0 }} // Start already visible
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">أمان وخصوصية</h3>
                <p className="text-gray-600 text-sm">بياناتك الشخصية محمية بأعلى معايير الأمان</p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg shadow-md p-4"
                whileHover={{ y: -3 }}
                initial={{ opacity: 1, y: 0 }} // Start already visible
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">دفع مرن</h3>
                <p className="text-gray-600 text-sm">ادفع عند الوصول للعيادة بدون دفع مقدم</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-friendly Additional Info Section */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-center text-gray-800 mb-4">معلومات إضافية عن الحجز</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">تعليمات الحجز</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>يرجى الحضور قبل موعدك بـ 15 دقيقة لإكمال إجراءات التسجيل.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>إحضار جميع التقارير والفحوصات السابقة المتعلقة بحالتك الطبية.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>في حالة تعذر حضورك، يرجى إلغاء الموعد قبل 24 ساعة على الأقل.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>يتم دفع رسوم الكشف عند الحضور للعيادة.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">طرق التواصل</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>هاتف العيادة: 38377766 / 38377788</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>موبايل: 01091003965</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>واتساب: 01119007403</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                    </svg>
                    <span>البريد الإلكتروني: info@taafispecialty.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Booking;
