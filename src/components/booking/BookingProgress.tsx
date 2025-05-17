
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface BookingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const BookingProgress = ({ currentStep, totalSteps = 5 }: BookingProgressProps) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Define step titles
  const stepTitles = [
    'اختيار التخصص',
    'اختيار الطبيب',
    'اختيار الموعد',
    'بيانات الحجز',
    'تأكيد الحجز'
  ];

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-2 bg-gray-100">
        <motion.div 
          className="h-full bg-brand"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="hidden md:flex justify-between px-6 py-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <div 
              key={step}
              className="flex flex-col items-center"
            >
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${currentStep > step 
                    ? 'bg-green-100 text-green-600 border border-green-200' 
                    : currentStep === step
                      ? 'bg-brand text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {currentStep > step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm">{step}</span>
                )}
              </div>
              <span className={`text-xs ${
                currentStep === step ? 'text-brand font-medium' : 'text-gray-500'
              }`}>
                {stepTitles[index]}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile step indicator */}
      <div className="flex justify-between px-4 py-2 md:hidden">
        <div className="text-sm text-gray-600">
          الخطوة {currentStep} من {totalSteps}
        </div>
        <div className="text-sm font-medium text-brand">
          {stepTitles[currentStep - 1]}
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;
