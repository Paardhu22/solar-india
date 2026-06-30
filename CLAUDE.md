# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build (PORT=3100 npm run start to use a custom port)
npm run lint    # eslint (flat config, next/core-web-vitals + next/typescript)
npx tsc --noEmit  # typecheck only (build also typechecks)
```

There is **no test runner wired up**. `@playwright/test` is installed but there is no config and no spec files yet; `npm test` does not exist.

### Regenerating the AR model

`public/solar_panel.glb` is generated procedurally, not hand-authored. To change panel dimensions/colors, edit `generate_panel.py` and run it inside the committed Python venv:

```bash
./venv/bin/python generate_panel.py   # trimesh writes public/solar_panel.glb
```

## Environment

`.env.local` holds two keys (gitignored):
- `OPENAI_API_KEY` — server-side only, used by `/api/insights`.
- `NEXT_PUBLIC_GOOGLE_PLACES_KEY` — client-exposed. Note: `LocationQuestion` currently uses a plain text input + city chips; Places autocomplete is not actually wired yet despite the key and `@types/google.maps` being present.

## Architecture

A single-page, **client-rendered** interactive experience (not a multi-route app). The product is a solar-savings estimator for **Ashwitha Energy Services** (Indian market — currency in ₹ lakhs/crore, tariffs in INR/kWh).

### The phase state machine

Everything is driven by one hook, `src/hooks/useSolarEstimator.ts`, which owns a 4-phase machine: `hero → questions → loading → results` (`AppPhase` in `src/types/index.ts`). `src/app/page.tsx` is a `'use client'` component that reads the hook and `AnimatePresence`-swaps the screen for the current phase. There is no routing between screens — phase is in-memory React state, so a reload restarts the flow.

Key behaviors baked into the hook:
- `handleAnswer(key, value)` stores the answer and advances; on the last question it calls `runCalculation`.
- `totalQuestions = 5`. The flow renders **only 5 of the 8 possible questions** (see below).
- Loading is a **fixed 5200ms timer**, not tied to any real work — it's a deliberate cinematic beat. The AI insights fetch is fired in parallel during this window.
- `skip` jumps straight to results using whatever's been answered; `calculateSolarResults` fills the rest with defaults.

### Questions: components vs. the wired flow

`src/components/questions/` contains 8 question components, but `page.tsx`'s `renderQuestion()` switch only wires 5, in this order: **Bill → Location → RoofArea → Cleaning → FutureUsage**. `WeatherQuestion`, `RoofTypeQuestion`, and `ShadingQuestion` exist and are fully built but are **not in the active flow** — yet `calculations.ts` and `/api/insights` still consume `weather`, `roofType`, and `shading`. Those fields therefore always take their **defaults** (`moderate` / `rcc` / `none`) unless you wire the components back in. When changing the flow, update both `page.tsx` (the switch + indices) and `totalQuestions` in the hook.

Every question component is a thin wrapper around `questions/Scene.tsx` (shared layout/back-button/accent-color frame) and composes `primitives/` (`SplitText`, `StepNumber`, `ContinueButton`, `CountUp`, `NumberField`, `OptionCard`, `MagneticButton`) and `art/Shapes.tsx`.

### The calculation engine

`src/lib/calculations.ts` is a **pure, deterministic** heuristic model — no network, no AI. All tunable assumptions are top-of-file constants (tariff ₹8/kWh, 80% system efficiency, 400W panels, 90 sq ft/kW, ₹58k/kW install cost, degradation, escalation) plus per-answer lookup tables (`PEAK_SUN_HOURS`, `*_FACTOR`, `*_SUITABILITY`). It returns the full `SolarResults` shape. Adjusting the model means editing these tables — keep them in sync with any new answer enum values in `src/types/index.ts`. `formatINR` here renders Indian-format currency (K / L / Cr).

### AI insights are an optional enhancement

`src/app/api/insights/route.ts` (the only API route) takes the answers + computed results and asks OpenAI `gpt-4o-mini` for exactly 4 advisory strings. It is **non-blocking and fail-soft**: any error returns `{ insights: [] }` with status 200, and the UI renders fully without insights. Never make the results screen depend on this call succeeding.

### Design system (Tailwind v4, CSS-first)

Tailwind v4 — **there is no `tailwind.config.js`**. The theme lives in `src/app/globals.css` under `@theme`: custom color tokens (`paper`, `bone`, `ink`, `solar`, `electric`, `flame`, …), offset "print shadow" utilities (`shadow-ink*`), `text-hollow`, grid/grain textures, and ambient keyframe helpers. The aesthetic is editorial/modern-maximalist: white paper background, thick black ink outlines, flat bold color, oversized display type. Two fonts are injected via `next/font` on `<html>` in `layout.tsx`: `--font-display` (Clash Display, local variable woff2) for headings, `--font-grotesk` (Space Grotesk) for UI/body. Use the `cn()` helper in `src/lib/cn.ts` (clsx + tailwind-merge) for conditional classes.

### Scroll & motion conventions

- Scroll is locked for fixed-viewport phases via `body[data-lock="true"]`, toggled by phase in `page.tsx`; only the `results` phase scrolls.
- `chrome/SmoothScroll.tsx` runs Lenis momentum scrolling and **no-ops under `prefers-reduced-motion`** — follow that pattern for new motion. `globals.css` also globally neuters animations under reduced motion.
- Page transitions use Framer Motion `AnimatePresence mode="wait"`; GSAP is available for finer timeline work.

### AR viewer

`results/ARViewer.tsx` dynamically imports `@google/model-viewer` client-side (it registers a custom element, so it's `@ts-nocheck` and gated behind an `isMounted` flag). On mobile it offers native WebXR/Scene Viewer/Quick Look AR; on desktop it falls back to a `getUserMedia` webcam overlay. Remember to stop camera tracks on unmount.
