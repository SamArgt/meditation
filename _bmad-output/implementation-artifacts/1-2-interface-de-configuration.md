# Story 1.2: Interface de Configuration

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux pouvoir configurer la durée de ma session et l'intervalle entre les gongs,
Afin de personnaliser ma méditation selon mes besoins.

## Acceptance Criteria

1. **Given** je suis sur l'écran principal **When** je vois l'interface de configuration **Then** je peux voir et modifier la durée totale de session **And** je peux voir et modifier l'intervalle entre les gongs

2. **Given** je configure la durée **When** j'utilise le DurationSelector **Then** je peux choisir parmi les valeurs : 5, 10, 15, 20, 30, 45, 60 minutes **And** la valeur sélectionnée s'affiche clairement

3. **Given** je configure l'intervalle **When** j'utilise l'IntervalSelector **Then** je peux choisir parmi les valeurs : 1, 2, 3, 5, 10 minutes **And** l'intervalle ne peut pas dépasser la durée totale

4. **Given** je modifie un réglage **When** je change une valeur **Then** la mise à jour est immédiate (pas de bouton "Sauvegarder") **And** l'interface reste cohérente (intervalle s'ajuste si > durée)

## Tasks / Subtasks

- [ ] Task 1: Créer le composant DurationSelector (AC: #1, #2)
  - [ ] 1.1: Créer `src/components/DurationSelector.tsx` avec les options prédéfinies [5, 10, 15, 20, 30, 45, 60] depuis `constants.ts`
  - [ ] 1.2: Implémenter l'interaction de sélection (tap sur une valeur pour la sélectionner)
  - [ ] 1.3: Afficher la valeur sélectionnée clairement (état actif avec couleur accent)
  - [ ] 1.4: Ajouter le label "Durée" au-dessus du sélecteur (police sans-serif, text-secondary)
  - [ ] 1.5: Assurer les touch targets minimum 48x48px et le feedback visuel immédiat au tap

- [ ] Task 2: Créer le composant IntervalSelector (AC: #1, #3)
  - [ ] 2.1: Créer `src/components/IntervalSelector.tsx` avec les options prédéfinies [1, 2, 3, 5, 10] depuis `constants.ts`
  - [ ] 2.2: Implémenter l'interaction de sélection (même pattern que DurationSelector)
  - [ ] 2.3: Afficher la valeur sélectionnée clairement (état actif avec couleur accent)
  - [ ] 2.4: Ajouter le label "Intervalle" au-dessus du sélecteur
  - [ ] 2.5: Assurer les touch targets minimum 48x48px

- [ ] Task 3: Implémenter la logique de validation croisée (AC: #3, #4)
  - [ ] 3.1: Valider que l'intervalle ne dépasse jamais la durée totale sélectionnée
  - [ ] 3.2: Si la durée est modifiée à une valeur inférieure à l'intervalle actuel, ajuster automatiquement l'intervalle au plus grand choix possible ≤ nouvelle durée
  - [ ] 3.3: Filtrer visuellement les options d'intervalle indisponibles (griser ou masquer celles > durée)

- [ ] Task 4: Intégrer les sélecteurs dans page.tsx (AC: #1, #4)
  - [ ] 4.1: Ajouter l'état `duration` et `interval` avec useState dans `page.tsx` (valeurs par défaut depuis constants.ts)
  - [ ] 4.2: Importer et placer DurationSelector et IntervalSelector sous le titre, côte à côte ou empilés selon le layout UX
  - [ ] 4.3: Connecter les callbacks onChange pour mise à jour immédiate de l'état
  - [ ] 4.4: Passer la durée sélectionnée à IntervalSelector pour la validation croisée
  - [ ] 4.5: Vérifier le layout responsive (mobile: empilé, tablet+: côte à côte possible)
  - [ ] 4.6: Vérifier que le layout respecte la hiérarchie visuelle UX : Timer (futur) > Config > Start (futur)

## Dev Notes

### Architecture Compliance

**Pattern de composants (Architecture):**
- Composants = pure UI rendering (props only, pas de side effects)
- `page.tsx` = state orchestration et composition
- Data flow unidirectionnel : page.tsx → components (props down), components → page.tsx (events up)

**Structure des fichiers à créer :**
```
src/components/
  DurationSelector.tsx    ← NOUVEAU
  IntervalSelector.tsx    ← NOUVEAU
src/app/
  page.tsx                ← MODIFIER (ajouter état et composants)
```

**Imports :** Utiliser `@/components/DurationSelector` et `@/lib/constants` (alias `@/*`).

### Technical Requirements

**Tailwind CSS v4 - Rappels critiques (de Story 1.1) :**
- La configuration se fait via `@theme` dans `globals.css` (PAS `tailwind.config.js`)
- Les design tokens sont déjà configurés : `bg-background`, `text-text-primary`, `text-text-secondary`, `bg-accent`, `bg-accent-hover`
- Classes inline uniquement, ordre : Layout → Spacing → Sizing → Colors → Effects → States

**Conventions de nommage (Architecture) :**
- Composants : PascalCase (`DurationSelector.tsx`)
- Props interfaces : PascalCase (`DurationSelectorProps`)
- Fonctions handler : camelCase avec prefix `handle` ou `on` (`onDurationChange`)
- Constantes : SCREAMING_SNAKE_CASE (déjà défini dans `constants.ts`)

**React Patterns :**
- `'use client'` requis en haut des composants qui utilisent useState ou des événements interactifs
- Props typées avec interface TypeScript
- Pas de bibliothèque de composants externe - React natif + Tailwind

### UX Design Compliance

**Direction "Circular Focus" :**
- Les sélecteurs se placent SOUS le cercle timer central (qui sera ajouté en Story 1.3)
- Pour l'instant, placer sous le titre "Meditation" existant
- Hiérarchie : Timer (futur) > Sélecteurs de config > Bouton Start (futur)

**Interaction de sélection (UX Spec) :**
- Valeurs prédéfinies, PAS de saisie libre
- Validation automatique, pas de bouton "OK" ou "Sauvegarder"
- Feedback immédiat au tap (changement visuel instantané)
- Mémorisation automatique (sera implémentée en Story 1.5)

**Design visuel des sélecteurs :**
- Label en police sans-serif (Inter), taille 14-16px, couleur text-secondary (#718096)
- Valeur sélectionnée en couleur accent (#5A8F9A) ou fond accent
- Valeurs non sélectionnées en couleur text-primary ou surface
- Touch targets minimum 48x48px avec espacement 8px entre les options
- Espacement généreux entre les deux sélecteurs (lg: 32px minimum)

**Atmosphère zen :**
- Pas de bordures agressives, préférer des arrondis doux
- Transitions douces sur les changements d'état (transition-colors, 150-200ms)
- Pas de couleurs vives hors accent - rester dans la palette apaisante

### Previous Story Intelligence (Story 1.1)

**Learnings critiques de Story 1.1 :**
- `@serwist/next` a été installé au lieu de `@ducanh2912/next-pwa` (ce dernier n'est plus maintenu) - NE PAS installer @ducanh2912/next-pwa
- Tailwind v4 utilise `@theme` dans globals.css au lieu de `tailwind.config.js` - c'est déjà configuré
- Polices configurées : Cormorant (serif, variable `--font-serif`) pour timer + Inter (sans-serif, variable `--font-sans`) pour labels
- Le layout utilise `min-h-svh` pour le viewport, `max-w-[480px]` pour le conteneur
- Les dossiers `src/components/`, `src/hooks/`, `src/lib/` existent déjà (avec .gitkeep)
- Build réussi sous Next.js 16.1.6 avec Turbopack

**État actuel de page.tsx :**
```tsx
export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <h1 className="font-serif text-5xl font-light text-text-primary">
          Meditation
        </h1>
        <p className="text-center text-text-secondary">
          Timer de méditation minimaliste
        </p>
      </main>
    </div>
  );
}
```
- Le composant `Home` est un Server Component par défaut (pas de `'use client'`)
- Il faudra ajouter `'use client'` car cette story introduit useState

**Constantes déjà disponibles dans `src/lib/constants.ts` :**
```ts
export const DEFAULT_DURATION = 20;
export const DEFAULT_INTERVAL = 5;
export const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60] as const;
export const INTERVAL_OPTIONS = [1, 2, 3, 5, 10] as const;
```

### Library & Framework Requirements

**Next.js 16.1.6 :**
- App Router avec fichiers dans `/src/app/`
- Support natif TypeScript strict
- `'use client'` directive obligatoire pour composants interactifs

**Tailwind CSS v4 :**
- Classes utilitaires disponibles : `bg-accent`, `text-accent`, `bg-surface`, `text-text-secondary`, etc.
- Transitions : `transition-colors duration-150`
- Arrondis : `rounded-full` (pilules), `rounded-lg` (cartes)
- Responsive : pas de préfixe = mobile, `md:` = 768px+, `lg:` = 1024px+

**React 19 :**
- Hooks : `useState` pour l'état local
- Pas de useEffect nécessaire pour cette story
- TypeScript : interfaces pour les props des composants

### File Structure Requirements

**Fichiers à CRÉER :**
- `src/components/DurationSelector.tsx`
- `src/components/IntervalSelector.tsx`

**Fichiers à MODIFIER :**
- `src/app/page.tsx` (ajouter `'use client'`, useState, imports, composants)

**Fichiers à NE PAS TOUCHER :**
- `src/app/layout.tsx` (déjà configuré)
- `src/app/globals.css` (déjà configuré)
- `src/lib/constants.ts` (déjà configuré)
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Vérifications manuelles requises :**
- Build réussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- Les deux sélecteurs s'affichent correctement sur mobile (< 768px)
- Tap sur une valeur la sélectionne immédiatement
- L'intervalle s'ajuste si la durée passe en dessous
- Les options d'intervalle > durée sont correctement grisées ou filtrées
- Touch targets suffisamment grands (48x48px minimum)
- L'atmosphère visuelle reste calme et cohérente

### Project Structure Notes

- Alignement avec la structure projet définie dans l'Architecture : composants dans `src/components/` en PascalCase
- Le pattern de props typées sera établi par ces deux premiers composants et servira de référence pour les stories suivantes (CircularProgress, StartButton, StopButton, GongIndicators)
- Pas de conflits détectés avec la structure existante

### References

- [Source: planning-artifacts/epics.md#Story-1.2] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Structure projet et patterns
- [Source: planning-artifacts/architecture.md#Implementation-Patterns] - Naming conventions, styling rules
- [Source: planning-artifacts/architecture.md#Project-Structure] - Structure complète et boundaries
- [Source: planning-artifacts/ux-design-specification.md#Component-Strategy] - Composants DurationSelector et IntervalSelector
- [Source: planning-artifacts/ux-design-specification.md#Visual-Design-Foundation] - Palette couleurs, typographie, espacement
- [Source: planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns] - Patterns de sélection et feedback
- [Source: planning-artifacts/ux-design-specification.md#Design-Direction-Decision] - Direction "Circular Focus" et hiérarchie
- [Source: implementation-artifacts/1-1-fondation-du-projet-layout.md] - Intelligence story précédente

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
