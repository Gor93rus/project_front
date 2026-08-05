// Reusable animated SVG icons that mimic the polish of Lottie animations.
// Each icon is self-contained and uses CSS keyframes from index.css.

interface IconProps {
  size?: number;
  color?: string;
}

export function RocketIcon({ size = 36, color = '#FF6B6B' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-float-y">
        <defs>
          <linearGradient id="r-body" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M24 4c5 4 8 10 8 18v10l-4 4h-8l-4-4V22c0-8 3-14 8-18z" fill="url(#r-body)"/>
        <circle cx="24" cy="20" r="3.5" fill={color} opacity="0.85"/>
        <path d="M16 30l-4 6 4-1z" fill={color}/>
        <path d="M32 30l4 6-4-1z" fill={color}/>
      </svg>
      <span className="absolute left-1/2 -translate-x-1/2 anim-flicker"
        style={{ bottom: -4, width: size * 0.3, height: size * 0.4,
          background: `radial-gradient(ellipse at center, #FFD200 0%, ${color} 60%, transparent 80%)`,
          borderRadius: '50% 50% 40% 40%', filter: 'blur(2px)' }} />
    </div>
  );
}

export function CoinIcon({ size = 36, color = '#FFD200' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size, perspective: 200 }}>
      <svg viewBox="0 0 48 48" width={size} height={size} style={{ animation: 'coin-flip 2.4s ease-in-out infinite' }}>
        <defs>
          <radialGradient id="c-grad" cx="0.4" cy="0.4">
            <stop offset="0" stopColor="#FFF7B0"/><stop offset="1" stopColor={color}/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#c-grad)" stroke="#B8860B" strokeWidth="1.5"/>
        <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="#7a5a00">$</text>
      </svg>
      <span className="absolute" style={{ top: -2, right: -2, width: 4, height: 4,
        background: '#fff', borderRadius: '50%', animation: 'sparkle 1.6s ease-in-out infinite' }} />
      <span className="absolute" style={{ bottom: 2, left: -1, width: 3, height: 3,
        background: '#fff', borderRadius: '50%', animation: 'sparkle 1.6s 0.7s ease-in-out infinite' }} />
    </div>
  );
}

export function DiamondIcon({ size = 36, color = '#79e0ff' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-pulse-glow">
        <defs>
          <linearGradient id="d-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M24 4l14 14L24 44 10 18z" fill="url(#d-grad)" stroke={color} strokeWidth="1.2"/>
        <path d="M10 18h28M24 4l-6 14 6 26 6-26z" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.55"/>
      </svg>
      <span className="absolute" style={{ top: 4, left: 6, width: 5, height: 5,
        background: '#fff', borderRadius: '50%', animation: 'sparkle 1.4s ease-in-out infinite' }} />
      <span className="absolute" style={{ bottom: 8, right: 4, width: 3, height: 3,
        background: '#fff', borderRadius: '50%', animation: 'sparkle 1.4s 0.5s ease-in-out infinite' }} />
    </div>
  );
}

export function TrophyIcon({ size = 36, color = '#FFB347' }: IconProps) {
  return (
    <div className="relative inline-block overflow-hidden" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-float-y">
        <defs>
          <linearGradient id="t-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FFE082"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M16 6h16v8a8 8 0 0 1-16 0z" fill="url(#t-grad)" stroke="#9a6800" strokeWidth="1"/>
        <path d="M14 8H8v3a4 4 0 0 0 4 4M34 8h6v3a4 4 0 0 1-4 4" fill="none" stroke="#9a6800" strokeWidth="1.5"/>
        <rect x="20" y="22" width="8" height="6" fill="url(#t-grad)"/>
        <rect x="14" y="28" width="20" height="6" rx="2" fill="url(#t-grad)" stroke="#9a6800" strokeWidth="1"/>
        <path d="M22 12l1.5 3 3 .4-2.2 2 .6 3-2.9-1.6L19 20.4l.6-3-2.2-2 3-.4z" fill="#fff" opacity="0.6"/>
      </svg>
      <span className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
          animation: 'shine-sweep 3s linear infinite' }} />
    </div>
  );
}

