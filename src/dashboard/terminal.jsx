import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* ─── Design Tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg:   '#080b10', s:   '#0e1219', s2:  '#141922',
  br:   '#1e2535', br2: '#2a3347', gr:  '#e2e8f0',
  nt:   '#64748b', fa:  '#374151',
  g:    '#c8f560', gd:  'rgba(200,245,96,.12)',
  bl:   '#60a5fa', rd:  '#f87171',
  gn:   '#34d399', pr:  '#a78bfa',
  am:   '#f59e0b', pk:  '#f472b6',
  bull: '#26a69a', bear: '#ef5350',
  sans: "'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono: "'JetBrains Mono', monospace",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-size:14px;}
:root{
  --bg:#080b10; --s:#0e1219; --s2:#141922;
  --br:#1e2535; --br2:#2a3347; --tx:#e2e8f0;
  --nt:#64748b; --fa:#374151;
  --g:#c8f560;  --gd:rgba(200,245,96,.12); --gw:rgba(200,245,96,.06);
  --gn:#34d399; --rd:#f87171; --bl:#60a5fa; --pr:#a78bfa;
  --am:#f59e0b; --pk:#f472b6;
  --bull:#26a69a; --bear:#ef5350;
  --nav-h:48px;
  --wl-w:196px;
  --op-w:220px;
  --sans:'Space Grotesk',sans-serif;
  --serif:'Instrument Serif',serif;
  --mono:'JetBrains Mono',monospace;
  --r1:6px; --r2:10px; --r3:14px;
}
body,#root{font-family:var(--sans);background:var(--bg);color:var(--tx);height:100vh;overflow:hidden;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
button{font-family:var(--sans);cursor:pointer;border:none;background:none;color:inherit;}
input,select{font-family:var(--sans);}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-thumb{background:var(--br2);border-radius:4px;}

/* ── NAV ── */
.gnav{
  height:var(--nav-h);flex-shrink:0;
  display:flex;align-items:center;gap:0;
  background:var(--s);border-bottom:1px solid var(--br);
  padding:0 16px;z-index:200;position:relative;
}
.gnav::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--g) 30%,var(--br) 70%,transparent);
  opacity:.15;pointer-events:none;
}
.nav-logo{font-family:var(--serif);font-size:17px;letter-spacing:-.3px;margin-right:8px;}
.nav-logo em{color:var(--g);font-style:normal;}
.nav-live{font-size:8px;font-weight:800;letter-spacing:1.5px;color:#000;background:var(--rd);padding:2px 5px;border-radius:3px;animation:liveblink 2s infinite;}
@keyframes liveblink{0%,100%{opacity:1}50%{opacity:.6}}
.gnav-links{display:flex;gap:2px;margin:0 12px;flex:1;}
.gnav-link{
  display:flex;align-items:center;gap:6px;
  padding:5px 10px;border-radius:var(--r1);
  font-size:12px;font-weight:600;color:var(--nt);
  transition:all .15s;position:relative;
}
.gnav-link i{font-size:15px;}
.gnav-link:hover{color:var(--tx);background:rgba(255,255,255,.04);}
.gnav-link.active{color:var(--g);background:var(--gd);}
.gnav-link-badge{font-size:8px;font-weight:800;background:var(--g);color:#000;padding:1px 5px;border-radius:3px;}
.gnav-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.nav-sess{display:flex;align-items:center;gap:8px;}
.nav-sess-logo{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#000;flex-shrink:0;}
.nav-sess-name{font-size:11px;font-weight:700;}
.nav-sess-bal{font-size:10px;color:var(--nt);font-family:var(--mono);}
.nav-icon-btn{
  width:30px;height:30px;border-radius:var(--r1);
  background:var(--s2);border:1px solid var(--br);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--nt);font-size:16px;
  transition:all .15s;position:relative;
}
.nav-icon-btn:hover{border-color:var(--br2);color:var(--tx);}
.nav-ndot{position:absolute;top:4px;right:4px;width:5px;height:5px;background:var(--rd);border-radius:50%;border:1.5px solid var(--s);}
.nav-av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--g),#78d000);color:#000;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 8px rgba(200,245,96,.2);}
.btn-connect{display:inline-flex;align-items:center;gap:6px;background:var(--g);color:#000;border:none;border-radius:var(--r1);padding:6px 12px;font-size:11px;font-weight:800;font-family:var(--sans);cursor:pointer;transition:all .15s;}
.btn-connect:hover{opacity:.88;box-shadow:0 0 14px rgba(200,245,96,.3);}
.btn-disconnect{display:inline-flex;align-items:center;gap:5px;background:var(--s2);border:1px solid var(--br);color:var(--nt);border-radius:var(--r1);padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;}
.btn-disconnect:hover{border-color:var(--rd);color:var(--rd);}
.nav-hamburger{display:none;flex-direction:column;gap:4px;cursor:pointer;padding:4px;margin-right:8px;}
.nav-hamburger span{display:block;width:18px;height:2px;background:var(--tx);border-radius:2px;}

/* ── SIDEBAR (mobile) ── */
.sidebar-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:299;display:none;}
.sidebar-backdrop.open{display:block;}
.sidebar{
  position:fixed;top:0;left:0;width:240px;height:100vh;
  background:var(--s);border-right:1px solid var(--br);
  z-index:300;transform:translateX(-100%);
  transition:transform .25s cubic-bezier(.4,0,.2,1);
  display:flex;flex-direction:column;padding:16px 0;
}
.sidebar.open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.6);}
.sb-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--fa);padding:8px 16px 4px;}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 16px;font-size:13px;font-weight:500;color:var(--nt);transition:all .15s;}
.sb-item i{font-size:17px;}
.sb-item:hover{color:var(--tx);background:rgba(255,255,255,.03);}
.sb-item.active{color:var(--g);background:var(--gd);}
.sb-spacer{flex:1;}
.sb-user{display:flex;align-items:center;gap:10px;padding:14px 16px;border-top:1px solid var(--br);}
.sb-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--g),#78d000);color:#000;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sb-name{font-size:13px;font-weight:700;}
.sb-role{font-size:10px;color:var(--g);}

/* ── TERMINAL SHELL ── */
.term-shell{
  display:grid;
  grid-template-columns:var(--wl-w) 1fr var(--op-w);
  flex:1;overflow:hidden;min-height:0;
}
.term-left{overflow:hidden;border-right:1px solid var(--br);display:flex;flex-direction:column;}
.term-center{display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.term-right{border-left:1px solid var(--br);overflow:hidden;display:flex;flex-direction:column;}

/* ── WATCHLIST ── */
.watchlist{display:flex;flex-direction:column;height:100%;overflow:hidden;}
.wl-account{background:var(--s);border-bottom:1px solid var(--br);padding:10px 12px;}
.wl-acc-broker-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.wl-acc-logo{width:26px;height:26px;border-radius:6px;font-size:9px;font-weight:800;color:#000;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.wl-acc-name{font-size:12px;font-weight:700;}
.wl-acc-server{font-size:9px;color:var(--nt);font-family:var(--mono);}
.wl-acc-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;}
.wl-acc-row{display:flex;justify-content:space-between;font-size:10px;}
.wl-acc-row span:first-child{color:var(--nt);}
.wl-head{
  display:grid;grid-template-columns:1fr 56px 56px;
  padding:5px 8px;border-bottom:1px solid var(--br);
  font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--nt);
  background:var(--s2);flex-shrink:0;
}
.wl-body{flex:1;overflow-y:auto;}
.wl-cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--fa);padding:6px 8px 3px;background:var(--bg);}
.wl-row{
  display:grid;grid-template-columns:1fr 56px 56px;
  padding:5px 8px;cursor:pointer;transition:background .1s;
  border-bottom:1px solid rgba(30,37,53,.5);align-items:center;position:relative;
}
.wl-row:hover{background:rgba(255,255,255,.025);}
.wl-row.active{background:var(--gd);}
.wl-row.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--g);}
.wl-sym{font-size:11px;font-weight:800;display:block;letter-spacing:.2px;}
.wl-chg{font-size:9px;font-weight:600;}
.wl-price{font-family:var(--mono);font-size:11px;font-weight:600;text-align:right;}
.wl-ask{color:var(--nt);}
.wl-remove{
  position:absolute;right:4px;top:50%;transform:translateY(-50%);
  font-size:9px;color:var(--nt);opacity:0;
  transition:opacity .15s;background:transparent;border:none;cursor:pointer;padding:2px 4px;
}
.wl-row:hover .wl-remove{opacity:1;}
.wl-add-row{flex-shrink:0;border-top:1px solid var(--br);padding:8px;}
.wl-add-btn{width:100%;background:rgba(200,245,96,.07);border:1px solid rgba(200,245,96,.2);color:var(--g);border-radius:var(--r1);padding:6px;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;transition:all .15s;}
.wl-add-btn:hover{background:rgba(200,245,96,.12);}
.flash-up{animation:fup .3s ease;}
.flash-dn{animation:fdn .3s ease;}
@keyframes fup{0%,100%{color:inherit}50%{color:var(--gn)}}
@keyframes fdn{0%,100%{color:inherit}50%{color:var(--rd)}}

/* ── TOOLBAR ── */
.toolbar{
  display:flex;align-items:center;gap:4px;
  height:38px;flex-shrink:0;
  background:var(--s);border-bottom:1px solid var(--br);
  padding:0 8px;overflow-x:auto;overflow-y:hidden;
}
.tb-sym-block{display:flex;align-items:center;gap:8px;flex-shrink:0;padding-right:8px;}
.tb-sym{font-size:13px;font-weight:800;letter-spacing:.3px;}
.tb-bid{font-family:var(--mono);font-size:12px;font-weight:700;}
.tb-chg{font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;}
.tb-div{width:1px;height:18px;background:var(--br);margin:0 4px;flex-shrink:0;}
.tb-tf-group{display:flex;gap:2px;flex-shrink:0;}
.tb-tf{
  font-size:10px;font-weight:700;padding:3px 7px;border-radius:var(--r1);
  background:transparent;color:var(--nt);cursor:pointer;transition:all .15s;border:none;
}
.tb-tf:hover{color:var(--tx);}
.tb-tf.active{background:var(--gd);color:var(--g);}
.tb-tool-group{display:flex;gap:2px;flex-shrink:0;}
.tb-tool{
  width:26px;height:26px;border-radius:var(--r1);
  background:transparent;color:var(--nt);cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:14px;
  transition:all .15s;border:none;
}
.tb-tool:hover{background:rgba(255,255,255,.05);color:var(--tx);}
.tb-tool.active{background:var(--gd);color:var(--g);}
.tb-chart-type{display:flex;gap:2px;flex-shrink:0;}

/* ── CHART ── */
.chart-area{flex:1;position:relative;overflow:hidden;}
.chart-svg-wrap{width:100%;height:100%;position:relative;}
.chart-svg{width:100%;height:100%;display:block;}
.chart-placeholder{display:flex;align-items:center;justify-content:center;height:100%;}
.chart-loader{display:flex;gap:5px;}
.chart-loader span{width:5px;height:5px;border-radius:50%;background:var(--g);animation:ldot 1.1s ease-in-out infinite;}
.chart-loader span:nth-child(2){animation-delay:.2s;}
.chart-loader span:nth-child(3){animation-delay:.4s;}
@keyframes ldot{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}
.chart-tooltip{
  position:absolute;pointer-events:none;z-index:10;
  background:var(--s);border:1px solid var(--br2);
  border-radius:var(--r2);padding:8px 10px;min-width:110px;
}
.ct-row{display:flex;justify-content:space-between;gap:16px;font-size:10px;margin-bottom:2px;}
.ct-row span:first-child{color:var(--nt);}
.mono{font-family:var(--mono);}
.up{color:var(--gn)!important;}
.dn{color:var(--rd)!important;}
.text-gold{color:var(--g)!important;}
.text-muted{color:var(--nt)!important;}

/* ── BOTTOM PANEL ── */
.term-bottom{height:160px;flex-shrink:0;border-top:1px solid var(--br);display:flex;flex-direction:column;}
.bp-tabs{display:flex;gap:0;border-bottom:1px solid var(--br);background:var(--s);flex-shrink:0;}
.bp-tab{
  display:flex;align-items:center;gap:6px;
  padding:7px 14px;font-size:11px;font-weight:700;
  color:var(--nt);cursor:pointer;border-right:1px solid var(--br);
  transition:all .15s;background:transparent;border-top:none;border-left:none;border-bottom:2px solid transparent;
}
.bp-tab:hover{color:var(--tx);}
.bp-tab.active{color:var(--g);border-bottom-color:var(--g);background:var(--gd);}
.bp-tab i{font-size:13px;}
.bp-content{flex:1;overflow:auto;}
.blotter{height:100%;}
.blotter-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:5px 12px;background:var(--s2);border-bottom:1px solid var(--br);
  font-size:11px;flex-shrink:0;
}
.blotter-total{font-family:var(--mono);font-size:11px;font-weight:700;}
.pos-badge{font-size:9px;font-weight:800;background:rgba(200,245,96,.2);color:var(--g);padding:1px 5px;border-radius:3px;margin-left:5px;}
.dt-wrap{overflow:auto;height:calc(100% - 30px);}
.dt{width:100%;border-collapse:collapse;font-size:11px;}
.dt th{
  position:sticky;top:0;z-index:1;
  text-align:left;padding:5px 8px;
  color:var(--nt);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;
  background:var(--s2);border-bottom:1px solid var(--br);white-space:nowrap;
}
.dt td{padding:6px 8px;border-bottom:1px solid rgba(30,37,53,.6);white-space:nowrap;}
.dt tr:hover td{background:rgba(255,255,255,.02);}
.badge{display:inline-block;font-size:9px;font-weight:800;padding:1px 6px;border-radius:3px;}
.badge-green{background:rgba(52,211,153,.15);color:var(--gn);}
.badge-red{background:rgba(248,113,113,.15);color:var(--rd);}
.pos-close-btn{background:transparent;border:none;color:var(--nt);cursor:pointer;font-size:11px;padding:1px 5px;border-radius:3px;transition:all .15s;}
.pos-close-btn:hover{background:var(--rd-dim, rgba(248,113,113,.1));color:var(--rd);}
.journal{padding:10px 14px;font-family:var(--mono);font-size:10px;color:var(--nt);line-height:1.9;}
.journal-time{color:var(--g);}

