
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const steps = [
  {
    id: 1,
    title: 'اختر التخصص',
    description: 'اختر التخصص الطبي المناسب لحالتك',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'اختر الطبيب',
    description: 'اختر الطبيب المناسب من قائمة الأطباء المتخصصين',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'حدد الموعد',
    description: 'اختر اليوم والوقت المناسب لموعدك',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'أكمل الحجز',
    description: 'أكمل الحجز عن طريق واتساب أو ملء النموذج',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

const BookingSteps = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">خطوات الحجز السريع</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">احجز موعدك بكل سهولة وبخطوات بسيطة</p>
          <div className="w-24 h-1 bg-brand mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={`rounded-lg p-6 text-center cursor-pointer transition-all ${
                activeStep === step.id
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setActiveStep(step.id)}
              whileHover={{ y: -5 }}
            >
              <div className={`mx-auto flex justify-center items-center w-16 h-16 rounded-full mb-4 ${
                activeStep === step.id ? 'bg-white text-brand' : 'bg-brand text-white'
              }`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className={activeStep === step.id ? 'text-white/90' : 'text-gray-600'}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            size="lg"
            className="bg-brand hover:bg-brand-dark text-white px-8 py-6 text-lg"
            asChild
          >
            <a href="/booking">احجز موعدك الآن</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;
