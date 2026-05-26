import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../supabase';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── CSS ────────────────────────────────────────────────────────────────────── */
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

  .in-shell { display: grid; grid-template-columns: var(--sidebar-w) 1fr; height: 100vh; overflow: hidden; }

  /* ── Sidebar ── */
  .in-sidebar {
    background: var(--surface); border-right: 1px solid var(--border);
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
  .in-brand { display: flex; align-items: center; gap: 10px; padding: 20px 20px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .in-brand-icon { width: 34px; height: 34px; background: var(--accent); border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .in-brand-icon i { font-size: 18px; color: #000; }
  .in-brand-name { font-size: 16px; font-weight: 700; color: var(--text); }
  .in-brand-name em { color: var(--accent); font-style: normal; }
  .in-sb-pill { margin: 12px 16px; background: var(--accent-dim); border: 1px solid rgba(200,245,96,.18); border-radius: var(--r-md); padding: 10px 14px; flex-shrink: 0; }
  .in-sb-pill-label { font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
  .in-live-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: in-pulse 2s infinite; flex-shrink: 0; }
  @keyframes in-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .in-sb-pill-val { font-family: var(--mono); font-size: 19px; font-weight: 600; color: var(--accent); letter-spacing: -.5px; }
  .in-sb-pill-sub { font-size: 11px; color: var(--green); margin-top: 3px; }
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
  .in-sb-user { flex-shrink: 0; border-top: 1px solid var(--border); padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
  .in-sb-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%); color: #000; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 12px rgba(200,245,96,.3); }
  .in-sb-user-name { font-size: 13px; font-weight: 700; }
  .in-sb-user-role { font-size: 10px; color: var(--accent); margin-top: 1px; }

  /* ── Right panel ── */
  .in-right { grid-column: 2; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  /* ── Topbar ── */
  .in-topbar { height: var(--topbar-h); flex-shrink: 0; display: flex; align-items: center; padding: 0 28px; background: var(--surface); border-bottom: 1px solid var(--border); gap: 16px; z-index: 50; }
  .in-topbar-title { font-family: var(--serif); font-size: 20px; color: var(--text); flex: 1; }
  .in-topbar-title span { color: var(--accent); font-style: italic; }
  .in-tb-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: var(--muted); font-size: 18px; position: relative; }
  .in-tb-icon:hover { border-color: var(--border2); color: var(--text); }
  .in-notif-dot { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; background: var(--red); border-radius: 50%; border: 1.5px solid var(--surface); }
  .in-tb-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%); color: #000; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 0 10px rgba(200,245,96,.25); }
  .in-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
  .in-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main ── */
  .in-main { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px 28px 40px; }
  .in-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .in-page-title { font-family: var(--serif); font-size: 28px; color: var(--text); line-height: 1.2; }
  .in-page-title em { color: var(--accent); font-style: italic; }
  .in-page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .in-header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .in-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; border-radius: var(--r-sm); font-family: var(--sans); font-weight: 600; cursor: pointer; transition: all .15s; border: none; text-decoration: none; white-space: nowrap; }
  .in-btn-sm { font-size: 12px; padding: 7px 14px; }
  .in-btn-accent { background: var(--accent); color: #000; }
  .in-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: 12px; padding: 7px 14px; }
  .in-btn-ghost:hover { border-color: var(--border2); }

  /* ── Metrics ── */
  .in-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .in-metric { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px 20px; position: relative; overflow: hidden; transition: all .2s; }
  .in-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .in-metric::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%); opacity: .3; }
  .in-metric-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 12px; }
  .in-metric-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .in-metric-value { font-family: var(--mono); font-size: 20px; font-weight: 600; color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px; }
  .in-metric-sub { font-size: 11px; color: var(--muted); }

  /* ── Controls ── */
  .in-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .in-tabs { display: flex; gap: 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 4px; }
  .in-tab { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--r-sm); border: none; cursor: pointer; font-family: var(--sans); font-weight: 700; font-size: 12px; background: transparent; color: var(--muted); transition: all .15s; white-space: nowrap; }
  .in-tab:hover { color: var(--text); }
  .in-tab.active { background: var(--accent); color: #000; }
  .in-tab i { font-size: 14px; }
  .in-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .in-select { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: var(--r-sm); padding: 7px 10px; font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none; transition: border-color .15s; }
  .in-select:hover { border-color: var(--border2); }

  /* ── Badge ── */
  .in-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap; letter-spacing: .2px; }
  .in-badge-green  { background: var(--green-dim);  color: var(--green); }
  .in-badge-blue   { background: var(--blue-dim);   color: var(--blue); }
  .in-badge-red    { background: var(--red-dim);    color: var(--red); }
  .in-badge-gold   { background: var(--accent-dim); color: var(--accent); }
  .in-badge-purple { background: var(--purple-dim); color: var(--purple); }
  .in-badge-amber  { background: var(--amber-dim);  color: var(--amber); }
  .in-badge-muted  { background: rgba(100,116,139,.12); color: var(--muted); }

  /* ── Loading / Error ── */
  .in-loading { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 48px; color: var(--muted); font-size: 13px; }
  .in-error { display: flex; align-items: center; gap: 8px; padding: 16px 20px; background: var(--red-dim); border: 1px solid rgba(248,113,113,.2); border-radius: var(--r-md); color: var(--red); font-size: 13px; margin-bottom: 16px; }
  .in-empty { padding: 40px; text-align: center; color: var(--muted); font-size: 13px; }

  /* ── ECONOMIC ── */
  .eco-layout { display: grid; grid-template-columns: 1fr 340px; gap: 14px; margin-bottom: 14px; }
  .eco-hero { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 22px; position: relative; overflow: hidden; cursor: pointer; transition: all .18s; }
  .eco-hero:hover { border-color: var(--border2); }
  .eco-hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(200,245,96,.04) 0%, transparent 60%); pointer-events: none; }
  .eco-hero-cat { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .eco-hero-title { font-family: var(--serif); font-size: 22px; line-height: 1.35; color: var(--text); margin-bottom: 12px; }
  .eco-hero-title em { color: var(--accent); font-style: italic; }
  .eco-hero-body { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
  .eco-hero-meta { display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--muted); }
  .eco-hero-impact { display: flex; align-items: center; gap: 8px; margin-top: 16px; background: var(--surface2); border-radius: var(--r-sm); padding: 10px 14px; }
  .eco-hero-impact-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
  .eco-side { display: flex; flex-direction: column; gap: 14px; }
  .eco-side-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 16px; cursor: pointer; transition: all .18s; flex: 1; }
  .eco-side-card:hover { background: var(--surface2); border-color: var(--border2); }
  .eco-side-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 8px; }
  .eco-side-title { font-family: var(--serif); font-size: 14px; line-height: 1.4; margin-bottom: 8px; }
  .eco-side-meta { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .eco-indicators { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
  .eco-ind { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px 16px; }
  .eco-ind-name { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin-bottom: 6px; }
  .eco-ind-val { font-family: var(--mono); font-size: 17px; font-weight: 700; margin-bottom: 4px; }
  .eco-ind-chg { font-size: 11px; display: flex; align-items: center; gap: 4px; }

  /* ── EVENTS ── */
  .ev-timeline { position: relative; padding-left: 28px; }
  .ev-timeline::before { content: ''; position: absolute; left: 10px; top: 0; bottom: 0; width: 1px; background: var(--border); }
  .ev-item { position: relative; margin-bottom: 14px; }
  .ev-dot { position: absolute; left: -22px; top: 18px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--bg); }
  .ev-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 16px 18px; cursor: pointer; transition: all .18s; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start; }
  .ev-card:hover { background: var(--surface2); border-color: var(--border2); }
  .ev-card-time { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-bottom: 6px; letter-spacing: .5px; }
  .ev-card-title { font-family: var(--serif); font-size: 15px; line-height: 1.4; margin-bottom: 6px; }
  .ev-card-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .ev-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
  .ev-impact-bar { display: flex; gap: 3px; }
  .ev-impact-seg { width: 6px; height: 16px; border-radius: 2px; }
  .ev-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
  .ev-calendar { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; margin-bottom: 20px; }
  .ev-cal-day { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 10px 8px; text-align: center; cursor: pointer; transition: all .15s; }
  .ev-cal-day:hover { border-color: var(--border2); }
  .ev-cal-day.today { border-color: var(--accent); background: var(--accent-dim); }
  .ev-cal-day-name { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 4px; }
  .ev-cal-day-num { font-family: var(--mono); font-size: 16px; font-weight: 600; }
  .ev-cal-day.today .ev-cal-day-num { color: var(--accent); }
  .ev-cal-dots { display: flex; gap: 3px; justify-content: center; margin-top: 5px; }
  .ev-cal-dot { width: 4px; height: 4px; border-radius: 50%; }

  /* ── FORECAST ── */
  .fc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 14px; }
  .fc-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; position: relative; overflow: hidden; cursor: pointer; transition: all .18s; }
  .fc-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .fc-card-accent-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .fc-card-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 10px; }
  .fc-card-title { font-family: var(--serif); font-size: 15px; line-height: 1.4; margin-bottom: 10px; }
  .fc-card-range { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; background: var(--surface2); border-radius: var(--r-sm); padding: 8px 10px; }
  .fc-card-range-label { font-size: 10px; color: var(--muted); font-weight: 600; flex-shrink: 0; }
  .fc-card-range-vals { font-family: var(--mono); font-size: 12px; font-weight: 700; }
  .fc-gauge { margin-bottom: 12px; }
  .fc-gauge-track { height: 5px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .fc-gauge-fill { height: 100%; border-radius: 99px; transition: width .4s ease; }
  .fc-gauge-labels { display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; color: var(--muted); }
  .fc-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; font-size: 11px; }
  .fc-card-source { color: var(--muted); }
  .fc-card-confidence { font-family: var(--mono); font-weight: 700; }
  .fc-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 14px; }
  .fc-table-head { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .fc-table-title { font-family: var(--serif); font-size: 16px; }
  .in-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .in-table th { text-align: left; padding: 9px 16px; color: var(--muted); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .in-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .in-table tr:last-child td { border-bottom: none; }
  .in-table tr:hover td { background: var(--surface2); }
  .in-spark { display: flex; align-items: flex-end; gap: 2px; height: 22px; }
  .in-spark-bar { width: 5px; border-radius: 2px; }

  /* ── PREDICT ── */
  .pr-hero { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 22px; margin-bottom: 14px; position: relative; overflow: hidden; }
  .pr-hero::after { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(167,139,250,.08) 0%, transparent 70%); pointer-events: none; }
  .pr-hero-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--purple); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .pr-hero-title { font-family: var(--serif); font-size: 20px; line-height: 1.4; margin-bottom: 8px; }
  .pr-hero-sub { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 18px; }
  .pr-consensus { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .pr-con-box { background: var(--surface2); border-radius: var(--r-md); padding: 14px; text-align: center; border: 1px solid var(--border); }
  .pr-con-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin-bottom: 8px; }
  .pr-con-val { font-family: var(--mono); font-size: 22px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
  .pr-con-sub { font-size: 11px; color: var(--muted); }
  .pr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pr-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; cursor: pointer; transition: all .18s; }
  .pr-card:hover { background: var(--surface2); border-color: var(--border2); }
  .pr-card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .pr-card-title { font-family: var(--serif); font-size: 15px; line-height: 1.4; margin-bottom: 4px; }
  .pr-card-src { font-size: 11px; color: var(--muted); }
  .pr-meter { margin: 14px 0 10px; }
  .pr-meter-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin-bottom: 8px; display: flex; justify-content: space-between; }
  .pr-meter-track { height: 8px; background: var(--surface2); border-radius: 99px; overflow: hidden; position: relative; }
  .pr-meter-fill { height: 100%; border-radius: 99px; }
  .pr-factors { border-top: 1px solid var(--border); padding-top: 12px; }
  .pr-factor { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; font-size: 12px; }
  .pr-factor i { font-size: 14px; flex-shrink: 0; }
  .pr-factor-val { margin-left: auto; font-family: var(--mono); font-size: 11px; font-weight: 700; }
  .pr-ai-tag { display: inline-flex; align-items: center; gap: 5px; background: var(--purple-dim); border: 1px solid rgba(167,139,250,.2); border-radius: 4px; padding: 2px 8px; font-size: 10px; font-weight: 700; color: var(--purple); }
  .pr-ai-tag i { font-size: 11px; }

  /* ── Responsive ── */
  @media (max-width:1200px) { .eco-layout { grid-template-columns: 1fr; } .eco-side { flex-direction: row; } .pr-grid { grid-template-columns: 1fr; } .fc-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width:1100px) { .in-metrics { grid-template-columns: repeat(2,1fr); } }
  @media (max-width:768px) {
    .in-shell { grid-template-columns: 1fr !important; }
    .in-sidebar { position: fixed !important; top: 0 !important; left: 0 !important; transform: translateX(-100%) !important; z-index: 300 !important; }
    .in-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column: 1; }
    .in-hamburger { display: flex; }
    .eco-indicators { grid-template-columns: repeat(2,1fr); }
    .ev-calendar { grid-template-columns: repeat(4,1fr); }
    .fc-grid { grid-template-columns: 1fr; }
  }
  @media (max-width:600px) { .in-main { padding: 16px; } .in-topbar { padding: 0 16px; } }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function fmtRelative(ts) {
  if (!ts) return '—';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fmtEventTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const dayStr = isToday
    ? 'TODAY'
    : d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase();
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC';
  return `${dayStr} · ${timeStr}`;
}

