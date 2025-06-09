
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { audioService } from '@/services/audioService';

const YogaTrainer = () => {
  const [selectedSequence, setSelectedSequence] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [currentPose, setCurrentPose] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isTransition, setIsTransition] = useState(false);

  const yogaSequences = {
    'morning': {
      name: 'تسلسل الصباح المنشط',
      description: 'روتين يوجا لبداية يوم نشيط',
      poses: [
        { name: 'وضعية الجبل', duration: 30, instruction: 'قف بثبات، أنفاسك عميقة ومنتظمة' },
        { name: 'تحية الشمس أ', duration: 60, instruction: 'ارفع ذراعيك عالياً مع الشهيق' },
        { name: 'الانحناء للأمام', duration: 30, instruction: 'انحنِ للأمام ببطء مع الزفير' },
        { name: 'وضعية الكوبرا', duration: 45, instruction: 'استلقِ على بطنك وارفع صدرك' },
        { name: 'وضعية الطفل', duration: 60, instruction: 'اجلس على كعبيك ومد ذراعيك للأمام' }
      ],
      benefits: ['ينشط الجسم', 'يحسن المرونة', 'يزيد الطاقة'],
      color: 'bg-orange-500'
    },
    'relaxing': {
      name: 'تسلسل الاسترخاء المسائي',
      description: 'روتين مهدئ لنهاية اليوم',
      poses: [
        { name: 'وضعية اللوتس', duration: 60, instruction: 'اجلس متربعاً واغمض عينيك' },
        { name: 'التواء العمود الفقري', duration: 45, instruction: 'التف برفق يميناً ثم يساراً' },
        { name: 'وضعية الأرجل على الحائط', duration: 180, instruction: 'استلقِ وارفع أرجلك على الحائط' },
        { name: 'وضعية الجثة', duration: 300, instruction: 'استلقِ بهدوء واتركة جسدك يسترخي تماماً' }
      ],
      benefits: ['يقلل التوتر', 'يحسن النوم', 'يهدئ العقل'],
      color: 'bg-purple-500'
    },
    'strength': {
      name: 'تسلسل القوة والتوازن',
      description: 'تمارين لتقوية العضلات والتوازن',
      poses: [
        { name: 'وضعية المحارب الأول', duration: 45, instruction: 'اتخذ وضعية المحارب بالرجل اليمنى للأمام' },
        { name: 'وضعية المحارب الثاني', duration: 45, instruction: 'افتح ذراعيك موازياً للأرض' },
        { name: 'وضعية الشجرة', duration: 60, instruction: 'قف على رجل واحدة وضع الأخرى على الفخذ' },
        { name: 'وضعية اللوح', duration: 60, instruction: 'ادعم جسدك على الذراعين في وضعية مستقيمة' },
        { name: 'وضعية الكلب المقلوب', duration: 45, instruction: 'شكل مثلث بجسدك مع رفع الحوض' }
      ],
      benefits: ['يقوي العضلات', 'يحسن التوازن', 'يزيد القدرة على التحمل'],
      color: 'bg-green-500'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedSequence) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds > 1) {
            return seconds - 1;
          } else {
            // Move to next pose
            const sequence = yogaSequences[selectedSequence as keyof typeof yogaSequences];
            const nextPose = currentPose + 1;
            
            if (nextPose < sequence.poses.length) {
              setCurrentPose(nextPose);
              setIsTransition(true);
              
              if (isSoundEnabled) {
                audioService.speakText(`انتقل الآن إلى ${sequence.poses[nextPose].name}`);
                audioService.playTone(800, 0.3);
              }
              
              setTimeout(() => {
                setIsTransition(false);
                if (isSoundEnabled) {
                  audioService.speakText(sequence.poses[nextPose].instruction);
                }
              }, 3000);
              
              return sequence.poses[nextPose].duration;
            } else {
              // Sequence completed
              setIsActive(false);
              if (isSoundEnabled) {
                audioService.speakText('ممتاز! لقد أنهيت التسلسل بنجاح');
                audioService.playTone(1000, 0.5);
              }
              return 0;
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, selectedSequence, currentPose, isSoundEnabled]);

  const startSequence = async () => {
    if (selectedSequence) {
      await audioService.initialize();
      setIsActive(true);
      const sequence = yogaSequences[selectedSequence as keyof typeof yogaSequences];
      setCurrentPose(0);
      setSeconds(sequence.poses[0].duration);
      
      if (isSoundEnabled) {
        audioService.speakText(`مرحباً بك في ${sequence.name}. ابدأ بـ ${sequence.poses[0].name}`);
        setTimeout(() => {
          audioService.speakText(sequence.poses[0].instruction);
        }, 3000);
      }
    }
  };

  const pauseSequence = () => {
    setIsActive(false);
    audioService.stopSpeaking();
  };

  const resetSequence = () => {
    setIsActive(false);
    setCurrentPose(0);
    setIsTransition(false);
    audioService.stopSpeaking();
    if (selectedSequence) {
      const sequence = yogaSequences[selectedSequence as keyof typeof yogaSequences];
      setSeconds(sequence.poses[0].duration);
    }
  };

  const getCurrentSequence = () => {
    return selectedSequence ? yogaSequences[selectedSequence as keyof typeof yogaSequences] : null;
  };

  const currentSequence = getCurrentSequence();
  const currentPoseData = currentSequence ? currentSequence.poses[currentPose] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">مدرب اليوجا الصوتي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Select value={selectedSequence} onValueChange={setSelectedSequence}>
              <SelectTrigger>
                <SelectValue placeholder="اختر تسلسل اليوجا" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(yogaSequences).map(([key, sequence]) => (
                  <SelectItem key={key} value={key}>
                    {sequence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentSequence && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">{currentSequence.name}</h4>
                <p className="text-gray-700 mb-3">{currentSequence.description}</p>
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800">الفوائد:</h5>
                  <ul className="text-sm text-gray-600">
                    {currentSequence.benefits.map((benefit, index) => (
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

          {selectedSequence && (
            <div className="text-center space-y-6">
              {/* Current Pose Display */}
              <div className="p-6 rounded-xl border-2 border-dashed border-gray-300">
                <div 
                  className={`w-24 h-24 rounded-full ${currentSequence?.color} mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl ${
                    isActive ? 'animate-pulse' : ''
                  }`}
                >
                  {isTransition ? '→' : seconds}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isTransition ? 'انتقال...' : currentPoseData?.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {isTransition ? 'استعد للوضعية التالية' : currentPoseData?.instruction}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>الوضعية {currentPose + 1} من {currentSequence?.poses.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${currentSequence?.color}`}
                      style={{ 
                        width: `${((currentPose + 1) / (currentSequence?.poses.length || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center space-x-4 space-x-reverse">
                <Button
                  onClick={isActive ? pauseSequence : startSequence}
                  className="bg-brand hover:bg-brand-dark"
                  size="lg"
                >
                  {isActive ? <Pause className="w-5 h-5 ml-2" /> : <Play className="w-5 h-5 ml-2" />}
                  {isActive ? 'إيقاف مؤقت' : 'ابدأ التسلسل'}
                </Button>
                
                <Button
                  onClick={resetSequence}
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
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-900">نصائح للممارسة الآمنة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-start">
              <span className="text-green-500 ml-2">🧘‍♀️</span>
              استمع لجسدك ولا تجبره على أوضاع صعبة
            </li>
            <li className="flex items-start">
              <span className="text-green-500 ml-2">🧘‍♀️</span>
              حافظ على التنفس العميق والمنتظم
            </li>
            <li className="flex items-start">
              <span className="text-green-500 ml-2">🧘‍♀️</span>
              استخدم الصوت للحصول على إرشادات دقيقة
            </li>
            <li className="flex items-start">
              <span className="text-green-500 ml-2">🧘‍♀️</span>
              مارس في مكان هادئ ومريح
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default YogaTrainer;
