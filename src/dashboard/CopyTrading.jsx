import React, { useState, useEffect, useCallback } from 'react';
import supabase from "../supabase";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const T = {
  bg:  '#080b10', s:   '#0e1219', s2:  '#141922', br:  '#1e2535', br2: '#2a3347',
  gr:  '#e2e8f0', nt:  '#64748b', g:   '#c8f560', gd:  'rgba(200,245,96,.12)',
  bl:  '#60a5fa', rd:  '#f87171', gn:  '#34d399',  pr:  '#a78bfa',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── Static visual data ─────────────────────────────────────────────────── */
const RISK_COLOR = { Low: '#34d399', Medium: '#f59e0b', High: '#f87171' };
const RISK_BG    = { Low: 'rgba(52,211,153,.12)', Medium: 'rgba(245,158,11,.12)', High: 'rgba(248,113,113,.12)' };

/* Plans that can use copy trading — anything above 'basic' */
const COPY_ALLOWED_PLANS = ['pro', 'elite', 'premium', 'enterprise', 'vip'];
const canUseCopyTrading = (plan) => COPY_ALLOWED_PLANS.includes((plan || '').toLowerCase());

const MAIN_LINKS = [
  { href:'/dashboard', icon:'ti-layout-dashboard', label:'Dashboard' },
  { href:'/copy-trading', icon:'ti-copy',             label:'Copy Trading', active:true },
  { href:'/hire-trader', icon:'ti-users',            label:'Hire a Trader' },
  { href:'/insights', icon:'ti-chart-line',       label:'Insights' },
  { href:'/market-place', icon:'ti-robot',            label:'Marketplace', badge:'NEW' },
  { href:'/terminal', icon:'ti-chart-candle',     label:'Terminal' },
];
const ACCT_LINKS = [
  { href:'/payment', icon:'ti-credit-card',      label:'Payments' },
  { href:'/profile', icon:'ti-user-circle',      label:'Profile' },
  { href:'/settings', icon:'ti-settings',         label:'Settings' },
  { href:'/support', icon:'ti-headset',          label:'Support' },
];

/* ─── No client-side seed data — all data comes from Supabase (seeded via SQL) ── */

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
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
    --accent-rgb: 200,245,96;
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

  /* ── Login Screen ── */
  .ct-login-wrap {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; background: var(--bg);
  }
  .ct-login-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 36px; width: 100%; max-width: 380px;
  }
  .ct-login-brand {
    display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
  }
  .ct-login-brand-icon {
    width: 36px; height: 36px; background: var(--accent); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }
  .ct-login-brand-icon i { font-size: 18px; color: #000; }
  .ct-login-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
  .ct-login-sub { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
  .ct-login-field { margin-bottom: 14px; }
  .ct-login-label { display: block; font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 6px; }
  .ct-login-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 11px 13px; font-size: 13px; color: var(--text);
    font-family: var(--sans); outline: none; transition: border-color .15s;
  }
  .ct-login-input:focus { border-color: var(--accent); }
  .ct-login-err {
    background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.3);
    border-radius: var(--r-sm); padding: 10px 13px; font-size: 12px; color: var(--red);
    margin-bottom: 14px;
  }
  .ct-login-btn {
    width: 100%; background: var(--accent); color: #000;
    border-radius: var(--r-sm); padding: 12px 0; font-size: 14px; font-weight: 700;
    font-family: var(--sans); cursor: pointer; border: none; margin-top: 6px;
    transition: opacity .15s;
  }
  .ct-login-btn:hover { opacity: .88; }
  .ct-login-btn:disabled { opacity: .5; cursor: not-allowed; }

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
    grid-column: 1 !important; grid-row: 1 !important;
    background: var(--surface) !important; border-right: 1px solid var(--border) !important;
    display: flex !important; flex-direction: column !important;
    width: var(--sidebar-w) !important; min-width: var(--sidebar-w) !important;
    height: 100vh !important; overflow-y: auto !important; overflow-x: hidden !important;
    position: relative !important; top: auto !important; left: auto !important;
    transform: none !important; z-index: 100 !important;
    transition: transform .25s cubic-bezier(.4,0,.2,1) !important;
    flex-shrink: 0 !important;
  }
  .ct-sidebar::after {
    content: ''; position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity: .15; pointer-events: none;
  }
  .ct-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .ct-brand-icon {
    width: 34px; height: 34px; background: var(--accent); border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ct-brand-icon i { font-size: 18px; color: #000; }
  .ct-brand-name { font-size: 16px; font-weight: 700; letter-spacing: -.3px; color: var(--text); }
  .ct-brand-name em { color: var(--accent); font-style: normal; }
  .ct-sb-pill {
    margin: 12px 16px; background: var(--accent-dim);
    border: 1px solid rgba(200,245,96,.18); border-radius: var(--r-md); padding: 10px 14px; flex-shrink: 0;
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
  .ct-sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
  .ct-sb-section {
    padding: 10px 20px 4px; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--faint);
  }
  .ct-sb-link {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 20px; font-size: 13px; font-weight: 500;
    color: var(--muted); border-left: 2px solid transparent;
    transition: all .15s; cursor: pointer; position: relative; text-decoration: none;
  }
  .ct-sb-link i { font-size: 18px; flex-shrink: 0; }
  .ct-sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .ct-sb-link.active { color: var(--accent); background: var(--accent-dim); border-left-color: var(--accent); }
  .ct-sb-badge {
    margin-left: auto; font-size: 9px; font-weight: 700;
    background: var(--accent); color: #000; padding: 2px 6px; border-radius: 5px; letter-spacing: .3px;
  }
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
  .ct-sb-logout {
    margin-left: auto; font-size: 11px; color: var(--muted); cursor: pointer;
    padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border);
    transition: all .15s;
  }
  .ct-sb-logout:hover { color: var(--red); border-color: rgba(248,113,113,.4); }

  /* ── Right panel ── */
  .ct-right { grid-column: 2; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

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
  .ct-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
  .ct-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main ── */
  .ct-main { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px 28px 40px; }
  .ct-page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
  }
  .ct-page-title { font-family: var(--serif); font-size: 28px; color: var(--text); line-height: 1.2; }
  .ct-page-title em { color: var(--accent); font-style: italic; }
  .ct-page-sub {
    font-size: 13px; color: var(--muted); margin-top: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .ct-header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .ct-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; border-radius: var(--r-sm); font-family: var(--sans); font-weight: 600;
    cursor: pointer; transition: all .15s; border: none; text-decoration: none; white-space: nowrap;
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
  .ct-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .ct-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px 20px; position: relative; overflow: hidden;
    transition: border-color .2s, transform .2s;
  }
  .ct-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .ct-metric::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .3;
  }
  .ct-metric-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 12px;
  }
  .ct-metric-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .ct-metric-value { font-family: var(--mono); font-size: 20px; font-weight: 600; color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px; }
  .ct-metric-sub { font-size: 11px; color: var(--muted); }

  /* ── Controls bar ── */
  .ct-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
  .ct-tabs { display: flex; gap: 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 4px; }
  .ct-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--r-sm); border: none; cursor: pointer;
    font-family: var(--sans); font-weight: 700; font-size: 12px;
    background: transparent; color: var(--muted); transition: all .15s; white-space: nowrap;
  }
  .ct-tab:hover { color: var(--text); }
  .ct-tab.active { background: var(--accent); color: #000; }
  .ct-tab i { font-size: 14px; }
  .ct-tab-count { font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 99px; }
  .ct-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .ct-select {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); border-radius: var(--r-sm); padding: 7px 10px;
    font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none; transition: border-color .15s;
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
  .ct-trader-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 1px solid var(--border); padding-top: 12px; margin-top: 4px; }
  .ct-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 700; text-align: center; }
  .ct-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; text-align: center; }
  .ct-trader-footer { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
  .ct-hover-cta { position: absolute; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: center; padding: 12px 0; }
  .ct-cta-btn { border-radius: 7px; padding: 6px 20px; font-size: 12px; font-weight: 700; font-family: var(--sans); cursor: pointer; border: none; }

  /* Badge */
  .ct-badge { font-size: 10px; font-weight: 700; font-family: var(--sans); padding: 2px 8px; border-radius: 4px; white-space: nowrap; letter-spacing: .2px; }
  .ct-badge-green { background: rgba(52,211,153,.13); color: #34d399; }
  .ct-badge-blue  { background: rgba(96,165,250,.13); color: #60a5fa; }
  .ct-badge-gold  { background: rgba(200,245,96,.13); color: #c8f560; }
  .ct-badge-red   { background: rgba(248,113,113,.13); color: #f87171; }
  .ct-badge-muted { background: rgba(100,116,139,.13); color: #64748b; }

  /* Pill tag */
  .ct-pill { font-size: 10px; font-weight: 700; font-family: var(--sans); padding: 2px 8px; border-radius: 4px; white-space: nowrap; }

  /* Avatar */
  .ct-av { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--sans); font-weight: 700; color: #000; flex-shrink: 0; }

  /* Copying Card */
  .ct-copying-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; }
  .ct-copy-actions { display: flex; gap: 8px; margin-top: 14px; }
  .ct-copy-btn { flex: 1; border-radius: var(--r-sm); padding: 8px 0; font-size: 12px; font-weight: 700; font-family: var(--sans); cursor: pointer; transition: all .15s; }
  .ct-copy-btn-pause { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .ct-copy-btn-pause:hover { border-color: var(--border2); }
  .ct-copy-btn-stop { background: transparent; border: 1px solid rgba(248,113,113,.35); color: var(--red); }
  .ct-copy-btn-stop:hover { background: var(--red-dim); }

  /* Progress bar */
  .ct-progress { height: 5px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .ct-progress-fill { height: 100%; border-radius: 99px; transition: width .4s ease; }

  /* Mini stat box */
  .ct-mini-stat { background: var(--surface2); border-radius: var(--r-sm); padding: 10px 12px; }
  .ct-mini-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 700; }
  .ct-mini-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; }

  /* Leaderboard */
  .ct-lb-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; }
  .ct-lb-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .ct-lb-title { font-family: var(--serif); font-size: 16px; }
  .ct-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .ct-table th { text-align: left; padding: 9px 16px; color: var(--muted); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .ct-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .ct-table tr:last-child td { border-bottom: none; }
  .ct-table tr:hover td { background: var(--surface2); }
  .ct-table-copy-btn { background: transparent; border: 1px solid var(--border); color: var(--text); border-radius: 7px; padding: 6px 14px; font-size: 11px; font-weight: 700; font-family: var(--sans); cursor: pointer; transition: all .15s; }
  .ct-table-copy-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* Modal */
  .ct-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 600; padding: 16px; }
  .ct-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; padding: 24px; position: relative; }
  .ct-modal-close { position: absolute; top: 14px; right: 14px; background: transparent; border: 1px solid var(--border); color: var(--muted); border-radius: 8px; width: 28px; height: 28px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .ct-modal-close:hover { border-color: var(--red); color: var(--red); }
  .ct-modal-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; background: var(--surface2); border-radius: 10px; padding: 14px; }
  .ct-modal-stat-val { font-family: var(--mono); font-size: 16px; font-weight: 700; text-align: center; }
  .ct-modal-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 3px; text-align: center; }
  .ct-input-label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px; font-weight: 600; }
  .ct-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 10px 12px; font-size: 13px; color: var(--text); font-family: var(--sans); outline: none; transition: border-color .15s; }
  .ct-input:focus { border-color: var(--accent); }
  .ct-proj-return { background: rgba(200,245,96,.07); border: 1px solid rgba(200,245,96,.2); border-radius: 10px; padding: 12px 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .ct-disclaimer { background: rgba(200,175,76,.06); border: 1px solid rgba(200,175,76,.18); border-radius: var(--r-sm); padding: 10px; margin-bottom: 16px; font-size: 11px; color: var(--muted); line-height: 1.5; }

  /* Loading state */
  .ct-loading { display: flex; align-items: center; justify-content: center; padding: 60px; flex-direction: column; gap: 12px; color: var(--muted); font-size: 13px; }
  .ct-spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: ct-spin 0.7s linear infinite; }
  @keyframes ct-spin { to { transform: rotate(360deg); } }

  /* ── Upgrade gate ── */
  .ct-upgrade-modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    width: 100%; max-width: 420px; padding: 32px; position: relative; text-align: center;
  }
  .ct-upgrade-icon {
    width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 18px;
    background: linear-gradient(135deg, #f59e0b22 0%, #f59e0b44 100%);
    border: 1px solid rgba(245,158,11,.3);
    display: flex; align-items: center; justify-content: center; font-size: 26px;
  }
  .ct-upgrade-title { font-family: var(--serif); font-size: 22px; margin-bottom: 8px; }
  .ct-upgrade-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }
  .ct-upgrade-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
  .ct-plan-card {
    border-radius: var(--r-md); padding: 16px 14px; text-align: left; position: relative;
    border: 1px solid var(--border); background: var(--surface2); cursor: pointer;
    transition: all .15s;
  }
  .ct-plan-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .ct-plan-card.recommended {
    border-color: rgba(200,245,96,.4); background: rgba(200,245,96,.05);
  }
  .ct-plan-rec-badge {
    position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: #000; font-size: 9px; font-weight: 800;
    padding: 2px 8px; border-radius: 99px; white-space: nowrap; letter-spacing: .5px;
  }
  .ct-plan-name { font-size: 13px; font-weight: 800; margin-bottom: 4px; color: var(--text); }
  .ct-plan-price { font-family: var(--mono); font-size: 20px; font-weight: 700; color: var(--accent); }
  .ct-plan-price span { font-size: 11px; color: var(--muted); font-family: var(--sans); font-weight: 400; }
  .ct-plan-features { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
  .ct-plan-feat { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 5px; }
  .ct-plan-feat i { color: var(--green); font-size: 12px; }
  .ct-upgrade-cta {
    width: 100%; background: var(--accent); color: #000;
    border-radius: var(--r-sm); padding: 13px 0; font-size: 14px; font-weight: 700;
    font-family: var(--sans); cursor: pointer; border: none; transition: opacity .15s;
    margin-bottom: 10px;
  }
  .ct-upgrade-cta:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .ct-upgrade-skip { font-size: 12px; color: var(--muted); cursor: pointer; background: none; border: none; }
  .ct-upgrade-skip:hover { color: var(--text); }

  /* Locked trader card overlay */
  .ct-card-locked-overlay {
    position: absolute; inset: 0; border-radius: var(--r-lg);
    background: rgba(8,11,16,.72); backdrop-filter: blur(2px);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  }
  .ct-lock-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(245,158,11,.15); border: 1px solid rgba(245,158,11,.3);
    display: flex; align-items: center; justify-content: center; font-size: 16px; color: #f59e0b;
  }
  .ct-lock-label { font-size: 11px; font-weight: 700; color: var(--text); }
  .ct-lock-sub { font-size: 10px; color: var(--muted); }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .ct-metrics { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .ct-shell { grid-template-columns: 1fr !important; }
    .ct-sidebar { position: fixed !important; top: 0 !important; left: 0 !important; transform: translateX(-100%) !important; z-index: 300 !important; }
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

/* ─── Spark ───────────────────────────────────────────────────────────────── */
function Spark({ data, color = T.g, h = 32, w = 72 }) {
  if (!data || data.length < 2) return null;
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

/* ─── Login Screen ───────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      // 1. Sign in via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); setLoading(false); return; }

      const userId = authData.user.id;

      // 2. Fetch user profile + USD wallet balance in parallel
      const [{ data: profile, error: profileError }, { data: wallet }] = await Promise.all([
        supabase
          .from('users')
          .select('id, first_name, last_name, handle, plan, is_verified, avatar_url')
          .eq('id', userId)
          .single(),
        supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', userId)
          .eq('currency', 'USD')
          .single(),
      ]);

      if (profileError || !profile) {
        setError('User profile not found. Please contact support.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      onLogin({ ...profile, balance: parseFloat(wallet?.balance ?? 0) || 0.0 });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-login-wrap">
      <div className="ct-login-card">
        <div className="ct-login-brand">
          <div className="ct-login-brand-icon"><i className="ti ti-trending-up" /></div>
          <span className="ct-brand-name">Trade<em>Flow</em></span>
        </div>
        <div className="ct-login-title">Welcome back</div>
        <div className="ct-login-sub">Sign in to your TradeFlow account</div>
        {error && <div className="ct-login-err"><i className="ti ti-alert-circle" style={{ marginRight:6 }} />{error}</div>}
        <div className="ct-login-field">
          <label className="ct-login-label">Email address</label>
          <input
            type="email" className="ct-login-input" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="ct-login-field">
          <label className="ct-login-label">Password</label>
          <input
            type="password" className="ct-login-input" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button className="ct-login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </div>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ open, user, onLogout }) {
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'U';
  const displayName = user ? `${user.first_name} ${user.last_name}` : 'User';
  const role = user ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} · ${user.is_verified ? 'Verified' : 'Unverified'}` : '';
  const balance = typeof user?.balance === 'number' ? user.balance : 0.0;
  const balanceStr = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <aside className={`ct-sidebar${open ? ' open' : ''}`}>
      <div className="ct-brand">
        <div className="ct-brand-icon"><i className="ti ti-trending-up" /></div>
        <span className="ct-brand-name">Trade<em>Flow</em></span>
      </div>
      <div className="ct-sb-pill">
        <div className="ct-sb-pill-label"><span className="ct-live-dot" /> Live Portfolio</div>
        <div className="ct-sb-pill-val">${balanceStr}</div>
        <div className="ct-sb-pill-sub">Available balance</div>
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
        <div className="ct-sb-avatar">{initials}</div>
        <div>
          <div className="ct-sb-user-name">{displayName}</div>
          <div className="ct-sb-user-role">{role}</div>
        </div>
        <button className="ct-sb-logout" onClick={onLogout} title="Sign out">
          <i className="ti ti-logout" />
        </button>
      </div>
    </aside>
  );
}

/* ─── Topbar ──────────────────────────────────────────────────────────────── */
function Topbar({ onMenu, user, settings }) {
  const firstName = user?.first_name || 'there';
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'U';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const themeIcon = settings?.theme === 'light' ? 'ti-sun' : settings?.theme === 'system' ? 'ti-brightness' : 'ti-moon';
  return (
    <div className="ct-topbar">
      <div className="ct-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="ct-topbar-title">{greeting}, <span>{firstName}</span></div>
      <div className="ct-topbar-icon" title={`Theme: ${settings?.theme || 'dark'}`}>
        <i className={`ti ${themeIcon}`} />
      </div>
      <div className="ct-topbar-icon"><a href='/notification'><i className="ti ti-bell" /><span className="ct-notif-dot" /></a></div>
      <div className="ct-topbar-icon"><a href='/settings'><i className="ti ti-settings" /></a></div>
      <div className="ct-topbar-avatar">{initials}</div>
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
function TraderCard({ t, onCopy, userPlan, settings }) {
  const [hov, setHov] = useState(false);
  const spark = t.perf?.sparkline || [];
  const allowed = canUseCopyTrading(userPlan);
  const chartLabel = settings?.chart_type ? settings.chart_type.charAt(0).toUpperCase() + settings.chart_type.slice(1) : 'Candle';
  const showVol = settings ? settings.show_volume : true;

  const handleClick = () => {
    if (allowed) onCopy(t);
  };

  return (
    <div
      className="ct-trader-card"
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderColor: hov ? `${t.color_hex}55` : undefined, cursor: allowed ? 'pointer' : 'default' }}
    >
      <div className="ct-trader-card-header">
        <div className="ct-av" style={{ width:42, height:42, background:t.color_hex, fontSize:14 }}>{t.initials}</div>
        <span className={`ct-badge ct-badge-${t.badge_type}`}>{t.badge_label}</span>
      </div>
      <div className="ct-trader-name">{t.display_name}</div>
      <div className="ct-trader-handle">{t.handle} · {t.market}</div>
      <div style={{ marginBottom: 12, display:'flex', alignItems:'flex-end', gap:8 }}>
        <Spark data={spark} color={t.color_hex} />
        {showVol && t.perf?.roi_pct != null && (
          <span style={{ fontSize:9, color:T.nt, marginBottom:2 }}>{chartLabel}</span>
        )}
      </div>
      <div className="ct-trader-stats">
        {[
          { label:'30D ROI',  val:`+${t.perf?.roi_pct ?? t.roi_pct ?? 0}%`, color: T.gn },
          { label:'Win Rate', val:`${t.perf?.win_rate_pct ?? t.win_rate_pct ?? 0}%`, color: T.gr },
          { label:'Copiers',  val: (t.total_copiers || 0).toLocaleString(), color: T.gr },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <div className="ct-stat-val" style={{ color }}>{val}</div>
            <div className="ct-stat-lbl">{label}</div>
          </div>
        ))}
      </div>
      <div className="ct-trader-footer">
        <span className="ct-pill" style={{ background: RISK_BG[t.risk_level], color: RISK_COLOR[t.risk_level] }}>{t.risk_level} Risk</span>
        <span className="ct-pill" style={{ background: 'rgba(96,165,250,.1)', color: T.bl }}>{t.years_active}Y Active</span>
      </div>
      {!allowed && (
        <div className="ct-card-locked-overlay">
          <div className="ct-lock-icon"><i className="ti ti-lock" /></div>
          <div className="ct-lock-label">Pro Plan Required</div>
          <div className="ct-lock-sub">Upgrade to copy this trader</div>
        </div>
      )}
      {allowed && hov && (
        <div className="ct-hover-cta" style={{ background: `linear-gradient(transparent, ${t.color_hex}22)` }}>
          <button className="ct-cta-btn" style={{ background: t.color_hex, color: '#000' }}>Copy Trader →</button>
        </div>
      )}
    </div>
  );
}

/* ─── Copying Card ────────────────────────────────────────────────────────── */
function CopyingCard({ rel }) {
  const t = rel.trader_profiles;
  if (!t) return null;
  const allocated = parseFloat(rel.allocated_amount) || 0;
  const gain      = parseFloat(rel.realised_gain) || 0;
  const pct       = allocated > 0 ? ((gain / allocated) * 100).toFixed(1) : '0.0';
  const since     = rel.started_at ? new Date(rel.started_at).toLocaleDateString('en-US', { month:'short', year:'numeric' }) : '—';

  return (
    <div className="ct-copying-card">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <div className="ct-av" style={{ width:38, height:38, background:t.color_hex, fontSize:13 }}>{t.initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily: T.serif, fontSize:14, fontWeight:600 }}>{t.display_name}</div>
          <div style={{ fontSize:11, color:T.nt }}>{t.handle}</div>
        </div>
        <span className={`ct-badge ct-badge-${rel.status === 'active' ? 'green' : rel.status === 'paused' ? 'muted' : 'red'}`}>
          {rel.status.charAt(0).toUpperCase() + rel.status.slice(1)}
        </span>
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:T.nt, marginBottom:6 }}>
          <span>Allocated</span>
          <span style={{ color: T.gn }}>+{pct}% gain</span>
        </div>
        <div className="ct-progress">
          <div className="ct-progress-fill" style={{ width:`${Math.min(parseFloat(pct) * 3, 100)}%`, background: t.color_hex }} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:4 }}>
        {[
          { label:'Allocated', val:`$${allocated.toLocaleString()}` },
          { label:'Gain',      val:`+$${gain.toLocaleString()}`,    color: T.gn },
          { label:'Ratio',     val: rel.copy_ratio === 'proportional' ? 'Prop.' : 'Fixed' },
          { label:'Since',     val: since },
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
function Leaderboard({ traders, onCopy, userPlan, settings }) {
  const sorted = [...traders].sort((a, b) => (b.perf?.roi_pct ?? b.roi_pct ?? 0) - (a.perf?.roi_pct ?? a.roi_pct ?? 0));
  const medals = ['🥇','🥈','🥉'];
  const allowed = canUseCopyTrading(userPlan);
  return (
    <div className="ct-lb-wrap">
      <div className="ct-lb-head">
        <span className="ct-lb-title">30-Day Leaderboard</span>
        <span className="ct-badge ct-badge-gold">Live Rankings</span>
      </div>
      <table className="ct-table">
        <thead>
          <tr>
            {['#','Trader','Market','30D ROI','Win Rate','Copiers',''].map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const roi = t.perf?.roi_pct ?? t.roi_pct ?? 0;
            const wr  = t.perf?.win_rate_pct ?? t.win_rate_pct ?? 0;
            return (
              <tr key={t.handle}>
                <td style={{ fontFamily: T.mono, fontWeight:800, fontSize:14, color: i < 3 ? T.g : T.nt }}>{medals[i] || i+1}</td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="ct-av" style={{ width:30, height:30, background:t.color_hex, fontSize:10 }}>{t.initials}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>{t.display_name}</div>
                      <div style={{ fontSize:11, color:T.nt }}>{t.handle}</div>
                    </div>
                  </div>
                </td>
                <td><span className="ct-badge ct-badge-blue">{t.market}</span></td>
                <td style={{ fontFamily:T.mono, fontWeight:800, color: T.gn }}>+{roi}%</td>
                <td style={{ fontFamily:T.mono }}>{wr}%</td>
                <td style={{ fontFamily:T.mono }}>{(t.total_copiers||0).toLocaleString()}</td>
                <td><button
                  className="ct-table-copy-btn"
                  onClick={() => allowed && onCopy(t)}
                  disabled={!allowed}
                  title={!allowed ? 'Upgrade to Pro to copy traders' : undefined}
                  style={!allowed ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                >
                  {allowed ? 'Copy' : '🔒 Pro'}
                </button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Copy Modal ──────────────────────────────────────────────────────────── */
function CopyModal({ trader: t, onClose, userId, userPlan }) {
  const [amount, setAmount]     = useState('');
  const [stopLoss, setStopLoss] = useState('15');
  const [ratio, setRatio]       = useState('proportional');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saveErr, setSaveErr]   = useState('');
  const estReturn = amount ? ((parseFloat(amount) * (t.perf?.roi_pct ?? t.roi_pct ?? 0)) / 100).toFixed(2) : null;
  const allowed = canUseCopyTrading(userPlan);

  const handleStartCopying = async () => {
    if (!amount || parseFloat(amount) <= 0) { setSaveErr('Please enter a valid amount.'); return; }
    setSaving(true); setSaveErr('');
    try {
      const { error } = await supabase.from('copy_relationships').insert({
        copier_id:        userId,
        trader_id:        t.id,
        allocated_amount: parseFloat(amount),
        currency:         'USD',
        copy_ratio:       ratio,
        stop_loss_pct:    parseFloat(stopLoss) || null,
        status:           'active',
        realised_gain:    0,
      });
      if (error) throw error;
      setSaved(true);
    } catch (err) {
      setSaveErr(err.message || 'Failed to start copying. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ct-modal-overlay" onClick={onClose}>
      <div className="ct-modal" onClick={e => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose}>✕</button>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div className="ct-av" style={{ width:50, height:50, background:t.color_hex, fontSize:16 }}>{t.initials}</div>
          <div>
            <div style={{ fontFamily:T.serif, fontSize:19, fontWeight:600, marginBottom:4 }}>{t.display_name}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:12, color:T.nt }}>{t.handle} · {t.market}</span>
              <span className={`ct-badge ct-badge-${t.badge_type}`}>{t.badge_label}</span>
            </div>
          </div>
        </div>
        <div className="ct-modal-stats">
          {[
            { label:'30D ROI',  val:`+${t.perf?.roi_pct ?? t.roi_pct ?? 0}%`, color: T.gn },
            { label:'Win Rate', val:`${t.perf?.win_rate_pct ?? t.win_rate_pct ?? 0}%`,   color: T.gr },
            { label:'Copiers',  val: (t.total_copiers||0).toLocaleString(), color: T.gr },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="ct-modal-stat-val" style={{ color }}>{val}</div>
              <div className="ct-modal-stat-lbl">{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:12, color:T.nt, marginBottom:20, lineHeight:1.6, padding:'10px 12px', background: T.s2, borderRadius:8 }}>
          {t.strategy_desc}
        </div>
        {!allowed ? (
          /* ── Upgrade wall for Basic plan users ── */
          <div style={{ textAlign:'center', padding:'8px 0 4px' }}>
            <div style={{
              width:56, height:56, borderRadius:14, margin:'0 auto 16px',
              background:'rgba(245,158,11,.15)', border:'1px solid rgba(245,158,11,.35)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:'#f59e0b',
            }}>
              <i className="ti ti-lock" />
            </div>
            <div style={{ fontFamily:T.serif, fontSize:18, fontWeight:600, marginBottom:8 }}>Pro Plan Required</div>
            <div style={{ fontSize:13, color:T.nt, lineHeight:1.6, marginBottom:20 }}>
              Copy trading is available on <strong style={{ color:T.gr }}>Pro</strong> and above plans.<br />
              Upgrade your account to mirror elite traders automatically.
            </div>
            <div style={{ background: T.s2, borderRadius:10, padding:'14px 16px', marginBottom:20, textAlign:'left' }}>
              {['Mirror verified top traders', 'Set custom stop-loss levels', 'Proportional & fixed ratio copying', 'Real-time performance tracking'].map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:T.gr, marginBottom:8 }}>
                  <i className="ti ti-check" style={{ color:T.gn, fontSize:14, flexShrink:0 }} />{f}
                </div>
              ))}
            </div>
            <button
              className="ct-upgrade-cta"
              style={{ width:'100%', background:T.g, color:'#000', borderRadius:10, padding:'13px 0', fontSize:14, fontWeight:700, fontFamily:T.sans, cursor:'pointer', border:'none', marginBottom:10 }}
              onClick={() => { /* navigate to upgrade page */ }}
            >
              Upgrade to Pro →
            </button>
            <button className="ct-upgrade-skip" onClick={onClose}>Maybe later</button>
          </div>
        ) : saved ? (
          <div style={{ background:'rgba(52,211,153,.1)', border:'1px solid rgba(52,211,153,.3)', borderRadius:10, padding:'18px', textAlign:'center', color: T.gn, fontSize:14, fontWeight:600 }}>
            <i className="ti ti-check" style={{ fontSize:20, display:'block', marginBottom:6 }} />
            Now copying {t.display_name.split(' ')[0]}!
          </div>
        ) : (
          <>
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
                <span style={{ fontSize:12, color:T.nt }}>Projected 30D return (at {t.perf?.roi_pct ?? t.roi_pct ?? 0}%)</span>
                <span style={{ fontFamily:T.mono, fontWeight:800, color:T.g, fontSize:16 }}>+${estReturn}</span>
              </div>
            )}
            {saveErr && <div className="ct-login-err" style={{ marginBottom:12 }}>{saveErr}</div>}
            <div className="ct-disclaimer">
              <i className="ti ti-info-circle" style={{ color:T.g, fontSize:13, verticalAlign:-2, marginRight:5 }} />
              Copy trading involves risk. Past performance is not a guarantee of future results.
            </div>
            <button
              className="ct-btn ct-btn-accent"
              style={{ width:'100%', padding:'13px 0', fontSize:14, borderRadius:10, fontWeight:700 }}
              onClick={handleStartCopying}
              disabled={saving}
            >
              {saving ? 'Starting…' : `Start Copying ${t.display_name.split(' ')[0]} →`}
            </button>
          </>
        )}
              </div>
    </div>
  );
}

/* ─── Settings helpers ────────────────────────────────────────────────────── */
const DENSITY_PADDING = { compact: '12px 16px', comfortable: '18px 20px', spacious: '24px 28px' };
const DENSITY_GAP     = { compact: '8px',  comfortable: '14px', spacious: '20px' };
const DENSITY_FONT    = { compact: '13px', comfortable: '14px', spacious: '15px' };

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '200,245,96';
}

