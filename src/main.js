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
    currentMode = currentMode === "work" ? "break" : "work";
    timeRemaining = currentMode === "work" ? workSeconds : breakSeconds;
  }

  updateDisplay();
}

function startPause() {
  if (isRunning) {
    clearInterval(intervalId);
    intervalId = null;
    startPauseBtn.textContent = "Start";
  } else {
    intervalId = setInterval(tick, 1000);
    startPauseBtn.textContent = "Pause";
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

const settingsPanel = document.querySelector(".settings-panel");
const settingsToggleBtn = document.getElementById("settings-toggle-btn");
settingsToggleBtn.addEventListener("click", () => settingsPanel.classList.toggle("open"));

startPauseBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);
workDurationInput.addEventListener("change", applySettings);
breakDurationInput.addEventListener("change", applySettings);

updateDisplay();
