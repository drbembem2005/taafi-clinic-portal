
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calculator, Shield, Phone } from 'lucide-react';
import { calculateSafeDosage } from '@/utils/healthCalculations';
import { MedicationDosageResult } from '@/types/healthTools';
import { useAnalytics } from '@/hooks/useAnalytics';

const MedicationDosage = () => {
  const [weight, setWeight] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [result, setResult] = useState<MedicationDosageResult | null>(null);
  const { trackHealthTool } = useAnalytics();

  const handleCalculate = () => {
    if (!weight || !ageMonths) return;
    
    const calculatedResult = calculateSafeDosage(
      parseFloat(weight),
      parseInt(ageMonths),
      'paracetamol'
    );
    setResult(calculatedResult);
    
    trackHealthTool.completed('medication-dosage', 'حاسبة الجرعة الآمنة للأطفال');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            حاسبة الجرعة الآمنة للأطفال
          </CardTitle>
          <p className="text-green-600 mt-2">
            باراسيتامول وإيبوبروفين - جرعات آمنة حسب الوزن والعمر
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="text-base font-semibold text-gray-700">
                وزن الطفل (كجم)
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-2 text-lg"
                placeholder="أدخل الوزن"
                min="2"
                max="50"
              />
            </div>
            
            <div>
              <Label htmlFor="ageMonths" className="text-base font-semibold text-gray-700">
                العمر (بالشهور)
              </Label>
              <Input
                id="ageMonths"
                type="number"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                className="mt-2 text-lg"
                placeholder="أدخل العمر"
                min="1"
                max="216"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleCalculate}
            disabled={!weight || !ageMonths}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-xl"
          >
            <Shield className="ml-2 h-5 w-5" />
            احسب الجرعة الآمنة
          </Button>

          {result && (
            <div className="space-y-6 mt-8">
              {/* Warnings */}
              {result.warnings.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-red-800 mb-2">تحذيرات مهمة</h3>
                        <ul className="space-y-1">
                          {result.warnings.map((warning, index) => (
                            <li key={index} className="text-red-700 text-sm">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Paracetamol Dosage */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <Calculator className="h-5 w-5" />
                    باراسيتامول (أسيتامينوفين)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">الجرعة الواحدة</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {result.paracetamol.singleDose} مج
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">كل 6 ساعات عند الحاجة</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">الحد الأقصى اليومي</span>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          {result.paracetamol.maxDailyDose} مج
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">لا تتجاوزي هذه الكمية</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ibuprofen Dosage */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
                    <Calculator className="h-5 w-5" />
                    إيبوبروفين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.ibuprofen.ageRestriction ? (
                    <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">غير مناسب للأطفال أقل من 6 شهور</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">الجرعة الواحدة</span>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            {result.ibuprofen.singleDose} مج
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">كل 8 ساعات عند الحاجة</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">الحد الأقصى اليومي</span>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">
                            {result.ibuprofen.maxDailyDose} مج
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">لا تتجاوزي هذه الكمية</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    نصائح مهمة للاستخدام الآمن
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Emergency Information */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    معلومات الطوارئ
                  </h3>
                  <ul className="space-y-2">
                    {result.emergencyInfo.map((info, index) => (
                      <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {info}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-xs font-medium">
                      ⚠️ تنبيه: هذه المعلومات للإرشاد فقط ولا تغني عن استشارة الطبيب أو الصيدلي
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

export default MedicationDosage;
