import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Zap, Target, Trash2, ShoppingCart, History,
  User, Flame, Snowflake, Users, Trophy, Star, TrendingUp,
  Sparkles, RotateCcw, Clock, HelpCircle, X,
} from 'lucide-react';
import type { DailyLotteryConfig } from '../data/lottery-configs';
import { DAILY_RUSH_CONFIG, computePrizeTiers, computeHTPRules } from '../data/lottery-configs';
import { useLotteryDrawData } from '../hooks/useLotteryDrawData';

/* ═════════════════════════════════════════════════
   UTILS
   ═════════════════════════════════════════════════ */
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function formatTime(ms: number) { if (ms<=0) return {h:'00',m:'00',s:'00'}; return {h:String(Math.floor(ms/3_600_000)).padStart(2,'0'),m:String(Math.floor((ms%3_600_000)/60_000)).padStart(2,'0'),s:String(Math.floor((ms%60_000)/1000)).padStart(2,'0')}; }

/* ═════════════════════════════════════════════════
   CONFETTI HOOK
   ═════════════════════════════════════════════════ */
interface Piece { id: number; x: number; y: number; color: string; size: number; dur: number; delay: number; rot: number; }
function useConfetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const spawn = useCallback((cx: number, cy: number) => {
    const colors = ['var(--md-orange-500)','var(--md-yellow-600)','var(--md-red-500)','var(--md-green-500)','var(--md-blue-400)','var(--md-blue-600)','var(--md-orange-600)','var(--md-green-400)'];
    const next: Piece[] = Array.from({length:28},(_,i)=>({id:Date.now()+i,x:cx+(Math.random()-0.5)*180,y:cy+(Math.random()-0.5)*70,color:colors[Math.floor(Math.random()*colors.length)],size:5+Math.random()*6,dur:0.9+Math.random()*0.75,delay:Math.random()*0.40,rot:Math.random()*360}));
    setPieces(next); setTimeout(()=>setPieces([]),2400);
  },[]);
  return { pieces, spawn };
}

/* ═════════════════════════════════════════════════
   SVG ICONS
   ═════════════════════════════════════════════════ */
