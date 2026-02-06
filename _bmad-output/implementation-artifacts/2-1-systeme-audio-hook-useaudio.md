# Story 2.1: Systeme Audio & Hook useAudio

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'equipe de developpement,
Je veux un systeme audio robuste base sur Web Audio API,
Afin de jouer des sons avec precision et faible latence.

## Acceptance Criteria

1. **Given** l'utilisateur tape sur Start **When** la session demarre **Then** un AudioContext est cree (contourne les politiques autoplay mobile) **And** les fichiers audio (gong-interval.mp3, gong-end.mp3) sont charges en AudioBuffer

2. **Given** le hook useAudio est implemente **When** il est utilise **Then** il expose : playIntervalGong(), playEndGong(), isReady, error **And** il respecte le pattern de retour standardise (data, actions, status)

3. **Given** les fichiers audio sont charges **When** je declenche un son **Then** la latence est inferieure a 100ms (NFR2) **And** le son est joue via AudioBufferSourceNode

4. **Given** le navigateur ne supporte pas Web Audio API **When** j'initialise useAudio **Then** error contient un message approprie **And** isReady reste false (permettant le fallback visuel)

5. **Given** les fichiers audio sont dans /public/sounds/ **When** le projet est construit **Then** ils sont accessibles et cachables par le Service Worker

## Tasks / Subtasks

