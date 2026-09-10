# TrackMate

A workout log built with Expo (SDK 57), React Native, and Supabase.

## Features

- Email/password sign-in; workouts are private to your account (Postgres row-level security)
- Start a workout and add exercises from a seeded list or a custom name
- Log sets (weight in kg, reps, optional note) with basic input validation
- View total volume per exercise
- Workout history, synced via Supabase — available on any device you sign into

## Getting started

Requires a `.env` file (not checked in) with:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the schema in `supabase/migrations/` against your Supabase project's SQL editor before first use.

```bash
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or `w` for web.

## Project structure

```
App.tsx                 # Top-level state and screen routing
src/
  screens/               # AuthScreen, HomeScreen, WorkoutScreen
  components/            # ExerciseCard, History
  data/                  # Supabase client, auth, and workout read/write
  types/                 # Shared Workout/Exercise/SetEntry types
  theme/                 # Color tokens
supabase/
  migrations/            # Versioned SQL schema + RLS policies
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
