import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import '../css/terminal.css';

// ─── Instruments ─────────────────────────────────────────────────────────────

// Full catalogue — user's watchlist is a subset of this
const ALL_INSTRUMENTS = [
  // Forex — Majors
  { sym: 'EURUSD',  label: 'Euro/USD',      price: 1.0862,  spread: 0.00012, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '€' },
  { sym: 'GBPUSD',  label: 'GBP/USD',       price: 1.2754,  spread: 0.00015, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '£' },
  { sym: 'USDJPY',  label: 'USD/JPY',       price: 155.42,  spread: 0.012,   pip: 0.01,    digits: 3, category: 'Forex',    icon: '¥' },
  { sym: 'USDCHF',  label: 'USD/CHF',       price: 0.9021,  spread: 0.00014, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '₣' },
  { sym: 'AUDUSD',  label: 'AUD/USD',       price: 0.6541,  spread: 0.00013, pip: 0.0001,  digits: 5, category: 'Forex',    icon: 'A$'},
  { sym: 'NZDUSD',  label: 'NZD/USD',       price: 0.6012,  spread: 0.00015, pip: 0.0001,  digits: 5, category: 'Forex',    icon: 'N$'},
  { sym: 'USDCAD',  label: 'USD/CAD',       price: 1.3672,  spread: 0.00015, pip: 0.0001,  digits: 5, category: 'Forex',    icon: 'C$'},
  // Forex — Minors
  { sym: 'EURGBP',  label: 'EUR/GBP',       price: 0.8521,  spread: 0.00018, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '€'},
  { sym: 'EURJPY',  label: 'EUR/JPY',       price: 168.72,  spread: 0.018,   pip: 0.01,    digits: 3, category: 'Forex',    icon: '€'},
  { sym: 'GBPJPY',  label: 'GBP/JPY',       price: 197.83,  spread: 0.022,   pip: 0.01,    digits: 3, category: 'Forex',    icon: '£'},
  { sym: 'AUDJPY',  label: 'AUD/JPY',       price: 101.54,  spread: 0.019,   pip: 0.01,    digits: 3, category: 'Forex',    icon: 'A$'},
  { sym: 'CHFJPY',  label: 'CHF/JPY',       price: 172.21,  spread: 0.021,   pip: 0.01,    digits: 3, category: 'Forex',    icon: '₣'},
  { sym: 'CADJPY',  label: 'CAD/JPY',       price: 113.72,  spread: 0.022,   pip: 0.01,    digits: 3, category: 'Forex',    icon: 'C$'},
  { sym: 'EURCHF',  label: 'EUR/CHF',       price: 0.9712,  spread: 0.00020, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '€'},
  { sym: 'EURAUD',  label: 'EUR/AUD',       price: 1.6612,  spread: 0.00025, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '€'},
  { sym: 'EURCAD',  label: 'EUR/CAD',       price: 1.4854,  spread: 0.00022, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '€'},
  { sym: 'GBPCHF',  label: 'GBP/CHF',       price: 1.1412,  spread: 0.00023, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '£'},
  { sym: 'GBPAUD',  label: 'GBP/AUD',       price: 1.9512,  spread: 0.00028, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '£'},
  { sym: 'GBPCAD',  label: 'GBP/CAD',       price: 1.7412,  spread: 0.00025, pip: 0.0001,  digits: 5, category: 'Forex',    icon: '£'},
  { sym: 'AUDCAD',  label: 'AUD/CAD',       price: 0.8972,  spread: 0.00020, pip: 0.0001,  digits: 5, category: 'Forex',    icon: 'A$'},
  { sym: 'AUDCHF',  label: 'AUD/CHF',       price: 0.5912,  spread: 0.00020, pip: 0.0001,  digits: 5, category: 'Forex',    icon: 'A$'},
  { sym: 'NZDJPY',  label: 'NZD/JPY',       price: 93.12,   spread: 0.020,   pip: 0.01,    digits: 3, category: 'Forex',    icon: 'N$'},
  { sym: 'NZDCAD',  label: 'NZD/CAD',       price: 0.8212,  spread: 0.00022, pip: 0.0001,  digits: 5, category: 'Forex',    icon: 'N$'},
  // Commodities
  { sym: 'XAUUSD',  label: 'Gold/USD',      price: 2314,    spread: 0.3,     pip: 0.1,     digits: 2, category: 'Commod.',  icon: '🥇' },
  { sym: 'XAGUSD',  label: 'Silver/USD',    price: 27.42,   spread: 0.04,    pip: 0.01,    digits: 3, category: 'Commod.',  icon: '🥈' },
  { sym: 'XPTUSD',  label: 'Platinum',      price: 954.2,   spread: 0.8,     pip: 0.1,     digits: 2, category: 'Commod.',  icon: 'Pt' },
  { sym: 'XPDUSD',  label: 'Palladium',     price: 1021.5,  spread: 1.2,     pip: 0.1,     digits: 2, category: 'Commod.',  icon: 'Pd' },
  { sym: 'USOIL',   label: 'Crude Oil WTI', price: 82.54,   spread: 0.04,    pip: 0.01,    digits: 2, category: 'Commod.',  icon: '🛢' },
  { sym: 'UKOIL',   label: 'Brent Crude',   price: 86.12,   spread: 0.05,    pip: 0.01,    digits: 2, category: 'Commod.',  icon: '🛢' },
  { sym: 'NATGAS',  label: 'Natural Gas',   price: 2.142,   spread: 0.003,   pip: 0.001,   digits: 3, category: 'Commod.',  icon: '⛽' },
  // Crypto
  { sym: 'BTCUSD',  label: 'Bitcoin',       price: 67420,   spread: 12,      pip: 1,       digits: 0, category: 'Crypto',   icon: '₿' },
  { sym: 'ETHUSD',  label: 'Ethereum',      price: 3840,    spread: 3,       pip: 0.1,     digits: 1, category: 'Crypto',   icon: 'Ξ' },
  { sym: 'SOLUSD',  label: 'Solana',        price: 168,     spread: 0.15,    pip: 0.01,    digits: 2, category: 'Crypto',   icon: '◎' },
  { sym: 'BNBUSD',  label: 'BNB',           price: 412,     spread: 0.4,     pip: 0.1,     digits: 1, category: 'Crypto',   icon: 'B' },
  { sym: 'XRPUSD',  label: 'Ripple',        price: 0.542,   spread: 0.001,   pip: 0.0001,  digits: 4, category: 'Crypto',   icon: 'X' },
  { sym: 'ADAUSD',  label: 'Cardano',       price: 0.412,   spread: 0.001,   pip: 0.0001,  digits: 4, category: 'Crypto',   icon: '₳' },
  { sym: 'DOGEUSD', label: 'Dogecoin',      price: 0.1512,  spread: 0.0005,  pip: 0.0001,  digits: 4, category: 'Crypto',   icon: 'Ð' },
  { sym: 'AVAXUSD', label: 'Avalanche',     price: 38.42,   spread: 0.05,    pip: 0.01,    digits: 2, category: 'Crypto',   icon: 'A' },
  { sym: 'DOTUSD',  label: 'Polkadot',      price: 7.82,    spread: 0.02,    pip: 0.01,    digits: 2, category: 'Crypto',   icon: '●' },
  { sym: 'LNKUSD',  label: 'Chainlink',     price: 15.42,   spread: 0.03,    pip: 0.01,    digits: 2, category: 'Crypto',   icon: '⬡' },
  // Indices
  { sym: 'US30',    label: 'Dow Jones',     price: 38540,   spread: 2,       pip: 1,       digits: 0, category: 'Indices',  icon: 'DJ' },
  { sym: 'US500',   label: 'S&P 500',       price: 5240,    spread: 0.5,     pip: 0.1,     digits: 1, category: 'Indices',  icon: 'SP' },
  { sym: 'USTEC',   label: 'NASDAQ 100',    price: 18320,   spread: 2,       pip: 1,       digits: 0, category: 'Indices',  icon: 'NQ' },
  { sym: 'UK100',   label: 'FTSE 100',      price: 8120,    spread: 1,       pip: 1,       digits: 0, category: 'Indices',  icon: 'FT' },
  { sym: 'GER40',   label: 'DAX 40',        price: 18240,   spread: 1.5,     pip: 1,       digits: 0, category: 'Indices',  icon: 'DX' },
  { sym: 'FRA40',   label: 'CAC 40',        price: 8012,    spread: 1.2,     pip: 1,       digits: 0, category: 'Indices',  icon: 'CA' },
  { sym: 'JPN225',  label: 'Nikkei 225',    price: 38420,   spread: 5,       pip: 1,       digits: 0, category: 'Indices',  icon: 'NK' },
  { sym: 'AUS200',  label: 'ASX 200',       price: 7820,    spread: 1.5,     pip: 1,       digits: 0, category: 'Indices',  icon: 'AS' },
  { sym: 'HK50',    label: 'Hang Seng',     price: 17420,   spread: 5,       pip: 1,       digits: 0, category: 'Indices',  icon: 'HS' },
  // Stocks
  { sym: 'AAPL',    label: 'Apple',         price: 187.5,   spread: 0.08,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: '' },
  { sym: 'MSFT',    label: 'Microsoft',     price: 415.2,   spread: 0.12,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'M' },
  { sym: 'NVDA',    label: 'NVIDIA',        price: 892,     spread: 0.35,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'N' },
  { sym: 'AMZN',    label: 'Amazon',        price: 182.4,   spread: 0.10,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'A' },
  { sym: 'GOOGL',   label: 'Alphabet',      price: 174.2,   spread: 0.09,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'G' },
  { sym: 'META',    label: 'Meta',          price: 512.8,   spread: 0.18,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'M' },
  { sym: 'TSLA',    label: 'Tesla',         price: 174.2,   spread: 0.12,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'T' },
  { sym: 'JPM',     label: 'JPMorgan',      price: 198.4,   spread: 0.09,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'J' },
  { sym: 'BAC',     label: 'Bank of Am.',   price: 37.82,   spread: 0.04,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'B' },
  { sym: 'NFLX',    label: 'Netflix',       price: 612.4,   spread: 0.22,    pip: 0.01,    digits: 2, category: 'Stocks',   icon: 'N' },
];

