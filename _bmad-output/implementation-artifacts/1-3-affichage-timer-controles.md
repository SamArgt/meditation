# Story 1.3: Affichage Timer & Contrôles

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux voir un timer circulaire et pouvoir démarrer/arrêter ma session,
Afin de contrôler ma méditation avec une interface épurée.

## Acceptance Criteria

1. **Given** je suis sur l'écran principal en mode repos **When** je regarde l'interface **Then** je vois un cercle central (CircularProgress) affichant la durée configurée **And** je vois un bouton Start proéminent en couleur accent (#5A8F9A)

2. **Given** je suis prêt à méditer **When** je tape sur le bouton Start **Then** la session démarre immédiatement **And** le bouton Start est remplacé par un bouton Stop discret

3. **Given** une session est en cours **When** je regarde l'interface **Then** le cercle affiche le temps écoulé au format MM:SS **And** l'interface reste visible et lisible (FR16)

4. **Given** une session est en cours **When** je tape sur le bouton Stop **Then** la session s'arrête immédiatement **And** je reviens à l'écran de configuration (mode repos)

5. **Given** les boutons Start/Stop **When** je les utilise sur mobile **Then** les zones de tap font minimum 48x48px **And** le feedback visuel est immédiat au tap

## Tasks / Subtasks

- [x] Task 1: Créer le composant CircularProgress (AC: #1, #3)
  - [x] 1.1: Créer `src/components/CircularProgress.tsx` avec un cercle SVG (stroke-based) affichant le temps au centre au format MM:SS
  - [x] 1.2: Props : `duration` (durée totale en minutes), `elapsedSeconds` (temps écoulé en secondes), `isRunning` (boolean)
  - [x] 1.3: En mode repos (`isRunning=false`, `elapsedSeconds=0`) : cercle complet en couleur neutre (stroke `text-secondary` ou `surface`), affichage de la durée configurée (ex: "20:00")
  - [x] 1.4: En mode actif (`isRunning=true`) : cercle se "vide" progressivement (sens horaire), affichage du temps écoulé au format MM:SS
  - [x] 1.5: Dimensionner le cercle à ~280px mobile, police serif (Cormorant) pour le temps, font-light, taille 48-64px
  - [x] 1.6: Utiliser `stroke-dasharray` et `stroke-dashoffset` SVG pour la progression du cercle, couleur accent pour la partie "remplie"

- [x] Task 2: Créer le composant StartButton (AC: #1, #2, #5)
  - [x] 2.1: Créer `src/components/StartButton.tsx` — bouton circulaire proéminent
  - [x] 2.2: Props : `onClick` callback
  - [x] 2.3: Style : fond `bg-accent`, texte blanc, `rounded-full`, min 48x48px (idéalement ~64-72px), label "Start"
  - [x] 2.4: Feedback tactile : `active:scale-95`, `hover:bg-accent-hover`, `transition-colors duration-150`
  - [x] 2.5: `aria-label="Démarrer la méditation"`

- [x] Task 3: Créer le composant StopButton (AC: #2, #4, #5)
  - [x] 3.1: Créer `src/components/StopButton.tsx` — bouton discret (pas alarmant)
  - [x] 3.2: Props : `onClick` callback
  - [x] 3.3: Style : fond `bg-surface` ou transparent, texte `text-secondary`, `rounded-full`, min 48x48px, label "Stop"
  - [x] 3.4: Discret mais accessible — PAS de couleur rouge/alarmante, cohérent avec l'atmosphère zen
  - [x] 3.5: Feedback tactile : `active:scale-95`, `transition-colors duration-150`
  - [x] 3.6: `aria-label="Arrêter la session"`

- [x] Task 4: Intégrer les composants dans page.tsx et gérer les états (AC: #1, #2, #3, #4)
  - [x] 4.1: Ajouter l'état `isRunning` (boolean, défaut `false`) et `elapsedSeconds` (number, défaut `0`) avec useState
  - [x] 4.2: Implémenter `handleStart()` : met `isRunning=true`, `elapsedSeconds=0`
  - [x] 4.3: Implémenter `handleStop()` : met `isRunning=false`, `elapsedSeconds=0` (retour mode repos)
  - [x] 4.4: Placer CircularProgress au-dessus des sélecteurs dans la hiérarchie visuelle (Timer > Config > Bouton)
  - [x] 4.5: Afficher StartButton quand `isRunning=false`, StopButton quand `isRunning=true`
  - [x] 4.6: Masquer ou désactiver les sélecteurs DurationSelector/IntervalSelector quand `isRunning=true`
  - [x] 4.7: Retirer le titre "Meditation" et le sous-titre — CircularProgress devient l'élément dominant

- [x] Task 5: Implémenter le timer basique avec setInterval (AC: #3)
  - [x] 5.1: Ajouter un `useEffect` qui crée un `setInterval(1000ms)` quand `isRunning=true`
  - [x] 5.2: Incrémenter `elapsedSeconds` chaque seconde
  - [x] 5.3: Cleanup : clear interval quand `isRunning` passe à `false` ou au unmount
  - [x] 5.4: NOTE : Ce timer basique sera remplacé par le hook `useTimer` en Story 1.4 — ici on veut juste l'affichage fonctionnel

## Dev Notes

### Architecture Compliance

**Pattern de composants (Architecture) :**
- Composants = pure UI rendering (props only, pas de side effects)
- `page.tsx` = state orchestration et composition
- Data flow unidirectionnel : page.tsx → components (props down), components → page.tsx (events up)
- Le timer `setInterval` vit dans page.tsx (via useEffect), PAS dans un composant enfant

**Structure des fichiers à créer :**
```
src/components/
  CircularProgress.tsx    ← NOUVEAU
  StartButton.tsx         ← NOUVEAU
  StopButton.tsx          ← NOUVEAU
src/app/
  page.tsx                ← MODIFIER (ajouter CircularProgress, Start/Stop, états, timer basique)
```

**Imports :** Utiliser `@/components/CircularProgress`, `@/components/StartButton`, `@/components/StopButton` (alias `@/*`).

**Boundaries à respecter :**

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `page.tsx` | State orchestration, composition | Ajout isRunning, elapsedSeconds, setInterval, handleStart/Stop |
| `components/` | Pure UI rendering | CircularProgress, StartButton, StopButton (props only) |
| `hooks/` | Business logic | PAS touché — useTimer viendra en Story 1.4 |
| `lib/` | Stateless utilities | PAS touché |

### Technical Requirements

**Tailwind CSS v4 — Rappels critiques (de Story 1.1 et 1.2) :**
- Configuration via `@theme` dans `globals.css` (PAS `tailwind.config.js`)
- Design tokens déjà disponibles : `bg-background`, `bg-surface`, `bg-accent`, `bg-accent-hover`, `text-text-primary`, `text-text-secondary`, `text-white`
- Classes inline uniquement, ordre : Layout → Spacing → Sizing → Colors → Effects → States
- Transitions : `transition-colors duration-150` ou `transition-all duration-200`

**React 19 + Next.js 16.1.6 :**
- `'use client'` requis pour tous les composants interactifs (onClick, useState)
- `page.tsx` est déjà un Client Component (ajouté en Story 1.2)
- `useEffect` pour le timer setInterval — cleanup obligatoire dans le return
- `useState` pour `isRunning` et `elapsedSeconds`

**SVG CircularProgress — Implémentation technique :**
```tsx
// Pattern SVG pour cercle de progression
// viewBox="0 0 200 200", cercle centré (100, 100), rayon ~90
// stroke-dasharray = circumference (2 * PI * r)
// stroke-dashoffset = circumference * (1 - progress)
// transform="rotate(-90 100 100)" pour démarrer à 12h

const circumference = 2 * Math.PI * 90; // ~565.49
const progress = elapsedSeconds / (duration * 60);
const offset = circumference * (1 - progress);
```

**Format MM:SS :**
```tsx
function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```
- En mode repos : afficher `formatTime(duration * 60)` (ex: "20:00")
- En mode actif : afficher `formatTime(elapsedSeconds)` (ex: "05:23")

**Conventions de nommage (Architecture) :**

| Élément | Convention | Exemples pour cette story |
|---------|------------|---------------------------|
| Composants | PascalCase | `CircularProgress.tsx`, `StartButton.tsx`, `StopButton.tsx` |
| Props interfaces | PascalCase | `CircularProgressProps`, `StartButtonProps`, `StopButtonProps` |
| Handlers | camelCase prefix handle | `handleStart()`, `handleStop()` |
| État | camelCase prefix is/has | `isRunning`, `elapsedSeconds` |

### UX Design Compliance

**Direction "Circular Focus" — Hiérarchie visuelle CRITIQUE :**
```
┌─────────────────────────────────────┐
│                                     │
│     ┌───────────────────────┐       │
│     │   CircularProgress    │       │  ← Élément DOMINANT
│     │      (MM:SS)          │       │
│     └───────────────────────┘       │
│                                     │
│     ┌─────────┐  ┌──────────┐       │  ← Discret en mode repos,
│     │ Duration │  │ Interval │       │     masqué/désactivé en session
│     └─────────┘  └──────────┘       │
│                                     │
│          ┌──────────┐               │  ← Start (repos) OU Stop (session)
│          │  START   │               │
│          └──────────┘               │
│                                     │
└─────────────────────────────────────┘
```

**Deux modes d'interface :**

| Mode | CircularProgress | Sélecteurs | Bouton | Titre "Meditation" |
|------|------------------|------------|--------|---------------------|
| **Repos** | Cercle complet, durée configurée | Visibles, actifs | Start (accent) | Supprimé — CircularProgress le remplace |
| **Session active** | Cercle se vide, temps écoulé | Masqués ou désactivés (opacity réduite) | Stop (discret) | N/A |

**Atmosphère zen à préserver :**
- Animations lentes et fluides (ease-out, 200-300ms pour transitions d'état)
- Pas de couleurs vives hors accent
- Bouton Stop : couleur neutre (surface/text-secondary), PAS rouge
- Arrondis doux (`rounded-full` pour boutons, cercle SVG)
- Espacement généreux entre les éléments (gap-8 minimum entre sections)

**Accessibilité :**
- `aria-label="Démarrer la méditation"` sur StartButton
- `aria-label="Arrêter la session"` sur StopButton
- Sémantique HTML : `<button>` pour Start/Stop, `<time>` optionnel pour le timer
- Touch targets minimum 48x48px avec espacement 8px
- `prefers-reduced-motion: reduce` → désactiver animation du cercle de progression

### Previous Story Intelligence (Stories 1.1 & 1.2)

**Learnings critiques de Story 1.1 :**
- `@serwist/next` installé au lieu de `@ducanh2912/next-pwa` — NE PAS changer
- Tailwind v4 : `@theme` dans globals.css, PAS `tailwind.config.js`
- Polices : Cormorant (serif, variable `--font-serif`) pour timer + Inter (sans-serif, variable `--font-sans`) pour labels
- Layout : `min-h-svh`, `max-w-[480px]`, `bg-background`, `px-6`
- Next.js 16.1.6 avec Turbopack

**Learnings critiques de Story 1.2 :**
- `page.tsx` est déjà un Client Component (`'use client'`)
- États existants : `duration` (useState, défaut 20), `interval` (useState, défaut 5)
- Fonctions existantes : `handleDurationChange()` (avec auto-ajustement intervalle), `handleIntervalChange()`
- Pattern de composants établi : props typées avec interface, `'use client'`, Tailwind inline
- DurationSelector et IntervalSelector utilisent des boutons `rounded-full`, `min-w-[48px] min-h-[48px]`, `bg-accent text-white` pour l'état actif
- Layout actuel : `flex flex-col items-center gap-8` dans un main centré

**État actuel de page.tsx (à modifier) :**
```tsx
"use client";
import { useState } from "react";
import DurationSelector from "@/components/DurationSelector";
import IntervalSelector from "@/components/IntervalSelector";
import { DEFAULT_DURATION, DEFAULT_INTERVAL, INTERVAL_OPTIONS } from "@/lib/constants";

export default function Home() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  // ... handleDurationChange, handleIntervalChange
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <h1 className="font-serif text-5xl font-light text-text-primary">Meditation</h1>
        <p className="text-center text-text-secondary">Timer de méditation minimaliste</p>
        <div className="flex w-full flex-col items-center gap-8">
          <DurationSelector value={duration} onChange={handleDurationChange} />
          <IntervalSelector value={interval} maxInterval={duration} onChange={handleIntervalChange} />
        </div>
      </main>
    </div>
  );
}
```
- Le `<h1>Meditation</h1>` et `<p>` sous-titre doivent être RETIRÉS — CircularProgress devient l'élément focal
- Les sélecteurs restent mais sont masqués/désactivés pendant la session
- Ajouter les imports de CircularProgress, StartButton, StopButton
- Ajouter les états isRunning et elapsedSeconds
- Ajouter le useEffect pour le timer basique

### Git Intelligence

**Derniers commits :**
- `b96cc08` dev 1-2 (Story 1.2 : Interface de Configuration)
- `86c9aa0` dev 1.1 (Story 1.1 : Fondation du Projet & Layout)
- `3919461` phase 3 (Epics & stories)
- `ba12812` UX design
- `b246789` init

**Patterns de commits :** Format court "dev X-Y" pour les stories d'implémentation.

**Fichiers récents ajoutés/modifiés (commit b96cc08, Story 1.2) :**
- `src/components/DurationSelector.tsx` (nouveau)
- `src/components/IntervalSelector.tsx` (nouveau)
- `src/app/page.tsx` (modifié — ajout 'use client', useState, sélecteurs)

### Library & Framework Requirements

**Next.js 16.1.6 :**
- App Router, fichiers dans `/src/app/`
- `'use client'` obligatoire pour composants interactifs
- Turbopack (dev), Webpack (production)

**Tailwind CSS v4 :**
- Design tokens déjà configurés dans globals.css via `@theme`
- Classes disponibles : `bg-accent`, `bg-accent-hover`, `bg-surface`, `bg-background`, `text-text-primary`, `text-text-secondary`
- Pour le SVG : utiliser `stroke-current` avec les classes de couleur Tailwind, ou des couleurs inline `stroke="var(--color-accent)"`

**React 19 :**
- `useState`, `useEffect` pour cette story
- Pas de useRef nécessaire (pas de manipulation DOM directe)
- Pas de useCallback/useMemo nécessaire (app simple, pas de problèmes de performance)

### File Structure Requirements

**Fichiers à CRÉER :**
- `src/components/CircularProgress.tsx`
- `src/components/StartButton.tsx`
- `src/components/StopButton.tsx`

**Fichiers à MODIFIER :**
- `src/app/page.tsx` (ajouter imports, états, useEffect timer, réorganiser le layout)

**Fichiers à NE PAS TOUCHER :**
- `src/app/layout.tsx` (déjà configuré)
- `src/app/globals.css` (déjà configuré)
- `src/lib/constants.ts` (déjà configuré)
- `src/components/DurationSelector.tsx` (pas de changement nécessaire)
- `src/components/IntervalSelector.tsx` (pas de changement nécessaire)
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Vérifications manuelles requises :**
- Build réussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- En mode repos : cercle complet affiche la durée configurée (ex: "20:00")
- Tap Start → session démarre, temps s'incrémente chaque seconde, cercle se vide progressivement
- Tap Stop → retour immédiat au mode repos, timer remis à zéro
- Le bouton Start est visible en mode repos, le bouton Stop en session active
- Les sélecteurs sont masqués ou désactivés pendant la session active
- Touch targets ≥ 48x48px pour Start et Stop
- L'atmosphère visuelle reste calme (pas de couleurs agressives)
- Layout responsive : cercle ~280px mobile, conteneur max-width 480px desktop

### Project Structure Notes

- Alignement avec la structure projet Architecture : composants dans `src/components/` en PascalCase
- CircularProgress, StartButton, StopButton complètent les 5 composants UI critiques définis dans l'Architecture (avec DurationSelector et IntervalSelector de Story 1.2)
- Le composant GongIndicators reste pour Story 1.6
- Le timer basique (setInterval dans page.tsx) est temporaire — Story 1.4 créera le hook `useTimer` avec la logique complète (fin automatique, précision ±500ms, pattern standardisé)
- Pas de conflits avec la structure existante

### References

- [Source: planning-artifacts/epics.md#Story-1.3] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Structure projet, composants, boundaries
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Naming conventions, styling rules, hook return pattern
- [Source: planning-artifacts/architecture.md#Project-Structure] - Structure complète et mapping FR → fichiers
- [Source: planning-artifacts/ux-design-specification.md#Design-Direction-Decision] - Direction "Circular Focus", cercle central
- [Source: planning-artifacts/ux-design-specification.md#Component-Strategy] - CircularProgress, StartButton, StopButton specs
- [Source: planning-artifacts/ux-design-specification.md#Visual-Design-Foundation] - Palette couleurs, typographie timer (serif 48-64px), espacement
- [Source: planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns] - Hiérarchie boutons, feedback patterns, états
- [Source: planning-artifacts/ux-design-specification.md#Responsive-Design] - Breakpoints, timer 280px mobile
- [Source: implementation-artifacts/1-1-fondation-du-projet-layout.md] - Intelligence Story 1.1
- [Source: implementation-artifacts/1-2-interface-de-configuration.md] - Intelligence Story 1.2

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (Turbopack), compiled in 1382.6ms
- Lint: no errors
- TypeScript: no errors

### Completion Notes List

- CircularProgress créé : cercle SVG avec viewBox 200x200, rayon 90, stroke-dasharray/offset pour la progression, couleur accent pour le cercle rempli, surface pour le fond. Police serif (Cormorant) 48px font-light pour le temps MM:SS. Transition ease-linear 1s sur stroke-dashoffset avec motion-reduce:transition-none. Taille 280px.
- StartButton créé : bouton circulaire proéminent bg-accent text-white rounded-full, min 72x72px, label "Start", active:scale-95, hover:bg-accent-hover, transition-colors 150ms, aria-label="Démarrer la méditation"
- StopButton créé : bouton discret bg-surface text-text-secondary rounded-full, min 48x48px, label "Stop", hover:text-text-primary, active:scale-95, aria-label="Arrêter la session" — PAS de rouge, atmosphère zen préservée
- page.tsx remanié : titre "Meditation" et sous-titre supprimés, CircularProgress en élément dominant, sélecteurs masqués pendant la session (conditional rendering `{!isRunning && ...}`), StartButton/StopButton en affichage conditionnel
- Timer basique implémenté : useEffect + window.setInterval(1000ms) quand isRunning=true, cleanup dans return, incrément via setElapsedSeconds(prev => prev + 1)
- Conventions Architecture respectées : composants purs (props only), page.tsx orchestre l'état, PascalCase, interfaces typées, design tokens Tailwind, imports via @/*

### File List

- src/components/CircularProgress.tsx (nouveau)
- src/components/StartButton.tsx (nouveau)
- src/components/StopButton.tsx (nouveau)
- src/app/page.tsx (modifié)
