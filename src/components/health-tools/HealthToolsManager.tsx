
import React, { useState } from 'react';
import HealthToolModal from './HealthToolModal';
import BMICalculator from './BMICalculator';
import CalorieCalculator from './CalorieCalculator';
import DiabetesRiskTest from './DiabetesRiskTest';
import AnxietyTest from './AnxietyTest';
// Import other tools as we create them

const toolComponents: { [key: string]: React.ComponentType } = {
  'bmi-calculator': BMICalculator,
  'calories-calculator': CalorieCalculator,
  'diabetes-risk': DiabetesRiskTest,
  'anxiety-test': AnxietyTest,
  // Add other tools here
};

const toolTitles: { [key: string]: string } = {
  'bmi-calculator': 'حاسبة مؤشر كتلة الجسم',
  'calories-calculator': 'حاسبة السعرات اليومية',
  'diabetes-risk': 'اختبار خطر السكري',
  'anxiety-test': 'اختبار القلق',
  // Add other titles here
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