// Map impact_level string → integer for ImpactBar
function impactInt(level) {
  const map = { high: 5, medium: 3, low: 1 };
  if (typeof level === 'number') return level;
  return map[String(level).toLowerCase()] ?? 2;
}

// Dot color based on impact
function impactDotColor(level) {
  const n = typeof level === 'number' ? level : impactInt(level);
  if (n >= 5) return T.rd;
  if (n >= 4) return T.am;
  if (n >= 3) return T.bl;
  return T.gn;
}

/* ─── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar({ open, user, onLogout }) {
  const initials    = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '??';
  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Loading…';
  const planLabel   = user ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} · ${user.is_verified ? 'Verified' : 'Unverified'}` : '';
  const balance     = user?.balance ?? 0;
  const balStr      = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const mainLinks = [
    { href: '/dashboard',   icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { href: '/copy-trading',icon: 'ti-copy',             label: 'Copy Trading' },
    { href: '/hire-trader', icon: 'ti-users',            label: 'Hire a Trader' },
    { href: '/insights',    icon: 'ti-chart-line',       label: 'Insights', active: true },
    { href: '/market-place',icon: 'ti-robot',            label: 'Marketplace', badge: 'NEW' },
  ];
  const acctLinks = [
    { href: '/payment', icon: 'ti-credit-card', label: 'Payments' },
    { href: '/profile', icon: 'ti-user-circle', label: 'Profile' },
    { href: '/settings',icon: 'ti-settings',    label: 'Settings' },
    { href: '/support', icon: 'ti-headset',     label: 'Support' },
  ];

  return (
    <div className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" /> Portfolio Value</div>
        <div className="in-sb-pill-val">${balStr}</div>
        <div className="in-sb-pill-sub">Available balance</div>
      </div>
      <div className="in-sb-scroll">
        <div className="in-sb-section">Main</div>
        {mainLinks.map(({ href, icon, label, active, badge }) => (
          <a key={label} href={href} className={`in-sb-link${active ? ' active' : ''}`}>
            <i className={`ti ${icon}`} />{label}
            {badge && <span className="in-sb-badge">{badge}</span>}
          </a>
        ))}
        <div className="in-sb-section" style={{ marginTop: 8 }}>Account</div>
        {acctLinks.map(({ href, icon, label }) => (
          <a key={label} href={href} className="in-sb-link">
            <i className={`ti ${icon}`} />{label}
          </a>
        ))}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="in-sb-user-name">{displayName}</div>
          <div className="in-sb-user-role">{planLabel}</div>
        </div>
        <button onClick={onLogout} title="Sign out"
          style={{ background: 'none', border: 'none', color: T.nt, cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0 }}>
          <i className="ti ti-logout" />
        </button>
      </div>
    </div>
  );
}

/* ─── Topbar ─────────────────────────────────────────────────────────────────── */
function Topbar({ onMenu, user }) {
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '??';
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">{greeting}, <span>{user?.first_name || '…'}</span></div>
      <div style={{ flex: 1 }} />
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon"><i className="ti ti-bell" /><span className="in-notif-dot" /></div>
      <div className="in-tb-avatar">{initials}</div>
    </div>
  );
}

