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

# Stage 2.1 - Time management

I want to add a simple shorcut functionality instead of manually inputting timers every time. Also I want to be able to skil to skip to break. 

## Added actions
1. Shorcuts devided in 2 sections -- Break / Work
    - Set the work timer to 15, 25, 45, 60 minutes
    - Set the break timer to 2, 5, 15 minutes
2. Manually toggle Work/Break with UI

# Stage 2.2 - Color experiments
- Switch light / dark when timer is running instead of just switching colors


# Stage 3
Connection to Notion (Hypothetical still)