import { useEffect, useState } from 'react';

/**
 * Shared scroll detection hook.
 * Returns `true` when window.scrollY exceeds the given threshold.
 *
 * @param threshold — scroll offset in pixels before `scrolled` flips to true
 */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}