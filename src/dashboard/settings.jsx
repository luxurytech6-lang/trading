import React, { useState } from 'react';

const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
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
    --bg:#080b10; --surface:#0e1219; --surface2:#141922;
    --border:#1e2535; --border2:#2a3347;
    --text:#e2e8f0; --muted:#64748b; --faint:#374151;
    --accent:#c8f560; --accent-dim:rgba(200,245,96,.12); --accent-glow:rgba(200,245,96,.06);
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

  .in-shell { display:grid; grid-template-columns:var(--sidebar-w) 1fr; height:100vh; overflow:hidden; }

  .in-sidebar {
    background:var(--surface); border-right:1px solid var(--border);
    display:flex; flex-direction:column; height:100vh;
    overflow-y:auto; overflow-x:hidden; position:relative; z-index:100;
    flex-shrink:0; transition:transform .25s cubic-bezier(.4,0,.2,1);
  }
  .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
  .in-sidebar::after {
    content:''; position:absolute; top:0; right:0; width:1px; height:100%;
    background:linear-gradient(180deg,transparent 0%,var(--accent) 30%,var(--border) 60%,transparent 100%);
    opacity:.15; pointer-events:none;
  }

  .in-brand { display:flex; align-items:center; gap:10px; padding:20px 20px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .in-brand-icon { width:34px; height:34px; background:var(--accent); border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .in-brand-icon i { font-size:18px; color:#000; }
  .in-brand-name { font-size:16px; font-weight:700; }
  .in-brand-name em { color:var(--accent); font-style:normal; }

  .in-sb-pill { margin:12px 16px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.18); border-radius:var(--r-md); padding:10px 14px; flex-shrink:0; }
  .in-sb-pill-label { font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
  .in-live-dot { width:6px; height:6px; background:var(--green); border-radius:50%; animation:in-pulse 2s infinite; flex-shrink:0; }
  @keyframes in-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .in-sb-pill-val { font-family:var(--mono); font-size:19px; font-weight:600; color:var(--accent); letter-spacing:-.5px; }
  .in-sb-pill-sub { font-size:11px; color:var(--green); margin-top:3px; }

  .in-sb-scroll { flex:1; overflow-y:auto; padding:8px 0; }
  .in-sb-section { padding:10px 20px 4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); }
  .in-sb-link {
    display:flex; align-items:center; gap:11px; padding:9px 20px;
    font-size:13px; font-weight:500; color:var(--muted);
    border-left:2px solid transparent; transition:all .15s; cursor:pointer;
  }
  .in-sb-link i { font-size:18px; flex-shrink:0; }
  .in-sb-link:hover { color:var(--text); background:var(--accent-glow); border-left-color:var(--border2); }
  .in-sb-link.active { color:var(--accent); background:var(--accent-dim); border-left-color:var(--accent); }
  .in-sb-badge { margin-left:auto; font-size:9px; font-weight:700; background:var(--accent); color:#000; padding:2px 6px; border-radius:5px; }

  .in-sb-user { flex-shrink:0; border-top:1px solid var(--border); padding:14px 16px; display:flex; align-items:center; gap:10px; }
  .in-sb-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    box-shadow:0 0 12px rgba(200,245,96,.3);
  }
  .in-sb-user-name { font-size:13px; font-weight:700; }
  .in-sb-user-role { font-size:10px; color:var(--accent); margin-top:1px; }

  .in-right { grid-column:2; display:flex; flex-direction:column; height:100vh; overflow:hidden; }

  .in-topbar {
    height:var(--topbar-h); flex-shrink:0; display:flex; align-items:center;
    padding:0 28px; background:var(--surface); border-bottom:1px solid var(--border); gap:16px; z-index:50;
  }
  .in-topbar-title { font-family:var(--serif); font-size:20px; color:var(--text); flex:1; }
  .in-topbar-title span { color:var(--accent); font-style:italic; }
  .in-tb-icon {
    width:36px; height:36px; border-radius:var(--r-sm); background:var(--surface2);
    border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .15s; color:var(--muted); font-size:18px; position:relative;
  }
  .in-tb-icon:hover { border-color:var(--border2); color:var(--text); }
  .in-notif-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; background:var(--red); border-radius:50%; border:1.5px solid var(--surface); }
  .in-tb-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center; cursor:pointer;
    box-shadow:0 0 10px rgba(200,245,96,.25);
  }
  .in-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; }
  .in-hamburger span { display:block; width:20px; height:2px; background:var(--text); border-radius:2px; }

  .in-main { flex:1; overflow-y:auto; overflow-x:hidden; padding:24px 28px 40px; }

  /* Buttons */
  .in-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    border-radius:var(--r-sm); font-family:var(--sans); font-weight:600;
    cursor:pointer; transition:all .15s; border:none; text-decoration:none; white-space:nowrap;
  }
  .in-btn-sm { font-size:12px; padding:7px 14px; }
  .in-btn-md { font-size:13px; padding:9px 18px; }
  .in-btn-accent { background:var(--accent); color:#000; }
  .in-btn-accent:hover { opacity:.88; box-shadow:0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .in-btn-ghost:hover { border-color:var(--border2); }
  .in-btn-danger { background:var(--red-dim); border:1px solid rgba(248,113,113,.2); color:var(--red); }
  .in-btn-danger:hover { background:rgba(248,113,113,.2); }

  /* Badge */
  .in-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap; }
  .in-badge-green  { background:var(--green-dim);  color:var(--green); }
  .in-badge-blue   { background:var(--blue-dim);   color:var(--blue); }
  .in-badge-gold   { background:var(--accent-dim); color:var(--accent); }
  .in-badge-amber  { background:var(--amber-dim);  color:var(--amber); }
  .in-badge-muted  { background:rgba(100,116,139,.12); color:var(--muted); }

  /* ── SETTINGS PAGE ── */

  .st-layout { display:grid; grid-template-columns:220px 1fr; gap:24px; align-items:start; }

  /* Settings sidebar nav */
  .st-nav { position:sticky; top:0; }
  .st-nav-section { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); padding:0 12px 6px; margin-top:16px; }
  .st-nav-section:first-child { margin-top:0; }
  .st-nav-link {
    display:flex; align-items:center; gap:10px; padding:9px 12px;
    font-size:13px; font-weight:500; color:var(--muted);
    border-radius:var(--r-sm); cursor:pointer; transition:all .15s;
    border:none; background:none; width:100%; text-align:left;
  }
  .st-nav-link i { font-size:17px; flex-shrink:0; }
  .st-nav-link:hover { color:var(--text); background:var(--accent-glow); }
  .st-nav-link.active { color:var(--accent); background:var(--accent-dim); }

  /* Panel */
  .st-panel { display:flex; flex-direction:column; gap:20px; min-width:0; }

  /* Section card */
  .st-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; }
  .st-card-head { padding:18px 22px 14px; border-bottom:1px solid var(--border); }
  .st-card-title { font-size:14px; font-weight:700; display:flex; align-items:center; gap:8px; margin-bottom:3px; }
  .st-card-title i { font-size:17px; color:var(--accent); }
  .st-card-desc { font-size:12px; color:var(--muted); }
  .st-card-body { padding:20px 22px; display:flex; flex-direction:column; gap:18px; }

  /* Row — label + control */
  .st-row { display:flex; align-items:center; justify-content:space-between; gap:20px; }
  .st-row-info { flex:1; min-width:0; }
  .st-row-label { font-size:13px; font-weight:600; margin-bottom:3px; }
  .st-row-sub { font-size:11px; color:var(--muted); line-height:1.4; }
  .st-divider { height:1px; background:var(--border); }

  /* Toggle */
  .st-toggle { position:relative; width:40px; height:22px; flex-shrink:0; cursor:pointer; }
  .st-toggle input { opacity:0; width:0; height:0; position:absolute; }
  .st-track {
    position:absolute; inset:0; border-radius:11px;
    background:var(--br2); transition:background .2s;
  }
  .st-toggle input:checked ~ .st-track { background:var(--accent); }
  .st-thumb {
    position:absolute; top:3px; left:3px;
    width:16px; height:16px; border-radius:50%;
    background:#fff; transition:transform .2s;
    pointer-events:none;
  }
  .st-toggle input:checked ~ .st-thumb { transform:translateX(18px); background:#000; }

  /* Input */
  .st-input {
    background:var(--surface2); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:8px 12px; font-size:13px; outline:none;
    transition:border-color .15s; width:100%;
  }
  .st-input:focus { border-color:var(--accent); }
  .st-input-group { display:flex; flex-direction:column; gap:6px; width:100%; }
  .st-input-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); }
  .st-input-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  /* Select */
  .st-select {
    background:var(--surface2); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:8px 12px; font-size:13px; outline:none;
    cursor:pointer; transition:border-color .15s; min-width:160px;
  }
  .st-select:focus { border-color:var(--accent); }

  /* Connected account row */
  .st-conn { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .st-conn:last-child { border-bottom:none; padding-bottom:0; }
  .st-conn-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .st-conn-name { font-size:13px; font-weight:700; margin-bottom:2px; }
  .st-conn-sub { font-size:11px; color:var(--muted); }

  /* Session row */
  .st-session { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .st-session:last-child { border-bottom:none; padding-bottom:0; }
  .st-session-icon { width:34px; height:34px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:16px; color:var(--muted); flex-shrink:0; }
  .st-session-device { font-size:12px; font-weight:700; margin-bottom:2px; }
  .st-session-sub { font-size:11px; color:var(--muted); }
  .st-session-current { font-size:10px; font-weight:700; color:var(--green); background:var(--green-dim); padding:2px 8px; border-radius:4px; }

  /* Plan card */
  .st-plan-card {
    background:linear-gradient(135deg,rgba(200,245,96,.07) 0%,rgba(200,245,96,.03) 100%);
    border:1px solid rgba(200,245,96,.18); border-radius:var(--r-md); padding:16px 18px;
    display:flex; align-items:center; gap:16px;
  }
  .st-plan-icon { width:42px; height:42px; border-radius:10px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.2); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .st-plan-name { font-size:15px; font-weight:700; color:var(--accent); margin-bottom:3px; }
  .st-plan-desc { font-size:11px; color:var(--muted); }

  /* Usage bar */
  .st-usage { display:flex; flex-direction:column; gap:14px; }
  .st-usage-row {}
  .st-usage-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
  .st-usage-label { font-size:12px; font-weight:600; }
  .st-usage-val { font-family:var(--mono); font-size:11px; color:var(--muted); }
  .st-usage-track { height:5px; background:var(--br2); border-radius:4px; overflow:hidden; }
  .st-usage-fill { height:100%; border-radius:4px; transition:width .3s; }

  /* Danger zone */
  .st-danger-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 0; border-bottom:1px solid var(--border); }
  .st-danger-row:last-child { border-bottom:none; padding-bottom:0; }

  /* Alert */
  .st-alert { border-radius:var(--r-sm); padding:12px 14px; font-size:12px; line-height:1.5; display:flex; align-items:flex-start; gap:10px; }
  .st-alert-warn { background:var(--amber-dim); border:1px solid rgba(245,158,11,.2); color:var(--am); }
  .st-alert i { font-size:16px; flex-shrink:0; margin-top:1px; }

  /* Responsive */
  @media (max-width:900px) {
    .st-layout { grid-template-columns:1fr; }
    .st-nav { position:static; display:flex; gap:4px; flex-wrap:wrap; overflow-x:auto; padding-bottom:8px; }
    .st-nav-section { display:none; }
    .st-nav-link { padding:7px 12px; white-space:nowrap; }
  }
  @media (max-width:768px) {
    .in-shell { grid-template-columns:1fr !important; }
    .in-sidebar { position:fixed !important; top:0 !important; left:0 !important; transform:translateX(-100%) !important; z-index:300 !important; }
    .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column:1; }
    .in-hamburger { display:flex; }
    .st-input-row { grid-template-columns:1fr; }
  }
  @media (max-width:600px) {
    .in-main { padding:16px; }
    .in-topbar { padding:0 16px; }
  }
