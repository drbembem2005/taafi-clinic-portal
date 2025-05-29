
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateStepsCalories } from '@/utils/healthCalculations';
import { StepsCaloriesResult } from '@/types/healthTools';

const StepsCaloriesCalculator = () => {
  const [formData, setFormData] = useState({
    steps: '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    intensity: ''
  });
  const [result, setResult] = useState<StepsCaloriesResult | null>(null);

  const handleCalculate = () => {
    if (!formData.steps || !formData.weight || !formData.height || !formData.age || !formData.gender) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    const calculatedResult = calculateStepsCalories(
      parseInt(formData.steps),
      parseFloat(formData.weight),
      parseFloat(formData.height),
      parseInt(formData.age),
      formData.gender,
      formData.intensity
    );

    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة خطوات المشي إلى سعرات حرارية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steps" className="text-right block">عدد الخطوات</Label>
              <Input
                id="steps"
                type="number"
                placeholder="10000"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="text-right"
              />
            </div>
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
            <div className="space-y-2">
              <Label className="text-right block">شدة المشي</Label>
              <Select value={formData.intensity} onValueChange={(value) => setFormData({ ...formData, intensity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر شدة المشي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">بطيء (أقل من 3 كم/س)</SelectItem>
                  <SelectItem value="moderate">متوسط (3-5 كم/س)</SelectItem>
                  <SelectItem value="fast">سريع (5-6.5 كم/س)</SelectItem>
                  <SelectItem value="veryFast">سريع جداً (أكثر من 6.5 كم/س)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب السعرات المحروقة
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج تحليل المشي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.caloriesBurned}</div>
                <div className="text-sm text-gray-600">سعرة حرارية محروقة</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.distance.toFixed(2)}</div>
                <div className="text-sm text-gray-600">كيلومتر مقطوع</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.activeMinutes}</div>
                <div className="text-sm text-gray-600">دقيقة نشاط</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">توصيات تحسين المشي:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">خطة أسبوعية مقترحة:</h4>
              <ul className="space-y-2">
                {result.weeklyProgress.map((day, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">📅</span>
                    <span className="text-gray-700">{day}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-bold text-green-900 mb-2">نصائح لتتبع الخطوات:</h5>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• استخدم تطبيقات الهاتف أو ساعة ذكية لتتبع دقيق</li>
                <li>• اهدف إلى 10,000 خطوة يومياً كحد أدنى</li>
                <li>• قسم المشي على فترات متعددة خلال اليوم</li>
                <li>• زد الشدة تدريجياً لحرق سعرات أكثر</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepsCaloriesCalculator;
