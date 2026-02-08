# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, with --host for LAN access)
npm run build      # Production build
npm run lint       # ESLint (flat config, ESLint 9)
npm run preview    # Preview production build locally
npm test           # Run Vitest tests
```

## Architecture

**Privacy-first WhatsApp chat analytics SPA** — all processing happens in-browser, no server. UI is entirely in Spanish.

### Data Flow

1. **File Upload** (`FileUploader.jsx` + react-dropzone) — accepts `.txt` or `.zip` (via JSZip) of WhatsApp exports, with 100MB max file size, progress toasts for ZIP and large files, and differentiated error messages
2. **Parsing** (`utils/parser.js`) — converts raw chat text into message objects `{ date, time, author, content, isMultimedia, timestamp }`
3. **Stats Engine** (`utils/statsCalculator.js`) — single-pass pure function `calculateStats(messages)` returns 17 chart datasets + KPIs
4. **Dashboard** (`Dashboard.jsx`, lazy-loaded) — thin orchestrator; filters messages by date range and participants via `useMemo`, passes `stats` to section components. Date range inputs auto-correct invalid ranges with toast feedback. Stats computation returns `{ stats, statsError }` for differentiated empty-state messaging.
5. **Section Components** (`dashboard/*.jsx`) — each uses `AccessibleChart` wrapper for chart rendering, wrapped in `React.memo`

### View Switching

No router — state-based in `App.jsx`: `!messages` → `LandingPage`, `messages` → `Dashboard` (lazy-loaded via `React.lazy` + `Suspense`), with a `DashboardSkeleton` fallback. Transitions use the **View Transitions API** with graceful fallback. "Analizar otro archivo" performs a soft reset (state clear + View Transition) with confirmation dialog, not a page reload.

### Key Components

- **`KPIGrid`** — top-level metric cards (total messages, active days, participants) with info icon tooltips
- **`SingleUserStats`** — deep-dive view when exactly 1 participant is selected; breadcrumb "← Volver a vista general" button above it clears participant filter
- **`TemporalAnalysis`** — quarterly timeline, hourly, daily, seasonality charts with `title` attributes on headings
- **`ContentAnalysis`** — emoji, word length, media metrics with `title` attributes on headings
- **`SocialAnalysis`** — laughter, links, questions, conversation starters with `title` attributes on headings
- **`HistoricStreak`** — trophy card showing longest consecutive message streak; truncated quotes have `title` tooltips with full message text
- **`FadeInSection`** — Intersection Observer wrapper for scroll animations (with `animation-timeline: view()` progressive enhancement); skips IO entirely when `prefers-reduced-motion: reduce` is active (content immediately visible)
- **`MultiSelect`** — chip-based participant filter with full keyboard navigation (Arrow keys, Enter/Space toggle, Escape close, Tab close), roving `tabIndex`, `role="listbox"`/`role="option"`/`aria-selected`/`aria-multiselectable`, `id` prop for label association
- **`AccessibleChart`** — shared wrapper rendering any chart type with `role="img"`, `aria-label`, and a visually-hidden `.sr-only` data summary
- **`MiniStatCard`** — stat display card with optional `tooltip` prop rendering an `<Info>` icon with `title`/`aria-label`
- **`ErrorBoundary`** — class component wrapping `<main>` in `App.jsx` (Spanish error message + reload button)
- **`DashboardSkeleton`** — shimmer skeleton loader for lazy-loaded Dashboard
- **`PrivacyBadge`** — pill badge below dropzone: "100% privado. Tus datos no salen de tu navegador."

### Styling

**CSS Modules** (`.module.css`) co-located with each component, using CSS nesting and `@layer components {}` for cascade control.

- **Design tokens**: `src/styles/tokens.css` — `@layer` order declaration, `@property` registrations, `color-mix(in oklch)` derived tokens, transition presets
- **Global reset**: `src/styles/global.css` — reset + base layers, `prefers-reduced-motion: reduce`, View Transition CSS, `.sr-only` utility class in `@layer utilities`
- **Legacy**: `src/index.css` — minimal (app-container, loading-state)
- Key tokens: `--color-primary: #00a884`, `--color-secondary: #53bdeb`, `--card-height-std: 430px`, `--card-width-max: 430px`
- Glassmorphism via `backdrop-filter: blur(12px)`
- All animations respect `prefers-reduced-motion` (CSS and JS)
- Path aliases: `@` → `src/`, `@components`, `@utils`, `@styles`

### Build Chunks (via Vite manualChunks)

Main (~278KB) | Dashboard (~42KB) | Dashboard CSS (~11KB) | Chart.js (~204KB) | JSZip (~97KB)

## Testing

- **Vitest** configured in `vite.config.js` — 23 tests across 2 files
- `src/utils/__tests__/parser.test.js` — 11 tests (iOS/Android format, multiline, multimedia, BiDi markers, date formats)
- `src/utils/__tests__/statsCalculator.test.js` — 12 tests (null input, counts, streak, conversation starters, hourly distribution)

## Key Decisions

- **`statsCalculator.js`** is the core — any new metric goes here as a single-pass accumulation, then gets surfaced through a dashboard section component
- **Multimedia and deleted messages** are excluded from text-based stats (emoji, word length, laughter, etc.) but counted in total message counts
- **Conversation starters** = messages sent after a >4 hour gap (configurable in `constants.js`)
- **Historic streak** tracks consecutive messages by the same author (excluding multimedia)
- **`messagesInDateRange`** only computed when `isSingleUser` is true (perf optimization)
- **Shared chart config** in `utils/chartConfig.js` — `PIE_CHART_OPTIONS` (with `datalabels` config) and `PIE_CHART_PLUGINS` (local `chartjs-plugin-datalabels` registration, NOT global)
- **Pie/doughnut percentage labels** via `chartjs-plugin-datalabels` — shows `N%` on slices ≥5%, hidden for smaller slices
- **`AccessibleChart`** wraps all chart instances — provides `role="img"`, `aria-label`, and `.sr-only` text summary
- **Soft reset** instead of `window.location.reload()` — `App.jsx` passes `onReset` to Dashboard, which uses `window.confirm()` before clearing state via View Transitions
- **Date range validation** — setting start > end or end < start auto-corrects the other date with a toast notification
- **Stats error differentiation** — `useMemo` returns `{ stats, statsError }`, empty state distinguishes computation errors from no-data-in-range
- **MultiSelect display text** — "Todos los participantes" (none selected) vs "Todos (N)" (all selected) vs "N seleccionados"
- Demo data button appears in dev mode only (`App.jsx`), shows success toast on load
- `PerformanceMonitor` component is dev-only (FPS/memory/DOM count)

## Conventions

- ESLint flat config: unused vars starting with `[A-Z_]` are ignored, `no-console: warn` (allow `warn`/`error`), `react-hooks/exhaustive-deps: warn`, `react-hooks/set-state-in-effect: error`
- CSS Modules with `@layer components {}` wrapper and CSS nesting
- `React.memo` on pure display components (KPIGrid, TemporalAnalysis, ContentAnalysis, SocialAnalysis, MiniStatCard)
- `htmlFor` on form labels, `aria-expanded`/`aria-haspopup` on interactive elements, `role="img"`/`aria-label` on charts
- Icons from `lucide-react`
- Toast notifications via `react-hot-toast` (loading toasts for async operations, `duration: 6000` for parse errors)
- `constants.js` holds regex patterns, chart colors, and threshold values
- `fileURLToPath` used instead of `__dirname` in `vite.config.js` (ESM compatible)
- Avoid `setState` inside `useEffect` — use helper functions called at close/toggle sites instead (ESLint `set-state-in-effect` rule)
