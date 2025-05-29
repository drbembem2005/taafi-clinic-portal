
import React, { useState, useRef } from 'react';
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
    activityLevel: 'moderate'
  });
  const [result, setResult] = useState<BMIResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender) {
      alert('يرجى ملء جميع البيانات المطلوبة');
      return;
    }

    const bmiResult = calculateBMI(
      parseFloat(formData.weight),
      parseFloat(formData.height),
      parseInt(formData.age),
      formData.gender,
      formData.activityLevel
    );
    
    setResult(bmiResult);
    
    // Auto-scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIBgColor = (bmi: number) => {
    if (bmi < 18.5) return 'bg-blue-50 border-blue-200';
    if (bmi < 25) return 'bg-green-50 border-green-200';
    if (bmi < 30) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (result) {
    return (
      <div ref={resultRef} className="space-y-6">
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج حساب مؤشر كتلة الجسم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 md:p-6 rounded-lg border-2 ${getBMIBgColor(result.bmi)}`}>
              <div className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${getBMIColor(result.bmi)} mb-2`}>
                  {result.bmi}
                </div>
                <div className="text-lg md:text-xl text-gray-700 font-medium">
                  {result.category}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">الوزن المثالي</h4>
                <p className="text-gray-700">
                  من {result.idealWeight.min} إلى {result.idealWeight.max} كجم
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">مؤشر كتلة الجسم</h4>
                <p className="text-gray-700">
                  {result.bmi} كجم/م²
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">التوصيات المخصصة:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm md:text-base">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              className="w-full bg-brand hover:bg-brand-dark"
            >
              حساب جديد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-right">حاسبة مؤشر كتلة الجسم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block font-medium">الوزن (كجم)</Label>
              <Input
                type="number"
                placeholder="مثال: 70"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block font-medium">الطول (سم)</Label>
              <Input
                type="number"
                placeholder="مثال: 170"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="text-right"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block font-medium">العمر</Label>
              <Input
                type="number"
                placeholder="مثال: 30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block font-medium">الجنس</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-right block font-medium">مستوى النشاط البدني</Label>
            <Select value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
              <SelectTrigger className="text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">قليل الحركة</SelectItem>
                <SelectItem value="light">نشاط خفيف</SelectItem>
                <SelectItem value="moderate">نشاط متوسط</SelectItem>
                <SelectItem value="active">نشاط عالي</SelectItem>
                <SelectItem value="veryActive">نشاط عالي جداً</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-dark mt-6">
            احسب مؤشر كتلة الجسم
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BMICalculator;
