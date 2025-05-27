
import { getDoctors, getDoctorsBySpecialtyId, getDoctorSchedule } from '@/services/doctorService';
import { getSpecialties } from '@/services/specialtyService';
import { createBooking } from '@/services/bookingService';
import { Message, ButtonOption, ChatFlow, ChatState } from './types';

class NewChatbotService {
  private state: ChatState = {
    currentFlow: 'welcome',
    selectedData: {}
  };

  async handleAction(action: string, data?: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    console.log('=== CHATBOT ACTION ===');
    console.log('Action:', action);
    console.log('Data:', data);
    console.log('Current State:', this.state);

    const [actionType, actionValue] = action.split(':');

    switch (actionType) {
      case 'main-menu':
        return this.handleMainMenu();
      
      case 'booking':
        return this.handleBookingFlow(actionValue, data);
      
      case 'doctors-schedule':
        return this.handleDoctorsScheduleFlow(actionValue, data);
      
      case 'prices':
        return this.handlePricesFlow();
      
      case 'specialties':
        return this.handleSpecialtiesFlow(actionValue, data);
      
      case 'location':
        return this.handleLocationFlow();
      
      case 'customer-service':
        return this.handleCustomerServiceFlow(actionValue);
      
      default:
        return this.handleMainMenu();
    }
  }

  private async handleMainMenu(): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const newState = { ...this.state, currentFlow: 'main-menu' as ChatFlow };
    
