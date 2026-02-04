---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
status: complete
inputDocuments:
  - planning-artifacts/prd.md
  - planning-artifacts/architecture.md
  - planning-artifacts/ux-design-specification.md
---

# meditation - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for meditation, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Configuration de Session**
- FR1: L'utilisateur peut définir la durée totale de la session de méditation
- FR2: L'utilisateur peut définir l'intervalle entre chaque gong
- FR3: L'utilisateur peut voir ses derniers réglages au lancement de l'app
- FR4: L'utilisateur peut modifier les réglages avant de démarrer

**Contrôle du Timer**
- FR5: L'utilisateur peut démarrer une session de méditation
- FR6: L'utilisateur peut voir le temps écoulé pendant la session
- FR7: L'utilisateur peut arrêter la session en cours
- FR8: Le système termine automatiquement la session à la durée configurée

**Notifications Audio**
- FR9: Le système joue un son de bol tibétain à chaque intervalle configuré
- FR10: Le système joue un son distinct pour signaler la fin de session
- FR11: Les sons se déclenchent exactement aux moments configurés

**Fonctionnement Offline & PWA**
- FR12: L'utilisateur peut utiliser l'app sans connexion internet
- FR13: L'utilisateur peut installer l'app sur son écran d'accueil
- FR14: L'app fonctionne après le premier chargement sans téléchargement supplémentaire

**Interface Utilisateur**
- FR15: L'utilisateur peut configurer et démarrer une session en moins de 10 secondes
- FR16: L'interface reste visible et lisible pendant la session

### NonFunctional Requirements

**Performance**
- NFR1: Précision du timer - Gongs déclenchés à ±500ms de l'intervalle configuré
- NFR2: Latence audio - Son joué dans les 100ms suivant le déclenchement
- NFR3: Temps de chargement - First Contentful Paint < 1.5s, Time to Interactive < 2s
- NFR4: Réactivité UI - Actions utilisateur traitées en < 100ms

**Fiabilité**
- NFR5: Fonctionnement offline - 100% des fonctionnalités disponibles sans connexion après premier chargement
- NFR6: Stabilité session - Zéro crash ou interruption pendant une session de méditation
- NFR7: Persistance état - Derniers réglages conservés entre les sessions
- NFR8: Gestion erreurs audio - Fallback gracieux si audio échoue (notification visuelle)

### Additional Requirements

**Starter Template (Architecture)**
- Initialiser le projet avec `npx create-next-app@latest meditation --typescript --tailwind --eslint --app --src-dir`
- Ajouter le support PWA avec `npm install @ducanh2912/next-pwa`
- TypeScript strict mode, React 18+ avec App Router
- Tailwind CSS v4

**State Management (Architecture)**
- React useState/useReducer (pas de bibliothèque externe)
- Custom hooks: useTimer, useAudio, useWakeLock
- Pattern de retour standardisé pour hooks (data, actions, status)

**Audio (Architecture)**
- Web Audio API avec AudioContext lazy (créé au tap Start)
- Format MP3 pour sons
- Pré-chargement en AudioBuffer au démarrage de session
- Fichiers: gong-interval.mp3, gong-end.mp3

**PWA & Offline (Architecture)**
- Service Worker via @ducanh2912/next-pwa
- Stratégie Cache-first
- Manifest pour installation écran d'accueil

**Deployment (Architecture)**
- Self-hosted Docker avec output standalone
- Multi-stage Dockerfile
- Node.js 20 Alpine

**Patterns d'implémentation (Architecture)**
- Conventions de nommage définies (PascalCase composants, camelCase fonctions, SCREAMING_SNAKE_CASE constantes)
- Gestion d'erreurs avec fallback gracieux
- Design tokens Tailwind définis

**Composants UI (UX Design)**
- CircularProgress: Timer visuel central avec cercle de progression
- DurationSelector: Configuration de la durée totale
- IntervalSelector: Configuration de l'intervalle entre gongs
- StartButton: Démarrage de la session
- StopButton: Arrêt de la session en cours
- GongIndicators: Points visuels indiquant les gongs passés/restants

