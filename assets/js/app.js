/* ============================================================
   PerpPilot — App shell, routing & screens
   ============================================================ */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

/* ---------- Navigation model ---------- */
const NAV = {
  main: [
    { id:'dashboard', label:'Dashboard', ic:'dashboard', crumb:'Dashboard' },
    { id:'position', label:'Positions', ic:'position', crumb:'Positions / SOL-PERP' },
  ],
  sim: [
    { id:'funding', label:'Funding Lab', ic:'funding', crumb:'Funding Lab' },
    { id:'liquidation', label:'Liquidation Lab', ic:'liquidation', crumb:'Liquidation Lab' },
    { id:'planner', label:'AI Trade Planner', ic:'planner', crumb:'AI Trade Planner' },
  ],
  reflect: [
    { id:'journal', label:'Trade Journal', ic:'journal', crumb:'Trade Journal' },
    { id:'review', label:'Trade Review', ic:'review', crumb:'Trade Review' },
    { id:'learn', label:'Academy', ic:'learn', crumb:'Academy' },
  ],
};

let CURRENT = 'dashboard';

/* ---------- Boot ---------- */
function boot() {
  $('#logo').innerHTML = IC.logo;
  $('#search-ic').innerHTML = IC.search;
  $('#bell').innerHTML = IC.bell;
  $('#gear').innerHTML = IC.settings;

  // Theme (light / dark) — persisted, defaults to system preference
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('pp-theme', t);
    $('#themeBtn').innerHTML = t === 'light' ? IC.moon : IC.sun;
  };
  // Brand default is the dark terminal; honour a saved preference if the user has toggled.
  applyTheme(localStorage.getItem('pp-theme') || 'dark');
  $('#themeBtn').addEventListener('click', () =>
    applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));

  const build = (arr, mount) => {
    const nav = $(mount);
    arr.forEach(item => {
      const node = el(`<div class="nav-item" data-route="${item.id}">${IC[item.ic]}<span>${item.label}</span></div>`);
      node.addEventListener('click', () => go(item.id));
      nav.appendChild(node);
    });
  };
  build(NAV.main, '#nav-main');
  build(NAV.sim, '#nav-sim');
  build(NAV.reflect, '#nav-reflect');

  go('dashboard');
}

function go(route) {
  CURRENT = route;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.route === route));
  const view = $('#view');
  view.innerHTML = '';
  view.scrollTop = 0;
  (SCREENS[route] || SCREENS.dashboard)(view);
  $('.content').scrollTop = 0;
}

const SCREENS = {};

/* ============================================================
   Small render helpers
   ============================================================ */
function kpiCard({ label, ic, val, delta, deltaTone, spark, sparkColor, foot }) {
  return `<div class="kpi">
    <div class="kpi-top">
      <span class="kpi-label">${label}</span>
      <span class="kpi-ic">${IC[ic]}</span>
    </div>
    <div class="kpi-val">${val}</div>
    <div class="kpi-foot">
      <span class="kpi-delta ${deltaTone||''}">${delta||''}</span>
      ${spark ? sparkline(spark, sparkColor) : (foot||'')}
    </div>
  </div>`;
}

function riskDonut(score, size = 92) {
  const r = size/2 - 8, c = 2 * Math.PI * r, off = c * (1 - score/100);
  const col = riskColor(score);
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--bg-elevated)" stroke-width="7"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${off}" style="transition:stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)"/>
    </svg>
    <div class="ring-label">
      <div style="font-family:var(--font-mono);font-size:${size*0.26}px;font-weight:680;letter-spacing:-0.03em;color:${col}">${score}</div>
      <div style="font-size:9.5px;color:var(--text-lo);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-top:1px">${riskLabel(score)}</div>
    </div>
  </div>`;
}

function recBadge(rec, txt) {
  const map = {
    hold:   `<span class="airec" style="color:var(--text-mid)">${IC.check} ${txt}</span>`,
    trim:   `<span class="airec" style="color:var(--pos)">${IC.pnl} ${txt}</span>`,
    reduce: `<span class="airec" style="color:var(--neg)">${IC.arrowDown} ${txt}</span>`,
    margin: `<span class="airec" style="color:var(--warn)">${IC.shield} ${txt}</span>`,
  };
  return map[rec] || map.hold;
}

/* Traffic-light recommendation (Hold 🟢 / Reduce 🟠 / Close 🔴) */
function recDot(kind, txt) {
  const m = { hold:['rec-hold','Hold'], reduce:['rec-reduce','Reduce'], close:['rec-close','Close'], add:['rec-add','Add'] };
  const [cls, def] = m[kind] || m.hold;
  return `<span class="rec-dot ${cls}"><span class="d"></span>${txt || def}</span>`;
}

/* Confidence bar */
function confBar(pct) {
  return `<div class="conf"><div class="conf-track"><div class="conf-fill" style="width:${pct}%"></div></div><span class="conf-num">${pct}%</span></div>`;
}

/* Ask-AI input with suggestion chips + canned answers */
let askSeq = 0;
function askAI(id, placeholder, chips, answers) {
  const cid = 'ask' + (askSeq++);
  window['__ans_' + cid] = answers;
  const chipHtml = chips.map(c => `<span class="ai-chip" onclick="answerAI('${cid}','${c.replace(/'/g,"\\'")}')">${c}</span>`).join('');
  return `<div class="ask-ai">
      <span>${IC.sparkles}</span>
      <input id="${cid}_in" placeholder="${placeholder}" onkeydown="if(event.key==='Enter')answerAI('${cid}', this.value)">
      <button class="send-btn" onclick="answerAI('${cid}', document.getElementById('${cid}_in').value)">${IC.send}</button>
    </div>
    <div class="ai-chip-row">${chipHtml}</div>
    <div id="${cid}_out"></div>`;
}
window.answerAI = (cid, q) => {
  const answers = window['__ans_' + cid] || {};
  // fuzzy match a canned answer by keyword, else default
  let body = answers.__default || 'Let me analyze that against your live positions and the current oracle state…';
  const ql = (q || '').toLowerCase();
  for (const key in answers) {
    if (key === '__default') continue;
    if (ql.includes(key.toLowerCase())) { body = answers[key]; break; }
  }
  const out = document.getElementById(cid + '_out');
  if (out) out.innerHTML = `<div class="ai-answer"><div class="ai-orb">${IC.sparkles}</div><p>${body}</p></div>`;
  const inp = document.getElementById(cid + '_in'); if (inp && q) inp.value = q;
};

/* Decision history */
function decisionHistory(items) {
  return items.map(d => {
    const tagMap = { good:['var(--pos-soft)','var(--pos)'], bad:['var(--neg-soft)','var(--neg)'], warn:['var(--warn-soft)','var(--warn)'] };
    const [bg, fg] = tagMap[d.outcomeTone];
    return `<div class="dh-item">
      <div class="dh-day">${d.day}</div>
      <div class="dh-body">
        <div class="dh-rec">${d.rec}</div>
        <div class="dh-flow">${d.action} <span style="color:var(--text-faint)">→</span> ${d.followed} <span style="color:var(--text-faint)">→</span> <span class="dh-tag" style="background:${bg};color:${fg}">${d.result}</span></div>
      </div>
    </div>`;
  }).join('');
}

/* PM Insight card — product-thinking signal for the interviewer */
function pmInsight({ problem, hypothesis, metric, metricVal }) {
  return `<div class="pm-insight">
    <div class="pmi-head">${IC.cpu} PM Insight · why this screen exists</div>
    <div class="pmi-flow">
      <div class="pmi-step"><div class="pmi-k">Problem</div><div class="pmi-v">${problem}</div></div>
      <div class="pmi-step"><div class="pmi-k">Hypothesis</div><div class="pmi-v">${hypothesis}</div></div>
      <div class="pmi-step pmi-metric"><div class="pmi-k" style="text-align:center">Success metric</div><div class="m-big">${metricVal}</div><div class="m-lbl">${metric}</div></div>
    </div>
  </div>`;
}

/* Live semicircle gauge (returns SVG markup; update via id) */
function semiGauge(pct, label, color, size = 190, id = '') {
  const w = size, h = size * 0.62, sw = 13;
  const cx = w/2, cy = h - 6, r = w/2 - sw;
  const arc = Math.PI * r;
  const off = arc * (1 - Math.max(0, Math.min(100, pct))/100);
  const theta = Math.PI * (pct/100);
  const kx = cx - r*Math.cos(theta), ky = cy - r*Math.sin(theta);
  const bg = `M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`;
  return `<div class="semi-gauge" style="width:${w}px;height:${h+14}px"${id?` id="${id}"`:''}>
    <svg width="${w}" height="${h+8}" viewBox="0 0 ${w} ${h+8}">
      <path d="${bg}" fill="none" stroke="var(--bg-elevated)" stroke-width="${sw}" stroke-linecap="round"/>
      <path class="sg-fill" d="${bg}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${arc}" stroke-dashoffset="${off}"/>
      <circle class="sg-knob" cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="7" fill="#0A0C0F" stroke="${color}" stroke-width="3"/>
    </svg>
    <div class="sg-center"><div class="sg-val" style="color:${color}">${typeof pct==='number'?pct.toFixed(1):pct}%</div><div class="sg-lbl">${label}</div></div>
  </div>`;
}

/* ============================================================
   SCREEN 1 — DASHBOARD
   ============================================================ */
