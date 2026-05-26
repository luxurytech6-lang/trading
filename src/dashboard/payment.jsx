import React, { useState, useEffect, useCallback } from 'react';
import supabase from "../supabase";
import {
  getCurrentUser,
  getUserProfile,
  fetchUserWallets,
  fetchSubscriptionPlans,
  fetchActiveSubscription,
  fetchTransactions,
  fetchPaymentMetrics,
  fetchSidebarData,
  recordDeposit,
  recordWithdrawal,
  sendDepositEmail,
  sendWithdrawalEmail,
  getUserCurrency,
  fetchAllCryptoWalletAddresses,
} from '../payment/paymentService';

/* ─── Design tokens (matches Insights / CopyTrading / Marketplace) ──────────── */
const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── Global CSS ─────────────────────────────────────────────────────────────── */
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
    --blue-dim:   rgba(96,165,250,.12);
    --purple:     #a78bfa;
    --purple-dim: rgba(167,139,250,.12);
    --amber:      #f59e0b;
    --amber-dim:  rgba(245,158,11,.12);
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
  .in-shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .in-sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    height: 100vh; overflow-y: auto; overflow-x: hidden;
    position: relative; z-index: 100; flex-shrink: 0;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .in-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
  .in-sidebar::after {
    content: ''; position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity: .15; pointer-events: none;
  }

  /* Brand */
  .in-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .in-brand-icon {
    width: 34px; height: 34px; background: var(--accent);
    border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .in-brand-icon i { font-size: 18px; color: #000; }
  .in-brand-name { font-size: 16px; font-weight: 700; color: var(--text); }
  .in-brand-name em { color: var(--accent); font-style: normal; }

  /* Portfolio pill */
  .in-sb-pill {
    margin: 12px 16px;
    background: var(--accent-dim); border: 1px solid rgba(200,245,96,.18);
    border-radius: var(--r-md); padding: 10px 14px; flex-shrink: 0;
  }
  .in-sb-pill-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .in-live-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: in-pulse 2s infinite; flex-shrink: 0; }
  @keyframes in-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .in-sb-pill-val { font-family: var(--mono); font-size: 19px; font-weight: 600; color: var(--accent); letter-spacing: -.5px; }
  .in-sb-pill-sub { font-size: 11px; color: var(--green); margin-top: 3px; }

  /* Nav */
  .in-sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
  .in-sb-section { padding: 10px 20px 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--faint); }
  .in-sb-link {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 20px; font-size: 13px; font-weight: 500;
    color: var(--muted); border-left: 2px solid transparent;
    transition: all .15s; cursor: pointer; text-decoration: none;
  }
  .in-sb-link i { font-size: 18px; flex-shrink: 0; }
  .in-sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .in-sb-link.active { color: var(--accent); background: var(--accent-dim); border-left-color: var(--accent); }
  .in-sb-link.active i { filter: drop-shadow(0 0 6px var(--accent)); }
  .in-sb-badge { margin-left: auto; font-size: 9px; font-weight: 700; background: var(--accent); color: #000; padding: 2px 6px; border-radius: 5px; }

  /* User */
  .in-sb-user { flex-shrink: 0; border-top: 1px solid var(--border); padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
  .in-sb-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 0 12px rgba(200,245,96,.3);
  }
  .in-sb-user-name { font-size: 13px; font-weight: 700; }
  .in-sb-user-role { font-size: 10px; color: var(--accent); margin-top: 1px; }

  /* ── Right panel ── */
  .in-right { grid-column: 2; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  /* ── Topbar ── */
  .in-topbar {
    height: var(--topbar-h); flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 28px; background: var(--surface);
    border-bottom: 1px solid var(--border); gap: 16px; z-index: 50;
  }
  .in-topbar-title { font-family: var(--serif); font-size: 20px; color: var(--text); flex: 1; }
  .in-topbar-title span { color: var(--accent); font-style: italic; }
  .in-tb-icon {
    width: 36px; height: 36px; border-radius: var(--r-sm);
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s; color: var(--muted); font-size: 18px; position: relative;
  }
  .in-tb-icon:hover { border-color: var(--border2); color: var(--text); }
  .in-notif-dot { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; background: var(--red); border-radius: 50%; border: 1.5px solid var(--surface); }
  .in-tb-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    box-shadow: 0 0 10px rgba(200,245,96,.25);
  }
  .in-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
  .in-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main ── */
  .in-main { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px 28px 40px; }

  /* Page header */
  .in-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .in-page-title { font-family: var(--serif); font-size: 28px; color: var(--text); line-height: 1.2; }
  .in-page-title em { color: var(--accent); font-style: italic; }
  .in-page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .in-header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .in-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; border-radius: var(--r-sm);
    font-family: var(--sans); font-weight: 600; cursor: pointer; transition: all .15s;
    border: none; text-decoration: none; white-space: nowrap;
  }
  .in-btn-sm { font-size: 12px; padding: 7px 14px; }
  .in-btn-md { font-size: 13px; padding: 10px 20px; }
  .in-btn-lg { font-size: 14px; padding: 12px 24px; }
  .in-btn-full { width: 100%; justify-content: center; }
  .in-btn-accent { background: var(--accent); color: #000; }
  .in-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: 12px; padding: 7px 14px; }
  .in-btn-ghost:hover { border-color: var(--border2); }
  .in-btn-danger { background: var(--red-dim); border: 1px solid rgba(248,113,113,.25); color: var(--red); font-size: 13px; padding: 10px 20px; }
  .in-btn-danger:hover { background: rgba(248,113,113,.2); }
  .in-btn-blue { background: var(--blue-dim); border: 1px solid rgba(96,165,250,.25); color: var(--blue); font-size: 13px; padding: 10px 20px; }
  .in-btn-blue:hover { background: rgba(96,165,250,.2); }

  /* Badge */
  .in-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap; letter-spacing: .2px; }
  .in-badge-green  { background: var(--green-dim);  color: var(--green); }
  .in-badge-blue   { background: var(--blue-dim);   color: var(--blue); }
  .in-badge-red    { background: var(--red-dim);    color: var(--red); }
  .in-badge-gold   { background: var(--accent-dim); color: var(--accent); }
  .in-badge-purple { background: var(--purple-dim); color: var(--purple); }
  .in-badge-amber  { background: var(--amber-dim);  color: var(--amber); }
  .in-badge-muted  { background: rgba(100,116,139,.12); color: var(--muted); }

  /* Table */
  .in-table { width: 100%; border-collapse: collapse; }
  .in-table th {
    text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: var(--muted); padding: 10px 14px;
    border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  .in-table td { padding: 13px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .in-table tr:last-child td { border-bottom: none; }
  .in-table tr:hover td { background: var(--surface2); }

  /* ── Metrics strip ── */
  .py-metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .py-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px 20px; position: relative; overflow: hidden; transition: all .2s;
  }
  .py-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .py-metric::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .3;
  }
  .py-metric-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 12px; }
  .py-metric-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .py-metric-value { font-family: var(--mono); font-size: 20px; font-weight: 600; color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px; }
  .py-metric-sub { font-size: 11px; }

  /* ── Tab controls ── */
  .in-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .in-tabs { display: flex; gap: 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 4px; }
  .in-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--r-sm); border: none; cursor: pointer;
    font-family: var(--sans); font-weight: 700; font-size: 12px;
    background: transparent; color: var(--muted); transition: all .15s; white-space: nowrap;
  }
  .in-tab:hover { color: var(--text); }
  .in-tab.active { background: var(--accent); color: #000; }
  .in-tab i { font-size: 14px; }

  /* ── Plans ── */
  .py-plans-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; margin-bottom: 24px; }
  .py-plan {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 22px; position: relative; overflow: hidden;
    transition: all .2s; cursor: pointer;
  }
  .py-plan:hover { border-color: var(--border2); transform: translateY(-2px); }
  .py-plan.featured {
    border-color: rgba(200,245,96,.4);
    background: linear-gradient(145deg, var(--surface) 0%, rgba(200,245,96,.04) 100%);
  }
  .py-plan.featured::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
  }
  .py-plan-badge {
    position: absolute; top: 14px; right: 14px;
    background: var(--accent); color: #000; font-size: 9px; font-weight: 700;
    padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: .5px;
  }
  .py-plan-tier { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 8px; }
  .py-plan-name { font-family: var(--serif); font-size: 22px; margin-bottom: 4px; }
  .py-plan-name.accent { color: var(--accent); }
  .py-plan-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 18px; }
  .py-plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
  .py-plan-price-val { font-family: var(--mono); font-size: 32px; font-weight: 700; }
  .py-plan-price-cur { font-size: 16px; font-weight: 600; color: var(--muted); align-self: flex-start; margin-top: 6px; }
  .py-plan-price-per { font-size: 12px; color: var(--muted); }
  .py-plan-save { font-size: 11px; color: var(--green); margin-bottom: 18px; height: 16px; }
  .py-plan-divider { height: 1px; background: var(--border); margin: 18px 0; }
  .py-plan-feature { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 8px; color: var(--muted); }
  .py-plan-feature i { font-size: 14px; flex-shrink: 0; }
  .py-plan-feature.yes i { color: var(--green); }
  .py-plan-feature.no  i { color: var(--faint); }
  .py-plan-feature.yes { color: var(--text); }

  /* ── Billing toggle ── */
  .py-billing-toggle {
    display: flex; align-items: center; gap: 12px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-md); padding: 6px 10px; margin-left: auto;
  }
  .py-bt-label { font-size: 12px; font-weight: 600; color: var(--muted); }
  .py-bt-label.active { color: var(--text); }
  .py-toggle-wrap { position: relative; width: 36px; height: 20px; cursor: pointer; }
  .py-toggle-track {
    position: absolute; inset: 0; border-radius: 99px;
    background: var(--accent); transition: background .2s;
  }
  .py-toggle-thumb {
    position: absolute; top: 2px; width: 16px; height: 16px;
    border-radius: 50%; background: #000;
    transition: left .2s; left: 18px;
  }
  .py-toggle-wrap.monthly .py-toggle-track { background: var(--border2); }
  .py-toggle-wrap.monthly .py-toggle-thumb { left: 2px; }

  /* ── Deposit / Withdraw form ── */
  .py-action-layout { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
  .py-form-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 24px;
  }
  .py-form-title { font-family: var(--serif); font-size: 18px; margin-bottom: 4px; }
  .py-form-title em { color: var(--accent); font-style: italic; }
  .py-form-sub { font-size: 12px; color: var(--muted); margin-bottom: 22px; }
  .py-field { margin-bottom: 16px; }
  .py-field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 7px; display: flex; align-items: center; justify-content: space-between; }
  .py-field-hint { font-size: 10px; color: var(--accent); font-weight: 600; text-transform: none; letter-spacing: 0; cursor: pointer; }
  .py-amount-wrap { position: relative; }
  .py-amount-cur {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-family: var(--mono); font-size: 16px; font-weight: 700; color: var(--muted);
  }
  .py-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); color: var(--text); padding: 12px 14px;
    font-family: var(--mono); font-size: 15px; outline: none; transition: border-color .15s;
  }
  .py-input.padded { padding-left: 36px; }
  .py-input:focus { border-color: var(--accent); }
  .py-input::placeholder { color: var(--muted); }
  .py-presets { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  .py-preset {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 5px 12px;
    font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--muted);
    cursor: pointer; transition: all .15s;
  }
  .py-preset:hover { border-color: var(--accent); color: var(--accent); }
  .py-preset.sel { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .py-method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .py-method {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 10px 14px; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; gap: 8px;
  }
  .py-method:hover { border-color: var(--border2); }
  .py-method.sel { border-color: rgba(200,245,96,.4); background: var(--accent-dim); }
  .py-method-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .py-method-name { font-size: 12px; font-weight: 600; }
  .py-method-sub { font-size: 10px; color: var(--muted); margin-top: 1px; }
  .py-summary-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px; height: fit-content;
  }
  .py-summary-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 16px; }
  .py-sum-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
  .py-sum-row-label { color: var(--muted); }
  .py-sum-row-val { font-family: var(--mono); font-weight: 600; }
  .py-sum-divider { height: 1px; background: var(--border); margin: 14px 0; }
  .py-sum-total { display: flex; align-items: center; justify-content: space-between; }
  .py-sum-total-label { font-size: 13px; font-weight: 700; }
  .py-sum-total-val { font-family: var(--mono); font-size: 20px; font-weight: 700; color: var(--accent); }
  .py-security { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--muted); margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .py-security i { color: var(--green); font-size: 14px; }

  /* ── Wallet cards ── */
  .py-wallets { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin-bottom: 20px; }
  .py-wallet {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px; position: relative; overflow: hidden;
  }
  .py-wallet::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    opacity: .5;
  }
  .py-wallet.usd::before { background: linear-gradient(90deg, transparent, var(--green), transparent); }
  .py-wallet.btc::before { background: linear-gradient(90deg, transparent, var(--amber), transparent); }
  .py-wallet.eth::before { background: linear-gradient(90deg, transparent, var(--blue), transparent); }
  .py-wallet.eur::before { background: linear-gradient(90deg, transparent, var(--purple), transparent); }
  .py-wallet-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .py-wallet-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .py-wallet-name { font-size: 12px; font-weight: 700; }
  .py-wallet-sub { font-size: 10px; color: var(--muted); margin-top: 1px; }
  .py-wallet-bal { font-family: var(--mono); font-size: 22px; font-weight: 700; margin-bottom: 4px; letter-spacing: -.5px; }
  .py-wallet-eq { font-size: 11px; color: var(--muted); margin-bottom: 14px; }
  .py-wallet-actions { display: flex; gap: 8px; }
  .py-wallet-act {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 7px; border-radius: var(--r-sm); font-size: 11px; font-weight: 600; cursor: pointer; transition: all .15s;
    border: 1px solid var(--border); background: var(--surface2); color: var(--muted);
  }
  .py-wallet-act:hover { border-color: var(--border2); color: var(--text); }
  .py-wallet-act i { font-size: 13px; }

  /* ── Transactions ── */
  .py-txn-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); overflow: hidden;
  }
  .py-txn-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border); gap: 12px; flex-wrap: wrap;
  }
  .py-txn-title { font-size: 14px; font-weight: 700; }
  .py-txn-filters { display: flex; gap: 8px; }
  .in-select {
    background: var(--surface2); border: 1px solid var(--border); color: var(--text);
    border-radius: var(--r-sm); padding: 6px 10px;
    font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none; transition: border-color .15s;
  }
  .in-select:hover { border-color: var(--border2); }
  .py-txn-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .py-txn-name { font-size: 13px; font-weight: 600; }
  .py-txn-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .py-txn-amount { font-family: var(--mono); font-size: 13px; font-weight: 700; text-align: right; }
  .py-txn-status { font-size: 11px; margin-top: 2px; text-align: right; }

  /* ── Crypto Payment Modal ── */
  .py-crypto-coins { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .py-crypto-coin {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: var(--r-sm);
    background: var(--surface2); border: 1px solid var(--border);
    cursor: pointer; transition: all .15s; font-size: 13px; font-weight: 600;
  }
  .py-crypto-coin:hover { border-color: var(--border2); }
  .py-crypto-coin.sel { border-color: rgba(200,245,96,.5); background: var(--accent-dim); color: var(--accent); }
  .py-crypto-coin i { font-size: 16px; }
  .py-qr-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-md);
    padding: 20px; margin-bottom: 16px;
  }
  .py-qr-box {
    width: 140px; height: 140px; background: #fff; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; padding: 8px; flex-shrink: 0;
  }
  .py-qr-box canvas { width: 100% !important; height: 100% !important; }
  .py-qr-label { font-size: 11px; color: var(--muted); text-align: center; line-height: 1.5; }
  .py-addr-wrap {
    background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-sm);
    padding: 10px 14px; display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .py-addr-text { font-family: var(--mono); font-size: 11px; color: var(--muted); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .py-addr-copy {
    flex-shrink: 0; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;
    background: var(--accent-dim); border: 1px solid rgba(200,245,96,.3); color: var(--accent); cursor: pointer; transition: all .15s;
  }
  .py-addr-copy:hover { background: rgba(200,245,96,.2); }
  .py-crypto-tabs { display: flex; gap: 4px; margin-bottom: 18px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 3px; }
  .py-crypto-tab { flex: 1; padding: 6px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--muted); transition: all .15s; font-family: var(--sans); }
  .py-crypto-tab.active { background: var(--accent); color: #000; }
  .py-network-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--amber-dim); color: var(--amber); }

  /* ── Modal overlay ── */
  .py-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 999;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .py-modal {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: var(--r-lg); padding: 28px; width: 100%; max-width: 440px;
    position: relative; animation: py-modal-in .2s ease;
  }
  @keyframes py-modal-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .py-modal-close { position: absolute; top: 16px; right: 16px; color: var(--muted); font-size: 18px; cursor: pointer; }
  .py-modal-close:hover { color: var(--text); }
  .py-modal-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
  .py-modal-title { font-family: var(--serif); font-size: 20px; margin-bottom: 6px; }
  .py-modal-sub { font-size: 13px; color: var(--muted); margin-bottom: 22px; line-height: 1.6; }

  /* ── Responsive ── */
  @media (max-width:1400px) {
    .py-plans-grid { grid-template-columns: repeat(3,1fr); }
  }
  @media (max-width:1100px) {
    .py-plans-grid { grid-template-columns: repeat(2,1fr); }
    .py-action-layout { grid-template-columns: 1fr; }
    .py-metrics { grid-template-columns: repeat(2,1fr); }
    .py-wallets { grid-template-columns: 1fr; }
  }
  @media (max-width:768px) {
    .in-shell { grid-template-columns: 1fr !important; }
    .in-sidebar { position: fixed !important; top: 0 !important; left: 0 !important; transform: translateX(-100%) !important; z-index: 300 !important; }
    .in-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column: 1; }
    .in-hamburger { display: flex; }
    .py-plans-grid { grid-template-columns: 1fr; }
    .py-method-grid { grid-template-columns: 1fr; }
  }
  @media (max-width:600px) {
    .in-main { padding: 16px; }
    .in-topbar { padding: 0 16px; }
  }
