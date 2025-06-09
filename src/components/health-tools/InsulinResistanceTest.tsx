
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, AlertTriangle } from 'lucide-react';

const InsulinResistanceTest = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    waist: '',
    familyHistory: '',
    exercise: '',
    diet: '',
    sleep: '',
    stress: '',
    cravings: '',
    energy: ''
  });
  const [result, setResult] = useState<any>(null);

  const assessInsulinResistance = () => {
    let riskScore = 0;
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const waist = parseFloat(formData.waist);
    const bmi = weight / Math.pow(height / 100, 2);

    // تقييم عوامل الخطر
    if (age >= 45) riskScore += 2;
    else if (age >= 35) riskScore += 1;

    if (bmi >= 30) riskScore += 3;
    else if (bmi >= 25) riskScore += 2;

    // محيط الخصر
    if (formData.gender === 'male' && waist >= 102) riskScore += 2;
    else if (formData.gender === 'male' && waist >= 94) riskScore += 1;
    else if (formData.gender === 'female' && waist >= 88) riskScore += 2;
    else if (formData.gender === 'female' && waist >= 80) riskScore += 1;

    if (formData.familyHistory === 'yes') riskScore += 2;
    if (formData.exercise === 'none') riskScore += 2;
    else if (formData.exercise === 'low') riskScore += 1;

    if (formData.diet === 'poor') riskScore += 2;
    else if (formData.diet === 'average') riskScore += 1;

    if (formData.sleep === 'poor') riskScore += 1;
    if (formData.stress === 'high') riskScore += 1;
    if (formData.cravings === 'frequent') riskScore += 2;
    else if (formData.cravings === 'sometimes') riskScore += 1;

    if (formData.energy === 'low') riskScore += 1;

    let riskLevel: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];

    if (riskScore >= 12) {
      riskLevel = 'very-high';
      category = 'خطر عالي جداً - يتطلب فحص طبي فوري';
      recommendations = [
        'مراجعة طبيب الغدد الصماء فوراً',
        'فحص السكر التراكمي والأنسولين',
        'نظام غذائي منخفض الكربوهيدرات',
        'برنامج تمارين يومي',
        'فقدان الوزن تحت إشراف طبي'
      ];
    } else if (riskScore >= 8) {
      riskLevel = 'high';
      category = 'خطر عالي - يحتاج متابعة طبية';
      recommendations = [
        'استشارة طبية خلال شهر',
        'فحص مقاومة الأنسولين',
        'تقليل السكريات والنشويات',
        'ممارسة الرياضة 5 مرات أسبوعياً',
        'تحسين جودة النوم'
      ];
    } else if (riskScore >= 4) {
      riskLevel = 'moderate';
      category = 'خطر متوسط - احتياطات وقائية';
      recommendations = [
        'فحص دوري كل 6 أشهر',
        'نظام غذائي متوازن',
        'تمارين منتظمة 3 مرات أسبوعياً',
        'تجنب الأطعمة المصنعة',
        'إدارة التوتر'
      ];
    } else {
      riskLevel = 'low';
      category = 'خطر منخفض - استمر في الوقاية';
      recommendations = [
        'الحفاظ على النمط الصحي',
        'فحص دوري سنوي',
        'نظام غذائي صحي',
        'ممارسة الرياضة بانتظام',
        'الحفاظ على وزن صحي'
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
            <Activity className="h-6 w-6" />
            تقييم مقاومة الأنسولين
          </CardTitle>
          <p className="text-gray-600">
            تقييم مخاطر الإصابة بمقاومة الأنسولين والسكري المبكر
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
              <Label htmlFor="waist">محيط الخصر (سم)</Label>
              <Input
                id="waist"
                type="number"
                placeholder="85"
                value={formData.waist}
                onChange={(e) => setFormData({...formData, waist: e.target.value})}
              />
            </div>

            <div>
              <Label>تاريخ عائلي للسكري؟</Label>
              <RadioGroup value={formData.familyHistory} onValueChange={(value) => setFormData({...formData, familyHistory: value})}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="no" id="family-no" />
                  <Label htmlFor="family-no">لا</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yes" id="family-yes" />
                  <Label htmlFor="family-yes">نعم</Label>
                </div>
              </RadioGroup>
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

            <div>
              <Label>جودة النظام الغذائي</Label>
              <Select value={formData.diet} onValueChange={(value) => setFormData({...formData, diet: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">ممتاز (طبيعي ومتوازن)</SelectItem>
                  <SelectItem value="good">جيد</SelectItem>
                  <SelectItem value="average">متوسط</SelectItem>
                  <SelectItem value="poor">سيء (وجبات سريعة)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={assessInsulinResistance} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.gender || !formData.weight || !formData.height}
          >
            تقييم مقاومة الأنسولين
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
                  <div className="text-3xl font-bold text-brand mb-2">{result.riskScore}/18</div>
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

export default InsulinResistanceTest;
