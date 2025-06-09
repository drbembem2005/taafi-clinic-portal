
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { audioService } from '@/services/audioService';

const ProgressiveMuscleRelaxation = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<'tension' | 'release' | 'rest'>('tension');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const muscleGroups = [
    {
      name: 'عضلات الوجه والجبهة',
      tensionInstruction: 'اقبض عضلات وجهك وجبهتك بقوة',
      releaseInstruction: 'أرخِ عضلات وجهك واتركها تسترخي تماماً',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    },
    {
      name: 'عضلات الرقبة والكتفين',
      tensionInstruction: 'ارفع كتفيك نحو أذنيك واقبض عضلات رقبتك',
      releaseInstruction: 'دع كتفيك يسقطان واسترخي عضلات رقبتك',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    },
    {
      name: 'عضلات الذراعين واليدين',
      tensionInstruction: 'اقبض قبضتيك بقوة ومد ذراعيك',
      releaseInstruction: 'أرخِ ذراعيك ويديك واتركهما يسترخيان',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    },
    {
      name: 'عضلات الصدر والبطن',
      tensionInstruction: 'اقبض عضلات صدرك وبطنك بقوة',
      releaseInstruction: 'دع عضلات صدرك وبطنك تسترخي تماماً',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    },
    {
      name: 'عضلات الظهر',
      tensionInstruction: 'اقبض عضلات ظهرك واقوس ظهرك قليلاً',
      releaseInstruction: 'أرخِ ظهرك واتركه يسترخي على الأرض',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    },
    {
      name: 'عضلات الفخذين والحوض',
      tensionInstruction: 'اقبض عضلات فخذيك وحوضك بقوة',
      releaseInstruction: 'أرخِ عضلات فخذيك وحوضك تماماً',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    },
    {
      name: 'عضلات الساقين والقدمين',
      tensionInstruction: 'اقبض عضلات ساقيك ومد أصابع قدميك',
      releaseInstruction: 'أرخِ ساقيك وقدميك واتركهما يسترخيان',
      tensionDuration: 5,
      releaseDuration: 10,
      restDuration: 5
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentStep < muscleGroups.length) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds > 1) {
            return seconds - 1;
          } else {
            // Move to next phase
            const currentGroup = muscleGroups[currentStep];
            
            if (phase === 'tension') {
              setPhase('release');
              if (isSoundEnabled) {
                audioService.speakText(currentGroup.releaseInstruction);
                audioService.playTone(400, 0.3);
              }
              return currentGroup.releaseDuration;
            } else if (phase === 'release') {
              setPhase('rest');
              if (isSoundEnabled) {
                audioService.speakText('استرح الآن واشعر بالفرق');
              }
              return currentGroup.restDuration;
            } else {
              // Move to next muscle group
              const nextStep = currentStep + 1;
              if (nextStep < muscleGroups.length) {
                setCurrentStep(nextStep);
                setPhase('tension');
                if (isSoundEnabled) {
                  audioService.speakText(`الآن ${muscleGroups[nextStep].name}. ${muscleGroups[nextStep].tensionInstruction}`);
                  audioService.playTone(600, 0.3);
                }
                return muscleGroups[nextStep].tensionDuration;
              } else {
                // Session completed
                setIsActive(false);
                if (isSoundEnabled) {
                  audioService.speakText('ممتاز! لقد أنهيت جلسة الاسترخاء التدريجي. جسدك الآن في حالة استرخاء عميق');
                  audioService.playTone(800, 1);
                }
                return 0;
              }
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentStep, phase, isSoundEnabled]);

  const startSession = async () => {
    await audioService.initialize();
    setIsActive(true);
    setCurrentStep(0);
    setPhase('tension');
    setSeconds(muscleGroups[0].tensionDuration);
    
    if (isSoundEnabled) {
      audioService.speakText('مرحباً بك في جلسة الاسترخاء التدريجي للعضلات. استلق براحة واتبع التعليمات');
      setTimeout(() => {
        audioService.speakText(`ابدأ بـ ${muscleGroups[0].name}. ${muscleGroups[0].tensionInstruction}`);
      }, 4000);
    }
  };

  const pauseSession = () => {
    setIsActive(false);
    audioService.stopSpeaking();
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentStep(0);
    setPhase('tension');
    setSeconds(muscleGroups[0].tensionDuration);
    audioService.stopSpeaking();
  };

  const getPhaseInstruction = () => {
    if (currentStep >= muscleGroups.length) return 'انتهت الجلسة';
    
    const currentGroup = muscleGroups[currentStep];
    switch (phase) {
      case 'tension':
        return currentGroup.tensionInstruction;
      case 'release':
        return currentGroup.releaseInstruction;
      case 'rest':
        return 'استرح واشعر بالاسترخاء';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'tension':
        return 'bg-red-500';
      case 'release':
        return 'bg-blue-500';
      case 'rest':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'tension':
        return 'شد العضلات';
      case 'release':
        return 'ترك الشد';
      case 'rest':
        return 'استراحة';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">الاسترخاء التدريجي للعضلات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Introduction */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">كيف يعمل الاسترخاء التدريجي؟</h4>
            <p className="text-blue-800 leading-relaxed">
              هذه التقنية تعتمد على شد مجموعات العضلات لفترة قصيرة ثم إرخائها تماماً. 
              هذا يساعد على تعلم الفرق بين التوتر والاسترخاء، مما يؤدي إلى استرخاء عميق.
            </p>
          </div>

          {/* Current Status */}
          <div className="text-center space-y-6">
            <div className="p-6 rounded-xl border-2 border-dashed border-gray-300">
              <div 
                className={`w-32 h-32 rounded-full ${getPhaseColor()} mx-auto mb-4 flex items-center justify-center text-white font-bold ${
                  isActive ? 'animate-pulse' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl">{seconds}</div>
                  <div className="text-xs">{getPhaseText()}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentStep < muscleGroups.length ? muscleGroups[currentStep].name : 'جلسة مكتملة'}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-lg">
                {getPhaseInstruction()}
              </p>
              
              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>المجموعة {Math.min(currentStep + 1, muscleGroups.length)} من {muscleGroups.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ 
                      width: `${((currentStep + 1) / muscleGroups.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center space-x-4 space-x-reverse">
              <Button
                onClick={isActive ? pauseSession : startSession}
                className="bg-brand hover:bg-brand-dark"
                size="lg"
              >
                {isActive ? <Pause className="w-5 h-5 ml-2" /> : <Play className="w-5 h-5 ml-2" />}
                {isActive ? 'إيقاف مؤقت' : 'ابدأ الجلسة'}
              </Button>
              
              <Button
                onClick={resetSession}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                إعادة تعيين
              </Button>
              
              <Button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                variant="outline"
                size="lg"
              >
                {isSoundEnabled ? 
                  <Volume2 className="w-5 h-5 ml-2" /> : 
                  <VolumeX className="w-5 h-5 ml-2" />
                }
                {isSoundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg text-purple-900">فوائد الاسترخاء التدريجي</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🧘</span>
              يقلل التوتر والقلق بشكل فعال
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🧘</span>
              يحسن جودة النوم ويساعد على الاسترخاء
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🧘</span>
              يخفض ضغط الدم ومعدل ضربات القلب
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🧘</span>
              يساعد في إدارة الألم المزمن
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🧘</span>
              يعلم الوعي بالجسم والتحكم في العضلات
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressiveMuscleRelaxation;
