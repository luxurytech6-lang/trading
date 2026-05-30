import { useState, useEffect } from "react";
import supabase from "../supabase";


/* ─── Apply saved appearance settings from localStorage / user_settings ──────── */
function applyAppearance(s = null) {
  try {
    const data = s || JSON.parse(localStorage.getItem('tf_appearance') || '{}');
    if (!data || !Object.keys(data).length) return;
    const root = document.documentElement;

    // Accent colour
    if (data.accent_color || data.accentColor) {
      const hex = (data.accent_color || data.accentColor).replace('#', '');
      const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
      const accent = data.accent_color || data.accentColor;
      root.style.setProperty('--accent',      accent);
      root.style.setProperty('--accent-dim',  `rgba(${r},${g},${b},.12)`);
      root.style.setProperty('--accent-glow', `rgba(${r},${g},${b},.06)`);
    }

    // Theme
    const theme = data.theme || 'dark';
    const effective = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    if (effective === 'light') {
      root.style.setProperty('--bg',       '#f0f2f5');
      root.style.setProperty('--surface',  '#ffffff');
      root.style.setProperty('--surface2', '#f8fafc');
      root.style.setProperty('--border',   '#e2e8f0');
      root.style.setProperty('--border2',  '#cbd5e1');
      root.style.setProperty('--text',     '#0f172a');
      root.style.setProperty('--muted',    '#64748b');
      root.style.setProperty('--faint',    '#94a3b8');
    } else {
      root.style.setProperty('--bg',       '#080b10');
      root.style.setProperty('--surface',  '#0e1219');
      root.style.setProperty('--surface2', '#141922');
      root.style.setProperty('--border',   '#1e2535');
      root.style.setProperty('--border2',  '#2a3347');
      root.style.setProperty('--text',     '#e2e8f0');
      root.style.setProperty('--muted',    '#64748b');
      root.style.setProperty('--faint',    '#374151');
    }

    // Density
    const density = data.layout_density || data.density || 'comfortable';
    const mainPad = { compact: '16px 20px 32px', comfortable: '24px 28px 40px', spacious: '32px 36px 56px' };
    document.querySelectorAll('.db-main, .in-main, .sb-main').forEach(el => {
      el.style.padding = mainPad[density] || mainPad.comfortable;
    });
  } catch (_) {}
}