    return {
      message: {
        text: 'كيف يمكنني مساعدتك اليوم؟',
        sender: 'bot',
        type: 'main-menu',
        data: {
          buttons: [
            { id: 'booking', text: '📅 احجز موعد', action: 'booking:start', data: {} },
            { id: 'schedule', text: '👨‍⚕️ مواعيد الأطباء', action: 'doctors-schedule:start', data: {} },
            { id: 'prices', text: '💰 أسعار الكشف', action: 'prices:show', data: {} },
            { id: 'specialties', text: '🏥 التخصصات الطبية', action: 'specialties:list', data: {} },
            { id: 'location', text: '📍 الموقع والعنوان', action: 'location:show', data: {} },
            { id: 'support', text: '📞 خدمة العملاء', action: 'customer-service:menu', data: {} }
          ]
        }
      },
      newState
    };
  }

  private async handleBookingFlow(step: string, data?: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    switch (step) {
      case 'start':
        return this.startBookingFlow();
      case 'select-doctor':
        return this.selectDoctorForBooking(data);
      case 'select-day':
        return this.selectDayForBooking(data);
      case 'select-time':
        return this.selectTimeForBooking(data);
      case 'enter-info':
        return this.enterUserInfo(data);
      case 'confirm':
        return this.confirmBooking(data);
      default:
        return this.startBookingFlow();
    }
  }

  private async startBookingFlow(): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const specialties = await getSpecialties();
    const newState = { ...this.state, currentFlow: 'booking-specialty' as ChatFlow };

    const buttons = specialties.map(specialty => ({
      id: `specialty-${specialty.id}`,
      text: specialty.name,
      action: `booking:select-doctor`,
      data: { specialtyId: specialty.id, specialtyName: specialty.name }
    }));

    buttons.push({ 
      id: 'back', 
      text: '← القائمة الرئيسية', 
      action: 'main-menu',
      data: {}
    });

    return {
      message: {
        text: 'اختر التخصص الطبي:',
        sender: 'bot',
        type: 'specialty-selection',
        data: { 
          buttons,
          specialties: specialties
        }
      },
      newState
    };
  }

  private async selectDoctorForBooking(data: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const doctors = await getDoctorsBySpecialtyId(data.specialtyId);
    const newState = { 
      ...this.state, 
      currentFlow: 'booking-doctor' as ChatFlow,
      selectedData: { ...this.state.selectedData, specialtyId: data.specialtyId, specialtyName: data.specialtyName }
    };

    const buttons = doctors.map(doctor => ({
      id: `doctor-${doctor.id}`,
      text: `د. ${doctor.name}`,
      action: `booking:select-day`,
      data: { doctorId: doctor.id, doctorName: doctor.name }
    }));

    buttons.push({ 
      id: 'back', 
      text: '← التخصصات', 
      action: 'booking:start',
      data: {}
    });

    return {
      message: {
        text: 'اختر الطبيب:',
        sender: 'bot',
        type: 'doctor-selection',
        data: { 
          buttons,
          doctors: doctors
        }
      },
      newState
    };
  }

  private async selectDayForBooking(data: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const newState = { 
      ...this.state, 
      currentFlow: 'booking-day' as ChatFlow,
      selectedData: { 
        ...this.state.selectedData, 
        doctorId: data.doctorId, 
        doctorName: data.doctorName 
      }
    };

    // Get doctor's actual schedule from database
    const schedule = await getDoctorSchedule(data.doctorId);
    const availableDays = Object.keys(schedule);
    
    const dayNameMapping: { [key: string]: string } = {
      'Sat': 'السبت',
      'Sun': 'الأحد',
      'Mon': 'الإثنين',
      'Tue': 'الثلاثاء',
      'Wed': 'الأربعاء',
      'Thu': 'الخميس',
      'Fri': 'الجمعة'
    };

    const buttons = availableDays.map(day => ({
      id: `day-${day}`,
      text: dayNameMapping[day] || day,
      action: `booking:select-time`,
      data: { selectedDay: day }
    }));

    buttons.push({ 
      id: 'back', 
      text: '← الأطباء', 
      action: 'booking:select-doctor', 
      data: { 
        specialtyId: this.state.selectedData.specialtyId!, 
        specialtyName: this.state.selectedData.specialtyName!
      } 
    });

    return {
      message: {
        text: 'اختر اليوم المتاح:',
        sender: 'bot',
        type: 'day-selection',
        data: { 
          buttons,
          availableDays: availableDays.map(day => dayNameMapping[day] || day)
        }
      },
      newState
    };
  }

  private async selectTimeForBooking(data: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const newState = { 
      ...this.state, 
      currentFlow: 'booking-time' as ChatFlow,
      selectedData: { 
        ...this.state.selectedData, 
        selectedDay: data.selectedDay 
      }
    };

    // Get actual available times from doctor's schedule
    const schedule = await getDoctorSchedule(this.state.selectedData.doctorId!);
    const availableTimes = schedule[data.selectedDay] || [];

    const buttons = availableTimes.map(time => ({
      id: `time-${time}`,
      text: time,
      action: `booking:enter-info`,
      data: { selectedTime: time }
    }));

    buttons.push({ 
      id: 'back', 
      text: '← الأيام', 
      action: 'booking:select-day', 
      data: { 
        doctorId: this.state.selectedData.doctorId!, 
        doctorName: this.state.selectedData.doctorName!
      } 
    });

    return {
      message: {
        text: 'اختر الوقت المناسب:',
        sender: 'bot',
        type: 'time-selection',
        data: { 
          buttons,
          availableTimes: availableTimes
        }
      },
      newState
    };
  }

  private async enterUserInfo(data: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const newState = { 
      ...this.state, 
      currentFlow: 'booking-info' as ChatFlow,
      selectedData: { 
        ...this.state.selectedData, 
        selectedTime: data.selectedTime 
      }
    };

    return {
      message: {
        text: 'أدخل بياناتك لإتمام الحجز:',
        sender: 'bot',
        type: 'user-info',
        data: { userForm: true }
      },
      newState
    };
  }

  private async confirmBooking(userInfo: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    try {
      await createBooking({
        user_name: userInfo.name,
        user_phone: userInfo.phone,
        user_email: userInfo.email || '',
        doctor_id: this.state.selectedData.doctorId!,
        specialty_id: this.state.selectedData.specialtyId!,
        booking_day: this.state.selectedData.selectedDay!,
        booking_time: this.state.selectedData.selectedTime!,
        booking_method: 'online',
        notes: ''
      });

      const newState = { 
        currentFlow: 'main-menu' as ChatFlow,
        selectedData: {}
      };

      return {
        message: {
          text: '✅ تم حجز موعدك بنجاح!\nسيتم التواصل معك قريباً لتأكيد الموعد.',
          sender: 'bot',
          type: 'success',
          data: {
            buttons: [
              { id: 'main-menu', text: '← القائمة الرئيسية', action: 'main-menu', data: {} }
            ]
          }
        },
        newState
      };
    } catch (error) {
      console.error('Booking error:', error);
      return {
        message: {
          text: '❌ عذراً، حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.',
          sender: 'bot',
          type: 'info',
          data: {
            buttons: [
              { id: 'retry', text: '🔄 المحاولة مرة أخرى', action: 'booking:start', data: {} },
              { id: 'main-menu', text: '← القائمة الرئيسية', action: 'main-menu', data: {} }
            ]
          }
        },
        newState: this.state
      };
    }
  }

  private async handleDoctorsScheduleFlow(step: string, data?: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    if (step === 'start') {
      const specialties = await getSpecialties();
      const newState = { ...this.state, currentFlow: 'doctors-schedule-specialty' as ChatFlow };

      const buttons = specialties.map(specialty => ({
        id: `specialty-${specialty.id}`,
        text: specialty.name,
        action: `doctors-schedule:list`,
        data: { specialtyId: specialty.id, specialtyName: specialty.name }
      }));

      buttons.push({ 
        id: 'back', 
        text: '← القائمة الرئيسية', 
        action: 'main-menu',
        data: {}
      });

      return {
        message: {
          text: 'اختر التخصص:',
          sender: 'bot',
          type: 'specialty-selection',
          data: { 
            buttons,
            specialties: specialties
          }
        },
        newState
      };
    } else if (step === 'list') {
      const doctors = await getDoctorsBySpecialtyId(data.specialtyId);
      const newState = { ...this.state, currentFlow: 'doctors-schedule-list' as ChatFlow };

      let text = `أطباء ${data.specialtyName}:\n\n`;
      
      for (const doctor of doctors) {
        text += `👨‍⚕️ د. ${doctor.name}\n`;
        text += `🏥 ${doctor.title || 'طبيب متخصص'}\n`;
        text += `💰 الكشف: ${doctor.fees?.examination || '250'} جنيه\n`;
        
        // Get actual schedule from database
        const schedule = await getDoctorSchedule(doctor.id);
        if (Object.keys(schedule).length > 0) {
          const dayNameMapping: { [key: string]: string } = {
            'Sat': 'السبت',
            'Sun': 'الأحد',
            'Mon': 'الإثنين',
            'Tue': 'الثلاثاء',
            'Wed': 'الأربعاء',
            'Thu': 'الخميس',
            'Fri': 'الجمعة'
          };
          
          const arabicDays = Object.keys(schedule).map(day => dayNameMapping[day] || day);
          text += `📅 الأيام: ${arabicDays.join(', ')}\n`;
          
          const allTimes = Object.values(schedule).flat();
          if (allTimes.length > 0) {
            text += `🕐 الساعات: ${allTimes.join(', ')}\n`;
          }
        }
        text += '\n';
      }

      const buttons = doctors.map(doctor => ({
        id: `book-${doctor.id}`,
        text: `احجز مع د. ${doctor.name}`,
        action: `booking:select-day`,
        data: { 
          doctorId: doctor.id, 
          doctorName: doctor.name, 
          specialtyId: data.specialtyId, 
          specialtyName: data.specialtyName 
        }
      }));

      buttons.push({ 
        id: 'back', 
        text: '← التخصصات', 
        action: 'doctors-schedule:start',
        data: {}
      });

      return {
        message: {
          text,
          sender: 'bot',
          type: 'info',
          data: { 
            buttons,
            doctors: doctors
          }
        },
        newState
      };
    }

    return this.handleMainMenu();
  }

  private async handlePricesFlow(): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const doctors = await getDoctors();
    const specialties = await getSpecialties();
    const newState = { ...this.state, currentFlow: 'prices-list' as ChatFlow };

    let text = 'أسعار الكشف:\n\n';
    
    specialties.forEach(specialty => {
      const specialtyDoctors = doctors.filter(d => d.specialty_id === specialty.id);
      if (specialtyDoctors.length > 0) {
        text += `🏥 ${specialty.name}:\n`;
        specialtyDoctors.forEach(doctor => {
          text += `• د. ${doctor.name} - ${doctor.fees?.examination || '250'} جنيه\n`;
        });
        text += '\n';
      }
    });

    return {
      message: {
        text,
        sender: 'bot',
        type: 'info',
        data: {
          buttons: [
            { id: 'booking', text: '📅 احجز موعد', action: 'booking:start', data: {} },
            { id: 'back', text: '← القائمة الرئيسية', action: 'main-menu', data: {} }
          ]
        }
      },
      newState
    };
  }

  private async handleSpecialtiesFlow(step: string, data?: any): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const specialties = await getSpecialties();
    const newState = { ...this.state, currentFlow: 'specialties-list' as ChatFlow };

    let text = 'التخصصات الطبية المتاحة:\n\n';
    specialties.forEach(specialty => {
      text += `🏥 ${specialty.name}\n${specialty.description}\n\n`;
    });

    const buttons = specialties.map(specialty => ({
      id: `view-doctors-${specialty.id}`,
      text: `عرض أطباء ${specialty.name}`,
      action: `doctors-schedule:list`,
      data: { specialtyId: specialty.id, specialtyName: specialty.name }
    }));

    buttons.push({ 
      id: 'back', 
      text: '← القائمة الرئيسية', 
      action: 'main-menu',
      data: {}
    });

    return {
      message: {
        text,
        sender: 'bot',
        type: 'info',
        data: { 
          buttons,
          specialties: specialties
        }
      },
      newState
    };
  }

  private async handleLocationFlow(): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const newState = { ...this.state, currentFlow: 'location-info' as ChatFlow };

    return {
      message: {
        text: '📍 موقع عيادات تعافي:\n\nميدان الحصري، أبراج برعي بلازا، برج ٢، الدور ٣\nبجوار محل شعبان\n6 أكتوبر، القاهرة',
        sender: 'bot',
        type: 'info',
        data: {
          buttons: [
            { id: 'map', text: '🗺️ فتح الخريطة', action: 'external:map', data: {} },
            { id: 'back', text: '← القائمة الرئيسية', action: 'main-menu', data: {} }
          ]
        }
      },
      newState
    };
  }

  private async handleCustomerServiceFlow(step: string): Promise<{ message: Omit<Message, 'id' | 'timestamp'>, newState: ChatState }> {
    const newState = { ...this.state, currentFlow: 'customer-service' as ChatFlow };

    return {
      message: {
        text: 'خدمة العملاء - كيف يمكننا مساعدتك؟',
        sender: 'bot',
        type: 'info',
        data: {
          buttons: [
            { id: 'inquiry', text: '📝 إرسال استفسار', action: 'customer-service:inquiry', data: {} },
            { id: 'whatsapp', text: '💬 التواصل عبر واتساب', action: 'external:whatsapp', data: {} },
            { id: 'call', text: '📞 مكالمة هاتفية', action: 'external:call', data: {} },
            { id: 'back', text: '← القائمة الرئيسية', action: 'main-menu', data: {} }
          ]
        }
      },
      newState
    };
  }

  async handleExternalAction(action: string): Promise<void> {
    switch (action) {
      case 'external:map':
        window.open('https://maps.app.goo.gl/YC86Q6hMdknLVbK49', '_blank');
        break;
      case 'external:whatsapp':
        window.open('https://wa.me/201119007403?text=مرحباً، أود التواصل مع خدمة العملاء', '_blank');
        break;
      case 'external:call':
        window.open('tel:+201091003965', '_self');
        break;
    }
  }

  updateState(newState: ChatState): void {
    this.state = newState;
  }

  getState(): ChatState {
    return this.state;
  }

  resetState(): void {
    this.state = {
      currentFlow: 'welcome',
      selectedData: {}
    };
  }
}

export const newChatbotService = new NewChatbotService();
