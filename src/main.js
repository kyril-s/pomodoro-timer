let workSeconds = 25 * 60;
let breakSeconds = 5 * 60;
let longBreakSeconds = 25 * 60;
let longBreakInterval = 2;
let completedWorkSessions = 0;

let timeRemaining = workSeconds;
let isRunning = false;
let currentMode = "work";
let intervalId = null;
let audioCtx;
let currentHue = 330;

const app = document.getElementById("app");
const timeDisplay = document.getElementById("time-display");
const startPauseBtn = document.getElementById("start-pause-btn");
const startPauseLabel = startPauseBtn.querySelector(".btn-label");
const resetBtn = document.getElementById("reset-btn");
const modeWorkBtn = document.getElementById("mode-work-btn");
const modeBreakBtn = document.getElementById("mode-break-btn");
const modeLongBreakBtn = document.getElementById("mode-long-break-btn");
const workDurationInput = document.getElementById("work-duration");
const breakDurationInput = document.getElementById("break-duration");
const longBreakDurationInput = document.getElementById("long-break-duration");
const longBreakIntervalInput = document.getElementById("long-break-interval");
const settingsPanel = document.querySelector(".settings-panel");
const settingsToggleBtn = document.getElementById("settings-toggle-btn");
const settingsFieldset = document.getElementById("settings-fieldset");
const themeHueInput = document.getElementById("theme-hue");
const scheduleEl = document.getElementById("schedule");

/* ---- Dynamic color system ---------------------------------------- */

