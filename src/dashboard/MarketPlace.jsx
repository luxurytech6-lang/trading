import React, { useState, useEffect, useCallback, useRef } from 'react';
import supabase from "../supabase";

/* ─── Design tokens (matches CopyTrading) ───────────────────────────────────── */
const T = {
  bg:  '#080b10', s:   '#0e1219', s2:  '#141922', br:  '#1e2535', br2: '#2a3347',
  gr:  '#e2e8f0', nt:  '#64748b', g:   '#c8f560', gd:  'rgba(200,245,96,.12)',
  bl:  '#60a5fa', rd:  '#f87171', gn:  '#34d399',  pr:  '#a78bfa',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── Default user_settings (matches DB defaults) ──────────────────────────── */
const DEFAULT_SETTINGS = {
  theme:                'dark',
  accent_color:         '#c8f560',
  layout_density:       'comfortable',
  chart_type:           'candle',
  show_volume:          true,
  show_extended_hours:  false,
  show_grid_lines:      true,
  profile_public:       true,
  show_watchlist:       false,
  show_activity:        true,
  show_followed_traders:false,
  appear_in_search:     true,
  usage_analytics:      true,
  personalised_feed:    true,
  marketing_emails:     false,
};

/* ─── Resolve system theme ──────────────────────────────────────────────────── */
function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

/* ─── Build :root CSS vars from user_settings ────────────────────────────────
   Light theme maps to a slate/white palette; dark keeps the existing dark palette.
   accent_color drives --accent and all derived accent-* variables.
   layout_density maps to spacing/padding adjustments.             ─────────── */
function buildThemeVars(settings) {
  const s       = { ...DEFAULT_SETTINGS, ...settings };
  const theme   = resolveTheme(s.theme);
  const accent  = s.accent_color;

  // Parse accent hex → r,g,b for rgba derivations
  const hex2rgb = h => {
    const c = h.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return [r, g, b];
  };
  const [ar, ag, ab] = hex2rgb(accent);

  // Density → sidebar width + main padding
  const densityMap = {
    compact:     { sbW: '220px', mainPad: '16px 20px 32px', metricPad: '12px 16px', cardPad: '14px', gap: '10px' },
    comfortable: { sbW: '256px', mainPad: '24px 28px 40px', metricPad: '18px 20px', cardPad: '18px', gap: '14px' },
    spacious:    { sbW: '280px', mainPad: '32px 36px 56px', metricPad: '22px 24px', cardPad: '24px', gap: '18px' },
  };
  const d = densityMap[s.layout_density] || densityMap.comfortable;

  const dark = {
    '--bg':         '#080b10',
    '--surface':    '#0e1219',
    '--surface2':   '#141922',
    '--border':     '#1e2535',
    '--border2':    '#2a3347',
    '--text':       '#e2e8f0',
    '--muted':      '#64748b',
    '--faint':      '#374151',
    '--input-bg':   '#141922',
  };
  const light = {
    '--bg':         '#f0f4f8',
    '--surface':    '#ffffff',
    '--surface2':   '#f8fafc',
    '--border':     '#e2e8f0',
    '--border2':    '#cbd5e1',
    '--text':       '#0f172a',
    '--muted':      '#64748b',
    '--faint':      '#94a3b8',
    '--input-bg':   '#f1f5f9',
  };

  const palette = theme === 'light' ? light : dark;

  return {
    ...palette,
    '--accent':       accent,
    '--accent-dim':   `rgba(${ar},${ag},${ab},.12)`,
    '--accent-glow':  `rgba(${ar},${ag},${ab},.06)`,
    '--accent-rgb':   `${ar},${ag},${ab}`,
    '--green':        '#34d399',
    '--green-dim':    'rgba(52,211,153,.12)',
    '--red':          '#f87171',
    '--red-dim':      'rgba(248,113,113,.12)',
    '--blue':         '#60a5fa',
    '--purple':       '#a78bfa',
    '--sidebar-w':    d.sbW,
    '--topbar-h':     '60px',
    '--density-pad':  d.mainPad,
    '--metric-pad':   d.metricPad,
    '--card-pad':     d.cardPad,
    '--grid-gap':     d.gap,
    '--sans':         "'Space Grotesk', sans-serif",
    '--serif':        "'Instrument Serif', serif",
    '--mono':         "'JetBrains Mono', monospace",
    '--r-sm': '8px', '--r-md': '12px', '--r-lg': '16px',
  };
}

/* ─── Inject/update :root CSS vars ─────────────────────────────────────────── */
function applyThemeVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 14px; }

  :root {
    /* All values injected dynamically via applyThemeVars() from user_settings */
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
    --accent-rgb: 200,245,96;
    --green:      #34d399;
    --green-dim:  rgba(52,211,153,.12);
    --red:        #f87171;
    --red-dim:    rgba(248,113,113,.12);
    --blue:       #60a5fa;
    --purple:     #a78bfa;
    --sidebar-w:  256px;
    --topbar-h:   60px;
    --density-pad:  24px 28px 40px;
    --metric-pad:   18px 20px;
    --card-pad:     18px;
    --grid-gap:     14px;
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
    border: 1px solid rgba(var(--accent-rgb),.18);
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
    box-shadow: 0 0 12px rgba(var(--accent-rgb),.3);
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
    cursor: pointer; box-shadow: 0 0 10px rgba(var(--accent-rgb),.25);
  }
  .mp-hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
  }
  .mp-hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; }

  /* ── Main ── */
  .mp-main {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: var(--density-pad);
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
  .mp-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(var(--accent-rgb),.3); }
  .mp-btn-ghost {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-size: 12px; padding: 7px 14px;
  }
  .mp-btn-ghost:hover { border-color: var(--border2); }

  /* ── Metrics ── */
  .mp-metrics {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--grid-gap); margin-bottom: 20px;
  }
  .mp-metric {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: var(--metric-pad);
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
    background: var(--input-bg, var(--surface2)); border: 1px solid var(--border);
    color: var(--text); border-radius: var(--r-sm); padding: 7px 10px;
    font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none;
    transition: border-color .15s;
  }
  .mp-select:hover { border-color: var(--border2); }

  /* ── Cards grid ── */
  .mp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); }
  .mp-grid-1 { display: grid; gap: var(--grid-gap); }

  /* ── Item Card ── */
  .mp-item-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: var(--card-pad); cursor: pointer;
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
  /* When show_grid_lines is false, hide column separators */
  .mp-table.no-grid-lines td,
  .mp-table.no-grid-lines th { border-bottom: none; }
  .mp-table.no-grid-lines tr:last-child td { border-bottom: none; }
  .mp-table.no-grid-lines tbody tr { border-bottom: 1px solid var(--border); }
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
    width: 100%; background: var(--input-bg, var(--surface2)); border: 1px solid var(--border);
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