/* ── ORDER PANEL ── */
.order-panel{display:flex;flex-direction:column;height:100%;overflow-y:auto;background:var(--s);}
.op-header{padding:10px 12px;border-bottom:1px solid var(--br);flex-shrink:0;}
.op-sym-name{font-size:15px;font-weight:800;letter-spacing:.3px;}
.op-sym-label{font-size:10px;color:var(--nt);margin-top:1px;}
.op-prices{
  display:grid;grid-template-columns:1fr 40px 1fr;
  padding:10px 10px 8px;border-bottom:1px solid var(--br);
  flex-shrink:0;gap:4px;
}
.op-side{border-radius:var(--r2);padding:8px 6px;text-align:center;cursor:pointer;transition:all .15s;}
.op-sell{background:rgba(239,83,80,.08);border:1px solid rgba(239,83,80,.2);}
.op-sell:hover{background:rgba(239,83,80,.14);}
.op-buy{background:rgba(38,166,154,.08);border:1px solid rgba(38,166,154,.2);}
.op-buy:hover{background:rgba(38,166,154,.14);}
.op-side-lbl{font-size:9px;font-weight:800;letter-spacing:1px;}
.op-side-price{font-family:var(--mono);font-size:14px;font-weight:800;margin-top:2px;}
.op-spread-col{display:flex;flex-direction:column;align-items:center;justify-content:center;}
.op-spread-val{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--nt);}
.op-spread-lbl{font-size:8px;color:var(--nt);margin-top:1px;}
.op-body{padding:10px 10px;flex:1;display:flex;flex-direction:column;gap:8px;}
.op-type-row{display:flex;gap:3px;background:var(--s2);border-radius:var(--r1);padding:3px;}
.op-type-btn{flex:1;font-size:10px;font-weight:700;padding:4px 0;border-radius:5px;text-align:center;background:transparent;color:var(--nt);transition:all .15s;}
.op-type-btn.active{background:var(--s);color:var(--tx);box-shadow:0 1px 3px rgba(0,0,0,.3);}
.op-field label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--nt);display:block;margin-bottom:4px;}
.op-field label.up{color:var(--gn);}
.op-field label.dn{color:var(--rd);}
.op-num-row{display:flex;align-items:center;gap:3px;}
.op-stepper{
  width:26px;height:26px;border-radius:var(--r1);flex-shrink:0;
  background:var(--s2);border:1px solid var(--br);color:var(--tx);
  font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;
  transition:all .15s;
}
.op-stepper:hover{border-color:var(--br2);}
.op-input{
  flex:1;background:var(--s2);border:1px solid var(--br);color:var(--tx);
  border-radius:var(--r1);padding:4px 8px;font-size:12px;text-align:center;
  outline:none;transition:border-color .15s;height:26px;
}
.op-input.full{text-align:left;flex:none;width:100%;}
.op-input:focus{border-color:var(--g);}
.op-sl-tp{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.op-exec-row{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px;}
.op-exec-btn{
  border:none;border-radius:var(--r2);padding:10px 6px;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;gap:2px;
  font-family:var(--sans);transition:all .15s;
}
.op-exec-sell{background:var(--bear);color:#fff;}
.op-exec-sell:hover{filter:brightness(1.1);}
.op-exec-buy{background:var(--bull);color:#fff;}
.op-exec-buy:hover{filter:brightness(1.1);}
.op-exec-lbl{font-size:11px;font-weight:800;letter-spacing:1.5px;}
.op-exec-px{font-family:var(--mono);font-size:12px;font-weight:600;}
.op-info{
  display:flex;justify-content:space-between;
  font-size:10px;color:var(--nt);padding:0 2px;margin-top:2px;
}
.flash-red{animation:fred .4s ease;}
.flash-green{animation:fgreen .4s ease;}
@keyframes fred{0%,100%{background:rgba(239,83,80,.08)}50%{background:rgba(239,83,80,.35)}}
@keyframes fgreen{0%,100%{background:rgba(38,166,154,.08)}50%{background:rgba(38,166,154,.35)}}

/* ── FOOTER ── */
.term-footer{
  height:22px;flex-shrink:0;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 14px;background:var(--s2);border-top:1px solid var(--br);
  font-size:9px;color:var(--nt);letter-spacing:.3px;
}
.tf-logo{font-family:var(--serif);font-size:11px;}
.tf-logo em{color:var(--g);font-style:normal;}
.tf-sep{margin:0 6px;opacity:.3;}
.tf-right a{color:var(--nt);margin-left:10px;}
.tf-right a:hover{color:var(--tx);}

/* ── MODALS ── */
.modal-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.75);
  display:flex;align-items:center;justify-content:center;
  z-index:500;padding:16px;
}
.modal{
  background:var(--s);border:1px solid var(--br);border-radius:16px;
  width:100%;max-width:460px;max-height:88vh;overflow-y:auto;
  padding:20px;position:relative;
}
.modal-title{font-family:var(--serif);font-size:18px;margin-bottom:12px;}
.modal-close{position:absolute;top:14px;right:14px;background:transparent;border:1px solid var(--br);color:var(--nt);border-radius:6px;width:26px;height:26px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.modal-close:hover{border-color:var(--rd);color:var(--rd);}

/* Connect modal */
.conn-sub{font-size:12px;color:var(--nt);margin-bottom:14px;}
.conn-search-wrap{position:relative;margin-bottom:12px;}
.conn-search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--nt);font-size:14px;pointer-events:none;}
.conn-search{
  width:100%;background:var(--s2);border:1px solid var(--br);color:var(--tx);
  border-radius:var(--r2);padding:8px 32px;font-size:13px;outline:none;transition:border-color .15s;
}
.conn-search:focus{border-color:var(--g);}
.conn-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:var(--nt);cursor:pointer;font-size:13px;}
.conn-broker-list{max-height:300px;overflow-y:auto;border-radius:var(--r2);border:1px solid var(--br);overflow:hidden;}
.conn-broker-row{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .15s;border-bottom:1px solid var(--br);}
.conn-broker-row:last-child{border-bottom:none;}
.conn-broker-row:hover{background:var(--s2);}
.conn-broker-logo{width:32px;height:32px;border-radius:8px;font-size:9px;font-weight:800;color:#000;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.conn-broker-name{font-size:13px;font-weight:700;}
.conn-broker-meta{font-size:10px;color:var(--nt);margin-top:1px;}
.conn-popular{margin-left:auto;font-size:9px;font-weight:800;background:var(--gd);color:var(--g);padding:2px 6px;border-radius:3px;flex-shrink:0;}
.conn-security{display:flex;align-items:flex-start;gap:6px;font-size:10px;color:var(--nt);margin-top:14px;line-height:1.5;background:var(--s2);border-radius:var(--r1);padding:8px 10px;}
.conn-security i{color:var(--g);font-size:13px;flex-shrink:0;margin-top:1px;}
.conn-back{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--nt);margin-bottom:4px;padding:4px 0;background:transparent;border:none;cursor:pointer;transition:color .15s;}
.conn-back:hover{color:var(--tx);}
.conn-broker-badge{width:28px;height:28px;border-radius:7px;font-size:9px;font-weight:800;color:#000;display:inline-flex;align-items:center;justify-content:center;margin-right:8px;vertical-align:middle;}
.conn-section-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--nt);margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.conn-loading-badge{font-size:9px;color:var(--am);background:rgba(245,158,11,.1);padding:2px 6px;border-radius:3px;}
.conn-plat-row{display:flex;gap:6px;margin-bottom:4px;}
.conn-plat-btn{padding:5px 12px;border-radius:var(--r1);font-size:11px;font-weight:700;background:var(--s2);border:1px solid var(--br);color:var(--nt);cursor:pointer;transition:all .15s;}
.conn-plat-btn.active{background:var(--gd);border-color:rgba(200,245,96,.3);color:var(--g);}
.conn-server-list{border:1px solid var(--br);border-radius:var(--r2);overflow:hidden;max-height:200px;overflow-y:auto;margin-bottom:4px;}
.conn-server-row{padding:10px 12px;cursor:pointer;transition:background .15s;border-bottom:1px solid var(--br);display:flex;align-items:center;justify-content:space-between;}
.conn-server-row:last-child{border-bottom:none;}
.conn-server-row:hover{background:var(--s2);}
.conn-server-row.active{background:var(--gd);}
.conn-server-name{font-size:12px;font-weight:700;font-family:var(--mono);margin-bottom:3px;}
.conn-server-meta{display:flex;gap:8px;font-size:10px;color:var(--nt);}
.srv-live{color:var(--gn);font-weight:700;}
.srv-demo{color:var(--am);font-weight:700;}
.conn-srv-loading{display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;color:var(--nt);font-size:12px;}
.conn-continue-btn{width:100%;margin-top:14px;background:var(--g);color:#000;border:none;border-radius:var(--r2);padding:10px;font-size:13px;font-weight:800;cursor:pointer;font-family:var(--sans);transition:all .15s;}
.conn-continue-btn:hover{opacity:.88;}
.conn-continue-btn:disabled{opacity:.35;cursor:not-allowed;}
.conn-login-summary{background:var(--s2);border:1px solid var(--br);border-radius:var(--r2);padding:12px;margin-bottom:14px;}
.conn-summ-row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0;}
.conn-summ-row span:first-child{color:var(--nt);}
.conn-live-warn{display:flex;align-items:flex-start;gap:6px;font-size:11px;color:var(--am);background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:var(--r1);padding:8px 10px;margin-bottom:12px;line-height:1.5;}
.conn-field{margin-bottom:10px;}
.conn-field label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--nt);display:block;margin-bottom:5px;}
.conn-field input{
  width:100%;background:var(--s2);border:1px solid var(--br);color:var(--tx);
  border-radius:var(--r1);padding:8px 10px;font-size:12px;outline:none;transition:border-color .15s;
}
.conn-field input:focus{border-color:var(--g);}
.conn-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:var(--nt);cursor:pointer;font-size:14px;}
.conn-error{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--rd);background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2);border-radius:var(--r1);padding:8px 10px;margin-bottom:10px;}
.conn-anim{display:flex;flex-direction:column;align-items:center;padding:20px 0;}
.conn-anim-logo{width:52px;height:52px;border-radius:14px;font-size:14px;font-weight:800;color:#000;display:flex;align-items:center;justify-content:center;margin-bottom:16px;position:relative;z-index:1;}
.conn-anim-ring{
  position:absolute;width:68px;height:68px;border-radius:50%;
  border:2px solid var(--g);border-top-color:transparent;
  animation:spin 1s linear infinite;margin-top:-8px;
}
@keyframes spin{to{transform:rotate(360deg)}}
.conn-anim-title{font-family:var(--serif);font-size:16px;margin-bottom:16px;margin-top:10px;}
.conn-step{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--nt);margin-bottom:8px;transition:color .3s;}
.conn-step.done{color:var(--gn);}
.conn-step-check{width:16px;height:16px;border-radius:50%;background:var(--s2);border:1px solid var(--br);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;}
.conn-step.done .conn-step-check{background:var(--gn);border-color:var(--gn);color:#000;}
.conn-step-dot{width:5px;height:5px;border-radius:50%;background:var(--nt);}

/* Add symbol modal */
.sym-add-list{overflow-y:auto;flex:1;max-height:320px;}

/* ── ORDER TOAST ── */
.order-toast{
  position:fixed;bottom:36px;left:50%;transform:translateX(-50%);
  background:var(--s);border:1px solid var(--g);border-radius:var(--r2);
  padding:8px 18px;font-size:12px;font-weight:700;
  display:flex;align-items:center;gap:8px;z-index:400;
  box-shadow:0 0 20px rgba(200,245,96,.2);
  animation:toastin .3s ease;
}
.order-toast i{color:var(--g);}
@keyframes toastin{from{opacity:0;transform:translateX(-50%) translateY(10px)}}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  :root{--wl-w:172px;--op-w:196px;}
}
@media(max-width:820px){
  .term-shell{grid-template-columns:var(--wl-w) 1fr;}
  .term-right{display:none;}
  .gnav-links{display:none;}
  .nav-hamburger{display:flex;}
}

/* ── MOBILE PANES: hidden on desktop, only shown on mobile ── */
.mob-pane{display:none!important;}

/* ── MOBILE ≤560px: full screen single-pane routing ── */
@media(max-width:560px){
  .term-footer{display:none;}
  /* hide the desktop shell entirely */
  .term-shell{display:none!important;}
  /* reveal mobile panes */
  .mob-pane{display:flex!important;flex-direction:column;flex:1;overflow:hidden;min-height:0;}
  .mob-pane.hidden{display:none!important;}
}

/* ── MOBILE BOTTOM NAV ── */
.mob-bottom-nav{
  display:none;
  height:58px;flex-shrink:0;
  background:var(--s);border-top:1px solid var(--br);
  flex-direction:row;align-items:stretch;z-index:100;
  padding-bottom:env(safe-area-inset-bottom,0);
}
@media(max-width:560px){ .mob-bottom-nav{display:flex;} }
.mob-nav-btn{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:4px;color:var(--nt);background:transparent;border:none;cursor:pointer;
  transition:color .15s;position:relative;
}
.mob-nav-btn i{font-size:22px;line-height:1;}
.mob-nav-btn.active{color:var(--g);}
.mob-nav-btn.active i{filter:drop-shadow(0 0 6px rgba(200,245,96,.5));}
.mob-nav-badge{
  position:absolute;top:6px;right:calc(50% - 18px);
  min-width:16px;height:16px;border-radius:8px;
  background:var(--rd);color:#fff;font-size:8px;font-weight:800;
  display:flex;align-items:center;justify-content:center;padding:0 3px;
  border:2px solid var(--s);
}

/* ── MOBILE SYMBOL SCREEN ── */
.mob-sym-screen{display:flex;flex-direction:column;height:100%;background:var(--bg);}
.mob-sym-header{
  padding:12px 14px 8px;background:var(--s);border-bottom:1px solid var(--br);
  flex-shrink:0;
}
.mob-sym-title{font-size:13px;font-weight:800;letter-spacing:.4px;color:var(--nt);text-transform:uppercase;}
.mob-sym-list{flex:1;overflow-y:auto;}
.mob-sym-cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px;color:var(--fa);padding:8px 14px 4px;background:var(--bg);}
.mob-sym-row{
  display:grid;grid-template-columns:1fr 70px 70px;
  align-items:center;padding:11px 14px;
  border-bottom:1px solid rgba(30,37,53,.6);cursor:pointer;transition:background .1s;
}
.mob-sym-row:hover,.mob-sym-row.active{background:var(--gd);}
.mob-sym-row.active{border-left:2px solid var(--g);}
.mob-sym-name{font-size:13px;font-weight:800;letter-spacing:.2px;display:block;}
.mob-sym-label{font-size:9px;color:var(--nt);margin-top:1px;display:block;}
.mob-sym-chg{font-size:9px;font-weight:700;margin-top:2px;display:block;}
.mob-sym-price{font-family:var(--mono);font-size:12px;font-weight:700;text-align:right;}
.mob-sym-ask{color:var(--nt);}

