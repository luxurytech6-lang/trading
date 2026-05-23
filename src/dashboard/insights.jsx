import React, { useState } from 'react';

/* ─── Design tokens (matches CopyTrading / Marketplace) ─────────────────────── */
const T = {
  bg:  '#080b10', s:   '#0e1219', s2:  '#141922', br:  '#1e2535', br2: '#2a3347',
  gr:  '#e2e8f0', nt:  '#64748b', g:   '#c8f560', gd:  'rgba(200,245,96,.12)',
  bl:  '#60a5fa', rd:  '#f87171', gn:  '#34d399',  pr:  '#a78bfa',
  am:  '#f59e0b',
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
  .in-btn-accent { background: var(--accent); color: #000; }
  .in-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: 12px; padding: 7px 14px; }
  .in-btn-ghost:hover { border-color: var(--border2); }

  /* ── Insight Metrics ── */
  .in-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .in-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px 20px;
    position: relative; overflow: hidden; transition: all .2s;
  }
  .in-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .in-metric::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .3;
  }
  .in-metric-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 12px; }
  .in-metric-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .in-metric-value { font-family: var(--mono); font-size: 20px; font-weight: 600; color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px; }
  .in-metric-sub { font-size: 11px; color: var(--muted); }

  /* ── Tab Controls ── */
  .in-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
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
  .in-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .in-select {
    background: var(--surface2); border: 1px solid var(--border); color: var(--text);
    border-radius: var(--r-sm); padding: 7px 10px;
    font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none; transition: border-color .15s;
  }
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

  /* ─────────────────────────────────────────────────────── */
  /* ── ECONOMIC NEWS ── */
  /* Hero card (wide) + side stacked */
  .eco-layout { display: grid; grid-template-columns: 1fr 340px; gap: 14px; margin-bottom: 14px; }
  .eco-hero {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 22px; position: relative; overflow: hidden;
    cursor: pointer; transition: all .18s;
  }
  .eco-hero:hover { border-color: var(--border2); }
  .eco-hero::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(200,245,96,.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .eco-hero-cat { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .eco-hero-title { font-family: var(--serif); font-size: 22px; line-height: 1.35; color: var(--text); margin-bottom: 12px; }
  .eco-hero-title em { color: var(--accent); font-style: italic; }
  .eco-hero-body { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
  .eco-hero-meta { display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--muted); }
  .eco-hero-impact {
    display: flex; align-items: center; gap: 8px; margin-top: 16px;
    background: var(--surface2); border-radius: var(--r-sm); padding: 10px 14px;
  }
  .eco-hero-impact-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
  .eco-side { display: flex; flex-direction: column; gap: 14px; }
  .eco-side-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 16px; cursor: pointer; transition: all .18s; flex: 1;
  }
  .eco-side-card:hover { background: var(--surface2); border-color: var(--border2); }
  .eco-side-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 8px; }
  .eco-side-title { font-family: var(--serif); font-size: 14px; line-height: 1.4; margin-bottom: 8px; }
  .eco-side-meta { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  /* Indicator strip */
  .eco-indicators { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
  .eco-ind {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-md); padding: 14px 16px;
  }
  .eco-ind-name { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin-bottom: 6px; }
  .eco-ind-val { font-family: var(--mono); font-size: 17px; font-weight: 700; margin-bottom: 4px; }
  .eco-ind-chg { font-size: 11px; display: flex; align-items: center; gap: 4px; }

  /* ─────────────────────────────────────────────────────── */
  /* ── EVENT NEWS ── */
  .ev-timeline { position: relative; padding-left: 28px; }
  .ev-timeline::before { content: ''; position: absolute; left: 10px; top: 0; bottom: 0; width: 1px; background: var(--border); }
  .ev-item { position: relative; margin-bottom: 14px; }
  .ev-dot {
    position: absolute; left: -22px; top: 18px;
    width: 10px; height: 10px; border-radius: 50%;
    border: 2px solid var(--bg);
  }
  .ev-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 16px 18px;
    cursor: pointer; transition: all .18s;
    display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start;
  }
  .ev-card:hover { background: var(--surface2); border-color: var(--border2); }
  .ev-card-time { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-bottom: 6px; letter-spacing: .5px; }
  .ev-card-title { font-family: var(--serif); font-size: 15px; line-height: 1.4; margin-bottom: 6px; }
  .ev-card-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .ev-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
  .ev-impact-bar { display: flex; gap: 3px; }
  .ev-impact-seg { width: 6px; height: 16px; border-radius: 2px; }
  .ev-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }

  /* Calendar strip */
  .ev-calendar { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; margin-bottom: 20px; }
  .ev-cal-day {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-md); padding: 10px 8px; text-align: center;
    cursor: pointer; transition: all .15s;
  }
  .ev-cal-day:hover { border-color: var(--border2); }
  .ev-cal-day.today { border-color: var(--accent); background: var(--accent-dim); }
  .ev-cal-day-name { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 4px; }
  .ev-cal-day-num { font-family: var(--mono); font-size: 16px; font-weight: 600; }
  .ev-cal-day.today .ev-cal-day-num { color: var(--accent); }
  .ev-cal-dots { display: flex; gap: 3px; justify-content: center; margin-top: 5px; }
  .ev-cal-dot { width: 4px; height: 4px; border-radius: 50%; }

  /* ─────────────────────────────────────────────────────── */
  /* ── FORECAST NEWS ── */
  .fc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 14px; }
  .fc-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px; position: relative; overflow: hidden;
    cursor: pointer; transition: all .18s;
  }
  .fc-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .fc-card-accent-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .fc-card-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 10px; }
  .fc-card-title { font-family: var(--serif); font-size: 15px; line-height: 1.4; margin-bottom: 10px; }
  .fc-card-range {
    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
    background: var(--surface2); border-radius: var(--r-sm); padding: 8px 10px;
  }
  .fc-card-range-label { font-size: 10px; color: var(--muted); font-weight: 600; flex-shrink: 0; }
  .fc-card-range-vals { font-family: var(--mono); font-size: 12px; font-weight: 700; }
  .fc-gauge { margin-bottom: 12px; }
  .fc-gauge-track { height: 5px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .fc-gauge-fill { height: 100%; border-radius: 99px; transition: width .4s ease; }
  .fc-gauge-labels { display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; color: var(--muted); }
  .fc-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; font-size: 11px; }
  .fc-card-source { color: var(--muted); }
  .fc-card-confidence { font-family: var(--mono); font-weight: 700; }

  /* Forecast table */
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

  /* ─────────────────────────────────────────────────────── */
  /* ── PREDICT NEWS ── */
  .pr-hero {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 22px; margin-bottom: 14px;
    position: relative; overflow: hidden;
  }
  .pr-hero::after {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(167,139,250,.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .pr-hero-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--purple); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .pr-hero-title { font-family: var(--serif); font-size: 20px; line-height: 1.4; margin-bottom: 8px; }
  .pr-hero-sub { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 18px; }
  .pr-consensus { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .pr-con-box { background: var(--surface2); border-radius: var(--r-md); padding: 14px; text-align: center; border: 1px solid var(--border); }
  .pr-con-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin-bottom: 8px; }
  .pr-con-val { font-family: var(--mono); font-size: 22px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
  .pr-con-sub { font-size: 11px; color: var(--muted); }

  .pr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pr-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px; cursor: pointer; transition: all .18s;
  }
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
  .pr-ai-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--purple-dim); border: 1px solid rgba(167,139,250,.2);
    border-radius: 4px; padding: 2px 8px; font-size: 10px; font-weight: 700; color: var(--purple);
  }
  .pr-ai-tag i { font-size: 11px; }

  /* ── Responsive ── */
  @media (max-width:1200px) {
    .eco-layout { grid-template-columns: 1fr; }
    .eco-side { flex-direction: row; }
    .pr-grid { grid-template-columns: 1fr; }
    .fc-grid { grid-template-columns: repeat(2,1fr); }
  }
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
  @media (max-width:600px) {
    .in-main { padding: 16px; }
    .in-topbar { padding: 0 16px; }
  }
