import React, { useState } from 'react';
import supabase from "../supabase";

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


/* ─── Data hook ──────────────────────────────────────── */
function useSettingsData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  React.useEffect(() => {
    async function load() {
      try {
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authUser) throw new Error('Not authenticated');
        const uid = authUser.id;

        const [
          userRes, subRes, walletRes, settingsRes,
          twoFaRes, sessionsRes, appsRes,
          usageRes, copyRes, notifRes,
        ] = await Promise.all([
          supabase.from('users').select('*').eq('id', uid).single(),
          supabase.from('user_subscriptions')
            .select('*, subscription_plans(*)')
            .eq('user_id', uid).eq('status', 'active')
            .order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('wallets')
            .select('balance, currency').eq('user_id', uid).eq('currency', 'USD').maybeSingle(),
          supabase.from('user_settings')
            .select('*').eq('user_id', uid).maybeSingle(),
          supabase.from('two_factor_methods')
            .select('*').eq('user_id', uid),
          supabase.from('sessions')
            .select('*').eq('user_id', uid)
            .order('last_active_at', { ascending: false }).limit(5),
          supabase.from('connected_apps')
            .select('*').eq('user_id', uid),
          supabase.from('usage_metrics')
            .select('*').eq('user_id', uid)
            .order('period_start', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('copy_relationships')
            .select('id').eq('copier_id', uid).eq('status', 'active'),
          supabase.from('notifications')
            .select('id, is_read').eq('user_id', uid).eq('is_read', false).limit(99),
        ]);

        if (userRes.error) throw userRes.error;

        setData({
          user:        userRes.data,
          subscription: subRes.data,
          wallet:      walletRes.data,
          settings:    settingsRes.data,
          twoFa:       twoFaRes.data    || [],
          sessions:    sessionsRes.data || [],
          apps:        appsRes.data     || [],
          usage:       usageRes.data,
          copyCount:   (copyRes.data    || []).length,
          unreadCount: (notifRes.data   || []).length,
        });
      } catch (e) {
        setError(e.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}

function fmtMoney(n, currency = 'USD') {
  if (n == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}
function initials(name = '') {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}
function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function timeAgo(ts) {
  if (!ts) return '—';
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return fmtDate(ts);
}

function ProfilePanel({ user = {} }) {
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
            }}>{initials(`${user.first_name || ''} ${user.last_name || ''}`)}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-upload" /> Upload Photo</button>
              <div style={{ fontSize:11, color:T.nt }}>JPG, PNG or GIF · Max 5 MB</div>
            </div>
          </div>

          <div className="st-divider" />

          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">First Name</div>
              <input className="st-input" defaultValue={user.first_name || ''} />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">Last Name</div>
              <input className="st-input" defaultValue={user.last_name || ''} />
            </div>
          </div>
          <div className="st-input-group">
            <div className="st-input-label">Username</div>
            <input className="st-input" defaultValue={user.handle || ''} />
          </div>
          <div className="st-input-group">
            <div className="st-input-label">Bio</div>
            <textarea className="st-input" rows={3} style={{ resize:'vertical' }}
              defaultValue={user.bio || ''} />
          </div>
          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">Location</div>
              <input className="st-input" defaultValue={user.location || ''} />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">Website</div>
              <input className="st-input" defaultValue={user.website || ''} />
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
              <input className="st-input" defaultValue={user.email || ''} />
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

function SecurityPanel({ twoFa = [], sessions = [] }) {
  // Map DB method names to display config
  const twoFaConfig = [
    { method:'authenticator_app', icon:'ti-brand-google', label:'Authenticator App', sub:'Use Google Authenticator or similar', iconBg:'rgba(96,165,250,.12)', iconCol:'#60a5fa' },
    { method:'sms',              icon:'ti-message',      label:'SMS Verification',   sub:'Receive codes via text message',      iconBg:'rgba(52,211,153,.12)', iconCol:'#34d399' },
    { method:'email_otp',       icon:'ti-mail',         label:'Email OTP',          sub:'Receive codes to your email',          iconBg:'rgba(200,245,96,.12)', iconCol:'#c8f560' },
  ].map(cfg => ({ ...cfg, enabled: twoFa.find(t => t.method === cfg.method)?.is_enabled || false }));
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
          {twoFaConfig.map((m, i) => (
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
          {sessions.length === 0 && (
            <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No active sessions found.</div>
          )}
          {sessions.map((s, i) => (
            <div key={i} className="st-session">
              <div className="st-session-icon"><i className="ti ti-device-laptop" /></div>
              <div style={{ flex:1 }}>
                <div className="st-session-device">{s.device || 'Unknown device'}</div>
                <div className="st-session-sub">{s.location || '—'} · {timeAgo(s.last_active_at)}</div>
              </div>
              {s.is_current
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

function SubscriptionPanel({ subscription, usage }) {
  const plan = subscription?.subscription_plans;
  const renewDate = subscription?.current_period_end ? fmtDate(subscription.current_period_end) : '—';
  const planName = plan ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1) + ' Plan' : 'Basic Plan';
  const usages = [
    { label:'Price Alerts',    used: usage?.alerts_used    || 0, total: plan?.max_alerts       || 10,   color:'#c8f560' },
    { label:'Watchlist Spots', used: usage?.watchlist_used || 0, total: plan?.max_watchlist     || 20,   color:'#60a5fa' },
    { label:'Signal Saves',   used: usage?.signal_saves   || 0, total: 20,                              color:'#a78bfa' },
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
              <div className="st-plan-name">{planName}</div>
              <div className="st-plan-desc">Renews {renewDate} · Billed {subscription?.billing_cycle || 'monthly'}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:T.mono, fontSize:20, fontWeight:700, color:T.gr }}>{plan ? `$${Number(plan.monthly_price).toFixed(0)}` : 'Free'}<span style={{ fontSize:12, color:T.nt, fontFamily:T.sans }}>/mo</span></div>
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

/* ─── Appearance helpers (imported by every page) ───────────────────────────── */
// Call applyAppearance() once at the top of any page to pick up saved settings.
export function applyAppearance() {
  try {
    const raw = localStorage.getItem('tf_appearance');
    if (!raw) return;
    const s = JSON.parse(raw);
    _applyToDOM(s);
  } catch (_) {}
}

function _applyToDOM({ theme, accentColor, density }) {
  const root = document.documentElement;

  // ── Accent color ──
  if (accentColor) {
    // Derive a dimmed version (12% opacity) for backgrounds
    const hex = accentColor.replace('#','');
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    root.style.setProperty('--accent',       accentColor);
    root.style.setProperty('--accent-dim',   `rgba(${r},${g},${b},.12)`);
    root.style.setProperty('--accent-glow',  `rgba(${r},${g},${b},.06)`);
  }

  // ── Theme ──
  const effectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : (theme || 'dark');

  if (effectiveTheme === 'light') {
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

  // ── Density ──
  const spacingMap = { compact: '20px 22px', comfortable: '26px 28px', spacious: '32px 34px' };
  const mainPadMap = { compact: '16px 20px 32px', comfortable: '24px 28px 40px', spacious: '32px 36px 56px' };
  const gapMap     = { compact: '12px', comfortable: '20px', spacious: '28px' };
  if (density) {
    root.style.setProperty('--density-padding', spacingMap[density] || spacingMap.comfortable);
    root.style.setProperty('--density-main-pad', mainPadMap[density] || mainPadMap.comfortable);
    root.style.setProperty('--density-gap', gapMap[density] || gapMap.comfortable);
    // Apply to in-main directly if present
    document.querySelectorAll('.in-main, .sb-main').forEach(el => {
      el.style.padding = mainPadMap[density];
    });
  }
}

async function _saveAppearance(uid, patch) {
  // Write CSS vars + localStorage immediately (instant across-page effect)
  const current = (() => { try { return JSON.parse(localStorage.getItem('tf_appearance') || '{}'); } catch { return {}; } })();
  const next = { ...current, ...patch };
  localStorage.setItem('tf_appearance', JSON.stringify(next));
  _applyToDOM(next);

  // Persist to Supabase in background
  if (!uid) return;
  await supabase.from('user_settings').upsert(
    { user_id: uid, ...patch, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

function AppearancePanel({ settings = {} }) {
  const [theme,       setThemeState]  = useState(settings.theme        || 'dark');
  const [density,     setDensityState]= useState(settings.layout_density || 'comfortable');
  const [accentColor, setAccentState] = useState(settings.accent_color || '#c8f560');
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const uidRef = React.useRef(null);

  // Grab user id once on mount
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { uidRef.current = data?.user?.id || null; });
    // Also apply whatever is already in localStorage immediately
    applyAppearance();
  }, []);

  const persist = async (patch) => {
    setSaving(true); setSaved(false);
    await _saveAppearance(uidRef.current, patch);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const changeTheme = (t) => { setThemeState(t); persist({ theme: t }); };
  const changeAccent = (c) => { setAccentState(c); persist({ accent_color: c }); };
  const changeDensity = (d) => { setDensityState(d); persist({ layout_density: d }); };

  const accents = ['#c8f560','#60a5fa','#a78bfa','#34d399','#f59e0b','#f87171'];

  return (
    <div className="st-panel">

      {/* Save status bar */}
      {(saving || saved) && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
          background: saved ? 'rgba(52,211,153,.08)' : 'rgba(200,245,96,.06)',
          border: `1px solid ${saved ? 'rgba(52,211,153,.2)' : 'rgba(200,245,96,.15)'}`,
          borderRadius:'var(--r-sm)', fontSize:12 }}>
          {saving
            ? <><i className="ti ti-loader-2" style={{ color:T.g, fontSize:14 }} /> Saving…</>
            : <><i className="ti ti-circle-check" style={{ color:T.gn, fontSize:14 }} /> Applied to all pages</>}
        </div>
      )}

      {/* Theme */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-sun" />Theme</div>
          <div className="st-card-desc">Choose your interface appearance.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { key:'dark',   icon:'ti-moon',           label:'Dark'   },
              { key:'light',  icon:'ti-sun',            label:'Light'  },
              { key:'system', icon:'ti-device-desktop', label:'System' },
            ].map(t => (
              <button key={t.key} onClick={() => changeTheme(t.key)} style={{
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

      {/* Accent Color */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-palette" />Accent Color</div>
          <div className="st-card-desc">Personalise your highlight color. Changes apply across all pages instantly.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {accents.map(c => (
              <button key={c} onClick={() => changeAccent(c)} style={{
                width:34, height:34, borderRadius:'50%', background:c, border:'none',
                cursor:'pointer',
                outline: accentColor === c ? `3px solid ${c}` : 'none',
                outlineOffset:3, transition:'outline .15s',
                boxShadow: accentColor === c ? `0 0 12px ${c}55` : 'none',
              }} />
            ))}
          </div>
          <div style={{ fontSize:11, color:T.nt, marginTop:4, display:'flex', alignItems:'center', gap:5 }}>
            <i className="ti ti-info-circle" style={{ fontSize:12 }} />
            Selected: <span style={{ fontFamily:T.mono, color:accentColor }}>{accentColor}</span>
          </div>
        </div>
      </div>

      {/* Layout Density */}
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
              <button key={d.key} onClick={() => changeDensity(d.key)} style={{
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

    </div>
  );
}

function PrivacyPanel({ settings = {} }) {
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-eye" />Profile Visibility</div>
          <div className="st-card-desc">Control what others can see on your profile.</div>
        </div>
        <div className="st-card-body">
          {[
            { label:'Public Profile',        sub:'Your profile is visible to all users',                def: settings.profile_public         ?? true  },
            { label:'Show Watchlist',         sub:'Let others see your saved assets',                    def: settings.show_watchlist          ?? false },
            { label:'Show Activity Feed',     sub:'Display your recent activity on your profile',        def: settings.show_activity           ?? true  },
            { label:'Show Followed Traders',  sub:'Let others see the traders you follow',              def: settings.show_followed_traders   ?? false },
            { label:'Appear in Search',       sub:'Show up in user search results',                      def: settings.appear_in_search        ?? true  },
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
            { label:'Usage Analytics',     sub:'Share anonymised usage data to improve the product',         def: settings.usage_analytics    ?? true  },
            { label:'Personalised Feed',   sub:'Use your activity to personalise signal recommendations',   def: settings.personalised_feed  ?? true  },
            { label:'Marketing Emails',    sub:'Receive product news and feature announcements',             def: settings.marketing_emails   ?? false },
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

function ConnectedPanel({ apps = [] }) {
  const APP_CONFIG = [
    { key:'discord',     icon:'ti-brand-discord',  label:'Discord',     sub:'Get alerts in your Discord server',       iconBg:'rgba(96,165,250,.12)',  iconCol:'#60a5fa' },
    { key:'telegram',    icon:'ti-brand-telegram', label:'Telegram',    sub:'Receive signals via Telegram bot',         iconBg:'rgba(52,211,153,.12)',  iconCol:'#34d399' },
    { key:'broker_link', icon:'ti-building-bank',  label:'Broker Link', sub:'Connect a paper trading or live broker',   iconBg:'rgba(245,158,11,.12)',  iconCol:'#f59e0b' },
  ];

  const [states, setStates] = useState(() =>
    Object.fromEntries(APP_CONFIG.map(({ key }) => {
      const row = apps.find(a => a.app_name === key);
      return [key, { connected: row?.is_connected || false, loading: false }];
    }))
  );

  async function toggle(key, currentlyConnected) {
    setStates(s => ({ ...s, [key]: { ...s[key], loading: true } }));
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const uid = authUser?.id;
      if (!uid) throw new Error('Not authenticated');

      // Upsert into connected_apps
      const { error } = await supabase.from('connected_apps').upsert({
        user_id:      uid,
        app_name:     key,
        is_connected: !currentlyConnected,
        connected_at:  !currentlyConnected ? new Date().toISOString() : null,
        disconnected_at: currentlyConnected ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,app_name' });

      if (error) throw error;
      setStates(s => ({ ...s, [key]: { connected: !currentlyConnected, loading: false } }));
    } catch (e) {
      console.error('Toggle failed:', e.message);
      setStates(s => ({ ...s, [key]: { ...s[key], loading: false } }));
    }
  }

  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-plug" />Connected Apps</div>
          <div className="st-card-desc">Third-party integrations linked to your account.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {APP_CONFIG.map((a, i) => {
            const { connected, loading } = states[a.key];
            return (
              <div key={a.key} className="st-conn">
                <div className="st-conn-icon" style={{ background:a.iconBg, color:a.iconCol }}>
                  <i className={`ti ${a.icon}`} />
                </div>
                <div style={{ flex:1 }}>
                  <div className="st-conn-name" style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {a.label}
                    {connected && <span className="in-badge in-badge-green">Connected</span>}
                  </div>
                  <div className="st-conn-sub">{a.sub}</div>
                </div>
                <button
                  className={`in-btn ${connected ? 'in-btn-ghost' : 'in-btn-accent'} in-btn-sm`}
                  disabled={loading}
                  onClick={() => toggle(a.key, connected)}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? '…' : connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar & Topbar ──────────────────────────────── */
function Sidebar({ open, user = {}, sub, wallet, copyCount = 0 }) {
  const plan      = sub?.subscription_plans;
  const ini       = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const fullName  = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Loading…';
  const planLabel = plan ? `${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} Member` : 'Basic Plan';
  const portfolioVal = fmtMoney(wallet?.balance ?? 0, wallet?.currency || user.currency || 'USD');
  const NAV = [
    { section:'Markets' },
    { href:'/dashboard',    icon:'ti-layout-dashboard',  label:'Dashboard' },
    { href:'/terminal',     icon:'ti-chart-candlestick', label:'Trading' },
    { href:'/insights',     icon:'ti-bulb',              label:'Insights' },
    { section:'Social' },
    { href:'/copy-trading', icon:'ti-users',             label:'Copy Trading', badge: copyCount || null },
    { href:'/profile',      icon:'ti-user-circle',       label:'Profile' },
    { href:'/market-place', icon:'ti-world',             label:'Marketplace' },
    { section:'Account' },
    { href:'/settings',     icon:'ti-settings',          label:'Settings', active:true },
    { href:'/support',      icon:'ti-help-circle',       label:'Support' },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-wave-sine" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />Portfolio Value</div>
        <div className="in-sb-pill-val">{portfolioVal}</div>
        <div className="in-sb-pill-sub">Live from wallet</div>
      </div>
      <div className="in-sb-scroll">
        {NAV.map((n, i) => n.section
          ? <div key={i} className="in-sb-section">{n.section}</div>
          : (
            <a key={i} className={`in-sb-link${n.active ? ' active' : ''}`} href={n.href}>
              <i className={`ti ${n.icon}`} />{n.label}
              {n.badge && <span className="in-sb-badge">{n.badge}</span>}
            </a>
          )
        )}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{ini}</div>
        <div>
          <div className="in-sb-user-name">{fullName}</div>
          <div className="in-sb-user-role">{planLabel}</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu, user = {}, unreadCount = 0 }) {
  const ini = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">Account <span>Settings</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon"><a href='/notification'>
        <i className="ti ti-bell" />
        {unreadCount > 0 && <span className="in-notif-dot" />}</a>
      </div>
      <div className="in-tb-avatar">{ini || '?'}</div>
    </header>
  );
}

/* ─── Root ───────────────────────────────────────────── */
export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Apply saved appearance settings on mount (accent, theme, density)
  React.useEffect(() => { applyAppearance(); }, []);

  const { data, loading, error } = useSettingsData();

  const user     = data?.user         || {};
  const sub      = data?.subscription;
  const settings = data?.settings     || {};

  const panels = {
    profile:       <ProfilePanel user={user} />,
    security:      <SecurityPanel twoFa={data?.twoFa || []} sessions={data?.sessions || []} />,
    subscription:  <SubscriptionPanel subscription={sub} usage={data?.usage} />,
    notifications: <NotificationsPanel />,
    appearance:    <AppearancePanel settings={settings} />,
    privacy:       <PrivacyPanel settings={settings} />,
    connected:     <ConnectedPanel apps={data?.apps || []} />,
  };

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16 }}>
        <div style={{ width:40, height:40, border:'3px solid rgba(200,245,96,.2)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <div style={{ color:'var(--muted)', fontSize:13 }}>Loading settings…</div>
        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    </>
  );

  if (error) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:12 }}>
        <i className="ti ti-alert-circle" style={{ fontSize:32, color:'var(--red)' }} />
        <div style={{ color:'var(--text)', fontWeight:600 }}>Failed to load settings</div>
        <div style={{ color:'var(--muted)', fontSize:12 }}>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299,
        }} />
      )}

      <div className="in-shell">
        <Sidebar open={sidebarOpen} user={user} sub={sub} wallet={data?.wallet} copyCount={data?.copyCount || 0} />

        <div className="in-right">
          <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} unreadCount={data?.unreadCount || 0} />

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