
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, TrendingUp } from 'lucide-react';

const MuscleMassCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    bodyFat: '',
    activityLevel: '',
    waist: '',
    neck: '',
    hip: ''
  });
  const [result, setResult] = useState<any>(null);

  const calculateMuscleMass = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const waist = parseFloat(formData.waist);
    const neck = parseFloat(formData.neck);
    const hip = parseFloat(formData.hip);

    // حساب نسبة الدهون إذا لم تدخل
    let bodyFatPercentage = parseFloat(formData.bodyFat);
    
    if (!bodyFatPercentage) {
      // حساب نسبة الدهون باستخدام معادلة US Navy
      if (formData.gender === 'male') {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }
    }

    // حساب الكتلة العضلية
    const fatMass = weight * (bodyFatPercentage / 100);
    const leanBodyMass = weight - fatMass;
    const muscleMass = leanBodyMass * 0.85; // تقدير أن 85% من الكتلة الخالية من الدهون عضلات

    // حساب BMI
    const bmi = weight / Math.pow(height / 100, 2);

    // حساب مؤشر الكتلة العضلية (MMI)
    const muscleMassIndex = muscleMass / Math.pow(height / 100, 2);

    // تقييم الكتلة العضلية بناءً على العمر والجنس
    let muscleCategory = '';
    let recommendations: string[] = [];
    let targetRange = { min: 0, max: 0 };

    if (formData.gender === 'male') {
      targetRange = { min: 11, max: 13.5 };
      if (muscleMassIndex >= 13.5) {
        muscleCategory = 'ممتاز - كتلة عضلية عالية';
        recommendations = [
          'الحفاظ على البرنامج التدريبي الحالي',
          'التأكد من الراحة الكافية للتعافي',
          'مراقبة التوازن بين القوة والمرونة',
          'تجنب الإفراط في التدريب'
        ];
      } else if (muscleMassIndex >= 11) {
        muscleCategory = 'جيد - كتلة عضلية طبيعية';
        recommendations = [
          'زيادة تدريبات المقاومة تدريجياً',
          'التركيز على البروتين في النظام الغذائي',
          'تمارين مركبة لكامل الجسم',
          'قياس التقدم كل شهر'
        ];
      } else if (muscleMassIndex >= 9) {
        muscleCategory = 'أقل من المثالي - يحتاج تحسين';
        recommendations = [
          'برنامج تدريب مقاومة منتظم',
          'زيادة تناول البروتين إلى 1.6-2جم/كجم',
          'تمارين القوة 3-4 مرات أسبوعياً',
          'استشارة مدرب لياقة متخصص'
        ];
      } else {
        muscleCategory = 'منخفض - يتطلب تدخل عاجل';
        recommendations = [
          'استشارة طبية لاستبعاد الأمراض',
          'برنامج تدريبي تدريجي مع مختص',
          'تقييم التغذية مع أخصائي',
          'فحوصات للهرمونات إذا لزم الأمر'
        ];
      }
    } else {
      targetRange = { min: 8.5, max: 11 };
      if (muscleMassIndex >= 11) {
        muscleCategory = 'ممتاز - كتلة عضلية عالية';
        recommendations = [
          'الحفاظ على التدريب المتوازن',
          'التأكد من التغذية المتوازنة',
          'تمارين المرونة والتوازن',
          'متابعة الدورة الهرمونية'
        ];
      } else if (muscleMassIndex >= 8.5) {
        muscleCategory = 'جيد - كتلة عضلية طبيعية';
        recommendations = [
          'تدريبات المقاومة 2-3 مرات أسبوعياً',
          'التركيز على البروتين والكالسيوم',
          'تمارين تحمل الوزن',
          'مراقبة التغيرات الهرمونية'
        ];
      } else if (muscleMassIndex >= 7) {
        muscleCategory = 'أقل من المثالي - يحتاج تحسين';
        recommendations = [
          'برنامج تقوية عضلية متدرج',
          'زيادة البروتين في النظام الغذائي',
          'تمارين الوزن الخفيف',
          'استشارة أخصائي تغذية'
        ];
      } else {
        muscleCategory = 'منخفض - يتطلب انتباه';
        recommendations = [
          'فحص طبي شامل',
          'تقييم الحالة الهرمونية',
          'برنامج غذائي وتدريبي متخصص',
          'متابعة دورية مع الطبيب'
        ];
      }
    }

    // حساب السعرات المطلوبة لبناء العضلات
    let basalMetabolicRate;
    if (formData.gender === 'male') {
      basalMetabolicRate = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      basalMetabolicRate = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };

    const tdee = basalMetabolicRate * (activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers] || 1.2);
    const bulkingCalories = tdee + 300; // فائض سعرات لبناء العضلات

    setResult({
      muscleMass: Math.round(muscleMass * 10) / 10,
      muscleMassIndex: Math.round(muscleMassIndex * 10) / 10,
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      leanBodyMass: Math.round(leanBodyMass * 10) / 10,
      muscleCategory,
      recommendations,
      targetRange,
      bmi: Math.round(bmi * 10) / 10,
      bulkingCalories: Math.round(bulkingCalories)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Dumbbell className="h-6 w-6" />
            حاسبة مؤشر الكتلة العضلية
          </CardTitle>
          <p className="text-gray-600">
            احسب كتلتك العضلية ونسبة العضلات إلى الدهون
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
              <Label htmlFor="neck">محيط الرقبة (سم)</Label>
              <Input
                id="neck"
                type="number"
                placeholder="38"
                value={formData.neck}
                onChange={(e) => setFormData({...formData, neck: e.target.value})}
              />
            </div>

            {formData.gender === 'female' && (
              <div>
                <Label htmlFor="hip">محيط الورك (سم)</Label>
                <Input
                  id="hip"
                  type="number"
                  placeholder="95"
                  value={formData.hip}
                  onChange={(e) => setFormData({...formData, hip: e.target.value})}
                />
              </div>
            )}

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

            <div>
              <Label>مستوى النشاط</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => setFormData({...formData, activityLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">قليل النشاط</SelectItem>
                  <SelectItem value="light">نشاط خفيف</SelectItem>
                  <SelectItem value="moderate">نشاط متوسط</SelectItem>
                  <SelectItem value="active">نشاط عالي</SelectItem>
                  <SelectItem value="very-active">نشاط عالي جداً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateMuscleMass} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.gender || !formData.weight || !formData.height || !formData.waist || !formData.neck}
          >
            احسب الكتلة العضلية
          </Button>

          {result && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-brand/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand">{result.muscleMass}</div>
                    <div className="text-sm text-gray-600">كيلو عضلات</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand">{result.muscleMassIndex}</div>
                    <div className="text-sm text-gray-600">مؤشر الكتلة العضلية</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand">%{result.bodyFatPercentage}</div>
                    <div className="text-sm text-gray-600">نسبة الدهون</div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.muscleMassIndex >= result.targetRange.max ? 'bg-green-100 text-green-800' :
                    result.muscleMassIndex >= result.targetRange.min ? 'bg-blue-100 text-blue-800' :
                    result.muscleMassIndex >= result.targetRange.min * 0.8 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.muscleCategory}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    المعدل المثالي: {result.targetRange.min} - {result.targetRange.max}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">معلومات إضافية</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>الكتلة الخالية من الدهون:</span>
                        <span className="font-semibold">{result.leanBodyMass} كجم</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مؤشر كتلة الجسم:</span>
                        <span className="font-semibold">{result.bmi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>سعرات بناء العضلات:</span>
                        <span className="font-semibold">{result.bulkingCalories}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-brand" />
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

export default MuscleMassCalculator;
