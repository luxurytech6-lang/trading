import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (match TradeFlow system)
───────────────────────────────────────────── */
const C = {
  bg:         "#05080F",
  surface:    "#0B1120",
  surfaceAlt: "#0F1929",
  border:     "#1A2740",
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
  purple:     "#A78BFA",
};

/* ─────────────────────────────────────────────
   POLICY CONTENT
───────────────────────────────────────────── */
const SECTIONS = [
  {
    id: "overview",
    icon: "🔍",
    color: C.accent,
    title: "Overview",
    content: [
      { type:"p", text:"This Privacy Policy explains how TradeFlow Technologies Ltd (\u201cTradeFlow\u201d, \u201cwe\u201d, \u201cour\u201d) collects, uses, stores, and protects your personal information when you use our platform, website, and related services." },
      { type:"p", text:"We are registered with the Financial Conduct Authority (FCA) and committed to handling your data in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018." },
      { type:"callout", icon:"📋", text:"Last updated: 1 May 2025. If you have questions about this policy, contact us at privacy@tradeflow.io." },
    ],
  },
  {
    id: "data-we-collect",
    icon: "📂",
    color: C.blue,
    title: "Data We Collect",
    content: [
      { type:"p", text:"We collect information you provide directly, information generated through your use of the platform, and information from third-party sources." },
      { type:"list", label:"Information you provide", items:[
        "Account registration details (name, email, phone number, date of birth)",
        "Identity verification documents (passport, government ID) for KYC compliance",
        "Financial information (bank account details, funding history, portfolio preferences)",
        "Communications with our support team",
      ]},
      { type:"list", label:"Automatically collected data", items:[
        "Device identifiers, IP address, browser type, and operating system",
        "Usage data — pages visited, features used, session duration",
        "Trading activity, copy preferences, and risk settings",
        "Cookies and similar tracking technologies (see our Cookie Policy)",
      ]},
    ],
  },
  {
    id: "how-we-use",
    icon: "⚙️",
    color: C.purple,
    title: "How We Use Your Data",
    content: [
      { type:"p", text:"We use your information only for legitimate purposes directly related to delivering and improving our services." },
      { type:"list", label:"Core purposes", items:[
        "Providing, maintaining, and improving the TradeFlow platform",
        "Verifying your identity and complying with anti-money laundering (AML) obligations",
        "Processing transactions and managing your account",
        "Sending service updates, security alerts, and support messages",
        "Detecting fraud, abuse, and unauthorised access",
        "Generating anonymised analytics to improve product features",
      ]},
      { type:"callout", icon:"⚠️", text:"We never sell your personal data to third parties for advertising purposes. Period." },
    ],
  },
  {
    id: "data-sharing",
    icon: "🔗",
    color: C.green,
    title: "Data Sharing",
    content: [
      { type:"p", text:"We only share your data with trusted partners necessary to operate our service, and always under strict data processing agreements." },
      { type:"list", label:"We may share data with", items:[
        "Payment processors and banking partners to execute transactions",
        "Identity verification providers (e.g. Onfido) for KYC compliance",
        "Cloud infrastructure providers (e.g. AWS) for hosting and storage",
        "Regulators and law enforcement when legally required",
        "Successor entities in the event of a merger or acquisition (with notice to you)",
      ]},
    ],
  },
  {
    id: "data-retention",
    icon: "🗄️",
    color: C.accent,
    title: "Data Retention",
    content: [
      { type:"p", text:"We retain your personal data for as long as your account is active or as required to provide services. We also retain data to comply with legal obligations, resolve disputes, and enforce agreements." },
      { type:"list", label:"Retention periods", items:[
        "Account data — retained for the lifetime of your account plus 7 years after closure",
        "Transaction records — 7 years (required by FCA regulations)",
        "Identity documents — 5 years from account closure",
        "Marketing preferences — until you withdraw consent",
        "Support communications — 3 years from resolution",
      ]},
    ],
  },
  {
    id: "your-rights",
    icon: "🛡️",
    color: C.blue,
    title: "Your Rights",
    content: [
      { type:"p", text:"Under UK GDPR you have significant rights over your personal data. We are committed to honouring all valid requests promptly." },
      { type:"list", label:"Your rights include", items:[
        "Right to access — request a copy of all data we hold about you",
        "Right to rectification — correct inaccurate or incomplete data",
        "Right to erasure — request deletion of your data where legally permissible",
        "Right to restriction — limit how we process your data in certain circumstances",
        "Right to data portability — receive your data in a structured, machine-readable format",
        "Right to object — object to processing based on legitimate interests",
        "Right to withdraw consent — where processing is based on consent, you may withdraw at any time",
      ]},
      { type:"callout", icon:"✉️", text:"Submit a Data Subject Access Request at privacy@tradeflow.io. We will respond within 30 days." },
    ],
  },
  {
    id: "security",
    icon: "🔒",
    color: C.purple,
    title: "Security",
    content: [
      { type:"p", text:"We implement technical and organisational measures to protect your personal data against unauthorised access, loss, or destruction." },
      { type:"list", label:"Security measures include", items:[
        "256-bit TLS encryption for all data in transit",
        "AES-256 encryption for sensitive data at rest",
        "Multi-factor authentication enforced for all accounts",
        "Cold storage for the majority of user assets",
        "Regular third-party penetration testing and security audits",
        "SOC 2 Type II certified infrastructure",
      ]},
    ],
  },
  {
    id: "cookies",
    icon: "🍪",
    color: C.green,
    title: "Cookies",
    content: [
      { type:"p", text:"We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how you use our platform." },
      { type:"list", label:"Cookie categories", items:[
        "Essential — required for the platform to function (cannot be disabled)",
        "Performance — anonymous analytics to improve features",
        "Functional — remember your preferences and settings",
        "Marketing — used only with your explicit consent",
      ]},
      { type:"p", text:"You can manage cookie preferences at any time via the Cookie Settings panel in your account, or through your browser settings." },
    ],
  },
  {
    id: "contact",
    icon: "💬",
    color: C.accent,
    title: "Contact & Complaints",
    content: [
      { type:"p", text:"If you have questions, concerns, or complaints about how we handle your personal data, please contact our Data Protection Officer." },
      { type:"list", label:"Contact details", items:[
        "Email: privacy@tradeflow.io",
        "Post: TradeFlow Technologies Ltd, Data Protection Officer, 1 Canada Square, London E14 5AB",
        "Response time: within 30 days of receipt",
      ]},
      { type:"p", text:"If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk." },
    ],
  },
];

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

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
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

