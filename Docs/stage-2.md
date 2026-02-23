#App expansion 

Since the original idea works as expected, I want to add a few things to expland it. 

## Features
- A settings UI where users can set custom work and break durations
- A sound notification when the timer reaches zero (different sound on work/break)

## New state
- workDuration and breakDuration — user-configurable values (replacing the constants)
- These need to be read from the settings UI and applied to the timer

## New interface elements
- Input fields for work and break duration (in minutes)
- Possibly a settings panel that shows/hides, or just sits below the timer

## What changes in existing code
- WORK_DURATION and BREAK_DURATION are currently constants. They’ll need to become values that can be updated from the settings UI.
- switchMode() and resetTimer() should use the new configurable durations.