`;

/* ─── Nav sections ─────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: 'Account',
    items: [
      { key: 'profile',      icon: 'ti-user',           label: 'Profile'         },
      { key: 'security',     icon: 'ti-shield-lock',    label: 'Security'        },
      { key: 'subscription', icon: 'ti-credit-card',    label: 'Subscription'    },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { key: 'notifications', icon: 'ti-bell',          label: 'Notifications'   },
      { key: 'appearance',    icon: 'ti-palette',       label: 'Appearance'      },
      { key: 'privacy',       icon: 'ti-eye-off',       label: 'Privacy'         },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { key: 'connected',    icon: 'ti-plug',           label: 'Connected Apps'  },
      { key: 'api',          icon: 'ti-code',           label: 'API Access'      },
    ],
  },
];

/* ─── Toggle component ──────────────────────────────── */
function Toggle({ defaultChecked = false, onChange }) {
  const [on, setOn] = useState(defaultChecked);
  const handle = () => { setOn(v => !v); onChange && onChange(!on); };
  return (
    <label className="st-toggle">
      <input type="checkbox" checked={on} onChange={handle} />
      <span className="st-track" />
      <span className="st-thumb" />
    </label>
  );
}

/* ─── Panels ─────────────────────────────────────────── */

function ProfilePanel() {
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-user" />Personal Information</div>
          <div className="st-card-desc">Your public-facing profile details.</div>
        </div>
        <div className="st-card-body">
          {/* Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{
              width:72, height:72, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg,#c8f560 0%,#78d000 100%)',
              color:'#000', fontSize:24, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 20px rgba(200,245,96,.3)',
            }}>AR</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-upload" /> Upload Photo</button>
              <div style={{ fontSize:11, color:T.nt }}>JPG, PNG or GIF · Max 5 MB</div>
            </div>
          </div>

          <div className="st-divider" />

          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">First Name</div>
              <input className="st-input" defaultValue="Alex" />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">Last Name</div>
              <input className="st-input" defaultValue="Rivera" />
            </div>
          </div>
          <div className="st-input-group">
            <div className="st-input-label">Username</div>
            <input className="st-input" defaultValue="@alexrivera" />
          </div>
          <div className="st-input-group">
            <div className="st-input-label">Bio</div>
            <textarea className="st-input" rows={3} style={{ resize:'vertical' }}
              defaultValue="Passionate about markets and data. Exploring trading strategies on my own terms." />
          </div>
          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">Location</div>
              <input className="st-input" defaultValue="New York, USA" />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">Website</div>
              <input className="st-input" defaultValue="alexrivera.trade" />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <button className="in-btn in-btn-ghost in-btn-sm">Discard</button>
            <button className="in-btn in-btn-accent in-btn-sm"><i className="ti ti-check" /> Save Changes</button>
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-mail" />Email Address</div>
          <div className="st-card-desc">Manage your login email.</div>
        </div>
        <div className="st-card-body">
          <div className="st-input-group">
            <div className="st-input-label">Current Email</div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="st-input" defaultValue="alex.rivera@email.com" />
              <button className="in-btn in-btn-ghost in-btn-sm" style={{ flexShrink:0 }}>Update</button>
            </div>
          </div>
          <div className="st-alert st-alert-warn">
            <i className="ti ti-alert-triangle" />
            Changing your email will require re-verification. You will be logged out of all sessions.
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-lock" />Password</div>
          <div className="st-card-desc">Use a strong, unique password for your account.</div>
        </div>
        <div className="st-card-body">
          <div className="st-input-group">
            <div className="st-input-label">Current Password</div>
            <input className="st-input" type="password" placeholder="••••••••••••" />
          </div>
          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">New Password</div>
              <input className="st-input" type="password" placeholder="••••••••••••" />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">Confirm Password</div>
              <input className="st-input" type="password" placeholder="••••••••••••" />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button className="in-btn in-btn-accent in-btn-sm"><i className="ti ti-lock" /> Update Password</button>
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-device-mobile" />Two-Factor Authentication</div>
          <div className="st-card-desc">Add an extra layer of security to your account.</div>
        </div>
        <div className="st-card-body">
          {[
            { icon:'ti-brand-google', label:'Authenticator App', sub:'Use Google Authenticator or similar', enabled:true,  iconBg:'rgba(96,165,250,.12)', iconCol:'#60a5fa' },
            { icon:'ti-message',     label:'SMS Verification',   sub:'Receive codes via text message',      enabled:false, iconBg:'rgba(52,211,153,.12)', iconCol:'#34d399' },
            { icon:'ti-mail',        label:'Email OTP',          sub:'Receive codes to your email',          enabled:false, iconBg:'rgba(200,245,96,.12)', iconCol:'#c8f560' },
          ].map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:m.iconBg, color:m.iconCol, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>
                    <i className={`ti ${m.icon}`} />
                  </div>
                  <div className="st-row-info">
                    <div className="st-row-label" style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {m.label}
                      {m.enabled && <span className="in-badge in-badge-green">Active</span>}
                    </div>
                    <div className="st-row-sub">{m.sub}</div>
                  </div>
                </div>
                <Toggle defaultChecked={m.enabled} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-devices" />Active Sessions</div>
          <div className="st-card-desc">Devices currently signed in to your account.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {[
            { icon:'ti-device-laptop', device:'MacBook Pro · Chrome',     loc:'New York, USA',        time:'Now', current:true  },
            { icon:'ti-device-mobile', device:'iPhone 15 · Mobile App',   loc:'New York, USA',        time:'2h ago', current:false },
            { icon:'ti-device-desktop',device:'Windows PC · Firefox',     loc:'New Jersey, USA',      time:'3 days ago', current:false },
          ].map((s, i) => (
            <div key={i} className="st-session">
              <div className="st-session-icon"><i className={`ti ${s.icon}`} /></div>
              <div style={{ flex:1 }}>
                <div className="st-session-device">{s.device}</div>
                <div className="st-session-sub">{s.loc} · {s.time}</div>
              </div>
              {s.current
                ? <span className="st-session-current">This device</span>
                : <button className="in-btn in-btn-ghost in-btn-sm" style={{ color:T.rd }}>Revoke</button>
              }
            </div>
          ))}
          <div style={{ marginTop:12 }}>
            <button className="in-btn in-btn-danger in-btn-sm"><i className="ti ti-logout" /> Sign Out All Other Devices</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionPanel() {
  const usages = [
    { label:'Price Alerts',     used:12, total:50,  color:'#c8f560' },
    { label:'Watchlist Spots',  used:38, total:100, color:'#60a5fa' },
    { label:'Signal Saves',     used:7,  total:20,  color:'#a78bfa' },
    { label:'API Calls / day',  used:840,total:2000,color:'#34d399' },
  ];
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-credit-card" />Current Plan</div>
          <div className="st-card-desc">Manage your subscription and billing.</div>
        </div>
        <div className="st-card-body">
          <div className="st-plan-card">
            <div className="st-plan-icon">⚡</div>
            <div style={{ flex:1 }}>
              <div className="st-plan-name">Pro Plan</div>
              <div className="st-plan-desc">Renews June 15, 2026 · Billed monthly</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:T.mono, fontSize:20, fontWeight:700, color:T.gr }}>$29<span style={{ fontSize:12, color:T.nt, fontFamily:T.sans }}>/mo</span></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="in-btn in-btn-accent in-btn-sm"><i className="ti ti-rocket" /> Upgrade to Elite</button>
            <button className="in-btn in-btn-ghost in-btn-sm">Manage Billing</button>
            <button className="in-btn in-btn-ghost in-btn-sm">View Invoices</button>
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-chart-bar" />Usage This Month</div>
          <div className="st-card-desc">Resets on the 1st of each month.</div>
        </div>
        <div className="st-card-body">
          <div className="st-usage">
            {usages.map(u => (
              <div key={u.label} className="st-usage-row">
                <div className="st-usage-head">
                  <div className="st-usage-label">{u.label}</div>
                  <div className="st-usage-val">{u.used.toLocaleString()} / {u.total.toLocaleString()}</div>
                </div>
                <div className="st-usage-track">
                  <div className="st-usage-fill" style={{ width:`${Math.round(u.used/u.total*100)}%`, background:u.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title" style={{ color:T.nt }}><i className="ti ti-alert-triangle" style={{ color:T.nt }} />Danger Zone</div>
          <div className="st-card-desc">Irreversible actions — proceed with caution.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {[
            { label:'Pause Subscription',  sub:'Stop billing without losing your data',  btn:'Pause',  btnClass:'in-btn-ghost' },
            { label:'Cancel Subscription', sub:'Cancels at end of current billing period', btn:'Cancel', btnClass:'in-btn-ghost' },
          ].map((r, i) => (
            <div key={i} className="st-danger-row">
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{r.label}</div>
                <div style={{ fontSize:11, color:T.nt }}>{r.sub}</div>
              </div>
              <button className={`in-btn ${r.btnClass} in-btn-sm`}>{r.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const groups = [
    {
      title:'Market & Alerts', icon:'ti-bell', desc:'Notifications about your watchlist and price alerts.',
      rows:[
        { label:'Price Alerts', sub:'When a tracked asset hits your target price', def:true  },
        { label:'Watchlist Movers', sub:'Daily digest of top movers on your list', def:true  },
        { label:'Market Open / Close', sub:'Reminder when major markets open', def:false },
        { label:'Breaking News', sub:'Major macro events affecting your assets', def:false },
      ],
    },
    {
      title:'Social & Community', icon:'ti-users', desc:'Activity from traders you follow and comments.',
      rows:[
        { label:'New Signal Posts', sub:'When followed traders publish a signal',   def:true  },
        { label:'Comments & Replies', sub:'Replies to your comments on signals',    def:true  },
        { label:'New Followers', sub:'When someone follows your profile',           def:false },
        { label:'Trader Milestones', sub:'When a followed trader hits a milestone', def:false },
      ],
    },
    {
      title:'Account & System', icon:'ti-shield', desc:'Security and account status notifications.',
      rows:[
        { label:'Login Activity', sub:'New sign-in from an unrecognised device',    def:true },
        { label:'Subscription Reminders', sub:'Renewal and billing notifications',  def:true },
        { label:'Product Updates', sub:'New features and platform improvements',    def:false },
        { label:'Weekly Summary', sub:'Weekly digest of your account activity',     def:false },
      ],
    },
  ];

  const channels = [
    { icon:'ti-mail',       label:'Email', key:'email' },
    { icon:'ti-device-mobile', label:'Push', key:'push' },
    { icon:'ti-brand-telegram', label:'Telegram', key:'telegram' },
  ];

  return (
    <div className="st-panel">
      {/* Delivery channels */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-send" />Delivery Channels</div>
          <div className="st-card-desc">Choose how you receive notifications.</div>
        </div>
        <div className="st-card-body">
          {channels.map((c, i) => (
            <React.Fragment key={c.key}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:T.s2, border:`1px solid ${T.br}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:T.nt }}>
                    <i className={`ti ${c.icon}`} />
                  </div>
                  <div className="st-row-label">{c.label}</div>
                </div>
                <Toggle defaultChecked={c.key !== 'telegram'} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Per-group settings */}
      {groups.map(g => (
        <div key={g.title} className="st-card">
          <div className="st-card-head">
            <div className="st-card-title"><i className={`ti ${g.icon}`} />{g.title}</div>
            <div className="st-card-desc">{g.desc}</div>
          </div>
          <div className="st-card-body">
            {g.rows.map((r, i) => (
              <React.Fragment key={r.label}>
                {i > 0 && <div className="st-divider" />}
                <div className="st-row">
                  <div className="st-row-info">
                    <div className="st-row-label">{r.label}</div>
                    <div className="st-row-sub">{r.sub}</div>
                  </div>
                  <Toggle defaultChecked={r.def} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState('dark');
  const [density, setDensity] = useState('comfortable');
  const [chartStyle, setChartStyle] = useState('candle');
  const [accentColor, setAccentColor] = useState('#c8f560');

  const accents = ['#c8f560','#60a5fa','#a78bfa','#34d399','#f59e0b','#f87171'];

  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-sun" />Theme</div>
          <div className="st-card-desc">Choose your interface appearance.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { key:'dark',   icon:'ti-moon',  label:'Dark'  },
              { key:'light',  icon:'ti-sun',   label:'Light' },
              { key:'system', icon:'ti-device-desktop', label:'System' },
            ].map(t => (
              <button key={t.key} onClick={() => setTheme(t.key)} style={{
                background: theme === t.key ? T.gd : T.s2,
                border: `1px solid ${theme === t.key ? 'rgba(200,245,96,.3)' : T.br}`,
                borderRadius:12, padding:'14px 10px', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                transition:'all .15s',
              }}>
                <i className={`ti ${t.icon}`} style={{ fontSize:22, color: theme === t.key ? T.g : T.nt }} />
                <span style={{ fontSize:12, fontWeight:600, color: theme === t.key ? T.g : T.gr }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-palette" />Accent Color</div>
          <div className="st-card-desc">Personalise your highlight color.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'flex', gap:10 }}>
            {accents.map(c => (
              <button key={c} onClick={() => setAccentColor(c)} style={{
                width:34, height:34, borderRadius:'50%', background:c, border:'none',
                cursor:'pointer', outline: accentColor === c ? `3px solid ${c}` : 'none',
                outlineOffset:3, transition:'outline .15s',
              }} />
            ))}
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-layout" />Layout Density</div>
          <div className="st-card-desc">Control spacing throughout the interface.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[
              { key:'compact',     label:'Compact',     sub:'Tighter spacing' },
              { key:'comfortable', label:'Comfortable', sub:'Default' },
              { key:'spacious',    label:'Spacious',    sub:'More breathing room' },
            ].map(d => (
              <button key={d.key} onClick={() => setDensity(d.key)} style={{
                background: density === d.key ? T.gd : T.s2,
                border: `1px solid ${density === d.key ? 'rgba(200,245,96,.3)' : T.br}`,
                borderRadius:10, padding:'12px', cursor:'pointer', textAlign:'left', transition:'all .15s',
              }}>
                <div style={{ fontSize:12, fontWeight:700, color: density === d.key ? T.g : T.gr, marginBottom:4 }}>{d.label}</div>
                <div style={{ fontSize:10, color:T.nt }}>{d.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-chart-candle" />Chart Preferences</div>
          <div className="st-card-desc">Default chart display settings.</div>
        </div>
        <div className="st-card-body">
          {[
            { label:'Default Chart Type', sub:'How charts render by default', control:(
              <select className="st-select" value={chartStyle} onChange={e => setChartStyle(e.target.value)}>
                <option value="candle">Candlestick</option>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="area">Area</option>
              </select>
            )},
            { label:'Show Volume Bars', sub:'Display volume below price chart', control:<Toggle defaultChecked={true} /> },
            { label:'Extended Hours',   sub:'Show pre- and after-market data',   control:<Toggle defaultChecked={false} /> },
            { label:'Grid Lines',       sub:'Show background grid on charts',    control:<Toggle defaultChecked={true} /> },
          ].map((r, i) => (
            <React.Fragment key={r.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div className="st-row-info">
                  <div className="st-row-label">{r.label}</div>
                  <div className="st-row-sub">{r.sub}</div>
                </div>
                {r.control}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivacyPanel() {
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-eye" />Profile Visibility</div>
          <div className="st-card-desc">Control what others can see on your profile.</div>
        </div>
        <div className="st-card-body">
          {[
            { label:'Public Profile',      sub:'Your profile is visible to all users',              def:true  },
            { label:'Show Watchlist',       sub:'Let others see your saved assets',                  def:false },
            { label:'Show Activity Feed',  sub:'Display your recent activity on your profile',      def:true  },
            { label:'Show Followed Traders', sub:'Let others see the traders you follow',            def:false },
            { label:'Appear in Search',    sub:'Show up in user search results',                    def:true  },
          ].map((r, i) => (
            <React.Fragment key={r.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div className="st-row-info">
                  <div className="st-row-label">{r.label}</div>
                  <div className="st-row-sub">{r.sub}</div>
                </div>
                <Toggle defaultChecked={r.def} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-chart-dots" />Data & Analytics</div>
          <div className="st-card-desc">How your data is used to improve the platform.</div>
        </div>
        <div className="st-card-body">
          {[
            { label:'Usage Analytics',      sub:'Share anonymised usage data to improve the product', def:true  },
            { label:'Personalised Feed',    sub:'Use your activity to personalise signal recommendations', def:true },
            { label:'Marketing Emails',     sub:'Receive product news and feature announcements',       def:false },
          ].map((r, i) => (
            <React.Fragment key={r.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div className="st-row-info">
                  <div className="st-row-label">{r.label}</div>
                  <div className="st-row-sub">{r.sub}</div>
                </div>
                <Toggle defaultChecked={r.def} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-database" />Your Data</div>
          <div className="st-card-desc">Download or delete your personal data.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {[
            { icon:'ti-download', label:'Download Your Data',    sub:'Export all your account data as a ZIP file',      btn:'Request Export', btnClass:'in-btn-ghost' },
            { icon:'ti-trash',    label:'Delete Account',        sub:'Permanently delete your account and all data',    btn:'Delete Account', btnClass:'in-btn-danger' },
          ].map((r, i) => (
            <div key={i} className="st-danger-row">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:T.s2, border:`1px solid ${T.br}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:T.nt }}>
                  <i className={`ti ${r.icon}`} />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:11, color:T.nt }}>{r.sub}</div>
                </div>
              </div>
              <button className={`in-btn ${r.btnClass} in-btn-sm`}>{r.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConnectedPanel() {
  const apps = [
    { icon:'ti-brand-discord',  label:'Discord',  sub:'Get alerts in your Discord server',          iconBg:'rgba(96,165,250,.12)',  iconCol:'#60a5fa', connected:true  },
    { icon:'ti-brand-telegram', label:'Telegram', sub:'Receive signals via Telegram bot',            iconBg:'rgba(96,165,250,.12)',  iconCol:'#60a5fa', connected:false },
    { icon:'ti-brand-slack',    label:'Slack',    sub:'Push notifications to your Slack workspace',  iconBg:'rgba(52,211,153,.12)', iconCol:'#34d399', connected:false },
    { icon:'ti-chart-candle',   label:'TradingView', sub:'Sync watchlists with TradingView',         iconBg:'rgba(167,139,250,.12)',iconCol:'#a78bfa', connected:true  },
    { icon:'ti-building-bank',  label:'Broker Link', sub:'Connect a paper trading or live broker',   iconBg:'rgba(245,158,11,.12)', iconCol:'#f59e0b', connected:false },
  ];
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-plug" />Connected Apps</div>
          <div className="st-card-desc">Third-party integrations linked to your account.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {apps.map((a, i) => (
            <div key={i} className="st-conn">
              <div className="st-conn-icon" style={{ background:a.iconBg, color:a.iconCol }}><i className={`ti ${a.icon}`} /></div>
              <div style={{ flex:1 }}>
                <div className="st-conn-name" style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {a.label}
                  {a.connected && <span className="in-badge in-badge-green">Connected</span>}
                </div>
                <div className="st-conn-sub">{a.sub}</div>
              </div>
              <button className={`in-btn ${a.connected ? 'in-btn-ghost' : 'in-btn-accent'} in-btn-sm`}>
                {a.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApiPanel() {
  const [showKey, setShowKey] = useState(false);
  const KEY = 'tf_live_sk_a8d72bce1f4e9031...';
  const MASKED = '••••••••••••••••••••••••••••';
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-code" />API Key</div>
          <div className="st-card-desc">Use your API key to access TradeFlow data programmatically.</div>
        </div>
        <div className="st-card-body">
          <div className="st-input-group">
            <div className="st-input-label">Live API Key</div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="st-input" readOnly value={showKey ? KEY : MASKED} style={{ fontFamily:T.mono, fontSize:12 }} />
              <button className="in-btn in-btn-ghost in-btn-sm" style={{ flexShrink:0 }} onClick={() => setShowKey(v => !v)}>
                <i className={`ti ${showKey ? 'ti-eye-off' : 'ti-eye'}`} />
              </button>
              <button className="in-btn in-btn-ghost in-btn-sm" style={{ flexShrink:0 }}><i className="ti ti-copy" /></button>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-refresh" /> Regenerate Key</button>
          </div>
          <div className="st-alert st-alert-warn">
            <i className="ti ti-alert-triangle" />
            Never share your API key. Regenerating will immediately invalidate the old key.
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-chart-bar" />API Usage</div>
          <div className="st-card-desc">Requests made in the last 30 days.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { label:'Calls today',     val:'840',     sub:'of 2,000 limit', col:T.g  },
              { label:'Calls this month', val:'18,402', sub:'of 60,000 limit', col:T.bl },
              { label:'Avg latency',     val:'42ms',    sub:'Last 7 days', col:T.gn },
            ].map(s => (
              <div key={s.label} style={{ background:T.s2, border:`1px solid ${T.br}`, borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:T.nt, marginBottom:6 }}>{s.label}</div>
                <div style={{ fontFamily:T.mono, fontSize:18, fontWeight:700, color:s.col, marginBottom:3 }}>{s.val}</div>
                <div style={{ fontSize:10, color:T.nt }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-book" />Documentation</div>
          <div className="st-card-desc">Resources to get started with the API.</div>
        </div>
        <div className="st-card-body" style={{ gap:10 }}>
          {[
            { icon:'ti-file-text', label:'API Reference', sub:'Full endpoint documentation' },
            { icon:'ti-code',      label:'Code Examples', sub:'Sample code in Python, JS, and more' },
            { icon:'ti-brand-github', label:'SDKs on GitHub', sub:'Official client libraries' },
          ].map((d, i) => (
            <a key={i} href="#" style={{
              display:'flex', alignItems:'center', gap:12,
              background:T.s2, border:`1px solid ${T.br}`, borderRadius:10,
              padding:'12px 14px', transition:'border-color .15s',
            }}>
              <div style={{ width:32, height:32, borderRadius:8, background:T.gd, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:T.g }}>
                <i className={`ti ${d.icon}`} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{d.label}</div>
                <div style={{ fontSize:11, color:T.nt }}>{d.sub}</div>
              </div>
              <i className="ti ti-external-link" style={{ fontSize:15, color:T.nt }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar & Topbar ──────────────────────────────── */
function Sidebar({ open }) {
  const NAV = [
    { section:'Markets' },
    { icon:'ti-layout-dashboard', label:'Dashboard' },
    { icon:'ti-chart-candlestick', label:'Trading' },
    { icon:'ti-bulb', label:'Insights' },
    { section:'Social' },
    { icon:'ti-users', label:'Copy Trading', badge:'3' },
    { icon:'ti-user-circle', label:'Profile' },
    { icon:'ti-world', label:'Marketplace' },
    { section:'Account' },
    { icon:'ti-settings', label:'Settings', active:true },
    { icon:'ti-help-circle', label:'Support' },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-wave-sine" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Portfolio Value</div>
        <div className="in-sb-pill-val">$12,480</div>
        <div className="in-sb-pill-sub">↑ +$142 today (+1.15%)</div>
      </div>
      <div className="in-sb-scroll">
        {NAV.map((n, i) => n.section
          ? <div key={i} className="in-sb-section">{n.section}</div>
          : (
            <a key={i} className={`in-sb-link${n.active ? ' active' : ''}`} href="#">
              <i className={`ti ${n.icon}`} />{n.label}
              {n.badge && <span className="in-sb-badge">{n.badge}</span>}
            </a>
          )
        )}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">AR</div>
        <div>
          <div className="in-sb-user-name">Alex Rivera</div>
          <div className="in-sb-user-role">Pro Member</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu }) {
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">Account <span>Settings</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon">
        <i className="ti ti-bell" />
        <span className="in-notif-dot" />
      </div>
      <div className="in-tb-avatar">AR</div>
    </header>
  );
}

/* ─── Root ───────────────────────────────────────────── */
export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const panels = {
    profile:       <ProfilePanel />,
    security:      <SecurityPanel />,
    subscription:  <SubscriptionPanel />,
    notifications: <NotificationsPanel />,
    appearance:    <AppearancePanel />,
    privacy:       <PrivacyPanel />,
    connected:     <ConnectedPanel />,
    api:           <ApiPanel />,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299,
        }} />
      )}

      <div className="in-shell">
        <Sidebar open={sidebarOpen} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} />

          <main className="in-main">
            <div className="st-layout">

              {/* Settings nav */}
              <nav className="st-nav">
                {NAV_SECTIONS.map(s => (
                  <React.Fragment key={s.label}>
                    <div className="st-nav-section">{s.label}</div>
                    {s.items.map(item => (
                      <button
                        key={item.key}
                        className={`st-nav-link${activeSection === item.key ? ' active' : ''}`}
                        onClick={() => setActiveSection(item.key)}
                      >
                        <i className={`ti ${item.icon}`} />
                        {item.label}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </nav>

              {/* Active panel */}
              <div>
                {panels[activeSection]}
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}