.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(${C.border} 1px, transparent 1px),
    linear-gradient(90deg, ${C.border} 1px, transparent 1px);
  background-size: 56px 56px;
  animation: gridFade 1.2s ease-out both;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%);
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
.tf-nav-links { display:flex; align-items:center; gap:4px; }
.tf-nav-link {
  font-size:13px; font-weight:500; color:${C.textMid};
  padding:6px 12px; border-radius:7px;
  transition:color .15s, background .15s;
}
.tf-nav-link:hover { color:${C.text}; background:rgba(255,255,255,.04); }
.tf-nav-link.active { color:${C.text}; font-weight:600; }
@media(max-width:600px){ .tf-nav-links { display:none; } }

/* ── Buttons ── */
.btn-primary {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding:8px 16px; background:${C.accent}; color:#040A14;
  border:none; border-radius:8px; font-size:12px; font-weight:700;
  font-family:'DM Sans',sans-serif; cursor:pointer; letter-spacing:.01em;
  transition:transform .18s, box-shadow .18s; text-decoration:none;
}
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px ${C.accentGlow}; }
.btn-ghost {
  display:inline-flex; align-items:center; justify-content:center;
  padding:8px 16px; background:transparent; color:${C.textMid};
  border:1px solid ${C.border}; border-radius:8px; font-size:12px; font-weight:600;
  font-family:'DM Sans',sans-serif; cursor:pointer; letter-spacing:.01em;
  transition:border-color .2s, color .2s; text-decoration:none;
}
.btn-ghost:hover { border-color:${C.borderHover}; color:${C.text}; }

/* ── TOC sidebar ── */
.toc-link {
  display:flex; align-items:center; gap:10px;
  padding:9px 12px; border-radius:8px;
  font-size:13px; font-weight:500; color:${C.textMid};
  cursor:pointer; transition:color .15s, background .15s;
  border:none; background:none; width:100%; text-align:left;
  font-family:'DM Sans',sans-serif;
}
.toc-link:hover { color:${C.text}; background:rgba(255,255,255,.04); }
.toc-link.active { color:${C.accent}; background:${C.accentDim}; font-weight:600; }
.toc-link .toc-dot {
  width:6px; height:6px; border-radius:50%; flex-shrink:0;
  background:currentColor; opacity:.5; transition:opacity .15s, transform .15s;
}
.toc-link.active .toc-dot { opacity:1; transform:scale(1.4); }

