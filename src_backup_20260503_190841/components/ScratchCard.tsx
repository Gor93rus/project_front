import { Ticket, Zap, Gem, Trophy, Target, Star, CloudLightning, Flame, Sparkles, Timer, Crosshair, Shield, Users, type LucideIcon } from 'lucide-react';
import type { ScratchGame, IconName } from '../data/lotteries';

const ICON_MAP: Record<IconName, LucideIcon> = {
  Gem, Trophy, Target, Star, Zap, CloudLightning, Flame, Sparkles,
  Timer, Crosshair, Shield, Users, Gauge: Zap, Layers: Sparkles, Radio: Zap,
};

interface Props {
  game: ScratchGame;
}

export function ScratchCard({ game }: Props) {
  const Icon = ICON_MAP[game.icon] ?? Star;

  return (
    <div
      className="rounded-2xl p-4 hover:border-slate-600 transition-all duration-200"
      style={{
        background: 'linear-gradient(145deg, #0e1829 0%, #0a1220 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Icon size={18} className="text-slate-300" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{game.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap size={9} className="text-emerald-400" />
              <span className="text-emerald-400 text-[9px] font-bold">Instant win</span>
            </div>
          </div>
        </div>
        <span
          className={`text-[9px] font-black uppercase tracking-wider border rounded-lg px-2 py-1 ${game.badgeColor}`}
        >
          SCRATCH
        </span>
      </div>

      {/* Top Prize */}
      <div className="mb-4">
        <p className="text-slate-600 text-[9px] uppercase tracking-wider mb-1">Top Prize</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-amber-400 font-black text-2xl leading-none">
            {game.topPrize.toLocaleString()}
          </span>
          <span className="text-amber-600 font-bold text-sm">TON</span>
          <span className="text-slate-700 text-xs">
            ≈ ${(game.topPrize * 5.13).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs shrink-0">
          <Ticket size={11} className="text-slate-600" />
          <span className="text-slate-300 font-semibold">{game.ticketPrice} TON</span>
        </div>
        <button
          className="flex-1 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
            boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
          }}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}
