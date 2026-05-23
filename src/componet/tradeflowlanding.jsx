import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg:          "#05080F",
  surface:     "#0B1120",
  surfaceAlt:  "#0F1929",
  border:      "#1A2740",
  borderHover: "#2A3F60",
  accent:      "#00E5A0",
  accentDim:   "rgba(0,229,160,0.12)",
  accentGlow:  "rgba(0,229,160,0.22)",
  gold:        "#F0C040",
  goldDim:     "rgba(240,192,64,0.12)",
  text:        "#E4EDF8",
  textMid:     "#6B87A8",
  textDim:     "#3D567A",
  red:         "#FF4D6A",
  green:       "#00E5A0",
  blue:        "#3B9EFF",
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once via <style>)
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

html, body {
  background: ${C.bg};
  color: ${C.text};
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  overflow-y: auto;
  height: auto;
}

a { text-decoration: none; color: inherit; }

/* ── Keyframes ── */
@keyframes tickerScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:.6; transform:scale(.95); }
}
@keyframes gridFade {
  from { opacity: 0; }
  to   { opacity: .35; }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-10px); }
}
@keyframes chartDraw {
  from { stroke-dashoffset: 600; }
  to   { stroke-dashoffset: 0; }
}
@keyframes cookieSlide {
  from { transform: translateY(120%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes mobileMenuOpen {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Hero entry animations ── */
.hero-badge  { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .05s both; }
.hero-title  { animation: fadeUp .8s cubic-bezier(.22,1,.36,1) .15s both; }
.hero-sub    { animation: fadeUp .8s cubic-bezier(.22,1,.36,1) .28s both; }
.hero-cta    { animation: fadeUp .8s cubic-bezier(.22,1,.36,1) .40s both; }
.hero-stats  { animation: fadeUp .8s cubic-bezier(.22,1,.36,1) .52s both; }
.hero-card   { animation: fadeUp .9s cubic-bezier(.22,1,.36,1) .30s both, float 6s ease-in-out 1.2s infinite; }

.chart-line {
  stroke-dasharray: 600;
  animation: chartDraw 2s ease-out 1s both;
}

/* ── Scroll reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity .7s ease, transform .7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: ${C.accent}; color: #040A14;
  padding: 13px 26px; border-radius: 10px;
  font-size: 14px; font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; border: none;
  transition: transform .18s, box-shadow .18s;
  position: relative; overflow: hidden; white-space: nowrap;
}
.btn-primary::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 60%);
  opacity: 0; transition: opacity .2s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 36px ${C.accentGlow}; }
.btn-primary:hover::after { opacity: 1; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: ${C.textMid};
  padding: 13px 26px; border-radius: 10px;
  font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  cursor: pointer; border: 1px solid ${C.border};
  transition: border-color .2s, color .2s, background .2s;
  white-space: nowrap;
}
.btn-secondary:hover { border-color: ${C.borderHover}; color: ${C.text}; background: rgba(255,255,255,.03); }

/* ── Nav links ── */
.nav-link {
  font-size: 13px; color: ${C.textMid};
  font-weight: 500; transition: color .15s;
  letter-spacing: .01em;
}
.nav-link:hover { color: ${C.text}; }

/* ── Cards ── */
.trader-card {
  background: ${C.surface}; border: 1px solid ${C.border};
  border-radius: 16px; padding: 24px;
  transition: transform .25s, border-color .25s, box-shadow .25s;
  cursor: pointer; position: relative; overflow: hidden;
}
.trader-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, ${C.accentGlow}, transparent);
  opacity: 0; transition: opacity .3s;
}
.trader-card:hover { border-color: ${C.borderHover}; transform: translateY(-4px); box-shadow: 0 24px 48px rgba(0,0,0,.45); }
.trader-card:hover::before { opacity: 1; }

.feature-card {
  background: ${C.surface}; border: 1px solid ${C.border};
  border-radius: 16px; padding: 32px; transition: border-color .25s, background .25s;
}
.feature-card:hover { border-color: ${C.accent}40; background: ${C.surfaceAlt}; }

.testimonial-card {
  background: ${C.surface}; border: 1px solid ${C.border};
  border-radius: 16px; padding: 28px;
}

/* ── Misc UI ── */
.section-label {
  display: inline-block; font-size: 11px; font-weight: 600;
  letter-spacing: .12em; text-transform: uppercase;
  color: ${C.accent}; margin-bottom: 12px;
}

.tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: ${C.accentDim}; border: 1px solid ${C.accent}40;
  border-radius: 20px; padding: 5px 14px;
  font-size: 11px; color: ${C.accent}; font-weight: 600;
  letter-spacing: .06em; text-transform: uppercase;
}

.badge-live {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(0,229,160,.08); border: 1px solid rgba(0,229,160,.2);
  border-radius: 6px; padding: 3px 8px;
  font-family: 'DM Mono', monospace; font-size: 10px;
  color: ${C.accent}; font-weight: 500;
}
.badge-live::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: ${C.accent}; animation: pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

.copy-btn {
  background: ${C.accentDim}; border: 1px solid ${C.accent}40;
  border-radius: 8px; padding: 8px 16px;
  font-size: 12px; font-weight: 700; color: ${C.accent};
  cursor: pointer; transition: background .2s, color .2s, border-color .2s;
  font-family: 'DM Sans', sans-serif;
}
.copy-btn:hover { background: ${C.accent}; color: #040A14; border-color: ${C.accent}; }

.avatar {
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; flex-shrink: 0; font-family: 'Syne', sans-serif;
}

.divider {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent, ${C.border}, transparent);
}

.glow-orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
}

