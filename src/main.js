const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 25 * 60;

let timeRemaining = WORK_SECONDS;
let isRunning = false;
let currentMode = "work";
let intervalId = null;

const app = document.getElementById("app");
const modeLabel = document.getElementById("mode-label");
const timeDisplay = document.getElementById("time-display");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");

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
    timeRemaining = currentMode === "work" ? WORK_SECONDS : BREAK_SECONDS;
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
  timeRemaining = WORK_SECONDS;
  startPauseBtn.textContent = "Start";
  updateDisplay();
}

startPauseBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);

updateDisplay();
