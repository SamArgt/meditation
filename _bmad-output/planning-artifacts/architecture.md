---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - planning-artifacts/prd.md
  - planning-artifacts/product-brief-meditation-2026-02-01.md
  - planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'meditation'
user_name: 'Anna'
date: '2026-02-04'
lastStep: 8
status: complete
completedAt: '2026-02-04'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
16 exigences fonctionnelles réparties en 5 domaines :
- Configuration de session (durée, intervalles, persistance)
- Contrôle du timer (démarrage, affichage temps, arrêt, fin automatique)
- Notifications audio (gong intervalle, gong fin, précision de déclenchement)
- Fonctionnement offline et PWA (installation, cache, autonomie)
- Interface utilisateur (rapidité de configuration, lisibilité)

**Non-Functional Requirements:**
- Performance : précision timer ±500ms, latence audio <100ms, FCP <1.5s, TTI <2s
- Fiabilité : 100% fonctionnel offline, zéro crash pendant session, persistance automatique
- Technical : Web Audio API, Wake Lock API (progressive enhancement), Service Worker

**Scale & Complexity:**
- Primary domain: Front-end PWA (pas de backend)
- Complexity level: Low (greenfield, single-purpose app)
- Estimated architectural components: ~6 UI components + 3 services (audio, timer, storage)

### Technical Constraints & Dependencies

| Contrainte | Source | Impact |
|------------|--------|--------|
| Next.js | PRD | Framework imposé |
| Tailwind CSS | UX Design | Styling sans bibliothèque UI |
| Web Audio API | PRD | Gestion sons cross-browser |
| Service Worker | PRD | Stratégie offline-first |
| LocalStorage | UX Design | Persistance des réglages |

### Cross-Cutting Concerns Identified

1. **Audio lifecycle management** — Initialisation conditionnelle, pré-chargement, gestion erreurs
2. **State management** — Timer state, configuration state, persistence sync
3. **Offline capability** — Service worker registration, cache strategy, manifest
4. **Mobile considerations** — Wake Lock, touch targets, autoplay policies

## Starter Template Evaluation

### Primary Technology Domain

PWA Next.js front-end uniquement, basé sur l'analyse des exigences projet.

### Starter Options Considered

| Option | Type | Verdict |
|--------|------|---------|
| `create-next-app` officiel | CLI Vercel | **Sélectionné** |
| `ts-nextjs-tailwind-starter` | Communautaire | Surdimensionné |
| Native PWA (sans package) | Manuel | Insuffisant pour offline |

### Selected Starter: create-next-app + @ducanh2912/next-pwa

**Rationale for Selection:**
- Starter officiel Vercel, toujours compatible avec les dernières versions
- Configuration minimale alignée avec la philosophie de simplicité du projet
- PWA via `@ducanh2912/next-pwa` pour support complet service worker et offline

**Initialization Commands:**

