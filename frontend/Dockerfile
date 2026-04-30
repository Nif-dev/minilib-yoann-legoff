# % frontend/Dockerfile
# ? Dockerfile frontend de MiniLib

# ! Stage 1 : Compilation du projet React TS
FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# En production Docker, Nginx proxy /api/ → backend:5000
# Récupération des variables d'environnement
# ENV VITE_API_URL=

# Compilation -> génération des fichiers JS dans ./dist/
RUN npm run build


# ! Stage 2 : Service de prodution Nginx ( image finale )
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# USER nginx

EXPOSE 81


CMD [ "nginx", "-g", "daemon off;" ]