
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, AlertTriangle } from 'lucide-react';

const EyeHealthAssessment = () => {
  const [formData, setFormData] = useState({
    age: '',
    screenTime: '',
    eyeStrain: '',
    dryEyes: '',
    blurredVision: '',
    headaches: '',
    familyHistory: '',
    diabetes: '',
    smoking: '',
    sunglasses: '',
    lastExam: ''
  });
  const [result, setResult] = useState<any>(null);

  const assessEyeHealth = () => {
    let riskScore = 0;
    const age = parseInt(formData.age);

    // تقييم عوامل الخطر
    if (age >= 60) riskScore += 3;
    else if (age >= 45) riskScore += 2;
    else if (age >= 30) riskScore += 1;

    if (formData.screenTime === 'high') riskScore += 2;
    else if (formData.screenTime === 'moderate') riskScore += 1;

    if (formData.eyeStrain === 'frequent') riskScore += 2;
    else if (formData.eyeStrain === 'sometimes') riskScore += 1;

    if (formData.dryEyes === 'frequent') riskScore += 2;
    if (formData.blurredVision === 'yes') riskScore += 3;
    if (formData.headaches === 'frequent') riskScore += 2;
    if (formData.familyHistory === 'yes') riskScore += 2;
    if (formData.diabetes === 'yes') riskScore += 3;
    if (formData.smoking === 'yes') riskScore += 2;
    if (formData.sunglasses === 'never') riskScore += 1;
    if (formData.lastExam === 'never' || formData.lastExam === 'long') riskScore += 2;

    let riskLevel: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];

    if (riskScore >= 15) {
      riskLevel = 'very-high';
      category = 'خطر عالي جداً - يتطلب فحص عيون فوري';
      recommendations = [
        'مراجعة طبيب العيون فوراً',
        'فحص شامل للعين والشبكية',
        'قياس ضغط العين',
        'تجنب إجهاد العين نهائياً',
        'استخدام نظارات طبية إذا لزم الأمر'
      ];
    } else if (riskScore >= 10) {
      riskLevel = 'high';
      category = 'خطر عالي - يحتاج فحص طبي';
      recommendations = [
        'حجز موعد مع طبيب العيون',
        'تقليل وقت الشاشات',
        'استخدام قطرات مرطبة للعين',
        'تطبيق قاعدة 20-20-20',
        'ارتداء نظارات شمسية'
      ];
    } else if (riskScore >= 6) {
      riskLevel = 'moderate';
      category = 'خطر متوسط - احتياطات وقائية';
      recommendations = [
        'فحص دوري كل سنتين',
        'راحة العين كل 20 دقيقة',
        'إضاءة مناسبة عند القراءة',
        'تناول فيتامينات العين',
        'تجنب فرك العينين'
      ];
    } else {
      riskLevel = 'low';
      category = 'صحة عيون جيدة - استمر في الوقاية';
      recommendations = [
        'الحفاظ على العادات الصحية',
        'فحص دوري كل 3 سنوات',
        'حماية العين من الشمس',
        'نظام غذائي غني بالفيتامينات',
        'تجنب التدخين'
      ];
    }

    setResult({
      riskScore,
      riskLevel,
      category,
      recommendations
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Eye className="h-6 w-6" />
            تقييم صحة العين والرؤية
          </CardTitle>
          <p className="text-gray-600">
            تقييم أولي لصحة عينيك ومخاطر مشاكل الرؤية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="35"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div>
              <Label>وقت الشاشات يومياً</Label>
              <Select value={formData.screenTime} onValueChange={(value) => setFormData({...formData, screenTime: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">أقل من 4 ساعات</SelectItem>
                  <SelectItem value="moderate">4-8 ساعات</SelectItem>
                  <SelectItem value="high">أكثر من 8 ساعات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>هل تشعر بإجهاد العين؟</Label>
              <RadioGroup value={formData.eyeStrain} onValueChange={(value) => setFormData({...formData, eyeStrain: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="never" id="strain-never" />
                  <Label htmlFor="strain-never">لا أبداً</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="sometimes" id="strain-sometimes" />
                  <Label htmlFor="strain-sometimes">أحياناً</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="frequent" id="strain-frequent" />
                  <Label htmlFor="strain-frequent">كثيراً</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>جفاف العينين؟</Label>
              <RadioGroup value={formData.dryEyes} onValueChange={(value) => setFormData({...formData, dryEyes: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="never" id="dry-never" />
                  <Label htmlFor="dry-never">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="sometimes" id="dry-sometimes" />
                  <Label htmlFor="dry-sometimes">أحياناً</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="frequent" id="dry-frequent" />
                  <Label htmlFor="dry-frequent">كثيراً</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>تشويش في الرؤية؟</Label>
              <RadioGroup value={formData.blurredVision} onValueChange={(value) => setFormData({...formData, blurredVision: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="blur-no" />
                  <Label htmlFor="blur-no">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="blur-yes" />
                  <Label htmlFor="blur-yes">نعم</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>صداع متكرر؟</Label>
              <RadioGroup value={formData.headaches} onValueChange={(value) => setFormData({...formData, headaches: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="never" id="head-never" />
                  <Label htmlFor="head-never">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="sometimes" id="head-sometimes" />
                  <Label htmlFor="head-sometimes">أحياناً</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="frequent" id="head-frequent" />
                  <Label htmlFor="head-frequent">كثيراً</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button 
            onClick={assessEyeHealth} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.screenTime}
          >
            تقييم صحة العين
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
                  <div className="text-3xl font-bold text-brand mb-2">{result.riskScore}/20</div>
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

export default EyeHealthAssessment;