`;

/* ─── Data ───────────────────────────────────────────────────────────────────── */

const METRICS = [
  { label: 'News Tracked',    value: '2,841',  sub: '+124 today',        icon: 'ti-news',          bg: 'rgba(200,245,96,.12)',  col: '#c8f560' },
  { label: 'Events This Week',value: '18',     sub: '4 high-impact',     icon: 'ti-calendar-event',bg: 'rgba(96,165,250,.12)',  col: '#60a5fa' },
  { label: 'Active Forecasts',value: '37',     sub: 'Across 6 markets',  icon: 'ti-chart-arrows-vertical', bg: 'rgba(52,211,153,.12)', col: '#34d399' },
  { label: 'AI Predictions',  value: '91.3%',  sub: '30D accuracy rate', icon: 'ti-cpu',           bg: 'rgba(167,139,250,.12)', col: '#a78bfa' },
];

const ECO_HERO = {
  cat: 'Monetary Policy', badge: 'Breaking', badgeCls: 'red',
  title: 'Fed Holds Rates Steady — Signals Two Cuts in 2026 H2',
  body: 'The Federal Reserve left the federal funds rate unchanged at 5.25–5.50% for the fifth consecutive meeting, as policymakers wait for more evidence that inflation is sustainably returning to the 2% target. Chair Powell flagged improving labor market conditions and noted that the committee could begin easing "as conditions allow" in the second half of the year.',
  time: 'Today, 14:32 UTC', source: 'Federal Reserve', read: '4 min read',
  impacts: [
    { label: 'USD', dir: 'neutral', val: '—' },
    { label: 'Gold', dir: 'up', val: '+0.8%' },
    { label: 'S&P 500', dir: 'up', val: '+0.4%' },
    { label: 'BTC', dir: 'up', val: '+1.2%' },
  ],
};

const ECO_SIDE = [
  {
    cat: 'Inflation', badge: 'High Impact', badgeCls: 'amber',
    title: 'US CPI Falls to 2.9% — Lowest Since Early 2021',
    time: '2h ago', source: 'BLS',
  },
  {
    cat: 'Employment', badge: 'Medium Impact', badgeCls: 'blue',
    title: 'Initial Jobless Claims Drop to 205K; Labor Market Remains Resilient',
    time: '5h ago', source: 'Dept. of Labor',
  },
];

const ECO_INDICATORS = [
  { name: 'US CPI', val: '2.9%',   chg: '-0.2%', up: false },
  { name: 'Fed Rate', val: '5.25%', chg: '0.00%', up: null },
  { name: 'NFP',     val: '227K',   chg: '+18K',  up: true },
  { name: 'GDP YoY', val: '2.4%',   chg: '+0.3%', up: true },
];

const ECO_MORE = [
  { cat: 'Trade', title: 'US Trade Deficit Widens to $74.6B on Rising Imports', time: '7h ago', badge: 'Medium', badgeCls: 'blue' },
  { cat: 'Housing', title: 'Existing Home Sales Rise 3.2% MoM as Mortgage Rates Dip', time: '9h ago', badge: 'Low', badgeCls: 'muted' },
  { cat: 'Manufacturing', title: 'ISM Manufacturing PMI Returns to Expansion Territory at 50.3', time: '11h ago', badge: 'Medium', badgeCls: 'blue' },
];

const CAL_DAYS = [
  { name:'MON', num:19, dots:[], today:false },
  { name:'TUE', num:20, dots:['#f59e0b'], today:false },
  { name:'WED', num:21, dots:['#f87171','#60a5fa'], today:false },
  { name:'THU', num:22, dots:['#c8f560'], today:false },
  { name:'FRI', num:23, dots:['#f87171','#c8f560','#a78bfa'], today:true },
  { name:'SAT', num:24, dots:[], today:false },
  { name:'SUN', num:25, dots:['#60a5fa'], today:false },
];

const EVENTS = [
  {
    time: 'TODAY · 15:00 UTC', dotColor: '#f87171',
    title: 'FOMC Minutes Release',
    desc: 'Full minutes from the May FOMC meeting. Markets watching for any dissents or language shifts on rate path.',
    badge: 'High Impact', badgeCls: 'red', impact: 5,
    tags: ['USD', 'Bonds', 'Equities'],
  },
  {
    time: 'TODAY · 17:30 UTC', dotColor: '#f59e0b',
    title: 'ECB Monetary Policy Statement',
    desc: 'European Central Bank decision. Consensus expects a 25bp cut — the second of this cycle.',
    badge: 'High Impact', badgeCls: 'amber', impact: 4,
    tags: ['EUR/USD', 'DAX'],
  },
  {
    time: 'MON 26 · 12:30 UTC', dotColor: '#60a5fa',
    title: 'US Durable Goods Orders (Apr)',
    desc: 'Analysts expect a modest +0.4% MoM recovery after the March decline of -0.8%.',
    badge: 'Medium Impact', badgeCls: 'blue', impact: 3,
    tags: ['USD', 'Industrials'],
  },
  {
    time: 'TUE 27 · 14:00 UTC', dotColor: '#34d399',
    title: 'US Consumer Confidence (May)',
    desc: 'Conference Board survey. Prior reading: 97.0. Forecast: 99.5 amid easing inflation.',
    badge: 'Medium Impact', badgeCls: 'blue', impact: 2,
    tags: ['USD', 'Retail'],
  },
];

const FORECASTS = [
  {
    cat: 'Crypto', title: 'Bitcoin 90-Day Price Forecast',
    rangeLabel: 'Target range', rangeVal: '$72,000 – $85,000',
    gauge: 72, gaugeColor: '#c8f560',
    source: '12 analyst consensus', confidence: '72%', confidenceColor: '#c8f560',
    accentColor: '#c8f560',
  },
  {
    cat: 'Forex', title: 'EUR/USD 60-Day Outlook',
    rangeLabel: 'Target range', rangeVal: '1.0820 – 1.1100',
    gauge: 58, gaugeColor: '#60a5fa',
    source: '8 institutional banks', confidence: '58%', confidenceColor: '#60a5fa',
    accentColor: '#60a5fa',
  },
  {
    cat: 'Equities', title: 'S&P 500 Year-End Target',
    rangeLabel: 'Target range', rangeVal: '5,600 – 6,200',
    gauge: 65, gaugeColor: '#34d399',
    source: 'Wall St median forecast', confidence: '65%', confidenceColor: '#34d399',
    accentColor: '#34d399',
  },
];

const FC_TABLE = [
  { asset:'Gold (XAU/USD)', current:'$2,314',  q3:'$2,450 – $2,600', q4:'$2,380 – $2,550', trend:[3,5,4,7,6,8,7], dir:true  },
  { asset:'WTI Crude Oil',  current:'$79.40',   q3:'$75 – $85',       q4:'$70 – $82',       trend:[6,5,7,4,5,4,3], dir:false },
  { asset:'10Y US Treasury',current:'4.32%',    q3:'4.00 – 4.40%',    q4:'3.75 – 4.20%',    trend:[8,7,7,6,6,5,5], dir:false },
  { asset:'Nasdaq 100',     current:'19,240',   q3:'19,500 – 21,000', q4:'20,000 – 22,500', trend:[3,4,5,5,7,8,9], dir:true  },
];

const PREDICT_CONSENSUS = [
  { label: 'Bullish',  val: '61%', color: '#34d399' },
  { label: 'Neutral',  val: '22%', color: '#64748b' },
  { label: 'Bearish',  val: '17%', color: '#f87171' },
];

const PREDICTIONS = [
  {
    title: 'Bitcoin Halving Aftermath — Parabolic Rally by Q3 2026',
    src: 'TradeFlow AI Model v3.1',
    badge: 'AI Prediction', probability: 74, probColor: '#a78bfa',
    factors: [
      { icon: 'ti-trending-up', label: 'On-chain accumulation',       val: 'Bullish', color: '#34d399' },
      { icon: 'ti-coin',        label: 'Miner reserve drawdown',      val: 'Bullish', color: '#34d399' },
      { icon: 'ti-building-bank', label: 'Institutional ETF inflows', val: 'Neutral', color: '#64748b' },
      { icon: 'ti-chart-line',  label: 'Macro liquidity cycle',       val: 'Bullish', color: '#34d399' },
    ],
  },
  {
    title: 'Fed Rate Cut in September — 70% Probability Per Futures Market',
    src: 'CME FedWatch + TradeFlow Model',
    badge: 'Hybrid Signal', probability: 70, probColor: '#60a5fa',
    factors: [
      { icon: 'ti-arrow-down',  label: 'CPI trajectory',              val: 'Supports', color: '#34d399' },
      { icon: 'ti-users',       label: 'Labor market cooling',         val: 'Supports', color: '#34d399' },
      { icon: 'ti-globe',       label: 'Global growth slowdown',       val: 'Supports', color: '#34d399' },
      { icon: 'ti-alert-triangle', label: 'Sticky core services CPI', val: 'Risk',    color: '#f59e0b' },
    ],
  },
  {
    title: 'EUR/USD Parity Risk Returns if ECB Cuts Faster Than Fed',
    src: 'Macro Research Desk',
    badge: 'Risk Scenario', probability: 28, probColor: '#f87171',
    factors: [
      { icon: 'ti-arrow-down-right', label: 'ECB dovish pivot speed',   val: 'Bearish EUR', color: '#f87171' },
      { icon: 'ti-building-bank',    label: 'EU growth divergence',     val: 'Bearish EUR', color: '#f87171' },
      { icon: 'ti-trending-up',      label: 'USD safe-haven demand',    val: 'Bearish EUR', color: '#f87171' },
      { icon: 'ti-flame',            label: 'Geopolitical risk premium', val: 'Neutral',    color: '#64748b' },
    ],
  },
  {
    title: 'NVIDIA Reaches $1.2T Market Cap on AI Infrastructure Supercycle',
    src: 'Equity Quant Model',
    badge: 'AI Prediction', probability: 63, probColor: '#a78bfa',
    factors: [
      { icon: 'ti-cpu',             label: 'AI capex spending cycle',  val: 'Bullish', color: '#34d399' },
      { icon: 'ti-chart-bar',       label: 'Revenue guidance upside',  val: 'Bullish', color: '#34d399' },
      { icon: 'ti-shield',          label: 'Chip export restrictions', val: 'Risk',    color: '#f59e0b' },
      { icon: 'ti-code',            label: 'Competitive moat (CUDA)',  val: 'Bullish', color: '#34d399' },
    ],
  },
];

/* ─── Components ─────────────────────────────────────────────────────────────── */

function Sidebar({ open }) {
  const main = [
    { icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { icon: 'ti-copy',             label: 'Copy Trading' },
    { icon: 'ti-users',            label: 'Hire a Trader' },
    { icon: 'ti-chart-line',       label: 'Insights', active: true },
    { icon: 'ti-robot',            label: 'Marketplace', badge: 'NEW' },
  ];
  const acct = [
    { icon: 'ti-credit-card', label: 'Payments' },
    { icon: 'ti-user-circle', label: 'Profile' },
    { icon: 'ti-settings',    label: 'Settings' },
    { icon: 'ti-headset',     label: 'Support' },
  ];
  return (
    <div className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" /> Portfolio Value</div>
        <div className="in-sb-pill-val">$48,204</div>
        <div className="in-sb-pill-sub">↑ +$1,247 today</div>
      </div>
      <div className="in-sb-scroll">
        <div className="in-sb-section">Main</div>
        {main.map(({ icon, label, active, badge }) => (
          <a key={label} href="#" className={`in-sb-link${active ? ' active' : ''}`}>
            <i className={`ti ${icon}`} />
            {label}
            {badge && <span className="in-sb-badge">{badge}</span>}
          </a>
        ))}
        <div className="in-sb-section" style={{ marginTop: 8 }}>Account</div>
        {acct.map(({ icon, label }) => (
          <a key={label} href="#" className="in-sb-link">
            <i className={`ti ${icon}`} />{label}
          </a>
        ))}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">AK</div>
        <div>
          <div className="in-sb-user-name">Alex Kim</div>
          <div className="in-sb-user-role">Pro · Verified</div>
        </div>
      </div>
    </div>
  );
}

function Topbar({ onMenu }) {
  return (
    <div className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">Trade<span>Flow</span></div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: T.mono, fontSize: 12, color: T.nt, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: T.gn }}>▲</span> BTC $67,420
      </div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon"><i className="ti ti-bell" /><span className="in-notif-dot" /></div>
      <div className="in-tb-avatar">AK</div>
    </div>
  );
}

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

/* ──── Economic Panel ───────────────────────────────────────────── */
function EconomicPanel() {
  return (
    <div>
      {/* Key indicators */}
      <div className="eco-indicators">
        {ECO_INDICATORS.map(i => (
          <div key={i.name} className="eco-ind">
            <div className="eco-ind-name">{i.name}</div>
            <div className="eco-ind-val" style={{ color: i.up === true ? T.gn : i.up === false ? T.rd : T.gr }}>
              {i.val}
            </div>
            <div className="eco-ind-chg">
              {i.up !== null && (
                <i className={`ti ti-arrow-${i.up ? 'up' : 'down'}-right`}
                   style={{ fontSize: 12, color: i.up ? T.gn : T.rd }} />
              )}
              <span style={{ color: i.up === null ? T.nt : i.up ? T.gn : T.rd, fontFamily: T.mono, fontSize: 11, fontWeight: 600 }}>{i.chg}</span>
              <span style={{ color: T.nt, fontSize: 10, marginLeft: 2 }}>prev</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hero + side */}
      <div className="eco-layout">
        <div className="eco-hero">
          <div className="eco-hero-cat">
            <i className="ti ti-building-bank" style={{ fontSize: 13 }} />
            {ECO_HERO.cat}
            <span className={`in-badge in-badge-${ECO_HERO.badgeCls}`} style={{ marginLeft: 4 }}>{ECO_HERO.badge}</span>
          </div>
          <div className="eco-hero-title" dangerouslySetInnerHTML={{
            __html: ECO_HERO.title.replace('Two Cuts in 2026 H2', '<em>Two Cuts in 2026 H2</em>')
          }} />
          <div className="eco-hero-body">{ECO_HERO.body}</div>
          <div className="eco-hero-meta">
            <i className="ti ti-clock" style={{ fontSize: 13 }} />
            {ECO_HERO.time}
            <span style={{ color: T.br2 }}>·</span>
            {ECO_HERO.source}
            <span style={{ color: T.br2 }}>·</span>
            {ECO_HERO.read}
          </div>
          <div className="eco-hero-impact">
            <div className="eco-hero-impact-label">Market Impact</div>
            {ECO_HERO.impacts.map(im => (
              <div key={im.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginLeft: 14 }}>
                <span style={{ fontSize: 10, color: T.nt }}>{im.label}</span>
                <span style={{
                  fontFamily: T.mono, fontSize: 12, fontWeight: 700,
                  color: im.dir === 'up' ? T.gn : im.dir === 'down' ? T.rd : T.nt,
                }}>{im.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="eco-side">
          {ECO_SIDE.map(s => (
            <div key={s.title} className="eco-side-card">
              <div className="eco-side-cat">
                {s.cat}
                <span className={`in-badge in-badge-${s.badgeCls}`} style={{ marginLeft: 8 }}>{s.badge}</span>
              </div>
              <div className="eco-side-title">{s.title}</div>
              <div className="eco-side-meta">
                <i className="ti ti-clock" style={{ fontSize: 12 }} />{s.time}
                <span style={{ color: T.br2 }}>·</span>{s.source}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More headlines */}
      <div style={{ background: T.s, border: `1px solid ${T.br}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.br}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: T.serif, fontSize: 16 }}>More <em style={{ color: T.g, fontStyle: 'italic' }}>Economic</em> Headlines</div>
          <a href="#" className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-external-link" /> View All</a>
        </div>
        <table className="in-table">
          <thead>
            <tr><th>Category</th><th>Headline</th><th>Impact</th><th>Time</th></tr>
          </thead>
          <tbody>
            {ECO_MORE.map(r => (
              <tr key={r.title}>
                <td style={{ color: T.nt, fontSize: 11 }}>{r.cat}</td>
                <td style={{ fontWeight: 500 }}>{r.title}</td>
                <td><span className={`in-badge in-badge-${r.badgeCls}`}>{r.badge}</span></td>
                <td style={{ color: T.nt, fontFamily: T.mono, fontSize: 11 }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──── Events Panel ─────────────────────────────────────────────── */
function ImpactBar({ level }) {
  return (
    <div className="ev-impact-bar">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="ev-impact-seg" style={{
          background: i <= level
            ? (level >= 4 ? T.rd : level >= 3 ? T.am : T.bl)
            : T.br,
        }} />
      ))}
    </div>
  );
}

function EventsPanel() {
  return (
    <div>
      <div className="ev-calendar">
        {CAL_DAYS.map(d => (
          <div key={d.num} className={`ev-cal-day${d.today ? ' today' : ''}`}>
            <div className="ev-cal-day-name">{d.name}</div>
            <div className="ev-cal-day-num">{d.num}</div>
            <div className="ev-cal-dots">
              {d.dots.map((c, i) => <div key={i} className="ev-cal-dot" style={{ background: c }} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="ev-timeline">
        {EVENTS.map((ev, idx) => (
          <div key={idx} className="ev-item">
            <div className="ev-dot" style={{ background: ev.dotColor }} />
            <div className="ev-card">
              <div>
                <div className="ev-card-time">{ev.time}</div>
                <div className="ev-card-title">{ev.title}</div>
                <div className="ev-card-desc">{ev.desc}</div>
                <div className="ev-tags">
                  {ev.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px',
                      background: T.s2, border: `1px solid ${T.br}`,
                      borderRadius: 4, color: T.nt,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="ev-card-right">
                <span className={`in-badge in-badge-${ev.badgeCls}`}>{ev.badge}</span>
                <ImpactBar level={ev.impact} />
                <span style={{ fontSize: 10, color: T.nt }}>Impact</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──── Forecast Panel ───────────────────────────────────────────── */
function Sparkline({ bars, dir }) {
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

function ForecastPanel() {
  return (
    <div>
      <div className="fc-grid">
        {FORECASTS.map(f => (
          <div key={f.title} className="fc-card">
            <div className="fc-card-accent-line" style={{ background: f.accentColor }} />
            <div className="fc-card-cat">{f.cat}</div>
            <div className="fc-card-title">{f.title}</div>
            <div className="fc-card-range">
              <span className="fc-card-range-label">{f.rangeLabel}</span>
              <span className="fc-card-range-vals" style={{ color: f.gaugeColor }}>{f.rangeVal}</span>
            </div>
            <div className="fc-gauge">
              <div className="fc-gauge-track">
                <div className="fc-gauge-fill" style={{ width: `${f.gauge}%`, background: f.gaugeColor }} />
              </div>
              <div className="fc-gauge-labels"><span>Bearish</span><span>Bullish</span></div>
            </div>
            <div className="fc-card-footer">
              <span className="fc-card-source"><i className="ti ti-users" style={{ fontSize: 11, marginRight: 4 }} />{f.source}</span>
              <span className="fc-card-confidence" style={{ color: f.confidenceColor }}>
                {f.confidence} confidence
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="fc-table-wrap">
        <div className="fc-table-head">
          <div className="fc-table-title"><em style={{ color: T.g, fontStyle: 'italic' }}>Asset</em> Forecast Table — Q3 / Q4 2026</div>
          <a href="#" className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-download" /> Export</a>
        </div>
        <table className="in-table">
          <thead>
            <tr>
              <th>Asset</th><th>Current</th><th>Q3 2026 Range</th><th>Q4 2026 Range</th><th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {FC_TABLE.map(r => (
              <tr key={r.asset}>
                <td style={{ fontWeight: 600 }}>{r.asset}</td>
                <td style={{ fontFamily: T.mono, color: T.gr }}>{r.current}</td>
                <td style={{ fontFamily: T.mono, fontSize: 11, color: T.bl }}>{r.q3}</td>
                <td style={{ fontFamily: T.mono, fontSize: 11, color: T.nt }}>{r.q4}</td>
                <td><Sparkline bars={r.trend} dir={r.dir} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──── Predict Panel ────────────────────────────────────────────── */
function PredictPanel() {
  return (
    <div>
      {/* Consensus hero */}
      <div className="pr-hero">
        <div className="pr-hero-label">
          <i className="ti ti-cpu" style={{ fontSize: 13 }} />
          AI Market Consensus · Updated 2h ago
        </div>
        <div className="pr-hero-title">Global Market Sentiment — <em style={{ color: T.pr, fontStyle: 'italic' }}>Moderately Bullish</em></div>
        <div className="pr-hero-sub">
          TradeFlow's ensemble model synthesises 340+ data sources — macro indicators, on-chain signals,
          options flow, and sentiment feeds — to produce a real-time market consensus.
        </div>
        <div className="pr-consensus">
          {PREDICT_CONSENSUS.map(c => (
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
        {PREDICTIONS.map((p, idx) => (
          <div key={idx} className="pr-card">
            <div className="pr-card-head">
              <div>
                <div className="pr-card-title">{p.title}</div>
                <div className="pr-card-src" style={{ marginTop: 4 }}>
                  <i className="ti ti-database" style={{ fontSize: 12, marginRight: 4 }} />{p.src}
                </div>
              </div>
              <div className="pr-ai-tag" style={{ marginLeft: 12, flexShrink: 0 }}>
                <i className="ti ti-sparkles" />{p.badge}
              </div>
            </div>

            <div className="pr-meter">
              <div className="pr-meter-label">
                <span>Probability</span>
                <span style={{ fontFamily: T.mono, color: p.probColor }}>{p.probability}%</span>
              </div>
              <div className="pr-meter-track">
                <div className="pr-meter-fill" style={{ width: `${p.probability}%`, background: p.probColor }} />
              </div>
            </div>

            <div className="pr-factors">
              {p.factors.map((f, i) => (
                <div key={i} className="pr-factor">
                  <i className={`ti ${f.icon}`} style={{ color: f.color }} />
                  <span style={{ color: T.nt, fontSize: 12 }}>{f.label}</span>
                  <span className="pr-factor-val" style={{ color: f.color }}>{f.val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function Insights() {
  const [tab, setTab]         = useState('economic');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const TABS = [
    { key: 'economic', label: 'Economic News',  icon: 'ti-building-bank' },
    { key: 'events',   label: 'Event News',     icon: 'ti-calendar-event' },
    { key: 'forecast', label: 'Forecast News',  icon: 'ti-chart-arrows-vertical' },
    { key: 'predict',  label: 'Predict News',   icon: 'ti-cpu' },
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
        <Sidebar open={sidebarOpen} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} />

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
                <a href="#" className="in-btn in-btn-ghost in-btn-sm">
                  <i className="ti ti-bell" /> Alerts
                </a>
                <a href="#" className="in-btn in-btn-accent in-btn-sm">
                  <i className="ti ti-refresh" /> Refresh
                </a>
              </div>
            </div>

            {/* Metrics */}
            <div className="in-metrics">
              {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
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
                <select className="in-select">
                  <option>All Markets</option>
                  <option>Crypto</option>
                  <option>Forex</option>
                  <option>Equities</option>
                </select>
                <select className="in-select">
                  <option>All Impact</option>
                  <option>High Impact</option>
                  <option>Medium Impact</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {tab === 'economic' && <EconomicPanel />}
            {tab === 'events'   && <EventsPanel />}
            {tab === 'forecast' && <ForecastPanel />}
            {tab === 'predict'  && <PredictPanel />}
          </main>
        </div>
      </div>
    </>
  );
}