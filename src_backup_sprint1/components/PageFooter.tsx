import { motion } from 'framer-motion';

export function PageFooter() {
  const links = [
    { label: 'Правила', href: '#' },
    { label: 'Политика', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Поддержка', href: '#' },
    { label: 'TON Explorer', href: '#' },
    { label: 'AML', href: '#' },
  ];

  return (
    <footer className="px-4 pt-6 pb-4">
      {/* Logo + анимированный бренд */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0098EA, #007cc7)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <motion.p
          className="text-[12px] font-extrabold"
          style={{
            background: 'linear-gradient(135deg, #0098EA, #a78bfa, #FF8E53)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          Weekend Millions
        </motion.p>
      </div>

      {/* Links grid */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {links.map(l => (
          <a key={l.label} href={l.href}
            className="text-[11px] transition-colors"
            style={{ color: 'var(--ink-3)' }}>
            {l.label}
          </a>
        ))}
      </div>

      {/* Support links */}
      <div className="flex items-center gap-3 mb-4">
        <a href="#" className="flex items-center gap-1.5 text-[11px] font-medium"
          style={{ color: 'var(--ton)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.486c-.148.658-.537.818-1.085.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.13.876.735z"/>
          </svg>
          Поддержка
        </a>
        <a href="#" className="flex items-center gap-1.5 text-[11px] font-medium"
          style={{ color: 'var(--ton)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.486c-.148.658-.537.818-1.085.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.13.876.735z"/>
          </svg>
          Канал
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] leading-relaxed" style={{ color: 'var(--ink-3)', opacity: 0.6 }}>
        18+ Игра может вызывать зависимость. Играйте ответственно.
        Weekend Millions работает на блокчейне TON. Все розыгрыши верифицируемы on-chain.
      </p>

      <p className="text-[9px] mt-2" style={{ color: 'var(--ink-3)', opacity: 0.4 }}>
        © 2025 Weekend Millions. All rights reserved.
      </p>
    </footer>
  );
}
