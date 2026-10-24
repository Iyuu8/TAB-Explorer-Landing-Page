import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If there's a hash anchor like #demo, smoothly scroll to it
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Otherwise scroll to top on page change
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