// Default watchlist symbols shown on first load
const DEFAULT_WATCHLIST = ['EURUSD','GBPUSD','USDJPY','XAUUSD','BTCUSD','ETHUSD','US500','AAPL','TSLA','USOIL'];

// For backwards compat in hooks that reference INSTRUMENTS
const INSTRUMENTS = ALL_INSTRUMENTS;

const TIMEFRAMES = ['M1','M5','M15','M30','H1','H4','D1','W1','MN'];

const TF_LABEL_MAP = { M1:'1m', M5:'5m', M15:'15m', M30:'30m', H1:'1h', H4:'4h', D1:'1D', W1:'1W', MN:'1M' };

// ─── Broker catalogue (MT4/MT5 servers fetched per broker) ───────────────────

const BROKERS = [
  {
    id: 'icmarkets', name: 'IC Markets', logo: 'IC', color: '#0ea5e9', popular: true,
    regulation: 'ASIC · CySEC · FSA', platform: 'MT4 / MT5 / cTrader', minDeposit: '$200',
    servers: [
      { name: 'ICMarketsGlobal-Live',  type: 'live',  platform: 'MT4', location: 'NY4 / LD4' },
      { name: 'ICMarketsGlobal-Live2', type: 'live',  platform: 'MT4', location: 'NY4' },
      { name: 'ICMarketsGlobal-Demo',  type: 'demo',  platform: 'MT4', location: 'NY4' },
      { name: 'ICMarkets-Live01',      type: 'live',  platform: 'MT5', location: 'LD4' },
      { name: 'ICMarkets-Demo01',      type: 'demo',  platform: 'MT5', location: 'LD4' },
    ],
  },
  {
    id: 'pepperstone', name: 'Pepperstone', logo: 'PP', color: '#22c55e', popular: true,
    regulation: 'ASIC · FCA · DFSA', platform: 'MT4 / MT5 / cTrader', minDeposit: '$200',
    servers: [
      { name: 'Pepperstone-Live01',  type: 'live', platform: 'MT4', location: 'LD4' },
      { name: 'Pepperstone-Live02',  type: 'live', platform: 'MT4', location: 'NY4' },
      { name: 'Pepperstone-Demo01',  type: 'demo', platform: 'MT4', location: 'LD4' },
      { name: 'Pepperstone-Live',    type: 'live', platform: 'MT5', location: 'LD4' },
      { name: 'Pepperstone-Demo',    type: 'demo', platform: 'MT5', location: 'LD4' },
    ],
  },
  {
    id: 'xm', name: 'XM Global', logo: 'XM', color: '#f59e0b', popular: true,
    regulation: 'CySEC · ASIC · IFSC', platform: 'MT4 / MT5', minDeposit: '$5',
    servers: [
      { name: 'XMGlobal-Real 3',  type: 'live', platform: 'MT4', location: 'LD4' },
      { name: 'XMGlobal-Real 8',  type: 'live', platform: 'MT4', location: 'NY4' },
      { name: 'XMGlobal-Demo',    type: 'demo', platform: 'MT4', location: 'LD4' },
      { name: 'XMGlobal-Real 5',  type: 'live', platform: 'MT5', location: 'LD4' },
      { name: 'XMGlobal-Demo 2',  type: 'demo', platform: 'MT5', location: 'LD4' },
    ],
  },
  {
    id: 'exness', name: 'Exness', logo: 'EX', color: '#a78bfa', popular: true,
    regulation: 'FCA · CySEC · FSA', platform: 'MT4 / MT5', minDeposit: '$1',
    servers: [
      { name: 'Exness-Real3',    type: 'live', platform: 'MT4', location: 'LD4' },
      { name: 'Exness-Real4',    type: 'live', platform: 'MT4', location: 'NY4' },
      { name: 'Exness-Trial',    type: 'demo', platform: 'MT4', location: 'LD4' },
      { name: 'Exness-MT5Real',  type: 'live', platform: 'MT5', location: 'LD4' },
      { name: 'Exness-MT5Trial', type: 'demo', platform: 'MT5', location: 'LD4' },
    ],
  },
  {
    id: 'fxpro', name: 'FxPro', logo: 'FP', color: '#f472b6', popular: false,
    regulation: 'FCA · CySEC · SCB', platform: 'MT4 / MT5 / cTrader', minDeposit: '$100',
    servers: [
      { name: 'FxPro.com-Real',    type: 'live', platform: 'MT4', location: 'LD4' },
      { name: 'FxPro.com-Demo',    type: 'demo', platform: 'MT4', location: 'LD4' },
      { name: 'FxProMT5-Real',     type: 'live', platform: 'MT5', location: 'LD4' },
      { name: 'FxProMT5-Demo',     type: 'demo', platform: 'MT5', location: 'LD4' },
    ],
  },
  {
    id: 'avatrade', name: 'AvaTrade', logo: 'AV', color: '#38bdf8', popular: false,
    regulation: 'CBI · ASIC · FSA', platform: 'MT4 / MT5', minDeposit: '$100',
    servers: [
      { name: 'AvaTrade-Real',  type: 'live', platform: 'MT4', location: 'NY4' },
      { name: 'AvaTrade-Demo',  type: 'demo', platform: 'MT4', location: 'NY4' },
      { name: 'AvaTrade5-Real', type: 'live', platform: 'MT5', location: 'NY4' },
      { name: 'AvaTrade5-Demo', type: 'demo', platform: 'MT5', location: 'NY4' },
    ],
  },
  {
    id: 'oanda', name: 'OANDA', logo: 'OA', color: '#fb923c', popular: false,
    regulation: 'FCA · ASIC · CFTC', platform: 'Proprietary / MT4', minDeposit: '$0',
    servers: [
      { name: 'OANDA-v20 Live-1',  type: 'live', platform: 'MT4', location: 'NY4' },
      { name: 'OANDA-v20 Live-2',  type: 'live', platform: 'MT4', location: 'NY4' },
      { name: 'OANDA-v20 Practice',type: 'demo', platform: 'MT4', location: 'NY4' },
    ],
  },
  {
    id: 'tickmill', name: 'Tickmill', logo: 'TM', color: '#ec4899', popular: false,
    regulation: 'FCA · CySEC · FSA', platform: 'MT4 / MT5', minDeposit: '$100',
    servers: [
      { name: 'TickmillUK-Live',  type: 'live', platform: 'MT4', location: 'LD4' },
      { name: 'TickmillUK-Demo',  type: 'demo', platform: 'MT4', location: 'LD4' },
      { name: 'Tickmill-Live',    type: 'live', platform: 'MT5', location: 'LD4' },
      { name: 'Tickmill-Demo',    type: 'demo', platform: 'MT5', location: 'LD4' },
    ],
  },
  {
    id: 'admiral', name: 'Admiral Markets', logo: 'AM', color: '#6366f1', popular: false,
    regulation: 'FCA · ASIC · CySEC', platform: 'MT4 / MT5', minDeposit: '$25',
    servers: [
      { name: 'AdmiralMarkets-Live2',  type: 'live', platform: 'MT4', location: 'LD4' },
      { name: 'AdmiralMarkets-Demo',   type: 'demo', platform: 'MT4', location: 'LD4' },
      { name: 'AdmiralMarkets5-Live',  type: 'live', platform: 'MT5', location: 'LD4' },
      { name: 'AdmiralMarkets5-Demo',  type: 'demo', platform: 'MT5', location: 'LD4' },
    ],
  },
];