.grid-bg {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(${C.border} 1px, transparent 1px),
    linear-gradient(90deg, ${C.border} 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridFade 1.5s ease-out both;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%);
}

/* ── Cookie banner ── */
.cookie-banner {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  width: calc(100% - 40px); max-width: 720px; z-index: 999;
  background: ${C.surface}; border: 1px solid ${C.border};
  border-radius: 16px; padding: 20px 24px;
  box-shadow: 0 24px 60px rgba(0,0,0,.6);
  animation: cookieSlide .5s cubic-bezier(.22,1,.36,1) .8s both;
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}

/* ── Mobile menu ── */
.mobile-menu {
  animation: mobileMenuOpen .25s ease both;
  position: absolute; top: 100%; left: 0; right: 0;
  background: rgba(5,8,15,.97); backdrop-filter: blur(16px);
  border-bottom: 1px solid ${C.border};
  padding: 16px 24px 20px;
  display: flex; flex-direction: column; gap: 4px;
}
.mobile-menu .nav-link {
  padding: 10px 0; font-size: 15px;
  border-bottom: 1px solid ${C.border};
}
.mobile-menu .nav-link:last-of-type { border-bottom: none; }

/* ── Input ── */
.tf-input {
  background: ${C.surfaceAlt}; border: 1px solid ${C.border};
  border-radius: 10px; padding: 13px 16px;
  font-size: 14px; color: ${C.text}; font-family: 'DM Sans', sans-serif;
  outline: none; transition: border-color .2s;
  width: 100%;
}
.tf-input:focus { border-color: ${C.accent}60; }
.tf-input::placeholder { color: ${C.textDim}; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: ${C.bg}; }
::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

/* ── Footer link ── */
.footer-link { font-size: 13px; color: ${C.textDim}; transition: color .15s; }
.footer-link:hover { color: ${C.textMid}; }

/* ═══════════════════════════════════════
   RESPONSIVE BREAKPOINTS
═══════════════════════════════════════ */

/* Tablet  ≤ 900px */
@media (max-width: 900px) {
  .hero-grid    { grid-template-columns: 1fr !important; gap: 48px !important; }
  .hero-card    { animation: fadeUp .9s cubic-bezier(.22,1,.36,1) .3s both !important; max-width: 480px; margin: 0 auto; }
  .traders-grid { grid-template-columns: 1fr 1fr !important; }
  .features-grid { grid-template-columns: 1fr 1fr !important; }
  .footer-grid  { grid-template-columns: 1fr 1fr !important; }
  .steps-grid   { gap: 20px !important; }
  .steps-line   { display: none !important; }
  .hero-section { padding: 60px 24px 48px !important; }
  .section-pad  { padding: 72px 24px !important; }
  .nav-links    { display: none !important; }
  .nav-cta-desktop { display: none !important; }
  .hamburger    { display: flex !important; }
  .stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
}

