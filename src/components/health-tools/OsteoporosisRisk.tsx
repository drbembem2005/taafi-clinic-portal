
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bone, AlertTriangle } from 'lucide-react';

const OsteoporosisRisk = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    familyHistory: '',
    smoking: '',
    alcohol: '',
    exercise: '',
    calcium: '',
    vitaminD: '',
    menopause: '',
    medications: ''
  });
  const [result, setResult] = useState<any>(null);

  const calculateRisk = () => {
    let riskScore = 0;
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const bmi = weight / Math.pow(height / 100, 2);

    // تقييم عوامل الخطر
    if (age >= 65) riskScore += 3;
    else if (age >= 50) riskScore += 2;
    else if (age >= 40) riskScore += 1;

    if (formData.gender === 'female') riskScore += 2;
    if (bmi < 18.5) riskScore += 2;
    else if (bmi < 20) riskScore += 1;

    if (formData.familyHistory === 'yes') riskScore += 2;
    if (formData.smoking === 'yes') riskScore += 2;
    if (formData.alcohol === 'heavy') riskScore += 2;
    else if (formData.alcohol === 'moderate') riskScore += 1;

    if (formData.exercise === 'none') riskScore += 2;
    else if (formData.exercise === 'low') riskScore += 1;

    if (formData.calcium === 'low') riskScore += 1;
    if (formData.vitaminD === 'low') riskScore += 1;
    if (formData.menopause === 'early') riskScore += 2;
    if (formData.medications === 'steroids') riskScore += 3;

    let riskLevel: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];

    if (riskScore >= 12) {
      riskLevel = 'very-high';
      category = 'خطر عالي جداً - يتطلب فحص فوري';
      recommendations = [
        'مراجعة طبيب العظام فوراً',
        'إجراء فحص كثافة العظام (DEXA)',
        'تقييم مستوى فيتامين د والكالسيوم',
        'مراجعة الأدوية الحالية',
        'برنامج تقوية العظام المتخصص'
      ];
    } else if (riskScore >= 8) {
      riskLevel = 'high';
      category = 'خطر عالي - يحتاج متابعة طبية';
      recommendations = [
        'استشارة طبية خلال شهر',
        'زيادة تناول الكالسيوم والفيتامين د',
        'تمارين تحمل الوزن يومياً',
        'تجنب التدخين والكحول',
        'تحسين التوازن لتجنب السقوط'
      ];
    } else if (riskScore >= 4) {
      riskLevel = 'moderate';
      category = 'خطر متوسط - احتياطات وقائية';
      recommendations = [
        'فحص دوري كل سنتين',
        'نظام غذائي غني بالكالسيوم',
        'التعرض للشمس يومياً',
        'تمارين رياضية منتظمة',
        'تجنب المشروبات الغازية'
      ];
    } else {
      riskLevel = 'low';
      category = 'خطر منخفض - استمر في الوقاية';
      recommendations = [
        'الحفاظ على النمط الصحي الحالي',
        'تناول الكالسيوم من المصادر الطبيعية',
        'ممارسة الرياضة بانتظام',
        'فحص دوري كل 3-5 سنوات',
        'تجنب العوامل المضرة'
      ];
    }

    setResult({
      riskScore,
      riskLevel,
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
            <Bone className="h-6 w-6" />
            تقييم خطر هشاشة العظام
          </CardTitle>
          <p className="text-gray-600">
            تقييم مخاطر الإصابة بهشاشة العظام وكسور المستقبل
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="45"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div>
              <Label>الجنس</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">الوزن (كجم)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="height">الطول (سم)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
              />
            </div>

            <div>
              <Label>تاريخ عائلي لهشاشة العظام؟</Label>
              <RadioGroup value={formData.familyHistory} onValueChange={(value) => setFormData({...formData, familyHistory: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="family-yes" />
                  <Label htmlFor="family-yes">نعم</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="family-no" />
                  <Label htmlFor="family-no">لا</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>التدخين؟</Label>
              <RadioGroup value={formData.smoking} onValueChange={(value) => setFormData({...formData, smoking: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="smoke-yes" />
                  <Label htmlFor="smoke-yes">نعم</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="smoke-no" />
                  <Label htmlFor="smoke-no">لا</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>استهلاك الكحول</Label>
              <Select value={formData.alcohol} onValueChange={(value) => setFormData({...formData, alcohol: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا أشرب</SelectItem>
                  <SelectItem value="light">خفيف</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="heavy">كثيف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>مستوى النشاط البدني</Label>
              <Select value={formData.exercise} onValueChange={(value) => setFormData({...formData, exercise: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا أمارس الرياضة</SelectItem>
                  <SelectItem value="low">قليل (1-2 مرات أسبوعياً)</SelectItem>
                  <SelectItem value="moderate">متوسط (3-4 مرات)</SelectItem>
                  <SelectItem value="high">عالي (يومياً)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateRisk} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.gender || !formData.weight || !formData.height}
          >
            تقييم مخاطر هشاشة العظام
          </Button>

          {result && (
            <Card className={`mt-6 border-2 ${
              result.riskLevel === 'very-high' ? 'bg-red-50 border-red-200' :
              result.riskLevel === 'high' ? 'bg-orange-50 border-orange-200' :
              result.riskLevel === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-brand mb-2">{result.riskScore}/15</div>
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.riskLevel === 'very-high' ? 'bg-red-100 text-red-800' :
                    result.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    result.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.category}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-brand" />
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

export default OsteoporosisRisk;
