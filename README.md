# MiniLib - Gestion de bibliothèque

Application web complète de gestion de bibliothèque municipale, développée en full-stack en amont de ma formation Développeur Fullstack (CDA) AFPA Brest.

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-24-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2-orange)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.3-purple)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose)


## 🎯 Contexte métier

Application développée pour la gestion d'une bibliothèque, notamment sur la partie emprunt de livres.
Centralise la gestion des **livres**, **adhérents** et **emprunts** avec suivi des retards.

**Fonctionnalités principales :**
- Catalogue livres (CRUD + recherche/filtres)
- Gestion adhérents (CRUD + historique emprunts)
- Emprunts/retours avec règles métier (max 3 livres/adhérent,sur 14 jours)
- Indicateur visuel des retards
- Interface responsive React

## 🏗️ Architecture technique

```
3-tiers MVC | Front React 18 | API REST Express | PostgreSQL 15 | Docker
         ↓
[React UI] → [Node/Express] → [PostgreSQL + Triggers métier]
```


## 📁 Structure du projet

**minilib**/
│ 
├── **frontend**/ # React 18
│ 
├── **backend**/ # Node.js / Express
│ 
├── **database**/ # PostgreSQL
│ 
├── docker-compose.yml
│ 
├── .env.example
│ 
└── README.md


## ⚙️ Installation manuel
Depuis le terminal

1. **Cloner le dépôt**
    ```
    git clone https://github.com/Nif-dev/minilib-yoann-legoff.git
    cd minilib
    ```

2. **Database (PostgreSQL 18)**
    ```
    psql -U minilib_user -d minilib -f database/schema.sql
    psql -U minilib_user -d minilib -f database/constraints.sql
    ```


3. **Backend (Node.js/Express)** 
    ``` 
    cd backend
    npm install
    npm run dev
    ```


3. **Frontend (React.ts)** 
    ``` 
    cd frontend
    npm install
    npm run dev
    ```

## 📚 API REST - Aperçu

**Préfixe** : `/api/v1`

| Domaine | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| **Livres** | `/livres`<br>`/recherche?q=...` | `/livres` | `/livres/:id` | `/livres/:id` |
| **Adhérents** | `/adherents`<br>`/adherents/:id` | `/adherents` | `/adherents/:id` | `/adherents/:id` (inactif) |
| **Emprunts** | `/emprunts/adherent/:id` | `/emprunts` | `/emprunts/:id/retour` | - |

**Validation** : Schémas DTO et validations côté serveur + **triggers DB** (double garde-fou)

## 👨‍💻 Auteur
**Yoann Le Goff - Développeur Fullstack** en formation CDA AFPA Brest
## [🔗 LinkedIn](https://www.linkedin.com/in/yoann-le-goff-0129a0283/) - - - [ 💻 Mon Portfolio](https://nif-dev.github.io/portfolio/)


## 📄 Licence
Ce projet est développé dans le cadre de ma formation CDA - usage pédagogique.