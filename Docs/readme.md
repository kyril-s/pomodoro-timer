# Pomodoro Timer

A focused, incrementally built Pomodoro timer web app. The project was developed as part of a "Build your app" course, following a staged approach — shipping a working product at each step and expanding it with new features over time.

**Tech stack:** Vanilla HTML, CSS, and JavaScript, bundled with [Vite](https://vitejs.dev/).

---

## What it does

The app is a full-featured Pomodoro timer with three session types (Work, Break, Long Break), customizable durations, keyboard shortcuts, a session schedule timeline, sound notifications, and a dynamic color theme system that shifts between light and dark modes depending on the timer state.

### Features at a glance

- **Countdown timer** with large monospace display (MM:SS)
- **Three modes:** Work, Break, and Long Break
- **Start / Pause / Reset** controls
- **Manual mode switching** via toggle buttons or keyboard shortcuts
- **Configurable durations** for all three modes through a collapsible settings panel
- **Quick-set shortcuts** (e.g. 15m, 25m, 45m, 60m for work)
- **Long break scheduling** — automatically inserts a long break after every *N* work sessions
- **Session schedule timeline** showing the upcoming sequence of work/break blocks
- **Sound notifications** when a session ends (different tones for work vs. break)
- **Dynamic color theming** — a hue slider lets users pick their accent color; the entire palette (light and dark) is computed from that single hue
- **Automatic dark mode** — the UI flips to a dark theme while a work session is running, returning to light on pause or break
- **Full-screen color flash** on mode transitions
- **Keyboard shortcuts:** `Space` (start/pause), `R` (reset), `[` / `]` (cycle modes)
- **Responsive layout** that adapts to narrow screens
- **Settings lock** — inputs are disabled while the timer is running to prevent accidental changes

---

## Project structure

```
pomodoro-timer/
├── index.html          # App shell — timer card, mode toggle, settings panel
├── src/
│   ├── main.js         # All application logic (timer, settings, audio, theming)
│   └── style.css       # Design tokens, layout, components, animations
├── Docs/
│   ├── brainstorm.md   # Original idea and version roadmap
│   ├── stage-1-mvp.md  # MVP specification
│   ├── stage-2.md      # Stage 2 feature plans
│   └── readme.md       # This file
├── package.json
├── pnpm-lock.yaml
└── .gitignore
```

---

## Development history

The project was built incrementally across two main stages, with each commit representing a deliberate, working step forward.

### Stage 1 — MVP (Feb 22, 2026)

The goal was the simplest possible Pomodoro timer: a countdown, basic controls, and two modes.

| Commit | What happened |
|--------|---------------|
| `aa0ffb3` — Initial Vite project setup | Scaffolded the project with Vite as the bundler. |
| `0c89cbf` — Test branch workflow | Verified the Git branching workflow before building features. |
| `5d5f218` — Add design tokens and base styles | Created a CSS design token system (spacing, typography, colors, radii, shadows) and base reset styles. This established the visual language for the entire app. |
| `2edbfb0` — Add timer HTML structure and styles | Built the timer card UI: the time display, Start/Pause and Reset buttons, and a mode indicator. Styled with a brutalist aesthetic — thick borders, hard shadows, monospace numerals. |
| `9bf3b0a` — Add timer logic with start/pause, reset and mode switching | Wired up all MVP logic in `main.js`: countdown via `setInterval`, start/pause toggling, reset, and automatic work→break→work mode switching when the timer reaches zero. |

**Result:** A fully functional Pomodoro timer with 25-minute work sessions and 5-minute breaks, auto-switching between modes.

---

### Stage 2 — Settings, customization, and polish (Feb 23, 2026)

Stage 2 expanded the app significantly with user-configurable settings, sound, shortcuts, a third mode, a schedule view, and a complete visual overhaul.

#### 2.0 — Settings panel & sound

| Commit | What happened |
|--------|---------------|
| `ee66e4f` — Added stage 2 documentation | Wrote the Stage 2 spec: custom durations and sound notifications. |
| `591d696` — Added settings panel | Built a collapsible top-bar settings panel with number inputs for work and break durations. Added the gear toggle button. |
| `ddf920f` — Settings polish + sound | Swapped the toggle icon, disabled settings while the timer runs (with a tooltip explaining why), and added Web Audio API–based notification sounds — a higher-pitched triple beep when work ends, a lower double beep when break ends. |
| `d8ddcfe` — CSS polish | Minor layout adjustment (space-between alignment in settings). |
| `4f7a832` — Focus outline tokens | Tuned the CSS tokens for focus-visible outlines across interactive elements. |
| `08bd3f8` — Merge branch 'stage-2-settings' | Merged the settings feature branch into main. |

#### 2.1 — Shortcuts & mode toggling

| Commit | What happened |
|--------|---------------|
| `60caac1` — Added time shortcuts | Introduced quick-set shortcut buttons (15m / 25m / 45m / 60m for work; 2m / 5m / 15m for break) inside the settings panel. Improved responsive behavior. |
| `ec4f3a9` — Added manual mode toggle | Added a Work / Break toggle bar at the top of the timer card so users can manually switch modes without waiting for the timer to expire. |

#### 2.2 — Color & theming experiments

| Commit | What happened |
|--------|---------------|
| `d38421f` — Color customization + dark mode behavior | Added a hue slider that re-derives the entire color palette in JS. Changed the dark theme to activate only during running work sessions (light for everything else). |

#### Long breaks & schedule

| Commit | What happened |
|--------|---------------|
| `2a3c9e8` — Added long breaks | Introduced a third mode: Long Break. Added a "long break every N sessions" setting. The timer auto-inserts a long break after the configured number of work sessions. Added shortcut buttons for long break durations. |
| `0d9770d` — Added schedule timeline | Built a timeline below the timer card that previews the upcoming sequence of work / break / long break blocks, with the current session highlighted and a pulsing dot while running. |

#### Visual overhaul & final polish

| Commit | What happened |
|--------|---------------|
| `8978c36` — Visual style change | Overhauled the visual design of the app. |
| `e17866f` — Responsiveness and readability | Improved layout on narrow screens and general readability refinements. |
| `aa8d9eb` — Keyboard shortcuts | Added keyboard shortcuts: `Space` for start/pause, `R` for reset, `[` and `]` to cycle through modes. Displayed shortcut hints as `<kbd>` badges on buttons and beside the mode toggle. |
| `e9fffef` — Color adjustments to running timers | Fine-tuned how timer text colors respond during active break and long break sessions, ensuring the accent colors are clearly visible in both light and dark themes. |

---

## Running locally

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
pnpm build
pnpm preview
```

---

## Potential future work (Stage 3)

These ideas were noted during brainstorming but remain hypothetical:

- Task logging — name what you're working on each session
- Notion integration to persist a history of completed sessions
- End-of-session celebration UI