/* ─── All data comes from Supabase — no hardcoded constants ── */

/* ─── Components ─────────────────────────────────────────────────────────────── */

function Sidebar({ open, user, onLogout }) {
  const initials    = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '??';
  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Loading…';
  const planLabel   = user ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} · ${user.is_verified ? 'Verified' : 'Unverified'}` : '';
  const balance     = user?.balance ?? 0;
  const balStr      = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const mainLinks = [
    { href:'/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { href:'/copy-trading', icon: 'ti-copy',             label: 'Copy Trading' },
    { href:'/hire-trader', icon: 'ti-users',            label: 'Hire a Trader' },
    { href:'/insights', icon: 'ti-chart-line',       label: 'Insights' },
    { href:'/market-place', icon: 'ti-robot',            label: 'Marketplace', active: true, badge: 'NEW' },
  ];
  const acctLinks = [
    { href:'/payment', icon: 'ti-credit-card', label: 'Payments' },
    { href:'/profile', icon: 'ti-user-circle', label: 'Profile' },
    { href:'/settings', icon: 'ti-settings',    label: 'Settings' },
    { href:'/support', icon: 'ti-headset',     label: 'Support' },
  ];

  return (
    <div className={`mp-sidebar${open ? ' open' : ''}`}>
      <div className="mp-brand">
        <div className="mp-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="mp-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="mp-sb-pill">
        <div className="mp-sb-pill-label"><span className="mp-live-dot" /> Portfolio Value</div>
        <div className="mp-sb-pill-val">${balStr}</div>
        <div className="mp-sb-pill-sub">Available balance</div>
      </div>
      <div className="mp-sb-scroll">
        <div className="mp-sb-section">Main</div>
        {mainLinks.map(({ href, icon, label, active, badge }) => (
          <a key={label} href={href} className={`mp-sb-link${active ? ' active' : ''}`}>
            <i className={`ti ${icon}`} />{label}
            {badge && <span className="mp-sb-badge">{badge}</span>}
          </a>
        ))}
        <div className="mp-sb-section" style={{ marginTop: 8 }}>Account</div>
        {acctLinks.map(({ href, icon, label }) => (
          <a key={label} href={href} className="mp-sb-link"><i className={`ti ${icon}`} />{label}</a>
        ))}
      </div>
      <div className="mp-sb-user">
        <div className="mp-sb-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mp-sb-user-name">{displayName}</div>
          <div className="mp-sb-user-role">{planLabel}</div>
        </div>
        <button onClick={onLogout} title="Sign out"
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0 }}>
          <i className="ti ti-logout" />
        </button>
      </div>
    </div>
  );
}

function Topbar({ onMenu, user }) {
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '??';
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="mp-topbar">
      <div className="mp-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="mp-topbar-title">{greeting}, <span>{user?.first_name || '…'}</span></div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: T.mono, fontSize: 12, color: T.nt, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: T.gn }}>▲</span> BTC $67,420
      </div>
      <div className="mp-topbar-icon"><i className="ti ti-search" /></div>
      <div className="mp-topbar-icon"><a href='/notification'><i className="ti ti-bell" /><span className="mp-notif-dot" /></a></div>
      <div className="mp-topbar-avatar">{initials}</div>
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

/* ── Item cards — driven entirely by the DB row ── */
function BotCard({ item, onActivate }) {
  const [hovered, setHovered] = useState(false);
  const roi      = item.roi_12m_pct != null ? `+${parseFloat(item.roi_12m_pct).toFixed(1)}%` : '—';
  const winRate  = item.win_rate_pct != null ? `${parseFloat(item.win_rate_pct).toFixed(1)}%` : '—';
  const trades   = item.total_trades != null ? item.total_trades.toLocaleString() : '—';
  return (
    <div className="mp-item-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.badge_label && (
        <span className={`mp-badge mp-badge-${item.badge_type || 'gold'}`}
          style={{ position: 'absolute', top: 14, right: 14 }}>
          {item.badge_label}
        </span>
      )}
      <div className="mp-item-card-top">
        <div className="mp-item-card-left">
          <div className="mp-item-icon" style={{ background: item.color_hex || T.g }}>
            <i className={`ti ${item.icon_class || 'ti-robot'}`} />
          </div>
          <div>
            <div className="mp-item-name">{item.name}</div>
            <div className="mp-item-tag">{item.tag}</div>
          </div>
        </div>
      </div>
      <p className="mp-item-desc">{item.description}</p>
      <div className="mp-item-stats">
        <div><div className="mp-stat-val" style={{ color: T.gn }}>{roi}</div><div className="mp-stat-lbl">12m ROI</div></div>
        <div><div className="mp-stat-val">{trades}</div><div className="mp-stat-lbl">Trades</div></div>
        <div><div className="mp-stat-val">{winRate}</div><div className="mp-stat-lbl">Win Rate</div></div>
      </div>
      <div className="mp-markets">
        {(item.markets || []).map(m => <span key={m} className="mp-market-tag">{m}</span>)}
      </div>
      <div className="mp-item-footer">
        <div>
          <span className="mp-price">${item.price_monthly}</span>
          <span className="mp-per">/month</span>
        </div>
        <button className="mp-btn mp-btn-accent mp-btn-sm" onClick={() => onActivate(item, 'bot')}>
          <i className="ti ti-player-play" /> Activate
        </button>
      </div>
    </div>
  );
}

function SignalCard({ item, onSubscribe }) {
  const roi      = item.roi_12m_pct != null ? `+${parseFloat(item.roi_12m_pct).toFixed(1)}%` : '—';
  const accuracy = item.accuracy_pct != null ? `${parseFloat(item.accuracy_pct).toFixed(1)}%` : '—';
  const subs     = item.subscriber_count != null ? `${item.subscriber_count.toLocaleString()}+` : '—';
  return (
    <div className="mp-item-card">
      {item.badge_label && (
        <span className={`mp-badge mp-badge-${item.badge_type || 'blue'}`}
          style={{ position: 'absolute', top: 14, right: 14 }}>
          {item.badge_label}
        </span>
      )}
      <div className="mp-item-card-top">
        <div className="mp-item-card-left">
          <div className="mp-item-icon" style={{ background: item.color_hex || T.bl }}>
            <i className={`ti ${item.icon_class || 'ti-broadcast'}`} />
          </div>
          <div>
            <div className="mp-item-name">{item.name}</div>
            <div className="mp-item-tag">{item.tag}</div>
          </div>
        </div>
      </div>
      <p className="mp-item-desc">{item.description}</p>
      <div className="mp-item-stats">
        <div><div className="mp-stat-val" style={{ color: T.gn }}>{roi}</div><div className="mp-stat-lbl">12m ROI</div></div>
        <div><div className="mp-stat-val">{subs}</div><div className="mp-stat-lbl">Subscribers</div></div>
        <div><div className="mp-stat-val">{accuracy}</div><div className="mp-stat-lbl">Accuracy</div></div>
      </div>
      <div className="mp-markets">
        {(item.markets || []).map(m => <span key={m} className="mp-market-tag">{m}</span>)}
      </div>
      {item.delivery_method && (
        <div className="mp-delivery"><i className="ti ti-send" /> Delivered via {item.delivery_method}</div>
      )}
      <div className="mp-item-footer">
        <div>
          <span className="mp-price">${item.price_monthly}</span>
          <span className="mp-per">/month</span>
        </div>
        <button className="mp-btn mp-btn-accent mp-btn-sm" onClick={() => onSubscribe(item, 'signal')}>
          <i className="ti ti-bell-ringing" /> Subscribe
        </button>
      </div>
    </div>
  );
}

/* ── Active Subscriptions — fetched from marketplace_subscriptions JOIN marketplace_items ── */
function ActiveSubscriptions({ userId, refreshKey, userSettings = DEFAULT_SETTINGS }) {
  const [subs,    setSubs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true); setErr('');
      const { data, error } = await supabase
        .from('marketplace_subscriptions')
        .select(`
          id, status, pnl_30d, renews_at, started_at,
          marketplace_items (
            id, name, type, price_monthly
          )
        `)
        .eq('user_id', userId)
        .in('status', ['active', 'paused'])
        .order('started_at', { ascending: false });

      setLoading(false);
      if (error) { setErr(error.message); return; }
      setSubs(data || []);
    };
    load();
  }, [userId, refreshKey]);

  const fmtDate = ts => ts
    ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';

  return (
    <div className="mp-active-row">
      <div className="mp-active-head">
        <div className="mp-active-title"><em style={{ fontStyle: 'italic', color: T.g }}>Active</em> Subscriptions</div>
        <a href="#" className="mp-btn mp-btn-ghost mp-btn-sm"><i className="ti ti-settings" /> Manage All</a>
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: T.nt, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <i className="ti ti-loader-2" style={{ fontSize: 18 }} /> Loading subscriptions…
        </div>
      ) : err ? (
        <div style={{ padding: '14px 20px', color: T.rd, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-alert-circle" /> {err}
        </div>
      ) : subs.length === 0 ? (
        <div style={{ padding: '28px', textAlign: 'center', color: T.nt, fontSize: 13 }}>
          No active subscriptions yet. Browse bots and signal plans below.
        </div>
      ) : (
        <table className={`mp-table${userSettings.show_grid_lines === false ? ' no-grid-lines' : ''}`}>
          <thead>
            <tr>
              <th>Name</th><th>Type</th><th>Status</th>
              <th>P&amp;L (30D)</th><th>Renews</th><th>Price</th><th></th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => {
              const item    = s.marketplace_items;
              const isBot   = item?.type === 'bot';
              const pnl     = parseFloat(s.pnl_30d || 0);
              const pnlStr  = pnl !== 0 ? (pnl > 0 ? `+$${pnl.toLocaleString()}` : `-$${Math.abs(pnl).toLocaleString()}`) : '—';
              const pnlPos  = pnl >= 0;
              const statusCls = s.status === 'active' ? (isBot ? 'green' : 'blue') : 'amber';
              const statusLbl = s.status === 'active' ? (isBot ? 'Running' : 'Active') : 'Paused';
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{item?.name || '—'}</td>
                  <td><span className={`mp-badge mp-badge-${isBot ? 'gold' : 'blue'}`}>{isBot ? 'Bot' : 'Signal'}</span></td>
                  <td><span className={`mp-badge mp-badge-${statusCls}`}>{statusLbl}</span></td>
                  <td style={{ fontFamily: T.mono, color: pnlPos ? T.gn : T.rd }}>{pnlStr}</td>
                  <td style={{ color: T.nt }}>{fmtDate(s.renews_at)}</td>
                  <td style={{ fontFamily: T.mono }}>${item?.price_monthly}/mo</td>
                  <td><button className="mp-table-manage-btn">Manage</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Subscribe / Activate modal — 3-step: confirm → payment → success ── */
function SubscribeModal({ item, type, onClose, userId, onSuccess }) {
  const [step,           setStep]           = useState(1);
  const [saving,         setSaving]         = useState(false);
  const [saveErr,        setSaveErr]        = useState('');

  // Platform crypto deposit wallets
  const [cryptoWallets,  setCryptoWallets]  = useState([]);
  const [cryptoLoading,  setCryptoLoading]  = useState(false);

  // Payment UI
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [copied,         setCopied]         = useState(false);
  const [paying,         setPaying]         = useState(false);
  const [payErr,         setPayErr]         = useState('');

  // Success receipt
  const [receipt,        setReceipt]        = useState(null);

  const isBot       = type === 'bot';
  const annualPrice = parseFloat(item.price_monthly || 0) * 12;

  const roi      = item.roi_12m_pct  != null ? `+${parseFloat(item.roi_12m_pct).toFixed(1)}%`  : '—';
  const winRate  = item.win_rate_pct != null ? `${parseFloat(item.win_rate_pct).toFixed(1)}%`  : '—';
  const trades   = item.total_trades != null ? item.total_trades.toLocaleString()               : '—';
  const accuracy = item.accuracy_pct != null ? `${parseFloat(item.accuracy_pct).toFixed(1)}%`  : '—';
  const subs     = item.subscriber_count != null ? `${item.subscriber_count.toLocaleString()}+` : '—';

  const stats = isBot
    ? [{ label: '12m ROI', val: roi, color: T.gn }, { label: 'Trades', val: trades, color: T.gr }, { label: 'Win Rate', val: winRate, color: T.gr }]
    : [{ label: '12m ROI', val: roi, color: T.gn }, { label: 'Subscribers', val: subs, color: T.gr }, { label: 'Accuracy', val: accuracy, color: T.gr }];

  /* ── Step 1 → 2: check existing sub, load wallet + crypto options ── */
  const handleConfirm = async () => {
    if (!userId) { setSaveErr('You must be logged in to subscribe.'); return; }
    setSaving(true); setSaveErr('');

    const { data: existing } = await supabase
      .from('marketplace_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', item.id)
      .in('status', ['active', 'paused'])
      .maybeSingle();

    if (existing) {
      setSaveErr('You already have an active subscription for this item.');
      setSaving(false);
      return;
    }
    setSaving(false);

    // Fetch platform crypto deposit addresses only
    setCryptoLoading(true);
    const { data: crypto } = await supabase
      .from('platform_crypto_wallets')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false });
    setCryptoLoading(false);

    setCryptoWallets(crypto || []);
    const def = (crypto || []).find(c => c.is_default) || (crypto || [])[0];
    if (def) setSelectedCrypto(def);
    setStep(2);
  };

  /* ── Crypto pay: record pending tx, create sub ── */
  const handleCryptoPay = async () => {
    if (!selectedCrypto) return;
    setPaying(true); setPayErr('');

    await supabase.from('transactions').insert({
      user_id:     userId,
      type:        'marketplace_purchase',
      amount:      -annualPrice,
      currency:    'USD',
      description: `Annual ${isBot ? 'bot' : 'signal'} plan: ${item.name} — awaiting ${selectedCrypto.symbol} deposit`,
      status:      'pending',
    });

    await _createSub();
    setReceipt({ method: selectedCrypto.symbol, amount: `$${annualPrice.toFixed(2)} equiv.`, crypto: selectedCrypto });
    setPaying(false);
    onSuccess();
    setStep(3);
  };

  /* ── Shared: insert marketplace_subscriptions row ── */
  const _createSub = async () => {
    const renewsAt = new Date();
    renewsAt.setFullYear(renewsAt.getFullYear() + 1);
    await supabase.from('marketplace_subscriptions').insert({
      user_id:   userId,
      item_id:   item.id,
      status:    'active',
      pnl_30d:   0,
      renews_at: renewsAt.toISOString(),
    });
  };

  const copyAddress = () => {
    if (!selectedCrypto?.address) return;
    navigator.clipboard.writeText(selectedCrypto.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };



  /* ── Step indicator shared ── */
  const StepBar = ({ active }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: active === 1 ? T.g : T.gn, color: '#000', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {active > 1 ? <i className="ti ti-check" style={{ fontSize: 11 }} /> : '1'}
        </div>
        <span style={{ fontSize: 11, fontWeight: active === 1 ? 700 : 400, color: active === 1 ? T.g : T.nt }}>Confirm</span>
      </div>
      <div style={{ flex: 1, height: 1, background: active > 1 ? T.g : T.br }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: active === 2 ? T.g : active > 2 ? T.gn : T.br, color: active >= 2 ? '#000' : T.nt, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {active > 2 ? <i className="ti ti-check" style={{ fontSize: 11 }} /> : '2'}
        </div>
        <span style={{ fontSize: 11, fontWeight: active === 2 ? 700 : 400, color: active === 2 ? T.g : T.nt }}>Payment</span>
      </div>
    </div>
  );

  return (
    <div className="mp-modal-overlay" onClick={onClose}>
      <div className="mp-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <button className="mp-modal-close" onClick={onClose}>✕</button>

        {/* ════════════════ STEP 1: Plan Confirmation ════════════════ */}
        {step === 1 && (
          <>
            <StepBar active={1} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div className="mp-item-icon" style={{ background: item.color_hex || T.g, width: 50, height: 50, borderRadius: 13 }}>
                <i className={`ti ${item.icon_class || 'ti-robot'}`} style={{ fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: T.nt }}>{item.tag}</span>
                  {item.badge_label && <span className={`mp-badge mp-badge-${item.badge_type || 'gold'}`}>{item.badge_label}</span>}
                </div>
              </div>
            </div>

            <div className="mp-modal-stats">
              {stats.map(({ label, val, color }) => (
                <div key={label}>
                  <div className="mp-modal-stat-val" style={{ color }}>{val}</div>
                  <div className="mp-modal-stat-lbl">{label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: T.nt, marginBottom: 20, lineHeight: 1.6, padding: '10px 12px', background: T.s2, borderRadius: 8 }}>
              {item.description}
            </div>

            <div className="mp-order-summary">
              <div className="mp-order-row">
                <span className="mp-order-row-label">{isBot ? 'Bot plan' : 'Signal plan'}</span>
                <span>{item.name}</span>
              </div>
              <div className="mp-order-row">
                <span className="mp-order-row-label">Billing</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Annual
                  <span style={{ fontSize: 10, background: 'rgba(200,245,96,.15)', color: T.g, padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>1 YEAR</span>
                </span>
              </div>
              {!isBot && item.delivery_method && (
                <div className="mp-order-row">
                  <span className="mp-order-row-label">Delivery</span><span>{item.delivery_method}</span>
                </div>
              )}
              <div className="mp-order-row" style={{ opacity: .65 }}>
                <span className="mp-order-row-label">Monthly rate</span>
                <span style={{ fontFamily: T.mono }}>${parseFloat(item.price_monthly).toFixed(2)}/mo</span>
              </div>
              <div className="mp-order-row" style={{ opacity: .65 }}>
                <span className="mp-order-row-label">× 12 months</span>
                <span style={{ fontFamily: T.mono }}>= ${annualPrice.toFixed(2)}</span>
              </div>
              <div className="mp-order-total">
                <span>Annual total</span>
                <span style={{ color: T.g, fontFamily: T.mono }}>${annualPrice.toFixed(2)}</span>
              </div>
            </div>

            {saveErr && (
              <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: T.rd, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-alert-circle" /> {saveErr}
              </div>
            )}
            <div className="mp-disclaimer">
              <i className="ti ti-info-circle" style={{ color: T.g, fontSize: 13, verticalAlign: -2, marginRight: 5 }} />
              {isBot
                ? 'Automated bots involve risk. Past performance does not guarantee future results.'
                : 'Signal accuracy is historical and does not guarantee future results.'}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="mp-btn mp-btn-ghost mp-btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="mp-btn mp-btn-accent mp-btn-sm"
                style={{ flex: 1, padding: '10px 0', fontWeight: 700, fontSize: 13 }}
                onClick={handleConfirm} disabled={saving}>
                {saving
                  ? <><i className="ti ti-loader-2" style={{ fontSize: 14 }} /> Checking…</>
                  : isBot ? 'Confirm & Activate →' : 'Confirm & Subscribe →'}
              </button>
            </div>
          </>
        )}

        {/* ════════════════ STEP 2: Payment ════════════════ */}
        {step === 2 && (
          <>
            <StepBar active={2} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(200,245,96,.12)', border: '1px solid rgba(200,245,96,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-currency-bitcoin" style={{ fontSize: 18, color: T.g }} />
              </div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 600 }}>Crypto Deposit</div>
                <div style={{ fontSize: 11, color: T.nt, marginTop: 2 }}>
                  Send <span style={{ fontFamily: T.mono, color: T.g, fontWeight: 700 }}>${annualPrice.toFixed(2)}</span> equivalent to activate your 1-year {isBot ? 'bot' : 'signal'} plan
                </div>
              </div>
            </div>

            {/* Crypto coin selector */}
            <>
              <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.nt, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .8 }}>Select coin</div>
                  {cryptoLoading ? (
                    <div style={{ color: T.nt, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><i className="ti ti-loader-2" /> Loading…</div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {cryptoWallets.map(cw => {
                        const active = selectedCrypto?.id === cw.id;
                        return (
                          <button key={cw.id}
                            onClick={() => setSelectedCrypto(cw)}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 9,
                              background: active ? `${cw.color}22` : T.s2,
                              border: `1px solid ${active ? cw.color : T.br}`,
                              cursor: 'pointer', transition: 'all .15s', fontFamily: T.sans }}>
                            <i className={`ti ${cw.icon}`} style={{ fontSize: 16, color: cw.color }} />
                            <div style={{ textAlign: 'left' }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: active ? cw.color : T.gr }}>{cw.symbol}</div>
                              <div style={{ fontSize: 10, color: T.nt }}>{cw.name}</div>
                            </div>
                          </button>
                        );
                      })}
                      {cryptoWallets.length === 0 && (
                        <div style={{ fontSize: 12, color: T.nt }}>No crypto wallets configured.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected crypto deposit details */}
                {selectedCrypto && (
                  <div style={{ background: T.s2, border: `1px solid ${T.br}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${T.br}` }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${selectedCrypto.color}22`, border: `1px solid ${selectedCrypto.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`ti ${selectedCrypto.icon}`} style={{ fontSize: 18, color: selectedCrypto.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.gr }}>{selectedCrypto.name}</div>
                        <div style={{ fontSize: 11, color: T.nt }}>{selectedCrypto.network}</div>
                      </div>
                      {selectedCrypto.is_default && (
                        <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: 'rgba(200,245,96,.12)', color: T.g, padding: '2px 7px', borderRadius: 4, border: '1px solid rgba(200,245,96,.2)' }}>DEFAULT</span>
                      )}
                    </div>

                    <div style={{ fontSize: 10, fontWeight: 700, color: T.nt, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Deposit Address</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bg, borderRadius: 8, border: `1px solid ${T.br}`, padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.gr, wordBreak: 'break-all', lineHeight: 1.5 }}>
                        {selectedCrypto.address}
                      </div>
                      <button
                        onClick={copyAddress}
                        style={{ flexShrink: 0, background: copied ? 'rgba(52,211,153,.15)' : T.s2, border: `1px solid ${copied ? T.gn : T.br}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: copied ? T.gn : T.nt, fontFamily: T.sans, fontSize: 11, fontWeight: 600, transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                        {copied ? <><i className="ti ti-check" style={{ fontSize: 12 }} /> Copied</> : <><i className="ti ti-copy" style={{ fontSize: 12 }} /> Copy</>}
                      </button>
                    </div>

                    <div style={{ background: 'rgba(200,245,96,.05)', border: '1px solid rgba(200,245,96,.12)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: T.nt, lineHeight: 1.6 }}>
                      <i className="ti ti-info-circle" style={{ color: T.g, marginRight: 5, verticalAlign: -2 }} />
                      Send exactly <span style={{ fontFamily: T.mono, color: T.g, fontWeight: 700 }}>${annualPrice.toFixed(2)}</span> equivalent in <strong style={{ color: T.gr }}>{selectedCrypto.symbol}</strong> to this address. Your plan activates once the deposit is confirmed.
                    </div>
                  </div>
                )}

                {payErr && (
                  <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: T.rd, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-alert-circle" /> {payErr}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="mp-btn mp-btn-ghost mp-btn-sm" style={{ padding: '10px 16px' }} onClick={() => setStep(1)} disabled={paying}>
                    <i className="ti ti-arrow-left" />
                  </button>
                  <button className="mp-btn mp-btn-accent mp-btn-sm"
                    style={{ flex: 1, padding: '10px 0', fontWeight: 700, fontSize: 13, opacity: selectedCrypto ? 1 : .4 }}
                    onClick={handleCryptoPay} disabled={paying || !selectedCrypto}>
                    {paying ? <><i className="ti ti-loader-2" style={{ fontSize: 14 }} /> Submitting…</> : <><i className="ti ti-send" style={{ fontSize: 13 }} /> I've Sent the Payment →</>}
                  </button>
                </div>
            </>

            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: T.nt, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <i className="ti ti-shield-check" style={{ color: T.gn, fontSize: 12 }} />
              Secured · TradeFlow encrypted platform
            </div>
          </>
        )}

        {/* ════════════════ STEP 3: Success ════════════════ */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="mp-success-ring"><i className="ti ti-check" /></div>
            <div style={{ fontFamily: T.serif, fontSize: 20, marginBottom: 8 }}>
              {isBot ? 'Bot Activated!' : 'Subscribed!'}
            </div>
            <p style={{ fontSize: 13, color: T.nt, marginBottom: 12, lineHeight: 1.6 }}>
              <strong style={{ color: T.gr }}>{item.name}</strong> is now {isBot
                ? 'running on your connected exchange account'
                : 'sending signals to your dashboard'}.
            </p>
            {receipt && (
              <div style={{ background: T.s2, border: `1px solid ${T.br}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 12, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: T.nt }}>Amount</span>
                  <span style={{ fontFamily: T.mono, color: T.g, fontWeight: 700 }}>{receipt.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: T.nt }}>Method</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    {receipt.crypto
                      ? <><i className={`ti ${receipt.crypto.icon}`} style={{ color: receipt.crypto.color }} />{receipt.method}</>
                      : <><i className="ti ti-wallet" style={{ color: T.gn }} />{receipt.method}</>}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: T.nt }}>Duration</span>
                  <span style={{ fontWeight: 600 }}>1 Year</span>
                </div>
                {receipt.crypto && (
                  <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(96,165,250,.07)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 8, fontSize: 11, color: T.bl, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-clock" />
                    Crypto deposits confirm within 1–3 hours. Your plan is already active.
                  </div>
                )}
              </div>
            )}
            <button className="mp-btn mp-btn-accent mp-btn-sm"
              style={{ padding: '10px 28px', fontWeight: 700 }} onClick={onClose}>
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
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab,         setTab]         = useState('bots');
  const [modal,       setModal]       = useState(null);
  const [modalType,   setModalType]   = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy,      setSortBy]      = useState('roi');
  const [refreshKey,  setRefreshKey]  = useState(0);

  // user_settings from DB — applied as CSS vars on :root
  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);

  // Keep sortBy in sync with personalised_feed preference
  const settingsApplied = useRef(false);

  // marketplace_items fetched from DB
  const [bots,        setBots]        = useState([]);
  const [signals,     setSignals]     = useState([]);
  const [itemsLoading,setItemsLoading]= useState(true);
  const [itemsErr,    setItemsErr]    = useState('');

  // metrics derived from marketplace_subscriptions
  const [metrics, setMetrics] = useState([
    { label: 'Active Subs',   value: '—', sub: 'Loading…',       icon: 'ti-stack-2',     iconBg: 'rgba(200,245,96,.12)',  iconColor: '#c8f560' },
    { label: 'Monthly Spend', value: '—', sub: 'Calculating…',   icon: 'ti-credit-card', iconBg: 'rgba(96,165,250,.12)',  iconColor: '#60a5fa' },
    { label: 'Bot P&L (30D)', value: '—', sub: 'Awaiting data',  icon: 'ti-trending-up', iconBg: 'rgba(52,211,153,.12)',  iconColor: '#34d399' },
    { label: 'Total Items',   value: '—', sub: 'In marketplace', icon: 'ti-broadcast',   iconBg: 'rgba(167,139,250,.12)', iconColor: '#a78bfa' },
  ]);

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const uid = session.user.id;
        const [{ data: profile }, { data: wallet }, { data: settings }] = await Promise.all([
          supabase.from('users').select('id, first_name, last_name, handle, plan, is_verified').eq('id', uid).single(),
          supabase.from('wallets').select('balance').eq('user_id', uid).eq('currency', 'USD').maybeSingle(),
          supabase.from('user_settings').select('*').eq('user_id', uid).maybeSingle(),
        ]);
        if (profile) setUser({ ...profile, balance: parseFloat(wallet?.balance ?? 0) });
        if (settings) {
          setUserSettings(s => ({ ...s, ...settings }));
          // Apply personalised_feed preference to default sort (only on first load)
          if (!settingsApplied.current) {
            settingsApplied.current = true;
            setSortBy(settings.personalised_feed ? 'roi' : 'price');
          }
        }
      }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Apply user_settings → CSS vars on :root ── */
  useEffect(() => {
    const vars = buildThemeVars(userSettings);
    applyThemeVars(vars);

    // If theme is 'system', re-apply when OS preference changes
    if (userSettings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyThemeVars(buildThemeVars(userSettings));
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [userSettings]);

  /* ── Fetch marketplace_items from DB ── */
  useEffect(() => {
    const load = async () => {
      setItemsLoading(true); setItemsErr('');
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          id, slug, type, name, tag, description, price_monthly,
          badge_label, badge_type, icon_class, color_hex,
          delivery_method, markets, roi_12m_pct, win_rate_pct,
          total_trades, accuracy_pct, subscriber_count, is_active
        `)
        .eq('is_active', true)
        .order('subscriber_count', { ascending: false });

      setItemsLoading(false);
      if (error) { setItemsErr(error.message); return; }
      setBots((data || []).filter(i => i.type === 'bot'));
      setSignals((data || []).filter(i => i.type === 'signal'));
    };
    load();
  }, []);

  /* ── Metrics from marketplace_subscriptions ── */
  const fetchMetrics = useCallback(async () => {
    if (!user) return;
    const { data: subs } = await supabase
      .from('marketplace_subscriptions')
      .select(`
        status, pnl_30d, renews_at,
        marketplace_items ( type, price_monthly )
      `)
      .eq('user_id', user.id)
      .in('status', ['active', 'paused']);

    const rows       = subs || [];
    const totalSubs  = rows.length;
    const botRows    = rows.filter(s => s.marketplace_items?.type === 'bot');
    const sigRows    = rows.filter(s => s.marketplace_items?.type === 'signal');
    const totalSpend = rows.reduce((a, r) => a + parseFloat(r.marketplace_items?.price_monthly || 0), 0);
    const botPnl     = botRows.reduce((a, r) => a + parseFloat(r.pnl_30d || 0), 0);
    const pnlSign    = botPnl >= 0 ? '+' : '';
    const renewDates = rows.map(r => r.renews_at).filter(Boolean).sort();
    const nextRenew  = renewDates[0]
      ? new Date(renewDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '—';

    setMetrics([
      { label: 'Active Subs',   value: `${totalSubs}`,    sub: `${botRows.length} bot${botRows.length !== 1 ? 's' : ''} · ${sigRows.length} signal${sigRows.length !== 1 ? 's' : ''}`, icon: 'ti-stack-2',     iconBg: 'rgba(200,245,96,.12)',  iconColor: '#c8f560' },
      { label: 'Monthly Spend', value: `$${totalSpend.toLocaleString()}`, sub: `Renews ${nextRenew}`,       icon: 'ti-credit-card', iconBg: 'rgba(96,165,250,.12)',  iconColor: '#60a5fa' },
      { label: 'Bot P&L (30D)', value: botPnl !== 0 ? `${pnlSign}$${Math.abs(botPnl).toLocaleString()}` : '$0', sub: botRows.length > 0 ? 'Across active bots' : 'No active bots', icon: 'ti-trending-up', iconBg: 'rgba(52,211,153,.12)',  iconColor: '#34d399' },
      { label: 'Total Items',   value: `${bots.length + signals.length}`, sub: `${bots.length} bots · ${signals.length} signals`, icon: 'ti-broadcast', iconBg: 'rgba(167,139,250,.12)', iconColor: '#a78bfa' },
    ]);
  }, [user, bots, signals]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics, refreshKey]);

  const sort = (arr) => [...arr].sort((a, b) => sortBy === 'price'
    ? parseFloat(a.price_monthly) - parseFloat(b.price_monthly)
    : parseFloat(b.roi_12m_pct || 0) - parseFloat(a.roi_12m_pct || 0));

  const openModal  = (item, type) => { setModal(item); setModalType(type); };
  const closeModal = () => { setModal(null); setModalType(null); };
  const handleSuccess = () => setRefreshKey(k => k + 1);
  const handleLogout  = async () => { await supabase.auth.signOut(); setUser(null); };

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
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 299 }} />
      )}
      <div className="mp-shell">
        <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />
        <div className="mp-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} />
          <main className="mp-main">
            <div className="mp-page-header">
              <div>
                <div className="mp-page-title"><em>Marketplace</em></div>
                <div className="mp-page-sub">
                  <span className="mp-live-dot" />
                  Automate your edge — deploy bots and subscribe to expert signal plans.
                </div>
              </div>
              
            </div>

            <div className="mp-metrics">
              {metrics.map(m => <MetricCard key={m.label} m={m} />)}
            </div>

            <ActiveSubscriptions userId={user?.id} refreshKey={refreshKey} userSettings={userSettings} />

            <div className="mp-controls">
              <div className="mp-tabs">
                {[
                  { key: 'bots',    label: 'Trading Bots',  icon: 'ti-robot',     count: bots.length },
                  { key: 'signals', label: 'Signal Plans',  icon: 'ti-broadcast', count: signals.length },
                ].map(({ key, label, icon, count }) => (
                  <button key={key} className={`mp-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                    <i className={`ti ${icon}`} />{label}
                    <span className="mp-tab-count" style={{
                      background: tab === key ? 'rgba(0,0,0,.2)' : 'rgba(52,211,153,.2)',
                      color: tab === key ? '#000' : T.gn,
                    }}>{count}</span>
                  </button>
                ))}
              </div>
              <div className="mp-filters">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="mp-select">
                  <option value="roi">Sort: ROI</option>
                  <option value="price">Sort: Price</option>
                </select>
              </div>
            </div>

            {/* Loading / error state for items */}
            {itemsLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: T.nt, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <i className="ti ti-loader-2" style={{ fontSize: 20 }} /> Loading marketplace…
              </div>
            ) : itemsErr ? (
              <div style={{ padding: '16px', color: T.rd, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-alert-circle" /> {itemsErr}
              </div>
            ) : (
              <>
                {tab === 'bots' && (
                  <>
                    <div className="mp-section-intro">
                      <strong>Trading Bots</strong> run 24/7 on your connected exchange account.
                      Set your capital allocation and let the bot execute — no manual intervention needed.
                    </div>
                    <div className="mp-grid-3">
                      {sort(bots).map(b => <BotCard key={b.id} item={b} onActivate={openModal} />)}
                      {bots.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: T.nt, padding: 40 }}>No bots available right now.</div>}
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
                      {sort(signals).map(s => <SignalCard key={s.id} item={s} onSubscribe={openModal} />)}
                      {signals.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: T.nt, padding: 40 }}>No signal plans available right now.</div>}
                    </div>
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {modal && (
        <SubscribeModal
          item={modal}
          type={modalType}
          onClose={closeModal}
          userId={user?.id}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}