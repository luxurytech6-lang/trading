import React, { useState, useEffect } from 'react';
import supabase from "../supabase";

/* ─── Design tokens (matches Insights / Payment / CopyTrading) ───────────────── */
const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── Default user settings (mirrors DB defaults) ───────────────────────────── */
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

/* ─── Derive CSS variable overrides from user settings ───────────────────────── */
function buildThemeVars(settings) {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  const accent = s.accent_color || '#c8f560';

  const hex = accent.replace('#', '');
  const r   = parseInt(hex.substring(0,2), 16);
  const g   = parseInt(hex.substring(2,4), 16);
  const b   = parseInt(hex.substring(4,6), 16);

  const densityMap = {
    compact:     { mainPad: '14px 18px 32px', metricPad: '12px 14px', topbarH: '52px', sidebarW: '232px' },
    comfortable: { mainPad: '24px 28px 40px', metricPad: '18px 20px', topbarH: '60px', sidebarW: '256px' },
    spacious:    { mainPad: '32px 40px 56px', metricPad: '22px 24px', topbarH: '68px', sidebarW: '272px' },
  };
  const density = densityMap[s.layout_density] || densityMap.comfortable;

  const isDark = s.theme === 'dark' || (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const palette = isDark ? {
    bg: '#080b10', surface: '#0e1219', surface2: '#141922',
    border: '#1e2535', border2: '#2a3347',
    text: '#e2e8f0', muted: '#64748b', faint: '#374151',
  } : {
    bg: '#f0f4f8', surface: '#ffffff', surface2: '#f8fafc',
    border: '#e2e8f0', border2: '#cbd5e1',
    text: '#0f172a', muted: '#64748b', faint: '#94a3b8',
  };

  return `
    --bg:         ${palette.bg};
    --surface:    ${palette.surface};
    --surface2:   ${palette.surface2};
    --border:     ${palette.border};
    --border2:    ${palette.border2};
    --text:       ${palette.text};
    --muted:      ${palette.muted};
    --faint:      ${palette.faint};
    --accent:     ${accent};
    --accent-dim: rgba(${r},${g},${b},.12);
    --accent-glow:rgba(${r},${g},${b},.06);
    --sidebar-w:  ${density.sidebarW};
    --topbar-h:   ${density.topbarH};
    --main-pad:   ${density.mainPad};
    --metric-pad: ${density.metricPad};
  `;
}

/* ─── Global CSS ─────────────────────────────────────────────────────────────── */
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
    --blue-dim:    rgba(96,165,250,.12);
    --purple:      #a78bfa;
    --purple-dim:  rgba(167,139,250,.12);
    --amber:       #f59e0b;
    --amber-dim:   rgba(245,158,11,.12);
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
    content: ''; position: absolute; top: 0; right: 0; width: 1px; height: 100%;
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
  .in-sb-link { display: flex; align-items: center; gap: 11px; padding: 9px 20px; font-size: 13px; font-weight: 500; color: var(--muted); border-left: 2px solid transparent; transition: all .15s; cursor: pointer; }
  .in-sb-link i { font-size: 18px; flex-shrink: 0; }
  .in-sb-link:hover { color: var(--text); background: var(--accent-glow); border-left-color: var(--border2); }
  .in-sb-link.active { color: var(--accent); background: var(--accent-dim); border-left-color: var(--accent); }
  .in-sb-link.active i { filter: drop-shadow(0 0 6px var(--accent)); }
  .in-sb-badge { margin-left: auto; font-size: 9px; font-weight: 700; background: var(--red); color: #fff; padding: 2px 6px; border-radius: 5px; }
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
  .in-main { flex: 1; overflow-y: auto; overflow-x: hidden; padding: var(--main-pad, 24px 28px 40px); }
  .in-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .in-page-title { font-family: var(--serif); font-size: 28px; color: var(--text); line-height: 1.2; }
  .in-page-title em { color: var(--accent); font-style: italic; }
  .in-page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .in-header-actions { display: flex; gap: 8px; }

  /* Buttons */
  .in-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; border-radius: var(--r-sm); font-family: var(--sans); font-weight: 600; cursor: pointer; transition: all .15s; border: none; text-decoration: none; white-space: nowrap; }
  .in-btn-sm  { font-size: 12px; padding: 7px 14px; }
  .in-btn-md  { font-size: 13px; padding: 10px 20px; }
  .in-btn-full { width: 100%; justify-content: center; }
  .in-btn-accent { background: var(--accent); color: #000; }
  .in-btn-accent:hover { opacity: .88; box-shadow: 0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: 12px; padding: 7px 14px; }
  .in-btn-ghost:hover { border-color: var(--border2); }
  .in-btn-danger { background: var(--red-dim); border: 1px solid rgba(248,113,113,.25); color: var(--red); font-size: 12px; padding: 7px 14px; }
  .in-btn-danger:hover { background: rgba(248,113,113,.2); }

  /* Badge */
  .in-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap; letter-spacing: .2px; }
  .in-badge-green  { background: var(--green-dim);  color: var(--green); }
  .in-badge-blue   { background: var(--blue-dim);   color: var(--blue); }
  .in-badge-red    { background: var(--red-dim);    color: var(--red); }
  .in-badge-gold   { background: var(--accent-dim); color: var(--accent); }
  .in-badge-purple { background: var(--purple-dim); color: var(--purple); }
  .in-badge-amber  { background: var(--amber-dim);  color: var(--amber); }
  .in-badge-muted  { background: rgba(100,116,139,.12); color: var(--muted); }

  /* ── Metrics ── */
  .nt-metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .nt-metric { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: var(--metric-pad, 18px 20px); position: relative; overflow: hidden; transition: all .2s; }
  .nt-metric:hover { border-color: var(--border2); transform: translateY(-1px); }
  .nt-metric::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%); opacity: .3; }
  .nt-metric-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 12px; }
  .nt-metric-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .nt-metric-value { font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -.5px; }
  .nt-metric-sub { font-size: 11px; }

  /* ── Tab controls ── */
  .in-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .in-tabs { display: flex; gap: 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 4px; }
  .in-tab { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--r-sm); border: none; cursor: pointer; font-family: var(--sans); font-weight: 700; font-size: 12px; background: transparent; color: var(--muted); transition: all .15s; white-space: nowrap; }
  .in-tab:hover { color: var(--text); }
  .in-tab.active { background: var(--accent); color: #000; }
  .in-tab i { font-size: 14px; }
  .in-tab .nt-tab-count { background: rgba(0,0,0,.25); color: inherit; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; margin-left: 2px; }
  .in-tab.active .nt-tab-count { background: rgba(0,0,0,.2); }

  /* ── Notification Feed ── */
  .nt-layout { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }

  /* Feed */
  .nt-feed { display: flex; flex-direction: column; gap: 0; }
  .nt-group-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--faint); padding: 14px 0 8px; display: flex; align-items: center; gap: 10px; }
  .nt-group-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .nt-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 18px; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); margin-bottom: 8px;
    cursor: pointer; transition: all .18s; position: relative; overflow: hidden;
    animation: nt-slide-in .3s ease both;
  }
  @keyframes nt-slide-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .nt-item:hover { background: var(--surface2); border-color: var(--border2); }
  .nt-item.unread { border-left: 3px solid var(--accent); }
  .nt-item.unread::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--accent) 0%, transparent 60%); opacity: .4; }

  .nt-item-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .nt-item-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .nt-item-body { flex: 1; min-width: 0; }
  .nt-item-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .nt-item-title { font-size: 13px; font-weight: 600; line-height: 1.4; }
  .nt-item-time { font-size: 10px; color: var(--muted); white-space: nowrap; flex-shrink: 0; font-family: var(--mono); }
  .nt-item-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 8px; }
  .nt-item-tags { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .nt-item-actions { display: flex; gap: 6px; margin-top: 10px; }
  .nt-act-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all .15s;
    border: 1px solid var(--border); background: var(--surface2); color: var(--muted);
  }
  .nt-act-btn:hover { color: var(--text); border-color: var(--border2); }
  .nt-act-btn.primary { background: var(--accent-dim); border-color: rgba(200,245,96,.3); color: var(--accent); }
  .nt-act-btn.primary:hover { background: rgba(200,245,96,.2); }
  .nt-act-btn i { font-size: 12px; }

  /* Dismiss button on hover */
  .nt-dismiss { opacity: 0; transition: opacity .15s; }
  .nt-item:hover .nt-dismiss { opacity: 1; }

  /* Empty state */
  .nt-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 12px; }
  .nt-empty-icon { width: 56px; height: 56px; border-radius: 16px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--faint); }
  .nt-empty-title { font-family: var(--serif); font-size: 18px; color: var(--muted); }
  .nt-empty-sub { font-size: 12px; color: var(--faint); text-align: center; }

  /* ── Right sidebar panel ── */
  .nt-panel { display: flex; flex-direction: column; gap: 14px; }

  /* Activity heatmap */
  .nt-heatmap-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; }
  .nt-panel-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; }
  .nt-heatmap { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .nt-heat-cell { height: 28px; border-radius: 5px; transition: transform .1s; cursor: default; }
  .nt-heat-cell:hover { transform: scale(1.15); }
  .nt-heat-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 6px; }
  .nt-heat-day { font-size: 9px; text-align: center; color: var(--faint); font-weight: 600; text-transform: uppercase; }

  /* Category breakdown */
  .nt-breakdown-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; }
  .nt-cat-row { display: flex; align-items: center; gap: 10px; margin-bottom: 11px; }
  .nt-cat-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .nt-cat-name { font-size: 12px; font-weight: 600; flex: 1; }
  .nt-cat-count { font-family: var(--mono); font-size: 12px; font-weight: 700; }
  .nt-cat-bar-wrap { height: 4px; background: var(--surface2); border-radius: 99px; overflow: hidden; margin-top: 4px; }
  .nt-cat-bar { height: 100%; border-radius: 99px; }

  /* Quiet hours card */
  .nt-quiet-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 18px; }
  .nt-qh-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 12px; }
  .nt-qh-label { color: var(--muted); }
  .nt-toggle { position: relative; width: 32px; height: 18px; cursor: pointer; flex-shrink: 0; }
  .nt-toggle-track { position: absolute; inset: 0; border-radius: 99px; transition: background .2s; }
  .nt-toggle-thumb { position: absolute; top: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: left .2s; }
  .nt-toggle.on  .nt-toggle-track { background: var(--accent); }
  .nt-toggle.on  .nt-toggle-thumb { left: 16px; }
  .nt-toggle.off .nt-toggle-track { background: var(--border2); }
  .nt-toggle.off .nt-toggle-thumb { left: 2px; }

  /* ── Settings page ── */
  .nt-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .nt-settings-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 22px; }
  .nt-settings-card-title { font-family: var(--serif); font-size: 16px; margin-bottom: 4px; }
  .nt-settings-card-title em { color: var(--accent); font-style: italic; }
  .nt-settings-card-sub { font-size: 12px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
  .nt-setting-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .nt-setting-row:last-child { border-bottom: none; padding-bottom: 0; }
  .nt-setting-label { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
  .nt-setting-desc { font-size: 11px; color: var(--muted); line-height: 1.5; max-width: 260px; }
  .nt-select { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: var(--r-sm); padding: 6px 10px; font-size: 12px; font-family: var(--sans); cursor: pointer; outline: none; transition: border-color .15s; }
  .nt-select:hover { border-color: var(--border2); }

  /* ── Responsive ── */
  @media (max-width:1100px) {
    .nt-layout { grid-template-columns: 1fr; }
    .nt-metrics { grid-template-columns: repeat(2,1fr); }
    .nt-settings-grid { grid-template-columns: 1fr; }
  }
  @media (max-width:768px) {
    .in-shell { grid-template-columns: 1fr !important; }
    .in-sidebar { position: fixed !important; top: 0 !important; left: 0 !important; transform: translateX(-100%) !important; z-index: 300 !important; }
    .in-sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column: 1; }
    .in-hamburger { display: flex; }
    .nt-metrics { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width:600px) { .in-main { padding: 16px; } .in-topbar { padding: 0 16px; } }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

/**
 * Map a DB notification row → the shape the UI expects.
 * The DB stores icon_class, icon_bg_css, icon_color_css, dot_color_css, tags (JSONB).
 * We derive the time-group label from created_at.
 */
function mapDbNotification(row) {
  const now = new Date();
  const created = new Date(row.created_at);
  const diffDays = Math.floor((now - created) / 86400000);

  let group = 'Earlier';
  if (diffDays === 0) group = 'Today';
  else if (diffDays === 1) group = 'Yesterday';

  const diffMs = now - created;
  let time;
  if (diffMs < 60000)        time = `${Math.floor(diffMs / 1000)}s ago`;
  else if (diffMs < 3600000) time = `${Math.floor(diffMs / 60000)}m ago`;
  else if (diffMs < 86400000) time = `${Math.floor(diffMs / 3600000)}h ago`;
  else time = created.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) +
              ' · ' + created.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return {
    id:       row.id,
    cat:      row.category,
    group,
    icon:     row.icon_class     || 'ti-bell',
    iconBg:   row.icon_bg_css    || 'rgba(100,116,139,.12)',
    iconCol:  row.icon_color_css || '#64748b',
    dotCol:   row.dot_color_css  || '#64748b',
    unread:   !row.is_read,
    title:    row.title,
    desc:     row.description || '',
    time,
    tags:     Array.isArray(row.tags) ? row.tags : [],
    // actions come from action_url; build a single CTA if present
    actions:  row.action_url
      ? [{ label: 'View', primary: true, icon: 'ti-external-link', url: row.action_url }]
      : [],
  };
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */


// HEAT_DATA is now derived from real notification timestamps — see buildHeatmap()
function buildHeatmap(notifications) {
  // Build a 28-cell grid (4 weeks × 7 days), ending today
  const cells = new Array(28).fill(0);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  notifications.forEach(n => {
    const d = new Date(n._created_at || 0);
    const diffDays = Math.floor((todayMidnight - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
    if (diffDays >= 0 && diffDays < 28) {
      cells[27 - diffDays] += 1;
    }
  });
  return cells;
}

// METRICS_DATA is now derived from live notifications — see buildMetrics()
function buildMetrics(notifications) {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 86400000);
  const unread      = notifications.filter(n => n.unread).length;
  const thisWeek    = notifications.filter(n => new Date(n._created_at || 0) >= weekAgo).length;
  const tradeAlerts = notifications.filter(n => n.cat === 'trade').length;
  const dismissed   = notifications.filter(n => n._is_dismissed).length;
  return [
    { label: 'Unread',       value: String(unread),      sub: 'unread alerts',       col: '#f87171', bg: 'rgba(248,113,113,.12)', icon: 'ti-bell-ringing' },
    { label: 'This Week',    value: String(thisWeek),    sub: 'last 7 days',         col: '#c8f560', bg: 'rgba(200,245,96,.12)',  icon: 'ti-calendar-week' },
    { label: 'Trade Alerts', value: String(tradeAlerts), sub: 'trading category',    col: '#34d399', bg: 'rgba(52,211,153,.12)', icon: 'ti-trending-up' },
    { label: 'Dismissed',    value: String(dismissed),   sub: 'hidden notifications',col: '#64748b', bg: 'rgba(100,116,139,.12)', icon: 'ti-trash' },
  ];
}

const PREF_SETTINGS = [
  {
    title: 'Trade Alerts', titleEm: true,
    sub: 'Get notified when your copy trades execute, stop-losses fire, or take-profits are hit.',
    rows: [
      { label: 'Copy Trade Executed', desc: 'When a trader you follow opens or closes a position', defaultOn: true },
      { label: 'Stop-Loss Triggered', desc: 'Immediate alert when a stop-loss fires on any position', defaultOn: true },
      { label: 'Take-Profit Hit',     desc: 'When a trade closes at your profit target', defaultOn: true },
      { label: 'Position Risk Alert', desc: 'When a position exceeds your configured risk threshold', defaultOn: false },
    ],
  },
  {
    title: 'Market Events',
    sub: 'Stay ahead of macro events and AI-powered market insights that may affect your portfolio.',
    rows: [
      { label: 'High-Impact Events',  desc: 'Fed decisions, CPI releases, and major macro events', defaultOn: true },
      { label: 'AI Model Updates',    desc: "When TradeFlow's prediction model is retrained", defaultOn: true },
      { label: 'Weekly Forecasts',    desc: 'New asset forecasts every Monday at 07:00 UTC', defaultOn: false },
      { label: 'Sentiment Shifts',    desc: 'When market consensus changes significantly', defaultOn: false },
    ],
  },
  {
    title: 'Payments & Billing',
    sub: 'Deposit confirmations, withdrawal updates, and subscription billing reminders.',
    rows: [
      { label: 'Deposit Confirmed',   desc: 'When funds land in your wallet', defaultOn: true },
      { label: 'Withdrawal Processed',desc: 'Status updates on your withdrawal requests', defaultOn: true },
      { label: 'Plan Renewal',        desc: '3 days before and on the day of billing', defaultOn: true },
      { label: 'Payment Failed',      desc: 'Immediately when a payment attempt fails', defaultOn: true },
    ],
  },
  {
    title: 'Security',
    sub: 'Account login alerts, device management, and suspicious activity warnings.',
    rows: [
      { label: 'New Login Detected',  desc: 'Alert on any new browser or device sign-in', defaultOn: true },
      { label: 'Password Changed',    desc: 'Confirmation when your password is updated', defaultOn: true },
      { label: 'Suspicious Activity', desc: 'Unusual account behaviour detected', defaultOn: true },
      { label: '2FA Events',          desc: 'When two-factor codes are generated or used', defaultOn: false },
    ],
  },
];

/* ─── Nav routes ─────────────────────────────────────────────────────────────── */
const NAV_ROUTES = {
  'Dashboard':      '/dashboard',
  'Copy Trading':   '/copy-trading',
  'Marketplace':    '/marketplace',
  'Portfolio':      '/portfolio',
  'Insights':       '/insights',
  'Notifications':  '/notifications',
  'Payments':       '/payments',
  'Settings':       '/settings',
};

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function Sidebar({ open, user, wallet, unreadCount }) {
  const initials = user
    ? `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase()
    : '—';
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Loading…';
  // Show raw plan value (basic / pro / elite) + verification status on a second line
  const planLine = user
    ? `${user.plan || 'basic'}${user.is_verified ? ' · ✓ Verified' : ''}`
    : '';

  const currency = user?.currency || 'USD';
  const balance  = wallet ? Number(wallet.balance) : 0;
  const portfolioValue = `${currency} ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const walletSub = wallet
    ? `${wallet.currency} wallet`
    : 'No wallet yet';

  const NAV = [
    { section: 'Trading' },
    { icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { icon: 'ti-users', label: 'Copy Trading' },
    { icon: 'ti-building-store', label: 'Marketplace' },
    { section: 'Analytics' },
    { icon: 'ti-chart-bar', label: 'Portfolio' },
    { icon: 'ti-news', label: 'Insights' },
    { section: 'Account' },
    { icon: 'ti-bell', label: 'Notifications', active: true, badge: unreadCount > 0 ? String(unreadCount) : null },
    { icon: 'ti-credit-card', label: 'Payments' },
    { icon: 'ti-settings', label: 'Settings' },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Wallet Balance</div>
        <div className="in-sb-pill-val">{portfolioValue}</div>
        <div className="in-sb-pill-sub">{walletSub}</div>
      </div>
      <nav className="in-sb-scroll">
        {NAV.map((n, i) =>
          n.section
            ? <div key={i} className="in-sb-section">{n.section}</div>
            : <a
                key={i}
                className={`in-sb-link${n.active ? ' active' : ''}`}
                href={NAV_ROUTES[n.label] || '#'}
                onClick={e => { e.preventDefault(); window.location.href = NAV_ROUTES[n.label] || '#'; }}
              >
                <i className={`ti ${n.icon}`} />{n.label}
                {n.badge && <span className="in-sb-badge">{n.badge}</span>}
              </a>
        )}
      </nav>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{initials}</div>
        <div>
          <div className="in-sb-user-name">{fullName}</div>
          <div className="in-sb-user-role">{planLine}</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu, user, unreadCount }) {
  const initials = user
    ? `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase()
    : '?';
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">Trade<span>Flow</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon">
        <i className="ti ti-bell" />
        {unreadCount > 0 && <div className="in-notif-dot" />}
      </div>
      <div className="in-tb-avatar">{initials}</div>
    </header>
  );
}

/* ── Toggle ── */
function Toggle({ on, onChange }) {
  return (
    <div className={`nt-toggle ${on ? 'on' : 'off'}`} onClick={() => onChange(!on)}>
      <div className="nt-toggle-track" />
      <div className="nt-toggle-thumb" />
    </div>
  );
}

/* ── Heatmap ── */
function Heatmap({ heatData = new Array(28).fill(0), accentColor = '#c8f560' }) {
  const days = ['M','T','W','T','F','S','S'];
  const max = Math.max(...heatData, 1);
  // Parse accent hex → rgba for heat cells
  const hex = (accentColor || '#c8f560').replace('#', '');
  const hr = parseInt(hex.substring(0,2), 16);
  const hg = parseInt(hex.substring(2,4), 16);
  const hb = parseInt(hex.substring(4,6), 16);
  const getColor = (v) => {
    if (v === 0) return 'var(--surface2)';
    const t = v / max;
    if (t < 0.33) return `rgba(${hr},${hg},${hb},.2)`;
    if (t < 0.66) return `rgba(${hr},${hg},${hb},.5)`;
    return `rgba(${hr},${hg},${hb},.85)`;
  };
  return (
    <div className="nt-heatmap-card">
      <div className="nt-panel-title">Activity Heatmap <span style={{ color: T.g, fontSize: 10 }}>4 weeks</span></div>
      <div className="nt-heat-days">{days.map((d,i) => <div key={i} className="nt-heat-day">{d}</div>)}</div>
      <div className="nt-heatmap">
        {heatData.map((v, i) => (
          <div key={i} className="nt-heat-cell" style={{ background: getColor(v) }} title={`${v} notifications`} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 9, color: T.nt }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <div key={t} style={{ width: 10, height: 10, borderRadius: 3, background: t === 0 ? 'var(--surface2)' : `rgba(${hr},${hg},${hb},${t * 0.85})` }} />
        ))}
        <span style={{ fontSize: 9, color: T.nt }}>More</span>
      </div>
    </div>
  );
}

/* ── Category Breakdown ── */
function Breakdown({ notifications = [] }) {
  const cats = [
    { label: 'Trading',  key: 'trade',   icon: 'ti-trending-up',   bg: 'rgba(52,211,153,.15)',  col: '#34d399' },
    { label: 'Market',   key: 'market',  icon: 'ti-building-bank', bg: 'rgba(245,158,11,.15)',  col: '#f59e0b' },
    { label: 'Payments', key: 'payment', icon: 'ti-credit-card',   bg: 'rgba(96,165,250,.15)',  col: '#60a5fa' },
    { label: 'System',   key: 'system',  icon: 'ti-cpu',           bg: 'rgba(167,139,250,.15)', col: '#a78bfa' },
  ].map(c => ({ ...c, count: notifications.filter(n => n.cat === c.key).length }));

  const total = cats.reduce((a, c) => a + c.count, 0) || 1;
  return (
    <div className="nt-breakdown-card">
      <div className="nt-panel-title">By Category <span style={{ color: T.nt }}>{total === 1 ? 0 : total} total</span></div>
      {cats.map(c => (
        <div key={c.label} className="nt-cat-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="nt-cat-icon" style={{ background: c.bg }}>
              <i className={`ti ${c.icon}`} style={{ color: c.col }} />
            </div>
            <span className="nt-cat-name">{c.label}</span>
            <span className="nt-cat-count" style={{ color: c.col }}>{c.count}</span>
          </div>
          <div className="nt-cat-bar-wrap">
            <div className="nt-cat-bar" style={{ width: `${Math.round(c.count / total * 100)}%`, background: c.col }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Quiet Hours ── */
function QuietHours() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load notification_delivery_settings for the current user
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('notification_delivery_settings')
          .select('*')
          .single();
        if (!error && data) setSettings(data);
        else setSettings({ quiet_hours_enabled: true, sound_alerts: true, channel_email: true, channel_push: false });
      } catch {
        setSettings({ quiet_hours_enabled: true, sound_alerts: true, channel_email: true, channel_push: false });
      }
    }
    loadSettings();
  }, []);

  const toggle = async (field) => {
    if (!settings) return;
    const updated = { ...settings, [field]: !settings[field] };
    setSettings(updated);
    setSaving(true);
    try {
      await supabase
        .from('notification_delivery_settings')
        .update({ [field]: updated[field] })
        .eq('user_id', settings.user_id);
    } catch { /* silently ignore */ }
    finally { setSaving(false); }
  };

  const rows = settings ? [
    { label: `Quiet hours (${settings.quiet_start || '22:00'}–${settings.quiet_end || '07:00'})`, field: 'quiet_hours_enabled', val: settings.quiet_hours_enabled },
    { label: 'Email notifications',  field: 'channel_email', val: settings.channel_email },
    { label: 'Push notifications',   field: 'channel_push',  val: settings.channel_push },
    { label: 'Sound alerts',         field: 'sound_alerts',  val: settings.sound_alerts },
  ] : [];

  return (
    <div className="nt-quiet-card">
      <div className="nt-panel-title">Delivery Settings {saving && <span style={{ fontSize: 9, color: T.nt }}>Saving…</span>}</div>
      {!settings
        ? <div style={{ fontSize: 12, color: T.nt, textAlign: 'center', padding: '12px 0' }}>Loading…</div>
        : rows.map(r => (
          <div key={r.label} className="nt-qh-row">
            <span className="nt-qh-label">{r.label}</span>
            <Toggle on={!!r.val} onChange={() => toggle(r.field)} />
          </div>
        ))
      }
    </div>
  );
}

/* ── Feed Panel ── */
function FeedPanel({ filterCat, notifications, loading, onMarkRead, onDismiss, onMarkAllRead, onClearAll, heatData, accentColor = '#c8f560' }) {
  const visible = notifications.filter(n => {
    if (filterCat !== 'all' && n.cat !== filterCat) return false;
    return true;
  });

  const groups = ['Today', 'Yesterday', 'Earlier'];
  const grouped = groups.map(g => ({ g, items: visible.filter(n => n.group === g) })).filter(g => g.items.length > 0);
  const unreadCount = visible.filter(n => n.unread).length;

  return (
    <div>
      <div className="nt-layout">
        <div>
          {/* Feed toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 12, color: T.nt }}>
              {loading
                ? <span style={{ color: T.nt }}>Loading…</span>
                : unreadCount > 0
                  ? <span><strong style={{ color: T.g, fontFamily: T.mono }}>{unreadCount}</strong> unread notifications</span>
                  : <span style={{ color: T.nt }}>All caught up</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {unreadCount > 0 && (
                <button className="in-btn in-btn-ghost in-btn-sm" onClick={onMarkAllRead}>
                  <i className="ti ti-checks" /> Mark all read
                </button>
              )}
              <button className="in-btn in-btn-danger in-btn-sm" onClick={onClearAll}>
                <i className="ti ti-trash" /> Clear all
              </button>
            </div>
          </div>

          {/* Notification feed */}
          <div className="nt-feed">
            {!loading && grouped.length === 0 && (
              <div className="nt-empty">
                <div className="nt-empty-icon"><i className="ti ti-bell-off" /></div>
                <div className="nt-empty-title">No notifications</div>
                <div className="nt-empty-sub">You're all clear — check back later or adjust your filters.</div>
              </div>
            )}
            {grouped.map(({ g, items }) => (
              <div key={g}>
                <div className="nt-group-label">{g}</div>
                {items.map((n, idx) => (
                  <div
                    key={n.id}
                    className={`nt-item${n.unread ? ' unread' : ''}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    onClick={() => n.unread && onMarkRead(n.id)}
                  >
                    <div className="nt-item-dot" style={{ background: n.unread ? n.dotCol : 'transparent' }} />
                    <div className="nt-item-icon" style={{ background: n.iconBg }}>
                      <i className={`ti ${n.icon}`} style={{ color: n.iconCol }} />
                    </div>
                    <div className="nt-item-body">
                      <div className="nt-item-head">
                        <div className="nt-item-title">{n.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="nt-item-time">{n.time}</span>
                          <button
                            className="nt-act-btn nt-dismiss"
                            title="Dismiss"
                            onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
                          >
                            <i className="ti ti-x" />
                          </button>
                        </div>
                      </div>
                      <div className="nt-item-desc">{n.desc}</div>
                      <div className="nt-item-tags">
                        {n.tags.map((t, i) => (
                          <span key={i} className={`in-badge ${t.cls || 'in-badge-muted'}`}>{t.label}</span>
                        ))}
                      </div>
                      {n.actions && n.actions.length > 0 && (
                        <div className="nt-item-actions">
                          {n.actions.map((a, i) => (
                            <button key={i} className={`nt-act-btn${a.primary ? ' primary' : ''}`}
                              onClick={e => { e.stopPropagation(); if (a.url) window.open(a.url, '_blank'); }}>
                              <i className={`ti ${a.icon}`} />{a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="nt-panel">
          <Heatmap heatData={heatData} accentColor={accentColor} />
          <Breakdown notifications={notifications} />
          <QuietHours />
        </div>
      </div>
    </div>
  );
}

/* ── Settings Panel ── */
function SettingsPanel({ settings = DEFAULT_SETTINGS }) {
  const [states, setStates] = useState(() => {
    const init = {};
    PREF_SETTINGS.forEach(card => {
      card.rows.forEach(r => { init[`${card.title}-${r.label}`] = r.defaultOn; });
    });
    return init;
  });

  const toggle = key => setStates(s => ({ ...s, [key]: !s[key] }));

  return (
    <div>
      {/* Digest & frequency card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: .5 }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 18, marginBottom: 4 }}>Notification <em style={{ color: T.g, fontStyle: 'italic' }}>Preferences</em></div>
            <div style={{ fontSize: 12, color: T.nt, lineHeight: 1.6, maxWidth: 480 }}>
              Control exactly which alerts you receive, how often, and through which channels. Changes take effect immediately.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: T.nt }}>Digest Frequency</span>
              <select className="nt-select">
                <option>Real-time</option>
                <option>Hourly digest</option>
                <option>Daily digest</option>
                <option>Weekly digest</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: T.nt }}>Language</span>
              <select className="nt-select">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="nt-settings-grid">
        {PREF_SETTINGS.map(card => (
          <div key={card.title} className="nt-settings-card">
            <div className="nt-settings-card-title">
              {card.titleEm
                ? <em style={{ color: T.g, fontStyle: 'italic' }}>{card.title}</em>
                : card.title}
            </div>
            <div className="nt-settings-card-sub">{card.sub}</div>
            {card.rows.map(r => {
              const key = `${card.title}-${r.label}`;
              return (
                <div key={r.label} className="nt-setting-row">
                  <div>
                    <div className="nt-setting-label">{r.label}</div>
                    <div className="nt-setting-desc">{r.desc}</div>
                  </div>
                  <Toggle on={!!states[key]} onChange={() => toggle(key)} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Applied user_settings info */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '16px 20px', marginTop: 16,
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginRight: 4 }}>
          <i className="ti ti-settings" style={{ marginRight: 5 }} />Active App Settings
        </span>
        {[
          { label: 'Activity Feed',     on: settings.show_activity },
          { label: 'Personalised Feed', on: settings.personalised_feed },
          { label: 'Marketing Emails',  on: settings.marketing_emails },
          { label: 'Show Watchlist',    on: settings.show_watchlist },
        ].map(({ label, on }) => (
          <span key={label} style={{
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 5,
            background: on ? 'var(--accent-dim)' : 'rgba(100,116,139,.1)',
            color: on ? 'var(--accent)' : 'var(--muted)',
            border: `1px solid ${on ? 'rgba(var(--accent),.2)' : 'transparent'}`,
          }}>
            <i className={`ti ${on ? 'ti-check' : 'ti-x'}`} style={{ fontSize: 9, marginRight: 4 }} />
            {label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)' }}>
          Theme: <strong style={{ color: 'var(--accent)' }}>{settings.theme}</strong>
          {' · '}Density: <strong style={{ color: 'var(--accent)' }}>{settings.layout_density}</strong>
        </span>
      </div>

      {/* Save bar */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
        <button className="in-btn in-btn-ghost in-btn-sm">Reset to defaults</button>
        <button className="in-btn in-btn-accent in-btn-sm">
          <i className="ti ti-check" /> Save Preferences
        </button>
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function Notifications() {
  const [tab, setTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── User & Wallet state ───────────────────────────────────────────────────── //
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // ── Notifications state ───────────────────────────────────────────────────── //
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the wallet that matches the user's preferred currency (defaults to 0 balance if none)
  async function fetchWallet(userCurrency) {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const currency = userCurrency || 'USD';
      const { data, error: err } = await supabase
        .from('wallets')
        .select('balance, currency')
        .eq('user_id', authUser.id)
        .eq('currency', currency)
        .maybeSingle();
      setWallet(data || { balance: 0, currency });
    } catch { setWallet({ balance: 0, currency: userCurrency || 'USD' }); }
  }

  // Fetch notifications (non-dismissed) for current user
  async function fetchNotifications() {
    setLoading(true);
    setError(null);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');
      const { data, error: err } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(100);
      if (err) throw err;
      const mapped = (data || []).map(row => ({
        ...mapDbNotification(row),
        _created_at:   row.created_at,
        _is_dismissed: row.is_dismissed,
      }));
      setNotifications(mapped);
    } catch (e) {
      setError(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetch user, wallet, settings in parallel
    (async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;
        const [{ data: userData }, { data: userSettings }] = await Promise.all([
          supabase
            .from('users')
            .select('id, first_name, last_name, plan, is_verified, currency, avatar_url, handle')
            .eq('id', authUser.id)
            .single(),
          supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', authUser.id)
            .single(),
        ]);
        if (userData) {
          setUser(userData);
          await fetchWallet(userData.currency);
        }
        if (userSettings) setSettings({ ...DEFAULT_SETTINGS, ...userSettings });
      } catch { /* ignore */ }
    })();
    fetchNotifications();
  }, []);

  // ── Mutations ─────────────────────────────────────────────────────────────── //
  async function handleMarkRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    try { await supabase.from('notifications').update({ is_read: true }).eq('id', id); }
    catch { fetchNotifications(); }
  }

  async function handleDismiss(id) {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try { await supabase.from('notifications').update({ is_dismissed: true }).eq('id', id); }
    catch { fetchNotifications(); }
  }

  async function handleMarkAllRead() {
    const ids = notifications.filter(n => n.unread).map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    try { await supabase.from('notifications').update({ is_read: true }).in('id', ids); }
    catch { fetchNotifications(); }
  }

  async function handleClearAll() {
    const ids = notifications.map(n => n.id);
    setNotifications([]);
    try { await supabase.from('notifications').update({ is_dismissed: true }).in('id', ids); }
    catch { fetchNotifications(); }
  }

  // ── Derived data ──────────────────────────────────────────────────────────── //
  const metricsData  = buildMetrics(notifications);
  const heatData     = buildHeatmap(notifications);
  const unread       = notifications.filter(n => n.unread).length;

  const CAT_TABS = [
    { key: 'all',      label: 'All',      icon: 'ti-bell',                      count: notifications.length },
    { key: 'trade',    label: 'Trading',  icon: 'ti-trending-up',               count: notifications.filter(n => n.cat === 'trade').length },
    { key: 'market',   label: 'Market',   icon: 'ti-building-bank',             count: notifications.filter(n => n.cat === 'market').length },
    { key: 'payment',  label: 'Payments', icon: 'ti-credit-card',               count: notifications.filter(n => n.cat === 'payment').length },
    { key: 'system',   label: 'System',   icon: 'ti-cpu',                       count: notifications.filter(n => n.cat === 'system').length },
    { key: 'settings', label: 'Settings', icon: 'ti-adjustments-horizontal',    count: null },
  ];

  const dynamicVars = buildThemeVars(settings);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {/* Per-user theme / density / accent overrides */}
      <style dangerouslySetInnerHTML={{ __html: `:root { ${dynamicVars} }` }} />
      {/* Grid lines toggle */}
      {!settings.show_grid_lines && (
        <style dangerouslySetInnerHTML={{ __html: `
          .nt-cat-bar-wrap { display: none; }
          .nt-setting-row { border-bottom-color: transparent !important; }
          .nt-group-label::after { display: none; }
        `}} />
      )}

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 299 }} />
      )}

      <div className="in-shell">
        <Sidebar open={sidebarOpen} user={user} wallet={wallet} unreadCount={unread} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} unreadCount={unread} />

          <main className="in-main">
            {/* Page header */}
            <div className="in-page-header">
              <div>
                <div className="in-page-title">
                  <em>Notifications</em>
                  {unread > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: T.rd, borderRadius: '50%', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: T.mono, marginLeft: 10, verticalAlign: 'middle' }}>
                      {unread}
                    </span>
                  )}
                </div>
                <div className="in-page-sub">
                  <span className="in-live-dot" />
                  Real-time alerts for trades, payments, market events, and account activity.
                </div>
              </div>
              <div className="in-header-actions">
                <button className="in-btn in-btn-ghost in-btn-sm" onClick={fetchNotifications}>
                  <i className="ti ti-refresh" /> Refresh
                </button>
                <button className="in-btn in-btn-accent in-btn-sm">
                  <i className="ti ti-bell-plus" /> Create Alert
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 'var(--r-md)', padding: '10px 16px', marginBottom: 16, fontSize: 13, color: T.rd, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-alert-triangle" /> {error}
                <button className="in-btn in-btn-ghost in-btn-sm" style={{ marginLeft: 'auto' }} onClick={fetchNotifications}>Retry</button>
              </div>
            )}

            {/* Metrics */}
            <div className="nt-metrics">
              {metricsData.map(m => (
                <div key={m.label} className="nt-metric">
                  <div className="nt-metric-icon" style={{ background: m.bg }}>
                    <i className={`ti ${m.icon}`} style={{ color: m.col }} />
                  </div>
                  <div className="nt-metric-label">{m.label}</div>
                  <div className="nt-metric-value">{loading ? '—' : m.value}</div>
                  <div className="nt-metric-sub" style={{ color: m.col }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="in-controls">
              <div className="in-tabs">
                {CAT_TABS.map(({ key, label, icon, count }) => (
                  <button key={key} className={`in-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
                    <i className={`ti ${icon}`} />
                    {label}
                    {count !== null && <span className="nt-tab-count">{count}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {tab === 'settings'
              ? <SettingsPanel settings={settings} />
              : <FeedPanel
                  filterCat={tab}
                  notifications={notifications}
                  loading={loading}
                  heatData={heatData}
                  onMarkRead={handleMarkRead}
                  onDismiss={handleDismiss}
                  onMarkAllRead={handleMarkAllRead}
                  onClearAll={handleClearAll}
                  accentColor={settings.show_activity ? (settings.accent_color || '#c8f560') : '#64748b'}
                />
            }
          </main>
        </div>
      </div>
    </>
  );
}