function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`;
}

function hsla(h, s, l, a) {
  return `hsl(${h} ${s}% ${l}% / ${a})`;
}

function applyColors(isDark) {
  const h = currentHue;
  const root = document.documentElement.style;

  const workS = 65;
  const breakH = (h + 150) % 360;
  const breakS = 55;
  const longH = (h + 80) % 360;
  const longS = 60;

  if (isDark) {
    root.setProperty("--pmdr-clr-surface-page", hsl(h, 30, 6));
    root.setProperty("--pmdr-clr-surface-card", hsl(h, 30, 12));
    root.setProperty("--pmdr-clr-surface-raised", hsl(h, 28, 18));

    root.setProperty("--pmdr-clr-on-surface-text", hsl(h, 12, 92));
    root.setProperty("--pmdr-clr-on-surface-text-secondary", hsl(h, 12, 63));
    root.setProperty("--pmdr-clr-on-surface-text-muted", hsl(h, 10, 43));

    root.setProperty("--pmdr-clr-on-surface-work", hsl(h, workS, 68));
    root.setProperty("--pmdr-clr-on-surface-work-dim", hsl(h, 35, 15));
    root.setProperty("--pmdr-clr-on-surface-work-glow", hsla(h, workS, 68, 0.25));

    root.setProperty("--pmdr-clr-on-surface-break", hsl(breakH, breakS, 68));
    root.setProperty("--pmdr-clr-on-surface-break-dim", hsl(breakH, 30, 14));
    root.setProperty("--pmdr-clr-on-surface-break-glow", hsla(breakH, breakS, 68, 0.25));

    root.setProperty("--pmdr-clr-on-surface-long-break", hsl(longH, longS, 68));
    root.setProperty("--pmdr-clr-on-surface-long-break-dim", hsl(longH, 30, 14));
    root.setProperty("--pmdr-clr-on-surface-long-break-glow", hsla(longH, longS, 68, 0.25));

    root.setProperty("--pmdr-clr-action-primary", "#f0f0f0");
    root.setProperty("--pmdr-clr-action-primary-text", "#111111");

    root.setProperty("--pmdr-clr-on-surface-interactive-focus-ring", hsla(h, 60, 70, 0.5));
  } else {
    root.setProperty("--pmdr-clr-surface-page", hsl(h, 8, 93));
    root.setProperty("--pmdr-clr-surface-card", hsl(h, 8, 96));
    root.setProperty("--pmdr-clr-surface-raised", hsl(h, 6, 91));

    root.setProperty("--pmdr-clr-on-surface-text", hsl(h, 20, 14));
    root.setProperty("--pmdr-clr-on-surface-text-secondary", hsl(h, 14, 43));
    root.setProperty("--pmdr-clr-on-surface-text-muted", hsl(h, 10, 63));

    root.setProperty("--pmdr-clr-on-surface-work", hsl(h, workS, 42));
    root.setProperty("--pmdr-clr-on-surface-work-dim", hsl(h, 40, 95));
    root.setProperty("--pmdr-clr-on-surface-work-glow", hsla(h, workS, 42, 0.15));

    root.setProperty("--pmdr-clr-on-surface-break", hsl(breakH, breakS, 35));
    root.setProperty("--pmdr-clr-on-surface-break-dim", hsl(breakH, 35, 95));
    root.setProperty("--pmdr-clr-on-surface-break-glow", hsla(breakH, breakS, 35, 0.15));

    root.setProperty("--pmdr-clr-on-surface-long-break", hsl(longH, longS, 38));
    root.setProperty("--pmdr-clr-on-surface-long-break-dim", hsl(longH, 35, 95));
    root.setProperty("--pmdr-clr-on-surface-long-break-glow", hsla(longH, longS, 38, 0.15));

    root.setProperty("--pmdr-clr-action-primary", "#1a1a1a");
    root.setProperty("--pmdr-clr-action-primary-text", "#ffffff");

    root.setProperty("--pmdr-clr-on-surface-interactive-focus-ring", hsla(h, 70, 60, 0.5));
  }
}

function applyTheme() {
  const isDark = isRunning && currentMode === "work";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  applyColors(isDark);
}

/* ---- Audio -------------------------------------------------------- */

function playNotification(frequency, count) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  for (let i = 0; i < count; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.value = frequency;
    osc.type = "sine";

    const start = audioCtx.currentTime + i * 0.25;
    gain.gain.setValueAtTime(0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

    osc.start(start);
    osc.stop(start + 0.2);
  }
}

/* ---- Display & timer core ---------------------------------------- */

function secondsForMode(mode) {
  if (mode === "work") return workSeconds;
  if (mode === "longBreak") return longBreakSeconds;
  return breakSeconds;
}

function formatMin(secs) {
  return Math.ceil(secs / 60) + "m";
}

function modeLabel(mode) {
  if (mode === "work") return "Work";
  if (mode === "longBreak") return "Long Break";
  return "Break";
}

function buildSchedule() {
  const steps = [];
  const totalItems = 8;
  let simWork = completedWorkSessions;
  let simMode = currentMode;

  steps.push({ mode: simMode, seconds: secondsForMode(simMode) });

  while (steps.length < totalItems) {
    if (simMode === "work") {
      simWork++;
      const useLong =
        longBreakInterval > 0 && simWork % longBreakInterval === 0;
      simMode = useLong ? "longBreak" : "break";
    } else {
      simMode = "work";
    }
    steps.push({ mode: simMode, seconds: secondsForMode(simMode) });
  }

  return steps;
}

function renderSchedule() {
  const steps = buildSchedule();

  scheduleEl.innerHTML = steps
    .map((step, i) => {
      const cls = i === 0 ? "active" : "";
      return `<div class="schedule-item ${cls}" data-sched-mode="${step.mode}">
        <span class="schedule-item-dot"></span>
        <span class="schedule-item-label">${modeLabel(step.mode)}</span>
        <span class="schedule-item-duration">${formatMin(step.seconds)}</span>
      </div>`;
    })
    .join("");
}

function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timeDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

  modeWorkBtn.classList.toggle("active", currentMode === "work");
  modeBreakBtn.classList.toggle("active", currentMode === "break");
  modeLongBreakBtn.classList.toggle("active", currentMode === "longBreak");
  app.dataset.mode = currentMode;
  app.dataset.running = isRunning;
  applyTheme();
  renderSchedule();
}

function tick() {
  timeRemaining--;

  if (timeRemaining < 0) {
    const wasWork = currentMode === "work";

    if (wasWork) {
      completedWorkSessions++;
      const useLongBreak =
        longBreakInterval > 0 &&
        completedWorkSessions % longBreakInterval === 0;
      currentMode = useLongBreak ? "longBreak" : "break";
      timeRemaining = useLongBreak ? longBreakSeconds : breakSeconds;
    } else {
      currentMode = "work";
      timeRemaining = workSeconds;
    }

    playNotification(wasWork ? 880 : 660, wasWork ? 3 : 2);

    const flashMap = { work: "flash-work", break: "flash-break", longBreak: "flash-long-break" };
    const flashClass = flashMap[currentMode];
    document.body.classList.remove("flash-work", "flash-break", "flash-long-break");
    void document.body.offsetWidth;
    document.body.classList.add(flashClass);
  }

  updateDisplay();
}

/* ---- Timer controls ----------------------------------------------- */

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  startPauseLabel.textContent = "Start";
  settingsFieldset.disabled = false;
  settingsFieldset.title = "";
}

function startPause() {
  if (isRunning) {
    stopTimer();
  } else {
    intervalId = setInterval(tick, 1000);
    isRunning = true;
    startPauseLabel.textContent = "Pause";
    settingsFieldset.disabled = true;
    settingsFieldset.title = "Pause the timer to edit";
  }
  applyTheme();
}

function reset() {
  stopTimer();
  currentMode = "work";
  completedWorkSessions = 0;
  timeRemaining = workSeconds;
  updateDisplay();
}

function switchMode(newMode) {
  if (newMode === currentMode) return;
  stopTimer();
  currentMode = newMode;
  timeRemaining = secondsForMode(currentMode);
  updateDisplay();
}

/* ---- Settings ----------------------------------------------------- */

function applySettings() {
  const workMin = Math.max(1, Math.min(120, Number(workDurationInput.value) || 25));
  const breakMin = Math.max(1, Math.min(60, Number(breakDurationInput.value) || 5));
  const longBreakMin = Math.max(1, Math.min(120, Number(longBreakDurationInput.value) || 25));
  const interval = Math.max(0, Math.min(20, Number(longBreakIntervalInput.value) || 0));

  workSeconds = workMin * 60;
  breakSeconds = breakMin * 60;
  longBreakSeconds = longBreakMin * 60;
  longBreakInterval = interval;

  if (!isRunning) {
    timeRemaining = secondsForMode(currentMode);
    updateDisplay();
  }
}

function handleShortcut(e) {
  const btn = e.target.closest(".btn-shortcut");
  if (!btn || settingsFieldset.disabled) return;

  const target = btn.dataset.target;
  const minutes = Number(btn.dataset.minutes);

  if (target === "work") {
    workDurationInput.value = minutes;
    workSeconds = minutes * 60;
    if (!isRunning && currentMode === "work") {
      timeRemaining = workSeconds;
    }
  } else if (target === "longBreak") {
    longBreakDurationInput.value = minutes;
    longBreakSeconds = minutes * 60;
    if (!isRunning && currentMode === "longBreak") {
      timeRemaining = longBreakSeconds;
    }
  } else {
    breakDurationInput.value = minutes;
    breakSeconds = minutes * 60;
    if (!isRunning && currentMode === "break") {
      timeRemaining = breakSeconds;
    }
  }

  updateDisplay();
}

/* ---- Keyboard shortcuts ------------------------------------------- */

const modes = ["work", "break", "longBreak"];

function switchModeForward() {
  const idx = modes.indexOf(currentMode);
  switchMode(modes[(idx + 1) % modes.length]);
}

function switchModeBackward() {
  const idx = modes.indexOf(currentMode);
  switchMode(modes[(idx - 1 + modes.length) % modes.length]);
}

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      startPause();
      break;
    case "KeyR":
      reset();
      break;
    case "BracketRight":
      switchModeForward();
      break;
    case "BracketLeft":
      switchModeBackward();
      break;
  }
});

/* ---- Event listeners ---------------------------------------------- */

document.body.addEventListener("animationend", () => {
  document.body.classList.remove("flash-work", "flash-break", "flash-long-break");
});

settingsToggleBtn.addEventListener("click", () => settingsPanel.classList.toggle("open"));
settingsFieldset.addEventListener("click", handleShortcut);

modeWorkBtn.addEventListener("click", () => switchMode("work"));
modeBreakBtn.addEventListener("click", () => switchMode("break"));
modeLongBreakBtn.addEventListener("click", () => switchMode("longBreak"));

startPauseBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);
workDurationInput.addEventListener("change", applySettings);
breakDurationInput.addEventListener("change", applySettings);
longBreakDurationInput.addEventListener("change", applySettings);
longBreakIntervalInput.addEventListener("change", applySettings);
themeHueInput.addEventListener("input", () => {
  currentHue = Number(themeHueInput.value);
  applyTheme();
});

/* ---- Init --------------------------------------------------------- */

currentHue = Number(themeHueInput.value);
updateDisplay();
