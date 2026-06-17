import { useEffect, useRef, useState } from 'react';
import {
  RocketIcon, CoinIcon, DiamondIcon, TrophyIcon, ShieldIcon, ContractIcon,
} from './AnimatedIcons';

const ITEMS = [
  {
    title: 'Мгновенные выплаты',
    desc: 'Призы зачисляются на ваш кошелёк за секунды после розыгрыша. Никаких задержек и ожиданий — всё автоматически через смарт-контракт.',
    icon: <RocketIcon size={32} color="#FF6B6B" />,
    accent: '#FF8E53',
  },
  {
    title: 'TON и USDT',
    desc: 'Пополняйте счёт и выводите выигрыши в TON или USDT. Поддержка всех популярных криптокошельков на блокчейне TON.',
    icon: <CoinIcon size={32} color="#FFD200" />,
    accent: '#FFD200',
  },
  {
    title: 'Provably Fair',
    desc: 'Каждый розыгрыш проводится on-chain — результат можно проверить в блокчейне. Абсолютная прозрачность и честность.',
    icon: <ShieldIcon size={32} color="#4ade80" />,
    accent: '#4ade80',
  },
  {
    title: 'Большие призы',
    desc: 'Джекпоты до 50 000 TON и регулярные розыгрыши с крупными призовыми фондами. Каждый билет — шанс на миллион.',
    icon: <TrophyIcon size={32} color="#FFB347" />,
    accent: '#FFB347',
  },
  {
    title: 'Смарт-контракт',
    desc: 'Все средства хранятся в верифицированном смарт-контракте. Никто не имеет доступа к деньгам, кроме победителей.',
    icon: <ContractIcon size={32} color="#a78bfa" />,
    accent: '#c4b5fd',
  },
  {
    title: 'Алмазная защита',
    desc: 'Проект прошёл аудит безопасности. Ваши данные и средства надёжно защищены на всех этапах.',
    icon: <DiamondIcon size={32} color="#79e0ff" />,
    accent: '#79e0ff',
  },
];

export function FeaturesBanner() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (userInteractedRef.current) {
        userInteractedRef.current = false;
        return;
      }
      const el = scrollerRef.current;
      if (!el) return;
      const next = (active + 1) % ITEMS.length;
      el.scrollTo({ left: el.clientWidth * next, behavior: 'smooth' });
      setActive(next);
    }, 3500);
    return () => clearInterval(id);
  }, [active]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    userInteractedRef.current = true;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  const scrollTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
    setActive(i);
  };

  return (
    <section className="px-4 pt-3">
      <div ref={scrollerRef} onScroll={onScroll}
        className="flex gap-3 overflow-x-auto scrollbar-none"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {ITEMS.map((item, i) => (
          <div key={i} className="flex items-start gap-3 shrink-0 w-full"
            style={{ scrollSnapAlign: 'center' }}>
            <div className="shrink-0 mt-0.5 flex items-center justify-center"
              style={{ filter: `drop-shadow(0 2px 8px ${item.accent}40)` }}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold leading-tight" style={{ color: item.accent }}>
                {item.title}
              </p>
              <p className="text-[10.5px] leading-snug mt-1" style={{ color: 'var(--ink-2)' }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {ITEMS.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 18 : 5,
              background: i === active ? 'var(--ton)' : 'var(--ink-3)',
              opacity: i === active ? 1 : 0.45,
            }} />
        ))}
      </div>
    </section>
  );
}
