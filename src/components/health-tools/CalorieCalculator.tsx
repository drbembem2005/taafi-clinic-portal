
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateCalories } from '@/utils/healthCalculations';
import { CalorieResult } from '@/types/healthTools';

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    goal: ''
  });
  const [result, setResult] = useState<CalorieResult | null>(null);

  const handleCalculate = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender || !formData.activityLevel) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    const calculatedResult = calculateCalories(
      parseFloat(formData.weight),
      parseFloat(formData.height),
      parseInt(formData.age),
      formData.gender,
      formData.activityLevel,
      formData.goal
    );

    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة السعرات الحرارية المتطورة</CardTitle>
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
            <div className="space-y-2">
              <Label className="text-right block">مستوى النشاط البدني</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">قليل الحركة</SelectItem>
                  <SelectItem value="light">نشاط خفيف</SelectItem>
                  <SelectItem value="moderate">نشاط متوسط</SelectItem>
                  <SelectItem value="active">نشاط عالي</SelectItem>
                  <SelectItem value="veryActive">نشاط مكثف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الهدف</Label>
              <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر هدفك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">إنقاص الوزن</SelectItem>
                  <SelectItem value="maintain">الحفاظ على الوزن</SelectItem>
                  <SelectItem value="gain">زيادة الوزن</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب احتياجك من السعرات
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج التحليل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.bmr}</div>
                <div className="text-sm text-gray-600">معدل الأيض الأساسي (BMR)</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.tdee}</div>
                <div className="text-sm text-gray-600">إجمالي الطاقة اليومية (TDEE)</div>
              </div>
              <div className="p-4 bg-brand/10 rounded-lg">
                <div className="text-2xl font-bold text-brand">{result.targetCalories}</div>
                <div className="text-sm text-gray-600">السعرات المستهدفة</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">توزيع المغذيات الكبرى:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600">{result.macros.protein}g</div>
                  <div className="text-sm text-gray-600">البروتين (30%)</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-600">{result.macros.carbs}g</div>
                  <div className="text-sm text-gray-600">الكربوهيدرات (40%)</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">{result.macros.fats}g</div>
                  <div className="text-sm text-gray-600">الدهون (30%)</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">خطة توزيع الوجبات:</h4>
              <ul className="space-y-2">
                {result.mealPlan.map((meal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">•</span>
                    <span className="text-gray-700">{meal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 تذكر أن هذه التقديرات تعتمد على معادلات علمية عامة وقد تختلف الاحتياجات الفردية
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalorieCalculator;