// ─── Design Tokens & Global CSS ──────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 14px; }

  :root {
    /* Core palette */
    --bg:         #080b10;
    --surface:    #0e1219;
    --surface2:   #141922;
    --border:     #1e2535;
    --border2:    #2a3347;

    /* Text */
    --text:       #e2e8f0;
    --muted:      #64748b;
    --faint:      #374151;

    /* Accent — lime-gold */
    --accent:     #c8f560;
    --accent-dim: rgba(200,245,96,.12);
    --accent-glow:rgba(200,245,96,.06);

    /* Status */
    --green:      #34d399;
    --green-dim:  rgba(52,211,153,.12);
    --red:        #f87171;
    --red-dim:    rgba(248,113,113,.12);
    --blue:       #60a5fa;
    --blue-dim:   rgba(96,165,250,.12);
    --purple:     #a78bfa;

    /* Layout */
    --sidebar-w:  256px;
    --topbar-h:   60px;
    --ticker-h:   32px;

    /* Fonts */
    --sans:  'Space Grotesk', sans-serif;
    --serif: 'Instrument Serif', serif;
    --mono:  'JetBrains Mono', monospace;

    /* Radius */
    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 16px;
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

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── App shell ── */
  .shell {
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-rows: 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    grid-column: 1 !important;
    grid-row: 1 !important;
    background: var(--surface) !important;
    border-right: 1px solid var(--border) !important;
    display: flex !important;
    flex-direction: column !important;
    width: var(--sidebar-w) !important;
    min-width: var(--sidebar-w) !important;
    height: 100vh !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    position: relative !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    z-index: 100 !important;
    transition: transform .25s cubic-bezier(.4,0,.2,1) !important;
    flex-shrink: 0 !important;
  }

  .sidebar::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--border) 60%, transparent 100%);
    opacity: .15;
    pointer-events: none;
  }

  /* Brand */
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .brand-icon {
    width: 34px; height: 34px;
    background: var(--accent);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .brand-icon i { font-size: 18px; color: #000; }
  .brand-name {
    font-family: var(--sans);
    font-size: 16px; font-weight: 700;
    letter-spacing: -.3px; color: var(--text);
  }
  .brand-name em { color: var(--accent); font-style: normal; }

  /* Portfolio pill in sidebar */
  .sb-portfolio {
    margin: 12px 16px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,245,96,.18);
    border-radius: var(--r-md);
    padding: 10px 14px;
    flex-shrink: 0;
  }
  .sb-portfolio-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .sb-portfolio-value {
    font-family: var(--mono);
    font-size: 19px; font-weight: 600; color: var(--accent);
    letter-spacing: -.5px;
  }
  .sb-portfolio-sub {
    font-size: 11px; color: var(--green);
    margin-top: 3px;
  }

  /* Nav links */
  .sb-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }

  .sb-section {
    padding: 10px 20px 4px;
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--faint);
  }

  .sb-link {
    display: flex; align-items: center;
    gap: 11px;
    padding: 9px 20px;
    font-size: 13px; font-weight: 500;
    color: var(--muted);
    border-left: 2px solid transparent;
    transition: all .15s;
    cursor: pointer;
    position: relative;
  }
  .sb-link i { font-size: 18px; flex-shrink: 0; }
  .sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .sb-link.active {
    color: var(--accent);
    background: var(--accent-dim);
    border-left-color: var(--accent);
  }
  .sb-link.active i { filter: drop-shadow(0 0 6px var(--accent)); }

  .sb-badge {
    margin-left: auto;
    font-size: 9px; font-weight: 700;
    background: var(--accent); color: #000;
    padding: 2px 6px; border-radius: 5px;
    letter-spacing: .3px;
  }

  /* User block */
  .sb-user {
    flex-shrink: 0;
    border-top: 1px solid var(--border);
    padding: 14px 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .sb-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(200,245,96,.3);
  }
  .sb-user-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .sb-user-role {
    font-size: 10px; color: var(--accent);
    margin-top: 1px;
  }
  .sb-logout {
    margin-left: auto;
    color: var(--muted);
    font-size: 18px;
    cursor: pointer;
    transition: color .15s;
  }
  .sb-logout:hover { color: var(--red); }

  /* Plan card */
  .sb-plan {
    flex-shrink: 0;
    margin: 0 12px 12px;
    border-radius: var(--r-md);
    padding: 14px;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border2);
    background: var(--surface2);
  }
  .sb-plan.plan-pro {
    background: linear-gradient(135deg, rgba(200,245,96,.08) 0%, rgba(120,208,0,.04) 100%);
    border-color: rgba(200,245,96,.25);
  }
  .sb-plan.plan-elite {
    background: linear-gradient(135deg, rgba(167,139,250,.1) 0%, rgba(96,165,250,.06) 100%);
    border-color: rgba(167,139,250,.3);
  }
  .sb-plan::before {
    content: '';
    position: absolute;
    top: -20px; right: -20px;
    width: 70px; height: 70px;
    border-radius: 50%;
    background: var(--plan-glow, rgba(200,245,96,.08));
    filter: blur(16px);
    pointer-events: none;
  }
  .sb-plan-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .sb-plan-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; letter-spacing: .6px;
    text-transform: uppercase;
    padding: 3px 8px; border-radius: 20px;
    background: var(--plan-badge-bg, var(--accent-dim));
    color: var(--plan-badge-color, var(--accent));
    border: 1px solid var(--plan-badge-border, rgba(200,245,96,.2));
  }
  .sb-plan-badge i { font-size: 11px; }
  .sb-plan-icon {
    font-size: 18px;
    color: var(--plan-badge-color, var(--accent));
    opacity: .7;
  }
  .sb-plan-label {
    font-size: 11px; font-weight: 600; color: var(--text);
    margin-bottom: 2px;
  }
  .sb-plan-sub {
    font-size: 10px; color: var(--muted); line-height: 1.4;
  }
  .sb-plan-bar-wrap {
    margin: 10px 0 8px;
    height: 3px; border-radius: 2px;
    background: var(--border2);
    overflow: hidden;
  }
  .sb-plan-bar-fill {
    height: 100%; border-radius: 2px;
    background: var(--plan-badge-color, var(--accent));
    transition: width .6s ease;
  }
  .sb-plan-upgrade {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    width: 100%;
    padding: 7px 0;
    border-radius: var(--r-sm);
    font-size: 11px; font-weight: 700; letter-spacing: .3px;
    background: var(--plan-btn-bg, var(--accent));
    color: var(--plan-btn-color, #000);
    border: none; cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .sb-plan-upgrade:hover { opacity: .88; transform: translateY(-1px); }
  .sb-plan-upgrade i { font-size: 13px; }
  .sb-plan-current {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    width: 100%;
    padding: 7px 0;
    border-radius: var(--r-sm);
    font-size: 11px; font-weight: 600;
    background: transparent;
    border: 1px solid var(--border2);
    color: var(--muted);
    cursor: default;
  }
  .sb-plan-current i { font-size: 13px; color: var(--green); }

  /* ── RIGHT PANEL (topbar + content) ── */
  .right-panel {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  /* ── TOPBAR ── */
  .topbar {
    height: var(--topbar-h);
    flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 28px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 16px;
    z-index: 50;
  }

  .topbar-title {
    font-family: var(--serif);
    font-size: 20px; color: var(--text);
    flex: 1;
  }
  .topbar-title span { color: var(--accent); font-style: italic; }

  /* Search */
  .topbar-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 7px 14px;
    width: 220px;
    transition: border-color .15s;
  }
  .topbar-search:focus-within { border-color: var(--border2); }
  .topbar-search i { color: var(--muted); font-size: 16px; flex-shrink: 0; }
  .topbar-search input {
    background: none; border: none; outline: none;
    color: var(--text); font-family: var(--sans);
    font-size: 13px; width: 100%;
  }
  .topbar-search input::placeholder { color: var(--muted); }

  .topbar-icon {
    width: 36px; height: 36px;
    border-radius: var(--r-sm);
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all .15s;
    color: var(--muted);
    font-size: 18px;
    position: relative;
  }
  .topbar-icon:hover { border-color: var(--border2); color: var(--text); }
  .topbar-icon .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 6px; height: 6px;
    background: var(--red); border-radius: 50%;
    border: 1.5px solid var(--surface);
  }

  .topbar-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #78d000 100%);
    color: #000; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(200,245,96,.25);
  }

  /* Hamburger (mobile) */
  .topbar-hamburger {
    display: none;
    flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
  }
  .topbar-hamburger span {
    display: block; width: 20px; height: 2px;
    background: var(--text); border-radius: 2px; transition: all .2s;
  }

  /* ── TICKER ── */
  .ticker {
    height: var(--ticker-h);
    flex-shrink: 0;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    display: flex; align-items: center;
  }
  .ticker-track {
    display: flex; white-space: nowrap;
    animation: scroll-ticker 50s linear infinite;
    will-change: transform;
  }
  @keyframes scroll-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .ticker-item {
    font-family: var(--mono);
    font-size: 10.5px;
    padding: 0 20px;
    border-right: 1px solid var(--border);
    line-height: var(--ticker-h);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .t-sym { color: var(--muted); }
  .t-up  { color: var(--green); }
  .t-dn  { color: var(--red); }

  /* ── MAIN CONTENT ── */
  .main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px 28px 40px;
  }

  /* Page header */
  .page-header {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .page-greeting {
    font-family: var(--serif);
    font-size: 28px;
    color: var(--text);
    line-height: 1.2;
  }
  .page-greeting em { color: var(--accent); font-style: italic; }
  .page-sub {
    font-size: 13px; color: var(--muted);
    margin-top: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .live-dot {
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse 2s infinite;
    flex-shrink: 0;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; border-radius: var(--r-sm);
    font-family: var(--sans); font-weight: 600;
    cursor: pointer; transition: all .15s;
    border: none; text-decoration: none; white-space: nowrap;
  }
  .btn-sm { font-size: 12px; padding: 7px 14px; }
  .btn-md { font-size: 13px; padding: 9px 18px; }
  .btn-accent { background: var(--accent); color: #000; }
  .btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .btn-ghost {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text); font-size: 12px; padding: 7px 14px;
  }
  .btn-ghost:hover { border-color: var(--border2); }

  /* ── METRICS ROW ── */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .metric-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .2s;
    cursor: default;
  }
  .metric-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
    opacity: .35;
  }
  .metric-card.accent-card::before { opacity: 1; }

  .metric-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .metric-label {
    font-size: 10px; font-weight: 700;
    color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 6px;
  }
  .metric-value {
    font-family: var(--mono);
    font-size: 22px; font-weight: 600;
    color: var(--text);
    line-height: 1; margin-bottom: 8px;
    letter-spacing: -.5px;
  }
  .metric-value.accent { color: var(--accent); }
  .metric-value.green  { color: var(--green); }
  .metric-badge {
    font-size: 11px; color: var(--muted);
    display: flex; align-items: center; gap: 5px;
  }
  .badge-up { color: var(--green); }
  .badge-dn { color: var(--red); }

  /* ── MAIN GRID ── */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 340px;
    grid-template-rows: auto auto;
    gap: 16px;
    margin-bottom: 16px;
  }

  /* ── CARD ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 20px;
    transition: border-color .2s;
    position: relative;
    overflow: hidden;
  }
  .card:hover { border-color: var(--border2); }

  .card-title {
    font-size: 11px; font-weight: 700;
    color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 16px;
  }
  .card-header {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .card-header .card-title { margin-bottom: 0; }
  .card-link {
    font-size: 11px; color: var(--accent);
    font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 4px;
  }
  .card-link:hover { opacity: .75; }

  /* ── PERFORMANCE CHART ── */
  .perf-card { grid-column: 1 / 2; }
  .perf-headline {
    font-family: var(--mono);
    font-size: 32px; font-weight: 600; color: var(--accent);
    letter-spacing: -1px; margin-bottom: 2px;
  }
  .perf-sub {
    font-size: 12px; color: var(--muted); margin-bottom: 20px;
  }
  .perf-sub span { color: var(--text); }

  .bars {
    display: flex; align-items: flex-end; gap: 5px; height: 100px;
  }
  .bar {
    flex: 1;
    background: var(--accent-dim);
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    transition: background .2s, transform .15s;
    border: 1px solid transparent;
    min-width: 0;
  }
  .bar:hover { background: rgba(200,245,96,.28); }
  .bar.neg { background: var(--red-dim); }
  .bar.neg:hover { background: rgba(248,113,113,.28); }
  .bar.active { background: var(--accent); border-color: rgba(200,245,96,.5); }
  .bar-labels {
    display: flex; justify-content: space-between;
    margin-top: 8px;
    font-family: var(--mono); font-size: 9px; color: var(--muted);
  }

  /* Segment tabs */
  .seg-tabs {
    display: flex; gap: 2px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 3px;
    margin-bottom: 16px;
  }
  .seg-tab {
    flex: 1; padding: 5px;
    text-align: center;
    font-size: 11px; font-weight: 600;
    color: var(--muted);
    border-radius: 6px; cursor: pointer;
    transition: all .15s;
  }
  .seg-tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,.3); }

  /* ── POSITIONS TABLE ── */
  .positions-card { grid-column: 1 / 3; }

  .dt { width: 100%; border-collapse: collapse; font-size: 12px; }
  .dt th {
    text-align: left; padding: 6px 10px 10px;
    color: var(--muted); font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    border-bottom: 1px solid var(--border);
  }
  .dt td {
    padding: 10px 10px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: middle;
  }
  .dt tr:last-child td { border-bottom: none; }
  .dt tr:hover td { background: var(--accent-glow); }

  .asset-cell { display: flex; align-items: center; gap: 8px; }
  .asset-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    color: var(--accent);
    font-family: var(--mono);
    flex-shrink: 0;
  }
  .asset-name { font-weight: 600; font-family: var(--mono); font-size: 12px; }
  .asset-pair { font-size: 10px; color: var(--muted); margin-top: 1px; }

  .mono-val { font-family: var(--mono); }
  .up  { color: var(--green); }
  .dn  { color: var(--red); }

  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 8px; border-radius: 6px;
    font-size: 10px; font-weight: 700;
    letter-spacing: .2px;
  }
  .badge-green { background: var(--green-dim); color: var(--green); }
  .badge-red   { background: var(--red-dim);   color: var(--red); }
  .badge-gold  { background: var(--accent-dim);color: var(--accent); }
  .badge-blue  { background: var(--blue-dim);  color: var(--blue); }

  /* ── RIGHT COLUMN ── */
  .right-col { grid-column: 3; grid-row: 1 / 3; display: flex; flex-direction: column; gap: 16px; }

  /* Asset Allocation */
  .alloc-row { margin-bottom: 12px; }
  .alloc-top {
    display: flex; justify-content: space-between;
    font-size: 12px; margin-bottom: 5px;
  }
  .alloc-pct { font-family: var(--mono); color: var(--accent); font-size: 12px; font-weight: 600; }
  .progress-bar {
    height: 5px; background: var(--surface2);
    border-radius: 99px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: var(--accent);
    border-radius: 99px; transition: width .4s ease;
  }
  .pf-green  { background: var(--green); }
  .pf-blue   { background: var(--blue); }
  .pf-muted  { background: var(--muted); }

  .alloc-totals {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-top: 14px;
  }
  .alloc-tot-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 10px 12px;
  }
  .alloc-tot-lbl { font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .alloc-tot-val { font-family: var(--mono); font-size: 14px; font-weight: 600; color: var(--text); }
  .alloc-tot-val.accent { color: var(--accent); }

  /* Copy trading */
  .copy-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .copy-count { font-family: var(--mono); font-size: 15px; font-weight: 600; }
  .copy-alloc { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .copy-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .copy-av {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #000;
    flex-shrink: 0;
  }
  .copy-name { font-size: 12px; font-weight: 600; }
  .copy-pct { font-family: var(--mono); font-size: 12px; font-weight: 600; margin-left: auto; }

  /* Quick actions */
  .quick-list { display: flex; flex-direction: column; gap: 7px; }
  .quick-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    color: var(--text); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .15s;
    text-decoration: none;
  }
  .quick-btn i { color: var(--accent); font-size: 17px; }
  .quick-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .quick-btn-arrow { margin-left: auto; color: var(--muted); font-size: 15px; }

  /* Marketplace */
  .mp-card { grid-column: 2 / 3; }
  .mp-grid { display: flex; flex-direction: column; gap: 8px; }
  .mp-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    transition: border-color .15s;
  }
  .mp-row:hover { border-color: var(--accent); }
  .mp-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; color: #000; flex-shrink: 0;
  }
  .mp-name { font-size: 13px; font-weight: 600; }
  .mp-tag  { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .mp-roi  { font-family: var(--mono); font-size: 12px; font-weight: 600; text-align: right; }
  .mp-price{ font-size: 10px; color: var(--muted); margin-top: 2px; text-align: right; }

  /* NEW badge */
  .new-badge {
    font-size: 8.5px; font-weight: 800;
    background: var(--accent); color: #000;
    padding: 2px 6px; border-radius: 4px;
    letter-spacing: .5px;
  }

  /* Divider */
  .divider { height: 1px; background: var(--border); border: none; margin: 14px 0; }

  /* ── MOBILE OVERLAY ── */
  .sb-backdrop {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,.65);
    z-index: 99;
  }
  .sb-backdrop.open { display: block; }

  /* ── Bottom nav (mobile) ── */
  .bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 60px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    z-index: 200;
    align-items: center;
    justify-content: space-around;
    padding: 0 8px;
  }
  .bn-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    color: var(--muted); font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .5px;
    cursor: pointer; padding: 4px 10px;
    border-radius: 8px; transition: color .15s; text-decoration: none;
  }
  .bn-item i { font-size: 20px; }
  .bn-item.active { color: var(--accent); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1280px) {
    .dashboard-grid { grid-template-columns: 1fr 1fr 300px; }
  }

  @media (max-width: 1100px) {
    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .dashboard-grid { grid-template-columns: 1fr 300px; grid-template-rows: auto auto auto; }
    .positions-card { grid-column: 1 / 2; }
    .mp-card { grid-column: 1 / 2; }
    .right-col { grid-column: 2; grid-row: 1 / 4; }
  }

  @media (max-width: 768px) {
    :root { --sidebar-w: 260px; }
    .shell { grid-template-columns: 1fr !important; }
    .sidebar {
      position: fixed !important; top: 0 !important; left: 0 !important; height: 100vh !important;
      transform: translateX(-100%) !important; z-index: 300 !important;
      width: var(--sidebar-w) !important; min-width: var(--sidebar-w) !important;
    }
    .sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .right-panel { grid-column: 1; }
    .topbar-hamburger { display: flex; }
    .topbar-search { display: none; }
    .dashboard-grid { grid-template-columns: 1fr; }
    .positions-card, .mp-card, .perf-card { grid-column: 1; }
    .right-col { grid-column: 1; grid-row: auto; }
    .bottom-nav { display: flex; }
    .main { padding-bottom: 80px; }
  }

  @media (max-width: 600px) {
    .metrics-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .metric-value { font-size: 18px; }
    .page-greeting { font-size: 22px; }
    .topbar { padding: 0 16px; }
    .main { padding: 16px 16px 80px; }
  }

  @media (max-width: 380px) {
    .metrics-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Static Data ──────────────────────────────────────────────────────────────
const BAR_HEIGHTS = [35, 48, 42, 62, 28, 70, 66, 80, 74, 88, 95, 100];
const BAR_MONTHS  = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];

