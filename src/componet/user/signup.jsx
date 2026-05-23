import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (match TradeFlow login)
───────────────────────────────────────────── */
const C = {
  bg:         "#05080F",
  surface:    "#0B1120",
  surfaceAlt: "#0F1929",
  border:     "#1A2740",
  borderFocus:"#00E5A060",
  borderHover:"#2A3F60",
  accent:     "#00E5A0",
  accentDim:  "rgba(0,229,160,0.10)",
  accentGlow: "rgba(0,229,160,0.22)",
  text:       "#E4EDF8",
  textMid:    "#6B87A8",
  textDim:    "#3D567A",
  red:        "#FF4D6A",
  green:      "#00E5A0",
  blue:       "#3B9EFF",
};

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html {
  scroll-behavior: smooth;
  height: 100%;
}
body {
  background: ${C.bg};
  color: ${C.text};
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
a { text-decoration: none; color: inherit; }

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gridFade {
  from { opacity: 0; }
  to   { opacity: .3; }
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(.9); }
}
@keyframes spinDot {
  to { transform: rotate(360deg); }
}
@keyframes successPop {
  0%   { transform: scale(.8); opacity:0; }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity:1; }
}

.auth-card-enter { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .05s both; }
.auth-header-enter { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .15s both; }

.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(${C.border} 1px, transparent 1px),
    linear-gradient(90deg, ${C.border} 1px, transparent 1px);
  background-size: 56px 56px;
  animation: gridFade 1.2s ease-out both;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 0%, transparent 100%);
}

/* ── Nav ── */
.tf-nav {
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(16px, 4vw, 40px);
  background: rgba(5,8,15,.9); backdrop-filter: blur(14px);
  border-bottom: 1px solid ${C.border};
  position: sticky; top: 0; z-index: 100;
}

/* ── Input ── */
.tf-input {
  width: 100%;
  background: ${C.surfaceAlt};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 14px; color: ${C.text};
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.tf-input:focus {
  border-color: ${C.accent}60;
  box-shadow: 0 0 0 3px ${C.accentDim};
}
.tf-input::placeholder { color: ${C.textDim}; }
.tf-input.error {
  border-color: ${C.red}70;
  box-shadow: 0 0 0 3px rgba(255,77,106,.08);
}
.tf-input.success { border-color: ${C.accent}60; }

/* ── Select ── */
.tf-select {
  width: 100%;
  background: ${C.surfaceAlt};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 14px; color: ${C.text};
  font-family: 'DM Sans', sans-serif;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%233D567A' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;
}
.tf-select:focus {
  border-color: ${C.accent}60;
  box-shadow: 0 0 0 3px ${C.accentDim};
}
.tf-select option { background: ${C.surface}; color: ${C.text}; }

/* ── Password input wrapper ── */
.pw-wrap { position: relative; }
.pw-wrap .tf-input { padding-right: 46px; }
.pw-toggle {
  position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: ${C.textDim}; cursor: pointer;
  font-size: 17px; padding: 4px; line-height: 1;
  transition: color .15s;
}
.pw-toggle:hover { color: ${C.textMid}; }

/* ── Checkbox ── */
.tf-checkbox {
  appearance: none; -webkit-appearance: none;
  width: 16px; height: 16px; border-radius: 4px;
  border: 1px solid ${C.border}; background: ${C.surfaceAlt};
  cursor: pointer; flex-shrink: 0;
  transition: border-color .15s, background .15s;
  position: relative;
}
.tf-checkbox:checked { background: ${C.accent}; border-color: ${C.accent}; }
.tf-checkbox:checked::after {
  content: '✓';
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-52%);
  font-size: 10px; color: #040A14; font-weight: 800;
}

/* ── Buttons ── */
.btn-primary {
  width: 100%; padding: 14px;
  background: ${C.accent}; color: #040A14;
  border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; letter-spacing: .01em;
  transition: transform .18s, box-shadow .18s, background .18s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
}
.btn-primary::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(135deg,rgba(255,255,255,.16) 0%,transparent 60%);
  opacity:0; transition:opacity .2s;
}
.btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 36px ${C.accentGlow}; }
.btn-primary:hover::after { opacity:1; }
.btn-primary:disabled { opacity:.55; cursor:not-allowed; transform:none; }

