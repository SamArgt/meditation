# Story 3.1: Configuration PWA & Installation

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux pouvoir installer l'app sur mon ecran d'accueil,
Afin d'y acceder rapidement comme une app native.

## Acceptance Criteria

1. **Given** le projet Next.js avec @serwist/next **When** je configure next.config.ts **Then** le Service Worker est genere automatiquement au build **And** la configuration utilise la strategie cache-first via defaultCache

2. **Given** le fichier manifest.ts est cree **When** l'app est chargee **Then** le manifest contient : name, short_name, description, theme_color, background_color **And** les icones sont definies (192x192, 512x512, apple-touch-icon)

3. **Given** les icones PWA sont dans /public/icons/ **When** je verifie les assets **Then** icon-192.png, icon-512.png et apple-touch-icon.png existent **And** ils respectent les dimensions requises

4. **Given** je visite l'app sur mobile (Chrome Android) **When** les criteres PWA sont remplis **Then** le navigateur propose l'installation ("Ajouter a l'ecran d'accueil") **And** l'app installee s'ouvre en mode standalone (FR13)

5. **Given** je visite l'app sur iOS Safari **When** j'utilise "Ajouter a l'ecran d'accueil" **Then** l'app s'installe avec l'icone apple-touch-icon **And** elle fonctionne en mode standalone (avec limitations iOS acceptees)

## Tasks / Subtasks

