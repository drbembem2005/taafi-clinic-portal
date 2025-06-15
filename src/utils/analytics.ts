
// Centralized analytics tracking utility for Umami
export interface AnalyticsEvent {
  name: string;
  data?: Record<string, any>;
}

// Health Tools Events
export interface HealthToolEvent {
  toolId: string;
  toolName: string;
  category: string;
  startTime?: number;
  duration?: number;
  result?: any;
}

// User Journey Events
export interface UserJourneyEvent {
  step: string;
  page: string;
  previousPage?: string;
  timeOnPage?: number;
}

// Search Events
export interface SearchEvent {
  query: string;
  category?: string;
  resultsCount: number;
  page: string;
}

// Click Events
export interface ClickEvent {
  element: string;
  elementId?: string;
  page: string;
  context?: string;
}

// Booking Funnel Events
export interface BookingFunnelEvent {
  step: number;
  stepName: string;
  specialty?: string;
  doctor?: string;
  timeSpent?: number;
}

class Analytics {
  private isUmamiReady(): boolean {
    return typeof window !== 'undefined' && (window as any).umami;
  }

  private track(eventName: string, eventData?: Record<string, any>): void {
    if (this.isUmamiReady()) {
      try {
        (window as any).umami.track(eventName, eventData);
        console.log('📊 Analytics tracked:', eventName, eventData);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    } else {
      console.log('📊 Analytics (dev mode):', eventName, eventData);
    }
  }

  // Page Views
  trackPageView(pathname: string): void {
    if (this.isUmamiReady()) {
      (window as any).umami.track(pathname);
    }
  }

  // Health Tools Analytics
  trackHealthToolOpen(event: HealthToolEvent): void {
    this.track('Health Tool: Open', {
      tool_id: event.toolId,
      tool_name: event.toolName,
      category: event.category,
      timestamp: Date.now()
    });
  }

  trackHealthToolComplete(event: HealthToolEvent & { result: any }): void {
    this.track('Health Tool: Complete', {
      tool_id: event.toolId,
      tool_name: event.toolName,
      category: event.category,
      duration: event.duration,
      has_result: !!event.result,
      timestamp: Date.now()
    });
  }

  trackHealthToolAbandoned(event: HealthToolEvent): void {
    this.track('Health Tool: Abandoned', {
      tool_id: event.toolId,
      tool_name: event.toolName,
      category: event.category,
      duration: event.duration,
      timestamp: Date.now()
    });
  }

  // Search Analytics
  trackSearch(event: SearchEvent): void {
    this.track('Search: Query', {
      query: event.query.toLowerCase(),
      category: event.category,
      results_count: event.resultsCount,
      page: event.page,
      timestamp: Date.now()
    });
  }

  trackSearchResultClick(query: string, clickedItem: string, position: number): void {
    this.track('Search: Result Click', {
      query: query.toLowerCase(),
      clicked_item: clickedItem,
      position: position,
      timestamp: Date.now()
    });
  }

  // Click Tracking
  trackClick(event: ClickEvent): void {
    this.track('Click: ' + event.element, {
      element_id: event.elementId,
      page: event.page,
      context: event.context,
      timestamp: Date.now()
    });
  }

  // Doctor & Specialty Analytics
  trackDoctorView(doctorName: string, specialty: string, source: string): void {
    this.track('Doctor: View Profile', {
      doctor_name: doctorName,
      specialty: specialty,
      source: source, // 'homepage', 'doctors_page', 'search', etc.
      timestamp: Date.now()
    });
  }

  trackSpecialtyView(specialtyName: string, source: string): void {
    this.track('Specialty: View', {
      specialty_name: specialtyName,
      source: source,
      timestamp: Date.now()
    });
  }

  // Booking Funnel Analytics
  trackBookingFunnelStep(event: BookingFunnelEvent): void {
    this.track(`Booking Funnel: Step ${event.step} (${event.stepName})`, {
      step: event.step,
      step_name: event.stepName,
      specialty: event.specialty,
      doctor: event.doctor,
      time_spent: event.timeSpent,
      timestamp: Date.now()
    });
  }

  trackBookingSuccess(bookingRef: string, specialty: string, doctor: string): void {
    this.track('Booking: Success', {
      booking_ref: bookingRef,
      specialty: specialty,
      doctor: doctor,
      timestamp: Date.now()
    });
  }

  trackBookingAbandoned(step: number, stepName: string, timeSpent: number): void {
    this.track('Booking: Abandoned', {
      abandoned_at_step: step,
      step_name: stepName,
      time_spent: timeSpent,
      timestamp: Date.now()
    });
  }

  // User Journey Analytics
  trackUserJourney(event: UserJourneyEvent): void {
    this.track('User Journey: ' + event.step, {
      current_page: event.page,
      previous_page: event.previousPage,
      time_on_page: event.timeOnPage,
      timestamp: Date.now()
    });
  }

  // CTA & Button Analytics
  trackCTAClick(ctaName: string, location: string): void {
    this.track('CTA: Click', {
      cta_name: ctaName,
      location: location,
      timestamp: Date.now()
    });
  }

  // Contact Analytics
  trackContactAction(action: string, method: string): void {
    this.track('Contact: ' + action, {
      method: method, // 'whatsapp', 'phone', 'form'
      timestamp: Date.now()
    });
  }

  // Error Tracking
  trackError(errorType: string, errorMessage: string, page: string): void {
    this.track('Error: ' + errorType, {
      error_message: errorMessage,
      page: page,
      timestamp: Date.now()
    });
  }

  // Performance Tracking
  trackPerformance(metric: string, value: number, page: string): void {
    this.track('Performance: ' + metric, {
      value: value,
      page: page,
      timestamp: Date.now()
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience functions for common tracking
export const trackHealthTool = {
  open: (toolId: string, toolName: string, category: string) => 
    analytics.trackHealthToolOpen({ toolId, toolName, category }),
  complete: (toolId: string, toolName: string, category: string, duration: number, result: any) => 
    analytics.trackHealthToolComplete({ toolId, toolName, category, duration, result }),
  abandon: (toolId: string, toolName: string, category: string, duration: number) => 
    analytics.trackHealthToolAbandoned({ toolId, toolName, category, duration })
};

export const trackUserInteraction = {
  search: (query: string, resultsCount: number, page: string, category?: string) =>
    analytics.trackSearch({ query, resultsCount, page, category }),
  click: (element: string, page: string, elementId?: string, context?: string) =>
    analytics.trackClick({ element, page, elementId, context }),
  ctaClick: (ctaName: string, location: string) =>
    analytics.trackCTAClick(ctaName, location)
};

export default analytics;
