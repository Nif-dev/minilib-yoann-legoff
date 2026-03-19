# MiniLib - Gestion de bibliothèque

Application web complète de gestion de bibliothèque municipale, développée en full-stack en amont de ma formation Développeur Fullstack (CDA) AFPA Brest.

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-orange)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-purple)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose)

## 🎯 Contexte métier

Application développée pour la gestion d'une bibliothèque, notamment sur la partie emprunt de livres.
Centralise la gestion des **livres**, **adhérents** et **emprunts** avec suivi des retards.

**Fonctionnalités principales :**
- Catalogue livres (CRUD + recherche/filtres)
- Gestion adhérents (CRUD + historique emprunts)
- Emprunts/retours avec règles métier (max 3livres/adhérent,sur 14 jours)
- Indicateur visuel des retards
- Interface responsive React

## 🏗️ Architecture technique

3-tiers MVC | Front React | API REST | DB PostGreSQL | Docker


## 📁 Structure du projet

**minilib**/

├── **frontend**/ # React 18

│ ├── **src**/

│ │ ├── **components**/ # BookCard, MemberCard, Modal...

│ │ ├── **pages**/ # Books, Members, Loans...

│ │ └── **services**/ # api.js, bookService.js

├── **backend**/ # Node.js / Express

│ ├── **src**/

│ │ ├── **controllers**/ # bookController.js

│ │ ├── **routes**/ # bookRoutes.js

│ │ ├── **models**/ # book.js

│ │ └── **middleware**/

├── **database**/ # PostgreSQL

│ ├── schema.sql

│ └── seed.sql

├── docker-compose.yml

├── .env.example

└── README.md

## ⚙️ Installation
Depuis le terminal  

1. **Cloner le dépôt**
   ```
   git clone https://github.com/Nif-dev/minilib-yoann-legoff.git
   cd minilib
    ```
2. **Backend (Node.js/Express)** 
    ``` 
    cd backend
    npm install
    npm run dev
    ```

## 📚 Routes API – Livres

**Toutes les routes de l’API Livres sont préfixées par `/api/v1/livres`**.  

### Catalogue principal

- **GET /**  
  Récupère **tous les livres**, avec filtres optionnels via query params (`genre`, `disponible`, etc.).  
  Exemple :  
  `GET /api/v1/livres?genre=Roman&disponible=true`

- **GET /:id**  
  Récupère les **détails d’un livre** par son identifiant.

### Création / modification

- **POST /**  
  Crée un **nouveau livre** (données en JSON dans le corps de la requête).

- **PUT /:id**  
  Met à jour un livre existant (id en param, données en JSON dans le body).

### Suppression

- **DELETE /:id**  
  Supprime un livre par son identifiant.

### Recherche dédiée

- **GET /recherche?q=...**  
  Recherche des livres par **titre ou auteur** (query `q` obligatoire).  
  Filtres optionnels :  
  - `genre` (chaîne)  
  - `disponible` (boolean, `true`/`false`)  
  Exemple :  
  `GET /api/v1/livres/recherche?q=heros&genre=Fantasy&disponible=true`



## 👨‍💻 Auteur
**Yoann Le Goff - Développeur Fullstack** en formation CDA AFPA Brest
## [🔗 LinkedIn](https://www.linkedin.com/in/yoann-le-goff-0129a0283/) - - - [ 💻 Mon Portfolio](https://nif-dev.github.io/portfolio/)


## 📄 Licence
Ce projet est développé dans le cadre de ma formation CDA - usage pédagogique.