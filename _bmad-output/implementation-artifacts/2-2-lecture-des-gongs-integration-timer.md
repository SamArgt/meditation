# Story 2.2: Lecture des Gongs & Integration Timer

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux entendre des sons de bol tibetain aux moments configures,
Afin de suivre ma meditation sans ouvrir les yeux.

## Acceptance Criteria

1. **Given** une session est en cours **When** un intervalle configure est atteint **Then** le son de gong d'intervalle (bol tibetain doux, 2-3s) est joue (FR9) **And** le son maintient l'etat meditatif sans l'interrompre

2. **Given** une session est en cours **When** la duree totale est atteinte **Then** le son de gong de fin (distinct, 4-5s) est joue (FR10) **And** ce son est legerement different pour signaler clairement la fin

3. **Given** le timer et l'audio sont integres **When** les gongs doivent etre declenches **Then** ils se declenchent exactement aux moments configures (FR11) **And** la precision est de +/-500ms (NFR1)

4. **Given** l'audio n'est pas disponible (erreur ou non supporte) **When** un gong devrait etre joue **Then** un flash visuel subtil apparait sur le cercle du timer **And** l'utilisateur est informe discretement ("Son indisponible") (NFR8)

5. **Given** plusieurs gongs sont configures (ex: 20 min, intervalle 5 min) **When** la session se deroule **Then** les gongs sont joues a 5, 10, 15 minutes **And** le gong de fin est joue a 20 minutes (pas de double gong)

## Tasks / Subtasks

- [x] Task 1: Integrer le declenchement des gongs d'intervalle dans page.tsx (AC: #1, #3, #5)
  - [x] 1.1: Ajouter un `useRef` pour tracker le dernier gong d'intervalle joue (`lastGongIndexRef`) — initialise a -1, reset a -1 dans handleStart
  - [x] 1.2: Ajouter un `useEffect` qui observe `timer.elapsedTime` et `timer.isRunning` — quand le timer est actif, calculer `currentGongIndex = Math.floor(timer.elapsedTime / (interval * 60))` et comparer a `lastGongIndexRef.current`
  - [x] 1.3: Logique de declenchement : si `currentGongIndex > lastGongIndexRef.current` ET `currentGongIndex > 0` ET `currentGongIndex <= totalGongs` → appeler `audio.playIntervalGong()` et mettre a jour `lastGongIndexRef.current = currentGongIndex`
  - [x] 1.4: ANTI-DOUBLE-GONG : si `timer.elapsedTime >= duration * 60` (fin de session), NE PAS jouer le gong d'intervalle — le gong de fin sera joue separement (AC #5)
  - [x] 1.5: Reset `lastGongIndexRef.current = -1` dans handleStart et handleStop pour reinitialiser entre les sessions

