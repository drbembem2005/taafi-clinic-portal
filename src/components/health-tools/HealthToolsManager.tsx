import React, { useState } from 'react';
import HealthToolModal from './HealthToolModal';
import BMICalculator from './BMICalculator';
import CalorieCalculator from './CalorieCalculator';
import DiabetesRiskTest from './DiabetesRiskTest';
import AnxietyTest from './AnxietyTest';
import WaterCalculator from './WaterCalculator';
import HeartRateCalculator from './HeartRateCalculator';
import PregnancyCalculator from './PregnancyCalculator';
import OvulationCalculator from './OvulationCalculator';
import DepressionTest from './DepressionTest';
import BreathingTimer from './BreathingTimer';
import WaistCalculator from './WaistCalculator';
import StepsCaloriesCalculator from './StepsCaloriesCalculator';
import DentalDecayRisk from './DentalDecayRisk';
import MedicalSpecialtyGuide from './MedicalSpecialtyGuide';
import DentalVisitAssessment from './DentalVisitAssessment';
import BloodPressureRiskTest from './BloodPressureRiskTest';
import HealthyHabitsAssessment from './HealthyHabitsAssessment';
import PregnancySymptomsChecker from './PregnancySymptomsChecker';
import BiologicalAgeCalculator from './BiologicalAgeCalculator';
import MaleFertilityCalculator from './MaleFertilityCalculator';
import MetabolismCalculator from './MetabolismCalculator';
import VitaminDCalculator from './VitaminDCalculator';

const toolComponents: { [key: string]: React.ComponentType } = {
  'bmi-calculator': BMICalculator,
  'calories-calculator': CalorieCalculator,
  'water-calculator': WaterCalculator,
  'heart-rate-calculator': HeartRateCalculator,
  'diabetes-risk': DiabetesRiskTest,
  'anxiety-test': AnxietyTest,
  'depression-test': DepressionTest,
  'pregnancy-calculator': PregnancyCalculator,
  'ovulation-calculator': OvulationCalculator,
  'breathing-timer': BreathingTimer,
  'waist-calculator': WaistCalculator,
  'steps-calories': StepsCaloriesCalculator,
  'dental-decay-risk': DentalDecayRisk,
  'dental-visit-needed': DentalVisitAssessment,
  'blood-pressure-risk': BloodPressureRiskTest,
  'healthy-habits': HealthyHabitsAssessment,
  'pregnancy-symptoms': PregnancySymptomsChecker,
  'medical-specialty-guide': MedicalSpecialtyGuide,
  'specialty-finder': MedicalSpecialtyGuide,
  
  'biological-age': BiologicalAgeCalculator,
  'male-fertility': MaleFertilityCalculator,
  'metabolism-calculator': MetabolismCalculator,
  'vitamin-d-calculator': VitaminDCalculator,
};

const toolTitles: { [key: string]: string } = {
  'bmi-calculator': 'حاسبة مؤشر كتلة الجسم',
  'calories-calculator': 'حاسبة السعرات اليومية',
  'water-calculator': 'حاسبة احتياج الماء اليومي',
  'heart-rate-calculator': 'حاسبة معدل النبض المستهدف',
  'diabetes-risk': 'اختبار خطر السكري',
  'anxiety-test': 'اختبار القلق',
  'depression-test': 'اختبار الاكتئاب',
  'pregnancy-calculator': 'حاسبة الحمل والولادة',
  'ovulation-calculator': 'حاسبة التبويض',
  'breathing-timer': 'مؤقت التنفس العميق',
  'waist-calculator': 'حاسبة محيط الخصر الصحي',
  'steps-calories': 'حاسبة خطوات المشي إلى سعرات',
  'dental-decay-risk': 'اختبار خطر تسوس الأسنان',
  'dental-visit-needed': 'هل تحتاج لزيارة طبيب الأسنان؟',
  'blood-pressure-risk': 'اختبار خطر ارتفاع ضغط الدم',
  'healthy-habits': 'تقييم العادات الصحية',
  'pregnancy-symptoms': 'فاحص أعراض الحمل',
  'medical-specialty-guide': 'مرشد التخصصات الطبية',
  'specialty-finder': 'باحث التخصصات الطبية',
  
  'biological-age': 'حاسبة العمر البيولوجي',
  'male-fertility': 'حاسبة مؤشر الخصوبة للرجال',
  'metabolism-calculator': 'حاسبة الأيض والحرق',
  'vitamin-d-calculator': 'حاسبة فيتامين د المطلوب',
};

interface HealthToolsManagerProps {
  activeToolId: string | null;
  onCloseTool: () => void;
}

const HealthToolsManager = ({ activeToolId, onCloseTool }: HealthToolsManagerProps) => {
  if (!activeToolId || !toolComponents[activeToolId]) {
    return null;
  }

  const ToolComponent = toolComponents[activeToolId];
  const toolTitle = toolTitles[activeToolId] || 'أداة صحية';

  return (
    <HealthToolModal
      isOpen={Boolean(activeToolId)}
      onClose={onCloseTool}
      title={toolTitle}
    >
      <ToolComponent />
    </HealthToolModal>
  );
};

export default HealthToolsManager;