function IconFlame({ size = 20, gradientId = 'fGH' }: { size?: number; gradientId?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="icon-fire flex-shrink-0">
      <path d="M12 2C10 6 6 8 6 13a6 6 0 0012 0c0-4-2-6-3-8l-1 3c-1-2-2-4-2-6z" fill={`url(#${gradientId})`} stroke="rgba(255,140,50,0.28)" strokeWidth="0.4"/>
      <path d="M12 14c-1-1.5-1-3 0-5 0.5 1 1 2 1 3.5a1.5 1.5 0 01-1 1.5z" fill="rgba(255,240,100,0.95)"/>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFEE44"/><stop offset="30%" stopColor="#FF8800"/><stop offset="68%" stopColor="#FF3300"/><stop offset="100%" stopColor="#CC0000"/></linearGradient></defs>
    </svg>
  );
}
function IconStar({ size = 8 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 8 8"><polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" fill="#FFCA00" style={{filter:'drop-shadow(0 0 3px #FFCA00)'}}/></svg>;
}

/* ═════════════════════════════════════════════════
   AURORA
   ═════════════════════════════════════════════════ */
function AuroraScene(_props: { blobs: DailyLotteryConfig['auroraBlobs'] }) {
  return <div className="aurora-scene" />;
}

/* ═════════════════════════════════════════════════
   SUB-COMPONENTS
   ═════════════════════════════════════════════════ */

function Header({ config, isLive, diffMs }: { config: DailyLotteryConfig; isLive: boolean; diffMs: number }) {
  return (
    <div className="app-header px-3 py-2 flex items-center gap-3">
      <button className="back-btn" onClick={() => window.history.back()}><ChevronLeft size={18} strokeWidth={2.5}/></button>
      <div className="flex-1 flex items-center gap-2.5">
        <IconFlame size={20} gradientId={`iconGrad-${config.slug}`}/>
        <span className="text-[14px] font-bold tracking-tight">{config.title} <span style={{color:config.accentColor,textShadow:`0 0 10px ${config.accentColor}cc`}}>{config.subtitle}</span></span>
      </div>
      {isLive && diffMs > 0 && <div className="live-badge"><span className="live-dot"/>LIVE</div>}
    </div>
  );
}


function JackpotProgress({ config }: { config: DailyLotteryConfig }) {
  const { jackpotMin, jackpotCurrent, jackpotMilestones, jackpotDisplayMax } = config;
  const range = jackpotDisplayMax - jackpotMin;
  const fillPct = Math.min(((jackpotCurrent - jackpotMin) / range) * 100, 100);
  const milestonePcts = jackpotMilestones.map(m => ((m - jackpotMin) / range) * 100);
  const nextPt = jackpotMilestones.find(m => jackpotCurrent < m) ?? null;
  return (
    <div className="jackpot-progress-wrap">
      <div className="flex justify-between items-center mb-2"><span className="mono text-[9px] font-semibold uppercase tracking-widest" style={{color:'var(--md-ink-3)'}}>Pool Progress</span><span className="mono text-[10px] font-bold"><span style={{color:'var(--md-yellow-600)',textShadow:'0 0 8px rgba(250,219,20,0.70)'}}>{jackpotCurrent.toLocaleString()}</span><span style={{color:'var(--md-ink-3)'}}> TON</span></span></div>
      <div className="jp-track"><div className="jp-fill" style={{width:`${fillPct}%`}}/>{milestonePcts.map((mp, i) => <div key={i} className="jp-milestone" style={{left:`${mp}%`}}/>)}</div>
      <div className="flex justify-between items-center mt-1.5 relative">
        <span className="mono text-[7px]" style={{color:'var(--md-ink-3)'}}>Min: {jackpotMin.toLocaleString()} TON</span>
        {jackpotMilestones.map((m, i) => (
          <span key={i} className="mono absolute text-[7px] font-semibold" style={{left:`${milestonePcts[i]}%`,transform:'translateX(-50%)',color:'var(--md-yellow-600)',textShadow:'0 0 5px rgba(250,219,20,0.60)'}}>{m.toLocaleString()}</span>
        ))}
        {nextPt && <span className="mono text-[7px] font-semibold" style={{color:'var(--md-blue-400)',textShadow:'0 0 6px rgba(105,177,255,0.60)'}}>Next: {nextPt.toLocaleString()} TON</span>}
      </div>
    </div>
  );
}

function Countdown({ diffMs, isLive, urgent }: { diffMs: number; isLive: boolean; urgent: boolean }) {
  const {h,m,s}=formatTime(diffMs);
  const Sep=()=><span className="mono text-2xl font-bold pb-2" style={{color:urgent?'var(--md-red-500)':'var(--md-blue-400)'}}>:</span>;
  return (
    <div className="text-center">
      <div className="mono text-[8px] font-bold uppercase tracking-[0.22em] mb-2.5" style={{color:urgent?'var(--md-red-500)':'var(--md-ink-3)',textShadow:urgent?'0 0 10px var(--md-red-500)':'none'}}>{isLive?<span style={{color:'var(--md-red-500)',textShadow:'0 0 10px var(--md-red-500)'}}>Draw in progress</span>:'Sales end in'}</div>
      <div className="flex items-center justify-center gap-1.5">
        {[h[0],h[1]].map((d,i)=><div key={`h${i}`} className={`cd-digit ${urgent?'urgent':''}`}>{d}</div>)}<Sep/>
        {[m[0],m[1]].map((d,i)=><div key={`m${i}`} className={`cd-digit ${urgent?'urgent':''}`}>{d}</div>)}<Sep/>
        {[s[0],s[1]].map((d,i)=><div key={`s${i}`} className={`cd-digit ${urgent?'urgent':''}`}>{d}</div>)}
      </div>
    </div>
  );
}

function HeroCard({ config, diffMs, isLive, urgent }: { config: DailyLotteryConfig; diffMs: number; isLive: boolean; urgent: boolean }) {
  const { title, drawLabel, jackpotCurrent } = config;
  return (
    <div className="hero-card glass-3d">
      <div className="float-y absolute pointer-events-none" style={{top:'-28%',left:'-12%',width:'70%',height:'108%',filter:'blur(22px)',mixBlendMode:'screen',background:'radial-gradient(ellipse at 50% 50%, var(--md-blue-500) 0%, var(--md-blue-600) 45%, transparent 65%)',opacity:0.18}}/>
      <div style={{position:'relative',zIndex:1}}>
        <div className="mono text-[8px] font-semibold uppercase tracking-widest mb-2" style={{color:'var(--md-ink-3)'}}>Draw <span style={{color:config.accentColor,textShadow:`0 0 8px ${config.accentColor}cc`}}>#{1318}</span>&nbsp;·&nbsp;{drawLabel}</div>
        <div className="relative inline-block mb-1">
          <span className="jackpot-text" style={{fontSize:38,lineHeight:1,fontWeight:700,display:'inline-block'}}>{jackpotCurrent}&nbsp;<span style={{fontSize:13,fontWeight:600,opacity:0.90,fontFamily:'Space Grotesk, sans-serif'}}>TON</span></span>
          <span className="glitch-r" style={{fontSize:38,lineHeight:1,fontWeight:700}}>{jackpotCurrent}&nbsp;<span style={{fontSize:13}}>TON</span></span>
          <span className="glitch-b" style={{fontSize:38,lineHeight:1,fontWeight:700}}>{jackpotCurrent}&nbsp;<span style={{fontSize:13}}>TON</span></span>
          <span className="glitch-scan"/>
        </div>
        <div className="text-xs font-extrabold mb-1 tracking-tight" style={{fontSize:12}}>{title}</div>
        <Countdown diffMs={diffMs} isLive={isLive} urgent={urgent}/>
        <JackpotProgress config={config}/>
      </div>
    </div>
  );
}

function CommunityBar({ hotList, coldNums }: { hotList: number[]; coldNums: number[] }) {
  const topHot = hotList.slice(0, 3).join(', ');
  const coldStr = coldNums.slice(0, 3).join(', ');
  return (
    <div className="flex justify-center gap-3 py-1 flex-wrap">
      {[{icon:<Flame size={11}/>,cls:'icon-fire',label:<b style={{color:'var(--md-orange-500)'}}>Hot: {topHot}</b>},{icon:<Snowflake size={11}/>,cls:'icon-cyan',label:<b style={{color:'var(--md-blue-400)'}}>Cold: {coldStr}</b>}].map((item,i)=>(<span key={i} className="mono flex items-center gap-1.5 text-[10px] font-semibold" style={{color:'var(--md-ink-3)'}}><span className={item.cls}>{item.icon}</span>{item.label}</span>))}
    </div>
  );
}

function HowToPlayModal({ config, onClose }: { config: DailyLotteryConfig; onClose: () => void }) {
  const rules = computeHTPRules(config.maxPicks, config.numbersCount, config.drawsPerDay, config.drawTimes);
  const iconByColor = (color: string) => {
    if (color.includes('blue')) return <Target size={15} className="icon-blue flex-shrink-0 mt-0.5"/>;
    if (color.includes('green')) return <Zap size={15} className="icon-lime flex-shrink-0 mt-0.5"/>;
    if (color.includes('yellow') || color.includes('gold')) return <Trophy size={15} className="icon-gold flex-shrink-0 mt-0.5"/>;
    if (color.includes('orange')) return <Clock size={15} className="icon-fire flex-shrink-0 mt-0.5"/>;
    return <Star size={15} className="icon-cyan flex-shrink-0 mt-0.5"/>;
  };
  return (
    <div className="modal-overlay" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}>
      <div className="flex justify-center mb-4"><div style={{width:36,height:4,borderRadius:99,background:'rgba(105,177,255,0.30)'}}/></div>
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><HelpCircle size={16} className="icon-blue"/><span className="text-base font-bold">How to Play</span></div><button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center ghost-btn"><X size={14}/></button></div>
      {rules.map((r,i)=>(<div key={i} className="htp-rule">{iconByColor(r.color)}<div><div className="text-[12px] font-bold mb-0.5" style={{color:r.color}}>{r.title}</div><div className="text-[11px] leading-[1.55]" style={{color:'var(--md-ink-2)'}}>{r.desc}</div></div></div>))}
      <button onClick={onClose} className="w-full py-3 mt-2 text-[13px] font-bold htp-btn">Got it!</button>
    </div></div>
  );
}

