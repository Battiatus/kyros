
# Hereoz - Plateforme de Recrutement en Hôtellerie-Restauration

Hereoz est une plateforme clé en main destinée au secteur de l'hôtellerie-restauration (hôtels, bars, restaurants) qui met en relation, à l'échelle mondiale, des candidats (demandeurs d'emploi, freelances, extras) à la recherche d'opportunités et des entreprises souhaitant recruter rapidement et efficacement.

## Architecture

La solution est structurée en trois parties principales:

- **Backend**: API Node.js avec Express et MongoDB
- **Frontend**: Application React pour les candidats et recruteurs
- **Admin**: Backoffice React pour l'administration de la plateforme

## Prérequis

- Node.js (v16+)
- MongoDB (v5+)
- Docker et Docker Compose (pour déploiement conteneurisé)

## Installation et démarrage

### Avec Docker

1. Cloner le dépôt:
   ```bash
   git clone https://github.com/votreorganisation/hereoz.git
   cd hereoz
   ```

2. Copier le fichier d'environnement:
   ```bash
   cp .env.example .env
   ```

3. Modifier les variables d'environnement dans le fichier `.env`

4. Démarrer les conteneurs:
   ```bash
   docker-compose up -d
   ```

5. Accéder aux applications:
   - Frontend: http://localhost:3001
   - Admin: http://localhost:3002
   - API: http://localhost:3000
   - Documentation API: http://localhost:3000/api-docs

### Sans Docker (développement)

#### Backend

1. Installer les dépendances:
   ```bash
   cd backend
   npm install
   ```

2. Configurer les variables d'environnement:
   ```bash
   cp .env.example .env
   ```

3. Démarrer le serveur:
   ```bash
   npm run dev
   ```

#### Frontend

1. Installer les dépendances:
   ```bash
   cd frontend
   npm install
   ```

2. Configurer les variables d'environnement:
   ```bash
   cp .env.example .env
   ```

3. Démarrer l'application:
   ```bash
   npm start
   ```

#### Admin

1. Installer les dépendances:
   ```bash
   cd admin
   npm install
   ```

2. Configurer les variables d'environnement:
   ```bash
   cp .env.example .env
   ```

3. Démarrer l'application:
   ```bash
   npm start
   ```

## Documentation

La documentation de l'API est disponible aux formats suivants:

- **Swagger UI**: http://localhost:3000/api-docs
- **Documentation Web**: http://localhost:3000/documentation

## Fonctionnalités principales

### Module Candidat

- Création de profil avec importation CV et LinkedIn
- Validation d'expériences par des référents
- Gestion des disponibilités et localisation
- Système de matching et swipe d'offres
- Suivi des candidatures et entretiens

### Module Recruteur

- Création de profil entreprise
- Publication d'offres d'emploi
- Matching et filtrage des candidats
- Entretiens IA automatisés
- Tableau de bord et statistiques

### Module Admin

- Gestion des utilisateurs et entreprises
- Modération des contenus
- Suivi des paiements et abonnements
- Statistiques globales de la plateforme
