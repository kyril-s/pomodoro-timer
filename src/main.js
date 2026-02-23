let workSeconds = 25 * 60;
let breakSeconds = 5 * 60;

let timeRemaining = workSeconds;
let isRunning = false;
let currentMode = "work";
let intervalId = null;

const app = document.getElementById("app");
const modeLabel = document.getElementById("mode-label");
const timeDisplay = document.getElementById("time-display");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");
const workDurationInput = document.getElementById("work-duration");
const breakDurationInput = document.getElementById("break-duration");
const settingsPanel = document.querySelector(".settings-panel");
const settingsToggleBtn = document.getElementById("settings-toggle-btn");
const settingsFieldset = document.getElementById("settings-fieldset");

let audioCtx;

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

function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timeDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

  modeLabel.textContent = currentMode === "work" ? "Work" : "Break";
  app.dataset.mode = currentMode;
}

function tick() {
  timeRemaining--;

  if (timeRemaining < 0) {
    const wasWork = currentMode === "work";
    currentMode = wasWork ? "break" : "work";
    timeRemaining = currentMode === "work" ? workSeconds : breakSeconds;

    playNotification(wasWork ? 880 : 660, wasWork ? 3 : 2);

    const flashClass = wasWork ? "flash-break" : "flash-work";
    document.body.classList.remove("flash-work", "flash-break");
    void document.body.offsetWidth;
    document.body.classList.add(flashClass);
  }

  updateDisplay();
}

function lockSettings(locked) {
  settingsFieldset.disabled = locked;
  settingsFieldset.title = locked ? "Pause the timer to edit" : "";
}

function startPause() {
  if (isRunning) {
    clearInterval(intervalId);
    intervalId = null;
    startPauseBtn.textContent = "Start";
    lockSettings(false);
  } else {
    intervalId = setInterval(tick, 1000);
    startPauseBtn.textContent = "Pause";
    lockSettings(true);
  }
  isRunning = !isRunning;
}

function reset() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  currentMode = "work";
  timeRemaining = workSeconds;
  startPauseBtn.textContent = "Start";
  lockSettings(false);
  updateDisplay();
}

function applySettings() {
  const workMin = Math.max(1, Math.min(120, Number(workDurationInput.value) || 25));
  const breakMin = Math.max(1, Math.min(60, Number(breakDurationInput.value) || 5));

  workSeconds = workMin * 60;
  breakSeconds = breakMin * 60;

  if (!isRunning) {
    timeRemaining = currentMode === "work" ? workSeconds : breakSeconds;
    updateDisplay();
  }
}

settingsToggleBtn.addEventListener("click", () => settingsPanel.classList.toggle("open"));

startPauseBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);
workDurationInput.addEventListener("change", applySettings);
breakDurationInput.addEventListener("change", applySettings);

updateDisplay();
