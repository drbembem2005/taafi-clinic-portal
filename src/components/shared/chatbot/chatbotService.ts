import { getDoctors, getDoctorsBySpecialtyId } from '@/services/doctorService';
import { getSpecialties } from '@/services/specialtyService';
import { Message, ActionLink, QuickOption } from './types';
import { healthToolsData, healthCategories } from '@/data/healthToolsData';
import { Calculator, Target, Brain, Baby, Stethoscope } from 'lucide-react';

class ChatbotService {
  // Helper function to get emoji for icon components
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

  async handleMessage(message: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const lowercaseMessage = message.toLowerCase();
    
    // Check for health tool recommendations
    const recommendedTool = this.findRecommendedTool(lowercaseMessage);
    if (recommendedTool) {
      return this.getToolRecommendationResponse(recommendedTool, message);
    }
    
    // Check for symptom-based recommendations
    const symptomTools = this.getSymptomBasedRecommendations(lowercaseMessage);
    if (symptomTools.length > 0) {
      return this.getSymptomToolsResponse(symptomTools);
    }
    
    // Default to main menu
    return this.getMainMenuResponse();
  }

  private findRecommendedTool(message: string) {
    return healthToolsData.find(tool => 
      tool.keywords?.some(keyword => message.includes(keyword))
    );
  }

  private getSymptomBasedRecommendations(message: string) {
    const symptomMap = {
      'صداع': ['stress-test', 'anxiety-test'],
      'تعب': ['stress-test', 'sleep-quality'],
      'وزن': ['bmi-calculator', 'calories-calculator'],
      'نوم': ['sleep-quality', 'stress-test'],
      'قلب': ['heart-rate-calculator', 'heart-disease-risk'],
      'تنفس': ['breathing-timer', 'anxiety-test'],
      'طعام': ['food-analyzer', 'calories-calculator'],
      'أكل': ['food-analyzer', 'bmi-calculator'],
      'غذاء': ['food-analyzer', 'calories-calculator'],
      'وجبة': ['food-analyzer', 'calories-calculator']
    };

    const recommendations = [];
    for (const [symptom, tools] of Object.entries(symptomMap)) {
      if (message.includes(symptom)) {
        recommendations.push(...tools);
      }
    }

    return [...new Set(recommendations)].slice(0, 3);
  }

