import React, { useState, useEffect, useRef } from 'react';
import supabase from "../supabase";

const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── Default user_settings (mirrors DB defaults) ──────────────────── */
const DEFAULT_SETTINGS = {
  theme:                 'dark',
  accent_color:          '#c8f560',
  layout_density:        'comfortable',
  chart_type:            'candle',
  show_volume:           true,
  show_extended_hours:   false,
  show_grid_lines:       true,
  profile_public:        true,
  show_watchlist:        false,
  show_activity:         true,
  show_followed_traders: false,
  appear_in_search:      true,
  usage_analytics:       true,
  personalised_feed:     true,
  marketing_emails:      false,
};

function resolveTheme(theme) {
  if (theme === 'system')
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return theme;
}

function buildThemeVars(settings) {
  const s      = { ...DEFAULT_SETTINGS, ...settings };
  const theme  = resolveTheme(s.theme);
  const accent = s.accent_color;

  const hex2rgb = h => {
    const c = h.replace('#', '');
    return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
  };
  const [ar, ag, ab] = hex2rgb(accent);

  const densityMap = {
    compact:     { sbW:'220px', mainPad:'16px 20px 32px', gap:'16px' },
    comfortable: { sbW:'256px', mainPad:'24px 28px 40px', gap:'24px' },
    spacious:    { sbW:'280px', mainPad:'32px 36px 56px', gap:'32px' },
  };
  const d = densityMap[s.layout_density] || densityMap.comfortable;

  const dark = {
    '--bg':'#080b10','--surface':'#0e1219','--surface2':'#141922',
    '--border':'#1e2535','--border2':'#2a3347',
    '--text':'#e2e8f0','--muted':'#64748b','--faint':'#374151','--input-bg':'#141922',
  };
  const light = {
    '--bg':'#f0f4f8','--surface':'#ffffff','--surface2':'#f8fafc',
    '--border':'#e2e8f0','--border2':'#cbd5e1',
    '--text':'#0f172a','--muted':'#64748b','--faint':'#94a3b8','--input-bg':'#f1f5f9',
  };

  return {
    ...(theme === 'light' ? light : dark),
    '--accent':      accent,
    '--accent-dim':  `rgba(${ar},${ag},${ab},.12)`,
    '--accent-glow': `rgba(${ar},${ag},${ab},.06)`,
    '--accent-rgb':  `${ar},${ag},${ab}`,
    '--green':'#34d399','--green-dim':'rgba(52,211,153,.12)',
    '--red':'#f87171','--red-dim':'rgba(248,113,113,.12)',
    '--blue':'#60a5fa','--blue-dim':'rgba(96,165,250,.12)',
    '--purple':'#a78bfa','--purple-dim':'rgba(167,139,250,.12)',
    '--amber':'#f59e0b','--amber-dim':'rgba(245,158,11,.12)',
    '--sidebar-w':  d.sbW,
    '--topbar-h':   '60px',
    '--density-pad': d.mainPad,
    '--layout-gap':  d.gap,
    '--sans':"'Space Grotesk',sans-serif",
    '--serif':"'Instrument Serif',serif",
    '--mono':"'JetBrains Mono',monospace",
    '--r-sm':'8px','--r-md':'12px','--r-lg':'16px',
  };
}

