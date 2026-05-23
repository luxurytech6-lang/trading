import React, { useState } from 'react';

/* ─── Design tokens (matches existing site shell) ──────────────────── */
const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 14px; }

  :root {
    --bg:#080b10; --surface:#0e1219; --surface2:#141922;
    --border:#1e2535; --border2:#2a3347;
    --text:#e2e8f0; --muted:#64748b; --faint:#374151;
    --accent:#c8f560; --accent-dim:rgba(200,245,96,.12); --accent-glow:rgba(200,245,96,.06);
    --green:#34d399; --green-dim:rgba(52,211,153,.12);
    --red:#f87171; --red-dim:rgba(248,113,113,.12);
    --blue:#60a5fa; --blue-dim:rgba(96,165,250,.12);
    --purple:#a78bfa; --purple-dim:rgba(167,139,250,.12);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,.12);
    --sidebar-w:256px; --topbar-h:60px;
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
  .in-sb-pill { margin:12px 16px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.18); border-radius:var(--r-md); padding:10px 14px; flex-shrink:0; }
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
    box-shadow:0 0 12px rgba(200,245,96,.3);
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
    box-shadow:0 0 10px rgba(200,245,96,.25);
  }
  .in-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; }
  .in-hamburger span { display:block; width:20px; height:2px; background:var(--text); border-radius:2px; }

  /* ── Main ── */
  .in-main { flex:1; overflow-y:auto; overflow-x:hidden; padding:24px 28px 40px; }

  /* Buttons */
  .in-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    border-radius:var(--r-sm); font-family:var(--sans); font-weight:600;
    cursor:pointer; transition:all .15s; border:none; text-decoration:none; white-space:nowrap;
  }
  .in-btn-sm { font-size:12px; padding:7px 14px; }
  .in-btn-md { font-size:13px; padding:9px 18px; }
  .in-btn-accent { background:var(--accent); color:#000; }
  .in-btn-accent:hover { opacity:.88; box-shadow:0 0 20px rgba(200,245,96,.3); }
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
      linear-gradient(rgba(200,245,96,.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(200,245,96,.04) 1px,transparent 1px);
    background-size:40px 40px;
  }
  .pf-hero-glow {
    position:absolute; top:-80px; left:50%; transform:translateX(-50%);
    width:500px; height:300px; border-radius:50%;
    background:radial-gradient(ellipse,rgba(200,245,96,.07) 0%,transparent 70%);
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
    border:3px solid var(--bg); box-shadow:0 0 24px rgba(200,245,96,.35);
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
  .pf-summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
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
  .pf-content { display:grid; grid-template-columns:1fr 320px; gap:20px; }
  .pf-left { display:flex; flex-direction:column; gap:16px; }
  .pf-right { display:flex; flex-direction:column; gap:16px; }

  /* Section card */
  .pf-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; }
  .pf-card-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px; border-bottom:1px solid var(--border);
  }
  .pf-card-title { font-size:13px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .pf-card-title i { font-size:16px; color:var(--accent); }
  .pf-card-body { padding:16px 20px; }

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
    background:linear-gradient(135deg,rgba(200,245,96,.08) 0%,rgba(200,245,96,.03) 100%);
    border:1px solid rgba(200,245,96,.2); border-radius:var(--r-md); padding:16px;
    display:flex; align-items:center; gap:14px;
  }
  .pf-plan-icon { width:40px; height:40px; border-radius:10px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.25); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
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
    background:var(--surface2); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:9px 12px; font-size:13px; outline:none;
    transition:border-color .15s; width:100%;
  }
  .pf-input:focus { border-color:var(--accent); }
  .pf-textarea { resize:vertical; min-height:80px; }
  .pf-field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

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

/* ─── Data ───────────────────────────────────────────────────────── */
const USER = {
  name: 'Alex',
  surname: 'Rivera',
  handle: '@alexrivera',
  plan: 'Pro',
  initials: 'AR',
  bio: 'Passionate about markets and data. Exploring trading strategies on my own terms — one insight at a time.',
  location: 'New York, USA',
  joined: 'March 2021',
  website: 'alexrivera.trade',
  timezone: 'EST (UTC −5)',
  followers: 284,
  following: 61,
};

