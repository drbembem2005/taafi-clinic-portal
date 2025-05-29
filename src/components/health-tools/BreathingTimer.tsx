
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BreathingTimer = () => {
  const [selectedPattern, setSelectedPattern] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const patterns = {
    'box': {
      name: 'تنفس الصندوق (4-4-4-4)',
      description: 'مثالي للتركيز وتهدئة الأعصاب',
      phases: ['شهيق', 'حبس', 'زفير', 'حبس'],
      durations: [4, 4, 4, 4],
      benefits: ['يقلل التوتر', 'يحسن التركيز', 'ينظم ضربات القلب'],
      color: 'bg-blue-500'
    },
    '478': {
      name: 'تنفس 4-7-8',
      description: 'ممتاز للاسترخاء والنوم',
      phases: ['شهيق', 'حبس', 'زفير'],
      durations: [4, 7, 8],
      benefits: ['يساعد على النوم', 'يقلل القلق', 'يهدئ الجهاز العصبي'],
      color: 'bg-purple-500'
    },
    'coherent': {
      name: 'التنفس المتماسك (5-5)',
      description: 'لتحسين التماسك القلبي',
      phases: ['شهيق', 'زفير'],
      durations: [5, 5],
      benefits: ['يحسن صحة القلب', 'يزيد الوضوح الذهني', 'يقلل ضغط الدم'],
      color: 'bg-green-500'
    },
    'energizing': {
      name: 'تنفس الطاقة (4-4-6-2)',
      description: 'لزيادة الطاقة والحيوية',
      phases: ['شهيق', 'حبس', 'زفير', 'حبس'],
      durations: [4, 4, 6, 2],
      benefits: ['يزيد الطاقة', 'يحسن اليقظة', 'ينشط الجسم'],
      color: 'bg-orange-500'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedPattern) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds > 1) {
            return seconds - 1;
          } else {
            // Move to next phase
            const pattern = patterns[selectedPattern as keyof typeof patterns];
            const nextStep = (currentStep + 1) % pattern.phases.length;
            setCurrentStep(nextStep);
            
            // If we completed a full cycle
            if (nextStep === 0) {
              setCycles(cycles => cycles + 1);
            }
            
            return pattern.durations[nextStep];
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, selectedPattern, currentStep]);

  const startExercise = () => {
    if (selectedPattern) {
      setIsActive(true);
      const pattern = patterns[selectedPattern as keyof typeof patterns];
      setPhase(pattern.phases[0]);
      setSeconds(pattern.durations[0]);
      setCurrentStep(0);
    }
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCycles(0);
    setCurrentStep(0);
    if (selectedPattern) {
      const pattern = patterns[selectedPattern as keyof typeof patterns];
      setPhase(pattern.phases[0]);
      setSeconds(pattern.durations[0]);
    }
  };

  const getCurrentPattern = () => {
    return selectedPattern ? patterns[selectedPattern as keyof typeof patterns] : null;
  };

  const currentPattern = getCurrentPattern();
  const currentPhase = currentPattern ? currentPattern.phases[currentStep] : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">مؤقت تمارين التنفس العميق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نمط التنفس" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(patterns).map(([key, pattern]) => (
                  <SelectItem key={key} value={key}>
                    {pattern.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentPattern && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">{currentPattern.name}</h4>
                <p className="text-gray-700 mb-3">{currentPattern.description}</p>
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800">الفوائد:</h5>
                  <ul className="text-sm text-gray-600">
                    {currentPattern.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 ml-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {selectedPattern && (
            <div className="text-center space-y-6">
              {/* Breathing Visualizer */}
              <div className="flex justify-center items-center">
                <div 
                  className={`w-32 h-32 rounded-full ${currentPattern?.color} transition-all duration-1000 flex items-center justify-center text-white font-bold ${
                    isActive ? 'animate-pulse' : ''
                  }`}
                  style={{
                    transform: isActive && (currentPhase === 'شهيق') ? 'scale(1.2)' : 'scale(1)'
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl">{seconds}</div>
                    <div className="text-sm">{currentPhase}</div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-lg font-medium text-gray-800">
                {currentPhase === 'شهيق' && '🌬️ استنشق الهواء ببطء من الأنف'}
                {currentPhase === 'زفير' && '🌊 أخرج الهواء ببطء من الفم'}
                {currentPhase === 'حبس' && '⏸️ احبس أنفاسك بهدوء'}
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4 space-x-reverse">
                <Button
                  onClick={isActive ? pauseExercise : startExercise}
                  className="bg-brand hover:bg-brand-dark"
                  size="lg"
                >
                  {isActive ? <Pause className="w-5 h-5 ml-2" /> : <Play className="w-5 h-5 ml-2" />}
                  {isActive ? 'إيقاف مؤقت' : 'ابدأ'}
                </Button>
                <Button
                  onClick={resetExercise}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 ml-2" />
                  إعادة تعيين
                </Button>
              </div>

              {/* Stats */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{cycles}</div>
                  <div className="text-sm text-gray-600">دورات مكتملة</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">نصائح للحصول على أفضل النتائج</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-500 ml-2">💡</span>
              اجلس في مكان هادئ ومريح
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 ml-2">💡</span>
              ضع يدك على بطنك لتشعر بالتنفس العميق
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 ml-2">💡</span>
              ابدأ بـ 5-10 دورات ثم زد تدريجياً
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 ml-2">💡</span>
              مارس التمرين يومياً لأفضل النتائج
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 ml-2">💡</span>
              توقف إذا شعرت بدوار أو عدم راحة
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingTimer;
