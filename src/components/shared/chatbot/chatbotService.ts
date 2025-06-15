
import { getDoctors, getDoctorsBySpecialtyId } from '@/services/doctorService';
import { getSpecialties } from '@/services/specialtyService';
import { Message } from './types';

class ChatbotService {
  async handleMessage(message: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    // Default to main menu for any general message
    return this.getMainMenuResponse();
  }

  async handleAction(action: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
    console.log('🔧 ChatbotService: Handling action:', action);
    const [actionType, actionId] = action.split('-');

    switch (actionType) {
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
        return this.getMainMenuResponse();
    }
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
