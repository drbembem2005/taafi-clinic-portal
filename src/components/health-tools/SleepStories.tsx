
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Moon } from 'lucide-react';
import { audioService } from '@/services/audioService';

const SleepStories = () => {
  const [selectedStory, setSelectedStory] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [backgroundSounds, setBackgroundSounds] = useState(true);

  const sleepStories = {
    'forest': {
      title: 'رحلة في الغابة المهدئة',
      description: 'استرخ مع أصوات الطبيعة في غابة ساحرة',
      paragraphs: [
        'تخيل نفسك تمشي ببطء في غابة هادئة ومريحة...',
        'أوراق الأشجار تتمايل برفق مع النسيم العليل...',
        'تسمع صوت العصافير تغرد بعذوبة في الأعالي...',
        'أشعة الشمس الذهبية تتخلل أغصان الأشجار...',
        'تجد مكاناً مريحاً تحت شجرة كبيرة للراحة...',
        'تشعر بالسكينة والهدوء يملأ قلبك وعقلك...',
        'أنفاسك تصبح أعمق وأكثر انتظاماً...',
        'جسدك يسترخي تماماً ويستسلم للراحة...'
      ],
      backgroundFreq: 200,
      duration: 10000 // ms per paragraph
    },
    'ocean': {
      title: 'أمواج المحيط الهادئة',
      description: 'استمع لصوت الأمواج المهدئة على الشاطئ',
      paragraphs: [
        'أنت تجلس على شاطئ هادئ في ليلة صافية...',
        'الأمواج تنكسر برفق على الرمال الناعمة...',
        'صوت المياه يخلق إيقاعاً مهدئاً ومنتظماً...',
        'النجوم تتلألأ في السماء الصافية فوقك...',
        'النسيم البحري المنعش يلامس وجهك برقة...',
        'تشعر بالاتصال العميق مع هدوء الطبيعة...',
        'عقلك يطفو كما تطفو القوارب بعيداً...',
        'تستسلم للنوم العميق مع صوت الأمواج...'
      ],
      backgroundFreq: 150,
      duration: 12000
    },
    'mountain': {
      title: 'سكون الجبال العالية',
      description: 'تجربة هدوء وسكون قمم الجبال',
      paragraphs: [
        'أنت في مكان عالٍ على قمة جبل مهيب...',
        'الهواء نقي وبارد ومنعش حولك...',
        'تنظر إلى الوديان الخضراء في الأسفل...',
        'السحاب يمر ببطء تحت قدميك...',
        'الصمت التام يحيط بك من كل جانب...',
        'تشعر بالسلام الداخلي العميق...',
        'أنفاسك تتبع إيقاع الطبيعة الهادئ...',
        'تغرق في نوم عميق مثل هدوء الجبال...'
      ],
      backgroundFreq: 100,
      duration: 15000
    },
    'garden': {
      title: 'الحديقة السحرية',
      description: 'تجول في حديقة مليئة بالزهور والعطور',
      paragraphs: [
        'تدخل إلى حديقة سحرية مليئة بالألوان...',
        'عطر الزهور الجميلة يملأ الهواء حولك...',
        'الفراشات ترقص برشاقة بين الأزهار...',
        'نافورة صغيرة تتدفق بصوت هادئ ومريح...',
        'تجلس على مقعد مريح تحت شجرة مزهرة...',
        'الطيور تغني أجمل الألحان في الأغصان...',
        'تشعر بالامتنان والسعادة تملأ قلبك...',
        'تنام بهدوء محاطاً بجمال الطبيعة...'
      ],
      backgroundFreq: 250,
      duration: 8000
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && selectedStory) {
      const story = sleepStories[selectedStory as keyof typeof sleepStories];
      
      if (currentParagraph < story.paragraphs.length) {
        if (isSoundEnabled) {
          audioService.speakText(story.paragraphs[currentParagraph], 0.8, 0.9);
        }
        
        if (backgroundSounds) {
          audioService.playBinauralBeat(story.backgroundFreq, 8, story.duration / 1000);
        }
        
        interval = setTimeout(() => {
          setCurrentParagraph(prev => prev + 1);
        }, story.duration);
      } else {
        setIsPlaying(false);
        if (isSoundEnabled) {
          audioService.speakText('نوماً هنيئاً وأحلاماً سعيدة', 0.7, 0.8);
        }
      }
    }

    return () => clearTimeout(interval);
  }, [isPlaying, selectedStory, currentParagraph, isSoundEnabled, backgroundSounds]);

  const startStory = async () => {
    if (selectedStory) {
      await audioService.initialize();
      setIsPlaying(true);
      setCurrentParagraph(0);
      
      if (isSoundEnabled) {
        const story = sleepStories[selectedStory as keyof typeof sleepStories];
        audioService.speakText(`مرحباً بك في ${story.title}. استلق براحة واستعد للاسترخاء`);
      }
    }
  };

  const pauseStory = () => {
    setIsPlaying(false);
    audioService.stopSpeaking();
  };

  const resetStory = () => {
    setIsPlaying(false);
    setCurrentParagraph(0);
    audioService.stopSpeaking();
  };

  const getCurrentStory = () => {
    return selectedStory ? sleepStories[selectedStory as keyof typeof sleepStories] : null;
  };

  const currentStory = getCurrentStory();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right flex items-center">
            <Moon className="w-6 h-6 ml-2" />
            قصص النوم المهدئة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Select value={selectedStory} onValueChange={setSelectedStory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر قصة للنوم" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sleepStories).map(([key, story]) => (
                  <SelectItem key={key} value={key}>
                    {story.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentStory && (
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-bold text-indigo-900 mb-2">{currentStory.title}</h4>
                <p className="text-indigo-700 mb-3">{currentStory.description}</p>
                <div className="text-sm text-indigo-600">
                  المدة المتوقعة: {Math.ceil((currentStory.paragraphs.length * currentStory.duration) / 60000)} دقيقة
                </div>
              </div>
            )}
          </div>

          {selectedStory && (
            <div className="space-y-6">
              {/* Story Display */}
              <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl min-h-[200px]">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-3 flex items-center justify-center text-white">
                    <Moon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isPlaying ? 'جاري السرد...' : 'مستعد للبدء'}
                  </h3>
                </div>
                
                {currentStory && currentParagraph < currentStory.paragraphs.length && (
                  <div className="text-center">
                    <p className="text-lg text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                      {isPlaying ? currentStory.paragraphs[currentParagraph] : 'اضغط على "ابدأ القصة" للبدء'}
                    </p>
                    
                    <div className="text-sm text-gray-500">
                      فقرة {currentParagraph + 1} من {currentStory.paragraphs.length}
                    </div>
                  </div>
                )}
                
                {currentParagraph >= (currentStory?.paragraphs.length || 0) && (
                  <div className="text-center">
                    <p className="text-lg text-purple-700">انتهت القصة. نوماً هنيئاً! 🌙</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={isPlaying ? pauseStory : startStory}
                  className="bg-brand hover:bg-brand-dark"
                  size="lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5 ml-2" /> : <Play className="w-5 h-5 ml-2" />}
                  {isPlaying ? 'إيقاف مؤقت' : 'ابدأ القصة'}
                </Button>
                
                <Button
                  onClick={resetStory}
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
                  {isSoundEnabled ? 'إيقاف السرد' : 'تشغيل السرد'}
                </Button>
                
                <Button
                  onClick={() => setBackgroundSounds(!backgroundSounds)}
                  variant="outline"
                  size="lg"
                >
                  🎵
                  {backgroundSounds ? 'إيقاف الأصوات' : 'تشغيل الأصوات'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg text-purple-900">نصائح للحصول على أفضل تجربة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🛏️</span>
              استلق في وضع مريح في سريرك
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🌙</span>
              استخدم الأداة في غرفة مظلمة أو خافتة الإضاءة
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🎧</span>
              استخدم سماعات أذن مريحة أو مكبر صوت هادئ
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">📱</span>
              ضع هاتفك في وضع عدم الإزعاج
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 ml-2">🧘</span>
              ركز على التنفس واترك عقلك يتبع القصة
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepStories;
