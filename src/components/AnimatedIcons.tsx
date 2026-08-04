// Reusable SVG icons — static, no infinite animations.
// Kept lightweight for mobile performance budget.

interface IconProps {
  size?: number;
  color?: string;
}

export function RocketIcon({ size = 36, color = '#FF6B6B' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
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
      <span className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: -4, width: size * 0.3, height: size * 0.4,
          background: `radial-gradient(ellipse at center, #FFD200 0%, ${color} 60%, transparent 80%)`,
          borderRadius: '50% 50% 40% 40%', filter: 'blur(2px)' }} />
    </div>
  );
}

export function CoinIcon({ size = 36, color = '#FFD200' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <radialGradient id="c-grad" cx="0.4" cy="0.4">
            <stop offset="0" stopColor="#FFF7B0"/><stop offset="1" stopColor={color}/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#c-grad)" stroke="#B8860B" strokeWidth="1.5"/>
        <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="#7a5a00">$</text>
      </svg>
    </div>
  );
}

export function DiamondIcon({ size = 36, color = '#79e0ff' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <linearGradient id="d-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M24 4l14 14L24 44 10 18z" fill="url(#d-grad)" stroke={color} strokeWidth="1.2"/>
        <path d="M10 18h28M24 4l-6 14 6 26 6-26z" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.55"/>
      </svg>
    </div>
  );
}

export function TrophyIcon({ size = 36, color = '#FFB347' }: IconProps) {
  return (
    <div className="relative inline-block overflow-hidden" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
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
    </div>
  );
}

export function ShieldIcon({ size = 36, color = '#4ade80' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <linearGradient id="s-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a7f3c8"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M24 4l16 6v12c0 12-8 18-16 22-8-4-16-10-16-12V10z" fill="url(#s-grad)" stroke="#1f7a3a" strokeWidth="1"/>
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
          <g>
            <circle cx="541.942" cy="105.043" r="66.028" fill="url(#bg)"/>
            <ellipse cx="290" cy="190" rx="28.612" ry="19.808" fill="url(#sh)" transform="matrix(0.984808,-0.173648,0.173648,0.984808,219.111629,-74.878529)"/>
            <circle cx="529.023" cy="53.201" r="7.703" fill="#ffffff99"/>
          </g>
          <ellipse style={{opacity:0.5}} cx="537.406" cy="176.169" rx="65" ry="16" fill="url(#sg)"/>
        </g>
        <g transform={`matrix(${s},0,0,${s},${-52.692707*s},${-20.521233*s})`}>
          <g>
            <circle cx="222.693" cy="220" r="70" fill="url(#bg)"/>
            <ellipse cx="198" cy="188" rx="32" ry="22" fill="url(#sh)" transform="matrix(0.939693,-0.34202,0.34202,0.939693,-44.110184,72.078084)"/>
            <circle cx="194.538" cy="173.751" r="9" fill="#ffffff99"/>
          </g>
          <ellipse style={{opacity:0.5}} cx="230.352" cy="294.609" rx="75" ry="18" fill="url(#sg)"/>
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
    </div>
  );
}

export function FlameIcon({ size = 36, color = '#FF6B6B' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
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
        <line x1="24" y1="24" x2="24" y2="10" stroke="#0c6b66" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="24" y1="24" x2="34" y2="24" stroke="#0c6b66" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="2" fill="#0c6b66"/>
      </svg>
    </div>
  );
}

export function StarIcon({ size = 36, color = '#FFD200' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
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
      <svg viewBox="0 0 48 48" width={size} height={size}>
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
    </div>
  );
}

export function GemIcon({ size = 36, color = '#a78bfa' }: IconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
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
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <defs>
          <linearGradient id="m-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor={color}/>
          </linearGradient>
        </defs>
        <path d="M30 6a18 18 0 1 0 12 30A14 14 0 0 1 30 6z" fill="url(#m-grad)" stroke="#3a3f8f" strokeWidth="1"/>
      </svg>
    </div>
  );
}

export function HeartIcon({ size = 36, color = '#FF6262' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
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
      <svg viewBox="0 0 48 48" width={size} height={size}>
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