/* ─── MetricCard ─────────────────────────────────────────────────────────────── */
function MetricCard({ m }) {
  return (
    <div className="in-metric">
      <div className="in-metric-icon" style={{ background: m.bg, color: m.col }}>
        <i className={`ti ${m.icon}`} />
      </div>
      <div className="in-metric-label">{m.label}</div>
      <div className="in-metric-value">{m.value}</div>
      <div className="in-metric-sub">{m.sub}</div>
    </div>
  );
}

/* ─── ImpactBar ──────────────────────────────────────────────────────────────── */
function ImpactBar({ level }) {
  const n = typeof level === 'number' ? level : impactInt(level);
  return (
    <div className="ev-impact-bar">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="ev-impact-seg" style={{
          background: i <= n ? (n >= 4 ? T.rd : n >= 3 ? T.am : T.bl) : T.br,
        }} />
      ))}
    </div>
  );
}

/* ─── Sparkline ──────────────────────────────────────────────────────────────── */
function Sparkline({ bars, dir }) {
  if (!bars?.length) return null;
  const max = Math.max(...bars);
  return (
    <div className="in-spark">
      {bars.map((v, i) => (
        <div key={i} className="in-spark-bar" style={{
          height: `${Math.round((v / max) * 22)}px`,
          background: dir ? T.gn : T.rd,
          opacity: 0.4 + (i / bars.length) * 0.6,
        }} />
      ))}
    </div>
  );
}