function applyThemeVars(vars) {
  Object.entries(vars).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 14px; }

  :root {
    /* Injected dynamically by applyThemeVars() from user_settings */
    --bg:#080b10; --surface:#0e1219; --surface2:#141922;
    --border:#1e2535; --border2:#2a3347;
    --text:#e2e8f0; --muted:#64748b; --faint:#374151;
    --accent:#c8f560; --accent-dim:rgba(200,245,96,.12); --accent-glow:rgba(200,245,96,.06);
    --accent-rgb:200,245,96;
    --green:#34d399; --green-dim:rgba(52,211,153,.12);
    --red:#f87171; --red-dim:rgba(248,113,113,.12);
    --blue:#60a5fa; --blue-dim:rgba(96,165,250,.12);
    --purple:#a78bfa; --purple-dim:rgba(167,139,250,.12);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,.12);
    --sidebar-w:256px; --topbar-h:60px;
    --density-pad:24px 28px 40px;
    --layout-gap:24px;
    --sans:'Space Grotesk',sans-serif;
    --serif:'Instrument Serif',serif;
    --mono:'JetBrains Mono',monospace;
    --r-sm:8px; --r-md:12px; --r-lg:16px;
  }

  body, #root {
    font-family:var(--sans); background:var(--bg); color:var(--text);
    height:100vh; overflow:hidden; -webkit-font-smoothing:antialiased;
  }
  a { color:inherit; text-decoration:none; }
  button { font-family:var(--sans); cursor:pointer; border:none; background:none; }
  input, select, textarea { font-family:var(--sans); }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  /* Shell */
  .in-shell { display:grid; grid-template-columns:var(--sidebar-w) 1fr; height:100vh; overflow:hidden; }

  /* Sidebar */
  .in-sidebar {
    background:var(--surface); border-right:1px solid var(--border);
    display:flex; flex-direction:column; height:100vh;
    overflow-y:auto; overflow-x:hidden; position:relative; z-index:100;
    flex-shrink:0; transition:transform .25s cubic-bezier(.4,0,.2,1);
  }
  .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
  .in-sidebar::after {
    content:''; position:absolute; top:0; right:0; width:1px; height:100%;
    background:linear-gradient(180deg,transparent 0%,var(--accent) 30%,var(--border) 60%,transparent 100%);
    opacity:.15; pointer-events:none;
  }
  .in-brand { display:flex; align-items:center; gap:10px; padding:20px 20px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .in-brand-icon { width:34px; height:34px; background:var(--accent); border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .in-brand-icon i { font-size:18px; color:#000; }
  .in-brand-name { font-size:16px; font-weight:700; }
  .in-brand-name em { color:var(--accent); font-style:normal; }
  .in-sb-pill { margin:12px 16px; background:var(--accent-dim); border:1px solid rgba(var(--accent-rgb),.18); border-radius:var(--r-md); padding:10px 14px; flex-shrink:0; }
  .in-sb-pill-label { font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
  .in-live-dot { width:6px; height:6px; background:var(--green); border-radius:50%; animation:in-pulse 2s infinite; flex-shrink:0; }
  @keyframes in-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .in-sb-pill-val { font-family:var(--mono); font-size:19px; font-weight:600; color:var(--accent); letter-spacing:-.5px; }
  .in-sb-pill-sub { font-size:11px; color:var(--green); margin-top:3px; }
  .in-sb-scroll { flex:1; overflow-y:auto; padding:8px 0; }
  .in-sb-section { padding:10px 20px 4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); }
  .in-sb-link {
    display:flex; align-items:center; gap:11px; padding:9px 20px;
    font-size:13px; font-weight:500; color:var(--muted);
    border-left:2px solid transparent; transition:all .15s; cursor:pointer;
  }
  .in-sb-link i { font-size:18px; flex-shrink:0; }
  .in-sb-link:hover { color:var(--text); background:var(--accent-glow); border-left-color:var(--border2); }
  .in-sb-link.active { color:var(--accent); background:var(--accent-dim); border-left-color:var(--accent); }
  .in-sb-badge { margin-left:auto; font-size:9px; font-weight:700; background:var(--accent); color:#000; padding:2px 6px; border-radius:5px; }
  .in-sb-user { flex-shrink:0; border-top:1px solid var(--border); padding:14px 16px; display:flex; align-items:center; gap:10px; }
  .in-sb-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    box-shadow:0 0 12px rgba(var(--accent-rgb),.3);
  }
  .in-sb-user-name { font-size:13px; font-weight:700; }
  .in-sb-user-role { font-size:10px; color:var(--accent); margin-top:1px; }

  /* Right panel */
  .in-right { grid-column:2; display:flex; flex-direction:column; height:100vh; overflow:hidden; }

  /* Topbar */
  .in-topbar {
    height:var(--topbar-h); flex-shrink:0; display:flex; align-items:center;
    padding:0 28px; background:var(--surface); border-bottom:1px solid var(--border); gap:16px; z-index:50;
  }
  .in-topbar-title { font-family:var(--serif); font-size:20px; color:var(--text); flex:1; }
  .in-topbar-title span { color:var(--accent); font-style:italic; }
  .in-tb-icon {
    width:36px; height:36px; border-radius:var(--r-sm); background:var(--surface2);
    border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .15s; color:var(--muted); font-size:18px; position:relative;
  }
  .in-tb-icon:hover { border-color:var(--border2); color:var(--text); }
  .in-notif-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; background:var(--red); border-radius:50%; border:1.5px solid var(--surface); }
  .in-tb-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center; cursor:pointer;
    box-shadow:0 0 10px rgba(var(--accent-rgb),.25);
  }
  .in-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; }
  .in-hamburger span { display:block; width:20px; height:2px; background:var(--text); border-radius:2px; }

  /* Main */
  .in-main { flex:1; overflow-y:auto; overflow-x:hidden; padding:var(--density-pad); }

  /* Shared buttons */
  .in-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    border-radius:var(--r-sm); font-family:var(--sans); font-weight:600;
    cursor:pointer; transition:all .15s; border:none; white-space:nowrap;
  }
  .in-btn-sm  { font-size:12px; padding:7px 14px; }
  .in-btn-md  { font-size:13px; padding:9px 18px; }
  .in-btn-lg  { font-size:14px; padding:11px 22px; }
  .in-btn-accent { background:var(--accent); color:#000; }
  .in-btn-accent:hover { opacity:.88; box-shadow:0 0 20px rgba(var(--accent-rgb),.3); }
  .in-btn-ghost { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .in-btn-ghost:hover { border-color:var(--border2); }

  /* Badge */
  .in-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap; }
  .in-badge-green  { background:var(--green-dim);  color:var(--green); }
  .in-badge-blue   { background:var(--blue-dim);   color:var(--blue); }
  .in-badge-amber  { background:var(--amber-dim);  color:var(--amber); }
  .in-badge-red    { background:var(--red-dim);    color:var(--red); }
  .in-badge-muted  { background:rgba(100,116,139,.12); color:var(--muted); }

  /* ── SUPPORT PAGE ── */

  /* Hero */
  .sp-hero {
    position:relative; border-radius:var(--r-lg); overflow:hidden;
    background:linear-gradient(135deg,#0d1520 0%,#0b1628 50%,#0d1018 100%);
    border:1px solid var(--border); padding:40px 36px; margin-bottom:28px;
  }
  .sp-hero-grid {
    position:absolute; inset:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(var(--accent-rgb),.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(var(--accent-rgb),.04) 1px,transparent 1px);
    background-size:40px 40px;
  }
  .sp-hero-glow {
    position:absolute; top:-100px; right:-80px; width:400px; height:400px;
    border-radius:50%;
    background:radial-gradient(ellipse,rgba(var(--accent-rgb),.06) 0%,transparent 65%);
    pointer-events:none;
  }
  .sp-hero-content { position:relative; z-index:2; max-width:560px; }
  .sp-hero-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--accent); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .sp-hero-label::before { content:''; display:block; width:20px; height:1px; background:var(--accent); }
  .sp-hero-title { font-family:var(--serif); font-size:32px; line-height:1.2; margin-bottom:10px; }
  .sp-hero-title em { color:var(--accent); font-style:italic; }
  .sp-hero-sub { font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:24px; }
  .sp-search-wrap { display:flex; gap:10px; max-width:480px; }
  .sp-search-input {
    flex:1; background:rgba(255,255,255,.05); border:1px solid var(--border2);
    color:var(--text); border-radius:var(--r-sm); padding:10px 14px 10px 40px;
    font-size:13px; outline:none; transition:border-color .15s;
    font-family:var(--sans);
  }
  .sp-search-input::placeholder { color:var(--muted); }
  .sp-search-input:focus { border-color:var(--accent); background:rgba(var(--accent-rgb),.04); }
  .sp-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:16px; color:var(--muted); pointer-events:none; }
  .sp-search-rel { position:relative; flex:1; }

  /* Status bar */
  .sp-status-bar {
    display:flex; align-items:center; gap:10px;
    background:var(--green-dim); border:1px solid rgba(52,211,153,.2);
    border-radius:var(--r-sm); padding:10px 16px;
    font-size:12px; font-weight:600; color:var(--green); margin-bottom:28px;
  }
  .sp-status-dot { width:8px; height:8px; border-radius:50%; background:var(--green); flex-shrink:0; animation:in-pulse 2s infinite; }
  .sp-status-bar span { color:var(--muted); font-weight:400; margin-left:4px; }

  /* Quick-action cards */
  .sp-quick-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:var(--layout-gap); margin-bottom:28px; }
  .sp-quick-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--r-lg); padding:20px; cursor:pointer;
    transition:all .2s; position:relative; overflow:hidden;
  }
  .sp-quick-card:hover { border-color:var(--border2); transform:translateY(-2px); }
  .sp-quick-card.featured { border-color:rgba(var(--accent-rgb),.25); background:linear-gradient(135deg,rgba(var(--accent-rgb),.07) 0%,rgba(var(--accent-rgb),.02) 100%); }
  .sp-quick-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:.2;
  }
  .sp-quick-card.featured::before { opacity:.5; }
  .sp-quick-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:14px; }
  .sp-quick-title { font-size:14px; font-weight:700; margin-bottom:5px; }
  .sp-quick-desc { font-size:12px; color:var(--muted); line-height:1.5; }
  .sp-quick-arrow { position:absolute; bottom:16px; right:16px; font-size:18px; color:var(--muted); transition:all .2s; }
  .sp-quick-card:hover .sp-quick-arrow { color:var(--accent); transform:translate(2px,-2px); }

  /* Two-col layout */
  .sp-layout { display:grid; grid-template-columns:1fr 340px; gap:var(--layout-gap); align-items:start; }
  .sp-left  { display:flex; flex-direction:column; gap:var(--layout-gap); }
  .sp-right { display:flex; flex-direction:column; gap:var(--layout-gap); }

  /* Section card */
  .sp-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; }
  .sp-card-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
  .sp-card-title { font-size:13px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .sp-card-title i { font-size:16px; color:var(--accent); }
  .sp-card-body { padding:0; }

  /* FAQ accordion */
  .sp-faq-item { border-bottom:1px solid var(--border); }
  .sp-faq-item:last-child { border-bottom:none; }
  .sp-faq-q {
    width:100%; text-align:left; padding:16px 20px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    font-size:13px; font-weight:600; color:var(--text);
    cursor:pointer; transition:background .15s; background:none; border:none;
    font-family:var(--sans);
  }
  .sp-faq-q:hover { background:var(--accent-glow); }
  .sp-faq-q.open { color:var(--accent); }
  .sp-faq-chevron { font-size:16px; color:var(--muted); transition:transform .2s; flex-shrink:0; }
  .sp-faq-q.open .sp-faq-chevron { transform:rotate(180deg); color:var(--accent); }
  .sp-faq-a { padding:0 20px 16px; font-size:13px; color:var(--muted); line-height:1.7; }

  /* Ticket list */
  .sp-ticket {
    display:flex; align-items:flex-start; gap:14px;
    padding:16px 20px; border-bottom:1px solid var(--border); transition:background .15s; cursor:pointer;
  }
  .sp-ticket:last-child { border-bottom:none; }
  .sp-ticket:hover { background:var(--accent-glow); }
  .sp-ticket-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; margin-top:1px; }
  .sp-ticket-title { font-size:13px; font-weight:600; margin-bottom:4px; }
  .sp-ticket-meta { font-size:11px; color:var(--muted); display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .sp-ticket-id { font-family:var(--mono); font-size:10px; color:var(--muted); }

  /* New ticket form */
  .sp-field { display:flex; flex-direction:column; gap:6px; }
  .sp-field-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); }
  .sp-input {
    background:var(--input-bg, var(--surface2)); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:9px 12px; font-size:13px; outline:none;
    transition:border-color .15s; width:100%; font-family:var(--sans);
  }
  .sp-input:focus { border-color:var(--accent); }
  .sp-textarea { resize:vertical; min-height:100px; }
  .sp-select {
    background:var(--input-bg, var(--surface2)); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:9px 12px; font-size:13px; outline:none;
    transition:border-color .15s; width:100%; cursor:pointer; font-family:var(--sans);
  }

  /* Resource links */
  .sp-resource {
    display:flex; align-items:center; gap:12px;
    padding:14px 20px; border-bottom:1px solid var(--border);
    cursor:pointer; transition:background .15s;
  }
  .sp-resource:last-child { border-bottom:none; }
  .sp-resource:hover { background:var(--accent-glow); }
  .sp-resource-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
  .sp-resource-title { font-size:13px; font-weight:600; margin-bottom:2px; }
  .sp-resource-sub { font-size:11px; color:var(--muted); }

  /* Contact channels */
  .sp-contact {
    display:flex; align-items:center; gap:12px;
    padding:14px 20px; border-bottom:1px solid var(--border); cursor:pointer; transition:background .15s;
  }
  .sp-contact:last-child { border-bottom:none; }
  .sp-contact:hover { background:var(--accent-glow); }
  .sp-contact-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .sp-contact-label { font-size:13px; font-weight:700; margin-bottom:2px; }
  .sp-contact-sub { font-size:11px; color:var(--muted); }
  .sp-contact-badge { margin-left:auto; }

  /* Tabs */
  .sp-tabs { display:flex; gap:4px; padding:14px 20px 0; border-bottom:1px solid var(--border); }
  .sp-tab {
    display:flex; align-items:center; gap:6px;
    padding:8px 14px; font-size:12px; font-weight:600;
    border-radius:var(--r-sm) var(--r-sm) 0 0;
    color:var(--muted); cursor:pointer; transition:all .15s;
    border:none; background:none; font-family:var(--sans);
    border-bottom:2px solid transparent; margin-bottom:-1px;
  }
  .sp-tab i { font-size:14px; }
  .sp-tab:hover { color:var(--text); }
  .sp-tab.active { color:var(--accent); border-bottom-color:var(--accent); }

  /* Responsive */
  @media (max-width:1060px) {
    .sp-layout { grid-template-columns:1fr; }
    .sp-quick-grid { grid-template-columns:1fr 1fr; }
  }
  @media (max-width:768px) {
    .in-shell { grid-template-columns:1fr !important; }
    .in-sidebar { position:fixed !important; top:0 !important; left:0 !important; transform:translateX(-100%) !important; z-index:300 !important; }
    .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column:1; }
    .in-hamburger { display:flex; }
    .sp-quick-grid { grid-template-columns:1fr; }
    .sp-hero { padding:28px 20px; }
  }
  @media (max-width:600px) {
    .in-main { padding:16px; }
    .in-topbar { padding:0 16px; }
  }