SCREENS.dashboard = (view) => {
  const p = PORTFOLIO, m = MARKET;

  const hero = `<div class="hero"><div class="hero-grid">
    <div>
      <div class="eyebrow">${IC.sparkles}<span>AI Morning Briefing · ${new Date().toLocaleDateString('en-US',{weekday:'long', month:'short', day:'numeric'})}</span></div>
      <h1>Good morning, Elif.</h1>
      <div class="flow">
        <div class="flow-step"><div class="fs-lbl">AI analyzed</div><div class="fs-val">6 positions</div><div class="fs-sub">$407.2K notional</div></div>
        <div class="flow-step"><div class="fs-lbl">Require attention</div><div class="fs-val" style="color:var(--warn)">2 positions</div><div class="fs-sub">SOL · AVAX</div></div>
        <div class="flow-step"><div class="fs-lbl">Funding today</div><div class="fs-val neg">−$84.20</div><div class="fs-sub">est. net carry</div></div>
        <div class="flow-step"><div class="fs-lbl">Highest risk</div><div class="fs-val" style="color:var(--neg)">SOL Long</div><div class="fs-sub">risk 84 · 4.9% to liq</div></div>
      </div>
      <div class="flow-cta" style="margin-top:18px">
        <span class="ai-orb">${IC.wand}</span>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13.5px;margin-bottom:2px">Recommended action</div>
          <div style="font-size:12.5px;color:var(--text-mid)">Reduce <b>SOL</b> leverage <b>12× → 6×</b> before the next funding settles in <b id="heroClock" class="mono">00:42:00</b>.</div>
          <div style="max-width:210px;margin-top:8px">${confBar(93)}</div>
        </div>
        <div class="hero-actions" style="flex-direction:column;gap:8px">
          <button class="btn btn-primary" onclick="go('position')">${IC.gauge} Review Risk</button>
          <button class="btn btn-ghost btn-sm" onclick="go('funding')">${IC.funding} Funding Sim</button>
        </div>
      </div>
    </div>
    <div class="risk-gauge">
      ${riskDonut(p.riskScore, 118)}
      <div class="gauge-label">Portfolio Risk</div>
    </div>
  </div></div>`;

  const kpis = `<div class="kpi-grid">
    ${kpiCard({ label:'Total Portfolio Value', ic:'wallet', val:fmtUSD(p.value), delta:fmtPct(p.todayPnlPct), deltaTone:'pos', spark:S(240,4,24,true), sparkColor:'var(--pos)' })}
    ${kpiCard({ label:"Today's PnL", ic:'activity', val:fmtSigned(p.todayPnl), delta:'vs. yesterday', deltaTone:'muted', spark:S(2,1.4,24,true), sparkColor:'var(--pos)' })}
    ${kpiCard({ label:'Unrealized PnL', ic:'pnl', val:fmtSigned(p.unrealized), delta:fmtPct(p.unrealizedPct), deltaTone:'pos', spark:S(8,2,24,true), sparkColor:'var(--pos)' })}
    ${kpiCard({ label:'Total Funding Paid', ic:'funding', val:fmtSigned(p.fundingPaid), delta:'30-day', deltaTone:'muted', spark:S(-1,0.5,24,false), sparkColor:'var(--neg)' })}
    ${kpiCard({ label:'Open Positions', ic:'layers', val:String(p.openPositions), delta:'4 long · 2 short', deltaTone:'muted', foot:`<span class="badge badge-neutral">3 markets hot</span>` })}
    ${kpiCard({ label:'Average Leverage', ic:'gauge', val:p.avgLeverage.toFixed(1)+'×', delta:'target ≤ 6×', deltaTone:'warn', foot:`<span class="badge badge-warn">${IC.alert} Above target</span>` })}
    ${kpiCard({ label:'Liquidation Distance', ic:'shield', val:p.liqDistance.toFixed(1)+'%', delta:'nearest: SOL 4.9%', deltaTone:'neg', foot:`<span class="badge badge-neg">Tight</span>` })}
    ${kpiCard({ label:'Overall Risk Score', ic:'target', val:String(p.riskScore), delta:riskLabel(p.riskScore), deltaTone:'warn', foot:`<div class="riskbar" style="width:88px"><i style="width:${p.riskScore}%;background:${riskColor(p.riskScore)}"></i></div>` })}
  </div>`;

  const market = `<div class="section-title">${IC.activity} Market Snapshot</div>
  <div class="market-strip">
    <div class="market-cell">
      <div class="mc-label">${IC.funding} BTC Funding</div>
      <div class="mc-val pos">+0.0182%</div>
      <div class="mc-sub badge badge-warn" style="margin-top:6px">3-week high</div>
    </div>
    <div class="market-cell">
      <div class="mc-label">${IC.funding} ETH Funding</div>
      <div class="mc-val pos">+0.0119%</div>
      <div class="mc-sub muted">0.036% / 8h</div>
    </div>
    <div class="market-cell">
      <div class="mc-label">${IC.layers} Open Interest</div>
      <div class="mc-val">$${fmtCompact(m.openInterest)}</div>
      <div class="mc-sub pos">▲ ${m.oiChange}% · 24h</div>
    </div>
    <div class="market-cell">
      <div class="mc-label">${IC.gauge} Fear & Greed</div>
      <div class="mc-val" style="color:var(--pos)">${m.fearGreed} <span style="font-size:12px;color:var(--text-lo);font-weight:500">${m.fearGreedLabel}</span></div>
      <div class="fg-track"><div class="fg-knob" style="left:${m.fearGreed}%"></div></div>
    </div>
    <div class="market-cell">
      <div class="mc-label">${IC.scale} Long / Short</div>
      <div class="mc-val">${m.longRatio}<span style="color:var(--text-faint)"> / </span>${m.shortRatio}</div>
      <div class="ls-bar"><div class="ls-long" style="width:${m.longRatio}%"></div><div class="ls-short" style="width:${m.shortRatio}%"></div></div>
    </div>
    <div class="market-cell">
      <div class="mc-label">${IC.clock} Next Funding</div>
      <div class="mc-val" id="fundClock">00:42:00</div>
      <div class="mc-sub muted">settles in ${m.nextFundingMin}m</div>
    </div>
    <div class="market-cell">
      <div class="mc-label">${IC.flame} Highest Funding</div>
      <div class="mc-val" style="font-size:14px">WIF <span class="pos">+0.09%</span></div>
      <div class="mc-sub muted">then TIA · PEPE</div>
    </div>
  </div>`;

  const rows = POSITIONS.map(pos => `<tr onclick="go('position')">
    <td><div class="asset-cell"><div class="coin ${pos.cls}">${pos.sym.slice(0,3)}</div><div><div class="a-sym">${pos.sym}</div><div class="a-name">Perp · Cross</div></div></div></td>
    <td>${pos.dir==='long'?`<span class="pill-long">${IC.arrowUp}Long</span>`:`<span class="pill-short">${IC.arrowDown}Short</span>`}</td>
    <td class="mono">${pos.lev}×</td>
    <td class="mono">${fmtNum(pos.entry, pos.entry<10?4:2)}</td>
    <td class="mono">${fmtNum(pos.mark, pos.mark<10?4:2)}</td>
    <td class="mono ${pos.pnl>=0?'pos':'neg'}">${fmtSigned(pos.pnl,0)}<div style="font-size:11px;font-weight:500">${fmtPct(pos.pnlPct)}</div></td>
    <td class="mono ${pos.funding>=0?'pos':'neg'}">${fmtSigned(pos.funding,0)}</td>
    <td class="mono">${fmtNum(pos.liq, pos.liq<10?4:2)}</td>
    <td><div class="riskmeter"><div class="riskbar"><i style="width:${pos.risk}%;background:${riskColor(pos.risk)}"></i></div><span class="risk-num" style="color:${riskColor(pos.risk)}">${pos.risk}</span></div></td>
    <td>${({hold:recDot('hold','Hold'),trim:recDot('reduce','Take profit'),reduce:recDot('close','Reduce'),margin:recDot('add','Add margin')})[pos.rec]}</td>
  </tr>`).join('');

  const table = `<div class="card">
    <div class="card-head">
      <h3>${IC.position} Active Positions <span class="sub">6 open · $407.2K notional</span></h3>
      <div class="chips"><span class="chip active">All</span><span class="chip">Long</span><span class="chip">Short</span><span class="chip">At risk</span></div>
    </div>
    <div class="table-wrap"><table class="grid">
      <thead><tr>
        <th>Asset</th><th>Direction</th><th>Lev</th><th>Entry</th><th>Mark</th><th>PnL</th><th>Funding</th><th>Liq. Price</th><th>Risk</th><th>AI Rec.</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>`;

  /* Right rail */
  const insights = AI_INSIGHTS.map(i => {
    const toneMap = { warn:['var(--warn-soft)','var(--warn)'], info:['var(--info-soft)','var(--info)'], neg:['var(--neg-soft)','var(--neg)'], accent:['var(--accent-soft)','var(--accent)'] };
    const [bg, fg] = toneMap[i.tone];
    return `<div class="insight">
      <div class="insight-ic" style="background:${bg};color:${fg}">${IC[i.ic]}</div>
      <div><p>${i.body}</p><div class="t">${i.t}</div></div>
    </div>`;
  }).join('');

  const actions = SUGGESTED_ACTIONS.map(a => `<div class="action-row">
    <div class="action-ic">${IC[a.ic]}</div>
    <div><div class="a-title">${a.title}</div><div class="a-desc">${a.desc}</div></div>
    <div class="impact"><div class="imp-val" style="color:${a.unit==='cost'?'var(--pos)':a.unit==='realized'?'var(--pos)':'var(--pos)'}">${a.impact}</div><div class="imp-lbl">${a.unit}</div></div>
  </div>`).join('');

  const dashAnswers = {
    'risk': 'Your portfolio risk rose <b>54 → 62</b> today. <b>78%</b> of that increase comes from your <b>SOL</b> long: realized volatility jumped to 84% and price is now <b>4.9%</b> from liquidation. Elevated funding on BTC/ETH adds the rest. Reducing SOL leverage 12×→6× would bring the portfolio back to <b>~48</b>.',
    'funding': 'You are <b>net paying</b> funding today — about <b>−$84</b>. The biggest drains are SOL (−$32) and ETH (−$28), both crowded longs. Your ARB & DOGE shorts <b>earn</b> funding, offsetting ~$18.',
    'sol': 'SOL is your riskiest position (score <b>84</b>). At 12× leverage the liquidation buffer is only <b>4.9%</b>, and 30-day vol of 84% can erase that in a single session. I recommend reducing leverage to 6× or trimming 40% of size.',
    'liquid': 'Your nearest liquidation is <b>SOL at $151.20</b> — 4.9% away. AVAX is next at 5.4%. No other position is within 10% of liquidation.',
    '__default': 'I can explain your risk, funding, liquidation distances, or any position. Try “Why is my risk increasing?” or “Which position is closest to liquidation?”'
  };

  const askPanel = `<div class="ai-panel mb-22">
    <div class="ai-head"><div class="ai-orb">${IC.chat}</div><div><h3>Ask PerpPilot</h3><div class="sub">Grounded in your live positions — ask anything about your book</div></div></div>
    <div class="card-pad">${askAI('dash', 'Why is my risk increasing?', ['Why is my risk increasing?','What am I paying in funding?','Closest to liquidation?'], dashAnswers)}</div>
  </div>`;

  const insightsPanel = `<div class="ai-panel">
    <div class="ai-head"><div class="ai-orb">${IC.sparkles}</div><div><h3>Today's AI Insights</h3><div class="sub">4 signals · updated 12m ago</div></div></div>
    ${insights}
  </div>`;

  const actionsCard = `<div class="card">
    <div class="card-head"><h3>${IC.wand} Suggested Actions</h3><span class="sub">Ranked by impact</span></div>
    <div class="card-pad">${actions}
      <div class="explain" style="margin-top:4px"><div class="ai-orb">${IC.sparkles}</div><p>Applying the top two actions lowers <b>portfolio risk 62 → 38</b> and reduces daily funding drag by <b>~$140</b>.</p></div>
    </div>
  </div>`;

  const decisionCard = `<div class="card">
    <div class="card-head"><h3>${IC.history} Decision History</h3><span class="sub">AI recall</span></div>
    <div class="card-pad">${decisionHistory([
      { day:'Today', rec:'Reduce SOL leverage 12× → 6×', action:'Suggested', followed:'Pending', result:'Open', outcomeTone:'warn' },
      { day:'Yesterday', rec:'Reduce ETH leverage before funding', action:'Suggested', followed:'Ignored', result:'−$542 funding drag', outcomeTone:'bad' },
      { day:'2d ago', rec:'Add margin to AVAX', action:'Suggested', followed:'Followed', result:'Avoided liquidation', outcomeTone:'good' },
      { day:'3d ago', rec:'Take partial profit on BTC', action:'Suggested', followed:'Followed', result:'+$1,240 locked', outcomeTone:'good' },
    ])}
      <div class="explain" style="margin-top:8px"><div class="ai-orb">${IC.sparkles}</div><p>You followed <b>2 of 4</b> recommendations this week. The one you ignored (ETH) cost <b>$542</b> in avoidable funding.</p></div>
    </div>
  </div>`;

  const pmi = `<div class="mt-16">${pmInsight({ problem:'Traders open the app and see numbers, not a decision — so risk is understood too late.', hypothesis:'Leading with an AI decision-flow (what needs attention + one recommended action) drives faster, safer responses.', metric:'time-to-first-action', metricVal:'−63%' })}</div>`;

  view.innerHTML = hero + kpis + market + askPanel
    + `<div class="mb-22">${table}</div>`
    + `<div class="dash-tri">${insightsPanel}${actionsCard}${decisionCard}</div>`
    + pmi;
  startFundingClock();
};

/* Funding countdown */
let clockTimer = null;
function startFundingClock() {
  if (clockTimer) clearInterval(clockTimer);
  let total = 42 * 60; // seconds
  const tick = () => {
    const node = document.getElementById('fundClock');
    const hero = document.getElementById('heroClock');
    if (!node && !hero) { clearInterval(clockTimer); return; }
    const h = String(Math.floor(total/3600)).padStart(2,'0');
    const mm = String(Math.floor((total%3600)/60)).padStart(2,'0');
    const ss = String(total%60).padStart(2,'0');
    const str = `${h}:${mm}:${ss}`;
    if (node) node.textContent = str;
    if (hero) hero.textContent = str;
    total = total > 0 ? total - 1 : 42*60;
  };
  tick();
  clockTimer = setInterval(tick, 1000);
}

/* ============================================================
   SCREEN 2 — POSITION DETAIL (SOL example — the risky one)
   ============================================================ */
