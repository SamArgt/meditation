# Story 3.2: Offline & Strategie de Cache

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux utiliser l'app sans connexion internet,
Afin de mediter n'importe ou, meme sans reseau.

## Acceptance Criteria

1. **Given** j'ai charge l'app une premiere fois (avec connexion) **When** je perds ma connexion internet **Then** l'app fonctionne a 100% (FR12) **And** toutes les fonctionnalites sont disponibles (NFR5)

2. **Given** le Service Worker est configure **When** les assets sont mis en cache **Then** les fichiers HTML, JS, CSS sont caches (cache-first) **And** les fichiers audio (gong-interval.mp3, gong-end.mp3) sont caches **And** les icones et fonts sont caches

3. **Given** je suis offline **When** je demarre une session de meditation **Then** le timer fonctionne normalement **And** les gongs audio sont joues correctement **And** mes reglages sont sauvegardes localement

4. **Given** l'app est installee et offline **When** je la relance **Then** elle demarre sans telechargement supplementaire (FR14) **And** le temps de chargement reste rapide (< 2s)

5. **Given** une session est en cours **When** j'utilise le hook useWakeLock **Then** l'ecran reste allume pendant la meditation (si supporte) **And** si Wake Lock n'est pas supporte, l'app fonctionne normalement (graceful degradation)

6. **Given** je verifie les metriques de performance **When** je lance Lighthouse **Then** le score PWA est optimal **And** l'app passe les criteres "installable" et "offline-ready"

## Tasks / Subtasks

