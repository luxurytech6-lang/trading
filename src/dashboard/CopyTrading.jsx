import React, { useState } from 'react';

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const T = {
  bg:  '#080b10', s:   '#0e1219', s2:  '#141922', br:  '#1e2535', br2: '#2a3347',
  gr:  '#e2e8f0', nt:  '#64748b', g:   '#c8f560', gd:  'rgba(200,245,96,.12)',
  bl:  '#60a5fa', rd:  '#f87171', gn:  '#34d399',  pr:  '#a78bfa',
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
    --bg:         #080b10;
    --surface:    #0e1219;
    --surface2:   #141922;
    --border:     #1e2535;
    --border2:    #2a3347;
    --text:       #e2e8f0;
    --muted:      #64748b;
    --faint:      #374151;
    --accent:     #c8f560;
    --accent-dim: rgba(200,245,96,.12);
    --accent-glow:rgba(200,245,96,.06);
    --green:      #34d399;
    --green-dim:  rgba(52,211,153,.12);
    --red:        #f87171;
    --red-dim:    rgba(248,113,113,.12);
    --blue:       #60a5fa;
    --purple:     #a78bfa;
    --sidebar-w:  256px;
    --topbar-h:   60px;
    --ticker-h:   32px;
    --sans:  'Space Grotesk', sans-serif;
    --serif: 'Instrument Serif', serif;
    --mono:  'JetBrains Mono', monospace;
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
  input, select { font-family: var(--sans); }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── Shell ── */
  .ct-shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-rows: 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .ct-sidebar {
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
  .ct-sidebar::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity: .15;
    pointer-events: none;
  }

  /* Brand */
  .ct-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .ct-brand-icon {
    width: 34px; height: 34px;
    background: var(--accent); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ct-brand-icon i { font-size: 18px; color: #000; }
  .ct-brand-name { font-size: 16px; font-weight: 700; letter-spacing: -.3px; color: var(--text); }
  .ct-brand-name em { color: var(--accent); font-style: normal; }

  /* Portfolio pill */
  .ct-sb-pill {
    margin: 12px 16px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,245,96,.18);
    border-radius: var(--r-md);
    padding: 10px 14px;
    flex-shrink: 0;
  }
  .ct-sb-pill-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .ct-live-dot {
    width: 6px; height: 6px; background: var(--green);
    border-radius: 50%; animation: ct-pulse 2s infinite; flex-shrink: 0;
  }
  @keyframes ct-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ct-sb-pill-val { font-family: var(--mono); font-size: 19px; font-weight: 600; color: var(--accent); letter-spacing: -.5px; }
  .ct-sb-pill-sub { font-size: 11px; color: var(--green); margin-top: 3px; }

  /* Nav links */
  .ct-sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
  .ct-sb-section {
    padding: 10px 20px 4px;
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--faint);
  }
  .ct-sb-link {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 20px; font-size: 13px; font-weight: 500;
    color: var(--muted); border-left: 2px solid transparent;
    transition: all .15s; cursor: pointer; position: relative;
    text-decoration: none;
  }
  .ct-sb-link i { font-size: 18px; flex-shrink: 0; }
  .ct-sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .ct-sb-link.active { color: var(--accent); background: var(--accent-dim); border-left-color: var(--accent); }
  .ct-sb-link.active i { filter: drop-shadow(0 0 6px var(--accent)); }
  .ct-sb-badge {
    margin-left: auto; font-size: 9px; font-weight: 700;
    background: var(--accent); color: #000;
    padding: 2px 6px; border-radius: 5px; letter-spacing: .3px;
  }

  /* User block */
  .ct-sb-user {
    flex-shrink: 0; border-top: 1px solid var(--border);
    padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  }
  .ct-sb-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 0 12px rgba(200,245,96,.3);
  }
  .ct-sb-user-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .ct-sb-user-role { font-size: 10px; color: var(--accent); margin-top: 1px; }

  /* ── Right panel ── */
  .ct-right {
    grid-column: 2;
    display: flex; flex-direction: column;
    height: 100vh; overflow: hidden;
  }

  /* ── Topbar ── */
  .ct-topbar {
    height: var(--topbar-h); flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 28px; background: var(--surface);
    border-bottom: 1px solid var(--border); gap: 16px; z-index: 50;
  }
  .ct-topbar-title { font-family: var(--serif); font-size: 20px; color: var(--text); flex: 1; }
  .ct-topbar-title span { color: var(--accent); font-style: italic; }
  .ct-topbar-icon {
    width: 36px; height: 36px; border-radius: var(--r-sm);
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s; color: var(--muted); font-size: 18px; position: relative;
  }
  .ct-topbar-icon:hover { border-color: var(--border2); color: var(--text); }
  .ct-notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 6px; height: 6px; background: var(--red); border-radius: 50%;
    border: 1.5px solid var(--surface);
  }
  .ct-topbar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 0 10px rgba(200,245,96,.25);
  }
  .ct-hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
  }
  .ct-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main ── */
  .ct-main {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 24px 28px 40px;
  }

  /* Page header */
  .ct-page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
  }
  .ct-page-title {
    font-family: var(--serif); font-size: 28px; color: var(--text); line-height: 1.2;
  }
  .ct-page-title em { color: var(--accent); font-style: italic; }
  .ct-page-sub {
    font-size: 13px; color: var(--muted); margin-top: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .ct-header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .ct-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; border-radius: var(--r-sm);
    font-family: var(--sans); font-weight: 600;
    cursor: pointer; transition: all .15s;
    border: none; text-decoration: none; white-space: nowrap;
  }
  .ct-btn-sm  { font-size: 12px; padding: 7px 14px; }
  .ct-btn-accent { background: var(--accent); color: #000; }
  .ct-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .ct-btn-ghost {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-size: 12px; padding: 7px 14px;
  }
  .ct-btn-ghost:hover { border-color: var(--border2); }

  /* ── Metrics ── */
  .ct-metrics {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px;
  }
  .ct-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .2s;
  }
  .ct-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .ct-metric::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .3;
  }
  .ct-metric-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 12px;
  }
  .ct-metric-label {
    font-size: 10px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
  }
  .ct-metric-value {
    font-family: var(--mono); font-size: 20px; font-weight: 600;
    color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px;
  }
  .ct-metric-sub { font-size: 11px; color: var(--muted); }

  /* ── Controls bar ── */
  .ct-controls {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
  }

  /* Tabs */
  .ct-tabs {
    display: flex; gap: 4px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--r-md); padding: 4px;
  }
  .ct-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--r-sm); border: none; cursor: pointer;
    font-family: var(--sans); font-weight: 700; font-size: 12px;
    background: transparent; color: var(--muted);
    transition: all .15s; white-space: nowrap;
  }
  .ct-tab:hover { color: var(--text); }
  .ct-tab.active { background: var(--accent); color: #000; }
  .ct-tab i { font-size: 14px; }
  .ct-tab-count {
    font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 99px;
  }

  /* Filters */
  .ct-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .ct-select {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); border-radius: var(--r-sm); padding: 7px 10px;
    font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none;
    transition: border-color .15s;
  }
  .ct-select:hover { border-color: var(--border2); }

  /* ── Cards grid ── */
  .ct-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .ct-grid-1 { display: grid; gap: 14px; }

  /* Trader Card */
  .ct-trader-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px; cursor: pointer;
    transition: all .18s; position: relative; overflow: hidden;
  }
  .ct-trader-card:hover { background: var(--surface2); }
  .ct-trader-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .ct-trader-name { font-family: var(--serif); font-size: 15px; font-weight: 600; margin-bottom: 2px; }
  .ct-trader-handle { font-size: 11px; color: var(--muted); margin-bottom: 10px; }
  .ct-trader-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid var(--border); padding-top: 12px; margin-top: 4px;
  }
  .ct-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 700; text-align: center; }
  .ct-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; text-align: center; }
  .ct-trader-footer { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
  .ct-hover-cta {
    position: absolute; bottom: 0; left: 0; right: 0;
    display: flex; align-items: center; justify-content: center; padding: 12px 0;
  }
  .ct-cta-btn {
    border-radius: 7px; padding: 6px 20px; font-size: 12px;
    font-weight: 700; font-family: var(--sans); cursor: pointer; border: none;
  }

  /* Badge */
  .ct-badge {
    font-size: 10px; font-weight: 700; font-family: var(--sans);
    padding: 2px 8px; border-radius: 4px; white-space: nowrap; letter-spacing: .2px;
  }
  .ct-badge-green { background: rgba(52,211,153,.13); color: #34d399; }
  .ct-badge-blue  { background: rgba(96,165,250,.13); color: #60a5fa; }
  .ct-badge-gold  { background: rgba(200,245,96,.13); color: #c8f560; }
  .ct-badge-red   { background: rgba(248,113,113,.13); color: #f87171; }
  .ct-badge-muted { background: rgba(100,116,139,.13); color: #64748b; }

  /* Pill tag */
  .ct-pill {
    font-size: 10px; font-weight: 700; font-family: var(--sans);
    padding: 2px 8px; border-radius: 4px; white-space: nowrap;
  }

  /* Avatar */
  .ct-av {
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: var(--sans); font-weight: 700; color: #000; flex-shrink: 0;
  }

  /* Copying Card */
  .ct-copying-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px;
  }
  .ct-copy-actions { display: flex; gap: 8px; margin-top: 14px; }
  .ct-copy-btn {
    flex: 1; border-radius: var(--r-sm); padding: 8px 0;
    font-size: 12px; font-weight: 700; font-family: var(--sans); cursor: pointer;
    transition: all .15s;
  }
  .ct-copy-btn-pause {
    background: transparent; border: 1px solid var(--border); color: var(--text);
  }
  .ct-copy-btn-pause:hover { border-color: var(--border2); }
  .ct-copy-btn-stop {
    background: transparent; border: 1px solid rgba(248,113,113,.35); color: var(--red);
  }
  .ct-copy-btn-stop:hover { background: var(--red-dim); }

  /* Progress bar */
  .ct-progress { height: 5px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .ct-progress-fill { height: 100%; border-radius: 99px; transition: width .4s ease; }

  /* Mini stat box */
  .ct-mini-stat {
    background: var(--surface2); border-radius: var(--r-sm); padding: 10px 12px;
  }
  .ct-mini-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 700; }
  .ct-mini-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; }

  /* Leaderboard */
  .ct-lb-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); overflow: hidden;
  }
  .ct-lb-head {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ct-lb-title { font-family: var(--serif); font-size: 16px; }
  .ct-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .ct-table th {
    text-align: left; padding: 9px 16px;
    color: var(--muted); font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .7px;
    border-bottom: 1px solid var(--border); background: var(--surface2);
  }
  .ct-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .ct-table tr:last-child td { border-bottom: none; }
  .ct-table tr:hover td { background: var(--surface2); }
  .ct-table-copy-btn {
    background: transparent; border: 1px solid var(--border);
    color: var(--text); border-radius: 7px; padding: 6px 14px;
    font-size: 11px; font-weight: 700; font-family: var(--sans); cursor: pointer;
    transition: all .15s;
  }
  .ct-table-copy-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* Modal */
  .ct-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 600; padding: 16px;
  }
  .ct-modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto;
    padding: 24px; position: relative;
  }
  .ct-modal-close {
    position: absolute; top: 14px; right: 14px;
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); border-radius: 8px;
    width: 28px; height: 28px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .ct-modal-close:hover { border-color: var(--red); color: var(--red); }
  .ct-modal-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    margin-bottom: 20px; background: var(--surface2); border-radius: 10px; padding: 14px;
  }
  .ct-modal-stat-val { font-family: var(--mono); font-size: 16px; font-weight: 700; text-align: center; }
  .ct-modal-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 3px; text-align: center; }
  .ct-input-label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px; font-weight: 600; }
  .ct-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 10px 12px; font-size: 13px; color: var(--text);
    font-family: var(--sans); outline: none; transition: border-color .15s;
  }
  .ct-input:focus { border-color: var(--accent); }
  .ct-proj-return {
    background: rgba(200,245,96,.07); border: 1px solid rgba(200,245,96,.2);
    border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .ct-disclaimer {
    background: rgba(200,175,76,.06); border: 1px solid rgba(200,175,76,.18);
    border-radius: var(--r-sm); padding: 10px; margin-bottom: 16px;
    font-size: 11px; color: var(--muted); line-height: 1.5;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .ct-metrics { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .ct-shell { grid-template-columns: 1fr !important; }
    .ct-sidebar {
      position: fixed !important; top: 0 !important; left: 0 !important;
      transform: translateX(-100%) !important; z-index: 300 !important;
    }
    .ct-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .ct-right { grid-column: 1; }
    .ct-hamburger { display: flex; }
    .ct-grid-3 { grid-template-columns: 1fr 1fr; }
    .ct-metrics { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .ct-grid-3 { grid-template-columns: 1fr; }
    .ct-main { padding: 16px; }
    .ct-topbar { padding: 0 16px; }
  }
`;

/* ─── Static data ─────────────────────────────────────────────────────────── */
const RISK_COLOR = { Low: '#34d399', Medium: '#f59e0b', High: '#f87171' };
const RISK_BG    = { Low: 'rgba(52,211,153,.12)', Medium: 'rgba(245,158,11,.12)', High: 'rgba(248,113,113,.12)' };

const TRADERS = [
  { init:'VF', name:'Vincent Ford',  handle:'@vForce',  market:'Crypto', risk:'Low',    roi:38.4, wr:73, copiers:1240, yrs:3, color:'#c8f560', badge:'Top Earner',  badgeCls:'gold',  spark:[22,28,25,35,30,38,36,38], desc:'Algorithmic BTC/ETH rotation, low drawdown strategy.' },
  { init:'SM', name:'Sofia Mendez',  handle:'@sofiaM',  market:'Forex',  risk:'Medium', roi:24.7, wr:69, copiers:892,  yrs:5, color:'#60a5fa', badge:'Trending',    badgeCls:'blue',  spark:[10,14,12,18,15,22,20,25], desc:'EUR/USD carry trades with options overlay.' },
  { init:'RO', name:'Riku Osaka',    handle:'@rikuPRO', market:'Stocks', risk:'Low',    roi:18.2, wr:65, copiers:544,  yrs:2, color:'#a78bfa', badge:'Verified',    badgeCls:'blue',  spark:[8,10,9,13,11,15,14,18],  desc:'S&P 500 index momentum with volatility filter.' },
  { init:'AJ', name:'Arjun Joshi',   handle:'@arjunFX', market:'Forex',  risk:'High',   roi:52.1, wr:61, copiers:2100, yrs:7, color:'#f87171', badge:'High Return', badgeCls:'red',   spark:[20,35,28,45,38,50,42,52], desc:'High-leverage breakout scalping on majors.' },
  { init:'LN', name:'Lisa Nakamura', handle:'@lisaN',   market:'Crypto', risk:'Low',    roi:14.6, wr:71, copiers:330,  yrs:2, color:'#34d399', badge:'Consistent',  badgeCls:'green', spark:[6,8,7,10,9,12,11,15],   desc:'Altcoin basket rebalancing, DCA-first approach.' },
  { init:'BK', name:'Bashir Kofi',   handle:'@bKofi',   market:'Stocks', risk:'Medium', roi:21.9, wr:67, copiers:780,  yrs:4, color:'#e2e8f0', badge:'Diversified', badgeCls:'muted', spark:[9,13,11,17,14,19,17,22],  desc:'Sector rotation across tech, energy, and healthcare.' },
];

const COPYING = [
  { ...TRADERS[0], allocated: 6000, gain: 840,  since:'Apr 2025' },
  { ...TRADERS[1], allocated: 5000, gain: 620,  since:'Mar 2025' },
  { ...TRADERS[2], allocated: 4000, gain: 382,  since:'May 2025' },
];

const METRICS = [
  { label:'Copying',        value:'3 Traders', sub:'Active now',       color: T.g,  icon:'ti-copy' },
  { label:'Copy Gains',     value:'+$1,842',   sub:'▲ +12.3% ROI',     color: '#34d399', icon:'ti-trending-up' },
  { label:'Allocated',      value:'$15,000',   sub:'31% of portfolio', color: T.bl, icon:'ti-wallet' },
  { label:'Best Performer', value:'@vForce',   sub:'+38.4% / 30D',    color: T.g,  icon:'ti-trophy' },
];

const MAIN_LINKS = [
  { href:'#', icon:'ti-layout-dashboard', label:'Dashboard' },
  { href:'#', icon:'ti-copy',             label:'Copy Trading', active:true },
  { href:'#', icon:'ti-users',            label:'Hire a Trader' },
  { href:'#', icon:'ti-chart-line',       label:'Insights' },
  { href:'#', icon:'ti-robot',            label:'Marketplace', badge:'NEW' },
  { href:'#', icon:'ti-chart-candle',     label:'Terminal' },
];
const ACCT_LINKS = [
  { href:'#', icon:'ti-credit-card',      label:'Payments' },
  { href:'#', icon:'ti-user-circle',      label:'Profile' },
  { href:'#', icon:'ti-settings',         label:'Settings' },
  { href:'#', icon:'ti-headset',          label:'Support' },
];

/* ─── Spark ───────────────────────────────────────────────────────────────── */
function Spark({ data, color = T.g, h = 32, w = 72 }) {
  const mn = Math.min(...data), mx = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - mn) / (mx - mn || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  const fill = `${pts} ${w},${h} 0,${h}`;
  const id = `sg${color.replace(/[^a-z0-9]/gi,'')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ open }) {
  return (
    <aside className={`ct-sidebar${open ? ' open' : ''}`}>
      <div className="ct-brand">
        <div className="ct-brand-icon"><i className="ti ti-trending-up" /></div>
        <span className="ct-brand-name">Trade<em>Flow</em></span>
      </div>
      <div className="ct-sb-pill">
        <div className="ct-sb-pill-label">
          <span className="ct-live-dot" /> Live Portfolio
        </div>
        <div className="ct-sb-pill-val">$48,204.33</div>
        <div className="ct-sb-pill-sub">▲ +$1,240 today · +2.64%</div>
      </div>
      <div className="ct-sb-scroll">
        <div className="ct-sb-section">Main</div>
        {MAIN_LINKS.map(l => (
          <a key={l.label} href={l.href} className={`ct-sb-link${l.active ? ' active' : ''}`}>
            <i className={`ti ${l.icon}`} />
            {l.label}
            {l.badge && <span className="ct-sb-badge">{l.badge}</span>}
          </a>
        ))}
        <div className="ct-sb-section">Account</div>
        {ACCT_LINKS.map(l => (
          <a key={l.label} href={l.href} className="ct-sb-link">
            <i className={`ti ${l.icon}`} />
            {l.label}
          </a>
        ))}
      </div>
      <div className="ct-sb-user">
        <div className="ct-sb-avatar">AK</div>
        <div>
          <div className="ct-sb-user-name">Alex Kim</div>
          <div className="ct-sb-user-role">Pro · Verified</div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Topbar ──────────────────────────────────────────────────────────────── */
function Topbar({ onMenu }) {
  return (
    <div className="ct-topbar">
      <div className="ct-hamburger" onClick={onMenu}>
        <span /><span /><span />
      </div>
      <div className="ct-topbar-title">Good morning, <span>Alex</span></div>
      <div className="ct-topbar-icon">
        <i className="ti ti-bell" />
        <span className="ct-notif-dot" />
      </div>
      <div className="ct-topbar-icon"><i className="ti ti-settings" /></div>
      <div className="ct-topbar-avatar">AK</div>
    </div>
  );
}

/* ─── Metric Card ─────────────────────────────────────────────────────────── */
function MetricCard({ m }) {
  return (
    <div className="ct-metric">
      <div className="ct-metric-icon" style={{ background: `${m.color}18` }}>
        <i className={`ti ${m.icon}`} style={{ color: m.color }} />
      </div>
      <div className="ct-metric-label">{m.label}</div>
      <div className="ct-metric-value" style={{ color: m.color }}>{m.value}</div>
      <div className="ct-metric-sub">{m.sub}</div>
    </div>
  );
}

/* ─── Trader Card ─────────────────────────────────────────────────────────── */
function TraderCard({ t, onCopy }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="ct-trader-card"
      onClick={() => onCopy(t)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderColor: hov ? `${t.color}55` : undefined }}
    >
      <div className="ct-trader-card-header">
        <div className={`ct-av`} style={{ width:42, height:42, background:t.color, fontSize:14 }}>{t.init}</div>
        <span className={`ct-badge ct-badge-${t.badgeCls}`}>{t.badge}</span>
      </div>
      <div className="ct-trader-name">{t.name}</div>
      <div className="ct-trader-handle">{t.handle} · {t.market}</div>
      <div style={{ marginBottom: 12 }}>
        <Spark data={t.spark} color={t.color} />
      </div>
      <div className="ct-trader-stats">
        {[
          { label:'30D ROI',  val:`+${t.roi}%`,                      color: T.gn },
          { label:'Win Rate', val:`${t.wr}%`,                         color: T.gr },
          { label:'Copiers',  val: t.copiers.toLocaleString(),        color: T.gr },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <div className="ct-stat-val" style={{ color }}>{val}</div>
            <div className="ct-stat-lbl">{label}</div>
          </div>
        ))}
      </div>
      <div className="ct-trader-footer">
        <span className="ct-pill" style={{ background: RISK_BG[t.risk], color: RISK_COLOR[t.risk] }}>{t.risk} Risk</span>
        <span className="ct-pill" style={{ background: 'rgba(96,165,250,.1)', color: T.bl }}>{t.yrs}Y Active</span>
      </div>
      {hov && (
        <div className="ct-hover-cta" style={{ background: `linear-gradient(transparent, ${t.color}22)` }}>
          <button className="ct-cta-btn" style={{ background: t.color, color: '#000' }}>Copy Trader →</button>
        </div>
      )}
    </div>
  );
}

/* ─── Copying Card ────────────────────────────────────────────────────────── */
function CopyingCard({ t }) {
  const pct = ((t.gain / t.allocated) * 100).toFixed(1);
  return (
    <div className="ct-copying-card">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <div className="ct-av" style={{ width:38, height:38, background:t.color, fontSize:13 }}>{t.init}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily: T.serif, fontSize:14, fontWeight:600 }}>{t.name}</div>
          <div style={{ fontSize:11, color:T.nt }}>{t.handle}</div>
        </div>
        <span className="ct-badge ct-badge-green">Live</span>
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:T.nt, marginBottom:6 }}>
          <span>Allocated</span>
          <span style={{ color: T.gn }}>+{pct}% gain</span>
        </div>
        <div className="ct-progress">
          <div className="ct-progress-fill" style={{ width:`${Math.min(pct * 3, 100)}%`, background: t.color }} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:4 }}>
        {[
          { label:'Allocated', val:`$${t.allocated.toLocaleString()}` },
          { label:'Gain',      val:`+$${t.gain.toLocaleString()}`,    color: T.gn },
          { label:'ROI',       val:`${t.roi}%`,                       color: T.gn },
          { label:'Since',     val: t.since },
        ].map(({ label, val, color }) => (
          <div key={label} className="ct-mini-stat">
            <div className="ct-mini-stat-val" style={{ color: color || T.gr }}>{val}</div>
            <div className="ct-mini-stat-lbl">{label}</div>
          </div>
        ))}
      </div>
      <div className="ct-copy-actions">
        <button className="ct-copy-btn ct-copy-btn-pause">⏸ Pause</button>
        <button className="ct-copy-btn ct-copy-btn-stop">✕ Stop</button>
      </div>
    </div>
  );
}