/* Mobile  ≤ 600px */
@media (max-width: 600px) {
  .traders-grid  { grid-template-columns: 1fr !important; }
  .features-grid { grid-template-columns: 1fr !important; }
  .steps-grid    { grid-template-columns: 1fr !important; }
  .testi-grid    { grid-template-columns: 1fr !important; }
  .footer-grid   { grid-template-columns: 1fr !important; }
  .cta-email-row { flex-direction: column !important; }
  .cta-email-row input { width: 100% !important; }
  .hero-btns     { flex-direction: column !important; align-items: stretch !important; }
  .hero-btns a, .hero-btns button { text-align: center; justify-content: center; }
  .stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
  .section-pad   { padding: 56px 16px !important; }
  .hero-section  { padding: 48px 16px 40px !important; }
  .footer-bottom { flex-direction: column !important; gap: 12px !important; text-align: center; }
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TICKER = [
  { sym:"BTC", price:"$67,420", chg:"+2.31%", up:true  },
  { sym:"ETH", price:"$3,841",  chg:"+1.82%", up:true  },
  { sym:"SOL", price:"$178.4",  chg:"+4.07%", up:true  },
  { sym:"BNB", price:"$592.1",  chg:"-0.54%", up:false },
  { sym:"XRP", price:"$0.631",  chg:"+1.20%", up:true  },
  { sym:"ADA", price:"$0.441",  chg:"-1.10%", up:false },
  { sym:"MATIC",price:"$0.884", chg:"+3.42%", up:true  },
  { sym:"AVAX", price:"$38.71", chg:"+2.75%", up:true  },
  { sym:"LINK", price:"$14.92", chg:"-0.33%", up:false },
  { sym:"DOT",  price:"$7.28",  chg:"+0.91%", up:true  },
];

const TRADERS = [
  { id:1, name:"Alexei Voronov", handle:"@voronov_trades", roi:"+347%", monthly:"+28.4%", dd:"4.2%", followers:"12.4K", win:"73%", spark:[30,45,38,55,42,68,60,78,72,95], initials:"AV", bg:"#1A2A4A", star:true },
  { id:2, name:"Priya Sharma",   handle:"@psharma_fx",     roi:"+218%", monthly:"+19.1%", dd:"2.8%", followers:"8.7K",  win:"81%", spark:[40,35,50,46,60,55,72,68,80,88], initials:"PS", bg:"#1A3A2A" },
  { id:3, name:"Marcus Webb",    handle:"@webb_quant",     roi:"+412%", monthly:"+31.7%", dd:"5.6%", followers:"21.1K", win:"69%", spark:[20,38,30,55,65,58,78,82,70,98], initials:"MW", bg:"#2A1A3A" },
];

const FEATURES = [
  { icon:"◎", title:"AI Copy Trading",     desc:"Smart algorithms mirror elite traders' moves with adjustable risk controls and position sizing." },
  { icon:"◈", title:"Portfolio Analytics", desc:"Deep metrics: Sharpe ratio, max drawdown, correlation heatmaps, and P&L attribution by strategy." },
  { icon:"◇", title:"Hire Pro Traders",    desc:"Curated marketplace of verified traders. Review audited track records before allocating capital." },
  { icon:"◉", title:"Risk Management",     desc:"Set stop-loss thresholds, daily loss limits, and exposure caps at account or per-trader level." },
  { icon:"▣", title:"Multi-Asset Support", desc:"Trade crypto, forex, stocks, and commodities from one unified dashboard with cross-asset analytics." },
  { icon:"◐", title:"Instant Settlements", desc:"Near-instant settlement with full audit trail. Withdraw anytime with zero lockup periods." },
];

const TESTIMONIALS = [
  { quote:"TradeFlow's copy system is the most transparent I've used. I can see exactly what trades fire and why.", author:"James K.", role:"Retail Investor · London",           initials:"JK", bg:"#1A2A4A" },
  { quote:"ROI up 180% in 7 months. The risk controls saved me during the March dip — didn't lose a cent I didn't plan.", author:"Sofia R.", role:"Portfolio Manager · São Paulo", initials:"SR", bg:"#1A3A2A" },
  { quote:"The pro trader marketplace is a game changer. Audited records mean I know exactly what I'm buying into.", author:"Tariq M.", role:"Family Office · Dubai",             initials:"TM", bg:"#2A1A1A" },
];

/* ─────────────────────────────────────────────
   MINI COMPONENTS
───────────────────────────────────────────── */
const Sparkline = ({ data, up }) => {
  const W=80, H=32;
  const mn=Math.min(...data), mx=Math.max(...data);
  const pts = data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-mn)/(mx-mn))*H}`).join(" ");
  const fill = `${pts} ${W},${H} 0,${H}`;
  const col = up ? C.green : C.red;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{flexShrink:0}}>
      <polygon points={fill} fill={`${col}18`} />
      <polyline points={pts} stroke={col} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const HeroChart = () => (
  <svg width="100%" height="110" viewBox="0 0 320 110" fill="none" preserveAspectRatio="none">
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={C.accent} stopOpacity=".32"/>
        <stop offset="100%" stopColor={C.accent} stopOpacity="0"/>
      </linearGradient>
    </defs>
    <path d="M0,95 L20,88 L45,75 L65,80 L85,65 L105,70 L120,55 L140,45 L160,52 L175,38 L195,30 L215,20 L235,28 L255,15 L275,10 L295,5 L320,8 L320,110 L0,110 Z" fill="url(#hg)"/>
    <path d="M0,95 L20,88 L45,75 L65,80 L85,65 L105,70 L120,55 L140,45 L160,52 L175,38 L195,30 L215,20 L235,28 L255,15 L275,10 L295,5 L320,8"
      stroke={C.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chart-line"/>
    <circle cx="320" cy="8" r="4"  fill={C.accent}/>
    <circle cx="320" cy="8" r="9"  fill={C.accentGlow}/>
  </svg>
);

/* Scroll-reveal wrapper */
const Reveal = ({ children, delay=0, style }) => {
  const ref = useRef();
  useEffect(()=>{
    const el = ref.current;
    const ob = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ el.classList.add("visible"); ob.disconnect(); }},{ threshold:.08 });
    ob.observe(el);
    return ()=>ob.disconnect();
  },[]);
  return <div ref={ref} className="reveal" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
};

/* Smooth scroll link */
const SLink = ({ to, children, className, style, onClick }) => {
  const handle = (e) => {
    e.preventDefault();
    const el = document.getElementById(to);
    if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
    onClick && onClick();
  };
  return <a href={`#${to}`} className={className} style={style} onClick={handle}>{children}</a>;
};