.btn-social {
  width: 100%; padding: 11px 14px;
  background: ${C.surfaceAlt}; color: ${C.textMid};
  border: 1px solid ${C.border}; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: border-color .2s, color .2s, background .2s;
}
.btn-social:hover { border-color: ${C.borderHover}; color: ${C.text}; background: ${C.surface}; }

/* ── Divider ── */
.divider-or {
  text-align: center; position: relative;
  color: ${C.textDim}; font-size: 12px; margin: 4px 0;
}
.divider-or::before {
  content:''; position:absolute; top:50%; left:0; right:0;
  height:1px; background:${C.border};
}
.divider-or span { background:${C.surface}; padding:0 14px; position:relative; }

/* ── Step dots ── */
.step-dots { display:flex; align-items:center; gap:6px; justify-content:center; }
.step-dot {
  width:7px; height:7px; border-radius:50%;
  background:${C.border}; transition:background .25s, transform .25s;
}
.step-dot.active { background:${C.accent}; transform:scale(1.3); }
.step-dot.done   { background:${C.accent}40; }

/* ── Error message ── */
.field-error { font-size:12px; color:${C.red}; margin-top:5px; display:flex; align-items:center; gap:4px; }

/* ── Success screen ── */
.success-icon {
  width:64px; height:64px; border-radius:50%;
  background:${C.accentDim}; border:1px solid ${C.accent}40;
  display:flex; align-items:center; justify-content:center;
  font-size:28px; margin:0 auto 20px;
  animation: successPop .5s cubic-bezier(.22,1,.36,1) both;
}

/* ── Spinner ── */
.spinner {
  width:18px; height:18px; border-radius:50%;
  border:2px solid rgba(4,10,20,.3);
  border-top-color:#040A14;
  animation: spinDot .7s linear infinite;
  flex-shrink:0;
}

/* ── Strength bar ── */
.strength-bar {
  display:flex; gap:4px; margin-top:8px;
}
.strength-seg {
  flex:1; height:3px; border-radius:2px;
  background:${C.border};
  transition:background .3s;
}

/* ── Badge live ── */
.badge-live {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(0,229,160,.08); border:1px solid rgba(0,229,160,.2);
  border-radius:6px; padding:3px 8px;
  font-family:'DM Mono',monospace; font-size:10px; color:${C.accent};
}
.badge-live::before {
  content:''; width:5px; height:5px; border-radius:50%;
  background:${C.accent}; animation:pulse 1.5s ease-in-out infinite; flex-shrink:0;
}

/* ── Two-col form row ── */
.form-two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:420px) { .form-two-col { grid-template-columns:1fr; } }

/* ── Scrollbar ── */
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:${C.bg}; }
::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }

