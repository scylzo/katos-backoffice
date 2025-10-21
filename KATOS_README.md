# Backoffice Katos Construction

Application web de gestion pour l'entreprise Katos Construction - Interface de gestion des clients et vitrine des matériaux.

## 🏗️ Description

Cette application permet à l'équipe Katos Construction de :
- Gérer la base de données clients et leurs projets
- Administrer la vitrine des matériaux de second œuvre
- Suivre l'activité via un tableau de bord

## ⚡ Démarrage rapide

### Prérequis
- Node.js (version 16+)
- npm ou yarn

### Installation
```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build
```

## 🔑 Connexion

Utilisez les identifiants de test :
- **Email** : admin@katos.com
- **Mot de passe** : 1234

## 🚀 Fonctionnalités

### Dashboard
- Vue d'ensemble de l'activité
- Statistiques des projets
- Aperçu des derniers clients
- Matériaux en vitrine

### Gestion des Clients
- Ajout/modification/suppression de clients
- Informations projet détaillées
- Statuts de suivi (En cours, Terminé, En attente)

### Boutique/Vitrine
- Gestion des matériaux de second œuvre
- Upload d'images
- Catégorisation des produits
- Gestion des fournisseurs

### Paramètres
- Informations du compte
- Déconnexion sécurisée

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript
- **Build** : Vite
- **Routing** : React Router DOM
- **UI** : Tailwind CSS + Lucide Icons
- **State Management** : Zustand avec persistance
- **Font** : Fira Sans

## 🎨 Design System

### Couleurs
- Bleu foncé : `#003366` (primary)
- Or : `#E0B043` (gold)
- Gris clair : `#F5F5F5`

### Composants réutilisables
- Button, Input, Card, Modal
- Sidebar, TopBar, Layout
- Forms avec validation

## 📁 Structure du projet

```
src/
├── components/
│   ├── ui/            # Composants réutilisables
│   ├── layout/        # Layout et navigation
│   ├── clients/       # Composants clients
│   └── boutique/      # Composants boutique
├── pages/             # Pages principales
├── store/             # État global (Zustand)
├── types/             # Types TypeScript
└── utils/             # Utilitaires
```

## 💾 Données

Les données sont **mockées localement** et persistées dans localStorage via Zustand.
Aucune connexion backend n'est requise pour cette version.

## 🔗 Intégration future

Cette interface est conçue pour s'intégrer avec l'application mobile Katos Construction.
Les matériaux gérés ici seront visibles dans l'app mobile cliente.

---

**Katos Construction Backoffice v1.0** - Interface d'administration moderne et responsive