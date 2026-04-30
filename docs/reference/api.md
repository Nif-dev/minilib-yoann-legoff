# endpoints-list.md

## 📚 Routes API - Livres `/api/v1/livres`

| Méthode | Route | Description | Params |
|---------|-------|-------------|--------|
| GET | `/` | Tous livres | `?genre=Roman` |
| GET | `/:id` | Détail | `id` |
| POST | `/` | Créer | JSON body |
| PUT | `/:id` | Modifier | `id` + JSON |
| DELETE | `/:id` | Supprimer | `id` |
| GET | `/recherche?q=...` | Recherche | `q=code&genre=Informatique` |

## 👥 Routes API - Adhérents `/api/v1/adherents`

| Méthode | Route | Description | Params |
|---------|-------|-------------|--------|
| GET | `/` | Tous actifs | - |
| GET | `/:id` | Détail | `id` |
| POST | `/` | Créer | JSON |
| PUT | `/:id` | Modifier | `id` + JSON |
| DELETE | `/:id` | **Rendre inactif** | `id` |

## 📋 Routes API - Emprunts `/api/v1/emprunts`

| Méthode | Route | Description | Params |
|---------|-------|-------------|--------|
| GET | `/` | Tous | `?adherent_id=1` |
| GET | `/:id` | Détail | `id` |
| POST | `/` | Nouvel emprunt | `{livre_id, adherent_id}` |
| PUT | `/:id/retour` | Enregistrer retour | `id` |
| DELETE | `/:id` | Annuler | `id` |