/* ─── EconomicPanel ──────────────────────────────────────────────────────────── */
function EconomicPanel({ marketFilter, impactFilter }) {
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');
  const [hero,    setHero]    = useState(null);
  const [side,    setSide]    = useState([]);
  const [more,    setMore]    = useState([]);
  const [inds,    setInds]    = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr('');

      // Build base query
      let q = supabase
        .from('news_articles')
        .select('id, category, title, body, source, impact_level, badge_label, badge_type, published_at, markets_affected')
        .eq('tab', 'economic')
        .order('published_at', { ascending: false });

      if (impactFilter !== 'All Impact') {
        const lvl = impactFilter === 'High Impact' ? 'high' : 'medium';
        q = q.eq('impact_level', lvl);
      }
      if (marketFilter !== 'All Markets') {
        q = q.contains('markets_affected', [marketFilter]);
      }

      const { data, error } = await q.limit(20);
      setLoading(false);
      if (error) { setErr(error.message); return; }

      const rows = data || [];
      setHero(rows[0] || null);
      setSide(rows.slice(1, 3));
      setMore(rows.slice(3));
      // Derive indicator strip from hero + side articles (static fallback displayed as-is from DB)
      // You can replace this with a dedicated market_indicators table if available
      setInds([]);
    };
    load();
  }, [marketFilter, impactFilter]);

  if (loading) return <div className="in-loading"><i className="ti ti-loader-2" style={{ fontSize: 20 }} /> Loading economic news…</div>;
  if (err)     return <div className="in-error"><i className="ti ti-alert-circle" /> {err}</div>;
  if (!hero)   return <div className="in-empty">No economic news found.</div>;

  return (
    <div>
      {/* Hero + side */}
      <div className="eco-layout">
        <div className="eco-hero">
          <div className="eco-hero-cat">
            <i className="ti ti-building-bank" style={{ fontSize: 13 }} />
            {hero.category}
            {hero.badge_label && (
              <span className={`in-badge in-badge-${hero.badge_type || 'gold'}`} style={{ marginLeft: 4 }}>
                {hero.badge_label}
              </span>
            )}
          </div>
          <div className="eco-hero-title">{hero.title}</div>
          {hero.body && <div className="eco-hero-body">{hero.body}</div>}
          <div className="eco-hero-meta">
            <i className="ti ti-clock" style={{ fontSize: 13 }} />
            {fmtRelative(hero.published_at)}
            {hero.source && <><span style={{ color: T.br2 }}>·</span>{hero.source}</>}
          </div>
          {hero.markets_affected?.length > 0 && (
            <div className="eco-hero-impact">
              <div className="eco-hero-impact-label">Markets Affected</div>
              {hero.markets_affected.map(m => (
                <div key={m} style={{ marginLeft: 14 }}>
                  <span style={{ fontSize: 10, color: T.nt }}>{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {side.length > 0 && (
          <div className="eco-side">
            {side.map(s => (
              <div key={s.id} className="eco-side-card">
                <div className="eco-side-cat">
                  {s.category}
                  {s.badge_label && (
                    <span className={`in-badge in-badge-${s.badge_type || 'blue'}`} style={{ marginLeft: 8 }}>
                      {s.badge_label}
                    </span>
                  )}
                </div>
                <div className="eco-side-title">{s.title}</div>
                <div className="eco-side-meta">
                  <i className="ti ti-clock" style={{ fontSize: 12 }} />{fmtRelative(s.published_at)}
                  {s.source && <><span style={{ color: T.br2 }}>·</span>{s.source}</>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* More headlines */}
      {more.length > 0 && (
        <div style={{ background: T.s, border: `1px solid ${T.br}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.br}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: T.serif, fontSize: 16 }}>
              More <em style={{ color: T.g, fontStyle: 'italic' }}>Economic</em> Headlines
            </div>
            <a href="#" className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-external-link" /> View All</a>
          </div>
          <table className="in-table">
            <thead>
              <tr><th>Category</th><th>Headline</th><th>Impact</th><th>Time</th></tr>
            </thead>
            <tbody>
              {more.map(r => (
                <tr key={r.id}>
                  <td style={{ color: T.nt, fontSize: 11 }}>{r.category}</td>
                  <td style={{ fontWeight: 500 }}>{r.title}</td>
                  <td>
                    {r.badge_label && (
                      <span className={`in-badge in-badge-${r.badge_type || 'muted'}`}>{r.badge_label}</span>
                    )}
                  </td>
                  <td style={{ color: T.nt, fontFamily: T.mono, fontSize: 11 }}>{fmtRelative(r.published_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── EventsPanel ────────────────────────────────────────────────────────────── */
function EventsPanel({ marketFilter, impactFilter }) {
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');
  const [events,  setEvents]  = useState([]);
  const [calDays, setCalDays] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr('');

      let q = supabase
        .from('market_events')
        .select('id, title, description, event_time, impact_level, badge_label, badge_type, affected_assets, forecast_value, previous_value')
        .gte('event_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('event_time', { ascending: true })
        .limit(20);

      if (impactFilter === 'High Impact')   q = q.gte('impact_level', 4);
      if (impactFilter === 'Medium Impact') q = q.gte('impact_level', 2).lt('impact_level', 4);
      if (marketFilter !== 'All Markets')   q = q.contains('affected_assets', [marketFilter]);

      const { data, error } = await q;
      setLoading(false);
      if (error) { setErr(error.message); return; }

      const rows = data || [];
      setEvents(rows);

      // Build calendar strip from event timestamps
      const now  = new Date();
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - 3 + i);
        const isToday = d.toDateString() === now.toDateString();
        const dayEvents = rows.filter(ev => {
          const ed = new Date(ev.event_time);
          return ed.toDateString() === d.toDateString();
        });
        const dots = [...new Set(dayEvents.map(ev => impactDotColor(ev.impact_level)))];
        return {
          name: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          num:  d.getDate(),
          dots,
          today: isToday,
        };
      });
      setCalDays(days);
    };
    load();
  }, [marketFilter, impactFilter]);

  if (loading) return <div className="in-loading"><i className="ti ti-loader-2" style={{ fontSize: 20 }} /> Loading events…</div>;
  if (err)     return <div className="in-error"><i className="ti ti-alert-circle" /> {err}</div>;

  return (
    <div>
      {/* Calendar strip */}
      <div className="ev-calendar">
        {calDays.map(d => (
          <div key={d.num} className={`ev-cal-day${d.today ? ' today' : ''}`}>
            <div className="ev-cal-day-name">{d.name}</div>
            <div className="ev-cal-day-num">{d.num}</div>
            <div className="ev-cal-dots">
              {d.dots.map((c, i) => <div key={i} className="ev-cal-dot" style={{ background: c }} />)}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0
        ? <div className="in-empty">No upcoming events found.</div>
        : (
          <div className="ev-timeline">
            {events.map(ev => (
              <div key={ev.id} className="ev-item">
                <div className="ev-dot" style={{ background: impactDotColor(ev.impact_level) }} />
                <div className="ev-card">
                  <div>
                    <div className="ev-card-time">{fmtEventTime(ev.event_time)}</div>
                    <div className="ev-card-title">{ev.title}</div>
                    {ev.description && <div className="ev-card-desc">{ev.description}</div>}
                    {ev.affected_assets?.length > 0 && (
                      <div className="ev-tags">
                        {ev.affected_assets.map(t => (
                          <span key={t} style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 7px',
                            background: T.s2, border: `1px solid ${T.br}`,
                            borderRadius: 4, color: T.nt,
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                    {(ev.forecast_value || ev.previous_value) && (
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        {ev.forecast_value && (
                          <span style={{ fontSize: 11, color: T.nt }}>
                            Forecast: <span style={{ color: T.bl, fontFamily: T.mono, fontWeight: 700 }}>{ev.forecast_value}</span>
                          </span>
                        )}
                        {ev.previous_value && (
                          <span style={{ fontSize: 11, color: T.nt }}>
                            Previous: <span style={{ color: T.gr, fontFamily: T.mono, fontWeight: 700 }}>{ev.previous_value}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ev-card-right">
                    {ev.badge_label && (
                      <span className={`in-badge in-badge-${ev.badge_type || 'blue'}`}>{ev.badge_label}</span>
                    )}
                    <ImpactBar level={ev.impact_level} />
                    <span style={{ fontSize: 10, color: T.nt }}>Impact</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

/* ─── ForecastPanel ──────────────────────────────────────────────────────────── */
function ForecastPanel({ marketFilter }) {
  const [loading,  setLoading]  = useState(true);
  const [err,      setErr]      = useState('');
  const [gauges,   setGauges]   = useState([]);
  const [tableQ3,  setTableQ3]  = useState([]);
  const [tableQ4,  setTableQ4]  = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr('');

      let q = supabase
        .from('asset_forecasts')
        .select('id, asset, category, period, title, range_low, range_high, bullish_pct, confidence_pct, source, color_hex')
        .order('category', { ascending: true });

      if (marketFilter !== 'All Markets') q = q.eq('category', marketFilter);

      const { data, error } = await q;
      setLoading(false);
      if (error) { setErr(error.message); return; }

      const rows = data || [];
      // Gauge cards: rows with confidence_pct populated (the 3 main forecasts)
      setGauges(rows.filter(r => r.confidence_pct != null));
      setTableQ3(rows.filter(r => r.period === 'Q3 2026'));
      setTableQ4(rows.filter(r => r.period === 'Q4 2026'));
    };
    load();
  }, [marketFilter]);

  if (loading) return <div className="in-loading"><i className="ti ti-loader-2" style={{ fontSize: 20 }} /> Loading forecasts…</div>;
  if (err)     return <div className="in-error"><i className="ti ti-alert-circle" /> {err}</div>;

  // Build table rows by merging Q3 and Q4 on asset
  const tableAssets = [...new Set([...tableQ3, ...tableQ4].map(r => r.asset))];
  const tableRows = tableAssets.map(asset => {
    const q3 = tableQ3.find(r => r.asset === asset);
    const q4 = tableQ4.find(r => r.asset === asset);
    return { asset, color_hex: q3?.color_hex || q4?.color_hex, q3, q4 };
  });

  const fmtRange = (low, high, asset) => {
    if (low == null || high == null) return '—';
    // Format based on magnitude
    const fmt = v => v >= 1000
      ? v.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : v < 10
        ? v.toFixed(4)
        : v.toFixed(2);
    // Add % for bond/rate assets
    const pct = asset?.includes('10Y') || asset?.includes('Treasury') ? '%' : '';
    return `${fmt(low)}${pct} – ${fmt(high)}${pct}`;
  };

  return (
    <div>
      {/* Gauge cards */}
      {gauges.length > 0 && (
        <div className="fc-grid">
          {gauges.map(f => (
            <div key={f.id} className="fc-card">
              <div className="fc-card-accent-line" style={{ background: f.color_hex || T.g }} />
              <div className="fc-card-cat">{f.category}</div>
              <div className="fc-card-title">{f.title}</div>
              <div className="fc-card-range">
                <span className="fc-card-range-label">Target range</span>
                <span className="fc-card-range-vals" style={{ color: f.color_hex || T.g }}>
                  {fmtRange(f.range_low, f.range_high, f.asset)}
                </span>
              </div>
              <div className="fc-gauge">
                <div className="fc-gauge-track">
                  <div className="fc-gauge-fill" style={{ width: `${f.bullish_pct || 50}%`, background: f.color_hex || T.g }} />
                </div>
                <div className="fc-gauge-labels"><span>Bearish</span><span>Bullish</span></div>
              </div>
              <div className="fc-card-footer">
                <span className="fc-card-source">
                  {f.source && <><i className="ti ti-users" style={{ fontSize: 11, marginRight: 4 }} />{f.source}</>}
                </span>
                <span className="fc-card-confidence" style={{ color: f.color_hex || T.g }}>
                  {f.confidence_pct}% confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Q3/Q4 table */}
      {tableRows.length > 0 && (
        <div className="fc-table-wrap">
          <div className="fc-table-head">
            <div className="fc-table-title">
              <em style={{ color: T.g, fontStyle: 'italic' }}>Asset</em> Forecast Table — Q3 / Q4 2026
            </div>
            <a href="#" className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-download" /> Export</a>
          </div>
          <table className="in-table">
            <thead>
              <tr><th>Asset</th><th>Q3 2026 Range</th><th>Q4 2026 Range</th></tr>
            </thead>
            <tbody>
              {tableRows.map(r => (
                <tr key={r.asset}>
                  <td style={{ fontWeight: 600 }}>{r.asset}</td>
                  <td style={{ fontFamily: T.mono, fontSize: 11, color: T.bl }}>
                    {r.q3 ? fmtRange(r.q3.range_low, r.q3.range_high, r.asset) : '—'}
                  </td>
                  <td style={{ fontFamily: T.mono, fontSize: 11, color: T.nt }}>
                    {r.q4 ? fmtRange(r.q4.range_low, r.q4.range_high, r.asset) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {gauges.length === 0 && tableRows.length === 0 && (
        <div className="in-empty">No forecast data found.</div>
      )}
    </div>
  );
}

/* ─── PredictPanel ───────────────────────────────────────────────────────────── */
function PredictPanel() {
  const [loading,     setLoading]     = useState(true);
  const [err,         setErr]         = useState('');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr('');
      const { data, error } = await supabase
        .from('ai_predictions')
        .select('id, title, source, badge_label, probability_pct, color_hex, factors, created_at')
        .order('probability_pct', { ascending: false });
      setLoading(false);
      if (error) { setErr(error.message); return; }
      setPredictions(data || []);
    };
    load();
  }, []);

  if (loading) return <div className="in-loading"><i className="ti ti-loader-2" style={{ fontSize: 20 }} /> Loading predictions…</div>;
  if (err)     return <div className="in-error"><i className="ti ti-alert-circle" /> {err}</div>;
  if (!predictions.length) return <div className="in-empty">No AI predictions available.</div>;

  // Derive consensus from all predictions
  const bullish = predictions.filter(p => (p.probability_pct || 0) >= 55);
  const bearish = predictions.filter(p => (p.probability_pct || 0) <= 35);
  const neutral = predictions.filter(p => (p.probability_pct || 0) > 35 && (p.probability_pct || 0) < 55);
  const total   = predictions.length || 1;
  const bullPct = Math.round((bullish.length / total) * 100);
  const bearPct = Math.round((bearish.length / total) * 100);
  const neutPct = 100 - bullPct - bearPct;
  const sentimentLabel = bullPct >= 50 ? 'Moderately Bullish' : bearPct >= 50 ? 'Cautiously Bearish' : 'Mixed Signals';

  return (
    <div>
      {/* Consensus hero */}
      <div className="pr-hero">
        <div className="pr-hero-label">
          <i className="ti ti-cpu" style={{ fontSize: 13 }} />
          AI Market Consensus · Updated {fmtRelative(predictions[0]?.created_at)}
        </div>
        <div className="pr-hero-title">
          Global Market Sentiment —{' '}
          <em style={{ color: T.pr, fontStyle: 'italic' }}>{sentimentLabel}</em>
        </div>
        <div className="pr-hero-sub">
          TradeFlow's ensemble model synthesises 340+ data sources — macro indicators, on-chain signals,
          options flow, and sentiment feeds — to produce a real-time market consensus.
        </div>
        <div className="pr-consensus">
          {[
            { label: 'Bullish',  val: `${bullPct}%`, color: T.gn },
            { label: 'Neutral',  val: `${neutPct}%`, color: T.nt },
            { label: 'Bearish',  val: `${bearPct}%`, color: T.rd },
          ].map(c => (
            <div key={c.label} className="pr-con-box">
              <div className="pr-con-label">{c.label}</div>
              <div className="pr-con-val" style={{ color: c.color }}>{c.val}</div>
              <div className="pr-con-sub">of models</div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction cards */}
      <div className="pr-grid">
        {predictions.map(p => {
          const factors = Array.isArray(p.factors) ? p.factors : [];
          return (
            <div key={p.id} className="pr-card">
              <div className="pr-card-head">
                <div>
                  <div className="pr-card-title">{p.title}</div>
                  {p.source && (
                    <div className="pr-card-src" style={{ marginTop: 4 }}>
                      <i className="ti ti-database" style={{ fontSize: 12, marginRight: 4 }} />{p.source}
                    </div>
                  )}
                </div>
                {p.badge_label && (
                  <div className="pr-ai-tag" style={{ marginLeft: 12, flexShrink: 0 }}>
                    <i className="ti ti-sparkles" />{p.badge_label}
                  </div>
                )}
              </div>

              <div className="pr-meter">
                <div className="pr-meter-label">
                  <span>Probability</span>
                  <span style={{ fontFamily: T.mono, color: p.color_hex || T.pr }}>
                    {parseFloat(p.probability_pct).toFixed(0)}%
                  </span>
                </div>
                <div className="pr-meter-track">
                  <div className="pr-meter-fill" style={{
                    width: `${p.probability_pct}%`,
                    background: p.color_hex || T.pr,
                  }} />
                </div>
              </div>

              {factors.length > 0 && (
                <div className="pr-factors">
                  {factors.map((f, i) => (
                    <div key={i} className="pr-factor">
                      <i className={`ti ${f.icon}`} style={{ color: f.color }} />
                      <span style={{ color: T.nt, fontSize: 12 }}>{f.label}</span>
                      <span className="pr-factor-val" style={{ color: f.color }}>{f.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function Insights() {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab,         setTab]         = useState('economic');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [marketFilter, setMarketFilter] = useState('All Markets');
  const [impactFilter, setImpactFilter] = useState('All Impact');

  // Metrics derived from DB counts
  const [metrics, setMetrics] = useState([
    { label: 'News Tracked',    value: '—', sub: 'Loading…',        icon: 'ti-news',                  bg: 'rgba(200,245,96,.12)',  col: '#c8f560' },
    { label: 'Events This Week',value: '—', sub: 'Loading…',        icon: 'ti-calendar-event',        bg: 'rgba(96,165,250,.12)',  col: '#60a5fa' },
    { label: 'Active Forecasts',value: '—', sub: 'Loading…',        icon: 'ti-chart-arrows-vertical', bg: 'rgba(52,211,153,.12)',  col: '#34d399' },
    { label: 'AI Predictions',  value: '—', sub: 'Loading…',        icon: 'ti-cpu',                   bg: 'rgba(167,139,250,.12)', col: '#a78bfa' },
  ]);

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const uid = session.user.id;
        const [{ data: profile }, { data: wallet }] = await Promise.all([
          supabase.from('users').select('id, first_name, last_name, plan, is_verified').eq('id', uid).single(),
          supabase.from('wallets').select('balance').eq('user_id', uid).eq('currency', 'USD').single(),
        ]);
        if (profile) setUser({ ...profile, balance: parseFloat(wallet?.balance ?? 0) });
      }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Metrics ── */
  const fetchMetrics = useCallback(async () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const today   = new Date().toISOString().split('T')[0];
    const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: newsCount },
      { count: eventsCount },
      { count: forecastCount },
      { data:  predictions },
    ] = await Promise.all([
      supabase.from('news_articles').select('id', { count: 'exact', head: true }),
      supabase.from('market_events').select('id', { count: 'exact', head: true })
        .gte('event_time', weekAgo).lte('event_time', weekEnd),
      supabase.from('asset_forecasts').select('id', { count: 'exact', head: true }),
      supabase.from('ai_predictions').select('probability_pct').order('created_at', { ascending: false }).limit(20),
    ]);

    const todayNews = await supabase
      .from('news_articles')
      .select('id', { count: 'exact', head: true })
      .gte('published_at', `${today}T00:00:00Z`);

    const highImpactEvents = await supabase
      .from('market_events')
      .select('id', { count: 'exact', head: true })
      .gte('event_time', weekAgo).lte('event_time', weekEnd)
      .gte('impact_level', 4);

    // Avg accuracy: % of predictions with probability >= 60
    const preds    = predictions || [];
    const avgConf  = preds.length
      ? (preds.reduce((a, p) => a + parseFloat(p.probability_pct || 0), 0) / preds.length).toFixed(1)
      : '—';

    setMetrics([
      { label: 'News Tracked',    value: (newsCount ?? 0).toLocaleString(), sub: `+${todayNews.count ?? 0} today`,          icon: 'ti-news',                  bg: 'rgba(200,245,96,.12)',  col: '#c8f560' },
      { label: 'Events This Week',value: String(eventsCount ?? 0),          sub: `${highImpactEvents.count ?? 0} high-impact`, icon: 'ti-calendar-event',        bg: 'rgba(96,165,250,.12)',  col: '#60a5fa' },
      { label: 'Active Forecasts',value: String(forecastCount ?? 0),        sub: 'Across all assets',                         icon: 'ti-chart-arrows-vertical', bg: 'rgba(52,211,153,.12)',  col: '#34d399' },
      { label: 'Avg AI Confidence',value: avgConf !== '—' ? `${avgConf}%` : '—', sub: `${preds.length} active models`,       icon: 'ti-cpu',                   bg: 'rgba(167,139,250,.12)', col: '#a78bfa' },
    ]);
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  const TABS = [
    { key: 'economic', label: 'Economic News',  icon: 'ti-building-bank' },
    { key: 'events',   label: 'Event News',     icon: 'ti-calendar-event' },
    { key: 'forecast', label: 'Forecast',       icon: 'ti-chart-arrows-vertical' },
    { key: 'predict',  label: 'AI Predictions', icon: 'ti-cpu' },
  ];

  if (authLoading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080b10', color: '#64748b', fontSize: 14, gap: 10 }}>
        <i className="ti ti-loader-2" style={{ fontSize: 20 }} /> Loading…
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 299,
        }} />
      )}

      <div className="in-shell">
        <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} />

          <main className="in-main">
            {/* Page header */}
            <div className="in-page-header">
              <div>
                <div className="in-page-title"><em>Insights</em></div>
                <div className="in-page-sub">
                  <span className="in-live-dot" />
                  Real-time market intelligence — news, events, forecasts, and AI-powered predictions.
                </div>
              </div>
              <div className="in-header-actions">
                <a href="/notification" className="in-btn in-btn-ghost in-btn-sm">
                  <i className="ti ti-bell" /> Alerts
                </a>
                <button className="in-btn in-btn-accent in-btn-sm" onClick={fetchMetrics}>
                  <i className="ti ti-refresh" /> Refresh
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="in-metrics">
              {metrics.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            {/* Controls */}
            <div className="in-controls">
              <div className="in-tabs">
                {TABS.map(({ key, label, icon }) => (
                  <button key={key} className={`in-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                    <i className={`ti ${icon}`} />{label}
                  </button>
                ))}
              </div>
              <div className="in-filters">
                <select className="in-select" value={marketFilter} onChange={e => setMarketFilter(e.target.value)}>
                  <option>All Markets</option>
                  <option>Crypto</option>
                  <option>Forex</option>
                  <option>Equities</option>
                  <option>Commodities</option>
                  <option>Bonds</option>
                </select>
                {(tab === 'economic' || tab === 'events') && (
                  <select className="in-select" value={impactFilter} onChange={e => setImpactFilter(e.target.value)}>
                    <option>All Impact</option>
                    <option>High Impact</option>
                    <option>Medium Impact</option>
                  </select>
                )}
              </div>
            </div>

            {/* Panels */}
            {tab === 'economic' && <EconomicPanel marketFilter={marketFilter} impactFilter={impactFilter} />}
            {tab === 'events'   && <EventsPanel   marketFilter={marketFilter} impactFilter={impactFilter} />}
            {tab === 'forecast' && <ForecastPanel marketFilter={marketFilter} />}
            {tab === 'predict'  && <PredictPanel />}
          </main>
        </div>
      </div>
    </>
  );
}