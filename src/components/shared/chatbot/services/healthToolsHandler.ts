
import { healthToolsData, healthCategories } from '@/data/healthToolsData';
import { Message } from '../types';
import { Calculator, Target, Brain, Baby, Stethoscope } from 'lucide-react';

export class HealthToolsHandler {
  private getIconEmoji(IconComponent: any): string {
    const iconMap = new Map([
      [Calculator, '🧮'],
      [Target, '🎯'],
      [Brain, '🧠'],
      [Baby, '👶'],
      [Stethoscope, '🩺']
    ]);
    
    return iconMap.get(IconComponent) || '🔧';
  }

  findRecommendedTool(message: string) {
    return healthToolsData.find(tool => 
      tool.keywords?.some(keyword => message.includes(keyword))
    );
  }

  getSymptomBasedRecommendations(message: string): string[] {
    const symptomMap = {
      'صداع': ['stress-test', 'anxiety-test'],
      'تعب': ['stress-test', 'sleep-quality'],
      'وزن': ['bmi-calculator', 'calories-calculator'],
      'نوم': ['sleep-quality', 'stress-test'],
      'قلب': ['heart-rate-calculator', 'heart-disease-risk'],
      'تنفس': ['breathing-timer', 'anxiety-test'],
      'قلق': ['anxiety-test', 'stress-test'],
      'اكتئاب': ['depression-test', 'stress-test'],
      'ضغط': ['blood-pressure-risk', 'stress-test'],
      'سكر': ['diabetes-risk', 'metabolism-calculator']
    };

    const recommendations = [];
    for (const [symptom, tools] of Object.entries(symptomMap)) {
      if (message.includes(symptom)) {
        recommendations.push(...tools);
      }
    }

    return [...new Set(recommendations)].slice(0, 3);
  }

  getToolRecommendationResponse(tool: any, originalMessage: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: `بناءً على رسالتك، أنصحك بتجربة "${tool.title}". هذه الأداة ستساعدك في التقييم والحصول على نصائح مخصصة.`,
      sender: 'bot',
      type: 'tool-recommendation',
      data: {
        tool,
        options: [
          { id: 'launch-tool', text: `🚀 تشغيل ${tool.title}`, action: `tool-${tool.id}` },
          { id: 'more-tools', text: '🔍 أدوات أخرى', action: 'health-tools' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  getSymptomToolsResponse(toolIds: string[]): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const tools = healthToolsData.filter(tool => toolIds.includes(tool.id));
    
    return Promise.resolve({
      text: 'بناءً على الأعراض التي ذكرتها، إليك الأدوات التي قد تفيدك:',
      sender: 'bot',
      type: 'symptom-tools',
      data: {
        tools,
        options: [
          ...tools.map(tool => ({ 
            id: `tool-${tool.id}`, 
            text: `🔧 ${tool.title}`, 
            action: `tool-${tool.id}` 
          })),
          { id: 'more-tools', text: '🔍 جميع الأدوات', action: 'health-tools' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  handleToolLaunch(toolId: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    console.log('HealthToolsHandler: handleToolLaunch called with toolId:', toolId);
    const tool = healthToolsData.find(t => t.id === toolId);
    
    if (tool) {
      console.log('HealthToolsHandler: Tool found, dispatching events...');
      setTimeout(() => {
        console.log('HealthToolsHandler: Dispatching launchHealthTool event');
        window.dispatchEvent(new CustomEvent('launchHealthTool', { detail: { toolId } }));
        console.log('HealthToolsHandler: Dispatching closeChatbot event');
        window.dispatchEvent(new CustomEvent('closeChatbot'));
      }, 500);
      
      return Promise.resolve({
        text: `🚀 جاري تشغيل "${tool.title}"...\n\nستتم إعادة توجيهك للأداة الآن للحصول على تقييم مخصص ونصائح مفيدة.`,
        sender: 'bot',
        type: 'tool-launch',
        data: {
          tool,
          options: [
            { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
          ]
        }
      });
    }
    
    console.log('HealthToolsHandler: Tool not found');
    throw new Error('Tool not found');
  }

  getCategoryToolsResponse(categoryId: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const categoryTools = healthToolsData.filter(tool => tool.category === categoryId);
    const category = healthCategories.find(cat => cat.id === categoryId);

    return Promise.resolve({
      text: `أدوات ${category?.name || 'الفئة المحددة'}:`,
      sender: 'bot',
      type: 'symptom-tools',
      data: {
        tools: categoryTools,
        options: [
          ...categoryTools.map(tool => ({ 
            id: `tool-${tool.id}`, 
            text: `🔧 ${tool.title}`, 
            action: `tool-${tool.id}` 
          })),
          { id: 'health-tools', text: '🔙 الفئات', action: 'health-tools' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  getHealthToolsMenuResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'اختر الفئة التي تريدها من الأدوات الصحية:',
      sender: 'bot',
      type: 'health-categories',
      data: {
        categories: healthCategories,
        options: [
          ...healthCategories.map(cat => ({ 
            id: cat.id, 
            text: `${this.getIconEmoji(cat.icon)} ${cat.name}`, 
            action: `category-${cat.id}` 
          })),
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }
}

export const healthToolsHandler = new HealthToolsHandler();
