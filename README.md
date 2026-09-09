# TrackMate

A simple, local-first workout log built with Expo (SDK 57) and React Native.

## Features

- Start a workout and add exercises from a seeded list or a custom name
- Log sets (weight in kg, reps, optional note) with basic input validation
- View total volume per exercise
- Workout history, stored on-device via AsyncStorage — no backend required

## Getting started

```bash
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or `w` for web.

## Project structure

```
App.tsx                 # Top-level state and screen routing
src/
  screens/               # HomeScreen, WorkoutScreen
  components/            # ExerciseCard, History
  storage/               # AsyncStorage read/write helpers
  types/                 # Shared Workout/Exercise/SetEntry types
  theme/                 # Color tokens
```

## Scripts

- `npm run lint` — ESLint (Expo config)
- `npm run format` — Prettier, writes changes
- `npm run typecheck` — TypeScript, no emit

## Workflow

- Work happens on feature branches, merged into `main` via pull request.
- Run `npm run lint`, `npm run format`, and `npm run typecheck` before opening a PR.

## Known gaps

- No editing or deleting a set, exercise, or completed workout yet
- An in-progress workout is not persisted — force-quitting mid-workout loses it
- No automated tests yet
