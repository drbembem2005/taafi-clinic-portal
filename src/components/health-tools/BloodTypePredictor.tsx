
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, Dna, BookOpen, Info } from 'lucide-react';
import { predictBloodType } from '@/utils/healthCalculations';
import { BloodTypeResult } from '@/types/healthTools';
import { useAnalytics } from '@/hooks/useAnalytics';

const BloodTypePredictor = () => {
  const [motherType, setMotherType] = useState('');
  const [fatherType, setFatherType] = useState('');
  const [result, setResult] = useState<BloodTypeResult | null>(null);
  const { trackHealthTool } = useAnalytics();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleCalculate = () => {
    if (!motherType || !fatherType) return;
    
    const calculatedResult = predictBloodType(motherType, fatherType);
    setResult(calculatedResult);
    
    trackHealthTool.completed('blood-type-predictor', 'حاسبة فصيلة الدم للأطفال');
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-200 text-red-900',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-200 text-blue-900',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-200 text-purple-900',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-200 text-green-900'
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Dna className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            حاسبة فصيلة الدم للأطفال
          </CardTitle>
          <p className="text-red-600 mt-2">
            تنبؤ علمي بفصائل الدم المحتملة للطفل
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="motherType" className="text-base font-semibold text-gray-700">
                فصيلة دم الأم
              </Label>
              <Select value={motherType} onValueChange={setMotherType}>
                <SelectTrigger className="mt-2 text-lg">
                  <SelectValue placeholder="اختر فصيلة دم الأم" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Badge className={getBloodTypeColor(type)}>{type}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fatherType" className="text-base font-semibold text-gray-700">
                فصيلة دم الأب
              </Label>
              <Select value={fatherType} onValueChange={setFatherType}>
                <SelectTrigger className="mt-2 text-lg">
                  <SelectValue placeholder="اختر فصيلة دم الأب" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Badge className={getBloodTypeColor(type)}>{type}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleCalculate}
            disabled={!motherType || !fatherType}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold rounded-xl"
          >
            <Heart className="ml-2 h-5 w-5" />
            تنبؤ فصائل الدم المحتملة
          </Button>

          {result && (
            <div className="space-y-6 mt-8">
              {/* Most Likely Result */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-purple-800 mb-2">الفصيلة الأكثر احتمالاً</h3>
                    <Badge className={`text-2xl py-2 px-4 ${getBloodTypeColor(result.mostLikely)}`}>
                      {result.mostLikely}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* All Possibilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Dna className="h-5 w-5 text-purple-600" />
                    جميع الاحتماليات المحتملة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {result.possibleTypes.map((possibility, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <Badge className={`mb-2 ${getBloodTypeColor(possibility.bloodType)}`}>
                          {possibility.bloodType}
                        </Badge>
                        <p className="text-lg font-bold text-gray-800">{possibility.probability}%</p>
                        <p className="text-xs text-gray-500">احتمالية</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Scientific Explanation */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    الشرح العلمي
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">{result.explanation}</p>
                  <p className="text-blue-600 text-sm">{result.genetics}</p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    نصائح مهمة
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-xs font-medium">
                      ⚠️ تنبيه: هذا التنبؤ للتوعية العلمية فقط. فصيلة الدم الفعلية تُحدد بالتحليل المعملي
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodTypePredictor;
