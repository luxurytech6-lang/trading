import React, { useState, useEffect, useCallback, useRef } from 'react';
import supabase from "../supabase";

/* ─── Design tokens (matches existing site shell) ──────────────────── */
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
  const s     = { ...DEFAULT_SETTINGS, ...settings };
  const theme = resolveTheme(s.theme);
  const accent = s.accent_color;

  const hex2rgb = h => {
    const c = h.replace('#', '');
    return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
  };
  const [ar, ag, ab] = hex2rgb(accent);

  const densityMap = {
    compact:     { sbW:'220px', mainPad:'16px 20px 32px', cardPad:'12px 16px', gap:'10px' },
    comfortable: { sbW:'256px', mainPad:'24px 28px 40px', cardPad:'16px 20px', gap:'14px' },
    spacious:    { sbW:'280px', mainPad:'32px 36px 56px', cardPad:'20px 24px', gap:'20px' },
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
    '--sidebar-w': d.sbW,
    '--topbar-h':  '60px',
    '--density-pad':  d.mainPad,
    '--card-body-pad': d.cardPad,
    '--grid-gap':  d.gap,
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
    --card-body-pad:16px 20px;
    --grid-gap:14px;
    --sans:'Space Grotesk',sans-serif;
    --serif:'Instrument Serif',serif;
    --mono:'JetBrains Mono',monospace;
    --r-sm:8px; --r-md:12px; --r-lg:16px;
  }

  body, #root {
    font-family: var(--sans); background: var(--bg); color: var(--text);
    height: 100vh; overflow: hidden; -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }
  button { font-family: var(--sans); cursor: pointer; border: none; background: none; }
  input, select, textarea { font-family: var(--sans); }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── Shell ── */
  .in-shell { display: grid; grid-template-columns: var(--sidebar-w) 1fr; height: 100vh; overflow: hidden; }

  /* ── Sidebar ── */
  .in-sidebar {
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; height: 100vh;
    overflow-y: auto; overflow-x: hidden; position: relative; z-index: 100;
    flex-shrink: 0; transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .in-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
  .in-sidebar::after {
    content:''; position:absolute; top:0; right:0; width:1px; height:100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity:.15; pointer-events:none;
  }

  /* Brand */
  .in-brand { display:flex; align-items:center; gap:10px; padding:20px 20px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .in-brand-icon { width:34px; height:34px; background:var(--accent); border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .in-brand-icon i { font-size:18px; color:#000; }
  .in-brand-name { font-size:16px; font-weight:700; color:var(--text); }
  .in-brand-name em { color:var(--accent); font-style:normal; }

  /* Portfolio pill */
  .in-sb-pill { margin:12px 16px; background:var(--accent-dim); border:1px solid rgba(var(--accent-rgb),.18); border-radius:var(--r-md); padding:10px 14px; flex-shrink:0; }
  .in-sb-pill-label { font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
  .in-live-dot { width:6px; height:6px; background:var(--green); border-radius:50%; animation:in-pulse 2s infinite; flex-shrink:0; }
  @keyframes in-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .in-sb-pill-val { font-family:var(--mono); font-size:19px; font-weight:600; color:var(--accent); letter-spacing:-.5px; }
  .in-sb-pill-sub { font-size:11px; color:var(--green); margin-top:3px; }

  /* Nav */
  .in-sb-scroll { flex:1; overflow-y:auto; padding:8px 0; }
  .in-sb-section { padding:10px 20px 4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); }
  .in-sb-link {
    display:flex; align-items:center; gap:11px; padding:9px 20px;
    font-size:13px; font-weight:500; color:var(--muted);
    border-left:2px solid transparent; transition:all .15s; cursor:pointer; text-decoration:none;
  }
  .in-sb-link i { font-size:18px; flex-shrink:0; }
  .in-sb-link:hover { color:var(--text); background:var(--accent-glow); border-left-color:var(--border2); }
  .in-sb-link.active { color:var(--accent); background:var(--accent-dim); border-left-color:var(--accent); }
  .in-sb-link.active i { filter:drop-shadow(0 0 6px var(--accent)); }
  .in-sb-badge { margin-left:auto; font-size:9px; font-weight:700; background:var(--accent); color:#000; padding:2px 6px; border-radius:5px; }

  /* User */
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

  /* ── Right panel ── */
  .in-right { grid-column:2; display:flex; flex-direction:column; height:100vh; overflow:hidden; }

  /* ── Topbar ── */
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

  /* ── Main ── */
  .in-main { flex:1; overflow-y:auto; overflow-x:hidden; padding:var(--density-pad); }

  /* Buttons */
  .in-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    border-radius:var(--r-sm); font-family:var(--sans); font-weight:600;
    cursor:pointer; transition:all .15s; border:none; text-decoration:none; white-space:nowrap;
  }
  .in-btn-sm { font-size:12px; padding:7px 14px; }
  .in-btn-md { font-size:13px; padding:9px 18px; }
  .in-btn-accent { background:var(--accent); color:#000; }
  .in-btn-accent:hover { opacity:.88; box-shadow:0 0 20px rgba(var(--accent-rgb),.3); }
  .in-btn-ghost { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .in-btn-ghost:hover { border-color:var(--border2); }
  .in-btn-danger { background:var(--red-dim); border:1px solid rgba(248,113,113,.2); color:var(--red); }
  .in-btn-danger:hover { background:rgba(248,113,113,.2); }

  /* Badge */
  .in-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap; letter-spacing:.2px; }
  .in-badge-green  { background:var(--green-dim);  color:var(--green); }
  .in-badge-blue   { background:var(--blue-dim);   color:var(--blue); }
  .in-badge-red    { background:var(--red-dim);    color:var(--red); }
  .in-badge-gold   { background:var(--accent-dim); color:var(--accent); }
  .in-badge-purple { background:var(--purple-dim); color:var(--purple); }
  .in-badge-amber  { background:var(--amber-dim);  color:var(--amber); }
  .in-badge-muted  { background:rgba(100,116,139,.12); color:var(--muted); }

  /* ─────────────────────────────────────────────────────── */
  /* ── PROFILE PAGE ── */

  /* Hero Banner */
  .pf-hero {
    position:relative; height:160px; border-radius:var(--r-lg);
    overflow:hidden; margin-bottom:0;
    background:linear-gradient(135deg,#0d1520 0%,#0b1628 40%,#0d1018 100%);
    border:1px solid var(--border);
  }
  .pf-hero-grid {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(var(--accent-rgb),.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(var(--accent-rgb),.04) 1px,transparent 1px);
    background-size:40px 40px;
  }
  .pf-hero-glow {
    position:absolute; top:-80px; left:50%; transform:translateX(-50%);
    width:500px; height:300px; border-radius:50%;
    background:radial-gradient(ellipse,rgba(var(--accent-rgb),.07) 0%,transparent 70%);
    pointer-events:none;
  }
  .pf-hero-actions { position:absolute; top:16px; right:16px; display:flex; gap:8px; }

  /* Profile identity */
  .pf-identity {
    display:flex; align-items:flex-end; gap:20px;
    padding:0 28px; margin-top:-48px; margin-bottom:20px;
    position:relative; z-index:10;
  }
  .pf-avatar-wrap { position:relative; flex-shrink:0; }
  .pf-avatar {
    width:96px; height:96px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:32px; font-weight:700;
    display:flex; align-items:center; justify-content:center;
    border:3px solid var(--bg); box-shadow:0 0 24px rgba(var(--accent-rgb),.35);
  }
  .pf-avatar-status {
    position:absolute; bottom:4px; right:4px; width:16px; height:16px;
    border-radius:50%; background:var(--green); border:2.5px solid var(--bg);
  }
  .pf-identity-info { flex:1; padding-bottom:4px; }
  .pf-name { font-family:var(--serif); font-size:24px; line-height:1.2; margin-bottom:4px; }
  .pf-name em { color:var(--accent); font-style:italic; }
  .pf-handle { font-size:13px; color:var(--muted); margin-bottom:8px; display:flex; align-items:center; gap:8px; }
  .pf-tags { display:flex; gap:6px; flex-wrap:wrap; }
  .pf-identity-actions { display:flex; gap:8px; padding-bottom:4px; }

  /* Account summary cards */
  .pf-summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:var(--grid-gap); margin-bottom:24px; }
  .pf-summary-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--r-lg); padding:16px 18px;
    position:relative; overflow:hidden; transition:all .2s;
  }
  .pf-summary-card:hover { border-color:var(--border2); transform:translateY(-1px); }
  .pf-summary-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent 0%,var(--accent) 50%,transparent 100%);
    opacity:.2;
  }
  .pf-summary-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:14px; margin-bottom:10px; }
  .pf-summary-label { font-size:9px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:5px; }
  .pf-summary-value { font-family:var(--mono); font-size:20px; font-weight:600; line-height:1; margin-bottom:4px; letter-spacing:-.5px; }
  .pf-summary-sub { font-size:11px; color:var(--muted); }

  /* Content layout */
  .pf-content { display:grid; grid-template-columns:1fr 320px; gap:var(--grid-gap); }
  .pf-left { display:flex; flex-direction:column; gap:var(--grid-gap); }
  .pf-right { display:flex; flex-direction:column; gap:var(--grid-gap); }

  /* Section card */
  .pf-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; }
  .pf-card-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px; border-bottom:1px solid var(--border);
  }
  .pf-card-title { font-size:13px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .pf-card-title i { font-size:16px; color:var(--accent); }
  .pf-card-body { padding:var(--card-body-pad); }

  /* Tabs */
  .pf-tabs { display:flex; gap:4px; }
  .pf-tab {
    display:flex; align-items:center; gap:6px; padding:6px 12px;
    font-size:12px; font-weight:600; border-radius:var(--r-sm);
    color:var(--muted); background:none; transition:all .15s; cursor:pointer; border:none;
  }
  .pf-tab i { font-size:14px; }
  .pf-tab:hover { color:var(--text); background:var(--surface2); }
  .pf-tab.active { color:var(--accent); background:var(--accent-dim); }

  /* Activity feed */
  .pf-activity-item {
    display:flex; align-items:flex-start; gap:12px;
    padding:12px 0; border-bottom:1px solid var(--border);
  }
  .pf-activity-item:last-child { border-bottom:none; padding-bottom:0; }
  .pf-activity-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; margin-top:1px; }
  .pf-activity-text { flex:1; min-width:0; }
  .pf-activity-title { font-size:13px; line-height:1.4; margin-bottom:4px; }
  .pf-activity-meta { font-size:11px; color:var(--muted); display:flex; align-items:center; gap:5px; }
  .pf-activity-val { font-family:var(--mono); font-size:12px; font-weight:700; flex-shrink:0; }

  /* Watchlist */
  .pf-watch-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 0; border-bottom:1px solid var(--border);
  }
  .pf-watch-item:last-child { border-bottom:none; }
  .pf-watch-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
  .pf-watch-ticker { font-size:13px; font-weight:700; margin-bottom:2px; }
  .pf-watch-name { font-size:11px; color:var(--muted); }
  .pf-watch-price { font-family:var(--mono); font-size:13px; font-weight:600; text-align:right; }
  .pf-watch-chg { font-size:11px; text-align:right; margin-top:2px; }

  /* Followed traders */
  .pf-trader-item {
    display:flex; align-items:center; gap:10px;
    padding:10px 0; border-bottom:1px solid var(--border);
  }
  .pf-trader-item:last-child { border-bottom:none; }
  .pf-trader-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
  .pf-trader-name { font-size:12px; font-weight:700; margin-bottom:2px; }
  .pf-trader-sub { font-size:10px; color:var(--muted); }
  .pf-trader-roi { font-family:var(--mono); font-size:12px; font-weight:700; margin-left:auto; }
  .pf-trader-action { margin-left:8px; }

  /* Notifications card */
  .pf-notif-item { display:flex; align-items:flex-start; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .pf-notif-item:last-child { border-bottom:none; }
  .pf-notif-dot-wrap { padding-top:4px; flex-shrink:0; }
  .pf-notif-unread { width:7px; height:7px; border-radius:50%; background:var(--accent); }
  .pf-notif-read { width:7px; height:7px; border-radius:50%; background:var(--border2); }
  .pf-notif-text { font-size:12px; line-height:1.45; flex:1; }
  .pf-notif-time { font-size:10px; color:var(--muted); margin-top:3px; }

  /* Info rows */
  .pf-info-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--border); }
  .pf-info-row:last-child { border-bottom:none; }
  .pf-info-row i { font-size:15px; color:var(--muted); width:20px; flex-shrink:0; }
  .pf-info-label { font-size:11px; color:var(--muted); width:80px; flex-shrink:0; }
  .pf-info-val { font-size:12px; font-weight:500; }

  /* Plan card */
  .pf-plan-card {
    background:linear-gradient(135deg,rgba(var(--accent-rgb),.08) 0%,rgba(var(--accent-rgb),.03) 100%);
    border:1px solid rgba(var(--accent-rgb),.2); border-radius:var(--r-md); padding:16px;
    display:flex; align-items:center; gap:14px;
  }
  .pf-plan-icon { width:40px; height:40px; border-radius:10px; background:var(--accent-dim); border:1px solid rgba(var(--accent-rgb),.25); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .pf-plan-name { font-size:14px; font-weight:700; color:var(--accent); margin-bottom:3px; }
  .pf-plan-desc { font-size:11px; color:var(--muted); }
  .pf-plan-upgrade { margin-left:auto; flex-shrink:0; }

  /* Edit modal */
  .pf-modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.7);
    z-index:500; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);
  }
  .pf-modal {
    background:var(--surface); border:1px solid var(--border2);
    border-radius:var(--r-lg); width:480px; max-width:calc(100vw - 32px);
    max-height:90vh; overflow-y:auto; box-shadow:0 24px 80px rgba(0,0,0,.6);
  }
  .pf-modal-head { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid var(--border); }
  .pf-modal-title { font-family:var(--serif); font-size:18px; }
  .pf-modal-body { padding:22px; display:flex; flex-direction:column; gap:16px; }
  .pf-modal-foot { padding:14px 22px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:8px; }
  .pf-field { display:flex; flex-direction:column; gap:6px; }
  .pf-field label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); }
  .pf-input {
    background:var(--input-bg, var(--surface2)); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:9px 12px; font-size:13px; outline:none;
    transition:border-color .15s; width:100%;
  }
  .pf-input:focus { border-color:var(--accent); }
  .pf-textarea { resize:vertical; min-height:80px; }
  .pf-field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  /* Trading Performance stats */
  .pf-perf-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:14px; }
  .pf-perf-stat {
    background:var(--surface2); border:1px solid var(--border);
    border-radius:10px; padding:12px 14px; text-align:center;
  }
  .pf-perf-stat-val { font-family:var(--mono); font-size:18px; font-weight:700; line-height:1; margin-bottom:4px; }
  .pf-perf-stat-label { font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.8px; }
  .pf-period-tabs { display:flex; gap:4px; margin-bottom:14px; }
  .pf-period-tab {
    padding:4px 10px; border-radius:5px; font-size:11px; font-weight:600;
    color:var(--muted); background:none; cursor:pointer; border:1px solid transparent; transition:all .15s;
  }
  .pf-period-tab:hover { color:var(--text); }
  .pf-period-tab.active { color:var(--accent); background:var(--accent-dim); border-color:rgba(var(--accent-rgb),.2); }
  .pf-sparkline { display:flex; align-items:flex-end; gap:3px; height:48px; }
  .pf-spark-bar { flex:1; border-radius:3px 3px 0 0; min-height:4px; transition:opacity .2s; }
  .pf-spark-bar:hover { opacity:.75; }

  /* Broker connections */
  .pf-broker-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 0; border-bottom:1px solid var(--border);
  }
  .pf-broker-item:last-child { border-bottom:none; }
  .pf-broker-logo {
    width:36px; height:36px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:800; flex-shrink:0;
    border:1px solid var(--border);
  }
  .pf-broker-name { font-size:12px; font-weight:700; margin-bottom:2px; }
  .pf-broker-meta { font-size:10px; color:var(--muted); }
  .pf-broker-balance { font-family:var(--mono); font-size:12px; font-weight:700; margin-left:auto; text-align:right; }
  .pf-broker-type { font-size:10px; margin-top:2px; text-align:right; }
  .pf-live-pill { display:inline-flex; align-items:center; gap:4px; padding:2px 7px; border-radius:4px; font-size:10px; font-weight:700; }
  .pf-live-pill.live { background:var(--green-dim); color:var(--green); }
  .pf-live-pill.demo { background:var(--blue-dim); color:var(--blue); }

  /* Connected apps */
  .pf-apps-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .pf-app-item {
    background:var(--surface2); border:1px solid var(--border);
    border-radius:10px; padding:12px; display:flex; align-items:center; gap:10px;
    transition:border-color .15s;
  }
  .pf-app-item:hover { border-color:var(--border2); }
  .pf-app-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .pf-app-name { font-size:11px; font-weight:700; margin-bottom:2px; }
  .pf-app-status { font-size:10px; }
  .pf-app-toggle { margin-left:auto; flex-shrink:0; }
  .pf-toggle { width:32px; height:18px; border-radius:9px; border:none; cursor:pointer; position:relative; transition:background .2s; flex-shrink:0; }
  .pf-toggle::after { content:''; position:absolute; width:12px; height:12px; border-radius:50%; background:#fff; top:3px; transition:left .2s; }
  .pf-toggle.on { background:var(--accent); }
  .pf-toggle.on::after { left:17px; }
  .pf-toggle.off { background:var(--border2); }
  .pf-toggle.off::after { left:3px; }

  /* Transactions */
  .pf-tx-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 0; border-bottom:1px solid var(--border);
  }
  .pf-tx-item:last-child { border-bottom:none; }
  .pf-tx-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .pf-tx-desc { font-size:12px; font-weight:600; margin-bottom:2px; }
  .pf-tx-meta { font-size:10px; color:var(--muted); }
  .pf-tx-amount { font-family:var(--mono); font-size:13px; font-weight:700; margin-left:auto; text-align:right; }
  .pf-tx-status { font-size:10px; text-align:right; margin-top:2px; }

  /* Responsive */
  @media (max-width:1100px) {
    .pf-summary-row { grid-template-columns:repeat(2,1fr); }
    .pf-content { grid-template-columns:1fr; }
  }
  @media (max-width:768px) {
    .in-shell { grid-template-columns:1fr !important; }
    .in-sidebar { position:fixed !important; top:0 !important; left:0 !important; transform:translateX(-100%) !important; z-index:300 !important; }
    .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column:1; }
    .in-hamburger { display:flex; }
    .pf-identity { padding:0 16px; flex-wrap:wrap; }
    .pf-summary-row { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:600px) {
    .in-main { padding:16px; }
    .in-topbar { padding:0 16px; }
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────── */
const APP_META = {
  discord:     { icon:'ti-brand-discord',   bg:'rgba(167,139,250,.12)', col:'#a78bfa' },
  telegram:    { icon:'ti-brand-telegram',  bg:'rgba(52,211,153,.12)',  col:'#34d399' },
  slack:       { icon:'ti-brand-slack',     bg:'rgba(245,158,11,.12)',  col:'#f59e0b' },
  tradingview: { icon:'ti-chart-line',      bg:'rgba(96,165,250,.12)',  col:'#60a5fa' },
  broker_link: { icon:'ti-plug-connected',  bg:'rgba(200,245,96,.12)',  col:'#c8f560' },
};
const TX_META = {
  deposit:     { icon:'ti-arrow-down-circle', bg:'rgba(52,211,153,.12)',  col:'#34d399' },
  withdrawal:  { icon:'ti-arrow-up-circle',   bg:'rgba(248,113,113,.12)', col:'#f87171' },
  plan_charge: { icon:'ti-credit-card',       bg:'rgba(200,245,96,.12)',  col:'#c8f560' },
  fee:         { icon:'ti-receipt',           bg:'rgba(96,165,250,.12)',  col:'#60a5fa' },
  payout:      { icon:'ti-coins',             bg:'rgba(52,211,153,.12)',  col:'#34d399' },
};
const ACTIVITY_META = {
  Watchlist: { icon:'ti-eye',       bg:'rgba(96,165,250,.12)',  col:'#60a5fa' },
  Alert:     { icon:'ti-bell',      bg:'rgba(245,158,11,.12)',  col:'#f59e0b' },
  Social:    { icon:'ti-user-plus', bg:'rgba(52,211,153,.12)',  col:'#34d399' },
  Community: { icon:'ti-message',   bg:'rgba(167,139,250,.12)', col:'#a78bfa' },
  Signals:   { icon:'ti-star',      bg:'rgba(200,245,96,.12)',  col:'#c8f560' },
};
const BROKER_COLORS = [
  { bg:'rgba(52,211,153,.12)',  col:'#34d399' },
  { bg:'rgba(96,165,250,.12)',  col:'#60a5fa' },
  { bg:'rgba(200,245,96,.12)',  col:'#c8f560' },
  { bg:'rgba(167,139,250,.12)', col:'#a78bfa' },
  { bg:'rgba(245,158,11,.12)',  col:'#f59e0b' },
];
const PERF_PERIODS = ['30D', '90D', '6M', '1Y', 'all_time'];
const PERF_LABELS  = { '30D':'30D', '90D':'90D', '6M':'6M', '1Y':'1Y', 'all_time':'All' };

function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
function timeAgo(ts) {
  if (!ts) return '';
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  if (diff < 172800)return 'Yesterday';
  return fmtDate(ts);
}
function fmtMoney(n, currency = 'USD') {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', { style:'currency', currency, maximumFractionDigits:2 }).format(n);
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

/* ─── Supabase data hook ─────────────────────────────────────────── */
function useProfileData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current session user
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authUser) throw new Error('Not authenticated');
      const uid = authUser.id;

      // Fire all queries in parallel
      const [
        userRes, subRes, activityRes, watchlistRes,
        followedRes, notifRes, txRes, brokerRes,
        appsRes, usageRes, perfRes, walletRes, settingsRes,
      ] = await Promise.all([
        // 1. User profile
        supabase.from('users').select('*').eq('id', uid).single(),

        // 2. Active subscription + plan details
        supabase.from('user_subscriptions')
          .select('*, subscription_plans(*)')
          .eq('user_id', uid)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),

        // 3. Recent activity feed
        supabase.from('user_activity_feed')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(10),

        // 4. Watchlist — select only columns that exist in portfolio_watchlist
        supabase.from('portfolio_watchlist')
          .select('id, symbol, name, position_order, added_at')
          .eq('user_id', uid)
          .order('position_order', { ascending: true })
          .limit(10),

        // 5. Followed traders (copy relationships + trader profiles)
        supabase.from('copy_relationships')
          .select('*, trader_profiles(*, users(first_name, last_name, avatar_url))')
          .eq('copier_id', uid)
          .eq('status', 'active')
          .limit(6),

        // 6. Notifications
        supabase.from('notifications')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(10),

        // 7. Transactions
        supabase.from('transactions')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(10),

        // 8. Broker connections
        supabase.from('broker_connections')
          .select('*')
          .eq('user_id', uid)
          .eq('is_active', true)
          .order('connected_at', { ascending: false }),

        // 9. Connected apps
        supabase.from('connected_apps')
          .select('*')
          .eq('user_id', uid),

        // 10. Usage metrics (current period)
        supabase.from('usage_metrics')
          .select('*')
          .eq('user_id', uid)
          .order('period_start', { ascending: false })
          .limit(1)
          .maybeSingle(),

        // 11. Trader profile id — fetched separately; performance queried below
        supabase.from('trader_profiles')
          .select('id')
          .eq('user_id', uid)
          .maybeSingle(),

        // 12. USD wallet balance
        supabase.from('wallets')
          .select('balance, currency')
          .eq('user_id', uid)
          .eq('currency', 'USD')
          .maybeSingle(),

        // 13. User settings
        supabase.from('user_settings')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle(),
      ]);

      // Check for critical errors
      if (userRes.error) throw userRes.error;

      // 11b. Fetch trader performance only if the user has a trader profile
      const traderProfile = perfRes.data;
      let performanceData = [];
      if (traderProfile?.id) {
        const { data: perfRows } = await supabase
          .from('trader_performance')
          .select('*')
          .eq('trader_id', traderProfile.id)
          .in('period', PERF_PERIODS)
          .order('recorded_at', { ascending: false });
        performanceData = perfRows || [];
      }

      setData({
        user:         userRes.data,
        subscription: subRes.data,
        activity:     activityRes.data    || [],
        watchlist:    watchlistRes.data   || [],
        followed:     followedRes.data    || [],
        notifications: notifRes.data      || [],
        transactions: txRes.data          || [],
        brokers:      brokerRes.data      || [],
        apps:         appsRes.data        || [],
        usage:        usageRes.data,
        performance:  performanceData,
        wallet:       walletRes.data,
        settings:     settingsRes.data    || null,
      });
    } catch (e) {
      setError(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function Sidebar({ open, user = {}, sub, wallet, followed = [] }) {
  const plan = sub?.subscription_plans;
  const ini  = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Loading…';
  const planLabel = plan ? `${plan.name.charAt(0).toUpperCase()+plan.name.slice(1)} Member` : 'Basic Plan';
  const portfolioVal = fmtMoney(wallet?.balance ?? 0, wallet?.currency || user.currency || 'USD');
  const NAV = [
    { section:'Markets' },
    { href:'/dashboard', icon:'ti-layout-dashboard', label:'Dashboard' },
    { href:'/terminal', icon:'ti-chart-candlestick', label:'Trading' },
    { href:'/insights', icon:'ti-bulb', label:'Insights' },
    { section:'Social' },
    { href:'/copy-trading', icon:'ti-users', label:'Copy Trading', badge: followed?.length || null },
    { href:'/profile', icon:'ti-user-circle', label:'Profile', active:true },
    { href:'/market-place', icon:'ti-world', label:'Marketplace' },
    { section:'Account' },
    { href:'/settings', icon:'ti-settings', label:'Settings' },
    { href:'/support', icon:'ti-help-circle', label:'Support' },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-wave-sine" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Portfolio Value</div>
        <div className="in-sb-pill-val">{portfolioVal}</div>
        <div className="in-sb-pill-sub">Live from broker</div>
      </div>
      <div className="in-sb-scroll">
        {NAV.map((n, i) => n.section
          ? <div key={i} className="in-sb-section">{n.section}</div>
          : (
            <a key={i} className={`in-sb-link${n.active ? ' active' : ''}`} href={n.href}>
              <i className={`ti ${n.icon}`} />{n.label}
              {n.badge && <span className="in-sb-badge">{n.badge}</span>}
            </a>
          )
        )}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{ini}</div>
        <div>
          <div className="in-sb-user-name">{fullName}</div>
          <div className="in-sb-user-role">{planLabel}</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu, user = {}, notifications = [] }) {
  const ini     = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const unread  = notifications.filter(n => !n.is_read).length;
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">My <span>Profile</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon"><a href='/notification'>
        <i className="ti ti-bell" />
        {unread > 0 && <span className="in-notif-dot" />}</a>
      </div>
      <div className="in-tb-avatar">{ini || '?'}</div>
    </header>
  );
}

function ActivityTab({ items = [] }) {
  if (!items.length) return <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No activity yet.</div>;
  return (
    <div>
      {items.map((a, i) => {
        const cat  = a.category || 'Community';
        const meta = ACTIVITY_META[cat] || ACTIVITY_META.Community;
        return (
          <div key={i} className="pf-activity-item">
            <div className="pf-activity-icon" style={{ background:meta.bg, color:meta.col }}>
              <i className={`ti ${meta.icon}`} />
            </div>
            <div className="pf-activity-text">
              <div className="pf-activity-title">{a.description || a.title}</div>
              <div className="pf-activity-meta">
                <i className="ti ti-clock" style={{ fontSize:11 }} />
                {timeAgo(a.created_at)} · {cat}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WatchlistTab({ items = [] }) {
  const COLORS = ['rgba(245,158,11,.15)','rgba(96,165,250,.15)','rgba(52,211,153,.15)','rgba(200,245,96,.15)','rgba(167,139,250,.15)'];
  const TEXT   = ['#f59e0b','#60a5fa','#34d399','#c8f560','#a78bfa'];
  if (!items.length) return <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>Your watchlist is empty.</div>;
  return (
    <div>
      {items.map((w, i) => (
        <div key={i} className="pf-watch-item">
          <div className="pf-watch-icon" style={{ background:COLORS[i%COLORS.length], color:TEXT[i%TEXT.length] }}>
            {(w.symbol || '??').slice(0,2)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="pf-watch-ticker">{w.symbol}</div>
            <div className="pf-watch-name">{w.name || w.symbol}</div>
          </div>
          <div style={{ fontSize:10, color:'var(--muted)' }}>
            Added {fmtDate(w.added_at)}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsTab({ items = [] }) {
  if (!items.length) return <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No notifications.</div>;
  return (
    <div>
      {items.map((n, i) => (
        <div key={i} className="pf-notif-item">
          <div className="pf-notif-dot-wrap">
            <div className={!n.is_read ? 'pf-notif-unread' : 'pf-notif-read'} />
          </div>
          <div style={{ flex:1 }}>
            <div className="pf-notif-text">{n.body || n.message}</div>
            <div className="pf-notif-time">{timeAgo(n.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionsTab({ items = [] }) {
  if (!items.length) return <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No transactions found.</div>;
  return (
    <div>
      {items.map((tx, i) => {
        const m       = TX_META[tx.type] || TX_META.fee;
        const isCredit = tx.type === 'deposit' || tx.type === 'payout';
        const sign    = isCredit ? '+' : '−';
        const amtCol  = isCredit ? '#34d399' : '#f87171';
        const stCol   = tx.status === 'completed' ? '#34d399' : tx.status === 'failed' ? '#f87171' : '#f59e0b';
        return (
          <div key={i} className="pf-tx-item">
            <div className="pf-tx-icon" style={{ background:m.bg, color:m.col }}>
              <i className={`ti ${m.icon}`} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="pf-tx-desc">{tx.description || tx.type?.replace('_',' ')}</div>
              <div className="pf-tx-meta">{fmtDate(tx.created_at)} · {tx.currency}</div>
            </div>
            <div>
              <div className="pf-tx-amount" style={{ color:amtCol }}>{sign}{fmtMoney(Math.abs(tx.amount), tx.currency)}</div>
              <div className="pf-tx-status" style={{ color:stCol }}>{tx.status?.charAt(0).toUpperCase() + tx.status?.slice(1)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EditModal({ onClose, user = {} }) {
  return (
    <div className="pf-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal">
        <div className="pf-modal-head">
          <div className="pf-modal-title">Edit <em style={{ color:T.g, fontStyle:'italic' }}>Profile</em></div>
          <button className="in-tb-icon" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="pf-modal-body">
          <div className="pf-field-row">
            <div className="pf-field">
              <label>First Name</label>
              <input className="pf-input" defaultValue={user.first_name || ''} />
            </div>
            <div className="pf-field">
              <label>Last Name</label>
              <input className="pf-input" defaultValue={user.last_name || ''} />
            </div>
          </div>
          <div className="pf-field">
            <label>Handle</label>
            <input className="pf-input" defaultValue={user.handle || ''} />
          </div>
          <div className="pf-field">
            <label>Bio</label>
            <textarea className="pf-input pf-textarea" defaultValue={user.bio || ''} />
          </div>
          <div className="pf-field-row">
            <div className="pf-field">
              <label>Location</label>
              <input className="pf-input" defaultValue={user.location || ''} />
            </div>
            <div className="pf-field">
              <label>Website</label>
              <input className="pf-input" defaultValue={user.website || ''} />
            </div>
          </div>
          <div className="pf-field">
            <label>Timezone</label>
            <select className="pf-input" defaultValue={user.timezone || ''}>
              <option>EST (UTC −5)</option>
              <option>PST (UTC −8)</option>
              <option>UTC</option>
              <option>CET (UTC +1)</option>
              <option>WAT (UTC +1)</option>
              <option>EAT (UTC +3)</option>
              <option>IST (UTC +5:30)</option>
              <option>SGT (UTC +8)</option>
            </select>
          </div>
        </div>
        <div className="pf-modal-foot">
          <button className="in-btn in-btn-ghost in-btn-sm" onClick={onClose}>Cancel</button>
          <button className="in-btn in-btn-accent in-btn-sm" onClick={onClose}>
            <i className="ti ti-check" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Root ─────────────────────────────────────────────────────────── */
export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState('activity');
  const [editOpen, setEditOpen]       = useState(false);
  const [perfPeriod, setPerfPeriod]   = useState('30D');

  const { data, loading, error } = useProfileData();

  // user_settings: applied to :root as CSS vars
  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);
  const settingsApplied = useRef(false);

  // Sync userSettings from loaded data
  useEffect(() => {
    if (data?.settings && !settingsApplied.current) {
      settingsApplied.current = true;
      setUserSettings(s => ({ ...s, ...data.settings }));
    }
  }, [data?.settings]);

  // Apply CSS vars whenever userSettings change
  useEffect(() => {
    applyThemeVars(buildThemeVars(userSettings));
    if (userSettings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyThemeVars(buildThemeVars(userSettings));
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [userSettings]);

  const TABS = [
    { key:'activity',      label:'Activity',      icon:'ti-activity', show: userSettings.show_activity      },
    { key:'watchlist',     label:'Watchlist',     icon:'ti-eye',      show: userSettings.show_watchlist     },
    { key:'notifications', label:'Notifications', icon:'ti-bell',     show: true                            },
    { key:'transactions',  label:'Transactions',  icon:'ti-receipt',  show: true                            },
  ].filter(t => t.show);

  // If the current active tab was hidden, fall back to first visible tab
  const visibleTabKeys = TABS.map(t => t.key);
  const resolvedTab = visibleTabKeys.includes(activeTab) ? activeTab : (visibleTabKeys[0] || 'notifications');

  // ── Derived values from live data ──────────────────────────────────
  const user         = data?.user         || {};
  const sub          = data?.subscription;
  const plan         = sub?.subscription_plans;
  const usage        = data?.usage;
  const performance  = data?.performance  || [];
  const brokers      = data?.brokers      || [];
  const apps         = data?.apps         || [];
  const followed     = data?.followed     || [];

  const userInitials = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const fullName     = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  const joinedDate   = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month:'long', year:'numeric' }) : '—';

  // Days active
  const daysActive = user.created_at
    ? Math.floor((Date.now() - new Date(user.created_at)) / 86400000)
    : '—';

  // Summary cards from real data
  const SUMMARY = [
    { label:'Days Active',       value: String(daysActive),            sub:'Since joining',      icon:'ti-calendar-stats', bg:'rgba(200,245,96,.12)',  col:'#c8f560' },
    { label:'Traders Followed',  value: String(followed.length),       sub:'Active copy trades', icon:'ti-users',          bg:'rgba(96,165,250,.12)',  col:'#60a5fa' },
    { label:'Watchlist Items',   value: String(data?.watchlist?.length ?? '—'), sub:'Assets tracked', icon:'ti-eye', bg:'rgba(52,211,153,.12)', col:'#34d399' },
    { label:'Alerts Used',       value: String(usage?.alerts_used ?? '—'), sub:'This period',    icon:'ti-bell-ringing',   bg:'rgba(245,158,11,.12)',  col:'#f59e0b' },
  ];

  // Performance for selected period
  const perfEntry   = performance.find(p => p.period === perfPeriod) || null;
  const sparkData   = perfEntry?.sparkline || [];
  const maxSpark    = sparkData.length ? Math.max(...sparkData) : 1;
  const roiPositive = (perfEntry?.roi_pct ?? 0) >= 0;
  const roiCol      = roiPositive ? '#34d399' : '#f87171';
  const fmtPct      = (v) => v != null ? `${v >= 0 ? '+' : ''}${Number(v).toFixed(1)}%` : '—';

  // Loading / error states
  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16 }}>
        <div style={{ width:40, height:40, border:`3px solid rgba(200,245,96,.2)`, borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <div style={{ color:'var(--muted)', fontSize:13 }}>Loading your profile…</div>
        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    </>
  );

  if (error) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:12 }}>
        <i className="ti ti-alert-circle" style={{ fontSize:32, color:'var(--red)' }} />
        <div style={{ color:'var(--text)', fontWeight:600 }}>Failed to load profile</div>
        <div style={{ color:'var(--muted)', fontSize:12 }}>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {editOpen && <EditModal user={user} onClose={() => setEditOpen(false)} />}

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299,
        }} />
      )}

      <div className="in-shell">
        <Sidebar open={sidebarOpen} user={user} sub={sub} wallet={data?.wallet} followed={followed} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} notifications={data?.notifications || []} />

          <main className="in-main">

            {/* Hero banner */}
            <div className="pf-hero">
              <div className="pf-hero-grid" />
              <div className="pf-hero-glow" />
              <div className="pf-hero-actions">
                <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => setEditOpen(true)}>
                  <i className="ti ti-edit" /> Edit Profile
                </button>
                <button className="in-btn in-btn-accent in-btn-sm">
                  <i className="ti ti-share" /> Share
                </button>
              </div>
            </div>

            {/* Identity row */}
            <div className="pf-identity">
              <div className="pf-avatar-wrap">
                <div className="pf-avatar">
                  {user.avatar_url
                    ? <img src={user.avatar_url} style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} alt="" />
                    : userInitials}
                </div>
                <div className="pf-avatar-status" />
              </div>
              <div className="pf-identity-info">
                <div className="pf-name">{user.first_name} <em>{user.last_name}</em></div>
                <div className="pf-handle">
                  {user.handle || `@${(user.first_name || '').toLowerCase()}`}
                  {user.is_verified && (
                    <span className="in-badge in-badge-gold"><i className="ti ti-shield-check" style={{ fontSize:9, marginRight:3 }} />Verified</span>
                  )}
                </div>
                <div className="pf-tags">
                  <span className="in-badge in-badge-gold">{plan?.name ? `${plan.name.charAt(0).toUpperCase()+plan.name.slice(1)} Member` : 'Free'}</span>
                  {user.is_public && <span className="in-badge in-badge-muted"><i className="ti ti-world" style={{ fontSize:9, marginRight:3 }} />Public</span>}
                  {user.trading_goal && <span className="in-badge in-badge-blue">{user.trading_goal}</span>}
                </div>
              </div>
              <div className="pf-identity-actions">
                <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => setEditOpen(true)}>
                  <i className="ti ti-settings" /> Settings
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="pf-summary-row">
              {SUMMARY.map(s => (
                <div key={s.label} className="pf-summary-card">
                  <div className="pf-summary-icon" style={{ background:s.bg, color:s.col }}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <div className="pf-summary-label">{s.label}</div>
                  <div className="pf-summary-value" style={{ color:s.col }}>{s.value}</div>
                  <div className="pf-summary-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="pf-content">

              {/* Left column */}
              <div className="pf-left">

                {/* Tabs card */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-tabs">
                      {TABS.map(t => (
                        <button key={t.key} className={`pf-tab${resolvedTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                          <i className={`ti ${t.icon}`} />{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pf-card-body">
                    {resolvedTab === 'activity'      && <ActivityTab      items={data?.activity}      />}
                    {resolvedTab === 'watchlist'     && <WatchlistTab     items={data?.watchlist}     />}
                    {resolvedTab === 'notifications' && <NotificationsTab items={data?.notifications} />}
                    {resolvedTab === 'transactions'  && <TransactionsTab  items={data?.transactions}  />}
                  </div>
                </div>

                {/* Trading Performance */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-chart-bar" />Trading Performance</div>
                    <div className="pf-period-tabs" style={{ marginBottom:0 }}>
                      {PERF_PERIODS.map(p => (
                        <button key={p} className={`pf-period-tab${perfPeriod === p ? ' active' : ''}`} onClick={() => setPerfPeriod(p)}>
                          {PERF_LABELS[p]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pf-card-body">
                    {perfEntry ? (
                      <>
                        <div className="pf-perf-grid">
                          <div className="pf-perf-stat">
                            <div className="pf-perf-stat-val" style={{ color:roiCol }}>{fmtPct(perfEntry.roi_pct)}</div>
                            <div className="pf-perf-stat-label">Return</div>
                          </div>
                          <div className="pf-perf-stat">
                            <div className="pf-perf-stat-val" style={{ color:'#60a5fa' }}>{perfEntry.win_rate_pct != null ? `${perfEntry.win_rate_pct}%` : '—'}</div>
                            <div className="pf-perf-stat-label">Win Rate</div>
                          </div>
                          <div className="pf-perf-stat">
                            <div className="pf-perf-stat-val" style={{ color:'#f87171' }}>{perfEntry.max_drawdown_pct != null ? `−${perfEntry.max_drawdown_pct}%` : '—'}</div>
                            <div className="pf-perf-stat-label">Max Drawdown</div>
                          </div>
                          <div className="pf-perf-stat">
                            <div className="pf-perf-stat-val" style={{ color:'#a78bfa' }}>{perfEntry.total_trades ?? '—'}</div>
                            <div className="pf-perf-stat-label">Total Trades</div>
                          </div>
                        </div>
                        {sparkData.length > 0 && (
                          <div style={{ marginBottom:6 }}>
                            <div style={{ fontSize:10, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Equity Curve</div>
                            <div className="pf-sparkline">
                              {sparkData.map((v, i) => (
                                <div key={i} className="pf-spark-bar" style={{ height:`${(v/maxSpark)*100}%`, background:roiCol, opacity: 0.6 + (i/sparkData.length)*0.4 }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No performance data for this period.</div>
                    )}
                  </div>
                </div>

                {/* Followed traders */}
                {userSettings.show_followed_traders && (
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-users" />Traders You Follow</div>
                    <a href="#" className="in-btn in-btn-ghost in-btn-sm">View all</a>
                  </div>
                  <div className="pf-card-body">
                    {followed.length === 0 && (
                      <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>You're not copying any traders yet.</div>
                    )}
                    {followed.map((rel, i) => {
                      const tp   = rel.trader_profiles || {};
                      const tu   = tp.users || {};
                      const name = tp.display_name || `${tu.first_name || ''} ${tu.last_name || ''}`.trim() || tp.handle || '—';
                      const ini  = initials(name);
                      const BGCOLS = ['#1d4ed8','#7c3aed','#065f46','#b45309','#1e3a5f'];
                      const roi  = tp.badge_label ? tp.badge_label : '—';
                      const roiPositive = rel.realised_gain >= 0;
                      return (
                        <div key={i} className="pf-trader-item">
                          <div className="pf-trader-avatar" style={{ background:BGCOLS[i%BGCOLS.length], color:'#fff' }}>{ini}</div>
                          <div>
                            <div className="pf-trader-name">{name}</div>
                            <div className="pf-trader-sub">{tp.market || '—'} · {fmtMoney(rel.allocated_amount, rel.currency)} allocated</div>
                          </div>
                          <div className="pf-trader-roi" style={{ color: roiPositive ? '#34d399' : '#f87171' }}>
                            {rel.realised_gain != null ? fmtMoney(rel.realised_gain, rel.currency) : '—'}
                          </div>
                          <div className="pf-trader-action">
                            <button className="in-btn in-btn-ghost in-btn-sm">
                              <i className="ti ti-copy" /> Copy
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

              </div>

              {/* Right column */}
              <div className="pf-right">

                {/* Subscription */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-credit-card" />Subscription</div>
                  </div>
                  <div className="pf-card-body">
                    <div className="pf-plan-card">
                      <div className="pf-plan-icon">⚡</div>
                      <div>
                        <div className="pf-plan-name">{plan ? `${plan.name.charAt(0).toUpperCase()+plan.name.slice(1)} Plan` : 'Free Plan'}</div>
                        <div className="pf-plan-desc">
                          {sub?.current_period_end ? `Renews ${fmtDate(sub.current_period_end)}` : 'No active subscription'}
                          {plan?.monthly_price ? ` · $${plan.monthly_price}/mo` : ''}
                        </div>
                      </div>
                      <div className="pf-plan-upgrade">
                        <button className="in-btn in-btn-ghost in-btn-sm">Manage</button>
                      </div>
                    </div>
                    <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {[
                        { label:'Alerts used',     used: usage?.alerts_used    ?? 0, total: plan?.max_alerts     ?? '∞' },
                        { label:'Watchlist spots', used: usage?.watchlist_used ?? 0, total: plan?.max_watchlist  ?? '∞' },
                      ].map(u => {
                        const pct = typeof u.total === 'number' ? (u.used / u.total) * 100 : 0;
                        return (
                          <div key={u.label} style={{ background:T.s2, border:`1px solid ${T.br}`, borderRadius:10, padding:'10px 12px' }}>
                            <div style={{ fontSize:10, color:T.nt, marginBottom:6, fontWeight:600 }}>{u.label}</div>
                            <div style={{ height:4, background:T.br2, borderRadius:4, overflow:'hidden', marginBottom:6 }}>
                              <div style={{ height:'100%', width:`${Math.min(pct, 100)}%`, background:T.g, borderRadius:4 }} />
                            </div>
                            <div style={{ fontSize:11, fontFamily:T.mono, color:T.gr }}>{u.used} <span style={{ color:T.nt }}>/ {u.total}</span></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Broker Connections */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-plug-connected" />Broker Connections</div>
                    <button className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-plus" /> Add</button>
                  </div>
                  <div className="pf-card-body">
                    {brokers.length === 0 && (
                      <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No broker connected yet.</div>
                    )}
                    {brokers.map((b, i) => {
                      const { bg, col } = BROKER_COLORS[i % BROKER_COLORS.length];
                      const ini = (b.broker_name || b.broker_id || '??').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
                      return (
                        <div key={i} className="pf-broker-item">
                          <div className="pf-broker-logo" style={{ background:bg, color:col }}>{ini}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div className="pf-broker-name">{b.broker_name}</div>
                            <div className="pf-broker-meta">{b.platform} · {b.server_name}</div>
                          </div>
                          <div>
                            <div className="pf-broker-balance" style={{ color:col }}>{fmtMoney(b.balance, b.currency)}</div>
                            <div className="pf-broker-type">
                              <span className={`pf-live-pill ${b.account_type}`}>
                                {b.account_type === 'live' ? '● Live' : '○ Demo'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Connected Apps */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-apps" />Connected Apps</div>
                  </div>
                  <div className="pf-card-body">
                    {apps.length === 0 && (
                      <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No apps connected.</div>
                    )}
                    <div className="pf-apps-grid">
                      {apps.map((app, i) => {
                        const key  = (app.app_name || '').toLowerCase();
                        const meta = APP_META[key] || { icon:'ti-plug', bg:'rgba(100,116,139,.12)', col:'#64748b' };
                        const name = app.app_name ? app.app_name.charAt(0).toUpperCase() + app.app_name.slice(1) : '—';
                        return (
                          <div key={i} className="pf-app-item">
                            <div className="pf-app-icon" style={{ background:meta.bg, color:meta.col }}>
                              <i className={`ti ${meta.icon}`} />
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div className="pf-app-name">{name}</div>
                              <div className="pf-app-status" style={{ color: app.is_connected ? 'var(--green)' : 'var(--muted)' }}>
                                {app.is_connected ? 'Connected' : 'Disconnected'}
                              </div>
                            </div>
                            <div className="pf-app-toggle">
                              <button className={`pf-toggle ${app.is_connected ? 'on' : 'off'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-user" />About</div>
                    <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => setEditOpen(true)}>
                      <i className="ti ti-edit" />
                    </button>
                  </div>
                  <div className="pf-card-body">
                    <p style={{ fontSize:13, color:T.nt, lineHeight:1.65, marginBottom:16 }}>{user.bio || 'No bio set yet.'}</p>
                    {[
                      { icon:'ti-map-pin',  label:'Location', val: user.location  || '—' },
                      { icon:'ti-calendar', label:'Joined',   val: joinedDate             },
                      { icon:'ti-world',    label:'Website',  val: user.website   || '—' },
                      { icon:'ti-clock',    label:'Timezone', val: user.timezone  || '—' },
                      { icon:'ti-flag',     label:'Country',  val: user.country_name || '—' },
                    ].map(r => (
                      <div key={r.label} className="pf-info-row">
                        <i className={`ti ${r.icon}`} />
                        <span className="pf-info-label">{r.label}</span>
                        <span className="pf-info-val">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account actions */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title" style={{ color:T.rd }}>
                      <i className="ti ti-alert-triangle" style={{ color:T.rd }} />Account
                    </div>
                  </div>
                  <div className="pf-card-body" style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    <button className="in-btn in-btn-ghost in-btn-sm" style={{ justifyContent:'flex-start', width:'100%' }}>
                      <i className="ti ti-download" /> Export Data
                    </button>
                    <button className="in-btn in-btn-ghost in-btn-sm" style={{ justifyContent:'flex-start', width:'100%' }}>
                      <i className="ti ti-lock" /> Change Password
                    </button>
                    <button className="in-btn in-btn-ghost in-btn-sm" style={{ justifyContent:'flex-start', width:'100%' }} onClick={() => setEditOpen(true)}>
                      <i className="ti ti-eye-off" /> {user.is_public ? 'Make Profile Private' : 'Make Profile Public'}
                    </button>
                    <button className="in-btn in-btn-danger in-btn-sm" style={{ justifyContent:'flex-start', width:'100%' }}>
                      <i className="ti ti-trash" /> Delete Account
                    </button>
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