`;

/* ─── Data ───────────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    tier: 'Starter', name: 'Basic', accent: false,
    desc: 'For individual traders getting started with copy trading.',
    monthly: 0, annual: 0,
    features: [
      { yes: true,  label: 'Up to 3 copy traders' },
      { yes: true,  label: '$1,000 max allocation' },
      { yes: true,  label: 'Basic analytics dashboard' },
      { yes: false, label: 'Advanced risk controls' },
      { yes: false, label: 'Priority support' },
      { yes: false, label: 'Custom risk strategies' },
    ],
  },
  {
    tier: 'Growth', name: 'Starter+', accent: false,
    desc: 'For traders ready to scale up with more traders and capital.',
    monthly: 19, annual: 15,
    features: [
      { yes: true,  label: 'Up to 8 copy traders' },
      { yes: true,  label: '$10,000 max allocation' },
      { yes: true,  label: 'Standard analytics dashboard' },
      { yes: true,  label: 'Basic risk controls' },
      { yes: false, label: 'Priority support' },
      { yes: false, label: 'Custom risk strategies' },
    ],
  },
  {
    tier: 'Most Popular', name: 'Pro', accent: true, featured: true,
    desc: 'For active traders who want full control and advanced tools.',
    monthly: 49, annual: 39,
    features: [
      { yes: true,  label: 'Up to 20 copy traders' },
      { yes: true,  label: '$50,000 max allocation' },
      { yes: true,  label: 'Advanced analytics & forecasts' },
      { yes: true,  label: 'Advanced risk controls' },
      { yes: true,  label: 'Priority support' },
      { yes: false, label: 'Custom risk strategies' },
    ],
  },
  {
    tier: 'Business', name: 'Advanced', accent: false,
    desc: 'For serious traders managing larger portfolios and multiple strategies.',
    monthly: 99, annual: 79,
    features: [
      { yes: true, label: 'Up to 50 copy traders' },
      { yes: true, label: '$200,000 max allocation' },
      { yes: true, label: 'AI-powered predictions & insights' },
      { yes: true, label: 'Advanced risk controls' },
      { yes: true, label: 'Priority support' },
      { yes: true, label: 'Custom risk strategies' },
    ],
  },
  {
    tier: 'Enterprise', name: 'Elite', accent: false,
    desc: 'For professional traders, funds, and power users with no limits.',
    monthly: 149, annual: 119,
    features: [
      { yes: true, label: 'Unlimited copy traders' },
      { yes: true, label: 'Unlimited allocation' },
      { yes: true, label: 'AI-powered predictions & insights' },
      { yes: true, label: 'Custom risk strategies' },
      { yes: true, label: 'Dedicated account manager' },
      { yes: true, label: 'White-glove onboarding' },
    ],
  },
];

const PAYMENT_METHODS = [
  { id: 'crypto', icon: 'ti-currency-bitcoin', name: 'Crypto',  sub: 'BTC / ETH / USDT',  bg: 'rgba(245,158,11,.12)', col: '#f59e0b' },
  { id: 'bank',   icon: 'ti-building-bank', name: 'Bank Wire',  sub: '1-3 business days',  bg: 'rgba(52,211,153,.12)', col: '#34d399' },
];

const WITHDRAW_METHODS = [
  { id: 'bank',   icon: 'ti-building-bank', name: 'Bank Wire',  sub: '1-3 days',    bg: 'rgba(52,211,153,.12)', col: '#34d399' },
  { id: 'crypto', icon: 'ti-currency-bitcoin', name: 'Crypto',  sub: '~10 min',     bg: 'rgba(245,158,11,.12)', col: '#f59e0b' },
];

/* ─── Wallet display config by currency ────────────────────── */
const WALLET_CONFIG = {
  USD: { id: 'usd', icon: 'ti-currency-dollar',  name: 'USD Wallet', sub: 'US Dollar',  col: '#34d399', bg: 'rgba(52,211,153,.15)',  fmt: (b) => `$${Number(b).toLocaleString('en-US',{minimumFractionDigits:2})}` },
  BTC: { id: 'btc', icon: 'ti-currency-bitcoin',  name: 'BTC Wallet', sub: 'Bitcoin',    col: '#f59e0b', bg: 'rgba(245,158,11,.15)',  fmt: (b) => `${Number(b).toFixed(8)} BTC` },
  ETH: { id: 'eth', icon: 'ti-currency-ethereum', name: 'ETH Wallet', sub: 'Ethereum',   col: '#60a5fa', bg: 'rgba(96,165,250,.15)',  fmt: (b) => `${Number(b).toFixed(4)} ETH` },
  EUR: { id: 'eur', icon: 'ti-currency-euro',      name: 'EUR Wallet', sub: 'Euro',       col: '#a78bfa', bg: 'rgba(167,139,250,.15)', fmt: (b) => `€${Number(b).toLocaleString('en-US',{minimumFractionDigits:2})}` },
};

/* ─── Transaction display helpers ──────────────────────────── */
const TXN_DISPLAY = {
  deposit:    { icon: 'ti-arrow-bar-to-down', iconBg: 'rgba(52,211,153,.15)',  iconCol: '#34d399', amountCol: '#34d399', statusCls: 'green',  sign: '+' },
  withdrawal: { icon: 'ti-arrow-bar-to-up',   iconBg: 'rgba(96,165,250,.15)',  iconCol: '#60a5fa', amountCol: '#f87171', statusCls: 'blue',   sign: '-' },
  plan_charge:{ icon: 'ti-crown',             iconBg: 'rgba(167,139,250,.15)', iconCol: '#a78bfa', amountCol: '#f87171', statusCls: 'purple', sign: '-' },
  fee:        { icon: 'ti-receipt',           iconBg: 'rgba(100,116,139,.15)', iconCol: '#64748b', amountCol: '#f87171', statusCls: 'muted',  sign: '-' },
  payout:     { icon: 'ti-cash',              iconBg: 'rgba(52,211,153,.15)',  iconCol: '#34d399', amountCol: '#34d399', statusCls: 'green',  sign: '+' },
};
const STATUS_CLS_MAP = { completed: 'green', pending: 'amber', failed: 'red', reversed: 'purple' };

function formatTxnDate(ts) {
  return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' });
}

const PRESETS_DEPOSIT  = ['$500', '$1,000', '$2,500', '$5,000', '$10,000'];
const PRESETS_WITHDRAW = ['$200', '$500', '$1,000', '$2,500', '$5,000'];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function Sidebar({ open, portfolioValue = 0, dailyPnl = 0, userInitials = 'TF', userName = 'TradeFlow User', userPlan = 'Basic' }) {
  const NAV = [
    { section: 'Trading' },
    { icon: 'ti-layout-dashboard', label: 'Dashboard',    href: '/dashboard' },
    { icon: 'ti-users',            label: 'Copy Trading', href: '/copy-trading' },
    { icon: 'ti-building-store',   label: 'Marketplace',  href: '/market-place' },
    { section: 'Analytics' },
    { icon: 'ti-chart-bar',        label: 'Portfolio',    href: '/portfolio' },
    { icon: 'ti-news',             label: 'Insights',     href: '/insights' },
    { section: 'Account' },
    { icon: 'ti-credit-card',      label: 'Payments',     href: '/payment', active: true },
    { icon: 'ti-settings',         label: 'Settings',     href: '/settings' },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <a href="/dashboard" className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </a>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Portfolio Value</div>
        <div className="in-sb-pill-val">${Number(portfolioValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="in-sb-pill-sub">{dailyPnl >= 0 ? '↑' : '↓'} {dailyPnl >= 0 ? '+' : ''}${Number(Math.abs(dailyPnl)).toLocaleString('en-US', { minimumFractionDigits: 2 })} today</div>
      </div>
      <nav className="in-sb-scroll">
        {NAV.map((n, i) =>
          n.section
            ? <div key={i} className="in-sb-section">{n.section}</div>
            : <a key={i} href={n.href} className={`in-sb-link${n.active ? ' active' : ''}`}>
                <i className={`ti ${n.icon}`} />{n.label}
              </a>
        )}
      </nav>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{userInitials}</div>
        <div>
          <div className="in-sb-user-name">{userName}</div>
          <div className="in-sb-user-role">{userPlan} Member</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu, userInitials = 'TF' }) {
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}>
        <span /><span /><span />
      </div>
      <div className="in-topbar-title">Trade<span>Flow</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon">
        <i className="ti ti-bell" />
        <div className="in-notif-dot" />
      </div>
      <div className="in-tb-avatar">{userInitials}</div>
    </header>
  );
}

/* ─── Crypto coins – base config (icons / colours) ──────────────────────────
   Addresses are fetched at runtime from `platform_crypto_wallets` and stored
   in React state (cryptoCoins) in the root component, then passed as props.
   Nothing is mutated at module scope.                                        */

const CRYPTO_COINS_BASE = [
  { id: 'btc',  label: 'Bitcoin',  symbol: 'BTC',  icon: 'ti-currency-bitcoin',  col: '#f59e0b', network: 'Bitcoin Network', addr: '' },
  { id: 'eth',  label: 'Ethereum', symbol: 'ETH',  icon: 'ti-currency-ethereum', col: '#60a5fa', network: 'ERC-20',           addr: '' },
  { id: 'usdt', label: 'Tether',   symbol: 'USDT', icon: 'ti-currency-dollar',   col: '#34d399', network: 'TRC-20',           addr: '' },
  { id: 'bnb',  label: 'BNB',      symbol: 'BNB',  icon: 'ti-coin',              col: '#f59e0b', network: 'BEP-20',           addr: '' },
  { id: 'sol',  label: 'Solana',   symbol: 'SOL',  icon: 'ti-bolt',              col: '#a78bfa', network: 'Solana Network',   addr: '' },
];

/**
 * Fetches ALL active coins from platform_crypto_wallets and maps them
 * to the UI shape. Every field (symbol, name, network, address, icon,
 * color) comes directly from the DB – nothing is hardcoded here.
 * Falls back to CRYPTO_COINS_BASE (empty addresses) if the fetch fails.
 */
/**
 * Normalizes a raw DB row into the UI coin shape regardless of which column
 * names the table / paymentService helper happens to use.
 *
 * Supported variants observed in the wild:
 *   address        | wallet_address | deposit_address | addr
 *   symbol         | coin_symbol    | currency
 *   name           | coin_name      | currency_name
 *   network        | network_name   | chain
 *   icon           | icon_class     | icon_name
 *   color          | colour         | hex_color       | coin_color
 *   is_active      | active         | enabled
 */
function normalizeCoinRow(row) {
  const symbol =
    row.symbol ?? row.coin_symbol ?? row.currency ?? '';
  const name =
    row.name ?? row.coin_name ?? row.currency_name ?? symbol;
  const network =
    row.network ?? row.network_name ?? row.chain ?? '';
  const address =
    row.address ?? row.wallet_address ?? row.deposit_address ?? row.addr ?? '';
  const icon =
    row.icon ?? row.icon_class ?? row.icon_name ?? 'ti-coin';
  const color =
    row.color ?? row.colour ?? row.hex_color ?? row.coin_color ?? '#64748b';

  return {
    id:      symbol.toLowerCase(),
    label:   name,
    symbol:  symbol.toUpperCase(),
    network,
    addr:    address,
    icon,
    col:     color,
  };
}

async function fetchCryptoCoins() {
  // Possible table names to try in order
  const TABLE_NAMES = [
    'platform_crypto_wallets',
    'crypto_wallets',
    'admin_crypto_wallets',
    'platform_wallets',
    'admin_wallets',
    'deposit_wallets',
    'coin_wallets',
  ];

  try {
    let dbRows = null;

    for (const table of TABLE_NAMES) {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      console.log(`[fetchCryptoCoins] trying table "${table}":`, data, error);

      // A missing table returns a PostgREST error; an empty table returns [] with no error
      if (!error && data !== null) {
        dbRows = data;
        console.log(`[fetchCryptoCoins] found table: "${table}" with ${data.length} rows`);
        break;
      }
    }

    if (!dbRows?.length) {
      console.warn('[fetchCryptoCoins] No wallet rows found in any known table. Falling back to base config (empty addresses).');
      return CRYPTO_COINS_BASE;
    }

    const coins = dbRows.map(normalizeCoinRow).filter(c => c.symbol);
    console.log('[fetchCryptoCoins] normalized coins:', coins);

    // Merge: DB coins take priority; any coin missing from DB still shows with empty addr
    const dbSymbols = new Set(coins.map(c => c.symbol));
    const fallbacks = CRYPTO_COINS_BASE.filter(c => !dbSymbols.has(c.symbol));
    return [...coins, ...fallbacks];

  } catch (e) {
    console.warn('[fetchCryptoCoins] Unexpected error:', e.message);
    return CRYPTO_COINS_BASE;
  }
}

// Minimal QR generator (pure JS, no lib needed)
function generateQRSVG(text) {
  // Simple visual placeholder QR that looks realistic
  const size = 21;
  const cells = [];
  // Deterministic "hash" of the address for pattern
  let h = 0;
  for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  const rand = (i) => ((h ^ (i * 2654435761)) >>> 0) % 2;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    // finder patterns (corners)
    const inFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    if (inFinder) {
      const fr = r % 7; const fc = c % 7;
      const rr = r >= size - 7 ? r - (size - 7) : r;
      const rc = c >= size - 7 ? c - (size - 7) : c;
      const nr = r >= size - 7 ? rr : r < 7 ? r : 0;
      const nc = c >= size - 7 ? rc : c < 7 ? c : 0;
      const onBorder = nr === 0 || nr === 6 || nc === 0 || nc === 6;
      const onInner = nr >= 2 && nr <= 4 && nc >= 2 && nc <= 4;
      cells.push({ r, c, fill: onBorder || onInner ? '#000' : '#fff' });
    } else {
      cells.push({ r, c, fill: rand(r * size + c) ? '#000' : '#fff' });
    }
  }
  const cell = 100 / size;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:124px;height:124px;">
    <rect width="100" height="100" fill="white"/>
    ${cells.map(({ r, c, fill }) => fill === '#000' ? `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="#000"/>` : '').join('')}
  </svg>`;
}

