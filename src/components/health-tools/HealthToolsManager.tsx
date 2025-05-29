
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
