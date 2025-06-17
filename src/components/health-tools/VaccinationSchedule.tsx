
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle, Baby, Syringe } from 'lucide-react';
import { calculateVaccinationSchedule } from '@/utils/healthCalculations';
import { VaccinationResult } from '@/types/healthTools';
import { useAnalytics } from '@/hooks/useAnalytics';

const VaccinationSchedule = () => {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<VaccinationResult | null>(null);
  const [showOptional, setShowOptional] = useState(false);
  const { trackHealthTool } = useAnalytics();

  const handleCalculate = () => {
    if (!birthDate) return;
    
    const birth = new Date(birthDate);
    const calculatedResult = calculateVaccinationSchedule(birth);
    setResult(calculatedResult);
    
    trackHealthTool.completed('vaccination-schedule', 'حاسبة مواعيد تطعيمات الأطفال');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (vaccine: any) => {
    if (vaccine.isOverdue) {
      return <Badge variant="destructive" className="text-xs">متأخر</Badge>;
    }
    if (vaccine.isDue) {
      return <Badge variant="default" className="text-xs bg-orange-500">مستحق</Badge>;
    }
    if (vaccine.dueDate <= new Date()) {
      return <Badge variant="secondary" className="text-xs bg-green-500 text-white">مكتمل</Badge>;
    }
    return <Badge variant="outline" className="text-xs">قادم</Badge>;
  };

  const mandatoryVaccines = result?.schedule.filter(v => v.category === 'mandatory') || [];
  const optionalVaccines = result?.schedule.filter(v => v.category === 'optional') || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Syringe className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            حاسبة مواعيد تطعيمات الأطفال
          </CardTitle>
          <p className="text-blue-600 mt-2">
            جدول التطعيمات حسب وزارة الصحة المصرية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate" className="text-base font-semibold text-gray-700">
                تاريخ ميلاد الطفل
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2 text-lg"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <Button 
              onClick={handleCalculate}
              disabled={!birthDate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl"
            >
              <Calendar className="ml-2 h-5 w-5" />
              احسب جدول التطعيمات
            </Button>
          </div>

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

              {/* Progress Summary */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">التقدم العام</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">
                      {result.completedCount} / {result.totalCount}
                    </span>
                  </div>
                  {result.nextDue && (
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">التطعيم القادم:</p>
                      <p className="font-semibold text-green-800">{result.nextDue.arabicName}</p>
                      <p className="text-sm text-gray-600">موعد الاستحقاق: {formatDate(result.nextDue.dueDate)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mandatory Vaccines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Baby className="h-5 w-5 text-blue-600" />
                    التطعيمات الإجبارية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mandatoryVaccines.map((vaccine, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{vaccine.arabicName}</h4>
                            {getStatusBadge(vaccine)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{vaccine.description}</p>
                          <p className="text-xs text-gray-500">العمر: {vaccine.ageDisplay}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(vaccine.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optional Vaccines */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Syringe className="h-5 w-5 text-purple-600" />
                      التطعيمات الاختيارية (مُوصى بها)
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOptional(!showOptional)}
                    >
                      {showOptional ? 'إخفاء' : 'عرض'}
                    </Button>
                  </div>
                </CardHeader>
                {showOptional && (
                  <CardContent>
                    <div className="space-y-3">
                      {optionalVaccines.map((vaccine, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{vaccine.arabicName}</h4>
                              {getStatusBadge(vaccine)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{vaccine.description}</p>
                            <p className="text-xs text-gray-500">العمر: {vaccine.ageDisplay}</p>
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-700">
                              {formatDate(vaccine.dueDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Recommendations */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    نصائح مهمة
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-xs font-medium">
                      ⚠️ تنبيه: هذا الجدول للتوعية فقط ولا يغني عن استشارة طبيب الأطفال المختص
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

export default VaccinationSchedule;