export function ShieldIcon({ size = 36, color = '#4ade80' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-pulse-glow">
        <defs>
          <linearGradient id="s-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a7f3c8"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M24 4l16 6v12c0 12-8 18-16 22-8-4-16-10-16-22V10z" fill="url(#s-grad)" stroke="#1f7a3a" strokeWidth="1"/>
        <path d="M16 24l6 6 12-12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function LightningIcon({ size = 36 }: IconProps) {
  const s = size / 500;
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 500 500" width={size} height={size}>
        <defs>
          <style>{`
            @keyframes bp{from{transform:scale(1)}to{transform:scale(1.06)}}
            @keyframes bs{from{opacity:0.5;transform:scale(1)}to{opacity:0.3;transform:scale(0.88)}}
          `}</style>
          <radialGradient id="bg" cx="35%" cy="32%" r="68%">
            <stop offset="0" stopColor="#fff9c4"/>
            <stop offset="0.25" stopColor="#ffd54f"/>
            <stop offset="0.55" stopColor="#ffb300"/>
            <stop offset="0.8" stopColor="#ff8f00"/>
            <stop offset="1" stopColor="#bf5e00"/>
          </radialGradient>
          <radialGradient id="sh" cx="28%" cy="22%" r="45%">
            <stop offset="0" stopColor="#ffffff"/>
            <stop offset="0.4" stopColor="#ffffff66"/>
            <stop offset="1" stopColor="#ffffff00"/>
          </radialGradient>
          <radialGradient id="sg" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#00000080"/>
            <stop offset="0.6" stopColor="#00000030"/>
            <stop offset="1" stopColor="#00000000"/>
          </radialGradient>
        </defs>
        <g transform={`matrix(${s},0,0,${s},${-274.791687*s},${73.299767*s})`}>
          <g style={{transformOrigin:'310px 220px',animation:'bp 1.3s ease-in-out infinite alternate'}}>
            <circle cx="541.942" cy="105.043" r="66.028" fill="url(#bg)"/>
            <ellipse cx="290" cy="190" rx="28.612" ry="19.808" fill="url(#sh)" transform="matrix(0.984808,-0.173648,0.173648,0.984808,219.111629,-74.878529)"/>
            <circle cx="529.023" cy="53.201" r="7.703" fill="#ffffff99"/>
            <image href="data:image/png;base64,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" width="106.465" height="100.438" x="493.477" y="55.494"/>
          </g>
          <ellipse style={{transformOrigin:'524.938px 89.999px',opacity:0.5,animation:'bs 1.3s ease-in-out infinite alternate'}} cx="537.406" cy="176.169" rx="65" ry="16" fill="url(#sg)"/>
        </g>
        <g transform={`matrix(${s},0,0,${s},${-52.692707*s},${-20.521233*s})`}>
          <g style={{transformOrigin:'307.889px 208.441px',animation:'bp 1.3s ease-in-out infinite alternate'}}>
            <circle cx="222.693" cy="220" r="70" fill="url(#bg)"/>
            <ellipse cx="198" cy="188" rx="32" ry="22" fill="url(#sh)" transform="matrix(0.939693,-0.34202,0.34202,0.939693,-44.110184,72.078084)"/>
            <circle cx="194.538" cy="173.751" r="9" fill="#ffffff99"/>
            <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABvCAMAAACes72/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABmFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADn+ofsAAAAiHRSTlMADnbl/+rImmpGHAgw4v3ksJJbNhYDH9r03amBUCUQBarQmVwaAT353FYEp5ci51hsrA/ADDmllMxjG+BNodi8LIquGAm4F0CWJu/+SIDVFNdUKcnUIOv64bFCUlMLE1XKLs+QT5j1M4kqnO1ntXc8+xlzfEVJeoUk5sKDRGhOuo7uo9I6OJHLyup9OgAAAwxJREFUeJztmOtD0lAUwJEGU0tABRNJ14tETUegkaKBho9QFMgHmRmWYmZapr0f9u7fbki5e8Z275mrb/f3cTv8uHf3nnPPZrNxOBwOh8P5r9TYTwkKDqdYW1d/2qLsTINA4nJ7Gpuavb6TyVrOCrq0+tsC59o7zMmk8/qyYxwXLl66HETarnQybEeEulAz7+7ByBSuSghbbx/SJsgIWxgrE651M2URJ9oW7WfaBlBrcMR15roGY0R43w0HzTbIHNpQnAgPKxc6WobtIzdbdWSJCNMmk0PrVa/7vEl51ON2qXfHbjFlqXHC1qOzZtLE5OCUR0mx24hkSKZV2fQMO55Ohhja7JxF2dwsYctYHdrMtCpLJy3KQMKPpyzaQMJjcpoKmfDZCYsykPAxbHE1gkz4zoHylY5kLtck5+qGMIURAhI+GskH7hB5NB9YMDdYkPCLS4KWkGxmhHLV77UUcCdLGZDwRtytR9rIhDdmcRlny7BVZZbuYWT9UZxNcK0gbPcT2p/FR0RRr4anm03P1GFf/XM98qCo0WURS1GfVePh1gquPYS6R4iNnPf//e917bZKbQBbaRMx15rHyiZJb2zp/LMkAt0Tds9AZRU8vO28NRso8oLw1KIN7scdq631LmnzW63Mz56bXVUasOcctmjbK+Btey9EcXCVGoG2SfuVmH1KrUbb1J0eM97kmyWk7eD4cHIdGAa9JGW0NW1Uw/Q6wAqvsPttRA2LDxnEwEOIlguEzbCZgYfQrrHM9pqIM2q0QGmu9BUGNBGBBuvw5i1pc9Ka+/w2EflOL1JTLcMUmeYJv9epvSsuMoLR28EWxF6l+wD7gI9Umc07D6IDcCWCn0AaCIesdz84E6G4RdyrmQL3EKez5ikrvvXKAIILnzWdHKZziFQ1DsIXf1vC7aq6XP1UcTpdUN8GlLbmK0ZGq4AAyV49LQ0l2UQrvfaNLhvD9qkVfF0FY1d22fQLie/7jv58i8sn+8Yl/fgZ0qh+0Y8z5hC9k7VKm9rQ4BRHc+3m34s4HA6Hw/l3/AY8L3YNyL/n9gAAAABJRU5ErkJggg==" width="77.143" height="111.206" x="162.464" y="169.52"/>
          </g>
          <ellipse style={{transformOrigin:'307.89px 208.439px',opacity:0.5,animation:'bs 1.3s ease-in-out infinite alternate'}} cx="230.352" cy="294.609" rx="75" ry="18" fill="url(#sg)"/>
        </g>
      </svg>
    </div>
  );
}

export function ContractIcon({ size = 36, color = '#a78bfa' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <linearGradient id="ct-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <rect x="10" y="6" width="28" height="36" rx="3" fill="url(#ct-grad)" stroke="#5b21b6" strokeWidth="1"/>
        <path d="M16 16h16M16 22h16M16 28h12" stroke="#5b21b6" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="34" r="4" fill={color}/>
        <path d="M22 34l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="absolute inset-0 m-auto rounded-full pointer-events-none"
        style={{ width: '60%', height: '60%', border: `2px solid ${color}`, animation: 'ring-expand 2s ease-out infinite' }} />
    </div>
  );
}

export function FlameIcon({ size = 36, color = '#FF6B6B' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="anim-flicker">
      <defs>
        <linearGradient id="f-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFD200"/><stop offset="1" stopColor={color}/>
        </linearGradient>
      </defs>
      <path d="M24 4s8 8 8 18a8 8 0 0 1-16 0c0-4 2-6 2-6s-4 1-6 6a12 12 0 1 0 22 2c0-10-10-20-10-20z" fill="url(#f-grad)"/>
      <path d="M24 22s4 4 4 8a4 4 0 1 1-8 0c0-2 4-8 4-8z" fill="#FFFACC"/>
    </svg>
  );
}

export function ClockIcon({ size = 36, color = '#4ECDC4' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <radialGradient id="cl-grad" cx="0.5" cy="0.5">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#cl-grad)" stroke="#0c6b66" strokeWidth="1.2"/>
        <line x1="24" y1="24" x2="24" y2="10" stroke="#0c6b66" strokeWidth="2.5" strokeLinecap="round"
          style={{ transformOrigin: '24px 24px', animation: 'spin-slow 12s linear infinite' }}/>
        <line x1="24" y1="24" x2="34" y2="24" stroke="#0c6b66" strokeWidth="2" strokeLinecap="round"
          style={{ transformOrigin: '24px 24px', animation: 'spin-slow 2s linear infinite' }}/>
        <circle cx="24" cy="24" r="2" fill="#0c6b66"/>
      </svg>
    </div>
  );
}

export function StarIcon({ size = 36, color = '#FFD200' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-spin-slow">
        <defs>
          <linearGradient id="st-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M24 4l6 14 16 1.4-12 10.4 4 15.6L24 37l-14 8 4-15.6L2 19.4 18 18z" fill="url(#st-grad)" stroke="#9a6800" strokeWidth="1"/>
      </svg>
    </div>
  );
}

export function GiftIcon({ size = 36, color = '#FFB347' }: IconProps) {
  return (
    <div className="relative inline-block overflow-hidden" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-float-y">
        <defs>
          <linearGradient id="g-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FFD9A8"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <rect x="6" y="18" width="36" height="26" rx="2" fill="url(#g-grad)" stroke="#9a4a00" strokeWidth="1"/>
        <rect x="20" y="18" width="8" height="26" fill="#FF6B6B"/>
        <rect x="4" y="14" width="40" height="8" rx="1" fill="url(#g-grad)" stroke="#9a4a00" strokeWidth="1"/>
        <path d="M24 14c-4-4-10-2-10 2s4 4 10 2zM24 14c4-4 10-2 10 2s-4 4-10 2z" fill="#FF6B6B" stroke="#9a4a00" strokeWidth="0.8"/>
      </svg>
      {[0, 1, 2].map(i => (
        <span key={i} className="absolute"
          style={{
            top: 4, left: `${30 + i * 20}%`,
            width: 3, height: 6,
            background: ['#4ade80', '#79c8ff', '#FFD200'][i],
            animation: `confetti-fall 1.6s ${i * 0.3}s linear infinite`,
          }} />
      ))}
    </div>
  );
}

export function GemIcon({ size = 36, color = '#a78bfa' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-pulse-glow">
        <defs>
          <linearGradient id="gm-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#e9d5ff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M14 6h20l8 12-18 24L6 18z" fill="url(#gm-grad)" stroke="#5b21b6" strokeWidth="1"/>
        <path d="M6 18h36M14 6l4 12 6 24M34 6l-4 12-6 24" stroke="#fff" strokeWidth="0.7" fill="none" opacity="0.6"/>
      </svg>
    </div>
  );
}

export function MoonIcon({ size = 36, color = '#7c93ff' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-float-y">
        <defs>
          <linearGradient id="m-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M30 6a18 18 0 1 0 12 30A14 14 0 0 1 30 6z" fill="url(#m-grad)" stroke="#3a3f8f" strokeWidth="1"/>
      </svg>
      <span className="absolute" style={{ top: 4, right: 4, width: 3, height: 3, background: '#fff',
        borderRadius: '50%', animation: 'sparkle 1.6s ease-in-out infinite' }} />
      <span className="absolute" style={{ bottom: 8, left: 6, width: 2, height: 2, background: '#fff',
        borderRadius: '50%', animation: 'sparkle 1.6s 0.6s ease-in-out infinite' }} />
    </div>
  );
}

export function HeartIcon({ size = 36, color = '#FF6262' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="anim-pulse-glow">
      <defs>
        <linearGradient id="h-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffb4b4"/><stop offset="1" stopColor={color}/>
        </linearGradient>
      </defs>
      <path d="M24 42s-14-9-14-22a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 13-14 22-14 22z" fill="url(#h-grad)"/>
    </svg>
  );
}

export function DollarIcon({ size = 36, color = '#4ade80' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} className="anim-float-y">
        <defs>
          <radialGradient id="dl-grad" cx="0.4" cy="0.4">
            <stop offset="0" stopColor="#dcfce7"/><stop offset="1" stopColor={color}/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#dl-grad)" stroke="#1f7a3a" strokeWidth="1.5"/>
        <text x="24" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#0a4d20">$</text>
      </svg>
    </div>
  );
}