SCREENS.position = (view) => {
  const p = POSITIONS.find(x => x.id === 'sol');
  const distToLiq = ((p.mark - p.liq) / p.mark * 100);
  const maint = p.size * p.mmr / 100;

  const header = `<div class="wrap-head">
    <div class="flex gap-10">
      <div class="coin ${p.cls}" style="width:42px;height:42px;font-size:13px">SOL</div>
      <div>
        <h2>SOL-PERP <span class="pill-long" style="margin-left:6px">${IC.arrowUp}Long ${p.lev}×</span></h2>
        <p>Solana Perpetual · Cross Margin · opened 2d 14h ago</p>
      </div>
    </div>
    <div class="flex gap-8">
      <button class="btn btn-soft" onclick="go('liquidation')">${IC.liquidation} Simulate Liquidation</button>
      <button class="btn btn-ghost">${IC.plus} Add Margin</button>
      <button class="btn btn-primary">${IC.arrowDown} Reduce Position</button>
    </div>
  </div>`;

  /* PnL hero */
  const pnlHero = `<div class="pnl-hero mb-16">
    <div class="ph-top">
      <div class="ph-title"><span class="insight-ic" style="width:34px;height:34px;background:var(--neg-soft);color:var(--neg)">${IC.trend}</span>
        <div><div style="font-size:16px;font-weight:650">SOL-PERP <span style="color:var(--neg)">Long ${p.lev}×</span></div><div class="muted" style="font-size:11.5px;font-family:var(--font-mono)">OPENED 2026-07-05 01:14 UTC</div></div>
      </div>
      <div style="text-align:right"><div class="muted" style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Unrealized PnL</div></div>
    </div>
    <div class="ph-big neg">${fmtSigned(p.pnl,2)}<span class="ph-pct neg">(${fmtPct(p.pnlPct)})</span></div>
  </div>`;

  /* Stat grid (8 cells) */
  const stat = (lbl, val, cls='') => `<div class="stat-cell"><div class="sc-lbl">${lbl}</div><div class="sc-val ${cls}">${val}</div></div>`;
  const statGrid = `<div class="stat-grid mb-16">
    ${stat('Entry Price', '$'+fmtNum(p.entry))}
    ${stat('Mark Price', '$'+fmtNum(p.mark), 'pos')}
    ${stat('Index Price', '$'+fmtNum(p.index))}
    ${stat('Position Size', '366.3 SOL')}
    ${stat('Funding Paid', fmtSigned(p.funding,2), 'neg')}
    ${stat('Next Funding', '<span id="posFund">00:42:00</span>')}
    ${stat('Current Margin', fmtUSD(p.margin,0))}
    ${stat('Maint. Margin', fmtUSD(maint,0))}
  </div>`;

  /* Risk analytics */
  const lo = p.liq * 0.985, hi = p.entry * 1.06;
  const pct = (v) => ((v - lo) / (hi - lo) * 100);
  const riskAnalytics = `<div class="card mb-16"><div class="card-head">
      <h3>${IC.gauge} Risk Analytics</h3>
      <div style="text-align:right"><div class="muted" style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em">Liq. Price</div><div class="mono neg" style="font-size:17px;font-weight:650">$${fmtNum(p.liq)}</div></div>
    </div>
    <div class="card-pad">
      <div class="liq-track" style="margin-top:30px;margin-bottom:8px">
        <div class="liq-marker liq" style="left:${pct(p.liq)}%"><span class="flag">$${fmtNum(p.liq)} LIQ</span></div>
        <div class="liq-marker mark" style="left:${pct(p.mark)}%"><span class="flag">$${fmtNum(p.mark)}</span></div>
        <div class="liq-marker entry" style="left:${pct(p.entry)}%"><span class="flag">ENTRY</span></div>
      </div>
      <div class="flex between" style="font-size:11.5px;margin-bottom:16px"><span class="muted mono">$${fmtNum(p.liq)} (Liq)</span><span style="color:var(--neg);font-weight:650">${distToLiq.toFixed(1)}% TO LIQUIDATION</span><span class="muted mono">$${fmtNum(p.mark)} (Mark)</span></div>
      <div class="grid-2" style="gap:14px">
        <div style="border-left:2px solid var(--accent-line);padding-left:13px">
          <div style="font-size:12px;color:var(--text-lo);text-transform:uppercase;letter-spacing:0.04em;font-weight:600;margin-bottom:6px">Volatility-adjusted buffer</div>
          <p style="font-size:12.5px;color:var(--text-mid);line-height:1.5">At 84% realized vol, this position can absorb only a <b>4.9% flash move</b> before liquidation alerts trigger.</p>
        </div>
        <div style="border-left:2px solid var(--accent-line);padding-left:13px">
          <div style="font-size:12px;color:var(--text-lo);text-transform:uppercase;letter-spacing:0.04em;font-weight:600;margin-bottom:6px">Correlation factor</div>
          <p style="font-size:12.5px;color:var(--text-mid);line-height:1.5"><b>0.79</b> Pearson correlation with BTC perp. A BTC drawdown will drag SOL — your book is <b>not</b> hedged.</p>
        </div>
      </div>
    </div>
  </div>`;

  /* Animated margin relationship chain */
  const marginChain = `<div class="card"><div class="card-head"><h3>${IC.scale} Margin Relationship</h3><span class="sub">how liquidation is derived</span></div>
    <div class="card-pad">
      <div class="mchain">
        <div class="mchain-node pulse"><div class="mc-k">Current Margin</div><div class="mc-v">${fmtUSD(p.margin,0)}</div></div>
        <div class="mchain-node pulse-2"><div class="mc-k">Maintenance Margin</div><div class="mc-v" style="color:var(--warn)">${fmtUSD(maint,0)}</div></div>
        <div class="mchain-node pulse-3"><div class="mc-k">Liquidation Price</div><div class="mc-v" style="color:var(--neg)">$${fmtNum(p.liq)}</div></div>
      </div>
      <div class="explain"><div class="ai-orb">${IC.sparkles}</div><p>When your <b>equity</b> (margin + unrealized PnL) decays to the <b>maintenance margin</b> of ${fmtUSD(maint,0)}, the engine liquidates at <b>$${fmtNum(p.liq)}</b>. You currently hold ${fmtUSD(p.margin,0)} margin but are <b>${fmtSigned(p.pnl,0)}</b> underwater — the buffer is thinner than the posted margin suggests.</p></div>
    </div>
  </div>`;

  /* Right rail — AI position analysis with expandable WHY */
  const whyTree = [
    { k:'Funding', v:'<span class="mono">+0.041% / 8h</span> — 92nd percentile' },
    { k:'Open Interest', v:'<span class="mono">+22%</span> in 48h — leverage building into weakness' },
    { k:'Positioning', v:'<span class="mono">71% long</span> — crowded, squeeze fuel below support' },
    { k:'Volatility', v:'<span class="mono">84%</span> realized — buffer erodes in a single session' },
    { k:'Conclusion', v:'Expected <b>long-squeeze / mean-reversion</b>; 4.9% liq buffer at 12× is thin' },
  ];
  const whyHtml = whyTree.map(s => `<div class="rt-step"><div class="rt-dot"></div><div class="rt-card"><div class="rt-k">${s.k}</div><div class="rt-v">${s.v}</div></div></div>`).join('');

  const posAnswers = {
    'btc': 'If BTC drops 3%, SOL (0.79 correlation) would likely fall ~<b>3.6%</b> to ~$153.20 — inside your alert band and only <b>1.3%</b> from the $151.20 liquidation. I would de-risk <b>before</b> that scenario, not during it.',
    'funding': 'You are paying <b>+0.041%/8h</b> on this SOL long — roughly <b>$24/day</b>. Over your average 3-day hold that is ~$72, and funding here sits in the 92nd percentile, so it is more likely to stay high than revert.',
    'reduce': 'Reducing to <b>6×</b> adds ~$4,850 collateral and pushes liquidation to <b>$142.90</b>, widening the buffer from 4.9% to ~<b>10.1%</b> and cutting the position risk score from 84 to ~53.',
    'safe': 'Not currently. At 12× with 84% vol and 4.9% to liquidation, this is your <b>highest-risk</b> position. It becomes reasonable at 6× or with 40% less size.',
    '__default': 'Ask me about liquidation distance, funding cost, correlation risk, or a “what-if BTC drops 3%” scenario for this position.'
  };

  const rail = `<div class="rail">
    <div class="ai-panel">
      <div class="ai-head"><div class="ai-orb">${IC.brain}</div><div style="flex:1"><h3>AI Position Analysis</h3><div class="sub">SOL-PERP · confidence 86%</div></div>
        <div style="width:38px;height:38px;border-radius:50%;border:2px solid ${riskColor(p.risk)};display:grid;place-items:center;font-family:var(--font-mono);font-weight:680;color:${riskColor(p.risk)};font-size:15px">${p.risk}</div>
      </div>
      <div class="card-pad" style="border-bottom:1px solid var(--border-subtle)">
        <div class="flex between" style="margin-bottom:8px"><span class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Risk Assessment</span><span style="color:${riskColor(p.risk)};font-size:12px;font-weight:650">${riskLabel(p.risk).toUpperCase()}</span></div>
        <div class="ratio-bar" style="height:8px"><div class="ratio-fill" style="width:${p.risk}%;background:${riskColor(p.risk)}"></div></div>
        <div style="font-size:13px;color:var(--text-mid);line-height:1.55;margin-top:14px"><b>Why?</b> Our models detect a structural build-up of leverage into weakness. Funding is in the 95th percentile and eroding any upside at <b>0.041%/8h</b>, while positioning is crowded long.</div>
        <div class="why-toggle" onclick="toggleWhy(this)" style="margin-top:10px">${IC.branch} Show AI reasoning chain ${IC.chevD.replace('<svg','<svg class="chev"')}</div>
        <div class="reason-tree"><div><div class="rt-inner">${whyHtml}</div></div></div>
      </div>
      <div class="card-pad" style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid var(--border-subtle)">
        <div class="flex gap-8" style="padding:12px;border:1px solid var(--warn-soft);border-radius:var(--r-md);background:var(--warn-soft)">
          <span style="color:var(--warn)">${IC.scale}</span>
          <div><div style="font-size:12.5px;font-weight:600;color:var(--warn)">Crowded Positioning</div><div style="font-size:12px;color:var(--text-mid);margin-top:2px;line-height:1.45">Retail sentiment is <b>71% long</b>. Historically this precedes a mean-reversion wick of 3–5%.</div></div>
        </div>
      </div>
      <div class="card-pad">
        <div class="section-title" style="margin-bottom:10px">${IC.wand} Suggested Actions</div>
        <div class="action-row"><div class="action-ic">${IC.plus}</div><div><div class="a-title">Increase margin +$2,000</div><div class="a-desc">Liq. $151.20 → $148.10 · conf 88%</div></div><div class="impact"><div class="imp-val">−22</div><div class="imp-lbl">risk</div></div></div>
        <div class="action-row"><div class="action-ic">${IC.arrowDown}</div><div><div class="a-title">Reduce position 40%</div><div class="a-desc">Cuts notional to $34.9K · conf 91%</div></div><div class="impact"><div class="imp-val">−34</div><div class="imp-lbl">risk</div></div></div>
        <div class="action-row"><div class="action-ic">${IC.gauge}</div><div><div class="a-title">Lower leverage 12× → 6×</div><div class="a-desc">Adds $4.85K collateral · conf 93%</div></div><div class="impact"><div class="imp-val">−31</div><div class="imp-lbl">risk</div></div></div>
      </div>
    </div>

    <div class="ai-panel">
      <div class="ai-head"><div class="ai-orb">${IC.chat}</div><div><h3>Ask AI about this trade</h3><div class="sub">SOL-PERP context loaded</div></div></div>
      <div class="card-pad">${askAI('pos', 'What if BTC drops 3%?', ['What if BTC drops 3%?','Is this position safe?','What does reducing to 6× do?'], posAnswers)}</div>
    </div>

    <div class="card">
      <div class="card-head"><h3>${IC.funding} Funding Heatmap</h3><span class="sub">per 8h</span></div>
      <div class="card-pad">
        ${heatRow('Binance', 0.031, 60)}
        ${heatRow('Hyperliquid', 0.041, 82)}
        ${heatRow('dYdX', 0.028, 54)}
        ${heatRow('OKX', 0.037, 72)}
        <div class="muted" style="font-size:11.5px;margin-top:10px;line-height:1.5">SOL funding is <b style="color:var(--neg)">highest on Hyperliquid</b> — where your position sits. Migrating size to Binance would cut carry ~24%.</div>
      </div>
    </div>
  </div>`;

  const pmi = `<div class="mt-16">${pmInsight({ problem:'"Risk is high" is a label, not an explanation — traders distrust black-box scores.', hypothesis:'Exposing the AI reasoning chain and the exact margin→liquidation relationship builds trust and prompts action.', metric:'recommendation follow-through', metricVal:'+41%' })}</div>`;
  view.innerHTML = header + `<div class="with-rail"><div>${pnlHero}${statGrid}${riskAnalytics}${marginChain}</div>${rail}</div>` + pmi;
  startPosClock();
};

function heatRow(venue, rate, pct) {
  const col = rate > 0.035 ? 'var(--neg)' : rate > 0.02 ? 'var(--warn)' : 'var(--pos)';
  return `<div class="heat-row"><span class="h-venue">${venue}</span><div class="heat-track"><div class="heat-fill" style="width:${pct}%;background:${col}"></div></div><span class="h-rate" style="color:${col}">+${rate.toFixed(3)}%</span></div>`;
}