/* ── Responsive ── */
@media (max-width: 767px) {
  .side-panel-desktop { display: none !important; }
}
@media (max-width: 480px) {
  .auth-panel { padding: 20px 16px !important; }
}
@media (max-width: 360px) {
  .auth-panel { padding: 16px 12px !important; }
}
@media (min-width: 481px) and (max-width: 767px) {
  .auth-panel { padding: 28px 32px !important; }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .side-panel-desktop { max-width: 340px !important; }
}
`;

/* ─────────────────────────────────────────────
   ICON HELPERS
───────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.text}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   FIELD with label + error
───────────────────────────────────────────── */
const Field = ({ label, hint, error, children }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"7px" }}>
      <label style={{ fontSize:"13px", fontWeight:"600", color:C.textMid, letterSpacing:".01em" }}>{label}</label>
      {hint}
    </div>
    {children}
    {error && <div className="field-error">⚠ {error}</div>}
  </div>
);

/* ─────────────────────────────────────────────
   PASSWORD STRENGTH
───────────────────────────────────────────── */
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthColor = (score) => ["#3D567A","#FF4D6A","#F59E0B","#3B9EFF","#00E5A0"][score];
const strengthLabel = (score) => ["","Weak","Fair","Good","Strong"][score];

const StrengthBar = ({ password }) => {
  if (!password) return null;
  const score = getStrength(password);
  return (
    <div>
      <div className="strength-bar">
        {[1,2,3,4].map(i => (
          <div key={i} className="strength-seg" style={{ background: i <= score ? strengthColor(score) : C.border }}/>
        ))}
      </div>
      {score > 0 && (
        <div style={{ fontSize:"11px", color:strengthColor(score), marginTop:"5px", fontFamily:"'DM Mono',monospace", letterSpacing:".04em" }}>
          {strengthLabel(score)}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SIDE PANEL (decorative)
───────────────────────────────────────────── */
const SidePanel = () => {
  const perks = [
    { icon:"📈", title:"Copy top traders",    desc:"Mirror verified strategies automatically." },
    { icon:"🤖", title:"AI-powered signals",  desc:"Real-time alerts based on live market data." },
    { icon:"🔒", title:"Bank-grade security", desc:"2FA, cold storage, and insured assets." },
  ];
  return (
    <div style={{
      position:"relative", flex:"1",
      background:`linear-gradient(160deg, ${C.surface} 0%, #080F20 100%)`,
      borderRight:`1px solid ${C.border}`,
      padding:"48px 36px",
      display:"flex", flexDirection:"column", justifyContent:"space-between",
      overflow:"hidden", minHeight:"calc(100vh - 60px)",
    }}>
      {/* Glows */}
      <div style={{position:"absolute", width:"380px", height:"380px", borderRadius:"50%", background:C.accentGlow, filter:"blur(90px)", top:"-100px", left:"-80px", pointerEvents:"none"}}/>
      <div style={{position:"absolute", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(59,158,255,.12)", filter:"blur(60px)", bottom:"80px", right:"-40px", pointerEvents:"none"}}/>

      {/* Top */}
      <div style={{position:"relative", zIndex:1}}>
        <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"22px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px", display:"inline-block", marginBottom:"40px"}}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </a>
        <div style={{marginBottom:"12px"}}>
          <div className="badge-live" style={{marginBottom:"16px"}}>280,000+ traders</div>
          <h2 style={{fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,2.5vw,30px)", fontWeight:"800", letterSpacing:"-1px", color:C.text, lineHeight:"1.2", marginBottom:"12px"}}>
            Start trading<br/>smarter today.
          </h2>
          <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.7", maxWidth:"280px"}}>
            Create your free account in under 2 minutes and get access to the world's best copy trading platform.
          </p>
        </div>
      </div>

      {/* Perks */}
      <div style={{position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:"12px"}}>
        {perks.map((p,i) => (
          <div key={i} style={{
            background:"rgba(11,17,32,.7)", border:`1px solid ${C.border}`,
            borderRadius:"12px", padding:"16px 18px",
            display:"flex", gap:"14px", alignItems:"flex-start",
            backdropFilter:"blur(8px)",
            animation:`fadeUp .6s cubic-bezier(.22,1,.36,1) ${.4+i*.12}s both`,
          }}>
            <span style={{fontSize:"20px", flexShrink:0, marginTop:"1px"}}>{p.icon}</span>
            <div>
              <div style={{fontSize:"13px", fontWeight:"700", color:C.text, marginBottom:"3px"}}>{p.title}</div>
              <div style={{fontSize:"12px", color:C.textDim, lineHeight:"1.5"}}>{p.desc}</div>
            </div>
          </div>
        ))}
        <p style={{fontSize:"11px", color:C.textDim, textAlign:"center", marginTop:"6px"}}>
          Simulated data for illustration only
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 1 — Account details
───────────────────────────────────────────── */
const StepAccount = ({ onNext }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [show,      setShow]      = useState(false);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!firstName.trim())       e.firstName = "First name is required";
    if (!lastName.trim())        e.lastName  = "Last name is required";
    if (!email.includes("@"))    e.email     = "Enter a valid email address";
    if (getStrength(password) < 2) e.password = "Password is too weak";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext({ firstName, lastName, email }); }, 1200);
  };

  return (
    <div>
      <div className="form-two-col">
        <Field label="First name" error={errors.firstName}>
          <input
            className={`tf-input${errors.firstName ? " error" : firstName.trim() ? " success" : ""}`}
            type="text" placeholder="Alex"
            value={firstName}
            onChange={e => { setFirstName(e.target.value); setErrors(p=>({...p,firstName:""})); }}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <input
            className={`tf-input${errors.lastName ? " error" : lastName.trim() ? " success" : ""}`}
            type="text" placeholder="Kim"
            value={lastName}
            onChange={e => { setLastName(e.target.value); setErrors(p=>({...p,lastName:""})); }}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field label="Email address" error={errors.email}>
        <input
          className={`tf-input${errors.email ? " error" : email.includes("@") ? " success" : ""}`}
          type="email" placeholder="alex@email.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:""})); }}
          onKeyDown={e => e.key==="Enter" && submit()}
          autoComplete="email"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <div className="pw-wrap">
          <input
            className={`tf-input${errors.password ? " error" : ""}`}
            type={show ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:""})); }}
            onKeyDown={e => e.key==="Enter" && submit()}
            autoComplete="new-password"
          />
          <button type="button" className="pw-toggle" onClick={() => setShow(s=>!s)} aria-label="Toggle password">
            {show ? <EyeOffIcon/> : <EyeIcon/>}
          </button>
        </div>
        <StrengthBar password={password}/>
      </Field>

      <button className="btn-primary" onClick={submit} disabled={loading}>
        {loading ? <><div className="spinner"/> Creating account…</> : <>Continue <span style={{fontSize:"16px"}}>→</span></>}
      </button>

      <div style={{ margin:"22px 0" }}>
        <div className="divider-or"><span>or sign up with</span></div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        <button className="btn-social"><GoogleIcon/> Google</button>
        <button className="btn-social"><AppleIcon/> Apple</button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 2 — Profile preferences
