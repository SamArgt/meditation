# Story 1.6: Indicateurs de Gongs & Polish

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux voir des indicateurs visuels des gongs pendant ma session,
Afin de savoir où j'en suis sans dépendre uniquement du son.

## Acceptance Criteria

1. **Given** une session est en cours **When** je regarde l'interface **Then** je vois des points indicateurs (GongIndicators) sous le timer **And** le nombre de points correspond au nombre de gongs prévus (durée / intervalle - 1, sans compter le gong de fin)

2. **Given** les indicateurs de gongs sont affichés **When** un intervalle est atteint (moment du gong) **Then** le point correspondant passe de vide à rempli **And** une animation subtile accompagne le changement (scale ou opacity, respectant `prefers-reduced-motion`)

3. **Given** je suis sur l'écran principal (mode repos) **When** je veux démarrer une session **Then** je peux configurer et démarrer en moins de 10 secondes (FR15) **And** l'interface ne présente aucune friction inutile

4. **Given** l'interface complète est affichée **When** je l'évalue visuellement **Then** elle respecte la direction "Circular Focus" du UX Design **And** les espacements sont généreux (breathing room) **And** la typographie est lisible (serif pour timer, sans-serif pour labels)

## Tasks / Subtasks

- [x] Task 1: Créer le composant `src/components/GongIndicators.tsx` (AC: #1, #2)
  - [x] 1.1: Créer `src/components/GongIndicators.tsx` — composant pur UI (props only, aucun side effect)
  - [x] 1.2: Interface props : `totalGongs: number`, `completedGongs: number`
  - [x] 1.3: Rendre une rangée horizontale de points (dots) alignée au centre avec `flex`, `gap-2`
  - [x] 1.4: Chaque dot est un `<span>` de taille fixe (12x12px soit `w-3 h-3`) avec `rounded-full`
  - [x] 1.5: Dot vide = `border-2 border-accent bg-transparent` ; dot rempli = `bg-accent border-2 border-accent`
  - [x] 1.6: Animation subtile au remplissage : `transition-all duration-500 ease-out` + `scale-110` momentané via CSS transition sur `bg-accent` — respecter `motion-reduce:transition-none`
  - [x] 1.7: Si `totalGongs === 0`, ne rien rendre (return `null`) — cas où durée === intervalle
  - [x] 1.8: `aria-label` sur le conteneur : "Indicateurs de gongs : {completedGongs} sur {totalGongs}"

- [x] Task 2: Intégrer GongIndicators dans `src/app/page.tsx` (AC: #1, #2, #3)
  - [x] 2.1: Importer `GongIndicators` depuis `@/components/GongIndicators`
  - [x] 2.2: Calculer `totalGongs` — logique : si `duration % interval === 0` alors `(duration / interval) - 1` sinon `Math.floor(duration / interval)`. Explication : les gongs d'intervalle ne comptent PAS le gong de fin (celui à `duration`). Ex: 20min/5min = gongs à 5, 10, 15 = 3 points.
  - [x] 2.3: Calculer `completedGongs` — logique : `Math.min(Math.floor(elapsedTime / (interval * 60)), totalGongs)` où `elapsedTime` est en secondes et `interval` en minutes. Capper à `totalGongs` pour éviter les dépassements.
  - [x] 2.4: Placer `<GongIndicators>` entre le `<CircularProgress>` et le `<StopButton>` pendant la session active (`timer.isRunning` est true)
  - [x] 2.5: NE PAS afficher GongIndicators en mode repos ni pendant le message de fin de session
  - [x] 2.6: Vérifier que l'ajout de GongIndicators n'impacte PAS le temps de configuration → FR15 (< 10 secondes)

- [x] Task 3: Polish UX & conformité "Circular Focus" (AC: #3, #4)
  - [x] 3.1: Vérifier les espacements entre CircularProgress, GongIndicators, et StopButton — `gap-8` existant dans le parent `<main>` suffit
  - [x] 3.2: Vérifier la hiérarchie visuelle : Timer (dominant) > GongIndicators (discret) > StopButton (neutre)
  - [x] 3.3: S'assurer que les dots sont suffisamment petits pour ne pas distraire pendant la session
  - [x] 3.4: Vérifier que l'interface reste lisible et calme avec les indicateurs ajoutés

- [x] Task 4: Vérification build + lint + régression (AC: all)
  - [x] 4.1: `npm run build` sans erreurs
  - [x] 4.2: `npm run lint` sans erreurs (inclut règle React 19 `react-hooks/set-state-in-effect`)
  - [x] 4.3: Vérifier manuellement : session avec 20min/5min → 3 dots affichés, se remplissent à 5, 10, 15 min
  - [x] 4.4: Vérifier manuellement : session avec 10min/10min → 0 dots (gong seulement à la fin)
  - [x] 4.5: Vérifier manuellement : session avec 15min/2min → 7 dots (gongs à 2, 4, 6, 8, 10, 12, 14 min)
  - [x] 4.6: Vérifier manuellement : les fonctionnalités existantes ne sont pas cassées (config, timer, start/stop, persistance)
  - [x] 4.7: Vérifier `prefers-reduced-motion` : animations désactivées quand le réglage OS est activé

## Dev Notes

### Architecture Compliance

**Layer Boundaries (Architecture document) :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `components/` | Pure UI rendering (props only) | `GongIndicators.tsx` — NOUVEAU |
| `page.tsx` | State orchestration | MODIFIER — calcul totalGongs/completedGongs, ajout GongIndicators |
| `hooks/` | Business logic | PAS touché |
| `lib/` | Stateless utilities | PAS touché |

**Data Flow pour GongIndicators :**
- `page.tsx` calcule `totalGongs` et `completedGongs` à partir de `duration`, `interval`, et `timer.elapsedTime`
- `GongIndicators` reçoit ces deux valeurs via props — composant 100% pur, zéro logique métier
- Le composant ne sait PAS comment les gongs sont calculés — il affiche juste N dots dont M sont remplis

**Hiérarchie visuelle conforme à "Circular Focus" (UX Design) :**
```
┌─────────────────────────────────┐
│                                 │
│   ┌───────────────────────┐     │
│   │   CircularProgress    │     │  ← Élément dominant
│   │   (timer central)     │     │
│   └───────────────────────┘     │
│                                 │
│       ● ● ○ ○  GongIndicators   │  ← Discret, sous le timer
│                                 │
│        ┌───────────┐            │
│        │   STOP    │            │  ← Neutre
│        └───────────┘            │
│                                 │
└─────────────────────────────────┘
```

### Technical Requirements

**React 19 + Next.js 16.1.6 :**
- `GongIndicators` est un composant client simple (pas de "use client" nécessaire car importé par page.tsx qui est déjà "use client")
- Pas de useState/useEffect dans GongIndicators — composant purement déclaratif
- Calculs `totalGongs`/`completedGongs` faits directement dans le rendu de page.tsx (pas besoin de state séparé, ce sont des valeurs dérivées)
- Aucune violation possible de `react-hooks/set-state-in-effect` car aucun hook ajouté

**Tailwind CSS v4 :**
- Utiliser les design tokens existants : `bg-accent`, `border-accent`, `bg-transparent`
- Ordre des classes : Layout → Spacing → Sizing → Colors → Effects → States
- `motion-reduce:transition-none` pour respecter `prefers-reduced-motion`
- NE PAS utiliser de couleurs hardcodées (`bg-[#5A8F9A]` interdit → `bg-accent`)

**Calcul du nombre de gongs d'intervalle :**
```typescript
// Nombre de gongs d'intervalle (exclut le gong de fin)
// Ex: 20min/5min → gongs à 5, 10, 15 min = 3
// Ex: 15min/2min → gongs à 2, 4, 6, 8, 10, 12, 14 min = 7
// Ex: 10min/10min → aucun gong d'intervalle = 0
const totalGongs = duration % interval === 0
  ? (duration / interval) - 1
  : Math.floor(duration / interval);

// Gongs déjà déclenchés (basé sur le temps écoulé)
const completedGongs = Math.min(
  Math.floor(timer.elapsedTime / (interval * 60)),
  totalGongs
);
```

### Library & Framework Requirements

**Aucune nouvelle dépendance requise.**

Technologies utilisées (toutes déjà installées) :
- `react` 19.2.3 — composant fonctionnel
- `tailwindcss` v4 — styles via classes utilitaires
- CSS `transition` + `prefers-reduced-motion` — animations natives du navigateur

**API navigateur utilisée :**
- `prefers-reduced-motion` via Tailwind `motion-reduce:` — supporté dans tous les navigateurs cibles

### File Structure Requirements

**Fichiers à CRÉER :**
- `src/components/GongIndicators.tsx` — Composant UI pour les indicateurs de gongs

**Fichiers à MODIFIER :**
- `src/app/page.tsx` — Import GongIndicators, calcul totalGongs/completedGongs, placement dans le JSX

**Fichiers à NE PAS TOUCHER :**
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/hooks/useTimer.ts`
- `src/components/CircularProgress.tsx`
- `src/components/DurationSelector.tsx`, `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`, `src/components/StopButton.tsx`
- `src/lib/constants.ts`, `src/lib/storage.ts`
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Vérifications manuelles requises :**
- Build réussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- Session 20min/5min : 3 dots, se remplissent progressivement
- Session 10min/10min : 0 dots (aucun gong d'intervalle)
- Session 15min/2min : 7 dots
- Session 5min/1min : 4 dots (gongs à 1, 2, 3, 4 min)
- Animation visible au remplissage d'un dot (tester avec intervalle court)
- `prefers-reduced-motion` respecté (vérifier via DevTools > Rendering > Emulate CSS media)
- Mode repos : pas de GongIndicators visibles
- Fin de session ("Session terminée") : pas de GongIndicators visibles
- Persistance toujours fonctionnelle (modifier réglages → rouvrir → restaurés)
- Timer toujours fonctionnel (start, progression, fin auto, retour 3s)

### Previous Story Intelligence (Story 1.5)

**Learnings critiques de Story 1.5 :**
- `page.tsx` utilise le pattern `useState(() => { ... })` (lazy initializer) pour charger les settings depuis localStorage — conforme à la règle React 19 `react-hooks/set-state-in-effect`
- `useEffect([duration, interval])` sauvegarde automatiquement les settings — NE PAS interférer avec ce mécanisme
- `loadSettings()` dans `src/lib/storage.ts` a un guard `typeof window === "undefined"` — le pattern SSR est déjà géré
- La variable `isActive = timer.isRunning || showEndMessage` contrôle l'affichage conditionnel — utiliser `timer.isRunning` (pas `isActive`) pour les GongIndicators car ils ne doivent PAS apparaître pendant le message de fin
- Le layout utilise `<main className="flex w-full max-w-[480px] flex-col items-center gap-8">` — le `gap-8` (32px) gère l'espacement entre les enfants
- Les sélecteurs (DurationSelector, IntervalSelector) sont wrappés dans un div conditionnel `{!isActive && ...}` — ils disparaissent pendant la session
- Le bouton Start/Stop est conditionnel `{!showEndMessage && (timer.isRunning ? <StopButton> : <StartButton>)}`

**État actuel de page.tsx — points d'insertion :**
```tsx
// ENTRE CircularProgress et le message "Session terminée" / sélecteurs :
<CircularProgress ... />
// ← INSÉRER GongIndicators ICI (conditionnel: timer.isRunning)
{showEndMessage && <p>Session terminée</p>}
{!isActive && <div>Sélecteurs</div>}
{!showEndMessage && (Start ou Stop)}
```

**Patterns établis dans les stories précédentes :**
- Composants purs : props in, JSX out, aucun side effect (CircularProgress, DurationSelector, etc.)
- Interfaces props déclarées directement dans le fichier composant (pas de fichier types séparé)
- `"use client"` seulement si le composant utilise des hooks React — GongIndicators n'en a pas besoin (importé par page.tsx qui est déjà client)
- Import alias `@/components/...` pour tous les composants

### Git Intelligence

**Derniers commits :**
- `c374593` dev 1-5 (Story 1.5 : Persistance des Réglages)
- `181122b` dev 1-4 (Story 1.4 : Logique Timer & Gestion Session)
- `f0ce83c` dev 1-4 (Story 1.4 : correction)
- `9d90593` dev 1-3 (Story 1.3 : Affichage Timer & Contrôles)
- `b96cc08` dev 1-2 (Story 1.2 : Interface de Configuration)
- `86c9aa0` dev 1.1 (Story 1.1 : Fondation du Projet & Layout)

**Patterns de commits :** Format court `dev X-Y` pour les stories d'implémentation.

**Analyse des fichiers récents :**
- Toutes les stories précédentes suivent la structure `components/` → composants purs, `hooks/` → logique métier, `page.tsx` → orchestration
- Pas de fichier CSS séparé ajouté — tout en Tailwind classes
- `@serwist/next` 9.5.4 installé (remplace `@ducanh2912/next-pwa` mentionné dans l'architecture initiale — utiliser le package déjà installé, NE PAS changer)

**Dépendances installées (aucun changement requis) :**
- `next`: 16.1.6, `react`: 19.2.3, `@serwist/next`: 9.5.4, `tailwindcss`: ^4

### Project Structure Notes

- `GongIndicators.tsx` rejoint les 5 composants existants dans `/components/` : CircularProgress, DurationSelector, IntervalSelector, StartButton, StopButton
- Ce composant complète l'architecture UI prévue dans le document Architecture (6 composants listés dont GongIndicators)
- Après cette story, TOUS les composants UI de l'Epic 1 seront implémentés
- Aucune dépendance externe — composant HTML/CSS pur via Tailwind

### References

- [Source: planning-artifacts/epics.md#Story-1.6] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Structure projet, GongIndicators.tsx dans components/
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Naming conventions, styling patterns, error handling
- [Source: planning-artifacts/ux-design-specification.md#Design-Direction-Decision] - Direction "Circular Focus", hiérarchie Timer > Indicators > Controls
- [Source: planning-artifacts/ux-design-specification.md#Component-Strategy] - GongIndicators : points visuels, dot rempli = gong passé, animation subtile
- [Source: planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns] - Pattern "audio-first, visuel secondaire", feedback discret
- [Source: planning-artifacts/ux-design-specification.md#Responsive-Design-Accessibility] - prefers-reduced-motion, touch targets, WCAG AA
- [Source: planning-artifacts/prd.md#Interface-Utilisateur] - FR15 (config < 10s), FR16 (interface lisible pendant session)
- [Source: implementation-artifacts/1-5-persistance-des-reglages.md] - État actuel page.tsx, patterns React 19, lazy initializer

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (Turbopack), compiled in 1106.6ms
- Lint: 0 errors, 0 warnings
- TypeScript: no errors

### Completion Notes List

- Composant `src/components/GongIndicators.tsx` cree — composant pur UI, props only (totalGongs, completedGongs), zero side effect
- Dots rendus avec `flex gap-2`, chaque dot `w-3 h-3 rounded-full border-2 border-accent`
- Dot vide = `bg-transparent`, dot rempli = `bg-accent scale-110`
- Animation via `transition-all duration-500 ease-out` avec `motion-reduce:transition-none`
- Return `null` si totalGongs === 0 (cas duree === intervalle)
- `aria-label` dynamique et `role="status"` pour accessibilite
- page.tsx modifie : import GongIndicators, calcul totalGongs/completedGongs comme valeurs derivees (pas de state supplementaire)
- GongIndicators affiche uniquement pendant `timer.isRunning` (pas en mode repos, pas pendant "Session terminee")
- Placement dans le JSX : entre CircularProgress et le bloc conditionnel showEndMessage/selectors
- Hierarchie visuelle respectee : Timer (dominant) > GongIndicators (discret, petits dots) > StopButton (neutre)
- gap-8 du parent `<main>` gere l'espacement entre les 3 elements
- Aucun fichier non-prevu modifie, aucune dependance ajoutee, zero regression
- Conventions Architecture respectees : PascalCase composant, interface inline, import alias @/*, design tokens Tailwind

### File List

- src/components/GongIndicators.tsx (nouveau)
- src/app/page.tsx (modifie)