/* ── Section card ── */
.policy-section {
  background:${C.surface};
  border:1px solid ${C.border};
  border-radius:16px;
  padding:clamp(24px,3vw,36px);
  margin-bottom:14px;
  transition:border-color .2s;
  scroll-margin-top:80px;
}
.policy-section:hover { border-color:${C.borderHover}; }

/* ── Callout box ── */
.callout {
  display:flex; align-items:flex-start; gap:12px;
  background:${C.accentDim};
  border:1px solid ${C.accent}25;
  border-radius:10px; padding:14px 16px;
  margin-top:16px;
}

/* ── List items ── */
.policy-list { list-style:none; margin-top:10px; }
.policy-list li {
  display:flex; align-items:baseline; gap:10px;
  padding:7px 0; border-bottom:1px solid ${C.border}40;
  font-size:14px; color:${C.textMid}; line-height:1.65;
}
.policy-list li:last-child { border-bottom:none; }
.policy-list li::before {
  content:''; width:4px; height:4px; border-radius:50%;
  background:${C.accent}; flex-shrink:0; margin-top:8px;
}

/* ── Badge ── */
.badge-live {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(0,229,160,.08); border:1px solid rgba(0,229,160,.2);
  border-radius:6px; padding:3px 10px;
  font-family:'DM Mono',monospace; font-size:10px; color:${C.accent};
  letter-spacing:.04em; text-transform:uppercase;
}
.badge-live::before {
  content:''; width:5px; height:5px; border-radius:50%;
  background:${C.accent}; animation:pulse 1.5s ease-in-out infinite; flex-shrink:0;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:${C.bg}; }
::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }

/* ── Progress bar ── */
.read-progress {
  position:fixed; top:0; left:0; height:2px; z-index:200;
  background:${C.accent};
  transition:width .1s linear;
  box-shadow:0 0 10px ${C.accent};
}

