
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analyticsService';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);

  return {
    trackHealthTool: {
      opened: analytics.trackHealthToolOpened.bind(analytics),
      completed: analytics.trackHealthToolCompleted.bind(analytics),
      closed: analytics.trackHealthToolClosed.bind(analytics),
      result: analytics.trackHealthToolResult.bind(analytics)
    },
    trackBooking: {
      started: analytics.trackBookingStarted.bind(analytics),
      doctorSelected: analytics.trackDoctorSelected.bind(analytics),
      specialtySelected: analytics.trackSpecialtySelected.bind(analytics),
      completed: analytics.trackBookingCompleted.bind(analytics)
    },
    trackCTA: analytics.trackCTAClick.bind(analytics),
    trackSection: analytics.trackSectionView.bind(analytics),
    trackChat: analytics.trackChatInteraction.bind(analytics),
    trackVirtualPage: analytics.trackVirtualPageView.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackMobile: analytics.trackMobileInteraction.bind(analytics)
  };
};
