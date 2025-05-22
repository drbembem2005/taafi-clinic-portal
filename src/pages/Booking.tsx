
import BookingWizardContainer from '@/components/booking/BookingWizardContainer';
import { useEffect } from 'react';

const Booking = () => {
  // Force a clean reload of the booking data when this page is visited
  useEffect(() => {
    // Clear any cached data from local storage
    localStorage.removeItem('booking_selected_doctor');
    localStorage.removeItem('booking_selected_day');
    localStorage.removeItem('booking_selected_time');
  }, []);
  
  return (
    <>
      {/* Hero Section - More compact for mobile */}
      <section className="bg-gradient-to-b from-brand/10 to-white py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">احجز موعدك الآن</h1>
            <p className="text-sm md:text-base text-gray-700">
              اختر التخصص والطبيب والموعد المناسب لك بكل سهولة
            </p>
          </div>
        </div>
      </section>

      {/* Booking Wizard - Main content */}
      <section className="py-2">
        <div className="container mx-auto px-2 sm:px-4">
          <BookingWizardContainer />
        </div>
      </section>

      {/* Booking Benefits - Simplified */}
      <section className="py-4 md:py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-center text-gray-800 mb-4">مزايا الحجز الإلكتروني</h2>
            
            <div className="grid gap-3 grid-cols-3 text-center">
              <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-gray-800">توفير الوقت</h3>
                <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">احجز في دقائق</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-gray-800">أمان وخصوصية</h3>
                <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">بياناتك محمية</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-gray-800">دفع مرن</h3>
                <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">ادفع عند الوصول</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Info Section */}
      <section className="py-3 md:py-4">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-100">
                <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1">تعليمات الحجز</h3>
                <ul className="space-y-1 text-gray-700 text-[10px] sm:text-xs">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-brand ml-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>حضور قبل موعدك بـ 15 دقيقة</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-brand ml-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>إحضار التقارير السابقة</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border border-gray-100">
                <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1">طرق التواصل</h3>
                <ul className="space-y-1 text-gray-700 text-[10px] sm:text-xs">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-brand ml-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>38377766 / 38377788</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-brand ml-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>واتساب: 01119007403</span>
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
