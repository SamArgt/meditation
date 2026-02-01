---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-02-01
author: Anna
---

# Product Brief: meditation

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

**meditation** est une application de timer minimaliste conçue pour la pratique méditative personnelle. Contrairement aux apps de méditation guidée complexes, elle se concentre sur un seul besoin : permettre au pratiquant de suivre le temps sans interrompre son état méditatif, grâce à des repères sonores doux et configurables.

---

## Core Vision

### Problem Statement

Les timers de téléphone standards ne sont pas adaptés à la pratique méditative : le son est désagréable et stressant, il faut interrompre sa pratique pour l'éteindre, et il est impossible de programmer plusieurs repères temporels durant une même session.

### Problem Impact

Le méditant perd son état de concentration, ressent du stress au lieu du calme, et n'a aucun moyen de garder conscience du temps écoulé sans ouvrir les yeux ou interrompre sa pratique.

### Why Existing Solutions Fall Short

- Les apps de méditation (Headspace, Calm, Insight Timer) proposent du contenu guidé, des abonnements et des fonctionnalités superflues pour qui cherche simplement un timer
- Les timers natifs du téléphone n'offrent qu'une seule alarme avec des sons inadaptés
- Aucun outil simple ne combine liberté totale et repères sonores doux

### Proposed Solution

Une application minimaliste et multi-plateforme qui permet de :
- Définir la durée totale de méditation
- Configurer des intervalles entre les gongs (ex: toutes les 5 minutes)
- Entendre des sons de bol tibétain ou gong, doux et non-intrusifs
- Recevoir un gong distinct pour signaler la fin de session
- Pratiquer sans aucune interruption ni action requise

### Key Differentiators

| Différenciateur | Description |
|-----------------|-------------|
| Simplicité radicale | Une seule fonction, parfaitement exécutée |
| Liberté totale | Aucune donnée, aucun historique, aucun guide |
| Sons adaptés | Bol tibétain / gong - jamais de voix |
| Multi-plateforme | Utilisable sur tout appareil connecté |
| Usage personnel | Conçu pour soi, pas pour le commerce |

---

## Target Users

### Primary Users

**Persona : Anna, la méditante en quête d'approfondissement**

| Attribut | Description |
|----------|-------------|
| Profil | Pratiquante de méditation souhaitant intensifier sa pratique |
| Fréquence | 3 fois par semaine, 15-30 minutes par session |
| Contexte | À domicile, matin ou soir |
| Motivation | Recherche de calme et relaxation |
| Frustration actuelle | Le timer du téléphone génère stress et frustration, brise l'état méditatif |

**Besoins clés :**
- Suivre le temps sans stress ni interruption
- Interface simple, claire et rassurante
- Sons doux qui maintiennent l'état de calme
- Configuration rapide pour ne pas retarder la pratique

**Critère de succès :** Terminer une session en se disant "j'ai réussi à méditer dans le calme et en toute confiance"

### Secondary Users

**Méditants de tous niveaux** - amis, connaissances, ou toute personne pratiquant la méditation qui partage les mêmes frustrations avec les timers classiques. L'app s'adapte à tous les profils grâce à sa simplicité et sa flexibilité de configuration.

**Découverte :** Principalement par bouche-à-oreille et recommandation directe.

### User Journey

| Étape | Expérience |
|-------|------------|
| **Découverte** | Recommandation d'un ami ou recherche d'une solution simple |
| **Premier lancement** | Interface épurée, configuration en quelques secondes → "C'est exactement ce qu'il me faut" |
| **Configuration** | Définir durée totale + intervalles, possibilité de sauvegarder des préréglages |
| **Usage quotidien** | Ouvrir l'app juste avant de s'asseoir, lancer en un tap, méditer en confiance |
| **Moment "aha!"** | Fin de session sans interruption → calme et confiance préservés |
| **Routine** | L'app devient un rituel pré-méditation, réglages favoris prêts à l'emploi |

---

## Success Metrics

### User Success Metrics

| Critère | Indicateur de succès |
|---------|---------------------|
| **État émotionnel** | Se sentir calme et détendue après chaque session, sans frustration |
| **Fiabilité technique** | Les gongs se déclenchent exactement aux intervalles configurés |
| **Qualité sonore** | Sons agréables qui maintiennent l'état méditatif |
| **Absence de friction** | Aucune interruption ni action requise pendant la méditation |

### Business Objectives

*Projet personnel - pas d'objectifs commerciaux*

| Objectif | Description |
|----------|-------------|
| **Complétion du projet** | Créer une app fonctionnelle qui répond exactement au besoin identifié |
| **Usage régulier** | Utiliser l'app pour sa propre pratique méditative de façon régulière |
| **Simplicité maintenue** | Résister à la tentation d'ajouter des fonctionnalités superflues |

### Key Performance Indicators

| KPI | Mesure |
|-----|--------|
| **Fiabilité** | 100% des gongs déclenchés au bon moment |
| **Adoption personnelle** | Utilisation de l'app pour chaque session de méditation |
| **Satisfaction** | Fin de session sans frustration ni stress |
| **Stabilité** | Aucun bug ni crash pendant les sessions |

**Philosophie de succès :** Simple = Parfait. Le succès se mesure à l'absence de complexité inutile.

---

## MVP Scope

### Core Features

| Fonctionnalité | Description |
|----------------|-------------|
| **Configuration durée** | Définir la durée totale de la session de méditation |
| **Configuration intervalles** | Définir l'intervalle entre chaque gong (ex: 5 minutes) |
| **Bouton Start** | Lancer la session en un tap |
| **Timer en direct** | Affichage du temps écoulé pendant la session |
| **Gong d'intervalle** | Son de bol tibétain aux intervalles configurés |
| **Gong de fin** | Son distinct signalant la fin de la session |
| **PWA offline** | Fonctionnement complet sans connexion internet |

### Choix Techniques

| Aspect | Décision |
|--------|----------|
| **Framework** | NextJS |
| **Type d'app** | Progressive Web App (PWA) |
| **Design** | Mobile-first |
| **Connectivité** | Offline-first |

### Out of Scope for MVP

| Fonctionnalité | Raison | Version cible |
|----------------|--------|---------------|
| Préréglages sauvegardés | Pas indispensable, configuration manuelle acceptable | v2 |
| Choix de sons | Un seul son (bol tibétain) suffit pour valider le concept | v2 |
| Thèmes visuels | La fonctionnalité prime sur l'esthétique personnalisable | v2 |
| Historique des sessions | Exclu par design - simplicité volontaire | Jamais |

### MVP Success Criteria

| Critère | Validation |
|---------|------------|
| **Fonctionnement offline** | L'app fonctionne entièrement sans connexion internet |
| **Session complète** | Réussir une séance de méditation complète sans avoir à regarder le téléphone |
| **Fiabilité des gongs** | Tous les gongs se déclenchent aux moments configurés |
| **Expérience calme** | Fin de session sans frustration ni stress |

### Future Vision

**v2 - Améliorations prioritaires :**
- Préréglages sauvegardés pour démarrage rapide
- Choix parmi plusieurs sons (bol tibétain, gong, carillon...)
- Thèmes visuels / personnalisation de l'interface

**Philosophie d'évolution :** Chaque ajout doit servir la simplicité, jamais la complexifier.
