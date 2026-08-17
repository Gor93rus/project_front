import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Rules', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'TON Explorer', href: '#' },
  { label: 'AML', href: '#' },
];

function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-lg flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, var(--primary), rgb(var(--primary-600)))',
      }}
    >
      <svg width={size * 0.47} height={size * 0.47} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const TelegramGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.486c-.148.658-.537.818-1.085.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.13.876.735z" />
  </svg>
);

interface PageFooterProps {
  /** Компактный вариант для мобильной главной: футер там попадает в первый
   *  экран, поэтому вместо 204 px раскладки в четыре яруса — три плотные
   *  строки под 78 px. Десктоп продолжает использовать полный вариант. */
  compact?: boolean;
}

export function PageFooter({ compact = false }: PageFooterProps = {}) {
  if (compact) {
    return (
      <footer
        className="px-4 pt-2.5 pb-2"
        style={{ borderTop: '1px solid var(--line-strong)' }}
      >
        {/* Строка 1: бренд слева, возрастное ограничение справа */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <BrandMark size={20} />
            <p
              className="text-3xs font-extrabold truncate"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary-bright), var(--gold), var(--secondary-soft))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Weekend Millions
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-3xs font-bold px-1.5 rounded"
              style={{
                color: 'var(--ink-1)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--line-strong)',
                lineHeight: '16px',
              }}
            >
              18+
            </span>
            <a href="#" className="flex items-center" style={{ color: 'var(--ton-soft)' }} aria-label="Telegram channel">
              <TelegramGlyph />
            </a>
          </div>
        </div>

        {/* Строка 2: ссылки. Цвет поднят с --ink-3 (2.6:1 на --bg-0) до
            --ink-2 (6.1:1) — на прежнем они были на грани различимости. */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
          {LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="text-3xs font-medium transition-colors"
              style={{ color: 'var(--ink-2)' }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Строка 3: копирайт + короткий дисклеймер. Полный текст про
            зависимость живёт на странице Rules. */}
        <p className="text-3xs" style={{ color: 'var(--ink-3)' }}>
          Play responsibly · On-chain draws · © 2025 Weekend Millions
        </p>
      </footer>
    );
  }

  return (
    <footer className="px-4 pt-6 pb-4">
      {/* Brand — цвета привязаны к токенам primary/secondary/gold (раньше здесь
          был захардкоженный Telegram-blue #0098EA и оранжевый #FF8E53, которых
          нет в палитре проекта). */}
      <div className="flex items-center gap-2 mb-4">
        <BrandMark size={28} />
        <motion.p
          className="text-2xs font-extrabold"
          style={{
            background: 'linear-gradient(135deg, var(--primary-bright), var(--gold), var(--secondary-soft))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          Weekend Millions
        </motion.p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {LINKS.map(l => (
          <a key={l.label} href={l.href}
            className="text-3xs transition-colors"
            style={{ color: 'var(--ink-3)' }}>
            {l.label}
          </a>
        ))}
      </div>

      {/* Support / Channel */}
      <div className="flex items-center gap-3 mb-4">
        <a href="#" className="flex items-center gap-1.5 text-3xs font-medium"
          style={{ color: 'var(--ton)' }}>
          <TelegramGlyph />
          Support
        </a>
        <a href="#" className="flex items-center gap-1.5 text-3xs font-medium"
          style={{ color: 'var(--ton)' }}>
          <TelegramGlyph />
          Channel
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-3xs leading-relaxed" style={{ color: 'var(--ink-3)', opacity: 0.6 }}>
        18+ Gambling can be addictive. Play responsibly.
        Weekend Millions runs on the TON blockchain. All draws are verifiable on-chain.
      </p>

      <p className="text-3xs mt-2" style={{ color: 'var(--ink-3)', opacity: 0.4 }}>
        © 2025 Weekend Millions. All rights reserved.
      </p>
    </footer>
  );
}
