/* ============================================================
   PerpPilot — Icons, mock data & formatting helpers
   ============================================================ */

/* ---------- Inline SVG icon set (stroke, 1.6) ---------- */
const IC = {
  logo: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 15l5-6 4 4 7-8" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="9" r="1.6" fill="#fff"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3c3 1 5 4 5 8l-2 2-4 0-2-2c0-4 2-7 3-8z"/><path d="M9 13l-3 1 1 3 3-1M15 13l3 1-1 3-3-1" stroke-linejoin="round"/><circle cx="12" cy="8" r="1.3"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16v11H9l-4 3v-3H4z" stroke-linejoin="round"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12l16-8-6 16-3-6-7-2z" stroke-linejoin="round"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7L4 9"/><path d="M4 5v4h4M12 8v4l3 2" stroke-linecap="round"/></svg>',
  branch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 8.2v7.6M8.2 6.4C13 6.8 15.8 7 15.8 9.6"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>',
  chevD: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke-linecap="round"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 14.5A8 8 0 019.5 4a7 7 0 108.5 10.5z" stroke-linejoin="round"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  position: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 18l5-5 3 3 8-8"/><path d="M15 8h5v5"/></svg>',
  funding: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 1.6-2.5 1.6-2.5.6-2.5 1.8 1.1 2 2.5 2 2.5-.9 2.5-2"/></svg>',
  liquidation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13 2L5 13h6l-1 9 8-12h-6l1-8z" stroke-linejoin="round"/></svg>',
  planner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l1.9 4.6 4.9.4-3.7 3.2 1.1 4.8L12 13.9 7.8 16l1.1-4.8L5.2 8l4.9-.4L12 3z" stroke-linejoin="round"/></svg>',
  journal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h11l3 3v13H5z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
  review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',
  learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke-linejoin="round"/><path d="M7 9.5V15c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9.5"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" stroke-linecap="round"/></svg>',
  wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 18L16 8M14 5l1 1M19 10l1 1M18 4l.5.5M8 15l.5.5" stroke-linecap="round"/><circle cx="18.5" cy="7.5" r="1"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5" stroke-linecap="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M18 8a6 6 0 10-12 0c0 7-2 8-2 8h16s-2-1-2-8"/><path d="M10.5 20a2 2 0 003 0"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 00-2-1.2L16 2h-4l-.6 2.5a7 7 0 00-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2 1.2L12 22h4"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 10h18M17 14.5h.01"/></svg>',
  pnl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 18l4-5 3 2 5-7"/><circle cx="19" cy="6" r="1.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2" stroke-linecap="round"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l9 5-9 5-9-5 9-5z" stroke-linejoin="round"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 15a8 8 0 1116 0"/><path d="M12 15l4-4" stroke-linecap="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke-linejoin="round"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v18M7 21h10M5 7l14-2M5 7l-2.5 6a3 3 0 005 0L5 7zM19 5l2.5 6a3 3 0 01-5 0L19 5z" stroke-linejoin="round"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3c1 3-1 4-1 6a3 3 0 006 0c0 4-2.5 6-2.5 6M12 3c-1 4-6 5-6 10a6 6 0 0012 0" stroke-linejoin="round"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.5 4.5L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l9 16H3l9-16z" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke-linecap="round"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01" stroke-linecap="round"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 17l6-6 4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 6h4v4"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3s6 6 6 10a6 6 0 01-12 0c0-4 6-10 6-10z" stroke-linejoin="round"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13 2L5 13h6l-1 9 8-12h-6l1-8z" stroke-linejoin="round"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5c0-1 1-2 3-2h5v17H7c-2 0-3 1-3 1V5z"/><path d="M20 5c0-1-1-2-3-2h-5v17h5c2 0 3 1 3 1V5z"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12h4l3 8 4-16 3 8h4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 0V4a3 3 0 00-3 0z"/><path d="M15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5"/></svg>',
};