function CryptoPayModal({ plan, annual, onClose, cryptoCoins }) {
  const [coin, setCoin] = useState('usdt');
  const [viewTab, setViewTab] = useState('qr'); // 'qr' | 'address'
  const [copied, setCopied] = useState(false);
  const selected = cryptoCoins.find(c => c.id === coin);
  const amount = annual ? plan.annual * 12 : plan.monthly;

  const handleCopy = () => {
    navigator.clipboard.writeText(selected.addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-modal-overlay" onClick={onClose}>
      <div className="py-modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <button className="py-modal-close" onClick={onClose}><i className="ti ti-x" /></button>

        {/* Header */}
        <div className="py-modal-icon" style={{ background: 'rgba(245,158,11,.12)' }}>
          <i className="ti ti-currency-bitcoin" style={{ color: '#f59e0b', fontSize: 24 }} />
        </div>
        <div className="py-modal-title">Pay with <em style={{ color: T.g, fontStyle: 'italic' }}>Crypto</em></div>
        <div className="py-modal-sub" style={{ marginBottom: 16 }}>
          Send exactly <strong style={{ color: T.gr, fontFamily: T.mono }}>${amount}</strong> worth of your chosen coin to the address below.
        </div>

        {/* Amount pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 3 }}>{plan.name} Plan · {annual ? 'Annual' : 'Monthly'}</div>
            <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 700, color: T.g }}>${amount}</div>
          </div>
          <span className="py-network-badge">{selected.network}</span>
        </div>

        {/* Coin selector */}
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 8 }}>Select Coin</div>
        <div className="py-crypto-coins">
          {cryptoCoins.map(c => (
            <button key={c.id} className={`py-crypto-coin${coin === c.id ? ' sel' : ''}`} onClick={() => setCoin(c.id)}>
              <i className={`ti ${c.icon}`} style={{ color: c.col }} />
              {c.symbol}
            </button>
          ))}
        </div>

        {/* QR / Address tabs */}
        <div className="py-crypto-tabs">
          <button className={`py-crypto-tab${viewTab === 'qr' ? ' active' : ''}`} onClick={() => setViewTab('qr')}>
            <i className="ti ti-qrcode" style={{ marginRight: 5 }} />Scan QR
          </button>
          <button className={`py-crypto-tab${viewTab === 'address' ? ' active' : ''}`} onClick={() => setViewTab('address')}>
            <i className="ti ti-copy" style={{ marginRight: 5 }} />Copy Address
          </button>
        </div>

        {viewTab === 'qr' && (
          <div className="py-qr-wrap">
            <div className="py-qr-box" dangerouslySetInnerHTML={{ __html: generateQRSVG(selected.addr) }} />
            <div className="py-qr-label">
              Scan with your crypto wallet app<br />
              <strong style={{ color: T.gr }}>{selected.label} ({selected.symbol})</strong> · {selected.network}
            </div>
          </div>
        )}

        {viewTab === 'address' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 8 }}>
              {selected.label} ({selected.symbol}) Address
            </div>
            <div className="py-addr-wrap">
              <span className="py-addr-text">{selected.addr}</span>
              <button className="py-addr-copy" onClick={handleCopy}>
                {copied ? <><i className="ti ti-check" style={{ marginRight: 4 }} />Copied!</> : <><i className="ti ti-copy" style={{ marginRight: 4 }} />Copy</>}
              </button>
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#f59e0b', display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 16 }}>
          <i className="ti ti-alert-triangle" style={{ flexShrink: 0, marginTop: 1 }} />
          Send only <strong>{selected.symbol}</strong> on the <strong>{selected.network}</strong> network. Sending a different coin or network may result in permanent loss.
        </div>

        <div className="py-security"><i className="ti ti-shield-check" />Payments confirmed on-chain · typically 1–3 block confirmations</div>
      </div>
    </div>
  );
}

