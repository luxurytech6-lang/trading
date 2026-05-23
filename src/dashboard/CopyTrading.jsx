import React, { useState, useEffect, useRef } from 'react';

/* ─── Design tokens (mirrors shared.css) ─────────────────────────────────── */
const T = {
  p:   '#0d0f14', s:   '#13161e', t:   '#1a1e28', br:  '#252a38',
  gr:  '#e8e8e0', nt:  '#6b7280', g:   '#c9f15d', gd:  '#a8cc3e',
  bl:  '#4a9eff', rd:  '#ff5757', gn:  '#22c55e', pr:  '#a78bfa',
};

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const TRADERS = [
  { init:'VF', name:'Vincent Ford',  handle:'@vForce',  market:'Crypto', risk:'Low',    roi:38.4, wr:73, copiers:1240, yrs:3, color:'#c9f15d', badge:'Top Earner',  badgeCls:'gold',  spark:[22,28,25,35,30,38,36,38], desc:'Algorithmic BTC/ETH rotation, low drawdown strategy.' },
  { init:'SM', name:'Sofia Mendez',  handle:'@sofiaM',  market:'Forex',  risk:'Medium', roi:24.7, wr:69, copiers:892,  yrs:5, color:'#4a9eff', badge:'Trending',    badgeCls:'blue',  spark:[10,14,12,18,15,22,20,25], desc:'EUR/USD carry trades with options overlay.' },
  { init:'RO', name:'Riku Osaka',    handle:'@rikuPRO', market:'Stocks', risk:'Low',    roi:18.2, wr:65, copiers:544,  yrs:2, color:'#a78bfa', badge:'Verified',    badgeCls:'blue',  spark:[8,10,9,13,11,15,14,18],  desc:'S&P 500 index momentum with volatility filter.' },
  { init:'AJ', name:'Arjun Joshi',   handle:'@arjunFX', market:'Forex',  risk:'High',   roi:52.1, wr:61, copiers:2100, yrs:7, color:'#E87040', badge:'High Return', badgeCls:'red',   spark:[20,35,28,45,38,50,42,52], desc:'High-leverage breakout scalping on majors.' },
  { init:'LN', name:'Lisa Nakamura', handle:'@lisaN',   market:'Crypto', risk:'Low',    roi:14.6, wr:71, copiers:330,  yrs:2, color:'#40B0A6', badge:'Consistent',  badgeCls:'blue',  spark:[6,8,7,10,9,12,11,15],   desc:'Altcoin basket rebalancing, DCA-first approach.' },
  { init:'BK', name:'Bashir Kofi',   handle:'@bKofi',   market:'Stocks', risk:'Medium', roi:21.9, wr:67, copiers:780,  yrs:4, color:'#e8e8e0', badge:'Diversified', badgeCls:'green', spark:[9,13,11,17,14,19,17,22],  desc:'Sector rotation across tech, energy, and healthcare.' },
];

const COPYING = [
  { ...TRADERS[0], allocated: 6000, gain: 840,  since:'Apr 2025' },
  { ...TRADERS[1], allocated: 5000, gain: 620,  since:'Mar 2025' },
  { ...TRADERS[2], allocated: 4000, gain: 382,  since:'May 2025' },
];

const METRICS = [
  { label:'Copying',        value:'3 Traders', sub:'Active now',       sub2:'',          color: T.nt,  icon:'ti-copy' },
  { label:'Copy Gains',     value:'+$1,842',   sub:'▲ +12.3% ROI',     sub2:'30 days',   color: T.gn,  icon:'ti-trending-up' },
  { label:'Allocated',      value:'$15,000',   sub:'31% of portfolio', sub2:'',          color: T.bl,  icon:'ti-wallet' },
  { label:'Best Performer', value:'@vForce',   sub:'+38.4% / 30D',    sub2:'',          color: T.g,   icon:'ti-trophy' },
];

const RISK_COLOR = { Low: T.gn, Medium: '#f59e0b', High: T.rd };
const RISK_BG    = { Low: 'rgba(34,197,94,.12)', Medium: 'rgba(245,158,11,.12)', High: 'rgba(255,87,87,.12)' };