/* ── MOBILE CHART PANE ── */
.mob-chart-pane{display:flex;flex-direction:column;height:100%;}
/* chart toolbar: only sym info + dropdowns */
.mob-chart-toolbar{
  display:flex;align-items:center;gap:6px;
  height:40px;flex-shrink:0;background:var(--s);
  border-bottom:1px solid var(--br);padding:0 10px;
  overflow:hidden;
}
.mob-ct-sym{font-size:14px;font-weight:800;letter-spacing:.3px;}
.mob-ct-price{font-family:var(--mono);font-size:12px;font-weight:700;}
.mob-ct-chg{font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;}
.mob-ct-spacer{flex:1;}

/* ── MOBILE DROPDOWN SHARED ── */
.mob-dd{position:relative;flex-shrink:0;}
.mob-dd-btn{
  display:flex;align-items:center;gap:4px;
  padding:4px 9px;border-radius:var(--r1);border:1px solid var(--br);
  background:var(--s2);color:var(--tx);font-size:11px;font-weight:700;cursor:pointer;
  white-space:nowrap;height:28px;
}
.mob-dd-btn.accent{background:var(--gd);border-color:rgba(200,245,96,.25);color:var(--g);}
.mob-dd-btn i.ch{font-size:11px;color:var(--nt);}
.mob-dd-menu{
  position:absolute;top:calc(100% + 5px);left:0;z-index:9999;
  background:var(--s);border:1px solid var(--br2);border-radius:var(--r2);
  box-shadow:0 10px 30px rgba(0,0,0,.6);overflow:hidden;
  display:none;
}
.mob-dd-menu.open{display:block;}
/* TF menu: 3-col grid */
.mob-dd-menu.tf-grid{display:none;grid-template-columns:repeat(3,1fr);min-width:150px;}
.mob-dd-menu.tf-grid.open{display:grid;}
.mob-dd-tf-opt{
  padding:10px 14px;font-size:11px;font-weight:700;color:var(--nt);
  cursor:pointer;text-align:center;transition:all .12s;
}
.mob-dd-tf-opt:hover{background:rgba(255,255,255,.04);color:var(--tx);}
.mob-dd-tf-opt.active{color:var(--g);background:var(--gd);}
/* Tools menu: 4-col icon grid */
.mob-dd-menu.tool-grid{display:none;grid-template-columns:repeat(4,1fr);min-width:192px;}
.mob-dd-menu.tool-grid.open{display:grid;}
.mob-dd-tool-opt{
  padding:12px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--nt);font-size:17px;transition:all .12s;
  border-right:1px solid var(--br);border-bottom:1px solid var(--br);
}
.mob-dd-tool-opt:hover{background:rgba(255,255,255,.05);color:var(--tx);}
.mob-dd-tool-opt.active{color:var(--g);background:var(--gd);}
/* Chart type: 3-col icon grid */
.mob-dd-menu.ct-grid{display:none;grid-template-columns:repeat(3,1fr);min-width:120px;}
.mob-dd-menu.ct-grid.open{display:grid;}
.mob-dd-ct-opt{
  padding:12px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--nt);font-size:17px;transition:all .12s;
  border-right:1px solid var(--br);
}
.mob-dd-ct-opt:hover{background:rgba(255,255,255,.05);color:var(--tx);}
.mob-dd-ct-opt.active{color:var(--g);background:var(--gd);}

/* Desktop dropdowns hidden */
.tb-tf-dropdown{display:none;}
.tb-tools-dropdown{display:none;}
.tb-charttype-dropdown{display:none;}

/* ── MOBILE TRADE SCREEN ── */
.mob-trade-screen{display:flex;flex-direction:column;height:100%;background:var(--bg);}
.mob-trade-header{
  padding:12px 14px 8px;background:var(--s);border-bottom:1px solid var(--br);
  display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
}
.mob-trade-title{font-size:13px;font-weight:800;letter-spacing:.4px;color:var(--nt);text-transform:uppercase;}
.mob-trade-inner-tabs{display:flex;gap:0;border-bottom:1px solid var(--br);flex-shrink:0;background:var(--s2);}
.mob-tit{flex:1;padding:10px 6px;font-size:11px;font-weight:700;text-align:center;color:var(--nt);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;}
.mob-tit.active{color:var(--g);border-bottom-color:var(--g);background:var(--gd);}
.mob-trade-content{flex:1;overflow-y:auto;}

/* positions card list */
.mob-pos-list{padding:10px;}
.mob-pos-card{background:var(--s2);border:1px solid var(--br);border-radius:var(--r2);padding:12px;margin-bottom:10px;}
.mob-pos-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.mob-pos-sym{font-size:14px;font-weight:800;letter-spacing:.3px;}
.mob-pos-pl{font-family:var(--mono);font-size:14px;font-weight:800;}
.mob-pos-row{display:flex;justify-content:space-between;font-size:11px;color:var(--nt);margin-bottom:4px;}
.mob-pos-row span:last-child{color:var(--tx);font-family:var(--mono);}
.mob-pos-close{
  width:100%;margin-top:10px;padding:9px;border-radius:var(--r1);
  background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);
  color:var(--rd);font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;
}

