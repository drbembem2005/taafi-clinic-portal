
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, 
  User, 
  Stethoscope, 
  CheckCircle, 
  FileText 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'اختر التخصص',
    description: 'اختر التخصص الطبي المناسب لحالتك',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'blue'
  },
  {
    id: 2,
    title: 'اختر الطبيب',
    description: 'اختر الطبيب المناسب من قائمة الأطباء المتخصصين',
    icon: <User className="w-6 h-6" />,
    color: 'green'
  },
  {
    id: 3,
    title: 'حدد الموعد',
    description: 'اختر اليوم والوقت المناسب لموعدك',
    icon: <CalendarDays className="w-6 h-6" />,
    color: 'purple'
  },
  {
    id: 4,
    title: 'أدخل بياناتك',
    description: 'أدخل بياناتك الشخصية لإتمام الحجز',
    icon: <FileText className="w-6 h-6" />,
    color: 'pink'
  },
  {
    id: 5,
    title: 'أكمل الحجز',
    description: 'أكد حجزك عبر الموقع أو واتساب',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'amber'
  },
];

const BookingSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Colors for step cards
  const getStepCardStyles = (index: number) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100 hover:shadow-blue-100',
      green: 'from-green-50 to-green-100 hover:shadow-green-100',
      purple: 'from-purple-50 to-purple-100 hover:shadow-purple-100',
      pink: 'from-pink-50 to-pink-100 hover:shadow-pink-100',
      amber: 'from-amber-50 to-amber-100 hover:shadow-amber-100'
    };

    const currentColor = steps[index]?.color as keyof typeof colors || 'blue';
    return colors[currentColor];
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">خطوات الحجز البسيطة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">احجز موعدك بكل سهولة في خمس خطوات فقط</p>
          <div className="w-24 h-1 bg-brand mx-auto mt-4"></div>
        </div>

        {/* Modern Card-based Steps for Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mb-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`relative flex-grow max-w-[230px] rounded-xl overflow-hidden cursor-pointer transition-all shadow-md hover:shadow-lg ${
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
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 } 
              }}
              onClick={() => setActiveStep(index)}
              onHoverStart={() => setHoveredStep(index)}
              onHoverEnd={() => setHoveredStep(null)}
            >
              <div className={`
                h-full flex flex-col items-center text-center p-4 bg-gradient-to-br
                ${getStepCardStyles(index)}
              `}>
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center mb-3 
                  ${activeStep >= index ? 'bg-brand text-white' : 'bg-white text-gray-500'}
                  shadow-md transition-all duration-300
                `}>
                  {activeStep > index ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : step.icon}
                </div>
                
                <h3 className={`text-lg font-bold mb-1 ${activeStep === index ? 'text-brand' : 'text-gray-800'}`}>
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-xs">
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

        {/* Mobile Timeline Steps - Modernized */}
        <div className="md:hidden space-y-3 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`rounded-lg overflow-hidden border ${
                activeStep === index ? 'border-brand shadow-md' : 'border-gray-200'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: index * 0.1 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className={`flex items-center p-3 ${
                  activeStep === index ? 'bg-brand/5' : 'bg-white'
                } cursor-pointer`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                  ${activeStep >= index ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}
                  shadow-sm
                `}>
                  {activeStep > index ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                
                <div className="flex-grow">
                  <h3 className={`font-bold text-sm ${activeStep === index ? 'text-brand' : 'text-gray-800'}`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600">
                    {step.description}
                  </p>
                </div>

                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mx-2
                  ${activeStep >= index ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}
                `}>
                  {step.id}
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
                    <div className={`p-3 bg-${step.color}-50 border-t border-${step.color}-100`}>
                      <div className="flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-3">
                          {step.icon}
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          {index === 0 && 'اختر من بين مجموعة متنوعة من التخصصات الطبية المتاحة لدينا.'}
                          {index === 1 && 'اختر طبيبك المفضل من قائمة الأطباء المتخصصين ذوي الخبرة.'}
                          {index === 2 && 'اختر موعدًا يناسب جدولك من الأوقات المتاحة.'}
                          {index === 3 && 'أدخل بياناتك الشخصية لإتمام حجزك.'}
                          {index === 4 && 'أكد حجزك إما عبر الموقع أو من خلال واتساب.'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Improved call to action */}
        <div className="text-center mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand to-brand-light hover:opacity-95 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-brand/20 transition-all hover:shadow-brand/30"
              asChild
            >
              <Link to="/booking">
                احجز موعدك الآن
                <motion.span
                  className="inline-block mr-2"
                  animate={{ x: isButtonHovered ? -5 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ←
                </motion.span>
              </Link>
            </Button>
          </motion.div>
          <p className="text-gray-500 mt-3 text-sm">لا يلزم التسجيل، احجز في أقل من دقيقتين</p>
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;