**Design Visuel (UX Design)**
- Direction "Circular Focus" - Timer circulaire central
- Palette: background (#F5F7F9), surface (#FAFBFC), text-primary (#2D3748), text-secondary (#718096), accent (#5A8F9A)
- Typographie: Serif pour timer, sans-serif pour labels
- Touch targets minimum 48x48px

**Responsive & Accessibilité (UX Design)**
- Mobile-first, orientation portrait
- Wake Lock API pour maintenir l'écran allumé
- WCAG 2.1 AA baseline
- LocalStorage pour persistance des réglages

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Définir la durée totale |
| FR2 | Epic 1 | Définir l'intervalle |
| FR3 | Epic 1 | Voir les derniers réglages |
| FR4 | Epic 1 | Modifier les réglages |
| FR5 | Epic 1 | Démarrer une session |
| FR6 | Epic 1 | Voir le temps écoulé |
| FR7 | Epic 1 | Arrêter la session |
| FR8 | Epic 1 | Fin automatique |
| FR9 | Epic 2 | Gong d'intervalle |
| FR10 | Epic 2 | Gong de fin |
| FR11 | Epic 2 | Précision des sons |
| FR12 | Epic 3 | Usage offline |
| FR13 | Epic 3 | Installation écran d'accueil |
| FR14 | Epic 3 | Fonctionnement après premier chargement |
| FR15 | Epic 1 | Configuration en < 10 secondes |
| FR16 | Epic 1 | Interface lisible pendant session |

## Epic List

### Epic 1: Timer de Méditation Fonctionnel
Anna peut ouvrir l'app, configurer sa session (durée + intervalle), démarrer le timer, voir le temps écoulé, et arrêter si besoin. L'interface est épurée, calme, et les réglages sont mémorisés entre les sessions.

**FRs couverts:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR15, FR16

### Epic 2: Expérience Audio des Gongs
Anna entend des sons de bol tibétain doux aux intervalles configurés et un son distinct à la fin de sa session. Les sons maintiennent l'état méditatif sans l'interrompre.

**FRs couverts:** FR9, FR10, FR11

### Epic 3: PWA Installable & Offline
Anna peut installer l'app sur son écran d'accueil et méditer sans connexion internet. L'app fonctionne de manière fiable partout.

**FRs couverts:** FR12, FR13, FR14

---

## Epic 1: Timer de Méditation Fonctionnel

Anna peut ouvrir l'app, configurer sa session (durée + intervalle), démarrer le timer, voir le temps écoulé, et arrêter si besoin. L'interface est épurée, calme, et les réglages sont mémorisés entre les sessions.

### Story 1.1: Fondation du Projet & Layout

En tant qu'équipe de développement,
Je veux initialiser le projet avec le stack technique défini,
Afin de disposer d'une base solide pour construire l'application.

**Acceptance Criteria:**

**Given** aucun projet n'existe
**When** j'exécute les commandes d'initialisation
**Then** un projet Next.js est créé avec TypeScript, Tailwind, ESLint, App Router et src directory
**And** le package @ducanh2912/next-pwa est installé

**Given** le projet est initialisé
**When** je configure Tailwind avec les design tokens
**Then** les couleurs (background, surface, text-primary, text-secondary, accent) sont disponibles
**And** la configuration respecte l'Architecture document

**Given** le projet est configuré
**When** j'accède à la page principale
**Then** je vois un layout centré avec fond background (#F5F7F9)
**And** le layout est responsive mobile-first

### Story 1.2: Interface de Configuration

En tant qu'utilisateur,
Je veux pouvoir configurer la durée de ma session et l'intervalle entre les gongs,
Afin de personnaliser ma méditation selon mes besoins.

**Acceptance Criteria:**

**Given** je suis sur l'écran principal
**When** je vois l'interface de configuration
**Then** je peux voir et modifier la durée totale de session
**And** je peux voir et modifier l'intervalle entre les gongs

**Given** je configure la durée
**When** j'utilise le DurationSelector
**Then** je peux choisir parmi les valeurs : 5, 10, 15, 20, 30, 45, 60 minutes
**And** la valeur sélectionnée s'affiche clairement

**Given** je configure l'intervalle
**When** j'utilise l'IntervalSelector
**Then** je peux choisir parmi les valeurs : 1, 2, 3, 5, 10 minutes
**And** l'intervalle ne peut pas dépasser la durée totale

**Given** je modifie un réglage
**When** je change une valeur
**Then** la mise à jour est immédiate (pas de bouton "Sauvegarder")
**And** l'interface reste cohérente (intervalle s'ajuste si > durée)

### Story 1.3: Affichage Timer & Contrôles

En tant qu'utilisateur,
Je veux voir un timer circulaire et pouvoir démarrer/arrêter ma session,
Afin de contrôler ma méditation avec une interface épurée.

**Acceptance Criteria:**

**Given** je suis sur l'écran principal en mode repos
**When** je regarde l'interface
**Then** je vois un cercle central (CircularProgress) affichant la durée configurée
**And** je vois un bouton Start proéminent en couleur accent (#5A8F9A)

**Given** je suis prêt à méditer
**When** je tape sur le bouton Start
**Then** la session démarre immédiatement
**And** le bouton Start est remplacé par un bouton Stop discret

**Given** une session est en cours
**When** je regarde l'interface
**Then** le cercle affiche le temps écoulé au format MM:SS
**And** l'interface reste visible et lisible (FR16)

**Given** une session est en cours
**When** je tape sur le bouton Stop
**Then** la session s'arrête immédiatement
**And** je reviens à l'écran de configuration (mode repos)

**Given** les boutons Start/Stop
**When** je les utilise sur mobile
**Then** les zones de tap font minimum 48x48px
**And** le feedback visuel est immédiat au tap

### Story 1.4: Logique Timer & Gestion Session

En tant qu'utilisateur,
Je veux que le timer fonctionne avec précision et se termine automatiquement,
Afin de méditer en confiance sans surveiller le temps.

**Acceptance Criteria:**

**Given** une session est démarrée
**When** le temps passe
**Then** le timer s'incrémente en temps réel (affichage fluide)
**And** le cercle de progression se "vide" proportionnellement

**Given** une session est en cours
**When** la durée totale configurée est atteinte
**Then** la session se termine automatiquement (FR8)
**And** le timer affiche 00:00 ou la durée totale selon le mode d'affichage

**Given** une session se termine
**When** la fin est atteinte
**Then** l'écran indique clairement la fin de session
**And** après 3 secondes, retour automatique à l'écran principal

**Given** le hook useTimer est implémenté
**When** il gère l'état du timer
**Then** il expose : elapsedTime, isRunning, start(), stop(), reset()
**And** il respecte le pattern de retour standardisé (data, actions, status)

**Given** le timer fonctionne
**When** je mesure sa précision
**Then** les intervalles sont respectés à ±500ms (NFR1)

### Story 1.5: Persistance des Réglages

En tant qu'utilisateur,
Je veux retrouver mes derniers réglages au lancement de l'app,
Afin de démarrer ma méditation en un tap sans reconfigurer.

**Acceptance Criteria:**

**Given** je configure une durée et un intervalle
**When** je modifie ces valeurs
**Then** elles sont sauvegardées automatiquement dans LocalStorage
**And** aucune action explicite de sauvegarde n'est requise

**Given** j'ai utilisé l'app précédemment
**When** je relance l'app
**Then** mes derniers réglages (durée + intervalle) sont restaurés
**And** ils s'affichent immédiatement à l'écran principal

**Given** c'est ma première utilisation (pas de données sauvegardées)
**When** je lance l'app
**Then** des valeurs par défaut sont affichées (20 min, 5 min)
**And** l'app fonctionne normalement

**Given** LocalStorage n'est pas disponible (mode privé, etc.)
**When** j'utilise l'app
**Then** l'app fonctionne avec les valeurs en mémoire
**And** aucune erreur n'est affichée (fallback silencieux - NFR8)

### Story 1.6: Indicateurs de Gongs & Polish

En tant qu'utilisateur,
Je veux voir des indicateurs visuels des gongs pendant ma session,
Afin de savoir où j'en suis sans dépendre uniquement du son.

**Acceptance Criteria:**

**Given** une session est en cours
**When** je regarde l'interface
**Then** je vois des points indicateurs (GongIndicators) sous le timer
**And** le nombre de points correspond au nombre de gongs prévus

**Given** les indicateurs de gongs sont affichés
**When** un intervalle est atteint (moment du gong)
**Then** le point correspondant passe de vide à rempli
**And** une animation subtile accompagne le changement

**Given** je suis sur l'écran principal (mode repos)
**When** je veux démarrer une session
**Then** je peux configurer et démarrer en moins de 10 secondes (FR15)
**And** l'interface ne présente aucune friction inutile

**Given** l'interface complète est affichée
**When** je l'évalue visuellement
**Then** elle respecte la direction "Circular Focus" du UX Design
**And** les espacements sont généreux (breathing room)
**And** la typographie est lisible (serif pour timer, sans-serif pour labels)

---

## Epic 2: Expérience Audio des Gongs

Anna entend des sons de bol tibétain doux aux intervalles configurés et un son distinct à la fin de sa session. Les sons maintiennent l'état méditatif sans l'interrompre.

### Story 2.1: Système Audio & Hook useAudio

En tant qu'équipe de développement,
Je veux un système audio robuste basé sur Web Audio API,
Afin de jouer des sons avec précision et faible latence.

**Acceptance Criteria:**

**Given** l'utilisateur tape sur Start
**When** la session démarre
**Then** un AudioContext est créé (contourne les politiques autoplay mobile)
**And** les fichiers audio (gong-interval.mp3, gong-end.mp3) sont chargés en AudioBuffer

**Given** le hook useAudio est implémenté
**When** il est utilisé
**Then** il expose : playIntervalGong(), playEndGong(), isReady, error
**And** il respecte le pattern de retour standardisé (data, actions, status)

**Given** les fichiers audio sont chargés
**When** je déclenche un son
**Then** la latence est inférieure à 100ms (NFR2)
**And** le son est joué via AudioBufferSourceNode

**Given** le navigateur ne supporte pas Web Audio API
**When** j'initialise useAudio
**Then** error contient un message approprié
**And** isReady reste false (permettant le fallback visuel)

**Given** les fichiers audio sont dans /public/sounds/
**When** le projet est construit
**Then** ils sont accessibles et cachables par le Service Worker

### Story 2.2: Lecture des Gongs & Intégration Timer

En tant qu'utilisateur,
Je veux entendre des sons de bol tibétain aux moments configurés,
Afin de suivre ma méditation sans ouvrir les yeux.

**Acceptance Criteria:**

**Given** une session est en cours
**When** un intervalle configuré est atteint
**Then** le son de gong d'intervalle (bol tibétain doux, 2-3s) est joué (FR9)
**And** le son maintient l'état méditatif sans l'interrompre

**Given** une session est en cours
**When** la durée totale est atteinte
**Then** le son de gong de fin (distinct, 4-5s) est joué (FR10)
**And** ce son est légèrement différent pour signaler clairement la fin

**Given** le timer et l'audio sont intégrés
**When** les gongs doivent être déclenchés
**Then** ils se déclenchent exactement aux moments configurés (FR11)
**And** la précision est de ±500ms (NFR1)

**Given** l'audio n'est pas disponible (erreur ou non supporté)
**When** un gong devrait être joué
**Then** un flash visuel subtil apparaît sur le cercle du timer
**And** l'utilisateur est informé discrètement ("Son indisponible") (NFR8)

**Given** plusieurs gongs sont configurés (ex: 20 min, intervalle 5 min)
**When** la session se déroule
**Then** les gongs sont joués à 5, 10, 15 minutes
**And** le gong de fin est joué à 20 minutes (pas de double gong)

---

## Epic 3: PWA Installable & Offline

Anna peut installer l'app sur son écran d'accueil et méditer sans connexion internet. L'app fonctionne de manière fiable partout.

### Story 3.1: Configuration PWA & Installation

En tant qu'utilisateur,
Je veux pouvoir installer l'app sur mon écran d'accueil,
Afin d'y accéder rapidement comme une app native.

**Acceptance Criteria:**

**Given** le projet Next.js avec @ducanh2912/next-pwa
**When** je configure next.config.js
**Then** le Service Worker est généré automatiquement au build
**And** la configuration utilise la stratégie cache-first

**Given** le fichier manifest.ts est créé
**When** l'app est chargée
**Then** le manifest contient : name, short_name, description, theme_color, background_color
**And** les icônes sont définies (192x192, 512x512, apple-touch-icon)

**Given** les icônes PWA sont dans /public/icons/
**When** je vérifie les assets
**Then** icon-192.png, icon-512.png et apple-touch-icon.png existent
**And** ils respectent les dimensions requises

**Given** je visite l'app sur mobile (Chrome Android)
**When** les critères PWA sont remplis
**Then** le navigateur propose l'installation ("Ajouter à l'écran d'accueil")
**And** l'app installée s'ouvre en mode standalone (FR13)

**Given** je visite l'app sur iOS Safari
**When** j'utilise "Ajouter à l'écran d'accueil"
**Then** l'app s'installe avec l'icône apple-touch-icon
**And** elle fonctionne en mode standalone (avec limitations iOS acceptées)

### Story 3.2: Offline & Stratégie de Cache

En tant qu'utilisateur,
Je veux utiliser l'app sans connexion internet,
Afin de méditer n'importe où, même sans réseau.

**Acceptance Criteria:**

**Given** j'ai chargé l'app une première fois (avec connexion)
**When** je perds ma connexion internet
**Then** l'app fonctionne à 100% (FR12)
**And** toutes les fonctionnalités sont disponibles (NFR5)

**Given** le Service Worker est configuré
**When** les assets sont mis en cache
**Then** les fichiers HTML, JS, CSS sont cachés (cache-first)
**And** les fichiers audio (gong-interval.mp3, gong-end.mp3) sont cachés
**And** les icônes et fonts sont cachés

**Given** je suis offline
**When** je démarre une session de méditation
**Then** le timer fonctionne normalement
**And** les gongs audio sont joués correctement
**And** mes réglages sont sauvegardés localement

**Given** l'app est installée et offline
**When** je la relance
**Then** elle démarre sans téléchargement supplémentaire (FR14)
**And** le temps de chargement reste rapide (< 2s)

**Given** une session est en cours
**When** j'utilise le hook useWakeLock
**Then** l'écran reste allumé pendant la méditation (si supporté)
**And** si Wake Lock n'est pas supporté, l'app fonctionne normalement (graceful degradation)

**Given** je vérifie les métriques de performance
**When** je lance Lighthouse
**Then** le score PWA est optimal
**And** l'app passe les critères "installable" et "offline-ready"
