# Story 1.4: Logique Timer & Gestion Session

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux que le timer fonctionne avec précision et se termine automatiquement,
Afin de méditer en confiance sans surveiller le temps.

## Acceptance Criteria

1. **Given** une session est démarrée **When** le temps passe **Then** le timer s'incrémente en temps réel (affichage fluide) **And** le cercle de progression se "vide" proportionnellement

2. **Given** une session est en cours **When** la durée totale configurée est atteinte **Then** la session se termine automatiquement (FR8) **And** le timer affiche 00:00 ou la durée totale selon le mode d'affichage

3. **Given** une session se termine **When** la fin est atteinte **Then** l'écran indique clairement la fin de session **And** après 3 secondes, retour automatique à l'écran principal

4. **Given** le hook useTimer est implémenté **When** il gère l'état du timer **Then** il expose : elapsedTime, isRunning, start(), stop(), reset() **And** il respecte le pattern de retour standardisé (data, actions, status)

5. **Given** le timer fonctionne **When** je mesure sa précision **Then** les intervalles sont respectés à ±500ms (NFR1)

## Tasks / Subtasks

- [ ] Task 1: Créer le hook `useTimer` (AC: #4, #5)
  - [ ] 1.1: Créer `src/hooks/useTimer.ts` respectant le pattern de retour standardisé Architecture (data, actions, status)
  - [ ] 1.2: Interface de retour : `{ elapsedTime: number; isRunning: boolean; isComplete: boolean; start: () => void; stop: () => void; reset: () => void; }`
  - [ ] 1.3: Utiliser `performance.now()` comme source de timing pour éviter la dérive de `setInterval` — stocker `startTimeRef` via `useRef`
  - [ ] 1.4: Boucle de mise à jour via `requestAnimationFrame` : calculer `elapsed = performance.now() - startTimeRef`, mettre à jour `elapsedTime` à chaque seconde (floor du elapsed en secondes)
  - [ ] 1.5: Paramètre `duration` (en minutes) — le hook compare `elapsedTime >= duration * 60` pour déclencher la fin automatique
  - [ ] 1.6: Quand la session se termine automatiquement : mettre `isRunning=false`, `isComplete=true`, appeler le callback `onComplete()` (optionnel)
  - [ ] 1.7: Cleanup du `requestAnimationFrame` dans le return du `useEffect` et lors de `stop()`/`reset()`
  - [ ] 1.8: Gérer le retour de l'onglet en arrière-plan via Page Visibility API — recalculer le temps écoulé réel au retour au premier plan

- [ ] Task 2: Intégrer useTimer dans page.tsx (AC: #1, #2, #3)
  - [ ] 2.1: Remplacer le timer basique (useState + useEffect + setInterval) par un appel à `useTimer({ duration, onComplete: handleSessionEnd })`
  - [ ] 2.2: Supprimer les `useState` pour `isRunning` et `elapsedSeconds` — ces états viennent maintenant de useTimer
  - [ ] 2.3: Adapter `handleStart()` → appeler `timer.start()`, `handleStop()` → appeler `timer.stop()` puis `timer.reset()`
  - [ ] 2.4: Passer `timer.elapsedTime` (en secondes entières) à `CircularProgress` via la prop `elapsedSeconds`
  - [ ] 2.5: Passer `timer.isRunning` à `CircularProgress` et pour le rendu conditionnel Start/Stop + sélecteurs

- [ ] Task 3: Implémenter la fin automatique de session (AC: #2, #3)
  - [ ] 3.1: Créer `handleSessionEnd()` dans page.tsx — appelée par le callback `onComplete` de useTimer
  - [ ] 3.2: Quand la session se termine : afficher un état "terminé" (le cercle est complètement vidé, le timer affiche la durée totale ex: "20:00")
  - [ ] 3.3: Après 3 secondes (setTimeout), appeler `timer.reset()` pour retourner automatiquement à l'écran principal (mode repos)
  - [ ] 3.4: Pendant les 3 secondes de fin, afficher un feedback visuel clair (ex: texte "Session terminée" sous le cercle, fade subtil)
  - [ ] 3.5: Pendant les 3 secondes de fin, NE PAS afficher les sélecteurs ni le bouton Start — seulement le cercle et le message

- [ ] Task 4: Mettre à jour CircularProgress pour les nouveaux états (AC: #1, #2, #3)
  - [ ] 4.1: Ajouter une prop optionnelle `isComplete` (boolean) à CircularProgress
  - [ ] 4.2: En mode `isComplete=true` : cercle complètement vidé (progress=1), afficher la durée totale (pas elapsedSeconds)
  - [ ] 4.3: Vérifier que la transition du cercle reste fluide avec le nouveau hook basé sur requestAnimationFrame (la transition CSS `duration-1000 ease-linear` sur stroke-dashoffset devrait toujours fonctionner car la mise à jour est chaque seconde)

- [ ] Task 5: Vérification build + lint (AC: all)
  - [ ] 5.1: `npm run build` sans erreurs
  - [ ] 5.2: `npm run lint` sans erreurs
  - [ ] 5.3: Vérifier manuellement : session démarre, temps s'incrémente, cercle se vide, session se termine automatiquement à la durée configurée, retour au repos après 3s

## Dev Notes

### Architecture Compliance

**Hook useTimer — Pattern standardisé (Architecture) :**

Le hook `useTimer` est le premier custom hook de l'application. Il DOIT respecter le pattern Architecture :

```typescript
// Pattern de retour standardisé pour hooks custom
interface UseTimerReturn {
  // Data
  elapsedTime: number;       // Temps écoulé en secondes (entier)
  // Status
  isRunning: boolean;
  isComplete: boolean;
  // Actions
  start: () => void;
  stop: () => void;
  reset: () => void;
}
```

**Approche timing — performance.now() + requestAnimationFrame :**

L'implémentation actuelle utilise `setInterval(1000ms)` qui souffre de dérive temporelle. Pour respecter la précision ±500ms (NFR1), le hook useTimer DOIT :

1. Utiliser `performance.now()` comme horloge source (monotone, microseconde de précision)
2. Stocker le `startTime` dans un `useRef` (pas dans l'état React)
3. Utiliser `requestAnimationFrame` pour la boucle de mise à jour (sync avec le repaint navigateur)
4. Calculer le temps écoulé par différence : `elapsed = performance.now() - startTime`
5. Mettre à jour l'état `elapsedTime` seulement quand la seconde change (floor)

```typescript
// Pattern d'implémentation recommandé
const startTimeRef = useRef<number>(0);
const rafRef = useRef<number>(0);

function tick() {
  const elapsed = (performance.now() - startTimeRef.current) / 1000;
  const elapsedSeconds = Math.floor(elapsed);
  setElapsedTime(elapsedSeconds);

  if (elapsedSeconds >= durationInSeconds) {
    // Session terminée automatiquement
    setIsRunning(false);
    setIsComplete(true);
    onComplete?.();
    return;
  }

  rafRef.current = requestAnimationFrame(tick);
}
```

**Page Visibility API — Gestion de l'onglet en arrière-plan :**

Les navigateurs throttlent `requestAnimationFrame` quand l'onglet est en arrière-plan. Grâce à `performance.now()` comme source de timing, le temps écoulé est recalculé correctement au retour au premier plan — pas de perte de précision. Le hook doit :
- Écouter `visibilitychange` sur `document`
- Au retour au premier plan (`visible`), lancer un tick immédiat pour recalculer le temps
- Si la durée est dépassée pendant l'arrière-plan, déclencher `onComplete` immédiatement

**Boundaries à respecter :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `hooks/` | Business logic, side effects | `useTimer.ts` — NOUVEAU, logique timer complète |
| `page.tsx` | State orchestration, composition | MODIFIER — remplacer setInterval par useTimer, ajouter handleSessionEnd |
| `components/` | Pure UI rendering | MODIFIER — CircularProgress ajouter prop isComplete |
| `lib/` | Stateless utilities | PAS touché |

**Data Flow après cette story :**
- `page.tsx` appelle `useTimer({ duration, onComplete })`
- `useTimer` retourne `{ elapsedTime, isRunning, isComplete, start, stop, reset }`
- `page.tsx` passe `elapsedTime` et `isRunning` à `CircularProgress` via props
- `page.tsx` gère les callbacks `handleStart` (→ timer.start()), `handleStop` (→ timer.stop() + timer.reset())
- `useTimer.onComplete` → `handleSessionEnd()` → affichage fin 3s → `timer.reset()`

### Technical Requirements

**Tailwind CSS v4 — Rappels critiques :**
- Configuration via `@theme` dans `globals.css` (PAS `tailwind.config.js`)
- Design tokens disponibles : `bg-background`, `bg-surface`, `bg-accent`, `text-text-primary`, `text-text-secondary`
- Classes inline uniquement, ordre : Layout → Spacing → Sizing → Colors → Effects → States

**React 19 + Next.js 16.1.6 :**
- `'use client'` PAS nécessaire pour les hooks purs (seulement pour composants avec JSX ou browser APIs)
- MAIS useTimer utilise `performance.now()`, `requestAnimationFrame`, `document.addEventListener` → il a besoin de l'environnement navigateur
- Le hook sera utilisé dans `page.tsx` qui est déjà `'use client'`, donc pas besoin de marquer le hook lui-même
- `useRef` pour startTimeRef et rafRef (pas d'état React pour ces valeurs internes)
- `useEffect` pour setup/cleanup du requestAnimationFrame et de l'event listener visibilitychange
- `useState` pour elapsedTime, isRunning, isComplete
- `useCallback` NON nécessaire pour start/stop/reset — app simple, pas de problèmes de performance

**Conventions de nommage (Architecture) :**

| Élément | Convention | Exemples pour cette story |
|---------|------------|---------------------------|
| Hook | camelCase + prefix `use` | `useTimer.ts` |
| Interface de retour | PascalCase | `UseTimerReturn` |
| Paramètres | PascalCase | `UseTimerOptions` |
| Refs internes | camelCase + Ref suffix | `startTimeRef`, `rafRef` |
| Handlers | camelCase prefix handle | `handleSessionEnd()` |
| Constantes | SCREAMING_SNAKE_CASE | `SESSION_END_DELAY` |

### UX Design Compliance

**Fin de session — Expérience utilisateur :**
- Le gong de fin sera ajouté en Epic 2 (Story 2.2) — pour l'instant, la fin est uniquement visuelle
- L'écran de fin doit être calme et serein, pas de pop-up ni de notification intrusive
- Le retour automatique après 3 secondes respecte le pattern "Retour automatique" du UX Design
- Pendant les 3 secondes de fin : afficher un message subtil comme "Session terminée" en `text-text-secondary`
- Le cercle reste en état "complet" (vidé à 100%) pendant les 3 secondes

**Pattern "Zéro confirmation" :**
- La fin de session est automatique, pas de bouton "OK" ou "Continuer"
- Le retour au repos est automatique après le délai
- L'atmosphère zen est préservée (pas d'animation flashy à la fin)

**Accessibilité :**
- Ajouter `aria-live="polite"` sur le message "Session terminée" pour les lecteurs d'écran
- Le timer continue d'être accessible via la sémantique HTML existante

### Previous Story Intelligence (Story 1.3)

**Learnings critiques de Story 1.3 :**
- CircularProgress utilise SVG avec `viewBox="0 0 200 200"`, rayon 90, `stroke-dasharray`/`stroke-dashoffset`
- Transition CSS `transition-[stroke-dashoffset] duration-1000 ease-linear` sur le cercle de progression — cette transition est synchronisée avec la mise à jour chaque seconde
- `formatTime()` est défini DANS CircularProgress.tsx (pas exporté) — si besoin ailleurs, extraire vers `lib/`
- page.tsx utilise conditional rendering `{!isRunning && ...}` pour masquer les sélecteurs
- StartButton/StopButton sont des composants simples avec un callback `onClick`
- Le timer actuel utilise `window.setInterval` dans un `useEffect` de page.tsx — c'est exactement ce qui sera remplacé

**État actuel de page.tsx (à modifier) :**
```tsx
// À SUPPRIMER : useState pour isRunning et elapsedSeconds
const [isRunning, setIsRunning] = useState(false);
const [elapsedSeconds, setElapsedSeconds] = useState(0);

// À SUPPRIMER : useEffect avec setInterval
useEffect(() => {
  if (!isRunning) return;
  const id = window.setInterval(() => {
    setElapsedSeconds((prev) => prev + 1);
  }, 1000);
  return () => window.clearInterval(id);
}, [isRunning]);

// À REMPLACER par :
const timer = useTimer({ duration, onComplete: handleSessionEnd });
```

**Fichiers existants à NE PAS toucher :**
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/constants.ts`
- `src/components/DurationSelector.tsx`
- `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`
- `src/components/StopButton.tsx`

### Git Intelligence

**Derniers commits :**
- `9d90593` dev 1-3 (Story 1.3 : Affichage Timer & Contrôles)
- `b96cc08` dev 1-2 (Story 1.2 : Interface de Configuration)
- `86c9aa0` dev 1.1 (Story 1.1 : Fondation du Projet & Layout)

**Patterns de commits :** Format court "dev X-Y" pour les stories d'implémentation.

**Fichiers ajoutés/modifiés en Story 1.3 :**
- `src/components/CircularProgress.tsx` (nouveau)
- `src/components/StartButton.tsx` (nouveau)
- `src/components/StopButton.tsx` (nouveau)
- `src/app/page.tsx` (modifié — ajout timer basique, isRunning, elapsedSeconds)

### Library & Framework Requirements

**React 19 :**
- `useRef` pour performance.now() start time et requestAnimationFrame ID
- `useEffect` pour setup/cleanup de la boucle RAF et de l'event listener visibilitychange
- `useState` pour elapsedTime, isRunning, isComplete
- PAS de bibliothèques externes pour le timer (pas de worker-timers, pas de use-timer) — hook custom maison

**Next.js 16.1.6 :**
- App Router, fichiers hooks dans `/src/hooks/`
- Le hook useTimer est un module TypeScript pur — pas de directive `'use client'` nécessaire (sera utilisé dans un client component)

**performance.now() :**
- Disponible dans tous les navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Horloge monotone, précision sub-milliseconde
- Pas affecté par les ajustements d'horloge système

**requestAnimationFrame :**
- Sync avec le cycle de repaint navigateur (~16.6ms pour 60fps)
- Throttled en arrière-plan (c'est pourquoi on utilise performance.now() pour le timing réel)
- Cleanup avec `cancelAnimationFrame()`

**Page Visibility API :**
- `document.visibilityState` : "visible" | "hidden"
- Event : `visibilitychange` sur `document`
- Supporté par tous les navigateurs cibles

### File Structure Requirements

**Fichiers à CRÉER :**
- `src/hooks/useTimer.ts` — Le premier hook custom de l'application

**Fichiers à MODIFIER :**
- `src/app/page.tsx` — Remplacer timer basique par useTimer, ajouter handleSessionEnd, état de fin
- `src/components/CircularProgress.tsx` — Ajouter prop optionnelle `isComplete`

**Fichiers à NE PAS TOUCHER :**
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/constants.ts`
- `src/components/DurationSelector.tsx`
- `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`
- `src/components/StopButton.tsx`
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Vérifications manuelles requises :**
- Build réussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- Session démarre avec tap Start → timer s'incrémente chaque seconde
- Cercle de progression se vide proportionnellement au temps écoulé
- Session se termine automatiquement quand la durée configurée est atteinte
- À la fin : affichage "Session terminée" pendant 3 secondes, puis retour automatique au mode repos
- Après retour au repos : timer remis à zéro, cercle complet, sélecteurs visibles, bouton Start visible
- Timer précis : vérifier sur une session de 1 minute que la fin arrive à ±500ms de 60 secondes
- Tab en arrière-plan : démarrer session, aller sur un autre onglet 30s, revenir → le temps écoulé est correct

### Project Structure Notes

- `src/hooks/useTimer.ts` est le premier fichier dans le dossier `/hooks/` — ce dossier n'existe pas encore, il sera créé
- Ce hook établit le pattern pour `useAudio` (Epic 2, Story 2.1) et `useWakeLock` (Epic 3, Story 3.2) qui suivront le même pattern de retour standardisé
- La logique timer est maintenant encapsulée dans un hook dédié, conformément à la boundary Architecture `hooks/ = Business logic`
- `page.tsx` reste l'orchestrateur d'état — il appelle le hook et distribue les données aux composants via props

### References

- [Source: planning-artifacts/epics.md#Story-1.4] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Structure projet, hooks custom, boundaries
- [Source: planning-artifacts/architecture.md#State-Management-Patterns] - Pattern de retour standardisé hooks
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Naming conventions, error handling
- [Source: planning-artifacts/prd.md#Contrôle-du-Timer] - FR5-FR8 (démarrer, voir temps, arrêter, fin automatique)
- [Source: planning-artifacts/prd.md#Performance] - NFR1 (précision ±500ms), NFR4 (réactivité UI <100ms)
- [Source: planning-artifacts/ux-design-specification.md#Session-Active] - Flow session active, retour auto après fin
- [Source: planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns] - Pattern "Zéro confirmation", retour automatique
- [Source: implementation-artifacts/1-3-affichage-timer-controles.md] - Intelligence Story 1.3, état actuel page.tsx et CircularProgress

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
