# Infrastructure Docker — MiniLib

## Vue d'ensemble

L'application est composée de 3 containers qui communiquent sur le réseau interne Docker :

```
Navigateur
  └─> localhost:3000
        └─> [frontend] Nginx :80
              ├─> fichiers statiques React (/, /livres, /adherents...)
              └─> /api/* → proxy → [backend] Express :5000
                                          └─> [db] PostgreSQL :5432
```

Le navigateur ne parle qu'à Nginx. Le backend et la base de données ne sont jamais exposés directement au navigateur.

---

## docker-compose.yml

Orchestre les 3 services et leurs relations.

### Service `db`
- Image officielle `postgres:18`, aucun build nécessaire.
- Les credentials (`DB_NAME`, `DB_USER`, `DB_PASSWORD`) sont lus depuis un fichier `.env` local via `${VAR}`.
- **Volume nommé** `postgres_data` : les données survivent aux `docker compose down` (supprimées seulement avec `docker compose down -v`).
- **Scripts d'init** : au premier démarrage, Postgres exécute automatiquement les fichiers montés dans `/docker-entrypoint-initdb.d/` par ordre alphabétique — ici `01-schema.sql` puis `02-seed.sql`.
- Port `5433:5432` : le 5432 local est déjà pris, on mappe sur 5433 pour pouvoir se connecter depuis l'hôte si besoin.

### Service `backend`
- Construit depuis `./backend/Dockerfile`.
- Reçoit les variables de connexion à la base (`DB_HOST: db` → nom du service Docker, résolu automatiquement sur le réseau interne).
- `depends_on: db` : Docker démarre `db` avant `backend` (mais n'attend pas que Postgres soit prêt à accepter des connexions).
- Port `5000:5000` exposé sur l'hôte (utile pour tester l'API directement avec Postman/curl).

### Service `frontend`
- Construit depuis `./frontend/Dockerfile`.
- Port `3000:80` : Nginx écoute sur le port 80 du container, accessible via `localhost:3000` sur l'hôte.
- `depends_on: backend` : démarré après le backend.
- Aucune variable d'environnement runtime — les variables Vite sont injectées au moment du build (voir Dockerfile frontend).

---

## backend/Dockerfile — Multi-stage build

### Stage 1 : `builder`
```
FROM node:24-alpine AS builder
```
- Installe **toutes** les dépendances (`npm ci`) y compris les `devDependencies` (TypeScript, types...).
- Compile le TypeScript : `tsc` lit `tsconfig.json` et génère `dist/`.

### Stage 2 : image finale
```
FROM node:24-alpine
```
- Repart d'une image vierge — les sources `.ts` et les `devDependencies` sont abandonnés.
- N'installe que les dépendances de production (`npm ci --only=production`).
- Récupère uniquement `dist/` depuis le stage `builder`.
- Lance le JS compilé directement : `node dist/app.js`.

**Résultat :** image finale légère, sans TypeScript ni code source.

---

## frontend/Dockerfile — Multi-stage build

### Stage 1 : `builder`
```
FROM node:24-alpine AS builder
```
- `COPY package*.json ./` puis `npm ci` en premier : Docker met ce calque en cache tant que les dépendances ne changent pas.
- `ENV VITE_API_URL=/api/v1` : Vite embarque cette valeur **dans le bundle JS** au moment de `npm run build`. En production, le navigateur appellera `/api/v1/...` — chemin relatif que Nginx proxifie vers le backend.
- `npm run build` génère le dossier `dist/`.

### Stage 2 : Nginx
```
FROM nginx:stable-alpine
```
- Copie uniquement `dist/` dans le dossier servi par Nginx.
- Remplace la config Nginx par défaut par `nginx.conf`.

---

## frontend/nginx.conf

Nginx a deux rôles dans ce projet.

### Servir la SPA React
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
React Router gère la navigation côté client. Sans cette règle, un accès direct à `/livres` retournerait une 404 Nginx. `try_files` cherche d'abord le fichier statique, sinon renvoie toujours `index.html` pour que React Router prenne le relais.

### Proxifier les appels API
```nginx
location /api/ {
  proxy_pass http://backend:5000;
}
```
Toute requête vers `/api/...` est transmise au container `backend` sur le réseau Docker. `backend` est résolu par le DNS interne de Docker Compose (nom du service). Le navigateur ne connaît jamais l'adresse du backend directement.