const DEMO_POSITIONS = [
  { id: 1, sym: 'EURUSD', type: 'BUY',  lots: 1.0, open: 1.08310, sl: 1.07800, tp: 1.09200, pl: 310,  pips: 31  },
  { id: 2, sym: 'BTCUSD', type: 'BUY',  lots: 0.1, open: 62100,   sl: 60000,   tp: 70000,   pl: 530,  pips: 531 },
  { id: 3, sym: 'XAUUSD', type: 'SELL', lots: 0.5, open: 2330,    sl: 2360,    tp: 2280,    pl: 160,  pips: 16  },
  { id: 4, sym: 'GBPUSD', type: 'SELL', lots: 0.5, open: 1.27840, sl: 1.28400, tp: 1.26900, pl: -34,  pips: -34 },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useLivePrices() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(INSTRUMENTS.map(i => [i.sym, {
      bid: i.price, ask: +(i.price + i.spread).toFixed(i.digits),
      change: 0, changePct: 0, dir: 0,
    }]))
  );
  useEffect(() => {
    const iv = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        INSTRUMENTS.forEach(inst => {
          const old  = prev[inst.sym];
          const move = (Math.random() - 0.497) * inst.price * 0.00055;
          const newBid = +(Math.max(inst.price * 0.8, old.bid + move)).toFixed(inst.digits);
          next[inst.sym] = {
            bid: newBid,
            ask: +(newBid + inst.spread).toFixed(inst.digits),
            change: +(newBid - inst.price).toFixed(inst.digits),
            changePct: +((newBid - inst.price) / inst.price * 100).toFixed(2),
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
  const inst = INSTRUMENTS.find(i => i.sym === sym);
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    if (!inst) return;
    const vol = inst.price * 0.007;
    let price  = inst.price * (0.9 + Math.random() * 0.02);
    const arr  = [];
    for (let i = 0; i < 120; i++) {
      const o    = price;
      const move = (Math.random() - 0.49) * vol;
      const c    = Math.max(price * 0.5, o + move);
      const h    = Math.max(o, c) + Math.random() * vol * 0.35;
      const l    = Math.min(o, c) - Math.random() * vol * 0.35;
      arr.push({ o, h, l, c });
      price = c;
    }
    setCandles(arr);
  }, [sym, tf]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tick last candle
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

// ─── CandleChart — zoom · pan · drawing tools ────────────────────────────────

function CandleChart({ sym, tf, activeTool, drawings, onAddDrawing }) {
  const candles    = useCandles(sym, tf);
  const wrapRef    = useRef(null);
  const svgRef     = useRef(null);
  const dimsRef    = useRef({ w: 900, h: 420 });
  const candlesRef = useRef(candles);

  const [dims,       setDims]       = useState({ w: 900, h: 420 });
  const [tooltip,    setTooltip]    = useState(null);
  // zoom: number of candles visible (fewer = zoomed in)
  const [visCount,   setVisCount]   = useState(90);
  // pan: offset from right end (0 = most recent candles)
  const [panOffset,  setPanOffset]  = useState(0);
  // panning state
  const isPanning    = useRef(false);
  const panStart     = useRef({ x: 0, offset: 0 });
  // drawing state
  const isDrawing    = useRef(false);
  const drawStart    = useRef(null);
  const [draftLine,  setDraftLine]  = useState(null);
  // mouse pos for crosshair
  const [mousePos,   setMousePos]   = useState(null);

  useEffect(() => { candlesRef.current = candles; }, [candles]);

  // ── Resize observer ──
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      dimsRef.current = { w: width, h: height };
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Wheel zoom ──
  const handleWheel = useCallback(e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.12 : 0.89;
    setVisCount(v => Math.min(candlesRef.current.length, Math.max(10, Math.round(v * delta))));
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Derived chart geometry ──
  // Clamp visCount/panOffset to available candles
  const allCandles = candles;
  const maxVis     = allCandles.length;
  const safeVis    = Math.min(visCount, maxVis);
  const maxPan     = Math.max(0, maxVis - safeVis);
  const safePan    = Math.min(maxPan, Math.max(0, panOffset));
  // Slice: from right, shifted by panOffset
  const startIdx   = Math.max(0, maxVis - safeVis - safePan);
  const visible    = allCandles.slice(startIdx, startIdx + safeVis);

  const pad  = { t: 12, r: 68, b: 24, l: 8 };
  const cw   = dims.w - pad.l - pad.r;
  const ch   = dims.h - pad.t - pad.b;

  const highs = visible.map(c => c.h);
  const lows  = visible.map(c => c.l);
  const maxP  = visible.length ? Math.max(...highs) * 1.0008 : 1;
  const minP  = visible.length ? Math.min(...lows)  * 0.9992 : 0;
  const range = maxP - minP || 1;
  const barW  = cw / (visible.length || 1);
  const cW    = Math.max(1.5, barW * 0.7);

  const px   = i  => pad.l + i * barW + barW / 2;
  const py   = p  => pad.t + ch - ((p - minP) / range) * ch;
  const pxToPrice = y => minP + ((pad.t + ch - y) / ch) * range;
  const fmt  = v  => v >= 1000 ? v.toFixed(0) : v >= 10 ? v.toFixed(2) : v.toFixed(5);

  const ySteps = 6;
  const yGrid  = Array.from({ length: ySteps }, (_, i) => minP + range * i / (ySteps - 1));

  const lastC    = visible.length ? visible[visible.length - 1].c : 0;
  const lastY    = py(lastC);
  const lastBull = visible.length ? visible[visible.length - 1].c >= visible[visible.length - 1].o : true;

  // ── Cursor style based on tool ──
  const cursorMap = {
    cursor:    'default',
    cross:     'crosshair',
    pan:       isPanning.current ? 'grabbing' : 'grab',
    zoomin:    'zoom-in',
    zoomout:   'zoom-out',
    trendline: 'crosshair',
    hline:     'crosshair',
    ray:       'crosshair',
    fib:       'crosshair',
    rect:      'crosshair',
    text:      'text',
  };
  const cursor = cursorMap[activeTool] || 'default';

  // ── Mouse events ──
  const getSVGPoint = e => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = useCallback(e => {
    const pt = getSVGPoint(e);
    if (!pt) return;
    setMousePos(pt);

    const { w } = dimsRef.current;
    const padL = 8, padR = 68;
    const barW2 = (w - padL - padR) / (candlesRef.current.length ? Math.min(visCount, candlesRef.current.length) : 1);
    const allC  = candlesRef.current;
    const maxV  = allC.length;
    const sv    = Math.min(visCount, maxV);
    const si    = Math.max(0, maxV - sv - safePan);
    const vis2  = allC.slice(si, si + sv);
    const idx   = Math.floor((pt.x - padL) / barW2);
    if (idx >= 0 && idx < vis2.length) {
      setTooltip({ c: vis2[idx], x: pt.x, y: pt.y });
    } else {
      setTooltip(null);
    }

    // Pan tool drag
    if (activeTool === 'pan' && isPanning.current) {
      const dx = e.clientX - panStart.current.x;
      const pixPerBar = barW2;
      const barsDelta = Math.round(-dx / pixPerBar);
      setPanOffset(Math.min(Math.max(0, panStart.current.offset + barsDelta), Math.max(0, maxV - sv)));
    }

    // Drawing draft
    if (isDrawing.current && drawStart.current) {
      setDraftLine({ x1: drawStart.current.x, y1: drawStart.current.y, x2: pt.x, y2: pt.y });
    }
  }, [activeTool, visCount, safePan]);

  const handleMouseDown = useCallback(e => {
    const pt = getSVGPoint(e);
    if (!pt) return;

    if (activeTool === 'pan') {
      isPanning.current = true;
      panStart.current = { x: e.clientX, offset: safePan };
      return;
    }
    if (activeTool === 'zoomin') {
      setVisCount(v => Math.max(10, Math.round(v * 0.75)));
      return;
    }
    if (activeTool === 'zoomout') {
      setVisCount(v => Math.min(candlesRef.current.length, Math.round(v * 1.33)));
      return;
    }
    if (['trendline','hline','ray','fib','rect'].includes(activeTool)) {
      isDrawing.current = true;
      drawStart.current = pt;
      setDraftLine({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
    }
    if (activeTool === 'text') {
      const price = pxToPrice(pt.y);
      const label = prompt('Enter label text:');
      if (label) onAddDrawing({ type: 'text', x: pt.x, y: pt.y, price, label });
    }
  }, [activeTool, safePan, pxToPrice, onAddDrawing]);

  const handleMouseUp = useCallback(e => {
    if (activeTool === 'pan') {
      isPanning.current = false;
      return;
    }
    if (isDrawing.current && drawStart.current) {
      const pt = getSVGPoint(e);
      if (pt) {
        const p1 = pxToPrice(drawStart.current.y);
        const p2 = pxToPrice(pt.y);
        onAddDrawing({
          type: activeTool,
          x1: drawStart.current.x, y1: drawStart.current.y,
          x2: pt.x, y2: pt.y,
          price1: p1, price2: p2,
        });
      }
      isDrawing.current = false;
      drawStart.current = null;
      setDraftLine(null);
    }
  }, [activeTool, pxToPrice, onAddDrawing]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    setMousePos(null);
    if (isPanning.current) isPanning.current = false;
    if (isDrawing.current) {
      isDrawing.current = false;
      drawStart.current = null;
      setDraftLine(null);
    }
  }, []);

  // ── Render drawings (persisted) ──
  const renderDrawing = (d, i) => {
    if (d.type === 'trendline' || d.type === 'ray') {
      return <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
        stroke="#c9f15d" strokeWidth="1.5" strokeDasharray={d.type === 'ray' ? '5,3' : 'none'} opacity="0.9" />;
    }
    if (d.type === 'hline') {
      const y = py(d.price1);
      return <line key={i} x1={pad.l} y1={y} x2={dims.w - pad.r} y2={y}
        stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6,3" opacity="0.85" />;
    }
    if (d.type === 'fib') {
      const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      const priceRange = d.price2 - d.price1;
      return (
        <g key={i}>
          {fibLevels.map((lvl, li) => {
            const price = d.price1 + priceRange * lvl;
            const fy = py(price);
            return (
              <g key={li}>
                <line x1={pad.l} y1={fy} x2={dims.w - pad.r} y2={fy}
                  stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" opacity="0.7" />
                <text x={dims.w - pad.r + 4} y={fy - 2}
                  fill="#a78bfa" fontSize="8.5" fontFamily="'DM Mono',monospace">{(lvl * 100).toFixed(1)}%</text>
              </g>
            );
          })}
        </g>
      );
    }
    if (d.type === 'rect') {
      const rx = Math.min(d.x1, d.x2);
      const ry = Math.min(d.y1, d.y2);
      const rw = Math.abs(d.x2 - d.x1);
      const rh = Math.abs(d.y2 - d.y1);
      return <rect key={i} x={rx} y={ry} width={rw} height={rh}
        stroke="#f59e0b" strokeWidth="1.2" fill="#f59e0b11" opacity="0.85" />;
    }
    if (d.type === 'text') {
      return <text key={i} x={d.x} y={d.y}
        fill="#c9f15d" fontSize="11" fontFamily="'DM Mono',monospace" fontWeight="600">{d.label}</text>;
    }
    return null;
  };

  // ── Loading state ──
  if (!candles.length) return (
    <div className="chart-placeholder"><div className="chart-loader"><span /><span /><span /></div></div>
  );

  const showCrosshair = mousePos && (activeTool === 'cursor' || activeTool === 'cross'
    || activeTool === 'trendline' || activeTool === 'hline' || activeTool === 'ray'
    || activeTool === 'fib' || activeTool === 'rect');

  return (
    <div
      ref={wrapRef}
      className="chart-svg-wrap"
      style={{ cursor }}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        ref={svgRef}
        className="chart-svg"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ userSelect: 'none' }}
      >
        {/* Y grid */}
        {yGrid.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} y1={py(v)} x2={dims.w - pad.r} y2={py(v)}
              stroke="#1e2330" strokeWidth="1" />
            <text x={dims.w - pad.r + 5} y={py(v) + 4}
              fill="#4b5563" fontSize="9.5" fontFamily="'DM Mono',monospace">{fmt(v)}</text>
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
              <line x1={px(i)} y1={py(c.h)} x2={px(i)} y2={py(c.l)}
                stroke={col} strokeWidth="1" opacity="0.9" />
              <rect x={px(i) - cW / 2} y={bTop} width={cW} height={bH}
                fill={col} opacity={i === visible.length - 1 ? 1 : 0.88} />
            </g>
          );
        })}

        {/* Last price dashed line */}
        <line x1={pad.l} y1={lastY} x2={dims.w - pad.r} y2={lastY}
          stroke={lastBull ? '#26a69a' : '#ef5350'} strokeWidth="1" strokeDasharray="3,3" opacity="0.7" />
        <rect x={dims.w - pad.r} y={lastY - 9} width={pad.r - 2} height={18}
          fill={lastBull ? '#26a69a' : '#ef5350'} rx="2" />
        <text x={dims.w - pad.r + 4} y={lastY + 4}
          fill="#000" fontSize="9.5" fontWeight="700" fontFamily="'DM Mono',monospace">{fmt(lastC)}</text>

        {/* Persisted drawings */}
        {drawings.map(renderDrawing)}

        {/* Draft line while drawing */}
        {draftLine && (() => {
          if (activeTool === 'rect') {
            const rx = Math.min(draftLine.x1, draftLine.x2);
            const ry = Math.min(draftLine.y1, draftLine.y2);
            const rw = Math.abs(draftLine.x2 - draftLine.x1);
            const rh = Math.abs(draftLine.y2 - draftLine.y1);
            return <rect x={rx} y={ry} width={rw} height={rh}
              stroke="#f59e0b" strokeWidth="1.2" fill="#f59e0b11" strokeDasharray="5,3" />;
          }
          if (activeTool === 'hline') {
            return <line x1={pad.l} y1={draftLine.y1} x2={dims.w - pad.r} y2={draftLine.y1}
              stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6,3" opacity="0.85" />;
          }
          return <line x1={draftLine.x1} y1={draftLine.y1} x2={draftLine.x2} y2={draftLine.y2}
            stroke="#c9f15d" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.9" />;
        })()}

        {/* Crosshair */}
        {showCrosshair && mousePos && <>
          <line x1={mousePos.x} y1={pad.t} x2={mousePos.x} y2={pad.t + ch}
            stroke="#c9f15d44" strokeWidth="1" strokeDasharray="4,3" />
          <line x1={pad.l} y1={mousePos.y} x2={dims.w - pad.r} y2={mousePos.y}
            stroke="#c9f15d33" strokeWidth="1" strokeDasharray="4,3" />
          {/* Price label on Y axis */}
          <rect x={dims.w - pad.r} y={mousePos.y - 9} width={pad.r - 2} height={18}
            fill="#1e2330" stroke="#334155" strokeWidth="1" rx="2" />
          <text x={dims.w - pad.r + 4} y={mousePos.y + 4}
            fill="#c9f15d" fontSize="9.5" fontWeight="600" fontFamily="'DM Mono',monospace">
            {fmt(pxToPrice(mousePos.y))}
          </text>
        </>}
      </svg>

      {/* Zoom level indicator */}
      <div style={{
        position: 'absolute', bottom: 28, right: 76,
        fontSize: 9, color: '#4b5563', fontFamily: 'DM Mono, monospace',
        background: '#0b0e14cc', padding: '2px 6px', borderRadius: 4,
        pointerEvents: 'none',
      }}>
        {safeVis} bars
      </div>

      {/* OHLC tooltip */}
      {tooltip && (
        <div className="chart-tooltip" style={{
          left: tooltip.x > dims.w * 0.6 ? tooltip.x - 130 : tooltip.x + 12,
          top:  Math.max(8, tooltip.y - 52),
        }}>
          <div className="ct-row"><span>O</span><span className="mono">{fmt(tooltip.c.o)}</span></div>
          <div className="ct-row"><span>H</span><span className="mono up">{fmt(tooltip.c.h)}</span></div>
          <div className="ct-row"><span>L</span><span className="mono dn">{fmt(tooltip.c.l)}</span></div>
          <div className="ct-row"><span>C</span><span className="mono" style={{ fontWeight: 700 }}>{fmt(tooltip.c.c)}</span></div>
        </div>
      )}
    </div>
  );
}