window.toggleWhy = (node) => {
  node.classList.toggle('open');
  const tree = node.nextElementSibling;
  if (tree) tree.classList.toggle('open');
};
function startPosClock(){
  let total = 42*60;
  const t = setInterval(()=>{
    const n = document.getElementById('posFund'); if(!n){clearInterval(t);return;}
    const h=String(Math.floor(total/3600)).padStart(2,'0'),m=String(Math.floor((total%3600)/60)).padStart(2,'0'),s=String(total%60).padStart(2,'0');
    n.textContent=`${h}:${m}:${s}`; total=total>0?total-1:42*60;
  },1000);
}

/* ============================================================
   SCREEN 3 — FUNDING LAB
   ============================================================ */
SCREENS.funding = (view) => {
  const state = { size: 50000, entry: 3421.5, rate: 0.0125, days: 30, dir: 'long', scenario: null };
  const PORT = PORTFOLIO.value;

  view.innerHTML = `<div class="wrap-head">
    <div><h2>Funding Lab</h2><p>Simulate carrying costs and optimize leverage based on real-time funding dynamics.</p></div>
    <button class="btn btn-soft">${IC.activity} Market · ETH-PERP</button>
  </div>
  <div class="lab-grid">
    <div class="card"><div class="card-head"><h3>${IC.settings} Parameters</h3></div><div class="card-pad" id="fundInputs"></div></div>
    <div id="fundOut"></div>
  </div>
  <div class="mt-16">${pmInsight({ problem:'Traders underestimate funding costs and hold crowded positions longer than they should.', hypothesis:'Projecting the dollar cost across horizons before entry reduces surprise, funding-driven exits.', metric:'funding-related exits', metricVal:'−18%' })}</div>`;

  $('#fundInputs').innerHTML = `
    <div class="field"><label>Direction</label>
      <div class="segment" id="fDir"><button data-v="long" class="on-long">Long</button><button data-v="short">Short</button></div></div>
    <div class="field"><label>Position Size <span class="hint" id="fSizeV">$${fmtNum(state.size,0)}</span></label>
      <input class="slider" id="fSize" type="range" min="1000" max="1000000" step="1000" value="${state.size}">
      <div class="slider-val"><span>$1K</span><span>$1M</span></div></div>
    <div class="field"><label>Entry Price</label>
      <div class="input-wrap"><span class="pre">$</span><input id="fEntry" type="number" value="${state.entry}"><span class="post">USD</span></div></div>
    <div class="field"><label>Current Funding Rate <span class="hint">per 8h</span></label>
      <div class="input-wrap"><input id="fRate" type="number" step="0.001" value="${state.rate}"><span class="post">%</span></div></div>
    <div class="field"><label>Expected Duration</label>
      <div class="segment" id="fDur"><button data-v="1">24H</button><button data-v="7">7D</button><button data-v="30" class="on">30D</button></div></div>
    <div class="divider"></div>
    <div class="section-title" style="margin-bottom:10px">${IC.wand} "What-if" Scenarios</div>
    <button class="whatif-btn" id="wiDouble"><span class="wi-t">Funding Doubles</span>${IC.trend}</button>
    <button class="whatif-btn" id="wiNeg"><span class="wi-t">Funding Turns Negative</span>${IC.droplet}</button>
    <button class="whatif-btn" id="wiReset"><span class="wi-t">Reset to live rate</span>${IC.history}</button>`;

  function calc() {
    const size = +$('#fSize').value || 0;
    const rate = (+$('#fRate').value || 0) / 100;      // fraction / 8h
    const dir = state.dir;
    const sign = dir === 'long' ? -1 : 1;               // long pays positive funding
    const days = state.days;

    const horizons = [
      { label:'8 Hours', h:8 }, { label:'24 Hours', h:24 }, { label:'3 Days', h:72 }, { label:'7 Days', h:168 }, { label:'30 Days', h:720 },
    ];
    const activeH = days===1?24 : days===7?168 : 720;
    const cost = (h) => sign * size * rate * (h/8);
    const accruedPct = (h) => rate * (h/8) * 100;
    const maxAbs = Math.max(...horizons.map(x => Math.abs(cost(x.h)))) || 1;
    const selCost = cost(activeH);

    const rows = horizons.map(x => {
      const c = cost(x.h); const good = c >= 0; const w = Math.abs(c)/maxAbs*100;
      const on = x.h === activeH;
      return `<tr style="${on?'background:var(--accent-soft)':''}">
        <td style="${on?'color:var(--accent);font-weight:650':''}">${x.label}</td>
        <td class="mono">${accruedPct(x.h).toFixed(4)}%</td>
        <td class="mono ${good?'pos':'neg'}">${fmtSigned(c,2)}</td>
        <td class="mono muted">${accruedPct(x.h).toFixed(2)}%</td>
        <td><span class="mini-bar"><i style="width:${w}%;background:${good?'var(--pos)':'var(--neg)'}"></i></span></td>
      </tr>`;
    }).join('');

    // cumulative column chart over 30 days
    const marks = [0,5,10,15,20,30];
    const colMax = Math.abs(cost(720)) || 1;
    const cols = marks.map((d,i) => {
      const c = sign * size * rate * (d*24/8);
      const hpct = Math.abs(c)/colMax*100;
      return `<div class="col"><div class="bar" style="height:${d===0?2:hpct}%"><span class="cap">${d===0?'$0':fmtSigned(c,0)}</span></div><span class="xlbl">${d===0?'START':d+'D'}</span></div>`;
    }).join('');

    // AI summary
    const portPct = Math.abs(selCost)/PORT*100;
    const durLabel = days===1?'24 hours':days===7?'7 days':'30 days';
    const recTxt = Math.abs(selCost) > size*0.008
      ? 'Carry is material at this size — consider trimming leverage after the next funding interval, or wait for the rate to mean-revert before adding.'
      : 'Carry is modest relative to your size — the position can be held through funding without meaningful drag.';

    $('#fundOut').innerHTML = `
      <div class="card mb-16"><div class="card-head">
        <h3>${IC.trend} Funding Cost Forecast</h3>
        <div class="flex gap-10"><span class="leg"><span class="dot" style="background:var(--pos)"></span>Receiving</span><span class="leg"><span class="dot" style="background:var(--neg)"></span>Paying</span></div>
      </div>
        <div class="table-wrap"><table class="grid forecast">
          <thead><tr><th>Time Horizon</th><th>Funding Accrued</th><th>USD Equivalent</th><th>% of Notional</th><th>Net PnL Impact</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>

      <div class="card mb-16"><div class="card-head"><h3>${IC.activity} Cumulative Funding Timeline</h3><span class="sub">${dir} · ${fmtNum(rate*100,4)}% / 8h</span></div>
        <div class="card-pad"><div class="colchart">${cols}</div></div>
      </div>

      <div class="ai-panel"><div class="ai-head"><div class="ai-orb">${IC.sparkles}</div><div><h3>AI Funding Summary</h3><div class="sub">decision support</div></div></div>
        <div class="card-pad">
          <div class="flow" style="margin-bottom:14px">
            <div class="flow-step"><div class="fs-lbl">Holding</div><div class="fs-val">${durLabel}</div></div>
            <div class="flow-step"><div class="fs-lbl">Expected ${selCost>=0?'income':'cost'}</div><div class="fs-val ${selCost>=0?'pos':'neg'}">${fmtSigned(selCost,0)}</div></div>
            <div class="flow-step"><div class="fs-lbl">Of portfolio</div><div class="fs-val">${portPct.toFixed(2)}%</div></div>
            <div class="flow-step"><div class="fs-lbl">Annualized</div><div class="fs-val ${sign*rate<0?'neg':'pos'}">${(rate*3*365*100*sign).toFixed(1)}%</div></div>
          </div>
          <div class="explain" style="margin-top:0"><div class="ai-orb">${IC.wand}</div><p><b>Recommendation:</b> ${recTxt}</p></div>
          <div style="max-width:230px;margin-top:12px">${confBar(days===30?89:82)}<div style="font-size:10px;color:var(--text-faint);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">AI confidence</div></div>
        </div>
      </div>

      <div class="card card-pad mt-16">
        <div class="section-title">${IC.book} Why does funding exist?</div>
        <p style="font-size:13px;color:var(--text-mid);line-height:1.6">A perpetual has <b>no expiry</b>, so nothing forces its price back to spot. <b>Funding</b> is the tether: every 8h the crowded side pays the other a fee proportional to the <b>mark–index premium</b>. Perp above spot → <b>longs pay shorts</b>, nudging price down toward the index. It is peer-to-peer, not an exchange fee.</p>
      </div>`;
  }

  // wire
  $('#fDir').addEventListener('click', e => { const b=e.target.closest('button'); if(!b)return; state.dir=b.dataset.v; [...$('#fDir').children].forEach(x=>x.classList.remove('on-long','on-short')); b.classList.add(state.dir==='long'?'on-long':'on-short'); calc(); });
  $('#fDur').addEventListener('click', e => { const b=e.target.closest('button'); if(!b)return; state.days=+b.dataset.v; [...$('#fDur').children].forEach(x=>x.classList.remove('on')); b.classList.add('on'); calc(); });
  $('#fSize').addEventListener('input', e => { $('#fSizeV').textContent = '$'+(+e.target.value).toLocaleString('en-US'); calc(); });
  ['fEntry','fRate'].forEach(id => $('#'+id).addEventListener('input', calc));
  const setWi = (btn) => { ['wiDouble','wiNeg','wiReset'].forEach(x=>$('#'+x).classList.remove('active')); if(btn)$('#'+btn).classList.add('active'); };
  $('#wiDouble').addEventListener('click', () => { $('#fRate').value=(state.rate*2).toFixed(4); setWi('wiDouble'); calc(); });
  $('#wiNeg').addEventListener('click', () => { $('#fRate').value=(-state.rate).toFixed(4); setWi('wiNeg'); calc(); });
  $('#wiReset').addEventListener('click', () => { $('#fRate').value=state.rate.toFixed(4); setWi(null); calc(); });
  calc();
};

/* ============================================================
   SCREEN 4 — LIQUIDATION LAB
   ============================================================ */
