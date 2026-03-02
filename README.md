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

Important: offline mode only works in production (service worker is disabled in `npm run dev`).

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

## Debugging iPhone audio issues (double gong)

The app now emits detailed console logs with these prefixes:

- `[meditation-timer-debug]` (timer lifecycle + gong trigger conditions)
- `[meditation-audio-debug]` (audio init/playback/anti-duplicate guard)

### How to view iPhone Safari console logs on your Mac

1. On iPhone, open **Settings → Safari → Advanced** and enable **Web Inspector**.
2. Connect the iPhone to your Mac with a cable (or same Wi-Fi + trusted pairing).
3. On Mac Safari, enable the developer menu via **Safari → Settings → Advanced → Show Develop menu in menu bar**.
4. Open the meditation app in Safari on the iPhone.
5. On the Mac, go to **Develop → _Your iPhone Name_ → _current page_**.
6. In the Web Inspector, open the **Console** tab and reproduce the issue.
7. Filter logs by `meditation-timer-debug` or `meditation-audio-debug`.

Tip: capture timestamps around the duplicate gongs (especially near session end) and share the console extract.