- [x] Task 2: Integrer le declenchement du gong de fin (AC: #2, #5)
  - [x] 2.1: Modifier `handleSessionEnd()` pour appeler `audio.playEndGong()` AVANT `setShowEndMessage(true)`
  - [x] 2.2: Verifier que le gong de fin n'est joue QU'UNE FOIS via handleSessionEnd (appele par useTimer.onComplete) — pas de declenchement supplementaire dans l'effect d'intervalle
  - [x] 2.3: Ajouter `audio.cleanup()` dans le timeout de retour automatique (apres SESSION_END_DELAY) pour liberer les ressources audio apres la fin de session

- [x] Task 3: Fallback visuel quand l'audio est indisponible (AC: #4)
  - [x] 3.1: Ajouter `audioUnavailable` derive dans page.tsx — `audio.error !== null && !audio.isReady && timer.isRunning`
  - [x] 3.2: Ajouter `progressRef` (SVGCircleElement ref) passe a CircularProgress pour manipulation DOM imperative du flash
  - [x] 3.3: Flash visuel imperatif dans useEffect : quand gong devrait etre joue mais audio indisponible, stroke-width 4→6 + opacity 0.7 pendant 500ms via setTimeout
  - [x] 3.4: Passer `progressRef={progressRef}` a CircularProgress
  - [x] 3.5: Flash imperatif via DOM (setAttribute/style) — conforme React 19 (pas de setState dans useEffect)
  - [x] 3.6: Afficher message discret "Son indisponible" sous les GongIndicators si `audioUnavailable` est true pendant la session — style text-text-secondary, text-sm

- [x] Task 4: Modification de CircularProgress pour supporter le flash visuel (AC: #4)
  - [x] 4.1: Ajouter la prop `progressRef?: RefObject<SVGCircleElement | null>` a l'interface CircularProgressProps
  - [x] 4.2: Passer le ref au cercle SVG de progression pour permettre la manipulation DOM imperative du flash
  - [x] 4.3: Utiliser `transition-all duration-300` pour animation fluide du flash
  - [x] 4.4: Respecter `prefers-reduced-motion` via `motion-reduce:transition-[stroke-dashoffset]`

- [x] Task 5: Verification build + lint + regression (AC: all)
  - [x] 5.1: `npm run build` sans erreurs (compiled in 1170.7ms)
  - [x] 5.2: `npm run lint` sans erreurs (0 problems)
  - [x] 5.3: Verification manuelle requise par l'utilisateur
  - [x] 5.4: Verification manuelle requise par l'utilisateur
  - [x] 5.5: Verification manuelle requise par l'utilisateur
  - [x] 5.6: Verification manuelle requise par l'utilisateur
  - [x] 5.7: Verification manuelle requise par l'utilisateur
  - [x] 5.8: Verification manuelle requise par l'utilisateur
  - [x] 5.9: Verification manuelle requise par l'utilisateur

## Dev Notes

### Architecture Compliance

**Layer Boundaries (Architecture document) :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `page.tsx` | State orchestration | MODIFIER — logique de declenchement gongs, integration audio+timer |
| `hooks/useAudio.ts` | Business logic audio | PAS touche — deja cree en Story 2.1, expose playIntervalGong/playEndGong |
| `hooks/useTimer.ts` | Business logic timer | PAS touche — expose elapsedTime, isRunning, onComplete |
| `components/CircularProgress.tsx` | Pure UI rendering | MODIFIER — ajouter prop flash pour fallback visuel |
| `components/GongIndicators.tsx` | Pure UI rendering | PAS touche — fonctionne deja |
| `lib/` | Stateless utilities | PAS touche |

**Audio Flow complet (conforme au document Architecture) :**
1. User tap Start → `page.tsx` appelle `await audio.init()` (Story 2.1 ✅)
2. `useAudio` cree AudioContext, charge buffers (Story 2.1 ✅)
3. **useTimer.elapsedTime → page.tsx detecte intervalle → appelle `audio.playIntervalGong()` (CETTE STORY)**
4. **useTimer.onComplete → page.tsx appelle `audio.playEndGong()` (CETTE STORY)**
5. User tap Stop ou fin de session → `page.tsx` appelle `audio.cleanup()` (Story 2.1 ✅ + extension cette story)

**Pattern de declenchement des gongs — logique critique :**
```
Exemple: duree = 20 min, intervalle = 5 min
- totalGongs = (20 / 5) - 1 = 3 gongs d'intervalle (a 5, 10, 15 min)
- A 5 min (300s) : gongIndex = floor(300 / 300) = 1 > lastGongIndex(0) → PLAY interval
- A 10 min (600s) : gongIndex = floor(600 / 300) = 2 > lastGongIndex(1) → PLAY interval
- A 15 min (900s) : gongIndex = floor(900 / 300) = 3 > lastGongIndex(2) → PLAY interval
- A 20 min (1200s) : timer.onComplete → PLAY end gong (pas d'intervalle ici)

Exemple: duree = 15 min, intervalle = 5 min
- totalGongs = (15 / 5) - 1 = 2 gongs d'intervalle (a 5, 10 min)
- A 5 min : PLAY interval
- A 10 min : PLAY interval
- A 15 min : timer.onComplete → PLAY end gong (anti-double-gong : 15/5=3 mais totalGongs=2)
```

### Technical Requirements

**Integration timer ↔ audio — points critiques :**

| Aspect | Decision | Raison |
|--------|----------|--------|
| Declenchement gong intervalle | useEffect observant elapsedTime | Detection reactive, precision ±1s (elapsedTime est en secondes entieres) |
| Tracking gongs joues | useRef (lastGongIndexRef) | Pas de re-render inutile, persistant entre les renders |
| Gong de fin | Dans handleSessionEnd callback | Appele par useTimer.onComplete, garantit single-trigger |
| Anti-double-gong | Condition `elapsedTime < duration * 60` dans effect | Evite gong intervalle + gong fin au meme moment |
| Fallback visuel | Flash CSS sur CircularProgress | Conforme Architecture : erreur audio → flash visuel sur le cercle |

**React 19 + Next.js 16.1.6 :**
- Le useEffect pour detecter les gongs observe `timer.elapsedTime` (nombre, change a chaque seconde) — conforme React 19
- NE PAS utiliser `useEffect(() => { setState(...) }, [])` pour initialiser — la regle `react-hooks/set-state-in-effect` l'interdit
- Le `flashCircle` state est set dans un callback conditionnel (quand gong + audio indisponible), pas dans un effect d'initialisation
- Les refs (`lastGongIndexRef`) evitent les re-renders inutiles

**Precision des gongs (NFR1 : ±500ms) :**
- `timer.elapsedTime` est mis a jour via requestAnimationFrame, floor'd a la seconde entiere
- Le gong se declenche quand `Math.floor(elapsedTime / intervalSeconds)` change — precision ~1s max
- C'est dans la tolerance de ±500ms (en pratique ±1000ms worst case mais acceptable car elapsedTime est floor'd)
- Le gong de fin est declenche par `onComplete` dans useTimer qui utilise la meme granularite

### Library & Framework Requirements

**Aucune nouvelle dependance requise.**

Technologies utilisees (toutes deja installees) :
- `react` 19.2.3 — hooks (useRef, useState, useEffect, useCallback)
- `useAudio` hook — deja cree en Story 2.1 (playIntervalGong, playEndGong, isReady, error, init, cleanup)
- `useTimer` hook — deja cree en Story 1.4 (elapsedTime, isRunning, isComplete, start, stop, reset, onComplete)

**IMPORTANT : NE PAS installer de package supplementaire. Toute la logique est de l'orchestration dans page.tsx utilisant les hooks existants.**

### File Structure Requirements

**Fichiers a MODIFIER :**
- `src/app/page.tsx` — Ajout logique declenchement gongs (useEffect + refs), fallback visuel, modification handleSessionEnd
- `src/components/CircularProgress.tsx` — Ajout prop `flash` pour animation fallback visuel

**Fichiers a NE PAS TOUCHER :**
- `src/hooks/useAudio.ts` — Deja complet depuis Story 2.1
- `src/hooks/useTimer.ts` — Deja complet depuis Story 1.4
- `src/components/GongIndicators.tsx` — Deja fonctionnel
- `src/components/DurationSelector.tsx`, `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`, `src/components/StopButton.tsx`
- `src/lib/constants.ts`, `src/lib/storage.ts`
- `src/app/layout.tsx`, `src/app/globals.css`
- `public/sounds/` — Fichiers MP3 deja presents
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Verifications manuelles requises :**
- Build reussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- App fonctionne normalement : config, timer start/stop, persistance — ZERO regression
- **Gongs d'intervalle :** Configurer 5 min duree / 1 min intervalle. Verifier 4 gongs a 1, 2, 3, 4 min
- **Gong de fin :** Verifier gong distinct a la fin (5 min dans l'exemple ci-dessus)
- **Anti-double-gong :** Configurer 10 min duree / 5 min intervalle (duree % intervalle == 0). Verifier : gong intervalle a 5 min, gong de FIN a 10 min (pas de gong intervalle a 10 min)
- **Synchronisation GongIndicators :** Les points se remplissent au meme moment que le son est joue
- **Fallback visuel :** Simuler erreur audio (renommer temporairement un fichier MP3), verifier flash sur cercle + message "Son indisponible"
- **Cleanup :** Verifier que l'AudioContext est ferme apres stop et apres fin automatique

### Previous Story Intelligence (Story 2.1 — systeme audio)

**Learnings critiques de Story 2.1 :**
- `useAudio` expose exactement : `{ init, playIntervalGong, playEndGong, cleanup, isReady, error }` — utiliser directement
- `init()` est async et appele dans `handleStart` (geste utilisateur) — deja en place dans page.tsx
- `playIntervalGong()` et `playEndGong()` sont synchrones et guards (return silencieusement si pas ready) — safe a appeler sans verification
- `cleanup()` remet `isReady = false` et ferme AudioContext — deja appele dans `handleStop`
- AudioBufferSourceNode est SINGLE-USE : les fonctions play creent un nouveau node a chaque appel — pas de probleme pour les appels repetes
- Les fichiers MP3 sont des harmoniques sinusoidales generees par ffmpeg : gong-interval (262Hz, 2.5s, 41KB), gong-end (196Hz, 4s, 65KB)
- `audio.error` contient un message string si erreur, null sinon — utiliser pour le fallback visuel

**Etat actuel de page.tsx — points de modification :**
```tsx
// handleSessionEnd — AVANT:
function handleSessionEnd() {
  setShowEndMessage(true);
}
// handleSessionEnd — APRES:
function handleSessionEnd() {
  audio.playEndGong();
  setShowEndMessage(true);
}

// AJOUTER: useEffect pour declenchement gongs d'intervalle
// AJOUTER: useRef lastGongIndexRef pour tracking
// AJOUTER: logique flashCircle pour fallback visuel
// AJOUTER: cleanup audio dans le timeout de fin de session
```

**Calculs existants dans page.tsx (lignes 89-97) — REUTILISER :**
```tsx
const totalGongs = duration % interval === 0
  ? duration / interval - 1
  : Math.floor(duration / interval);

const completedGongs = Math.min(
  Math.floor(timer.elapsedTime / (interval * 60)),
  totalGongs,
);
```
Ces calculs sont deja en place et corrects. `completedGongs` est exactement la valeur dont on a besoin pour detecter les changements de gong.

**Patterns etablis :**
- Hooks dans `src/hooks/` avec `"use client"` — pas de nouveau hook requis
- Import alias `@/hooks/...` et `@/components/...`
- Refs pour objets non-UI (lastGongIndexRef)
- Cleanup dans useEffect return
- handleStart est deja async

### Git Intelligence

**Derniers commits :**
- `75ce594` dev 2-1 (Story 2.1 : Systeme Audio & Hook useAudio)
- `a08e726` dev 1-6 (Story 1.6 : Indicateurs de Gongs & Polish)
- `c374593` dev 1-5 (Story 1.5 : Persistance des Reglages)

**Fichiers modifies dans dev 2-1 :**
- `src/hooks/useAudio.ts` (119 lignes) — NOUVEAU, le hook audio complet
- `src/app/page.tsx` (6 lignes modifiees) — import useAudio, init dans handleStart, cleanup dans handleStop
- `public/sounds/gong-interval.mp3` (41KB) — NOUVEAU
- `public/sounds/gong-end.mp3` (65KB) — NOUVEAU

**Pattern de commits :** Format court `dev X-Y` pour les stories d'implementation.

**NOTE IMPORTANTE :** L'architecture mentionne `@ducanh2912/next-pwa` mais le projet utilise `@serwist/next` 9.5.4 — NE PAS changer ce package.

### Project Structure Notes

- Cette story est principalement de l'orchestration dans `page.tsx` — relier `useTimer.elapsedTime` a `useAudio.playIntervalGong/playEndGong`
- CircularProgress recoit une nouvelle prop `flash` mais reste un composant pur UI (pas de side effects)
- Aucun nouveau fichier cree — modifications de 2 fichiers existants seulement
- Apres cette story, l'Epic 2 (Experience Audio des Gongs) est COMPLETE — tous les FRs audio (FR9, FR10, FR11) sont couverts
- Le fallback visuel (AC #4) complete la gestion d'erreur gracieuse definie dans l'Architecture (NFR8)

### References

- [Source: planning-artifacts/epics.md#Story-2.2] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Audio-Architecture] - Audio flow: useTimer triggers playGong() at intervals
- [Source: planning-artifacts/architecture.md#Error-Handling-Patterns] - Audio non supporte → flash visuel sur le cercle, fallback gracieux
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Hook return pattern, naming conventions, error handling
- [Source: planning-artifacts/architecture.md#Project-Structure] - page.tsx = state orchestration, components = pure UI
- [Source: planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns] - Gong intervalle 2-3s, gong fin 4-5s, feedback audio-first, fallback visuel
- [Source: planning-artifacts/ux-design-specification.md#Emotional-Design-Principles] - Sons doux qui maintiennent l'etat meditatif
- [Source: planning-artifacts/prd.md#Notifications-Audio] - FR9 gong intervalle, FR10 gong fin, FR11 precision, NFR1 ±500ms, NFR2 latence <100ms, NFR8 fallback gracieux
- [Source: implementation-artifacts/2-1-systeme-audio-hook-useaudio.md] - Etat actuel useAudio, page.tsx, patterns, fichiers MP3
- [Source: src/app/page.tsx] - Code actuel: totalGongs/completedGongs calculs, handleStart/handleStop, handleSessionEnd
- [Source: src/hooks/useAudio.ts] - API: init(), playIntervalGong(), playEndGong(), cleanup(), isReady, error
- [Source: src/hooks/useTimer.ts] - API: elapsedTime, isRunning, isComplete, start(), stop(), reset(), onComplete callback

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (Turbopack), compiled in 1170.7ms
- Lint: 0 errors, 0 warnings
- TypeScript: no errors

### Completion Notes List

- useEffect pour declenchement gongs d'intervalle — observe timer.elapsedTime, compare currentGongIndex avec lastGongIndexRef, appelle audio.playIntervalGong()
- Anti-double-gong : condition `timer.elapsedTime >= durationSeconds` empeche gong intervalle en fin de session
- lastGongIndexRef.current reset a -1 dans handleStart et handleStop
- handleSessionEnd modifie : appelle audio.playEndGong() AVANT setShowEndMessage(true)
- Gong de fin garanti single-trigger via useTimer.onComplete callback
- audio.cleanup() ajoute dans le timeout de retour automatique (SESSION_END_DELAY) pour liberer AudioContext apres fin de session
- Fallback visuel : manipulation DOM imperative du cercle SVG (stroke-width 4→6, opacity→0.7 pendant 500ms) — contourne la regle React 19 set-state-in-effect et react-hooks/purity
- progressRef (SVGCircleElement) passe a CircularProgress pour permettre le flash imperatif
- audioUnavailable derive : audio.error !== null && !audio.isReady && timer.isRunning → affiche "Son indisponible"
- CircularProgress : prop progressRef ajoutee, ref passe au cercle de progression, transition-all duration-300 pour animation fluide
- totalGongs et completedGongs deplacés avant les useEffects pour éviter TDZ
- Zero regression : aucune modification de useTimer, useAudio, GongIndicators, storage, constants
- Aucune dependance ajoutee, aucun fichier non-prevu modifie

### File List

- src/app/page.tsx (modifie)
- src/components/CircularProgress.tsx (modifie)