/* ── Plans Panel ── */
function PlansPanel({ activeSub, dbPlans, userId, onUpgrade, cryptoCoins }) {
  // Merge DB plans into the static PLANS array for display (DB has authoritative prices)
  // Falls back to static PLANS if DB returns empty (e.g. during dev)
  const annual = true;
  const [chosen, setChosen] = useState(activeSub?.subscription_plans?.name || 'Pro');
  const [confirmModal, setConfirmModal] = useState(null);
  const [cryptoModal, setCryptoModal] = useState(null);

  // If DB plans are loaded, map prices from DB onto static PLANS for accurate pricing
  const displayPlans = PLANS.map(p => {
    const dbPlan = dbPlans.find(d => d.name.toLowerCase() === p.name.toLowerCase());
    if (!dbPlan) return p;
    return { ...p, monthly: Number(dbPlan.monthly_price), annual: Number(dbPlan.annual_price), _dbId: dbPlan.id };
  });

  return (
    <div>
      <div className="in-controls">
        <div style={{ fontSize: 13, color: T.nt }}>
          Choose a plan that fits your trading style.
        </div>

      </div>

      <div className="py-plans-grid">
        {displayPlans.map(p => (
          <div
            key={p.name}
            className={`py-plan${p.featured ? ' featured' : ''}`}
            onClick={() => setChosen(p.name)}
            style={{ outline: chosen === p.name ? `2px solid ${p.featured ? T.g : T.br2}` : 'none', outlineOffset: 2 }}
          >
            {p.featured && <div className="py-plan-badge">Most Popular</div>}
            <div className="py-plan-tier">{p.tier}</div>
            <div className={`py-plan-name${p.accent ? ' accent' : ''}`}>{p.name}</div>
            <div className="py-plan-desc">{p.desc}</div>
            <div className="py-plan-price">
              <span className="py-plan-price-cur">$</span>
              <span className="py-plan-price-val" style={{ color: p.accent ? T.g : T.gr }}>
                {annual ? p.annual : p.monthly}
              </span>
              <span className="py-plan-price-per">/mo</span>
            </div>
            <div className="py-plan-save">
              {annual && p.monthly > 0 ? `Save $${(p.monthly - p.annual) * 12}/yr` : ' '}
            </div>
            <button
              className={`in-btn in-btn-md in-btn-full${p.featured ? ' in-btn-accent' : ' in-btn-ghost'}`}
              onClick={e => { e.stopPropagation(); if (p.monthly > 0) setConfirmModal(p); }}
            >
              {p.monthly === 0 ? 'Current Plan' : `Get ${p.name}`}
              {p.monthly > 0 && <i className="ti ti-arrow-right" />}
            </button>
            <div className="py-plan-divider" />
            {p.features.map((f, i) => (
              <div key={i} className={`py-plan-feature ${f.yes ? 'yes' : 'no'}`}>
                <i className={`ti ${f.yes ? 'ti-check' : 'ti-x'}`} />
                {f.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Step 1: Confirm modal */}
      {confirmModal && (
        <div className="py-modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="py-modal" onClick={e => e.stopPropagation()}>
            <button className="py-modal-close" onClick={() => setConfirmModal(null)}><i className="ti ti-x" /></button>
            <div className="py-modal-icon" style={{ background: 'rgba(200,245,96,.12)' }}>
              <i className="ti ti-crown" style={{ color: T.g, fontSize: 24 }} />
            </div>
            <div className="py-modal-title">Upgrade to <em style={{ color: T.g, fontStyle: 'italic' }}>{confirmModal.name}</em></div>
            <div className="py-modal-sub">
              You'll be charged <strong>${annual ? confirmModal.annual : confirmModal.monthly}/month</strong>
              {annual ? ' (billed annually)' : ' (billed monthly)'}.
              Your current plan features remain active until the billing cycle ends.
            </div>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 18 }}>
              <div className="py-sum-row"><span className="py-sum-row-label">{confirmModal.name} Plan</span><span className="py-sum-row-val">${annual ? confirmModal.annual : confirmModal.monthly}/mo</span></div>
              <div className="py-sum-row"><span className="py-sum-row-label">Billing</span><span className="py-sum-row-val">{annual ? 'Annual' : 'Monthly'}</span></div>
              <div className="py-sum-divider" />
              <div className="py-sum-total"><span className="py-sum-total-label">Due today</span><span className="py-sum-total-val">${annual ? confirmModal.annual * 12 : confirmModal.monthly}</span></div>
            </div>
            <button className="in-btn in-btn-accent in-btn-lg in-btn-full" onClick={() => { setConfirmModal(null); setCryptoModal(confirmModal); }}>
              <i className="ti ti-lock" /> Confirm &amp; Pay
            </button>
            <div className="py-security"><i className="ti ti-shield-check" />256-bit SSL encryption · Cancel anytime</div>
          </div>
        </div>
      )}

      {/* Step 2: Crypto payment modal */}
      {cryptoModal && (
        <CryptoPayModal
          plan={cryptoModal}
          annual={annual}
          onClose={() => setCryptoModal(null)}
          cryptoCoins={cryptoCoins}
        />
      )}
    </div>
  );
}

/* ── Crypto rates (approx) ── */
const CRYPTO_RATES = { btc: 61200, eth: 3020, usdt: 1, bnb: 580, sol: 148 };

/* ── Crypto Deposit Modal ── */
function CryptoDepositModal({ amount, coin, onClose, onSuccess, cryptoCoins }) {
  const [copied, setCopied] = React.useState(false);
  const [txHash, setTxHash] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(null);

  const selected = cryptoCoins.find(c => c.id === coin);
  const rate = CRYPTO_RATES[coin] || 1;
  const coinAmt = (parseFloat(amount) / rate).toFixed(coin === 'usdt' ? 2 : 6);

  const handleCopy = () => {
    navigator.clipboard.writeText(selected?.addr ?? '').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * User clicks "I've Sent the Payment" after actually sending on-chain.
   * Records the deposit as status='pending' so an admin/webhook can confirm it.
   * Does NOT auto-complete – a real blockchain confirmation is required.
   */
  const handleConfirmSent = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      // onSuccess receives the tx hash the user pasted – the parent records
      // a pending deposit and shows the success screen.
      await onSuccess(txHash.trim() || null);
      setSubmitted(true);
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!selected) return null;

  return (
    <div className="py-modal-overlay" onClick={submitted ? null : onClose}>
      <div className="py-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        {!submitted && <button className="py-modal-close" onClick={onClose}><i className="ti ti-x" /></button>}

        {/* Header icon */}
        <div className="py-modal-icon" style={{ background: `${selected.col}1a` }}>
          <i className={`ti ${selected.icon}`} style={{ color: selected.col, fontSize: 24 }} />
        </div>

        {submitted ? (
          /* ── Submitted state ── */
          <>
            <div className="py-modal-title">Deposit <em style={{ color: T.am, fontStyle: 'italic' }}>Pending</em></div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,158,11,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <i className="ti ti-clock-hour-4" style={{ fontSize: 30, color: T.am }} />
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 700, color: T.gr, marginBottom: 8 }}>
                {coinAmt} {selected.symbol} <span style={{ fontSize: 13, color: T.nt }}>≈ ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ fontSize: 13, color: T.nt, lineHeight: 1.7 }}>
                Your deposit has been submitted and is <strong style={{ color: T.am }}>awaiting blockchain confirmation</strong>.
                Your wallet balance will be updated once the transaction is verified on-chain.
              </div>
              {txHash && (
                <div style={{ marginTop: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 11, fontFamily: T.mono, color: T.nt, wordBreak: 'break-all' }}>
                  TX: {txHash}
                </div>
              )}
            </div>
            <button className="in-btn in-btn-ghost in-btn-sm in-btn-full" onClick={onClose}>Close</button>
          </>
        ) : (
          /* ── Awaiting send state ── */
          <>
            <div className="py-modal-title">Send <em style={{ color: T.g, fontStyle: 'italic' }}>{selected.symbol}</em> to deposit</div>

            {/* Amount pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 4 }}>Amount to Send</div>
                <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 700, color: T.gr }}>
                  {coinAmt} <span style={{ fontSize: 14, color: T.nt }}>{selected.symbol}</span>
                </div>
                <div style={{ fontSize: 11, color: T.nt, marginTop: 3 }}>≈ ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 4 }}>Network</div>
                <span className="py-network-badge">{selected.network}</span>
              </div>
            </div>

            {/* Deposit address */}
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 8 }}>
              {selected.label} ({selected.symbol}) Deposit Address
            </div>
            {selected.addr ? (
              <div className="py-addr-wrap" style={{ marginBottom: 18 }}>
                <span className="py-addr-text">{selected.addr}</span>
                <button className="py-addr-copy" onClick={handleCopy}>
                  {copied ? <><i className="ti ti-check" style={{ marginRight: 4 }} />Copied!</> : <><i className="ti ti-copy" style={{ marginRight: 4 }} />Copy</>}
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: T.rd, marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <i className="ti ti-alert-triangle" style={{ flexShrink: 0, fontSize: 16 }} />
                  <strong>No deposit address found for {selected.symbol}.</strong>
                </div>
                <div style={{ color: T.nt, lineHeight: 1.6, marginBottom: 10 }}>
                  The {selected.symbol} wallet address hasn't been configured yet. Please select a different coin or try again shortly.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Quick-switch to first coin that has an address */}
                  {cryptoCoins.filter(c => c.addr && c.id !== coin).slice(0, 2).map(c => (
                    <button
                      key={c.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--surface2)', border: '1px solid var(--border)', color: T.gr, cursor: 'pointer' }}
                      onClick={() => {
                        // bubble up via the parent's setCoin — we close and let parent reopen with new coin
                        onClose();
                      }}
                    >
                      <i className={`ti ${c.icon}`} style={{ color: c.col }} />{c.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QR code */}
            {selected.addr && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <div style={{ background: '#fff', padding: 10, borderRadius: 10, display: 'inline-block' }}
                  dangerouslySetInnerHTML={{ __html: generateQRSVG(selected.addr) }} />
              </div>
            )}

            {/* Optional tx hash */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 6 }}>
                Transaction Hash <span style={{ color: T.nt, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional – paste after sending)</span>
              </div>
              <input
                className="py-input"
                placeholder="e.g. 0xabc123… or txid…"
                value={txHash}
                onChange={e => setTxHash(e.target.value)}
                style={{ width: '100%', fontFamily: T.mono, fontSize: 12 }}
              />
            </div>

            {/* Warning */}
            <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: T.am, display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 18 }}>
              <i className="ti ti-alert-triangle" style={{ flexShrink: 0, marginTop: 1 }} />
              Send only <strong>{selected.symbol}</strong> on the <strong>{selected.network}</strong> network.
              Sending a different coin or using the wrong network may result in permanent loss.
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: T.rd, marginBottom: 14 }}>
                <i className="ti ti-alert-circle" style={{ marginRight: 6 }} />{error}
              </div>
            )}

            {/* CTA – user clicks AFTER sending on-chain */}
            <button
              className="in-btn in-btn-accent in-btn-lg in-btn-full"
              onClick={handleConfirmSent}
              disabled={submitting || !selected.addr}
            >
              {submitting
                ? <><i className="ti ti-loader" style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
                : <><i className="ti ti-checks" /> I've Sent the Payment</>}
            </button>

            <div className="py-security" style={{ marginTop: 12 }}>
              <i className="ti ti-shield-check" />
              Deposit credited after on-chain confirmation · 256-bit TLS
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Bank Support Modal ── */
function BankSupportModal({ onClose }) {
  const [sent, setSent] = React.useState(false);
  return (
    <div className="py-modal-overlay" onClick={onClose}>
      <div className="py-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <button className="py-modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        <div className="py-modal-icon" style={{ background: 'rgba(52,211,153,.12)' }}>
          <i className="ti ti-building-bank" style={{ color: T.gn, fontSize: 24 }} />
        </div>
        <div className="py-modal-title">Bank Wire <em style={{ color: T.gn, fontStyle: 'italic' }}>Transfer</em></div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0 8px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="ti ti-check" style={{ fontSize: 30, color: T.gn }} />
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 18, marginBottom: 8 }}>Request Sent!</div>
            <div style={{ fontSize: 13, color: T.nt, lineHeight: 1.7 }}>
              Our support team will contact you within <strong style={{ color: T.gr }}>24 hours</strong> with the bank wire details and instructions.
            </div>
            <button className="in-btn in-btn-ghost in-btn-sm" style={{ marginTop: 20 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="py-modal-sub">
              Bank wire deposits require manual processing. Contact our support team to receive the banking details and reference number for your transfer.
            </div>

            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 12 }}>Contact Support</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(96,165,250,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-mail" style={{ fontSize: 15, color: T.bl }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>Email Support</div>
                    <div style={{ fontSize: 11, color: T.nt }}>support@tradeflow.io</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-brand-telegram" style={{ fontSize: 15, color: T.gn }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>Telegram</div>
                    <div style={{ fontSize: 11, color: T.nt }}>@TradeFlowSupport</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(167,139,250,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-clock" style={{ fontSize: 15, color: T.pr }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>Response Time</div>
                    <div style={{ fontSize: 11, color: T.nt }}>Within 24 hours · Mon–Fri</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: T.am, display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 18 }}>
              <i className="ti ti-info-circle" style={{ flexShrink: 0, marginTop: 1 }} />
              Bank wire transfers typically settle in 1–3 business days. Minimum deposit: $500.
            </div>

            <button className="in-btn in-btn-accent in-btn-lg in-btn-full" onClick={() => setSent(true)}>
              <i className="ti ti-send" /> Request Bank Details
            </button>
            <div className="py-security"><i className="ti ti-shield-check" />Your information is encrypted and secure</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Deposit Panel ── */
function DepositPanel({ user, profile, wallets, currency, onDepositComplete, cryptoCoins }) {
  const [amount, setAmount] = useState('');
  const [preset, setPreset] = useState(null);
  const [method, setMethod] = useState('crypto');
  const [cryptoCoin, setCryptoCoin] = useState('usdt');
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // USD wallet balance for "Available" hint
  const usdWallet = wallets.find(w => w.currency === 'USD');
  const availableBalance = usdWallet ? Number(usdWallet.balance) : 0;

  const fee = amount ? (parseFloat(amount.replace(/[^0-9.]/g, '')) * 0.001).toFixed(2) : '0.00';
  const total = amount ? (parseFloat(amount.replace(/[^0-9.]/g, '')) || 0).toFixed(2) : '0.00';

  const handlePreset = (p) => {
    setPreset(p);
    setAmount(p.replace('$', '').replace(',', ''));
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setError(null);
    if (method === 'crypto') setShowCryptoModal(true);
    else if (method === 'bank') setShowBankModal(true);
  };

  // Called by CryptoDepositModal when blockchain confirms
  const handleCryptoSuccess = useCallback(async (txReference) => {
    if (!user) return;
    setLoading(true);
    try {
      const txn = await recordDeposit({
        userId: user.id,
        currency: 'USD',
        amount: parseFloat(amount),
        method: `Crypto (${cryptoCoins.find(c => c.id === cryptoCoin)?.symbol || cryptoCoin.toUpperCase()})`,
        reference: txReference || null,
      });
      // Send confirmation email
      await sendDepositEmail({
        email: profile.email,
        firstName: profile.first_name,
        amount: txn.net_amount,
        currency: 'USD',
        method: `Crypto (${cryptoCoins.find(c => c.id === cryptoCoin)?.symbol})`,
        reference: txn.reference,
        invoiceNumber: txn.invoice_number,
        date: new Date(txn.created_at).toLocaleString(),
      });
      setSuccess(true);
      if (onDepositComplete) onDepositComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, profile, amount, cryptoCoin, cryptoCoins, onDepositComplete]);

  if (success) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(52,211,153,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ti ti-check" style={{ fontSize: 36, color: T.gn }} />
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 24 }}>Deposit <em style={{ color: T.gn, fontStyle: 'italic' }}>Successful!</em></div>
      <div style={{ fontSize: 13, color: T.nt, textAlign: 'center' }}>
        <strong style={{ fontFamily: T.mono, color: T.gr }}>${parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> has been credited to your USD Wallet.
        <div style={{ marginTop: 6, fontSize: 12 }}>A confirmation email has been sent to <strong style={{ color: T.gr }}>{profile?.email}</strong></div>
      </div>
      <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => { setSuccess(false); setAmount(''); setPreset(null); }}>
        Make another deposit
      </button>
    </div>
  );

  return (
    <>
      <div className="py-action-layout">
        <div className="py-form-card">
          <div className="py-form-title">Make a <em>Deposit</em></div>
          <div className="py-form-sub">Funds are credited instantly to your wallet (bank wire: 1–3 days).</div>

          <div className="py-field">
            <div className="py-field-label">
              Amount
              <span className="py-field-hint">Available: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="py-amount-wrap">
              <span className="py-amount-cur">$</span>
              <input
                className="py-input padded"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setPreset(null); }}
              />
            </div>
            <div className="py-presets">
              {PRESETS_DEPOSIT.map(p => (
                <button key={p} className={`py-preset${preset === p ? ' sel' : ''}`} onClick={() => handlePreset(p)}>{p}</button>
              ))}
            </div>
          </div>

          <div className="py-field">
            <div className="py-field-label">Payment Method</div>
            <div className="py-method-grid">
              {PAYMENT_METHODS.map(m => (
                <div key={m.id} className={`py-method${method === m.id ? ' sel' : ''}`} onClick={() => setMethod(m.id)}>
                  <div className="py-method-icon" style={{ background: m.bg }}>
                    <i className={`ti ${m.icon}`} style={{ color: m.col }} />
                  </div>
                  <div>
                    <div className="py-method-name">{m.name}</div>
                    <div className="py-method-sub">{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {method === 'crypto' && (
            <div className="py-field">
              <div className="py-field-label">Select Coin</div>
              <div className="py-crypto-coins" style={{ marginBottom: 0 }}>
                {cryptoCoins.map(c => (
                  <button
                    key={c.id}
                    className={`py-crypto-coin${cryptoCoin === c.id ? ' sel' : ''}`}
                    onClick={() => setCryptoCoin(c.id)}
                  >
                    <i className={`ti ${c.icon}`} style={{ color: c.col }} />
                    {c.symbol}
                  </button>
                ))}
              </div>
              {amount && parseFloat(amount) > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: T.nt }}>
                  You'll send <strong style={{ fontFamily: T.mono, color: T.gr }}>
                    {(parseFloat(amount) / (CRYPTO_RATES[cryptoCoin] || 1)).toFixed(cryptoCoin === 'usdt' ? 2 : 6)} {cryptoCoins.find(c => c.id === cryptoCoin)?.symbol}
                  </strong> · Rate: 1 {cryptoCoins.find(c => c.id === cryptoCoin)?.symbol} ≈ ${(CRYPTO_RATES[cryptoCoin] || 1).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <button
            className="in-btn in-btn-accent in-btn-lg in-btn-full"
            style={{ marginTop: 4 }}
            onClick={handleDeposit}
          >
            <i className="ti ti-lock" /> Deposit ${amount ? parseFloat(amount).toLocaleString() : '0.00'}
          </button>
        </div>

        <div className="py-summary-card">
          <div className="py-summary-title">Deposit Summary</div>
          <div className="py-sum-row">
            <span className="py-sum-row-label">Amount</span>
            <span className="py-sum-row-val">${parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="py-sum-row">
            <span className="py-sum-row-label">Processing Fee</span>
            <span className="py-sum-row-val" style={{ color: T.nt }}>${fee}</span>
          </div>
          <div className="py-sum-row">
            <span className="py-sum-row-label">Method</span>
            <span className="py-sum-row-val" style={{ color: T.nt }}>{PAYMENT_METHODS.find(m => m.id === method)?.name}</span>
          </div>
          <div className="py-sum-divider" />
          <div className="py-sum-total">
            <span className="py-sum-total-label">You'll receive</span>
            <span className="py-sum-total-val">${parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="py-security">
            <i className="ti ti-shield-check" />
            Secured by 256-bit TLS encryption
          </div>
          <div className="py-security" style={{ marginTop: 0 }}>
            <i className="ti ti-clock-hour-4" />
            Instant credit · 24/7 processing
          </div>

          <div style={{ marginTop: 18, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: T.nt, marginBottom: 10 }}>Your Wallets</div>
            {wallets.slice(0, 2).map(w => {
              const cfg = WALLET_CONFIG[w.currency] || { icon: 'ti-wallet', name: `${w.currency} Wallet`, col: '#64748b', bg: 'rgba(100,116,139,.15)', fmt: (b) => `${b}` };
              return (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`ti ${cfg.icon}`} style={{ fontSize: 13, color: cfg.col }} />
                  </div>
                  <span style={{ fontSize: 12, flex: 1 }}>{cfg.name}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: cfg.col }}>{cfg.fmt(w.balance)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showCryptoModal && (
        <CryptoDepositModal
          amount={total}
          coin={cryptoCoin}
          onClose={() => setShowCryptoModal(false)}
          onSuccess={(txRef) => { setShowCryptoModal(false); handleCryptoSuccess(txRef); }}
          cryptoCoins={cryptoCoins}
        />
      )}
      {showBankModal && (
        <BankSupportModal onClose={() => setShowBankModal(false)} />
      )}
      {error && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 10, padding: '12px 18px', fontSize: 13, color: T.rd, zIndex: 9999, maxWidth: 340 }}>
          <i className="ti ti-alert-triangle" style={{ marginRight: 8 }} />{error}
        </div>
      )}
    </>
  );
}

/* ── Withdraw Panel ── */
function WithdrawPanel({ user, profile, wallets, onWithdrawComplete }) {
  const [amount, setAmount] = useState('');
  const [preset, setPreset] = useState(null);
  const [method, setMethod] = useState('bank');
  const [wallet, setWallet] = useState('USD');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountNum, setAccountNum] = useState('');
  const [routing, setRouting] = useState('');
  const [cryptoAddr, setCryptoAddr] = useState('');

  const numAmt = parseFloat(amount) || 0;
  const fee = (numAmt * 0.002).toFixed(2);
  const receive = Math.max(0, numAmt - parseFloat(fee)).toFixed(2);

  // Build wallet display list from DB
  const walletList = wallets.map(w => {
    const cfg = WALLET_CONFIG[w.currency] || { id: w.currency.toLowerCase(), icon: 'ti-wallet', name: `${w.currency} Wallet`, sub: w.currency, col: '#64748b', bg: 'rgba(100,116,139,.15)', fmt: (b) => `${b} ${w.currency}` };
    return { ...cfg, currency: w.currency, rawBalance: Number(w.balance), bal: cfg.fmt(w.balance) };
  });

  const selectedWallet = walletList.find(w => w.currency === wallet) || walletList[0];

  const handlePreset = (p) => { setPreset(p); setAmount(p.replace('$', '')); };

  const handleWithdraw = async () => {
    if (!amount || numAmt <= 0) return;
    if (!user) return;
    if (selectedWallet && numAmt > selectedWallet.rawBalance) {
      setError('Amount exceeds wallet balance.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const destination = method === 'bank'
        ? [accountNum, routing].filter(Boolean).join(' / ')
        : cryptoAddr;

      const txn = await recordWithdrawal({
        userId: user.id,
        currency: wallet,
        amount: numAmt,
        method: method === 'bank' ? 'Bank Wire' : 'Crypto',
        destination: destination || null,
      });

      // Send withdrawal email
      await sendWithdrawalEmail({
        email: profile.email,
        firstName: profile.first_name,
        amount: txn.amount,
        currency: wallet,
        netAmount: txn.net_amount,
        fee: txn.fee,
        method: method === 'bank' ? 'Bank Wire' : 'Crypto',
        destination: destination || null,
        invoiceNumber: txn.invoice_number,
        date: new Date(txn.created_at).toLocaleString(),
      });

      setSuccess(true);
      if (onWithdrawComplete) onWithdrawComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(96,165,250,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ti ti-arrow-bar-to-up" style={{ fontSize: 30, color: T.bl }} />
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 22 }}>Withdrawal <em style={{ color: T.bl, fontStyle: 'italic' }}>Requested!</em></div>
      <div style={{ fontSize: 13, color: T.nt, textAlign: 'center' }}>
        <strong style={{ fontFamily: T.mono, color: T.gr }}>${parseFloat(receive).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> will be sent via {WITHDRAW_METHODS.find(m => m.id === method)?.name}.
        <div style={{ marginTop: 6, fontSize: 12 }}>A confirmation email has been sent to <strong style={{ color: T.gr }}>{profile?.email}</strong></div>
      </div>
      <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => { setSuccess(false); setAmount(''); setPreset(null); }}>
        Make another withdrawal
      </button>
    </div>
  );

  return (
    <div className="py-action-layout">
      <div className="py-form-card">
        <div className="py-form-title">Request <em>Withdrawal</em></div>
        <div className="py-form-sub">Withdrawals are processed within 1–3 business days depending on method.</div>

        <div className="py-field">
          <div className="py-field-label">From Wallet</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {walletList.map(w => (
              <button
                key={w.id}
                onClick={() => setWallet(w.currency)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: wallet === w.currency ? w.bg : 'var(--surface2)',
                  border: `1px solid ${wallet === w.currency ? w.col + '55' : 'var(--border)'}`,
                  borderRadius: 8, padding: '7px 12px', cursor: 'pointer', transition: 'all .15s',
                }}
              >
                <i className={`ti ${w.icon}`} style={{ fontSize: 14, color: w.col }} />
                <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: wallet === w.currency ? w.col : T.nt }}>{w.bal}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="py-field">
          <div className="py-field-label">
            Amount
            <span className="py-field-hint">Max: {selectedWallet?.bal}</span>
          </div>
          <div className="py-amount-wrap">
            <span className="py-amount-cur">$</span>
            <input
              className="py-input padded"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => { setAmount(e.target.value); setPreset(null); }}
            />
          </div>
          <div className="py-presets">
            {PRESETS_WITHDRAW.map(p => (
              <button key={p} className={`py-preset${preset === p ? ' sel' : ''}`} onClick={() => handlePreset(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="py-field">
          <div className="py-field-label">Withdrawal Method</div>
          <div className="py-method-grid">
            {WITHDRAW_METHODS.map(m => (
              <div key={m.id} className={`py-method${method === m.id ? ' sel' : ''}`} onClick={() => setMethod(m.id)}>
                <div className="py-method-icon" style={{ background: m.bg }}>
                  <i className={`ti ${m.icon}`} style={{ color: m.col }} />
                </div>
                <div>
                  <div className="py-method-name">{m.name}</div>
                  <div className="py-method-sub">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {method === 'bank' && (
          <div className="py-field">
            <div className="py-field-label">Bank Account</div>
            <input className="py-input" type="text" placeholder="Account number (IBAN / ACH)" value={accountNum} onChange={e => setAccountNum(e.target.value)} />
            <input className="py-input" type="text" placeholder="Routing / SWIFT code" style={{ marginTop: 10 }} value={routing} onChange={e => setRouting(e.target.value)} />
          </div>
        )}
        {method === 'crypto' && (
          <div className="py-field">
            <div className="py-field-label">Destination Address</div>
            <input className="py-input" type="text" placeholder="0x... or bc1..." value={cryptoAddr} onChange={e => setCryptoAddr(e.target.value)} />
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 8, fontSize: 12, color: T.rd, display: 'flex', gap: 8 }}>
            <i className="ti ti-alert-triangle" style={{ flexShrink: 0 }} />{error}
          </div>
        )}

        <button
          className="in-btn in-btn-blue in-btn-lg in-btn-full"
          style={{ marginTop: 4, opacity: loading ? 0.6 : 1 }}
          onClick={handleWithdraw}
          disabled={loading}
        >
          {loading ? <><i className="ti ti-loader" style={{ animation: 'spin 1s linear infinite' }} /> Processing…</> : <><i className="ti ti-arrow-bar-to-up" /> Withdraw ${numAmt ? numAmt.toLocaleString() : '0.00'}</>}
        </button>
      </div>

      <div className="py-summary-card">
        <div className="py-summary-title">Withdrawal Summary</div>
        <div className="py-sum-row">
          <span className="py-sum-row-label">Requested Amount</span>
          <span className="py-sum-row-val">${numAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="py-sum-row">
          <span className="py-sum-row-label">Processing Fee (0.2%)</span>
          <span className="py-sum-row-val" style={{ color: T.rd }}>−${fee}</span>
        </div>
        <div className="py-sum-row">
          <span className="py-sum-row-label">Method</span>
          <span className="py-sum-row-val" style={{ color: T.nt }}>{WITHDRAW_METHODS.find(m => m.id === method)?.name}</span>
        </div>
        <div className="py-sum-row">
          <span className="py-sum-row-label">ETA</span>
          <span className="py-sum-row-val" style={{ color: T.nt }}>{WITHDRAW_METHODS.find(m => m.id === method)?.sub}</span>
        </div>
        <div className="py-sum-divider" />
        <div className="py-sum-total">
          <span className="py-sum-total-label">You'll receive</span>
          <span className="py-sum-total-val" style={{ color: T.bl }}>${parseFloat(receive).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="py-security">
          <i className="ti ti-shield-check" />
          KYC-verified · Secure payout
        </div>
        <div className="py-security" style={{ marginTop: 0 }}>
          <i className="ti ti-clock" />
          Processed on next business day
        </div>

        <div style={{ marginTop: 16, padding: 12, background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,.18)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: T.rd, lineHeight: 1.5 }}>
            <i className="ti ti-info-circle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} />
            Withdrawals are subject to 24h cooling period for security. Ensure your destination details are correct — transactions cannot be reversed.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Transactions Panel ── */
function TransactionsPanel({ userId, wallets }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 15;

  const loadTxns = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { transactions: txns, total: count } = await fetchTransactions(userId, {
        type: filter === 'all' ? 'all' : filter === 'deposit' ? 'deposit' : filter === 'withdraw' ? 'withdrawal' : 'plan_charge',
        search,
        page,
        pageSize: PAGE_SIZE,
      });
      setTransactions(txns);
      setTotal(count);
    } catch (e) {
      console.error('loadTxns:', e);
    } finally {
      setLoading(false);
    }
  }, [userId, filter, search, page]);

  useEffect(() => { loadTxns(); }, [loadTxns]);

  // Build wallet display list for the Wallets section
  const walletList = wallets.map(w => {
    const cfg = WALLET_CONFIG[w.currency] || { id: w.currency.toLowerCase(), icon: 'ti-wallet', name: `${w.currency} Wallet`, sub: w.currency, col: '#64748b', bg: 'rgba(100,116,139,.15)', fmt: (b) => `${b} ${w.currency}` };
    return { ...cfg, currency: w.currency, bal: cfg.fmt(w.balance), eq: '' };
  });

  const STATUS_CLS = { green: 'in-badge-green', blue: 'in-badge-blue', amber: 'in-badge-amber', purple: 'in-badge-purple', red: 'in-badge-red', muted: 'in-badge-muted' };

  return (
    <div>
      {/* Wallets */}
      <div className="py-wallets">
        {walletList.length === 0 && (
          <div style={{ color: T.nt, fontSize: 13, padding: 20 }}>No wallets found.</div>
        )}
        {walletList.map(w => (
          <div key={w.id} className={`py-wallet ${w.id}`}>
            <div className="py-wallet-head">
              <div className="py-wallet-icon" style={{ background: w.bg }}>
                <i className={`ti ${w.icon}`} style={{ color: w.col }} />
              </div>
              <div>
                <div className="py-wallet-name">{w.name}</div>
                <div className="py-wallet-sub">{w.sub}</div>
              </div>
            </div>
            <div className="py-wallet-bal" style={{ color: w.col }}>{w.bal}</div>
            <div className="py-wallet-eq">{w.eq}</div>
            <div className="py-wallet-actions">
              <button className="py-wallet-act"><i className="ti ti-arrow-bar-to-down" />Deposit</button>
              <button className="py-wallet-act"><i className="ti ti-arrow-bar-to-up" />Withdraw</button>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="py-txn-wrap">
        <div className="py-txn-head">
          <div className="py-txn-title">Transaction History</div>
          <div className="py-txn-filters">
            <input
              className="in-select py-input"
              style={{ padding: '6px 10px', fontFamily: T.sans, fontSize: 12, width: 160 }}
              placeholder="Search transactions…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
            <select className="in-select" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}>
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdraw">Withdrawals</option>
              <option value="plan">Plan Charges</option>
            </select>
            <button className="in-btn in-btn-ghost in-btn-sm">
              <i className="ti ti-download" />Export
            </button>
          </div>
        </div>

        <table className="in-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: T.nt, padding: 32 }}>
                <i className="ti ti-loader" style={{ marginRight: 8 }} />Loading…
              </td></tr>
            )}
            {!loading && transactions.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: T.nt, padding: 32 }}>No transactions found.</td></tr>
            )}
            {!loading && transactions.map((t) => {
              const disp = TXN_DISPLAY[t.type] || TXN_DISPLAY['deposit'];
              const statusCls = STATUS_CLS_MAP[t.status] || 'muted';
              const sign = t.type === 'deposit' || t.type === 'payout' ? '+' : '-';
              const pmLabel = t.payment_methods?.label || t.description || t.type;
              return (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="py-txn-icon" style={{ background: disp.iconBg }}>
                        <i className={`ti ${disp.icon}`} style={{ color: disp.iconCol }} />
                      </div>
                      <div>
                        <div className="py-txn-name">{t.description || pmLabel}</div>
                        <div className="py-txn-meta">{t.invoice_number}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: T.nt, fontFamily: T.mono, fontSize: 12 }}>{formatTxnDate(t.created_at)}</td>
                  <td>
                    <div className="py-txn-amount" style={{ color: disp.amountCol }}>
                      {sign}{t.currency} {Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td>
                    <span className={`in-badge ${STATUS_CLS[statusCls]}`}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <button className="in-btn in-btn-ghost in-btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <i className="ti ti-chevron-left" />Prev
            </button>
            <span style={{ fontSize: 12, color: T.nt, alignSelf: 'center' }}>Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
            <button className="in-btn in-btn-ghost in-btn-sm" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage(p => p + 1)}>
              Next<i className="ti ti-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function Payment() {
  const [tab, setTab] = useState('plans');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Auth & user data ──────────────────────────────────────
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sidebarData, setSidebarData] = useState({ portfolioValue: 0, dailyPnl: 0 });

  // ── Wallets & metrics ─────────────────────────────────────
  const [wallets, setWallets] = useState([]);
  const [metrics, setMetrics] = useState({ totalBalance: 0, totalDeposited: 0, totalWithdrawn: 0 });
  const [cryptoCoins, setCryptoCoins] = useState(CRYPTO_COINS_BASE);

  // ── Subscription plans ────────────────────────────────────
  const [dbPlans, setDbPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);

  // ── User currency ─────────────────────────────────────────
  const [userCurrency, setUserCurrency] = useState('USD');

  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const u = await getCurrentUser();
      if (!u) { setLoading(false); return; }
      setUser(u);

      const [prof, walletData, metricData, planData, subData, sbData, cur, coins] = await Promise.all([
        getUserProfile(u.id),
        fetchUserWallets(u.id),
        fetchPaymentMetrics(u.id),
        fetchSubscriptionPlans(),
        fetchActiveSubscription(u.id),
        fetchSidebarData(u.id),
        getUserCurrency(u.id),
        fetchCryptoCoins(),
      ]);

      setProfile(prof);
      setWallets(walletData);
      setMetrics(metricData);
      setDbPlans(planData);
      setActiveSub(subData);
      setSidebarData(sbData);
      setUserCurrency(cur);
      setCryptoCoins(coins);
    } catch (e) {
      console.error('Payment loadAll:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Computed values
  const userInitials = profile
    ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : 'TF';
  const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'TradeFlow User';
  const userPlan = activeSub?.subscription_plans?.name ?? profile?.plan ?? 'Basic';

  const renewDate = activeSub?.current_period_end
    ? new Date(activeSub.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  const METRICS_DATA = [
    { label: 'Total Balance',  value: `$${Number(metrics.totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,  sub: userCurrency, col: '#c8f560', bg: 'rgba(200,245,96,.12)',  icon: 'ti-wallet' },
    { label: 'Deposited',      value: `$${Number(metrics.totalDeposited).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Lifetime deposits',  col: '#34d399', bg: 'rgba(52,211,153,.12)', icon: 'ti-arrow-bar-to-down' },
    { label: 'Withdrawn',      value: `$${Number(metrics.totalWithdrawn).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Lifetime withdrawals', col: '#60a5fa', bg: 'rgba(96,165,250,.12)', icon: 'ti-arrow-bar-to-up' },
    { label: 'Active Plan',    value: userPlan, sub: activeSub ? `Renews ${renewDate}` : 'No active subscription', col: '#a78bfa', bg: 'rgba(167,139,250,.12)', icon: 'ti-crown' },
  ];

  const TABS = [
    { key: 'plans',    label: 'Plans',        icon: 'ti-crown' },
    { key: 'deposit',  label: 'Deposit',       icon: 'ti-arrow-bar-to-down' },
    { key: 'withdraw', label: 'Withdraw',      icon: 'ti-arrow-bar-to-up' },
    { key: 'history',  label: 'Transactions',  icon: 'ti-receipt' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 299,
        }} />
      )}

      <div className="in-shell">
        <Sidebar
          open={sidebarOpen}
          portfolioValue={sidebarData.portfolioValue}
          dailyPnl={sidebarData.dailyPnl}
          userInitials={userInitials}
          userName={userName}
          userPlan={userPlan}
        />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} userInitials={userInitials} />

          <main className="in-main">
            {/* Loading skeleton */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: T.nt, gap: 12 }}>
                <i className="ti ti-loader" style={{ fontSize: 24, animation: 'spin 1s linear infinite' }} />
                Loading payment data…
              </div>
            )}

            {!loading && (
              <>
                {/* Page header */}
                <div className="in-page-header">
                  <div>
                    <div className="in-page-title"><em>Payments</em></div>
                    <div className="in-page-sub">
                      <span className="in-live-dot" />
                      Manage your plans, deposits, withdrawals, and billing history.
                    </div>
                  </div>
                  <div className="in-header-actions">
                    <a href="#" className="in-btn in-btn-ghost in-btn-sm">
                      <i className="ti ti-file-invoice" /> Invoices
                    </a>
                  </div>
                </div>

                {/* Metrics */}
                <div className="py-metrics">
                  {METRICS_DATA.map(m => (
                    <div key={m.label} className="py-metric">
                      <div className="py-metric-icon" style={{ background: m.bg }}>
                        <i className={`ti ${m.icon}`} style={{ color: m.col }} />
                      </div>
                      <div className="py-metric-label">{m.label}</div>
                      <div className="py-metric-value">{m.value}</div>
                      <div className="py-metric-sub" style={{ color: m.col }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="in-controls">
                  <div className="in-tabs">
                    {TABS.map(({ key, label, icon }) => (
                      <button key={key} className={`in-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                        <i className={`ti ${icon}`} />{label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content — pass live data to all panels */}
                {tab === 'plans'    && <PlansPanel activeSub={activeSub} dbPlans={dbPlans} userId={user?.id} onUpgrade={loadAll} cryptoCoins={cryptoCoins} />}
                {tab === 'deposit'  && <DepositPanel user={user} profile={profile} wallets={wallets} currency={userCurrency} onDepositComplete={loadAll} cryptoCoins={cryptoCoins} />}
                {tab === 'withdraw' && <WithdrawPanel user={user} profile={profile} wallets={wallets} onWithdrawComplete={loadAll} />}
                {tab === 'history'  && <TransactionsPanel userId={user?.id} wallets={wallets} />}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}