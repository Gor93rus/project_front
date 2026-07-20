import { useEffect, useState } from 'react';

/** Хук, возвращающий true, когда window.scrollY > threshold.
 *  Заменяет дублирующиеся scroll-слушатели в Header и NavBar одним общим. */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
      });
    };
    onScroll(); // синхронизируем начальное состояние
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return scrolled;
}