const SUMMARY = [
  { label: 'Days Active',    value: '847',     sub: 'Since joining',       icon: 'ti-calendar-stats', bg: 'rgba(200,245,96,.12)',  col: '#c8f560' },
  { label: 'Traders Followed', value: '24',   sub: 'Across all markets',  icon: 'ti-users',          bg: 'rgba(96,165,250,.12)',  col: '#60a5fa' },
  { label: 'Watchlist Items', value: '38',    sub: 'Assets tracked',      icon: 'ti-eye',            bg: 'rgba(52,211,153,.12)',  col: '#34d399' },
  { label: 'Alerts Triggered', value: '12',  sub: 'This week',            icon: 'ti-bell-ringing',   bg: 'rgba(245,158,11,.12)',  col: '#f59e0b' },
];

const ACTIVITY = [
  { icon:'ti-eye',          iconBg:'rgba(96,165,250,.12)',   iconCol:'#60a5fa', title:<>Added <strong>NVDA</strong> to your watchlist</>,          meta:'10 min ago · Watchlist' },
  { icon:'ti-bell',         iconBg:'rgba(245,158,11,.12)',   iconCol:'#f59e0b', title:<>Price alert triggered on <strong>BTC/USD</strong> — above $67K</>,   meta:'42 min ago · Alert' },
  { icon:'ti-user-plus',    iconBg:'rgba(52,211,153,.12)',   iconCol:'#34d399', title:<>Started following <strong>Maria Chen</strong></>,           meta:'2h ago · Social' },
  { icon:'ti-heart',        iconBg:'rgba(248,113,113,.12)',  iconCol:'#f87171', title:<>Liked a signal post by <strong>@tradeflow_kai</strong></>,  meta:'3h ago · Community' },
  { icon:'ti-message',      iconBg:'rgba(167,139,250,.12)', iconCol:'#a78bfa',  title:<>Commented on <strong>SPX Iron Condor</strong> strategy</>,  meta:'Yesterday · Community' },
  { icon:'ti-star',         iconBg:'rgba(200,245,96,.12)',   iconCol:'#c8f560', title:<>Saved <strong>Momentum Scalp</strong> to favourites</>,      meta:'2 days ago · Signals' },
];

const WATCHLIST = [
  { ticker:'BTC/USD', name:'Bitcoin',        price:'$67,440', chg:'+2.4%', pos:true,  bg:'rgba(245,158,11,.15)', col:'#f59e0b' },
  { ticker:'ETH/USD', name:'Ethereum',       price:'$3,490',  chg:'+1.8%', pos:true,  bg:'rgba(96,165,250,.15)', col:'#60a5fa' },
  { ticker:'NVDA',    name:'Nvidia Corp.',   price:'$892.40', chg:'+0.7%', pos:true,  bg:'rgba(52,211,153,.15)', col:'#34d399' },
  { ticker:'SPX',     name:'S&P 500 Index',  price:'$5,190',  chg:'-0.3%', pos:false, bg:'rgba(200,245,96,.15)', col:'#c8f560' },
  { ticker:'GLD',     name:'Gold ETF',       price:'$2,295',  chg:'-0.8%', pos:false, bg:'rgba(167,139,250,.15)',col:'#a78bfa' },
];

const FOLLOWED_TRADERS = [
  { initials:'MC', bg:'#1d4ed8', name:'Maria Chen',    sub:'Crypto specialist · +38.1% YTD',  roi:'+38.1%', col:'#34d399' },
  { initials:'KJ', bg:'#7c3aed', name:'Kai Johnson',   sub:'Equities trader · +21.4% YTD',    roi:'+21.4%', col:'#34d399' },
  { initials:'SP', bg:'#065f46', name:'Sara Park',     sub:'Options writer · +14.9% YTD',     roi:'+14.9%', col:'#c8f560' },
  { initials:'DL', bg:'#b45309', name:'Dev Lal',       sub:'Macro trader · −2.1% YTD',        roi:'−2.1%',  col:'#f87171' },
];

const NOTIFICATIONS = [
  { text:<>Your price alert on <strong>ETH/USD</strong> reached $3,500</>, time:'5 min ago',   unread:true  },
  { text:<><strong>Kai Johnson</strong> published a new signal</>,           time:'1h ago',    unread:true  },
  { text:<>Your watchlist was updated automatically (3 assets)</>,           time:'3h ago',    unread:false },
  { text:<>Weekly digest: your top movers ready</>,                          time:'Yesterday', unread:false },
  { text:<>New feature: AI price alerts now available</>,                    time:'2 days ago',unread:false },
];

