
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Moon, Clock } from 'lucide-react';

const SleepQuality = () => {
  const [formData, setFormData] = useState({
    sleepDuration: '',
    bedTime: '',
    wakeTime: '',
    fallAsleepTime: '',
    nightWakeups: '',
    sleepDebt: '',
    morningFeeling: '',
    daytimeTiredness: '',
    snoring: '',
    sleepEnvironment: '',
    screenTime: '',
    caffeine: ''
  });
  const [result, setResult] = useState<any>(null);

  const assessSleepQuality = () => {
    let sleepScore = 100;
    const sleepDuration = parseFloat(formData.sleepDuration);
    
    // تقييم مدة النوم
    if (sleepDuration < 6) sleepScore -= 20;
    else if (sleepDuration < 7) sleepScore -= 10;
    else if (sleepDuration > 9) sleepScore -= 5;

    // تقييم وقت النوم
    const fallAsleep = parseInt(formData.fallAsleepTime);
    if (fallAsleep > 30) sleepScore -= 15;
    else if (fallAsleep > 15) sleepScore -= 8;

    // تقييم الاستيقاظ الليلي
    const wakeups = parseInt(formData.nightWakeups);
    if (wakeups >= 3) sleepScore -= 15;
    else if (wakeups >= 1) sleepScore -= 8;

    // تقييم الشعور الصباحي
    if (formData.morningFeeling === 'tired') sleepScore -= 15;
    else if (formData.morningFeeling === 'ok') sleepScore -= 5;

    // تقييم التعب النهاري
    if (formData.daytimeTiredness === 'always') sleepScore -= 20;
    else if (formData.daytimeTiredness === 'often') sleepScore -= 10;

    // عوامل أخرى
    if (formData.snoring === 'loud') sleepScore -= 10;
    if (formData.sleepEnvironment === 'poor') sleepScore -= 10;
    if (formData.screenTime === 'yes') sleepScore -= 8;
    if (formData.caffeine === 'late') sleepScore -= 5;

    sleepScore = Math.max(0, Math.min(100, sleepScore));

    let qualityLevel = '';
    let recommendations: string[] = [];

    if (sleepScore >= 85) {
      qualityLevel = 'ممتاز - نوم صحي مثالي';
      recommendations = [
        'استمر في نمط النوم الحالي',
        'حافظ على روتين النوم المنتظم',
        'تأكد من بيئة النوم المريحة',
        'مراقبة أي تغييرات مستقبلية'
      ];
    } else if (sleepScore >= 70) {
      qualityLevel = 'جيد - مع بعض التحسينات البسيطة';
      recommendations = [
        'تحسين بيئة النوم (ظلام، هدوء، برودة)',
        'تجنب الشاشات قبل النوم بساعة',
        'روتين استرخاء قبل النوم',
        'تجنب الكافيين بعد العصر'
      ];
    } else if (sleepScore >= 50) {
      qualityLevel = 'متوسط - يحتاج تحسينات واضحة';
      recommendations = [
        'تحديد مواعيد نوم واستيقاظ ثابتة',
        'تجنب الوجبات الثقيلة قبل النوم',
        'ممارسة تمارين الاسترخاء',
        'تقليل التوتر اليومي',
        'استشارة طبية إذا استمرت المشاكل'
      ];
    } else {
      qualityLevel = 'ضعيف - يتطلب تدخل عاجل';
      recommendations = [
        'استشارة طبيب النوم فوراً',
        'تقييم اضطرابات النوم المحتملة',
        'تغيير جذري في عادات النوم',
        'فحص الحالات الطبية المؤثرة',
        'برنامج علاجي متخصص للنوم'
      ];
    }

    // تحليل أنماط النوم
    const bedHour = parseInt(formData.bedTime?.split(':')[0] || '22');
    const wakeHour = parseInt(formData.wakeTime?.split(':')[0] || '7');
    const sleepPattern = bedHour <= 23 && wakeHour >= 6 && wakeHour <= 8 ? 'منتظم' : 'غير منتظم';

    setResult({
      sleepScore: Math.round(sleepScore),
      qualityLevel,
      recommendations,
      sleepPattern,
      sleepEfficiency: Math.round((sleepDuration / (sleepDuration + fallAsleep/60 + wakeups*0.25)) * 100)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Moon className="h-6 w-6" />
            تقييم جودة النوم
          </CardTitle>
          <p className="text-gray-600">
            تحليل شامل لجودة نومك ونصائح للتحسين
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sleepDuration">كم ساعة تنام يومياً؟</Label>
              <Input
                id="sleepDuration"
                type="number"
                step="0.5"
                placeholder="7.5"
                value={formData.sleepDuration}
                onChange={(e) => setFormData({...formData, sleepDuration: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="fallAsleepTime">كم دقيقة تحتاج للنوم؟</Label>
              <Input
                id="fallAsleepTime"
                type="number"
                placeholder="15"
                value={formData.fallAsleepTime}
                onChange={(e) => setFormData({...formData, fallAsleepTime: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="bedTime">وقت النوم المعتاد</Label>
              <Input
                id="bedTime"
                type="time"
                value={formData.bedTime}
                onChange={(e) => setFormData({...formData, bedTime: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="wakeTime">وقت الاستيقاظ المعتاد</Label>
              <Input
                id="wakeTime"
                type="time"
                value={formData.wakeTime}
                onChange={(e) => setFormData({...formData, wakeTime: e.target.value})}
              />
            </div>

            <div>
              <Label>عدد مرات الاستيقاظ ليلاً</Label>
              <Select value={formData.nightWakeups} onValueChange={(value) => setFormData({...formData, nightWakeups: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">لا أستيقظ</SelectItem>
                  <SelectItem value="1">مرة واحدة</SelectItem>
                  <SelectItem value="2">مرتين</SelectItem>
                  <SelectItem value="3">3 مرات أو أكثر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>كيف تشعر عند الاستيقاظ؟</Label>
              <RadioGroup value={formData.morningFeeling} onValueChange={(value) => setFormData({...formData, morningFeeling: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="refreshed" id="fresh" />
                  <Label htmlFor="fresh">منتعش ونشيط</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="ok" id="ok" />
                  <Label htmlFor="ok">عادي</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="tired" id="tired" />
                  <Label htmlFor="tired">متعب ومرهق</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>مستوى التعب النهاري</Label>
              <Select value={formData.daytimeTiredness} onValueChange={(value) => setFormData({...formData, daytimeTiredness: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">لا أشعر بالتعب</SelectItem>
                  <SelectItem value="rarely">نادراً</SelectItem>
                  <SelectItem value="sometimes">أحياناً</SelectItem>
                  <SelectItem value="often">كثيراً</SelectItem>
                  <SelectItem value="always">دائماً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>هل تستخدم الشاشات قبل النوم؟</Label>
              <RadioGroup value={formData.screenTime} onValueChange={(value) => setFormData({...formData, screenTime: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="screen-no" />
                  <Label htmlFor="screen-no">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="screen-yes" />
                  <Label htmlFor="screen-yes">نعم</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button 
            onClick={assessSleepQuality} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.sleepDuration || !formData.fallAsleepTime}
          >
            تقييم جودة النوم
          </Button>

          {result && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-brand/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-brand mb-2">{result.sleepScore}/100</div>
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.sleepScore >= 85 ? 'bg-green-100 text-green-800' :
                    result.sleepScore >= 70 ? 'bg-blue-100 text-blue-800' :
                    result.sleepScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.qualityLevel}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">%{result.sleepEfficiency}</div>
                    <div className="text-sm text-gray-600">كفاءة النوم</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">{result.sleepPattern}</div>
                    <div className="text-sm text-gray-600">نمط النوم</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand" />
                    توصيات التحسين
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-brand text-lg">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepQuality;
