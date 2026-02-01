---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys, step-05-domain-skipped, step-06-innovation-skipped, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
status: complete
inputDocuments:
  - planning-artifacts/product-brief-meditation-2026-02-01.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: web_app_pwa
  domain: general
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
date: 2026-02-01
author: Anna
---

# Product Requirements Document - meditation

**Author:** Anna
**Date:** 2026-02-01

## Success Criteria

### User Success

| Critère | Indicateur |
|---------|------------|
| **État émotionnel** | Se sentir calme et détendue après chaque session, sans frustration |
| **Fiabilité technique** | Les gongs se déclenchent exactement aux intervalles configurés |
| **Qualité sonore** | Sons de bol tibétain agréables qui maintiennent l'état méditatif |
| **Absence de friction** | Aucune interruption ni action requise pendant la méditation |

### Business Success

*Projet personnel - pas d'objectifs commerciaux*

| Objectif | Description |
|----------|-------------|
| **Complétion** | Créer une app fonctionnelle qui répond exactement au besoin identifié |
| **Adoption personnelle** | Utiliser l'app pour sa propre pratique méditative de façon régulière |
| **Simplicité maintenue** | Résister à la tentation d'ajouter des fonctionnalités superflues |

### Technical Success

| KPI | Cible |
|-----|-------|
| **Fiabilité des gongs** | 100% des gongs déclenchés au bon moment |
| **Stabilité** | Zéro bug ou crash pendant les sessions |
| **Offline** | Fonctionnement complet sans connexion internet |

### Measurable Outcomes

- Terminer une session de méditation complète sans regarder le téléphone
- Fin de session avec sentiment de calme préservé
- Configuration en moins de 10 secondes avant chaque session

## Product Scope

### MVP - Minimum Viable Product

| Fonctionnalité | Description |
|----------------|-------------|
| Configuration durée | Définir la durée totale de la session |
| Configuration intervalles | Définir l'intervalle entre chaque gong |
| Bouton Start | Lancer la session en un tap |
| Timer en direct | Affichage du temps écoulé |
| Gong d'intervalle | Son de bol tibétain aux intervalles configurés |
| Gong de fin | Son distinct signalant la fin |
| PWA offline | Fonctionnement complet sans connexion |

### Growth Features (Post-MVP)

| Fonctionnalité | Version cible |
|----------------|---------------|
| Préréglages sauvegardés | v2 |
| Choix de sons | v2 |
| Thèmes visuels | v2 |

### Vision (Future)

Philosophie d'évolution : chaque ajout doit servir la simplicité, jamais la complexifier. L'historique des sessions est exclu par design - la simplicité est volontaire.

## User Journeys

### Parcours Principal : Anna découvre la sérénité

**Persona :** Anna, 35 ans, pratiquante de méditation cherchant à approfondir sa pratique. Elle médite 3 fois par semaine, 15-30 minutes, chez elle le matin ou le soir.

**Opening Scene :**
Anna termine une session de méditation. Le timer de son téléphone sonne brutalement - une alarme stridente qui la fait sursauter. Son cœur s'accélère, la tension revient. Elle se dit : "Encore raté. Pourquoi est-ce si difficile de méditer en paix ?"

**Rising Action :**
Une amie lui recommande meditation. Anna ouvre l'app pour la première fois. L'interface est épurée, calme. En 10 secondes, elle configure : 20 minutes, un gong toutes les 5 minutes. Elle appuie sur Start, ferme les yeux.

**Climax :**
Pendant sa méditation, un son doux de bol tibétain résonne doucement. Anna note le passage du temps sans ouvrir les yeux, sans stress. Elle reste dans son état de calme. À la fin, un gong distinct lui signale que la session est terminée.

**Resolution :**
Anna ouvre les yeux, sereine. Elle pense : "J'ai réussi à méditer dans le calme et en toute confiance." L'app devient son rituel pré-méditation. Elle ne retourne jamais au timer standard.

### Parcours Secondaire : Usage quotidien routinier

**Contexte :** Anna utilise l'app depuis plusieurs semaines.

**Le parcours :**
1. Anna s'installe pour méditer
2. Elle ouvre l'app - ses derniers réglages sont déjà affichés
3. Un tap sur Start
4. Méditation sereine avec gongs d'intervalle
5. Gong de fin, session terminée
6. Anna ferme l'app et continue sa journée

**Durée totale d'interaction :** < 5 secondes avant la méditation

### Journey Requirements Summary

| Capacité révélée | Source |
|------------------|--------|
| Configuration rapide (durée + intervalles) | Opening Scene - besoin de simplicité |
| Démarrage en un tap | Rising Action - zéro friction |
| Gongs d'intervalle doux | Climax - maintenir l'état méditatif |
| Gong de fin distinct | Resolution - signaler sans stresser |
| Mémorisation des derniers réglages | Usage routinier - accélérer le démarrage |
| Interface épurée et calme | Premier lancement - première impression |

## Web App (PWA) Specific Requirements

### Project-Type Overview

Application PWA minimaliste, mobile-first, offline-first. Architecture SPA légère optimisée pour une seule fonction : timer de méditation avec gongs.

### Technical Architecture Considerations

| Aspect | Décision |
|--------|----------|
| **Architecture** | Single Page Application (PWA) |
| **Framework** | NextJS |
| **Approche** | Mobile-first, Offline-first |
| **Service Worker** | Requis pour fonctionnement offline |

### Browser Support