/* ─────────────────────────────────────────────
   COOKIE BANNER
───────────────────────────────────────────── */
const CookieBanner = () => {
  const [state, setState] = useState(null); // null=loading, 'show', 'hidden'
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    const choice = localStorage.getItem("tf_cookie_consent");
    setState(choice ? "hidden" : "show");
  },[]);

  const accept = () => {
    setSaving(true);
    setTimeout(()=>{
      localStorage.setItem("tf_cookie_consent","accepted");
      setState("hidden");
    }, 300);
  };
  const decline = () => {
    localStorage.setItem("tf_cookie_consent","declined");
    setState("hidden");
  };

  if(state !== "show") return null;

  return (
    <div className="cookie-banner" style={{ opacity: saving ? 0 : 1, transition:"opacity .3s" }}>
      {/* Cookie icon */}
      <div style={{ fontSize:"28px", flexShrink:0 }}>🍪</div>

      <div style={{ flex:1, minWidth:"200px" }}>
        <div style={{ fontSize:"14px", fontWeight:"700", color:C.text, marginBottom:"4px" }}>
          We use cookies
        </div>
        <p style={{ fontSize:"12px", color:C.textMid, lineHeight:"1.6" }}>
          We use cookies to personalise content, analyse traffic, and improve your experience.
          Read our{" "}
          <a href="#" style={{ color:C.accent, textDecoration:"underline" }}>Cookie Policy</a>
          {" "}for more details.
        </p>
      </div>

      <div style={{ display:"flex", gap:"10px", flexShrink:0, flexWrap:"wrap" }}>
        <button onClick={decline} style={{
          padding:"9px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:"600",
          background:"transparent", border:`1px solid ${C.border}`, color:C.textMid,
          cursor:"pointer", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
          transition:"border-color .2s, color .2s",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderHover; e.currentTarget.style.color=C.text; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMid; }}
        >Decline</button>
        <button onClick={accept} className="btn-primary" style={{ padding:"9px 20px", fontSize:"13px" }}>
          Accept All
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const TradeFlowLanding = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = () => { if(email.includes("@")) setSubmitted(true); };

  const tickerAll = [...TICKER, ...TICKER];
  const NAV_ITEMS = [
    { label:"Platform",     id:"features"     },
    { label:"Copy Trading", id:"traders"       },
    { label:"Hire Trader",  id:"hire-trader"   },
    { label:"Forecast",     id:"forecast"      },
    { label:"Calendar",     id:"calendar"      },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 clamp(16px,4vw,40px)", height:"62px",
        background:"rgba(5,8,15,.88)", backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${C.border}`,
        position:"sticky", top:0, zIndex:300,
      }}>
        {/* Logo */}
        <SLink to="hero" style={{ fontSize:"20px", fontWeight:"800", letterSpacing:"-0.5px", fontFamily:"'Syne',sans-serif", color:C.text }}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </SLink>

        {/* Desktop links */}
        <div className="nav-links" style={{ display:"flex", gap:"28px" }}>
          {NAV_ITEMS.map(n => (
            <SLink key={n.id} to={n.id} className="nav-link">{n.label}</SLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="nav-cta-desktop" style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <div className="badge-live" style={{marginRight:"6px"}}>LIVE</div>
          <a href="/login"  style={{ fontSize:"13px", padding:"8px 16px", borderRadius:"8px", border:`1px solid ${C.border}`, color:C.textMid, fontWeight:"600" }}>Log in</a>
          <a href="/signup" className="btn-primary" style={{ padding:"9px 18px", fontSize:"13px", borderRadius:"8px" }}>Get Started →</a>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} style={{
          display:"none", flexDirection:"column", gap:"5px", background:"none",
          border:"none", cursor:"pointer", padding:"6px",
        }}>
          {[0,1,2].map(i=>(
            <span key={i} style={{
              display:"block", width:"22px", height:"2px", background:C.textMid, borderRadius:"2px",
              transform: menuOpen && i===0 ? "rotate(45deg) translate(5px,5px)" :
                         menuOpen && i===1 ? "scaleX(0)" :
                         menuOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
              transition:"transform .2s",
            }}/>
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{ position:"fixed", top:"62px", zIndex:299 }}>
          {NAV_ITEMS.map(n=>(
            <SLink key={n.id} to={n.id} className="nav-link" onClick={closeMenu}>{n.label}</SLink>
          ))}
          <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
            <a href="/login"  className="btn-secondary" style={{flex:1, justifyContent:"center", fontSize:"13px", padding:"10px"}}>Log in</a>
            <a href="/signup" className="btn-primary"   style={{flex:1, justifyContent:"center", fontSize:"13px", padding:"10px"}}>Get Started</a>
          </div>
        </div>
      )}

      {/* ══ TICKER ══ */}
      <div style={{ height:"30px", background:C.surface, borderBottom:`1px solid ${C.border}`, overflow:"hidden", display:"flex", alignItems:"center" }}>
        <div style={{ display:"inline-flex", animation:"tickerScroll 50s linear infinite", whiteSpace:"nowrap" }}>
          {tickerAll.map((t,i)=>(
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"0 22px", fontSize:"11px" }}>
              <span style={{ color:C.text,    fontFamily:"'DM Mono',monospace", fontWeight:"500" }}>{t.sym}</span>
              <span style={{ color:C.textMid, fontFamily:"'DM Mono',monospace" }}>{t.price}</span>
              <span style={{ color:t.up?C.green:C.red, fontFamily:"'DM Mono',monospace" }}>{t.chg}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section id="hero" className="hero-section" style={{
        position:"relative", minHeight:"calc(100vh - 92px)",
        display:"flex", alignItems:"center",
        overflow:"visible", padding:"80px clamp(16px,5vw,60px)",
      }}>
        <div className="grid-bg"/>
        <div className="glow-orb" style={{ width:"640px", height:"640px", background:C.accentGlow, top:"-240px", left:"50%", transform:"translateX(-50%)" }}/>
        <div className="glow-orb" style={{ width:"320px", height:"320px", background:"rgba(59,158,255,.12)", bottom:0, right:"8%" }}/>

        <div className="hero-grid" style={{
          position:"relative", zIndex:1,
          display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:"60px", maxWidth:"1200px", margin:"0 auto", width:"100%", alignItems:"center",
        }}>
          {/* Left */}
          <div>
            <div className="hero-badge" style={{marginBottom:"18px"}}>
              <div className="tag">★ AI-Powered Copy Trading — Now Live</div>
            </div>

            <h1 className="hero-title" style={{
              fontFamily:"'Syne',sans-serif",
              fontSize:"clamp(38px,5.5vw,68px)",
              fontWeight:"800", lineHeight:"1.05",
              letterSpacing:"-2px", marginBottom:"20px", color:C.text,
            }}>
              Trade Smarter.<br/>
              <span style={{ background:`linear-gradient(135deg,${C.accent} 0%,${C.blue} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Copy the Best.
              </span>
            </h1>

            <p className="hero-sub" style={{ fontSize:"clamp(14px,1.8vw,16px)", color:C.textMid, lineHeight:"1.78", marginBottom:"36px", maxWidth:"480px" }}>
              The professional platform for copy trading, portfolio analytics, and hiring elite traders.
              Join <strong style={{color:C.text}}>280,000+</strong> investors growing their wealth.
            </p>

            <div className="hero-cta hero-btns" style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"48px" }}>
              <a href="/signup" className="btn-primary">Start for Free <span style={{fontSize:"16px"}}>→</span></a>
              <a href="#how-it-works" className="btn-secondary" onClick={e=>{ e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({behavior:"smooth"}); }}>▶ Watch Demo</a>
            </div>

            {/* Stats */}
            <div className="hero-stats stats-grid" style={{
              display:"grid", gridTemplateColumns:"repeat(4,1fr)",
              border:`1px solid ${C.border}`, borderRadius:"12px", overflow:"hidden",
            }}>
              {[{val:"$4.2B",lbl:"Volume"},{val:"280K",lbl:"Traders"},{val:"2,400+",lbl:"Pros"},{val:"99.9%",lbl:"Uptime"}].map((s,i)=>(
                <div key={i} style={{
                  padding:"18px 12px", textAlign:"center",
                  borderRight: i<3 ? `1px solid ${C.border}` : "none",
                  background: i%2===0 ? "transparent" : `${C.surfaceAlt}80`,
                }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(17px,2vw,22px)", color:C.accent, fontWeight:"500", marginBottom:"4px" }}>{s.val}</div>
                  <div style={{ fontSize:"11px", color:C.textDim }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div className="hero-card" style={{ position:"relative" }}>
            <div style={{
              background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:"20px", padding:"clamp(18px,3vw,28px)", overflow:"hidden",
              boxShadow:`0 40px 80px rgba(0,0,0,.5), 0 0 0 1px ${C.border}`,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px", flexWrap:"wrap", gap:"10px" }}>
                <div>
                  <div style={{ fontSize:"12px", color:C.textDim, marginBottom:"4px" }}>Portfolio Value</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(20px,3vw,28px)", color:C.text }}>$48,291.04</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="badge-live" style={{marginBottom:"6px"}}>LIVE</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"13px", color:C.green }}>+$1,284.20 today</div>
                </div>
              </div>

              <div style={{ margin:"0 -4px 18px", borderRadius:"8px", overflow:"hidden" }}>
                <HeroChart/>
              </div>

              {/* Time tabs */}
              <div style={{ display:"flex", gap:"6px", marginBottom:"18px", flexWrap:"wrap" }}>
                {["1D","1W","1M","3M","1Y"].map((t,i)=>(
                  <button key={t} style={{
                    padding:"5px 10px", borderRadius:"6px", fontSize:"11px",
                    fontFamily:"'DM Mono',monospace", fontWeight:"500",
                    border:`1px solid ${i===2?C.accent+"60":C.border}`,
                    background:i===2?C.accentDim:"transparent",
                    color:i===2?C.accent:C.textDim, cursor:"pointer",
                  }}>{t}</button>
                ))}
              </div>

              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"16px" }}>
                <div style={{ fontSize:"11px", color:C.textDim, marginBottom:"12px", fontWeight:"500", letterSpacing:".06em" }}>COPYING FROM</div>
                {[
                  {name:"Alexei Voronov",alloc:"40%",pnl:"+$521.4"},
                  {name:"Priya Sharma",  alloc:"35%",pnl:"+$386.2"},
                  {name:"Marcus Webb",   alloc:"25%",pnl:"+$376.6"},
                ].map((t,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:i<2?"10px":"0" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:["#1A2A4A","#1A3A2A","#2A1A3A"][i], display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"700", color:C.text, flexShrink:0 }}>
                        {t.name.split(" ").map(w=>w[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize:"12px", fontWeight:"600", color:C.text }}>{t.name}</div>
                        <div style={{ fontSize:"10px", color:C.textDim }}>{t.alloc} allocated</div>
                      </div>
                    </div>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"13px", color:C.green }}>{t.pnl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position:"absolute", top:"-14px", right:"-14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,.4)" }}>
              <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"2px" }}>This Month</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"16px", color:C.green }}>+28.4% ROI</div>
            </div>
            <div style={{ position:"absolute", bottom:"-14px", left:"-14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,.4)" }}>
              <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"2px" }}>New Copiers (24h)</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"16px", color:C.text }}>+142 🔥</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ══ TOP TRADERS ══ */}
      <section id="traders" className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
        <Reveal>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"16px", marginBottom:"48px" }}>
            <div>
              <span className="section-label">Leaderboard</span>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px" }}>Top Performing Traders</h2>
            </div>
            <a href="/marketplace" className="btn-secondary" style={{ fontSize:"13px", padding:"10px 20px" }}>View All 2,400+ →</a>
          </div>

          <div className="traders-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
            {TRADERS.map((t,idx)=>(
              <div key={t.id} className="trader-card">
                {t.star && (
                  <div style={{ position:"absolute", top:"14px", right:"14px", background:C.goldDim, border:`1px solid ${C.gold}40`, borderRadius:"6px", padding:"3px 8px", fontSize:"10px", color:C.gold, fontWeight:"700" }}>★ #1 This Week</div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                  <div className="avatar" style={{ width:"42px", height:"42px", background:t.bg, fontSize:"14px", color:C.text }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:"700", color:C.text, fontFamily:"'Syne',sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize:"11px", color:C.textDim }}>{t.handle}</div>
                  </div>
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"16px" }}>
                  <div>
                    <div style={{ fontSize:"11px", color:C.textDim, marginBottom:"2px" }}>All-time ROI</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(20px,3vw,26px)", color:C.green }}>{t.roi}</div>
                  </div>
                  <Sparkline data={t.spark} up/>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"18px" }}>
                  {[{lbl:"Monthly",val:t.monthly,g:true},{lbl:"Win Rate",val:t.win},{lbl:"Max DD",val:t.dd,r:true}].map(m=>(
                    <div key={m.lbl} style={{ background:C.surfaceAlt, borderRadius:"8px", padding:"10px 8px", textAlign:"center" }}>
                      <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"4px" }}>{m.lbl}</div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"13px", color:m.g?C.green:m.r?C.red:C.text }}>{m.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
                  <div style={{ fontSize:"11px", color:C.textDim }}>{t.followers} followers</div>
                  <button className="copy-btn">Copy Trader</button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:"56px" }}>
              <span className="section-label">Platform</span>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px", marginBottom:"14px" }}>Everything You Need to Win</h2>
              <p style={{ fontSize:"15px", color:C.textMid, maxWidth:"480px", margin:"0 auto", lineHeight:"1.72" }}>Professional-grade tools built for investors who take their portfolio seriously.</p>
            </div>
            <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
              {FEATURES.map((f,i)=>(
                <Reveal key={i} delay={i*80}>
                  <div className="feature-card" style={{ height:"100%" }}>
                    <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:C.accentDim, border:`1px solid ${C.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", color:C.accent, marginBottom:"18px" }}>{f.icon}</div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"17px", fontWeight:"700", color:C.text, marginBottom:"10px" }}>{f.title}</h3>
                    <p style={{ fontSize:"13px", color:C.textMid, lineHeight:"1.72" }}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:"56px" }}>
            <span className="section-label">How It Works</span>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px" }}>Start in 3 Simple Steps</h2>
          </div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"32px", position:"relative" }}>
            <div className="steps-line" style={{ position:"absolute", top:"32px", left:"calc(16.7% + 20px)", right:"calc(16.7% + 20px)", height:"1px", background:`linear-gradient(90deg,${C.accent}40,${C.blue}40)` }}/>
            {[
              { num:"01", title:"Create Account",  desc:"Sign up in 60 seconds. No credit card required. Full access to the platform immediately." },
              { num:"02", title:"Pick Traders",    desc:"Browse verified traders by ROI, risk profile, and strategy. Filter by asset class or style." },
              { num:"03", title:"Copy & Grow",     desc:"Allocate capital and our engine mirrors trades in real time. Monitor, adjust, or stop anytime." },
            ].map((s,i)=>(
              <Reveal key={i} delay={i*120} style={{ textAlign:"center" }}>
                <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:C.accentDim, border:`1px solid ${C.accent}50`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono',monospace", fontSize:"14px", color:C.accent, margin:"0 auto 20px" }}>{s.num}</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:"700", color:C.text, marginBottom:"10px" }}>{s.title}</h3>
                <p style={{ fontSize:"13px", color:C.textMid, lineHeight:"1.76" }}>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonials" style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:"48px" }}>
              <span className="section-label">Testimonials</span>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px" }}>Loved by Investors Worldwide</h2>
            </div>
            <div className="testi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
              {TESTIMONIALS.map((t,i)=>(
                <Reveal key={i} delay={i*100}>
                  <div className="testimonial-card" style={{ height:"100%" }}>
                    <div style={{ fontSize:"28px", color:C.accent, marginBottom:"14px", lineHeight:1, fontFamily:"'Syne',sans-serif" }}>"</div>
                    <p style={{ fontSize:"14px", color:C.textMid, lineHeight:"1.76", marginBottom:"20px" }}>{t.quote}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <div className="avatar" style={{ width:"36px", height:"36px", background:t.bg, fontSize:"12px", color:C.text }}>{t.initials}</div>
                      <div>
                        <div style={{ fontSize:"13px", fontWeight:"600", color:C.text }}>{t.author}</div>
                        <div style={{ fontSize:"11px", color:C.textDim }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HIRE TRADER ══ */}
      <section id="hire-trader" className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:"56px" }}>
            <span className="section-label">Hire Trader</span>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px" }}>Work With Elite Traders</h2>
            <p style={{ fontSize:"15px", color:C.textMid, maxWidth:"520px", margin:"14px auto 0", lineHeight:"1.72" }}>Hire a verified professional to manage your portfolio or execute a custom strategy on your behalf.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }} className="traders-grid">
            {[
              { initials:"LR", bg:"#1A2A4A", name:"Lena Richter", role:"Macro Strategist", rate:"$1,200/mo", assets:"Forex · Commodities", rating:"4.98", trades:"3.2K", roi:"+289%" },
              { initials:"JO", bg:"#1A3A2A", name:"James Okafor", role:"Crypto Quant",    rate:"$950/mo",  assets:"BTC · ETH · Alts",   rating:"4.95", trades:"5.1K", roi:"+412%" },
              { initials:"NP", bg:"#2A1A3A", name:"Nadia Park",   role:"Equity Analyst",  rate:"$800/mo",  assets:"Stocks · ETFs",       rating:"4.97", trades:"2.8K", roi:"+197%" },
            ].map((t,i)=>(
              <Reveal key={i} delay={i*100}>
                <div className="trader-card" style={{ height:"100%" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                    <div className="avatar" style={{ width:"46px", height:"46px", background:t.bg, fontSize:"15px", color:C.text }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize:"15px", fontWeight:"700", color:C.text, fontFamily:"'Syne',sans-serif" }}>{t.name}</div>
                      <div style={{ fontSize:"11px", color:C.accent }}>{t.role}</div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"18px" }}>
                    {[{lbl:"All-time ROI",val:t.roi,g:true},{lbl:"Trades",val:t.trades},{lbl:"Rating",val:`⭐ ${t.rating}`},{lbl:"Rate",val:t.rate}].map(m=>(
                      <div key={m.lbl} style={{ background:C.surfaceAlt, borderRadius:"8px", padding:"10px 8px" }}>
                        <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"4px" }}>{m.lbl}</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"13px", color:m.g?C.green:C.text }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:"11px", color:C.textDim, marginBottom:"16px" }}>Assets: {t.assets}</div>
                  <button className="btn-primary" style={{ width:"100%", justifyContent:"center", fontSize:"13px", padding:"10px" }}>Hire Now →</button>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="divider"/>

      {/* ══ FORECAST ══ */}
      <section id="forecast" style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:"56px" }}>
              <span className="section-label">Forecast</span>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px" }}>AI-Powered Market Forecasts</h2>
              <p style={{ fontSize:"15px", color:C.textMid, maxWidth:"520px", margin:"14px auto 0", lineHeight:"1.72" }}>Get predictive signals on major assets powered by our ensemble ML models and sentiment analysis.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }} className="traders-grid">
              {[
                { sym:"BTC/USD", horizon:"7 Day",  signal:"Bullish",  confidence:"84%", target:"$74,200",  current:"$67,420", change:"+10.1%", col:C.green },
                { sym:"ETH/USD", horizon:"7 Day",  signal:"Neutral",  confidence:"61%", target:"$3,950",   current:"$3,841",  change:"+2.8%",  col:C.gold },
                { sym:"SOL/USD", horizon:"14 Day", signal:"Bullish",  confidence:"78%", target:"$220",     current:"$178",    change:"+23.6%", col:C.green },
                { sym:"BNB/USD", horizon:"7 Day",  signal:"Bearish",  confidence:"72%", target:"$548",     current:"$592",    change:"-7.4%",  col:C.red },
                { sym:"XRP/USD", horizon:"14 Day", signal:"Bullish",  confidence:"69%", target:"$0.80",    current:"$0.63",   change:"+27%",   col:C.green },
                { sym:"ADA/USD", horizon:"7 Day",  signal:"Bearish",  confidence:"65%", target:"$0.39",    current:"$0.44",   change:"-11.4%", col:C.red },
              ].map((f,i)=>(
                <Reveal key={i} delay={i*70}>
                  <div className="feature-card" style={{ height:"100%" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"16px", fontWeight:"700", color:C.text }}>{f.sym}</div>
                        <div style={{ fontSize:"11px", color:C.textDim }}>{f.horizon} Outlook</div>
                      </div>
                      <div style={{ background:`${f.col}18`, border:`1px solid ${f.col}40`, borderRadius:"8px", padding:"4px 10px", fontSize:"11px", color:f.col, fontWeight:"700" }}>{f.signal}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
                      <div style={{ background:C.surfaceAlt, borderRadius:"8px", padding:"10px 8px" }}>
                        <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"4px" }}>Current</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"13px", color:C.text }}>{f.current}</div>
                      </div>
                      <div style={{ background:C.surfaceAlt, borderRadius:"8px", padding:"10px 8px" }}>
                        <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"4px" }}>Target</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"13px", color:f.col }}>{f.target}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontSize:"11px", color:C.textDim }}>Confidence</div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <div style={{ width:"80px", height:"4px", borderRadius:"2px", background:C.border, overflow:"hidden" }}>
                          <div style={{ width:f.confidence, height:"100%", background:f.col, borderRadius:"2px" }}/>
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"12px", color:f.col }}>{f.confidence}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CALENDAR ══ */}
      <section id="calendar" className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)", maxWidth:"1240px", margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:"56px" }}>
            <span className="section-label">Calendar</span>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"800", letterSpacing:"-1.5px" }}>Economic & Earnings Calendar</h2>
            <p style={{ fontSize:"15px", color:C.textMid, maxWidth:"520px", margin:"14px auto 0", lineHeight:"1.72" }}>Never miss a market-moving event. Track economic releases, earnings, and central bank decisions.</p>
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:"20px", overflow:"hidden" }}>
            {/* Calendar header */}
            <div style={{ padding:"20px 28px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:"700", fontSize:"16px", color:C.text }}>June 2025</div>
              <div style={{ display:"flex", gap:"8px" }}>
                {["All","High Impact","Earnings","Central Banks"].map((f,i)=>(
                  <button key={f} style={{ padding:"6px 14px", borderRadius:"8px", fontSize:"11px", fontWeight:"600", border:`1px solid ${i===1?C.accent+"60":C.border}`, background:i===1?C.accentDim:"transparent", color:i===1?C.accent:C.textDim, cursor:"pointer" }}>{f}</button>
                ))}
              </div>
            </div>
            {/* Events list */}
            <div style={{ overflowX:"auto" }}>
            {[
              { date:"Mon Jun 2",  time:"14:30",  event:"US Non-Farm Payrolls",    impact:"high",   asset:"USD",  forecast:"185K",  prev:"177K" },
              { date:"Tue Jun 3",  time:"10:00",  event:"ISM Services PMI",        impact:"medium", asset:"USD",  forecast:"51.2",  prev:"49.8" },
              { date:"Wed Jun 4",  time:"18:00",  event:"Fed FOMC Minutes",        impact:"high",   asset:"USD",  forecast:"—",     prev:"—" },
              { date:"Thu Jun 5",  time:"12:45",  event:"ECB Rate Decision",       impact:"high",   asset:"EUR",  forecast:"3.25%", prev:"3.50%" },
              { date:"Thu Jun 5",  time:"After",  event:"NVIDIA Earnings (NVDA)",  impact:"high",   asset:"NVDA", forecast:"$0.93", prev:"$0.61" },
              { date:"Fri Jun 6",  time:"08:30",  event:"US CPI (MoM)",            impact:"high",   asset:"USD",  forecast:"0.2%",  prev:"0.3%" },
            ].map((ev,i)=>(
              <div key={i} style={{ display:"grid", gridTemplateColumns:"140px 80px 1fr 100px 90px 90px", alignItems:"center", padding:"16px 28px", borderBottom:i<5?`1px solid ${C.border}`:"none", gap:"12px" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.surfaceAlt; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}
              >
                <div style={{ fontSize:"12px", color:C.textMid, fontFamily:"'DM Mono',monospace" }}>{ev.date}</div>
                <div style={{ fontSize:"12px", color:C.textDim, fontFamily:"'DM Mono',monospace" }}>{ev.time}</div>
                <div style={{ fontSize:"13px", fontWeight:"600", color:C.text }}>{ev.event}</div>
                <div>
                  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"6px", fontSize:"10px", fontWeight:"700",
                    background: ev.impact==="high" ? "rgba(255,77,106,.12)" : "rgba(59,158,255,.12)",
                    color: ev.impact==="high" ? C.red : C.blue,
                    border:`1px solid ${ev.impact==="high"?"rgba(255,77,106,.3)":"rgba(59,158,255,.3)"}`,
                  }}>{ev.impact==="high"?"● HIGH":"● MED"}</span>
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"12px", color:C.accent }}>{ev.asset}</div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"10px", color:C.textDim, marginBottom:"2px" }}>F: {ev.forecast}</div>
                  <div style={{ fontSize:"10px", color:C.textDim }}>P: {ev.prev}</div>
                </div>
              </div>
            ))}
            </div>
            <div style={{ padding:"16px 28px", borderTop:`1px solid ${C.border}`, textAlign:"center" }}>
              <a href="#" style={{ fontSize:"13px", color:C.accent, fontWeight:"600" }}>View Full Calendar →</a>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="divider"/>

      {/* ══ CTA ══ */}
      <section id="cta" className="section-pad" style={{ padding:"96px clamp(16px,5vw,60px)" }}>
        <Reveal>
          <div style={{
            maxWidth:"700px", margin:"0 auto", textAlign:"center",
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:"24px", padding:"clamp(36px,6vw,64px) clamp(24px,5vw,52px)",
            position:"relative", overflow:"hidden",
          }}>
            <div className="glow-orb" style={{ width:"400px", height:"400px", background:C.accentGlow, top:"-200px", left:"50%", transform:"translateX(-50%)", opacity:.5 }}/>
            <div style={{ position:"relative", zIndex:1 }}>
              <span className="section-label" style={{marginBottom:"14px"}}>Get Early Access</span>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:"800", letterSpacing:"-1.5px", color:C.text, marginBottom:"16px" }}>
                Start Growing Your<br/>Wealth Today
              </h2>
              <p style={{ fontSize:"clamp(13px,1.8vw,15px)", color:C.textMid, lineHeight:"1.72", marginBottom:"34px" }}>
                Join 280,000+ investors on TradeFlow. No minimum balance. Cancel anytime.
              </p>

              {submitted ? (
                <div style={{ background:C.accentDim, border:`1px solid ${C.accent}40`, borderRadius:"12px", padding:"16px 24px", fontFamily:"'DM Mono',monospace", color:C.accent, fontSize:"14px" }}>
                  ✓ You're on the list — we'll be in touch soon!
                </div>
              ) : (
                <div className="cta-email-row" style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
                  <input
                    className="tf-input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                    style={{ maxWidth:"280px" }}
                  />
                  <button className="btn-primary" onClick={handleSubmit} style={{whiteSpace:"nowrap"}}>
                    Get Started Free
                  </button>
                </div>
              )}
              <p style={{ fontSize:"11px", color:C.textDim, marginTop:"14px" }}>No credit card required · Free forever plan available</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"52px clamp(16px,5vw,40px) 32px" }}>
        <div style={{ maxWidth:"1240px", margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"40px", marginBottom:"48px" }}>
            <div>
              <a href="/" style={{ fontFamily:"'Syne',sans-serif", fontSize:"20px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px" }}>
                Trade<span style={{color:C.accent}}>Flow</span>
              </a>
              <p style={{ fontSize:"13px", color:C.textDim, lineHeight:"1.72", marginTop:"14px", maxWidth:"240px" }}>
                The professional copy trading platform for modern investors.
              </p>
              <div style={{ display:"flex", gap:"12px", marginTop:"20px" }}>
                {["𝕏","in","Discord"].map(s=>(
                  <a key={s} href="#" style={{ width:"34px", height:"34px", borderRadius:"8px", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:C.textDim, transition:"border-color .2s, color .2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.textMid;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textDim;}}
                  >{s}</a>
                ))}
              </div>
            </div>
            {[
              { title:"Product", links:["Platform","Copy Trading","Marketplace","Pricing","API"] },
              { title:"Company", links:["About","Blog","Careers","Press","Contact"] },
              { title:"Legal",   links:["Privacy","Terms","Cookie Policy","Disclosures"] },
            ].map(col=>(
              <div key={col.title}>
                <div style={{ fontSize:"11px", fontWeight:"600", color:C.textMid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"16px" }}>{col.title}</div>
                {col.links.map(l=>(
                  <a key={l} href="#" className="footer-link" style={{ display:"block", marginBottom:"10px" }}>{l}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="divider" style={{marginBottom:"24px"}}/>

          <div className="footer-bottom" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
            <p style={{ fontSize:"12px", color:C.textDim }}>© 2025 TradeFlow Inc. All rights reserved. Trading involves risk.</p>
            <div style={{ display:"flex", gap:"20px" }}>
              {["Privacy","Terms","Cookies"].map(l=>(
                <a key={l} href="#" className="footer-link" style={{fontSize:"12px"}}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ══ COOKIE BANNER ══ */}
      <CookieBanner/>
    </>
  );
};

export default TradeFlowLanding;