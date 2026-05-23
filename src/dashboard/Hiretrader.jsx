import React, { useState } from 'react';
import '../css/hiretrader.css';

// ─── Static Data ─────────────────────────────────────────────────────────────

const PROFESSIONALS = [
  { name: 'Vincent Ford',  handle: 'vForce',   avatar: 'VF', color: 'var(--g)',  specialty: 'Crypto',  return: '142%', winRate: '73%', minCapital: '$5,000',  fee: '20% of profits', clients: 48 },
  { name: 'Sofia Mendez',  handle: 'sofiaM',   avatar: 'SM', color: 'var(--bl)', specialty: 'Forex',   return: '89%',  winRate: '69%', minCapital: '$2,000',  fee: '15% of profits', clients: 31 },
  { name: 'Riku Osaka',    handle: 'rikuPRO',  avatar: 'RO', color: 'var(--pr)', specialty: 'Stocks',  return: '67%',  winRate: '65%', minCapital: '$1,000',  fee: '12% of profits', clients: 22 },
  { name: 'Arjun Joshi',   handle: 'arjunFX',  avatar: 'AJ', color: '#E87040',   specialty: 'Forex',   return: '196%', winRate: '61%', minCapital: '$10,000', fee: '25% of profits', clients: 67 },
];

const HOW_STEPS = [
  { num: 1, title: 'Post your request',          desc: 'Set your capital, risk tolerance, and budget. Takes about 2 minutes.' },
  { num: 2, title: 'Get matched',                desc: 'We surface verified traders who fit your profile. Review their track records.' },
  { num: 3, title: 'Agree on terms',             desc: 'Sign a digital agreement. Trader gets limited trading access to your account.' },
  { num: 4, title: 'Monitor & withdraw anytime', desc: 'Track performance in real time. Cancel with one click. No penalties.' },
];

// ─── Shared Components ───────────────────────────────────────────────────────

function AppNav() {
  return (
<nav class="gnav">
  <a href="#" class="logo">Trade<em>Flow</em></a>
  <div class="gnav-right">
    <span class="nav-port">Portfolio &nbsp;<span class="val">$48,204.33</span></span>
    <i class="ti ti-bell nav-bell" aria-hidden="true"></i>
    <div class="av">AK</div>
  </div>
</nav>
  );
}

function Sidebar() {
  const mainLinks = [
    { href: '/dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard'     },
    { href: '/copy-trading', icon: 'ti-copy',             label: 'Copy Trading'  },
    { href: '/hire-trader',  icon: 'ti-users',            label: 'Hire a Trader', active: true },
    { href: '/insights',     icon: 'ti-chart-line',       label: 'Insights'      },
  ];
  const accountLinks = [
    { href: '/payments', icon: 'ti-credit-card',     label: 'Payments' },
    { href: '/support',  icon: 'ti-headset',          label: 'Support'  },
    { href: '#',         icon: 'ti-file-description', label: 'Terms'    },
  ];

  const renderLink = ({ href, icon, label, active }) => (
    <a key={href + label} href={href} className={`sb-item${active ? ' active' : ''}`}>
      <i className={`ti ${icon}`}></i> {label}
    </a>
  );

  return (
     <div class="sb">
    <div class="sb-lbl">Main</div>
    <a href="#" class="sb-item"><i class="ti ti-layout-dashboard"></i> Dashboard</a>
    <a href="#" class="sb-item"><i class="ti ti-copy"></i> Copy Trading</a>
    <a href="#" class="sb-item active"><i class="ti ti-users"></i> Hire a Trader</a>
    <a href="#" class="sb-item"><i class="ti ti-chart-line"></i> Insights</a>
    <div class="sb-lbl">Account</div>
    <a href="#" class="sb-item"><i class="ti ti-credit-card"></i> Payments</a>
    <a href="#" class="sb-item"><i class="ti ti-headset"></i> Support</a>
    <a href="#" class="sb-item"><i class="ti ti-file-description"></i> Terms</a>
    <div class="sb-spacer"></div>
    <div class="sb-user">
      <div class="av">AK</div>
      <div>
        <div class="sb-name">Alex Kim</div>
        <div class="sb-role">Pro · Verified</div>
      </div>
    </div>
  </div>
  );
}

// ─── Page Components ─────────────────────────────────────────────────────────

