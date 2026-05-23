import React, { useState } from 'react';

/* ─── Design tokens (matches CopyTrading) ───────────────────────────────────── */
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
  .mp-shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-rows: 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .mp-sidebar {
    grid-column: 1;
    grid-row: 1;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    width: var(--sidebar-w);
    min-width: var(--sidebar-w);
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    z-index: 100;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
    flex-shrink: 0;
  }
  .mp-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
  .mp-sidebar::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity: .15; pointer-events: none;
  }

  /* Brand */
  .mp-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .mp-brand-icon {
    width: 34px; height: 34px;
    background: var(--accent); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mp-brand-icon i { font-size: 18px; color: #000; }
  .mp-brand-name { font-size: 16px; font-weight: 700; letter-spacing: -.3px; color: var(--text); }
  .mp-brand-name em { color: var(--accent); font-style: normal; }

  /* Portfolio pill */
  .mp-sb-pill {
    margin: 12px 16px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,245,96,.18);
    border-radius: var(--r-md);
    padding: 10px 14px;
    flex-shrink: 0;
  }
  .mp-sb-pill-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .mp-live-dot {
    width: 6px; height: 6px; background: var(--green);
    border-radius: 50%; animation: mp-pulse 2s infinite; flex-shrink: 0;
  }
  @keyframes mp-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .mp-sb-pill-val { font-family: var(--mono); font-size: 19px; font-weight: 600; color: var(--accent); letter-spacing: -.5px; }
  .mp-sb-pill-sub { font-size: 11px; color: var(--green); margin-top: 3px; }

  /* Nav links */
  .mp-sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
  .mp-sb-section {
    padding: 10px 20px 4px;
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--faint);
  }
  .mp-sb-link {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 20px; font-size: 13px; font-weight: 500;
    color: var(--muted); border-left: 2px solid transparent;
    transition: all .15s; cursor: pointer; position: relative;
    text-decoration: none;
  }
  .mp-sb-link i { font-size: 18px; flex-shrink: 0; }
  .mp-sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .mp-sb-link.active { color: var(--accent); background: var(--accent-dim); border-left-color: var(--accent); }
  .mp-sb-link.active i { filter: drop-shadow(0 0 6px var(--accent)); }
  .mp-sb-badge {
    margin-left: auto; font-size: 9px; font-weight: 700;
    background: var(--accent); color: #000;
    padding: 2px 6px; border-radius: 5px; letter-spacing: .3px;
  }

  /* User block */
  .mp-sb-user {
    flex-shrink: 0; border-top: 1px solid var(--border);
    padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  }
  .mp-sb-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 0 12px rgba(200,245,96,.3);
  }
  .mp-sb-user-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .mp-sb-user-role { font-size: 10px; color: var(--accent); margin-top: 1px; }

  /* ── Right panel ── */
  .mp-right {
    grid-column: 2;
    display: flex; flex-direction: column;
    height: 100vh; overflow: hidden;
  }

  /* ── Topbar ── */
  .mp-topbar {
    height: var(--topbar-h); flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 28px; background: var(--surface);
    border-bottom: 1px solid var(--border); gap: 16px; z-index: 50;
  }
  .mp-topbar-title { font-family: var(--serif); font-size: 20px; color: var(--text); flex: 1; }
  .mp-topbar-title span { color: var(--accent); font-style: italic; }
  .mp-topbar-icon {
    width: 36px; height: 36px; border-radius: var(--r-sm);
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s; color: var(--muted); font-size: 18px; position: relative;
  }
  .mp-topbar-icon:hover { border-color: var(--border2); color: var(--text); }
  .mp-notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 6px; height: 6px; background: var(--red); border-radius: 50%;
    border: 1.5px solid var(--surface);
  }
  .mp-topbar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 0 10px rgba(200,245,96,.25);
  }
  .mp-hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
  }
  .mp-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main ── */
  .mp-main {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 24px 28px 40px;
  }

  /* Page header */
  .mp-page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
  }
  .mp-page-title {
    font-family: var(--serif); font-size: 28px; color: var(--text); line-height: 1.2;
  }
  .mp-page-title em { color: var(--accent); font-style: italic; }
  .mp-page-sub {
    font-size: 13px; color: var(--muted); margin-top: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .mp-header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .mp-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; border-radius: var(--r-sm);
    font-family: var(--sans); font-weight: 600;
    cursor: pointer; transition: all .15s;
    border: none; text-decoration: none; white-space: nowrap;
  }
  .mp-btn-sm  { font-size: 12px; padding: 7px 14px; }
  .mp-btn-accent { background: var(--accent); color: #000; }
  .mp-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .mp-btn-ghost {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-size: 12px; padding: 7px 14px;
  }
  .mp-btn-ghost:hover { border-color: var(--border2); }

  /* ── Metrics ── */
  .mp-metrics {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px;
  }
  .mp-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .2s;
  }
  .mp-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .mp-metric::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .3;
  }
  .mp-metric-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 12px;
  }
  .mp-metric-label {
    font-size: 10px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
  }
  .mp-metric-value {
    font-family: var(--mono); font-size: 20px; font-weight: 600;
    color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px;
  }
  .mp-metric-sub { font-size: 11px; color: var(--muted); }

  /* ── Controls bar ── */
  .mp-controls {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
  }

  /* Tabs */
  .mp-tabs {
    display: flex; gap: 4px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--r-md); padding: 4px;
  }
  .mp-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--r-sm); border: none; cursor: pointer;
    font-family: var(--sans); font-weight: 700; font-size: 12px;
    background: transparent; color: var(--muted);
    transition: all .15s; white-space: nowrap;
  }
  .mp-tab:hover { color: var(--text); }
  .mp-tab.active { background: var(--accent); color: #000; }
  .mp-tab i { font-size: 14px; }
  .mp-tab-count {
    font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 99px;
  }

  /* Filters */
  .mp-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .mp-select {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); border-radius: var(--r-sm); padding: 7px 10px;
    font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none;
    transition: border-color .15s;
  }
  .mp-select:hover { border-color: var(--border2); }

  /* ── Cards grid ── */
  .mp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .mp-grid-1 { display: grid; gap: 14px; }

  /* ── Item Card ── */
  .mp-item-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px; cursor: pointer;
    transition: all .18s; position: relative; overflow: hidden;
  }
  .mp-item-card:hover { background: var(--surface2); border-color: var(--border2); transform: translateY(-1px); }
  .mp-item-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .mp-item-card-left { display: flex; align-items: center; gap: 12px; }
  .mp-item-icon {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #000; flex-shrink: 0;
  }
  .mp-item-name { font-family: var(--serif); font-size: 15px; font-weight: 600; margin-bottom: 2px; }
  .mp-item-tag { font-size: 11px; color: var(--muted); }
  .mp-item-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
  .mp-item-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid var(--border); padding-top: 12px; margin-bottom: 12px;
  }
  .mp-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 700; text-align: center; }
  .mp-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; text-align: center; }
  .mp-markets { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .mp-market-tag {
    font-size: 10px; font-weight: 600; padding: 3px 8px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 4px; color: var(--muted);
  }
  .mp-item-footer {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--border); padding-top: 12px;
  }
  .mp-price { font-family: var(--mono); font-size: 18px; font-weight: 700; color: var(--accent); }
  .mp-per { font-size: 11px; color: var(--muted); margin-left: 3px; }
  .mp-delivery { font-size: 11px; color: var(--muted); margin-bottom: 12px; display: flex; align-items: center; gap: 5px; }

  /* Badge */
  .mp-badge {
    font-size: 10px; font-weight: 700; font-family: var(--sans);
    padding: 2px 8px; border-radius: 4px; white-space: nowrap; letter-spacing: .2px;
  }
  .mp-badge-green { background: rgba(52,211,153,.13); color: #34d399; }
  .mp-badge-blue  { background: rgba(96,165,250,.13); color: #60a5fa; }
  .mp-badge-gold  { background: rgba(200,245,96,.13); color: #c8f560; }
  .mp-badge-red   { background: rgba(248,113,113,.13); color: #f87171; }
  .mp-badge-purple { background: rgba(167,139,250,.13); color: #a78bfa; }
  .mp-badge-amber { background: rgba(245,158,11,.13); color: #f59e0b; }

  /* ── Active Subscriptions row ── */
  .mp-active-row {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); overflow: hidden; margin-bottom: 20px;
  }
  .mp-active-head {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .mp-active-title { font-family: var(--serif); font-size: 16px; }
  .mp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .mp-table th {
    text-align: left; padding: 9px 16px;
    color: var(--muted); font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .7px;
    border-bottom: 1px solid var(--border); background: var(--surface2);
  }
  .mp-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .mp-table tr:last-child td { border-bottom: none; }
  .mp-table tr:hover td { background: var(--surface2); }
  .mp-table-manage-btn {
    background: transparent; border: 1px solid var(--border);
    color: var(--text); border-radius: 7px; padding: 6px 14px;
    font-size: 11px; font-weight: 700; font-family: var(--sans); cursor: pointer;
    transition: all .15s;
  }
  .mp-table-manage-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* Section intro */
  .mp-section-intro {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-md); padding: 12px 16px; margin-bottom: 16px;
    font-size: 12px; color: var(--muted); line-height: 1.6;
  }
  .mp-section-intro strong { color: var(--text); }

  /* Modal */
  .mp-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 600; padding: 16px;
  }
  .mp-modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto;
    padding: 24px; position: relative;
  }
  .mp-modal-close {
    position: absolute; top: 14px; right: 14px;
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); border-radius: 8px;
    width: 28px; height: 28px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .mp-modal-close:hover { border-color: var(--red); color: var(--red); }
  .mp-modal-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    margin-bottom: 20px; background: var(--surface2); border-radius: 10px; padding: 14px;
  }
  .mp-modal-stat-val { font-family: var(--mono); font-size: 16px; font-weight: 700; text-align: center; }
  .mp-modal-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 3px; text-align: center; }
  .mp-input-label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px; font-weight: 600; }
  .mp-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 10px 12px; font-size: 13px; color: var(--text);
    font-family: var(--sans); outline: none; transition: border-color .15s;
  }
  .mp-input:focus { border-color: var(--accent); }
  .mp-order-summary {
    background: var(--surface2); border-radius: 10px; padding: 14px; margin-bottom: 16px;
    font-size: 12px;
  }
  .mp-order-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 5px 0;
  }
  .mp-order-row-label { color: var(--muted); }
  .mp-order-total {
    border-top: 1px solid var(--border); padding-top: 10px; margin-top: 6px;
    display: flex; justify-content: space-between;
    font-weight: 700; font-size: 13px;
  }
  .mp-disclaimer {
    background: rgba(200,175,76,.06); border: 1px solid rgba(200,175,76,.18);
    border-radius: var(--r-sm); padding: 10px; margin-bottom: 16px;
    font-size: 11px; color: var(--muted); line-height: 1.5;
  }
  .mp-success-ring {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--accent-dim); border: 2px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px; font-size: 22px; color: var(--accent);
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .mp-metrics { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .mp-shell { grid-template-columns: 1fr !important; }
    .mp-sidebar {
      position: fixed !important; top: 0 !important; left: 0 !important;
      transform: translateX(-100%) !important; z-index: 300 !important;
    }
    .mp-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .mp-right { grid-column: 1; }
    .mp-hamburger { display: flex; }
    .mp-grid-3 { grid-template-columns: 1fr 1fr; }
    .mp-metrics { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .mp-grid-3 { grid-template-columns: 1fr; }
    .mp-main { padding: 16px; }
    .mp-topbar { padding: 0 16px; }
  }
`;

/* ─── Data ───────────────────────────────────────────────────────────────────── */

const METRICS = [
  { label: 'Active Subs',   value: '3',        sub: '2 bots · 1 signal',  icon: 'ti-stack-2',      iconBg: 'rgba(200,245,96,.12)',  iconColor: '#c8f560' },
  { label: 'Monthly Spend', value: '$83',       sub: 'Renews Jun 1',       icon: 'ti-credit-card',  iconBg: 'rgba(96,165,250,.12)',  iconColor: '#60a5fa' },
  { label: 'Bot P&L (30D)', value: '+$1,247',   sub: '+14.9% on capital',  icon: 'ti-trending-up',  iconBg: 'rgba(52,211,153,.12)',  iconColor: '#34d399' },
  { label: 'Signals Sent',  value: '148',       sub: 'This month',         icon: 'ti-broadcast',    iconBg: 'rgba(167,139,250,.12)', iconColor: '#a78bfa' },
];

const BOTS = [
  {
    id: 'alphagrid',
    name: 'AlphaGrid',
    tag: 'Grid Bot',
    desc: 'Automated grid trading for crypto markets. Profits from sideways volatility without predicting direction.',
    roi: '+41.2%', trades: '1,842', winRate: '71%',
    price: 29, color: T.g, icon: 'ti-robot',
    badge: 'Top Rated', badgeCls: 'gold',
    markets: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
  },
  {
    id: 'momentumx',
    name: 'MomentumX',
    tag: 'Trend Bot',
    desc: 'Rides strong momentum breakouts using multi-timeframe confirmation. Works best on trending markets.',
    roi: '+28.7%', trades: '934', winRate: '64%',
    price: 19, color: T.bl, icon: 'ti-rocket',
    badge: 'Popular', badgeCls: 'blue',
    markets: ['NVDA', 'TSLA', 'BTC/USDT'],
  },
  {
    id: 'scalprpro',
    name: 'ScalprPro',
    tag: 'Scalping Bot',
    desc: 'High-frequency scalper for forex pairs. Targets 5–15 pip moves with tight stop-losses.',
    roi: '+19.3%', trades: '6,210', winRate: '78%',
    price: 39, color: '#f59e0b', icon: 'ti-bolt',
    badge: null, badgeCls: null,
    markets: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  },
  {
    id: 'dcamaster',
    name: 'DCA Master',
    tag: 'DCA Bot',
    desc: 'Dollar-cost averaging bot. Automatically buys on dips and rebalances your crypto portfolio.',
    roi: '+33.5%', trades: '412', winRate: '82%',
    price: 15, color: T.gn, icon: 'ti-refresh',
    badge: 'Best Value', badgeCls: 'green',
    markets: ['BTC', 'ETH', 'SOL', 'BNB'],
  },
];

const SIGNALS = [
  {
    id: 'cryptoedge',
    name: 'CryptoEdge',
    tag: 'Crypto Signals',
    desc: 'Daily curated crypto signals with entry, stop-loss, and take-profit levels. Avg. 3–5 signals/day.',
    roi: '+55.1%', subs: '4,200+', accuracy: '73%',
    price: 39, color: T.pr, icon: 'ti-broadcast',
    badge: 'Best Seller', badgeCls: 'purple',
    markets: ['BTC', 'ETH', 'ALT'],
    delivery: 'Telegram + App',
  },
  {
    id: 'forexelite',
    name: 'ForexElite',
    tag: 'Forex Signals',
    desc: 'Institutional-grade forex signals from ex-bank traders. Covers majors and select minors.',
    roi: '+22.8%', subs: '1,800+', accuracy: '68%',
    price: 49, color: '#f472b6', icon: 'ti-currency-dollar',
    badge: 'Pro', badgeCls: 'red',
    markets: ['EUR/USD', 'GBP/JPY', 'USD/CHF'],
    delivery: 'App + SMS',
  },
  {
    id: 'stockpulse',
    name: 'StockPulse',
    tag: 'Equities Signals',
    desc: 'Weekly high-conviction stock picks based on technical and fundamental confluence.',
    roi: '+31.4%', subs: '920+', accuracy: '71%',
    price: 29, color: '#38bdf8', icon: 'ti-chart-bar',
    badge: null, badgeCls: null,
    markets: ['NVDA', 'AAPL', 'SPY'],
    delivery: 'App + Email',
  },
];

const ACTIVE_SUBS = [
  { name: 'AlphaGrid',  type: 'Bot',    status: 'Running', statusCls: 'green', pnl: '+$842', pnlPos: true,  renews: 'Jun 1',  price: '$29/mo' },
  { name: 'DCA Master', type: 'Bot',    status: 'Running', statusCls: 'green', pnl: '+$405', pnlPos: true,  renews: 'Jun 4',  price: '$15/mo' },
  { name: 'CryptoEdge', type: 'Signal', status: 'Active',  statusCls: 'blue',  pnl: '—',     pnlPos: false, renews: 'Jun 7',  price: '$39/mo' },
];

/* ─── Components ─────────────────────────────────────────────────────────────── */

function Sidebar({ open }) {
  const mainLinks = [
    { icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { icon: 'ti-copy',             label: 'Copy Trading' },
    { icon: 'ti-users',            label: 'Hire a Trader' },
    { icon: 'ti-chart-line',       label: 'Insights' },
    { icon: 'ti-robot',            label: 'Marketplace', active: true, badge: 'NEW' },
  ];
  const acctLinks = [
    { icon: 'ti-credit-card',      label: 'Payments' },
    { icon: 'ti-user-circle',      label: 'Profile' },
    { icon: 'ti-settings',         label: 'Settings' },
    { icon: 'ti-headset',          label: 'Support' },
  ];
  return (
    <div className={`mp-sidebar${open ? ' open' : ''}`}>
      <div className="mp-brand">
        <div className="mp-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="mp-brand-name">Trade<em>Flow</em></div>
      </div>

      <div className="mp-sb-pill">
        <div className="mp-sb-pill-label">
          <span className="mp-live-dot" /> Portfolio Value
        </div>
        <div className="mp-sb-pill-val">$48,204</div>
        <div className="mp-sb-pill-sub">↑ +$1,247 today</div>
      </div>

      <div className="mp-sb-scroll">
        <div className="mp-sb-section">Main</div>
        {mainLinks.map(({ icon, label, active, badge }) => (
          <a key={label} href="#" className={`mp-sb-link${active ? ' active' : ''}`}>
            <i className={`ti ${icon}`} />
            {label}
            {badge && <span className="mp-sb-badge">{badge}</span>}
          </a>
        ))}

        <div className="mp-sb-section" style={{ marginTop: 8 }}>Account</div>
        {acctLinks.map(({ icon, label }) => (
          <a key={label} href="#" className="mp-sb-link">
            <i className={`ti ${icon}`} />
            {label}
          </a>
        ))}
      </div>

      <div className="mp-sb-user">
        <div className="mp-sb-avatar">AK</div>
        <div>
          <div className="mp-sb-user-name">Alex Kim</div>
          <div className="mp-sb-user-role">Pro · Verified</div>
        </div>
      </div>
    </div>
  );
}

function Topbar({ onMenu }) {
  return (
    <div className="mp-topbar">
      <div className="mp-hamburger" onClick={onMenu}>
        <span /><span /><span />
      </div>
      <div className="mp-topbar-title">Trade<span>Flow</span></div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: T.mono, fontSize: 12, color: T.nt, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: T.gn }}>▲</span> BTC $67,420
      </div>
      <div className="mp-topbar-icon">
        <i className="ti ti-search" />
      </div>
      <div className="mp-topbar-icon">
        <i className="ti ti-bell" />
        <span className="mp-notif-dot" />
      </div>
      <div className="mp-topbar-avatar">AK</div>
    </div>
  );
}

function MetricCard({ m }) {
  return (
    <div className="mp-metric">
      <div className="mp-metric-icon" style={{ background: m.iconBg, color: m.iconColor }}>
        <i className={`ti ${m.icon}`} />
      </div>
      <div className="mp-metric-label">{m.label}</div>
      <div className="mp-metric-value">{m.value}</div>
      <div className="mp-metric-sub">{m.sub}</div>
    </div>
  );
}

function BotCard({ bot, onActivate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="mp-item-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {bot.badge && (
        <span className={`mp-badge mp-badge-${bot.badgeCls}`} style={{ position: 'absolute', top: 14, right: 14 }}>
          {bot.badge}
        </span>
      )}
      <div className="mp-item-card-top">
        <div className="mp-item-card-left">
          <div className="mp-item-icon" style={{ background: bot.color }}>
            <i className={`ti ${bot.icon}`} />
          </div>
          <div>
            <div className="mp-item-name">{bot.name}</div>
            <div className="mp-item-tag">{bot.tag}</div>
          </div>
        </div>
      </div>
      <p className="mp-item-desc">{bot.desc}</p>
      <div className="mp-item-stats">
        <div>
          <div className="mp-stat-val" style={{ color: T.gn }}>{bot.roi}</div>
          <div className="mp-stat-lbl">12m ROI</div>
        </div>
        <div>
          <div className="mp-stat-val">{bot.trades}</div>
          <div className="mp-stat-lbl">Trades</div>
        </div>
        <div>
          <div className="mp-stat-val">{bot.winRate}</div>
          <div className="mp-stat-lbl">Win Rate</div>
        </div>
      </div>
      <div className="mp-markets">
        {bot.markets.map(m => <span key={m} className="mp-market-tag">{m}</span>)}
      </div>
      <div className="mp-item-footer">
        <div>
          <span className="mp-price">${bot.price}</span>
          <span className="mp-per">/month</span>
        </div>
        <button
          className="mp-btn mp-btn-accent mp-btn-sm"
          onClick={() => onActivate(bot, 'bot')}
        >
          <i className="ti ti-player-play" /> Activate
        </button>
      </div>
    </div>
  );
}

function SignalCard({ signal, onSubscribe }) {
  return (
    <div className="mp-item-card">
      {signal.badge && (
        <span className={`mp-badge mp-badge-${signal.badgeCls}`} style={{ position: 'absolute', top: 14, right: 14 }}>
          {signal.badge}
        </span>
      )}
      <div className="mp-item-card-top">
        <div className="mp-item-card-left">
          <div className="mp-item-icon" style={{ background: signal.color }}>
            <i className={`ti ${signal.icon}`} />
          </div>
          <div>
            <div className="mp-item-name">{signal.name}</div>
            <div className="mp-item-tag">{signal.tag}</div>
          </div>
        </div>
      </div>
      <p className="mp-item-desc">{signal.desc}</p>
      <div className="mp-item-stats">
        <div>
          <div className="mp-stat-val" style={{ color: T.gn }}>{signal.roi}</div>
          <div className="mp-stat-lbl">12m ROI</div>
        </div>
        <div>
          <div className="mp-stat-val">{signal.subs}</div>
          <div className="mp-stat-lbl">Subscribers</div>
        </div>
        <div>
          <div className="mp-stat-val">{signal.accuracy}</div>
          <div className="mp-stat-lbl">Accuracy</div>
        </div>
      </div>
      <div className="mp-markets">
        {signal.markets.map(m => <span key={m} className="mp-market-tag">{m}</span>)}
      </div>
      <div className="mp-delivery">
        <i className="ti ti-send" /> Delivered via {signal.delivery}
      </div>
      <div className="mp-item-footer">
        <div>
          <span className="mp-price">${signal.price}</span>
          <span className="mp-per">/month</span>
        </div>
        <button
          className="mp-btn mp-btn-accent mp-btn-sm"
          onClick={() => onSubscribe(signal, 'signal')}
        >
          <i className="ti ti-bell-ringing" /> Subscribe
        </button>
      </div>
    </div>
  );
}

function ActiveSubscriptions() {
  return (
    <div className="mp-active-row">
      <div className="mp-active-head">
        <div className="mp-active-title"><em style={{ fontStyle: 'italic', color: T.g }}>Active</em> Subscriptions</div>
        <a href="#" className="mp-btn mp-btn-ghost mp-btn-sm">
          <i className="ti ti-settings" /> Manage All
        </a>
      </div>
      <table className="mp-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>P&amp;L (30D)</th>
            <th>Renews</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ACTIVE_SUBS.map(s => (
            <tr key={s.name}>
              <td style={{ fontWeight: 600 }}>{s.name}</td>
              <td>
                <span className={`mp-badge mp-badge-${s.type === 'Bot' ? 'gold' : 'blue'}`}>{s.type}</span>
              </td>
              <td>
                <span className={`mp-badge mp-badge-${s.statusCls}`}>{s.status}</span>
              </td>
              <td style={{ fontFamily: T.mono, color: s.pnlPos ? T.gn : T.nt }}>{s.pnl}</td>
              <td style={{ color: T.nt }}>{s.renews}</td>
              <td style={{ fontFamily: T.mono }}>{s.price}</td>
              <td>
                <button className="mp-table-manage-btn">Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubscribeModal({ item, type, onClose }) {
  const [step, setStep] = useState(1);
  const isBot = type === 'bot';

  const stats = isBot
    ? [
        { label: '12m ROI',  val: item.roi,      color: T.gn },
        { label: 'Trades',   val: item.trades,   color: T.gr },
        { label: 'Win Rate', val: item.winRate,  color: T.gr },
      ]
    : [
        { label: '12m ROI',  val: item.roi,       color: T.gn },
        { label: 'Subscribers', val: item.subs,   color: T.gr },
        { label: 'Accuracy', val: item.accuracy,  color: T.gr },
      ];

  return (
    <div className="mp-modal-overlay" onClick={onClose}>
      <div className="mp-modal" onClick={e => e.stopPropagation()}>
        <button className="mp-modal-close" onClick={onClose}>✕</button>

        {step === 1 ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div className="mp-item-icon" style={{ background: item.color, width: 50, height: 50, borderRadius: 13 }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: T.nt }}>{item.tag}</span>
                  {item.badge && <span className={`mp-badge mp-badge-${item.badgeCls}`}>{item.badge}</span>}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mp-modal-stats">
              {stats.map(({ label, val, color }) => (
                <div key={label}>
                  <div className="mp-modal-stat-val" style={{ color }}>{val}</div>
                  <div className="mp-modal-stat-lbl">{label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ fontSize: 12, color: T.nt, marginBottom: 20, lineHeight: 1.6, padding: '10px 12px', background: T.s2, borderRadius: 8 }}>
              {item.desc}
            </div>

            {/* Order summary */}
            <div className="mp-order-summary">
              <div className="mp-order-row">
                <span className="mp-order-row-label">{isBot ? 'Bot plan' : 'Signal plan'}</span>
                <span>{item.name}</span>
              </div>
              <div className="mp-order-row">
                <span className="mp-order-row-label">Billing</span>
                <span>Monthly</span>
              </div>
              {!isBot && (
                <div className="mp-order-row">
                  <span className="mp-order-row-label">Delivery</span>
                  <span>{item.delivery}</span>
                </div>
              )}
              <div className="mp-order-total">
                <span>Total today</span>
                <span style={{ color: T.g, fontFamily: T.mono }}>${item.price}.00</span>
              </div>
            </div>

            <div className="mp-disclaimer">
              <i className="ti ti-info-circle" style={{ color: T.g, fontSize: 13, verticalAlign: -2, marginRight: 5 }} />
              {isBot
                ? 'Automated bots involve risk. Past performance is not a guarantee of future results. Only allocate capital you can afford to lose.'
                : 'Signal accuracy is historical and does not guarantee future results. Always apply your own risk management.'}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="mp-btn mp-btn-ghost mp-btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="mp-btn mp-btn-accent mp-btn-sm" style={{ flex: 1, padding: '10px 0', fontWeight: 700, fontSize: 13 }} onClick={() => setStep(2)}>
                {isBot ? 'Confirm & Activate →' : 'Confirm & Subscribe →'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="mp-success-ring">
              <i className="ti ti-check" />
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 20, marginBottom: 8 }}>
              {isBot ? 'Bot Activated!' : 'Subscribed!'}
            </div>
            <p style={{ fontSize: 13, color: T.nt, marginBottom: 20, lineHeight: 1.6 }}>
              <strong style={{ color: T.gr }}>{item.name}</strong> is now {isBot ? 'running on your connected exchange account' : 'sending signals to your dashboard'}.
            </p>
            <button className="mp-btn mp-btn-accent mp-btn-sm" style={{ padding: '10px 28px', fontWeight: 700 }} onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function Marketplace() {
  const [tab, setTab]         = useState('bots');
  const [modal, setModal]     = useState(null);
  const [modalType, setModalType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ sort: 'roi' });

  const openModal = (item, type) => { setModal(item); setModalType(type); };
  const closeModal = () => { setModal(null); setModalType(null); };

  const sortedBots    = [...BOTS].sort((a, b) => filters.sort === 'price'
    ? a.price - b.price
    : parseFloat(b.roi) - parseFloat(a.roi));
  const sortedSignals = [...SIGNALS].sort((a, b) => filters.sort === 'price'
    ? a.price - b.price
    : parseFloat(b.roi) - parseFloat(a.roi));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 299,
        }} />
      )}

      <div className="mp-shell">
        <Sidebar open={sidebarOpen} />

        <div className="mp-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} />

          <main className="mp-main">
            {/* Page header */}
            <div className="mp-page-header">
              <div>
                <div className="mp-page-title"><em>Marketplace</em></div>
                <div className="mp-page-sub">
                  <span className="mp-live-dot" />
                  Automate your edge — deploy bots and subscribe to expert signal plans.
                </div>
              </div>
              <div className="mp-header-actions">
                <a href="#" className="mp-btn mp-btn-ghost mp-btn-sm">
                  <i className="ti ti-star" /> Wishlist
                </a>
                <a href="#" className="mp-btn mp-btn-accent mp-btn-sm">
                  <i className="ti ti-compass" /> Explore All
                </a>
              </div>
            </div>

            {/* Metrics */}
            <div className="mp-metrics">
              {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            {/* Active subscriptions */}
            <ActiveSubscriptions />

            {/* Controls */}
            <div className="mp-controls">
              <div className="mp-tabs">
                {[
                  { key: 'bots',    label: 'Trading Bots',  icon: 'ti-robot',     count: BOTS.length },
                  { key: 'signals', label: 'Signal Plans',  icon: 'ti-broadcast', count: SIGNALS.length },
                ].map(({ key, label, icon, count }) => (
                  <button key={key} className={`mp-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                    <i className={`ti ${icon}`} />
                    {label}
                    <span className="mp-tab-count" style={{
                      background: tab === key ? 'rgba(0,0,0,.2)' : 'rgba(52,211,153,.2)',
                      color: tab === key ? '#000' : T.gn,
                    }}>{count}</span>
                  </button>
                ))}
              </div>

              <div className="mp-filters">
                <select
                  value={filters.sort}
                  onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                  className="mp-select"
                >
                  <option value="roi">Sort: ROI</option>
                  <option value="price">Sort: Price</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {tab === 'bots' && (
              <>
                <div className="mp-section-intro">
                  <strong>Trading Bots</strong> run 24/7 on your connected exchange account.
                  Set your capital allocation and let the bot execute — no manual intervention needed.
                </div>
                <div className="mp-grid-3">
                  {sortedBots.map(b => (
                    <BotCard key={b.id} bot={b} onActivate={openModal} />
                  ))}
                </div>
              </>
            )}

            {tab === 'signals' && (
              <>
                <div className="mp-section-intro">
                  <strong>Signal Plans</strong> deliver trade alerts with entry, stop-loss, and take-profit levels
                  straight to your app, Telegram, or email. You decide which signals to execute.
                </div>
                <div className="mp-grid-3">
                  {sortedSignals.map(s => (
                    <SignalCard key={s.id} signal={s} onSubscribe={openModal} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {modal && (
        <SubscribeModal item={modal} type={modalType} onClose={closeModal} />
      )}
    </>
  );
}