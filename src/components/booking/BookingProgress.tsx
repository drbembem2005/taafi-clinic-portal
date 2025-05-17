
import { 
  CalendarDays, 
  User, 
  Stethoscope, 
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: 'اختيار الطبيب',
    icon: <Stethoscope className="w-5 h-5 md:w-6 md:h-6" />,
  },
  {
    id: 2,
    title: 'حجز الموعد',
    icon: <CalendarDays className="w-5 h-5 md:w-6 md:h-6" />,
  },
  {
    id: 3,
    title: 'البيانات الشخصية',
    icon: <User className="w-5 h-5 md:w-6 md:h-6" />,
  },
  {
    id: 4,
    title: 'تأكيد الحجز',
    icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />,
  },
];

const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  // Get progress percentage based on current step
  const progressPercentage = ((currentStep - 1) / 3) * 100;

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Progress bar */}
      <div className="h-2 bg-gray-100 overflow-hidden">
        <motion.div 
          className="h-full bg-brand"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between px-4 md:px-10 py-3">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center"
          >
            <div className={`relative ${currentStep === step.id ? 'z-10' : ''}`}>
              <motion.div
                className={`flex items-center justify-center rounded-full transition-all ${
                  currentStep > step.id
                    ? 'bg-green-100 text-green-600 border-2 border-green-500'
                    : currentStep === step.id
                      ? 'bg-brand text-white shadow-lg shadow-brand/25'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                } w-10 h-10 md:w-12 md:h-12`}
                animate={{
                  scale: currentStep === step.id ? 1.1 : 1,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon || <span className="text-lg font-bold">{step.id}</span>
                )}
              </motion.div>
              {/* Connection line */}
              {step.id < 4 && (
                <div className={`absolute top-1/2 left-10 md:left-12 w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] h-0.5 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`} style={{ transform: 'translateY(-50%)' }} />
              )}
            </div>
            <span className={`text-xs md:text-sm mt-2 font-medium text-center hidden md:block ${
              currentStep === step.id ? 'text-brand' : currentStep > step.id ? 'text-green-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            <span className={`text-[10px] md:hidden mt-1 ${
              currentStep === step.id ? 'text-brand' : currentStep > step.id ? 'text-green-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;
