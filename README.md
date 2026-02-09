# Meditation Timer

A minimalist meditation timer PWA with Tibetan bowl gong sounds.

## Features

- Configurable session duration (5-60 minutes)
- Interval gongs during meditation
- End-of-session gong
- Offline support (PWA)
- Screen wake lock to prevent device sleep
- Settings persistence

## Requirements

- Node.js 22+
- npm 10+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Note: The service worker is disabled in development mode.

## Production Build

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## Docker

Build and run with Docker:

```bash
docker build -t meditation .
docker run -p 3000:3000 meditation
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Serwist (PWA/Service Worker)