| Navigateur | Support |
|------------|---------|
| Chrome Mobile | ✓ Prioritaire |
| Chrome Desktop | ✓ Supporté |
| Firefox | ✓ Supporté |
| Safari iOS | Optionnel (limitations PWA acceptées) |
| Edge | ✓ Supporté |

**Stratégie :** Cibler les navigateurs modernes avec support PWA complet. Pas de polyfills pour navigateurs anciens.

### Responsive Design

| Breakpoint | Priorité |
|------------|----------|
| Mobile (< 768px) | Prioritaire - conception principale |
| Tablet (768-1024px) | Secondaire - adaptation fluide |
| Desktop (> 1024px) | Tertiaire - fonctionnel mais non optimisé |

### Performance Targets

| Métrique | Cible |
|----------|-------|
| **First Contentful Paint** | < 1.5s |
| **Time to Interactive** | < 2s |
| **Bundle size** | Minimal (app simple) |
| **Offline readiness** | Immédiat après premier chargement |

### SEO Strategy

Non applicable - application personnelle sans besoin de découverte via moteurs de recherche.

### Accessibility Level

Niveau de base respecté (contrastes, tailles de texte lisibles) mais pas d'optimisation spécifique pour lecteurs d'écran ou besoins particuliers.

### Implementation Considerations

- **Audio API** : Web Audio API pour les sons de bol tibétain (gestion du contexte audio mobile)
- **Wake Lock API** : Empêcher la mise en veille pendant la méditation (si supporté)
- **Service Worker** : Cache des assets et du son pour fonctionnement offline
- **Manifest** : Configuration PWA pour installation sur écran d'accueil

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approche MVP :** Problem-solving MVP - résoudre un seul problème (timer inadapté à la méditation) de façon excellente.

**Philosophie :** Simplicité radicale. Chaque fonctionnalité doit servir la simplicité, jamais la complexifier.

**Ressources :** Projet personnel, développement solo.

### MVP Feature Set (Phase 1)

**Parcours utilisateur supporté :** Anna configure et médite en confiance

**Capacités essentielles :**

| Fonctionnalité | Justification |
|----------------|---------------|
| Configuration durée | Essentiel - définir la session |
| Configuration intervalles | Essentiel - repères temporels |
| Bouton Start | Essentiel - démarrer en un tap |
| Timer en direct | Essentiel - feedback visuel |
| Gong d'intervalle | Essentiel - valeur principale |
| Gong de fin | Essentiel - signaler sans stresser |
| PWA offline | Essentiel - fiabilité totale |

### Post-MVP Features

**Phase 2 (Growth) :**
- Préréglages sauvegardés - démarrage encore plus rapide
- Choix de sons - personnalisation sonore
- Thèmes visuels - personnalisation visuelle

**Phase 3 (Expansion) :**
- Non planifié - maintenir la simplicité volontairement

**Exclusions permanentes :**
- Historique des sessions (exclu par design)
- Contenu guidé (hors scope)
- Fonctionnalités sociales (hors scope)

### Risk Mitigation Strategy

| Risque | Mitigation |
|--------|------------|
| **Audio mobile** | Tester Web Audio API sur appareils réels dès le début |
| **Autoplay policies** | Déclencher l'audio après interaction utilisateur (tap Start) |
| **Service Worker** | Utiliser les patterns PWA établis (Workbox) |
| **Wake Lock** | Implémenter comme amélioration progressive (graceful degradation) |

## Functional Requirements

### Configuration de Session

- **FR1:** L'utilisateur peut définir la durée totale de la session de méditation
- **FR2:** L'utilisateur peut définir l'intervalle entre chaque gong
- **FR3:** L'utilisateur peut voir ses derniers réglages au lancement de l'app
- **FR4:** L'utilisateur peut modifier les réglages avant de démarrer

### Contrôle du Timer

- **FR5:** L'utilisateur peut démarrer une session de méditation
- **FR6:** L'utilisateur peut voir le temps écoulé pendant la session
- **FR7:** L'utilisateur peut arrêter la session en cours
- **FR8:** Le système termine automatiquement la session à la durée configurée

### Notifications Audio

- **FR9:** Le système joue un son de bol tibétain à chaque intervalle configuré
- **FR10:** Le système joue un son distinct pour signaler la fin de session
- **FR11:** Les sons se déclenchent exactement aux moments configurés

### Fonctionnement Offline & PWA

- **FR12:** L'utilisateur peut utiliser l'app sans connexion internet
- **FR13:** L'utilisateur peut installer l'app sur son écran d'accueil
- **FR14:** L'app fonctionne après le premier chargement sans téléchargement supplémentaire

### Interface Utilisateur

- **FR15:** L'utilisateur peut configurer et démarrer une session en moins de 10 secondes
- **FR16:** L'interface reste visible et lisible pendant la session

## Non-Functional Requirements

### Performance

| Exigence | Cible |
|----------|-------|
| **Précision du timer** | Gongs déclenchés à ±500ms de l'intervalle configuré |
| **Latence audio** | Son joué dans les 100ms suivant le déclenchement |
| **Temps de chargement** | First Contentful Paint < 1.5s, Time to Interactive < 2s |
| **Réactivité UI** | Actions utilisateur traitées en < 100ms |

### Fiabilité

| Exigence | Cible |
|----------|-------|
| **Fonctionnement offline** | 100% des fonctionnalités disponibles sans connexion après premier chargement |
| **Stabilité session** | Zéro crash ou interruption pendant une session de méditation |
| **Persistance état** | Derniers réglages conservés entre les sessions |
| **Gestion erreurs audio** | Fallback gracieux si audio échoue (notification visuelle) |
