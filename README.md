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

## Dependency Updates

Renovate tracks npm packages, the Docker base image, and GitHub Actions using
[`renovate.json`](renovate.json). Routine updates are scheduled for Friday mornings
(00:00–12:00, Europe/Paris), with recommended dependency grouping and a Dependency Dashboard
issue. Renovate automatically merges update PRs after their checks pass, including
major updates. Renovate performs the merge itself (`platformAutomerge: false`), so
GitHub's "Allow auto-merge" repository setting is not required. Existing branch
protection rules still apply.

To activate it, enable the [Renovate GitHub App](https://github.com/apps/renovate)
for `SamArgt/meditation` and merge the configuration into the default branch.

Validate configuration changes with:

```bash
npx --yes --package renovate -- renovate-config-validator --strict renovate.json
```

## Docker

Build and run with Docker:

```bash
docker build -t meditation .
docker run -p 3000:3000 meditation
```

## Releases

Pull requests to `main` run lint, release-script tests, and a production build.
Each push to `main` (including a PR merge) runs the same checks, creates a version
tag, and publishes that exact tagged commit to `ghcr.io/samargt/meditation`.
Main releases queue and run one at a time so overlapping merges can each publish.

Automatic tags continue the latest beta series (`v1.0.0-beta.6` →
`v1.0.0-beta.7`). After a stable tag is pushed manually, subsequent releases bump
the patch version (`v1.0.0` → `v1.0.1`). Re-running a release reuses the commit's
existing version tag.

The release workflow calls the Docker workflow explicitly after pushing its tag:
[GitHub does not start another push workflow for tags created with `GITHUB_TOKEN`](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
This uses the built-in token and needs no additional secret. Manually pushed
`v*` tags also trigger Docker publishing.

Images receive the version tag without the `v` prefix and a short commit SHA tag.
Automatic main releases also update the `main` image tag. Stable releases receive
the major/minor and `latest` aliases; beta releases retain their full beta version.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Serwist (PWA/Service Worker)
