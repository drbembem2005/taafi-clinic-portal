import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
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
import OsteoporosisRisk from './OsteoporosisRisk';
import SleepQuality from './SleepQuality';
import MuscleMassCalculator from './MuscleMassCalculator';
import EyeHealthAssessment from './EyeHealthAssessment';
import HeartDiseaseRisk from './HeartDiseaseRisk';
import InsulinResistanceTest from './InsulinResistanceTest';
import EmotionalIntelligenceTest from './EmotionalIntelligenceTest';
import StressTest from './StressTest';
import MeditationTimer from './MeditationTimer';
import ConfidenceTest from './ConfidenceTest';
import WorkLifeBalance from './WorkLifeBalance';
import PersonalityTest from './PersonalityTest';
import VaccinationSchedule from './VaccinationSchedule';
import MedicationDosage from './MedicationDosage';
import BloodTypePredictor from './BloodTypePredictor';

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
  'osteoporosis-risk': OsteoporosisRisk,
  'sleep-quality': SleepQuality,
  'muscle-mass-calculator': MuscleMassCalculator,
  'eye-health-assessment': EyeHealthAssessment,
  'heart-disease-risk': HeartDiseaseRisk,
  'insulin-resistance-test': InsulinResistanceTest,
  'emotional-intelligence-test': EmotionalIntelligenceTest,
  
  'stress-test': StressTest,
  'meditation-timer': MeditationTimer,
  'confidence-test': ConfidenceTest,
  'work-life-balance': WorkLifeBalance,
  'personality-test': PersonalityTest,

  'vaccination-schedule': VaccinationSchedule,
  'medication-dosage': MedicationDosage,
  'blood-type-predictor': BloodTypePredictor,
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
  'osteoporosis-risk': 'تقييم خطر هشاشة العظام',
  'sleep-quality': 'تقييم جودة النوم',
  'muscle-mass-calculator': 'حاسبة مؤشر الكتلة العضلية',
  'eye-health-assessment': 'تقييم صحة العين والرؤية',
  'heart-disease-risk': 'تقييم خطر أمراض القلب',
  'insulin-resistance-test': 'تقييم مقاومة الأنسولين',
  'emotional-intelligence-test': 'اختبار الذكاء العاطفي',
  
  'stress-test': 'اختبار الضغط النفسي والتوتر',
  'meditation-timer': 'مؤقت التأمل المرشد',
  'confidence-test': 'اختبار الثقة بالنفس',
  'work-life-balance': 'حاسبة التوازن بين العمل والحياة',
  'personality-test': 'اختبار أنماط الشخصية',

  'vaccination-schedule': 'حاسبة مواعيد تطعيمات الأطفال',
  'medication-dosage': 'حاسبة الجرعة الآمنة للأطفال',
  'blood-type-predictor': 'حاسبة فصيلة الدم للأطفال',
};

interface HealthToolsManagerProps {
  activeToolId: string | null;
  onCloseTool: () => void;
}

const HealthToolsManager = ({ activeToolId, onCloseTool }: HealthToolsManagerProps) => {
  const { trackHealthTool, trackVirtualPage } = useAnalytics();

  React.useEffect(() => {
    if (activeToolId && toolComponents[activeToolId]) {
      const toolTitle = toolTitles[activeToolId] || 'أداة صحية';
      trackHealthTool.opened(activeToolId, toolTitle);
      trackVirtualPage(`/health-tools/${activeToolId}`, 'health_tool_modal');
    }
  }, [activeToolId, trackHealthTool, trackVirtualPage]);

  const handleCloseTool = () => {
    if (activeToolId) {
      const toolTitle = toolTitles[activeToolId] || 'أداة صحية';
      trackHealthTool.closed(activeToolId, toolTitle);
    }
    onCloseTool();
  };

  if (!activeToolId || !toolComponents[activeToolId]) {
    return null;
  }

  const ToolComponent = toolComponents[activeToolId];
  const toolTitle = toolTitles[activeToolId] || 'أداة صحية';

  return (
    <HealthToolModal
      isOpen={Boolean(activeToolId)}
      onClose={handleCloseTool}
      title={toolTitle}
    >
      <ToolComponent />
    </HealthToolModal>
  );
};

export default HealthToolsManager;
