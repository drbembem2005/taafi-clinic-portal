
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  User, 
  Stethoscope, 
  CheckCircle,
  ChevronRight
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'اختر التخصص',
    description: 'اختر التخصص الطبي المناسب لحالتك',
    icon: <Stethoscope className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'اختر الطبيب',
    description: 'اختر الطبيب المناسب من قائمة الأطباء المتخصصين',
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'حدد الموعد',
    description: 'اختر اليوم والوقت المناسب لموعدك',
    icon: <CalendarDays className="w-6 h-6" />,
  },
  {
    id: 4,
    title: 'أكمل الحجز',
    description: 'أكمل الحجز عن طريق واتساب أو ملء النموذج',
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

const BookingSteps = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">خطوات الحجز السريع</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">احجز موعدك بكل سهولة وبخطوات بسيطة</p>
          <div className="w-24 h-1 bg-brand mx-auto mt-4"></div>
        </div>

        {/* Timeline Steps for Medium and Large Screens */}
        <div className="hidden md:block mb-12">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            {/* Steps */}
            <div className="flex justify-between relative z-10">
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                      activeStep === step.id 
                        ? 'bg-brand text-white scale-110' 
                        : activeStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-500 border-2 border-gray-200'
                    }`}
                  >
                    {activeStep > step.id ? <CheckCircle className="w-8 h-8" /> : step.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${activeStep === step.id ? 'text-brand' : 'text-gray-800'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-[180px] text-center">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Steps for Mobile */}
        <div className="md:hidden mb-8">
          {steps.map((step) => (
            <motion.div 
              key={step.id}
              className={`flex items-start mb-6 last:mb-0 ${
                activeStep === step.id 
                  ? 'opacity-100' 
                  : 'opacity-70'
              }`}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveStep(step.id)}
            >
              <div 
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  activeStep === step.id 
                    ? 'bg-brand text-white'
                    : activeStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-500'
                }`}
              >
                {activeStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.icon}
              </div>
              <div>
                <h3 className={`text-lg font-bold mb-1 ${
                  activeStep === step.id ? 'text-brand' : 'text-gray-800'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            size="lg"
            className="bg-brand hover:bg-brand-dark text-white px-8 py-6 text-lg rounded-xl group"
            asChild
          >
            <a href="/booking">
              احجز موعدك الآن
              <ChevronRight className="mr-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-[-4px]" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;
