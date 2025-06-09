
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Heart, Activity } from 'lucide-react';

const BiologicalAgeCalculator = () => {
  const [formData, setFormData] = useState({
    chronologicalAge: '',
    exerciseFrequency: '',
    smokingStatus: '',
    alcoholConsumption: '',
    sleepHours: '',
    stressLevel: '',
    dietQuality: '',
    socialConnections: ''
  });
  const [result, setResult] = useState<any>(null);

  const calculateBiologicalAge = () => {
    const age = parseInt(formData.chronologicalAge);
    let biologicalAge = age;

    // Exercise impact
    const exerciseImpact = {
      'daily': -3,
      '5-6-times': -2,
      '3-4-times': -1,
      '1-2-times': 0,
      'rarely': 2
    };
    biologicalAge += exerciseImpact[formData.exerciseFrequency as keyof typeof exerciseImpact] || 0;

    // Smoking impact
    const smokingImpact = {
      'never': -1,
      'former': 1,
      'occasional': 3,
      'regular': 5
    };
    biologicalAge += smokingImpact[formData.smokingStatus as keyof typeof smokingImpact] || 0;

    // Alcohol impact
    const alcoholImpact = {
      'none': 0,
      'moderate': 0,
      'heavy': 2
    };
    biologicalAge += alcoholImpact[formData.alcoholConsumption as keyof typeof alcoholImpact] || 0;

    // Sleep impact
    const sleepHours = parseInt(formData.sleepHours);
    if (sleepHours < 6) biologicalAge += 2;
    else if (sleepHours > 9) biologicalAge += 1;
    else if (sleepHours >= 7 && sleepHours <= 8) biologicalAge -= 1;

    // Stress impact
    const stressImpact = {
      'low': -1,
      'moderate': 0,
      'high': 2
    };
    biologicalAge += stressImpact[formData.stressLevel as keyof typeof stressImpact] || 0;

    // Diet impact
    const dietImpact = {
      'excellent': -2,
      'good': -1,
      'average': 0,
      'poor': 2
    };
    biologicalAge += dietImpact[formData.dietQuality as keyof typeof dietImpact] || 0;

    // Social connections impact
    const socialImpact = {
      'strong': -1,
      'moderate': 0,
      'weak': 1
    };
    biologicalAge += socialImpact[formData.socialConnections as keyof typeof socialImpact] || 0;

    const ageDifference = biologicalAge - age;
    let category = '';
    let recommendations = [];

    if (ageDifference <= -3) {
      category = 'عمرك البيولوجي أصغر من عمرك الحقيقي - ممتاز!';
      recommendations = [
        'واصل نمط حياتك الصحي الحالي',
        'حافظ على التمارين الرياضية المنتظمة',
        'استمر في النظام الغذائي المتوازن'
      ];
    } else if (ageDifference <= 0) {
      category = 'عمرك البيولوجي مناسب لعمرك الحقيقي - جيد';
      recommendations = [
        'زد من النشاط البدني قليلاً',
        'تحسين جودة النوم',
        'تقليل مستوى التوتر'
      ];
    } else if (ageDifference <= 3) {
      category = 'عمرك البيولوجي أكبر من عمرك الحقيقي قليلاً';
      recommendations = [
        'ابدأ برنامج رياضي منتظم',
        'تحسين النظام الغذائي',
        'الإقلاع عن التدخين إن وجد',
        'تحسين جودة النوم'
      ];
    } else {
      category = 'عمرك البيولوجي أكبر من عمرك الحقيقي - يحتاج تحسين';
      recommendations = [
        'استشارة طبية شاملة',
        'برنامج رياضي مكثف',
        'تغيير جذري في النظام الغذائي',
        'إدارة التوتر والضغوط النفسية',
        'فحوصات طبية دورية'
      ];
    }

    setResult({
      biologicalAge: Math.round(biologicalAge),
      chronologicalAge: age,
      ageDifference: Math.round(ageDifference),
      category,
      recommendations
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Calendar className="h-6 w-6" />
            حاسبة العمر البيولوجي
          </CardTitle>
          <p className="text-gray-600">
            اكتشف عمرك الحقيقي بناءً على نمط حياتك وعاداتك الصحية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر الحقيقي</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.chronologicalAge}
                onChange={(e) => setFormData({...formData, chronologicalAge: e.target.value})}
              />
            </div>

            <div>
              <Label>تكرار التمارين الرياضية</Label>
              <Select value={formData.exerciseFrequency} onValueChange={(value) => setFormData({...formData, exerciseFrequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومياً</SelectItem>
                  <SelectItem value="5-6-times">5-6 مرات أسبوعياً</SelectItem>
                  <SelectItem value="3-4-times">3-4 مرات أسبوعياً</SelectItem>
                  <SelectItem value="1-2-times">1-2 مرة أسبوعياً</SelectItem>
                  <SelectItem value="rarely">نادراً أو أبداً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>حالة التدخين</Label>
              <Select value={formData.smokingStatus} onValueChange={(value) => setFormData({...formData, smokingStatus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">لا أدخن أبداً</SelectItem>
                  <SelectItem value="former">مدخن سابق</SelectItem>
                  <SelectItem value="occasional">مدخن أحياناً</SelectItem>
                  <SelectItem value="regular">مدخن منتظم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>استهلاك الكحول</Label>
              <Select value={formData.alcoholConsumption} onValueChange={(value) => setFormData({...formData, alcoholConsumption: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا أشرب الكحول</SelectItem>
                  <SelectItem value="moderate">معتدل (مرة أو مرتين أسبوعياً)</SelectItem>
                  <SelectItem value="heavy">كثير (يومياً أو شبه يومي)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sleep">ساعات النوم يومياً</Label>
              <Input
                id="sleep"
                type="number"
                placeholder="8"
                value={formData.sleepHours}
                onChange={(e) => setFormData({...formData, sleepHours: e.target.value})}
              />
            </div>

            <div>
              <Label>مستوى التوتر</Label>
              <Select value={formData.stressLevel} onValueChange={(value) => setFormData({...formData, stressLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفض</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="high">مرتفع</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>جودة النظام الغذائي</Label>
              <Select value={formData.dietQuality} onValueChange={(value) => setFormData({...formData, dietQuality: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">ممتاز (خضار، فواكه، بروتين متوازن)</SelectItem>
                  <SelectItem value="good">جيد (متوازن معظم الوقت)</SelectItem>
                  <SelectItem value="average">متوسط (بعض الوجبات السريعة)</SelectItem>
                  <SelectItem value="poor">ضعيف (وجبات سريعة كثيرة)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>العلاقات الاجتماعية</Label>
              <Select value={formData.socialConnections} onValueChange={(value) => setFormData({...formData, socialConnections: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strong">قوية ومتنوعة</SelectItem>
                  <SelectItem value="moderate">متوسطة</SelectItem>
                  <SelectItem value="weak">ضعيفة أو محدودة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateBiologicalAge} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.chronologicalAge || !formData.exerciseFrequency}
          >
            احسب العمر البيولوجي
          </Button>

          {result && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-brand/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand">{result.biologicalAge}</div>
                      <div className="text-sm text-gray-600">العمر البيولوجي</div>
                    </div>
                    <div className="text-2xl text-gray-400">مقابل</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700">{result.chronologicalAge}</div>
                      <div className="text-sm text-gray-600">العمر الحقيقي</div>
                    </div>
                  </div>
                  
                  <div className={`text-lg font-semibold p-3 rounded-lg ${
                    result.ageDifference <= 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {result.category}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    التوصيات
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

export default BiologicalAgeCalculator;
