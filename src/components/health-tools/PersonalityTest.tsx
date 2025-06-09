
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Brain, Users, Eye, Lightbulb } from 'lucide-react';

const PersonalityTest = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);

  const questions = [
    { 
      id: 'q1', 
      text: 'في التجمعات الاجتماعية، أفضل:', 
      options: [
        { value: 'E', text: 'التحدث مع أكبر عدد من الناس' },
        { value: 'I', text: 'التحدث مع صديق واحد أو اثنين' }
      ]
    },
    { 
      id: 'q2', 
      text: 'عند اتخاذ القرارات، أعتمد أكثر على:', 
      options: [
        { value: 'T', text: 'المنطق والتحليل الموضوعي' },
        { value: 'F', text: 'المشاعر والقيم الشخصية' }
      ]
    },
    { 
      id: 'q3', 
      text: 'أشعر بالراحة أكثر عندما:', 
      options: [
        { value: 'J', text: 'أخطط للأمور مسبقاً' },
        { value: 'P', text: 'أترك الأمور مفتوحة للتغيير' }
      ]
    },
    { 
      id: 'q4', 
      text: 'أركز أكثر على:', 
      options: [
        { value: 'S', text: 'الحقائق والتفاصيل الملموسة' },
        { value: 'N', text: 'الأفكار والاحتمالات المستقبلية' }
      ]
    },
    { 
      id: 'q5', 
      text: 'أستمد طاقتي من:', 
      options: [
        { value: 'E', text: 'التفاعل مع الآخرين' },
        { value: 'I', text: 'قضاء الوقت وحيداً' }
      ]
    },
    { 
      id: 'q6', 
      text: 'عند حل المشاكل، أفضل:', 
      options: [
        { value: 'T', text: 'تحليل الأسباب والنتائج بموضوعية' },
        { value: 'F', text: 'مراعاة تأثير الحل على الناس' }
      ]
    },
    { 
      id: 'q7', 
      text: 'أفضل المشاريع التي:', 
      options: [
        { value: 'J', text: 'لها خطة واضحة وجدول زمني' },
        { value: 'P', text: 'تسمح بالمرونة والتجريب' }
      ]
    },
    { 
      id: 'q8', 
      text: 'أهتم أكثر بـ:', 
      options: [
        { value: 'S', text: 'ما يحدث الآن وما هو واقعي' },
        { value: 'N', text: 'ما يمكن أن يحدث وما هو محتمل' }
      ]
    }
  ];

  const personalityTypes = {
    'ESTJ': {
      name: 'المدير التنفيذي',
      description: 'منظم وعملي وقائد طبيعي، يحب النظام والكفاءة',
      strengths: ['القيادة', 'التنظيم', 'اتخاذ القرارات', 'الموثوقية'],
      careers: ['إدارة الأعمال', 'القانون', 'الطب', 'الهندسة'],
      tips: ['تعلم المرونة أكثر', 'استمع لوجهات نظر الآخرين', 'خذ وقتاً للاسترخاء']
    },
    'ENTJ': {
      name: 'القائد الاستراتيجي',
      description: 'طموح وقائد بالفطرة، يحب التحديات والتطوير',
      strengths: ['الرؤية الاستراتيجية', 'القيادة', 'الطموح', 'حل المشاكل'],
      careers: ['إدارة عليا', 'استشارات', 'ريادة الأعمال', 'السياسة'],
      tips: ['اهتم بمشاعر الفريق', 'تواضع أكثر', 'اصبر على العمليات البطيئة']
    },
    'ESFJ': {
      name: 'المساعد المهتم',
      description: 'مهتم بالآخرين ومتعاون، يحب مساعدة الناس',
      strengths: ['التعاطف', 'التعاون', 'الاهتمام بالآخرين', 'التنظيم'],
      careers: ['التعليم', 'الرعاية الصحية', 'الخدمة الاجتماعية', 'الموارد البشرية'],
      tips: ['لا تهمل احتياجاتك الشخصية', 'تعلم قول لا', 'خذ وقتاً لنفسك']
    },
    'ENFJ': {
      name: 'المرشد الملهم',
      description: 'ملهم ومتعاطف، يحب تطوير الآخرين وإرشادهم',
      strengths: ['الإلهام', 'التعاطف', 'الاتصال', 'تطوير الآخرين'],
      careers: ['التدريب', 'الاستشارات النفسية', 'التعليم', 'العلاقات العامة'],
      tips: ['اهتم بصحتك النفسية', 'ضع حدوداً واضحة', 'تقبل النقد البناء']
    },
    'ISTJ': {
      name: 'المنفذ الموثوق',
      description: 'مسؤول وموثوق، يحب النظام والتقاليد',
      strengths: ['الموثوقية', 'الدقة', 'الصبر', 'الانضباط'],
      careers: ['المحاسبة', 'إدارة العمليات', 'الطب', 'القانون'],
      tips: ['جرب أشياء جديدة', 'كن أكثر مرونة', 'عبر عن مشاعرك']
    },
    'INTJ': {
      name: 'المفكر الاستراتيجي',
      description: 'مستقل ومبدع، يحب الأفكار المعقدة والتخطيط',
      strengths: ['التفكير الاستراتيجي', 'الإبداع', 'الاستقلالية', 'الرؤية'],
      careers: ['البحث العلمي', 'التكنولوجيا', 'الاستشارات', 'الكتابة'],
      tips: ['طور مهارات التواصل', 'كن أكثر صبراً مع الآخرين', 'شارك أفكارك']
    },
    'ISFJ': {
      name: 'المدافع المخلص',
      description: 'مخلص ومهتم، يحب خدمة الآخرين وحمايتهم',
      strengths: ['الإخلاص', 'الاهتمام', 'الصبر', 'التفاني'],
      careers: ['التمريض', 'التعليم', 'الخدمة الاجتماعية', 'المكتبات'],
      tips: ['اهتم بنفسك أولاً', 'عبر عن احتياجاتك', 'تقبل التقدير']
    },
    'INFJ': {
      name: 'المستشار المثالي',
      description: 'مثالي وحدسي، يحب فهم الناس ومساعدتهم',
      strengths: ['الحدس', 'المثالية', 'التعاطف', 'الإبداع'],
      careers: ['الاستشارات النفسية', 'الكتابة', 'الفنون', 'العمل الخيري'],
      tips: ['كن واقعياً أكثر', 'لا تتحمل أعباء الآخرين', 'خذ قسطاً من الراحة']
    },
    'ESTP': {
      name: 'المقدام العملي',
      description: 'عملي ومليء بالطاقة، يحب العمل والمغامرة',
      strengths: ['الطاقة', 'المرونة', 'العملية', 'حل المشاكل'],
      careers: ['المبيعات', 'الرياضة', 'الطوارئ', 'السياحة'],
      tips: ['فكر قبل التصرف', 'خطط للمستقبل', 'طور مهارات الصبر']
    },
    'ENTP': {
      name: 'المبدع المبتكر',
      description: 'مبتكر ومحب للنقاش، يحب الأفكار الجديدة',
      strengths: ['الإبداع', 'المرونة', 'الحماس', 'التفكير السريع'],
      careers: ['ريادة الأعمال', 'الإعلام', 'الاستشارات', 'التسويق'],
      tips: ['أكمل ما تبدأه', 'اهتم بالتفاصيل', 'كن أكثر تنظيماً']
    },
    'ESFP': {
      name: 'المؤدي المرح',
      description: 'مرح ومتفائل، يحب الناس والمرح',
      strengths: ['التفاؤل', 'المرح', 'التلقائية', 'الحماس'],
      careers: ['الترفيه', 'التعليم', 'المبيعات', 'الخدمات'],
      tips: ['خطط للمستقبل', 'طور مهارات التنظيم', 'فكر في العواقب']
    },
    'ENFP': {
      name: 'الملهم المتحمس',
      description: 'متحمس ومبدع، يحب الإمكانيات والناس',
      strengths: ['الحماس', 'الإبداع', 'التواصل', 'المرونة'],
      careers: ['الإعلام', 'التدريب', 'الفنون', 'العلاقات العامة'],
      tips: ['ركز على هدف واحد', 'أكمل مشاريعك', 'كن أكثر تنظيماً']
    },
    'ISTP': {
      name: 'الحرفي المستقل',
      description: 'مستقل وعملي، يحب فهم كيفية عمل الأشياء',
      strengths: ['المهارة العملية', 'الهدوء', 'المرونة', 'حل المشاكل'],
      careers: ['الهندسة', 'التكنولوجيا', 'الحرف', 'الطيران'],
      tips: ['طور مهارات التواصل', 'شارك في الأنشطة الاجتماعية', 'عبر عن أفكارك']
    },
    'INTP': {
      name: 'المفكر المنطقي',
      description: 'منطقي ومفكر، يحب النظريات والأفكار المعقدة',
      strengths: ['التفكير المنطقي', 'الفضول', 'الاستقلالية', 'التحليل'],
      careers: ['البحث العلمي', 'الفلسفة', 'التكنولوجيا', 'الرياضيات'],
      tips: ['طبق أفكارك عملياً', 'طور مهارات التواصل', 'حدد أولوياتك']
    },
    'ISFP': {
      name: 'الفنان الحساس',
      description: 'حساس ومبدع، يحب الجمال والانسجام',
      strengths: ['الإبداع', 'التعاطف', 'المرونة', 'التقدير الجمالي'],
      careers: ['الفنون', 'التصميم', 'الموسيقى', 'العلاج'],
      tips: ['كن أكثر حزماً', 'شارك أعمالك مع الآخرين', 'ثق في قدراتك']
    },
    'INFP': {
      name: 'الحالم المثالي',
      description: 'مثالي ومتعاطف، يحب القيم والمعاني العميقة',
      strengths: ['المثالية', 'التعاطف', 'الإبداع', 'الأصالة'],
      careers: ['الكتابة', 'الاستشارات', 'الفنون', 'العمل الخيري'],
      tips: ['كن واقعياً أكثر', 'شارك أفكارك', 'لا تأخذ النقد شخصياً']
    }
  };

  const calculatePersonality = () => {
    const traits = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    Object.values(answers).forEach(answer => {
      if (answer) traits[answer as keyof typeof traits]++;
    });

    const type = 
      (traits.E > traits.I ? 'E' : 'I') +
      (traits.S > traits.N ? 'S' : 'N') +
      (traits.T > traits.F ? 'T' : 'F') +
      (traits.J > traits.P ? 'J' : 'P');

    const personality = personalityTypes[type as keyof typeof personalityTypes];

    setResult({
      type,
      personality,
      traits
    });
  };

  const isComplete = questions.every(q => answers[q.id]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Brain className="h-6 w-6" />
            اختبار أنماط الشخصية
          </CardTitle>
          <p className="text-gray-600">
            اكتشف نمط شخصيتك وفهم طريقة تفكيرك وتفاعلك مع العالم
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-4">
              <Label className="text-base font-medium mb-4 block">
                {index + 1}. {question.text}
              </Label>
              <RadioGroup 
                value={answers[question.id]} 
                onValueChange={(value) => setAnswers({...answers, [question.id]: value})}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`} className="text-sm cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>
          ))}

          <Button 
            onClick={calculatePersonality} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!isComplete}
          >
            اكتشف نمط شخصيتك
          </Button>

          {result && (
            <Card className="mt-6 border-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-brand mb-2">{result.type}</div>
                  <div className="text-xl font-semibold p-3 rounded-lg bg-blue-100 text-blue-800">
                    {result.personality.name}
                  </div>
                  <p className="text-gray-600 mt-3">{result.personality.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-brand" />
                      نقاط القوة
                    </h3>
                    <ul className="space-y-2">
                      {result.personality.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 text-lg">✓</span>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-brand" />
                      المهن المناسبة
                    </h3>
                    <ul className="space-y-2">
                      {result.personality.careers.map((career: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-brand text-lg">•</span>
                          <span className="text-sm">{career}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-brand" />
                      نصائح التطوير
                    </h3>
                    <ul className="space-y-2">
                      {result.personality.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-500 text-lg">💡</span>
                          <span className="text-sm">{tip}</span>
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

export default PersonalityTest;
