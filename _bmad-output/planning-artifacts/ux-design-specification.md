---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - planning-artifacts/product-brief-meditation-2026-02-01.md
  - planning-artifacts/prd.md
date: 2026-02-01
author: Anna
---

# UX Design Specification meditation

**Author:** Anna
**Date:** 2026-02-01

---

## Executive Summary

### Project Vision

**meditation** est un timer de méditation minimaliste conçu pour résoudre un problème précis : les timers standards (alarmes de téléphone, apps complexes) sont inadaptés à la pratique méditative. Ils génèrent du stress au lieu du calme, interrompent l'état méditatif, et ne permettent pas de suivre le temps sans ouvrir les yeux.

La solution : une PWA épurée qui permet de définir une durée et des intervalles, puis de méditer en confiance avec des sons de bol tibétain doux comme seuls repères temporels.

**Philosophie UX :** Simple = Parfait. Chaque élément d'interface doit servir la simplicité et le calme, jamais les complexifier.

### Target Users

**Persona principal : Anna**
- Pratiquante de méditation cherchant à approfondir sa pratique
- Médite 3x/semaine, 15-30 minutes, à domicile
- Frustrée par les timers inadaptés qui brisent son état de calme
- Recherche : fiabilité, simplicité, sons doux
- Critère de succès : "J'ai réussi à méditer dans le calme et en toute confiance"

**Niveau technique :** Intermédiaire - à l'aise avec les apps mobiles, pas besoin d'explications

**Contexte d'usage :** Mobile-first, moments calmes (matin/soir), environnement domestique

### Key Design Challenges

| Défi | Implication UX |
|------|----------------|
| **Simplicité extrême** | Interface si épurée qu'elle ne demande aucune réflexion - zéro charge cognitive |
| **Configuration rapide** | De l'ouverture au démarrage en < 10 secondes |
| **Atmosphère calme** | L'UI doit induire un état de calme avant même de méditer |
| **Contraintes audio mobile** | Politiques d'autoplay, contexte audio, fiabilité des sons |
| **Session sans interruption** | L'écran doit rester utilisable sans attirer l'attention |

### Design Opportunities

| Opportunité | Potentiel |
|-------------|-----------|
| **Interface "zen"** | Une esthétique minimaliste qui prépare mentalement à la méditation |
| **Micro-interactions apaisantes** | Animations douces et transitions fluides renforçant le calme |
| **Feedback minimal intelligent** | Informations essentielles présentées sans surcharge |
| **Ritualization** | L'app devient un rituel pré-méditation, un sas vers le calme |

## Core User Experience

### Defining Experience

**Action principale :** Ouvrir l'app et démarrer immédiatement avec les derniers réglages.

La méditation ne commence pas au premier gong - elle commence dès l'ouverture de l'app. L'expérience doit être si fluide que l'utilisateur passe de "je veux méditer" à "je médite" en quelques secondes, sans friction mentale.

**Boucle d'usage typique :**
1. Ouvrir l'app → réglages précédents affichés
2. Un tap sur Start
3. Méditer en confiance
4. Gong de fin → session terminée

### Platform Strategy

| Aspect | Décision |
|--------|----------|
| **Type** | Progressive Web App (PWA) |
| **Approche** | Mobile-first, offline-first |
| **Interaction** | Touch-based principalement |
| **Installation** | Installable sur écran d'accueil |
| **Connectivité** | 100% fonctionnel hors ligne après premier chargement |

### Effortless Interactions

| Interaction | Niveau d'effort cible |
|-------------|----------------------|
| **Ouvrir → Démarrer** | 1 tap (réglages déjà présents) |
| **Configuration initiale** | Intuitive, < 10 secondes |
| **Modifier les réglages** | Accessible mais pas intrusif |
| **Pendant la méditation** | Zéro interaction requise |
| **Fin de session** | Automatique, aucune action |

### Critical Success Moments

| Moment | Critère de succès |
|--------|-------------------|
| **Premier lancement** | "C'est exactement ce qu'il me faut" - clarté immédiate |
| **Premier gong** | Son doux qui maintient l'état méditatif |
| **Fin de session** | Calme préservé, confiance confirmée |
| **Usage quotidien** | L'app devient un rituel, pas un outil |

### Experience Principles

1. **Zéro friction** - De l'intention à l'action en un tap
2. **Configuration une fois, méditation toujours** - Les réglages persistent intelligemment
3. **Invisible quand active** - L'app travaille silencieusement pendant la méditation
4. **Calme du début à la fin** - Chaque pixel, chaque interaction respire la sérénité

## Desired Emotional Response

### Primary Emotional Goals

**Émotion principale :** Détente

L'app doit être un sas vers la relaxation. Dès l'ouverture, l'utilisateur commence à se détendre. L'interface elle-même participe à l'état méditatif recherché.

**Émotions secondaires :**
- **Confiance** - Savoir que l'app fera son travail sans faille
- **Simplicité** - Ne jamais avoir à réfléchir
- **Efficacité** - Atteindre son objectif sans détour

### Emotional Journey Mapping

