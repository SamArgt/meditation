# Story 1.1: Fondation du Projet & Layout

Status: review

## Story

En tant qu'équipe de développement,
Je veux initialiser le projet avec le stack technique défini,
Afin de disposer d'une base solide pour construire l'application.

## Acceptance Criteria

1. **Given** aucun projet n'existe **When** j'exécute les commandes d'initialisation **Then** un projet Next.js est créé avec TypeScript, Tailwind, ESLint, App Router et src directory **And** le support PWA est installé

2. **Given** le projet est initialisé **When** je configure Tailwind avec les design tokens **Then** les couleurs (background, surface, text-primary, text-secondary, accent, accent-hover) sont disponibles via classes Tailwind **And** la configuration respecte le document Architecture

3. **Given** le projet est configuré **When** j'accède à la page principale **Then** je vois un layout centré avec fond background (#F5F7F9) **And** le layout est responsive mobile-first

## Tasks / Subtasks

- [x] Task 1: Initialiser le projet Next.js (AC: #1)
  - [x] 1.1: Exécuter `npx create-next-app@latest meditation --typescript --tailwind --eslint --app --src-dir`
  - [x] 1.2: Installer le support PWA : `npm install @serwist/next` (successeur recommandé de @ducanh2912/next-pwa)
  - [x] 1.3: Vérifier que le projet compile (`npm run dev`)
  - [x] 1.4: Nettoyer le boilerplate par défaut (supprimer contenu exemple de page.tsx)

- [x] Task 2: Configurer Tailwind CSS v4 avec les design tokens (AC: #2)
  - [x] 2.1: Configurer les couleurs du design system dans `src/app/globals.css` via la directive `@theme`
  - [x] 2.2: Définir les tokens : background (#F5F7F9), surface (#FAFBFC), text-primary (#2D3748), text-secondary (#718096), accent (#5A8F9A), accent-hover (#4A7A84)
  - [x] 2.3: Vérifier que les classes `bg-background`, `text-text-primary`, `bg-accent`, etc. fonctionnent

- [x] Task 3: Créer le layout et la page principale (AC: #3)
  - [x] 3.1: Configurer `src/app/layout.tsx` avec les métadonnées du projet, police serif (Playfair Display ou Cormorant) + sans-serif (Inter)
  - [x] 3.2: Créer `src/app/page.tsx` avec layout centré verticalement et horizontalement
  - [x] 3.3: Appliquer le fond `bg-background`, mobile-first, `max-width: 480px` centré sur desktop
  - [x] 3.4: Vérifier le rendu responsive (mobile < 768px, tablet, desktop > 1024px)

- [x] Task 4: Créer le fichier de constantes (AC: #2)
  - [x] 4.1: Créer `src/lib/constants.ts` avec les valeurs par défaut : `DEFAULT_DURATION = 20`, `DEFAULT_INTERVAL = 5`
  - [x] 4.2: Définir `DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60]` et `INTERVAL_OPTIONS = [1, 2, 3, 5, 10]`

- [x] Task 5: Préparer la structure des dossiers (AC: #1, #2)
  - [x] 5.1: Créer les dossiers : `src/components/`, `src/hooks/`, `src/lib/`
  - [x] 5.2: Créer `public/sounds/` (vide, pour les futurs fichiers audio)
  - [x] 5.3: Créer `public/icons/` (vide, pour les futures icônes PWA)

## Dev Notes

### Architecture Compliance

**Structure projet imposée par l'Architecture :**
```
/src
  /app        → page.tsx, layout.tsx, manifest.ts, globals.css
  /components → CircularProgress, DurationSelector, IntervalSelector, StartButton, StopButton, GongIndicators
  /hooks      → useTimer.ts, useAudio.ts, useWakeLock.ts
  /lib        → storage.ts, constants.ts
/public
  /sounds     → gong-interval.mp3, gong-end.mp3
  /icons      → icon-192.png, icon-512.png, apple-touch-icon.png
```

**Import alias :** Utiliser `@/*` pour tous les imports (ex: `@/components/CircularProgress`).

### Technical Requirements

**Next.js 16.1 (dernière version stable) :**
- Turbopack est maintenant le bundler par défaut
- App Router est le défaut, pas besoin de le spécifier
- TypeScript-first, support natif de `next.config.ts`
- `create-next-app` installe automatiquement Tailwind CSS

**Tailwind CSS v4 - CHANGEMENTS CRITIQUES vs v3 :**
- Plus de `tailwind.config.js` : la configuration se fait en CSS avec la directive `@theme` dans `globals.css`
- Plus de `@tailwind base/components/utilities` : utiliser `@import "tailwindcss"` à la place
- Détection automatique du contenu, pas besoin de configurer `content`
- Navigateurs modernes requis : Safari 16.4+, Chrome 111+, Firefox 128+

**Configuration Tailwind dans `globals.css` :**
```css
@import "tailwindcss";

@theme {
  --color-background: #F5F7F9;
  --color-surface: #FAFBFC;
  --color-text-primary: #2D3748;
  --color-text-secondary: #718096;
  --color-accent: #5A8F9A;
  --color-accent-hover: #4A7A84;
}
```

**PWA - @serwist/next (successeur de @ducanh2912/next-pwa) :**
- `@ducanh2912/next-pwa` n'est plus maintenu activement
- `@serwist/next` est le successeur recommandé, basé sur Serwist (fork de Workbox)
- Installation : `npm install @serwist/next`
- NE PAS installer `@ducanh2912/next-pwa` malgré ce que dit le document Architecture (information périmée)

### Naming Conventions (Architecture)

| Élément | Convention | Exemple |
|---------|------------|---------|
| Composants React | PascalCase | `CircularProgress.tsx` |
| Hooks | camelCase + prefix `use` | `useTimer.ts` |
| Fonctions | camelCase | `formatTime()` |
| Constantes | SCREAMING_SNAKE_CASE | `DEFAULT_DURATION` |
| Types/Interfaces | PascalCase | `TimerState` |

### Styling Rules (Architecture)

- Tailwind classes inline uniquement, pas de CSS-in-JS ni fichiers CSS séparés
- Ordre des classes : Layout → Spacing → Sizing → Colors → Effects → States
- Mobile-first avec breakpoints ascendants
- Pas de couleurs hardcodées, utiliser les design tokens

### Layout Specifications (UX Design)

- Single-screen app, centré verticalement avec Flexbox
- Marges latérales minimum 24px mobile
- Touch targets minimum 48x48px
- Fond : `bg-background` (#F5F7F9)
- Typographie : serif pour timer (Playfair Display/Cormorant), sans-serif pour labels (Inter)
- Espacement généreux : unité de base 8px
- Desktop : conteneur `max-width: 480px` centré

### Responsive Breakpoints

| Breakpoint | Largeur | Adaptation |
|------------|---------|------------|
| Mobile (base) | < 768px | Design principal, pleine largeur |
| Tablet | ≥ 768px | Padding augmenté |
| Desktop | ≥ 1024px | max-width: 480px centré |

### Project Structure Notes

- Cette story crée la fondation : aucun composant UI spécifique n'est implémenté ici
- Les composants (CircularProgress, DurationSelector, etc.) seront créés dans les stories suivantes
- Seuls les dossiers vides, le layout de base et les constantes sont créés dans cette story
- Le fichier `manifest.ts` et la configuration PWA complète seront implémentés dans l'Epic 3 (Story 3.1)

### References

- [Source: planning-artifacts/architecture.md#Starter-Template-Evaluation] - Commandes d'initialisation
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Structure projet
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Conventions de nommage et styling
- [Source: planning-artifacts/ux-design-specification.md#Design-System-Foundation] - Design tokens couleurs
- [Source: planning-artifacts/ux-design-specification.md#Visual-Design-Foundation] - Typographie et layout
- [Source: planning-artifacts/ux-design-specification.md#Responsive-Design] - Breakpoints et stratégie responsive

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (Turbopack), compiled in 1260ms
- Lint: no errors
- All design tokens validated via successful build

### Completion Notes List

- Projet Next.js 16.1.6 initialisé avec TypeScript, Tailwind CSS v4, ESLint, App Router, src directory
- @serwist/next installé (successeur de @ducanh2912/next-pwa qui n'est plus maintenu)
- Design tokens configurés via `@theme` directive dans globals.css (Tailwind v4 CSS-first config)
- Polices : Cormorant (serif, pour timer) + Inter (sans-serif, pour labels) via next/font/google
- Layout centré verticalement, max-width 480px sur desktop, fond bg-background (#F5F7F9)
- Constantes définies : DEFAULT_DURATION=20, DEFAULT_INTERVAL=5, DURATION_OPTIONS, INTERVAL_OPTIONS
- Structure de dossiers créée : components/, hooks/, lib/, public/sounds/, public/icons/
- Boilerplate Next.js nettoyé (SVGs supprimés, page.tsx réécrite)

### File List

- package.json (nouveau)
- package-lock.json (nouveau)
- .gitignore (modifié)
- next.config.ts (nouveau)
- tsconfig.json (nouveau)
- postcss.config.mjs (nouveau)
- eslint.config.mjs (nouveau)
- src/app/globals.css (nouveau)
- src/app/layout.tsx (nouveau)
- src/app/page.tsx (nouveau)
- src/app/favicon.ico (nouveau)
- src/lib/constants.ts (nouveau)
- src/components/.gitkeep (nouveau)
- src/hooks/.gitkeep (nouveau)
- public/sounds/.gitkeep (nouveau)
- public/icons/.gitkeep (nouveau)