```bash
# Création du projet
npx create-next-app@latest meditation --typescript --tailwind --eslint --app --src-dir

# Ajout du support PWA
npm install @ducanh2912/next-pwa
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript strict mode
- React 18+ avec App Router
- Node.js runtime

**Styling Solution:**
- Tailwind CSS v4 configuré
- PostCSS intégré

**Build Tooling:**
- Turbopack (développement)
- Webpack (production)
- Optimisation automatique des images et fonts

**Code Organization:**
- App Router (`/app` directory)
- Source directory (`/src`)
- Import alias `@/*`

**Development Experience:**
- Hot reload avec Turbopack
- ESLint configuré
- TypeScript IntelliSense

**Note:** L'initialisation du projet avec cette commande sera la première story d'implémentation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State management approach
- Audio API pattern
- PWA caching strategy
- Hosting strategy

**Deferred Decisions (Post-MVP):**
- Aucune — toutes les décisions nécessaires sont prises

### Frontend Architecture

| Décision | Choix | Rationale |
|----------|-------|-----------|
| **State Management** | React useState/useReducer | Suffisant pour ~3 états, zéro dépendance externe |
| **Component Organization** | Flat structure | Adapté à une app <10 composants |
| **Custom Hooks** | useTimer, useAudio, useWakeLock | Encapsulation logique métier |

**Project Structure:**

```
/src
  /app
    page.tsx, layout.tsx, manifest.ts
  /components
    CircularProgress.tsx
    DurationSelector.tsx
    IntervalSelector.tsx
    StartButton.tsx
    StopButton.tsx
    GongIndicators.tsx
  /hooks
    useTimer.ts
    useAudio.ts
    useWakeLock.ts
  /lib
    storage.ts
    constants.ts
  /public/sounds
    gong-interval.mp3
    gong-end.mp3
```

### Audio Architecture

| Décision | Choix | Rationale |
|----------|-------|-----------|
| **Audio API** | Web Audio API avec AudioContext lazy | Conforme aux politiques autoplay mobile, latence <100ms |
| **Audio Format** | MP3 | Universellement supporté, taille raisonnable pour cache offline |
| **Loading Strategy** | Pré-chargement en AudioBuffer au Start | Latence minimale pour les gongs |

**Pattern d'implémentation :**
1. Tap "Start" → créer AudioContext (contourne autoplay policy)
2. Charger fichiers MP3 en AudioBuffer (pré-décodés)
3. Jouer via AudioBufferSourceNode aux intervalles configurés

### PWA Architecture

| Décision | Choix | Rationale |
|----------|-------|-----------|
| **Service Worker** | @ducanh2912/next-pwa | Support complet PWA avec Next.js App Router |
| **Caching Strategy** | Cache-first | Offline-first prioritaire, app stable qui change rarement |
| **Audio Caching** | Cache-first spécifique pour .mp3 | Sons disponibles instantanément offline |

### Infrastructure & Deployment

| Décision | Choix | Rationale |
|----------|-------|-----------|
| **Hosting** | Self-hosted Docker | Contrôle total, préférence utilisateur |
| **Runtime** | Node.js avec next start | Serveur Next.js complet |
| **Build Output** | Standalone | Image Docker optimisée |
| **Base Image** | node:20-alpine | Légère, LTS |

**Configuration requise :**
- `next.config.js` : `output: 'standalone'`
- Multi-stage Dockerfile pour image optimisée

**Dockerfile référence :**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 catégories où les agents IA pourraient faire des choix différents, maintenant standardisées.

### Naming Patterns

**Code Naming Conventions:**

| Élément | Convention | Exemple |
|---------|------------|---------|
| Composants React | PascalCase | `CircularProgress.tsx` |
| Fichiers composants | PascalCase.tsx | `StartButton.tsx` |
| Hooks | camelCase + prefix `use` | `useTimer.ts` |
| Fonctions | camelCase | `formatTime()`, `playGong()` |
| Variables | camelCase | `isRunning`, `elapsedTime` |
| Constantes | SCREAMING_SNAKE_CASE | `DEFAULT_DURATION` |
| Types/Interfaces | PascalCase | `TimerState`, `AudioConfig` |

### State Management Patterns

**Hook Return Pattern:**

```typescript
// Structure standardisée pour tous les hooks custom
interface UseHookReturn {
  // État (données)
  data: T;
  // Actions (fonctions)
  action: () => void;
  // Status
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}
```

**Naming conventions état:**
- Loading → `isLoading`
- Prêt → `isReady`
- Erreur → `error` (string | null)
- Running → `isRunning`

### Error Handling Patterns

**Error Categories:**

| Situation | Handling | Fallback |
|-----------|----------|----------|
| Audio non supporté | Message utilisateur | Notification visuelle |
| AudioContext bloqué | Retry au prochain tap | Message contextuel |
| LocalStorage indisponible | Catch silencieux | Valeurs en mémoire |
| Wake Lock non supporté | Ignore | Aucun (progressive enhancement) |

**User-Facing Error Messages:**

```typescript
const ERROR_MESSAGES = {
  AUDIO_NOT_SUPPORTED: "Votre navigateur ne supporte pas l'audio",
  AUDIO_BLOCKED: "Appuyez sur Start pour activer le son",
} as const;
```

**Fallback Pattern:**
- Erreur audio → flash visuel sur le cercle
- Jamais de crash → toujours un fallback gracieux

### Styling Patterns (Tailwind)

**Class Order Convention:**
Layout → Spacing → Sizing → Colors → Effects → States

```tsx
// Exemple correct
<button className="flex items-center justify-center p-4 w-16 h-16 bg-accent text-white rounded-full hover:bg-accent-hover active:scale-95">
```

**Design Tokens:**

```javascript
// tailwind.config.js
colors: {
  background: '#F5F7F9',
  surface: '#FAFBFC',
  'text-primary': '#2D3748',
  'text-secondary': '#718096',
  accent: '#5A8F9A',
  'accent-hover': '#4A7A84',
}
```

**Styling Rules:**
- Mobile-first avec breakpoints ascendants
- Tailwind classes inline uniquement
- Pas de CSS-in-JS ni fichiers CSS séparés
- Pas de classes custom sauf tokens dans config

### Enforcement Guidelines

**All AI Agents MUST:**

1. Suivre les conventions de nommage exactement comme spécifié
2. Retourner les hooks avec la structure standardisée (data, actions, status)
3. Gérer les erreurs avec fallback gracieux, jamais de crash
4. Utiliser les design tokens définis, pas de couleurs hardcodées
5. Écrire les classes Tailwind dans l'ordre spécifié

**Anti-Patterns à Éviter:**

| Anti-Pattern | Correct |
|--------------|---------|
| `const running = true` | `const isRunning = true` |
| `function GetData()` | `function getData()` |
| `throw new Error()` sans catch | Fallback gracieux avec message |
| `bg-[#5A8F9A]` | `bg-accent` |
| `style={{ color: 'red' }}` | Classes Tailwind |

## Project Structure & Boundaries

### Complete Project Directory Structure

```
meditation/
├── README.md
├── package.json
├── package-lock.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
├── .env.example
├── Dockerfile
├── .dockerignore
│
├── public/
│   ├── sounds/
│   │   ├── gong-interval.mp3
│   │   └── gong-end.mp3
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   └── favicon.ico
│
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── manifest.ts
    │   └── globals.css
    │
    ├── components/
    │   ├── CircularProgress.tsx
    │   ├── DurationSelector.tsx
    │   ├── IntervalSelector.tsx
    │   ├── StartButton.tsx
    │   ├── StopButton.tsx
    │   └── GongIndicators.tsx
    │
    ├── hooks/
    │   ├── useTimer.ts
    │   ├── useAudio.ts
    │   └── useWakeLock.ts
    │
    └── lib/
        ├── storage.ts
        └── constants.ts
```

### Requirements to Structure Mapping

| Functional Requirement | File(s) |
|------------------------|---------|
| FR1-FR2: Config durée/intervalle | `DurationSelector.tsx`, `IntervalSelector.tsx`, `constants.ts` |
| FR3-FR4: Persistance réglages | `storage.ts`, `page.tsx` |
| FR5-FR8: Contrôle timer | `useTimer.ts`, `StartButton.tsx`, `StopButton.tsx` |
| FR9-FR11: Notifications audio | `useAudio.ts`, `/public/sounds/` |
| FR12-FR14: PWA/Offline | `manifest.ts`, `next.config.js`, Service Worker auto |
| FR15-FR16: Interface rapide | `page.tsx`, tous composants |

### Architectural Boundaries

**Component Boundaries:**

| Layer | Responsibility | Dependencies |
|-------|----------------|--------------|
| `page.tsx` | State orchestration, composition | hooks, components |
| `hooks/` | Business logic, side effects | lib/ |
| `components/` | Pure UI rendering | None (props only) |
| `lib/` | Stateless utilities | None |

**Data Flow Pattern:**
- Unidirectional: page.tsx → components (props down)
- Callbacks: components → page.tsx (events up)
- Persistence: page.tsx ↔ storage.ts ↔ LocalStorage

**Audio Flow:**
1. User tap Start → page.tsx calls useAudio.init()
2. useAudio creates AudioContext, loads buffers
3. useTimer triggers playGong() at intervals
4. useAudio plays via AudioBufferSourceNode

### Integration Points

**Internal Communication:**
- React props/callbacks between components
- Custom hooks expose state + actions to page.tsx
- No global state management library

**External Integrations:**
- LocalStorage (browser API) via storage.ts
- Web Audio API via useAudio.ts
- Wake Lock API via useWakeLock.ts
- Service Worker via @ducanh2912/next-pwa (automatic)

**No External Services:**
- No backend API
- No database
- No authentication
- No analytics

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Toutes les décisions technologiques sont compatibles : Next.js + TypeScript + Tailwind + @ducanh2912/next-pwa + Web Audio API + Docker standalone fonctionnent ensemble sans conflit.

**Pattern Consistency:**
Les patterns d'implémentation (naming, state, error handling, styling) s'alignent parfaitement avec le stack technologique choisi.

**Structure Alignment:**
La structure projet flat correspond à la simplicité du projet et supporte toutes les décisions architecturales.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
16/16 FRs couverts par les décisions architecturales. Chaque exigence est mappée à des fichiers spécifiques.

**Non-Functional Requirements Coverage:**
Toutes les NFRs (performance, fiabilité, offline) sont adressées par les choix architecturaux.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Toutes les décisions critiques sont documentées avec rationale. Patterns et exemples fournis.

**Structure Completeness:**
Structure projet complète avec 18 fichiers source définis et limites claires entre couches.

**Pattern Completeness:**
Conventions de nommage, gestion d'état, erreurs et styling entièrement spécifiés.

### Gap Analysis Results

| Priorité | Gap | Impact | Décision |
|----------|-----|--------|----------|
| Mineur | Tests non définis | Acceptable MVP | Différé post-MVP |
| Mineur | CI/CD non défini | Acceptable self-hosted | Manuel |

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low)
- [x] Technical constraints identified (5)
- [x] Cross-cutting concerns mapped (4)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION ✅

**Confidence Level:** HIGH

**Key Strengths:**
- Architecture simple alignée avec la philosophie du projet
- Toutes les exigences couvertes sans sur-engineering
- Patterns clairs pour implémentation cohérente par agents IA
- Offline-first correctement adressé

**Areas for Future Enhancement:**
- Ajouter stratégie de tests pour v2
- Configurer CI/CD si déploiements fréquents

### Implementation Handoff

**AI Agent Guidelines:**
- Suivre toutes les décisions architecturales exactement comme documentées
- Utiliser les patterns d'implémentation de façon cohérente
- Respecter la structure projet et les limites entre couches
- Référencer ce document pour toute question architecturale

**First Implementation Priority:**

```bash
npx create-next-app@latest meditation --typescript --tailwind --eslint --app --src-dir
npm install @ducanh2912/next-pwa
```

