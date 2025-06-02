
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

const MeditationTimer = () => {
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('focus');

  const durations = [
    { minutes: 5, label: '5 دقائق - للمبتدئين' },
    { minutes: 10, label: '10 دقائق - جلسة سريعة' },
    { minutes: 15, label: '15 دقيقة - جلسة متوسطة' },
    { minutes: 20, label: '20 دقيقة - جلسة عميقة' },
    { minutes: 30, label: '30 دقيقة - جلسة متقدمة' }
  ];

  const themes = [
    { id: 'focus', name: 'التركيز والانتباه', color: 'blue' },
    { id: 'relaxation', name: 'الاسترخاء والهدوء', color: 'green' },
    { id: 'sleep', name: 'التأهيل للنوم', color: 'purple' },
    { id: 'energy', name: 'استعادة الطاقة', color: 'orange' }
  ];

  const instructions = {
    focus: [
      'اجلس في مكان هادئ ومريح',
      'أغلق عينيك وركز على تنفسك',
      'عد أنفاسك من 1 إلى 10 ثم أعد',
      'عندما تشرد أفكارك، ارجع للتركيز على التنفس'
    ],
    relaxation: [
      'استلق أو اجلس بوضعية مريحة',
      'تنفس ببطء وعمق',
      'أرخِ عضلاتك تدريجياً من الرأس للقدمين',
      'تخيل مكاناً هادئاً ومريحاً'
    ],
    sleep: [
      'استلق على السرير في الظلام',
      'تنفس ببطء شديد',
      'أرخِ جسمك بالكامل',
      'أفرغ ذهنك من الأفكار'
    ],
    energy: [
      'اجلس بظهر مستقيم',
      'تنفس بعمق وقوة',
      'تخيل الطاقة تتدفق في جسمك',
      'ركز على الأهداف الإيجابية'
    ]
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsCompleted(true);
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    setIsCompleted(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    setIsCompleted(false);
  };

  const changeDuration = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Timer className="h-6 w-6" />
            مؤقت التأمل المرشد
          </CardTitle>
          <p className="text-gray-600">
            جلسات تأمل مرشدة لتحسين التركيز والاسترخاء
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">اختر مدة الجلسة</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {durations.map((duration) => (
                <Button
                  key={duration.minutes}
                  variant={selectedDuration === duration.minutes ? "default" : "outline"}
                  onClick={() => changeDuration(duration.minutes)}
                  className="h-auto p-3 text-sm"
                  disabled={isActive}
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">اختر نوع التأمل</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={selectedTheme === theme.id ? "default" : "outline"}
                  onClick={() => setSelectedTheme(theme.id)}
                  className="h-auto p-3 text-sm"
                  disabled={isActive}
                >
                  {theme.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Timer Display */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-brand mb-4">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="w-full h-2 mb-6" />
              
              <div className="flex justify-center gap-4">
                {!isActive ? (
                  <Button
                    onClick={startTimer}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
                    disabled={timeLeft === 0}
                  >
                    <Play className="w-5 h-5 ml-2" />
                    ابدأ
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3"
                  >
                    <Pause className="w-5 h-5 ml-2" />
                    إيقاف مؤقت
                  </Button>
                )}
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="px-6 py-3"
                >
                  <RotateCcw className="w-5 h-5 ml-2" />
                  إعادة تعيين
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-brand" />
                إرشادات {themes.find(t => t.id === selectedTheme)?.name}
              </h3>
              <ol className="space-y-2">
                {instructions[selectedTheme as keyof typeof instructions].map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Completion Message */}
          {isCompleted && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-green-600 text-xl font-semibold mb-2">
                  🎉 تهانينا! أكملت جلسة التأمل
                </div>
                <p className="text-green-700">
                  لقد قضيت {selectedDuration} دقيقة في التأمل والاسترخاء. 
                  نأمل أن تشعر بالهدوء والتجدد الآن.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationTimer;