function NumberGrid({ config, selected, hotMode, freqMap, maxFreq, onToggle }: { config: DailyLotteryConfig; selected: number[]; hotMode: boolean; freqMap: Record<number, number>; maxFreq: number; onToggle: (n:number)=>void }) {
  const { numbersCount, gridColumns } = config;
  const hotOrder = Object.keys(freqMap).map(Number).sort((a, b) => freqMap[b] - freqMap[a]);
  const hotList = hotOrder.slice(0, Math.min(config.maxPicks, 6));
  return (
    <div style={{display:'grid', gridTemplateColumns:`repeat(${gridColumns}, 1fr)`, gap: gridColumns > 6 ? 4 : 6, perspective:'700px'}}>
      {Array.from({length:numbersCount},(_,i)=>i+1).map(n=>{
        const isSel = selected.includes(n);
        const freqVal = freqMap[n] ?? 0;
        const ratio = maxFreq > 0 ? freqVal / maxFreq : 0;
        // Тепловая карта: cold=blue(0.0) → warm=orange(0.6) → hot=red(1.0)
        let heatStyle: React.CSSProperties = {};
        if (hotMode && !isSel) {
          if (ratio >= 0.7) heatStyle = { borderTopColor: 'var(--md-red-500)', boxShadow: '0 0 8px var(--md-red-500)' };
          else if (ratio >= 0.4) heatStyle = { borderTopColor: 'var(--md-orange-500)', boxShadow: '0 0 6px var(--md-orange-500)' };
          else if (ratio > 0) heatStyle = { borderTopColor: 'var(--md-blue-400)', boxShadow: '0 0 4px var(--md-blue-400)' };
        }
        return(
        <button key={n} onClick={()=>onToggle(n)} className={`num-cell ${isSel?'selected':''} ${hotMode&&hotList.includes(n)?'hot-glow':''}`} style={heatStyle}>
          <span style={{position:'relative',zIndex:1}}>{n}</span><span className="freq-badge">{freqMap[n]}</span>
        </button>
      )})}
    </div>
  );
}