// ─── Connect Account Modal ────────────────────────────────────────────────────

function ConnectModal({ onClose, onConnected }) {
  const [step,       setStep]       = useState('broker');  // broker | server | login | connecting
  const [query,      setQuery]      = useState('');
  const [broker,     setBroker]     = useState(null);
  const [platform,   setPlatform]   = useState('MT4');
  const [serverList, setServerList] = useState([]);
  const [server,     setServer]     = useState(null);
  const [loadingSrv, setLoadingSrv] = useState(false);
  const [login,      setLogin]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [errMsg,     setErrMsg]     = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return BROKERS;
    return BROKERS.filter(b => b.name.toLowerCase().includes(q) || b.platform.toLowerCase().includes(q));
  }, [query]);

  // Simulate fetching servers from MT gateway for selected broker + platform
  const fetchServers = useCallback((b, plat) => {
    setLoadingSrv(true);
    setServerList([]);
    setServer(null);
    setTimeout(() => {
      const all = b.servers.filter(s => s.platform === plat);
      setServerList(all);
      setLoadingSrv(false);
    }, 900);
  }, []);

  const handleSelectBroker = b => {
    setBroker(b);
    const defaultPlat = b.platform.includes('MT5') ? 'MT4' : 'MT4';
    setPlatform(defaultPlat);
    fetchServers(b, defaultPlat);
    setStep('server');
  };

  const handlePlatformChange = plat => {
    setPlatform(plat);
    if (broker) fetchServers(broker, plat);
  };

  const handleConnect = () => {
    if (!login.trim()) { setErrMsg('Enter your account login number.'); return; }
    if (!password.trim()) { setErrMsg('Enter your trading password.'); return; }
    if (!server) { setErrMsg('Select a server.'); return; }
    setErrMsg('');
    setStep('connecting');
    setTimeout(() => {
      onConnected({
        broker, server, platform, login,
        accType:  server.type,
        balance:  server.type === 'demo' ? 10000 : 48204.33,
        equity:   server.type === 'demo' ? 10342 : 49398.33,
        leverage: '1:100',
        currency: 'USD',
      });
      onClose();
    }, 2600);
  };

  const availPlatforms = broker
    ? [...new Set(broker.servers.map(s => s.platform))]
    : [];

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal conn-modal">

        {/* ── Step: Select Broker ── */}
        {step === 'broker' && <>
          <div className="modal-title">Connect Trading Account</div>
          <p className="conn-sub">Select your broker to load their available servers</p>

          <div className="conn-search-wrap">
            <i className="ti ti-search conn-search-icon"></i>
            <input
              className="conn-search"
              placeholder="Search broker…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && <button className="conn-clear" onClick={() => setQuery('')}>✕</button>}
          </div>

          <div className="conn-broker-list">
            {filtered.map(b => (
              <div key={b.id} className="conn-broker-row" onClick={() => handleSelectBroker(b)}>
                <div className="conn-broker-logo" style={{ background: b.color }}>{b.logo}</div>
                <div className="conn-broker-info">
                  <div className="conn-broker-name">{b.name}</div>
                  <div className="conn-broker-meta">{b.regulation} · {b.platform}</div>
                </div>
                {b.popular && <span className="conn-popular-tag">Popular</span>}
                <i className="ti ti-chevron-right" style={{ color: 'var(--nt)', fontSize: 14 }}></i>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--nt)', fontSize: 13 }}>
                No brokers found for "<strong>{query}</strong>"
              </div>
            )}
          </div>

          <div className="conn-security-note">
            <i className="ti ti-shield-lock"></i>
            Credentials are transmitted directly to your broker's server. TradeFlow never stores them.
          </div>
        </>}

        {/* ── Step: Select Server ── */}
        {step === 'server' && <>
          <button className="conn-back" onClick={() => setStep('broker')}>
            <i className="ti ti-arrow-left"></i> Back
          </button>
          <div className="modal-title" style={{ marginTop: 8 }}>
            <span className="conn-broker-badge" style={{ background: broker?.color }}>{broker?.logo}</span>
            {broker?.name}
          </div>

          {/* Platform picker */}
          <div className="conn-section-lbl">Platform</div>
          <div className="conn-platform-row">
            {availPlatforms.map(plat => (
              <button
                key={plat}
                className={`conn-plat-btn${platform === plat ? ' active' : ''}`}
                onClick={() => handlePlatformChange(plat)}
              >{plat}</button>
            ))}
          </div>

          {/* Server list */}
          <div className="conn-section-lbl" style={{ marginTop: 16 }}>
            Server
            {loadingSrv && <span className="conn-loading-badge">Fetching from MT gateway…</span>}
          </div>

          {loadingSrv ? (
            <div className="conn-srv-loading">
              <div className="chart-loader"><span /><span /><span /></div>
              <span>Loading servers for {broker?.name}…</span>
            </div>
          ) : (
            <div className="conn-server-list">
              {serverList.map(s => (
                <div
                  key={s.name}
                  className={`conn-server-row${server?.name === s.name ? ' active' : ''}`}
                  onClick={() => setServer(s)}
                >
                  <div>
                    <div className="conn-server-name">{s.name}</div>
                    <div className="conn-server-meta">
                      <span className={`conn-srv-type ${s.type}`}>{s.type.toUpperCase()}</span>
                      <span>{s.platform}</span>
                      <span><i className="ti ti-map-pin" style={{ fontSize: 10 }}></i> {s.location}</span>
                    </div>
                  </div>
                  {server?.name === s.name && <i className="ti ti-circle-check" style={{ color: 'var(--g)', fontSize: 18 }}></i>}
                </div>
              ))}
              {serverList.length === 0 && !loadingSrv && (
                <div style={{ color: 'var(--nt)', fontSize: 12, padding: '12px 0' }}>
                  No {platform} servers found for this broker.
                </div>
              )}
            </div>
          )}

          <button
            className="btn btn-gold btn-md"
            style={{ width: '100%', marginTop: 16 }}
            disabled={!server}
            onClick={() => setStep('login')}
          >
            Continue with {server?.name || 'selected server'} →
          </button>
        </>}

        {/* ── Step: Login ── */}
        {step === 'login' && <>
          <button className="conn-back" onClick={() => setStep('server')}>
            <i className="ti ti-arrow-left"></i> Back
          </button>
          <div className="modal-title" style={{ marginTop: 8 }}>Login to {broker?.name}</div>

          <div className="conn-login-summary">
            <div className="conn-summ-row">
              <span>Broker</span>
              <span style={{ fontWeight: 700 }}>{broker?.name}</span>
            </div>
            <div className="conn-summ-row">
              <span>Server</span>
              <span className="mono" style={{ fontSize: 12 }}>{server?.name}</span>
            </div>
            <div className="conn-summ-row">
              <span>Type</span>
              <span className={`conn-srv-type ${server?.type}`} style={{ fontWeight: 700 }}>
                {server?.type?.toUpperCase()}
              </span>
            </div>
            <div className="conn-summ-row">
              <span>Platform</span>
              <span>{platform}</span>
            </div>
          </div>

          {server?.type === 'live' && (
            <div className="conn-live-warn">
              <i className="ti ti-alert-triangle"></i>
              You are connecting to a <strong>LIVE</strong> account. Real funds are at risk.
            </div>
          )}

          <div className="conn-field">
            <label>Account Login / ID</label>
            <input value={login} onChange={e => setLogin(e.target.value)}
              placeholder="e.g. 12345678" type="text" autoFocus />
          </div>
          <div className="conn-field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                placeholder="Investor or trading password"
                style={{ paddingRight: 42 }}
              />
              <button className="conn-eye" onClick={() => setShowPass(v => !v)}>
                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`}></i>
              </button>
            </div>
          </div>

          {errMsg && (
            <div className="conn-error"><i className="ti ti-alert-circle"></i> {errMsg}</div>
          )}

          <button className="btn btn-gold btn-md" style={{ width: '100%', marginTop: 12 }} onClick={handleConnect}>
            <i className="ti ti-plug"></i> &nbsp;Connect Account
          </button>

          <div className="conn-security-note" style={{ marginTop: 12 }}>
            <i className="ti ti-shield-lock"></i>
            Your credentials are sent only to <strong>{broker?.name}</strong>'s servers and never stored.
          </div>
        </>}

        {/* ── Step: Connecting animation ── */}
        {step === 'connecting' && (
          <div className="conn-animating">
            <div className="conn-anim-logo" style={{ background: broker?.color }}>{broker?.logo}</div>
            <div className="conn-anim-ring" />
            <div className="conn-anim-title">Connecting to {broker?.name}…</div>
            <div className="conn-anim-steps">
              <ConnStep label={`Resolving ${server?.name}`}        delay={0}    />
              <ConnStep label="Authenticating credentials"          delay={500}  />
              <ConnStep label="Loading account history"             delay={1000} />
              <ConnStep label="Syncing positions and market watch"  delay={1600} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConnStep({ label, delay }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), delay + 350);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={`conn-step${done ? ' done' : ''}`}>
      <span className="conn-step-check">{done ? <i className="ti ti-check"></i> : <span className="conn-step-dot" />}</span>
      {label}
    </div>
  );
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

function Watchlist({ prices, selected, onSelect, watchlist, onAddSymbol, onRemoveSymbol, session }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addQuery, setAddQuery]         = useState('');

  const categories = [...new Set(watchlist.map(sym => ALL_INSTRUMENTS.find(i => i.sym === sym)?.category).filter(Boolean))];

  const filteredAdd = useMemo(() => {
    const q = addQuery.toLowerCase().trim();
    return ALL_INSTRUMENTS.filter(i =>
      !watchlist.includes(i.sym) &&
      (i.sym.toLowerCase().includes(q) || i.label.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
    );
  }, [addQuery, watchlist]);

  return (
    <div className="watchlist" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Account info panel — shown when session is connected */}
      {session && (
        <div className="wl-account-panel">
          <div className="wl-acc-broker">
            <div className="wl-acc-logo" style={{ background: session.broker.color }}>{session.broker.logo}</div>
            <div>
              <div className="wl-acc-name">{session.broker.name}</div>
              <div className="wl-acc-server mono">{session.server.name}</div>
            </div>
            <span className={`conn-srv-type ${session.accType}`} style={{ marginLeft: 'auto' }}>{session.accType.toUpperCase()}</span>
          </div>
          <div className="wl-acc-grid">
            <div className="wl-acc-row"><span>Balance</span><span className="mono text-gold">${session.balance.toLocaleString()}</span></div>
            <div className="wl-acc-row"><span>Equity</span><span className={`mono ${session.equity >= session.balance ? 'up' : 'dn'}`}>${session.equity.toLocaleString()}</span></div>
            <div className="wl-acc-row"><span>Free Margin</span><span className="mono">${(session.equity * 0.92).toFixed(2)}</span></div>
            <div className="wl-acc-row"><span>Margin Lvl</span><span className="mono up">924%</span></div>
            <div className="wl-acc-row"><span>Leverage</span><span className="mono">{session.leverage}</span></div>
            <div className="wl-acc-row"><span>Currency</span><span className="mono">{session.currency}</span></div>
          </div>
        </div>
      )}

      {/* Watchlist header */}
      <div className="wl-head">
        <span>Symbol</span><span>Bid</span><span>Ask</span>
      </div>

      {/* Symbol rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {categories.map(cat => (
          <React.Fragment key={cat}>
            <div className="wl-cat-lbl">{cat}</div>
            {watchlist
              .map(sym => ALL_INSTRUMENTS.find(i => i.sym === sym))
              .filter(inst => inst && inst.category === cat)
              .map(inst => {
                const p = prices[inst.sym];
                if (!p) return null;
                return (
                  <div
                    key={inst.sym}
                    className={`wl-row${selected === inst.sym ? ' active' : ''}`}
                    onClick={() => onSelect(inst.sym)}
                  >
                    <div className="wl-sym-block">
                      <span className="wl-sym">{inst.sym}</span>
                      <span className={`wl-chg ${p.changePct >= 0 ? 'up' : 'dn'}`}>
                        {p.changePct >= 0 ? '+' : ''}{p.changePct.toFixed(2)}%
                      </span>
                    </div>
                    <span className={`wl-price mono ${p.dir === -1 ? 'flash-dn' : p.dir === 1 ? 'flash-up' : ''}`}>
                      {p.bid.toFixed(inst.digits)}
                    </span>
                    <span className="wl-price wl-ask mono">
                      {p.ask.toFixed(inst.digits)}
                    </span>
                    <button
                      className="wl-remove-btn"
                      onClick={e => { e.stopPropagation(); onRemoveSymbol(inst.sym); }}
                      title="Remove from watchlist"
                    >✕</button>
                  </div>
                );
              })}
          </React.Fragment>
        ))}
      </div>

      {/* Add symbol button */}
      <div className="wl-add-row">
        <button className="wl-add-btn" onClick={() => setShowAddModal(true)}>
          <i className="ti ti-plus"></i> Add Symbol
        </button>
      </div>

      {/* Add symbol modal */}
      {showAddModal && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) { setShowAddModal(false); setAddQuery(''); } }}>
          <div className="modal" style={{ maxWidth: 460, maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-title">Add Symbol to Watchlist</div>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--nt)', fontSize: 15, pointerEvents: 'none' }}></i>
              <input
                autoFocus
                className="conn-search"
                placeholder="Search symbol, name, or category…"
                value={addQuery}
                onChange={e => setAddQuery(e.target.value)}
              />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {[...new Set(filteredAdd.map(i => i.category))].map(cat => (
                <React.Fragment key={cat}>
                  <div className="wl-cat-lbl" style={{ position: 'sticky', top: 0 }}>{cat}</div>
                  {filteredAdd.filter(i => i.category === cat).map(inst => (
                    <div
                      key={inst.sym}
                      className="conn-broker-row"
                      style={{ padding: '8px 12px' }}
                      onClick={() => { onAddSymbol(inst.sym); setShowAddModal(false); setAddQuery(''); }}
                    >
                      <div className="conn-broker-logo" style={{ background: 'var(--t)', color: 'var(--g)', border: '1px solid var(--br)', fontSize: 9, fontWeight: 800, width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {inst.sym.slice(0,3)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{inst.sym}</div>
                        <div style={{ fontSize: 10, color: 'var(--nt)' }}>{inst.label} · {inst.category}</div>
                      </div>
                      <i className="ti ti-plus" style={{ marginLeft: 'auto', color: 'var(--g)' }}></i>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              {filteredAdd.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--nt)', fontSize: 13 }}>
                  {watchlist.length === ALL_INSTRUMENTS.length ? 'All symbols are already in your watchlist.' : `No results for "${addQuery}"`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Order Panel ──────────────────────────────────────────────────────────────

function OrderPanel({ sym, prices, onPlace }) {
  const inst = INSTRUMENTS.find(i => i.sym === sym);
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
    onPlace({ sym, type: side === 'buy' ? 'BUY' : 'SELL', lots: parseFloat(lots) || 0.01, open: side === 'buy' ? p.ask : p.bid, sl: parseFloat(sl) || null, tp: parseFloat(tp) || null });
    setFlash(side); setTimeout(() => setFlash(null), 500);
  };

  return (
    <div className="order-panel">
      <div className="op-sym-header">
        <span className="op-sym-name">{sym}</span>
        <span style={{ fontSize: 10, color: 'var(--nt)' }}>{inst.label}</span>
      </div>

      {/* Big buy/sell price display */}
      <div className="op-prices">
        <div className={`op-side op-sell${flash === 'sell' ? ' flash-red' : ''}`}>
          <div className="op-side-lbl">SELL</div>
          <div className="op-side-price dn mono">{bid}</div>
        </div>
        <div className="op-spread-col">
          <div className="op-spread-val mono">{spd}</div>
          <div className="op-spread-lbl">pts</div>
        </div>
        <div className={`op-side op-buy${flash === 'buy' ? ' flash-green' : ''}`}>
          <div className="op-side-lbl">BUY</div>
          <div className="op-side-price up mono">{ask}</div>
        </div>
      </div>

      {/* Order type */}
      <div className="op-toggle-row">
        {['market', 'limit', 'stop'].map(t => (
          <button key={t} className={`op-type-btn${orderType === t ? ' active' : ''}`} onClick={() => setOrderType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Volume */}
      <div className="op-field">
        <label>Volume (lots)</label>
        <div className="op-num-row">
          <button className="op-stepper" onClick={() => setLots(v => Math.max(0.01, +v - 0.01).toFixed(2))}>−</button>
          <input className="op-input mono" value={lots} onChange={e => setLots(e.target.value)} />
          <button className="op-stepper" onClick={() => setLots(v => (+v + 0.01).toFixed(2))}>+</button>
        </div>
      </div>

      {/* Limit/stop price */}
      {(orderType === 'limit' || orderType === 'stop') && (
        <div className="op-field">
          <label>{orderType === 'limit' ? 'Limit' : 'Stop'} Price</label>
          <input className="op-input mono full" value={limitPx} onChange={e => setLimitPx(e.target.value)} placeholder={bid} />
        </div>
      )}

      {/* SL / TP */}
      <div className="op-sl-tp-row">
        <div className="op-field">
          <label className="dn">Stop Loss</label>
          <input className="op-input mono full" value={sl} onChange={e => setSl(e.target.value)} placeholder="0.00" />
        </div>
        <div className="op-field">
          <label className="up">Take Profit</label>
          <input className="op-input mono full" value={tp} onChange={e => setTp(e.target.value)} placeholder="0.00" />
        </div>
      </div>

      {/* Execute */}
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

      <div className="op-info-row">
        <span>Margin: <span className="mono text-gold">${(+lots * inst.price * 0.02).toFixed(2)}</span></span>
        <span>1pt = <span className="mono">${(+lots * 10).toFixed(2)}</span></span>
      </div>
    </div>
  );
}

// ─── Terminal Toolbar ─────────────────────────────────────────────────────────

function Toolbar({ tf, onTf, sym, prices, chartType, onChartType, activeTool, onTool, onClearDrawings }) {
  const inst = INSTRUMENTS.find(i => i.sym === sym);
  const p    = prices[sym];

  const tools = [
    { id: 'cursor',    icon: 'ti-pointer',            title: 'Cursor (Esc)' },
    { id: 'cross',     icon: 'ti-crosshair',          title: 'Crosshair' },
    { id: 'pan',       icon: 'ti-hand-stop',          title: 'Pan / Scroll' },
    { id: 'zoomin',    icon: 'ti-zoom-in',            title: 'Zoom In' },
    { id: 'zoomout',   icon: 'ti-zoom-out',           title: 'Zoom Out' },
    null, // divider
    { id: 'trendline', icon: 'ti-trending-up',        title: 'Trend Line' },
    { id: 'hline',     icon: 'ti-minus',              title: 'Horizontal Line' },
    { id: 'ray',       icon: 'ti-arrow-narrow-right', title: 'Ray' },
    { id: 'fib',       icon: 'ti-wave-sine',          title: 'Fibonacci' },
    { id: 'rect',      icon: 'ti-square',             title: 'Rectangle' },
    { id: 'text',      icon: 'ti-text-size',          title: 'Text Note' },
  ];

  const chartTypes = [
    { id: 'candle', icon: 'ti-chart-candle', title: 'Candlestick' },
    { id: 'bar',    icon: 'ti-chart-bar',    title: 'Bar Chart' },
    { id: 'line',   icon: 'ti-chart-line',   title: 'Line Chart' },
  ];

  // Escape key resets to cursor
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onTool('cursor'); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTool]);

  return (
    <div className="toolbar">
      {/* Instrument info */}
      <div className="tb-sym-block">
        <span className="tb-sym">{sym}</span>
        {p && inst && <>
          <span className={`tb-bid mono ${p.dir === 1 ? 'up' : 'dn'}`}>{p.bid.toFixed(inst.digits)}</span>
          <span className={`tb-chg ${p.changePct >= 0 ? 'up' : 'dn'}`}>
            {p.changePct >= 0 ? '+' : ''}{p.changePct.toFixed(2)}%
          </span>
        </>}
      </div>

      <div className="tb-divider" />

      {/* Timeframes */}
      <div className="tb-tf-group">
        {TIMEFRAMES.map(t => (
          <button key={t} className={`tb-tf${tf === t ? ' active' : ''}`} onClick={() => onTf(t)}>
            {TF_LABEL_MAP[t]}
          </button>
        ))}
      </div>

      <div className="tb-divider" />

      {/* Tools (cursor, pan, zoom, drawing) */}
      <div className="tb-tool-group">
        {tools.map((tool, idx) =>
          tool === null
            ? <div key={`sep-${idx}`} style={{ width: 1, height: 16, background: 'var(--br)', margin: '0 2px' }} />
            : (
              <button
                key={tool.id}
                className={`tb-tool${activeTool === tool.id ? ' active' : ''}`}
                onClick={() => onTool(tool.id)}
                title={tool.title}
              >
                <i className={`ti ${tool.icon}`}></i>
              </button>
            )
        )}
        {/* Clear drawings */}
        <button
          className="tb-tool"
          onClick={onClearDrawings}
          title="Clear All Drawings"
          style={{ opacity: 0.6 }}
        >
          <i className="ti ti-trash"></i>
        </button>
      </div>

      <div className="tb-divider" />

      {/* Chart type */}
      <div className="tb-tool-group">
        {chartTypes.map(ct => (
          <button
            key={ct.id}
            className={`tb-tool${chartType === ct.id ? ' active' : ''}`}
            onClick={() => onChartType(ct.id)}
            title={ct.title}
          >
            <i className={`ti ${ct.icon}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Positions Blotter ────────────────────────────────────────────────────────

function Positions({ positions, prices, onClose, onModify }) {
  const totalPL = positions.reduce((s, p) => s + p.pl, 0);
  return (
    <div className="blotter">
      <div className="blotter-header">
        <span className="blotter-title">
          Positions <span className="pos-badge">{positions.length}</span>
        </span>
        <span className={`blotter-total ${totalPL >= 0 ? 'up' : 'dn'}`}>
          Float P/L: <span className="mono">{totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}</span>
        </span>
      </div>
      <div className="dt-wrap">
        <table className="dt blotter-table">
          <thead>
            <tr>
              <th>#</th><th>Symbol</th><th>Type</th><th>Lots</th>
              <th>Open Price</th><th>S/L</th><th>T/P</th>
              <th>Current</th><th>Pips</th><th>Profit</th><th></th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 && (
              <tr><td colSpan="11" style={{ textAlign: 'center', color: 'var(--nt)', padding: 16 }}>No open positions</td></tr>
            )}
            {positions.map(pos => {
              const lp   = prices[pos.sym];
              const inst = INSTRUMENTS.find(i => i.sym === pos.sym);
              const d    = inst?.digits ?? 2;
              const cur  = lp ? (pos.type === 'BUY' ? lp.bid : lp.ask) : pos.open;
              return (
                <tr key={pos.id}>
                  <td className="mono text-muted" style={{ fontSize: 10 }}>{pos.id}</td>
                  <td style={{ fontWeight: 700 }}>{pos.sym}</td>
                  <td><span className={`badge badge-${pos.type === 'BUY' ? 'green' : 'red'}`}>{pos.type}</span></td>
                  <td className="mono">{pos.lots}</td>
                  <td className="mono">{pos.open.toFixed(d)}</td>
                  <td className="mono dn">{pos.sl ? pos.sl.toFixed(d) : '—'}</td>
                  <td className="mono up">{pos.tp ? pos.tp.toFixed(d) : '—'}</td>
                  <td className={`mono ${pos.type === 'BUY' ? 'up' : 'dn'}`}>{cur.toFixed(d)}</td>
                  <td className={`mono ${pos.pips >= 0 ? 'up' : 'dn'}`}>{pos.pips >= 0 ? '+' : ''}{pos.pips}</td>
                  <td className={`mono ${pos.pl >= 0 ? 'up' : 'dn'}`} style={{ fontWeight: 700 }}>
                    {pos.pl >= 0 ? '+' : ''}${pos.pl.toFixed(2)}
                  </td>
                  <td>
                    <button className="pos-close-btn" onClick={() => onClose(pos.id)} title="Close position">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── App Nav ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { href: '/copy-trading', icon: 'ti-copy',             label: 'Copy Trading' },
  { href: '/hire-trader',  icon: 'ti-users',            label: 'Hire a Trader' },
  { href: '/insights',     icon: 'ti-chart-line',       label: 'Insights' },
  { href: '/marketplace',  icon: 'ti-robot',            label: 'Marketplace', badge: 'NEW' },
  { href: '/terminal',     icon: 'ti-chart-candle',     label: 'Terminal', active: true },
];

function AppNav({ onMenuToggle, session, onConnectClick, onDisconnect }) {
  return (
    <nav className="gnav">
      {/* Hamburger — mobile only */}
      <div className="nav-hamburger nav-hamburger--mobile" onClick={onMenuToggle}><span /><span /><span /></div>

      <a href="/" className="logo">Trade<em>Flow</em></a>
      <span className="term-live-badge">LIVE</span>

      {/* Inline nav links — desktop only */}
      <div className="gnav-links">
        {NAV_LINKS.map(({ href, icon, label, active, badge }) => (
          <a key={label} href={href} className={`gnav-link${active ? ' active' : ''}`}>
            <i className={`ti ${icon}`}></i>
            {label}
            {badge && <span className="gnav-link-badge">{badge}</span>}
          </a>
        ))}
      </div>

      <div className="gnav-right">
        {session ? (
          <>
            <div className="term-session-info">
              <div className="term-sess-broker" style={{ background: session.broker.color }}>
                {session.broker.logo}
              </div>
              <div className="term-sess-details">
                <span className="term-sess-name">{session.broker.name} · <span className={session.accType === 'demo' ? 'text-muted' : 'up'}>{session.accType === 'demo' ? 'DEMO' : 'LIVE'}</span></span>
                <span className="term-sess-bal">
                  Balance: <span className="mono text-gold">${session.balance.toLocaleString()}</span>
                  &nbsp;·&nbsp;
                  Equity: <span className="mono up">${session.equity.toLocaleString()}</span>
                </span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onDisconnect} title="Disconnect">
              <i className="ti ti-plug-x"></i> Disconnect
            </button>
          </>
        ) : (
          <button className={`btn btn-sm${session ? ' btn-connected' : ' btn-gold'}`} onClick={session ? null : onConnectClick} style={session ? { cursor: 'default' } : {}}>
            <i className={`ti ${session ? 'ti-circle-check' : 'ti-plug'}`}></i> &nbsp;{session ? 'Connected' : 'Connect Account'}
          </button>
        )}
        <i className="ti ti-bell nav-icon"></i>
        <div className="sb-av nav-avatar">AK</div>
      </div>
    </nav>
  );
}

function Sidebar({ open, onClose }) {
  const accountLinks = [
    { href: '/payments', icon: 'ti-credit-card',    label: 'Payments' },
    { href: '/profile',  icon: 'ti-user-circle',    label: 'Profile' },
    { href: '/settings', icon: 'ti-settings',       label: 'Settings' },
    { href: '/support',  icon: 'ti-headset',        label: 'Support' },
  ];
  return (
    <>
      <div className={`sidebar-backdrop${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`sidebar${open ? ' open' : ''}`}>
        <div>
          <div className="sb-lbl">Main</div>
          {NAV_LINKS.map(({ href, icon, label, active, badge }) => (
            <a key={label} href={href} className={`sb-item${active ? ' active' : ''}`}>
              <i className={`ti ${icon}`}></i>{label}
              {badge && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: 'var(--g)', color: '#000', padding: '1px 5px', borderRadius: 4 }}>{badge}</span>}
            </a>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="sb-lbl">Account</div>
          {accountLinks.map(({ href, icon, label }) => (
            <a key={label} href={href} className="sb-item"><i className={`ti ${icon}`}></i>{label}</a>
          ))}
        </div>
        <div className="sb-spacer" />
        <div className="sb-user">
          <div className="sb-av">AK</div>
          <div><div className="sb-name">Alex Kim</div><div className="sb-role">Pro · Verified</div></div>
        </div>
      </div>
    </>
  );
}

// ─── Terminal Page ────────────────────────────────────────────────────────────

const Terminal = () => {
  const [session,      setSession]      = useState(null);
  const [showConnect,  setShowConnect]  = useState(false);
  const [selectedSym,  setSelectedSym]  = useState('EURUSD');
  const [tf,           setTf]           = useState('H1');
  const [chartType,    setChartType]    = useState('candle');
  const [positions,    setPositions]    = useState(DEMO_POSITIONS);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [bottomTab,    setBottomTab]    = useState('positions');
  const [orderToast,   setOrderToast]   = useState(null);
  const [watchlist,    setWatchlist]    = useState(DEFAULT_WATCHLIST);
  const [activeTool,   setActiveTool]   = useState('cursor');
  const [drawings,     setDrawings]     = useState([]);

  const prices = useLivePrices();

  const handleAddSymbol    = useCallback(sym => setWatchlist(prev => prev.includes(sym) ? prev : [...prev, sym]), []);
  const handleRemoveSymbol = useCallback(sym => setWatchlist(prev => prev.filter(s => s !== sym)), []);

  const handlePlaceOrder = useCallback(order => {
    setPositions(prev => [{
      id: Date.now(), sym: order.sym, type: order.type,
      lots: order.lots, open: order.open,
      sl: order.sl, tp: order.tp, pl: 0, pips: 0,
    }, ...prev]);
    setOrderToast(`${order.type} ${order.sym} @ ${order.open.toFixed(INSTRUMENTS.find(i => i.sym === order.sym)?.digits || 2)}`);
    setTimeout(() => setOrderToast(null), 2500);
  }, []);

  const handleClosePosition = useCallback(id => {
    setPositions(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleConnected = useCallback(sess => {
    setSession(sess);
    setPositions(sess.accType === 'demo' ? [] : DEMO_POSITIONS);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <AppNav
        onMenuToggle={() => setSidebarOpen(v => !v)}
        session={session}
        onConnectClick={() => setShowConnect(true)}
        onDisconnect={() => { setSession(null); setPositions(DEMO_POSITIONS); }}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Order toast ── */}
      {orderToast && (
        <div className="order-toast">
          <i className="ti ti-check"></i> {orderToast}
        </div>
      )}

      {/* ── Connect modal ── */}
      {showConnect && (
        <ConnectModal
          onClose={() => setShowConnect(false)}
          onConnected={handleConnected}
        />
      )}

      {/* ── Main terminal layout ── */}
      <div className="terminal-shell">

        {/* Left: Watchlist */}
        <div className="term-left">
          <Watchlist prices={prices} selected={selectedSym} onSelect={setSelectedSym} watchlist={watchlist} onAddSymbol={handleAddSymbol} onRemoveSymbol={handleRemoveSymbol} session={session} />
        </div>

        {/* Center: Toolbar + Chart + Blotter */}
        <div className="term-center">
          <Toolbar tf={tf} onTf={setTf} sym={selectedSym} prices={prices} chartType={chartType} onChartType={setChartType}
            activeTool={activeTool} onTool={setActiveTool}
            onClearDrawings={() => setDrawings([])} />

          <div className="chart-area">
            <CandleChart sym={selectedSym} tf={tf}
              activeTool={activeTool}
              drawings={drawings}
              onAddDrawing={d => { setDrawings(prev => [...prev, d]); setActiveTool('cursor'); }}
            />
          </div>

          {/* Bottom tabs */}
          <div className="term-bottom-panel">
            <div className="bp-tabs">
              <button className={`bp-tab${bottomTab === 'positions' ? ' active' : ''}`} onClick={() => setBottomTab('positions')}>
                <i className="ti ti-list"></i> Positions ({positions.length})
              </button>
              <button className={`bp-tab${bottomTab === 'orders' ? ' active' : ''}`} onClick={() => setBottomTab('orders')}>
                <i className="ti ti-clock"></i> Pending Orders (0)
              </button>
              <button className={`bp-tab${bottomTab === 'history' ? ' active' : ''}`} onClick={() => setBottomTab('history')}>
                <i className="ti ti-history"></i> History
              </button>
              <button className={`bp-tab${bottomTab === 'log' ? ' active' : ''}`} onClick={() => setBottomTab('log')}>
                <i className="ti ti-terminal"></i> Journal
              </button>
            </div>
            <div className="bp-content">
              {bottomTab === 'positions' && (
                <Positions positions={positions} prices={prices} onClose={handleClosePosition} />
              )}
              {bottomTab === 'orders' && (
                <div style={{ padding: '20px', color: 'var(--nt)', fontSize: 13, textAlign: 'center' }}>No pending orders</div>
              )}
              {bottomTab === 'history' && (
                <div style={{ padding: '20px', color: 'var(--nt)', fontSize: 13, textAlign: 'center' }}>
                  {session ? 'No closed trades in history' : 'Connect an account to view trade history'}
                </div>
              )}
              {bottomTab === 'log' && (
                <div style={{ padding: '12px 16px', fontFamily: 'var(--fmo)', fontSize: 11, color: 'var(--nt)', lineHeight: 1.8 }}>
                  <div><span style={{ color: 'var(--g)' }}>[{new Date().toLocaleTimeString()}]</span> TradeFlow WebTerminal started</div>
                  <div><span style={{ color: 'var(--g)' }}>[{new Date().toLocaleTimeString()}]</span> Market data feed connected</div>
                  {session && <div><span style={{ color: 'var(--g)' }}>[{new Date().toLocaleTimeString()}]</span> Connected to {session.broker.name} · {session.server.name}</div>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order panel */}
        <div className="term-right">
          <OrderPanel sym={selectedSym} prices={prices} onPlace={handlePlaceOrder} />
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="term-footer">
        <div className="tf-left">
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
          <span>© 2025 TradeFlow Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Terminal;