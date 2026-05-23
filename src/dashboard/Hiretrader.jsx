import React, { useState } from 'react';

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 14px; }

  :root {
    --bg:          #080b10;
    --surface:     #0e1219;
    --surface2:    #141922;
    --border:      #1e2535;
    --border2:     #2a3347;
    --text:        #e2e8f0;
    --muted:       #64748b;
    --faint:       #374151;
    --accent:      #c8f560;
    --accent-dim:  rgba(200,245,96,.12);
    --accent-glow: rgba(200,245,96,.06);
    --green:       #34d399;
    --green-dim:   rgba(52,211,153,.12);
    --red:         #f87171;
    --red-dim:     rgba(248,113,113,.12);
    --blue:        #60a5fa;
    --purple:      #a78bfa;
    --orange:      #fb923c;
    --sidebar-w:   256px;
    --topbar-h:    60px;
    --sans:   'Space Grotesk', sans-serif;
    --serif:  'Instrument Serif', serif;
    --mono:   'JetBrains Mono', monospace;
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px;
  }

  body, #root {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }
  button { font-family: var(--sans); cursor: pointer; border: none; background: none; }
  input, select, textarea { font-family: var(--sans); }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── Shell ── */
  .ht-shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .ht-sidebar {
    grid-column: 1 !important;
    grid-row: 1 !important;
    background: var(--surface) !important;
    border-right: 1px solid var(--border) !important;
    display: flex !important;
    flex-direction: column !important;
    width: var(--sidebar-w) !important;
    min-width: var(--sidebar-w) !important;
    height: 100vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    position: relative !important;
    top: auto !important; left: auto !important;
    transform: none !important;
    z-index: 100 !important;
    transition: transform .25s cubic-bezier(.4,0,.2,1) !important;
    flex-shrink: 0 !important;
  }
  .ht-sidebar::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity: .15; pointer-events: none;
  }

  /* Brand */
  .ht-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .ht-brand-icon {
    width: 34px; height: 34px; background: var(--accent); border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ht-brand-icon i { font-size: 18px; color: #000; }
  .ht-brand-name { font-size: 16px; font-weight: 700; letter-spacing: -.3px; }
  .ht-brand-name em { color: var(--accent); font-style: normal; }

  /* Portfolio pill */
  .ht-sb-pill {
    margin: 12px 16px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,245,96,.18);
    border-radius: var(--r-md); padding: 10px 14px; flex-shrink: 0;
  }
  .ht-sb-pill-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .ht-live-dot {
    width: 6px; height: 6px; background: var(--green);
    border-radius: 50%; animation: ht-pulse 2s infinite; flex-shrink: 0;
  }
  @keyframes ht-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ht-sb-pill-val { font-family: var(--mono); font-size: 19px; font-weight: 600; color: var(--accent); letter-spacing: -.5px; }
  .ht-sb-pill-sub { font-size: 11px; color: var(--green); margin-top: 3px; }

  /* Nav */
  .ht-sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
  .ht-sb-section {
    padding: 10px 20px 4px; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--faint);
  }
  .ht-sb-link {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 20px; font-size: 13px; font-weight: 500;
    color: var(--muted); border-left: 2px solid transparent;
    transition: all .15s; cursor: pointer; text-decoration: none;
  }
  .ht-sb-link i { font-size: 18px; flex-shrink: 0; }
  .ht-sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .ht-sb-link.active { color: var(--accent); background: var(--accent-dim); border-left-color: var(--accent); }
  .ht-sb-link.active i { filter: drop-shadow(0 0 6px var(--accent)); }
  .ht-sb-badge {
    margin-left: auto; font-size: 9px; font-weight: 700;
    background: var(--accent); color: #000; padding: 2px 6px; border-radius: 5px;
  }

  /* User block */
  .ht-sb-user {
    flex-shrink: 0; border-top: 1px solid var(--border);
    padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  }
  .ht-sb-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 0 12px rgba(200,245,96,.3);
  }
  .ht-sb-user-name { font-size: 13px; font-weight: 700; }
  .ht-sb-user-role { font-size: 10px; color: var(--accent); margin-top: 1px; }

  /* ── Right panel ── */
  .ht-right {
    grid-column: 2;
    display: flex; flex-direction: column;
    height: 100vh; overflow: hidden;
  }

  /* ── Topbar ── */
  .ht-topbar {
    height: var(--topbar-h); flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 28px; background: var(--surface);
    border-bottom: 1px solid var(--border); gap: 16px; z-index: 50;
  }
  .ht-topbar-title { font-family: var(--serif); font-size: 20px; color: var(--text); flex: 1; }
  .ht-topbar-title span { color: var(--accent); font-style: italic; }
  .ht-topbar-icon {
    width: 36px; height: 36px; border-radius: var(--r-sm);
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s; color: var(--muted); font-size: 18px; position: relative;
  }
  .ht-topbar-icon:hover { border-color: var(--border2); color: var(--text); }
  .ht-notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 6px; height: 6px; background: var(--red); border-radius: 50%;
    border: 1.5px solid var(--surface);
  }
  .ht-topbar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 0 10px rgba(200,245,96,.25);
  }
  .ht-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
  .ht-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main scroll area ── */
  .ht-main { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px 28px 40px; }

  /* Page header */
  .ht-page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
  }
  .ht-page-title { font-family: var(--serif); font-size: 28px; line-height: 1.2; }
  .ht-page-title em { color: var(--accent); font-style: italic; }
  .ht-page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .ht-header-actions { display: flex; gap: 8px; }

  /* ── Buttons ── */
  .ht-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; border-radius: var(--r-sm); font-family: var(--sans); font-weight: 600;
    cursor: pointer; transition: all .15s; border: none; white-space: nowrap; text-decoration: none;
  }
  .ht-btn-sm  { font-size: 12px; padding: 7px 14px; }
  .ht-btn-md  { font-size: 13px; padding: 9px 18px; }
  .ht-btn-accent { background: var(--accent); color: #000; }
  .ht-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .ht-btn-ghost { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
  .ht-btn-ghost:hover { border-color: var(--border2); }
  .ht-btn-full { width: 100%; justify-content: center; }

  /* ── Metrics row ── */
  .ht-metrics {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px;
  }
  .ht-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px 20px;
    position: relative; overflow: hidden; transition: border-color .2s, transform .2s;
  }
  .ht-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .ht-metric::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .3;
  }
  .ht-metric-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 12px;
  }
  .ht-metric-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .ht-metric-value { font-family: var(--mono); font-size: 20px; font-weight: 600; line-height: 1; margin-bottom: 5px; letter-spacing: -.5px; }
  .ht-metric-sub { font-size: 11px; color: var(--muted); }

  /* ── Two column layout ── */
  .ht-grid-2 { display: grid; grid-template-columns: 1fr 360px; gap: 18px; margin-bottom: 22px; }

  /* ── Card ── */
  .ht-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 22px; transition: border-color .2s;
  }
  .ht-card:hover { border-color: var(--border2); }
  .ht-card-title {
    font-size: 11px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
  }
  .ht-card-subtitle { font-size: 13px; color: var(--muted); margin-bottom: 18px; }

  /* Form */
  .ht-form-group { margin-bottom: 14px; }
  .ht-form-label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px; font-weight: 600; }
  .ht-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 10px 12px; font-size: 13px; color: var(--text);
    font-family: var(--sans); outline: none; transition: border-color .15s; resize: none;
  }
  .ht-input:focus { border-color: var(--accent); }

  /* How it works */
  .ht-how-step {
    display: flex; gap: 14px; padding-bottom: 18px; margin-bottom: 18px;
    border-bottom: 1px solid var(--border); position: relative;
  }
  .ht-how-step:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
  .ht-how-num {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: var(--accent-dim); border: 1px solid rgba(200,245,96,.25);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--accent);
  }
  .ht-how-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .ht-how-desc { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* Security card */
  .ht-security {
    background: rgba(52,211,153,.05); border: 1px solid rgba(52,211,153,.2);
    border-radius: var(--r-lg); padding: 16px 18px; margin-top: 14px;
    display: flex; gap: 14px; align-items: flex-start;
  }
  .ht-security i { font-size: 22px; color: var(--green); flex-shrink: 0; margin-top: 1px; }
  .ht-security-title { font-size: 13px; font-weight: 700; color: var(--green); margin-bottom: 4px; }
  .ht-security-body { font-size: 12px; color: var(--muted); line-height: 1.55; }

  /* ── Professionals grid ── */
  .ht-pros-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
  }
  .ht-filter-select {
    background: var(--surface2); border: 1px solid var(--border); color: var(--text);
    border-radius: var(--r-sm); padding: 7px 12px; font-size: 12px;
    font-family: var(--sans); outline: none; cursor: pointer; transition: border-color .15s;
  }
  .ht-filter-select:hover { border-color: var(--border2); }

  .ht-traders-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

  .ht-trader-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px;
    transition: all .18s; cursor: default;
  }
  .ht-trader-card:hover { border-color: var(--border2); transform: translateY(-1px); }

  .ht-trader-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .ht-trader-av {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: #000; flex-shrink: 0;
  }
  .ht-trader-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .ht-trader-handle { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .ht-specialty-badge {
    margin-left: auto; font-size: 10px; font-weight: 700; padding: 3px 8px;
    border-radius: 5px; background: var(--accent-dim); color: var(--accent); white-space: nowrap;
  }

  .ht-trader-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .ht-stat-box { background: var(--surface); border-radius: var(--r-sm); padding: 10px 12px; }
  .ht-stat-val { font-family: var(--mono); font-size: 14px; font-weight: 700; }
  .ht-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; }

  .ht-trader-meta { font-size: 11px; color: var(--muted); margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px; }
  .ht-trader-meta strong { color: var(--text); }
  .ht-trader-meta .gold { color: var(--accent); }

  /* ── Modal ── */
  .ht-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 600; padding: 16px;
  }
  .ht-modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto;
    padding: 24px; position: relative;
  }
  .ht-modal-close {
    position: absolute; top: 14px; right: 14px;
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); border-radius: 8px; width: 28px; height: 28px;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center; transition: all .15s;
  }
  .ht-modal-close:hover { border-color: var(--red); color: var(--red); }
  .ht-modal-head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .ht-modal-av {
    width: 52px; height: 52px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 16px; color: #000; flex-shrink: 0;
  }
  .ht-modal-name { font-family: var(--serif); font-size: 20px; margin-bottom: 4px; }
  .ht-modal-sub { font-size: 12px; color: var(--muted); }
  .ht-modal-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
    background: var(--surface2); border-radius: 10px; padding: 14px; margin-bottom: 20px;
  }
  .ht-modal-stat-val { font-family: var(--mono); font-size: 14px; font-weight: 700; text-align: center; }
  .ht-modal-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 3px; text-align: center; }
  .ht-modal-notice {
    background: rgba(52,211,153,.06); border: 1px solid rgba(52,211,153,.2);
    border-radius: var(--r-sm); padding: 10px 12px; margin-bottom: 16px;
    font-size: 12px; color: var(--muted); line-height: 1.5;
    display: flex; gap: 8px; align-items: flex-start;
  }
  .ht-modal-notice i { color: var(--green); font-size: 14px; flex-shrink: 0; margin-top: 1px; }

  /* ── Responsive ── */
  @media (max-width: 1200px) { .ht-traders-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 1100px) {
    .ht-metrics { grid-template-columns: repeat(2, 1fr); }
    .ht-grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .ht-shell { grid-template-columns: 1fr !important; }
    .ht-sidebar {
      position: fixed !important; top: 0 !important; left: 0 !important;
      transform: translateX(-100%) !important; z-index: 300 !important;
    }
    .ht-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .ht-right { grid-column: 1; }
    .ht-hamburger { display: flex; }
    .ht-traders-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .ht-main { padding: 16px; }
    .ht-topbar { padding: 0 16px; }
    .ht-traders-grid { grid-template-columns: 1fr; }
    .ht-metrics { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */
const PROFESSIONALS = [
  { name:'Vincent Ford',  handle:'vForce',  avatar:'VF', color:'#c8f560', specialty:'Crypto', return:'142%', winRate:'73%', minCapital:'$5,000',  fee:'20% of profits', clients:48 },
  { name:'Sofia Mendez',  handle:'sofiaM',  avatar:'SM', color:'#60a5fa', specialty:'Forex',  return:'89%',  winRate:'69%', minCapital:'$2,000',  fee:'15% of profits', clients:31 },
  { name:'Riku Osaka',    handle:'rikuPRO', avatar:'RO', color:'#a78bfa', specialty:'Stocks', return:'67%',  winRate:'65%', minCapital:'$1,000',  fee:'12% of profits', clients:22 },
  { name:'Arjun Joshi',   handle:'arjunFX', avatar:'AJ', color:'#fb923c', specialty:'Forex',  return:'196%', winRate:'61%', minCapital:'$10,000', fee:'25% of profits', clients:67 },
];

const METRICS_DATA = [
  { label:'Active Traders',  value:'2 Traders',  sub:'Managing $14,000',         color:'#c8f560', icon:'ti-users' },
  { label:'Total Return',    value:'+$3,240',     sub:'Since Jan 2025',            color:'#34d399', icon:'ti-trending-up' },
  { label:'Fees Paid',       value:'$648',        sub:'This year',                 color:'#60a5fa', icon:'ti-receipt' },
  { label:'Avg Win Rate',    value:'69%',         sub:'Across hired traders',      color:'#a78bfa', icon:'ti-target' },
];

const HOW_STEPS = [
  { num:1, title:'Post your request',           desc:'Set your capital, risk tolerance, and budget. Takes about 2 minutes.' },
  { num:2, title:'Get matched',                 desc:'We surface verified traders who fit your profile. Review their track records.' },
  { num:3, title:'Agree on terms',              desc:'Sign a digital agreement. Trader gets limited trading access to your account.' },
  { num:4, title:'Monitor & withdraw anytime',  desc:'Track performance in real time. Cancel with one click. No penalties.' },
];

const MAIN_LINKS = [
  { href:'#', icon:'ti-layout-dashboard', label:'Dashboard' },
  { href:'#', icon:'ti-copy',             label:'Copy Trading' },
  { href:'#', icon:'ti-users',            label:'Hire a Trader', active:true },
  { href:'#', icon:'ti-chart-line',       label:'Insights' },
  { href:'#', icon:'ti-robot',            label:'Marketplace', badge:'NEW' },
  { href:'#', icon:'ti-chart-candle',     label:'Terminal' },
];
const ACCT_LINKS = [
  { href:'#', icon:'ti-credit-card', label:'Payments' },
  { href:'#', icon:'ti-user-circle', label:'Profile' },
  { href:'#', icon:'ti-settings',    label:'Settings' },
  { href:'#', icon:'ti-headset',     label:'Support' },
];

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ open }) {
  return (
    <aside className={`ht-sidebar${open ? ' open' : ''}`}>
      <div className="ht-brand">
        <div className="ht-brand-icon"><i className="ti ti-trending-up" /></div>
        <span className="ht-brand-name">Trade<em>Flow</em></span>
      </div>
      <div className="ht-sb-pill">
        <div className="ht-sb-pill-label"><span className="ht-live-dot" /> Live Portfolio</div>
        <div className="ht-sb-pill-val">$48,204.33</div>
        <div className="ht-sb-pill-sub">▲ +$1,240 today · +2.64%</div>
      </div>
      <div className="ht-sb-scroll">
        <div className="ht-sb-section">Main</div>
        {MAIN_LINKS.map(l => (
          <a key={l.label} href={l.href} className={`ht-sb-link${l.active ? ' active' : ''}`}>
            <i className={`ti ${l.icon}`} />
            {l.label}
            {l.badge && <span className="ht-sb-badge">{l.badge}</span>}
          </a>
        ))}
        <div className="ht-sb-section">Account</div>
        {ACCT_LINKS.map(l => (
          <a key={l.label} href={l.href} className="ht-sb-link">
            <i className={`ti ${l.icon}`} />
            {l.label}
          </a>
        ))}
      </div>
      <div className="ht-sb-user">
        <div className="ht-sb-avatar">AK</div>
        <div>
          <div className="ht-sb-user-name">Alex Kim</div>
          <div className="ht-sb-user-role">Pro · Verified</div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Topbar ──────────────────────────────────────────────────────────────── */
function Topbar({ onMenu }) {
  return (
    <div className="ht-topbar">
      <div className="ht-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="ht-topbar-title">Good morning, <span>Alex</span></div>
      <div className="ht-topbar-icon">
        <i className="ti ti-bell" /><span className="ht-notif-dot" />
      </div>
      <div className="ht-topbar-icon"><i className="ti ti-settings" /></div>
      <div className="ht-topbar-avatar">AK</div>
    </div>
  );
}

/* ─── Metric Card ─────────────────────────────────────────────────────────── */
function MetricCard({ m }) {
  return (
    <div className="ht-metric">
      <div className="ht-metric-icon" style={{ background:`${m.color}18` }}>
        <i className={`ti ${m.icon}`} style={{ color: m.color }} />
      </div>
      <div className="ht-metric-label">{m.label}</div>
      <div className="ht-metric-value" style={{ color: m.color }}>{m.value}</div>
      <div className="ht-metric-sub">{m.sub}</div>
    </div>
  );
}

/* ─── Post Request Form ───────────────────────────────────────────────────── */
function PostRequestForm() {
  return (
    <div className="ht-card">
      <div className="ht-card-title">Post a Request</div>
      <div className="ht-card-subtitle">Get matched with professionals who fit your goals</div>

      <div className="ht-form-group">
        <label className="ht-form-label">Capital to manage (USD)</label>
        <input type="number" className="ht-input" placeholder="e.g. 10,000" />
      </div>
      <div className="ht-form-group">
        <label className="ht-form-label">Trading specialty</label>
        <select className="ht-input">
          <option>Crypto</option>
          <option>Forex</option>
          <option>Stocks &amp; ETFs</option>
          <option>Options</option>
          <option>Commodities</option>
          <option>Multi-asset</option>
        </select>
      </div>
      <div className="ht-form-group">
        <label className="ht-form-label">Risk appetite</label>
        <select className="ht-input">
          <option>Conservative (10–20% annual)</option>
          <option>Moderate (20–40% annual)</option>
          <option>Aggressive (40%+ annual)</option>
        </select>
      </div>
      <div className="ht-form-group">
        <label className="ht-form-label">Fee preference</label>
        <select className="ht-input">
          <option>Performance only (% of profits)</option>
          <option>Fixed monthly</option>
          <option>Hybrid (base + performance)</option>
        </select>
      </div>
      <div className="ht-form-group">
        <label className="ht-form-label">Max monthly budget</label>
        <input type="text" className="ht-input" placeholder="e.g. $200/mo or 20% profits" />
      </div>
      <div className="ht-form-group">
        <label className="ht-form-label">Notes for trader</label>
        <textarea className="ht-input" rows={3} placeholder="Goals, restrictions, or anything else…" />
      </div>
      <button className="ht-btn ht-btn-accent ht-btn-full ht-btn-md" style={{ marginTop: 4 }}>
        <i className="ti ti-search" /> Find Matching Traders
      </button>
    </div>
  );
}

/* ─── How it works + Security ─────────────────────────────────────────────── */
function RightColumn() {
  return (
    <div>
      <div className="ht-card" style={{ marginBottom: 14 }}>
        <div className="ht-card-title">How it works</div>
        <div style={{ marginTop: 14 }}>
          {HOW_STEPS.map((s, i) => (
            <div key={s.num} className="ht-how-step" style={i === HOW_STEPS.length - 1 ? { borderBottom:'none', paddingBottom:0, marginBottom:0 } : {}}>
              <div className="ht-how-num">{s.num}</div>
              <div>
                <div className="ht-how-title">{s.title}</div>
                <div className="ht-how-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ht-security">
        <i className="ti ti-shield-check" />
        <div>
          <div className="ht-security-title">Your funds stay protected</div>
          <div className="ht-security-body">
            Hired traders get trading-only access — they cannot withdraw your funds.
            All trades are recorded and auditable. You retain full custody at all times.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Professionals ─────────────────────────────────────────────── */
function FeaturedProfessionals({ onHire }) {
  const [filter, setFilter] = useState('');
  const visible = filter ? PROFESSIONALS.filter(p => p.specialty === filter) : PROFESSIONALS;

  return (
    <div className="ht-card">
      <div className="ht-pros-header">
        <div>
          <div className="ht-card-title">Featured Professionals</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>Verified traders with proven performance</div>
        </div>
        <select className="ht-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Specialties</option>
          <option>Crypto</option>
          <option>Forex</option>
          <option>Stocks</option>
        </select>
      </div>

      <div className="ht-traders-grid">
        {visible.map(t => (
          <div key={t.handle} className="ht-trader-card">
            <div className="ht-trader-header">
              <div className="ht-trader-av" style={{ background: t.color }}>{t.avatar}</div>
              <div style={{ flex:1 }}>
                <div className="ht-trader-name">{t.name}</div>
                <div className="ht-trader-handle">@{t.handle}</div>
              </div>
              <span className="ht-specialty-badge">{t.specialty}</span>
            </div>

            <div className="ht-trader-stats">
              <div className="ht-stat-box">
                <div className="ht-stat-val" style={{ color:'#34d399' }}>+{t.return}</div>
                <div className="ht-stat-lbl">12M Return</div>
              </div>
              <div className="ht-stat-box">
                <div className="ht-stat-val">{t.winRate}</div>
                <div className="ht-stat-lbl">Win Rate</div>
              </div>
            </div>

            <div className="ht-trader-meta">
              <span>Min. Capital: <strong>{t.minCapital}</strong></span>
              <span>Fee: <strong className="gold">{t.fee}</strong></span>
              <span>Clients: <strong>{t.clients}</strong></span>
            </div>

            <button
              className="ht-btn ht-btn-accent ht-btn-full ht-btn-sm"
              onClick={() => onHire(t)}
            >
              Hire {t.name.split(' ')[0]} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
function HireModal({ trader: t, onClose }) {
  const [amount, setAmount]   = useState('5000');
  const [duration, setDuration] = useState('1');

  return (
    <div className="ht-modal-overlay" onClick={onClose}>
      <div className="ht-modal" onClick={e => e.stopPropagation()}>
        <button className="ht-modal-close" onClick={onClose}>✕</button>

        <div className="ht-modal-head">
          <div className="ht-modal-av" style={{ background: t.color }}>{t.avatar}</div>
          <div>
            <div className="ht-modal-name">Hire {t.name}</div>
            <div className="ht-modal-sub">@{t.handle} · {t.specialty}</div>
          </div>
        </div>

        <div className="ht-modal-stats">
          {[
            { label:'12M Return',   val:`+${t.return}`, color:'#34d399' },
            { label:'Win Rate',     val: t.winRate,      color:'var(--text)' },
            { label:'Min Capital',  val: t.minCapital,   color:'var(--text)' },
            { label:'Fee',          val: t.fee,          color:'#c8f560' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="ht-modal-stat-val" style={{ color }}>{val}</div>
              <div className="ht-modal-stat-lbl">{label}</div>
            </div>
          ))}
        </div>

        <div className="ht-form-group">
          <label className="ht-form-label">Capital to allocate (USD)</label>
          <input type="number" className="ht-input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000" />
        </div>

        <div className="ht-form-group" style={{ marginBottom: 16 }}>
          <label className="ht-form-label">Duration</label>
          <select className="ht-input" value={duration} onChange={e => setDuration(e.target.value)}>
            <option value="1">1 Month (trial)</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="0">Open-ended</option>
          </select>
        </div>

        <div className="ht-modal-notice">
          <i className="ti ti-shield-check" />
          Trader gets trading access only. You retain full custody. Cancel anytime.
        </div>

        <button className="ht-btn ht-btn-accent ht-btn-full ht-btn-md">
          Confirm &amp; Proceed to Payment →
        </button>
      </div>
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
export default function HireTrader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal]             = useState(null);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299 }}
        />
      )}

      <div className="ht-shell">
        <Sidebar open={sidebarOpen} />

        <div className="ht-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} />

          <main className="ht-main">
            {/* Page header */}
            <div className="ht-page-header">
              <div>
                <div className="ht-page-title"><em>Hire a Trader</em></div>
                <div className="ht-page-sub">
                  <span className="ht-live-dot" />
                  Delegate to verified experts. Full transparency. Cancel anytime.
                </div>
              </div>
              <div className="ht-header-actions">
                <a href="#" className="ht-btn ht-btn-ghost ht-btn-sm">
                  <i className="ti ti-download" /> Export
                </a>
                <a href="#" className="ht-btn ht-btn-accent ht-btn-sm">
                  <i className="ti ti-plus" /> Post Request
                </a>
              </div>
            </div>

            {/* Metrics */}
            <div className="ht-metrics">
              {METRICS_DATA.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            {/* Form + How it works */}
            <div className="ht-grid-2">
              <PostRequestForm />
              <RightColumn />
            </div>

            {/* Featured professionals */}
            <FeaturedProfessionals onHire={setModal} />
          </main>
        </div>
      </div>

      {modal && <HireModal trader={modal} onClose={() => setModal(null)} />}
    </>
  );
}