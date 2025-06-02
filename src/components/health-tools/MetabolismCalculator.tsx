
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Activity } from 'lucide-react';

const MetabolismCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    bodyFat: '',
    muscleMass: ''
  });
  const [result, setResult] = useState<any>(null);

  const calculateMetabolism = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const bodyFat = parseFloat(formData.bodyFat) || 0;

    // حساب BMR باستخدام معادلة Mifflin-St Jeor
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // تعديل BMR بناءً على نسبة الدهون إذا توفرت
    if (bodyFat > 0) {
      const leanBodyMass = weight * (1 - bodyFat / 100);
      bmr = bmr * (1 + (leanBodyMass - weight * 0.8) / (weight * 0.2) * 0.1);
    }

    // حساب TDEE بناءً على مستوى النشاط
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };

    const tdee = bmr * (activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers] || 1.2);

    // تقييم سرعة الايض
    const avgBMR = formData.gender === 'male' ? 1800 : 1500;
    const metabolismRate = (bmr / avgBMR) * 100;

    let metabolismCategory = '';
    let recommendations = [];

    if (metabolismRate >= 110) {
      metabolismCategory = 'سريع جداً - حرق عالي للسعرات';
      recommendations = [
        'زيادة السعرات الحرارية لتجنب فقدان الوزن غير المرغوب',
        'تناول وجبات متكررة صغيرة',
        'التركيز على الكربوهيدرات المعقدة',
        'شرب الماء بكثرة',
        'مراقبة مستوى الطاقة'
      ];
    } else if (metabolismRate >= 95) {
      metabolismCategory = 'سريع - حرق جيد للسعرات';
      recommendations = [
        'الحفاظ على النظام الغذائي المتوازن',
        'ممارسة التمارين بانتظام',
        'تناول البروتين الكافي',
        'النوم الجيد',
        'إدارة التوتر'
      ];
    } else if (metabolismRate >= 85) {
      metabolismCategory = 'طبيعي - معدل حرق متوسط';
      recommendations = [
        'زيادة النشاط البدني',
        'تمارين المقاومة لبناء العضلات',
        'تناول الشاي الأخضر',
        'تجنب الحميات القاسية',
        'شرب الماء البارد'
      ];
    } else {
      metabolismCategory = 'بطيء - حرق منخفض للسعرات';
      recommendations = [
        'تمارين المقاومة لزيادة الكتلة العضلية',
        'تناول البروتين في كل وجبة',
        'تجنب تخطي الوجبات',
        'زيادة الحركة اليومية',
        'فحص الغدة الدرقية',
        'تقليل السعرات تدريجياً فقط'
      ];
    }

    // حساب السعرات لأهداف مختلفة
    const calorieGoals = {
      maintain: Math.round(tdee),
      lose: Math.round(tdee - 500),
      gain: Math.round(tdee + 500),
      loseAggressive: Math.round(tdee - 750),
      gainAggressive: Math.round(tdee + 750)
    };

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      metabolismRate: Math.round(metabolismRate),
      metabolismCategory,
      recommendations,
      calorieGoals
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Zap className="h-6 w-6" />
            حاسبة الأيض والحرق
          </CardTitle>
          <p className="text-gray-600">
            احسب معدل الأيض الأساسي وسرعة حرق السعرات الحرارية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
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
              <Label>مستوى النشاط</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => setFormData({...formData, activityLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">قليل النشاط (مكتبي)</SelectItem>
                  <SelectItem value="light">نشاط خفيف (1-3 أيام)</SelectItem>
                  <SelectItem value="moderate">نشاط متوسط (3-5 أيام)</SelectItem>
                  <SelectItem value="active">نشاط عالي (6-7 أيام)</SelectItem>
                  <SelectItem value="very-active">نشاط عالي جداً (مرتين يومياً)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bodyFat">نسبة الدهون % (اختياري)</Label>
              <Input
                id="bodyFat"
                type="number"
                placeholder="15"
                value={formData.bodyFat}
                onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={calculateMetabolism} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.gender || !formData.weight || !formData.height || !formData.activityLevel}
          >
            احسب معدل الأيض
          </Button>

          {result && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-brand/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand">{result.bmr}</div>
                    <div className="text-sm text-gray-600">معدل الأيض الأساسي (BMR)</div>
                    <div className="text-xs text-gray-500">سعرة حرارية في الراحة</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand">{result.tdee}</div>
                    <div className="text-sm text-gray-600">إجمالي الطاقة المطلوبة (TDEE)</div>
                    <div className="text-xs text-gray-500">سعرة حرارية يومياً</div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-brand mb-2">%{result.metabolismRate}</div>
                  <div className={`text-lg font-semibold p-3 rounded-lg ${
                    result.metabolismRate >= 110 ? 'bg-red-100 text-red-800' :
                    result.metabolismRate >= 95 ? 'bg-green-100 text-green-800' :
                    result.metabolismRate >= 85 ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {result.metabolismCategory}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">أهداف السعرات اليومية</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>فقدان وزن تدريجي:</span>
                        <span className="font-semibold">{result.calorieGoals.lose}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الحفاظ على الوزن:</span>
                        <span className="font-semibold">{result.calorieGoals.maintain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>زيادة الوزن تدريجي:</span>
                        <span className="font-semibold">{result.calorieGoals.gain}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-brand" />
                      التوصيات
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {result.recommendations.slice(0, 4).map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-brand text-lg">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetabolismCalculator;