/* ─── Sub-components ──────────────────────────────────────────────── */

function Sidebar({ open }) {
  const NAV = [
    { section:'Markets' },
    { icon:'ti-layout-dashboard', label:'Dashboard' },
    { icon:'ti-chart-candlestick', label:'Trading' },
    { icon:'ti-bulb', label:'Insights' },
    { section:'Social' },
    { icon:'ti-users', label:'Copy Trading', badge:'3' },
    { icon:'ti-user-circle', label:'Profile', active:true },
    { icon:'ti-world', label:'Marketplace' },
    { section:'Account' },
    { icon:'ti-settings', label:'Settings' },
    { icon:'ti-help-circle', label:'Support' },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-wave-sine" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Portfolio Value</div>
        <div className="in-sb-pill-val">$12,480</div>
        <div className="in-sb-pill-sub">↑ +$142 today (+1.15%)</div>
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
        <div className="in-sb-avatar">AR</div>
        <div>
          <div className="in-sb-user-name">Alex Rivera</div>
          <div className="in-sb-user-role">Pro Member</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu }) {
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">My <span>Profile</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon">
        <i className="ti ti-bell" />
        <span className="in-notif-dot" />
      </div>
      <div className="in-tb-avatar">AR</div>
    </header>
  );
}

function ActivityTab() {
  return (
    <div>
      {ACTIVITY.map((a, i) => (
        <div key={i} className="pf-activity-item">
          <div className="pf-activity-icon" style={{ background:a.iconBg, color:a.iconCol }}>
            <i className={`ti ${a.icon}`} />
          </div>
          <div className="pf-activity-text">
            <div className="pf-activity-title">{a.title}</div>
            <div className="pf-activity-meta">
              <i className="ti ti-clock" style={{ fontSize:11 }} />{a.meta}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WatchlistTab() {
  return (
    <div>
      {WATCHLIST.map((w, i) => (
        <div key={i} className="pf-watch-item">
          <div className="pf-watch-icon" style={{ background:w.bg, color:w.col }}>
            {w.ticker.slice(0,2)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="pf-watch-ticker">{w.ticker}</div>
            <div className="pf-watch-name">{w.name}</div>
          </div>
          <div>
            <div className="pf-watch-price">{w.price}</div>
            <div className="pf-watch-chg" style={{ color:w.pos ? '#34d399' : '#f87171' }}>{w.chg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      {NOTIFICATIONS.map((n, i) => (
        <div key={i} className="pf-notif-item">
          <div className="pf-notif-dot-wrap">
            <div className={n.unread ? 'pf-notif-unread' : 'pf-notif-read'} />
          </div>
          <div style={{ flex:1 }}>
            <div className="pf-notif-text">{n.text}</div>
            <div className="pf-notif-time">{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditModal({ onClose }) {
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
              <input className="pf-input" defaultValue="Alex" />
            </div>
            <div className="pf-field">
              <label>Last Name</label>
              <input className="pf-input" defaultValue="Rivera" />
            </div>
          </div>
          <div className="pf-field">
            <label>Handle</label>
            <input className="pf-input" defaultValue="@alexrivera" />
          </div>
          <div className="pf-field">
            <label>Bio</label>
            <textarea className="pf-input pf-textarea" defaultValue={USER.bio} />
          </div>
          <div className="pf-field-row">
            <div className="pf-field">
              <label>Location</label>
              <input className="pf-input" defaultValue="New York, USA" />
            </div>
            <div className="pf-field">
              <label>Website</label>
              <input className="pf-input" defaultValue="alexrivera.trade" />
            </div>
          </div>
          <div className="pf-field">
            <label>Timezone</label>
            <select className="pf-input">
              <option>EST (UTC −5)</option>
              <option>PST (UTC −8)</option>
              <option>UTC</option>
              <option>CET (UTC +1)</option>
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

  const TABS = [
    { key:'activity',      label:'Activity',      icon:'ti-activity'  },
    { key:'watchlist',     label:'Watchlist',     icon:'ti-eye'       },
    { key:'notifications', label:'Notifications', icon:'ti-bell'      },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {editOpen && <EditModal onClose={() => setEditOpen(false)} />}

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
                <div className="pf-avatar">AR</div>
                <div className="pf-avatar-status" />
              </div>
              <div className="pf-identity-info">
                <div className="pf-name">Alex <em>Rivera</em></div>
                <div className="pf-handle">
                  {USER.handle}
                  <span className="in-badge in-badge-gold"><i className="ti ti-shield-check" style={{ fontSize:9, marginRight:3 }} />Verified</span>
                </div>
                <div className="pf-tags">
                  <span className="in-badge in-badge-gold">Pro Member</span>
                  <span className="in-badge in-badge-blue">{USER.followers} Followers</span>
                  <span className="in-badge in-badge-muted">Following {USER.following}</span>
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

                {/* Activity / Watchlist / Notifications */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-tabs">
                      {TABS.map(t => (
                        <button key={t.key} className={`pf-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                          <i className={`ti ${t.icon}`} />{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pf-card-body">
                    {activeTab === 'activity'      && <ActivityTab />}
                    {activeTab === 'watchlist'     && <WatchlistTab />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                  </div>
                </div>

                {/* Followed traders */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-users" />Traders You Follow</div>
                    <a href="#" className="in-btn in-btn-ghost in-btn-sm">View all</a>
                  </div>
                  <div className="pf-card-body">
                    {FOLLOWED_TRADERS.map((f, i) => (
                      <div key={i} className="pf-trader-item">
                        <div className="pf-trader-avatar" style={{ background:f.bg, color:'#fff' }}>{f.initials}</div>
                        <div>
                          <div className="pf-trader-name">{f.name}</div>
                          <div className="pf-trader-sub">{f.sub}</div>
                        </div>
                        <div className="pf-trader-roi" style={{ color:f.col }}>{f.roi}</div>
                        <div className="pf-trader-action">
                          <button className="in-btn in-btn-ghost in-btn-sm">
                            <i className="ti ti-copy" /> Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right column */}
              <div className="pf-right">

                {/* Current plan */}
                <div className="pf-card">
                  <div className="pf-card-head">
                    <div className="pf-card-title"><i className="ti ti-credit-card" />Subscription</div>
                  </div>
                  <div className="pf-card-body">
                    <div className="pf-plan-card">
                      <div className="pf-plan-icon">⚡</div>
                      <div>
                        <div className="pf-plan-name">Pro Plan</div>
                        <div className="pf-plan-desc">Renews Jun 15, 2026 · $29/mo</div>
                      </div>
                      <div className="pf-plan-upgrade">
                        <button className="in-btn in-btn-ghost in-btn-sm">Manage</button>
                      </div>
                    </div>
                    <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {[
                        { label:'Alerts/month', used:12, total:50  },
                        { label:'Watchlist spots', used:38, total:100 },
                      ].map(u => (
                        <div key={u.label} style={{ background:T.s2, border:`1px solid ${T.br}`, borderRadius:10, padding:'10px 12px' }}>
                          <div style={{ fontSize:10, color:T.nt, marginBottom:6, fontWeight:600 }}>{u.label}</div>
                          <div style={{ height:4, background:T.br2, borderRadius:4, overflow:'hidden', marginBottom:6 }}>
                            <div style={{ height:'100%', width:`${(u.used/u.total)*100}%`, background:T.g, borderRadius:4 }} />
                          </div>
                          <div style={{ fontSize:11, fontFamily:T.mono, color:T.gr }}>{u.used} <span style={{ color:T.nt }}>/ {u.total}</span></div>
                        </div>
                      ))}
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
                    <p style={{ fontSize:13, color:T.nt, lineHeight:1.65, marginBottom:16 }}>{USER.bio}</p>
                    {[
                      { icon:'ti-map-pin',  label:'Location', val:USER.location  },
                      { icon:'ti-calendar', label:'Joined',   val:USER.joined    },
                      { icon:'ti-world',    label:'Website',  val:USER.website   },
                      { icon:'ti-clock',    label:'Timezone', val:USER.timezone  },
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
                    <button className="in-btn in-btn-ghost in-btn-sm" style={{ justifyContent:'flex-start', width:'100%' }}>
                      <i className="ti ti-eye-off" /> Make Profile Private
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