
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, AlertTriangle } from 'lucide-react';

const HeartDiseaseRisk = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    smoking: '',
    diabetes: '',
    hypertension: '',
    cholesterol: '',
    familyHistory: '',
    exercise: '',
    stress: '',
    weight: '',
    height: '',
    diet: ''
  });
  const [result, setResult] = useState<any>(null);

  const assessHeartRisk = () => {
    let riskScore = 0;
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const bmi = weight / Math.pow(height / 100, 2);

    // تقييم عوامل الخطر
    if (age >= 65) riskScore += 4;
    else if (age >= 55) riskScore += 3;
    else if (age >= 45) riskScore += 2;
    else if (age >= 35) riskScore += 1;

    if (formData.gender === 'male') riskScore += 1;
    if (formData.smoking === 'current') riskScore += 4;
    else if (formData.smoking === 'former') riskScore += 2;

    if (formData.diabetes === 'yes') riskScore += 3;
    if (formData.hypertension === 'yes') riskScore += 3;
    if (formData.cholesterol === 'high') riskScore += 2;
    if (formData.familyHistory === 'yes') riskScore += 2;

    if (formData.exercise === 'none') riskScore += 2;
    else if (formData.exercise === 'low') riskScore += 1;

    if (formData.stress === 'high') riskScore += 2;
    else if (formData.stress === 'moderate') riskScore += 1;

    if (bmi >= 30) riskScore += 2;
    else if (bmi >= 25) riskScore += 1;

    if (formData.diet === 'poor') riskScore += 2;
    else if (formData.diet === 'average') riskScore += 1;

    let riskLevel: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];

    if (riskScore >= 18) {
      riskLevel = 'very-high';
      category = 'خطر عالي جداً - يتطلب تدخل طبي فوري';
      recommendations = [
        'مراجعة طبيب القلب فوراً',
        'إجراء تخطيط قلب وفحوصات شاملة',
        'التوقف عن التدخين نهائياً',
        'نظام غذائي صارم قليل الدهون',
        'متابعة طبية مستمرة'
      ];
    } else if (riskScore >= 12) {
      riskLevel = 'high';
      category = 'خطر عالي - يحتاج متابعة طبية';
      recommendations = [
        'استشارة طبية خلال أسبوعين',
        'فحص الكوليسترول وضغط الدم',
        'برنامج تمارين تحت إشراف طبي',
        'تقليل الملح والدهون المشبعة',
        'إدارة التوتر والضغط النفسي'
      ];
    } else if (riskScore >= 7) {
      riskLevel = 'moderate';
      category = 'خطر متوسط - احتياطات وقائية';
      recommendations = [
        'فحص دوري كل 6 أشهر',
        'المشي 30 دقيقة يومياً',
        'نظام غذائي متوازن',
        'تجنب التدخين والكحول',
        'تقليل التوتر'
      ];
    } else {
      riskLevel = 'low';
      category = 'خطر منخفض - استمر في الوقاية';
      recommendations = [
        'الحفاظ على النمط الصحي الحالي',
        'فحص دوري كل سنة',
        'ممارسة الرياضة بانتظام',
        'نظام غذائي صحي',
        'إدارة الضغوط النفسية'
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
            <Heart className="h-6 w-6" />
            تقييم خطر أمراض القلب
          </CardTitle>
          <p className="text-gray-600">
            تقييم مخاطر الإصابة بأمراض القلب والشرايين
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
              <Label>التدخين</Label>
              <Select value={formData.smoking} onValueChange={(value) => setFormData({...formData, smoking: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">لم أدخن أبداً</SelectItem>
                  <SelectItem value="former">أقلعت عن التدخين</SelectItem>
                  <SelectItem value="current">أدخن حالياً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>هل تعاني من السكري؟</Label>
              <RadioGroup value={formData.diabetes} onValueChange={(value) => setFormData({...formData, diabetes: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="diabetes-no" />
                  <Label htmlFor="diabetes-no">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="diabetes-yes" />
                  <Label htmlFor="diabetes-yes">نعم</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>ارتفاع ضغط الدم؟</Label>
              <RadioGroup value={formData.hypertension} onValueChange={(value) => setFormData({...formData, hypertension: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="bp-no" />
                  <Label htmlFor="bp-no">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="bp-yes" />
                  <Label htmlFor="bp-yes">نعم</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>مستوى الكوليسترول</Label>
              <Select value={formData.cholesterol} onValueChange={(value) => setFormData({...formData, cholesterol: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">طبيعي</SelectItem>
                  <SelectItem value="borderline">مرتفع قليلاً</SelectItem>
                  <SelectItem value="high">مرتفع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={assessHeartRisk} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.gender || !formData.weight || !formData.height}
          >
            تقييم مخاطر أمراض القلب
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
                  <div className="text-3xl font-bold text-brand mb-2">{result.riskScore}/25</div>
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

export default HeartDiseaseRisk;