/* ─── Tiny sparkline SVG ─────────────────────────────────────────────────── */
function Spark({ data, color = T.g, h = 32, w = 72 }) {
  const mn = Math.min(...data), mx = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - mn) / (mx - mn || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  const fill = `${pts} ${w},${h} 0,${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#sg${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Av({ init, color, size = 36, fontSize = 12 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize,
      color: color === T.gr || color === '#e8e8e0' ? '#000' : '#000',
      flexShrink: 0,
    }}>{init}</div>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────────── */
function Badge({ children, variant = 'green' }) {
  const styles = {
    green:  { bg: 'rgba(34,197,94,.13)',   color: T.gn   },
    blue:   { bg: 'rgba(74,158,255,.13)',  color: T.bl   },
    gold:   { bg: 'rgba(201,241,93,.13)',  color: T.g    },
    red:    { bg: 'rgba(255,87,87,.13)',   color: T.rd   },
    purple: { bg: 'rgba(167,139,250,.13)', color: T.pr   },
    muted:  { bg: 'rgba(107,114,128,.13)', color: T.nt   },
  };
  const s = styles[variant] || styles.green;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 10, fontWeight: 700, fontFamily: "'Syne', sans-serif",
      padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap', letterSpacing: '0.2px',
    }}>{children}</span>
  );
}

/* ─── Metric Card ────────────────────────────────────────────────────────── */
function MetricCard({ m }) {
  return (
    <div style={{
      background: T.s, border: `1px solid ${T.br}`, borderRadius: 12,
      padding: '16px 18px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${m.color}18`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <i className={`ti ${m.icon}`} style={{ fontSize: 16, color: m.color }} aria-hidden="true" />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.nt, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
          {m.label}
        </span>
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: m.color === T.nt ? T.gr : m.color, lineHeight: 1, marginBottom: 5 }}>
        {m.value}
      </div>
      <div style={{ fontSize: 11, color: T.nt }}>{m.sub}</div>
    </div>
  );
}

/* ─── Trader Card ────────────────────────────────────────────────────────── */
function TraderCard({ t, onCopy }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onCopy(t)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.t : T.s,
        border: `1px solid ${hov ? t.color + '55' : T.br}`,
        borderRadius: 14, padding: 18, cursor: 'pointer',
        transition: 'all 0.18s ease', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14 }}>
        <Av init={t.init} color={t.color} size={42} fontSize={14} />
        <Badge variant={t.badgeCls}>{t.badge}</Badge>
      </div>

      {/* name */}
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{t.name}</div>
      <div style={{ fontSize: 11, color: T.nt, marginBottom: 10 }}>{t.handle} · {t.market}</div>

      {/* sparkline */}
      <div style={{ marginBottom: 12 }}>
        <Spark data={t.spark} color={t.color} />
      </div>

      {/* stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 0, borderTop: `1px solid ${T.br}`, paddingTop: 12 }}>
        {[
          { label: '30D ROI', val: `+${t.roi}%`, highlight: true },
          { label: 'Win Rate', val: `${t.wr}%`, highlight: false },
          { label: 'Copiers', val: t.copiers.toLocaleString(), highlight: false },
        ].map(({ label, val, highlight }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: highlight ? T.gn : T.gr }}>
              {val}
            </div>
            <div style={{ fontSize: 10, color: T.nt, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* risk + yrs */}
      <div style={{ display:'flex', gap: 6, marginTop: 12, flexWrap:'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
          background: RISK_BG[t.risk], color: RISK_COLOR[t.risk], fontFamily:"'Syne', sans-serif",
        }}>{t.risk} Risk</span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
          background: 'rgba(74,158,255,.1)', color: T.bl, fontFamily:"'Syne', sans-serif",
        }}>{t.yrs}Y Active</span>
      </div>

      {/* hover CTA */}
      {hov && (
        <div style={{
          position:'absolute', bottom: 0, left: 0, right: 0,
          background: `linear-gradient(transparent, ${t.color}22)`,
          display:'flex', alignItems:'center', justifyContent:'center', padding: '14px 0 12px',
        }}>
          <div style={{
            background: t.color, color: '#000', borderRadius: 7, padding: '6px 20px',
            fontSize: 12, fontWeight: 800, fontFamily:"'Syne', sans-serif",
          }}>Copy Trader →</div>
        </div>
      )}
    </div>
  );
}

