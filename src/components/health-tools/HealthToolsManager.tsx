import React, { useState, useEffect } from 'react';
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
  
  // أدوات الصحة النفسية الجديدة
  'stress-test': StressTest,
  'meditation-timer': MeditationTimer,
  'confidence-test': ConfidenceTest,
  'work-life-balance': WorkLifeBalance,
  'personality-test': PersonalityTest,
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
  
  // العناوين الجديدة
  'stress-test': 'اختبار الضغط النفسي والتوتر',
  'meditation-timer': 'مؤقت التأمل المرشد',
  'confidence-test': 'اختبار الثقة بالنفس',
  'work-life-balance': 'حاسبة التوازن بين العمل والحياة',
  'personality-test': 'اختبار أنماط الشخصية',
};

interface HealthToolsManagerProps {
  activeToolId: string | null;
  onCloseTool: () => void;
}

const HealthToolsManager = ({ activeToolId, onCloseTool }: HealthToolsManagerProps) => {
  const [toolStartTime, setToolStartTime] = useState<number | null>(null);

  // Track tool opening
  useEffect(() => {
    if (activeToolId) {
      const startTime = Date.now();
      setToolStartTime(startTime);
      
      // Find tool details for tracking
      const allTools = [
        { id: 'bmi-calculator', name: 'حاسبة كتلة الجسم', category: 'calculation' },
        { id: 'biological-age', name: 'حاسبة العمر البيولوجي', category: 'calculation' },
        { id: 'metabolism-calculator', name: 'حاسبة الأيض والحرق', category: 'calculation' },
        { id: 'diabetes-risk', name: 'اختبار خطر السكري', category: 'assessment' },
        { id: 'vitamin-d-calculator', name: 'حاسبة فيتامين د', category: 'calculation' },
        { id: 'pregnancy-calculator', name: 'حاسبة الحمل والولادة', category: 'pregnancy' },
        { id: 'calories-calculator', name: 'حاسبة السعرات اليومية', category: 'calculation' },
        { id: 'water-calculator', name: 'حاسبة نسبة الماء اليومية', category: 'calculation' },
        { id: 'heart-rate-calculator', name: 'حاسبة معدل النبض الطبيعي', category: 'calculation' },
        { id: 'anxiety-test', name: 'اختبار القلق', category: 'mental' },
        { id: 'depression-test', name: 'اختبار الاكتئاب', category: 'mental' },
        { id: 'breathing-timer', name: 'مؤقت تمارين التنفس', category: 'mental' },
        { id: 'sleep-quality', name: 'تقييم جودة النوم', category: 'mental' }
      ];
      
      const tool = allTools.find(t => t.id === activeToolId);
      if (tool) {
        trackHealthTool.open(tool.id, tool.name, tool.category);
      }
    }
  }, [activeToolId]);

  const handleCloseTool = () => {
    // Track tool abandonment if it was closed without completion
    if (activeToolId && toolStartTime) {
      const duration = Date.now() - toolStartTime;
      const allTools = [
        { id: 'bmi-calculator', name: 'حاسبة كتلة الجسم', category: 'calculation' },
        { id: 'biological-age', name: 'حاسبة العمر البيولوجي', category: 'calculation' },
        { id: 'metabolism-calculator', name: 'حاسبة الأيض والحرق', category: 'calculation' },
        { id: 'diabetes-risk', name: 'اختبار خطر السكري', category: 'assessment' },
        { id: 'vitamin-d-calculator', name: 'حاسبة فيتامين د', category: 'calculation' },
        { id: 'pregnancy-calculator', name: 'حاسبة الحمل والولادة', category: 'pregnancy' },
        { id: 'calories-calculator', name: 'حاسبة السعرات اليومية', category: 'calculation' },
        { id: 'water-calculator', name: 'حاسبة نسبة الماء اليومية', category: 'calculation' },
        { id: 'heart-rate-calculator', name: 'حاسبة معدل النبض الطبيعي', category: 'calculation' },
        { id: 'anxiety-test', name: 'اختبار القلق', category: 'mental' },
        { id: 'depression-test', name: 'اختبار الاكتئاب', category: 'mental' },
        { id: 'breathing-timer', name: 'مؤقت تمارين التنفس', category: 'mental' },
        { id: 'sleep-quality', name: 'تقييم جودة النوم', category: 'mental' }
      ];
      
      const tool = allTools.find(t => t.id === activeToolId);
      if (tool && duration > 5000) { // Only track if spent more than 5 seconds
        trackHealthTool.abandon(tool.id, tool.name, tool.category, duration);
      }
    }
    
    setToolStartTime(null);
    onCloseTool();
  };

  // Track tool completion
  const handleToolComplete = (result: any) => {
    if (activeToolId && toolStartTime) {
      const duration = Date.now() - toolStartTime;
      const allTools = [
        { id: 'bmi-calculator', name: 'حاسبة كتلة الجسم', category: 'calculation' },
        { id: 'biological-age', name: 'حاسبة العمر البيولوجي', category: 'calculation' },
        { id: 'metabolism-calculator', name: 'حاسبة الأيض والحرق', category: 'calculation' },
        { id: 'diabetes-risk', name: 'اختبار خطر السكري', category: 'assessment' },
        { id: 'vitamin-d-calculator', name: 'حاسبة فيتامين د', category: 'calculation' },
        { id: 'pregnancy-calculator', name: 'حاسبة الحمل والولادة', category: 'pregnancy' },
        { id: 'calories-calculator', name: 'حاسبة السعرات اليومية', category: 'calculation' },
        { id: 'water-calculator', name: 'حاسبة نسبة الماء اليومية', category: 'calculation' },
        { id: 'heart-rate-calculator', name: 'حاسبة معدل النبض الطبيعي', category: 'calculation' },
        { id: 'anxiety-test', name: 'اختبار القلق', category: 'mental' },
        { id: 'depression-test', name: 'اختبار الاكتئاب', category: 'mental' },
        { id: 'breathing-timer', name: 'مؤقت تمارين التنفس', category: 'mental' },
        { id: 'sleep-quality', name: 'تقييم جودة النوم', category: 'mental' }
      ];
      
      const tool = allTools.find(t => t.id === activeToolId);
      if (tool) {
        trackHealthTool.complete(tool.id, tool.name, tool.category, duration, result);
      }
    }
  };

  return (
    <HealthToolModal
      isOpen={!!activeToolId}
      onClose={handleCloseTool}
      toolId={activeToolId}
      onComplete={handleToolComplete}
    />
  );
};

export default HealthToolsManager;