SCREENS.liquidation = (view) => {
  const st = { entry: 50000, price: 50000, lev: 20, margin: 1000, mode: 'isolated', dir: 'long' };
  const MMR = 0.005;
  let prev = null, wasLiq = false;
  const liqPrice = (entry, lev, dir, mmr = MMR) => dir === 'long' ? entry*(1 - 1/lev + mmr) : entry*(1 + 1/lev - mmr);

  view.innerHTML = `<div class="wrap-head">
    <div><h2>Liquidation Lab</h2><p>Understand the precise mechanics of margin calls. Adjust parameters to see how leverage impacts your liquidation threshold and risk ratio.</p></div>
    <button class="btn btn-soft" id="lqReset">${IC.history} Reset</button>
  </div>
  <div style="display:grid;grid-template-columns:288px 1fr 336px;gap:18px;align-items:start" class="mb-22" id="lqGrid">
    <div class="card"><div class="card-head"><h3>${IC.settings} Simulation Controls</h3></div><div class="card-pad" id="lqCtrls"></div></div>
    <div class="card"><div class="card-head"><h3>${IC.activity} Market Dynamics</h3><span class="badge" id="lqStatus"></span></div>
      <div class="card-pad">
        <div style="display:grid;place-items:center;margin:6px 0 14px" id="lqGauge"></div>
        <div class="grid-2" id="lqCells" style="gap:12px"></div>
        <div class="divider"></div>
        <div class="flex between" style="margin-bottom:6px"><span class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Simulated Market Price</span><span class="mono" id="lqPriceVal" style="font-size:18px;font-weight:650"></span></div>
        <input class="slider" id="lqPrice" type="range" min="${(st.entry*0.86).toFixed(0)}" max="${(st.entry*1.06).toFixed(0)}" step="10" value="${st.price}">
        <div class="flex between" style="font-size:10px;color:var(--text-faint);font-family:var(--font-mono);margin-top:4px"><span id="lqPMin">$${fmtNum(st.entry*0.86,0)}</span><span style="color:var(--neg);letter-spacing:0.06em;font-weight:650">LIQUIDATION DANGER ZONE</span><span id="lqPMax">$${fmtNum(st.entry*1.06,0)}</span></div>
      </div>
    </div>
    <div id="lqRisk"></div>
  </div>
  <div class="grid-3 mb-22">
    <div class="card card-pad"><div class="flex gap-10" style="margin-bottom:8px"><span class="insight-ic" style="background:var(--info-soft);color:var(--info)">${IC.shield}</span><b style="font-size:14px">Insurance Fund</b></div><p class="muted" style="font-size:12px;line-height:1.55">Acts as a shock absorber for the protocol, covering deficit balances when a position is liquidated below its bankruptcy price.</p></div>
    <div class="card card-pad"><div class="flex gap-10" style="margin-bottom:8px"><span class="insight-ic" style="background:var(--warn-soft);color:var(--warn)">${IC.trend}</span><b style="font-size:14px">Auto-Deleveraging</b></div><p class="muted" style="font-size:12px;line-height:1.55">In extreme cases where the Insurance Fund is exhausted, the ADL system automatically reduces opposing positions to balance the books.</p></div>
    <div class="card card-pad"><div class="flex gap-10" style="margin-bottom:8px"><span class="insight-ic" style="background:var(--violet-soft);color:var(--violet)">${IC.history}</span><b style="font-size:14px">Partial Liquidation</b></div><p class="muted" style="font-size:12px;line-height:1.55">On Tier-1 assets, the engine attempts to close only enough of the position to bring your margin ratio back below 100%.</p></div>
  </div>
  ${pmInsight({ problem:'Traders underestimate how little price movement liquidates a high-leverage position.', hypothesis:'A live margin-ratio gauge plus a step-by-step liquidation path builds intuition before they size the trade.', metric:'preventable liquidations', metricVal:'−31%' })}`;

  $('#lqCtrls').innerHTML = `
    <div class="field"><label>Margin Type</label>
      <div class="segment" id="lqMode"><button data-v="isolated" class="on">Isolated</button><button data-v="cross">Cross</button></div></div>
    <div class="field"><label>Entry Price (USD) <span class="hint mono" id="lqEntryV">$${fmtNum(st.entry,0)}</span></label>
      <input class="slider" id="lqEntry" type="range" min="10000" max="100000" step="500" value="${st.entry}"></div>
    <div class="field"><label>Leverage <span class="hint mono" id="lqLevV">${st.lev}×</span></label>
      <input class="slider" id="lqLev" type="range" min="1" max="50" value="${st.lev}"><div class="slider-val"><span>1×</span><span>50×</span></div></div>
    <div class="field"><label>Margin Deposit <span class="hint mono" id="lqMarV">$${fmtNum(st.margin,0)}</span></label>
      <input class="slider" id="lqMargin" type="range" min="100" max="10000" step="50" value="${st.margin}"></div>
    <div class="divider"></div>
    <p class="muted" style="font-size:11.5px;line-height:1.5;font-style:italic">Note: calculations use a fixed Maintenance Margin Rate of 0.5%. Position size = margin × leverage.</p>`;

  function compute() {
    const entry = +$('#lqEntry').value, lev = +$('#lqLev').value, margin = +$('#lqMargin').value, dir = st.dir;
    const size = margin * lev;
    const liq = liqPrice(entry, lev, dir);
    const price = st.price;
    const qty = size / entry;
    const pnl = (dir === 'long' ? price-entry : entry-price) * qty;
    const equity = margin + pnl;
    const maint = size * MMR;
    const marginRatio = equity <= 0 ? 100 : Math.min(100, maint / equity * 100);   // Binance-style: liquidation at 100%
    const distToLiq = dir === 'long' ? (price-liq)/price*100 : (liq-price)/price*100;
    const liquidated = (dir === 'long' ? price <= liq : price >= liq) || equity <= 0;
    let risk = Math.round(Math.min(100, Math.max(3, marginRatio*0.7 + lev*0.6)));
    if (liquidated) risk = 100;
    return { entry, lev, margin, size, liq, price, pnl, equity, maint, marginRatio, distToLiq, liquidated, risk };
  }

  function chgRow(k, from, to, delta, unit, higherBad) {
    const up = delta > 0.05, down = delta < -0.05;
    let tone = 'var(--text-lo)';
    if (up) tone = higherBad ? 'var(--neg)' : 'var(--pos)';
    if (down) tone = higherBad ? 'var(--pos)' : 'var(--neg)';
    const badge = (up||down)
      ? `<span class="chg-badge" style="background:${tone}22;color:${tone}">${up?'+':''}${delta.toFixed(1)}${unit}</span>`
      : `<span class="chg-badge" style="background:var(--bg-elevated);color:var(--text-lo)">—</span>`;
    return `<div class="chg-row"><span class="chg-k">${k}</span><div class="chg-vals"><span class="chg-from">${from}</span><span class="chg-arrow">→</span><span class="chg-to" style="color:${tone}">${to}</span>${badge}</div></div>`;
  }
  function lpath(n, active, title, desc) {
    const cls = n === active ? (n === 4 ? 'active' : 'on') : (n < active ? 'on' : '');
    return `<div class="lpath-step"><div class="lpath-dot ${cls}"></div><div class="lpath-title">${n}. ${title}</div><div class="lpath-desc">${desc}</div></div>`;
  }

  function renderDynamic() {
    const s = compute();
    const gCol = s.marginRatio < 40 ? 'var(--pos)' : s.marginRatio < 75 ? 'var(--warn)' : 'var(--neg)';
    $('#lqGauge').innerHTML = semiGauge(s.marginRatio, 'Margin Ratio', gCol, 200);
    $('#lqPriceVal').textContent = '$'+fmtNum(s.price,0);
    $('#lqPriceVal').style.color = s.liquidated ? 'var(--neg)' : 'var(--text-hi)';
    $('#lqStatus').textContent = s.liquidated ? 'LIQUIDATED' : riskLabel(s.risk);
    $('#lqStatus').className = 'badge ' + (s.liquidated ? 'badge-neg' : s.distToLiq < 3 ? 'badge-warn' : 'badge-pos');
    $('#lqCells').innerHTML = `
      <div class="stat-cell"><div class="sc-lbl">Liquidation Price</div><div class="sc-val neg">$${fmtNum(s.liq,2)}</div></div>
      <div class="stat-cell"><div class="sc-lbl">Dist. to Liquidation</div><div class="sc-val" style="color:${s.liquidated?'var(--neg)':s.distToLiq<3?'var(--warn)':'var(--pos)'}">${s.liquidated?'0.00%':s.distToLiq.toFixed(2)+'%'}</div></div>`;

    let chg = '';
    if (prev) {
      const dNow = s.liquidated ? 0 : s.distToLiq;
      chg = `<div class="changed mb-16">
        <div class="changed-head">${IC.activity} What changed</div>
        ${chgRow('Price', '$'+fmtNum(prev.price,0), '$'+fmtNum(s.price,0), (s.price-prev.price)/prev.price*100, '%')}
        ${chgRow('Margin Ratio', prev.marginRatio.toFixed(1)+'%', s.marginRatio.toFixed(1)+'%', s.marginRatio-prev.marginRatio, 'pt', true)}
        ${chgRow('Risk Score', String(prev.risk), String(s.risk), s.risk-prev.risk, '', true)}
        ${chgRow('Dist. to Liq', prev.dist.toFixed(1)+'%', dNow.toFixed(1)+'%', dNow-prev.dist, 'pt')}
      </div>`;
    }

    const stepActive = s.liquidated ? 4 : s.marginRatio > 75 ? 3 : s.marginRatio > 40 ? 2 : 1;
    $('#lqRisk').innerHTML = `
      <div class="ai-panel mb-16"><div class="ai-head"><div class="ai-orb">${IC.brain}</div><div><h3>Risk Analysis</h3><div class="sub">live · updates as you drag</div></div></div>
        <div class="card-pad"><p style="font-size:13px;color:var(--text-mid);line-height:1.6">At <b style="color:${gCol}">${s.lev}×</b> leverage, ${s.liquidated
          ? 'the position is <b style="color:var(--neg)">liquidated</b> — equity fell below the maintenance margin and the engine closed it.'
          : `even a <b class="neg">${s.distToLiq.toFixed(1)}%</b> drop in price results in total collateral loss. Consider reducing leverage to <b>${Math.max(1,Math.round(s.lev/2))}×</b> to roughly double your safety buffer.`}</p></div>
      </div>
      ${chg}
      <div class="card"><div class="card-head"><h3>${IC.liquidation} Liquidation Path</h3></div><div class="card-pad">
        ${lpath(1, stepActive, 'Capital Deployment', `Collateral of <span class="mono">${fmtUSD(s.margin,0)}</span> is locked at <span class="mono">$${fmtNum(s.entry,0)}</span> · size <span class="mono">${fmtUSD(s.size,0)}</span>.`)}
        ${lpath(2, stepActive, 'Maintenance Threshold', `Protocol requires 0.5% of position value (<span class="mono">${fmtUSD(s.maint,0)}</span>) to be maintained as equity.`)}
        ${lpath(3, stepActive, 'Point of No Return', `Price falls where <b>Equity &lt; Maintenance Margin</b>.<div class="formula" style="margin-top:8px">LiqPrice = Entry × (1 − 1/Lev + MMR)<br>= $${fmtNum(s.entry,0)} × ${(1 - 1/s.lev + MMR).toFixed(4)} = <b>$${fmtNum(s.liq,2)}</b></div>`)}
        ${lpath(4, stepActive, 'Liquidation Event', 'Position is taken over by the liquidator; remaining collateral is transferred to the Insurance Fund.')}
      </div></div>`;

    if (s.liquidated && !wasLiq) { const g=$('#lqGrid'); if(g){ g.classList.remove('liq-flash'); void g.offsetWidth; g.classList.add('liq-flash'); } }
    wasLiq = s.liquidated;
    prev = { price: s.price, marginRatio: s.marginRatio, risk: s.risk, dist: s.liquidated ? 0 : s.distToLiq };
  }

  // wire — controls update the price-slider bounds; the price slider itself is never recreated (so dragging stays smooth)
  $('#lqMode').addEventListener('click', e => { const b=e.target.closest('button'); if(!b)return; st.mode=b.dataset.v; [...$('#lqMode').children].forEach(x=>x.classList.remove('on')); b.classList.add('on'); renderDynamic(); });
  $('#lqEntry').addEventListener('input', e => {
    const en=+e.target.value; $('#lqEntryV').textContent='$'+fmtNum(en,0);
    const ps=$('#lqPrice'); ps.min=(en*0.86).toFixed(0); ps.max=(en*1.06).toFixed(0);
    $('#lqPMin').textContent='$'+fmtNum(en*0.86,0); $('#lqPMax').textContent='$'+fmtNum(en*1.06,0);
    if(st.price>+ps.max||st.price<+ps.min){ st.price=en; ps.value=en; }
    renderDynamic();
  });
  $('#lqLev').addEventListener('input', e => { $('#lqLevV').textContent=e.target.value+'×'; renderDynamic(); });
  $('#lqMargin').addEventListener('input', e => { $('#lqMarV').textContent='$'+fmtNum(+e.target.value,0); renderDynamic(); });
  $('#lqPrice').addEventListener('input', e => { st.price=+e.target.value; renderDynamic(); });
  $('#lqReset').addEventListener('click', ()=> go('liquidation'));
  prev = null; renderDynamic();
};

/* ============================================================
   SCREEN 5 — AI TRADE PLANNER
   ============================================================ */
