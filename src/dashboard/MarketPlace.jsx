import React, { useState } from 'react';
import '../css/dashboard.css';
import '../css/marketplace.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const BOTS = [
  {
    id: 'alphagrid',
    name: 'AlphaGrid',
    tag: 'Grid Bot',
    desc: 'Automated grid trading for crypto markets. Profits from sideways volatility without predicting direction.',
    roi: '+41.2%',
    trades: '1,842',
    winRate: '71%',
    price: 29,
    color: 'var(--g)',
    icon: 'ti-robot',
    badge: 'Top Rated',
    badgeColor: 'var(--g)',
    markets: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
  },
  {
    id: 'momentumx',
    name: 'MomentumX',
    tag: 'Trend Bot',
    desc: 'Rides strong momentum breakouts using multi-timeframe confirmation. Works best on trending markets.',
    roi: '+28.7%',
    trades: '934',
    winRate: '64%',
    price: 19,
    color: 'var(--bl)',
    icon: 'ti-rocket',
    badge: 'Popular',
    badgeColor: 'var(--bl)',
    markets: ['NVDA', 'TSLA', 'BTC/USDT'],
  },
  {
    id: 'scalprpro',
    name: 'ScalprPro',
    tag: 'Scalping Bot',
    desc: 'High-frequency scalper for forex pairs. Targets 5–15 pip moves with tight stop-losses.',
    roi: '+19.3%',
    trades: '6,210',
    winRate: '78%',
    price: 39,
    color: '#f59e0b',
    icon: 'ti-bolt',
    badge: null,
    markets: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  },
  {
    id: 'dcarbot',
    name: 'DCA Master',
    tag: 'DCA Bot',
    desc: 'Dollar-cost averaging bot. Automatically buys on dips and rebalances your crypto portfolio.',
    roi: '+33.5%',
    trades: '412',
    winRate: '82%',
    price: 15,
    color: '#10b981',
    icon: 'ti-refresh',
    badge: 'Best Value',
    badgeColor: '#10b981',
    markets: ['BTC', 'ETH', 'SOL', 'BNB'],
  },
];

