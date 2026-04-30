
# Variables d'environnements

## backend
```
#% backend/.env.example  -- variables d'environnement locales

# Application Server Node.ts / Express
PORT=5000
NODE_ENV=development

# Connexion PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=minilib_dev_db
DB_USER=postgres
DB_PASSWORD="votre_mot_de_passe_ici"
```

## frontend
```
#% backend/.env.example  -- variables d'environnement locales
#? Chargé par -mode 'example' => npm run dev{ VITE --mode example}

#? Préfixe VITE obligatoire -
#? voir documentation Vite https://vite.dev/guide/env-and-mode
# Application frontend React
VITE_PORT=3000
VITE_BASE_URL=https://localhost/
VITE_MODE=development

# Connexion API REST
VITE_API_URL=http://localhost:5000/api/v1


```