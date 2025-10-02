# Jurijob Backend API

API backend pour la plateforme Jurijob - Solution de gestion d'offres d'emploi et de candidatures.

## Description

Cette API REST fournit les services backend pour la plateforme Jurijob, permettant la gestion des offres d'emploi, des candidatures et des profils utilisateurs.

## Technologies

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Gestionnaire de paquets**: pnpm
- **Conteneurisation**: Docker

## Installation

### Prérequis
- Node.js 20+ 
- pnpm
- Docker (optionnel)

### Installation locale

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd jurijob_backend
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configuration environnement**
   ```bash
   cp .env.example .env
   # Configurer les variables d'environnement
   ```

4. **Démarrer en développement**
   ```bash
   pnpm dev
   ```

5. **Démarrer en production**
   ```bash
   pnpm start
   ```

## 🐳 Docker

### Construire l'image Docker

```bash
# Construire l'image
docker build -t jurijob-backend .

# Exécuter le conteneur
docker run -p 3000:3000 jurijob-backend
```

### Avec Docker Compose (recommandé)

```bash
# Démarrer tous les services
docker-compose up -d

# Construire et démarrer
docker-compose up --build
```

## 📚 Scripts disponibles

| Script | Description |
|--------|-------------|
| `pnpm dev` | Démarrage en mode développement avec nodemon |
| `pnpm start` | Démarrage en mode production |