const TICKER_ITEMS = [
  { sym:'BTC/USD', val:'$67,420', pct:'+2.3%', up:true },
  { sym:'ETH/USD', val:'$3,840',  pct:'+1.8%', up:true },
  { sym:'S&P 500', val:'5,248',   pct:'-0.4%', up:false },
  { sym:'GOLD',    val:'$2,314',  pct:'+0.9%', up:true },
  { sym:'NVDA',    val:'$892',    pct:'+3.1%', up:true },
  { sym:'SOL/USD', val:'$168',    pct:'+4.7%', up:true },
  { sym:'BNB/USD', val:'$602',    pct:'+1.2%', up:true },
  { sym:'XRP/USD', val:'$0.58',   pct:'+0.8%', up:true },
  { sym:'EUR/USD', val:'1.0862',  pct:'-0.1%', up:false },
  { sym:'OIL',     val:'$82.40',  pct:'+0.5%', up:true },
];

const POSITIONS = [
  { sym:'BTC', pair:'BTC/USD', type:'Long',  typeC:'green', entry:'$62,100', current:'$67,420', pl:'+$5,320', plDir:'up', pct:'+8.6%',  status:'Open',    stC:'green' },
  { sym:'EU', pair:'EUR/USD', type:'Short', typeC:'red',   entry:'1.0910',  current:'1.0862',  pl:'+$480',  plDir:'up', pct:'+0.4%',  status:'Open',    stC:'green' },
  { sym:'NV', pair:'NVDA',    type:'Long',  typeC:'green', entry:'$820',    current:'$892',    pl:'+$3,600',plDir:'up', pct:'+8.8%',  status:'Partial', stC:'gold'  },
  { sym:'SO', pair:'SOL/USD', type:'Long',  typeC:'green', entry:'$142',    current:'$168',    pl:'+$2,600',plDir:'up', pct:'+18.3%', status:'Open',    stC:'green' },
  { sym:'GB', pair:'GBP/USD', type:'Short', typeC:'red',   entry:'1.2720',  current:'1.2754',  pl:'-$340',  plDir:'dn', pct:'-0.3%',  status:'Open',    stC:'green' },
];

