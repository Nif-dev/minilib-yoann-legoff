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

3-tiers MVC | API REST | Docker
▲
docker-compose.yml

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


## 👨‍💻 Auteur
Yoann Le Goff - Développeur Fullstack en formation CDA AFPA Brest
[LinkedIn](https://www.linkedin.com/in/yoann-le-goff-0129a0283/) | [Mon Portfolio](https://nif-dev.github.io/portfolio/)


## 📄 Licence
Ce projet est développé dans le cadre de ma formation CDA - usage pédagogique.