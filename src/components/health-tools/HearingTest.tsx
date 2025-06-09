
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { audioService } from '@/services/audioService';

const HearingTest = () => {
  const [testPhase, setTestPhase] = useState<'intro' | 'testing' | 'results'>('intro');
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [userResponses, setUserResponses] = useState<boolean[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const frequencies = [
    { freq: 250, name: 'أصوات منخفضة جداً', description: 'أصوات مثل الرعد البعيد' },
    { freq: 500, name: 'أصوات منخفضة', description: 'أصوات مثل صوت الرجال العميق' },
    { freq: 1000, name: 'أصوات متوسطة', description: 'أصوات الكلام العادي' },
    { freq: 2000, name: 'أصوات عالية', description: 'أصوات مثل صوت النساء' },
    { freq: 4000, name: 'أصوات عالية جداً', description: 'أصوات مثل تغريد الطيور' },
    { freq: 8000, name: 'أصوات فائقة العلو', description: 'أصوات حادة مثل صفير' }
  ];

  const startTest = async () => {
    await audioService.initialize();
    setTestPhase('testing');
    setCurrentFrequency(0);
    setUserResponses([]);
    setTestResults(null);
  };

  const playTone = async () => {
    if (currentFrequency < frequencies.length) {
      setIsPlaying(true);
      await audioService.playTone(frequencies[currentFrequency].freq, 2, 0.3);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const recordResponse = (heard: boolean) => {
    const newResponses = [...userResponses, heard];
    setUserResponses(newResponses);

    if (currentFrequency + 1 < frequencies.length) {
      setCurrentFrequency(currentFrequency + 1);
    } else {
      // Test completed
      calculateResults(newResponses);
    }
  };

  const calculateResults = (responses: boolean[]) => {
    const heardCount = responses.filter(r => r).length;
    const percentage = (heardCount / frequencies.length) * 100;
    
    let assessment = '';
    let recommendations = [];
    
    if (percentage >= 90) {
      assessment = 'ممتاز - سمع طبيعي';
      recommendations = [
        'سمعك في حالة ممتازة',
        'استمر في حماية سمعك من الأصوات العالية',
        'قم بفحص دوري كل سنتين'
      ];
    } else if (percentage >= 70) {
      assessment = 'جيد - فقدان سمع طفيف';
      recommendations = [
        'قد يكون لديك فقدان سمع طفيف',
        'تجنب التعرض للأصوات العالية',
        'استشر طبيب أذن وأنف وحنجرة',
        'افحص سمعك كل سنة'
      ];
    } else if (percentage >= 50) {
      assessment = 'متوسط - فقدان سمع ملحوظ';
      recommendations = [
        'يوجد فقدان سمع واضح في بعض الترددات',
        'استشر طبيب متخصص فوراً',
        'قد تحتاج لمعينة سمعية',
        'تجنب البيئات الصاخبة'
      ];
    } else {
      assessment = 'ضعيف - فقدان سمع كبير';
      recommendations = [
        'يوجد فقدان سمع كبير',
        'يجب مراجعة طبيب الأذن بشكل عاجل',
        'قد تحتاج لفحوصات متقدمة',
        'استخدم حماية للأذن دائماً'
      ];
    }

    setTestResults({
      percentage,
      assessment,
      recommendations,
      detailedResults: responses.map((heard, index) => ({
        frequency: frequencies[index],
        heard
      }))
    });
    
    setTestPhase('results');
  };

  const resetTest = () => {
    setTestPhase('intro');
    setCurrentFrequency(0);
    setUserResponses([]);
    setTestResults(null);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {testPhase === 'intro' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-right">اختبار السمع التفاعلي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-3">تعليمات مهمة قبل البدء:</h4>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">🎧</span>
                  استخدم سماعات رأس جيدة للحصول على نتائج دقيقة
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">🔇</span>
                  اجلس في مكان هادئ بعيداً عن الضوضاء
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">🎚️</span>
                  اضبط مستوى الصوت على مستوى مريح
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">⏰</span>
                  سيستغرق الاختبار حوالي 3-5 دقائق
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-bold text-yellow-900 mb-2">كيفية الاختبار:</h4>
              <p className="text-yellow-800 leading-relaxed">
                ستسمع مجموعة من الأصوات بترددات مختلفة. اضغط "سمعت الصوت" إذا سمعت النغمة، 
                أو "لم أسمع" إذا لم تسمع شيئاً. كن صادقاً في إجاباتك للحصول على تقييم دقيق.
              </p>
            </div>

            <div className="text-center">
              <Button onClick={startTest} size="lg" className="bg-brand hover:bg-brand-dark">
                <Play className="w-5 h-5 ml-2" />
                ابدأ اختبار السمع
              </Button>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ تنبيه: هذا الاختبار للتوعية فقط ولا يغني عن الفحص الطبي المتخصص
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {testPhase === 'testing' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-right">جاري الاختبار...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Progress 
                value={((currentFrequency + 1) / frequencies.length) * 100} 
                className="w-full mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                السؤال {currentFrequency + 1} من {frequencies.length}
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {frequencies[currentFrequency]?.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {frequencies[currentFrequency]?.description}
              </p>
              
              <div className="mb-6">
                <Button
                  onClick={playTone}
                  disabled={isPlaying}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="lg"
                >
                  <Volume2 className="w-5 h-5 ml-2" />
                  {isPlaying ? 'جاري التشغيل...' : 'تشغيل النغمة'}
                </Button>
              </div>

              <div className="space-y-3">
                <p className="font-medium text-gray-800">هل سمعت النغمة؟</p>
                <div className="flex justify-center space-x-4 space-x-reverse">
                  <Button
                    onClick={() => recordResponse(true)}
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 ml-2" />
                    سمعت الصوت
                  </Button>
                  <Button
                    onClick={() => recordResponse(false)}
                    variant="outline"
                    className="border-red-500 text-red-700 hover:bg-red-50"
                    size="lg"
                  >
                    <XCircle className="w-5 h-5 ml-2" />
                    لم أسمع
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {testPhase === 'results' && testResults && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-right">نتائج اختبار السمع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{testResults.percentage}%</div>
                    <div className="text-sm">النتيجة</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {testResults.assessment}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">النتائج التفصيلية:</h4>
                  <div className="space-y-2">
                    {testResults.detailedResults.map((result: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {result.frequency.freq} Hz
                        </span>
                        <span className={`text-sm font-medium ${
                          result.heard ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.heard ? '✓ سُمع' : '✗ لم يُسمع'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-3">التوصيات:</h4>
                  <ul className="space-y-2">
                    {testResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start">
                        <span className="text-blue-500 ml-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={resetTest} variant="outline" size="lg">
                  إعادة الاختبار
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HearingTest;