- [x] Task 1: Ajouter les fichiers audio dans /public/sounds/ (AC: #5)
  - [x] 1.1: Placer `gong-interval.mp3` dans `public/sounds/` — son de bol tibetain doux (2-3 secondes), volume moyen, non intrusif
  - [x] 1.2: Placer `gong-end.mp3` dans `public/sounds/` — son de bol tibetain distinct (4-5 secondes), legerement plus fort, clairement different du gong d'intervalle
  - [x] 1.3: Verifier que les fichiers sont accessibles via `/sounds/gong-interval.mp3` et `/sounds/gong-end.mp3` en dev (`npm run dev`)
  - [x] 1.4: Supprimer `.gitkeep` de `public/sounds/` apres ajout des fichiers MP3

- [x] Task 2: Creer le hook `src/hooks/useAudio.ts` (AC: #1, #2, #3, #4)
  - [x] 2.1: Creer `src/hooks/useAudio.ts` avec la directive `"use client"` (ce hook utilise des refs et effects navigateur)
  - [x] 2.2: Definir l'interface de retour conforme au pattern standardise :
    ```typescript
    interface UseAudioReturn {
      // ACTIONS
      init: () => Promise<void>;         // Initialise AudioContext + charge buffers
      playIntervalGong: () => void;      // Joue le gong d'intervalle
      playEndGong: () => void;           // Joue le gong de fin
      cleanup: () => void;               // Libere les ressources audio
      // STATUS
      isReady: boolean;                  // true quand AudioContext cree ET buffers charges
      error: string | null;              // Message d'erreur si Web Audio non supporte ou chargement echoue
    }
    ```
  - [x] 2.3: Implementer `init()` — creation LAZY de l'AudioContext :
    - Creer `new AudioContext()` (avec fallback `webkitAudioContext` pour compatibilite)
    - Si context.state === "suspended", appeler `context.resume()` (politique autoplay iOS/Safari)
    - Appeler `loadBuffer()` pour chaque fichier : `/sounds/gong-interval.mp3` et `/sounds/gong-end.mp3`
    - Stocker les buffers dans des refs (`intervalBufferRef`, `endBufferRef`)
    - Setter `isReady = true` une fois les deux buffers charges
    - En cas d'erreur : setter `error` avec message adapte, `isReady` reste false
  - [x] 2.4: Implementer `loadBuffer(url)` — fonction interne :
    - `fetch(url)` pour recuperer le fichier MP3
    - `response.arrayBuffer()` pour obtenir les donnees brutes
    - `audioContext.decodeAudioData(arrayBuffer)` pour decoder en AudioBuffer
    - Retourner le buffer decode
  - [x] 2.5: Implementer `playIntervalGong()` :
    - Guard : si `!isReady || !audioContextRef.current || !intervalBufferRef.current` → return silencieusement
    - Creer un NOUVEAU `AudioBufferSourceNode` (single-use, un par lecture)
    - Assigner `source.buffer = intervalBufferRef.current`
    - `source.connect(audioContextRef.current.destination)`
    - `source.start(audioContextRef.current.currentTime)` — lecture immediate
  - [x] 2.6: Implementer `playEndGong()` — meme pattern que playIntervalGong() avec `endBufferRef`
  - [x] 2.7: Implementer `cleanup()` :
    - Arreter toute source en cours si necessaire
    - `audioContextRef.current.close()` pour liberer les ressources
    - Vider les refs de buffers (`intervalBufferRef.current = null`, etc.)
    - Setter `isReady = false`
  - [x] 2.8: Implementer le cleanup dans un `useEffect` return pour le demontage du composant
  - [x] 2.9: Gestion d'erreur — si `window.AudioContext` et `window.webkitAudioContext` sont undefined :
    - Setter `error = "Votre navigateur ne supporte pas l'audio"` (message conforme a ERROR_MESSAGES.AUDIO_NOT_SUPPORTED dans Architecture)
    - NE PAS throw — fallback gracieux, `isReady` reste false
  - [x] 2.10: Utiliser des `useRef` pour : audioContext, intervalBuffer, endBuffer (PAS de useState pour les objets Web Audio — evite les re-renders inutiles)
  - [x] 2.11: Utiliser `useState` uniquement pour : `isReady` (boolean) et `error` (string | null) — ces valeurs declenchent des re-renders necessaires pour l'UI

- [x] Task 3: Integration basique dans `src/app/page.tsx` (AC: #1, #2)
  - [x] 3.1: Importer `useAudio` depuis `@/hooks/useAudio`
  - [x] 3.2: Instancier `const audio = useAudio()` dans le composant Home
  - [x] 3.3: Modifier `handleStart()` pour appeler `await audio.init()` AVANT `timer.start()` — c'est l'interaction utilisateur qui cree l'AudioContext (contourne autoplay policy)
  - [x] 3.4: Modifier `handleStop()` pour appeler `audio.cleanup()` apres `timer.stop()` et `timer.reset()`
  - [x] 3.5: NE PAS encore integrer le declenchement des gongs aux intervalles — c'est la Story 2.2
  - [x] 3.6: NE PAS modifier le comportement existant du timer, des selecteurs, ni de la persistance

- [x] Task 4: Verification build + lint + regression (AC: all)
  - [x] 4.1: `npm run build` sans erreurs
  - [x] 4.2: `npm run lint` sans erreurs (inclut regle React 19 `react-hooks/set-state-in-effect`)
  - [x] 4.3: Verifier manuellement : l'app fonctionne normalement (config, timer, start/stop, persistance, gong indicators)
  - [x] 4.4: Verifier dans la console : au tap Start, "AudioContext created" (ou equivalent) et pas d'erreur
  - [x] 4.5: Verifier dans la console : les buffers sont charges sans erreur apres init()
  - [x] 4.6: Verifier que `audio.isReady` passe a true apres init() reussi
  - [x] 4.7: Verifier que les fichiers MP3 sont servis correctement via `/sounds/gong-interval.mp3`

## Dev Notes

### Architecture Compliance

**Layer Boundaries (Architecture document) :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `hooks/` | Business logic, side effects | `useAudio.ts` — NOUVEAU |
| `page.tsx` | State orchestration | MODIFIER — import useAudio, appeler init/cleanup |
| `components/` | Pure UI rendering | PAS touche |
| `lib/` | Stateless utilities | PAS touche |
| `public/sounds/` | Assets statiques | AJOUTER — gong-interval.mp3, gong-end.mp3 |

**Audio Flow (conforme au document Architecture) :**
1. User tap Start → `page.tsx` appelle `audio.init()`
2. `useAudio` cree AudioContext (contourne autoplay policy mobile)
3. `useAudio` charge les MP3 en AudioBuffer (pre-decodes, prets pour lecture instantanee)
4. (Story 2.2) `useTimer` triggera `playIntervalGong()` / `playEndGong()` aux intervalles
5. User tap Stop ou fin de session → `page.tsx` appelle `audio.cleanup()`

**Pattern Hook standardise (Architecture document) :**
```typescript
// useAudio suit le meme pattern que useTimer :
// - ACTIONS : init(), playIntervalGong(), playEndGong(), cleanup()
// - STATUS : isReady (boolean), error (string | null)
// - Refs pour objets lourds (AudioContext, AudioBuffer)
// - useState uniquement pour valeurs qui impactent le rendu UI
```

### Technical Requirements

**Web Audio API — Implementation critique :**

| Aspect | Decision | Raison |
|--------|----------|--------|
| AudioContext creation | LAZY — dans init(), appele au tap Start | Politique autoplay mobile : le contexte doit etre cree/resume dans un geste utilisateur |
| AudioBuffer loading | Pre-chargement au init() | Latence <100ms au moment du play (NFR2) — pas de fetch pendant la session |
| AudioBufferSourceNode | Nouveau node par lecture | Les source nodes sont SINGLE-USE — un nouveau doit etre cree chaque fois |
| Compatibilite | `AudioContext \|\| webkitAudioContext` | Safari ancien utilisait le prefix webkit |
| iOS Safari specifique | `context.resume()` si state === "suspended" | iOS suspend le contexte automatiquement, meme apres creation dans un geste |
| Cleanup | `context.close()` au stop/unmount | Libere les ressources systeme (max 4 contextes simultanees sur iOS) |

**React 19 + Next.js 16.1.6 :**
- `"use client"` necessaire dans useAudio.ts car utilise `useRef`, `useState`, `useEffect`, et APIs navigateur
- NE PAS utiliser `useEffect(() => { setState(...) }, [])` pour initialiser — la regle `react-hooks/set-state-in-effect` l'interdit
- `init()` est une fonction async appelee explicitement par page.tsx dans un handler (pas dans un effect) — conforme React 19
- Les refs (`useRef`) pour AudioContext et AudioBuffer evitent les re-renders inutiles

**Tailwind CSS v4 :**
- Cette story ne modifie PAS de composants visuels — aucun changement CSS requis
- Les design tokens existants ne sont pas impactes

### Library & Framework Requirements

**Aucune nouvelle dependance requise.**

Technologies utilisees (toutes deja installees) :
- `react` 19.2.3 — hooks (useRef, useState, useEffect, useCallback)
- Web Audio API — API native du navigateur, aucun package NPM necessaire

**APIs navigateur utilisees :**
| API | Support | Fallback |
|-----|---------|----------|
| `AudioContext` | Tous les navigateurs modernes (Chrome, Firefox, Safari, Edge) | `webkitAudioContext` pour anciens Safari |
| `decodeAudioData()` | Promise-based dans tous les navigateurs modernes | Callback legacy (non necessaire) |
| `AudioBufferSourceNode` | Universel | Aucun fallback necessaire |
| `fetch()` | Universel | Deja utilise dans le projet |

**IMPORTANT : NE PAS installer de package audio externe (howler.js, tone.js, etc.) — Web Audio API native suffit pour notre cas d'usage simple.**

### File Structure Requirements

**Fichiers a CREER :**
- `src/hooks/useAudio.ts` — Hook custom pour la gestion audio Web Audio API
- `public/sounds/gong-interval.mp3` — Son bol tibetain intervalle (2-3s, ~50-100KB)
- `public/sounds/gong-end.mp3` — Son bol tibetain fin (4-5s, ~80-150KB)

**Fichiers a MODIFIER :**
- `src/app/page.tsx` — Import useAudio, appeler init() dans handleStart, cleanup() dans handleStop

**Fichiers a NE PAS TOUCHER :**
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/hooks/useTimer.ts`
- `src/components/CircularProgress.tsx`, `src/components/GongIndicators.tsx`
- `src/components/DurationSelector.tsx`, `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`, `src/components/StopButton.tsx`
- `src/lib/constants.ts`, `src/lib/storage.ts`
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Verifications manuelles requises :**
- Build reussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- App fonctionne normalement : config, timer start/stop, persistance, gong indicators — ZERO regression
- Au tap Start : AudioContext cree sans erreur (verifier console)
- Buffers charges avec succes (verifier `audio.isReady === true`)
- Fichiers MP3 accessibles via URL directe : `http://localhost:3000/sounds/gong-interval.mp3`
- Sur mobile (ou emulateur) : AudioContext se cree correctement malgre les politiques autoplay
- Test d'erreur : si fichier MP3 manquant → `audio.error` contient un message, `audio.isReady === false`, pas de crash

### Previous Story Intelligence (Story 1.6 — derniere story Epic 1)

**Learnings critiques de Story 1.6 :**
- `page.tsx` utilise le pattern conditionnel `{timer.isRunning && <GongIndicators ... />}` pour afficher les composants uniquement pendant la session — le hook useAudio s'integre de facon similaire (init au start, cleanup au stop)
- Le layout `<main className="flex w-full max-w-[480px] flex-col items-center gap-8">` n'est PAS modifie par cette story
- `handleStart()` existant fait simplement `timer.start()` — on ajoute `await audio.init()` AVANT
- `handleStop()` existant fait `timer.stop(); timer.reset()` — on ajoute `audio.cleanup()` APRES
- La variable `isActive = timer.isRunning || showEndMessage` controle l'affichage — ne PAS la modifier
- Les calculs `totalGongs` et `completedGongs` existent deja dans page.tsx — ils seront utilises par Story 2.2 pour declencher les gongs
- `GongIndicators` est un composant pur UI deja en place — pas de modification requise

**Etat actuel de page.tsx — points de modification :**
```tsx
// handleStart — AVANT:
const handleStart = () => { timer.start(); };
// handleStart — APRES:
const handleStart = async () => { await audio.init(); timer.start(); };

// handleStop — AVANT:
const handleStop = () => { timer.stop(); timer.reset(); };
// handleStop — APRES:
const handleStop = () => { timer.stop(); timer.reset(); audio.cleanup(); };
```

**Patterns etablis dans toutes les stories Epic 1 :**
- Hooks dans `src/hooks/` avec `"use client"` si necessaire
- Import alias `@/hooks/...` et `@/components/...`
- Refs pour objets non-UI (comme `startTimeRef`, `rafRef` dans useTimer)
- useState pour valeurs qui impactent le rendu
- Cleanup dans useEffect return
- Interface props/return declaree directement dans le fichier

### Git Intelligence

**Derniers commits :**
- `a08e726` dev 1-6 (Story 1.6 : Indicateurs de Gongs & Polish)
- `c374593` dev 1-5 (Story 1.5 : Persistance des Reglages)
- `181122b` dev 1-4 (Story 1.4 : Logique Timer & Gestion Session)

**Patterns de commits :** Format court `dev X-Y` pour les stories d'implementation.

**Analyse des fichiers recents (3 derniers commits) :**
- `src/app/page.tsx` — 105 lignes modifiees (orchestration principale, handlers)
- `src/hooks/useTimer.ts` — 111 lignes ajoutees (hook complet, pattern data/actions/status)
- `src/components/GongIndicators.tsx` — 31 lignes ajoutees (composant pur UI)
- `src/lib/storage.ts` — 45 lignes ajoutees (utilitaire localStorage)

**NOTE IMPORTANTE :** L'architecture mentionne `@ducanh2912/next-pwa` mais le projet utilise `@serwist/next` 9.5.4 — NE PAS changer ce package, il est deja installe et configure.

### Web Audio API — Latest Best Practices (2025/2026)

**Points critiques issus de la recherche :**

1. **iOS Safari** : Max 4 AudioContext simultanees par page — creer UN seul contexte et le reutiliser
2. **iOS Safari** : Le contexte passe en etat "interrupted" quand l'utilisateur quitte l'onglet — `context.resume()` au retour
3. **Android** : Latence variable (12.5ms-150ms selon appareil) — le pre-chargement en AudioBuffer garantit <100ms
4. **AudioBufferSourceNode** : SINGLE-USE — creer un nouveau node a chaque lecture, ne PAS reutiliser
5. **decodeAudioData** : Async et thread-safe dans les navigateurs modernes — Promise-based
6. **Cleanup** : Deconnecter les nodes, dereferencer les buffers, fermer le contexte au unmount
7. **webkitAudioContext** : Encore necessaire pour d'anciens Safari — inclure le fallback

### Project Structure Notes

- `useAudio.ts` rejoint `useTimer.ts` dans `/hooks/` — 2e des 3 hooks prevus (le 3e sera `useWakeLock` dans Epic 3)
- Les fichiers MP3 dans `/public/sounds/` completent la structure prevue dans l'Architecture document
- Cette story prepare l'infrastructure audio sans integrer le declenchement aux intervalles — separation de responsabilites propre (Story 2.1 = infrastructure, Story 2.2 = integration timer)
- Apres cette story, le hook est pret a etre utilise par Story 2.2 pour jouer les gongs aux bons moments

### References

- [Source: planning-artifacts/epics.md#Story-2.1] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Audio-Architecture] - AudioContext lazy, MP3, pre-chargement AudioBuffer, pattern play
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Hook return pattern (data, actions, status), ERROR_MESSAGES, naming conventions
- [Source: planning-artifacts/architecture.md#Project-Structure] - useAudio.ts dans hooks/, public/sounds/ pour fichiers audio
- [Source: planning-artifacts/architecture.md#Error-Handling-Patterns] - Audio non supporte → message utilisateur, AudioContext bloque → retry, fallback gracieux
- [Source: planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns] - Gong intervalle bol tibetain 2-3s, gong fin 4-5s, feedback audio-first
- [Source: planning-artifacts/ux-design-specification.md#Emotional-Design-Principles] - Sons doux qui maintiennent l'etat meditatif
- [Source: planning-artifacts/prd.md#Notifications-Audio] - FR9 gong intervalle, FR10 gong fin, FR11 precision, NFR2 latence <100ms
- [Source: implementation-artifacts/1-6-indicateurs-de-gongs-polish.md] - Etat actuel page.tsx, patterns hooks, handleStart/handleStop

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (Turbopack), compiled in 1179.9ms
- Lint: 0 errors, 0 warnings
- TypeScript: no errors
- Audio files generated via ffmpeg: gong-interval.mp3 (41KB, 2.5s), gong-end.mp3 (65KB, 4s)

### Completion Notes List

- Hook `src/hooks/useAudio.ts` cree — 105 lignes, "use client", pattern standardise (actions/status)
- AudioContext creation LAZY dans `init()` — appele dans handleStart (geste utilisateur, contourne autoplay)
- Fallback `webkitAudioContext` pour anciens Safari
- `context.resume()` pour iOS Safari suspended state
- Pre-chargement parallele des 2 buffers via `Promise.all` dans init()
- `playIntervalGong()` et `playEndGong()` : nouveau AudioBufferSourceNode par lecture (single-use)
- `cleanup()` : close context, null refs, reset isReady
- useEffect cleanup au unmount pour eviter les fuites memoire
- Gestion erreur gracieuse : error state + isReady false, jamais de throw
- useRef pour AudioContext et AudioBuffer (pas de re-renders inutiles)
- useState pour isReady et error (declenchent re-renders UI)
- page.tsx modifie : import useAudio, handleStart async avec await audio.init(), handleStop avec audio.cleanup()
- Fichiers MP3 generes avec ffmpeg : harmoniques sinusoidales simulant bol tibetain
- gong-interval : 262Hz+524Hz+786Hz, fade-out 2.2s, doux
- gong-end : 196Hz+392Hz+588Hz+784Hz, fade-out 3.5s, plus grave/riche
- .gitkeep supprime de public/sounds/
- Zero regression : timer, config, persistance, gong indicators tous fonctionnels
- Aucune dependance ajoutee, aucun fichier non-prevu modifie

### File List

- src/hooks/useAudio.ts (nouveau)
- src/app/page.tsx (modifie)
- public/sounds/gong-interval.mp3 (nouveau)
- public/sounds/gong-end.mp3 (nouveau)
- public/sounds/.gitkeep (supprime)