  private getToolRecommendationResponse(tool: any, originalMessage: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
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

  private getSymptomToolsResponse(toolIds: string[]): Promise<Omit<Message, 'id' | 'timestamp'>> {
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

  async handleAction(action: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    console.log('ChatbotService: Handling action:', action);
    
    const [actionType, actionId] = action.split('-');

    switch (actionType) {
      case 'tool':
        console.log('ChatbotService: Launching tool:', actionId);
        return this.handleToolLaunch(actionId);
      
      case 'health':
        if (actionId === 'tools') {
          return this.getHealthToolsMenuResponse();
        }
        break;
      
      case 'category':
        return this.getCategoryToolsResponse(actionId);
      
      case 'specialties':
        return this.getSpecialtiesResponse();
      
      case 'doctors':
        return this.getDoctorsResponse();
      
      case 'specialty':
        return this.getSpecialtyDoctorsResponse(parseInt(actionId));
      
      case 'booking':
        return this.getBookingResponse();
      
      case 'hours':
        return this.getHoursResponse();
      
      case 'location':
        return this.getLocationResponse();
      
      case 'contact':
        return this.getContactResponse();
      
      case 'prices':
        return this.getPricesResponse();
      
      default:
        if (action === 'health-tools') {
          return this.getHealthToolsMenuResponse();
        }
        return this.getMainMenuResponse();
    }
  }

  private handleToolLaunch(toolId: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    console.log('ChatbotService: handleToolLaunch called with toolId:', toolId);
    const tool = healthToolsData.find(t => t.id === toolId);
    
    if (tool) {
      console.log('ChatbotService: Tool found, dispatching events...');
      // Trigger tool launch event
      setTimeout(() => {
        console.log('ChatbotService: Dispatching launchHealthTool event');
        window.dispatchEvent(new CustomEvent('launchHealthTool', { detail: { toolId } }));
        console.log('ChatbotService: Dispatching closeChatbot event');
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
    
    console.log('ChatbotService: Tool not found, returning main menu');
    return this.getMainMenuResponse();
  }

  private getCategoryToolsResponse(categoryId: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
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

  private getHealthToolsMenuResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
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

  private async getSpecialtiesResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const specialties = await getSpecialties();
    
    return {
      text: 'اختر التخصص المطلوب:',
      sender: 'bot',
      type: 'specialties',
      data: {
        specialties,
        options: [
          { id: 'back', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    };
  }

  private async getDoctorsResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const doctors = await getDoctors();
    
    return {
      text: 'اختر الطبيب المناسب:',
      sender: 'bot',
      type: 'doctors',
      data: {
        doctors,
        options: [
          { id: 'back', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    };
  }

  private async getSpecialtyDoctorsResponse(specialtyId: number): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const doctors = await getDoctorsBySpecialtyId(specialtyId);
    const specialties = await getSpecialties();
    const specialty = specialties.find(s => s.id === specialtyId);
    
    return {
      text: `أطباء ${specialty?.name || 'التخصص'}:`,
      sender: 'bot',
      type: 'doctors',
      data: {
        doctors,
        options: [
          { id: 'specialties', text: '← التخصصات', action: 'specialties' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    };
  }

  private getBookingResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'اختر طريقة الحجز المناسبة لك:',
      sender: 'bot',
      type: 'booking',
      data: {
        options: [
          { id: 'specialties', text: '🏥 حجز بالتخصص', action: 'specialties' },
          { id: 'doctors', text: '👨‍⚕️ حجز بالطبيب', action: 'doctors' },
          { id: 'whatsapp', text: '📱 حجز واتساب', action: 'contact-whatsapp' },
          { id: 'phone', text: '📞 حجز هاتفي', action: 'contact-phone' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  private getHoursResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'مواعيد العمل في عيادات تعافي:\n\n📅 السبت - الخميس: 10 ص - 10 م\n🚫 الجمعة: مغلق\n\n🚨 للطوارئ: 01119007403',
      sender: 'bot',
      type: 'info',
      data: {
        options: [
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  private getLocationResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'موقع عيادات تعافي:\n\n📍 ميدان الحصري، أبراج برعي بلازا، برج رقم ٢\nبجوار محل شعبان للملابس، الدور الثالث\n6 أكتوبر، القاهرة',
      sender: 'bot',
      type: 'info',
      data: {
        options: [
          { id: 'map', text: '🗺️ فتح الخريطة', action: 'external-map' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  private getContactResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'تواصل معنا:\n\n📞 الهاتف: 38377766\n📱 الموبايل: 01119007403\n💬 الواتساب: 01119007403\n📧 البريد: info@taafi-clinics.com',
      sender: 'bot',
      type: 'info',
      data: {
        options: [
          { id: 'whatsapp', text: '💬 واتساب', action: 'contact-whatsapp' },
          { id: 'phone', text: '📞 اتصال', action: 'contact-phone' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  private getPricesResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'الأسعار والرسوم:\n\n💰 رسوم الكشف: 200 - 500 جنيه\n🩺 رسوم الاستشارة: 100 - 200 جنيه\n🔬 الفحوصات: حسب النوع\n\n📞 للاستفسار: 38377766',
      sender: 'bot',
      type: 'info',
      data: {
        options: [
          { id: 'booking', text: '📅 حجز موعد', action: 'booking' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }

  private getMainMenuResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'القائمة الرئيسية - كيف يمكنني مساعدتك؟',
      sender: 'bot',
      type: 'options',
      data: {
        options: [
          { id: 'booking', text: '📅 حجز موعد', action: 'booking' },
          { id: 'health-tools', text: '🔧 الأدوات الصحية', action: 'health-tools' },
          { id: 'specialties', text: '🏥 التخصصات الطبية', action: 'specialties' },
          { id: 'doctors', text: '👨‍⚕️ الأطباء', action: 'doctors' },
          { id: 'hours', text: '⏰ مواعيد العمل', action: 'hours' },
          { id: 'location', text: '📍 الموقع', action: 'location' },
          { id: 'contact', text: '📞 تواصل معنا', action: 'contact' },
          { id: 'prices', text: '💰 الأسعار', action: 'prices' }
        ]
      }
    });
  }

  // Handle external actions
  async handleExternalAction(action: string): Promise<void> {
    console.log('ChatbotService: Handling external action:', action);
    switch (action) {
      case 'external-map':
        window.open('https://maps.app.goo.gl/YC86Q6hMdknLVbK49', '_blank');
        break;
      case 'contact-whatsapp':
        window.open('https://wa.me/201119007403?text=مرحباً، أود حجز موعد في عيادات تعافي', '_blank');
        break;
      case 'contact-phone':
        window.open('tel:+201119007403', '_self');
        break;
    }
  }
}

export const chatbotService = new ChatbotService();
