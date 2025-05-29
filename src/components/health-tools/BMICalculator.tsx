
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateBMI } from '@/utils/healthCalculations';
import { BMIResult } from '@/types/healthTools';

const BMICalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: ''
  });
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleCalculate = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    const calculatedResult = calculateBMI(
      parseFloat(formData.weight),
      parseFloat(formData.height),
      parseInt(formData.age),
      formData.gender,
      formData.activityLevel
    );

    setResult(calculatedResult);
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة مؤشر كتلة الجسم المتقدمة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-right block">الوزن (كيلوغرام)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-right block">الطول (سنتيمتر)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-right block">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الجنس</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-right block">مستوى النشاط البدني</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">قليل الحركة (عمل مكتبي)</SelectItem>
                  <SelectItem value="light">نشاط خفيف (1-3 أيام/أسبوع)</SelectItem>
                  <SelectItem value="moderate">نشاط متوسط (3-5 أيام/أسبوع)</SelectItem>
                  <SelectItem value="active">نشاط عالي (6-7 أيام/أسبوع)</SelectItem>
                  <SelectItem value="veryActive">نشاط مكثف (تمرين مرتين يومياً)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب مؤشر كتلة الجسم
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج التحليل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getBMIColor(result.bmi)} mb-2`}>
                {result.bmi}
              </div>
              <div className="text-lg font-medium text-gray-700">{result.category}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">النطاق الصحي للوزن:</h4>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-center">
                    {result.idealWeight.min} - {result.idealWeight.max} كيلوغرام
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">مؤشر كتلة الجسم:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>نقص في الوزن</span>
                    <span className="text-blue-600">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وزن طبيعي</span>
                    <span className="text-green-600">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>زيادة في الوزن</span>
                    <span className="text-yellow-600">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>سمنة</span>
                    <span className="text-red-600">&gt; 30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">التوصيات الشخصية:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ هذه النتائج مخصصة للتوعية الصحية فقط ولا تغني عن الاستشارة الطبية المتخصصة
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BMICalculator;