`;

/* ─── Data ─────────────────────────────────────────── */
const FAQS = [
  {
    cat: 'Account',
    items: [
      { q: 'How do I change my email address?', a: 'Go to Settings → Profile → Email Address. Enter your new email and click Update. A verification link will be sent to the new address. Note: you will be signed out of all sessions after the change.' },
      { q: 'How do I reset my password?', a: 'On the login screen, click "Forgot password" and enter your email. You will receive a reset link within a few minutes. Links expire after 30 minutes for security.' },
      { q: 'Can I have multiple accounts?', a: 'Each user is permitted one account. If you need a business account, contact support and we can arrange an upgrade to a Team plan.' },
    ],
  },
  {
    cat: 'Subscription & Billing',
    items: [
      { q: 'How do I upgrade my plan?', a: 'Go to Settings → Subscription and click "Upgrade to Elite". You will be charged a prorated amount for the remainder of the billing cycle.' },
      { q: 'What payment methods are accepted?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Crypto payments are available for annual plans only.' },
      { q: 'How do I cancel my subscription?', a: 'Go to Settings → Subscription → Danger Zone and click Cancel. Your access will continue until the end of the current billing period. You will not be charged again.' },
    ],
  },
  {
    cat: 'Features & Usage',
    items: [
      { q: 'How do price alerts work?', a: 'Navigate to any asset on your watchlist, click the bell icon and set your target price. You will receive notifications via your chosen delivery channels (Email, Push, Telegram) when the price is reached.' },
      { q: 'What is Copy Trading and how do I start?', a: 'Copy Trading lets you automatically mirror the trades of experienced traders. Go to the Copy Trading section, browse traders, review their stats and click "Copy". You can set an allocation amount and stop at any time.' },
      { q: 'How is my portfolio value calculated?', a: 'Your portfolio value reflects the current market value of all open positions, plus your available cash balance. It updates in real-time during market hours and uses last-close prices outside of hours.' },
    ],
  },
];

// TICKETS now fetched from Supabase — see TicketsSection

/* ── Ticket helpers ───────────────────────────────────── */
function getTicketIcon(category) {
  const map = {
    'Account & Profile':    { icon:'ti-user-circle',  iconBg:'rgba(96,165,250,.12)',   iconCol:'#60a5fa' },
    'Billing':              { icon:'ti-credit-card',   iconBg:'rgba(245,158,11,.12)',   iconCol:'#f59e0b' },
    'Billing & Subscription': { icon:'ti-credit-card', iconBg:'rgba(245,158,11,.12)',  iconCol:'#f59e0b' },
    'Trading':              { icon:'ti-chart-candlestick', iconBg:'rgba(167,139,250,.12)', iconCol:'#a78bfa' },
    'Trading & Positions':  { icon:'ti-chart-candlestick', iconBg:'rgba(167,139,250,.12)', iconCol:'#a78bfa' },
    'Alerts':               { icon:'ti-bell',          iconBg:'rgba(248,113,113,.12)',  iconCol:'#f87171' },
    'Alerts & Watchlist':   { icon:'ti-bell',          iconBg:'rgba(248,113,113,.12)',  iconCol:'#f87171' },
    'Copy Trading':         { icon:'ti-users',         iconBg:'rgba(52,211,153,.12)',   iconCol:'#34d399' },
    'API':                  { icon:'ti-code',          iconBg:'rgba(200,245,96,.12)',   iconCol:'#c8f560' },
    'Integrations & API':   { icon:'ti-code',          iconBg:'rgba(200,245,96,.12)',   iconCol:'#c8f560' },
    'Other':                { icon:'ti-help-circle',   iconBg:'rgba(100,116,139,.12)',  iconCol:'#64748b' },
  };
  return map[category] ?? { icon:'ti-ticket', iconBg:'rgba(100,116,139,.12)', iconCol:'#64748b' };
}

function getStatusBadge(status) {
  const map = {
    open:       'in-badge-red',
    in_review:  'in-badge-amber',
    resolved:   'in-badge-green',
    closed:     'in-badge-muted',
  };
  return map[status] ?? 'in-badge-muted';
}

function formatStatusLabel(status) {
  const map = { open:'Open', in_review:'In Review', resolved:'Resolved', closed:'Closed' };
  return map[status] ?? status;
}

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 3600)   return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

const RESOURCES = [
  { icon:'ti-book',          iconBg:'rgba(96,165,250,.12)',   iconCol:'#60a5fa', title:'Getting Started Guide',   sub:'New to TradeFlow? Start here' },
  { icon:'ti-video',         iconBg:'rgba(167,139,250,.12)',  iconCol:'#a78bfa', title:'Video Tutorials',         sub:'Step-by-step walkthroughs'    },
  { icon:'ti-code',          iconBg:'rgba(200,245,96,.12)',   iconCol:'#c8f560', title:'API Documentation',       sub:'Build on the TradeFlow API'    },
  { icon:'ti-brand-discord', iconBg:'rgba(96,165,250,.12)',   iconCol:'#60a5fa', title:'Community Discord',       sub:'Chat with other traders'       },
  { icon:'ti-news',          iconBg:'rgba(52,211,153,.12)',   iconCol:'#34d399', title:'Release Notes',           sub:'Latest updates and changes'    },
];

/* ─── Components ───────────────────────────────────── */

function Sidebar({ open }) {
  const NAV = [
    { section:'Markets' },
    { icon:'ti-layout-dashboard', label:'Dashboard' },
    { icon:'ti-chart-candlestick', label:'Trading' },
    { icon:'ti-bulb', label:'Insights' },
    { section:'Social' },
    { icon:'ti-users', label:'Copy Trading', badge:'3' },
    { icon:'ti-user-circle', label:'Profile' },
    { icon:'ti-world', label:'Marketplace' },
    { section:'Account' },
    { icon:'ti-settings', label:'Settings' },
    { icon:'ti-help-circle', label:'Support', active:true },
  ];

  const [portfolio, setPortfolio] = useState(null);
  const [wallet,    setWallet]    = useState(null);
  const [profile,   setProfile]   = useState(null);

  React.useEffect(() => {
    async function fetchSidebarData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [snapRes, walletRes, profileRes] = await Promise.all([
        // Latest portfolio snapshot — maybeSingle so new users (no rows) return null, not an error
        supabase
          .from('portfolio_snapshots')
          .select('total_value, daily_pnl, total_pnl_pct')
          .eq('user_id', user.id)
          .order('snapped_at', { ascending: false })
          .limit(1)
          .maybeSingle(),

        // All wallets for this user — fetch all, pick default currency wallet or first
        supabase
          .from('wallets')
          .select('balance, currency')
          .eq('user_id', user.id)
          .order('balance', { ascending: false }),

        supabase
          .from('users')
          .select('first_name, last_name, plan, currency')
          .eq('id', user.id)
          .single(),
      ]);

      // Portfolio: default to zeroes if no snapshot yet
      setPortfolio(snapRes.data ?? { total_value: 0, daily_pnl: 0, total_pnl_pct: 0 });

      // Wallet: prefer the wallet whose currency matches the user's preferred currency,
      // otherwise the highest-balance wallet, otherwise default to 0 / USD
      if (profileRes.data?.currency && walletRes.data?.length) {
        const preferred = walletRes.data.find(w => w.currency === profileRes.data.currency);
        setWallet(preferred ?? walletRes.data[0]);
      } else if (walletRes.data?.length) {
        setWallet(walletRes.data[0]);
      } else {
        setWallet({ balance: 0, currency: profileRes.data?.currency ?? 'USD' });
      }

      if (profileRes.data) setProfile(profileRes.data);
    }
    fetchSidebarData();
  }, []);

  // Formatting helpers
  function fmtCurrency(amount, currency = 'USD') {
    // Guard: Intl only accepts valid ISO 4217 codes; crypto tickers like BTC/ETH aren't supported
    const safeCodes = ['USD','EUR','GBP','NGN','JPY','AUD','CAD','CHF','INR','ZAR'];
    const code = safeCodes.includes(currency) ? currency : 'USD';
    return new Intl.NumberFormat('en-US', { style:'currency', currency: code, maximumFractionDigits:2 }).format(amount);
  }

  const currency  = wallet?.currency ?? 'USD';
  const totalVal  = portfolio ? fmtCurrency(portfolio.total_value, currency) : '—';
  const dailyPnl  = Number(portfolio?.daily_pnl ?? 0);
  const dailyPct  = Number(portfolio?.total_pnl_pct ?? 0);
  const pnlLabel  = portfolio
    ? `${dailyPnl >= 0 ? '↑' : '↓'} ${dailyPnl >= 0 ? '+' : ''}${fmtCurrency(dailyPnl, currency)} today (${dailyPct >= 0 ? '+' : ''}${dailyPct.toFixed(2)}%)`
    : '—';
  const pnlColor  = dailyPnl >= 0 ? 'var(--green)' : 'var(--red)';

  const initials  = profile ? `${profile.first_name[0]}${profile.last_name[0]}` : '—';
  const fullName  = profile ? `${profile.first_name} ${profile.last_name}` : '—';
  const planLabel = profile ? (profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) + ' Member') : '—';

  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-wave-sine" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Portfolio Value</div>
        <div className="in-sb-pill-val">{totalVal}</div>
        <div className="in-sb-pill-sub" style={{ color: pnlColor }}>{pnlLabel}</div>
      </div>
      <div className="in-sb-scroll">
        {NAV.map((n, i) => n.section
          ? <div key={i} className="in-sb-section">{n.section}</div>
          : (
            <a key={i} className={`in-sb-link${n.active ? ' active' : ''}`} href="#">
              <i className={`ti ${n.icon}`} />{n.label}
              {n.badge && <span className="in-sb-badge">{n.badge}</span>}
            </a>
          )
        )}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{initials}</div>
        <div>
          <div className="in-sb-user-name">{fullName}</div>
          <div className="in-sb-user-role">{planLabel}</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu }) {
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">Help & <span>Support</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon"><a href='/notification'>
        <i className="ti ti-bell" />
        <span className="in-notif-dot" /></a>
      </div>
      <div className="in-tb-avatar">AR</div>
    </header>
  );
}

function FaqSection() {
  const [openKey, setOpenKey] = useState(null);
  const [activeGroup, setActiveGroup] = useState(0);

  const group = FAQS[activeGroup];
  return (
    <div className="sp-card">
      <div className="sp-card-head">
        <div className="sp-card-title"><i className="ti ti-help-circle" />Frequently Asked Questions</div>
      </div>

      {/* Category tabs */}
      <div className="sp-tabs">
        {FAQS.map((g, i) => (
          <button key={g.cat} className={`sp-tab${activeGroup === i ? ' active' : ''}`} onClick={() => { setActiveGroup(i); setOpenKey(null); }}>
            {g.cat}
          </button>
        ))}
      </div>

      <div className="sp-card-body">
        {group.items.map((item, i) => {
          const key = `${activeGroup}-${i}`;
          const isOpen = openKey === key;
          return (
            <div key={key} className="sp-faq-item">
              <button className={`sp-faq-q${isOpen ? ' open' : ''}`} onClick={() => setOpenKey(isOpen ? null : key)}>
                {item.q}
                <i className={`ti ti-chevron-down sp-faq-chevron`} />
              </button>
              {isOpen && <div className="sp-faq-a">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TicketsSection() {
  const [tab, setTab]           = useState('tickets');
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Form state
  const [subject,     setSubject]     = useState('');
  const [category,    setCategory]    = useState('Account & Profile');
  const [priority,    setPriority]    = useState('medium');
  const [description, setDescription] = useState('');
  const [submitting,  setSubmitting]  = useState(false);

  // Fetch tickets on mount
  React.useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from('support_tickets')
          .select('id, ticket_ref, subject, category, priority, status, created_at, updated_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (err) throw err;
        setTickets(data || []);
      } catch (e) {
        setError(e.message || 'Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  // Submit new ticket
  async function handleSubmit() {
    if (!subject.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ticketRef = `#TF-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: newTicket, error: err } = await supabase
        .from('support_tickets')
        .insert({
          user_id:    user?.id,
          ticket_ref: ticketRef,
          subject:    subject.trim(),
          category,
          priority,
          status:     'open',
        })
        .select()
        .single();

      if (err) throw err;

      // Also insert the description as the first ticket message
      if (newTicket) {
        await supabase.from('ticket_messages').insert({
          ticket_id: newTicket.id,
          sender_id: user?.id,
          is_agent:  false,
          body:      description.trim(),
        });
        setTickets(prev => [newTicket, ...prev]);
      }

      setSubmitted(true);
      setSubject(''); setCategory('Account & Profile'); setPriority('medium'); setDescription('');
    } catch (e) {
      alert('Failed to submit ticket: ' + (e.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sp-card">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid var(--border)` }}>
        <div className="sp-card-title"><i className="ti ti-ticket" />Support Tickets</div>
        <button className="in-btn in-btn-accent in-btn-sm" onClick={() => setTab('new')}>
          <i className="ti ti-plus" /> New Ticket
        </button>
      </div>

      <div className="sp-tabs" style={{ borderBottom:`1px solid var(--border)` }}>
        {[
          { key:'tickets', icon:'ti-list',  label:'My Tickets' },
          { key:'new',     icon:'ti-edit',  label:'New Ticket'  },
        ].map(t => (
          <button key={t.key} className={`sp-tab${tab === t.key ? ' active' : ''}`} onClick={() => { setTab(t.key); setSubmitted(false); }}>
            <i className={`ti ${t.icon}`} />{t.label}
          </button>
        ))}
      </div>

      <div className="sp-card-body">
        {tab === 'tickets' && (
          loading ? (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>
              <i className="ti ti-loader-2" style={{ fontSize:22, display:'block', marginBottom:8, animation:'spin 1s linear infinite' }} />
              Loading tickets…
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : error ? (
            <div style={{ padding:'24px 20px', textAlign:'center', color:'var(--red)', fontSize:13 }}>
              <i className="ti ti-alert-circle" style={{ fontSize:20, display:'block', marginBottom:6 }} />
              {error}
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>
              <i className="ti ti-inbox" style={{ fontSize:28, display:'block', marginBottom:8 }} />
              No tickets yet. Need help? Open a new ticket.
            </div>
          ) : (
            tickets.map((t) => {
              const { icon, iconBg, iconCol } = getTicketIcon(t.category);
              return (
                <div key={t.id} className="sp-ticket">
                  <div className="sp-ticket-icon" style={{ background:iconBg, color:iconCol }}>
                    <i className={`ti ${icon}`} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <div className="sp-ticket-title">{t.subject}</div>
                      <span className={`in-badge ${getStatusBadge(t.status)}`}>{formatStatusLabel(t.status)}</span>
                    </div>
                    <div className="sp-ticket-meta">
                      <span className="sp-ticket-id">{t.ticket_ref}</span>
                      <span>·</span>
                      <span>{timeAgo(t.created_at)}</span>
                      <span>·</span>
                      <span style={{ textTransform:'capitalize' }}>{t.category}</span>
                    </div>
                  </div>
                  <i className="ti ti-chevron-right" style={{ fontSize:16, color:'var(--muted)', flexShrink:0, marginTop:2 }} />
                </div>
              );
            })
          )
        )}

        {tab === 'new' && !submitted && (
          <div style={{ padding:20, display:'flex', flexDirection:'column', gap:16 }}>
            <div className="sp-field">
              <div className="sp-field-label">Subject</div>
              <input
                className="sp-input"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="sp-field">
                <div className="sp-field-label">Category</div>
                <select className="sp-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Account & Profile">Account &amp; Profile</option>
                  <option value="Billing & Subscription">Billing &amp; Subscription</option>
                  <option value="Trading & Positions">Trading &amp; Positions</option>
                  <option value="Alerts & Watchlist">Alerts &amp; Watchlist</option>
                  <option value="Copy Trading">Copy Trading</option>
                  <option value="Integrations & API">Integrations &amp; API</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="sp-field">
                <div className="sp-field-label">Priority</div>
                <select className="sp-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low — general question</option>
                  <option value="medium">Medium — something not working</option>
                  <option value="high">High — blocking my trading</option>
                  <option value="critical">Critical — account / funds issue</option>
                </select>
              </div>
            </div>
            <div className="sp-field">
              <div className="sp-field-label">Description</div>
              <textarea
                className="sp-input sp-textarea"
                placeholder="Please describe the issue in detail — what you expected to happen and what actually happened."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="sp-field">
              <div className="sp-field-label">Attachments <span style={{ color:'var(--muted)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(optional)</span></div>
              <div style={{
                background:'var(--surface2)', border:`1px dashed var(--border2)`, borderRadius:8,
                padding:'20px 16px', textAlign:'center', cursor:'pointer',
              }}>
                <i className="ti ti-upload" style={{ fontSize:22, color:'var(--muted)', marginBottom:6, display:'block' }} />
                <div style={{ fontSize:12, color:'var(--muted)' }}>Drop files here or click to upload · PNG, JPG, PDF up to 10 MB</div>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => setTab('tickets')}>Cancel</button>
              <button
                className="in-btn in-btn-accent in-btn-sm"
                onClick={handleSubmit}
                disabled={submitting || !subject.trim() || !description.trim()}
                style={{ opacity: (!subject.trim() || !description.trim()) ? 0.5 : 1 }}
              >
                {submitting
                  ? <><i className="ti ti-loader-2" style={{ animation:'spin 1s linear infinite' }} /> Submitting…</>
                  : <><i className="ti ti-send" /> Submit Ticket</>}
              </button>
            </div>
          </div>
        )}

        {tab === 'new' && submitted && (
          <div style={{ padding:40, textAlign:'center' }}>
            <div style={{
              width:56, height:56, borderRadius:'50%', background:'var(--accent-dim)',
              border:`1px solid rgba(var(--accent-rgb),.25)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 16px', fontSize:26, color:'var(--accent)',
            }}>
              <i className="ti ti-check" />
            </div>
            <div style={{ fontFamily:'var(--serif)', fontSize:20, marginBottom:8 }}>Ticket <em style={{ color:'var(--accent)', fontStyle:'italic' }}>Submitted</em></div>
            <div style={{ fontSize:13, color:'var(--muted)', marginBottom:6 }}>Your ticket <span style={{ fontFamily:'var(--mono)', color:'var(--text)' }}>#TF-4822</span> has been received.</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:24 }}>Our team typically responds within 4–8 hours on business days.</div>
            <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => { setTab('tickets'); setSubmitted(false); }}>
              View My Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Root ─────────────────────────────────────────── */
export default function Support() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // user_settings: fetched once after auth, applied as CSS vars
  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);
  const settingsApplied = useRef(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || settingsApplied.current) return;
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        settingsApplied.current = true;
        setUserSettings(s => ({ ...s, ...data }));
      }
    }
    fetchSettings();
  }, []);

  // Apply CSS vars on :root whenever settings change
  useEffect(() => {
    applyThemeVars(buildThemeVars(userSettings));
    if (userSettings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyThemeVars(buildThemeVars(userSettings));
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [userSettings]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299,
        }} />
      )}

      <div className="in-shell">
        <Sidebar open={sidebarOpen} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} />

          <main className="in-main">

            {/* Hero */}
            <div className="sp-hero">
              <div className="sp-hero-grid" />
              <div className="sp-hero-glow" />
              <div className="sp-hero-content">
                <div className="sp-hero-label">Help Center</div>
                <div className="sp-hero-title">How can we <em>help you</em>?</div>
                <div className="sp-hero-sub">Search our knowledge base or browse topics below. Most answers are just a click away.</div>
                <div className="sp-search-wrap">
                  <div className="sp-search-rel">
                    <i className="ti ti-search sp-search-icon" />
                    <input
                      className="sp-search-input"
                      placeholder="Search articles, guides, FAQs…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="in-btn in-btn-accent in-btn-md">Search</button>
                </div>
              </div>
            </div>

            {/* System status */}
            <div className="sp-status-bar">
              <div className="sp-status-dot" />
              All systems operational
              <span>· Last checked 3 min ago · </span>
              <a href="#" style={{ color:'var(--green)', textDecoration:'underline', fontSize:12 }}>View status page</a>
            </div>

            {/* Quick actions */}
            <div className="sp-quick-grid">
              {[
                { icon:'ti-ticket',      iconBg:'rgba(200,245,96,.12)',  iconCol:'#c8f560', title:'Submit a Ticket',      desc:'Get help from our support team directly.',          featured:true  },
                { icon:'ti-book',        iconBg:'rgba(96,165,250,.12)',  iconCol:'#60a5fa', title:'Browse Docs',          desc:'Step-by-step guides and how-to articles.',          featured:false },
                { icon:'ti-brand-discord', iconBg:'rgba(167,139,250,.12)', iconCol:'#a78bfa', title:'Community Forum',  desc:'Ask questions and connect with other traders.',      featured:false },
                { icon:'ti-video',       iconBg:'rgba(52,211,153,.12)',  iconCol:'#34d399', title:'Video Tutorials',      desc:'Watch walkthroughs for every major feature.',        featured:false },
                { icon:'ti-message-dots', iconBg:'rgba(245,158,11,.12)', iconCol:'#f59e0b', title:'Live Chat',            desc:'Chat with support in real time. Available 9–6 EST.', featured:false },
                { icon:'ti-chart-bar',   iconBg:'rgba(248,113,113,.12)', iconCol:'#f87171', title:'System Status',        desc:'Check uptime and any ongoing incidents.',            featured:false },
              ].map((c, i) => (
                <div key={i} className={`sp-quick-card${c.featured ? ' featured' : ''}`}>
                  <div className="sp-quick-icon" style={{ background:c.iconBg, color:c.iconCol }}>
                    <i className={`ti ${c.icon}`} />
                  </div>
                  <div className="sp-quick-title">{c.title}</div>
                  <div className="sp-quick-desc">{c.desc}</div>
                  <i className="ti ti-arrow-up-right sp-quick-arrow" />
                </div>
              ))}
            </div>

            {/* Two-col layout */}
            <div className="sp-layout">

              {/* Left: FAQ + Tickets */}
              <div className="sp-left">
                <FaqSection />
                <TicketsSection />
              </div>

              {/* Right: Contact + Resources */}
              <div className="sp-right">

                {/* Contact channels */}
                <div className="sp-card">
                  <div className="sp-card-head">
                    <div className="sp-card-title"><i className="ti ti-headset" />Contact Support</div>
                  </div>
                  <div className="sp-card-body">
                    {[
                      { icon:'ti-message-dots', iconBg:'rgba(200,245,96,.12)',  iconCol:'#c8f560', label:'Live Chat',     sub:'Avg. reply in 4 min', badge:'Online', badgeCol:'in-badge-green' },
                      { icon:'ti-mail',         iconBg:'rgba(96,165,250,.12)',  iconCol:'#60a5fa', label:'Email Support', sub:'Reply within 8 hours', badge:null },
                      { icon:'ti-brand-discord', iconBg:'rgba(167,139,250,.12)',iconCol:'#a78bfa', label:'Discord',       sub:'Community + staff channel', badge:null },
                      { icon:'ti-phone',        iconBg:'rgba(52,211,153,.12)',  iconCol:'#34d399', label:'Phone',         sub:'Elite plan only · 24/7', badge:'Elite', badgeCol:'in-badge-amber' },
                    ].map((c, i) => (
                      <div key={i} className="sp-contact">
                        <div className="sp-contact-icon" style={{ background:c.iconBg, color:c.iconCol }}>
                          <i className={`ti ${c.icon}`} />
                        </div>
                        <div style={{ flex:1 }}>
                          <div className="sp-contact-label">{c.label}</div>
                          <div className="sp-contact-sub">{c.sub}</div>
                        </div>
                        {c.badge && (
                          <span className={`in-badge ${c.badgeCol} sp-contact-badge`}>{c.badge}</span>
                        )}
                        <i className="ti ti-chevron-right" style={{ fontSize:15, color:'var(--muted)', marginLeft:8 }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="sp-card">
                  <div className="sp-card-head">
                    <div className="sp-card-title"><i className="ti ti-books" />Resources</div>
                  </div>
                  <div className="sp-card-body">
                    {RESOURCES.map((r, i) => (
                      <div key={i} className="sp-resource">
                        <div className="sp-resource-icon" style={{ background:r.iconBg, color:r.iconCol }}>
                          <i className={`ti ${r.icon}`} />
                        </div>
                        <div style={{ flex:1 }}>
                          <div className="sp-resource-title">{r.title}</div>
                          <div className="sp-resource-sub">{r.sub}</div>
                        </div>
                        <i className="ti ti-external-link" style={{ fontSize:14, color:'var(--muted)' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support hours */}
                <div className="sp-card">
                  <div className="sp-card-head">
                    <div className="sp-card-title"><i className="ti ti-clock" />Support Hours</div>
                  </div>
                  <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { day:'Monday – Friday', hours:'9:00 AM – 6:00 PM EST', active:true  },
                      { day:'Saturday',        hours:'10:00 AM – 3:00 PM EST', active:false },
                      { day:'Sunday',          hours:'Closed',                 active:false },
                    ].map((h, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
                        <span style={{ color:'var(--muted)' }}>{h.day}</span>
                        <span style={{ fontFamily:'var(--mono)', fontWeight:600, color: h.hours === 'Closed' ? 'var(--muted)' : 'var(--text)' }}>{h.hours}</span>
                      </div>
                    ))}
                    <div style={{ marginTop:4, padding:'10px 12px', background:'var(--accent-dim)', border:`1px solid rgba(var(--accent-rgb),.15)`, borderRadius:8, fontSize:11, color:'var(--accent)' }}>
                      <i className="ti ti-info-circle" style={{ marginRight:6, fontSize:13, verticalAlign:-2 }} />
                      Elite plan members receive 24/7 priority support.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}