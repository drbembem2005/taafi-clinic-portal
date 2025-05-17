
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, 
  User, 
  Stethoscope, 
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">خطوات الحجز السريع</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">احجز موعدك بكل سهولة وبخطوات بسيطة</p>
          <div className="w-24 h-1 bg-brand mx-auto mt-4"></div>
        </div>

        {/* Modern Card-based Steps for Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all shadow-md hover:shadow-lg ${
                activeStep === index ? 'ring-2 ring-brand' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 } 
              }}
              onClick={() => setActiveStep(index)}
              onHoverStart={() => setHoveredStep(index)}
              onHoverEnd={() => setHoveredStep(null)}
            >
              <div className={`
                h-full flex flex-col items-center text-center p-6 bg-gradient-to-br
                ${index === 0 ? 'from-blue-50 to-blue-100' : ''}
                ${index === 1 ? 'from-green-50 to-green-100' : ''}
                ${index === 2 ? 'from-purple-50 to-purple-100' : ''}
                ${index === 3 ? 'from-amber-50 to-amber-100' : ''}
              `}>
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4 
                  ${activeStep >= index ? 'bg-brand text-white' : 'bg-white text-gray-500'}
                  shadow-md transition-all duration-300
                `}>
                  {activeStep > index ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : step.icon}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${activeStep === index ? 'text-brand' : 'text-gray-800'}`}>
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
                
                {/* Step Number Indicator */}
                <div className={`
                  absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${activeStep >= index ? 'bg-brand text-white' : 'bg-white text-gray-500 border border-gray-200'}
                `}>
                  {step.id}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Accordion Steps */}
        <div className="md:hidden space-y-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`rounded-lg overflow-hidden border ${
                activeStep === index ? 'border-brand' : 'border-gray-200'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: index * 0.1 } }}
            >
              <div 
                className={`flex items-center p-4 ${
                  activeStep === index ? 'bg-brand/5' : 'bg-white'
                } cursor-pointer`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0
                  ${activeStep >= index ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}
                  shadow-sm
                `}>
                  {activeStep > index ? <CheckCircle className="w-5 h-5" /> : <span>{step.id}</span>}
                </div>
                
                <div className="flex-grow">
                  <h3 className={`font-bold ${activeStep === index ? 'text-brand' : 'text-gray-800'}`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
              
              <AnimatePresence>
                {activeStep === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mr-4">
                          {step.icon}
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">
                            {index === 0 && 'اختر من بين مجموعة متنوعة من التخصصات الطبية المتاحة لدينا.'}
                            {index === 1 && 'اختر طبيبك المفضل من قائمة الأطباء المتخصصين ذوي الخبرة.'}
                            {index === 2 && 'اختر موعدًا يناسب جدولك من الأوقات المتاحة.'}
                            {index === 3 && 'أكمل الحجز بسهولة عبر الإنترنت أو عن طريق واتساب.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            className="bg-brand hover:bg-brand-dark text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-brand/20 transition-all hover:shadow-brand/30 hover:-translate-y-1 group"
            asChild
          >
            <Link to="/booking">
              احجز موعدك الآن
              <motion.span
                className="inline-block mr-2"
                initial={{ x: 0 }}
                animate={{ x: hoveredStep !== null ? -3 : 0 }}
              >
                ←
              </motion.span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;