const ALLOCATIONS = [
  { label:'Crypto',  pct:42, cls:'' },
  { label:'Forex',   pct:31, cls:'pf-green' },
  { label:'Stocks',  pct:18, cls:'pf-blue' },
  { label:'Cash',    pct:9,  cls:'pf-muted' },
];

const COPY_TRADERS = [
  { initials:'VF', name:'vForce',  pct:'+38.4%', prog:62, bg:'var(--accent)' },
  { initials:'SM', name:'sofiaM',  pct:'+24.7%', prog:40, bg:'var(--blue)' },
  { initials:'RK', name:'RaptorK', pct:'+19.1%', prog:30, bg:'var(--purple)' },
];

const MP_ITEMS = [
  { icon:'ti-robot',     name:'AlphaGrid',  tag:'Grid Bot',       roi:'+41.2%', price:'$29/mo', color:'var(--accent)' },
  { icon:'ti-robot',     name:'MomentumX',  tag:'Trend Bot',      roi:'+28.7%', price:'$19/mo', color:'var(--blue)' },
  { icon:'ti-broadcast', name:'CryptoEdge', tag:'Signal Service',  roi:'+55.1%', price:'$39/mo', color:'var(--purple)' },
];

const MAIN_LINKS = [
  { href:'/dashboard', icon:'ti-layout-dashboard', label:'Dashboard',    active:true },
  { href:'/copy-trading', icon:'ti-copy',             label:'Copy Trading'              },
  { href:'/hire-trader', icon:'ti-users',            label:'Hire a Trader'             },
  { href:'/insights', icon:'ti-chart-line',       label:'Insights'                  },
  { href:'/market-place', icon:'ti-robot',            label:'Marketplace',  badge:'NEW' },
  { href:'/terminal', icon:'ti-chart-candle',     label:'Terminal'                  },
];
const ACCOUNT_LINKS = [
  { href:'/payments', icon:'ti-credit-card',      label:'Payments'  },
  { href:'/profile', icon:'ti-user-circle',      label:'Profile'   },
  { href:'/settings', icon:'ti-settings',         label:'Settings'  },
  { href:'/support', icon:'ti-headset',          label:'Support'   },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const PLAN_META = {
  free:  { label:'Free',  icon:'ti-leaf',       badgeBg:'rgba(100,116,139,.15)', badgeColor:'#94a3b8', badgeBorder:'rgba(100,116,139,.2)', btnBg:'var(--accent)', btnColor:'#000', glow:'rgba(200,245,96,.06)',  fill:20, sub:'Limited access · 2 positions', upgrade:true  },
  pro:   { label:'Pro',   icon:'ti-bolt',       badgeBg:'rgba(200,245,96,.12)', badgeColor:'var(--accent)', badgeBorder:'rgba(200,245,96,.2)', btnBg:'var(--accent)', btnColor:'#000', glow:'rgba(200,245,96,.1)',  fill:60, sub:'Full access · Unlimited positions', upgrade:true  },
  elite: { label:'Elite', icon:'ti-crown',      badgeBg:'rgba(167,139,250,.15)', badgeColor:'var(--purple)', badgeBorder:'rgba(167,139,250,.25)', btnBg:'rgba(167,139,250,.15)', btnColor:'var(--purple)', glow:'rgba(167,139,250,.12)', fill:100, sub:'Everything · Priority support', upgrade:false },
};

function PlanCard({ plan }) {
  const key  = (plan ?? 'free').toLowerCase();
  const meta = PLAN_META[key] || PLAN_META.free;
  const planClass = key === 'elite' ? 'plan-elite' : key === 'pro' ? 'plan-pro' : '';

  const style = {
    '--plan-glow':         meta.glow,
    '--plan-badge-bg':     meta.badgeBg,
    '--plan-badge-color':  meta.badgeColor,
    '--plan-badge-border': meta.badgeBorder,
    '--plan-btn-bg':       meta.btnBg,
    '--plan-btn-color':    meta.btnColor,
  };

  return (
    <div className={`sb-plan ${planClass}`} style={style}>
      <div className="sb-plan-row">
        <span className="sb-plan-badge">
          <i className={`ti ${meta.icon}`} />
          {meta.label} Plan
        </span>
        <i className={`ti ${meta.icon} sb-plan-icon`} />
      </div>
      <div className="sb-plan-label">
        {key === 'elite' ? 'You\'re on the top tier' : key === 'pro' ? 'Pro features active' : 'Upgrade your plan'}
      </div>
      <div className="sb-plan-sub">{meta.sub}</div>
      <div className="sb-plan-bar-wrap">
        <div className="sb-plan-bar-fill" style={{ width: `${meta.fill}%` }} />
      </div>
      {meta.upgrade ? (
        <a href="/billing">
          <button className="sb-plan-upgrade">
            <i className="ti ti-rocket" />
            {key === 'pro' ? 'Upgrade to Elite' : 'Upgrade to Pro'}
          </button>
        </a>
      ) : (
        <div className="sb-plan-current">
          <i className="ti ti-circle-check" />
          Highest plan · You\'re all set
        </div>
      )}
    </div>
  );
}

function Sidebar({ open, user, onLogout }) {
  const initials    = user ? `${user.first_name?.[0]??''}${user.last_name?.[0]??''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || '?' : '?';
  const displayName = user ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email : '—';
  const planLabel   = user?.plan ? `${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)} · ${user.is_verified ? 'Verified' : 'Unverified'}` : '—';
  const portfolioVal = user?._portfolioVal ?? '$0.00';
  const dailyChange  = user?._dailyChange  ?? '';

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="brand">
        <div className="brand-icon"><i className="ti ti-trending-up" /></div>
        <span className="brand-name">Trade<em>Flow</em></span>
      </div>

      <div className="sb-portfolio">
        <div className="sb-portfolio-label">
          <span className="live-dot" style={{ width:6, height:6 }} />
          Live Portfolio
        </div>
        <div className="sb-portfolio-value">{portfolioVal}</div>
        {dailyChange && <div className="sb-portfolio-sub">{dailyChange}</div>}
      </div>

      <div className="sb-scroll">
        <div className="sb-section">Main</div>
        {MAIN_LINKS.map(l => (
          <a key={l.label} href={l.href} className={`sb-link${l.active ? ' active' : ''}`}>
            <i className={`ti ${l.icon}`} />
            {l.label}
            {l.badge && <span className="sb-badge">{l.badge}</span>}
          </a>
        ))}
        <div className="sb-section">Account</div>
        {ACCOUNT_LINKS.map(l => (
          <a key={l.label} href={l.href} className="sb-link">
            <i className={`ti ${l.icon}`} />
            {l.label}
          </a>
        ))}
      </div>

      <PlanCard plan={user?.plan} />

      <div className="sb-user">
        <div className="sb-avatar">{initials}</div>
        <div>
          <div className="sb-user-name">{displayName}</div>
          <div className="sb-user-role">{planLabel}</div>
        </div>
        <i className="ti ti-logout sb-logout" title="Sign out" onClick={onLogout} />
      </div>
    </aside>
  );
}

function Topbar({ onMenu, user }) {
  const firstName = user?.first_name || user?.email?.split('@')[0] || 'Trader';
  const initials  = user ? `${user.first_name?.[0]??''}${user.last_name?.[0]??''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || '?' : '?';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="topbar">
      <div className="topbar-hamburger" onClick={onMenu}>
        <span /><span /><span />
      </div>
      <div className="topbar-title">{greeting}, <span>{firstName}</span></div>
      <div className="topbar-search">
        <i className="ti ti-search" />
        <input placeholder="Search assets, orders…" />
      </div>
      <div className="topbar-icon">
        <a href="/notification">
        <i className="ti ti-bell" />
        <span className="notif-dot" /></a>
      </div>
      <div className="topbar-icon"><a href="/settings"><i className="ti ti-settings" /></a></div>
      <div className="topbar-avatar">{initials}</div>
    </div>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="t-sym">{t.sym}</span>
            <span>{t.val}</span>
            <span className={t.up ? 't-up' : 't-dn'}>{t.pct}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricsGrid({ snapshot, currSymbol = '$' }) {
  const fmt    = n => `${currSymbol}${Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits:0, maximumFractionDigits:0 })}`;
  const fmtPct = n => `${Number(n ?? 0) >= 0 ? '+' : ''}${Number(n ?? 0).toFixed(1)}%`;

  const totalValue  = snapshot ? fmt(snapshot.total_value)            : ` ${currSymbol}0`;
  const dailyAbs    = snapshot ? fmt(Math.abs(snapshot.daily_pnl))    : '$0';
  const dailyDir    = snapshot && Number(snapshot.daily_pnl) >= 0 ? '▲' : '▼';
  const dailyCls    = snapshot && Number(snapshot.daily_pnl) >= 0 ? 'badge-up' : 'badge-dn';
  const totalPnl    = snapshot ? `${Number(snapshot.total_pnl) >= 0 ? '+' : ''}${fmt(snapshot.total_pnl)}` : `+${currSymbol}0`;
  const totalPnlPct = snapshot ? fmtPct(snapshot.total_pnl_pct)       : '+0.0%';
  const openPos     = snapshot ? String(snapshot.open_positions)       : '0';
  const winRate     = snapshot ? `${Number(snapshot.win_rate_pct).toFixed(0)}%` : '0%';
  const cryptoPct   = snapshot ? Math.round(snapshot.alloc_crypto_pct) : 0;
  const forexPct    = snapshot ? Math.round(snapshot.alloc_forex_pct)  : 0;

  const cards = [
    { icon:'ti-wallet',      iconBg:'var(--accent-dim)',        iconColor:'var(--accent)',
      label:'Portfolio Value', value:totalValue,  cls:'accent',
      badge:`${dailyDir} ${dailyAbs} today`, badgeCls:dailyCls },
    { icon:'ti-trending-up', iconBg:'var(--green-dim)',         iconColor:'var(--green)',
      label:'Total P&L',      value:totalPnl,    cls:'green',
      badge:`▲ ${totalPnlPct} all-time`,     badgeCls:'badge-up' },
    { icon:'ti-chart-bar',   iconBg:'var(--blue-dim)',          iconColor:'var(--blue)',
      label:'Open Positions', value:openPos,     cls:'',
      badge:`${cryptoPct}% Crypto · ${forexPct}% Forex`, badgeCls:'' },
    { icon:'ti-target',      iconBg:'rgba(167,139,250,.12)',    iconColor:'var(--purple)',
      label:'Win Rate',       value:winRate,     cls:'',
      badge:'Based on closed trades', badgeCls:'' },
  ];
  return (
    <div className="metrics-grid">
      {cards.map(c => (
        <div key={c.label} className={`metric-card${c.cls === 'accent' ? ' accent-card' : ''}`}>
          <div className="metric-icon" style={{ background:c.iconBg, color:c.iconColor }}>
            <i className={`ti ${c.icon}`} />
          </div>
          <div className="metric-label">{c.label}</div>
          <div className={`metric-value ${c.cls}`}>{c.value}</div>
          <div className="metric-badge">
            <span className={c.badgeCls}>{c.badge}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PerformanceCard({ activeBar, onBar, perfBars, snapshot }) {
  const [period, setPeriod] = useState('12M');
  const bars   = perfBars?.length ? perfBars : BAR_HEIGHTS.map((h,i) => ({ height_pct:h, is_negative:i===4, period_label:BAR_MONTHS[i] }));
  const labels = bars.map(b => b.period_label);
  const pnlPct = snapshot
    ? `${Number(snapshot.total_pnl_pct) >= 0 ? '+' : ''}${Number(snapshot.total_pnl_pct).toFixed(1)}%`
    : '+0.0%';

  return (
    <div className="card perf-card">
      <div className="card-header">
        <span className="card-title">Performance</span>
        <div className="seg-tabs" style={{ marginBottom:0 }}>
          {['1M','3M','6M','12M'].map(p => (
            <div key={p} className={`seg-tab${period===p?' active':''}`} onClick={()=>setPeriod(p)}>{p}</div>
          ))}
        </div>
      </div>
      <div className="perf-headline">{pnlPct}</div>
      <div className="perf-sub">vs S&amp;P 500 <span>+9.1%</span> — last 12 months</div>
      <div className="bars">
        {bars.map((b, i) => (
          <div
            key={i}
            className={`bar${b.is_negative?' neg':''}${i===activeBar?' active':''}`}
            style={{ height:`${Math.max(Number(b.height_pct), 4)}%` }}
            onClick={()=>onBar(i)}
            title={b.period_label}
          />
        ))}
      </div>
      <div className="bar-labels">
        {labels.map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function PositionsCard({ positions }) {
  const display = positions?.length ? positions.map(p => {
    const pl     = Number(p.profit_loss ?? 0);
    const plDir  = pl >= 0 ? 'up' : 'dn';
    const plSign = pl >= 0 ? '+' : '-';
    const pct    = Number(p.open_price) > 0
      ? (((Number(p.current_price) - Number(p.open_price)) / Number(p.open_price)) * 100).toFixed(2)
      : '0.00';
    return {
      pair:    p.symbol,
      sym:     p.symbol.slice(0,2),
      type:    p.trade_type,
      typeC:   p.trade_type === 'BUY' ? 'buy' : 'sell',
      entry:   Number(p.open_price).toFixed(4),
      current: Number(p.current_price).toFixed(4),
      pl:      `${plSign}$${Math.abs(pl).toFixed(2)}`,
      pct:     `${pl >= 0 ? '+' : ''}${pct}%`,
      plDir,
      status:  p.status,
      stC:     p.status === 'open' ? 'open' : 'closed',
    };
  }) : [];

  return (
    <div className="card positions-card">
      <div className="card-header">
        <span className="card-title">Open Positions</span>
        <span className="card-link">View all <i className="ti ti-arrow-right" /></span>
      </div>
      <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <table className="dt">
          <thead>
            <tr>
              <th>Asset</th><th>Type</th><th>Entry</th>
              <th>Current</th><th>P&amp;L</th><th>%</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {display.length === 0
              ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--muted)', padding:'24px 0', fontFamily:'var(--mono)', fontSize:12 }}>No open positions</td></tr>
              : display.map(p => (
                <tr key={p.pair}>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon">{p.sym.slice(0,2)}</div>
                      <div><div className="asset-name">{p.pair}</div></div>
                    </div>
                  </td>
                  <td><span className={`badge badge-${p.typeC}`}>{p.type}</span></td>
                  <td className="mono-val">{p.entry}</td>
                  <td className="mono-val">{p.current}</td>
                  <td className={`mono-val ${p.plDir}`} style={{ fontWeight:700 }}>{p.pl}</td>
                  <td className={p.plDir} style={{ fontFamily:'var(--mono)', fontWeight:600 }}>{p.pct}</td>
                  <td><span className={`badge badge-${p.stC}`}>{p.status}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarketplaceCard({ mpItems }) {
  const items = mpItems?.length ? mpItems.map(item => ({
    icon:  item.icon_class   || 'ti-robot',
    name:  item.name,
    tag:   item.tag          || '',
    roi:   item.roi_12m_pct != null ? `+${Number(item.roi_12m_pct).toFixed(1)}%` : '—',
    price: item.price_monthly != null ? `$${Number(item.price_monthly).toFixed(0)}/mo` : 'Free',
    color: item.color_hex    || 'var(--accent)',
  })) : MP_ITEMS;

  return (
    <div className="card mp-card">
      <div className="card-header">
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="card-title">Bot &amp; Signal Marketplace</span>
          <span className="new-badge">NEW</span>
        </div>
        <span className="card-link">Browse all <i className="ti ti-arrow-right" /></span>
      </div>
      <div className="mp-grid">
        {items.map(item => (
          <div key={item.name} className="mp-row">
            <div className="mp-icon" style={{ background:item.color }}>
              <i className={`ti ${item.icon}`} />
            </div>
            <div style={{ flex:1 }}>
              <div className="mp-name">{item.name}</div>
              <div className="mp-tag">{item.tag}</div>
            </div>
            <div>
              <div className="mp-roi up">{item.roi}</div>
              <div className="mp-price">{item.price}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:14 }}>
        <a href="/market-place" className="btn btn-accent btn-sm" style={{ width:'100%', justifyContent:'center' }}>
          <i className="ti ti-rocket" /> Explore Marketplace
        </a>
      </div>
    </div>
  );
}

function RightColumn({ snapshot, copyRels }) {
  const fmt = n => `$${Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits:0, maximumFractionDigits:0 })}`;

  const allocations = snapshot ? [
    { label:'Crypto', pct: Math.round(snapshot.alloc_crypto_pct ?? 0), cls:'pf-accent' },
    { label:'Forex',  pct: Math.round(snapshot.alloc_forex_pct  ?? 0), cls:'pf-green'  },
    { label:'Stocks', pct: Math.round(snapshot.alloc_stocks_pct ?? 0), cls:'pf-blue'   },
    { label:'Cash',   pct: Math.round(snapshot.alloc_cash_pct   ?? 0), cls:'pf-muted'  },
  ] : [
    { label:'Crypto', pct:0, cls:'pf-accent' },
    { label:'Forex',  pct:0, cls:'pf-green'  },
    { label:'Stocks', pct:0, cls:'pf-blue'   },
    { label:'Cash',   pct:0, cls:'pf-muted'  },
  ];

  const invested = fmt(snapshot?.invested ?? 0);
  const cash     = fmt(snapshot?.cash     ?? 0);

  const traders = copyRels?.length ? copyRels.map(r => ({
    initials: r.trader_profiles?.initials || r.trader_profiles?.display_name?.slice(0,2).toUpperCase() || '??',
    name:     r.trader_profiles?.display_name || r.trader_profiles?.handle || '—',
    pct:      r.trader_profiles?.trader_performance?.[0]?.roi_pct != null
                ? `+${Number(r.trader_profiles.trader_performance[0].roi_pct).toFixed(1)}%`
                : '0.0%',
    prog:     Math.min(Math.max(Number(r.trader_profiles?.trader_performance?.[0]?.roi_pct ?? 0), 0), 100),
    bg:       r.trader_profiles?.color_hex || 'var(--accent)',
  })) : [];

  const totalAllocated = copyRels?.length
    ? fmt(copyRels.reduce((s, r) => s + Number(r.allocated_amount ?? 0), 0))
    : '$0';

  return (
    <div className="right-col">
      {/* Asset Allocation */}
      <div className="card">
        <div className="card-title">Asset Allocation</div>
        {allocations.map(a => (
          <div key={a.label} className="alloc-row">
            <div className="alloc-top">
              <span style={{ fontSize:13 }}>{a.label}</span>
              <span className="alloc-pct">{a.pct}%</span>
            </div>
            <div className="progress-bar">
              <div className={`progress-fill ${a.cls}`} style={{ width:`${a.pct}%` }} />
            </div>
          </div>
        ))}
        <div className="alloc-totals">
          <div className="alloc-tot-card">
            <div className="alloc-tot-lbl">Invested</div>
            <div className="alloc-tot-val accent">{invested}</div>
          </div>
          <div className="alloc-tot-card">
            <div className="alloc-tot-lbl">Cash</div>
            <div className="alloc-tot-val">{cash}</div>
          </div>
        </div>
      </div>

      {/* Copy Trading */}
      <div className="card">
        <div className="copy-head">
          <div>
            <div className="copy-count">{traders.length} Active {traders.length === 1 ? 'Copy' : 'Copies'}</div>
            <div className="copy-alloc">{totalAllocated} allocated</div>
          </div>
          <a href="/copy-trading" className="btn btn-ghost btn-sm">Manage</a>
        </div>
        <div className="card-title">Copy Trading</div>
        {traders.length === 0
          ? <div style={{ fontSize:12, color:'var(--muted)', fontFamily:'var(--mono)', textAlign:'center', padding:'12px 0' }}>No active copy trades</div>
          : traders.map(t => (
            <div key={t.name} className="copy-row">
              <div className="copy-av" style={{ background:t.bg }}>{t.initials}</div>
              <div style={{ flex:1 }}>
                <div className="copy-name">{t.name}</div>
                <div className="progress-bar" style={{ marginTop:5 }}>
                  <div className="progress-fill" style={{ width:`${t.prog}%`, background:t.bg }} />
                </div>
              </div>
              <span className="copy-pct up">{t.pct}</span>
            </div>
          ))
        }
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-title">Quick Actions</div>
        <div className="quick-list">
          {[
            { href:'/copy-trading', icon:'ti-copy',      label:'Start Copy Trading' },
            { href:'/hire-trader', icon:'ti-users',     label:'Hire a Trader'      },
            { href:'/payments', icon:'ti-plus',      label:'Deposit Funds'      },
            { href:'/insights', icon:'ti-chart-bar', label:'View Insights'      },
          ].map(a => (
            <a key={a.label} href={a.href} className="quick-btn">
              <i className={`ti ${a.icon}`} />
              {a.label}
              <i className="ti ti-chevron-right quick-btn-arrow" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeBar,   setActiveBar]   = useState(11);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user,        setUser]        = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [snapshot,    setSnapshot]    = useState(null);
  const [perfBars,    setPerfBars]    = useState([]);
  const [positions,   setPositions]   = useState([]);
  const [copyRels,    setCopyRels]    = useState([]);
  const [mpItems,     setMpItems]     = useState([]);

  // Apply cached appearance immediately on mount (before DB responds)
  useEffect(() => { applyAppearance(); }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async (session) => {
      if (!session) { window.location.href = '/login'; return; }
      const uid = session.user.id;

      const [
        { data: profile },
        { data: snap },
        { data: bars },
        { data: pos },
        { data: copies },
        { data: mp },
        { data: userSettings },
      ] = await Promise.all([
        supabase.from('users').select('first_name,last_name,email,plan,is_verified,currency').eq('id', uid).single(),
        supabase.from('portfolio_snapshots').select('*').eq('user_id', uid).order('snapped_at', { ascending:false }).limit(1).maybeSingle(),
        supabase.from('performance_bars').select('period_label,height_pct,is_negative').eq('user_id', uid).order('period_start', { ascending:true }).limit(12),
        supabase.from('open_positions').select('symbol,trade_type,open_price,current_price,profit_loss,status').eq('user_id', uid).eq('status','open').order('opened_at', { ascending:false }).limit(10),
        supabase.from('copy_relationships').select(`allocated_amount,trader_profiles(display_name,handle,initials,color_hex,trader_performance(roi_pct,period))`).eq('copier_id', uid).eq('status','active'),
        supabase.from('marketplace_items').select('name,tag,icon_class,color_hex,price_monthly,roi_12m_pct').eq('is_active', true).order('subscriber_count', { ascending:false }).limit(3),
        supabase.from('user_settings').select('theme,accent_color,layout_density').eq('user_id', uid).maybeSingle(),
      ]);

      if (!mounted) return;

      const currency   = profile?.currency ?? 'USD';
      const currSymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'NGN' ? '₦' : '$';
      const fmtCurr    = (n, decimals = 2) =>
        `${currSymbol}${Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

      const enrichedUser = {
        ...(profile ?? { first_name: session.user.user_metadata?.first_name ?? '', last_name: session.user.user_metadata?.last_name ?? '', email: session.user.email }),
        currency,
        currSymbol,
        _portfolioVal: snap ? fmtCurr(snap.total_value) : `${currSymbol}0.00`,
        _dailyChange:  snap ? `${Number(snap.daily_pnl) >= 0 ? '▲' : '▼'} ${fmtCurr(Math.abs(snap.daily_pnl))} today` : '',
      };

      setUser(enrichedUser);
      if (snap)           setSnapshot(snap);
      if (bars?.length)   setPerfBars(bars);
      if (pos?.length)    setPositions(pos);
      if (copies?.length) {
        setCopyRels(copies.map(r => ({
          ...r,
          trader_profiles: r.trader_profiles ? {
            ...r.trader_profiles,
            trader_performance: (r.trader_profiles.trader_performance ?? [])
              .sort((a,b) => (b.period === '1Y' ? 1 : -1)).slice(0,1),
          } : null,
        })));
      }
      if (mp?.length) setMpItems(mp);
      // Apply appearance from DB settings (and sync to localStorage for other pages)
      if (userSettings) {
        localStorage.setItem('tf_appearance', JSON.stringify(userSettings));
        applyAppearance(userSettings);
      } else {
        // Fall back to whatever is already in localStorage
        applyAppearance();
      }
      setAuthChecked(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => bootstrap(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) window.location.href = '/login';
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    if (!sidebarOpen) return;
    const close = () => setSidebarOpen(false);
    document.addEventListener('keydown', e => e.key === 'Escape' && close());
    return () => document.removeEventListener('keydown', close);
  }, [sidebarOpen]);

  if (!authChecked) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, background:'var(--bg)' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid var(--border2)', borderTopColor:'var(--accent)', animation:'spin .7s linear infinite' }} />
          <span style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)', letterSpacing:'.06em' }}>Loading dashboard…</span>
          <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className={`sb-backdrop${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="shell">
        <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />

        <div className="right-panel">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} />
          <Ticker />

          <main className="main">
            <div className="page-header">
              <div>
                <div className="page-greeting"><em>Dashboard</em></div>
                <div className="page-sub">
                  <span className="live-dot" />
                  Markets up 2.3% today · Last updated just now
                </div>
              </div>
              <div className="header-actions">
                <a href="#" className="btn btn-ghost btn-sm"><i className="ti ti-download" /> Export</a>
                <a href="/terminal" className="btn btn-accent btn-sm"><i className="ti ti-plus" /> New Trade</a>
              </div>
            </div>

            <MetricsGrid snapshot={snapshot} currSymbol={user?.currSymbol ?? '$'} />

            <div className="dashboard-grid">
              <PerformanceCard activeBar={activeBar} onBar={setActiveBar} perfBars={perfBars} snapshot={snapshot} />
              <MarketplaceCard mpItems={mpItems} />
              <RightColumn snapshot={snapshot} copyRels={copyRels} />
              <PositionsCard positions={positions} />
            </div>
          </main>
        </div>
      </div>

      <nav className="bottom-nav">
        <a href="/dashboard" className="bn-item active"><i className="ti ti-layout-dashboard" />Home</a>
        <a href="/terminal" className="bn-item"><i className="ti ti-chart-candle" />Trade</a>
        <a href="/market-place" className="bn-item"><i className="ti ti-robot" />Bots</a>
        <a href="/copy-trading" className="bn-item"><i className="ti ti-copy" />Copy</a>
        <a href="/profile" className="bn-item"><i className="ti ti-user-circle" />Profile</a>
      </nav>
    </>
  );
}