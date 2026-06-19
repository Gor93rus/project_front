/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── Типографическая шкала ──
      fontSize: {
        '3xs':   ['7px',  { lineHeight: '1.3' }],
        '2xs':   ['8px',  { lineHeight: '1.3' }],
        'xs':    ['10px', { lineHeight: '1.4' }],
        'sm':    ['12px', { lineHeight: '1.4' }],
        'base':  ['14px', { lineHeight: '1.5' }],
        'lg':    ['16px', { lineHeight: '1.5' }],
        'xl':    ['18px', { lineHeight: '1.4' }],
        '2xl':   ['22px', { lineHeight: '1.3' }],
        '3xl':   ['28px', { lineHeight: '1.2' }],
        '4xl':   ['36px', { lineHeight: '1.1' }],
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
      },
      // ── Фоновые цвета ──
      backgroundColor: {
        page:  '#06071A',
        card:  '#0B1028',
        raised:'#111B3A',
        deep:  '#1A2D55',
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