| Phase | Émotion | Traduction UX |
|-------|---------|---------------|
| **Ouverture** | Apaisement | Interface calme, pas de sollicitation |
| **Configuration** | Clarté | Contrôles évidents, pas de surcharge |
| **Démarrage** | Confiance | Feedback clair, transition douce |
| **Session active** | Détente profonde | Écran minimal, aucune distraction |
| **Gong intervalle** | Douceur | Son qui accompagne, pas qui interrompt |
| **Fin de session** | Accomplissement | Conclusion sereine, pas de popup |
| **Après session** | Satisfaction | Fermeture simple, pas de rétention |

### Micro-Emotions

**À cultiver :**

| Micro-émotion | Importance |
|---------------|------------|
| **Confiance** vs Doute | L'utilisateur sait que les gongs arriveront |
| **Lâcher-prise** vs Contrôle | Pouvoir fermer les yeux sans inquiétude |
| **Accomplissement** vs Échec | Chaque session est une réussite |

**À éviter absolument :**

| Anti-émotion | Comment l'éviter |
|--------------|------------------|
| **Stress** | Pas de compte à rebours anxiogène |
| **Urgence** | Pas de notifications, pas de rappels |
| **Pression** | Pas d'historique, pas de "streak", pas de gamification |
| **Culpabilité** | Pas de jugement sur la fréquence d'usage |

### Design Implications

| Émotion cible | Implication UX |
|---------------|----------------|
| **Détente** | Palette de couleurs apaisantes, animations lentes et fluides |
| **Simplicité** | Maximum 2-3 éléments visibles à la fois |
| **Confiance** | Feedback subtil mais présent (timer visible) |
| **Efficacité** | Un tap pour démarrer, zéro étape superflue |

### Emotional Design Principles

1. **L'app est un refuge** - Chaque élément doit réduire le stress, jamais l'augmenter
2. **Invisible = Réussi** - Moins l'utilisateur pense à l'app, mieux c'est
3. **Zéro culpabilité** - Pas de tracking, pas de jugement, pas de "motivation"
4. **Simple = Efficace** - La simplicité EST la proposition de valeur émotionnelle

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Approche choisie :** Design basé sur des principes plutôt que sur l'imitation d'apps existantes.

Les apps de méditation commerciales (Calm, Headspace, Insight Timer) offrent des fonctionnalités riches mais s'éloignent de la simplicité recherchée. L'inspiration pour **meditation** vient de principes de design minimaliste et d'interfaces "zen" plutôt que de produits spécifiques.

**Philosophie d'inspiration :**
- Moins c'est plus
- L'interface doit disparaître pendant l'usage
- Chaque élément doit justifier sa présence

### Transferable UX Patterns

**Patterns à Adopter :**

| Pattern | Application pour meditation |
|---------|----------------------------|
| **Single-screen app** | Tout sur un seul écran - configuration, démarrage, timer |
| **Progressive disclosure** | Réglages accessibles mais pas imposés |
| **Ambient interface** | Couleurs et formes apaisantes, non-stimulantes |
| **Generous whitespace** | Espace vide généreux = espace mental pour respirer |
| **Large touch targets** | Boutons faciles à toucher, même les yeux mi-clos |
| **Persistent state** | Derniers réglages mémorisés automatiquement |
| **Minimal chrome** | Pas de barre de navigation, pas de menu hamburger |

**Interactions clés :**

| Interaction | Pattern recommandé |
|-------------|-------------------|
| **Sélection durée** | Slider ou stepper simple, pas de clavier |
| **Sélection intervalle** | Même pattern que durée, cohérence |
| **Démarrage** | Bouton central proéminent, un seul tap |
| **Arrêt session** | Accessible mais pas accidentel |

### Anti-Patterns to Avoid

**Ce que font les apps commerciales (à ne pas reproduire) :**

| Anti-pattern | Effet négatif | Alternative pour meditation |
|--------------|---------------|----------------------------|
| **Onboarding interminable** | Friction, impatience | Aucun onboarding - usage immédiat |
| **Écran d'accueil chargé** | Surcharge cognitive | Écran unique, épuré |
| **Gamification** | Pression, performance | Zéro tracking, zéro streak |
| **Notifications push** | Culpabilité | Aucune notification |
| **Historique/statistiques** | Jugement implicite | Pas de données conservées |
| **Upselling/premium** | Stress commercial | App gratuite, complète |
| **Compte utilisateur** | Friction, vie privée | Pas de compte requis |
| **Contenu guidé** | Dépendance, complexité | Timer pur, liberté totale |

### Design Inspiration Strategy

**Principes directeurs :**

1. **Adopter** - Patterns minimalistes éprouvés
   - Single-screen design
   - Large touch targets
   - Persistent state
   - Ambient colors

2. **Adapter** - Simplifier au maximum
   - Contrôles de timer standards → version ultra-simplifiée
   - Feedback visuel → minimal mais présent

3. **Rejeter** - Tout ce qui ajoute de la friction ou de la pression
   - Onboarding
   - Tracking
   - Gamification
   - Notifications
   - Comptes utilisateur

**Résultat visé :** Une app si simple qu'elle semble évidente, comme si elle n'avait pas pu être conçue autrement.