/* ─── Copying Card ───────────────────────────────────────────────────────── */
function CopyingCard({ t }) {
  const pct = ((t.gain / t.allocated) * 100).toFixed(1);
  return (
    <div style={{ background: T.s, border: `1px solid ${T.br}`, borderRadius: 14, padding: 18 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 14 }}>
        <Av init={t.init} color={t.color} size={38} fontSize={13} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{t.name}</div>
          <div style={{ fontSize: 11, color: T.nt }}>{t.handle}</div>
        </div>
        <Badge variant="green">Live</Badge>
      </div>

      {/* allocation bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color: T.nt, marginBottom: 6 }}>
          <span>Allocated</span><span style={{ color: T.gn }}>+{pct}% gain</span>
        </div>
        <div style={{ height: 5, background: T.t, borderRadius: 99, overflow:'hidden' }}>
          <div style={{ height:'100%', width: `${Math.min(pct * 3, 100)}%`, background: t.color, borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label:'Allocated', val:`$${t.allocated.toLocaleString()}` },
          { label:'Gain', val:`+$${t.gain.toLocaleString()}`, color: T.gn },
          { label:'ROI', val: t.roi + '%', color: T.gn },
          { label:'Since', val: t.since },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: T.t, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: color || T.gr }}>{val}</div>
            <div style={{ fontSize: 10, color: T.nt, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap: 8 }}>
        <button style={{
          flex: 1, background: 'transparent', border: `1px solid ${T.br}`,
          color: T.gr, borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 700,
          cursor:'pointer', fontFamily:"'Manrope', sans-serif",
        }}>⏸ Pause</button>
        <button style={{
          flex: 1, background: 'transparent', border: `1px solid rgba(255,87,87,.35)`,
          color: T.rd, borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 700,
          cursor:'pointer', fontFamily:"'Manrope', sans-serif",
        }}>✕ Stop</button>
      </div>
    </div>
  );
}

/* ─── Leaderboard Table ──────────────────────────────────────────────────── */
function Leaderboard({ traders, onCopy }) {
  const sorted = [...traders].sort((a, b) => b.roi - a.roi);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div style={{ background: T.s, border: `1px solid ${T.br}`, borderRadius: 14, overflow:'hidden', gridColumn:'1/-1' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.br}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontSize: 14, fontWeight: 800 }}>30-Day Leaderboard</div>
        <Badge variant="gold">Live Rankings</Badge>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: T.t }}>
            {['#','Trader','Market','30D ROI','Win Rate','Copiers',''].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '9px 16px', color: T.nt,
                fontSize: 10, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.7px',
                borderBottom: `1px solid ${T.br}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => (
            <tr key={t.handle} style={{ borderBottom: `1px solid ${T.br}` }}>
              <td style={{ padding:'12px 16px', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize: 14, color: i < 3 ? T.g : T.nt }}>
                {medals[i] || i + 1}
              </td>
              <td style={{ padding:'12px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <Av init={t.init} color={t.color} size={30} fontSize={10} />
                  <div>
                    <div style={{ fontWeight:700, fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:T.nt }}>{t.handle}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding:'12px 16px' }}><Badge variant="blue">{t.market}</Badge></td>
              <td style={{ padding:'12px 16px', fontFamily:"'DM Mono', monospace", fontWeight:800, color: T.gn }}>+{t.roi}%</td>
              <td style={{ padding:'12px 16px', fontFamily:"'DM Mono', monospace" }}>{t.wr}%</td>
              <td style={{ padding:'12px 16px', fontFamily:"'DM Mono', monospace" }}>{t.copiers.toLocaleString()}</td>
              <td style={{ padding:'12px 16px' }}>
                <button
                  onClick={() => onCopy(t)}
                  style={{
                    background:'transparent', border:`1px solid ${T.br}`,
                    color: T.gr, borderRadius: 7, padding:'6px 14px',
                    fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Manrope', sans-serif",
                    transition:'all 0.15s',
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = T.g; e.target.style.color = T.g; }}
                  onMouseLeave={e => { e.target.style.borderColor = T.br; e.target.style.color = T.gr; }}
                >Copy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function CopyModal({ trader: t, onClose }) {
  const [amount, setAmount] = useState('');
  const [stopLoss, setStopLoss] = useState('15');
  const [ratio, setRatio] = useState('proportional');
  const [step, setStep] = useState(1);

  if (!t) return null;

  const estReturn = amount ? ((parseFloat(amount) * t.roi) / 100).toFixed(2) : null;

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,.72)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:600, padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.s, border:`1px solid ${T.br}`, borderRadius: 18,
          width:'100%', maxWidth: 440, maxHeight:'90vh', overflowY:'auto',
          padding: 24, position:'relative',
        }}
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{
            position:'absolute', top:14, right:14, background:'transparent',
            border:`1px solid ${T.br}`, color:T.nt, borderRadius: 8,
            width:28, height:28, cursor:'pointer', fontSize:14, lineHeight:1,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >✕</button>

        {/* header */}
        <div style={{ display:'flex', alignItems:'center', gap: 14, marginBottom: 20 }}>
          <Av init={t.init} color={t.color} size={50} fontSize={16} />
          <div>
            <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:18, marginBottom:2 }}>{t.name}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:12, color:T.nt }}>{t.handle} · {t.market}</span>
              <Badge variant={t.badgeCls}>{t.badge}</Badge>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:20, background:T.t, borderRadius:10, padding:14 }}>
          {[
            { label:'30D ROI', val:`+${t.roi}%`, color:T.gn },
            { label:'Win Rate', val:`${t.wr}%`, color:T.gr },
            { label:'Copiers', val:t.copiers.toLocaleString(), color:T.gr },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'DM Mono', monospace", fontSize:16, fontWeight:800, color }}>{val}</div>
              <div style={{ fontSize:10, color:T.nt, marginTop:3 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* desc */}
        <div style={{ fontSize:12, color:T.nt, marginBottom:20, lineHeight:1.6, padding:'10px 12px', background:T.t, borderRadius:8 }}>
          {t.desc}
        </div>

        {/* form */}
        {[
          { label:'Amount to copy (USD)', id:'amt', type:'number', ph:'e.g. 1000', val:amount, set:setAmount },
          { label:'Stop loss (%)', id:'sl', type:'number', ph:'e.g. 15', val:stopLoss, set:setStopLoss },
        ].map(({ label, id, type, ph, val, set }) => (
          <div key={id} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, color:T.nt, display:'block', marginBottom:6, fontWeight:600 }}>{label}</label>
            <input
              type={type} placeholder={ph} value={val}
              onChange={e => set(e.target.value)}
              style={{
                width:'100%', background:T.t, border:`1px solid ${T.br}`,
                borderRadius:8, padding:'10px 12px', fontSize:13, color:T.gr,
                fontFamily:"'Manrope', sans-serif", outline:'none',
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, color:T.nt, display:'block', marginBottom:6, fontWeight:600 }}>Copy ratio</label>
          <select
            value={ratio} onChange={e => setRatio(e.target.value)}
            style={{
              width:'100%', background:T.t, border:`1px solid ${T.br}`,
              borderRadius:8, padding:'10px 12px', fontSize:13, color:T.gr,
              fontFamily:"'Manrope', sans-serif", outline:'none',
            }}
          >
            <option value="proportional">Proportional (recommended)</option>
            <option value="fixed">Fixed lot size</option>
          </select>
        </div>

        {/* projected return */}
        {estReturn && (
          <div style={{
            background:`rgba(201,241,93,.07)`, border:`1px solid rgba(201,241,93,.2)`,
            borderRadius:10, padding:'12px 14px', marginBottom:16,
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <div style={{ fontSize:12, color:T.nt }}>Projected 30D return (at {t.roi}%)</div>
            <div style={{ fontFamily:"'DM Mono', monospace", fontWeight:800, color:T.g, fontSize:16 }}>+${estReturn}</div>
          </div>
        )}

        {/* disclaimer */}
        <div style={{
          background:'rgba(201,168,76,.06)', border:`1px solid rgba(201,168,76,.18)`,
          borderRadius:8, padding:10, marginBottom:16, fontSize:11, color:T.nt, lineHeight:1.5,
        }}>
          <i className="ti ti-info-circle" style={{ color:T.g, fontSize:13, verticalAlign:-2, marginRight:5 }} aria-hidden="true" />
          Copy trading involves risk. Past performance is not a guarantee of future results.
        </div>

        <button style={{
          width:'100%', background:T.g, color:'#000', border:'none',
          borderRadius:10, padding:'13px 0', fontSize:14, fontWeight:800,
          cursor:'pointer', fontFamily:"'Syne', sans-serif", letterSpacing:'0.2px',
        }}>
          Start Copying {t.name.split(' ')[0]} →
        </button>
      </div>
    </div>
  );
}

/* ─── Tab Bar ─────────────────────────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  const tabs = [
    { key:'top',     label:'Top Traders', icon:'ti-users' },
    { key:'copying', label:'Copying',     icon:'ti-copy'  },
    { key:'leaders', label:'Leaderboard', icon:'ti-trophy'},
  ];
  return (
    <div style={{ display:'flex', gap:4, background:T.t, border:`1px solid ${T.br}`, borderRadius:10, padding:4 }}>
      {tabs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'7px 14px', borderRadius:7, border:'none', cursor:'pointer',
            fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:12,
            background: active === key ? T.g : 'transparent',
            color: active === key ? '#000' : T.nt,
            transition:'all 0.15s', whiteSpace:'nowrap',
          }}
        >
          <i className={`ti ${icon}`} style={{ fontSize:14 }} aria-hidden="true" />
          {label}
          {key === 'copying' && <span style={{
            background: active === 'copying' ? 'rgba(0,0,0,.2)' : 'rgba(34,197,94,.2)',
            color: active === 'copying' ? '#000' : T.gn,
            fontSize:9, fontWeight:800, padding:'1px 5px', borderRadius:99,
          }}>3</span>}
        </button>
      ))}
    </div>
  );
}

/* ─── Filter Row ──────────────────────────────────────────────────────────── */
function Filters({ filters, setFilters }) {
  const sel = (key) => (e) => setFilters(f => ({ ...f, [key]: e.target.value }));
  const style = {
    background: T.t, border: `1px solid ${T.br}`, color: T.gr,
    borderRadius: 8, padding: '7px 10px', fontSize: 12,
    fontFamily:"'Manrope', sans-serif", cursor:'pointer', outline:'none',
  };
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
      <select value={filters.market} onChange={sel('market')} style={style}>
        <option value="">All Markets</option>
        <option>Crypto</option><option>Forex</option><option>Stocks</option>
      </select>
      <select value={filters.risk} onChange={sel('risk')} style={style}>
        <option value="">All Risk Levels</option>
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <select value={filters.sort} onChange={sel('sort')} style={style}>
        <option value="roi">Sort: ROI</option>
        <option value="wr">Win Rate</option>
        <option value="copiers">Copiers</option>
      </select>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar() {
  const mainLinks = [
    { href:'#', icon:'ti-layout-dashboard', label:'Dashboard' },
    { href:'#', icon:'ti-copy',             label:'Copy Trading', active:true },
    { href:'#', icon:'ti-users',            label:'Hire a Trader' },
    { href:'#', icon:'ti-chart-line',       label:'Insights' },
  ];
  const acctLinks = [
    { href:'#', icon:'ti-credit-card',     label:'Payments' },
    { href:'#', icon:'ti-headset',         label:'Support' },
    { href:'#', icon:'ti-file-description',label:'Terms' },
  ];
  const Group = ({ label, links }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize:10, fontWeight:700, color:T.nt, letterSpacing:'1.2px', textTransform:'uppercase', padding:'8px 8px 4px' }}>{label}</div>
      {links.map(l => (
        <a key={l.label} href={l.href} style={{
          display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
          borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none',
          background: l.active ? T.g : 'transparent',
          color: l.active ? '#000' : T.nt,
          transition:'all .15s', marginBottom:1,
        }}>
          <i className={`ti ${l.icon}`} style={{ fontSize:16 }} aria-hidden="true" />
          {l.label}
        </a>
      ))}
    </div>
  );
  return (
    <div style={{
      width: 210, minWidth: 210, background: T.s, borderRight:`1px solid ${T.br}`,
      display:'flex', flexDirection:'column', padding:'12px 8px',
      position:'sticky', top:62, height:'calc(100vh - 62px)', overflowY:'auto',
    }}>
      <Group label="Main" links={mainLinks} />
      <Group label="Account" links={acctLinks} />
      <div style={{ flex:1 }} />
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 8px', borderTop:`1px solid ${T.br}`, marginTop:8 }}>
        <div style={{
          width:32, height:32, borderRadius:'50%', background:T.g, color:'#000',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:11, flexShrink:0,
        }}>AK</div>
        <div>
          <div style={{ fontSize:13, fontWeight:700 }}>Alex Kim</div>
          <div style={{ fontSize:10, color:T.nt }}>Pro · Verified</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Top Nav ─────────────────────────────────────────────────────────────── */
function TopNav() {
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:200, height:62,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 24px', background:T.s, borderBottom:`1px solid ${T.br}`,
    }}>
      <a href="#" style={{ fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:800, color:T.gr, textDecoration:'none', letterSpacing:'-0.5px' }}>
        Trade<span style={{ color:T.g }}>Flow</span>
      </a>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ fontSize:12, color:T.nt, fontFamily:"'Syne', sans-serif" }}>
          Portfolio&nbsp; <span style={{ color:T.gn, fontWeight:700 }}>$48,204.33</span>
        </div>
        <i className="ti ti-bell" style={{ fontSize:18, color:T.nt, cursor:'pointer' }} aria-label="Notifications" />
        <div style={{
          width:34, height:34, borderRadius:'50%', background:T.g, color:'#000',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:12, cursor:'pointer',
        }}>AK</div>
      </div>
    </nav>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function CopyTrading() {
  const [tab, setTab]         = useState('top');
  const [modal, setModal]     = useState(null);
  const [filters, setFilters] = useState({ market:'', risk:'', sort:'roi' });

  const filtered = TRADERS
    .filter(t => !filters.market || t.market === filters.market)
    .filter(t => !filters.risk   || t.risk   === filters.risk)
    .sort((a, b) => {
      if (filters.sort === 'wr')      return b.wr - a.wr;
      if (filters.sort === 'copiers') return b.copiers - a.copiers;
      return b.roi - a.roi;
    });

  return (
    <div style={{ fontFamily:"'Manrope', sans-serif", background:T.p, minHeight:'100vh', color:T.gr }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.34.0/dist/tabler-icons.min.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <TopNav />

      <div style={{ display:'flex', minHeight:'calc(100vh - 62px)' }}>
        <Sidebar />

        <main style={{ flex:1, padding:24, minWidth:0, overflowX:'hidden' }}>

          {/* Page header */}
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:26, fontWeight:800, marginBottom:4, lineHeight:1 }}>
              Copy Trading
            </h1>
            <p style={{ fontSize:13, color:T.nt }}>Mirror elite traders automatically. Start, pause, or stop anytime.</p>
          </div>

          {/* Metrics */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
          </div>

          {/* Controls */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:16 }}>
            <TabBar active={tab} onChange={setTab} />
            {tab === 'top' && <Filters filters={filters} setFilters={setFilters} />}
          </div>

          {/* Content */}
          {tab === 'top' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {filtered.map(t => <TraderCard key={t.handle} t={t} onCopy={setModal} />)}
              {filtered.length === 0 && (
                <div style={{ gridColumn:'1/-1', textAlign:'center', color:T.nt, padding:40, fontSize:13 }}>
                  No traders match those filters.
                </div>
              )}
            </div>
          )}

          {tab === 'copying' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {COPYING.map(t => <CopyingCard key={t.handle} t={t} />)}
            </div>
          )}

          {tab === 'leaders' && (
            <div style={{ display:'grid', gap:14 }}>
              <Leaderboard traders={TRADERS} onCopy={setModal} />
            </div>
          )}

        </main>
      </div>

      {modal && <CopyModal trader={modal} onClose={() => setModal(null)} />}
    </div>
  );
}