/* ── Responsive ── */
@media(max-width:860px) {
  .policy-toc-desktop { display:none !important; }
}
@media(max-width:600px) {
  .tf-nav-links { display:none; }
  .policy-meta-row { flex-direction:column !important; gap:12px !important; }
  .policy-section { padding:18px 16px !important; border-radius:12px !important; }
}
@media(max-width:400px) {
  .policy-section { padding:14px 12px !important; }
  .toc-link { font-size:12px; padding:8px 10px; }
}
`;

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function PublicNav() {
  return (
    <nav className="tf-nav">
      <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"19px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px"}}>
        Trade<span style={{color:C.accent}}>Flow</span>
      </a>
      <div className="tf-nav-links">
        <a href="/"       className="tf-nav-link">Home</a>
        <a href="/about"  className="tf-nav-link">About</a>
        <a href="/news"   className="tf-nav-link">News</a>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
        <a href="/login"  className="btn-ghost">Log in</a>
        <a href="/signup" className="btn-primary">Sign up free →</a>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   SECTION RENDERER
───────────────────────────────────────────── */
function SectionBlock({ section }) {
  return (
    <div id={section.id} className="policy-section">
      {/* Section header */}
      <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px"}}>
        <div style={{
          width:"42px", height:"42px", borderRadius:"11px", flexShrink:0,
          background:`${section.color}18`, border:`1px solid ${section.color}30`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px",
        }}>{section.icon}</div>
        <h2 style={{fontFamily:"'Syne',sans-serif", fontSize:"clamp(17px,2vw,20px)", fontWeight:"800", color:C.text, letterSpacing:"-0.4px"}}>
          {section.title}
        </h2>
      </div>

      {/* Content blocks */}
      {section.content.map((block, i) => {
        if (block.type === "p") return (
          <p key={i} style={{fontSize:"14px", color:C.textMid, lineHeight:"1.8", marginBottom:"12px"}}>
            {block.text}
          </p>
        );

        if (block.type === "list") return (
          <div key={i} style={{marginBottom:"12px"}}>
            {block.label && (
              <div style={{fontSize:"11px", fontFamily:"'DM Mono',monospace", color:C.textDim, letterSpacing:".07em", textTransform:"uppercase", marginBottom:"6px", marginTop:"4px"}}>
                {block.label}
              </div>
            )}
            <ul className="policy-list">
              {block.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        );

        if (block.type === "callout") return (
          <div key={i} className="callout">
            <span style={{fontSize:"18px", flexShrink:0, marginTop:"1px"}}>{block.icon}</span>
            <p style={{fontSize:"13px", color:C.textMid, lineHeight:"1.65"}}>{block.text}</p>
          </div>
        );

        return null;
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TABLE OF CONTENTS SIDEBAR
───────────────────────────────────────────── */
function TableOfContents({ activeId }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <div style={{
      position:"sticky", top:"80px",
      background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:"14px", padding:"16px",
      width:"220px", flexShrink:0,
      alignSelf:"flex-start",
    }}>
      <div style={{
        fontSize:"10px", fontFamily:"'DM Mono',monospace",
        color:C.textDim, letterSpacing:".08em", textTransform:"uppercase",
        marginBottom:"12px", paddingLeft:"12px",
      }}>
        Contents
      </div>
      {SECTIONS.map(s => (
        <button key={s.id} className={`toc-link ${activeId===s.id?"active":""}`} onClick={() => scrollTo(s.id)}>
          <span className="toc-dot"/>
          {s.title}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   READ PROGRESS BAR
───────────────────────────────────────────── */
function ReadProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="read-progress" style={{width:`${pct}%`}}/>;
}

/* ─────────────────────────────────────────────
   ACTIVE SECTION TRACKER
───────────────────────────────────────────── */
function useActiveSection() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin:"-20% 0px -60% 0px" }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return activeId;
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const Policy = () => {
  const activeId = useActiveSection();

  return (
    <>
      <style>{CSS}</style>
      <ReadProgress/>
      <div className="grid-bg"/>
      <PublicNav/>

      {/* Hero */}
      <div style={{
        textAlign:"center",
        padding:"clamp(48px,7vw,88px) clamp(16px,6vw,48px) clamp(32px,4vw,48px)",
        position:"relative", zIndex:1,
        animation:"fadeUp .7s cubic-bezier(.22,1,.36,1) both",
      }}>
        <div style={{position:"absolute", width:"500px", height:"200px", borderRadius:"50%", background:C.accentGlow, filter:"blur(100px)", top:0, left:"50%", transform:"translateX(-50%)", pointerEvents:"none"}}/>
        <div style={{position:"relative", zIndex:1}}>
          <div className="badge-live" style={{marginBottom:"20px"}}>Legal</div>
          <h1 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:"clamp(32px,5vw,56px)",
            fontWeight:"800", letterSpacing:"-2px", lineHeight:"1.05",
            color:C.text, marginBottom:"16px",
          }}>
            Privacy Policy
          </h1>
          <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.7", maxWidth:"480px", margin:"0 auto 24px"}}>
            We believe in clear, honest communication about how your data is used.
            This document explains everything — in plain English.
          </p>
          {/* Meta row */}
          <div className="policy-meta-row" style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"24px", flexWrap:"wrap"}}>
            {[
              {label:"Effective date", val:"1 May 2025"},
              {label:"Jurisdiction",   val:"United Kingdom"},
              {label:"Regulator",      val:"FCA / ICO"},
            ].map(({label, val}) => (
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:"10px", fontFamily:"'DM Mono',monospace", color:C.textDim, letterSpacing:".07em", textTransform:"uppercase", marginBottom:"3px"}}>{label}</div>
                <div style={{fontSize:"13px", color:C.textMid, fontWeight:"600"}}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div style={{
        maxWidth:"1040px", margin:"0 auto",
        padding:"0 clamp(16px,4vw,40px) clamp(64px,8vw,100px)",
        display:"flex", gap:"28px", alignItems:"flex-start",
        position:"relative", zIndex:1,
      }}>

        {/* TOC — hidden on mobile, shown ≥860px */}
        <div className="policy-toc-desktop" style={{display:"none"}}>
          <TableOfContents activeId={activeId}/>
        </div>
        <style>{`@media(min-width:860px){ .policy-toc-desktop{ display:block !important; } }`}</style>

        {/* Sections */}
        <div style={{flex:1, minWidth:0}}>
          {SECTIONS.map((s, i) => (
            <div key={s.id} style={{animation:`fadeUp .6s cubic-bezier(.22,1,.36,1) ${.05+i*.06}s both`}}>
              <SectionBlock section={s}/>
            </div>
          ))}

          {/* Footer note */}
          <div style={{
            marginTop:"8px",
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:"14px", padding:"24px 28px",
            display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap",
          }}>
            <div style={{flex:1, minWidth:"200px"}}>
              <div style={{fontSize:"13px", fontWeight:"700", color:C.text, marginBottom:"4px"}}>Questions about your data?</div>
              <div style={{fontSize:"13px", color:C.textMid}}>Our Data Protection Officer is here to help.</div>
            </div>
            <a href="mailto:privacy@tradeflow.io" className="btn-primary" style={{padding:"11px 22px", fontSize:"13px"}}>
              Contact DPO →
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policy;