- [x] Task 1: Creer le hook useWakeLock (AC: #5)
  - [x] 1.1: Creer `src/hooks/useWakeLock.ts` — hook custom avec interface `UseWakeLockReturn` conforme au pattern standardise (actions: `request`, `release` + status: `isActive`, `isSupported`, `error`)
  - [x] 1.2: Implementer `request()` : appeler `navigator.wakeLock.request("screen")` dans un try/catch, stocker le `WakeLockSentinel` dans un ref
  - [x] 1.3: Implementer `release()` : appeler `sentinel.release()` si le sentinel existe, reset les refs
  - [x] 1.4: Gerer la re-acquisition automatique : ecouter l'evenement `visibilitychange` — si `document.visibilityState === "visible"` et que le wake lock etait actif, le re-demander
  - [x] 1.5: Cleanup au unmount via `useEffect` return — liberer le sentinel et retirer le listener `visibilitychange`
  - [x] 1.6: `isSupported` : detecter `"wakeLock" in navigator` (graceful degradation si non supporte)

- [x] Task 2: Integrer useWakeLock dans page.tsx (AC: #5)
  - [x] 2.1: Importer `useWakeLock` depuis `@/hooks/useWakeLock` dans `page.tsx`
  - [x] 2.2: Appeler `wakeLock.request()` dans `handleStart()` (apres `audio.init()` et `timer.start()`)
  - [x] 2.3: Appeler `wakeLock.release()` dans `handleStop()` et dans le callback de fin de session (effet `showEndMessage`)
  - [x] 2.4: NE PAS afficher de message d'erreur si Wake Lock non supporte — progressive enhancement silencieux

- [x] Task 3: Verifier la strategie de cache du Service Worker (AC: #2)
  - [x] 3.1: Verifier que `defaultCache` de @serwist/next couvre tous les types d'assets : HTML, JS, CSS, audio (.mp3), images (.png), fonts (Google Fonts)
  - [x] 3.2: Verifier dans le build (`npm run build --webpack`) que `self.__SW_MANIFEST` inclut les fichiers critiques : page principale, chunks JS, CSS, `/sounds/gong-interval.mp3`, `/sounds/gong-end.mp3`, icones
  - [x] 3.3: Si un type d'asset n'est PAS couvert par defaultCache, ajouter une regle `runtimeCaching` custom dans `sw.ts` — MAIS NE PAS modifier si defaultCache suffit deja (il couvre audio, images, fonts, JS, CSS, HTML)

- [x] Task 4: Verification offline complete (AC: #1, #3, #4)
  - [x] 4.1: `npm run build --webpack` sans erreurs
  - [x] 4.2: `npm run lint` sans erreurs
  - [ ] 4.3: Verification manuelle requise : `npm start`, charger l'app, puis activer "Offline" dans Chrome DevTools > Network — l'app doit se recharger et fonctionner a 100%
  - [ ] 4.4: Verification manuelle requise : En mode offline, demarrer une session → timer + gongs audio + indicateurs visuels fonctionnent
  - [ ] 4.5: Verification manuelle requise : En mode offline, verifier la persistance des reglages (changer duration, recharger)
  - [ ] 4.6: Verification manuelle requise : Lighthouse PWA audit — score optimal, criteres "installable" + "offline-ready"
  - [ ] 4.7: Zero regression : app fonctionne identiquement online et offline

## Dev Notes

### Architecture Compliance

**Layer Boundaries (Architecture document) :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `src/hooks/useWakeLock.ts` | Business logic | CREER — nouveau hook Wake Lock |
| `src/app/page.tsx` | State orchestration | MODIFIER — integrer useWakeLock |
| `src/app/sw.ts` | Service Worker | POTENTIELLEMENT MODIFIER — seulement si defaultCache est insuffisant |

**Fichiers a NE PAS TOUCHER :**
- `src/components/*` — Tous les composants UI intacts
- `src/hooks/useTimer.ts` — Logique timer intacte
- `src/hooks/useAudio.ts` — Logique audio intacte
- `src/lib/*` — Utilitaires intacts
- `src/app/globals.css` — Styles intacts
- `src/app/layout.tsx` — Layout intact
- `src/app/manifest.ts` — Manifest intact
- `next.config.ts` — Config Serwist intacte
- `public/sounds/*` — Fichiers audio intacts
- `public/icons/*` — Icones intactes
- `package.json` — Aucune nouvelle dependance requise

### Technical Requirements

**useWakeLock — Specification technique :**

```typescript
interface UseWakeLockReturn {
  // Actions
  request: () => Promise<void>;
  release: () => void;
  // Status
  isActive: boolean;
  isSupported: boolean;
  error: string | null;
}
```

| Aspect | Decision | Raison |
|--------|----------|--------|
| API | Wake Lock API (`navigator.wakeLock`) | Specification W3C, supportee Chrome 84+, Safari 16.4+ |
| Pattern | Progressive enhancement | Si non supporte, `isSupported = false` et aucune erreur visible |
| Re-acquisition | Auto via `visibilitychange` | Le wake lock est libere quand l'onglet perd le focus, il faut le re-demander |
| Lifecycle | request() au Start, release() au Stop/End | Suit exactement le lifecycle de la session |
| Sentinel | Ref (pas state) | Pas de re-render quand le sentinel change, le sentinel n'est pas rendu |

**Wake Lock API — Points critiques :**
- `navigator.wakeLock.request("screen")` retourne une `Promise<WakeLockSentinel>`
- Le sentinel est automatiquement libere quand l'onglet perd le focus (minimise, changement d'onglet)
- Il faut ecouter `visibilitychange` et re-demander le lock quand l'app redevient visible
- La methode `release()` du sentinel retourne une `Promise<void>`
- Sur iOS Safari 16.4+, Wake Lock est supporte mais avec des limitations (peut etre libere par le systeme)
- En mode standalone PWA, le Wake Lock fonctionne mieux (pas de barre d'adresse a gerer)

**Strategie de cache — Etat actuel (Story 3.1) :**

Le `defaultCache` de `@serwist/next/worker` couvre DEJA tous les types d'assets :

| Type d'asset | Strategie | Cache Name | TTL |
|--------------|-----------|------------|-----|
| Google Fonts (webfonts) | StaleWhileRevalidate | google-fonts-webfonts | 365j |
| Google Fonts (CSS) | StaleWhileRevalidate | google-fonts-stylesheets | 7j |
| Images (.png, .jpg, etc.) | StaleWhileRevalidate | static-image-assets | 30j |
| Audio (.mp3, .wav, .ogg) | CacheFirst + RangeRequests | static-audio-assets | 24h |
| JS chunks Next.js | CacheFirst | next-static-js-assets | 24h |
| CSS | StaleWhileRevalidate | static-style-assets | 24h |
| Pages HTML | NetworkFirst | pages | 24h |

**IMPORTANT : Le defaultCache suffit. NE PAS ajouter de regles custom dans sw.ts sauf si un test revele un manque.**

Le precache (`self.__SW_MANIFEST`) inclut automatiquement au build :
- Tous les chunks JS et CSS de Next.js
- Les fichiers dans `/public/` (sons MP3, icones PNG)
- La page HTML principale

**Verification offline — Methodologie :**
1. `npm run build --webpack` → genere le SW avec le precache manifest
2. `npm start` → serveur Next.js en production
3. Charger la page une fois (le SW s'installe et precache tout)
4. Chrome DevTools > Application > Service Workers → verifier "activated and is running"
5. Chrome DevTools > Network > cocher "Offline"
6. Recharger la page → doit charger depuis le cache
7. Demarrer une session → timer + gongs audio + indicators doivent fonctionner
8. Verifier la persistance des reglages (LocalStorage fonctionne offline nativement)

### Library & Framework Requirements

**Aucune nouvelle dependance requise.**

Packages et APIs utilises :
- `Wake Lock API` (Web API native) — pour maintenir l'ecran allume
- `@serwist/next` ^9.5.4 (DEJA installe) — Service Worker et caching
- `serwist` (DEJA installe) — peer dependency

**IMPORTANT : NE PAS installer de package supplementaire. Tout est deja en place ou natif du navigateur.**

### File Structure Requirements

**Fichiers a CREER :**
- `src/hooks/useWakeLock.ts` — Hook Wake Lock (~40-50 lignes)

**Fichiers a MODIFIER :**
- `src/app/page.tsx` — Integration useWakeLock (~5-6 lignes ajoutees)

**Fichiers POTENTIELLEMENT a modifier (seulement si necessaire) :**
- `src/app/sw.ts` — Seulement si defaultCache ne couvre pas un type d'asset

**Structure apres cette story :**
```
src/hooks/
  useTimer.ts      (pas touche)
  useAudio.ts      (pas touche)
  useWakeLock.ts   ← NOUVEAU
src/app/
  page.tsx         ← MODIFIE (integration wake lock)
  sw.ts            (pas touche sauf si necessaire)
```

### Testing Requirements

**Verifications automatiques :**
- `npm run build --webpack` sans erreurs
- `npm run lint` sans erreurs (useWakeLock doit passer les regles React 19)

**Verifications manuelles requises :**
- Test offline complet : charger app → activer offline → recharger → tout fonctionne
- Test session offline : demarrer session offline → timer + gongs + indicateurs OK
- Test wake lock : demarrer session → l'ecran ne se met pas en veille (verifier sur mobile si possible)
- Test graceful degradation : navigateur sans Wake Lock API → aucune erreur, app fonctionne normalement
- Test re-acquisition : pendant session, changer d'onglet puis revenir → ecran reste allume
- Lighthouse PWA audit : criteres installable + offline-ready
- Zero regression : toutes les fonctionnalites pre-existantes intactes (config, timer, gongs, persistance, PWA installation)

### React 19 Lint Rules — Points critiques pour useWakeLock

- **NE PAS** utiliser `useEffect(() => { setState(value) }, [])` pour initialiser `isSupported` → utiliser `useState(() => typeof window !== "undefined" && "wakeLock" in navigator)` (lazy initializer)
- **NE PAS** appeler `navigator.wakeLock` pendant le render → le faire uniquement dans les callbacks (`request`, `release`) et `useEffect`
- Le sentinel doit etre stocke dans un `useRef` (pas un state) car il n'est pas rendu
- `isActive` peut etre un `useState` car il est utilise dans le render (meme si page.tsx ne l'affiche pas, c'est pour la coherence du hook)

### Previous Story Intelligence (Story 3.1)

**Learnings critiques de Story 3.1 :**
- Build avec `--webpack` flag obligatoire : `next build --webpack` (Next.js 16 utilise Turbopack par defaut, incompatible avec le plugin webpack de Serwist)
- Le `defaultCache` de @serwist/next couvre DEJA audio (.mp3 → CacheFirst + RangeRequestsPlugin), images, fonts, JS, CSS, HTML
- `self.__SW_MANIFEST` est injecte automatiquement au build avec TOUS les assets de `/public/` et les chunks Next.js
- Le SW genere fait 42KB — l'ajout de useWakeLock ne change rien au SW
- `eslint.config.mjs` a deja `public/sw.js` dans `globalIgnores`
- `.gitignore` a deja les fichiers generes SW
- Aucune regression sur les 12 stories precedentes
- Le projet utilise `@serwist/next` (PAS `@ducanh2912/next-pwa` malgre l'architecture doc)
- Icones PWA generees (192, 512, 180) dans `public/icons/`
- Manifest avec theme_color #5A8F9A et background_color #F5F7F9 conforme

**Etat actuel du projet (Epic 1 + Epic 2 + Story 3.1 completes) :**
- 6 composants UI dans src/components/ (CircularProgress, DurationSelector, IntervalSelector, StartButton, StopButton, GongIndicators)
- 2 hooks dans src/hooks/ (useTimer, useAudio) — useWakeLock n'existe PAS encore
- 2 utilitaires dans src/lib/ (storage, constants)
- Service Worker configure et fonctionnel (sw.ts + next.config.ts wrapper)
- Manifest PWA complet (manifest.ts)
- Layout avec metadata Apple PWA (layout.tsx)
- Icones PWA dans public/icons/ (3 tailles)
- Audio dans public/sounds/ (gong-interval.mp3 41KB, gong-end.mp3 65KB)

### Git Intelligence

**Derniers commits :**
- `2a16c9a` dev 3-1 (Story 3.1 : Configuration PWA & Installation)
- `621d337` dev 2-2 (Story 2.2 : Lecture des Gongs & Integration Timer)
- `75ce594` dev 2-1 (Story 2.1 : Systeme Audio & Hook useAudio)

**Fichiers modifies dans dev 3-1 :**
- next.config.ts, sw.ts (nouveau), manifest.ts (nouveau), layout.tsx, tsconfig.json, .gitignore, eslint.config.mjs, package.json, icones PWA

**Impact sur cette story :**
- Cette story ne touche AUCUN fichier modifie par 3-1 (sauf potentiellement sw.ts et page.tsx)
- Risque de conflit : FAIBLE — page.tsx n'a pas change depuis dev 2-2, sw.ts est nouveau et stable

**Pattern de commits :** Format court `dev X-Y` (ex: `dev 3-2`)

### Project Structure Notes

- Cette story est la derniere de l'Epic 3 (PWA Installable & Offline)
- Le gros du travail PWA (Service Worker, manifest, icones) est DEJA fait en Story 3.1
- Cette story se concentre sur : (1) le hook useWakeLock et (2) la VERIFICATION que tout fonctionne offline
- Le defaultCache de Serwist couvre deja tous les assets → pas de configuration de cache supplementaire attendue
- La verification offline est principalement MANUELLE (pas de tests automatises)
- Apres cette story, l'app est 100% complete selon le PRD (3 epics, 14 stories)
- Le hook useWakeLock suit exactement le meme pattern que useAudio : actions + status, refs pour les objets natifs, cleanup au unmount

### References

- [Source: planning-artifacts/epics.md#Story-3.2] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#PWA-Architecture] - Cache-first strategy, Service Worker via @serwist/next
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Hook pattern standardise (data, actions, status)
- [Source: planning-artifacts/architecture.md#Project-Structure] - useWakeLock.ts dans src/hooks/
- [Source: planning-artifacts/architecture.md#Error-Handling] - Wake Lock non supporte → ignore (progressive enhancement)
- [Source: planning-artifacts/prd.md#Fonctionnement-Offline-PWA] - FR12 offline 100%, FR13 installation, FR14 sans telechargement
- [Source: planning-artifacts/prd.md#Fiabilite] - NFR5 100% offline, NFR6 zero crash
- [Source: implementation-artifacts/3-1-configuration-pwa-installation.md] - Etat complet du setup PWA, defaultCache details, build --webpack
- [Source: src/app/sw.ts] - Service Worker avec defaultCache, skipWaiting, clientsClaim, navigationPreload
- [Source: src/app/page.tsx] - Orchestration actuelle : handleStart(), handleStop(), showEndMessage effect — points d'integration useWakeLock
- [Source: src/hooks/useAudio.ts] - Pattern de reference pour useWakeLock : interface, refs, init/cleanup, useEffect cleanup
- [Source: next.config.ts] - Config Serwist en place, disable en dev
- [Source: package.json] - @serwist/next ^9.5.4, build script `next build --webpack`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (webpack), compiled in 1042.4ms
- Serwist: Bundling service worker '/sw.js' scope '/' — success
- Lint: 0 errors, 0 warnings
- TypeScript: no errors
- Precache manifest verified: 20+ JS chunks, 1 CSS, 12 woff2 fonts, 3 icons PNG, 2 audio MP3
- Runtime caching verified: audio CacheFirst + RangeRequests, images StaleWhileRevalidate, JS CacheFirst, CSS StaleWhileRevalidate, HTML NetworkFirst
- defaultCache couvre 100% des assets — aucune modification de sw.ts necessaire

### Completion Notes List

- useWakeLock.ts: Hook complet (104 lignes) — interface UseWakeLockReturn avec request/release/isActive/isSupported/error
- isSupported initialise via useState lazy initializer (conforme React 19 lint rules)
- Sentinel stocke dans useRef (pas state), wantLockRef pour tracker l'intention utilisateur
- Re-acquisition automatique via visibilitychange listener — quand l'onglet redevient visible et que wantLockRef.current est true, le lock est re-demande
- Cleanup au unmount : release du sentinel + suppression du listener visibilitychange
- Graceful degradation : si Wake Lock API non supportee, isSupported=false et request() est no-op silencieux
- page.tsx: wakeLock.request() appele dans handleStart() apres timer.start(), wakeLock.release() dans handleStop() et dans le callback de fin de session (showEndMessage timeout)
- Aucune dependance ajoutee, aucun fichier hors scope modifie
- sw.ts non modifie — defaultCache de @serwist/next couvre deja tous les types d'assets
- Zero regression : build + lint passent, aucun composant/hook/utilitaire existant modifie (sauf page.tsx pour integration)
- Verifications manuelles restantes : tests offline (DevTools), Lighthouse PWA audit, test wake lock sur mobile

### File List

- src/hooks/useWakeLock.ts (nouveau)
- src/app/page.tsx (modifie)
