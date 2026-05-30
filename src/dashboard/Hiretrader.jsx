import React, { useState, useEffect, useCallback } from 'react';
import supabase from "../supabase";

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
    --accent-rgb:  200,245,96;
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
  /* ── Upgrade Gate ── */
  .ht-upgrade-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.78);
    display: flex; align-items: center; justify-content: center;
    z-index: 700; padding: 16px;
  }
  .ht-upgrade-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; width: 100%; max-width: 430px;
    padding: 32px; text-align: center; position: relative;
  }
  .ht-upgrade-modal-close {
    position: absolute; top: 14px; right: 14px;
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); border-radius: 8px; width: 28px; height: 28px;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center; transition: all .15s;
  }
  .ht-upgrade-modal-close:hover { border-color: var(--red); color: var(--red); }
  .ht-upgrade-icon-wrap {
    width: 60px; height: 60px; border-radius: 18px; margin: 0 auto 20px;
    background: linear-gradient(135deg,rgba(245,158,11,.15),rgba(245,158,11,.3));
    border: 1px solid rgba(245,158,11,.35);
    display: flex; align-items: center; justify-content: center; font-size: 28px;
  }
  .ht-upgrade-title { font-family: var(--serif); font-size: 22px; margin-bottom: 8px; color: var(--text); }
  .ht-upgrade-sub { font-size: 13px; color: var(--muted); margin-bottom: 26px; line-height: 1.65; }
  .ht-upgrade-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
  .ht-plan-card {
    border-radius: var(--r-md); padding: 16px 14px; text-align: left;
    border: 1px solid var(--border); background: var(--surface2);
    cursor: pointer; transition: all .15s; position: relative;
  }
  .ht-plan-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .ht-plan-card.ht-plan-recommended { border-color: rgba(200,245,96,.45); background: rgba(200,245,96,.05); }
  .ht-plan-rec-badge {
    position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: #000; font-size: 9px; font-weight: 800;
    padding: 2px 10px; border-radius: 99px; white-space: nowrap; letter-spacing: .5px;
  }
  .ht-plan-name { font-size: 13px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .ht-plan-price { font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--accent); }
  .ht-plan-price span { font-size: 11px; font-family: var(--sans); font-weight: 400; color: var(--muted); }
  .ht-plan-feats { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
  .ht-plan-feat { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 5px; }
  .ht-plan-feat i { color: var(--green); font-size: 12px; flex-shrink: 0; }
  .ht-upgrade-cta {
    width: 100%; background: var(--accent); color: #000; border-radius: var(--r-sm);
    padding: 13px 0; font-size: 14px; font-weight: 700; font-family: var(--sans);
    cursor: pointer; border: none; transition: opacity .15s; margin-bottom: 10px;
  }
  .ht-upgrade-cta:hover { opacity: .88; box-shadow: 0 0 22px rgba(200,245,96,.3); }
  .ht-upgrade-dismiss { font-size: 12px; color: var(--muted); cursor: pointer; background: none; border: none; font-family: var(--sans); }
  .ht-upgrade-dismiss:hover { color: var(--text); }
  /* locked card */
  .ht-trader-card-wrap { position: relative; }
  .ht-card-lock-overlay {
    position: absolute; inset: 0; border-radius: var(--r-lg);
    background: rgba(8,11,16,.75); backdrop-filter: blur(2px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 7px; cursor: pointer; transition: background .15s;
  }
  .ht-card-lock-overlay:hover { background: rgba(8,11,16,.85); }
  .ht-lock-icon-box {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(245,158,11,.15); border: 1px solid rgba(245,158,11,.35);
    display: flex; align-items: center; justify-content: center; font-size: 17px; color: #f59e0b;
  }
  .ht-lock-label { font-size: 12px; font-weight: 700; color: var(--text); }
  .ht-lock-sub   { font-size: 10px; color: var(--muted); }
  /* form gate */
  .ht-form-gate {
    background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.25);
    border-radius: var(--r-md); padding: 22px 20px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .ht-form-gate-icon { font-size: 30px; color: #f59e0b; }
  .ht-form-gate-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .ht-form-gate-sub { font-size: 12px; color: var(--muted); line-height: 1.65; max-width: 280px; }
  .ht-form-gate-btn {
    background: var(--accent); color: #000; border-radius: var(--r-sm);
    padding: 9px 22px; font-size: 13px; font-weight: 700;
    font-family: var(--sans); border: none; cursor: pointer; transition: opacity .15s; margin-top: 4px;
  }
  .ht-form-gate-btn:hover { opacity: .88; }

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
/* PROFESSIONALS now fetched from Supabase — see FeaturedProfessionals component */

/* METRICS_DATA now computed from hire_agreements — see HireTrader root component */

const HOW_STEPS = [
  { num:1, title:'Post your request',           desc:'Set your capital, risk tolerance, and budget. Takes about 2 minutes.' },
  { num:2, title:'Get matched',                 desc:'We surface verified traders who fit your profile. Review their track records.' },
  { num:3, title:'Agree on terms',              desc:'Sign a digital agreement. Trader gets limited trading access to your account.' },
  { num:4, title:'Monitor & withdraw anytime',  desc:'Track performance in real time. Cancel with one click. No penalties.' },
];

const MAIN_LINKS = [
  { href:'/dashboard', icon:'ti-layout-dashboard', label:'Dashboard' },
  { href:'/copy-trading', icon:'ti-copy',             label:'Copy Trading' },
  { href:'/hire-trader', icon:'ti-users',            label:'Hire a Trader', active:true },
  { href:'/insights', icon:'ti-chart-line',       label:'Insights' },
  { href:'/market-place', icon:'ti-robot',            label:'Marketplace', badge:'NEW' },
  { href:'/terminal', icon:'ti-chart-candle',     label:'Terminal' },
];
const ACCT_LINKS = [
  { href:'/payment', icon:'ti-credit-card', label:'Payments' },
  { href:'/profile', icon:'ti-user-circle', label:'Profile' },
  { href:'/settings', icon:'ti-settings',    label:'Settings' },
  { href:'/support', icon:'ti-headset',     label:'Support' },
];

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ open, user, onLogout }) {
  const initials    = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'TF';
  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Loading…';
  const planLabel   = user ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} · ${user.is_verified ? 'Verified' : 'Unverified'}` : '';
  const balance     = typeof user?.balance === 'number' ? user.balance : 0.0;
  const balanceStr  = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <aside className={`ht-sidebar${open ? ' open' : ''}`}>
      <div className="ht-brand">
        <div className="ht-brand-icon"><i className="ti ti-trending-up" /></div>
        <span className="ht-brand-name">Trade<em>Flow</em></span>
      </div>
      <div className="ht-sb-pill">
        <div className="ht-sb-pill-label"><span className="ht-live-dot" /> Live Portfolio</div>
        <div className="ht-sb-pill-val">${balanceStr}</div>
        <div className="ht-sb-pill-sub">Available balance</div>
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
        <div className="ht-sb-avatar">{initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="ht-sb-user-name">{displayName}</div>
          <div className="ht-sb-user-role">{planLabel}</div>
        </div>
        <button
          onClick={onLogout}
          title="Sign out"
          style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16, padding:4, flexShrink:0 }}
        ><i className="ti ti-logout" /></button>
      </div>
    </aside>
  );
}

/* ─── Topbar ──────────────────────────────────────────────────────────────── */
function Topbar({ onMenu, user, settings }) {
  const firstName = user?.first_name || '';
  const initials  = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'TF';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const themeIcon = settings?.theme === 'light' ? 'ti-sun' : settings?.theme === 'system' ? 'ti-brightness' : 'ti-moon';

  return (
    <div className="ht-topbar">
      <div className="ht-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="ht-topbar-title">{greeting}, <span>{firstName}</span></div>
      <div className="ht-topbar-icon" title={`Theme: ${settings?.theme || 'dark'}`}>
        <i className={`ti ${themeIcon}`} />
      </div>
      <div className="ht-topbar-icon">
        <a href='/notification'><i className="ti ti-bell" /><span className="ht-notif-dot" /></a>
      </div>
      <div className="ht-topbar-icon"><a href='/settings'><i className="ti ti-settings" /></a></div>
      <div className="ht-topbar-avatar">{initials}</div>
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

/* ─── Upgrade Modal ───────────────────────────────────────────────────────── */
const PLANS = [
  {
    key: 'pro', name: 'Pro', price: '$29', period: '/mo', recommended: true,
    feats: ['Hire up to 3 traders', 'Copy trading access', 'Advanced analytics', 'Priority support'],
  },
  {
    key: 'elite', name: 'Elite', price: '$79', period: '/mo', recommended: false,
    feats: ['Unlimited hiring', 'Unlimited copy trading', 'API access', 'Dedicated account manager'],
  },
];

function UpgradeModal({ onClose, feature = 'hire traders' }) {
  return (
    <div className="ht-upgrade-overlay" onClick={onClose}>
      <div className="ht-upgrade-modal" onClick={e => e.stopPropagation()}>
        <button className="ht-upgrade-modal-close" onClick={onClose}>✕</button>

        <div className="ht-upgrade-icon-wrap">🔒</div>
        <div className="ht-upgrade-title">Upgrade to {feature === 'post' ? 'Post Requests' : 'Hire Traders'}</div>
        <div className="ht-upgrade-sub">
          Your <strong style={{ color:'var(--text)' }}>Basic</strong> plan doesn't include the ability to {feature === 'post' ? 'post hiring requests' : 'hire professional traders'}.
          Upgrade to <strong style={{ color:'var(--accent)' }}>Pro</strong> or <strong style={{ color:'var(--accent)' }}>Elite</strong> to unlock full access.
        </div>

        <div className="ht-upgrade-plans">
          {PLANS.map(p => (
            <div key={p.key} className={`ht-plan-card${p.recommended ? ' ht-plan-recommended' : ''}`}>
              {p.recommended && <span className="ht-plan-rec-badge">RECOMMENDED</span>}
              <div className="ht-plan-name">{p.name}</div>
              <div className="ht-plan-price">{p.price}<span>{p.period}</span></div>
              <div className="ht-plan-feats">
                {p.feats.map(f => (
                  <div key={f} className="ht-plan-feat">
                    <i className="ti ti-check" />{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="ht-upgrade-cta">
          <i className="ti ti-bolt" style={{ marginRight: 6 }} /> Upgrade Now →
        </button>
        <button className="ht-upgrade-dismiss" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

/* ─── Post Request Form ───────────────────────────────────────────────────── */
function PostRequestForm({ userId, userPlan, onUpgrade }) {
  const [form, setForm] = useState({
    capital:    '',
    specialty:  'Crypto',
    risk:       'conservative',
    feePref:    'performance',
    budget:     '',
    notes:      '',
  });
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [saveErr,  setSaveErr]  = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!userId)             return setSaveErr('You must be logged in to post a request.');
    if (!form.capital || isNaN(parseFloat(form.capital))) return setSaveErr('Please enter a valid capital amount.');
    setSaving(true); setSaveErr('');
    const { error } = await supabase.from('hire_requests').insert({
      client_id:          userId,
      capital_amount:     parseFloat(form.capital),
      currency:           'USD',
      specialty:          form.specialty,
      risk_appetite:      form.risk,
      fee_preference:     form.feePref,
      max_monthly_budget: form.budget || null,
      notes:              form.notes  || null,
      status:             'open',
    });
    setSaving(false);
    if (error) { setSaveErr(error.message); return; }
    setSaved(true);
    setForm({ capital:'', specialty:'Crypto', risk:'conservative', feePref:'performance', budget:'', notes:'' });
    setTimeout(() => setSaved(false), 4000);
  };

  const isBasic = userPlan === 'basic';

  return (
    <div className="ht-card">
      <div className="ht-card-title">Post a Request</div>
      <div className="ht-card-subtitle">Get matched with professionals who fit your goals</div>

      {isBasic ? (
        /* ── Basic plan gate ── */
        <div className="ht-form-gate">
          <div className="ht-form-gate-icon"><i className="ti ti-lock" /></div>
          <div className="ht-form-gate-title">Pro feature</div>
          <div className="ht-form-gate-sub">
            Posting hire requests is available on the <strong style={{ color:'var(--accent)' }}>Pro</strong> and <strong style={{ color:'var(--accent)' }}>Elite</strong> plans.
            Upgrade to get matched with verified professional traders.
          </div>
          <button className="ht-form-gate-btn" onClick={onUpgrade}>
            <i className="ti ti-bolt" style={{ marginRight:6 }} /> Upgrade Plan →
          </button>
        </div>
      ) : (
        <>
          {saved && (
            <div style={{ background:'rgba(52,211,153,.1)', border:'1px solid rgba(52,211,153,.25)', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#34d399', display:'flex', alignItems:'center', gap:8 }}>
              <i className="ti ti-check" /> Request posted! We'll match you with traders shortly.
            </div>
          )}
          {saveErr && (
            <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.25)', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#f87171', display:'flex', alignItems:'center', gap:8 }}>
              <i className="ti ti-alert-circle" /> {saveErr}
            </div>
          )}
          <div className="ht-form-group">
            <label className="ht-form-label">Capital to manage (USD)</label>
            <input type="number" className="ht-input" placeholder="e.g. 10000" value={form.capital} onChange={set('capital')} />
          </div>
          <div className="ht-form-group">
            <label className="ht-form-label">Trading specialty</label>
            <select className="ht-input" value={form.specialty} onChange={set('specialty')}>
              <option>Crypto</option><option>Forex</option><option>Stocks &amp; ETFs</option>
              <option>Options</option><option>Commodities</option><option>Multi-asset</option>
            </select>
          </div>
          <div className="ht-form-group">
            <label className="ht-form-label">Risk appetite</label>
            <select className="ht-input" value={form.risk} onChange={set('risk')}>
              <option value="conservative">Conservative (10–20% annual)</option>
              <option value="moderate">Moderate (20–40% annual)</option>
              <option value="aggressive">Aggressive (40%+ annual)</option>
            </select>
          </div>
          <div className="ht-form-group">
            <label className="ht-form-label">Fee preference</label>
            <select className="ht-input" value={form.feePref} onChange={set('feePref')}>
              <option value="performance">Performance only (% of profits)</option>
              <option value="fixed_monthly">Fixed monthly</option>
              <option value="hybrid">Hybrid (base + performance)</option>
            </select>
          </div>
          <div className="ht-form-group">
            <label className="ht-form-label">Max monthly budget</label>
            <input type="text" className="ht-input" placeholder="e.g. $200/mo or 20% profits" value={form.budget} onChange={set('budget')} />
          </div>
          <div className="ht-form-group">
            <label className="ht-form-label">Notes for trader</label>
            <textarea className="ht-input" rows={3} placeholder="Goals, restrictions, or anything else…" value={form.notes} onChange={set('notes')} />
          </div>
          <button className="ht-btn ht-btn-accent ht-btn-full ht-btn-md" style={{ marginTop:4 }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Posting…' : <><i className="ti ti-search" /> Find Matching Traders</>}
          </button>
        </>
      )}
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
function FeaturedProfessionals({ onHire, userPlan, onUpgrade, settings }) {
  const isBasic = userPlan === 'basic';
  const [traders,  setTraders]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState('');
  const [filter,   setFilter]   = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setFetchErr('');
      // Join trader_profiles with their 1Y performance row
      const { data, error } = await supabase
        .from('trader_profiles')
        .select(`
          id, display_name, handle, market, min_capital, fee_structure,
          total_clients, color_hex, initials, is_verified,
          trader_performance!inner(roi_pct, win_rate_pct, period)
        `)
        .eq('is_active', true)
        .eq('trader_performance.period', '1Y')
        .order('total_clients', { ascending: false })
        .limit(8);

      setLoading(false);
      if (error) { setFetchErr(error.message); return; }
      setTraders(data || []);
    };
    load();
  }, []);

  const visible = filter
    ? traders.filter(t => t.market?.toLowerCase() === filter.toLowerCase())
    : traders;

  if (loading) return (
    <div className="ht-card" style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)', fontSize:13 }}>
      <i className="ti ti-loader-2" style={{ fontSize:22, display:'block', marginBottom:8 }} /> Loading professionals…
    </div>
  );

  if (fetchErr) return (
    <div className="ht-card" style={{ textAlign:'center', padding:'32px 0', color:'#f87171', fontSize:13 }}>
      <i className="ti ti-alert-circle" style={{ fontSize:20, display:'block', marginBottom:8 }} /> {fetchErr}
    </div>
  );

  return (
    <div className="ht-card">
      <div className="ht-pros-header">
        <div>
          <div className="ht-card-title">Featured Professionals</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>Verified traders with proven performance</div>
        </div>
        <select className="ht-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Specialties</option>
          <option value="Crypto">Crypto</option>
          <option value="Forex">Forex</option>
          <option value="Stocks">Stocks</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13 }}>
          No traders found{filter ? ` for ${filter}` : ''}.
        </div>
      ) : (
        <div className="ht-traders-grid" style={{ gap:`var(--density-gap, 14px)` }}>
          {visible.map(t => {
            const perf      = t.trader_performance?.[0] || {};
            const roiPct    = parseFloat(perf.roi_pct   || 0).toFixed(1);
            const winRate   = parseFloat(perf.win_rate_pct || 0).toFixed(1);
            const minCap    = t.min_capital ? `$${parseFloat(t.min_capital).toLocaleString()}` : '—';
            const firstName = t.display_name?.split(' ')[0] || 'Trader';
            return (
              <div key={t.id} className="ht-trader-card-wrap">
                <div className="ht-trader-card">
                  <div className="ht-trader-header">
                    <div className="ht-trader-av" style={{ background: t.color_hex || '#c8f560' }}>
                      {t.initials || t.display_name?.slice(0,2).toUpperCase() || '??'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="ht-trader-name">{t.display_name}</div>
                      <div className="ht-trader-handle">{t.handle}</div>
                    </div>
                    <span className="ht-specialty-badge">{t.market}</span>
                  </div>

                  <div className="ht-trader-stats">
                    <div className="ht-stat-box">
                      <div className="ht-stat-val" style={{ color:'#34d399' }}>+{roiPct}%</div>
                      <div className="ht-stat-lbl">1Y Return</div>
                    </div>
                    <div className="ht-stat-box">
                      <div className="ht-stat-val">{winRate}%</div>
                      <div className="ht-stat-lbl">Win Rate</div>
                    </div>
                  </div>

                  <div className="ht-trader-meta">
                    <span>Min. Capital: <strong>{minCap}</strong></span>
                    <span>Fee: <strong className="gold">{t.fee_structure || '—'}</strong></span>
                    <span>Clients: <strong>{t.total_clients || 0}</strong></span>
                  </div>

                  <button
                    className="ht-btn ht-btn-accent ht-btn-full ht-btn-sm"
                    onClick={() => isBasic ? onUpgrade() : onHire(t)}
                  >
                    {isBasic ? <><i className="ti ti-lock" /> Unlock to Hire</> : `Hire ${firstName} →`}
                  </button>
                </div>

                {/* Lock overlay for basic users */}
                {isBasic && (
                  <div className="ht-card-lock-overlay" onClick={onUpgrade}>
                    <div className="ht-lock-icon-box"><i className="ti ti-lock" /></div>
                    <div className="ht-lock-label">Pro Feature</div>
                    <div className="ht-lock-sub">Tap to upgrade</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
function HireModal({ trader: t, onClose, userId }) {
  const [amount,   setAmount]   = useState('5000');
  const [duration, setDuration] = useState('1');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [saveErr,  setSaveErr]  = useState('');

  const perf     = t.trader_performance?.[0] || {};
  const roiPct   = parseFloat(perf.roi_pct     || 0).toFixed(1);
  const winRate  = parseFloat(perf.win_rate_pct || 0).toFixed(1);
  const minCap   = t.min_capital ? `$${parseFloat(t.min_capital).toLocaleString()}` : '—';
  const firstName = t.display_name?.split(' ')[0] || 'Trader';

  const handleConfirm = async () => {
    if (!userId) return setSaveErr('You must be logged in.');
    const cap = parseFloat(amount);
    if (!cap || cap <= 0) return setSaveErr('Please enter a valid capital amount.');
    setSaving(true); setSaveErr('');

    const { error } = await supabase.from('hire_agreements').insert({
      client_id:      userId,
      trader_id:      t.id,
      capital_amount: cap,
      currency:       'USD',
      duration_months: parseInt(duration) || null,
      fee_structure:  t.fee_structure || null,
      status:         'active',
    });

    setSaving(false);
    if (error) { setSaveErr(error.message); return; }
    setSaved(true);
  };

  return (
    <div className="ht-modal-overlay" onClick={onClose}>
      <div className="ht-modal" onClick={e => e.stopPropagation()}>
        <button className="ht-modal-close" onClick={onClose}>✕</button>

        <div className="ht-modal-head">
          <div className="ht-modal-av" style={{ background: t.color_hex || '#c8f560' }}>
            {t.initials || t.display_name?.slice(0,2).toUpperCase() || '??'}
          </div>
          <div>
            <div className="ht-modal-name">Hire {t.display_name}</div>
            <div className="ht-modal-sub">{t.handle} · {t.market}</div>
          </div>
        </div>

        <div className="ht-modal-stats">
          {[
            { label:'1Y Return',   val:`+${roiPct}%`, color:'#34d399' },
            { label:'Win Rate',    val:`${winRate}%`, color:'var(--text)' },
            { label:'Min Capital', val: minCap,        color:'var(--text)' },
            { label:'Fee',         val: t.fee_structure || '—', color:'#c8f560' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="ht-modal-stat-val" style={{ color }}>{val}</div>
              <div className="ht-modal-stat-lbl">{label}</div>
            </div>
          ))}
        </div>

        {saved ? (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ width:52, height:52, borderRadius:12, background:'rgba(52,211,153,.15)', border:'1px solid rgba(52,211,153,.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:22, color:'#34d399' }}>
              <i className="ti ti-check" />
            </div>
            <div style={{ fontFamily:'var(--serif)', fontSize:18, marginBottom:6 }}>Agreement Created!</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginBottom:20 }}>
              {firstName} has been hired. Your agreement is now active.
            </div>
            <button className="ht-btn ht-btn-accent ht-btn-full ht-btn-md" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {saveErr && (
              <div style={{ background:'rgba(248,113,113,.1)', border:'1px solid rgba(248,113,113,.25)', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#f87171', display:'flex', alignItems:'center', gap:8 }}>
                <i className="ti ti-alert-circle" /> {saveErr}
              </div>
            )}

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

            <button
              className="ht-btn ht-btn-accent ht-btn-full ht-btn-md"
              onClick={handleConfirm}
              disabled={saving}
            >
              {saving ? 'Creating agreement…' : `Confirm & Hire ${firstName} →`}
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
  return theme || 'dark';
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
  .ht-sidebar { background: var(--surface) !important; border-color: var(--border) !important; }
  .ht-topbar  { background: var(--surface); border-color: var(--border); }
  .ht-metric, .ht-trader-card, .ht-card, .ht-modal { background: var(--surface); border-color: var(--border); }
  .ht-filter-select, .ht-input { background: var(--surface2); border-color: var(--border); color: var(--text); }
  .ht-stat-box { background: var(--surface2); }
`;

function applySettings(settings, rootEl = document.documentElement) {
  if (!settings || !rootEl) return;
  const accent  = settings.accent_color || '#c8f560';
  const rgb     = hexToRgb(accent);
  const theme   = resolveTheme(settings.theme);
  const density = settings.layout_density || 'comfortable';

  rootEl.style.setProperty('--accent',      accent);
  rootEl.style.setProperty('--accent-rgb',  rgb);
  rootEl.style.setProperty('--accent-dim',  `rgba(${rgb},.12)`);
  rootEl.style.setProperty('--accent-glow', `rgba(${rgb},.06)`);
  rootEl.style.setProperty('--density-pad', DENSITY_PADDING[density] || DENSITY_PADDING.comfortable);
  rootEl.style.setProperty('--density-gap', DENSITY_GAP[density]     || DENSITY_GAP.comfortable);
  rootEl.style.fontSize = DENSITY_FONT[density] || '14px';

  return theme;
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
export default function HireTrader() {
  const [user,           setUser]           = useState(null);
  const [authLoading,    setAuthLoading]    = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [modal,          setModal]          = useState(null);
  const [upgradeOpen,    setUpgradeOpen]    = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('hire');
  const [settings,       setSettings]       = useState(null);
  const [activeTheme,    setActiveTheme]    = useState('dark');
  const [metrics,     setMetrics]     = useState([
    { label:'Active Traders', value:'—',    sub:'Loading…',            color:'#c8f560', icon:'ti-users' },
    { label:'Total Return',   value:'—',    sub:'Since account start', color:'#34d399', icon:'ti-trending-up' },
    { label:'Fees Paid',      value:'—',    sub:'This year',           color:'#60a5fa', icon:'ti-receipt' },
    { label:'Avg Win Rate',   value:'—',    sub:'Across hired traders',color:'#a78bfa', icon:'ti-target' },
  ]);

  /* ── Apply CSS vars whenever settings change ── */
  useEffect(() => {
    if (!settings) return;
    const theme = applySettings(settings);
    setActiveTheme(theme);
  }, [settings]);

  /* ── Watch system colour-scheme when theme === 'system' ── */
  useEffect(() => {
    if (settings?.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => setActiveTheme(mq.matches ? 'light' : 'dark');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings?.theme]);

  /* ── Fetch user_settings ── */
  const fetchSettings = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error && data) setSettings(data);
    } catch (_) { /* non-critical */ }
  }, []);

  /* ── Auth: restore session on mount ── */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userId = session.user.id;
        const [{ data: profile }, { data: wallet }] = await Promise.all([
          supabase.from('users')
            .select('id, first_name, last_name, handle, plan, is_verified')
            .eq('id', userId).single(),
          supabase.from('wallets')
            .select('balance')
            .eq('user_id', userId).eq('currency', 'USD').single(),
        ]);
        if (profile) {
          setUser({ ...profile, balance: parseFloat(wallet?.balance ?? 0) || 0.0 });
          await fetchSettings(userId);
        }
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Fetch hire_agreements metrics whenever user changes ── */
  const fetchMetrics = useCallback(async () => {
    if (!user) return;
    const { data: agreements } = await supabase
      .from('hire_agreements')
      .select('capital_amount, total_return, fees_paid, status, trader_id')
      .eq('client_id', user.id)
      .eq('status', 'active');

    if (!agreements || agreements.length === 0) {
      setMetrics([
        { label:'Active Traders', value:'0 Traders', sub:'None hired yet',          color:'#c8f560', icon:'ti-users' },
        { label:'Total Return',   value:'+$0',        sub:'Since account start',     color:'#34d399', icon:'ti-trending-up' },
        { label:'Fees Paid',      value:'$0',         sub:'This year',               color:'#60a5fa', icon:'ti-receipt' },
        { label:'Avg Win Rate',   value:'—',          sub:'No active agreements',    color:'#a78bfa', icon:'ti-target' },
      ]);
      return;
    }

    const activeCount   = agreements.length;
    const totalCapital  = agreements.reduce((s, a) => s + parseFloat(a.capital_amount || 0), 0);
    const totalReturn   = agreements.reduce((s, a) => s + parseFloat(a.total_return  || 0), 0);
    const totalFees     = agreements.reduce((s, a) => s + parseFloat(a.fees_paid     || 0), 0);
    const returnSign    = totalReturn >= 0 ? '+' : '';

    // Fetch avg win rate from trader_performance for these traders
    const traderIds = [...new Set(agreements.map(a => a.trader_id))];
    const { data: perfs } = await supabase
      .from('trader_performance')
      .select('win_rate_pct')
      .in('trader_id', traderIds)
      .eq('period', '1Y');
    const avgWinRate = perfs?.length
      ? (perfs.reduce((s, p) => s + parseFloat(p.win_rate_pct || 0), 0) / perfs.length).toFixed(0)
      : null;

    setMetrics([
      { label:'Active Traders', value:`${activeCount} Trader${activeCount !== 1 ? 's' : ''}`, sub:`Managing $${totalCapital.toLocaleString()}`,        color:'#c8f560', icon:'ti-users' },
      { label:'Total Return',   value:`${returnSign}$${Math.abs(totalReturn).toLocaleString()}`,                  sub:'Since account start',           color:'#34d399', icon:'ti-trending-up' },
      { label:'Fees Paid',      value:`$${totalFees.toLocaleString()}`,                                           sub:'This year',                      color:'#60a5fa', icon:'ti-receipt' },
      { label:'Avg Win Rate',   value: avgWinRate ? `${avgWinRate}%` : '—',                                       sub:'Across hired traders',           color:'#a78bfa', icon:'ti-target' },
    ]);
  }, [user]);

  useEffect(() => { if (user) { fetchMetrics(); fetchSettings(user.id); } }, [fetchMetrics]);

  const openUpgrade = (feature = 'hire') => {
    setUpgradeFeature(feature);
    setUpgradeOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (authLoading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', color:'var(--muted)', fontSize:14, gap:10 }}>
        <i className="ti ti-loader-2" style={{ fontSize:20 }} /> Loading…
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299 }}
        />
      )}

      <div className="ht-shell">
        <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />

        <div className="ht-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} settings={settings} />

          <main className="ht-main" style={{ padding:`24px var(--density-pad, 28px) 40px` }}>
            <div className="ht-page-header">
              <div>
                <div className="ht-page-title"><em>Hire a Trader</em></div>
                <div className="ht-page-sub">
                  <span className="ht-live-dot" />
                  Delegate to verified experts. Full transparency. Cancel anytime.
                </div>
              </div>
              <div className="ht-header-actions">
                <button className="ht-btn ht-btn-ghost ht-btn-sm">
                  <i className="ti ti-download" /> Export
                </button>
                <button className="ht-btn ht-btn-accent ht-btn-sm" onClick={() => document.querySelector('.ht-main').scrollTo({ top: 9999, behavior:'smooth' })}>
                  <i className="ti ti-plus" /> Post Request
                </button>
              </div>
            </div>

            <div className="ht-metrics" style={{ gap:`var(--density-gap, 14px)`, marginBottom:22 }}>
              {metrics.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            <div className="ht-grid-2" style={{ gap:`var(--density-gap, 18px)`, marginBottom:22 }}>
              <PostRequestForm
                userId={user?.id}
                userPlan={user?.plan}
                onUpgrade={() => openUpgrade('post')}
              />
              <RightColumn />
            </div>

            <FeaturedProfessionals
              onHire={setModal}
              userPlan={user?.plan}
              onUpgrade={() => openUpgrade('hire')}
              settings={settings}
            />
          </main>
        </div>
      </div>

      {upgradeOpen && (
        <UpgradeModal
          onClose={() => setUpgradeOpen(false)}
          feature={upgradeFeature}
        />
      )}

      {modal && user?.plan !== 'basic' && (
        <HireModal
          trader={modal}
          onClose={() => { setModal(null); fetchMetrics(); }}
          userId={user?.id}
        />
      )}
    </>
  );
}