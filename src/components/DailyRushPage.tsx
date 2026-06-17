import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, Target, Trash2, ShoppingCart, History, Flame, Snowflake, Trophy, Star, TrendingUp, Sparkles, RotateCcw, Clock, CircleHelp as HelpCircle, X } from 'lucide-react';
import type { DailyLotteryConfig } from '../data/lottery-configs';
import { DAILY_RUSH_CONFIG, computePrizeTiers, computeHTPRules } from '../data/lottery-configs';
import { useLotteryDrawData } from '../hooks/useLotteryDrawData';

/* ═════════════════════════════════════════════════
   UTILS
   ═════════════════════════════════════════════════ */
function shuffle<T>(arr: T[]): T[] { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function formatTime(ms: number) { if(ms<=0) return {h:'00',m:'00',s:'00'}; return {h:String(Math.floor(ms/3_600_000)).padStart(2,'0'),m:String(Math.floor((ms%3_600_000)/60_000)).padStart(2,'0'),s:String(Math.floor((ms%60_000)/1000)).padStart(2,'0')}; }

/* ═════════════════════════════════════════════════
   CONFETTI
   ═════════════════════════════════════════════════ */
interface Piece { id:number; x:number; y:number; color:string; size:number; dur:number; delay:number; rot:number; }
function useConfetti() {
  const [pieces,setPieces]=useState<Piece[]>([]);
  const spawn=useCallback((cx:number,cy:number)=>{
    const colors=['var(--gold)','var(--gold-soft)','var(--coral)','var(--emerald)','var(--ton)','var(--md-orange-400)','var(--gold-bright)','var(--emerald-soft)'];
    const next:Piece[]=Array.from({length:28},(_,i)=>({id:Date.now()+i,x:cx+(Math.random()-0.5)*180,y:cy+(Math.random()-0.5)*70,color:colors[Math.floor(Math.random()*colors.length)],size:5+Math.random()*6,dur:0.9+Math.random()*0.75,delay:Math.random()*0.40,rot:Math.random()*360}));
    setPieces(next); setTimeout(()=>setPieces([]),2400);
  },[]);
  return {pieces,spawn};
}

/* ═════════════════════════════════════════════════
   SVG ICONS
   ═════════════════════════════════════════════════ */
function IconFlame({ size=20, gradientId='fGH' }: { size?:number; gradientId?:string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="icon-fire flex-shrink-0">
      <path d="M12 2C10 6 6 8 6 13a6 6 0 0012 0c0-4-2-6-3-8l-1 3c-1-2-2-4-2-6z" fill={`url(#${gradientId})`} stroke="rgba(249,115,22,0.28)" strokeWidth="0.4"/>
      <path d="M12 14c-1-1.5-1-3 0-5 0.5 1 1 2 1 3.5a1.5 1.5 0 01-1 1.5z" fill="rgba(253,230,138,0.95)"/>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="30%" stopColor="#F59E0B"/><stop offset="68%" stopColor="#EA580C"/><stop offset="100%" stopColor="#7C2D12"/></linearGradient></defs>
    </svg>
  );
}
function IconStar({ size=8 }: { size?:number }) {
  return <svg width={size} height={size} viewBox="0 0 8 8"><polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" fill="#F59E0B" style={{filter:'drop-shadow(0 0 3px #F59E0B)'}}/></svg>;
}

/* ═════════════════════════════════════════════════
   AURORA SCENE
   ═════════════════════════════════════════════════ */
function AuroraScene({ blobs }: { blobs: DailyLotteryConfig['auroraBlobs'] }) {
  return (
    <div className="aurora-scene">
      {blobs.map((b,i)=>(
        <div key={i} className={`aurora-blob aurora-b${i+1}`} style={{
          position:'absolute',borderRadius:'50%',filter:'blur(70px)',
          background:b.color,opacity:b.opacity*0.65,
          top:b.top,bottom:b.bottom,left:b.left,right:b.right,
          width:b.width,height:b.height,
        }}/>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   PAGE HEADER (lottery-specific, replaces app header)
   ═════════════════════════════════════════════════ */
function PageHeader({ config, isLive }: { config:DailyLotteryConfig; isLive:boolean }) {
  return (
    <div className="app-header px-3 py-2.5 flex items-center gap-3">
      <button className="back-btn" onClick={()=>window.history.back()}><ChevronLeft size={17} strokeWidth={2.5}/></button>
      <div className="flex-1 flex items-center gap-2">
        <IconFlame size={18} gradientId={`hdr-${config.slug}`}/>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-bold tracking-tight" style={{color:'var(--ink-0)'}}>{config.title}</span>
          <span className="mono text-[11px] font-semibold" style={{color:config.accentColor,textShadow:`0 0 8px ${config.accentColor}cc`}}>{config.subtitle}</span>
        </div>
      </div>
      {isLive && <div className="live-badge"><span className="live-dot"/>LIVE</div>}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   HERO STRIP — compact, horizontal jackpot + countdown
   ═════════════════════════════════════════════════ */
function HeroStrip({ config, diffMs, isLive, urgent }: { config:DailyLotteryConfig; diffMs:number; isLive:boolean; urgent:boolean }) {
  const {h,m,s}=formatTime(diffMs);
  const { jackpotCurrent, drawLabel, accentColor } = config;

  const Sep=()=><span className="mono text-[18px] font-bold" style={{color:urgent?'var(--coral)':'rgba(245,158,11,0.55)',lineHeight:1,paddingBottom:2}}>:</span>;

  return (
    <div className="hero-card" style={{padding:'12px 14px'}}>
      {/* Top row: draw info */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="mono text-[8px] font-bold uppercase tracking-widest" style={{color:'var(--ink-3)'}}>Draw</span>
          <span className="mono text-[9px] font-bold" style={{color:accentColor,textShadow:`0 0 8px ${accentColor}cc`}}>#{1318}</span>
          <span className="mono text-[8px]" style={{color:'var(--ink-3)'}}>·</span>
          <span className="mono text-[8px] font-semibold uppercase" style={{color:'var(--ink-3)'}}>{drawLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="mono text-[8px] font-bold uppercase tracking-wider" style={{color:urgent?'var(--coral)':'var(--ink-3)',textShadow:urgent?'0 0 8px var(--coral)':'none'}}>
            {isLive?<span style={{color:'var(--coral)',textShadow:'0 0 8px var(--coral)'}}>Drawing now</span>:'Closes in'}
          </span>
        </div>
      </div>

      {/* Main row: jackpot LEFT, countdown RIGHT */}
      <div className="flex items-center justify-between gap-3">
        {/* Jackpot */}
        <div className="flex-1 min-w-0">
          <div className="mono text-[8px] font-semibold uppercase tracking-widest mb-1" style={{color:'var(--ink-3)'}}>Jackpot</div>
          <div className="relative inline-block">
            <span className="jackpot-text" style={{fontSize:30,fontWeight:800,display:'inline-block',lineHeight:1}}>{jackpotCurrent.toLocaleString()}</span>
            <span className="glitch-r" style={{fontSize:30,fontWeight:800,lineHeight:1}}>{jackpotCurrent.toLocaleString()}</span>
            <span className="glitch-b" style={{fontSize:30,fontWeight:800,lineHeight:1}}>{jackpotCurrent.toLocaleString()}</span>
            <span className="glitch-scan"/>
            <span className="mono font-semibold ml-1.5" style={{fontSize:11,color:'var(--ink-2)'}}>TON</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            {[h[0],h[1]].map((d,i)=><div key={`h${i}`} className={`cd-digit ${urgent?'urgent':''}`}>{d}</div>)}<Sep/>
            {[m[0],m[1]].map((d,i)=><div key={`m${i}`} className={`cd-digit ${urgent?'urgent':''}`}>{d}</div>)}<Sep/>
            {[s[0],s[1]].map((d,i)=><div key={`s${i}`} className={`cd-digit ${urgent?'urgent':''}`}>{d}</div>)}
          </div>
          <div className="flex gap-4 pr-1">
            <span className="mono text-[6px] uppercase tracking-wider" style={{color:'var(--ink-3)'}}>HH</span>
            <span className="mono text-[6px] uppercase tracking-wider" style={{color:'var(--ink-3)'}}>MM</span>
            <span className="mono text-[6px] uppercase tracking-wider" style={{color:'var(--ink-3)'}}>SS</span>
          </div>
        </div>
      </div>

      {/* Jackpot progress */}
      <JackpotProgress config={config}/>
    </div>
  );
}

function JackpotProgress({ config }: { config:DailyLotteryConfig }) {
  const { jackpotMin, jackpotCurrent, jackpotMilestones, jackpotDisplayMax } = config;
  const range = jackpotDisplayMax - jackpotMin;
  const fillPct = Math.min(((jackpotCurrent - jackpotMin) / range) * 100, 100);
  const milestonePcts = jackpotMilestones.map(m => ((m - jackpotMin) / range) * 100);
  const nextPt = jackpotMilestones.find(m => jackpotCurrent < m) ?? null;
  return (
    <div className="jackpot-progress-wrap">
      <div className="flex justify-between items-center mb-1.5">
        <span className="mono text-[7.5px] font-semibold uppercase tracking-widest" style={{color:'var(--ink-3)'}}>Pool</span>
        <span className="mono text-[9px] font-bold">
          <span style={{color:'var(--gold)',textShadow:'0 0 8px rgba(245,158,11,0.65)'}}>{jackpotCurrent.toLocaleString()}</span>
          <span style={{color:'var(--ink-3)'}}> / {jackpotDisplayMax.toLocaleString()} TON</span>
        </span>
      </div>
      <div className="jp-track">
        <div className="jp-fill" style={{width:`${fillPct}%`}}/>
        {milestonePcts.map((mp,i)=><div key={i} className="jp-milestone" style={{left:`${mp}%`}}/>)}
      </div>
      {nextPt && (
        <div className="flex justify-end mt-1">
          <span className="mono text-[7px] font-semibold" style={{color:'var(--ton)',textShadow:'0 0 6px rgba(14,165,233,0.55)'}}>Next milestone: {nextPt.toLocaleString()} TON</span>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   HOW TO PLAY MODAL
   ═════════════════════════════════════════════════ */
function HowToPlayModal({ config, onClose }: { config:DailyLotteryConfig; onClose:()=>void }) {
  const rules = computeHTPRules(config.maxPicks, config.numbersCount, config.drawsPerDay, config.drawTimes);
  const iconByColor = (color: string) => {
    if(color.includes('blue')||color.includes('ton')) return <Target size={14} className="icon-blue flex-shrink-0 mt-0.5"/>;
    if(color.includes('green')||color.includes('lime')) return <Zap size={14} className="icon-lime flex-shrink-0 mt-0.5"/>;
    if(color.includes('yellow')||color.includes('gold')) return <Trophy size={14} className="icon-gold flex-shrink-0 mt-0.5"/>;
    if(color.includes('orange')||color.includes('fire')) return <Clock size={14} className="icon-fire flex-shrink-0 mt-0.5"/>;
    return <Star size={14} className="icon-cyan flex-shrink-0 mt-0.5"/>;
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-center mb-4"><div style={{width:32,height:4,borderRadius:99,background:'rgba(255,255,255,0.18)'}}/></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><HelpCircle size={15} className="icon-blue"/><span className="text-[15px] font-bold">How to Play</span></div>
          <button onClick={onClose} className="w-7 h-7 rounded-xl flex items-center justify-center ghost-btn"><X size={13}/></button>
        </div>
        {rules.map((r,i)=>(
          <div key={i} className="htp-rule">{iconByColor(r.color)}
            <div><div className="text-[12px] font-bold mb-0.5" style={{color:r.color}}>{r.title}</div><div className="text-[11px] leading-[1.55]" style={{color:'var(--ink-2)'}}>{r.desc}</div></div>
          </div>
        ))}
        <button onClick={onClose} className="w-full py-3 mt-2 text-[13px] font-bold htp-btn">Got it!</button>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   NUMBER GRID
   ═════════════════════════════════════════════════ */
function NumberGrid({ config, selected, hotMode, freqMap, maxFreq, onToggle }: {
  config:DailyLotteryConfig; selected:number[]; hotMode:boolean;
  freqMap:Record<number,number>; maxFreq:number; onToggle:(n:number)=>void
}) {
  const { numbersCount, gridColumns } = config;
  const hotOrder = Object.keys(freqMap).map(Number).sort((a,b)=>freqMap[b]-freqMap[a]);
  const hotList = hotOrder.slice(0, Math.min(config.maxPicks, 6));
  return (
    <div style={{display:'grid', gridTemplateColumns:`repeat(${gridColumns}, 1fr)`, gap: gridColumns > 6 ? 4 : 5}}>
      {Array.from({length:numbersCount},(_,i)=>i+1).map(n=>{
        const isSel = selected.includes(n);
        const freqVal = freqMap[n] ?? 0;
        const ratio = maxFreq > 0 ? freqVal / maxFreq : 0;
        let heatStyle: React.CSSProperties = {};
        if(hotMode && !isSel) {
          if(ratio>=0.7) heatStyle={borderColor:'rgba(244,63,94,0.55)',boxShadow:'0 0 7px rgba(244,63,94,0.40)'};
          else if(ratio>=0.4) heatStyle={borderColor:'rgba(249,115,22,0.50)',boxShadow:'0 0 6px rgba(249,115,22,0.30)'};
          else if(ratio>0) heatStyle={borderColor:'rgba(14,165,233,0.30)'};
        }
        return (
          <button key={n} onClick={()=>onToggle(n)}
            className={`num-cell ${isSel?'selected':''} ${hotMode&&hotList.includes(n)?'hot-glow':''}`}
            style={heatStyle}>
            <span style={{position:'relative',zIndex:1}}>{n}</span>
            <span className="freq-badge">{freqMap[n]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   TICKET ROW
   ═════════════════════════════════════════════════ */
function TicketRow({ ticket, index, onRemove, onAddToCart }: {
  ticket:{id:number;numbers:number[]}; index:number;
  onRemove:(id:number)=>void; onAddToCart:(id:number)=>void
}) {
  const [out,setOut]=useState(false);
  const go=(fn:(id:number)=>void)=>{setOut(true);setTimeout(()=>fn(ticket.id),260)};
  return (
    <div className={`ticket-row ${out?'removing':''}`}>
      <div className="ticket-num-badge">{index+1}</div>
      <div className="flex gap-1.5 flex-1 flex-wrap">{ticket.numbers.map(n=><div key={n} className="ticket-ball">{n}</div>)}</div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={()=>go(onAddToCart)}
          className="w-8 h-8 rounded-xl flex items-center justify-center fire-btn transition-all active:scale-90"
          style={{padding:0}}>
          <ShoppingCart size={12} strokeWidth={2.5}/>
        </button>
        <button onClick={()=>go(onRemove)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{background:'rgba(244,63,94,0.15)',border:'1px solid rgba(244,63,94,0.35)',color:'var(--coral-soft)',padding:0}}>
          <Trash2 size={12} strokeWidth={2.5}/>
        </button>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   PRIZE TIERS
   ═════════════════════════════════════════════════ */
function PrizeTiers({ config }: { config:DailyLotteryConfig }) {
  const tiers = computePrizeTiers(config.maxPicks);
  return (
    <div className="flex gap-2">
      {tiers.map((t,i)=>(
        <div key={i} className={`tier-card tier-glass-3d tier-${i===0?'lime':i===tiers.length-1?'gold':'cyan'}`}>
          <div className={`flex justify-center mb-1.5 ${t.iconCls}`}>
            {i===0?<TrendingUp size={13}/>:i===tiers.length-1?<Trophy size={13}/>:<Star size={13}/>}
          </div>
          <div className="mono text-[11px] font-bold mb-0.5" style={{color:t.color,textShadow:`0 0 8px ${t.glow}`}}>{t.match}</div>
          <div className="text-[9.5px] font-semibold" style={{color:t.color,opacity:0.90}}>{t.reward}</div>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   PREVIOUS DRAWS
   ═════════════════════════════════════════════════ */
function PreviousDraws({ config }: { config:DailyLotteryConfig }) {
  const { mockDraws } = config;
  const seen: Record<number,boolean> = {};
  const uniqueDraws: { dn:number; wn:number[] }[] = [];
  for(const d of mockDraws) {
    if(!seen[d.dn]) {
      const nums = d.wn.filter(n=>n>=1&&n<=config.numbersCount);
      if(nums.length>=2) { uniqueDraws.push({dn:d.dn,wn:nums}); seen[d.dn]=true; }
    }
  }
  return (
    <div className="glass-panel glass-3d p-4" id="prev-draws-section">
      <div className="flex items-center gap-2 mb-4">
        <History size={13} className="icon-cyan flex-shrink-0"/>
        <span className="text-[13px] font-bold" style={{color:'var(--ink-0)'}}>Previous Draws</span>
      </div>
      {uniqueDraws.slice(0,3).map((d,i)=>(
        <div key={i} className="flex items-center gap-3 py-2.5 px-2 cursor-pointer rounded-xl transition-all"
          style={{borderBottom:i<2?'1px solid rgba(255,255,255,0.05)':'none'}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent'}}>
          <span className="mono text-[10px] font-bold flex-shrink-0" style={{color:'var(--gold)',width:36,textShadow:'0 0 6px rgba(245,158,11,0.55)'}}>#{d.dn}</span>
          <div className="flex gap-1.5 flex-1">{d.wn.slice(0,config.maxPicks).map(n=><div key={n} className="prev-ball">{n}</div>)}{d.wn.length>config.maxPicks&&<div className="prev-ball mono text-[7px]">+{d.wn.length-config.maxPicks}</div>}</div>
          <span className="mono text-[9px]" style={{color:'var(--ink-3)'}}>No winners</span>
        </div>
      ))}
      <button className="w-full text-center mono text-[10px] font-semibold pt-3" style={{color:'var(--ton)',textShadow:'0 0 5px rgba(14,165,233,0.40)'}}>
        View all draws →
      </button>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   WINNERS TICKER (lottery-specific)
   ═════════════════════════════════════════════════ */
function WinnersTicker({ winners }: { winners:{name:string;amount:string}[] }) {
  if(!winners||winners.length===0) return null;
  return (
    <div className="ticker-track" style={{height:28}}>
      <div className="py-1 overflow-hidden h-full flex items-center">
        <div className="ticker-scroll flex w-max">
          {[...winners,...winners].map((w,i)=>(
            <span key={i} className="mono flex items-center gap-1.5 mx-4 whitespace-nowrap text-[9px] font-semibold"
              style={{color:'var(--gold)',textShadow:'0 0 6px rgba(245,158,11,0.55)'}}>
              <IconStar size={7}/>{w.name} <span style={{color:'var(--emerald)'}}>+{w.amount} TON</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   COMMUNITY BAR
   ═════════════════════════════════════════════════ */
function CommunityBar({ hotList, coldNums }: { hotList:number[]; coldNums:number[] }) {
  return (
    <div className="flex justify-center gap-4 py-1">
      <span className="mono flex items-center gap-1.5 text-[10px] font-semibold" style={{color:'var(--ink-3)'}}>
        <Flame size={11} className="icon-fire"/><b style={{color:'var(--md-orange-400)'}}>Hot: {hotList.slice(0,3).join(', ')}</b>
      </span>
      <span className="mono flex items-center gap-1.5 text-[10px] font-semibold" style={{color:'var(--ink-3)'}}>
        <Snowflake size={11} className="icon-cyan"/><b style={{color:'var(--ton)'}}>Cold: {coldNums.slice(0,3).join(', ')}</b>
      </span>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════ */
interface Ticket { id:number; numbers:number[]; }

export function DailyRushPage({ config:cfg=DAILY_RUSH_CONFIG }: { config?:DailyLotteryConfig }) {
  const config = cfg;
  const { maxPicks, numbersCount, ticketPrice, salesCloseMinutes, accentColor } = config;

  const live = useLotteryDrawData(config.slug);
  const effectiveJackpot = live.jackpotCurrent ?? config.jackpotCurrent;
  const effectiveDraws = live.draws.length > 0 ? live.draws : config.mockDraws;
  const effectiveWinners = live.winners ?? config.mockWinners;
  const effectiveConfig: DailyLotteryConfig = { ...config, jackpotCurrent:effectiveJackpot, mockDraws:effectiveDraws, mockWinners:effectiveWinners };

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

  useEffect(()=>{
    const tick=()=>{
      const now = Date.now();
      let salesCloseTime: Date|null = null;
      if(live.currentDraw?.draw?.salesCloseAt) salesCloseTime=new Date(live.currentDraw.draw.salesCloseAt);
      if(!salesCloseTime||isNaN(salesCloseTime.getTime())) {
        const mskOffset=3;
        const mskHour=(new Date().getUTCHours()+mskOffset)%24;
        const drawHours=config.drawTimes.map(t=>parseInt(t));
        let nextDrawHour=drawHours.find(h=>h>mskHour);
        if(nextDrawHour===undefined) nextDrawHour=drawHours[0]+24;
        const nextDrawTime=new Date();
        nextDrawTime.setUTCHours(nextDrawHour-mskOffset,0,0,0);
        if(nextDrawHour>=24) nextDrawTime.setUTCDate(nextDrawTime.getUTCDate()+1);
        salesCloseTime=new Date(nextDrawTime.getTime()-salesCloseMinutes*60_000);
      }
      let diff=salesCloseTime.getTime()-now;
      setIsLive(diff<=0);
      if(diff<=0&&live.currentDraw?.draw?.drawTime) diff=new Date(live.currentDraw.draw.drawTime).getTime()-now;
      setDiffMs(Math.max(0,diff));
    };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[config.drawTimes,salesCloseMinutes,live.currentDraw]);

  const spawnAt=useCallback(()=>{
    const r=gridRef.current?.getBoundingClientRect();
    if(r) spawn(r.left+r.width/2,r.top+r.height/2);
  },[spawn]);

  const toggleCell=useCallback((n:number)=>{
    setSelected(p=>{
      const next=p.includes(n)?p.filter(x=>x!==n):p.length<maxPicks?[...p,n]:p;
      if(typeof navigator!=='undefined'&&'vibrate' in navigator) navigator.vibrate(next.includes(n)?12:6);
      return next;
    });
  },[maxPicks]);

  const handleQuickPick=useCallback(()=>{
    const nums=shuffle(Array.from({length:numbersCount},(_,i)=>i+1)).slice(0,maxPicks);
    setSelected(nums.sort((a,b)=>a-b));
  },[numbersCount,maxPicks]);

  const handleAddNumbers=useCallback(()=>{
    if(selected.length!==maxPicks) return;
    spawnAt();
    setTickets(p=>[...p,{id:Date.now(),numbers:[...selected].sort((a,b)=>a-b)}]);
    setSelected([]);
  },[selected,maxPicks,spawnAt]);

  const removeTicket=useCallback((id:number)=>{setTickets(p=>p.filter(t=>t.id!==id));},[]);
  const addToCart=useCallback((id:number)=>{
    setTickets(p=>p.filter(t=>t.id!==id));
    setCartCount(c=>c+1);
    setCartBounce(true);
    setTimeout(()=>setCartBounce(false),600);
  },[]);

  const pct=(selected.length/maxPicks)*100;

  const freqMap=useMemo(()=>{
    const map:Record<number,number>={};
    for(let n=1;n<=numbersCount;n++) map[n]=0;
    for(const d of config.mockDraws) for(const n of d.wn) if(n>=1&&n<=numbersCount) map[n]++;
    return map;
  },[config.mockDraws,numbersCount]);

  const hotOrder=Object.keys(freqMap).map(Number).sort((a,b)=>freqMap[b]-freqMap[a]);
  const maxFreq=Math.max(...Object.values(freqMap),1);
  const hotList=hotOrder.slice(0,maxPicks);
  const coldNums=hotOrder.slice(-maxPicks).reverse();

  return (
    <div style={{position:'relative',minHeight:'100vh',paddingBottom:'env(safe-area-inset-bottom, 0px)'}}>
      <AuroraScene blobs={config.auroraBlobs}/>
      {showHTP && <HowToPlayModal config={config} onClose={()=>setShowHTP(false)}/>}

      {/* Confetti */}
      <div style={{position:'fixed',inset:0,zIndex:60,pointerEvents:'none'}}>
        {pieces.map(p=>(
          <div key={p.id} style={{position:'absolute',left:p.x,top:p.y,width:p.size,height:p.size,background:p.color,borderRadius:p.id%2===0?'50%':'3px',transform:`rotate(${p.rot}deg)`,boxShadow:`0 0 6px ${p.color}`,animation:`confettiFall ${p.dur}s ease-out ${p.delay}s forwards`}}/>
        ))}
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:390,margin:'0 auto',paddingBottom:20}}>
        {/* ── HEADER ── */}
        <PageHeader config={effectiveConfig} isLive={isLive}/>

        {/* ══ ABOVE FOLD ══ */}
        <div style={{padding:'8px 8px 0',display:'flex',flexDirection:'column',gap:6}}>
          {/* Hero strip: jackpot + countdown */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.08}}>
            <HeroStrip config={effectiveConfig} diffMs={diffMs} isLive={isLive} urgent={urgent}/>
          </motion.div>

          {/* Winners ticker */}
          {effectiveConfig.mockWinners?.length>0 && (
            <WinnersTicker winners={effectiveConfig.mockWinners}/>
          )}

          {/* Grid panel */}
          <motion.div className="glass-panel glass-panel--neon glass-3d"
            style={{padding:'12px 12px 14px'}}
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.40,delay:0.22}}>

            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-3">
              <button onClick={()=>setShowHTP(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold htp-btn">
                <HelpCircle size={11}/>How to Play
              </button>
              <button className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold ${hotMode?'fire-btn':'ghost-btn'}`}
                onClick={()=>setHotMode(h=>!h)}>
                <Flame size={11} className={hotMode?'':'icon-fire'}/>Hot
              </button>
              <button className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold ghost-btn"
                onClick={()=>document.getElementById('prev-draws-section')?.scrollIntoView({behavior:'smooth'})}>
                <History size={10}/>#{effectiveConfig.mockDraws[0]?.dn ?? 1317}
              </button>
            </div>

            {/* Hot/Cold community bar */}
            <CommunityBar hotList={hotList} coldNums={coldNums}/>

            {/* Section label */}
            <div className="section-label my-2">
              <Target size={10} className="icon-fire"/>Pick {maxPicks} numbers
            </div>

            {/* NUMBER GRID */}
            <div ref={gridRef}>
              <NumberGrid config={effectiveConfig} selected={selected} hotMode={hotMode} freqMap={freqMap} maxFreq={maxFreq} onToggle={toggleCell}/>
            </div>

            {/* Selection progress */}
            <div className="mt-3 mb-2.5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="mono text-[8.5px] font-semibold uppercase tracking-wider" style={{color:'var(--ink-3)'}}>Selected</span>
                <span className="mono text-[10px] font-bold">
                  <span style={{color:isFull?'var(--gold)':'var(--ink-2)',textShadow:isFull?'0 0 8px rgba(245,158,11,0.65)':'none'}}>{selected.length}</span>
                  <span style={{color:'var(--ink-3)'}}> / {maxPicks}</span>
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{
                  width:`${pct}%`,
                  background:pct<100
                    ?'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)'
                    :'linear-gradient(90deg, #F59E0B 0%, #FCD34D 50%, #FDE68A 100%)',
                  boxShadow:pct>0?'0 0 8px rgba(245,158,11,0.50)':'none',
                }}/>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2">
              <button onClick={handleQuickPick} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] emerald-btn">
                <Sparkles size={13}/>Quick Pick
              </button>
              <button onClick={handleAddNumbers} disabled={!isFull}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] ${isFull?'fire-btn pulse-glow':'fire-btn'}`}>
                <Target size={13}/>Add Numbers
              </button>
              <button onClick={()=>setSelected([])} className="flex items-center justify-center px-3 py-2.5 ghost-btn">
                <RotateCcw size={13}/>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ══ BELOW FOLD (scroll) ══ */}
        <div style={{padding:'6px 8px 0',display:'flex',flexDirection:'column',gap:6}}>
          {/* Tickets section */}
          <div className="glass-panel glass-3d p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="section-label flex-1">
                <svg width="11" height="11" viewBox="0 0 24 24" className="icon-gold">
                  <path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 9v9a3 3 0 003 3h14a3 3 0 003-3V9M9 14h6" fill="none" stroke="url(#tGrad)" strokeWidth="2" strokeLinecap="round"/>
                  <defs><linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#F59E0B"/><stop offset="50%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/></linearGradient></defs>
                </svg>
                Your Tickets
              </div>
              {tickets.length>0&&(
                <span className="mono text-[10px] font-bold px-2 py-0.5 rounded-lg"
                  style={{background:'rgba(245,158,11,0.14)',border:'1px solid rgba(245,158,11,0.40)',color:'var(--gold)',textShadow:'0 0 6px rgba(245,158,11,0.60)'}}>
                  {tickets.length}
                </span>
              )}
            </div>

            {tickets.length===0 ? (
              <motion.div className="text-center py-5 mono text-[11px]" style={{color:'var(--ink-3)',opacity:0.55}}
                initial={{opacity:0}} animate={{opacity:0.55}}>
                Pick {maxPicks} numbers and press Add Numbers
              </motion.div>
            ) : (
              <AnimatePresence>
                {tickets.map((t,i)=>(
                  <motion.div key={t.id}
                    initial={{opacity:0,scale:0.93,y:-6}}
                    animate={{opacity:1,scale:1,y:0}}
                    exit={{opacity:0,scale:0.90,x:36}}
                    transition={{type:'spring',stiffness:400,damping:28}}>
                    <TicketRow ticket={t} index={i} onRemove={removeTicket} onAddToCart={addToCart}/>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {tickets.length>0 && (
              <motion.div className="flex justify-between items-center mono text-[10px] pt-3 mt-1"
                style={{borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--ink-3)'}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
                <span><b style={{color:'var(--ink-0)',fontWeight:700}}>{tickets.length}</b>{' '}ticket{tickets.length>1?'s':''}</span>
                <span>
                  <b style={{color:'var(--gold)',fontWeight:700,textShadow:'0 0 8px rgba(245,158,11,0.60)'}}>{tickets.length*ticketPrice} TON</b>
                  {' '}· up to {config.jackpotDisplayMax.toLocaleString()} TON
                </span>
              </motion.div>
            )}
          </div>

          {/* Prize tiers */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.38,delay:0.40}}>
            <PrizeTiers config={effectiveConfig}/>
          </motion.div>

          {/* Pool distribution */}
          <div className="glass-panel glass-3d px-4 py-3 flex gap-0 justify-around">
            {[
              {pct:'50%',label:'Prize Pool',color:'var(--emerald)'},
              {pct:'15%',label:'Jackpot',color:'var(--gold)'},
              {pct:'5%',label:'Reserve',color:'var(--ton)'},
            ].map((item,i)=>(
              <div key={i} className="flex-1 text-center" style={{borderRight:i<2?'1px solid rgba(255,255,255,0.05)':'none'}}>
                <div className="mono font-bold text-[13px]" style={{color:item.color}}>{item.pct}</div>
                <div className="mono text-[8.5px] font-semibold mt-0.5" style={{color:'var(--ink-3)'}}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Previous draws */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.38,delay:0.50}}>
            <PreviousDraws config={effectiveConfig}/>
          </motion.div>

          {/* Provably fair footer */}
          <div className="text-center mono text-[8px] py-2" style={{color:'var(--ink-3)',opacity:0.38}}>
            <svg width="10" height="10" viewBox="0 0 24 24" style={{display:'inline',marginRight:4}}><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9Z" fill="rgba(14,165,233,0.65)"/></svg>
            Provably Fair · TON Blockchain
          </div>
        </div>
      </div>

      {/* Cart FAB */}
      <div style={{position:'fixed',bottom:'calc(20px + env(safe-area-inset-bottom, 0px))',right:16,zIndex:50}}>
        <div className={`cart-fab ${cartBounce?'bouncing':''}`}>
          <ShoppingCart size={20} color="#fff" strokeWidth={2.5} style={{filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.70))'}}/>
        </div>
        {cartCount>0 && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
            style={{background:'var(--coral)',border:'1.5px solid var(--bg-0)',boxShadow:'0 0 8px rgba(244,63,94,0.80)',fontSize:9,fontWeight:800,color:'#fff',fontFamily:'var(--font-mono)'}}>
            {cartCount}
          </div>
        )}
      </div>
    </div>
  );
}

