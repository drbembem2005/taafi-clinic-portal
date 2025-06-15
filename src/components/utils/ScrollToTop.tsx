
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scroll to top when route changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Track page views with centralized analytics
    analytics.trackPageView(pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
