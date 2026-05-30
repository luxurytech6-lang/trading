import React, { useState, useEffect } from 'react';
import supabase from '../supabase';

/* ─── Design tokens (matches TradeFlow shell) ────────────────────────────────── */
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
    --bg:#080b10; --surface:#0e1219; --surface2:#141922;
    --border:#1e2535; --border2:#2a3347;
    --text:#e2e8f0; --muted:#64748b; --faint:#374151;
    --accent:#c8f560; --accent-rgb:200,245,96; --accent-dim:rgba(200,245,96,.12); --accent-glow:rgba(200,245,96,.06);
    --green:#34d399; --green-dim:rgba(52,211,153,.12);
    --red:#f87171; --red-dim:rgba(248,113,113,.12);
    --blue:#60a5fa; --blue-dim:rgba(96,165,250,.12);
    --purple:#a78bfa; --purple-dim:rgba(167,139,250,.12);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,.12);
    --sidebar-w:256px; --topbar-h:60px;
    --sans:'Space Grotesk',sans-serif;
    --serif:'Instrument Serif',serif;
    --mono:'JetBrains Mono',monospace;
    --r-sm:8px; --r-md:12px; --r-lg:16px;
  }

  body, #root {
    font-family:var(--sans); background:var(--bg); color:var(--text);
    height:100vh; overflow:hidden; -webkit-font-smoothing:antialiased;
  }
  a { color:inherit; text-decoration:none; }
  button { font-family:var(--sans); cursor:pointer; border:none; background:none; }
  input, select, textarea { font-family:var(--sans); }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  /* ── Shell ── */
  .sb-shell { display:grid; grid-template-columns:var(--sidebar-w) 1fr; height:100vh; overflow:hidden; }

  /* ── Sidebar ── */
  .sb-sidebar {
    background:var(--surface); border-right:1px solid var(--border);
    display:flex; flex-direction:column; height:100vh;
    overflow-y:auto; overflow-x:hidden; position:relative; z-index:100;
    flex-shrink:0; transition:transform .25s cubic-bezier(.4,0,.2,1);
  }
  .sb-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
  .sb-sidebar::after {
    content:''; position:absolute; top:0; right:0; width:1px; height:100%;
    background:linear-gradient(180deg,transparent 0%,var(--accent) 30%,var(--border) 60%,transparent 100%);
    opacity:.15; pointer-events:none;
  }
  .sb-brand { display:flex; align-items:center; gap:10px; padding:20px 20px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .sb-brand-icon { width:34px; height:34px; background:var(--accent); border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sb-brand-icon i { font-size:18px; color:#000; }
  .sb-brand-name { font-size:16px; font-weight:700; color:var(--text); }
  .sb-brand-name em { color:var(--accent); font-style:normal; }
  .sb-pill { margin:12px 16px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.18); border-radius:var(--r-md); padding:10px 14px; flex-shrink:0; }
  .sb-pill-label { font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
  .sb-live-dot { width:6px; height:6px; background:var(--green); border-radius:50%; animation:sb-pulse 2s infinite; flex-shrink:0; }
  @keyframes sb-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .sb-pill-val { font-family:var(--mono); font-size:19px; font-weight:600; color:var(--accent); letter-spacing:-.5px; }
  .sb-pill-sub { font-size:11px; color:var(--green); margin-top:3px; }
  .sb-scroll { flex:1; overflow-y:auto; padding:8px 0; }
  .sb-section { padding:10px 20px 4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); }
  .sb-link { display:flex; align-items:center; gap:11px; padding:9px 20px; font-size:13px; font-weight:500; color:var(--muted); border-left:2px solid transparent; transition:all .15s; cursor:pointer; text-decoration:none; }
  .sb-link i { font-size:18px; flex-shrink:0; }
  .sb-link:hover { color:var(--text); background:var(--accent-glow); border-left-color:var(--border2); }
  .sb-link.active { color:var(--accent); background:var(--accent-dim); border-left-color:var(--accent); }
  .sb-link.active i { filter:drop-shadow(0 0 6px var(--accent)); }
  .sb-badge { margin-left:auto; font-size:9px; font-weight:700; background:var(--accent); color:#000; padding:2px 6px; border-radius:5px; }
  .sb-user { flex-shrink:0; border-top:1px solid var(--border); padding:14px 16px; display:flex; align-items:center; gap:10px; }
  .sb-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%); color:#000; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 0 12px rgba(200,245,96,.3); }
  .sb-user-name { font-size:13px; font-weight:700; }
  .sb-user-role { font-size:10px; color:var(--accent); margin-top:1px; }

  /* ── Right panel ── */
  .sb-right { grid-column:2; display:flex; flex-direction:column; height:100vh; overflow:hidden; }

  /* ── Topbar ── */
  .sb-topbar { height:var(--topbar-h); flex-shrink:0; display:flex; align-items:center; padding:0 28px; background:var(--surface); border-bottom:1px solid var(--border); gap:16px; z-index:50; }
  .sb-topbar-title { font-family:var(--serif); font-size:20px; color:var(--text); flex:1; }
  .sb-topbar-title span { color:var(--accent); font-style:italic; }
  .sb-tb-icon { width:36px; height:36px; border-radius:var(--r-sm); background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; color:var(--muted); font-size:18px; position:relative; }
  .sb-tb-icon:hover { border-color:var(--border2); color:var(--text); }
  .sb-notif-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; background:var(--red); border-radius:50%; border:1.5px solid var(--surface); }
  .sb-tb-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%); color:#000; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 0 10px rgba(200,245,96,.25); }
  .sb-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; }
  .sb-hamburger span { display:block; width:20px; height:2px; background:var(--text); border-radius:2px; }

  /* ── Main ── */
  .sb-main { flex:1; overflow-y:auto; overflow-x:hidden; padding:24px 28px 40px; }

  /* ── Buttons ── */
  .in-btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; border-radius:var(--r-sm); font-family:var(--sans); font-weight:600; cursor:pointer; transition:all .15s; border:none; text-decoration:none; white-space:nowrap; }
  .in-btn-sm { font-size:12px; padding:7px 14px; }
  .in-btn-md { font-size:13px; padding:10px 20px; }
  .in-btn-lg { font-size:14px; padding:13px 24px; }
  .in-btn-full { width:100%; justify-content:center; }
  .in-btn-accent { background:var(--accent); color:#000; }
  .in-btn-accent:hover { opacity:.88; box-shadow:0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .in-btn-ghost:hover { border-color:var(--border2); }
  .in-btn-danger { background:var(--red-dim); border:1px solid rgba(248,113,113,.2); color:var(--red); }
  .in-btn-danger:hover { background:rgba(248,113,113,.2); }

  /* ── Badge ── */
  .in-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap; }
  .in-badge-green { background:var(--green-dim); color:var(--green); }
  .in-badge-blue { background:var(--blue-dim); color:var(--blue); }
  .in-badge-gold { background:var(--accent-dim); color:var(--accent); }
  .in-badge-purple { background:var(--purple-dim); color:var(--purple); }
  .in-badge-amber { background:var(--amber-dim); color:var(--amber); }
  .in-badge-muted { background:rgba(100,116,139,.12); color:var(--muted); }

  /* ── Page header ── */
  .pg-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; }
  .pg-title { font-family:var(--serif); font-size:28px; color:var(--text); line-height:1.2; }
  .pg-title em { color:var(--accent); font-style:italic; }
  .pg-sub { font-size:13px; color:var(--muted); margin-top:4px; display:flex; align-items:center; gap:8px; }

  /* ══════════════════════════════════════════
     SUBSCRIPTION PAGE SPECIFIC STYLES
  ══════════════════════════════════════════ */

  /* ── Current Plan Banner ── */
  .cur-plan-banner {
    position:relative; overflow:hidden;
    border-radius:var(--r-lg); padding:24px 28px; margin-bottom:28px;
    background:linear-gradient(135deg, rgba(200,245,96,.07) 0%, rgba(200,245,96,.02) 60%, transparent 100%);
    border:1px solid rgba(200,245,96,.2);
  }
  .cur-plan-banner::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, var(--accent) 40%, var(--accent) 60%, transparent);
    opacity:.6;
  }
  .cur-plan-glow {
    position:absolute; top:-60px; right:-60px; width:220px; height:220px;
    border-radius:50%; background:radial-gradient(circle, rgba(200,245,96,.08) 0%, transparent 70%);
    pointer-events:none;
  }
  .cur-plan-row { display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; position:relative; z-index:1; }
  .cur-plan-left { display:flex; align-items:center; gap:16px; }
  .cur-plan-icon { width:46px; height:46px; border-radius:12px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.25); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .cur-plan-name { font-size:20px; font-weight:700; color:var(--accent); margin-bottom:2px; }
  .cur-plan-meta { font-size:12px; color:var(--muted); display:flex; align-items:center; gap:10px; }
  .cur-plan-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .cur-plan-price { font-family:var(--mono); font-size:28px; font-weight:700; color:var(--text); }
  .cur-plan-price span { font-size:13px; color:var(--muted); font-family:var(--sans); }

  /* Usage pills row */
  .usage-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
  .usage-pill { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:16px 18px; transition:all .2s; }
  .usage-pill:hover { border-color:var(--border2); transform:translateY(-1px); }
  .usage-pill-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin-bottom:8px; }
  .usage-pill-nums { display:flex; align-items:baseline; gap:4px; margin-bottom:8px; }
  .usage-pill-used { font-family:var(--mono); font-size:18px; font-weight:700; }
  .usage-pill-total { font-size:11px; color:var(--muted); }
  .usage-track { height:5px; background:var(--surface2); border-radius:99px; overflow:hidden; }
  .usage-fill { height:100%; border-radius:99px; transition:width .4s ease; }

  /* ── Billing Toggle ── */
  .billing-toggle-wrap {
    display:flex; align-items:center; justify-content:center; gap:14px;
    margin-bottom:32px;
  }
  .billing-label { font-size:13px; font-weight:600; transition:color .2s; }
  .toggle-pill { position:relative; width:44px; height:24px; cursor:pointer; flex-shrink:0; }
  .toggle-pill input { opacity:0; width:0; height:0; position:absolute; }
  .toggle-track { position:absolute; inset:0; border-radius:12px; background:var(--accent); transition:background .2s; }
  .toggle-thumb { position:absolute; top:3px; width:18px; height:18px; border-radius:50%; background:#000; transition:left .2s; }
  .toggle-pill input:checked ~ .toggle-track { background:var(--accent); }
  .toggle-pill input:checked ~ .toggle-thumb { left:23px; }
  .toggle-pill input:not(:checked) ~ .toggle-track { background:var(--border2); }
  .toggle-pill input:not(:checked) ~ .toggle-thumb { left:3px; }
  .save-badge { background:rgba(52,211,153,.15); border:1px solid rgba(52,211,153,.25); color:var(--green); font-size:10px; font-weight:700; padding:3px 8px; border-radius:4px; letter-spacing:.3px; }

  /* ── Plan Cards Grid ── */
  .plans-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; }

  .plan-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--r-lg); padding:24px; position:relative;
    overflow:hidden; cursor:pointer; transition:all .2s;
    display:flex; flex-direction:column;
  }
  .plan-card:hover { border-color:var(--border2); transform:translateY(-2px); }
  .plan-card.featured {
    border-color:rgba(200,245,96,.35);
    background:linear-gradient(150deg, rgba(200,245,96,.06) 0%, rgba(200,245,96,.02) 50%, var(--surface) 100%);
  }
  .plan-card.featured::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
  }
  .plan-card.current-plan {
    border-color:rgba(96,165,250,.35);
    background:linear-gradient(150deg, rgba(96,165,250,.05) 0%, var(--surface) 100%);
  }
  .plan-card.current-plan::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent 0%, var(--blue) 50%, transparent 100%);
  }

  /* Floating badge */
  .plan-float-badge {
    position:absolute; top:16px; right:16px;
    font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.8px;
    padding:3px 9px; border-radius:4px;
  }
  .plan-float-badge.popular { background:var(--accent); color:#000; }
  .plan-float-badge.current { background:var(--blue-dim); border:1px solid rgba(96,165,250,.3); color:var(--blue); }

  .plan-tier { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1.8px; color:var(--muted); margin-bottom:6px; }
  .plan-name { font-family:var(--serif); font-size:24px; margin-bottom:4px; }
  .plan-name.accent-name { color:var(--accent); }
  .plan-name.blue-name { color:var(--blue); }
  .plan-desc { font-size:12px; color:var(--muted); line-height:1.6; margin-bottom:20px; }

  .plan-price-row { display:flex; align-items:baseline; gap:4px; margin-bottom:4px; }
  .plan-price-cur { font-size:16px; font-weight:600; color:var(--muted); margin-top:4px; }
  .plan-price-val { font-family:var(--mono); font-size:36px; font-weight:700; line-height:1; }
  .plan-price-per { font-size:12px; color:var(--muted); }
  .plan-save { font-size:11px; color:var(--green); margin-bottom:20px; min-height:18px; }

  .plan-divider { height:1px; background:var(--border); margin:18px 0; }

  .plan-feature { display:flex; align-items:flex-start; gap:9px; font-size:12px; margin-bottom:9px; line-height:1.4; }
  .plan-feature i { font-size:14px; flex-shrink:0; margin-top:1px; }
  .plan-feature.yes i { color:var(--green); }
  .plan-feature.no { opacity:.45; }
  .plan-feature.no i { color:var(--muted); }

  .plan-cta-wrap { margin-top:auto; padding-top:18px; }

  /* ── FAQ Accordion ── */
  .faq-section { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; margin-bottom:28px; }
  .faq-head { padding:18px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:8px; }
  .faq-head-title { font-family:var(--serif); font-size:16px; }
  .faq-head-title em { color:var(--accent); font-style:italic; }
  .faq-item { border-bottom:1px solid var(--border); }
  .faq-item:last-child { border-bottom:none; }
  .faq-q { width:100%; text-align:left; padding:16px 22px; display:flex; align-items:center; justify-content:space-between; gap:12px; font-size:13px; font-weight:600; color:var(--text); cursor:pointer; transition:background .15s; background:none; border:none; font-family:var(--sans); }
  .faq-q:hover { background:var(--accent-glow); }
  .faq-q.open { color:var(--accent); }
  .faq-chevron { font-size:16px; color:var(--muted); transition:transform .2s; flex-shrink:0; }
  .faq-q.open .faq-chevron { transform:rotate(180deg); color:var(--accent); }
  .faq-a { padding:0 22px 16px; font-size:13px; color:var(--muted); line-height:1.7; }

  /* ── Confirm / Checkout Modal ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.72); z-index:600; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(4px); }
  .modal-box { background:var(--surface); border:1px solid var(--border2); border-radius:18px; width:100%; max-width:460px; max-height:90vh; overflow-y:auto; padding:26px; position:relative; animation:modal-in .22s ease; }
  @keyframes modal-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .modal-close { position:absolute; top:16px; right:16px; background:transparent; border:1px solid var(--border); color:var(--muted); border-radius:8px; width:28px; height:28px; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .modal-close:hover { border-color:var(--red); color:var(--red); }

  /* Order summary inside modal */
  .sum-card { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-md); padding:16px; margin-bottom:18px; }
  .sum-row { display:flex; align-items:center; justify-content:space-between; font-size:13px; padding:5px 0; }
  .sum-row-label { color:var(--muted); }
  .sum-divider { height:1px; background:var(--border); margin:10px 0; }
  .sum-total { display:flex; justify-content:space-between; align-items:baseline; }
  .sum-total-label { font-size:13px; font-weight:700; }
  .sum-total-val { font-family:var(--mono); font-size:22px; font-weight:700; color:var(--accent); }

  /* Payment method selector */
  .pm-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }
  .pm-btn { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-sm); padding:10px 12px; cursor:pointer; transition:all .15s; display:flex; align-items:center; gap:8px; }
  .pm-btn:hover { border-color:var(--border2); }
  .pm-btn.sel { border-color:rgba(200,245,96,.4); background:var(--accent-dim); }
  .pm-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
  .pm-name { font-size:12px; font-weight:600; }
  .pm-sub { font-size:10px; color:var(--muted); margin-top:1px; }

  /* Card input */
  .card-field { margin-bottom:12px; }
  .card-field label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); display:block; margin-bottom:6px; }
  .card-input { width:100%; background:var(--surface2); border:1px solid var(--border); color:var(--text); border-radius:var(--r-sm); padding:9px 12px; font-size:13px; outline:none; transition:border-color .15s; }
  .card-input:focus { border-color:var(--accent); }

  /* Security note */
  .sec-note { display:flex; align-items:flex-start; gap:8px; font-size:11px; color:var(--muted); background:var(--surface2); border-radius:var(--r-sm); padding:10px 12px; margin-bottom:16px; line-height:1.5; }
  .sec-note i { color:var(--green); font-size:14px; flex-shrink:0; margin-top:1px; }

  /* Success state */
  .success-ring { width:62px; height:62px; border-radius:50%; background:var(--accent-dim); border:2px solid var(--accent); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:26px; color:var(--accent); animation:pop-in .4s cubic-bezier(.22,1,.36,1); }
  @keyframes pop-in { from { transform:scale(.6); opacity:0; } to { transform:scale(1); opacity:1; } }

  /* ── Testimonials strip ── */
  .testi-strip { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:28px; }
  .testi-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:18px; }
  .testi-stars { color:var(--accent); font-size:11px; letter-spacing:2px; margin-bottom:10px; }
  .testi-body { font-size:12px; color:var(--muted); line-height:1.7; margin-bottom:12px; font-style:italic; }
  .testi-author { display:flex; align-items:center; gap:8px; }
  .testi-av { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:#000; flex-shrink:0; }
  .testi-name { font-size:12px; font-weight:700; }
  .testi-role { font-size:10px; color:var(--muted); }

  /* ── Guarantee banner ── */
  .guarantee-bar { display:flex; align-items:center; gap:16px; background:rgba(52,211,153,.05); border:1px solid rgba(52,211,153,.18); border-radius:var(--r-md); padding:14px 18px; margin-bottom:28px; }
  .guarantee-icon { width:38px; height:38px; border-radius:10px; background:var(--green-dim); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .guarantee-title { font-size:13px; font-weight:700; color:var(--green); margin-bottom:2px; }
  .guarantee-sub { font-size:12px; color:var(--muted); }

  /* ── Responsive ── */
  @media (max-width:1100px) {
    .plans-grid { grid-template-columns:1fr 1fr; }
    .usage-row { grid-template-columns:repeat(2,1fr); }
    .testi-strip { grid-template-columns:1fr 1fr; }
  }
  @media (max-width:768px) {
    .sb-shell { grid-template-columns:1fr !important; }
    .sb-sidebar { position:fixed !important; top:0 !important; left:0 !important; transform:translateX(-100%) !important; z-index:300 !important; }
    .sb-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
    .sb-right { grid-column:1; }
    .sb-hamburger { display:flex; }
  }
  @media (max-width:640px) {
    .plans-grid { grid-template-columns:1fr; }
    .usage-row { grid-template-columns:1fr 1fr; }
    .testi-strip { grid-template-columns:1fr; }
    .sb-main { padding:16px; }
    .sb-topbar { padding:0 16px; }
  }
`;

/* ─── Data ───────────────────────────────────────────────────────────────────── */





const FAQS = [
  { q: 'Can I switch plans at any time?',
    a: 'Yes — you can upgrade or downgrade anytime. Upgrades take effect immediately with a prorated charge. Downgrades take effect at the end of your current billing period.' },
  { q: 'Is there a free trial for Pro or Elite?',
    a: 'Pro includes a 14-day free trial for new accounts. Elite plans include a 7-day trial. No credit card is required to start a trial.' },
  { q: 'What happens to my copy trades if I downgrade?',
    a: 'Active copy relationships above your new plan\'s limit are paused automatically. You\'ll receive a notification and have 7 days to decide which ones to keep before any are cancelled.' },
  { q: 'Are there any hidden fees?',
    a: 'None. The price you see is the price you pay. Payment processing fees are absorbed by TradeFlow. Crypto payments may incur network gas fees outside our control.' },
  { q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel from this page at any time. You keep access until the end of the billing period — no penalties, no questions asked.' },
  { q: 'Do you offer discounts for annual billing?',
    a: 'Yes — all plans are billed annually, saving you ~20% compared to a monthly equivalent rate.' },
];

const TESTIMONIALS = [
  { stars: 5, body: '"Upgrading to Pro was the best financial decision I made this year. The AI predictions alone paid for 6 months of subscription in the first week."', name: 'James K.', role: 'Retail Investor · London', initials: 'JK', bg: '#1A2A4A' },
  { stars: 5, body: '"Elite plan gives me the API access I need to run my own signals on top of the platform. The dedicated manager is genuinely responsive."', name: 'Tariq M.', role: 'Family Office · Dubai', initials: 'TM', bg: '#2A1A1A' },
  { stars: 5, body: '"The 14-day Pro trial hooked me immediately. The advanced risk controls saved me during a volatile week I would have blown through otherwise."', name: 'Sofia R.', role: 'Portfolio Manager · São Paulo', initials: 'SR', bg: '#1A3A2A' },
];


/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function initials(name = '') {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}
function fmtMoney(n, currency = 'USD') {
  if (n == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}
function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ─── Plan display config (visual-only, not data) ───────────────────────────── */
const PLAN_VISUAL = {
  basic: { tier: 'Starter',      nameClass: '',           featured: false, icon: '◎' },
  pro:   { tier: 'Most Popular', nameClass: 'accent-name', featured: true,  icon: '⚡' },
  elite: { tier: 'Enterprise',   nameClass: '',           featured: false, icon: '♦' },
};

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
    --bg:#f0f2f5; --surface:#ffffff; --surface2:#f5f7fa;
    --border:#e2e6ed; --border2:#c8cdd8;
    --text:#0f1623; --muted:#64748b; --faint:#9aa5b4;
    --accent-glow:rgba(var(--accent-rgb),.06);
  }
  body, #root { background:var(--bg); color:var(--text); }
  .sb-sidebar { background:var(--surface) !important; border-color:var(--border) !important; }
  .sb-topbar  { background:var(--surface); border-color:var(--border); }
  .usage-pill, .plan-card, .faq-section, .sum-card, .modal-box { background:var(--surface); border-color:var(--border); }
  .usage-track, .sum-card { background:var(--surface2); }
  .pm-btn, .sb-pill { background:var(--surface2); border-color:var(--border); }
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

/* ─── Data hook ──────────────────────────────────────────────────────────────── */
function useSubscriptionData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authUser) throw new Error('Not authenticated');
        const uid = authUser.id;

        const [plansRes, subRes, usageRes, userRes, walletRes, copyRes, settingsRes] = await Promise.all([
          // All available plans — ordered by price so cards render Basic → Pro → Elite
          supabase.from('subscription_plans')
            .select('*')
            .order('annual_price', { ascending: true }),

          // User's active subscription + plan details
          supabase.from('user_subscriptions')
            .select('*, subscription_plans(*)')
            .eq('user_id', uid)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),

          // Current period usage
          supabase.from('usage_metrics')
            .select('*')
            .eq('user_id', uid)
            .order('period_start', { ascending: false })
            .limit(1)
            .maybeSingle(),

          // User profile for sidebar
          supabase.from('users')
            .select('first_name, last_name, plan, currency')
            .eq('id', uid)
            .single(),

          // Wallet balance for sidebar pill
          supabase.from('wallets')
            .select('balance, currency')
            .eq('user_id', uid)
            .eq('currency', 'USD')
            .maybeSingle(),

          // Active copy relationships count for sidebar badge
          supabase.from('copy_relationships')
            .select('id')
            .eq('copier_id', uid)
            .eq('status', 'active'),

          // User settings for theming
          supabase.from('user_settings')
            .select('*')
            .eq('user_id', uid)
            .maybeSingle(),
        ]);

        if (plansRes.error) throw plansRes.error;
        if (userRes.error)  throw userRes.error;

        const activePlan = subRes.data?.subscription_plans || null;

        setData({
          plans:      plansRes.data || [],
          subscription: subRes.data,
          activePlan,
          usage:      usageRes.data,
          user:       userRes.data,
          wallet:     walletRes.data,
          copyCount:  (copyRes.data || []).length,
          settings:   settingsRes.data || null,
        });
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────────── */
function Sidebar({ open, user = {}, wallet, copyCount = 0 }) {
  const ini       = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const fullName  = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Loading…';
  const planLabel = user.plan ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} · Verified` : 'Basic · Verified';
  const portfolioVal = fmtMoney(wallet?.balance ?? 0, wallet?.currency || user.currency || 'USD');

  const NAV = [
    { section: 'Main' },
    { href: '/dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { href: '/copy-trading', icon: 'ti-copy',             label: 'Copy Trading', badge: copyCount || null },
    { href: '/hire-trader',  icon: 'ti-users',            label: 'Hire a Trader' },
    { href: '/insights',     icon: 'ti-chart-line',       label: 'Insights' },
    { href: '/market-place', icon: 'ti-robot',            label: 'Marketplace', badge: 'NEW' },
    { href: '/terminal',     icon: 'ti-chart-candle',     label: 'Terminal' },
    { section: 'Account' },
    { href: '/payments',     icon: 'ti-credit-card',      label: 'Payments' },
    { href: '/subscription', icon: 'ti-crown',            label: 'Subscription', active: true },
    { href: '/profile',      icon: 'ti-user-circle',      label: 'Profile' },
    { href: '/settings',     icon: 'ti-settings',         label: 'Settings' },
    { href: '/support',      icon: 'ti-headset',          label: 'Support' },
  ];

  return (
    <aside className={`sb-sidebar${open ? ' open' : ''}`}>
      <div className="sb-brand">
        <div className="sb-brand-icon"><i className="ti ti-trending-up" /></div>
        <div className="sb-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="sb-pill">
        <div className="sb-pill-label"><span className="sb-live-dot" />Live Portfolio</div>
        <div className="sb-pill-val">{portfolioVal}</div>
        <div className="sb-pill-sub">Live from wallet</div>
      </div>
      <div className="sb-scroll">
        {NAV.map((n, i) =>
          n.section
            ? <div key={i} className="sb-section">{n.section}</div>
            : (
              <a key={i} className={`sb-link${n.active ? ' active' : ''}`} href={n.href}>
                <i className={`ti ${n.icon}`} />{n.label}
                {n.badge && <span className="sb-badge">{n.badge}</span>}
              </a>
            )
        )}
      </div>
      <div className="sb-user">
        <div className="sb-avatar">{ini}</div>
        <div>
          <div className="sb-user-name">{fullName}</div>
          <div className="sb-user-role">{planLabel}</div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Topbar ──────────────────────────────────────────────────────────────────── */
function Topbar({ onMenu, user = {}, settings }) {
  const ini = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const themeIcon = settings?.theme === 'light' ? 'ti-sun' : settings?.theme === 'system' ? 'ti-brightness' : 'ti-moon';
  return (
    <div className="sb-topbar">
      <div className="sb-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="sb-topbar-title">Trade<span>Flow</span></div>
      <div className="sb-tb-icon" title={`Theme: ${settings?.theme || 'dark'}`}>
        <i className={`ti ${themeIcon}`} />
      </div>
      <div className="sb-tb-icon"><a href='/notification'><i className="ti ti-bell" />
      <span className="sb-notif-dot" /></a></div>
      <div className="sb-tb-icon"><a href='/settings'><i className="ti ti-settings" /></a></div>
      <a href='/profile'><div className="sb-tb-avatar">{ini || '?'}</div></a>
    </div>
  );
}

/* ─── Current Plan Banner ────────────────────────────────────────────────────── */
function CurrentPlanBanner({ subscription, activePlan }) {
  if (!activePlan) return null;
  const price = Number(activePlan.annual_price) * 12;
  const nextDate  = subscription?.current_period_end ? fmtDate(subscription.current_period_end) : '—';
  const billing   = subscription?.billing_cycle || 'annual';
  const visual    = PLAN_VISUAL[activePlan.name] || { icon: '⚡' };
  const planLabel = activePlan.name.charAt(0).toUpperCase() + activePlan.name.slice(1);
  return (
    <div className="cur-plan-banner">
      <div className="cur-plan-glow" />
      <div className="cur-plan-row">
        <div className="cur-plan-left">
          <div className="cur-plan-icon">{visual.icon}</div>
          <div>
            <div className="cur-plan-name">{planLabel} Plan</div>
            <div className="cur-plan-meta">
              <span className="in-badge in-badge-blue">Active</span>
              <span>Renews {nextDate}</span>
              <span>·</span>
              <span>Annual billing</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="cur-plan-price">
            {price === 0 ? 'Free' : `$${price.toFixed(0)}`}
{price > 0 && <span>/yr</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="in-btn in-btn-ghost in-btn-sm">
              <i className="ti ti-file-invoice" /> Invoices
            </button>
            <button className="in-btn in-btn-ghost in-btn-sm" style={{ color: T.rd, borderColor: 'rgba(248,113,113,.2)', background: 'var(--red-dim)' }}>
              <i className="ti ti-x" /> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Usage Row ──────────────────────────────────────────────────────────────── */
function UsageRow({ usage, activePlan }) {
  const rows = [
    { label: 'Copy Traders',  used: usage?.copy_traders_used || 0, total: activePlan?.max_copy_traders  || 0,    color: '#c8f560' },
    { label: 'Price Alerts',  used: usage?.alerts_used       || 0, total: activePlan?.max_alerts         || 0,    color: '#60a5fa' },
    { label: 'Watchlist',     used: usage?.watchlist_used    || 0, total: activePlan?.max_watchlist      || 0,    color: '#a78bfa' },
  ];
  return (
    <div className="usage-row">
      {rows.map(u => {
        const pct    = u.total > 0 ? Math.min(100, Math.round((u.used / u.total) * 100)) : 0;
        const isHigh = pct >= 80;
        return (
          <div key={u.label} className="usage-pill">
            <div className="usage-pill-label">{u.label}</div>
            <div className="usage-pill-nums">
              <span className="usage-pill-used" style={{ color: isHigh ? T.am : u.color }}>
                {u.used.toLocaleString()}
              </span>
              <span className="usage-pill-total">
                {u.total > 0 ? `/ ${u.total.toLocaleString()}` : '/ —'}
              </span>
            </div>
            <div className="usage-track">
              <div className="usage-fill" style={{ width: `${pct}%`, background: isHigh ? T.am : u.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}


/* ─── Plan Card ──────────────────────────────────────────────────────────────── */
function PlanCard({ plan, currentPlanId, onSelect }) {
  const visual      = PLAN_VISUAL[plan.name] || { tier: plan.name, nameClass: '', featured: false, icon: '◎' };
  const isCurrent   = plan.id === currentPlanId;
  const price = Number(plan.annual_price) * 12;
  const planLabel   = plan.name.charAt(0).toUpperCase() + plan.name.slice(1);

  // Build feature rows from DB columns
  // Read from actual DB columns + JSONB features object
  const f         = plan.features || {};
  const unlimited = (v) => v == null;
  const features  = [
    { yes: true,                      label: unlimited(plan.max_copy_traders) ? 'Unlimited copy traders'   : `Up to ${plan.max_copy_traders} copy traders` },
    { yes: true,                      label: unlimited(plan.max_allocation)   ? 'Unlimited copy allocation': `$${Number(plan.max_allocation).toLocaleString()} max allocation` },
    { yes: true,                      label: unlimited(plan.max_alerts)       ? 'Unlimited price alerts'   : `${plan.max_alerts} price alerts / month` },
    { yes: true,                      label: unlimited(plan.max_watchlist)    ? 'Unlimited watchlist'      : `${plan.max_watchlist} watchlist slots` },
    { yes: !!f.ai_predictions,        label: 'AI market predictions' },
    { yes: !!f.risk_controls,         label: 'Advanced risk controls' },
    { yes: !!f.marketplace,           label: 'Marketplace bots & signals' },
    { yes: !!f.dedicated_manager,     label: 'Dedicated account manager' },
    { yes: !!f.priority_support,      label: f.dedicated_manager ? '24/7 phone support' : 'Priority support' },
  ];

  return (
    <div className={`plan-card${visual.featured ? ' featured' : ''}${isCurrent ? ' current-plan' : ''}`}>
      {visual.featured && !isCurrent && <span className="plan-float-badge popular">Most Popular</span>}
      {isCurrent && <span className="plan-float-badge current">Current Plan</span>}

      <div className="plan-tier">{visual.tier}</div>
      <div className={`plan-name${visual.nameClass ? ' ' + visual.nameClass : ''}`}>{planLabel}</div>
      <div className="plan-desc">{plan.description}</div>

      <div className="plan-price-row">
        <span className="plan-price-cur">$</span>
        <span className="plan-price-val" style={{ color: visual.featured ? T.g : T.gr }}>
          {price === 0 ? 0 : price.toFixed(0)}
        </span>
        <span className="plan-price-per">/yr</span>
      </div>

      <div className="plan-save">&#160;</div>

      <button
        className={`in-btn in-btn-lg in-btn-full${visual.featured ? ' in-btn-accent' : ' in-btn-ghost'}`}
        onClick={() => !isCurrent && onSelect(plan)}
        style={isCurrent ? { opacity: .5, cursor: 'default', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' } : {}}
        disabled={isCurrent}
      >
        {isCurrent ? 'Your current plan' : price === 0 ? 'Downgrade to Basic' : `Get ${planLabel} →`}
      </button>

      <div className="plan-divider" />

      {features.map((f, i) => (
        <div key={i} className={`plan-feature ${f.yes ? 'yes' : 'no'}`}>
          <i className={`ti ${f.yes ? 'ti-check' : 'ti-x'}`} />
          {f.label}
        </div>
      ))}

      <div className="plan-cta-wrap" />
    </div>
  );
}

/* ─── Checkout Modal ─────────────────────────────────────────────────────────────────────────────────── */
function CheckoutModal({ plan, onClose }) {
  // steps: 1=review  2=pick coin+address  3=verifying blockchain  4=success
  const [step,          setStep]          = useState(1);
  const [cryptoWallets, setCryptoWallets] = useState([]);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [selectedCoin,  setSelectedCoin]  = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [verifyDots,    setVerifyDots]    = useState(0);
  const [verifyErr,     setVerifyErr]     = useState('');

  const price       = Number(plan.annual_price) * 12;
  const total       = price;
  const isDowngrade = price === 0;
  const planLabel   = plan.name.charAt(0).toUpperCase() + plan.name.slice(1);

  /* ── Fetch platform crypto wallets when moving to step 2 ── */
  const goToPayment = async () => {
    setCryptoLoading(true);
    const { data } = await supabase
      .from('platform_crypto_wallets')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false });
    setCryptoLoading(false);
    const list = data || [];
    setCryptoWallets(list);
    const def = list.find(c => c.is_default) || list[0] || null;
    setSelectedCoin(def);
    setStep(2);
  };

  /* ── Copy address ── */
  const copyAddress = () => {
    if (!selectedCoin?.address) return;
    navigator.clipboard.writeText(selectedCoin.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  /* ── I've sent payment → verify on blockchain then write DB ── */
  const startVerification = async () => {
    setStep(3);
    setVerifyErr('');

    // Animated dots ticker
    let d = 0;
    const ticker = setInterval(() => { d = (d + 1) % 4; setVerifyDots(d); }, 500);

    // Simulate blockchain confirmation wait (~25 s); replace with real webhook in prod
    await new Promise(r => setTimeout(r, 25000));
    clearInterval(ticker);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const now      = new Date();
      const periodEnd = new Date(now);
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      // Cancel any existing active subscription
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled', cancelled_at: now.toISOString() })
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Insert new active subscription
      const { error: insErr } = await supabase.from('user_subscriptions').insert({
        user_id:              user.id,
        plan_id:              plan.id,
        status:               'active',
        billing_cycle:        'annual',
        current_period_start: now.toISOString(),
        current_period_end:   periodEnd.toISOString(),
        payment_method:       selectedCoin ? `crypto:${selectedCoin.symbol}` : 'crypto',
        amount_paid:          total,
      });
      if (insErr) throw insErr;

      // Mirror plan name onto users table for sidebar
      await supabase.from('users').update({ plan: plan.name }).eq('id', user.id);

    } catch (e) {
      setVerifyErr(e.message || 'Failed to record subscription');
      return;
    }
    setStep(4);
  };

  /* ══════════════════════ STEP 4 — Success ══════════════════════ */
  if (step === 4) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
          <div className="success-ring"><i className="ti ti-check" /></div>
          <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 8 }}>
            {isDowngrade ? 'Plan Downgraded' : `Welcome to ${planLabel}!`}
          </div>
          <p style={{ fontSize: 13, color: T.nt, marginBottom: 16, lineHeight: 1.65 }}>
            {isDowngrade
              ? 'Your plan will switch to Basic at the end of your billing period.'
              : `You're now on the ${planLabel} plan. All features are active immediately.`}
          </p>
          {selectedCoin && (
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 16, fontSize: 12, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: T.nt }}>Amount paid</span>
                <span style={{ fontFamily: T.mono, color: T.g, fontWeight: 700 }}>${total.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: T.nt }}>Method</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <i className={`ti ${selectedCoin.icon}`} style={{ color: selectedCoin.color }} />
                  {selectedCoin.symbol} · {selectedCoin.network}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: T.nt }}>Plan</span>
                <span style={{ fontWeight: 600 }}>{planLabel} · 1 Year</span>
              </div>
            </div>
          )}
          <button className="in-btn in-btn-accent in-btn-md in-btn-full" onClick={onClose}>
            <i className="ti ti-check" /> Done
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={step === 3 ? undefined : onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {step !== 3 && <button className="modal-close" onClick={onClose}>✕</button>}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: plan.featured ? T.gd : 'var(--surface2)', border: `1px solid ${plan.featured ? 'rgba(200,245,96,.3)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {plan.name === 'basic' ? '◎' : plan.name === 'pro' ? '⚡' : '♦'}
          </div>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 20, marginBottom: 2 }}>
              {step === 3 ? 'Verifying Payment…' : isDowngrade ? 'Downgrade to Basic' : `Upgrade to ${planLabel}`}
            </div>
            <div style={{ fontSize: 12, color: T.nt }}>
              {step === 3 ? 'Do not close this window' : 'Annual billing · billed today'}
            </div>
          </div>
        </div>

        {/* Step bar — 3 segments */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: s <= step ? T.g : 'var(--border)', transition: 'background .3s' }} />
          ))}
        </div>

        {/* ══════════════ STEP 1 — Review ══════════════ */}
        {step === 1 && (
          <>
            <div className="sum-card">
              <div className="sum-row">
                <span className="sum-row-label">{planLabel} Plan</span>
                <span style={{ fontFamily: T.mono }}>${price.toFixed(0)}/yr</span>
              </div>
              <div className="sum-row">
                <span className="sum-row-label">Billing</span>
                <span>Annual (×12)</span>
              </div>
              <div className="sum-divider" />
              <div className="sum-total">
                <span className="sum-total-label">Due today</span>
                <span className="sum-total-val">{isDowngrade ? '$0' : `$${total.toFixed(0)}`}</span>
              </div>
            </div>

            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 10 }}>
                {isDowngrade ? 'You will lose access to' : "What you're unlocking"}
              </div>
              {plan.features && Object.entries(plan.features).filter(([,v]) => v).slice(0, 5).map(([key], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 6, color: isDowngrade ? T.nt : T.gr }}>
                  <i className="ti ti-check" style={{ color: isDowngrade ? T.nt : T.gn, fontSize: 13 }} />
                  {key.replace(/_/g, ' ').replace(/\w/g, c => c.toUpperCase())}
                </div>
              ))}
            </div>

            {isDowngrade && (
              <div style={{ background: 'rgba(248,113,113,.06)', border: '1px solid rgba(248,113,113,.18)', borderRadius: 'var(--r-sm)', padding: '10px 12px', marginBottom: 16, fontSize: 12, color: T.rd, lineHeight: 1.55 }}>
                <i className="ti ti-alert-triangle" style={{ marginRight: 6, fontSize: 13 }} />
                Copy relationships above the Basic limit will be paused at period end.
              </div>
            )}

            <button className={`in-btn in-btn-lg in-btn-full${isDowngrade ? ' in-btn-danger' : ' in-btn-accent'}`}
              onClick={() => isDowngrade ? setStep(4) : goToPayment()}
              disabled={cryptoLoading}>
              {cryptoLoading
                ? <><i className="ti ti-loader-2" style={{ fontSize: 14 }} /> Loading wallets…</>
                : isDowngrade ? 'Confirm Downgrade' : 'Continue to Payment →'}
            </button>
          </>
        )}

        {/* ══════════════ STEP 2 — Coin picker + address ══════════════ */}
        {step === 2 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 10 }}>
              Select Cryptocurrency
            </div>

            {/* Coin pills from DB */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {cryptoWallets.map(cw => {
                const active = selectedCoin?.id === cw.id;
                return (
                  <button key={cw.id}
                    onClick={() => { setSelectedCoin(cw); setCopied(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
                      background: active ? `${cw.color}20` : 'var(--surface2)',
                      border: `1px solid ${active ? cw.color : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all .15s', fontFamily: T.sans }}>
                    <i className={`ti ${cw.icon}`} style={{ fontSize: 17, color: cw.color }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: active ? cw.color : T.gr }}>{cw.symbol}</div>
                      <div style={{ fontSize: 10, color: T.nt }}>{cw.name}</div>
                    </div>
                    {cw.is_default && (
                      <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(200,245,96,.12)', color: T.g, padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(200,245,96,.2)', marginLeft: 2 }}>DEFAULT</span>
                    )}
                  </button>
                );
              })}
              {cryptoWallets.length === 0 && (
                <div style={{ fontSize: 12, color: T.nt }}>No active crypto wallets configured.</div>
              )}
            </div>

            {/* Deposit address card */}
            {selectedCoin && (
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${selectedCoin.color}20`, border: `1px solid ${selectedCoin.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`ti ${selectedCoin.icon}`} style={{ fontSize: 17, color: selectedCoin.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedCoin.name}</div>
                    <div style={{ fontSize: 11, color: T.nt }}>{selectedCoin.network}</div>
                  </div>
                </div>

                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.nt, marginBottom: 8 }}>
                  Deposit Address
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 12 }}>
                  <div style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.gr, wordBreak: 'break-all', lineHeight: 1.5 }}>
                    {selectedCoin.address}
                  </div>
                  <button onClick={copyAddress}
                    style={{ flexShrink: 0, background: copied ? 'rgba(52,211,153,.12)' : 'var(--surface2)', border: `1px solid ${copied ? T.gn : 'var(--border)'}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: copied ? T.gn : T.nt, fontFamily: T.sans, fontSize: 11, fontWeight: 600, transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {copied
                      ? <><i className="ti ti-check" style={{ fontSize: 12 }} /> Copied</>
                      : <><i className="ti ti-copy" style={{ fontSize: 12 }} /> Copy</>}
                  </button>
                </div>

                <div style={{ background: 'rgba(200,245,96,.05)', border: '1px solid rgba(200,245,96,.12)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: T.nt, lineHeight: 1.6 }}>
                  <i className="ti ti-info-circle" style={{ color: T.g, marginRight: 5, verticalAlign: -2 }} />
                  Send exactly <strong style={{ color: T.g, fontFamily: T.mono }}>${total.toFixed(0)}</strong> equivalent in{' '}
                  <strong style={{ color: T.gr }}>{selectedCoin.symbol}</strong>. Your plan activates automatically after blockchain confirmation.
                </div>
              </div>
            )}

            {/* Mini order summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.nt, marginBottom: 14, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--r-sm)' }}>
              <span>{planLabel} · Annual</span>
              <span style={{ fontFamily: T.mono, color: T.gr, fontWeight: 700 }}>${total.toFixed(0)} due today</span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="in-btn in-btn-ghost in-btn-md" style={{ padding: '10px 16px' }} onClick={() => setStep(1)}>
                <i className="ti ti-arrow-left" />
              </button>
              <button className="in-btn in-btn-accent in-btn-md" style={{ flex: 1 }}
                onClick={startVerification} disabled={!selectedCoin}>
                <i className="ti ti-send" /> I've Sent the Payment →
              </button>
            </div>

            <div className="sec-note" style={{ marginTop: 14, marginBottom: 0 }}>
              <i className="ti ti-shield-check" />
              Blockchain-verified · Subscription activates automatically on confirmation.
            </div>
          </>
        )}

        {/* ══════════════ STEP 3 — Blockchain Verification ══════════════ */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
            <div style={{ width: 68, height: 68, borderRadius: '50%', border: '3px solid rgba(200,245,96,.15)', borderTopColor: T.g, margin: '0 auto 22px', animation: 'spin 1s linear infinite' }} />

            <div style={{ fontFamily: T.serif, fontSize: 19, marginBottom: 8 }}>
              Verifying on Blockchain{'.'.repeat(verifyDots)}
            </div>
            <p style={{ fontSize: 13, color: T.nt, marginBottom: 22, lineHeight: 1.65 }}>
              Scanning the <strong style={{ color: T.gr }}>{selectedCoin?.network}</strong> for your{' '}
              <strong style={{ color: T.gr }}>{selectedCoin?.symbol}</strong> transaction.
              This usually takes 1–3 confirmations.
            </p>

            {/* Live status checklist */}
            {[
              { label: 'Transaction broadcast received',  done: true  },
              { label: 'Awaiting first confirmation',     done: true  },
              { label: 'Confirming on blockchain',        done: false },
              { label: 'Activating your subscription',   done: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, marginBottom: 6, border: '1px solid var(--border)', textAlign: 'left' }}>
                {s.done
                  ? <i className="ti ti-circle-check" style={{ color: T.gn, fontSize: 16, flexShrink: 0 }} />
                  : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(200,245,96,.3)', borderTopColor: T.g, animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
                <span style={{ fontSize: 12, color: s.done ? T.gr : T.nt }}>{s.label}</span>
              </div>
            ))}

            {verifyErr && (
              <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 8, padding: '10px 14px', marginTop: 14, fontSize: 12, color: T.rd, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-alert-circle" /> {verifyErr}
                <button className="in-btn in-btn-ghost in-btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setStep(2)}>Retry</button>
              </div>
            )}

            <div style={{ marginTop: 18, fontSize: 11, color: T.nt, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <i className="ti ti-lock" style={{ color: T.g, fontSize: 12 }} /> Secured · Do not close this window
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* ─── FAQ Section ────────────────────────────────────────────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-section">
      <div className="faq-head">
        <i className="ti ti-help-circle" style={{ fontSize: 16, color: T.g }} />
        <div className="faq-head-title">Frequently Asked <em>Questions</em></div>
      </div>
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="faq-item">
            <button className={`faq-q${isOpen ? ' open' : ''}`} onClick={() => setOpen(isOpen ? null : i)}>
              {faq.q}
              <i className="ti ti-chevron-down faq-chevron" />
            </button>
            {isOpen && <div className="faq-a">{faq.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────────── */
export default function Subscription() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal]             = useState(null);
  const [activeTheme, setActiveTheme] = useState('dark');

  const { data, loading, error } = useSubscriptionData();

  const plans         = data?.plans       || [];
  const activePlan    = data?.activePlan  || null;
  const currentPlanId = activePlan?.id    || null;
  const settings      = data?.settings    || null;

  /* ── Apply CSS vars whenever settings arrive ── */
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

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16 }}>
        <div style={{ width:40, height:40, border:'3px solid rgba(200,245,96,.2)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <div style={{ color:'var(--muted)', fontSize:13 }}>Loading subscription…</div>
        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    </>
  );

  if (error) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:12 }}>
        <i className="ti ti-alert-circle" style={{ fontSize:32, color:'var(--red)' }} />
        <div style={{ color:'var(--text)', fontWeight:600 }}>Failed to load subscription</div>
        <div style={{ color:'var(--muted)', fontSize:12 }}>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {activeTheme === 'light' && <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />}

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 299 }} />
      )}

      <div className="sb-shell">
        <Sidebar open={sidebarOpen} user={data?.user || {}} wallet={data?.wallet} copyCount={data?.copyCount || 0} />

        <div className="sb-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={data?.user || {}} settings={settings} />

          <main className="sb-main" style={{ padding:`24px var(--density-pad, 28px) 40px` }}>

            {/* ── Page header ── */}
            <div className="pg-header">
              <div>
                <div className="pg-title"><em>Subscription</em></div>
                <div className="pg-sub">
                  <span className="sb-live-dot" />
                  Manage your plan, upgrade, or downgrade at any time.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="in-btn in-btn-ghost in-btn-sm">
                  <i className="ti ti-file-invoice" /> Invoices
                </button><a href='/support'>
                <button className="in-btn in-btn-accent in-btn-sm">
                  <i className="ti ti-headset" /> Talk to Sales
                </button></a>
              </div>
            </div>

            {/* ── Current plan ── */}
            <CurrentPlanBanner subscription={data?.subscription} activePlan={activePlan} />

            {/* ── Usage this month ── */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: T.nt, marginBottom: 12 }}>
              Usage This Month
            </div>
            <UsageRow usage={data?.usage} activePlan={activePlan} />

            {/* ── Guarantee ── */}
            <div className="guarantee-bar">
              <div className="guarantee-icon"><i className="ti ti-shield-check" style={{ color: T.gn }} /></div>
              <div>
                <div className="guarantee-title">14-Day Money-Back Guarantee</div>
                <div className="guarantee-sub">Not satisfied? Get a full refund within 14 days of upgrading — no questions asked.</div>
              </div>
              <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <span className="in-badge in-badge-green">Risk-Free</span>
              </div>
            </div>

            {/* ── Plans section header ── */}
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 4 }}>
                Choose the right <em style={{ color: T.g, fontStyle: 'italic' }}>plan</em> for you
              </div>
              <div style={{ fontSize: 13, color: T.nt, marginBottom: 20 }}>
                All plans include a 14-day free trial. Upgrade, downgrade or cancel anytime.
              </div>
            </div>

            {/* ── Plan cards ── */}
            <div className="plans-grid" style={{ gap:`var(--density-gap, 16px)` }}>
              {plans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlanId={currentPlanId}
                  onSelect={p => setModal(p)}
                />
              ))}
            </div>

            {/* ── Testimonials ── */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: T.nt, marginBottom: 14 }}>
              What our members say
            </div>
            <div className="testi-strip">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testi-card">
                  <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                  <div className="testi-body">{t.body}</div>
                  <div className="testi-author">
                    <div className="testi-av" style={{ background: t.bg, color: '#fff' }}>{t.initials}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── FAQ ── */}
            <FAQSection />

            {/* ── Enterprise CTA ── */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '24px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 20, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 18, marginBottom: 4 }}>
                  Need a <em style={{ color: T.g, fontStyle: 'italic' }}>custom</em> plan for your team?
                </div>
                <div style={{ fontSize: 13, color: T.nt }}>
                  Volume discounts, white-label options, and dedicated infrastructure for funds and institutions.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <a href='/about'><button className="in-btn in-btn-ghost in-btn-md">Learn More</button></a>
                <a href='/support'>
                <button className="in-btn in-btn-accent in-btn-md">
                  <i className="ti ti-send" /> Contact Sales
                </button></a>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      {modal && <CheckoutModal plan={modal} onClose={() => setModal(null)} />}
    </>
  );
}