SCREENS.planner = (view) => {
  const ASSETS = { 'SOL-PERP':{px:151, cls:'coin-sol', sym:'SOL'}, 'ETH-PERP':{px:3421, cls:'coin-eth', sym:'ETH'}, 'BTC-PERP':{px:64231, cls:'coin-btc', sym:'BTC'} };
  const st = { asset:'SOL-PERP', dir:'long', lev:5, notional:6250, rec:4 };
  const MMR = 0.005;

  view.innerHTML = `<div class="wrap-head">
    <div><h2>AI Trade Planner</h2><p>Simulate and risk-adjust your market exposure using neural sentiment &amp; on-chain data.</p></div>
    <div class="flex gap-8"><button class="btn btn-soft" id="plReset">${IC.history} Reset Forecast</button><button class="btn btn-primary" id="plExec">${IC.bolt} Execute Simulation</button></div>
  </div>
  <div style="display:grid;grid-template-columns:340px 1fr;gap:18px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card"><div class="card-head"><h3>${IC.settings} Plan Your Trade</h3></div><div class="card-pad">
        <div class="field"><label>Asset Pair</label>
          <div class="input-wrap" style="padding:0"><select id="plAsset" style="flex:1;background:none;border:none;outline:none;color:var(--text-hi);font-family:var(--font-mono);font-size:14px;padding:10px 12px;appearance:none;cursor:pointer">
            ${Object.keys(ASSETS).map(a=>`<option value="${a}">${a}</option>`).join('')}
          </select><span style="padding-right:12px;color:var(--text-lo)">${IC.chevD}</span></div></div>
        <div class="field"><label>Direction</label>
          <div class="segment" id="plDir"><button data-v="long" class="on-long">${IC.arrowUp} Long</button><button data-v="short">${IC.arrowDown} Short</button></div></div>
        <div class="field"><label>Leverage <span class="hint mono" id="plLevV">${st.lev}×</span></label>
          <input class="slider" id="plLev" type="range" min="1" max="50" value="${st.lev}"><div class="slider-val"><span>1×</span><span>10×</span><span>25×</span><span>50×</span></div></div>
        <div class="divider"></div>
        <div class="dl">
          <div class="dl-row"><span class="k">Est. Liquidation Price</span><span class="v mono" id="plLiq"></span></div>
          <div class="dl-row"><span class="k">Required Margin</span><span class="v mono" id="plReq"></span></div>
        </div>
      </div></div>
      <div class="card"><div class="card-head"><h3>${IC.activity} Market Context</h3></div><div class="card-pad">
        <div class="flex between" style="margin-bottom:7px"><span class="muted" style="font-size:12px">Funding Rate</span><span class="mono neg" style="font-weight:650">+0.0412% / 1h</span></div>
        <div class="ratio-bar" style="height:6px;margin-bottom:14px"><div class="ratio-fill" style="width:78%;background:var(--neg)"></div></div>
        <div class="dl">
          <div class="dl-row"><span class="k">Volume (24h)</span><span class="v mono">$1.24B</span></div>
          <div class="dl-row"><span class="k">OI Change</span><span class="v mono pos">+4.2%</span></div>
        </div>
      </div></div>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="ai-panel"><div class="card-pad">
        <div class="flex between" style="margin-bottom:14px">
          <span class="badge" id="plOptimal"></span>
          <span class="muted" style="font-size:11px;font-family:var(--font-mono)">neural eval · updated live</span>
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:center">
          <div id="plDonut"></div>
          <div>
            <div style="font-size:19px;font-weight:650;letter-spacing:-0.02em;margin-bottom:12px">Deep Learning Trade Evaluation</div>
            <div class="pf-grid">
              <div class="pf"><div class="pf-k">Funding</div><div class="pf-v" style="color:var(--warn)">Elevated ↗</div></div>
              <div class="pf"><div class="pf-k">Open Interest</div><div class="pf-v">Neutral</div></div>
              <div class="pf"><div class="pf-k">Supp / Resist</div><div class="pf-v" style="color:var(--pos)">At Support</div></div>
              <div class="pf"><div class="pf-k">Trend (4h)</div><div class="pf-v" style="color:var(--pos)">Bullish</div></div>
            </div>
          </div>
          <div style="text-align:center;border-left:1px solid var(--border-subtle);padding-left:22px">
            <div class="mono" id="plConf" style="font-size:30px;font-weight:680;color:var(--accent)">88%</div>
            <div class="muted" style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em">Confidence</div>
          </div>
        </div>
      </div></div>

      <div class="grid-2">
        <div class="card"><div class="card-head"><h3>${IC.wand} AI Optimization</h3></div><div class="card-pad">
          <div class="flex between" style="padding:11px 13px;border:1px solid var(--accent-line);border-radius:var(--r-md);background:var(--accent-soft);margin-bottom:12px">
            <span style="font-size:12.5px;color:var(--text-mid)">Recommended Leverage</span><span class="mono" style="font-size:18px;font-weight:680;color:var(--accent)">${st.rec}×</span></div>
          <div class="grid-2" style="gap:10px;margin-bottom:14px">
            <div class="stat-cell"><div class="sc-lbl">Stop Loss</div><div class="sc-val neg" id="plSL"></div></div>
            <div class="stat-cell"><div class="sc-lbl">Take Profit</div><div class="sc-val pos" id="plTP"></div></div>
          </div>
          <button class="btn btn-primary" id="plApply" style="width:100%">${IC.check} Apply AI Adjustments</button>
        </div></div>
        <div class="ai-panel"><div class="ai-head"><div class="ai-orb">${IC.sparkles}</div><h3>Reasoning</h3></div><div class="card-pad">
          <p id="plReason" style="font-size:12.8px;color:var(--text-mid);line-height:1.6;font-style:italic"></p>
          <div class="flex gap-10" style="margin-top:12px;font-size:10.5px;color:var(--text-faint)"><span>${IC.clock} Calculated 2m ago</span><span>${IC.layers} On-chain Feed</span></div>
        </div></div>
      </div>
    </div>
  </div>

  <div class="kpi-grid mt-16" style="grid-template-columns:repeat(4,1fr)">
    <div class="kpi"><div class="kpi-top"><span class="kpi-label"><span style="color:var(--pos)">●</span> Long / Short Ratio</span></div><div class="kpi-val" style="font-size:19px">52.4% / 47.6%</div></div>
    <div class="kpi"><div class="kpi-top"><span class="kpi-label"><span style="color:var(--neg)">●</span> Volatility Index</span></div><div class="kpi-val" style="font-size:19px">High <span class="muted" style="font-size:13px">(68.2)</span></div></div>
    <div class="kpi"><div class="kpi-top"><span class="kpi-label"><span style="color:var(--warn)">●</span> Global Sentiment</span></div><div class="kpi-val" style="font-size:19px">Fear / Greed 64</div></div>
    <div class="kpi"><div class="kpi-top"><span class="kpi-label"><span style="color:var(--info)">●</span> Active Traders</span></div><div class="kpi-val" style="font-size:19px">14,231</div></div>
  </div>

  ${pmInsight({ problem:'Traders pick leverage emotionally, then discover the risk only after entering.', hypothesis:'Showing risk, liquidation and confidence update live as the leverage slider moves makes the trade-off felt before capital is committed.', metric:'avg. entry leverage', metricVal:'−2.4×' })}`;

  function sync() {
    const a = ASSETS[st.asset], entry = a.px, lev = st.lev, dir = st.dir;
    const liq = dir==='long' ? entry*(1 - 1/lev + MMR) : entry*(1 + 1/lev - MMR);
    const reqMargin = st.notional / lev;
    const risk = Math.min(98, Math.round(9 + lev*3));
    const conf = Math.max(42, Math.round(91 - lev*0.6));
    const dp = entry < 10 ? 4 : 2;
    const sl = dir==='long' ? entry*0.894 : entry*1.106;
    const tp = dir==='long' ? entry*1.225 : entry*0.775;

    $('#plLevV').textContent = lev+'×';
    $('#plLiq').textContent = '$'+fmtNum(liq, dp);
    $('#plReq').textContent = fmtUSD(reqMargin,0)+' USDC';
    $('#plDonut').innerHTML = riskDonut(risk, 110);
    $('#plConf').textContent = conf+'%';
    $('#plSL').textContent = '$'+fmtNum(sl, dp);
    $('#plTP').textContent = '$'+fmtNum(tp, dp);

    let ob, oc;
    if (lev <= 6) { ob='badge-pos'; oc='✓ OPTIMAL CONDITION'; }
    else if (lev <= 15) { ob='badge-warn'; oc='⚠ ELEVATED RISK'; }
    else { ob='badge-neg'; oc='✕ DANGER · OVERLEVERED'; }
    const os = $('#plOptimal'); os.className = 'badge '+ob; os.textContent = oc;

    const verb = lev > st.rec ? `Reducing leverage from <b class="neg">${lev}×</b> to <b>${st.rec}×</b> significantly improves your distance to liquidation while maintaining upside.` : `Your <b>${lev}×</b> sizing is within the AI's recommended envelope — distance to liquidation is healthy.`;
    $('#plReason').innerHTML = `"Market structure is bullish but ${a.sym} funding is currently at a 30-day high. ${verb} The identified 4h support at $${fmtNum(sl,dp)} provides a robust technical floor for this entry. Confidence ${conf}% given clean on-chain data coverage."`;
  }

  $('#plAsset').addEventListener('change', e => { st.asset=e.target.value; sync(); });
  $('#plDir').addEventListener('click', e => { const b=e.target.closest('button'); if(!b)return; st.dir=b.dataset.v; [...$('#plDir').children].forEach(x=>x.classList.remove('on-long','on-short')); b.classList.add(st.dir==='long'?'on-long':'on-short'); sync(); });
  $('#plLev').addEventListener('input', e => { st.lev=+e.target.value; sync(); });
  $('#plApply').addEventListener('click', () => { st.lev=st.rec; $('#plLev').value=st.rec; sync(); });
  $('#plExec').addEventListener('click', () => { const d=$('#plDonut'); d.style.transition='transform .3s'; d.style.transform='scale(1.05)'; setTimeout(()=>d.style.transform='',300); sync(); });
  $('#plReset').addEventListener('click', () => go('planner'));
  sync();
};

/* ============================================================
   SCREEN 6 — TRADE JOURNAL
   ============================================================ */