function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return theme;
}

const LIGHT_OVERRIDES = `
  :root {
    --bg:         #f0f2f5;
    --surface:    #ffffff;
    --surface2:   #f5f7fa;
    --border:     #e2e6ed;
    --border2:    #c8cdd8;
    --text:       #0f1623;
    --muted:      #64748b;
    --faint:      #9aa5b4;
    --accent-glow:rgba(var(--accent-rgb),.06);
  }
  body, #root { background: var(--bg); color: var(--text); }
  .ct-sidebar { background: var(--surface) !important; border-color: var(--border) !important; }
  .ct-topbar  { background: var(--surface); border-color: var(--border); }
  .ct-metric, .ct-trader-card, .ct-copying-card, .ct-lb-wrap, .ct-modal { background: var(--surface); border-color: var(--border); }
  .ct-tabs, .ct-select, .ct-input, .ct-login-input { background: var(--surface2); border-color: var(--border); color: var(--text); }
  .ct-mini-stat { background: var(--surface2); }
  .ct-table th { background: var(--surface2); }
  .ct-table tr:hover td { background: var(--surface2); }
  .ct-login-card { background: var(--surface); border-color: var(--border); }
  .ct-login-wrap { background: var(--bg); }
`;

function applySettings(settings, rootEl = document.documentElement) {
  if (!settings || !rootEl) return;
  const accent = settings.accent_color || '#c8f560';
  const rgb    = hexToRgb(accent);
  const theme  = resolveTheme(settings.theme || 'dark');
  const density = settings.layout_density || 'comfortable';

  rootEl.style.setProperty('--accent',      accent);
  rootEl.style.setProperty('--accent-rgb',  rgb);
  rootEl.style.setProperty('--accent-dim',  `rgba(${rgb},.12)`);
  rootEl.style.setProperty('--accent-glow', `rgba(${rgb},.06)`);

  // density
  rootEl.style.setProperty('--density-pad', DENSITY_PADDING[density] || DENSITY_PADDING.comfortable);
  rootEl.style.setProperty('--density-gap', DENSITY_GAP[density]     || DENSITY_GAP.comfortable);
  rootEl.style.fontSize = DENSITY_FONT[density] || '14px';

  return theme;
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
export default function CopyTrading() {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab,         setTab]         = useState('top');
  const [modal,       setModal]       = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters,     setFilters]     = useState({ market:'', risk:'', sort:'roi' });
  const [settings,    setSettings]    = useState(null);   // user_settings row
  const [activeTheme, setActiveTheme] = useState('dark'); // resolved theme

  // Data from Supabase
  const [traders,     setTraders]     = useState([]);
  const [copyingRels, setCopyingRels] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [fetchErr,    setFetchErr]    = useState('');

  /* ── Apply settings to CSS vars whenever settings change ── */
  useEffect(() => {
    if (!settings) return;
    const theme = applySettings(settings);
    setActiveTheme(theme);
  }, [settings]);

  /* ── Watch system colour-scheme changes when theme === 'system' ── */
  useEffect(() => {
    if (settings?.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => setActiveTheme(mq.matches ? 'light' : 'dark');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings?.theme]);

  /* ── Fetch user_settings from Supabase ── */
  const fetchSettings = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error && data) setSettings(data);
    } catch (_) {
      // non-critical; silently fall back to defaults
    }
  }, []);

  /* ── 1. On mount: restore session ── */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userId = session.user.id;

        const [{ data: profile }, { data: wallet }] = await Promise.all([
          supabase
            .from('users')
            .select('id, first_name, last_name, handle, plan, is_verified')
            .eq('id', userId)
            .single(),
          supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', userId)
            .eq('currency', 'USD')
            .single(),
        ]);

        if (profile) {
          setUser({
            ...profile,
            balance: parseFloat(wallet?.balance ?? 0) || 0.0,
          });
          await fetchSettings(userId);
        }
      }
      setAuthLoading(false);
    });
  }, []);

  /* ── 2. Fetch data + settings whenever the logged-in user changes ── */
  useEffect(() => {
    if (!user) return;
    fetchData();
    fetchSettings(user.id);
  }, [user]);

  /* ── Fetch trader_profiles + trader_performance + copy_relationships ── */
  const fetchData = useCallback(async () => {
    setDataLoading(true);
    setFetchErr('');
    try {
      // Fetch all active trader profiles with their 30D performance row
      const { data: profileData, error: profileErr } = await supabase
        .from('trader_profiles')
        .select(`
          id, handle, display_name, market, risk_level,
          total_copiers, years_active, color_hex, badge_label, badge_type,
          initials, strategy_desc, is_verified, is_active,
          trader_performance (
            roi_pct, win_rate_pct, max_drawdown_pct, sparkline, period
          )
        `)
        .eq('is_active', true)
        .order('total_copiers', { ascending: false });

      if (profileErr) throw profileErr;

      const enriched = (profileData || []).map(tp => {
        const perf30 = (tp.trader_performance || []).find(p => p.period === '30D');
        return {
          ...tp,
          perf: perf30
            ? { ...perf30, sparkline: perf30.sparkline || [] }
            : null,
        };
      });
      setTraders(enriched);

      // Fetch this user's active/paused copy relationships
      const { data: relData, error: relErr } = await supabase
        .from('copy_relationships')
        .select(`
          id, allocated_amount, currency, copy_ratio, stop_loss_pct,
          status, realised_gain, started_at,
          trader_profiles (
            id, handle, display_name, color_hex, initials, market, badge_type
          )
        `)
        .eq('copier_id', user.id)
        .in('status', ['active', 'paused']);

      if (relErr) throw relErr;
      setCopyingRels(relData || []);

    } catch (err) {
      console.error('fetchData error:', err);
      setFetchErr(err.message || 'Failed to load data.');
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  /* ── Derived metrics ── */
  const totalAllocated = copyingRels.reduce((s, r) => s + parseFloat(r.allocated_amount || 0), 0);
  const totalGain      = copyingRels.reduce((s, r) => s + parseFloat(r.realised_gain || 0), 0);
  const bestPerformer  = traders.reduce((best, t) => {
    const roi = t.perf?.roi_pct ?? 0;
    return roi > (best?.perf?.roi_pct ?? 0) ? t : best;
  }, null);

  const METRICS = [
    { label:'Copying',        value:`${copyingRels.length} Trader${copyingRels.length !== 1 ? 's' : ''}`, sub:'Active now',       color: T.g,  icon:'ti-copy' },
    { label:'Copy Gains',     value:totalGain >= 0 ? `+$${totalGain.toLocaleString()}` : `-$${Math.abs(totalGain).toLocaleString()}`, sub:`▲ Total realised gain`, color: '#34d399', icon:'ti-trending-up' },
    { label:'Allocated',      value:`$${totalAllocated.toLocaleString()}`, sub:'Total in copy trades', color: T.bl, icon:'ti-wallet' },
    { label:'Best Performer', value: bestPerformer ? bestPerformer.handle : '—', sub: bestPerformer ? `+${bestPerformer.perf?.roi_pct ?? 0}% / 30D` : 'No data yet', color: T.g,  icon:'ti-trophy' },
  ];

  /* ── Filters ── */
  const filtered = traders
    .filter(t => !filters.market || t.market === filters.market)
    .filter(t => !filters.risk   || t.risk_level === filters.risk)
    .sort((a, b) => {
      if (filters.sort === 'wr')      return (b.perf?.win_rate_pct ?? b.win_rate_pct ?? 0) - (a.perf?.win_rate_pct ?? a.win_rate_pct ?? 0);
      if (filters.sort === 'copiers') return (b.total_copiers || 0) - (a.total_copiers || 0);
      return (b.perf?.roi_pct ?? b.roi_pct ?? 0) - (a.perf?.roi_pct ?? a.roi_pct ?? 0);
    });

  const sel = key => e => setFilters(f => ({ ...f, [key]: e.target.value }));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTraders([]);
    setCopyingRels([]);
  };

  /* ── Render ── */
  if (authLoading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}
        <div className="ct-loading"><div className="ct-spinner" /><span>Loading…</span></div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}
        <LoginScreen onLogin={async (u) => { setUser(u); await fetchSettings(u.id); }} />
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}
      {/* Grid-lines toggle: hide SVG grid elements when show_grid_lines is false */}
      {settings?.show_grid_lines === false && (
        <style dangerouslySetInnerHTML={{ __html: `.recharts-cartesian-grid { display: none; }` }} />
      )}

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299 }} />
      )}

      <div className="ct-shell">
        <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />

        <div className="ct-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} settings={settings} />

          <main className="ct-main" style={{ padding: `24px var(--density-pad, 28px) 40px` }}>
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
                <a href="#" className="ct-btn ct-btn-ghost ct-btn-sm"><i className="ti ti-download" /> Export</a>
                <a href="/copy-trading" className="ct-btn ct-btn-accent ct-btn-sm"><i className="ti ti-plus" /> New Copy</a>
              </div>
            </div>

            {/* Fetch error */}
            {fetchErr && (
              <div className="ct-login-err" style={{ marginBottom:14 }}>
                <i className="ti ti-alert-circle" style={{ marginRight:6 }} />{fetchErr}
              </div>
            )}

            {/* Metrics */}
            <div className="ct-metrics" style={{ gap: `var(--density-gap, 14px)`, marginBottom: 20 }}>
              {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            {/* Controls */}
            <div className="ct-controls">
              <div className="ct-tabs">
                {[
                  { key:'top',     label:'Top Traders', icon:'ti-users' },
                  { key:'copying', label:'Copying',     icon:'ti-copy', count: copyingRels.length },
                  { key:'leaders', label:'Leaderboard', icon:'ti-trophy' },
                ].map(({ key, label, icon, count }) => (
                  <button key={key} className={`ct-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                    <i className={`ti ${icon}`} />
                    {label}
                    {count > 0 && (
                      <span className="ct-tab-count" style={{
                        background: tab === key ? 'rgba(0,0,0,.2)' : 'rgba(52,211,153,.2)',
                        color: tab === key ? '#000' : T.gn,
                      }}>{count}</span>
                    )}
                  </button>
                ))}
              </div>

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
            {dataLoading ? (
              <div className="ct-loading"><div className="ct-spinner" /><span>Fetching traders…</span></div>
            ) : (
              <>
                {tab === 'top' && (
                  <div className="ct-grid-3" style={{ gap: `var(--density-gap, 14px)` }}>
                    {filtered.map(t => <TraderCard key={t.handle} t={t} onCopy={setModal} userPlan={user?.plan} settings={settings} />)}
                    {filtered.length === 0 && (
                      <div style={{ gridColumn:'1/-1', textAlign:'center', color:T.nt, padding:40, fontSize:13 }}>
                        No traders match those filters.
                      </div>
                    )}
                  </div>
                )}

                {tab === 'copying' && (
                  <div className="ct-grid-3" style={{ gap: `var(--density-gap, 14px)` }}>
                    {copyingRels.length === 0
                      ? <div style={{ gridColumn:'1/-1', textAlign:'center', color:T.nt, padding:40, fontSize:13 }}>You are not copying any traders yet.</div>
                      : copyingRels.map(rel => <CopyingCard key={rel.id} rel={rel} />)
                    }
                  </div>
                )}

                {tab === 'leaders' && (
                  <div className="ct-grid-1">
                    <Leaderboard traders={traders} onCopy={setModal} userPlan={user?.plan} settings={settings} />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {modal && (
        <CopyModal
          trader={modal}
          onClose={() => { setModal(null); fetchData(); }}
          userId={user.id}
          userPlan={user?.plan}
        />
      )}
    </>
  );
}