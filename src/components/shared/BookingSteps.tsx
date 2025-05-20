
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, 
  User, 
  Stethoscope, 
  CheckCircle, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

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

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            خطوات الحجز البسيطة
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            احجز موعدك بكل سهولة في خمس خطوات فقط
          </motion.p>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1.5 bg-gradient-to-r from-brand to-brand-light mx-auto mt-6 rounded-full"
          />
        </div>

        {/* Modern horizontal timeline for desktop */}
        <div className="hidden lg:block mb-16 relative">
          {/* Progress bar */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200">
            <motion.div 
              className="h-full bg-brand rounded-full"
              initial={{ width: 0 }}
              animate={{ width: hoveredStep !== null ? `${(hoveredStep / 4) * 100}%` : "20%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onHoverStart={() => setHoveredStep(index)}
                onHoverEnd={() => setHoveredStep(null)}
              >
                <motion.div 
                  className={`
                    w-12 h-12 rounded-full mx-auto z-10 relative 
                    flex items-center justify-center mb-3 
                    ${hoveredStep === index ? 'bg-brand text-white' : 'bg-white text-gray-600 border-2 border-gray-200'}
                    transition-all duration-300
                  `}
                  whileHover={{ scale: 1.1, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}
                >
                  {step.icon}
                </motion.div>
                
                <h3 className="text-lg font-bold mb-1 text-gray-800">{step.title}</h3>
                <p className="text-sm text-gray-600 max-w-[200px] mx-auto">{step.description}</p>
                
                <motion.div 
                  className={`absolute top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-20 
                  ${hoveredStep === index ? 'bg-brand' : 'bg-white border-2 border-gray-200'}`}
                  animate={hoveredStep === index ? { 
                    scale: [1, 1.2, 1], 
                    transition: { repeat: Infinity, duration: 1.5 } 
                  } : {}}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Card-based steps for tablets and mobile */}
        <div className="lg:hidden space-y-4 mb-12">
          {steps.map((step, index) => (
            <Card 
              key={step.id}
              className="overflow-hidden border-0 shadow-md"
            >
              <CardContent className="p-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="flex items-center"
                >
                  <div className={`
                    w-16 h-16 flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br from-brand to-brand-light text-white
                  `}>
                    {step.icon}
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-xs ml-2">
                        {step.id}
                      </div>
                      <h3 className="font-bold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand to-brand-light hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-brand/20"
              asChild
            >
              <Link to="/booking" className="flex items-center">
                احجز موعدك الآن
                <motion.div
                  className="inline-block mr-2"
                  animate={{ x: isButtonHovered ? -5 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-500 mt-4 text-sm flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 ml-1.5 text-green-500" />
            لا يلزم التسجيل، احجز في أقل من دقيقتين
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSteps;