───────────────────────────────────────────── */
const StepProfile = ({ onNext, onBack }) => {
  const [phone,   setPhone]   = useState("");
  const [goal,    setGoal]    = useState("");
  const [terms,   setTerms]   = useState(false);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!goal)    e.goal  = "Please select your trading goal";
    if (!terms)   e.terms = "You must accept the terms to continue";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(); }, 1200);
  };

  return (
    <div>
      <Field label="Phone number" hint={<span style={{fontSize:"11px", color:C.textDim}}>Optional</span>}>
        <input
          className="tf-input"
          type="tel" placeholder="+234 800 000 0000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </Field>

      <Field label="I want to" error={errors.goal}>
        <select
          className={`tf-select${errors.goal ? " error" : goal ? " success" : ""}`}
          value={goal}
          onChange={e => { setGoal(e.target.value); setErrors(p=>({...p,goal:""})); }}
        >
          <option value="">Select your goal…</option>
          <option value="copy">Copy successful traders</option>
          <option value="hire">Hire a professional trader</option>
          <option value="independent">Trade independently</option>
          <option value="all">All of the above</option>
        </select>
      </Field>

      {/* Terms */}
      <div style={{ marginBottom:"24px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
          <input
            type="checkbox" className="tf-checkbox" id="terms"
            checked={terms}
            onChange={e => { setTerms(e.target.checked); setErrors(p=>({...p,terms:""})); }}
            style={{marginTop:"2px"}}
          />
          <label htmlFor="terms" style={{ fontSize:"13px", color:C.textMid, cursor:"pointer", lineHeight:"1.6", userSelect:"none" }}>
            I agree to the{" "}
            <a href="/terms" style={{color:C.accent, fontWeight:"600"}}>Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" style={{color:C.accent, fontWeight:"600"}}>Privacy Policy</a>.
            I confirm I am 18+ years of age.
          </label>
        </div>
        {errors.terms && <div className="field-error" style={{marginTop:"8px"}}>⚠ {errors.terms}</div>}
      </div>

      <button className="btn-primary" onClick={submit} disabled={loading}>
        {loading ? <><div className="spinner"/> Setting up…</> : <>Create Account <span style={{fontSize:"16px"}}>→</span></>}
      </button>

      <button
        onClick={onBack}
        style={{
          width:"100%", marginTop:"12px", padding:"11px",
          background:"transparent", border:`1px solid ${C.border}`,
          borderRadius:"10px", color:C.textMid, fontSize:"13px",
          fontWeight:"600", fontFamily:"'DM Sans',sans-serif",
          cursor:"pointer", transition:"border-color .2s, color .2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMid;}}
      >← Back</button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 3 — Success
───────────────────────────────────────────── */
const StepSuccess = ({ name }) => {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = "/dashboard"; }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{textAlign:"center", padding:"12px 0 8px"}}>
      <div className="success-icon">✓</div>
      <h3 style={{fontFamily:"'Syne',sans-serif", fontSize:"20px", fontWeight:"800", color:C.text, marginBottom:"8px"}}>
        Welcome, {name}!
      </h3>
      <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.65", marginBottom:"24px"}}>
        Your account is ready. Redirecting you to your dashboard…
      </p>
      <div style={{display:"flex", justifyContent:"center"}}>
        <div style={{
          width:"36px", height:"36px", borderRadius:"50%",
          border:`2px solid ${C.border}`, borderTopColor:C.accent,
          animation:"spinDot .8s linear infinite",
        }}/>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN SIGNUP PAGE
───────────────────────────────────────────── */
const SignUp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const totalSteps = 2;

  const goStep2 = (info) => { setData(info); setStep(2); };
  const goSuccess = ()    => { setStep(3); };
  const goBack    = ()    => { setStep(1); };

  const stepLabel = { 1:"Your details", 2:"Preferences", 3:"All set" };

  return (
    <>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav className="tf-nav">
        <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"19px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px"}}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </a>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <span style={{fontSize:"13px", color:C.textDim}}>Already a member?</span>
          <a href="/login" style={{
            fontSize:"12px", padding:"8px 16px", borderRadius:"8px",
            background:C.accentDim, border:`1px solid ${C.accent}40`,
            color:C.accent, fontWeight:"700", letterSpacing:".01em",
            transition:"background .2s, color .2s",
          }}>Log in →</a>
        </div>
      </nav>

      {/* ── GRID BG ── */}
      <div className="grid-bg"/>

      {/* ── LAYOUT ── */}
      <div style={{
        minHeight:"calc(100vh - 60px)", display:"flex",
        position:"relative", zIndex:1,
        alignItems:"stretch",
      }}>

        {/* ── SIDE PANEL (hidden on mobile, shown ≥768px) ── */}
        <div className="side-panel-desktop" style={{display:"none", flex:"1", maxWidth:"480px"}}>
          <SidePanel/>
        </div>
        <style>{`@media(min-width:768px){ .side-panel-desktop{ display:flex !important; } }`}</style>

        {/* ── FORM PANEL ── */}
        <div style={{
          flex:"1", display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"clamp(32px,6vw,64px) clamp(16px,5vw,48px)",
        }}>
          <div style={{width:"100%", maxWidth:"400px"}}>

            {/* Header */}
            <div className="auth-header-enter" style={{marginBottom:"32px"}}>
              {step < 3 && (
                <div style={{marginBottom:"20px"}}>
                  <div className="step-dots">
                    {Array.from({length:totalSteps},(_,i)=>(
                      <div key={i} className={`step-dot ${i+1===step?"active":i+1<step?"done":""}`}/>
                    ))}
                  </div>
                  <div style={{textAlign:"center", fontSize:"11px", color:C.textDim, marginTop:"8px", fontFamily:"'DM Mono',monospace", letterSpacing:".06em", textTransform:"uppercase"}}>
                    Step {step} of {totalSteps} — {stepLabel[step]}
                  </div>
                </div>
              )}

              <h1 style={{fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px,3vw,30px)", fontWeight:"800", letterSpacing:"-1px", color:C.text, marginBottom:"6px", textAlign:"center"}}>
                {step===1 ? "Create your account" : step===2 ? "Almost there" : "You're in!"}
              </h1>
              <p style={{fontSize:"14px", color:C.textMid, textAlign:"center", lineHeight:"1.6"}}>
                {step===1 ? "Join 280,000+ traders worldwide" :
                 step===2 ? "A few more details to personalize your experience" : ""}
              </p>
            </div>

            {/* Card */}
            <div className="auth-card-enter" style={{
              background:C.surface,
              border:`1px solid ${C.border}`,
              borderRadius:"18px",
              padding:"clamp(20px,4vw,32px)",
              boxShadow:`0 32px 64px rgba(0,0,0,.45), 0 0 0 1px ${C.border}`,
            }}>
              {step===1 && <StepAccount onNext={goStep2}/>}
              {step===2 && <StepProfile onNext={goSuccess} onBack={goBack}/>}
              {step===3 && <StepSuccess name={data.firstName || "Trader"}/>}
            </div>

            {/* Footer */}
            {step < 3 && (
              <div style={{textAlign:"center", marginTop:"24px", fontSize:"13px", color:C.textDim}}>
                Already have an account?{" "}
                <a href="/login" style={{color:C.accent, fontWeight:"600"}}>Sign in →</a>
              </div>
            )}

            {/* Legal */}
            <p style={{textAlign:"center", fontSize:"11px", color:C.textDim, marginTop:"20px", lineHeight:"1.6"}}>
              By creating an account you agree to our{" "}
              <a href="/terms" style={{color:C.textDim, textDecoration:"underline"}}>Terms</a>
              {" "}and{" "}
              <a href="/privacy" style={{color:C.textDim, textDecoration:"underline"}}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;