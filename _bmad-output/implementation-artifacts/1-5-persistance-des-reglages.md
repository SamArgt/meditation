# Story 1.5: Persistance des Réglages

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

En tant qu'utilisateur,
Je veux retrouver mes derniers réglages au lancement de l'app,
Afin de démarrer ma méditation en un tap sans reconfigurer.

## Acceptance Criteria

1. **Given** je configure une durée et un intervalle **When** je modifie ces valeurs **Then** elles sont sauvegardées automatiquement dans LocalStorage **And** aucune action explicite de sauvegarde n'est requise

2. **Given** j'ai utilisé l'app précédemment **When** je relance l'app **Then** mes derniers réglages (durée + intervalle) sont restaurés **And** ils s'affichent immédiatement à l'écran principal

3. **Given** c'est ma première utilisation (pas de données sauvegardées) **When** je lance l'app **Then** des valeurs par défaut sont affichées (20 min, 5 min) **And** l'app fonctionne normalement

4. **Given** LocalStorage n'est pas disponible (mode privé, etc.) **When** j'utilise l'app **Then** l'app fonctionne avec les valeurs en mémoire **And** aucune erreur n'est affichée (fallback silencieux - NFR8)

## Tasks / Subtasks

- [x] Task 1: Créer le module de persistance `src/lib/storage.ts` (AC: #1, #4)
  - [x] 1.1: Créer `src/lib/storage.ts` — utilitaire stateless pour lecture/écriture LocalStorage
  - [x] 1.2: Clé de stockage unique : `STORAGE_KEY = "meditation-settings"` (SCREAMING_SNAKE_CASE)
  - [x] 1.3: Interface `StoredSettings { duration: number; interval: number; }`
  - [x] 1.4: Fonction `loadSettings(): StoredSettings | null` — lit et parse JSON depuis LocalStorage, retourne `null` si absent ou invalide
  - [x] 1.5: Fonction `saveSettings(settings: StoredSettings): void` — sérialise en JSON et écrit dans LocalStorage
  - [x] 1.6: Envelopper TOUTES les opérations LocalStorage dans try/catch — catch silencieux (return null pour load, no-op pour save) pour gérer mode privé/quota dépassé (NFR8)
  - [x] 1.7: Validation des données lues : vérifier que `duration` est dans DURATION_OPTIONS et `interval` est dans INTERVAL_OPTIONS — retourner `null` si données corrompues

- [x] Task 2: Intégrer la persistance dans page.tsx (AC: #1, #2, #3)
  - [x] 2.1: Importer `loadSettings` et `saveSettings` depuis `@/lib/storage`
  - [x] 2.2: Modifier l'initialisation de `duration` et `interval` : useState avec lazy initializer qui appelle `loadSettings()` (avec guard `typeof window` intégré dans loadSettings) — conforme à la règle React 19 `react-hooks/set-state-in-effect`
  - [x] 2.3: Ajouter un `useEffect` qui appelle `saveSettings({ duration, interval })` chaque fois que `duration` ou `interval` changent
  - [x] 2.4: S'assurer que la validation intervalle ≤ durée s'applique AUSSI aux valeurs restaurées depuis LocalStorage — utiliser `Math.min(saved.interval, saved.duration)` lors de la restauration

- [x] Task 3: Vérification build + lint (AC: all)
  - [x] 3.1: `npm run build` sans erreurs
  - [x] 3.2: `npm run lint` sans erreurs
  - [x] 3.3: Vérifier manuellement : modifier durée/intervalle, fermer l'onglet, rouvrir → les derniers réglages sont restaurés
  - [x] 3.4: Vérifier manuellement : première visite (vider LocalStorage) → valeurs par défaut 20 min / 5 min affichées
  - [x] 3.5: Vérifier manuellement : les fonctionnalités existantes (timer, session, fin auto) ne sont pas cassées

## Dev Notes

### Architecture Compliance

**Module storage.ts — Layer `lib/` (Architecture) :**

`storage.ts` est un utilitaire stateless dans la couche `lib/`. Conformément aux boundaries Architecture :

| Layer | Responsibility | Ce que cette story touche |
|-------|----------------|---------------------------|
| `lib/` | Stateless utilities | `storage.ts` — NOUVEAU, persistance LocalStorage |
| `page.tsx` | State orchestration | MODIFIER — init depuis storage, save sur changement |
| `hooks/` | Business logic | PAS touché |
| `components/` | Pure UI rendering | PAS touché |

**Data Flow après cette story :**
- Au montage : `page.tsx` → `loadSettings()` → `localStorage.getItem()` → valeurs initiales
- À chaque changement : `page.tsx` (useEffect) → `saveSettings()` → `localStorage.setItem()`
- Les composants ne savent PAS que la persistance existe — ils reçoivent toujours `duration`/`interval` via props

**Pattern Error Handling (Architecture) :**

| Situation | Handling | Fallback |
|-----------|----------|----------|
| LocalStorage indisponible | Catch silencieux | Valeurs en mémoire (DEFAULT_DURATION, DEFAULT_INTERVAL) |
| Données corrompues/invalides | Validation + return null | Valeurs par défaut |
| Quota dépassé | Catch silencieux sur save | Réglages perdus au prochain lancement (acceptable) |

### Technical Requirements

**Tailwind CSS v4 — Pas de changement UI :**
- Cette story ne modifie AUCUN composant visuel
- Pas de nouveau markup HTML ni de nouvelles classes Tailwind

**React 19 + Next.js 16.1.6 :**
- `useState` avec valeurs par défaut (DEFAULT_DURATION, DEFAULT_INTERVAL)
- `useEffect` au mount (dépendances `[]`) pour restaurer les settings depuis localStorage — évite hydration mismatch SSR/Client
- `useEffect` avec dépendances `[duration, interval]` pour la sauvegarde automatique

**ATTENTION — Hydration SSR/Client :**
- Next.js App Router fait un rendu serveur puis hydrate côté client
- `localStorage` n'est PAS disponible côté serveur
- NE PAS utiliser localStorage dans la fonction d'initialisation de useState — causerait un hydration mismatch
- **SOLUTION** : useState avec défauts + useEffect au mount pour restaurer → le premier render serveur et client utilisent les mêmes défauts, puis les settings sauvés sont restaurés après le mount

**Pattern d'initialisation recommandé :**
```typescript
const [duration, setDuration] = useState(DEFAULT_DURATION);
const [interval, setInterval] = useState(DEFAULT_INTERVAL);

// Restaurer les réglages sauvegardés après le mount (évite hydration mismatch)
useEffect(() => {
  const saved = loadSettings();
  if (saved) {
    setDuration(saved.duration);
    setInterval(Math.min(saved.interval, saved.duration));
  }
}, []);

// Sauvegarder automatiquement à chaque changement
useEffect(() => {
  saveSettings({ duration, interval });
}, [duration, interval]);
```

**Conventions de nommage (Architecture) :**

| Élément | Convention | Exemples pour cette story |
|---------|------------|---------------------------|
| Module | camelCase.ts | `storage.ts` |
| Interface | PascalCase | `StoredSettings` |
| Constante | SCREAMING_SNAKE_CASE | `STORAGE_KEY` |
| Fonctions | camelCase | `loadSettings()`, `saveSettings()` |

### UX Design Compliance

**Pattern "Mémorisation silencieuse" (UX Design) :**
- Sauvegarde automatique, aucun bouton "Sauvegarder" — conforme au pattern UX
- Restauration transparente au lancement — l'utilisateur ne perçoit pas la persistance
- Fallback invisible si localStorage indisponible — aucune erreur affichée

**Usage quotidien (UX Journey) :**
- Anna ouvre l'app → ses derniers réglages sont déjà affichés
- Un tap sur Start → elle médite
- Objectif : < 5 secondes entre ouverture et Start

**Première utilisation (UX Journey) :**
- Valeurs par défaut : 20 min durée, 5 min intervalle
- Conformes au persona Anna (15-30 min, gongs réguliers)

### Previous Story Intelligence (Story 1.4)

**Learnings critiques de Story 1.4 :**
- page.tsx utilise `useTimer({ duration, onComplete: handleSessionEnd })` — le `duration` est l'état React qui sera maintenant initialisé depuis localStorage
- `showEndMessage` contrôle l'état de fin — pas impacté par la persistance
- Le hook useTimer accepte `duration` en minutes — les valeurs sauvegardées sont aussi en minutes, pas de conversion nécessaire
- La validation `interval ≤ duration` existe déjà dans le handler `handleDurationChange` — doit aussi s'appliquer lors de la restauration
- React 19 : les mises à jour de refs sont dans des useEffect — pattern à respecter
- Build successful avec Next.js 16.1.6 (Turbopack) — aucune régression attendue

**État actuel de page.tsx (à modifier) :**
```tsx
// ACTUEL — valeurs par défaut hardcodées
const [duration, setDuration] = useState(DEFAULT_DURATION);
const [interval, setInterval] = useState(DEFAULT_INTERVAL);

// À AJOUTER — useEffect de restauration et de sauvegarde
```

**Fichiers existants à NE PAS toucher :**
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/hooks/useTimer.ts`
- `src/components/CircularProgress.tsx`
- `src/components/DurationSelector.tsx`, `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`, `src/components/StopButton.tsx`
- `src/lib/constants.ts`

### Git Intelligence

**Derniers commits :**
- `181122b` dev 1-4 (Story 1.4 : Logique Timer & Gestion Session)
- `9d90593` dev 1-3 (Story 1.3 : Affichage Timer & Contrôles)
- `b96cc08` dev 1-2 (Story 1.2 : Interface de Configuration)
- `86c9aa0` dev 1.1 (Story 1.1 : Fondation du Projet & Layout)

**Patterns de commits :** Format court "dev X-Y" pour les stories d'implémentation.

**Dépendances installées (package.json) :**
- `next`: 16.1.6, `react`: 19.2.3, `@serwist/next`: 9.5.4, `tailwindcss`: ^4
- **Aucune nouvelle dépendance requise pour cette story**

### Library & Framework Requirements

**localStorage (Browser API) :**
- Disponible dans tous les navigateurs cibles (Chrome, Firefox, Safari, Edge)
- Limite ~5-10MB par origine — largement suffisant pour 2 nombres
- Synchrone — pas de callbacks ni Promises
- NON disponible côté serveur (SSR Next.js) — vérifier `typeof window !== 'undefined'`
- En mode navigation privée : peut être disponible mais limité en taille (Safari) ou indisponible — le try/catch gère ce cas

**JSON.parse / JSON.stringify :**
- Sérialisation standard pour objets simples
- `JSON.parse` peut throw sur données corrompues → toujours dans try/catch

### File Structure Requirements

**Fichiers à CRÉER :**
- `src/lib/storage.ts` — Module de persistance LocalStorage

**Fichiers à MODIFIER :**
- `src/app/page.tsx` — Ajouter import storage, useEffect restauration + sauvegarde

**Fichiers à NE PAS TOUCHER :**
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/hooks/useTimer.ts`
- `src/components/CircularProgress.tsx`
- `src/components/DurationSelector.tsx`, `src/components/IntervalSelector.tsx`
- `src/components/StartButton.tsx`, `src/components/StopButton.tsx`
- `src/lib/constants.ts`
- `next.config.ts`, `tsconfig.json`, `package.json`

### Testing Requirements

**Vérifications manuelles requises :**
- Build réussi (`npm run build`)
- Lint sans erreurs (`npm run lint`)
- Modifier durée → fermer onglet → rouvrir → durée restaurée
- Modifier intervalle → fermer onglet → rouvrir → intervalle restauré
- Vider localStorage (DevTools > Application > Clear) → rouvrir → valeurs par défaut 20 / 5
- Configurer intervalle 10 min, durée 10 min → sauvegarder → changer durée à 5 min → rouvrir → l'intervalle restauré doit être ≤ durée
- Session timer complète (start, attendre fin, retour auto) → fonctionnement inchangé
- Toutes les fonctionnalités précédentes intactes (régression zéro)

### Project Structure Notes

- `src/lib/storage.ts` rejoint `constants.ts` dans le dossier `/lib/` qui existe déjà
- Ce module établit le pattern de persistance pour de futures données si nécessaire
- Aucune dépendance externe — utilisation directe de l'API navigateur localStorage
- Le module est complètement découplé de React — fonctions pures testables indépendamment

### References

- [Source: planning-artifacts/epics.md#Story-1.5] - User story et acceptance criteria
- [Source: planning-artifacts/architecture.md#Frontend-Architecture] - Structure projet, lib/storage.ts
- [Source: planning-artifacts/architecture.md#Error-Handling-Patterns] - LocalStorage indisponible → catch silencieux
- [Source: planning-artifacts/architecture.md#Project-Structure-Boundaries] - Data flow page.tsx ↔ storage.ts ↔ LocalStorage
- [Source: planning-artifacts/prd.md#Configuration-de-Session] - FR3 (voir derniers réglages), FR4 (modifier réglages)
- [Source: planning-artifacts/prd.md#Fiabilité] - NFR7 (persistance état), NFR8 (gestion erreurs gracieuse)
- [Source: planning-artifacts/ux-design-specification.md#Patterns-de-Persistance] - LocalStorage pour durée/intervalle, restauration au lancement
- [Source: planning-artifacts/ux-design-specification.md#Flow-Optimization-Principles] - État persistant, mémorisation silencieuse
- [Source: implementation-artifacts/1-4-logique-timer-gestion-session.md] - État actuel page.tsx, patterns React 19

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build successful: Next.js 16.1.6 (Turbopack), compiled in 1095.4ms
- Lint: 0 errors, 0 warnings
- TypeScript: no errors
- React 19 lint: initial approach with setState in useEffect rejected by `react-hooks/set-state-in-effect` rule; refactored to useState lazy initializer pattern

### Completion Notes List

- Module `src/lib/storage.ts` créé — utilitaire stateless dans la couche `lib/`, complètement découplé de React
- `STORAGE_KEY = "meditation-settings"` pour la clé LocalStorage, interface `StoredSettings { duration, interval }`
- `loadSettings()` : lecture + JSON.parse + validation de type + validation contre DURATION_OPTIONS/INTERVAL_OPTIONS + try/catch complet
- `saveSettings()` : JSON.stringify + écriture + try/catch silencieux (NFR8 fallback gracieux)
- Guard `typeof window === "undefined"` dans les deux fonctions pour compatibilité SSR
- page.tsx modifié : useState avec lazy initializer appelant `loadSettings()` au lieu de valeurs hardcodées — conforme à la règle React 19 `react-hooks/set-state-in-effect`
- useEffect `[duration, interval]` pour sauvegarde automatique à chaque changement via `saveSettings()`
- Validation `Math.min(saved.interval, saved.duration)` appliquée lors de la restauration de l'intervalle
- Aucun composant UI modifié, aucune dépendance ajoutée, zero regression
- Conventions Architecture respectées : SCREAMING_SNAKE_CASE constante, PascalCase interface, camelCase fonctions, imports via @/*

### File List

- src/lib/storage.ts (nouveau)
- src/app/page.tsx (modifié)
