# PerpPilot — AI Decision Intelligence for Perpetual Traders

> **Trade on the DEX. Think with PerpPilot.**
> A concept prototype for an AI-powered *decision-support* terminal built for perpetual-futures traders — not another exchange.

PerpPilot is the **Bloomberg Terminal + Copilot** for perps. It helps traders make smarter decisions **before, during, and after** a position: reducing unnecessary liquidations, explaining complex perp mechanics, and turning protocol complexity into intuitive product experiences.

**Live demo:** https://uellyf.github.io/perppilot/

---

## Why it exists

Perpetual-futures traders drown in raw numbers but starve for *decisions*. PerpPilot leads with an AI decision-flow — *what needs attention → the one recommended action* — and backs every recommendation with transparent reasoning, confidence scores, and live simulations.

It is positioned as a trader's **second screen** — decision intelligence, not execution — so it complements a DEX like Hyperliquid rather than competing with it.

## Screens

| Screen | What it does |
|---|---|
| **Dashboard** | AI decision-flow hero, portfolio risk score, KPIs with sparklines, live market snapshot, positions table with traffic-light AI recommendations, Ask-AI, Decision History |
| **Position Detail** | Mark vs Index, margin math, expandable **WHY** reasoning chain, animated margin→liquidation relationship, funding heatmap |
| **Funding Lab** | Live funding-cost forecast across horizons, cumulative timeline chart, "what-if" scenarios, AI Funding Summary |
| **Liquidation Lab** | Live margin-ratio gauge, drag-the-price simulation with a **"What changed?"** delta tracker, real liquidation formula, insurance-fund / ADL / partial-liquidation explainers |
| **AI Trade Planner** | Leverage slider that **live-drives** risk score, liquidation price, required margin, confidence & optimal-condition verdict |
| **Trade Journal** | Auto-logged trades + a large AI review with a **Behavior Score** and **emotion detection** (FOMO / revenge / panic exit) |
| **Trade Review** | One-paragraph AI root-cause summary, event timeline, root-cause analysis, and a counterfactual "what-if 6× instead of 12×" replay |
| **Academy** | Progress + Beginner→Professional learning path, live liquidation lesson, quizzes |

Every screen carries a small **PM Insight** card (Problem → Hypothesis → Success Metric) documenting the product thinking behind it.

## Tech

- **Zero build step.** Plain HTML + CSS + vanilla JS. No framework, no bundler, no dependencies.
- Design system driven entirely by CSS custom properties — dark, institutional theme (indigo accent, tabular monospaced numbers).
- All perps math (liquidation price, maintenance margin, funding cost, margin ratio) is computed live in the browser from mock data.

## Run locally

Any static file server works:

```bash
npx serve .
# or
python3 -m http.server 4321
```

Then open the printed URL. Desktop-first — best viewed at **1440px+**.

## Structure

```
index.html            # app shell (sidebar, topbar, status bar)
assets/css/styles.css # design system + all component styles
assets/js/data.js     # icons, mock portfolio/market data, formatters
assets/js/app.js       # routing + all 8 screen renderers + interactivity
```

---

*Prototype with illustrative mock data — not financial advice and not connected to any live exchange.*
