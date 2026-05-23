import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (match TradeFlow landing)
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
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
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
.tf-input.success {
  border-color: ${C.accent}60;
}

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
.tf-checkbox:checked {
  background: ${C.accent}; border-color: ${C.accent};
}
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

.btn-verify {
  padding: 11px 18px;
  background: ${C.accentDim}; color: ${C.accent};
  border: 1px solid ${C.accent}40; border-radius: 8px;
  font-size: 12px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; white-space: nowrap;
  transition: background .2s, color .2s, border-color .2s;
  flex-shrink: 0;
}
.btn-verify:hover { background: ${C.accent}; color: #040A14; border-color: ${C.accent}; }

/* ── OTP inputs ── */
.otp-grid {
  display: grid; grid-template-columns: repeat(6,1fr); gap: 8px;
}
.otp-cell {
  aspect-ratio: 1;
  background: ${C.surfaceAlt}; border: 1px solid ${C.border};
  border-radius: 10px;
  font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 500;
  color: ${C.text}; text-align: center;
  outline: none; width: 100%;
  transition: border-color .2s, box-shadow .2s;
  padding: 0;
}
.otp-cell:focus {
  border-color: ${C.accent}60;
  box-shadow: 0 0 0 3px ${C.accentDim};
}
.otp-cell.filled { border-color: ${C.accent}50; color: ${C.accent}; }
.otp-cell.otp-error { border-color: ${C.red}70; animation: shake .35s ease; }

/* ── Divider ── */
.divider-or {
  text-align: center; position: relative;
  color: ${C.textDim}; font-size: 12px; margin: 4px 0;
}
.divider-or::before {
  content:''; position:absolute; top:50%; left:0; right:0;
  height:1px; background:${C.border};
}
.divider-or span {
  background:${C.surface}; padding:0 14px; position:relative;
}

/* ── Step dots ── */
.step-dots { display:flex; align-items:center; gap:6px; justify-content:center; }
.step-dot {
  width:7px; height:7px; border-radius:50%;
  background:${C.border}; transition:background .25s, transform .25s;
}
.step-dot.active { background:${C.accent}; transform:scale(1.3); }
.step-dot.done   { background:${C.accent}40; }

/* ── Error message ── */
.field-error {
  font-size:12px; color:${C.red};
  margin-top:5px; display:flex; align-items:center; gap:4px;
}

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
  .otp-cell { font-size: 16px; }
  .otp-grid { gap: 6px; }
}
@media (max-width: 360px) {
  .otp-cell { font-size: 14px; border-radius: 8px; }
  .otp-grid { gap: 4px; }
}
@media (min-width: 481px) and (max-width: 767px) {
  .auth-panel { padding: 28px 32px !important; }
}
/* Ensure side panel never shrinks too small */
@media (min-width: 768px) and (max-width: 1024px) {
  .side-panel-desktop { max-width: 340px !important; }
}
`;

/* ─────────────────────────────────────────────
   ICON HELPERS  (inline SVG — no icon font dep)
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "7px" }}>
      <label style={{ fontSize: "13px", fontWeight: "600", color: C.textMid, letterSpacing: ".01em" }}>{label}</label>
      {hint}
    </div>
    {children}
    {error && <div className="field-error">⚠ {error}</div>}
  </div>
);

/* ─────────────────────────────────────────────
   OTP INPUT  (6 cells, auto-advance)
───────────────────────────────────────────── */
const OTPInput = ({ value, onChange, hasError }) => {
  const refs = useRef(Array.from({ length: 6 }, () => React.createRef()));
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, -1);
      onChange(next);
      if (i > 0) refs.current[i - 1].current?.focus();
      return;
    }
    if (/^\d$/.test(e.key)) {
      const next = (value + e.key).slice(0, 6);
      onChange(next);
      if (i < 5) refs.current[i + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="otp-grid">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs.current[i]}
          className={`otp-cell${d ? " filled" : ""}${hasError ? " otp-error" : ""}`}
          type="text" inputMode="numeric" maxLength={1}
          value={d} readOnly
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={() => refs.current[i].current?.select()}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 1 — Credentials
───────────────────────────────────────────── */
const StepCredentials = ({ onNext }) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!email.includes("@"))       e.email    = "Enter a valid email address";
    if (password.length < 6)        e.password = "Password must be at least 6 characters";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext({ email, remember }); }, 1200);
  };

  return (
    <div>
      <Field
        label="Email address"
        error={errors.email}
      >
        <input
          className={`tf-input${errors.email ? " error" : email.includes("@") ? " success" : ""}`}
          type="email" placeholder="alex@email.com"
          value={email} onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:""})); }}
          onKeyDown={e => e.key==="Enter" && submit()}
          autoComplete="email"
        />
      </Field>

      <Field
        label="Password"
        hint={<a href="/forgot" style={{ fontSize:"12px", color:C.accent }}>Forgot password?</a>}
        error={errors.password}
      >
        <div className="pw-wrap">
          <input
            className={`tf-input${errors.password ? " error" : ""}`}
            type={show ? "text" : "password"}
            placeholder="Your password"
            value={password} onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:""})); }}
            onKeyDown={e => e.key==="Enter" && submit()}
            autoComplete="current-password"
          />
          <button type="button" className="pw-toggle" onClick={() => setShow(s=>!s)} aria-label="Toggle password">
            {show ? <EyeOffIcon/> : <EyeIcon/>}
          </button>
        </div>
      </Field>

      {/* Remember me */}
      <div style={{ display:"flex", alignItems:"center", gap:"9px", marginBottom:"24px" }}>
        <input type="checkbox" className="tf-checkbox" id="remember" checked={remember} onChange={e=>setRemember(e.target.checked)}/>
        <label htmlFor="remember" style={{ fontSize:"13px", color:C.textMid, cursor:"pointer", userSelect:"none" }}>Keep me signed in for 30 days</label>
      </div>

      <button className="btn-primary" onClick={submit} disabled={loading}>
        {loading ? <><div className="spinner"/> Verifying…</> : <>Continue <span style={{fontSize:"16px"}}>→</span></>}
      </button>

      {/* Divider */}
      <div style={{ margin:"22px 0" }}>
        <div className="divider-or"><span>or sign in with</span></div>
      </div>

      {/* Social */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        <button className="btn-social"><GoogleIcon/> Google</button>
        <button className="btn-social"><AppleIcon/> Apple</button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 2 — 2FA
───────────────────────────────────────────── */
const Step2FA = ({ email, onNext, onBack }) => {
  const [otp, setOtp]         = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [resent, setResent]   = useState(false);

  const verify = () => {
    if (otp.length < 6) { setHasError(true); setTimeout(()=>setHasError(false),500); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate wrong code for demo if "000000"
      if (otp === "000000") { setHasError(true); setTimeout(()=>setHasError(false),500); }
      else onNext();
    }, 1000);
  };

  const resend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <div>
      {/* Info box */}
      <div style={{
        background: C.accentDim, border:`1px solid ${C.accent}30`,
        borderRadius:"10px", padding:"14px 16px", marginBottom:"24px",
        display:"flex", gap:"12px", alignItems:"flex-start",
      }}>
        <span style={{fontSize:"18px", flexShrink:0, marginTop:"1px"}}>📲</span>
        <div>
          <div style={{fontSize:"13px", fontWeight:"600", color:C.text, marginBottom:"3px"}}>Check your authenticator app</div>
          <div style={{fontSize:"12px", color:C.textMid, lineHeight:"1.6"}}>
            Enter the 6-digit code for <strong style={{color:C.text}}>{email}</strong>
          </div>
        </div>
      </div>

      <div style={{marginBottom:"8px"}}>
        <label style={{fontSize:"13px", fontWeight:"600", color:C.textMid, display:"block", marginBottom:"10px", letterSpacing:".01em"}}>
          Authentication Code
        </label>
        <OTPInput value={otp} onChange={setOtp} hasError={hasError}/>
        {hasError && <div className="field-error" style={{marginTop:"8px"}}>⚠ Invalid code — try again</div>}
      </div>

      <div style={{ fontSize:"12px", color:C.textDim, textAlign:"center", margin:"16px 0 24px" }}>
        Didn't receive it?{" "}
        <button onClick={resend} style={{
          background:"none", border:"none", color: resent ? C.accent : C.textMid,
          cursor:"pointer", fontSize:"12px", fontFamily:"'DM Sans',sans-serif",
          transition:"color .15s",
        }}>
          {resent ? "✓ Code resent!" : "Resend code"}
        </button>
      </div>

      <button className="btn-primary" onClick={verify} disabled={loading || otp.length < 6}>
        {loading ? <><div className="spinner"/> Verifying…</> : <>Verify & Sign In <span style={{fontSize:"16px"}}>→</span></>}
      </button>

      <button onClick={onBack} style={{
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
const StepSuccess = () => {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = "/dashboard"; }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{textAlign:"center", padding:"12px 0 8px"}}>
      <div className="success-icon">✓</div>
      <h3 style={{fontFamily:"'Syne',sans-serif", fontSize:"20px", fontWeight:"800", color:C.text, marginBottom:"8px"}}>
        You're in!
      </h3>
      <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.65", marginBottom:"24px"}}>
        Identity verified. Redirecting you to your dashboard…
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
   SIDEBAR STATS PANEL (decorative)
───────────────────────────────────────────── */
const SidePanel = () => {
  const items = [
    { label:"Portfolio", val:"$48,291",  sub:"+28.4% this month", color:C.green },
    { label:"Copying",   val:"3 Traders", sub:"Auto-rebalanced",   color:C.blue  },
    { label:"Win Rate",  val:"76.4%",    sub:"Last 90 days",       color:C.accent},
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
      {/* Glow */}
      <div style={{position:"absolute", width:"380px", height:"380px", borderRadius:"50%", background:C.accentGlow, filter:"blur(90px)", top:"-100px", left:"-80px", pointerEvents:"none"}}/>
      <div style={{position:"absolute", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(59,158,255,.12)", filter:"blur(60px)", bottom:"80px", right:"-40px", pointerEvents:"none"}}/>

      {/* Top */}
      <div style={{position:"relative", zIndex:1}}>
        <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"22px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px", display:"inline-block", marginBottom:"40px"}}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </a>

        <div style={{marginBottom:"12px"}}>
          <div className="badge-live" style={{marginBottom:"16px"}}>Markets Open</div>
          <h2 style={{fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,2.5vw,30px)", fontWeight:"800", letterSpacing:"-1px", color:C.text, lineHeight:"1.2", marginBottom:"12px"}}>
            Your portfolio<br/>never sleeps.
          </h2>
          <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.7", maxWidth:"280px"}}>
            Sign in to monitor live positions, review AI copy signals, and manage your traders.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:"12px"}}>
        {items.map((it,i)=>(
          <div key={i} style={{
            background:"rgba(11,17,32,.7)", border:`1px solid ${C.border}`,
            borderRadius:"12px", padding:"16px 18px",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            backdropFilter:"blur(8px)",
            animation:`fadeUp .6s cubic-bezier(.22,1,.36,1) ${.4+i*.12}s both`,
          }}>
            <div>
              <div style={{fontSize:"11px", color:C.textDim, marginBottom:"4px", fontWeight:"600", letterSpacing:".06em", textTransform:"uppercase"}}>{it.label}</div>
              <div style={{fontFamily:"'DM Mono',monospace", fontSize:"18px", color:it.color, fontWeight:"500"}}>{it.val}</div>
            </div>
            <div style={{fontSize:"11px", color:C.textDim, textAlign:"right"}}>{it.sub}</div>
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
   MAIN LOGIN PAGE
───────────────────────────────────────────── */
const Login = () => {
  const [step, setStep]     = useState(1); // 1 | 2 | 3
  const [data, setData]     = useState({});

  const totalSteps = 2;

  const goNext2FA = (info) => { setData(info); setStep(2); };
  const goSuccess = ()      => { setStep(3); };
  const goBack    = ()      => { setStep(1); };

  const stepLabel = { 1:"Sign in", 2:"Two-factor auth", 3:"Signed in" };

  return (
    <>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav className="tf-nav">
        <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"19px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px"}}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </a>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <span style={{fontSize:"13px", color:C.textDim}}>New here?</span>
          <a href="/signup" style={{
            fontSize:"12px", padding:"8px 16px", borderRadius:"8px",
            background:C.accentDim, border:`1px solid ${C.accent}40`,
            color:C.accent, fontWeight:"700", letterSpacing:".01em",
            transition:"background .2s, color .2s",
          }}>Sign up free →</a>
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
              {/* Step dots */}
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
                {step===1 ? "Welcome back" : step===2 ? "One more step" : "You're in!"}
              </h1>
              <p style={{fontSize:"14px", color:C.textMid, textAlign:"center", lineHeight:"1.6"}}>
                {step===1 ? "Sign in to your TradeFlow account" :
                 step===2 ? "Verify your identity to continue" : ""}
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
              {step===1 && <StepCredentials onNext={goNext2FA}/>}
              {step===2 && <Step2FA email={data.email} onNext={goSuccess} onBack={goBack}/>}
              {step===3 && <StepSuccess/>}
            </div>

            {/* Footer */}
            {step < 3 && (
              <div style={{textAlign:"center", marginTop:"24px", fontSize:"13px", color:C.textDim}}>
                Don't have an account?{" "}
                <a href="/signup" style={{color:C.accent, fontWeight:"600"}}>Sign up free →</a>
              </div>
            )}

            {/* Legal */}
            <p style={{textAlign:"center", fontSize:"11px", color:C.textDim, marginTop:"20px", lineHeight:"1.6"}}>
              By signing in you agree to our{" "}
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

export default Login;