const SIGNALS = [
  {
    id: 'cryptoedge',
    name: 'CryptoEdge',
    tag: 'Crypto Signals',
    desc: 'Daily curated crypto signals with entry, stop-loss, and take-profit levels. Avg. 3–5 signals/day.',
    roi: '+55.1%',
    subs: '4,200+',
    accuracy: '73%',
    price: 39,
    color: '#a78bfa',
    icon: 'ti-broadcast',
    badge: 'Best Seller',
    badgeColor: '#a78bfa',
    markets: ['BTC', 'ETH', 'ALT'],
    delivery: 'Telegram + App',
  },
  {
    id: 'forexelite',
    name: 'ForexElite',
    tag: 'Forex Signals',
    desc: 'Institutional-grade forex signals from ex-bank traders. Covers majors and select minors.',
    roi: '+22.8%',
    subs: '1,800+',
    accuracy: '68%',
    price: 49,
    color: '#f472b6',
    icon: 'ti-currency-dollar',
    badge: 'Pro',
    badgeColor: '#f472b6',
    markets: ['EUR/USD', 'GBP/JPY', 'USD/CHF'],
    delivery: 'App + SMS',
  },
  {
    id: 'stockpulse',
    name: 'StockPulse',
    tag: 'Equities Signals',
    desc: 'Weekly high-conviction stock picks based on technical and fundamental confluence.',
    roi: '+31.4%',
    subs: '920+',
    accuracy: '71%',
    price: 29,
    color: '#38bdf8',
    icon: 'ti-chart-bar',
    badge: null,
    markets: ['NVDA', 'AAPL', 'SPY'],
    delivery: 'App + Email',
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function AppNav() {
  return (
    <nav className="gnav">
      <a href="/" className="logo">Trade<em>Flow</em></a>
      <div className="gnav-right" style={{ gap: '14px' }}>
        <span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--nt)' }}>
          Portfolio &nbsp;<span className="up">$48,204.33</span>
        </span>
        <i className="ti ti-bell" style={{ fontSize: 17, color: 'var(--nt)', cursor: 'pointer' }}></i>
        <div className="sb-av" style={{ width: 28, height: 28, fontSize: 10, cursor: 'pointer' }}>AK</div>
      </div>
    </nav>
  );
}

function TickerBar() {
  const items = [
    { sym: 'BTC', label: '▲ $67,420 +2.3%', dir: 'up' },
    { sym: 'ETH', label: '▲ $3,840 +1.8%', dir: 'up' },
    { sym: 'S&P500', label: '▼ 5,248 -0.4%', dir: 'dn' },
    { sym: 'GOLD', label: '▲ $2,314 +0.9%', dir: 'up' },
    { sym: 'NVDA', label: '▲ $892 +3.1%', dir: 'up' },
    { sym: 'SOL', label: '▲ $168 +4.7%', dir: 'up' },
    { sym: 'BTC', label: '▲ $67,420 +2.3%', dir: 'up' },
    { sym: 'ETH', label: '▲ $3,840 +1.8%', dir: 'up' },
  ];
  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="sym">{t.sym}</span>&nbsp;
            <span className={t.dir}>{t.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Sidebar() {
  const mainLinks = [
    { href: '/dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { href: '/copy-trading', icon: 'ti-copy',             label: 'Copy Trading' },
    { href: '/hire-trader',  icon: 'ti-users',            label: 'Hire a Trader' },
    { href: '/insights',     icon: 'ti-chart-line',       label: 'Insights' },
    { href: '/marketplace',  icon: 'ti-robot',            label: 'Marketplace', active: true, badge: 'NEW' },
  ];
  const accountLinks = [
    { href: '/payments',  icon: 'ti-credit-card',     label: 'Payments' },
    { href: '/profile',   icon: 'ti-user-circle',     label: 'Profile' },
    { href: '/settings',  icon: 'ti-settings',        label: 'Settings' },
    { href: '/support',   icon: 'ti-headset',         label: 'Support' },
    { href: '#',          icon: 'ti-file-description', label: 'Terms' },
  ];
  const renderLink = ({ href, icon, label, active, badge }) => (
    <a key={href + label} href={href} className={`sb-item${active ? ' active' : ''}`}>
      <i className={`ti ${icon}`}></i>
      {label}
      {badge && (
        <span style={{
          marginLeft: 'auto', fontSize: '9px', fontWeight: 700,
          background: 'var(--g)', color: '#000', padding: '1px 5px',
          borderRadius: '4px', letterSpacing: '0.5px',
        }}>{badge}</span>
      )}
    </a>
  );
  return (
    <div className="sidebar">
      <div>
        <div className="sb-lbl">Main</div>
        {mainLinks.map(renderLink)}
      </div>
      <div style={{ marginTop: '8px' }}>
        <div className="sb-lbl">Account</div>
        {accountLinks.map(renderLink)}
      </div>
      <div className="sb-spacer"></div>
      <div className="sb-user">
        <div className="sb-av">AK</div>
        <div>
          <div className="sb-name">Alex Kim</div>
          <div className="sb-role">Pro · Verified</div>
        </div>
      </div>
    </div>
  );
}

function BotCard({ bot, onSubscribe }) {
  return (
    <div className="mp-card">
      {bot.badge && (
        <span className="mp-badge" style={{ background: bot.badgeColor }}>{bot.badge}</span>
      )}
      <div className="mp-card-header">
        <div className="mp-icon" style={{ background: bot.color }}>
          <i className={`ti ${bot.icon}`}></i>
        </div>
        <div>
          <div className="mp-card-name">{bot.name}</div>
          <div className="mp-card-tag">{bot.tag}</div>
        </div>
      </div>
      <p className="mp-card-desc">{bot.desc}</p>
      <div className="mp-stats">
        <div className="mp-stat">
          <div className="mono up mp-stat-val">{bot.roi}</div>
          <div className="mp-stat-lbl">12m ROI</div>
        </div>
        <div className="mp-stat">
          <div className="mono mp-stat-val">{bot.trades}</div>
          <div className="mp-stat-lbl">Trades</div>
        </div>
        <div className="mp-stat">
          <div className="mono mp-stat-val">{bot.winRate}</div>
          <div className="mp-stat-lbl">Win Rate</div>
        </div>
      </div>
      <div className="mp-markets">
        {bot.markets.map(m => (
          <span key={m} className="mp-market-tag">{m}</span>
        ))}
      </div>
      <div className="mp-card-footer">
        <div>
          <span className="mp-price">${bot.price}</span>
          <span className="mp-per">/month</span>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => onSubscribe(bot, 'bot')}>
          Activate Bot
        </button>
      </div>
    </div>
  );
}

function SignalCard({ signal, onSubscribe }) {
  return (
    <div className="mp-card">
      {signal.badge && (
        <span className="mp-badge" style={{ background: signal.badgeColor }}>{signal.badge}</span>
      )}
      <div className="mp-card-header">
        <div className="mp-icon" style={{ background: signal.color }}>
          <i className={`ti ${signal.icon}`}></i>
        </div>
        <div>
          <div className="mp-card-name">{signal.name}</div>
          <div className="mp-card-tag">{signal.tag}</div>
        </div>
      </div>
      <p className="mp-card-desc">{signal.desc}</p>
      <div className="mp-stats">
        <div className="mp-stat">
          <div className="mono up mp-stat-val">{signal.roi}</div>
          <div className="mp-stat-lbl">12m ROI</div>
        </div>
        <div className="mp-stat">
          <div className="mono mp-stat-val">{signal.subs}</div>
          <div className="mp-stat-lbl">Subscribers</div>
        </div>
        <div className="mp-stat">
          <div className="mono mp-stat-val">{signal.accuracy}</div>
          <div className="mp-stat-lbl">Accuracy</div>
        </div>
      </div>
      <div className="mp-markets">
        {signal.markets.map(m => (
          <span key={m} className="mp-market-tag">{m}</span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--nt)', marginBottom: 12 }}>
        <i className="ti ti-send" style={{ marginRight: 4 }}></i>Delivered via {signal.delivery}
      </div>
      <div className="mp-card-footer">
        <div>
          <span className="mp-price">${signal.price}</span>
          <span className="mp-per">/month</span>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => onSubscribe(signal, 'signal')}>
          Subscribe
        </button>
      </div>
    </div>
  );
}

function SubscribeModal({ item, type, onClose }) {
  const [step, setStep] = useState(1); // 1 = confirm, 2 = success

  if (!item) return null;

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 420 }}>
        {step === 1 ? (
          <>
            <div className="modal-title">
              {type === 'bot' ? 'Activate Bot' : 'Subscribe to Signals'}
            </div>
            <p style={{ fontSize: 13, color: 'var(--nt)', marginBottom: 18 }}>
              You're about to {type === 'bot' ? 'activate' : 'subscribe to'} <strong style={{ color: 'var(--gr)' }}>{item.name}</strong>.
              Your card will be charged <strong>${item.price}/month</strong> and renews automatically.
            </p>
            <div style={{
              background: 'var(--s)', borderRadius: 8, padding: '12px 14px',
              marginBottom: 18, fontSize: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--nt)' }}>{type === 'bot' ? 'Bot' : 'Signal plan'}</span>
                <span>{item.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--nt)' }}>Billing</span>
                <span>Monthly</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total today</span>
                <span className="text-gold">${item.price}.00</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => setStep(2)}>
                Confirm &amp; Pay
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--g)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', fontSize: 24,
            }}>✓</div>
            <div className="modal-title" style={{ marginBottom: 8 }}>
              {type === 'bot' ? 'Bot Activated!' : 'Subscribed!'}
            </div>
            <p style={{ fontSize: 13, color: 'var(--nt)', marginBottom: 20 }}>
              <strong>{item.name}</strong> is now {type === 'bot' ? 'running on your account' : 'sending signals to your dashboard'}.
            </p>
            <button className="btn btn-gold btn-sm" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const Marketplace = () => {
  const [tab, setTab] = useState('bots'); // 'bots' | 'signals'
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleSubscribe = (item, type) => {
    setSelected(item);
    setSelectedType(type);
  };

  return (
    <>
      <AppNav />
      <TickerBar />

      <div className="app-shell">
        <Sidebar />

        <div className="main">
          <div className="page-title">Marketplace</div>
          <div className="page-sub">Automate your edge — buy bots, subscribe to expert signals.</div>

          {/* Tab switcher */}
          <div className="mp-tabs">
            <button
              className={`mp-tab${tab === 'bots' ? ' active' : ''}`}
              onClick={() => setTab('bots')}
            >
              <i className="ti ti-robot"></i> Trading Bots
            </button>
            <button
              className={`mp-tab${tab === 'signals' ? ' active' : ''}`}
              onClick={() => setTab('signals')}
            >
              <i className="ti ti-broadcast"></i> Signal Plans
            </button>
          </div>

          {tab === 'bots' && (
            <>
              <div className="mp-section-intro">
                <strong>Trading Bots</strong> run 24/7 on your connected exchange account.
                Set your capital allocation and let the bot execute — no manual intervention needed.
              </div>
              <div className="mp-grid">
                {BOTS.map(b => (
                  <BotCard key={b.id} bot={b} onSubscribe={handleSubscribe} />
                ))}
              </div>
            </>
          )}

          {tab === 'signals' && (
            <>
              <div className="mp-section-intro">
                <strong>Signal Plans</strong> deliver trade alerts with entry, stop-loss, and target levels
                straight to your app, Telegram, or email. You decide which signals to execute.
              </div>
              <div className="mp-grid">
                {SIGNALS.map(s => (
                  <SignalCard key={s.id} signal={s} onSubscribe={handleSubscribe} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selected && (
        <SubscribeModal
          item={selected}
          type={selectedType}
          onClose={() => { setSelected(null); setSelectedType(null); }}
        />
      )}
    </>
  );
};

export default Marketplace;