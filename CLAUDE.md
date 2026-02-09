# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimalist meditation timer PWA (Progressive Web App) with Tibetan bowl gong sounds. The UI is in French.

## Development Commands

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build (uses --webpack flag)
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Serwist for PWA service worker

## Architecture

The app is a single-page timer with three custom hooks that handle core functionality:

**Custom Hooks (src/hooks/)**
- `useTimer` - RAF-based countdown timer using `performance.now()` for accuracy. Handles Page Visibility API to stay accurate when tab is backgrounded.
- `useAudio` - Web Audio API wrapper that preloads gong sounds into AudioBuffers. Requires user gesture to init (mobile browser policy).
- `useWakeLock` - Screen Wake Lock API to prevent device sleep during meditation. Re-acquires lock on visibility change.

**State Flow**
- Main page (`src/app/page.tsx`) orchestrates all hooks and components
- Settings (duration, interval) persist to localStorage via `src/lib/storage.ts`
- Timer triggers interval gongs based on elapsed time tracking; end gong plays on completion

**PWA Setup**
- Service worker source: `src/app/sw.ts`
- Generated service worker: `public/sw.js` (gitignored)
- Manifest: `src/app/manifest.ts`
- Serwist handles precaching and runtime caching

## Path Aliases

Use `@/*` to import from `src/*` (e.g., `@/components/CircularProgress`).

## Notes

- Audio initialization must happen in a user gesture (click handler) for iOS Safari compatibility
- The `_bmad` directory contains a separate workflow framework and is not part of the app code
