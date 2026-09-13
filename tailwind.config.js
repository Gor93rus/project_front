/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── Типографическая шкала (дно поднято до читаемого ≥11px, фаза C1-a) ──
      fontSize: {
        '3xs':   ['11px', { lineHeight: '1.35' }],
        '2xs':   ['12px', { lineHeight: '1.35' }],
        'xs':    ['13px', { lineHeight: '1.4' }],
        'sm':    ['14px', { lineHeight: '1.45' }],
        'base':  ['15px', { lineHeight: '1.55' }],
        'lg':    ['16px', { lineHeight: '1.5' }],
        'xl':    ['18px', { lineHeight: '1.4' }],
        '2xl':   ['22px', { lineHeight: '1.3' }],
        '3xl':   ['28px', { lineHeight: '1.2' }],
        '4xl':   ['36px', { lineHeight: '1.1' }],
        // ── V2 типографическая шкала (The Market spec, Этап 1 — объявлена,
        // не применена: старые text-* классы выше не тронуты). ──
        'v2-3xs': ['7px',  { lineHeight: '1.2',  letterSpacing: '0.05em' }],
        'v2-2xs': ['9px',  { lineHeight: '1.3',  letterSpacing: '0.02em' }],
        'v2-xs':  ['11px', { lineHeight: '1.4',  letterSpacing: '0' }],
        'v2-sm':  ['13px', { lineHeight: '1.4',  letterSpacing: '-0.01em' }],
        'v2-base':['15px', { lineHeight: '1.4',  letterSpacing: '-0.01em' }],
        'v2-lg':  ['17px', { lineHeight: '1.3',  letterSpacing: '-0.02em' }],
        'v2-xl':  ['20px', { lineHeight: '1.3',  letterSpacing: '-0.02em' }],
        'v2-2xl': ['24px', { lineHeight: '1.2',  letterSpacing: '-0.03em' }],
        'v2-3xl': ['30px', { lineHeight: '1.1',  letterSpacing: '-0.03em' }],
        'v2-4xl': ['38px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
      },
      // ── Цвета из design-tokens.css ──
      colors: {
        primary: {
          DEFAULT: '#0A7CFF',
          soft:    '#3B9AFF',
          bright:  '#69B1FF',
          glow:    'rgba(10,124,255,0.45)',
          dim:     'rgba(10,124,255,0.10)',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          soft:    '#9F67FF',
          glow:    'rgba(124,58,237,0.35)',
          dim:     'rgba(124,58,237,0.10)',
        },
        gold: {
          DEFAULT: '#FADB14',
          soft:    '#FFEC3D',
          bright:  '#FFF566',
          glow:    'rgba(250,219,20,0.50)',
          dim:     'rgba(250,219,20,0.10)',
        },
        emerald: {
          DEFAULT: '#52C41A',
          soft:    '#73D13D',
          glow:    'rgba(82,196,26,0.40)',
          dim:     'rgba(82,196,26,0.08)',
        },
        coral: {
          DEFAULT: '#FF4D4F',
          soft:    '#FF7875',
          glow:    'rgba(255,77,79,0.45)',
          dim:     'rgba(255,77,79,0.10)',
        },
        ink: {
          0:  '#F0F4FF',
          1:  '#C4D0E8',
          2:  '#7B95B8',
          3:  '#3D5878',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          1:       'rgba(255,255,255,0.04)',
          2:       'rgba(255,255,255,0.06)',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong:  'rgba(255,255,255,0.12)',
        },
        // ── V2 (Carbon OLED / Drop Economy) — namespaced под v2-*, чтобы не
        // конфликтовать со старой Dark Vault моделью выше. Этап 1: объявлены,
        // не применены ни в одном компоненте. ──
        v2: {
          primary:  '#00E5FF',
          'primary-to': '#0A7CFF',
          gold:     '#FFB800',
          ruby:     '#FF2D55',
          emerald:  '#00E676',
          purple:   '#8B5CF6',
        },
        rarity: {
          common:    '#8E9BAE',
          rare:      '#00E5FF',
          epic:      '#A855F7',
          legendary: '#FFB800',
          mythic:    '#FF2D55',
        },
      },
      // ── Фоновые цвета ──
      backgroundColor: {
        page:  '#06071A',
        card:  '#0B1028',
        raised:'#111B3A',
        deep:  '#1A2D55',
        // ── V2 Carbon Base (Этап 1 — объявлены, не применены) ──
        'v2-page':        '#08090E',
        'v2-surface-0':   '#0D0F17',
        'v2-card':        '#121522',
        'v2-card-raised': '#181C2E',
        'v2-input':       '#101320',
      },
      // ── Glow-тени ──
      boxShadow: {
        'card':       '0 8px 32px rgba(0,0,0,0.60), 0 2px 8px rgba(0,0,0,0.45)',
        'glow-primary':   '0 0 20px rgba(10,124,255,0.45)',
        'glow-secondary': '0 0 20px rgba(124,58,237,0.35)',
        'glow-gold':      '0 0 20px rgba(250,219,20,0.50)',
        'glow-coral':     '0 0 20px rgba(255,77,79,0.45)',
      },
      // ── Шрифты ──
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        // ── V2 — подключается в Этапе 2 (General Sans, self-host). Пока
        // объявлено на будущее, body ещё использует display выше. ──
        'v2-sans': ['General Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      // ── V2 Радиусы (шкала The Market, Этап 1 — объявлены, не применены) ──
      borderRadius: {
        'v2-xs':   '6px',
        'v2-sm':   '10px',
        'v2-md':   '14px',
        'v2-lg':   '18px',
        'v2-xl':   '22px',
        'v2-2xl':  '28px',
        'v2-dock': '32px',
      },
      // ── Анимации ──
      animation: {
        'float-y':      'float-y 2.6s ease-in-out infinite',
        'spin-slow':    'spin-slow 6s linear infinite',
        'pulse-glow':   'pulse-glow 2s ease-in-out infinite',
        'pulse-live':   'pulse-live 1.5s infinite',
        'ticker':       'ticker 30s linear infinite',
        'shimmer':      'artShimmer 4s ease-in-out infinite alternate',
        'fade-slide-up':'fadeSlideUp 0.4s ease-out',
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.10)', opacity: '0.85' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        artShimmer: {
          '0%':   { opacity: '0.5', transform: 'translateY(0)' },
          '100%': { opacity: '0.85', transform: 'translateY(-3px)' },
        },
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
