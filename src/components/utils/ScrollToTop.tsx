
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scroll to top when route changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Manually track page views with Umami for SPA navigation
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(pathname);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
