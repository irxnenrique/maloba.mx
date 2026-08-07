import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        target?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
