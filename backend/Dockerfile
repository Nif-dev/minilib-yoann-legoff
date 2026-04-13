#% backend/Dockerfile
#? Dockerfile pour le backend de MiniLib

# Partant d'une image Node complète pour compiler le TypeScript
# ? image non final, elle build l'app, et l'image finale sera basé dessus
FROM node:24-alpine AS builder

# Création du dossier de travail dans le conteneur (l'image plutot)
WORKDIR /app

# Copie du package.json et package-lock.json - cache Docker
COPY package*.json ./
# si les fichiers sont inchangés, npm ci ne sera pas lancé, contrairement à npm install, qui peut ajuster package-lock si besoin, donc plus de temps de compilation

# Installation des packages / dépendances ( y compris devDependencies - TS )
# ci = Clean Install
RUN npm ci

# Copie des sources TS + config compilateur typescript
COPY src/ ./src/
COPY tsconfig.json ./
# Copie de l'openapi - documentation swagger yaml
COPY openapi.yaml ./


# Compilation -> génération des fichiers JS dans ./dist/
RUN npm run build


# Nouvelle image vierge : partant d'une autre base alpine, sans les devDependencies, les sources - uniquement le JS de prod
FROM node:24-alpine

# Création du dossier de travail dans l'image finale
WORKDIR /app

# Copie du package.json et package-lock.json - cache Docker
COPY package*.json ./

#  Cette fois on installe uniquement les dependencies ( pas dev ) comme express cors, pg ...
# TS, tsx, @types/* ne seront pas dans cette image finale- plus légères
RUN npm ci --only=production
# ?  --only=production ignore devDependencies, merci NODE

#  Copie des sources JS compilé dans ./dist/ de l'image builder
COPY --from=builder /app/dist/ ./dist/
# Copie de l'openapi - documentation swagger yaml
COPY --from=builder /app/openapi.yaml ./openapi.yaml

# Exposition du port 5000
EXPOSE 5000

# Commande de lancement de l'app, avec Node sur le fichier JS compilé
CMD ["node", "dist/app.js"]