/* ---------- Number formatting ---------- */
const fmtUSD = (n, dec = 2) => (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtSigned = (n, dec = 2) => (n >= 0 ? '+$' : '-$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtNum = (n, dec = 2) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtPct = (n, dec = 2) => (n >= 0 ? '+' : '') + n.toFixed(dec) + '%';
const fmtCompact = (n) => { const a = Math.abs(n); if (a >= 1e9) return (n/1e9).toFixed(2)+'B'; if (a >= 1e6) return (n/1e6).toFixed(2)+'M'; if (a >= 1e3) return (n/1e3).toFixed(1)+'K'; return n.toFixed(0); };

/* ---------- Risk color scale (0 = safe, 100 = critical) ---------- */
function riskColor(score) {
  if (score < 34) return 'var(--risk-low)';
  if (score < 67) return 'var(--risk-mid)';
  return 'var(--risk-high)';
}
function riskLabel(score) {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 70) return 'Elevated';
  if (score < 85) return 'High';
  return 'Critical';
}

/* ---------- Sparkline generator (returns inline SVG) ---------- */
function sparkline(points, color, w = 92, h = 30, fill = true) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const pts = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L${w} ${h} L0 ${h} Z`;
  const id = 'sg' + Math.random().toString(36).slice(2, 7);
  return `<svg class="kpi-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    ${fill ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#${id})"/>` : ''}
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/* random-ish but stable trend series */
const S = (base, vol, n = 24, up = true) => {
  let v = base, out = [];
  for (let i = 0; i < n; i++) { v += (Math.sin(i * 1.7) + (up ? 0.35 : -0.35)) * vol + (Math.random() - 0.5) * vol; out.push(v); }
  return out;
};

/* ============================================================
   Mock portfolio / market data
   ============================================================ */
let PORTFOLIO = {
  value: 248910.44,
  todayPnl: 4820.19, todayPnlPct: 1.98,
  unrealized: 12408.60, unrealizedPct: 5.24,
  fundingPaid: -1842.33,
  openPositions: 6,
  avgLeverage: 8.4,
  liqDistance: 18.2,
  riskScore: 62,
};

let MARKET = {
  btcFunding: 0.0182, btcFundingTrend: 'up',
  ethFunding: 0.0119,
  openInterest: 41.28e9, oiChange: 6.4,
  fearGreed: 72, fearGreedLabel: 'Greed',
  longRatio: 63, shortRatio: 37,
  nextFundingMin: 42,
};

let POSITIONS = [
  { id:'btc', sym:'BTC', name:'Bitcoin Perp', cls:'coin-btc', dir:'long', lev:5, entry:61240, mark:63910, size:184200, pnl:8032.40, pnlPct:4.36, funding:-642.10, liq:52180, risk:38, rec:'hold', recTxt:'Hold', margin:36840, mmr:0.5, index:63888, sparkUp:true },
  { id:'eth', sym:'ETH', name:'Ethereum Perp', cls:'coin-eth', dir:'long', lev:8, entry:2985, mark:3122, size:96400, pnl:4420.10, pnlPct:4.59, funding:-388.40, liq:2712, risk:52, rec:'trim', recTxt:'Take profit', margin:12050, mmr:0.5, index:3120, sparkUp:true },
  { id:'sol', sym:'SOL', name:'Solana Perp', cls:'coin-sol', dir:'long', lev:12, entry:172.40, mark:158.90, size:58200, pnl:-4552.30, pnlPct:-7.83, funding:-512.80, liq:151.20, risk:84, rec:'reduce', recTxt:'Reduce risk', margin:4850, mmr:0.5, index:159.10, sparkUp:false },
  { id:'arb', sym:'ARB', name:'Arbitrum Perp', cls:'coin-arb', dir:'short', lev:6, entry:1.184, mark:1.121, size:31200, pnl:1658.20, pnlPct:5.32, funding:118.60, liq:1.362, risk:29, rec:'hold', recTxt:'Hold', margin:5200, mmr:0.6, index:1.122, sparkUp:false },
  { id:'avax', sym:'AVAX', name:'Avalanche Perp', cls:'coin-avax', dir:'long', lev:10, entry:38.20, mark:36.85, size:22400, pnl:-822.40, pnlPct:-3.53, funding:-96.20, liq:34.90, risk:68, rec:'margin', recTxt:'Add margin', margin:2240, mmr:0.6, index:36.90, sparkUp:false },
  { id:'doge', sym:'DOGE', name:'Dogecoin Perp', cls:'coin-doge', dir:'short', lev:7, entry:0.1642, mark:0.1588, size:14800, pnl:486.40, pnlPct:3.29, funding:74.30, liq:0.1848, risk:34, rec:'hold', recTxt:'Hold', margin:2114, mmr:0.6, index:0.1590, sparkUp:false },
];

/* ---------- Demo snapshots (to restore after a live session) ---------- */
const DEMO_PORTFOLIO = PORTFOLIO, DEMO_MARKET = MARKET, DEMO_POSITIONS = POSITIONS;

/* ============================================================
   LIVE — read-only Hyperliquid connection (no keys, on-chain)
   ============================================================ */
const HL_API = 'https://api.hyperliquid.xyz/info';
const COIN_CLASS = { BTC:'coin-btc', ETH:'coin-eth', SOL:'coin-sol', ARB:'coin-arb', AVAX:'coin-avax', DOGE:'coin-doge' };
const coinClass = (s) => COIN_CLASS[s] || 'coin-generic';

async function fetchHL(address) {
  const post = (body) => fetch(HL_API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  const [state, metaCtx] = await Promise.all([
    post({ type:'clearinghouseState', user: address }),
    post({ type:'metaAndAssetCtxs' }),
  ]);
  const meta = metaCtx[0], ctxs = metaCtx[1], ctxByCoin = {};
  meta.universe.forEach((u, i) => { ctxByCoin[u.name] = ctxs[i]; });

  const aps = state.assetPositions || [];
  const accountValue = +(state.marginSummary?.accountValue || 0);
  if (!aps.length) return { empty: true, accountValue };

  const positions = aps.map(ap => {
    const p = ap.position, coin = p.coin, ctx = ctxByCoin[coin] || {};
    const szi = +p.szi, dir = szi >= 0 ? 'long' : 'short';
    const mark = +(ctx.markPx || p.entryPx), index = +(ctx.oraclePx || mark), prev = +(ctx.prevDayPx || mark);
    const entry = +p.entryPx, size = Math.abs(+p.positionValue), pnl = +p.unrealizedPnl;
    const lev = p.leverage?.value || 1;
    const liq = p.liquidationPx != null ? +p.liquidationPx : null;
    const margin = +p.marginUsed;
    const roe = +(p.returnOnEquity || 0) * 100;
    const funding = -(+(p.cumFunding?.sinceOpen || 0));          // positive cumFunding = paid → show negative
    const dist = liq ? Math.abs(mark - liq) / mark : 1;
    const risk = Math.round(Math.min(100, Math.max(6, (1 - Math.min(dist, 0.25) / 0.25) * 68 + lev * 0.9)));
    const rec = risk >= 80 ? 'reduce' : risk >= 62 ? 'trim' : risk >= 50 ? 'margin' : 'hold';
    const recTxt = { reduce:'Reduce risk', trim:'Take profit', margin:'Add margin', hold:'Hold' }[rec];
    return { id: coin.toLowerCase(), sym: coin, name: coin + '-PERP', cls: coinClass(coin), dir, lev,
      entry, mark, size, pnl, pnlPct: roe, funding, liq: liq || mark, hasLiq: liq != null, risk, rec, recTxt, margin, mmr: 0.5, index,
      sparkUp: pnl >= 0, dayPnl: szi * (mark - prev), lclass: p.leverage?.type || 'cross' };
  });

  const sum = (f) => positions.reduce((s, p) => s + f(p), 0);
  const notional = sum(p => p.size) || 1;
  const unrealized = sum(p => p.pnl);
  const portfolio = {
    value: accountValue, todayPnl: sum(p => p.dayPnl),
    todayPnlPct: accountValue ? sum(p => p.dayPnl) / accountValue * 100 : 0,
    unrealized, unrealizedPct: (accountValue - unrealized) ? unrealized / (accountValue - unrealized) * 100 : 0,
    fundingPaid: sum(p => Math.min(0, p.funding)),
    openPositions: positions.length,
    avgLeverage: +(sum(p => p.lev * p.size) / notional).toFixed(1),
    liqDistance: +(Math.min(...positions.filter(p => p.hasLiq).map(p => Math.abs(p.mark - p.liq) / p.mark * 100), 100)).toFixed(1),
    riskScore: Math.round(sum(p => p.risk * p.size) / notional),
  };

  const b = ctxByCoin.BTC || {}, e = ctxByCoin.ETH || {};
  const totalOI = meta.universe.reduce((s, u, i) => s + (+(ctxs[i]?.openInterest || 0)) * (+(ctxs[i]?.markPx || 0)), 0);
  const market = {
    btcFunding: +(((+b.funding || 0)) * 100).toFixed(4), btcFundingTrend: 'up',
    ethFunding: +(((+e.funding || 0)) * 100).toFixed(4),
    openInterest: totalOI, oiChange: 0,
    fearGreed: DEMO_MARKET.fearGreed, fearGreedLabel: DEMO_MARKET.fearGreedLabel,
    longRatio: DEMO_MARKET.longRatio, shortRatio: DEMO_MARKET.shortRatio,
    nextFundingMin: 60 - new Date().getUTCMinutes(),
  };
  return { positions, portfolio, market, accountValue };
}

const AI_INSIGHTS = [
  { ic:'flame', tone:'warn', title:'BTC funding at 3-week high', body:'<b>BTC funding</b> reached <b>+0.0182%</b> (0.055% / 8h), its highest in three weeks. Longs are paying shorts — holding costs are rising.', t:'12 min ago' },
  { ic:'trend', tone:'info', title:'ETH open interest expanding', body:'<b>ETH Open Interest</b> increased <b>14%</b> in 24h to $8.2B. Rising OI with rising price signals genuine leverage inflow, not a squeeze.', t:'38 min ago' },
  { ic:'alert', tone:'neg', title:'SOL position risk rising', body:'Your <b>SOL</b> position became significantly riskier — realized volatility jumped and price is <b>4.9%</b> from liquidation.', t:'1 hr ago' },
  { ic:'droplet', tone:'accent', title:'Crowded long positioning', body:'Aggregate <b>long/short ratio</b> hit 63/37. Crowded longs raise the risk of a long-squeeze if funding stays elevated.', t:'2 hr ago' },
];

const SUGGESTED_ACTIONS = [
  { ic:'gauge', title:'Reduce SOL leverage 12× → 6×', desc:'Halves liquidation sensitivity on your riskiest position', impact:'-31', unit:'risk' },
  { ic:'shield', title:'Add $3,000 margin to AVAX', desc:'Pushes liquidation from $34.90 to $31.20', impact:'-18', unit:'risk' },
  { ic:'pnl', title:'Take 25% profit on ETH', desc:'Locks $1,105 and lowers funding drag', impact:'+1.1k', unit:'realized' },
  { ic:'clock', title:'Delay new BTC entry ~5h', desc:'Wait for next funding reset before adding', impact:'-0.05%', unit:'cost' },
];