/* new trade form */
.mob-order-form{padding:14px;}
`;


/* ─── Data ───────────────────────────────────────────────────────────────────── */

const ALL_INSTRUMENTS = [
  { sym:'EURUSD', label:'Euro / USD',      price:1.0862,  spread:0.00012, pip:0.0001,  digits:5, cat:'Forex',   icon:'€' },
  { sym:'GBPUSD', label:'GBP / USD',       price:1.2754,  spread:0.00015, pip:0.0001,  digits:5, cat:'Forex',   icon:'£' },
  { sym:'USDJPY', label:'USD / JPY',       price:155.42,  spread:0.012,   pip:0.01,    digits:3, cat:'Forex',   icon:'¥' },
  { sym:'USDCHF', label:'USD / CHF',       price:0.9021,  spread:0.00014, pip:0.0001,  digits:5, cat:'Forex',   icon:'₣' },
  { sym:'AUDUSD', label:'AUD / USD',       price:0.6541,  spread:0.00013, pip:0.0001,  digits:5, cat:'Forex',   icon:'A$'},
  { sym:'NZDUSD', label:'NZD / USD',       price:0.6012,  spread:0.00015, pip:0.0001,  digits:5, cat:'Forex',   icon:'N$'},
  { sym:'USDCAD', label:'USD / CAD',       price:1.3672,  spread:0.00015, pip:0.0001,  digits:5, cat:'Forex',   icon:'C$'},
  { sym:'EURGBP', label:'EUR / GBP',       price:0.8521,  spread:0.00018, pip:0.0001,  digits:5, cat:'Forex',   icon:'€' },
  { sym:'EURJPY', label:'EUR / JPY',       price:168.72,  spread:0.018,   pip:0.01,    digits:3, cat:'Forex',   icon:'€' },
  { sym:'GBPJPY', label:'GBP / JPY',       price:197.83,  spread:0.022,   pip:0.01,    digits:3, cat:'Forex',   icon:'£' },
  { sym:'XAUUSD', label:'Gold / USD',      price:2314,    spread:0.3,     pip:0.1,     digits:2, cat:'Commod.', icon:'Au'},
  { sym:'XAGUSD', label:'Silver / USD',    price:27.42,   spread:0.04,    pip:0.01,    digits:3, cat:'Commod.', icon:'Ag'},
  { sym:'USOIL',  label:'Crude Oil WTI',   price:82.54,   spread:0.04,    pip:0.01,    digits:2, cat:'Commod.', icon:'OIL'},
  { sym:'UKOIL',  label:'Brent Crude',     price:86.12,   spread:0.05,    pip:0.01,    digits:2, cat:'Commod.', icon:'BRT'},
  { sym:'BTCUSD', label:'Bitcoin',         price:67420,   spread:12,      pip:1,       digits:0, cat:'Crypto',  icon:'₿' },
  { sym:'ETHUSD', label:'Ethereum',        price:3840,    spread:3,       pip:0.1,     digits:1, cat:'Crypto',  icon:'Ξ' },
  { sym:'SOLUSD', label:'Solana',          price:168,     spread:0.15,    pip:0.01,    digits:2, cat:'Crypto',  icon:'◎' },
  { sym:'BNBUSD', label:'BNB',             price:412,     spread:0.4,     pip:0.1,     digits:1, cat:'Crypto',  icon:'B' },
  { sym:'XRPUSD', label:'Ripple',          price:0.542,   spread:0.001,   pip:0.0001,  digits:4, cat:'Crypto',  icon:'X' },
  { sym:'US30',   label:'Dow Jones',       price:38540,   spread:2,       pip:1,       digits:0, cat:'Indices', icon:'DJ'},
  { sym:'US500',  label:'S&P 500',         price:5240,    spread:0.5,     pip:0.1,     digits:1, cat:'Indices', icon:'SP'},
  { sym:'USTEC',  label:'NASDAQ 100',      price:18320,   spread:2,       pip:1,       digits:0, cat:'Indices', icon:'NQ'},
  { sym:'UK100',  label:'FTSE 100',        price:8120,    spread:1,       pip:1,       digits:0, cat:'Indices', icon:'FT'},
  { sym:'GER40',  label:'DAX 40',          price:18240,   spread:1.5,     pip:1,       digits:0, cat:'Indices', icon:'DX'},
  { sym:'AAPL',   label:'Apple',           price:187.5,   spread:0.08,    pip:0.01,    digits:2, cat:'Stocks',  icon:'AAPL'},
  { sym:'MSFT',   label:'Microsoft',       price:415.2,   spread:0.12,    pip:0.01,    digits:2, cat:'Stocks',  icon:'MSFT'},
  { sym:'NVDA',   label:'NVIDIA',          price:892,     spread:0.35,    pip:0.01,    digits:2, cat:'Stocks',  icon:'NVDA'},
  { sym:'TSLA',   label:'Tesla',           price:174.2,   spread:0.12,    pip:0.01,    digits:2, cat:'Stocks',  icon:'TSLA'},
  { sym:'AMZN',   label:'Amazon',          price:182.4,   spread:0.10,    pip:0.01,    digits:2, cat:'Stocks',  icon:'AMZN'},
];

const DEFAULT_WL = ['EURUSD','GBPUSD','USDJPY','XAUUSD','BTCUSD','ETHUSD','US500','AAPL','TSLA','USOIL'];
const TIMEFRAMES = ['M1','M5','M15','M30','H1','H4','D1','W1','MN'];
const TF_MAP     = { M1:'1m',M5:'5m',M15:'15m',M30:'30m',H1:'1h',H4:'4h',D1:'1D',W1:'1W',MN:'1M' };

const BROKERS = [
  { id:'icmarkets',  name:'IC Markets',      logo:'IC', color:'#0ea5e9', popular:true,  reg:'ASIC · CySEC · FSA',   platform:'MT4 / MT5',
    servers:[
      { name:'ICMarketsGlobal-Live',  type:'live', platform:'MT4', loc:'NY4' },
      { name:'ICMarketsGlobal-Demo',  type:'demo', platform:'MT4', loc:'NY4' },
      { name:'ICMarkets-Live01',      type:'live', platform:'MT5', loc:'LD4' },
      { name:'ICMarkets-Demo01',      type:'demo', platform:'MT5', loc:'LD4' },
    ]},
  { id:'pepperstone',name:'Pepperstone',      logo:'PP', color:'#22c55e', popular:true,  reg:'ASIC · FCA · DFSA',   platform:'MT4 / MT5',
    servers:[
      { name:'Pepperstone-Live01',  type:'live', platform:'MT4', loc:'LD4' },
      { name:'Pepperstone-Demo01',  type:'demo', platform:'MT4', loc:'LD4' },
      { name:'Pepperstone-Live',    type:'live', platform:'MT5', loc:'LD4' },
      { name:'Pepperstone-Demo',    type:'demo', platform:'MT5', loc:'LD4' },
    ]},
  { id:'xm',         name:'XM Global',        logo:'XM', color:'#f59e0b', popular:true,  reg:'CySEC · ASIC · IFSC', platform:'MT4 / MT5',
    servers:[
      { name:'XMGlobal-Real 3',  type:'live', platform:'MT4', loc:'LD4' },
      { name:'XMGlobal-Demo',    type:'demo', platform:'MT4', loc:'LD4' },
      { name:'XMGlobal-Real 5',  type:'live', platform:'MT5', loc:'NY4' },
      { name:'XMGlobal-Demo 2',  type:'demo', platform:'MT5', loc:'NY4' },
    ]},
  { id:'exness',     name:'Exness',           logo:'EX', color:'#a78bfa', popular:true,  reg:'FCA · CySEC · FSA',   platform:'MT4 / MT5',
    servers:[
      { name:'Exness-Real3',     type:'live', platform:'MT4', loc:'LD4' },
      { name:'Exness-Trial',     type:'demo', platform:'MT4', loc:'LD4' },
      { name:'Exness-MT5Real',   type:'live', platform:'MT5', loc:'LD4' },
      { name:'Exness-MT5Trial',  type:'demo', platform:'MT5', loc:'LD4' },
    ]},
  { id:'fxpro',      name:'FxPro',            logo:'FP', color:'#f472b6', popular:false, reg:'FCA · CySEC · SCB',   platform:'MT4 / MT5',
    servers:[
      { name:'FxPro.com-Real',  type:'live', platform:'MT4', loc:'LD4' },
      { name:'FxPro.com-Demo',  type:'demo', platform:'MT4', loc:'LD4' },
      { name:'FxProMT5-Real',   type:'live', platform:'MT5', loc:'LD4' },
      { name:'FxProMT5-Demo',   type:'demo', platform:'MT5', loc:'LD4' },
    ]},
  { id:'oanda',      name:'OANDA',            logo:'OA', color:'#fb923c', popular:false, reg:'FCA · ASIC · CFTC',   platform:'MT4',
    servers:[
      { name:'OANDA-v20 Live-1',    type:'live', platform:'MT4', loc:'NY4' },
      { name:'OANDA-v20 Practice',  type:'demo', platform:'MT4', loc:'NY4' },
    ]},
];

const DEMO_POSITIONS = [
  { id:1, sym:'EURUSD', type:'BUY',  lots:1.0, open:1.08310, sl:1.07800, tp:1.09200, pl:310,  pips:31 },
  { id:2, sym:'BTCUSD', type:'BUY',  lots:0.1, open:62100,   sl:60000,   tp:70000,   pl:530,  pips:531 },
  { id:3, sym:'XAUUSD', type:'SELL', lots:0.5, open:2330,    sl:2360,    tp:2280,    pl:160,  pips:16 },
  { id:4, sym:'GBPUSD', type:'SELL', lots:0.5, open:1.27840, sl:1.28400, tp:1.26900, pl:-34,  pips:-34 },
];

/* ─── Hooks ──────────────────────────────────────────────────────────────────── */

function useLivePrices() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(ALL_INSTRUMENTS.map(i => [i.sym, {
      bid: i.price, ask: +(i.price + i.spread).toFixed(i.digits),
      change: 0, changePct: 0, dir: 0,
    }]))
  );
  useEffect(() => {
    const iv = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        ALL_INSTRUMENTS.forEach(inst => {
          const old  = prev[inst.sym];
          const move = (Math.random() - 0.497) * inst.price * 0.00055;
          const nb   = +(Math.max(inst.price * 0.8, old.bid + move)).toFixed(inst.digits);
          next[inst.sym] = {
            bid: nb, ask: +(nb + inst.spread).toFixed(inst.digits),
            change: +(nb - inst.price).toFixed(inst.digits),
            changePct: +((nb - inst.price) / inst.price * 100).toFixed(2),
            dir: move > 0 ? 1 : -1,
          };
        });
        return next;
      });
    }, 700);
    return () => clearInterval(iv);
  }, []);
  return prices;
}

function useCandles(sym, tf) {
  const inst = ALL_INSTRUMENTS.find(i => i.sym === sym);
  const [candles, setCandles] = useState([]);
  useEffect(() => {
    if (!inst) return;
    const vol = inst.price * 0.007;
    let price = inst.price * (0.9 + Math.random() * 0.02);
    const arr = [];
    for (let i = 0; i < 120; i++) {
      const o = price;
      const move = (Math.random() - 0.49) * vol;
      const c = Math.max(price * 0.5, o + move);
      const h = Math.max(o, c) + Math.random() * vol * 0.35;
      const l = Math.min(o, c) - Math.random() * vol * 0.35;
      arr.push({ o, h, l, c });
      price = c;
    }
    setCandles(arr);
  }, [sym, tf]); // eslint-disable-line
  useEffect(() => {
    const iv = setInterval(() => {
      if (!inst) return;
      setCandles(prev => {
        if (!prev.length) return prev;
        const next = [...prev];
        const last = { ...next[next.length - 1] };
        const move = (Math.random() - 0.497) * inst.price * 0.00055;
        last.c = +(Math.max(inst.price * 0.5, last.c + move)).toFixed(inst.digits);
        last.h = Math.max(last.h, last.c);
        last.l = Math.min(last.l, last.c);
        next[next.length - 1] = last;
        return next;
      });
    }, 700);
    return () => clearInterval(iv);
  }, [inst]);
  return candles;
}

/* ─── CandleChart ────────────────────────────────────────────────────────────── */

function CandleChart({ sym, tf, activeTool, drawings, onAddDrawing }) {
  const candles   = useCandles(sym, tf);
  const wrapRef   = useRef(null);
  const svgRef    = useRef(null);
  const dimsRef   = useRef({ w:900, h:420 });
  const candlesRef= useRef(candles);
  const [dims, setDims]         = useState({ w:900, h:420 });
  const [tooltip, setTooltip]   = useState(null);
  const [visCount, setVisCount] = useState(90);
  const [panOffset, setPanOffset] = useState(0);
  const isPanning = useRef(false);
  const panStart  = useRef({ x:0, offset:0 });
  const isDrawing = useRef(false);
  const drawStart = useRef(null);
  const [draftLine, setDraftLine] = useState(null);
  const [mousePos, setMousePos]   = useState(null);

  useEffect(() => { candlesRef.current = candles; }, [candles]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      dimsRef.current = { w: width, h: height };
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleWheel = useCallback(e => {
    e.preventDefault();
    const d = e.deltaY > 0 ? 1.12 : 0.89;
    setVisCount(v => Math.min(candlesRef.current.length, Math.max(10, Math.round(v * d))));
  }, []);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const all    = candles;
  const maxVis = all.length;
  const safeVis= Math.min(visCount, maxVis);
  const maxPan = Math.max(0, maxVis - safeVis);
  const safePan= Math.min(maxPan, Math.max(0, panOffset));
  const startIdx = Math.max(0, maxVis - safeVis - safePan);
  const visible  = all.slice(startIdx, startIdx + safeVis);

  const pad  = { t:12, r:68, b:24, l:8 };
  const cw   = dims.w - pad.l - pad.r;
  const ch   = dims.h - pad.t - pad.b;
  const highs= visible.map(c => c.h);
  const lows = visible.map(c => c.l);
  const maxP = visible.length ? Math.max(...highs) * 1.0008 : 1;
  const minP = visible.length ? Math.min(...lows)  * 0.9992 : 0;
  const range= maxP - minP || 1;
  const barW = cw / (visible.length || 1);
  const cW   = Math.max(1.5, barW * 0.7);
  const px   = i => pad.l + i * barW + barW / 2;
  const py   = p => pad.t + ch - ((p - minP) / range) * ch;
  const pxToPrice = y => minP + ((pad.t + ch - y) / ch) * range;
  const fmt  = v => v >= 10000 ? v.toFixed(0) : v >= 1000 ? v.toFixed(1) : v >= 10 ? v.toFixed(2) : v.toFixed(5);
  const ySteps = 6;
  const yGrid  = Array.from({ length: ySteps }, (_, i) => minP + range * i / (ySteps - 1));
  const lastC  = visible.length ? visible[visible.length - 1].c : 0;
  const lastY  = py(lastC);
  const lastBull = visible.length ? visible[visible.length - 1].c >= visible[visible.length - 1].o : true;

  const cursorMap = { cursor:'default', cross:'crosshair', pan: isPanning.current ? 'grabbing':'grab', zoomin:'zoom-in', zoomout:'zoom-out', trendline:'crosshair', hline:'crosshair', ray:'crosshair', fib:'crosshair', rect:'crosshair', text:'text' };
  const cursor = cursorMap[activeTool] || 'default';

  const getSVGPt = e => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return null;
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const handleMouseMove = useCallback(e => {
    const pt = getSVGPt(e);
    if (!pt) return;
    setMousePos(pt);
    const { w } = dimsRef.current;
    const bw = (w - 8 - 68) / (Math.min(visCount, candlesRef.current.length) || 1);
    const ac = candlesRef.current;
    const sv = Math.min(visCount, ac.length);
    const si = Math.max(0, ac.length - sv - safePan);
    const vis2 = ac.slice(si, si + sv);
    const idx = Math.floor((pt.x - 8) / bw);
    setTooltip(idx >= 0 && idx < vis2.length ? { c: vis2[idx], x: pt.x, y: pt.y } : null);
    if (activeTool === 'pan' && isPanning.current) {
      const dx = e.clientX - panStart.current.x;
      const barsDelta = Math.round(-dx / bw);
      setPanOffset(Math.min(Math.max(0, panStart.current.offset + barsDelta), Math.max(0, ac.length - sv)));
    }
    if (isDrawing.current && drawStart.current) {
      setDraftLine({ x1: drawStart.current.x, y1: drawStart.current.y, x2: pt.x, y2: pt.y });
    }
  }, [activeTool, visCount, safePan]);

  const handleMouseDown = useCallback(e => {
    const pt = getSVGPt(e);
    if (!pt) return;
    if (activeTool === 'pan') { isPanning.current = true; panStart.current = { x: e.clientX, offset: safePan }; return; }
    if (activeTool === 'zoomin') { setVisCount(v => Math.max(10, Math.round(v * 0.75))); return; }
    if (activeTool === 'zoomout') { setVisCount(v => Math.min(candlesRef.current.length, Math.round(v * 1.33))); return; }
    if (['trendline','hline','ray','fib','rect'].includes(activeTool)) {
      isDrawing.current = true; drawStart.current = pt;
      setDraftLine({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
    }
    if (activeTool === 'text') {
      const label = window.prompt('Enter label:');
      if (label) onAddDrawing({ type:'text', x:pt.x, y:pt.y, label });
    }
  }, [activeTool, safePan, onAddDrawing]);

  const handleMouseUp = useCallback(e => {
    if (activeTool === 'pan') { isPanning.current = false; return; }
    if (isDrawing.current && drawStart.current) {
      const pt = getSVGPt(e);
      if (pt) onAddDrawing({ type:activeTool, x1:drawStart.current.x, y1:drawStart.current.y, x2:pt.x, y2:pt.y, price1:pxToPrice(drawStart.current.y), price2:pxToPrice(pt.y) });
      isDrawing.current = false; drawStart.current = null; setDraftLine(null);
    }
  }, [activeTool, pxToPrice, onAddDrawing]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null); setMousePos(null);
    if (isPanning.current) isPanning.current = false;
    if (isDrawing.current) { isDrawing.current = false; drawStart.current = null; setDraftLine(null); }
  }, []);

  const renderDrawing = (d, i) => {
    if (d.type === 'trendline' || d.type === 'ray')
      return <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="#c8f560" strokeWidth="1.5" strokeDasharray={d.type==='ray'?'5,3':'none'} opacity=".9" />;
    if (d.type === 'hline') {
      const y = py(d.price1);
      return <line key={i} x1={pad.l} y1={y} x2={dims.w - pad.r} y2={y} stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6,3" opacity=".85" />;
    }
    if (d.type === 'fib') {
      const fibLvls = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      const pr = d.price2 - d.price1;
      return <g key={i}>{fibLvls.map((lvl, li) => { const y = py(d.price1 + pr * lvl); return <g key={li}><line x1={pad.l} y1={y} x2={dims.w-pad.r} y2={y} stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" opacity=".7"/><text x={dims.w-pad.r+4} y={y-2} fill="#a78bfa" fontSize="8.5" fontFamily="'JetBrains Mono',monospace">{(lvl*100).toFixed(1)}%</text></g>; })}</g>;
    }
    if (d.type === 'rect') {
      const rx=Math.min(d.x1,d.x2), ry=Math.min(d.y1,d.y2);
      return <rect key={i} x={rx} y={ry} width={Math.abs(d.x2-d.x1)} height={Math.abs(d.y2-d.y1)} stroke="#f59e0b" strokeWidth="1.2" fill="#f59e0b11" opacity=".85"/>;
    }
    if (d.type === 'text')
      return <text key={i} x={d.x} y={d.y} fill="#c8f560" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="600">{d.label}</text>;
    return null;
  };

  if (!candles.length) return <div className="chart-placeholder"><div className="chart-loader"><span/><span/><span/></div></div>;

  const showCross = mousePos && ['cursor','cross','trendline','hline','ray','fib','rect'].includes(activeTool);

  return (
    <div ref={wrapRef} className="chart-svg-wrap" style={{ cursor }} onMouseLeave={handleMouseLeave}>
      <svg ref={svgRef} className="chart-svg" style={{ userSelect:'none' }}
        onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>

        {/* Y grid */}
        {yGrid.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} y1={py(v)} x2={dims.w-pad.r} y2={py(v)} stroke="#1e2535" strokeWidth="1"/>
            <text x={dims.w-pad.r+5} y={py(v)+4} fill="#374151" fontSize="9.5" fontFamily="'JetBrains Mono',monospace">{fmt(v)}</text>
          </g>
        ))}

        {/* Candles */}
        {visible.map((c, i) => {
          const bull = c.c >= c.o;
          const col  = bull ? '#26a69a' : '#ef5350';
          const bTop = py(Math.max(c.o, c.c));
          const bH   = Math.max(1, Math.abs(py(c.o) - py(c.c)));
          return (
            <g key={i}>
              <line x1={px(i)} y1={py(c.h)} x2={px(i)} y2={py(c.l)} stroke={col} strokeWidth="1" opacity=".9"/>
              <rect x={px(i)-cW/2} y={bTop} width={cW} height={bH} fill={col} opacity={i===visible.length-1?1:.88}/>
            </g>
          );
        })}

        {/* Last price line */}
        <line x1={pad.l} y1={lastY} x2={dims.w-pad.r} y2={lastY} stroke={lastBull?'#26a69a':'#ef5350'} strokeWidth="1" strokeDasharray="3,3" opacity=".7"/>
        <rect x={dims.w-pad.r} y={lastY-9} width={pad.r-2} height={18} fill={lastBull?'#26a69a':'#ef5350'} rx="2"/>
        <text x={dims.w-pad.r+4} y={lastY+4} fill="#000" fontSize="9.5" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{fmt(lastC)}</text>

        {/* Drawings */}
        {drawings.map(renderDrawing)}

        {/* Draft */}
        {draftLine && (() => {
          if (activeTool === 'rect') { const rx=Math.min(draftLine.x1,draftLine.x2), ry=Math.min(draftLine.y1,draftLine.y2); return <rect x={rx} y={ry} width={Math.abs(draftLine.x2-draftLine.x1)} height={Math.abs(draftLine.y2-draftLine.y1)} stroke="#f59e0b" strokeWidth="1.2" fill="#f59e0b11" strokeDasharray="5,3"/>; }
          if (activeTool === 'hline') return <line x1={pad.l} y1={draftLine.y1} x2={dims.w-pad.r} y2={draftLine.y1} stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6,3" opacity=".85"/>;
          return <line x1={draftLine.x1} y1={draftLine.y1} x2={draftLine.x2} y2={draftLine.y2} stroke="#c8f560" strokeWidth="1.5" strokeDasharray="5,3" opacity=".9"/>;
        })()}

        {/* Crosshair */}
        {showCross && mousePos && <>
          <line x1={mousePos.x} y1={pad.t} x2={mousePos.x} y2={pad.t+ch} stroke="#c8f56044" strokeWidth="1" strokeDasharray="4,3"/>
          <line x1={pad.l} y1={mousePos.y} x2={dims.w-pad.r} y2={mousePos.y} stroke="#c8f56033" strokeWidth="1" strokeDasharray="4,3"/>
          <rect x={dims.w-pad.r} y={mousePos.y-9} width={pad.r-2} height={18} fill="#1e2535" stroke="#334155" strokeWidth="1" rx="2"/>
          <text x={dims.w-pad.r+4} y={mousePos.y+4} fill="#c8f560" fontSize="9.5" fontWeight="600" fontFamily="'JetBrains Mono',monospace">{fmt(pxToPrice(mousePos.y))}</text>
        </>}
      </svg>

      {/* Zoom badge */}
      <div style={{ position:'absolute', bottom:28, right:76, fontSize:9, color:'#4b5563', fontFamily:'JetBrains Mono,monospace', background:'#0b0e14cc', padding:'2px 6px', borderRadius:4, pointerEvents:'none' }}>{safeVis} bars</div>

      {/* OHLC tooltip */}
      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x > dims.w * 0.6 ? tooltip.x - 130 : tooltip.x + 12, top: Math.max(8, tooltip.y - 60) }}>
          <div className="ct-row"><span>O</span><span className="mono">{fmt(tooltip.c.o)}</span></div>
          <div className="ct-row"><span>H</span><span className="mono up">{fmt(tooltip.c.h)}</span></div>
          <div className="ct-row"><span>L</span><span className="mono dn">{fmt(tooltip.c.l)}</span></div>
          <div className="ct-row"><span>C</span><span className="mono" style={{ fontWeight:700 }}>{fmt(tooltip.c.c)}</span></div>
        </div>
      )}
    </div>
  );
}

/* ─── ConnectModal ───────────────────────────────────────────────────────────── */

function ConnStep({ label, delay }) {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), delay + 350); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={`conn-step${done?' done':''}`}>
      <span className="conn-step-check">{done ? <i className="ti ti-check"/> : <span className="conn-step-dot"/>}</span>
      {label}
    </div>
  );
}

function ConnectModal({ onClose, onConnected }) {
  const [step,      setStep]      = useState('broker');
  const [query,     setQuery]     = useState('');
  const [broker,    setBroker]    = useState(null);
  const [platform,  setPlatform]  = useState('MT4');
  const [srvList,   setSrvList]   = useState([]);
  const [loadingSrv,setLoadingSrv]= useState(false);
  const [server,    setServer]    = useState(null);
  const [login,     setLogin]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [errMsg,    setErrMsg]    = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q ? BROKERS.filter(b => b.name.toLowerCase().includes(q) || b.platform.toLowerCase().includes(q)) : BROKERS;
  }, [query]);

  const fetchServers = useCallback((b, plat) => {
    setLoadingSrv(true); setSrvList([]); setServer(null);
    setTimeout(() => { setSrvList(b.servers.filter(s => s.platform === plat)); setLoadingSrv(false); }, 900);
  }, []);

  const handleSelectBroker = b => { setBroker(b); setPlatform('MT4'); fetchServers(b, 'MT4'); setStep('server'); };
  const handlePlatformChange = p => { setPlatform(p); if (broker) fetchServers(broker, p); };

  const handleConnect = () => {
    if (!login.trim()) { setErrMsg('Enter your account login number.'); return; }
    setErrMsg(''); setStep('connecting');
    setTimeout(() => {
      onConnected({ broker, server, platform, accType: server?.type || 'demo', login,
        balance: 10000, equity: 10530, leverage: '1:500', currency: 'USD' });
      onClose();
    }, 2600);
  };

  const availPlatforms = broker ? [...new Set(broker.servers.map(s => s.platform))] : [];

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {step === 'broker' && <>
          <div className="modal-title">Connect Trading Account</div>
          <p className="conn-sub">Select your broker to load available servers</p>
          <div className="conn-search-wrap">
            <i className="ti ti-search conn-search-icon"/>
            <input className="conn-search" placeholder="Search broker…" value={query} onChange={e => setQuery(e.target.value)} autoFocus/>
            {query && <button className="conn-clear" onClick={() => setQuery('')}>✕</button>}
          </div>
          <div className="conn-broker-list">
            {filtered.map(b => (
              <div key={b.id} className="conn-broker-row" onClick={() => handleSelectBroker(b)}>
                <div className="conn-broker-logo" style={{ background: b.color }}>{b.logo}</div>
                <div className="conn-broker-info">
                  <div className="conn-broker-name">{b.name}</div>
                  <div className="conn-broker-meta">{b.reg} · {b.platform}</div>
                </div>
                {b.popular && <span className="conn-popular">Popular</span>}
                <i className="ti ti-chevron-right" style={{ color:'var(--nt)', fontSize:14 }}/>
              </div>
            ))}
            {!filtered.length && <div style={{ padding:'20px', textAlign:'center', color:'var(--nt)', fontSize:13 }}>No brokers found for "{query}"</div>}
          </div>
          <div className="conn-security"><i className="ti ti-shield-lock"/> Credentials are transmitted directly to your broker's server. TradeFlow never stores them.</div>
        </>}

        {step === 'server' && <>
          <button className="conn-back" onClick={() => setStep('broker')}><i className="ti ti-arrow-left"/> Back</button>
          <div className="modal-title" style={{ marginTop:8 }}>
            <span className="conn-broker-badge" style={{ background: broker?.color }}>{broker?.logo}</span>
            {broker?.name}
          </div>
          <div className="conn-section-lbl">Platform</div>
          <div className="conn-plat-row">
            {availPlatforms.map(p => <button key={p} className={`conn-plat-btn${platform===p?' active':''}`} onClick={() => handlePlatformChange(p)}>{p}</button>)}
          </div>
          <div className="conn-section-lbl" style={{ marginTop:16 }}>
            Server {loadingSrv && <span className="conn-loading-badge">Fetching from MT gateway…</span>}
          </div>
          {loadingSrv ? (
            <div className="conn-srv-loading"><div className="chart-loader"><span/><span/><span/></div><span>Loading servers for {broker?.name}…</span></div>
          ) : (
            <div className="conn-server-list">
              {srvList.map(s => (
                <div key={s.name} className={`conn-server-row${server?.name===s.name?' active':''}`} onClick={() => setServer(s)}>
                  <div>
                    <div className="conn-server-name">{s.name}</div>
                    <div className="conn-server-meta">
                      <span className={s.type==='live'?'srv-live':'srv-demo'}>{s.type.toUpperCase()}</span>
                      <span>{s.platform}</span>
                      <span><i className="ti ti-map-pin" style={{ fontSize:10 }}/> {s.loc}</span>
                    </div>
                  </div>
                  {server?.name === s.name && <i className="ti ti-circle-check" style={{ color:'var(--g)', fontSize:18 }}/>}
                </div>
              ))}
              {!srvList.length && !loadingSrv && <div style={{ color:'var(--nt)', fontSize:12, padding:'12px 0' }}>No {platform} servers found.</div>}
            </div>
          )}
          <button className="conn-continue-btn" disabled={!server} onClick={() => setStep('login')}>
            Continue with {server?.name || 'selected server'} →
          </button>
        </>}

        {step === 'login' && <>
          <button className="conn-back" onClick={() => setStep('server')}><i className="ti ti-arrow-left"/> Back</button>
          <div className="modal-title" style={{ marginTop:8 }}>Login to {broker?.name}</div>
          <div className="conn-login-summary">
            <div className="conn-summ-row"><span>Broker</span><span style={{ fontWeight:700 }}>{broker?.name}</span></div>
            <div className="conn-summ-row"><span>Server</span><span className="mono" style={{ fontSize:11 }}>{server?.name}</span></div>
            <div className="conn-summ-row"><span>Type</span><span className={server?.type==='live'?'srv-live':'srv-demo'} style={{ fontWeight:700 }}>{server?.type?.toUpperCase()}</span></div>
            <div className="conn-summ-row"><span>Platform</span><span>{platform}</span></div>
          </div>
          {server?.type === 'live' && <div className="conn-live-warn"><i className="ti ti-alert-triangle"/> Connecting to a <strong>LIVE</strong> account. Real funds are at risk.</div>}
          <div className="conn-field">
            <label>Account Login / ID</label>
            <input value={login} onChange={e => setLogin(e.target.value)} placeholder="e.g. 12345678" autoFocus/>
          </div>
          <div className="conn-field">
            <label>Password</label>
            <div style={{ position:'relative' }}>
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPass?'text':'password'} placeholder="Investor or trading password" style={{ paddingRight:40 }}/>
              <button className="conn-eye" onClick={() => setShowPass(v => !v)}><i className={`ti ${showPass?'ti-eye-off':'ti-eye'}`}/></button>
            </div>
          </div>
          {errMsg && <div className="conn-error"><i className="ti ti-alert-circle"/> {errMsg}</div>}
          <button className="conn-continue-btn" onClick={handleConnect}><i className="ti ti-plug"/> Connect Account</button>
          <div className="conn-security" style={{ marginTop:10 }}><i className="ti ti-shield-lock"/> Credentials are sent only to {broker?.name}'s servers and never stored.</div>
        </>}

        {step === 'connecting' && (
          <div className="conn-anim">
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:68, height:68 }}>
              <div className="conn-anim-ring"/>
              <div className="conn-anim-logo" style={{ background: broker?.color }}>{broker?.logo}</div>
            </div>
            <div className="conn-anim-title">Connecting to {broker?.name}…</div>
            <ConnStep label={`Resolving ${server?.name}`}        delay={0}    />
            <ConnStep label="Authenticating credentials"          delay={500}  />
            <ConnStep label="Loading account history"             delay={1000} />
            <ConnStep label="Syncing positions and market watch"  delay={1600} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Watchlist ──────────────────────────────────────────────────────────────── */

function Watchlist({ prices, selected, onSelect, watchlist, onAddSymbol, onRemoveSymbol, session }) {
  const [showAdd, setShowAdd] = useState(false);
  const [addQuery, setAddQuery] = useState('');

  const cats = [...new Set(watchlist.map(sym => ALL_INSTRUMENTS.find(i => i.sym === sym)?.cat).filter(Boolean))];

  const filteredAdd = useMemo(() => {
    const q = addQuery.toLowerCase();
    return ALL_INSTRUMENTS.filter(i => !watchlist.includes(i.sym) && (i.sym.toLowerCase().includes(q) || i.label.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q)));
  }, [addQuery, watchlist]);

  return (
    <div className="watchlist">
      {session && (
        <div className="wl-account">
          <div className="wl-acc-broker-row">
            <div className="wl-acc-logo" style={{ background: session.broker.color }}>{session.broker.logo}</div>
            <div>
              <div className="wl-acc-name">{session.broker.name}</div>
              <div className="wl-acc-server mono">{session.server.name}</div>
            </div>
            <span className={session.accType==='live'?'srv-live':'srv-demo'} style={{ marginLeft:'auto', fontWeight:800, fontSize:9 }}>{session.accType.toUpperCase()}</span>
          </div>
          <div className="wl-acc-grid">
            <div className="wl-acc-row"><span>Balance</span><span className="mono text-gold">${session.balance.toLocaleString()}</span></div>
            <div className="wl-acc-row"><span>Equity</span><span className={`mono ${session.equity>=session.balance?'up':'dn'}`}>${session.equity.toLocaleString()}</span></div>
            <div className="wl-acc-row"><span>Free Margin</span><span className="mono">${(session.equity*0.92).toFixed(2)}</span></div>
            <div className="wl-acc-row"><span>Leverage</span><span className="mono">{session.leverage}</span></div>
          </div>
        </div>
      )}

      <div className="wl-head"><span>Symbol</span><span style={{ textAlign:'right' }}>Bid</span><span style={{ textAlign:'right' }}>Ask</span></div>

      <div className="wl-body">
        {cats.map(cat => (
          <React.Fragment key={cat}>
            <div className="wl-cat">{cat}</div>
            {watchlist.map(sym => ALL_INSTRUMENTS.find(i => i.sym === sym)).filter(inst => inst?.cat === cat).map(inst => {
              const p = prices[inst.sym];
              if (!p) return null;
              return (
                <div key={inst.sym} className={`wl-row${selected===inst.sym?' active':''}`} onClick={() => onSelect(inst.sym)}>
                  <div>
                    <span className="wl-sym">{inst.sym}</span>
                    <span className={`wl-chg ${p.changePct>=0?'up':'dn'}`}>{p.changePct>=0?'+':''}{p.changePct.toFixed(2)}%</span>
                  </div>
                  <span className={`wl-price mono ${p.dir===-1?'flash-dn':p.dir===1?'flash-up':''}`}>{p.bid.toFixed(inst.digits)}</span>
                  <span className="wl-price wl-ask mono">{p.ask.toFixed(inst.digits)}</span>
                  <button className="wl-remove" onClick={e => { e.stopPropagation(); onRemoveSymbol(inst.sym); }}>✕</button>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="wl-add-row">
        <button className="wl-add-btn" onClick={() => setShowAdd(true)}><i className="ti ti-plus"/> Add Symbol</button>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget){setShowAdd(false);setAddQuery('');} }}>
          <div className="modal" style={{ maxWidth:440, maxHeight:'80vh', display:'flex', flexDirection:'column', gap:0 }}>
            <div className="modal-title">Add Symbol</div>
            <button className="modal-close" onClick={() => { setShowAdd(false); setAddQuery(''); }}>✕</button>
            <div style={{ position:'relative', marginBottom:10 }}>
              <i className="ti ti-search" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--nt)', fontSize:14, pointerEvents:'none' }}/>
              <input autoFocus className="conn-search" placeholder="Search symbol, name, category…" value={addQuery} onChange={e => setAddQuery(e.target.value)}/>
            </div>
            <div className="sym-add-list">
              {[...new Set(filteredAdd.map(i => i.cat))].map(cat => (
                <React.Fragment key={cat}>
                  <div className="wl-cat" style={{ position:'sticky', top:0 }}>{cat}</div>
                  {filteredAdd.filter(i => i.cat === cat).map(inst => (
                    <div key={inst.sym} className="conn-broker-row" style={{ padding:'7px 12px' }}
                      onClick={() => { onAddSymbol(inst.sym); setShowAdd(false); setAddQuery(''); }}>
                      <div style={{ width:30, height:30, borderRadius:6, background:'var(--s2)', border:'1px solid var(--br)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:800, color:'var(--g)' }}>{inst.sym.slice(0,3)}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{inst.sym}</div>
                        <div style={{ fontSize:10, color:'var(--nt)' }}>{inst.label} · {inst.cat}</div>
                      </div>
                      <i className="ti ti-plus" style={{ marginLeft:'auto', color:'var(--g)' }}/>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              {!filteredAdd.length && <div style={{ padding:20, textAlign:'center', color:'var(--nt)', fontSize:13 }}>No results for "{addQuery}"</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Toolbar ────────────────────────────────────────────────────────────────── */

function Toolbar({ tf, onTf, sym, prices, activeTool, onTool, onClearDrawings, chartType, onChartType }) {
  const [tfOpen,    setTfOpen]    = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const tfRef    = useRef(null);
  const toolsRef = useRef(null);
  const inst = ALL_INSTRUMENTS.find(i => i.sym === sym);
  const p    = prices[sym];

  const tools = [
    { id:'cursor',    icon:'ti-pointer'           },
    { id:'cross',     icon:'ti-crosshair'         },
    { id:'pan',       icon:'ti-hand-stop'         },
    { id:'zoomin',    icon:'ti-zoom-in'           },
    { id:'zoomout',   icon:'ti-zoom-out'          },
    { id:'trendline', icon:'ti-trending-up'       },
    { id:'hline',     icon:'ti-minus'             },
    { id:'ray',       icon:'ti-arrow-narrow-right'},
    { id:'fib',       icon:'ti-wave-sine'         },
    { id:'rect',      icon:'ti-square'            },
    { id:'text',      icon:'ti-text-size'         },
  ];
  const toolsWithSep = [
    { id:'cursor',    icon:'ti-pointer'           },
    { id:'cross',     icon:'ti-crosshair'         },
    { id:'pan',       icon:'ti-hand-stop'         },
    { id:'zoomin',    icon:'ti-zoom-in'           },
    { id:'zoomout',   icon:'ti-zoom-out'          },
    null,
    { id:'trendline', icon:'ti-trending-up'       },
    { id:'hline',     icon:'ti-minus'             },
    { id:'ray',       icon:'ti-arrow-narrow-right'},
    { id:'fib',       icon:'ti-wave-sine'         },
    { id:'rect',      icon:'ti-square'            },
    { id:'text',      icon:'ti-text-size'         },
  ];
  const chartTypes = [
    { id:'candle', icon:'ti-chart-candle' },
    { id:'bar',    icon:'ti-chart-bar'   },
    { id:'line',   icon:'ti-chart-line'  },
  ];

  const activeTool_ = tools.find(t => t.id === activeTool);

  useEffect(() => {
    const handler = e => { if (e.key==='Escape') onTool('cursor'); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTool]);

  useEffect(() => {
    const handler = e => {
      if (tfRef.current && !tfRef.current.contains(e.target)) setTfOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="toolbar">
      <div className="tb-sym-block">
        <span className="tb-sym">{sym}</span>
        {p && inst && <>
          <span className={`tb-bid mono ${p.dir===1?'up':'dn'}`}>{p.bid.toFixed(inst.digits)}</span>
          <span className={`tb-chg ${p.changePct>=0?'up':'dn'}`} style={{ background: p.changePct>=0?'rgba(52,211,153,.1)':'rgba(248,113,113,.1)', padding:'1px 5px', borderRadius:3 }}>
            {p.changePct>=0?'+':''}{p.changePct.toFixed(2)}%
          </span>
        </>}
      </div>
      <div className="tb-div"/>

      {/* Desktop TF row */}
      <div className="tb-tf-group">
        {TIMEFRAMES.map(t => <button key={t} className={`tb-tf${tf===t?' active':''}`} onClick={() => onTf(t)}>{TF_MAP[t]}</button>)}
      </div>

      {/* Mobile TF dropdown */}
      <div className="tb-tf-dropdown" ref={tfRef}>
        <button className="tb-tf-current" onClick={() => { setTfOpen(v => !v); setToolsOpen(false); }}>
          {TF_MAP[tf]}<i className={`ti ti-chevron-${tfOpen?'up':'down'}`}/>
        </button>
        <div className={`tb-tf-dropdown-menu${tfOpen?'':' hidden'}`}>
          {TIMEFRAMES.map(t => (
            <div key={t} className={`tb-tf-opt${tf===t?' active':''}`} onClick={() => { onTf(t); setTfOpen(false); }}>{TF_MAP[t]}</div>
          ))}
        </div>
      </div>

      <div className="tb-div"/>

      {/* Desktop tools */}
      <div className="tb-tool-group">
        {toolsWithSep.map((tool, idx) => tool === null
          ? <div key={`sep${idx}`} style={{ width:1, height:16, background:'var(--br)', margin:'0 2px' }}/>
          : <button key={tool.id} className={`tb-tool${activeTool===tool.id?' active':''}`} onClick={() => onTool(tool.id)} title={tool.id}><i className={`ti ${tool.icon}`}/></button>
        )}
        <button className="tb-tool" onClick={onClearDrawings} title="Clear drawings" style={{ opacity:.6 }}><i className="ti ti-trash"/></button>
      </div>

      {/* Mobile tools dropdown */}
      <div className="tb-tools-dropdown" ref={toolsRef}>
        <button className="tb-tools-current" onClick={() => { setToolsOpen(v => !v); setTfOpen(false); }}>
          <i className={`ti ${activeTool_?.icon || 'ti-pointer'}`}/>
          <i className="ti ti-chevron-down chevron"/>
        </button>
        <div className={`tb-tools-dropdown-menu${toolsOpen?'':' hidden'}`}>
          {tools.map(tool => (
            <div key={tool.id} className={`tb-tool-opt${activeTool===tool.id?' active':''}`}
              onClick={() => { onTool(tool.id); setToolsOpen(false); }}>
              <i className={`ti ${tool.icon}`}/>
            </div>
          ))}
          <div className="tb-tool-opt" style={{ opacity:.5 }} onClick={() => { onClearDrawings(); setToolsOpen(false); }}>
            <i className="ti ti-trash"/>
          </div>
        </div>
      </div>

      <div className="tb-div"/>
      <div className="tb-chart-type">
        {chartTypes.map(ct => <button key={ct.id} className={`tb-tool${chartType===ct.id?' active':''}`} onClick={() => onChartType(ct.id)} title={ct.id}><i className={`ti ${ct.icon}`}/></button>)}
      </div>
    </div>
  );
}

/* ─── Positions Blotter ──────────────────────────────────────────────────────── */

function Positions({ positions, prices, onClose }) {
  const totalPL = positions.reduce((s, p) => s + p.pl, 0);
  return (
    <div className="blotter">
      <div className="blotter-header">
        <span>Positions <span className="pos-badge">{positions.length}</span></span>
        <span className={`blotter-total ${totalPL>=0?'up':'dn'}`}>Float P/L: <span className="mono">{totalPL>=0?'+':''}${totalPL.toFixed(2)}</span></span>
      </div>
      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr><th>#</th><th>Symbol</th><th>Type</th><th>Lots</th><th>Open</th><th>S/L</th><th>T/P</th><th>Current</th><th>Pips</th><th>Profit</th><th/></tr>
          </thead>
          <tbody>
            {!positions.length && <tr><td colSpan="11" style={{ textAlign:'center', color:'var(--nt)', padding:16 }}>No open positions</td></tr>}
            {positions.map(pos => {
              const lp   = prices[pos.sym];
              const inst = ALL_INSTRUMENTS.find(i => i.sym === pos.sym);
              const d    = inst?.digits ?? 2;
              const cur  = lp ? (pos.type==='BUY' ? lp.bid : lp.ask) : pos.open;
              return (
                <tr key={pos.id}>
                  <td className="mono text-muted" style={{ fontSize:10 }}>{pos.id}</td>
                  <td style={{ fontWeight:700 }}>{pos.sym}</td>
                  <td><span className={`badge badge-${pos.type==='BUY'?'green':'red'}`}>{pos.type}</span></td>
                  <td className="mono">{pos.lots}</td>
                  <td className="mono">{pos.open.toFixed(d)}</td>
                  <td className="mono dn">{pos.sl?pos.sl.toFixed(d):'—'}</td>
                  <td className="mono up">{pos.tp?pos.tp.toFixed(d):'—'}</td>
                  <td className={`mono ${pos.type==='BUY'?'up':'dn'}`}>{cur.toFixed(d)}</td>
                  <td className={`mono ${pos.pips>=0?'up':'dn'}`}>{pos.pips>=0?'+':''}{pos.pips}</td>
                  <td className={`mono ${pos.pl>=0?'up':'dn'}`} style={{ fontWeight:700 }}>{pos.pl>=0?'+':''}${pos.pl.toFixed(2)}</td>
                  <td><button className="pos-close-btn" onClick={() => onClose(pos.id)}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── OrderPanel ─────────────────────────────────────────────────────────────── */

function OrderPanel({ sym, prices, onPlace }) {
  const inst = ALL_INSTRUMENTS.find(i => i.sym === sym);
  const p    = prices[sym];
  const [orderType, setOrderType] = useState('market');
  const [lots,      setLots]      = useState('0.10');
  const [sl,        setSl]        = useState('');
  const [tp,        setTp]        = useState('');
  const [limitPx,   setLimitPx]   = useState('');
  const [flash,     setFlash]     = useState(null);

  if (!p || !inst) return null;
  const bid = p.bid.toFixed(inst.digits);
  const ask = p.ask.toFixed(inst.digits);
  const spd = (inst.spread / inst.pip).toFixed(1);

  const place = side => {
    onPlace({ sym, type: side==='buy'?'BUY':'SELL', lots: parseFloat(lots)||0.01, open: side==='buy'?p.ask:p.bid, sl:parseFloat(sl)||null, tp:parseFloat(tp)||null });
    setFlash(side); setTimeout(() => setFlash(null), 500);
  };

  return (
    <div className="order-panel">
      <div className="op-header">
        <div className="op-sym-name">{sym}</div>
        <div className="op-sym-label">{inst.label}</div>
      </div>

      <div className="op-prices">
        <div className={`op-side op-sell${flash==='sell'?' flash-red':''}`} onClick={() => place('sell')}>
          <div className="op-side-lbl" style={{ color:'var(--rd)' }}>SELL</div>
          <div className="op-side-price dn mono">{bid}</div>
        </div>
        <div className="op-spread-col">
          <div className="op-spread-val mono">{spd}</div>
          <div className="op-spread-lbl">pts</div>
        </div>
        <div className={`op-side op-buy${flash==='buy'?' flash-green':''}`} onClick={() => place('buy')}>
          <div className="op-side-lbl" style={{ color:'var(--gn)' }}>BUY</div>
          <div className="op-side-price up mono">{ask}</div>
        </div>
      </div>

      <div className="op-body">
        <div className="op-type-row">
          {['market','limit','stop'].map(t => <button key={t} className={`op-type-btn${orderType===t?' active':''}`} onClick={() => setOrderType(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        <div className="op-field">
          <label>Volume (lots)</label>
          <div className="op-num-row">
            <button className="op-stepper" onClick={() => setLots(v => Math.max(0.01, +v - 0.01).toFixed(2))}>−</button>
            <input className="op-input mono" value={lots} onChange={e => setLots(e.target.value)}/>
            <button className="op-stepper" onClick={() => setLots(v => (+v + 0.01).toFixed(2))}>+</button>
          </div>
        </div>

        {(orderType==='limit'||orderType==='stop') && (
          <div className="op-field">
            <label>{orderType==='limit'?'Limit':'Stop'} Price</label>
            <input className="op-input mono full" value={limitPx} onChange={e => setLimitPx(e.target.value)} placeholder={bid}/>
          </div>
        )}

        <div className="op-sl-tp">
          <div className="op-field">
            <label className="dn">Stop Loss</label>
            <input className="op-input mono full" value={sl} onChange={e => setSl(e.target.value)} placeholder="0.00"/>
          </div>
          <div className="op-field">
            <label className="up">Take Profit</label>
            <input className="op-input mono full" value={tp} onChange={e => setTp(e.target.value)} placeholder="0.00"/>
          </div>
        </div>

        <div className="op-exec-row">
          <button className="op-exec-btn op-exec-sell" onClick={() => place('sell')}>
            <span className="op-exec-lbl">SELL</span>
            <span className="op-exec-px mono">{bid}</span>
          </button>
          <button className="op-exec-btn op-exec-buy" onClick={() => place('buy')}>
            <span className="op-exec-lbl">BUY</span>
            <span className="op-exec-px mono">{ask}</span>
          </button>
        </div>

        <div className="op-info">
          <span>Margin: <span className="mono text-gold">${(+lots*inst.price*0.02).toFixed(2)}</span></span>
          <span>1pt = <span className="mono">${(+lots*10).toFixed(2)}</span></span>
        </div>
      </div>
    </div>
  );
}

/* ─── AppNav ─────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href:'/dashboard',    icon:'ti-layout-dashboard', label:'Dashboard'   },
  { href:'/copy-trading', icon:'ti-copy',             label:'Copy Trading'},
  { href:'/hire-trader',  icon:'ti-users',            label:'Hire a Trader'},
  { href:'/insights',     icon:'ti-chart-line',       label:'Insights'    },
  { href:'/marketplace',  icon:'ti-robot',            label:'Marketplace', badge:'NEW' },
  { href:'/terminal',     icon:'ti-chart-candle',     label:'Terminal', active:true },
];

function AppNav({ onMenuToggle, session, onConnectClick, onDisconnect }) {
  return (
    <nav className="gnav">
      <div className="nav-hamburger nav-hamburger--mobile" onClick={onMenuToggle}><span/><span/><span/></div>
      <a href="/" className="nav-logo">Trade<em>Flow</em></a>
      <span className="nav-live">LIVE</span>
      <div className="gnav-links">
        {NAV_LINKS.map(({ href, icon, label, active, badge }) => (
          <a key={label} href={href} className={`gnav-link${active?' active':''}`}>
            <i className={`ti ${icon}`}/>{label}
            {badge && <span className="gnav-link-badge">{badge}</span>}
          </a>
        ))}
      </div>
      <div className="gnav-right">
        {session ? (
          <>
            <div className="nav-sess">
              <div className="nav-sess-logo" style={{ background: session.broker.color }}>{session.broker.logo}</div>
              <div>
                <div className="nav-sess-name">{session.broker.name} · <span className={session.accType==='live'?'up':'text-muted'}>{session.accType.toUpperCase()}</span></div>
                <div className="nav-sess-bal">Balance: <span className="text-gold">${session.balance.toLocaleString()}</span> · Equity: <span className="up">${session.equity.toLocaleString()}</span></div>
              </div>
            </div>
            <button className="btn-disconnect" onClick={onDisconnect}><i className="ti ti-plug-x"/> Disconnect</button>
          </>
        ) : (
          <button className="btn-connect" onClick={onConnectClick}><i className="ti ti-plug"/> Connect Account</button>
        )}
        <div className="nav-icon-btn"><a href='/notification'><i className="ti ti-bell"/><span className="nav-ndot"/></a></div>
        <div className="nav-av">AK</div>
      </div>
    </nav>
  );
}

function MobileSidebar({ open, onClose }) {
  const accLinks = [
    { href:'/payments', icon:'ti-credit-card', label:'Payments' },
    { href:'/profile',  icon:'ti-user-circle', label:'Profile'  },
    { href:'/settings', icon:'ti-settings',    label:'Settings' },
    { href:'/support',  icon:'ti-headset',     label:'Support'  },
  ];
  return (
    <>
      <div className={`sidebar-backdrop${open?' open':''}`} onClick={onClose}/>
      <div className={`sidebar${open?' open':''}`}>
        <div>
          <div className="sb-lbl">Main</div>
          {NAV_LINKS.map(({ href, icon, label, active, badge }) => (
            <a key={label} href={href} className={`sb-item${active?' active':''}`}>
              <i className={`ti ${icon}`}/>{label}
              {badge && <span style={{ marginLeft:'auto', fontSize:8, fontWeight:800, background:'var(--g)', color:'#000', padding:'1px 5px', borderRadius:3 }}>{badge}</span>}
            </a>
          ))}
        </div>
        <div style={{ marginTop:8 }}>
          <div className="sb-lbl">Account</div>
          {accLinks.map(({ href, icon, label }) => (
            <a key={label} href={href} className="sb-item"><i className={`ti ${icon}`}/>{label}</a>
          ))}
        </div>
        <div className="sb-spacer"/>
        <div className="sb-user">
          <div className="sb-av">AK</div>
          <div><div className="sb-name">Alex Kim</div><div className="sb-role">Pro · Verified</div></div>
        </div>
      </div>
    </>
  );
}

/* ─── MobileSymbolScreen ─────────────────────────────────────────────────────── */

function MobileSymbolScreen({ prices, watchlist, selectedSym, onSelect }) {
  const cats = [...new Set(watchlist.map(sym => ALL_INSTRUMENTS.find(i => i.sym === sym)?.cat).filter(Boolean))];
  return (
    <div className="mob-sym-screen">
      <div className="mob-sym-header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span className="mob-sym-title">Market Watch</span>
          <span style={{ fontSize:9, color:'var(--g)', fontWeight:700, fontFamily:'var(--mono)' }}>● LIVE</span>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 72px 72px', padding:'6px 14px 4px', borderBottom:'1px solid var(--br)', background:'var(--s2)' }}>
        <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--nt)' }}>Symbol</span>
        <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--nt)', textAlign:'right' }}>Bid</span>
        <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--nt)', textAlign:'right' }}>Ask</span>
      </div>
      <div className="mob-sym-list">
        {cats.map(cat => (
          <React.Fragment key={cat}>
            <div className="mob-sym-cat">{cat}</div>
            {watchlist
              .map(sym => ALL_INSTRUMENTS.find(i => i.sym === sym))
              .filter(inst => inst?.cat === cat)
              .map(inst => {
                const p = prices[inst.sym];
                if (!p) return null;
                return (
                  <div key={inst.sym} className={`mob-sym-row${selectedSym===inst.sym?' active':''}`} onClick={() => onSelect(inst.sym)}>
                    <div>
                      <span className="mob-sym-name">{inst.sym}</span>
                      <span className="mob-sym-label">{inst.label}</span>
                      <span className={`mob-sym-chg ${p.changePct>=0?'up':'dn'}`}>{p.changePct>=0?'+':''}{p.changePct.toFixed(2)}%</span>
                    </div>
                    <span className={`mob-sym-price ${p.dir===1?'flash-up':p.dir===-1?'flash-dn':''}`}>{p.bid.toFixed(inst.digits)}</span>
                    <span className="mob-sym-price mob-sym-ask">{p.ask.toFixed(inst.digits)}</span>
                  </div>
                );
              })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─── MobileChartPane ────────────────────────────────────────────────────────── */

function MobileChartPane({ sym, tf, onTf, prices, chartType, onChartType, activeTool, onTool, drawings, onAddDrawing, onClearDrawings }) {
  const inst = ALL_INSTRUMENTS.find(i => i.sym === sym);
  const p    = prices[sym];

  const [tfOpen,   setTfOpen]   = useState(false);
  const [toolOpen, setToolOpen] = useState(false);
  const [ctOpen,   setCtOpen]   = useState(false);
  const tfRef   = useRef(null);
  const toolRef = useRef(null);
  const ctRef   = useRef(null);

  const tools = [
    { id:'cursor',    icon:'ti-pointer'            },
    { id:'cross',     icon:'ti-crosshair'          },
    { id:'pan',       icon:'ti-hand-stop'          },
    { id:'zoomin',    icon:'ti-zoom-in'            },
    { id:'zoomout',   icon:'ti-zoom-out'           },
    { id:'trendline', icon:'ti-trending-up'        },
    { id:'hline',     icon:'ti-minus'              },
    { id:'ray',       icon:'ti-arrow-narrow-right' },
    { id:'fib',       icon:'ti-wave-sine'          },
    { id:'rect',      icon:'ti-square'             },
    { id:'text',      icon:'ti-text-size'          },
  ];
  const chartTypes = [
    { id:'candle', icon:'ti-chart-candle' },
    { id:'bar',    icon:'ti-chart-bar'   },
    { id:'line',   icon:'ti-chart-line'  },
  ];

  const activeTool_ = tools.find(t => t.id === activeTool);
  const activeCt_   = chartTypes.find(c => c.id === chartType);

  useEffect(() => {
    const h = e => {
      if (tfRef.current && !tfRef.current.contains(e.target)) setTfOpen(false);
      if (toolRef.current && !toolRef.current.contains(e.target)) setToolOpen(false);
      if (ctRef.current && !ctRef.current.contains(e.target)) setCtOpen(false);
    };
    document.addEventListener('mousedown', h);
    document.addEventListener('touchstart', h);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('touchstart', h); };
  }, []);

  const closeAll = () => { setTfOpen(false); setToolOpen(false); setCtOpen(false); };

  return (
    <div className="mob-chart-pane">
      {/* Chart toolbar */}
      <div className="mob-chart-toolbar">
        <span className="mob-ct-sym">{sym}</span>
        {p && inst && <>
          <span className={`mob-ct-price mono ${p.dir===1?'up':'dn'}`}>{p.bid.toFixed(inst.digits)}</span>
          <span className={`mob-ct-chg ${p.changePct>=0?'up':'dn'}`}
            style={{ background: p.changePct>=0?'rgba(52,211,153,.12)':'rgba(248,113,113,.12)', padding:'2px 6px', borderRadius:3 }}>
            {p.changePct>=0?'+':''}{p.changePct.toFixed(2)}%
          </span>
        </>}
        <div className="mob-ct-spacer"/>

        {/* TF dropdown */}
        <div className="mob-dd" ref={tfRef}>
          <button className="mob-dd-btn accent" onClick={() => { closeAll(); setTfOpen(v=>!v); }}>
            {TF_MAP[tf]} <i className={`ti ti-chevron-${tfOpen?'up':'down'} ch`}/>
          </button>
          <div className={`mob-dd-menu tf-grid${tfOpen?' open':''}`}>
            {TIMEFRAMES.map(t => (
              <div key={t} className={`mob-dd-tf-opt${tf===t?' active':''}`}
                onClick={() => { onTf(t); setTfOpen(false); }}>{TF_MAP[t]}</div>
            ))}
          </div>
        </div>

        {/* Chart type dropdown */}
        <div className="mob-dd" ref={ctRef}>
          <button className="mob-dd-btn" onClick={() => { closeAll(); setCtOpen(v=>!v); }}>
            <i className={`ti ${activeCt_?.icon||'ti-chart-candle'}`}/><i className="ti ti-chevron-down ch"/>
          </button>
          <div className={`mob-dd-menu ct-grid${ctOpen?' open':''}`}>
            {chartTypes.map(ct => (
              <div key={ct.id} className={`mob-dd-ct-opt${chartType===ct.id?' active':''}`}
                onClick={() => { onChartType(ct.id); setCtOpen(false); }}>
                <i className={`ti ${ct.icon}`}/>
              </div>
            ))}
          </div>
        </div>

        {/* Tools dropdown */}
        <div className="mob-dd" ref={toolRef}>
          <button className="mob-dd-btn" onClick={() => { closeAll(); setToolOpen(v=>!v); }}>
            <i className={`ti ${activeTool_?.icon||'ti-pointer'}`}/><i className="ti ti-chevron-down ch"/>
          </button>
          <div className={`mob-dd-menu tool-grid${toolOpen?' open':''}`}
            style={{ left:'auto', right:0 }}>
            {tools.map(t => (
              <div key={t.id} className={`mob-dd-tool-opt${activeTool===t.id?' active':''}`}
                onClick={() => { onTool(t.id); setToolOpen(false); }}>
                <i className={`ti ${t.icon}`}/>
              </div>
            ))}
            <div className="mob-dd-tool-opt" style={{ opacity:.5 }}
              onClick={() => { onClearDrawings(); setToolOpen(false); }}>
              <i className="ti ti-trash"/>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-area" style={{ flex:1 }}>
        <CandleChart sym={sym} tf={tf} activeTool={activeTool} drawings={drawings}
          onAddDrawing={d => { onAddDrawing(d); onTool('cursor'); }}/>
      </div>
    </div>
  );
}

/* ─── MobileTradeScreen ──────────────────────────────────────────────────────── */

function MobileTradeScreen({ sym, prices, positions, onPlace, onClosePos }) {
  const [tab,       setTab]       = useState('new');
  const [orderType, setOrderType] = useState('market');
  const [lots,      setLots]      = useState('0.10');
  const [sl,        setSl]        = useState('');
  const [tp,        setTp]        = useState('');
  const [limitPx,   setLimitPx]   = useState('');
  const [flash,     setFlash]     = useState(null);

  const inst = ALL_INSTRUMENTS.find(i => i.sym === sym);
  const p    = prices[sym];
  if (!p || !inst) return null;

  const bid = p.bid.toFixed(inst.digits);
  const ask = p.ask.toFixed(inst.digits);
  const spd = (inst.spread / inst.pip).toFixed(1);
  const totalPL = positions.reduce((s, pos) => s + pos.pl, 0);

  const place = side => {
    onPlace({ sym, type: side==='buy'?'BUY':'SELL', lots: parseFloat(lots)||0.01, open: side==='buy'?p.ask:p.bid, sl:parseFloat(sl)||null, tp:parseFloat(tp)||null });
    setFlash(side); setTimeout(() => setFlash(null), 500);
  };

  return (
    <div className="mob-trade-screen">
      <div className="mob-trade-inner-tabs">
        <div className={`mob-tit${tab==='new'?' active':''}`} onClick={() => setTab('new')}>
          <i className="ti ti-plus"/> New Trade
        </div>
        <div className={`mob-tit${tab==='positions'?' active':''}`} onClick={() => setTab('positions')}>
          <i className="ti ti-list"/> Positions ({positions.length})
        </div>
      </div>

      <div className="mob-trade-content">
        {tab === 'new' && (
          <div className="mob-order-form">
            {/* Symbol + spread header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:800 }}>{sym}</div>
                <div style={{ fontSize:10, color:'var(--nt)' }}>{inst.label}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:9, color:'var(--nt)', marginBottom:2 }}>SPREAD</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:14, fontWeight:800 }}>{spd} <span style={{ fontSize:9, color:'var(--nt)' }}>pts</span></div>
              </div>
            </div>

            {/* SELL / BUY buttons */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              <div className={`op-side op-sell${flash==='sell'?' flash-red':''}`} onClick={() => place('sell')}
                style={{ padding:'14px 10px', borderRadius:10 }}>
                <div className="op-side-lbl" style={{ color:'var(--rd)', fontSize:10, letterSpacing:1.2 }}>SELL</div>
                <div className="op-side-price dn mono" style={{ fontSize:20 }}>{bid}</div>
              </div>
              <div className={`op-side op-buy${flash==='buy'?' flash-green':''}`} onClick={() => place('buy')}
                style={{ padding:'14px 10px', borderRadius:10 }}>
                <div className="op-side-lbl" style={{ color:'var(--gn)', fontSize:10, letterSpacing:1.2 }}>BUY</div>
                <div className="op-side-price up mono" style={{ fontSize:20 }}>{ask}</div>
              </div>
            </div>

            {/* Order type */}
            <div className="op-type-row" style={{ marginBottom:12 }}>
              {['market','limit','stop'].map(t => (
                <button key={t} className={`op-type-btn${orderType===t?' active':''}`}
                  onClick={() => setOrderType(t)} style={{ padding:'6px 0', fontSize:11 }}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>

            {/* Lots */}
            <div className="op-field" style={{ marginBottom:10 }}>
              <label>Volume (lots)</label>
              <div className="op-num-row">
                <button className="op-stepper" style={{ width:38, height:38 }}
                  onClick={() => setLots(v => Math.max(0.01, +v - 0.01).toFixed(2))}>−</button>
                <input className="op-input mono" style={{ height:38, fontSize:15 }} value={lots}
                  onChange={e => setLots(e.target.value)}/>
                <button className="op-stepper" style={{ width:38, height:38 }}
                  onClick={() => setLots(v => (+v + 0.01).toFixed(2))}>+</button>
              </div>
            </div>

            {(orderType==='limit'||orderType==='stop') && (
              <div className="op-field" style={{ marginBottom:10 }}>
                <label>{orderType==='limit'?'Limit':'Stop'} Price</label>
                <input className="op-input mono full" style={{ height:38 }} value={limitPx}
                  onChange={e => setLimitPx(e.target.value)} placeholder={bid}/>
              </div>
            )}

            {/* SL/TP */}
            <div className="op-sl-tp" style={{ marginBottom:12 }}>
              <div className="op-field">
                <label className="dn">Stop Loss</label>
                <input className="op-input mono full" style={{ height:38 }} value={sl}
                  onChange={e => setSl(e.target.value)} placeholder="0.00"/>
              </div>
              <div className="op-field">
                <label className="up">Take Profit</label>
                <input className="op-input mono full" style={{ height:38 }} value={tp}
                  onChange={e => setTp(e.target.value)} placeholder="0.00"/>
              </div>
            </div>

            {/* Execute buttons */}
            <div className="op-exec-row" style={{ marginBottom:10 }}>
              <button className="op-exec-btn op-exec-sell" style={{ padding:'16px 6px' }} onClick={() => place('sell')}>
                <span className="op-exec-lbl" style={{ fontSize:12, letterSpacing:2 }}>SELL</span>
                <span className="op-exec-px mono">{bid}</span>
              </button>
              <button className="op-exec-btn op-exec-buy" style={{ padding:'16px 6px' }} onClick={() => place('buy')}>
                <span className="op-exec-lbl" style={{ fontSize:12, letterSpacing:2 }}>BUY</span>
                <span className="op-exec-px mono">{ask}</span>
              </button>
            </div>

            <div className="op-info">
              <span>Margin: <span className="mono text-gold">${(+lots*inst.price*0.02).toFixed(2)}</span></span>
              <span>1pt = <span className="mono">${(+lots*10).toFixed(2)}</span></span>
            </div>
          </div>
        )}

        {tab === 'positions' && (
          <div className="mob-pos-list">
            {positions.length === 0 && (
              <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--nt)', fontSize:13 }}>
                <i className="ti ti-inbox" style={{ fontSize:32, display:'block', marginBottom:10, opacity:.3 }}/>
                No open positions
              </div>
            )}
            {positions.length > 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 4px 10px', borderBottom:'1px solid var(--br)', marginBottom:4, fontSize:12 }}>
                <span style={{ color:'var(--nt)' }}>Total Float P/L</span>
                <span className={`mono ${totalPL>=0?'up':'dn'}`} style={{ fontWeight:800 }}>{totalPL>=0?'+':''}${totalPL.toFixed(2)}</span>
              </div>
            )}
            {positions.map(pos => {
              const lp      = prices[pos.sym];
              const posInst = ALL_INSTRUMENTS.find(i => i.sym === pos.sym);
              const d       = posInst?.digits ?? 2;
              const cur     = lp ? (pos.type==='BUY' ? lp.bid : lp.ask) : pos.open;
              return (
                <div key={pos.id} className="mob-pos-card">
                  <div className="mob-pos-header">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span className="mob-pos-sym">{pos.sym}</span>
                      <span className={`badge badge-${pos.type==='BUY'?'green':'red'}`}>{pos.type}</span>
                      <span style={{ fontSize:10, color:'var(--nt)' }}>{pos.lots} lots</span>
                    </div>
                    <span className={`mob-pos-pl ${pos.pl>=0?'up':'dn'}`}>{pos.pl>=0?'+':''}${pos.pl.toFixed(2)}</span>
                  </div>
                  <div className="mob-pos-row"><span>Open</span><span>{pos.open.toFixed(d)}</span></div>
                  <div className="mob-pos-row"><span>Current</span><span className={pos.type==='BUY'?'up':'dn'}>{cur.toFixed(d)}</span></div>
                  {pos.sl ? <div className="mob-pos-row"><span>Stop Loss</span><span className="dn">{pos.sl.toFixed(d)}</span></div> : null}
                  {pos.tp ? <div className="mob-pos-row"><span>Take Profit</span><span className="up">{pos.tp.toFixed(d)}</span></div> : null}
                  <div className="mob-pos-row"><span>Pips</span><span className={pos.pips>=0?'up':'dn'}>{pos.pips>=0?'+':''}{pos.pips}</span></div>
                  <button className="mob-pos-close" onClick={() => onClosePos(pos.id)}>Close Position</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MobileJournalScreen ────────────────────────────────────────────────────── */

function MobileJournalScreen({ journalLog }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--bg)' }}>
      <div style={{ padding:'12px 14px 8px', background:'var(--s)', borderBottom:'1px solid var(--br)', flexShrink:0 }}>
        <span style={{ fontSize:13, fontWeight:800, letterSpacing:'.4px', color:'var(--nt)', textTransform:'uppercase' }}>Journal</span>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'10px 14px' }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:11, lineHeight:2, color:'var(--nt)' }}>
          {journalLog.map((entry, i) => (
            <div key={i}><span style={{ color:'var(--g)' }}>[{entry.time}]</span> {entry.msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MobileSettingsScreen ───────────────────────────────────────────────────── */

function MobileSettingsScreen({ session, onConnectClick, onDisconnect }) {
  const links = [
    { icon:'ti-user-circle', label:'Profile',  href:'/profile' },
    { icon:'ti-credit-card', label:'Payments', href:'/payments' },
    { icon:'ti-settings',    label:'Settings', href:'/settings' },
    { icon:'ti-headset',     label:'Support',  href:'/support'  },
    { icon:'ti-shield-lock', label:'Legal',    href:'/legal'    },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--bg)' }}>
      <div style={{ padding:'12px 14px 8px', background:'var(--s)', borderBottom:'1px solid var(--br)', flexShrink:0 }}>
        <span style={{ fontSize:13, fontWeight:800, letterSpacing:'.4px', color:'var(--nt)', textTransform:'uppercase' }}>Settings</span>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        {/* Account card */}
        <div style={{ margin:'14px', background:'var(--s)', border:'1px solid var(--br)', borderRadius:12, padding:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,var(--g),#78d000)', color:'#000', fontSize:13, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>AK</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800 }}>Alex Kim</div>
              <div style={{ fontSize:11, color:'var(--g)' }}>Pro · Verified</div>
            </div>
          </div>
          {session ? (
            <div style={{ background:'var(--s2)', borderRadius:8, padding:'10px 12px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:session.broker.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:800, color:'#000' }}>{session.broker.logo}</div>
                <span style={{ fontSize:12, fontWeight:700 }}>{session.broker.name}</span>
                <span className={session.accType==='live'?'up':'text-muted'} style={{ fontSize:9, fontWeight:800, marginLeft:'auto' }}>{session.accType.toUpperCase()}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, fontSize:11 }}>
                <div style={{ color:'var(--nt)' }}>Balance</div><div className="mono text-gold">${session.balance.toLocaleString()}</div>
                <div style={{ color:'var(--nt)' }}>Equity</div><div className="mono up">${session.equity.toLocaleString()}</div>
              </div>
            </div>
          ) : null}
          {session
            ? <button className="btn-disconnect" style={{ width:'100%', justifyContent:'center', padding:'9px' }} onClick={onDisconnect}><i className="ti ti-plug-x"/> Disconnect Account</button>
            : <button className="btn-connect" style={{ width:'100%', justifyContent:'center', padding:'10px', fontSize:13 }} onClick={onConnectClick}><i className="ti ti-plug"/> Connect Account</button>
          }
        </div>
        {/* Nav links */}
        <div style={{ margin:'0 14px', background:'var(--s)', border:'1px solid var(--br)', borderRadius:12, overflow:'hidden' }}>
          {links.map(({ icon, label, href }, idx) => (
            <a key={label} href={href}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', color:'var(--nt)', borderBottom: idx<links.length-1?'1px solid var(--br)':'none', transition:'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.03)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <i className={`ti ${icon}`} style={{ fontSize:19 }}/>
              <span style={{ fontSize:14, fontWeight:600 }}>{label}</span>
              <i className="ti ti-chevron-right" style={{ marginLeft:'auto', fontSize:14, opacity:.4 }}/>
            </a>
          ))}
        </div>
        <div style={{ padding:'20px 14px', fontSize:10, color:'var(--nt)', textAlign:'center' }}>
          TradeFlow WebTerminal v2.4.1 · © 2025 TradeFlow Inc.
        </div>
      </div>
    </div>
  );
}

/* ─── Terminal Page ──────────────────────────────────────────────────────────── */

export default function Terminal() {
  const [session,     setSession]     = useState(null);
  const [showConnect, setShowConnect] = useState(false);
  const [selectedSym, setSelectedSym] = useState('EURUSD');
  const [tf,          setTf]          = useState('H1');
  const [chartType,   setChartType]   = useState('candle');
  const [positions,   setPositions]   = useState(DEMO_POSITIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bottomTab,   setBottomTab]   = useState('positions');
  const [orderToast,  setOrderToast]  = useState(null);
  const [watchlist,   setWatchlist]   = useState(DEFAULT_WL);
  const [activeTool,  setActiveTool]  = useState('cursor');
  const [drawings,    setDrawings]    = useState([]);
  const [journalLog,  setJournalLog]  = useState([
    { time: new Date().toLocaleTimeString(), msg: 'TradeFlow WebTerminal started', col: T.g },
    { time: new Date().toLocaleTimeString(), msg: 'Market data feed connected · 700ms tick interval', col: T.g },
  ]);
  const [mobView, setMobView] = useState('symbols');

  const prices = useLivePrices();

  const addJournal = msg => setJournalLog(prev => [{ time: new Date().toLocaleTimeString(), msg, col: T.g }, ...prev].slice(0, 50));

  const handleAddSymbol    = useCallback(sym => setWatchlist(prev => prev.includes(sym) ? prev : [...prev, sym]), []);
  const handleRemoveSymbol = useCallback(sym => setWatchlist(prev => prev.filter(s => s !== sym)), []);

  const handlePlaceOrder = useCallback(order => {
    const inst = ALL_INSTRUMENTS.find(i => i.sym === order.sym);
    const newPos = { id: Date.now(), sym: order.sym, type: order.type, lots: order.lots, open: order.open, sl: order.sl, tp: order.tp, pl: 0, pips: 0 };
    setPositions(prev => [newPos, ...prev]);
    const msg = `${order.type} ${order.lots} lots ${order.sym} @ ${order.open.toFixed(inst?.digits||2)}`;
    setOrderToast(msg);
    addJournal(msg);
    setTimeout(() => setOrderToast(null), 2500);
  }, []);

  const handleClosePosition = useCallback(id => {
    const pos = positions.find(p => p.id === id);
    if (pos) addJournal(`Closed position #${id} ${pos.sym} · P/L: ${pos.pl>=0?'+':''}$${pos.pl.toFixed(2)}`);
    setPositions(prev => prev.filter(p => p.id !== id));
  }, [positions]);

  const handleConnected = useCallback(sess => {
    setSession(sess);
    setPositions(sess.accType === 'demo' ? [] : DEMO_POSITIONS);
    addJournal(`Connected to ${sess.broker.name} · ${sess.server.name} [${sess.accType.toUpperCase()}]`);
  }, []);

  const MOB_NAV = [
    { id:'symbols',  icon:'ti-list-search'     },
    { id:'chart',    icon:'ti-chart-candle'    },
    { id:'trade',    icon:'ti-arrows-exchange' },
    { id:'settings', icon:'ti-settings'        },
    { id:'journal',  icon:'ti-terminal-2'      },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>

      <div style={{ display:'flex', flexDirection:'column', height:'100dvh', overflow:'hidden' }}>
        <AppNav
          onMenuToggle={() => setSidebarOpen(v => !v)}
          session={session}
          onConnectClick={() => setShowConnect(true)}
          onDisconnect={() => { setSession(null); setPositions(DEMO_POSITIONS); addJournal('Account disconnected'); }}
        />

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

        {orderToast && (
          <div className="order-toast"><i className="ti ti-check"/> {orderToast}</div>
        )}

        {showConnect && (
          <ConnectModal onClose={() => setShowConnect(false)} onConnected={handleConnected}/>
        )}

        {/* ── DESKTOP terminal shell ── */}
        <div className="term-shell" style={{ flex:1, overflow:'hidden' }}>
          <div className="term-left">
            <Watchlist
              prices={prices} selected={selectedSym} onSelect={setSelectedSym}
              watchlist={watchlist} onAddSymbol={handleAddSymbol} onRemoveSymbol={handleRemoveSymbol}
              session={session}
            />
          </div>
          <div className="term-center">
            <Toolbar
              tf={tf} onTf={setTf} sym={selectedSym} prices={prices}
              chartType={chartType} onChartType={setChartType}
              activeTool={activeTool} onTool={setActiveTool}
              onClearDrawings={() => setDrawings([])}
            />
            <div className="chart-area">
              <CandleChart
                sym={selectedSym} tf={tf} activeTool={activeTool}
                drawings={drawings}
                onAddDrawing={d => { setDrawings(prev => [...prev, d]); setActiveTool('cursor'); }}
              />
            </div>
            <div className="term-bottom">
              <div className="bp-tabs">
                {[
                  { key:'positions', icon:'ti-list',    label:`Positions (${positions.length})` },
                  { key:'orders',    icon:'ti-clock',   label:'Pending (0)'                     },
                  { key:'history',   icon:'ti-history', label:'History'                          },
                  { key:'journal',   icon:'ti-terminal',label:'Journal'                          },
                ].map(({ key, icon, label }) => (
                  <button key={key} className={`bp-tab${bottomTab===key?' active':''}`} onClick={() => setBottomTab(key)}>
                    <i className={`ti ${icon}`}/>{label}
                  </button>
                ))}
              </div>
              <div className="bp-content">
                {bottomTab==='positions' && <Positions positions={positions} prices={prices} onClose={handleClosePosition}/>}
                {bottomTab==='orders'    && <div style={{ padding:'18px', color:'var(--nt)', fontSize:13, textAlign:'center' }}>No pending orders</div>}
                {bottomTab==='history'   && <div style={{ padding:'18px', color:'var(--nt)', fontSize:13, textAlign:'center' }}>{session?'No closed trades in history':'Connect an account to view trade history'}</div>}
                {bottomTab==='journal'   && (
                  <div className="journal">
                    {journalLog.map((entry, i) => (
                      <div key={i}><span className="journal-time">[{entry.time}]</span> {entry.msg}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="term-right">
            <OrderPanel sym={selectedSym} prices={prices} onPlace={handlePlaceOrder}/>
          </div>
        </div>

        {/* ── MOBILE PANES ── */}
        <div className={`mob-pane${mobView==='symbols'?'':' hidden'}`}>
          <MobileSymbolScreen
            prices={prices} watchlist={watchlist}
            selectedSym={selectedSym}
            onSelect={sym => { setSelectedSym(sym); setMobView('chart'); }}
          />
        </div>
        <div className={`mob-pane${mobView==='chart'?'':' hidden'}`}>
          <MobileChartPane
            sym={selectedSym} tf={tf} onTf={setTf} prices={prices}
            chartType={chartType} onChartType={setChartType}
            activeTool={activeTool} onTool={setActiveTool}
            drawings={drawings}
            onAddDrawing={d => setDrawings(prev => [...prev, d])}
            onClearDrawings={() => setDrawings([])}
          />
        </div>
        <div className={`mob-pane${mobView==='trade'?'':' hidden'}`}>
          <MobileTradeScreen
            sym={selectedSym} prices={prices}
            positions={positions} onPlace={handlePlaceOrder} onClosePos={handleClosePosition}
          />
        </div>
        <div className={`mob-pane${mobView==='journal'?'':' hidden'}`}>
          <MobileJournalScreen journalLog={journalLog}/>
        </div>
        <div className={`mob-pane${mobView==='settings'?'':' hidden'}`}>
          <MobileSettingsScreen
            session={session}
            onConnectClick={() => setShowConnect(true)}
            onDisconnect={() => { setSession(null); setPositions(DEMO_POSITIONS); addJournal('Account disconnected'); }}
          />
        </div>

        {/* ── MOBILE BOTTOM NAV (icons only) ── */}
        <nav className="mob-bottom-nav">
          {MOB_NAV.map(({ id, icon }) => (
            <button key={id} className={`mob-nav-btn${mobView===id?' active':''}`} onClick={() => setMobView(id)}>
              <i className={`ti ${icon}`}/>
              {id==='trade' && positions.length > 0 && (
                <span className="mob-nav-badge">{positions.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer — desktop only */}
        <footer className="term-footer">
          <div style={{ display:'flex', alignItems:'center', gap:0 }}>
            <span className="tf-logo">Trade<em>Flow</em></span>
            <span className="tf-sep">·</span>
            <span>WebTerminal v2.4.1</span>
            <span className="tf-sep">·</span>
            <span>Market data is simulated for demonstration purposes</span>
          </div>
          <div className="tf-right">
            <a href="/legal">Legal</a>
            <a href="/privacy">Privacy</a>
            <a href="/support">Support</a>
            <span className="tf-sep">·</span>
            <span>© 2025 TradeFlow Inc.</span>
          </div>
        </footer>
      </div>
    </>
  );
}