function PostRequestForm() {
  return (
    <div className="main">
      <div className="card-title">Post a Request</div>
      <p className="form-subtitle">Get matched with professional traders who fit your goals</p>
      
      <div class="metrics">
      <div class="mc">
        <div class="mc-lbl">Active Traders</div>
        <div class="mc-val">2</div>
        <div class="mc-sub">Managing $14,000</div>
      </div>
      <div class="mc">
        <div class="mc-lbl">Total Return</div>
        <div class="mc-val up">+$3,240</div>
        <div class="mc-sub">Since Jan 2025</div>
      </div>
      <div class="mc">
        <div class="mc-lbl">Fees Paid</div>
        <div class="mc-val">$648</div>
        <div class="mc-sub">This year</div>
      </div>
      <div class="mc">
        <div class="mc-lbl">Avg Win Rate</div>
        <div class="mc-val">69%</div>
        <div class="mc-sub">Across hired traders</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-title">Post a Request</div>
        <div class="form-group">
          <label class="form-label">Capital to manage (USD)</label>
          <input type="number" class="form-input" placeholder="e.g. 10,000" />
        </div>
        <div class="form-group">
          <label class="form-label">Trading specialty</label>
          <select class="form-select">
            <option>Crypto</option>
            <option>Forex</option>
            <option>Stocks &amp; ETFs</option>
            <option>Options</option>
            <option>Commodities</option>
            <option>Multi-asset</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Risk appetite</label>
          <select class="form-select">
            <option>Conservative (10–20% annual)</option>
            <option>Moderate (20–40% annual)</option>
            <option>Aggressive (40%+ annual)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fee preference</label>
          <select class="form-select">
            <option>Performance only (% of profits)</option>
            <option>Fixed monthly</option>
            <option>Hybrid (base + performance)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
          <label class="form-label">Max monthly budget</label>
          <input type="text" class="form-input" placeholder="e.g. $200/mo or 20% profits" />
        </div>
        <div class="form-group">
          <label class="form-label">Notes for trader</label>
          <textarea class="form-input" rows="2" placeholder="Goals, restrictions, or anything else..."></textarea>
        </div>
      <button className="btn btn-gold btn-full ht-cta-btn">
        Find Matching Traders →
      </button>
    </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="card premium-card">
      <div className="card-title">How it works</div>
      {HOW_STEPS.map(({ num, title, desc }, i) => (
        <div key={num} className={`how-step${i === HOW_STEPS.length - 1 ? ' how-step-last' : ''}`}>
          <div className="how-num">{num}</div>
          <div>
            <div className="how-title">{title}</div>
            <div className="how-desc">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SecurityNote() {
  return (
    <div className="card premium-card ht-security-card">
      <div className="ht-security-inner">
        <i className="ti ti-shield-check ht-shield-icon"></i>
        <div>
          <div className="ht-security-title">Your funds stay protected</div>
          <div className="ht-security-body">
            Hired traders get trading-only access — they cannot withdraw your funds.
            All trades are recorded and auditable. You retain full custody at all times.
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProfessionals({ onHire }) {
  return (
    <div className="card premium-card">
      <div className="ht-table-header">
        <div>
          <div className="card-title">Featured Professionals</div>
          <p className="section-desc">Verified traders with proven performance</p>
        </div>
        <select className="ht-specialty-filter">
          <option>All Specialties</option>
          <option>Crypto</option>
          <option>Forex</option>
          <option>Stocks</option>
        </select>
      </div>

      <div className="traders-grid">
        {PROFESSIONALS.map((t) => (
          <div key={t.handle} className="trader-card">
            <div className="trader-header">
              <div className="sb-av trader-avatar" style={{ background: t.color }}>
                {t.avatar}
              </div>
              <div className="trader-info">
                <div className="trader-name">{t.name}</div>
                <div className="trader-handle">@{t.handle}</div>
              </div>
              <span className="badge badge-gold">{t.specialty}</span>
            </div>

            <div className="trader-stats">
              <div className="stat-item">
                <div className="stat-value up">+{t.return}</div>
                <div className="stat-label">12M Return</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{t.winRate}</div>
                <div className="stat-label">Win Rate</div>
              </div>
            </div>

            <div className="trader-meta">
              <div>Min. Capital: <strong>{t.minCapital}</strong></div>
              <div>Fee: <strong className="text-gold">{t.fee}</strong></div>
              <div>Clients: <strong>{t.clients}</strong></div>
            </div>

            <button className="btn btn-gold btn-full hire-btn" onClick={() => onHire(t)}>
              Hire {t.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HireModal({ trader, onClose }) {
  if (!trader) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <div className="sb-av modal-avatar" style={{ background: trader.color }}>
            {trader.avatar}
          </div>
          <div>
            <div className="modal-title">Hire {trader.name}</div>
            <div className="modal-sub">@{trader.handle} · {trader.specialty}</div>
          </div>
        </div>

        <div className="ht-modal-stats">
          <div className="ht-modal-stat-cell">
            <div className="mono up ht-modal-stat-value">+{trader.return}</div>
            <div className="ht-modal-stat-label">12M Return</div>
          </div>
          <div className="ht-modal-stat-cell">
            <div className="mono ht-modal-stat-value">{trader.winRate}</div>
            <div className="ht-modal-stat-label">Win Rate</div>
          </div>
          <div className="ht-modal-stat-cell">
            <div className="mono ht-modal-stat-value">{trader.minCapital}</div>
            <div className="ht-modal-stat-label">Min Capital</div>
          </div>
          <div className="ht-modal-stat-cell">
            <div className="mono text-gold ht-modal-stat-value">{trader.fee}</div>
            <div className="ht-modal-stat-label">Fee</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Capital to allocate (USD)</label>
          <input type="number" className="form-input" placeholder="5000" defaultValue="5000" />
        </div>

        <div className="form-group">
          <label className="form-label">Duration</label>
          <select className="form-select">
            <option>1 Month (trial)</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>Open-ended</option>
          </select>
        </div>

        <div className="ht-modal-notice">
          <i className="ti ti-shield-check ht-notice-icon"></i>
          Trader gets trading access only. You retain full custody. Cancel anytime.
        </div>

        <button className="btn btn-gold btn-full ht-cta-btn">
          Confirm & Proceed to Payment →
        </button>
      </div>
    </div>
    
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const HireTrader = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);

  const openHireModal = (trader) => {
    setSelectedTrader(trader);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTrader(null);
  };

  return (
    <>
      <AppNav />

      <div className="app-shell">
        <Sidebar />

        <div className="main">
          <div className="hero-section">
            <h1 className="page-title">Hire a Professional Trader</h1>
            <p className="page-sub">
              Delegate your portfolio to verified experts. Full transparency. Full control. Cancel anytime.
            </p>
          </div>

          <div className="g2">
            <PostRequestForm />
            <div>
              <HowItWorks />
              <SecurityNote />
            </div>
          </div>

          <FeaturedProfessionals onHire={openHireModal} />
        </div>
      </div>

      {showModal && <HireModal trader={selectedTrader} onClose={closeModal} />}
    </>
  );
};

export default HireTrader;