- [x] Task 1: Configurer @serwist/next dans next.config.ts (AC: #1)
  - [x] 1.1: Importer `withSerwistInit` de `@serwist/next` et wrapper la config Next.js existante
  - [x] 1.2: Configurer `swSrc: "src/app/sw.ts"` et `swDest: "public/sw.js"`
  - [x] 1.3: Ajouter `disable: process.env.NODE_ENV === "development"` pour eviter les erreurs Turbopack en dev

- [x] Task 2: Creer le Service Worker src/app/sw.ts (AC: #1)
  - [x] 2.1: Importer `defaultCache` de `@serwist/next/worker` et `Serwist`, `PrecacheEntry`, `SerwistGlobalConfig` de `serwist`
  - [x] 2.2: Declarer le type global `WorkerGlobalScope` avec `__SW_MANIFEST`
  - [x] 2.3: Instancier `new Serwist()` avec : `precacheEntries: self.__SW_MANIFEST`, `skipWaiting: true`, `clientsClaim: true`, `navigationPreload: true`, `runtimeCaching: defaultCache`
  - [x] 2.4: Appeler `serwist.addEventListeners()`
  - [x] 2.5: NE PAS ajouter de fallback offline (page unique, tout est pre-cache)

- [x] Task 3: Creer le manifest.ts (AC: #2)
  - [x] 3.1: Creer `src/app/manifest.ts` exportant une fonction `manifest(): MetadataRoute.Manifest`
  - [x] 3.2: Definir : `name: "Meditation"`, `short_name: "Meditation"`, `description: "Timer de meditation minimaliste avec gongs de bol tibetain"`
  - [x] 3.3: Definir : `start_url: "/"`, `display: "standalone"`, `orientation: "portrait"`
  - [x] 3.4: Couleurs conformes au design system : `background_color: "#F5F7F9"`, `theme_color: "#5A8F9A"`
  - [x] 3.5: Definir les icones : `icon-192.png` (192x192, purpose "maskable"), `icon-512.png` (512x512), `apple-touch-icon.png` (180x180)

- [x] Task 4: Generer les icones PWA dans public/icons/ (AC: #3)
  - [x] 4.1: Generer icon-192.png (192x192) — design minimaliste, cercle accent (#5A8F9A) sur fond background (#F5F7F9) avec symbole de meditation
  - [x] 4.2: Generer icon-512.png (512x512) — meme design que icon-192 a plus haute resolution
  - [x] 4.3: Generer apple-touch-icon.png (180x180) — variante pour iOS
  - [x] 4.4: Alternative simple : generer des icones SVG-to-PNG avec un cercle de couleur accent et la lettre "M" au centre

- [x] Task 5: Ajouter les meta tags PWA dans layout.tsx (AC: #4, #5)
  - [x] 5.1: Ajouter dans metadata : `appleWebApp: { capable: true, statusBarStyle: "default", title: "Meditation" }`
  - [x] 5.2: Ajouter dans metadata : `icons: { apple: "/icons/apple-touch-icon.png" }`
  - [x] 5.3: NE PAS ajouter manuellement le lien manifest (Next.js le fait automatiquement avec manifest.ts)

- [x] Task 6: Configurer tsconfig.json pour Serwist (AC: #1)
  - [x] 6.1: Ajouter `"webworker"` dans `compilerOptions.lib`
  - [x] 6.2: Ajouter `"@serwist/next/typings"` dans `compilerOptions.types` (nouveau champ a creer)
  - [x] 6.3: Ajouter `"public/sw.js"` dans `exclude`

- [x] Task 7: Mettre a jour .gitignore (AC: #1)
  - [x] 7.1: Ajouter les fichiers generes par Serwist : `public/sw.js`, `public/sw.js.map`, `public/swe-worker-*.js`, `public/swe-worker-*.js.map`

- [x] Task 8: Verification build + lint + installabilite (AC: all)
  - [x] 8.1: `npm run build` sans erreurs — Service Worker genere (sw.js 42KB)
  - [x] 8.2: `npm run lint` sans erreurs (0 problems)
  - [x] 8.3: Manifest genere a `/manifest.webmanifest` (verifie dans .next/server/app/)
  - [ ] 8.4: Verification manuelle requise : Lighthouse PWA audit
  - [ ] 8.5: Verification manuelle requise : Chrome DevTools > Application > Manifest
  - [ ] 8.6: Verification manuelle requise : Chrome DevTools > Application > Service Workers
  - [ ] 8.7: Verification manuelle requise : Zero regression app fonctionnelle

## Dev Notes

### Architecture Compliance

**Layer Boundaries (Architecture document) :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `next.config.ts` | Configuration Next.js | MODIFIER — wrapper withSerwist |
| `src/app/sw.ts` | Service Worker | CREER — nouvelle entree worker |
| `src/app/manifest.ts` | PWA Manifest | CREER — metadata d'installation |
| `src/app/layout.tsx` | Layout racine | MODIFIER — meta tags Apple PWA |
| `public/icons/` | Assets statiques | CREER — icones PWA |
| `tsconfig.json` | Configuration TypeScript | MODIFIER — types Serwist |
| `.gitignore` | Fichiers ignores | MODIFIER — fichiers generes SW |

**Fichiers a NE PAS TOUCHER :**
- `src/app/page.tsx` — Aucune modification necessaire
- `src/hooks/useTimer.ts`, `src/hooks/useAudio.ts` — Logique metier intacte
- `src/components/*` — Tous les composants UI intacts
- `src/lib/*` — Utilitaires intacts
- `src/app/globals.css` — Styles intacts
- `public/sounds/*` — Fichiers audio intacts
- `package.json` — @serwist/next DEJA installe (^9.5.4), NE PAS ajouter de dependance

### Technical Requirements

**@serwist/next v9.5.4 — Points critiques :**

| Aspect | Decision | Raison |
|--------|----------|--------|
| Package PWA | `@serwist/next` 9.5.4 (DEJA installe) | L'architecture mentionne `@ducanh2912/next-pwa` mais le projet utilise `@serwist/next` — NE PAS changer |
| SW source | `src/app/sw.ts` | Conforme convention App Router |
| SW output | `public/sw.js` | Convention standard Serwist |
| Runtime caching | `defaultCache` de `@serwist/next/worker` | Inclut deja cache-first pour audio (.mp3), images, fonts, JS, CSS |
| Manifest | `src/app/manifest.ts` (Next.js natif) | Next.js genere automatiquement `<link rel="manifest">` |
| Turbopack | `disable` en dev | `withSerwistInit` incompatible avec Turbopack |

**defaultCache inclut deja le cache audio :**
- `.mp3/.wav/.ogg` → `CacheFirst` avec `RangeRequestsPlugin` (essentiel pour streaming audio)
- Cache name: `static-audio-assets`, expiration 24h, 32 entrees
- Les fichiers `gong-interval.mp3` et `gong-end.mp3` seront automatiquement caches

**Configuration du manifest — conformite design system :**
- `background_color: "#F5F7F9"` → correspond au token `background` de globals.css
- `theme_color: "#5A8F9A"` → correspond au token `accent` de globals.css
- `display: "standalone"` → mode app native (pas de barre d'adresse)
- `orientation: "portrait"` → conforme UX spec (portrait uniquement)

**Next.js 16.1.6 + @serwist/next :**
- Le `withSerwistInit` retourne une fonction qui wrappe la config Next.js
- Le SW est compile par le webpack plugin de Serwist au `npm run build`
- En dev, Serwist doit etre desactive (`disable: true`) car incompatible avec Turbopack
- `self.__SW_MANIFEST` est injecte automatiquement au build avec la liste des assets a pre-cacher

**Serwist v9.x — breaking changes a respecter :**
- Toutes les importations SW viennent de `"serwist"` (package unifie)
- `defaultCache` s'importe de `"@serwist/next/worker"` (PAS `@serwist/next/browser`)
- Les handlers sont des instances de classes (`new CacheFirst()`) pas des strings
- `urlPattern` est renomme en `matcher`
- Classe unifiee `Serwist` remplace les anciens `installSerwist`, `PrecacheController`, `Router`

### Library & Framework Requirements

**Aucune nouvelle dependance requise.**

Packages deja installes utilises :
- `@serwist/next` ^9.5.4 — configuration next.config.ts + import defaultCache dans sw.ts
- `serwist` (peer dependency de @serwist/next) — classes Serwist, PrecacheEntry, SerwistGlobalConfig
- `next` 16.1.6 — MetadataRoute.Manifest type pour manifest.ts

**IMPORTANT : NE PAS installer `@ducanh2912/next-pwa` ou tout autre package PWA. Le projet utilise deja `@serwist/next`.**

### File Structure Requirements

**Fichiers a CREER :**
- `src/app/sw.ts` — Service Worker source (~25 lignes)
- `src/app/manifest.ts` — PWA manifest (~30 lignes)
- `public/icons/icon-192.png` — Icone 192x192
- `public/icons/icon-512.png` — Icone 512x512
- `public/icons/apple-touch-icon.png` — Icone Apple 180x180

**Fichiers a MODIFIER :**
- `next.config.ts` — Wrapper withSerwist (~15 lignes)
- `src/app/layout.tsx` — Meta tags Apple PWA (3-4 lignes ajoutees dans metadata)
- `tsconfig.json` — Types et exclude Serwist (3 lignes)
- `.gitignore` — Fichiers generes SW (4 lignes)

**Structure apres cette story :**
```
src/app/
  sw.ts           ← NOUVEAU
  manifest.ts     ← NOUVEAU
  layout.tsx      ← MODIFIE
  page.tsx        (pas touche)
  globals.css     (pas touche)
public/icons/
  icon-192.png    ← NOUVEAU
  icon-512.png    ← NOUVEAU
  apple-touch-icon.png  ← NOUVEAU
```

### Testing Requirements

**Verifications automatiques :**
- `npm run build` sans erreurs — le Service Worker est genere
- `npm run lint` sans erreurs

**Verifications manuelles requises :**
- `npm run build && npm start` puis ouvrir http://localhost:3000
- Chrome DevTools > Application > Manifest : verifier name, icons, display, theme_color
- Chrome DevTools > Application > Service Workers : verifier enregistrement actif
- Chrome DevTools > Application > Cache Storage : verifier les caches (static-audio-assets, etc.)
- Lighthouse > PWA audit : verifier score "Installable" et "Service Worker"
- Test installation : Chrome > 3 dots > "Installer Meditation" (ou banner automatique)
- Test iOS : Safari > Partager > "Sur l'ecran d'accueil" — verifier icone et mode standalone
- Zero regression : app fonctionne normalement (config, timer, gongs audio, persistance reglages)

### Previous Story Intelligence (Story 2.2 — derniere story completee)

**Learnings critiques de Story 2.2 :**
- Le build compile en ~1170ms — le SW va ajouter du temps de build
- `audio.playIntervalGong()` et `audio.playEndGong()` fonctionnent correctement — le cache audio du SW doit les supporter
- Les fichiers MP3 sont dans `/public/sounds/` (gong-interval.mp3: 41KB, gong-end.mp3: 65KB) — ils seront pre-caches par `self.__SW_MANIFEST`
- Manipulation DOM imperative pour le flash visuel fonctionne bien — conforme React 19
- Aucun probleme de regression sur les 11 stories precedentes
- Le projet utilise `@serwist/next` (installe comme dependance) et NON `@ducanh2912/next-pwa` malgre ce que dit l'architecture

**Etat actuel du projet (Epic 1 + Epic 2 completes) :**
- 6 composants UI fonctionnels dans src/components/
- 2 hooks (useTimer, useAudio) fonctionnels dans src/hooks/
- 2 utilitaires (storage, constants) dans src/lib/
- Layout avec polices Cormorant + Inter, design tokens Tailwind dans globals.css
- page.tsx orchestre tout : config, timer, audio, gongs, persistance
- Pas de manifest.ts ni de sw.ts actuellement — c'est le but de cette story
- next.config.ts est minimal (pas encore de wrapper Serwist)
- public/icons/ contient seulement .gitkeep — les icones doivent etre creees

### Git Intelligence

**Derniers commits :**
- `621d337` dev 2-2 (Story 2.2 : Lecture des Gongs & Integration Timer)
- `75ce594` dev 2-1 (Story 2.1 : Systeme Audio & Hook useAudio)
- `a08e726` dev 1-6 (Story 1.6 : Indicateurs de Gongs & Polish)

**Pattern de commits :** Format court `dev X-Y` pour les stories d'implementation.

**Fichiers recents :**
- Les 2 derniers commits n'ont touche que `page.tsx`, `useAudio.ts`, `CircularProgress.tsx` et `public/sounds/`
- Cette story ne modifie AUCUN de ces fichiers → zero risque de conflit

### Project Structure Notes

- Cette story est purement de la configuration infrastructure PWA — pas de changement de logique metier
- Le `defaultCache` de @serwist/next gere automatiquement le cache de tous les types de fichiers necessaires (HTML, JS, CSS, images, audio, fonts)
- Les fichiers MP3 dans `/public/sounds/` seront automatiquement inclus dans le precache manifest (`self.__SW_MANIFEST`) ET caches en runtime via `CacheFirst` + `RangeRequestsPlugin`
- Le manifest.ts utilise le systeme natif de Next.js (MetadataRoute.Manifest) — pas de fichier JSON manuel
- Apres cette story, l'app sera installable mais PAS encore testee offline — Story 3.2 couvrira le test offline complet et le hook useWakeLock

### References

- [Source: planning-artifacts/epics.md#Story-3.1] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#PWA-Architecture] - @ducanh2912/next-pwa → remplace par @serwist/next (deja installe), cache-first strategy
- [Source: planning-artifacts/architecture.md#Infrastructure-Deployment] - Output standalone, Docker
- [Source: planning-artifacts/architecture.md#Project-Structure] - manifest.ts dans src/app/, icones dans public/icons/
- [Source: planning-artifacts/prd.md#Fonctionnement-Offline-PWA] - FR12 offline, FR13 installation, FR14 sans telechargement supplementaire
- [Source: planning-artifacts/ux-design-specification.md#Platform-Strategy] - PWA installable, offline-first, standalone
- [Source: planning-artifacts/ux-design-specification.md#Color-System] - background #F5F7F9, accent #5A8F9A (pour theme_color manifest)
- [Source: implementation-artifacts/2-2-lecture-des-gongs-integration-timer.md] - Etat actuel du projet, patterns etablis
- [Source: src/app/layout.tsx] - Metadata existante, polices Cormorant + Inter
- [Source: src/app/globals.css] - Design tokens Tailwind v4 via @theme
- [Source: next.config.ts] - Config minimale actuelle a wrapper
- [Source: tsconfig.json] - Config TS a modifier pour types Serwist
- [Source: package.json] - @serwist/next ^9.5.4 deja installe, pas de nouvelle dep
- [Source: .gitignore] - A completer avec fichiers generes SW
- [Source: Serwist docs - serwist.pages.dev] - Documentation officielle v9.x, defaultCache, breaking changes

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (webpack), compiled in 1047.9ms
- Serwist: Bundling service worker '/sw.js' scope '/' — success
- Lint: 0 errors, 0 warnings
- TypeScript: no errors
- Manifest generated at /manifest.webmanifest
- SW generated: public/sw.js (42KB)
- Note: Build uses `--webpack` flag (Next.js 16 defaults to Turbopack, incompatible with @serwist/next webpack plugin)

### Completion Notes List

- next.config.ts: wrappe avec withSerwistInit, swSrc → src/app/sw.ts, swDest → public/sw.js, disable en dev (Turbopack incompatible)
- Ajout `turbopack: {}` dans la config Next.js pour eviter l'erreur "webpack config without turbopack config" de Next.js 16
- Build script modifie: `next build --webpack` car Next.js 16 utilise Turbopack par defaut et le plugin webpack de Serwist ne fonctionne pas avec Turbopack
- sw.ts: Service Worker avec defaultCache de @serwist/next/worker, skipWaiting, clientsClaim, navigationPreload — pas de fallback offline (app single-page pre-cachee)
- manifest.ts: Manifest complet conforme design system (background #F5F7F9, theme #5A8F9A, standalone, portrait)
- Icones generees via Python Pillow: cercle accent (#5A8F9A) avec lettre "M" en serif blanc, 3 tailles (192, 512, 180)
- layout.tsx: Ajout appleWebApp metadata (capable, statusBarStyle, title) + apple-touch-icon
- tsconfig.json: Ajout "webworker" dans lib, "@serwist/next/typings" dans types, "public/sw.js" dans exclude
- .gitignore: Ajout public/sw.js, sw.js.map, swe-worker-*.js
- eslint.config.mjs: Ajout public/sw.js dans globalIgnores (le SW genere echouait au lint)
- Aucune dependance ajoutee, aucun fichier de logique metier modifie
- Zero regression: page.tsx, hooks, components, lib tous intacts

### File List

- next.config.ts (modifie)
- src/app/sw.ts (nouveau)
- src/app/manifest.ts (nouveau)
- src/app/layout.tsx (modifie)
- public/icons/icon-192.png (nouveau)
- public/icons/icon-512.png (nouveau)
- public/icons/apple-touch-icon.png (nouveau)
- tsconfig.json (modifie)
- .gitignore (modifie)
- eslint.config.mjs (modifie)
- package.json (modifie — build script `next build --webpack`)
