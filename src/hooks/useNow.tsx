import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/** Один setInterval на всё приложение. Все компоненты, которым нужен
 *  ежесекундный тик (countdown, анимированный джекпот и т.д.),
 *  читают useNow() вместо создания своего setInterval. */
const NowContext = createContext<number>(Date.now());

export function useNow() {
  return useContext(NowContext);
}

export function NowProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}