SCREENS.journal = (view) => {
  const trades = [
    { sym:'ETH', cls:'coin-eth', dir:'long', lev:10, pnl:1240.50, pnlPct:12.4, dur:'2h 14m', res:'WIN', date:'Oct 24, 2023 · 14:22:10 UTC',
      entry:3421.15, exit:3845.20, size:'10.5 ETH', fees:-12.40, cond:'High Volatility (VIX @ 24.5)',
      reason:'Bullish RSI Divergence on 15m timeframe confirmed by a volume spike at the support cluster.',
      snapTags:['EMA CROSS','VWAP BOUNCE'], spark:[3400,3405,3395,3410,3430,3460,3510,3600,3720,3810,3845],
      beh:74, discipline:['Good',78,'pos'], riskControl:['Average',61,'warn'], exitTiming:['Poor',38,'neg'],
      emotions:[{t:'Panic Exit',c:'neg',ic:'alert'},{t:'FOMO',c:'warn',ic:'flame'}],
      emoNote:'FOMO detected on exit. You closed prematurely because a bearish social feed spooked you — leaving <b>+4.8%</b> of the move on the table.',
      good:['Excellent entry timing — you identified the RSI divergence correctly and waited for volume confirmation.','Position sized appropriately at 10× for a high-conviction setup.'],
      bad:['Exit was emotional, not structural — no target or trailing stop was set.','You moved the stop to breakeven too early, adding exit pressure.'],
      entries:[
        {t:'14:22', k:'Entry Confirmed', v:'Market seems heavily oversold here. Order filled at $3,421.15. Setting SL at $3,380.'},
        {t:'15:10', k:'Interim Adjustment', v:'Moving stop to breakeven. Price approaching major resistance zone.'},
        {t:'16:36', k:'Exit Recorded', v:'Panic closed as Twitter feed started posting bearish charts. Feeling annoyed with the exit timing.'},
      ] },
    { sym:'BTC', cls:'coin-btc', dir:'short', lev:15, pnl:-892.00, pnlPct:-4.2, dur:'15m', res:'LOSS', date:'Oct 24, 2023 · 09:05 UTC',
      entry:64980, exit:65890, size:'0.21 BTC', fees:-8.10, cond:'Low volatility chop',
      reason:'Counter-trend short into resistance with no confirmation — impulsive entry.',
      snapTags:['RESISTANCE FADE'], spark:[64900,64950,65100,65300,65500,65700,65890],
      beh:41, discipline:['Poor',34,'neg'], riskControl:['Average',58,'warn'], exitTiming:['Good',72,'pos'],
      emotions:[{t:'Revenge Trade',c:'neg',ic:'alert'},{t:'Overconfidence',c:'warn',ic:'flame'}],
      emoNote:'Opened <b>4 minutes</b> after closing a loser — a textbook revenge-trade pattern, at above-average leverage.',
      good:['Stop-loss was respected — the loss stayed small and controlled.'],
      bad:['No thesis; the entry was a reaction to the prior loss.','Shorted into an uptrend at 15× — leverage too high for a counter-trend idea.'],
      entries:[{t:'09:05', k:'Entry', v:'Has to reverse here. Going short, size up a bit to make back the last loss.'},{t:'09:20', k:'Stopped Out', v:'Stopped for -4.2%. Should not have taken this.'}] },
    { sym:'SOL', cls:'coin-sol', dir:'long', lev:5, pnl:318.20, pnlPct:2.1, dur:'45m', res:'WIN', date:'Oct 23, 2023 · 19:40 UTC',
      entry:150.10, exit:153.25, size:'41 SOL', fees:-4.20, cond:'Trending, funding neutral',
      reason:'Trend continuation off the 4h support with a defined stop and target.',
      snapTags:['TREND PULLBACK'], spark:[150,150.4,150.1,151,151.8,152.4,153.25],
      beh:88, discipline:['Great',91,'pos'], riskControl:['Good',82,'pos'], exitTiming:['Good',79,'pos'],
      emotions:[{t:'Disciplined',c:'pos',ic:'check'}],
      emoNote:'Clean, rules-based execution. Entry, stop and target were all defined before entry and respected throughout.',
      good:['Right-sized at 5× with a pre-defined plan.','Took profit at the planned target instead of getting greedy.'],
      bad:['Could have trailed a portion for the extended move that followed.'],
      entries:[{t:'19:40', k:'Entry', v:'Textbook pullback to support. SL $148, TP $153.'},{t:'20:25', k:'Target Hit', v:'TP filled at $153.25. Plan executed as written.'}] },
    { sym:'ARB', cls:'coin-arb', dir:'short', lev:6, pnl:0, pnlPct:0.0, dur:'1h 05m', res:'BREAKEVEN', date:'Oct 23, 2023 · 12:10 UTC',
      entry:1.184, exit:1.184, size:'26.4K ARB', fees:-3.40, cond:'Range-bound',
      reason:'Fade into resistance; thesis invalidated, exited flat.',
      snapTags:['RANGE FADE'], spark:[1.184,1.186,1.182,1.185,1.183,1.184],
      beh:70, discipline:['Good',74,'pos'], riskControl:['Good',76,'pos'], exitTiming:['Average',60,'warn'],
      emotions:[{t:'Neutral',c:'pos',ic:'check'}],
      emoNote:'Recognized the thesis was not playing out and exited at breakeven rather than hoping — a healthy habit.',
      good:['Cut the trade when the setup invalidated instead of holding and hoping.'],
      bad:['Entry was slightly early — waiting for a rejection candle would have improved the fill.'],
      entries:[{t:'12:10', k:'Entry', v:'Fading the range high.'},{t:'13:15', k:'Scratch', v:'Not working, closing flat.'}] },
  ];

  view.innerHTML = `<div class="wrap-head"><div><h2>Trade Journal</h2><p>Every trade auto-logged with market context. The AI reviews behaviour, not just PnL.</p></div>
    <div class="chips"><span class="chip active">All 42</span><span class="chip">Wins</span><span class="chip">Losses</span><span class="chip">Flagged</span></div></div>
  <div style="display:grid;grid-template-columns:296px 1fr;gap:18px;align-items:start">
    <div class="card" style="overflow:hidden"><div class="card-head"><h3>${IC.journal} History</h3><span class="sub">42 trades</span></div>
      <div id="jHistory"></div>
    </div>
    <div id="jDetail"></div>
  </div>
  <div class="mt-16">${pmInsight({ problem:'Traders review PnL but never their own behaviour, so they repeat FOMO and revenge patterns.', hypothesis:'Auto-detecting emotional patterns and scoring discipline turns each trade into a behavioural feedback loop.', metric:'repeat behavioural errors', metricVal:'−27%' })}</div>`;

  const resBadge = { WIN:'badge-pos', LOSS:'badge-neg', BREAKEVEN:'badge-neutral' };
  const cm = c => ({ neg:['var(--neg-soft)','var(--neg)'], warn:['var(--warn-soft)','var(--warn)'], pos:['var(--pos-soft)','var(--pos)'] }[c]);
  const behColor = s => s >= 75 ? 'var(--pos)' : s >= 55 ? 'var(--warn)' : 'var(--neg)';

  $('#jHistory').innerHTML = trades.map((t,i) => `<div class="jrnl-item ${i===0?'active':''}" data-i="${i}">
    <div class="ji-top"><span class="ji-sym">${t.sym}-PERP</span><span class="ji-pnl ${t.pnl>=0?'pos':t.pnl<0?'neg':'muted'}">${t.pnlPct>0?'+':''}${t.pnlPct.toFixed(1)}%</span></div>
    <div class="ji-bot"><span class="badge ${resBadge[t.res]}" style="font-size:10px">${t.res}</span><span class="ji-dur">${t.dur}</span></div>
  </div>`).join('');

  function renderDetail(t) {
    const behC = behColor(t.beh);
    const bar = (arr) => `<div class="beh-track"><div class="beh-fill" style="width:${arr[1]}%;background:${cm(arr[2])[1]}"></div></div>`;
    $('#jDetail').innerHTML = `
      <div class="card mb-16"><div class="card-pad">
        <div class="flex between">
          <div class="flex gap-10"><div class="coin ${t.cls}">${t.sym}</div>
            <div><div class="flex gap-8"><b style="font-size:16px">${t.sym}-PERP ${t.dir==='long'?'Long':'Short'}</b><span class="${t.dir==='long'?'pos':'neg'}">${t.dir==='long'?IC.arrowUp:IC.arrowDown}</span></div>
            <div class="muted" style="font-size:11.5px;font-family:var(--font-mono)">${t.date}</div></div>
          </div>
          <div style="text-align:right"><div class="mono ${t.pnl>=0?'pos':t.pnl<0?'neg':'muted'}" style="font-size:24px;font-weight:680">${t.pnl===0?'$0.00':fmtSigned(t.pnl,2)}</div><div class="muted" style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em">Net Realized PnL</div></div>
        </div>
        <div class="stat-grid mt-16" style="grid-template-columns:repeat(4,1fr)">
          <div class="stat-cell"><div class="sc-lbl">Entry Price</div><div class="sc-val">$${fmtNum(t.entry, t.entry<10?4:2)}</div></div>
          <div class="stat-cell"><div class="sc-lbl">Exit Price</div><div class="sc-val">$${fmtNum(t.exit, t.exit<10?4:2)}</div></div>
          <div class="stat-cell"><div class="sc-lbl">Size (Leverage)</div><div class="sc-val">${t.size} <span class="muted" style="font-size:12px">(${t.lev}×)</span></div></div>
          <div class="stat-cell"><div class="sc-lbl">Fees Paid</div><div class="sc-val neg">${fmtSigned(t.fees,2)}</div></div>
        </div>
      </div></div>

      <div class="grid-2 mb-16">
        <div class="card card-pad"><div class="section-title">${IC.activity} Technical Strategy</div>
          <div style="font-size:10.5px;color:var(--text-lo);text-transform:uppercase;letter-spacing:0.05em;font-weight:650;margin-bottom:5px">Entry Reason</div>
          <p style="font-size:12.8px;color:var(--text-mid);line-height:1.55;margin-bottom:12px">${t.reason}</p>
          <div style="font-size:10.5px;color:var(--text-lo);text-transform:uppercase;letter-spacing:0.05em;font-weight:650;margin-bottom:5px">Market Condition</div>
          <div class="flex gap-8"><span style="color:var(--warn)">●</span><span style="font-size:12.5px;color:var(--text-mid)">${t.cond}</span></div>
        </div>
        <div class="card card-pad"><div class="flex between" style="margin-bottom:10px"><div class="section-title" style="margin:0">${IC.trend} Entry Snapshot</div></div>
          <div style="border:1px solid var(--border-subtle);border-radius:var(--r-md);padding:10px;background:var(--bg-base)">
            ${sparkline(t.spark, t.pnl>=0?'var(--pos)':'var(--neg)', 320, 90)}
          </div>
          <div class="chips mt-16" style="margin-top:10px">${t.snapTags.map(s=>`<span class="chip">${s}</span>`).join('')}</div>
        </div>
      </div>

      <div class="ai-panel mb-16"><div class="ai-head"><div class="ai-orb">${IC.sparkles}</div><div style="flex:1"><h3>AI Performance Review</h3><div class="sub">behavioural + risk analysis</div></div>
        <div style="text-align:right"><div class="mono" style="font-size:24px;font-weight:680;color:${behC}">${t.beh}</div><div class="muted" style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.05em">Behavior Score</div></div>
      </div>
      <div class="card-pad">
        <div class="grid-2" style="gap:22px;align-items:start">
          <div>
            <div class="section-title" style="margin-bottom:10px">Behaviour breakdown</div>
            <div class="beh-row"><span class="beh-k">Discipline</span>${bar(t.discipline)}<span class="beh-v" style="color:${cm(t.discipline[2])[1]}">${t.discipline[0]}</span></div>
            <div class="beh-row"><span class="beh-k">Risk Control</span>${bar(t.riskControl)}<span class="beh-v" style="color:${cm(t.riskControl[2])[1]}">${t.riskControl[0]}</span></div>
            <div class="beh-row"><span class="beh-k">Exit Timing</span>${bar(t.exitTiming)}<span class="beh-v" style="color:${cm(t.exitTiming[2])[1]}">${t.exitTiming[0]}</span></div>
            <div style="margin-top:14px">
              <div class="section-title" style="margin-bottom:9px">${IC.brain} Emotion Detected</div>
              <div class="flex gap-8" style="flex-wrap:wrap;margin-bottom:9px">${t.emotions.map(e=>`<span class="emo-tag" style="background:${cm(e.c)[0]};color:${cm(e.c)[1]}">${IC[e.ic]}${e.t}</span>`).join('')}</div>
              <p style="font-size:12.5px;color:var(--text-mid);line-height:1.55">${t.emoNote}</p>
            </div>
          </div>
          <div>
            <div class="review-cols" style="grid-template-columns:1fr">
              <div><h5>${IC.check} What went well</h5><ul>${t.good.map(g=>`<li><span style="color:var(--pos)">${IC.check}</span>${g}</li>`).join('')}</ul></div>
              <div style="margin-top:14px"><h5>${IC.x} What to improve</h5><ul>${t.bad.map(b=>`<li><span style="color:var(--neg)">${IC.x}</span>${b}</li>`).join('')}</ul></div>
            </div>
          </div>
        </div>
      </div></div>

      <div class="card"><div class="card-head"><h3>${IC.journal} Journal Entries</h3><button class="btn btn-soft btn-sm">${IC.plus} Add Note</button></div>
        <div class="card-pad"><div class="timeline">${t.entries.map(e=>`<div class="tl-item"><div class="tl-node info">${IC.chevR}</div><div class="tl-card"><div class="tl-time">${e.t}</div><div class="tl-title">${e.k}</div><div class="tl-desc">${e.v}</div></div></div>`).join('')}</div></div>
      </div>`;
  }

  $('#jHistory').addEventListener('click', e => {
    const item = e.target.closest('.jrnl-item'); if (!item) return;
    [...$('#jHistory').children].forEach(x => x.classList.remove('active'));
    item.classList.add('active');
    renderDetail(trades[+item.dataset.i]);
  });
  renderDetail(trades[0]);
};

/* ============================================================
   SCREEN 7 — TRADE REVIEW
   ============================================================ */
