
import { healthToolsHandler } from './healthToolsHandler';
import { Message } from '../types';

export class MessageProcessor {
  async processMessage(message: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const lowercaseMessage = message.toLowerCase();
    
    // Enhanced keyword matching with Arabic synonyms
    const enhancedKeywords = this.enhanceArabicKeywords(lowercaseMessage);
    
    // Check for health tool recommendations
    const recommendedTool = healthToolsHandler.findRecommendedTool(enhancedKeywords);
    if (recommendedTool) {
      return healthToolsHandler.getToolRecommendationResponse(recommendedTool, message);
    }
    
    // Check for symptom-based recommendations
    const symptomTools = healthToolsHandler.getSymptomBasedRecommendations(enhancedKeywords);
    if (symptomTools.length > 0) {
      return healthToolsHandler.getSymptomToolsResponse(symptomTools);
    }
    
    // Default response for unmatched messages
    return this.getDefaultResponse();
  }

  private enhanceArabicKeywords(message: string): string {
    const synonyms = {
      'وجع': 'ألم',
      'تعبان': 'تعب',
      'مش قادر أنام': 'أرق',
      'زعلان': 'حزن',
      'خايف': 'قلق',
      'متوتر': 'توتر',
      'مضغوط': 'ضغط',
      'تخين': 'وزن',
      'رفيع': 'نحافة',
      'نبضي سريع': 'نبض',
      'قلبي بيخبط': 'نبض'
    };

    let enhancedMessage = message;
    for (const [synonym, keyword] of Object.entries(synonyms)) {
      if (enhancedMessage.includes(synonym)) {
        enhancedMessage += ` ${keyword}`;
      }
    }

    return enhancedMessage;
  }

  private getDefaultResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'أفهم ما تقوله، ولكن لأساعدك بشكل أفضل، يمكنك:\n\n• وصف الأعراض بوضوح أكثر\n• اختيار من القائمة الرئيسية\n• تجربة الأدوات الصحية المتاحة',
      sender: 'bot',
      type: 'options',
      data: {
        options: [
          { id: 'health-tools', text: '🔧 الأدوات الصحية', action: 'health-tools' },
          { id: 'booking', text: '📅 حجز موعد', action: 'booking' },
          { id: 'main', text: '← القائمة الرئيسية', action: 'main' }
        ]
      }
    });
  }
}

export const messageProcessor = new MessageProcessor();
