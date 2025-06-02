
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Activity } from 'lucide-react';

const MaleFertilityCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseFrequency: '',
    stressLevel: '',
    weight: '',
    height: '',
    hotBathFrequency: '',
    laptopUsage: '',
    medicalHistory: ''
  });
  const [result, setResult] = useState<any>(null);

  const calculateFertilityIndex = () => {
    let score = 100; // البداية بدرجة مثالية

    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const bmi = weight / Math.pow(height / 100, 2);

    // تأثير العمر
    if (age < 25) score += 5;
    else if (age < 35) score += 0;
    else if (age < 40) score -= 10;
    else if (age < 45) score -= 20;
    else score -= 30;

    // تأثير مؤشر كتلة الجسم
    if (bmi < 18.5) score -= 15;
    else if (bmi <= 24.9) score += 10;
    else if (bmi <= 29.9) score -= 10;
    else score -= 25;

    // تأثير التدخين
    const smokingImpact = {
      'never': 10,
      'former': -5,
      'occasional': -15,
      'regular': -30
    };
    score += smokingImpact[formData.smokingStatus as keyof typeof smokingImpact] || 0;

    // تأثير الكحول
    const alcoholImpact = {
      'none': 5,
      'moderate': 0,
      'heavy': -20
    };
    score += alcoholImpact[formData.alcoholConsumption as keyof typeof alcoholImpact] || 0;

    // تأثير التمارين
    const exerciseImpact = {
      'daily': 15,
      'regular': 10,
      'moderate': 5,
      'light': 0,
      'none': -10
    };
    score += exerciseImpact[formData.exerciseFrequency as keyof typeof exerciseImpact] || 0;

    // تأثير التوتر
    const stressImpact = {
      'low': 10,
      'moderate': 0,
      'high': -15
    };
    score += stressImpact[formData.stressLevel as keyof typeof stressImpact] || 0;

    // تأثير الحمامات الساخنة
    const hotBathImpact = {
      'never': 5,
      'rarely': 0,
      'weekly': -10,
      'daily': -20
    };
    score += hotBathImpact[formData.hotBathFrequency as keyof typeof hotBathImpact] || 0;

    // تأثير استخدام اللابتوب
    const laptopImpact = {
      'never': 5,
      'rarely': 0,
      'moderate': -5,
      'heavy': -15
    };
    score += laptopImpact[formData.laptopUsage as keyof typeof laptopImpact] || 0;

    // تأثير التاريخ الطبي
    const medicalImpact = {
      'none': 10,
      'minor': -5,
      'moderate': -15,
      'serious': -30
    };
    score += medicalImpact[formData.medicalHistory as keyof typeof medicalImpact] || 0;

    // تحديد المستوى والتوصيات
    score = Math.max(0, Math.min(100, score)); // بين 0 و 100

    let level = '';
    let category = '';
    let recommendations = [];

    if (score >= 80) {
      level = 'ممتاز';
      category = 'مؤشر خصوبة عالي جداً';
      recommendations = [
        'واصل نمط حياتك الصحي الحالي',
        'حافظ على النشاط البدني المنتظم',
        'استمر في تجنب التدخين والكحول',
        'فحص دوري كل سنتين'
      ];
    } else if (score >= 60) {
      level = 'جيد';
      category = 'مؤشر خصوبة جيد';
      recommendations = [
        'تحسين النظام الغذائي',
        'زيادة النشاط البدني',
        'تقليل مستوى التوتر',
        'تجنب الحمامات الساخنة المتكررة'
      ];
    } else if (score >= 40) {
      level = 'متوسط';
      category = 'مؤشر خصوبة متوسط - يحتاج تحسين';
      recommendations = [
        'استشارة طبيب أمراض الذكورة',
        'الإقلاع عن التدخين فوراً',
        'تقليل استهلاك الكحول',
        'برنامج رياضي منتظم',
        'إدارة التوتر والضغوط',
        'فحوصات شاملة كل 6 أشهر'
      ];
    } else {
      level = 'ضعيف';
      category = 'مؤشر خصوبة منخفض - يحتاج تدخل طبي';
      recommendations = [
        'استشارة عاجلة مع طبيب أمراض الذكورة',
        'فحوصات تفصيلية للحيوانات المنوية',
        'تغيير جذري في نمط الحياة',
        'علاج طبي إذا لزم الأمر',
        'متابعة دورية مكثفة'
      ];
    }

    setResult({
      score: Math.round(score),
      level,
      category,
      recommendations,
      bmi: Math.round(bmi * 10) / 10
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Users className="h-6 w-6" />
            حاسبة مؤشر الخصوبة للرجال
          </CardTitle>
          <p className="text-gray-600">
            تقييم عوامل نمط الحياة المؤثرة على صحة الحيوانات المنوية والخصوبة
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="weight">الوزن (كجم)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="75"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="height">الطول (سم)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
              />
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
                  <SelectItem value="none">لا أشرب</SelectItem>
                  <SelectItem value="moderate">معتدل</SelectItem>
                  <SelectItem value="heavy">كثير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>تكرار التمارين</Label>
              <Select value={formData.exerciseFrequency} onValueChange={(value) => setFormData({...formData, exerciseFrequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومياً</SelectItem>
                  <SelectItem value="regular">3-5 مرات أسبوعياً</SelectItem>
                  <SelectItem value="moderate">1-2 مرة أسبوعياً</SelectItem>
                  <SelectItem value="light">أحياناً</SelectItem>
                  <SelectItem value="none">لا أمارس الرياضة</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>تكرار الحمامات الساخنة/الساونا</Label>
              <Select value={formData.hotBathFrequency} onValueChange={(value) => setFormData({...formData, hotBathFrequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">أبداً</SelectItem>
                  <SelectItem value="rarely">نادراً</SelectItem>
                  <SelectItem value="weekly">أسبوعياً</SelectItem>
                  <SelectItem value="daily">يومياً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>استخدام اللابتوب على الحضن</Label>
              <Select value={formData.laptopUsage} onValueChange={(value) => setFormData({...formData, laptopUsage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">أبداً</SelectItem>
                  <SelectItem value="rarely">نادراً</SelectItem>
                  <SelectItem value="moderate">أحياناً</SelectItem>
                  <SelectItem value="heavy">كثيراً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>التاريخ الطبي للأعضاء التناسلية</Label>
              <Select value={formData.medicalHistory} onValueChange={(value) => setFormData({...formData, medicalHistory: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا يوجد</SelectItem>
                  <SelectItem value="minor">مشاكل بسيطة</SelectItem>
                  <SelectItem value="moderate">مشاكل متوسطة</SelectItem>
                  <SelectItem value="serious">مشاكل خطيرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateFertilityIndex} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.weight || !formData.height}
          >
            احسب مؤشر الخصوبة
          </Button>

          {result && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-brand/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-brand mb-2">{result.score}/100</div>
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.score >= 80 ? 'bg-green-100 text-green-800' :
                    result.score >= 60 ? 'bg-blue-100 text-blue-800' :
                    result.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.category}
                  </div>
                  <div className="text-lg text-gray-600 mt-2">
                    مؤشر كتلة الجسم: {result.bmi}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-brand" />
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

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    <strong>تنبيه:</strong> هذا التقييم للتوعية فقط ولا يغني عن الفحص الطبي المتخصص. 
                    لتقييم دقيق للخصوبة، يُنصح بإجراء تحليل السائل المنوي وفحوصات هرمونية.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaleFertilityCalculator;