function TicketRow({ ticket, index, onRemove, onAddToCart }: { ticket:{id:number;numbers:number[]}; index:number; onRemove:(id:number)=>void; onAddToCart:(id:number)=>void }) {
  const [out,setOut]=useState(false),go=(fn:(id:number)=>void)=>{setOut(true);setTimeout(()=>fn(ticket.id),280)};
  return (
    <div className={`ticket-row ${out?'removing':''}`}>
      <div className="ticket-num-badge">{index+1}</div>
      <div className="flex gap-1.5 flex-1 flex-wrap">{ticket.numbers.map(n=><div key={n} className="ticket-ball">{n}</div>)}</div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={()=>go(onAddToCart)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{background:'linear-gradient(165deg, rgba(255,212,0,0.24) 0%, rgba(200,148,0,0.88) 40%, rgba(145,90,0,0.95) 75%, rgba(80,44,0,1) 100%)',borderTop:'1px solid rgba(255,232,98,0.62)',borderBottom:'2px solid rgba(80,40,0,0.92)',borderLeft:'1px solid rgba(220,168,0,0.36)',borderRight:'1px solid rgba(80,40,0,0.52)',boxShadow:'inset 0 1px 0 rgba(255,242,128,0.42), 0 0 9px rgba(255,185,0,0.55), 0 3px 9px rgba(0,0,0,0.65)',color:'#fff'}}><ShoppingCart size={13} strokeWidth={2.5}/></button>
        <button onClick={()=>go(onRemove)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{background:'linear-gradient(165deg, rgba(255,0,80,0.24) 0%, rgba(200,0,60,0.85) 40%, rgba(130,0,32,0.94) 75%, rgba(70,0,16,1) 100%)',borderTop:'1px solid rgba(255,80,130,0.58)',borderBottom:'2px solid rgba(80,0,20,0.92)',borderLeft:'1px solid rgba(220,0,68,0.32)',borderRight:'1px solid rgba(80,0,20,0.52)',boxShadow:'inset 0 1px 0 rgba(255,145,172,0.36), 0 0 9px rgba(255,0,80,0.46), 0 3px 9px rgba(0,0,0,0.65)',color:'#fff'}}><Trash2 size={12} strokeWidth={2.5}/></button>
      </div>
    </div>
  );
}

