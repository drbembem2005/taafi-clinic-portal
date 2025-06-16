
interface UmamiEventData {
  [key: string]: string | number | boolean;
}

interface HealthToolEvent {
  tool_id: string;
  tool_name: string;
  category: 'health_tools';
  action: 'opened' | 'completed' | 'shared' | 'result_generated' | 'closed';
  duration?: number;
  result_score?: number;
}

interface BookingEvent {
  category: 'booking';
  action: 'started' | 'doctor_selected' | 'specialty_selected' | 'appointment_booked' | 'completed' | 'abandoned';
  doctor_id?: number;
  specialty_id?: number;
  step?: string;
}

interface EngagementEvent {
  category: 'engagement';
  action: 'cta_clicked' | 'section_viewed' | 'search_performed' | 'filter_applied' | 'chat_opened' | 'phone_clicked' | 'whatsapp_clicked';
  element?: string;
  value?: string;
}

interface PerformanceEvent {
  category: 'performance';
  action: 'page_load_time' | 'tool_load_time' | 'error_occurred';
  duration?: number;
  error_type?: string;
  page?: string;
}

type AnalyticsEvent = HealthToolEvent | BookingEvent | EngagementEvent | PerformanceEvent;

class AnalyticsService {
  private isDebug = process.env.NODE_ENV === 'development';
  private startTimes: Map<string, number> = new Map();

  private log(message: string, data?: any) {
    if (this.isDebug) {
      console.log(`[Analytics] ${message}`, data);
    }
  }

  private trackEvent(eventName: string, eventData: UmamiEventData = {}) {
    try {
      // Check if umami is available
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track(eventName, eventData);
        this.log(`Event tracked: ${eventName}`, eventData);
      } else {
        this.log(`Umami not available, would track: ${eventName}`, eventData);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Health Tools Tracking
  trackHealthToolOpened(toolId: string, toolName: string) {
    this.startTimes.set(`tool_${toolId}`, Date.now());
    this.trackEvent('health_tool_opened', {
      tool_id: toolId,
      tool_name: toolName,
      category: 'health_tools',
      action: 'opened'
    });
  }

  trackHealthToolCompleted(toolId: string, toolName: string, resultScore?: number) {
    const startTime = this.startTimes.get(`tool_${toolId}`);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    this.trackEvent('health_tool_completed', {
      tool_id: toolId,
      tool_name: toolName,
      category: 'health_tools',
      action: 'completed',
      duration,
      result_score: resultScore
    });
    
    this.startTimes.delete(`tool_${toolId}`);
  }

  trackHealthToolClosed(toolId: string, toolName: string) {
    const startTime = this.startTimes.get(`tool_${toolId}`);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    this.trackEvent('health_tool_closed', {
      tool_id: toolId,
      tool_name: toolName,
      category: 'health_tools',
      action: 'closed',
      duration
    });
    
    this.startTimes.delete(`tool_${toolId}`);
  }

  trackHealthToolResult(toolId: string, toolName: string, resultScore?: number) {
    this.trackEvent('health_tool_result', {
      tool_id: toolId,
      tool_name: toolName,
      category: 'health_tools',
      action: 'result_generated',
      result_score: resultScore
    });
  }

  // Booking Flow Tracking
  trackBookingStarted() {
    this.startTimes.set('booking_flow', Date.now());
    this.trackEvent('booking_started', {
      category: 'booking',
      action: 'started'
    });
  }

  trackDoctorSelected(doctorId: number, doctorName: string, specialtyId?: number) {
    this.trackEvent('doctor_selected', {
      category: 'booking',
      action: 'doctor_selected',
      doctor_id: doctorId,
      doctor_name: doctorName,
      specialty_id: specialtyId
    });
  }

  trackSpecialtySelected(specialtyId: number, specialtyName: string) {
    this.trackEvent('specialty_selected', {
      category: 'booking',
      action: 'specialty_selected',
      specialty_id: specialtyId,
      specialty_name: specialtyName
    });
  }

  trackBookingCompleted(doctorId?: number, specialtyId?: number) {
    const startTime = this.startTimes.get('booking_flow');
    const duration = startTime ? Date.now() - startTime : undefined;
    
    this.trackEvent('booking_completed', {
      category: 'booking',
      action: 'completed',
      doctor_id: doctorId,
      specialty_id: specialtyId,
      duration
    });
    
    this.startTimes.delete('booking_flow');
  }

  // CTA and Engagement Tracking
  trackCTAClick(element: string, action: 'phone' | 'whatsapp' | 'booking' | 'other' = 'other') {
    this.trackEvent('cta_clicked', {
      category: 'engagement',
      action: 'cta_clicked',
      element,
      cta_type: action
    });
  }

  trackSectionView(sectionName: string) {
    this.trackEvent('section_viewed', {
      category: 'engagement',
      action: 'section_viewed',
      section: sectionName
    });
  }

  trackChatInteraction(action: 'opened' | 'closed' | 'message_sent' | 'doctor_selected') {
    this.trackEvent('chat_interaction', {
      category: 'engagement',
      action: action,
      element: 'chatbot'
    });
  }

  // Page Tracking
  trackPageView(page: string, title?: string) {
    this.trackEvent('page_view', {
      page,
      title: title || page,
      timestamp: Date.now()
    });
  }

  trackVirtualPageView(virtualPage: string, context?: string) {
    this.trackEvent('virtual_page_view', {
      virtual_page: virtualPage,
      context,
      timestamp: Date.now()
    });
  }

  // Performance Tracking
  trackPerformance(action: 'page_load_time' | 'tool_load_time', duration: number, page?: string) {
    this.trackEvent('performance_metric', {
      category: 'performance',
      action,
      duration,
      page
    });
  }

  trackError(errorType: string, errorMessage?: string, page?: string) {
    this.trackEvent('error_occurred', {
      category: 'performance',
      action: 'error_occurred',
      error_type: errorType,
      error_message: errorMessage,
      page
    });
  }

  // Mobile Specific Tracking
  trackMobileInteraction(action: string, element: string) {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.trackEvent('mobile_interaction', {
        category: 'mobile',
        action,
        element,
        screen_width: window.innerWidth
      });
    }
  }
}

export const analytics = new AnalyticsService();