/* ─── Leaderboard ─────────────────────────────────────────────────────────── */
function Leaderboard({ traders, onCopy }) {
  const sorted = [...traders].sort((a, b) => b.roi - a.roi);
  const medals = ['🥇','🥈','🥉'];
  return (
    <div className="ct-lb-wrap">
      <div className="ct-lb-head">
        <span className="ct-lb-title">30-Day Leaderboard</span>
        <span className="ct-badge ct-badge-gold">Live Rankings</span>
      </div>
      <table className="ct-table">
        <thead>
          <tr>
            {['#','Trader','Market','30D ROI','Win Rate','Copiers',''].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => (
            <tr key={t.handle}>
              <td style={{ fontFamily: T.mono, fontWeight:800, fontSize:14, color: i < 3 ? T.g : T.nt }}>{medals[i] || i+1}</td>
              <td>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="ct-av" style={{ width:30, height:30, background:t.color, fontSize:10 }}>{t.init}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:T.nt }}>{t.handle}</div>
                  </div>
                </div>
              </td>
              <td><span className="ct-badge ct-badge-blue">{t.market}</span></td>
              <td style={{ fontFamily:T.mono, fontWeight:800, color: T.gn }}>+{t.roi}%</td>
              <td style={{ fontFamily:T.mono }}>{t.wr}%</td>
              <td style={{ fontFamily:T.mono }}>{t.copiers.toLocaleString()}</td>
              <td><button className="ct-table-copy-btn" onClick={() => onCopy(t)}>Copy</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
function CopyModal({ trader: t, onClose }) {
  const [amount, setAmount]   = useState('');
  const [stopLoss, setStopLoss] = useState('15');
  const [ratio, setRatio]     = useState('proportional');
  const estReturn = amount ? ((parseFloat(amount) * t.roi) / 100).toFixed(2) : null;
  return (
    <div className="ct-modal-overlay" onClick={onClose}>
      <div className="ct-modal" onClick={e => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose}>✕</button>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div className="ct-av" style={{ width:50, height:50, background:t.color, fontSize:16 }}>{t.init}</div>
          <div>
            <div style={{ fontFamily:T.serif, fontSize:19, fontWeight:600, marginBottom:4 }}>{t.name}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:12, color:T.nt }}>{t.handle} · {t.market}</span>
              <span className={`ct-badge ct-badge-${t.badgeCls}`}>{t.badge}</span>
            </div>
          </div>
        </div>
        <div className="ct-modal-stats">
          {[
            { label:'30D ROI',  val:`+${t.roi}%`, color: T.gn },
            { label:'Win Rate', val:`${t.wr}%`,   color: T.gr },
            { label:'Copiers',  val: t.copiers.toLocaleString(), color: T.gr },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="ct-modal-stat-val" style={{ color }}>{val}</div>
              <div className="ct-modal-stat-lbl">{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:12, color:T.nt, marginBottom:20, lineHeight:1.6, padding:'10px 12px', background: T.s2, borderRadius:8 }}>
          {t.desc}
        </div>
        {[
          { label:'Amount to copy (USD)', ph:'e.g. 1000', val:amount,   set:setAmount,   type:'number' },
          { label:'Stop loss (%)',         ph:'e.g. 15',   val:stopLoss, set:setStopLoss, type:'number' },
        ].map(({ label, ph, val, set, type }) => (
          <div key={label} style={{ marginBottom:14 }}>
            <label className="ct-input-label">{label}</label>
            <input type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} className="ct-input" />
          </div>
        ))}
        <div style={{ marginBottom:16 }}>
          <label className="ct-input-label">Copy ratio</label>
          <select value={ratio} onChange={e => setRatio(e.target.value)} className="ct-input">
            <option value="proportional">Proportional (recommended)</option>
            <option value="fixed">Fixed lot size</option>
          </select>
        </div>
        {estReturn && (
          <div className="ct-proj-return">
            <span style={{ fontSize:12, color:T.nt }}>Projected 30D return (at {t.roi}%)</span>
            <span style={{ fontFamily:T.mono, fontWeight:800, color:T.g, fontSize:16 }}>+${estReturn}</span>
          </div>
        )}
        <div className="ct-disclaimer">
          <i className="ti ti-info-circle" style={{ color:T.g, fontSize:13, verticalAlign:-2, marginRight:5 }} />
          Copy trading involves risk. Past performance is not a guarantee of future results.
        </div>
        <button className="ct-btn ct-btn-accent" style={{ width:'100%', padding:'13px 0', fontSize:14, borderRadius:10, fontWeight:700 }}>
          Start Copying {t.name.split(' ')[0]} →
        </button>
      </div>
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
export default function CopyTrading() {
  const [tab, setTab]         = useState('top');
  const [modal, setModal]     = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ market:'', risk:'', sort:'roi' });

  const filtered = TRADERS
    .filter(t => !filters.market || t.market === filters.market)
    .filter(t => !filters.risk   || t.risk   === filters.risk)
    .sort((a, b) => {
      if (filters.sort === 'wr')      return b.wr - a.wr;
      if (filters.sort === 'copiers') return b.copiers - a.copiers;
      return b.roi - a.roi;
    });

  const sel = key => e => setFilters(f => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299,
        }} />
      )}

      <div className="ct-shell">
        <Sidebar open={sidebarOpen} />

        <div className="ct-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} />

          <main className="ct-main">
            {/* Page header */}
            <div className="ct-page-header">
              <div>
                <div className="ct-page-title"><em>Copy Trading</em></div>
                <div className="ct-page-sub">
                  <span className="ct-live-dot" />
                  Mirror elite traders automatically. Start, pause, or stop anytime.
                </div>
              </div>
              <div className="ct-header-actions">
                <a href="#" className="ct-btn ct-btn-ghost ct-btn-sm">
                  <i className="ti ti-download" /> Export
                </a>
                <a href="#" className="ct-btn ct-btn-accent ct-btn-sm">
                  <i className="ti ti-plus" /> New Copy
                </a>
              </div>
            </div>

            {/* Metrics */}
            <div className="ct-metrics">
              {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            {/* Controls */}
            <div className="ct-controls">
              {/* Tabs */}
              <div className="ct-tabs">
                {[
                  { key:'top',     label:'Top Traders', icon:'ti-users' },
                  { key:'copying', label:'Copying',     icon:'ti-copy', count:3 },
                  { key:'leaders', label:'Leaderboard', icon:'ti-trophy' },
                ].map(({ key, label, icon, count }) => (
                  <button key={key} className={`ct-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                    <i className={`ti ${icon}`} />
                    {label}
                    {count && (
                      <span className="ct-tab-count" style={{
                        background: tab === key ? 'rgba(0,0,0,.2)' : 'rgba(52,211,153,.2)',
                        color: tab === key ? '#000' : T.gn,
                      }}>{count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Filters */}
              {tab === 'top' && (
                <div className="ct-filters">
                  <select value={filters.market} onChange={sel('market')} className="ct-select">
                    <option value="">All Markets</option>
                    <option>Crypto</option><option>Forex</option><option>Stocks</option>
                  </select>
                  <select value={filters.risk} onChange={sel('risk')} className="ct-select">
                    <option value="">All Risk</option>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                  <select value={filters.sort} onChange={sel('sort')} className="ct-select">
                    <option value="roi">Sort: ROI</option>
                    <option value="wr">Win Rate</option>
                    <option value="copiers">Copiers</option>
                  </select>
                </div>
              )}
            </div>

            {/* Content */}
            {tab === 'top' && (
              <div className="ct-grid-3">
                {filtered.map(t => <TraderCard key={t.handle} t={t} onCopy={setModal} />)}
                {filtered.length === 0 && (
                  <div style={{ gridColumn:'1/-1', textAlign:'center', color:T.nt, padding:40, fontSize:13 }}>
                    No traders match those filters.
                  </div>
                )}
              </div>
            )}

            {tab === 'copying' && (
              <div className="ct-grid-3">
                {COPYING.map(t => <CopyingCard key={t.handle} t={t} />)}
              </div>
            )}

            {tab === 'leaders' && (
              <div className="ct-grid-1">
                <Leaderboard traders={TRADERS} onCopy={setModal} />
              </div>
            )}
          </main>
        </div>
      </div>

      {modal && <CopyModal trader={modal} onClose={() => setModal(null)} />}
    </>
  );
}