function PrizeTiers({ config }: { config: DailyLotteryConfig }) {
  const tiers = computePrizeTiers(config.maxPicks);
  return <div className="flex gap-2">{tiers.map((t,i)=>(<div key={i} className={`tier-card tier-glass-3d tier-${i===0?'lime':i===tiers.length-1?'gold':'cyan'}`}><div className={`flex justify-center mb-1.5 ${t.iconCls}`}>{i===0?<TrendingUp size={14}/>:i===tiers.length-1?<Trophy size={14}/>:<Star size={14}/>}</div><div className="mono text-[12px] font-bold mb-0.5" style={{color:t.color,textShadow:`0 0 9px ${t.glow}`}}>{t.match}</div><div className="text-[10px] font-semibold" style={{color:t.color,opacity:0.90}}>{t.reward}</div></div>))}</div>;
}

function PreviousDraws({ config }: { config: DailyLotteryConfig }) {
  const { mockDraws } = config;
  const seen: Record<number, boolean> = {};
  const uniqueDraws: { dn: number; wn: number[] }[] = [];
  for (const d of mockDraws) {
    if (!seen[d.dn]) {
      const nums = d.wn.filter(n => n >= 1 && n <= config.numbersCount);
      if (nums.length >= 2) { uniqueDraws.push({ dn: d.dn, wn: nums }); seen[d.dn] = true; }
    }
  }
  return (
    <div className="glass-panel glass-3d p-4" id="prev-draws-section">
      <div className="flex items-center gap-2 mb-4"><History size={14} className="icon-cyan flex-shrink-0"/><span className="text-sm font-bold" style={{color:'var(--md-ink-1)'}}>Previous Draws</span></div>
      {uniqueDraws.slice(0,3).map((d,i)=>(<div key={i} className="flex items-center gap-3 py-2.5 cursor-pointer rounded-xl px-2 transition-all" style={{borderBottom:i<2?'1px solid rgba(105,177,255,0.10)':'none'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(30,80,255,0.05)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent'}}><span className="mono text-[10px] font-bold flex-shrink-0" style={{color:'var(--md-orange-500)',width:36,textShadow:'0 0 7px rgba(255,169,64,0.60)'}}>#{d.dn}</span><div className="flex gap-1.5 flex-1">{d.wn.slice(0, config.maxPicks).map(n=><div key={n} className="prev-ball">{n}</div>)}{d.wn.length>config.maxPicks&&<div className="prev-ball mono text-[7px]">+{d.wn.length-config.maxPicks}</div>}</div><span className="mono text-[9px]" style={{color:'var(--md-ink-3)'}}>No winners</span></div>))}
      <button className="w-full text-center mono text-[10px] font-semibold pt-3" style={{color:'var(--md-blue-400)',textShadow:'0 0 6px rgba(105,177,255,0.50)'}}>View All Draws<svg width="10" height="10" viewBox="0 0 24 24" style={{display:'inline',marginLeft:4}}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg></button>
    </div>
  );
}


/* ═════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════ */
interface Ticket { id: number; numbers: number[]; }

export function DailyRushPage({ config: cfg = DAILY_RUSH_CONFIG }: { config?: DailyLotteryConfig }) {
  const config = cfg;
  const { maxPicks, numbersCount, ticketPrice, salesCloseMinutes, accentColor } = config;

  const live = useLotteryDrawData(config.slug);

  const effectiveJackpot = live.jackpotCurrent ?? config.jackpotCurrent;
  const effectiveDraws = live.draws.length > 0 ? live.draws : config.mockDraws;
  const effectiveWinners = live.winners ?? config.mockWinners;
  const effectiveConfig: DailyLotteryConfig = {
    ...config,
    jackpotCurrent: effectiveJackpot,
    mockDraws: effectiveDraws,
    mockWinners: effectiveWinners,
  };

  const [selected, setSelected] = useState<number[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [hotMode, setHotMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);
  const [diffMs, setDiffMs] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [showHTP, setShowHTP] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const { pieces, spawn } = useConfetti();
  const urgent = diffMs <= 60_000 && diffMs > 0;
  const isFull = selected.length === maxPicks;

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let salesCloseTime: Date | null = null;
      if (live.currentDraw?.draw?.salesCloseAt) {
        salesCloseTime = new Date(live.currentDraw.draw.salesCloseAt);
      }
      if (!salesCloseTime || isNaN(salesCloseTime.getTime())) {
        const mskOffset = 3;
        const mskHour = (new Date().getUTCHours() + mskOffset) % 24;
        const drawHours = config.drawTimes.map(t => parseInt(t));
        let nextDrawHour = drawHours.find(h => h > mskHour);
        if (nextDrawHour === undefined) nextDrawHour = drawHours[0] + 24;
        const nextDrawTime = new Date();
        nextDrawTime.setUTCHours(nextDrawHour - mskOffset, 0, 0, 0);
        if (nextDrawHour >= 24) nextDrawTime.setUTCDate(nextDrawTime.getUTCDate() + 1);
        salesCloseTime = new Date(nextDrawTime.getTime() - salesCloseMinutes * 60_000);
      }
      let diff = salesCloseTime.getTime() - now;
      setIsLive(diff <= 0);
      if (diff <= 0 && live.currentDraw?.draw?.drawTime) {
        diff = new Date(live.currentDraw.draw.drawTime).getTime() - now;
      }
      setDiffMs(Math.max(0, diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.drawTimes, salesCloseMinutes, live.currentDraw]);

  const spawnAt = useCallback(() => {
    const r = gridRef.current?.getBoundingClientRect();
    if (r) spawn(r.left + r.width / 2, r.top + r.height / 2);
  }, [spawn]);

  const toggleCell = useCallback((n: number) => {
    setSelected(p => {
      const next = p.includes(n) ? p.filter(x => x !== n) : p.length < maxPicks ? [...p, n] : p;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(next.includes(n) ? 12 : 6);
      }
      return next;
    });
  }, [maxPicks]);

  const handleQuickPick = useCallback(() => {
    const nums = shuffle(Array.from({ length: numbersCount }, (_, i) => i + 1)).slice(0, maxPicks);
    setSelected(nums.sort((a, b) => a - b));
  }, [numbersCount, maxPicks]);

  const handleAddNumbers = useCallback(() => {
    if (selected.length !== maxPicks) return;
    setTickets(p => [...p, { id: Date.now(), numbers: [...selected].sort((a, b) => a - b) }]);
    setSelected([]);
  }, [selected, maxPicks]);

  const removeTicket = useCallback((id: number) => { setTickets(p => p.filter(t => t.id !== id)); }, []);
  const addToCart = useCallback((id: number) => {
    setTickets(p => p.filter(t => t.id !== id));
    setCartCount(c => c + 1);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
  }, []);

  const pct = (selected.length / maxPicks) * 100;

  const freqMap = useMemo(() => {
    const map: Record<number, number> = {};
    for (let n = 1; n <= numbersCount; n++) map[n] = 0;
    for (const d of config.mockDraws) for (const n of d.wn) if (n >= 1 && n <= numbersCount) map[n]++;
    return map;
  }, [config.mockDraws, numbersCount]);

  const hotOrder = Object.keys(freqMap).map(Number).sort((a, b) => freqMap[b] - freqMap[a]);
  const maxFreq = Math.max(...Object.values(freqMap), 1);
  const hotList = hotOrder.slice(0, maxPicks);
  const coldNums = hotOrder.slice(-maxPicks).reverse();

  return (
    <div style={{position:'relative',minHeight:'100vh',paddingTop:'env(safe-area-inset-top, 0px)',paddingBottom:'env(safe-area-inset-bottom, 0px)'}}>
      <AuroraScene blobs={config.auroraBlobs}/>
      {showHTP && <HowToPlayModal config={config} onClose={()=>setShowHTP(false)}/>}
      <div style={{position:'fixed',inset:0,zIndex:60,pointerEvents:'none'}}>{pieces.map(p=>(<div key={p.id} style={{position:'absolute',left:p.x,top:p.y,width:p.size,height:p.size,background:p.color,borderRadius:p.id%2===0?'50%':'3px',transform:`rotate(${p.rot}deg)`,boxShadow:`0 0 7px ${p.color}`,animation:`confettiFall ${p.dur}s ease-out ${p.delay}s forwards`}}/>))}</div>
      <div style={{position:'relative',zIndex:1,maxWidth:390,margin:'0 auto',padding:'0 8px 20px',display:'flex',flexDirection:'column',gap:8}}>
        <Header config={effectiveConfig} isLive={isLive} diffMs={diffMs}/>
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.1}}>
          <HeroCard config={effectiveConfig} diffMs={diffMs} isLive={isLive} urgent={urgent}/>
        </motion.div>
        {effectiveConfig.mockWinners && effectiveConfig.mockWinners.length > 0 && (
          <div className="ticker-track mt-0 mb-0">
            <div className="py-1 overflow-hidden">
              <div className="ticker-scroll flex w-max">
                {[...effectiveConfig.mockWinners, ...effectiveConfig.mockWinners].map((w,i)=>(
                  <span key={i} className="mono flex items-center gap-1 mx-3 whitespace-nowrap text-[8px] font-semibold" style={{color:'var(--md-orange-500)',textShadow:'0 0 6px var(--md-orange-500)'}}>
                    <IconStar size={7}/>{w.name} +{w.amount} TON
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <motion.div className="glass-panel glass-panel--neon glass-3d p-4"
          initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.35}}>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={()=>setShowHTP(true)} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold htp-btn"><HelpCircle size={12}/>How to Play</button>
            <button className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold ${hotMode?'fire-btn':'ghost-btn'}`} onClick={()=>setHotMode(h=>!h)}><Flame size={12} className={hotMode?'':'icon-fire'}/>Hot</button>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold ghost-btn" onClick={()=>document.getElementById('prev-draws-section')?.scrollIntoView({behavior:'smooth'})}><History size={11}/>#{effectiveConfig.mockDraws[0]?.dn ?? 1317}</button>
          </div>
          <div className="section-label mb-3"><Target size={11} className="icon-fire"/>Pick {maxPicks} Numbers</div>
          <div ref={gridRef}><NumberGrid config={effectiveConfig} selected={selected} hotMode={hotMode} freqMap={freqMap} maxFreq={maxFreq} onToggle={toggleCell}/></div>
          <div className="mt-4 mb-3">
            <div className="flex justify-between items-center mb-2"><span className="mono text-[9px] font-semibold uppercase tracking-wider" style={{color:'var(--md-ink-3)'}}>Selected</span><span className="mono text-[11px] font-bold" style={{color:selected.length===maxPicks?'var(--md-blue-400)':'var(--md-ink-3)',textShadow:selected.length===maxPicks?'0 0 9px var(--md-blue-400)':'none'}}>{selected.length}<span style={{color:'var(--md-ink-3)'}}> / {maxPicks}</span></span></div>
            <div className="progress-track"><div className="progress-fill" style={{width:`${pct}%`,background:pct<100?'linear-gradient(90deg, #3B82F6 0%, #6D28D9 50%, #0E7490 100%)':'linear-gradient(90deg, #0E7490 0%, #3B82F6 50%, #6D28D9 100%)',boxShadow:pct>0?'0 0 10px rgba(59,130,246,0.45)':'none'}}/></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleQuickPick} className="flex-1 flex items-center justify-center gap-2 py-2 text-[12px] emerald-btn"><Zap size={13}/>Quick Pick</button>
            <button onClick={handleAddNumbers} disabled={!isFull} className={`flex-1 flex items-center justify-center gap-2 py-2 text-[12px] ${isFull ? 'fire-btn pulse-glow' : 'fire-btn'}`}><Target size={13}/>Add Numbers</button>
            <button onClick={()=>setSelected([])} className="flex items-center justify-center px-3 py-2 ghost-btn"><RotateCcw size={13}/></button>
          </div>
        </motion.div>
        <div className="glass-panel glass-3d p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="section-label flex-1">
              <svg width="11" height="11" viewBox="0 0 24 24" className="icon-gold"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 9v9a3 3 0 003 3h14a3 3 0 003-3V9M9 14h6" fill="none" stroke="url(#tGrad)" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FFCA00"/><stop offset="50%" stopColor="#FFE060"/><stop offset="100%" stopColor="#FF9900"/></linearGradient></defs></svg>
              Your Tickets
            </div>
            {tickets.length>0&&(<span className="mono text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{background:'linear-gradient(135deg, rgba(255,169,64,0.24) 0%, rgba(200,48,8,0.16) 55%, rgba(120,18,0,0.14) 100%)',borderTop:'1px solid rgba(255,169,64,0.50)',borderLeft:'1px solid rgba(255,169,64,0.26)',borderRight:'1px solid rgba(80,10,0,0.38)',borderBottom:'1px solid rgba(80,8,0,0.60)',color:'var(--md-orange-500)',textShadow:'0 0 7px rgba(255,169,64,0.70)'}}>{tickets.length}</span>)}
          </div>
          {tickets.length===0?(<motion.div className="text-center py-4 mono text-[11px]" style={{color:'var(--md-ink-3)',opacity:0.55}}
            initial={{opacity:0}} animate={{opacity:0.55}}>Pick {maxPicks} numbers and press Add Numbers</motion.div>):(
          <AnimatePresence>
            {tickets.map((t,i)=>(
              <motion.div key={t.id}
                initial={{opacity:0,scale:0.92,y:-8}}
                animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.88,x:40}}
                transition={{type:'spring',stiffness:400,damping:28}}>
                <TicketRow ticket={t} index={i} onRemove={removeTicket} onAddToCart={addToCart}/>
              </motion.div>
            ))}
          </AnimatePresence>)}
          {tickets.length>0&&<motion.div className="flex justify-between items-center mono text-[10px] pt-3 mt-1" style={{borderTop:'1px solid rgba(105,177,255,0.10)',color:'var(--md-ink-3)'}}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
            <span><b style={{color:'var(--md-ink-0)',fontWeight:700}}>{tickets.length}</b>{' '}ticket{tickets.length>1?'s':''}</span><span><b style={{color:'var(--md-yellow-600)',fontWeight:700,textShadow:'0 0 9px rgba(250,219,20,0.65)'}}>{tickets.length*ticketPrice} TON</b>{' '}· up to {config.jackpotDisplayMax.toLocaleString()} TON</span></motion.div>}
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.45}}>
          <PrizeTiers config={effectiveConfig}/>
        </motion.div>
        <div className="glass-panel glass-3d p-2.5" style={{display:'flex',gap:8,justifyContent:'space-around',fontSize:9,fontWeight:600}}>
          <span style={{color:'var(--md-ink-3)',textAlign:'center'}}><span style={{color:'var(--md-green-400)'}}>50%</span><br/>Prize Pool</span>
          <span style={{color:'var(--md-ink-3)',textAlign:'center'}}><span style={{color:'var(--md-yellow-600)'}}>15%</span><br/>Jackpot</span>
          <span style={{color:'var(--md-ink-3)',textAlign:'center'}}><span style={{color:'var(--md-blue-400)'}}>5%</span><br/>Reserve</span>
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.55}}>
          <PreviousDraws config={effectiveConfig}/>
        </motion.div>
        {/* My Stats — перенесено в профиль пользователя */}
        <div className="text-center mono text-[8px] pb-2" style={{color:'var(--md-ink-3)',opacity:0.38}}><svg width="10" height="10" viewBox="0 0 24 24" style={{display:'inline',marginRight:4}}><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9Z" fill="rgba(105,177,255,0.65)"/></svg>Provably Fair · TON Blockchain</div>
      </div>
      <div style={{position:'fixed',bottom:'calc(20px + env(safe-area-inset-bottom, 0px))',right:16,zIndex:50}}>
        <div className={`cart-fab ${cartBounce?'bouncing':''}`}><ShoppingCart size={22} color="#fff" strokeWidth={2.5} style={{filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.70))'}}/></div>
        {cartCount>0&&(<div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center" style={{background:'linear-gradient(165deg, #FF4080 0%, #CC0050 55%, #990030 100%)',borderTop:'1px solid rgba(255,100,150,0.62)',borderBottom:'1px solid rgba(80,0,30,0.85)',border:'2px solid #0B1526',boxShadow:'0 0 10px rgba(255,0,80,0.85)',fontSize:10,fontWeight:800,color:'#fff',fontFamily:'JetBrains Mono, monospace'}}>{cartCount}</div>)}
      </div>
    </div>
  );
}