SCREENS.review = (view) => {
  view.innerHTML = `<div class="wrap-head"><div><h2>Post-Mortem · Trade #8492-L</h2><p>SOL-PERP · Long · 12× Leverage · <b style="color:var(--neg)">Liquidated −$4,552</b></p></div>
    <div class="flex gap-8"><button class="btn btn-soft">${IC.journal} Export Log</button><button class="btn btn-primary">${IC.brain} Retry Analysis</button></div></div>

    <div class="ai-answer mb-22" style="padding:16px 18px;align-items:flex-start">
      <div class="ai-orb" style="width:30px;height:30px">${IC.sparkles}</div>
      <div><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:var(--accent);font-weight:700;margin-bottom:6px">AI Summary · one-line root cause</div>
      <p style="font-size:15px;line-height:1.62;color:var(--text-hi)">You were liquidated because <b>elevated funding</b> combined with <b>12× leverage</b> pushed your safety buffer below the <b>maintenance margin</b> — and three <b>risk alerts were dismissed</b> rather than acted on. Using <b>6×</b> alone would have kept the position alive through the wick.</p></div>
    </div>

    <div class="with-rail">
      <div>
        <div class="card"><div class="card-head"><h3>${IC.review} Event Timeline</h3><span class="sub">14:21 → 19:47 · 5h 26m</span></div>
          <div class="card-pad"><div class="timeline">${reviewTimeline()}</div></div>
        </div>
      </div>
      <div class="rail">
        <div class="card"><div class="card-head"><h3>${IC.brain} Root Cause Analysis</h3></div><div class="card-pad">
          <div class="rca-grid">
            <div class="rca" style="border-left-color:var(--neg)"><div class="rca-type" style="color:var(--neg)">Primary Cause</div><p>Over-leverage. 12× left only a 7.8% buffer that normal SOL volatility erased.</p></div>
            <div class="rca" style="border-left-color:var(--warn)"><div class="rca-type" style="color:var(--warn)">Secondary Cause</div><p>Added margin instead of reducing size when the risk score crossed 70.</p></div>
            <div class="rca" style="border-left-color:var(--violet)"><div class="rca-type" style="color:var(--violet)">Behavioral Cause</div><p>Anchoring — "it always bounces here." Averaged down on a losing thesis.</p></div>
            <div class="rca" style="border-left-color:var(--info)"><div class="rca-type" style="color:var(--info)">Market Cause</div><p>BTC dropped 3.1% and dragged SOL through support amid crowded longs.</p></div>
          </div>
        </div></div>

        <div class="ai-panel"><div class="ai-head"><div class="ai-orb">${IC.sparkles}</div><div><h3>Alternative Scenario</h3><div class="sub">Counterfactual replay</div></div></div>
          <div class="card-pad">
            <div class="section-title" style="margin-bottom:10px">What if you'd used 6× instead of 12×?</div>
            <div class="readouts" style="margin-bottom:12px">
              <div class="readout"><div class="ro-lbl">Liq. Price</div><div class="ro-val">$151.20</div><div class="ro-sub">vs $151.20 → $142.90</div></div>
              <div class="readout"><div class="ro-lbl">Outcome</div><div class="ro-val pos">Survives</div><div class="ro-sub">−$2,100 open, not liquidated</div></div>
            </div>
            <div class="explain"><div class="ai-orb">${IC.sparkles}</div><p>At <b>6×</b>, liquidation sits at <b>$142.90</b> — the wick to $151.20 would <b>not</b> have closed you. You'd hold a <b>−$2,100</b> unrealized loss instead of a <b>−$4,552</b> realized one, and still be in the trade for the bounce that followed.</p></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-16">${pmInsight({ problem:'After a liquidation, traders blame the market and never isolate the decision that actually caused it.', hypothesis:'A single-sentence root cause + a counterfactual replay converts a painful loss into a repeatable lesson.', metric:'repeat liquidations / user', metricVal:'−44%' })}</div>`;

  function reviewTimeline() {
    const ev = [
      { t:'14:21', node:'info', ic:'position', title:'Opened SOL Long · 12×', desc:'Entry $172.40, size $58.2K. Leverage 2× above your 30-day average.' },
      { t:'15:04', node:'warn', ic:'funding', title:'Funding increased to +0.041%/8h', desc:'PerpPilot flagged rising carry cost. Crowded-long regime beginning to build.' },
      { t:'16:12', node:'warn', ic:'layers', title:'Open Interest +22%', desc:'Leverage stacking into weakness — a classic pre-squeeze condition.' },
      { t:'16:48', node:'neg', ic:'alert', title:'AI warning ignored', desc:'Risk score crossed 70. Suggested action "Reduce 40%" was dismissed; margin was added instead.' },
      { t:'18:30', node:'info', ic:'trend', title:'BTC dropped 3.1%', desc:'Broad de-risking dragged SOL toward the $158 support shelf.' },
      { t:'19:41', node:'neg', ic:'liquidation', title:'Support broke → cascade', desc:'SOL sliced $155. Crowded longs unwound; price gapped to the liquidation level.' },
      { t:'19:47', node:'neg', ic:'x', title:'Liquidated at $151.20', desc:'Maintenance margin breached. Position closed by the engine. Realized −$4,552.' },
    ];
    return ev.map(e => `<div class="tl-item"><div class="tl-node ${e.node}">${IC[e.ic]}</div><div class="tl-card"><div class="tl-time">${e.t}</div><div class="tl-title">${e.title}</div><div class="tl-desc">${e.desc}</div></div></div>`).join('');
  }
};

/* ============================================================
   SCREEN 8 — LEARN PERPS
   ============================================================ */
SCREENS.learn = (view) => {
  const topics = [
    { t:'Spot vs Perpetuals', d:'Why perps have no expiry and how that changes everything.', ic:'scale', tone:'info', prog:100, lvl:'Foundations', min:5 },
    { t:'Funding Rates', d:'The peer-to-peer mechanism that tethers perp price to spot.', ic:'funding', tone:'accent', prog:60, lvl:'Foundations', min:7, feat:true },
    { t:'Mark vs Index Price', d:'Which price liquidates you, and why they differ.', ic:'target', tone:'violet', prog:40, lvl:'Core', min:6 },
    { t:'Cross vs Isolated Margin', d:'Choosing your blast radius when a trade goes wrong.', ic:'shield', tone:'warn', prog:0, lvl:'Core', min:8 },
    { t:'The Liquidation Engine', d:'Step-by-step: from margin call to position close.', ic:'liquidation', tone:'neg', prog:0, lvl:'Core', min:10 },
    { t:'Insurance Fund', d:'The backstop that prevents socialized losses.', ic:'shield', tone:'info', prog:0, lvl:'Advanced', min:6 },
    { t:'Auto-Deleveraging', d:'What happens when the insurance fund runs dry.', ic:'layers', tone:'neg', prog:0, lvl:'Advanced', min:7 },
    { t:'Open Interest', d:'Reading leverage build-up and squeeze conditions.', ic:'trend', tone:'accent', prog:0, lvl:'Core', min:6 },
    { t:'Funding Arbitrage', d:'Harvesting funding with delta-neutral positions.', ic:'activity', tone:'violet', prog:0, lvl:'Advanced', min:9 },
    { t:'Oracle Networks', d:'How the index price resists manipulation.', ic:'droplet', tone:'info', prog:0, lvl:'Advanced', min:8 },
  ];

  view.innerHTML = `<div class="wrap-head"><div><h2>Academy</h2><p>Interactive lessons that turn protocol mechanics into intuition — animations, live sliders and quizzes.</p></div>
    <div class="flex gap-10"><div style="text-align:right"><div class="mono" style="font-size:18px;font-weight:680;color:var(--accent)">42%</div><div class="muted" style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em">Completed</div></div></div></div>

  <div class="card mb-22"><div class="card-pad">
    <div class="flex between" style="margin-bottom:16px"><div class="section-title" style="margin:0">${IC.learn} Your Learning Path</div><span class="muted" style="font-size:11.5px">5 of 12 lessons · Intermediate tier</span></div>
    <div class="learn-path">
      <div class="lp-node done"><div class="lp-dot">${IC.check}</div><div class="lp-lbl">Beginner</div><div class="lp-sub">4 / 4 done</div></div>
      <div class="lp-node current"><div class="lp-dot">2</div><div class="lp-lbl">Intermediate</div><div class="lp-sub">1 / 4 · in progress</div></div>
      <div class="lp-node"><div class="lp-dot">3</div><div class="lp-lbl">Advanced</div><div class="lp-sub">locked</div></div>
      <div class="lp-node"><div class="lp-dot">4</div><div class="lp-lbl">Professional</div><div class="lp-sub">locked</div></div>
    </div>
  </div></div>

  <div style="display:grid;grid-template-columns:1fr 340px;gap:18px;align-items:start" class="mb-22">
    <div class="card" style="background:radial-gradient(600px 200px at 90% -30%,rgba(124,132,255,0.1),transparent)"><div class="card-pad">
      <span class="badge badge-accent" style="margin-bottom:12px">${IC.bolt} In progress · Core Mechanics</span>
      <h3 style="font-size:20px;font-weight:650;letter-spacing:-0.02em;margin-bottom:8px">How the Liquidation Engine Works</h3>
      <p class="muted" style="font-size:13px;line-height:1.55;margin-bottom:16px;max-width:560px">Perp trades use collateral as a safety net. When the market moves against you and your collateral can no longer cover the position's risk, the engine steps in to protect the protocol's solvency. Drag the sliders to feel it.</p>
      <div class="grid-2" style="gap:20px;align-items:center">
        <div>
          <div class="field"><label>Margin (Collateral) <span class="hint mono" id="lnMarV">$1,000</span></label>
            <input class="slider" id="lnMar" type="range" min="200" max="5000" step="50" value="1000"></div>
          <div class="field" style="margin-bottom:0"><label>Leverage <span class="hint mono" id="lnLevV">10×</span></label>
            <input class="slider" id="lnLev" type="range" min="1" max="50" value="10"></div>
        </div>
        <div class="readouts">
          <div class="readout"><div class="ro-lbl">Est. Liquidation Price</div><div class="ro-val neg" id="lnLiq"></div></div>
          <div class="readout"><div class="ro-lbl">Safety Buffer</div><div class="ro-val" id="lnBuf"></div><div class="ro-sub" id="lnSize"></div></div>
        </div>
      </div>
    </div></div>

    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="ai-panel"><div class="ai-head"><div class="ai-orb">${IC.sparkles}</div><h3>AI Insight</h3></div><div class="card-pad">
        <div style="font-size:12.5px;font-weight:650;margin-bottom:6px">The Insurance Fund</div>
        <p style="font-size:12.5px;color:var(--text-mid);line-height:1.55">Think of it as a protocol-wide shock absorber. When a liquidation can't be filled at a price better than the bankruptcy price, the fund covers the deficit — so winning traders always realize their profits without socialized losses.</p>
      </div></div>
      <div class="card"><div class="card-head"><h3>${IC.brain} Knowledge Check</h3><span class="sub">2 / 5</span></div><div class="card-pad" id="lnQuiz">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px">What happens when Mark Price hits your Liquidation Price?</div>
        <div class="quiz-opt" data-correct="1"><span class="q-mark"></span>The position is automatically closed by the engine</div>
        <div class="quiz-opt"><span class="q-mark"></span>You receive a margin-call notification with time to react</div>
        <div class="quiz-opt"><span class="q-mark"></span>Your leverage is automatically reduced</div>
      </div></div>
    </div>
  </div>

  <div class="wrap-head" style="margin-bottom:14px"><div><h2 style="font-size:16px">Master the Protocol</h2></div>
    <div class="chips"><span class="chip active">All</span><span class="chip">Foundations</span><span class="chip">Core</span><span class="chip">Advanced</span></div></div>
  <div class="learn-grid" id="learnGrid"></div>
  <div class="mt-16">${pmInsight({ problem:'Perp mechanics are abstract, so new traders learn them the expensive way — through liquidations.', hypothesis:'A guided, gamified path with live simulators and quizzes builds intuition before real capital is at risk.', metric:'day-30 retention', metricVal:'+34%' })}</div>`;

  const toneMap = { info:['var(--info-soft)','var(--info)'], accent:['var(--accent-soft)','var(--accent)'], violet:['var(--violet-soft)','var(--violet)'], warn:['var(--warn-soft)','var(--warn)'], neg:['var(--neg-soft)','var(--neg)'] };
  $('#learnGrid').innerHTML = topics.map(t => {
    const [bg, fg] = toneMap[t.tone];
    return `<div class="learn-card">
      ${t.feat?`<span class="badge badge-accent" style="position:absolute;top:14px;right:14px">${IC.sparkles} Popular</span>`:''}
      <div class="learn-ic" style="background:${bg};color:${fg}">${IC[t.ic]}</div>
      <h4>${t.t}</h4>
      <p>${t.d}</p>
      <div class="learn-foot">
        <span class="badge badge-neutral">${t.lvl}</span>
        <div class="learn-progress"><i style="width:${t.prog}%"></i></div>
        <span>${t.prog>0?t.prog+'%':t.min+' min'}</span>
      </div>
    </div>`;
  }).join('');

  // Live liquidation lesson
  const ENTRY = 64231, MMR = 0.005;
  const lnUpd = () => {
    const mar = +$('#lnMar').value, lev = +$('#lnLev').value;
    const liq = ENTRY * (1 - 1/lev + MMR);
    const buf = (1/lev - MMR) * 100;
    $('#lnMarV').textContent = '$'+fmtNum(mar,0);
    $('#lnLevV').textContent = lev+'×';
    $('#lnLiq').textContent = '$'+fmtNum(liq,2);
    $('#lnBuf').textContent = buf.toFixed(1)+'%';
    $('#lnBuf').style.color = buf > 12 ? 'var(--pos)' : buf > 5 ? 'var(--warn)' : 'var(--neg)';
    $('#lnSize').textContent = 'position size '+fmtUSD(mar*lev,0);
  };
  $('#lnMar').addEventListener('input', lnUpd);
  $('#lnLev').addEventListener('input', lnUpd);
  lnUpd();

  // Quiz
  $('#lnQuiz').addEventListener('click', e => {
    const opt = e.target.closest('.quiz-opt'); if (!opt) return;
    [...$('#lnQuiz').querySelectorAll('.quiz-opt')].forEach(o => { o.style.pointerEvents='none'; });
    const ok = opt.dataset.correct === '1';
    opt.classList.add(ok ? 'correct' : 'wrong');
    opt.querySelector('.q-mark').innerHTML = ok ? IC.check : IC.x;
    if (!ok) { const c = $('#lnQuiz').querySelector('[data-correct="1"]'); c.classList.add('correct'); c.querySelector('.q-mark').innerHTML = IC.check; }
  });
};

/* ---------- global keyboard: cmd+k focus ---------- */
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); $('#cmdk input').focus(); }
});

/* ---------- launch ---------- */
window.go = go;
boot();
