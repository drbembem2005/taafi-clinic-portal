
import { getDoctors, getDoctorsBySpecialtyId } from '@/services/doctorService';
import { getSpecialties } from '@/services/specialtyService';
import { Message, ActionLink, QuickOption } from './types';

class ChatbotService {
  async handleAction(action: string): Promise<Omit<Message, 'id' | 'timestamp'>> {
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
      
      case 'insurance':
        return this.getInsuranceResponse();
      
      case 'prices':
        return this.getPricesResponse();
      
      default:
        return this.getMainMenuResponse();
    }
  }

  private async getSpecialtiesResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const specialties = await getSpecialties();
    
    return {
      text: 'تضم عيادات تعافي التخصصات الطبية التالية:',
      sender: 'bot',
      type: 'specialties',
      data: {
        specialties,
        options: [
          { id: 'back', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'booking',
            text: 'حجز موعد',
            url: '/booking',
            icon: 'link'
          }
        ]
      }
    };
  }

  private async getDoctorsResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    const doctors = await getDoctors();
    
    return {
      text: 'الأطباء المتاحون في عيادات تعافي:',
      sender: 'bot',
      type: 'doctors',
      data: {
        doctors,
        options: [
          { id: 'back', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'booking',
            text: 'حجز موعد',
            url: '/booking',
            icon: 'link'
          }
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
          { id: 'specialties', text: 'التخصصات', action: 'specialties' },
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'booking',
            text: `حجز موعد في ${specialty?.name}`,
            url: `/booking?specialty=${encodeURIComponent(specialty?.name || '')}&specialtyId=${specialtyId}`,
            icon: 'link',
            specialtyId
          }
        ]
      }
    };
  }

  private getBookingResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'يمكنك حجز موعد في عيادات تعافي بعدة طرق:',
      sender: 'bot',
      type: 'booking',
      data: {
        options: [
          { id: 'online', text: 'حجز أونلاين', action: 'booking-online' },
          { id: 'whatsapp', text: 'حجز واتساب', action: 'booking-whatsapp' },
          { id: 'phone', text: 'حجز هاتفي', action: 'booking-phone' },
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'booking',
            text: 'احجز الآن',
            url: '/booking',
            icon: 'link'
          },
          {
            type: 'whatsapp',
            text: 'واتساب',
            url: 'https://wa.me/201119007403?text=مرحباً، أود حجز موعد في عيادات تعافي',
            icon: 'message'
          },
          {
            type: 'phone',
            text: 'اتصل بنا',
            url: 'tel:+201119007403',
            icon: 'phone'
          }
        ]
      }
    });
  }

  private getHoursResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'ساعات العمل في عيادات تعافي:',
      sender: 'bot',
      type: 'info',
      data: {
        richContent: '• من السبت إلى الخميس: 10 صباحاً - 10 مساءً\n• الجمعة: مغلق\n\nللطوارئ بعد ساعات العمل، يرجى الاتصال على 01119007403',
        options: [
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'phone',
            text: 'اتصل بنا',
            url: 'tel:+201119007403',
            icon: 'phone'
          }
        ]
      }
    });
  }

  private getLocationResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'موقعنا:',
      sender: 'bot',
      type: 'info',
      data: {
        richContent: 'ميدان الحصري، أبراج برعي بلازا، برج رقم ٢\nبجوار محل شعبان للملابس، الدور الثالث (يوجد أسانسير)\n6 أكتوبر، القاهرة',
        options: [
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'link',
            text: 'فتح الخريطة',
            url: 'https://maps.google.com/?q=29.9771391,30.9428551',
            icon: 'link'
          }
        ]
      }
    });
  }

  private getContactResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'معلومات الاتصال:',
      sender: 'bot',
      type: 'info',
      data: {
        richContent: '• رقم الهاتف: 38377766\n• الموبايل: 01119007403\n• الواتساب: 01119007403\n• البريد الإلكتروني: info@taafi-clinics.com',
        options: [
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'phone',
            text: 'اتصل بنا',
            url: 'tel:+201119007403',
            icon: 'phone'
          },
          {
            type: 'whatsapp',
            text: 'واتساب',
            url: 'https://wa.me/201119007403',
            icon: 'message'
          }
        ]
      }
    });
  }

  private getInsuranceResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'نتعامل مع العديد من شركات التأمين الطبي:',
      sender: 'bot',
      type: 'info',
      data: {
        richContent: '• ميد نت\n• جلوب ميد\n• نكست كير\n• كير بلس\n• وثائق تأمين البنوك\n\nللاستفسار عن تغطية وثيقتك، اتصل بنا على 38377766',
        options: [
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'phone',
            text: 'اتصل للاستفسار',
            url: 'tel:+2038377766',
            icon: 'phone'
          }
        ]
      }
    });
  }

  private getPricesResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'تختلف رسوم الكشف حسب التخصص والطبيب:',
      sender: 'bot',
      type: 'info',
      data: {
        richContent: '• رسوم الكشف العادي: تتراوح من 200 إلى 500 جنيه\n• رسوم الاستشارة: تتراوح من 100 إلى 200 جنيه\n• الفحوصات الإضافية: تُحدد حسب نوع الفحص',
        options: [
          { id: 'main', text: 'القائمة الرئيسية', action: 'main' }
        ],
        links: [
          {
            type: 'booking',
            text: 'حجز موعد',
            url: '/booking',
            icon: 'link'
          }
        ]
      }
    });
  }

  private getMainMenuResponse(): Promise<Omit<Message, 'id' | 'timestamp'>> {
    return Promise.resolve({
      text: 'كيف يمكنني مساعدتك اليوم؟',
      sender: 'bot',
      type: 'options',
      data: {
        options: [
          { id: 'specialties', text: 'التخصصات الطبية', action: 'specialties' },
          { id: 'doctors', text: 'الأطباء المتاحون', action: 'doctors' },
          { id: 'booking', text: 'حجز موعد', action: 'booking' },
          { id: 'hours', text: 'مواعيد العمل', action: 'hours' },
          { id: 'location', text: 'الموقع والعنوان', action: 'location' },
          { id: 'insurance', text: 'التأمين الطبي', action: 'insurance' },
          { id: 'contact', text: 'معلومات الاتصال', action: 'contact' },
          { id: 'prices', text: 'الأسعار والرسوم', action: 'prices' }
        ]
      }
    });
  }
}

export const chatbotService = new ChatbotService();
