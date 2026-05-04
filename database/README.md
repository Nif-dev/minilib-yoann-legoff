# 🗄️ Database - MiniLib PostgreSQL

**Schéma robuste avec triggers métier** garantissant l'intégrité des règles métier **directement en base**.

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.3-336791)](https://postgresql.org)

## 📚 Table `livres`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique auto-incrémenté |
| `isbn` | VARCHAR(13) | **UNIQUE NOT NULL** | Code ISBN du livre |
| `titre` | VARCHAR(255) | NOT NULL | Titre du livre |
| `auteur` | VARCHAR(255) | NOT NULL | Nom de l'auteur |
| `annee` | INTEGER | CHECK `annee > 0 AND annee <= EXTRACT(YEAR FROM CURRENT_DATE)` | Année de publication |
| `genre` | VARCHAR(50) | DEFAULT 'Inconnu' | Genre littéraire |
| **`disponible`** | BOOLEAN | DEFAULT **TRUE** | **TRUE** = disponible pour emprunt |

**Index** : `titre`, `auteur`, `isbn`

## 👥 Table `adherents`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique auto-incrémenté |
| `numero_adherent` | VARCHAR(20) | **UNIQUE NOT NULL** | Numéro d'adhérent unique (ADH-001, ...) |
| `nom` | VARCHAR(100) | NOT NULL | Nom de famille |
| `prenom` | VARCHAR(100) | NOT NULL | Prénom |
| `email` | VARCHAR(255) | **UNIQUE NOT NULL** | Email de contact |
| `actif` | BOOLEAN | DEFAULT **TRUE** | Statut actif/inactif |

**Index** : `email`, `numero_adherent`

## 📋 Table `emprunts`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique auto-incrémenté |
| `livre_id` | INTEGER | **FOREIGN KEY** `livres(id) ON DELETE SET NULL` | Référence au livre emprunté |
| `adherent_id` | INTEGER | **FOREIGN KEY** `adherents(id) ON DELETE SET NULL` | Référence à l'adhérent |
| **`date_emprunt`** | DATE | **NOT NULL DEFAULT CURRENT_DATE** | Date de début d'emprunt |
| **`date_retour_prevue`** | DATE | **NOT NULL** CHECK `>= date_emprunt` | Date limite de retour (+14 jours) |
| **`date_retour_effective`** | DATE | DEFAULT NULL | Date réel de retour (NULL = en cours) |

**Index** : `adherent_id` (actifs seulement), `(livre_id, date_retour_effective)`

## 🎯 Règles métier - Implémentation

| Règle métier | Implémentation |
|--------------|----------------|
| **Max 3 emprunts actifs/adhérent** | `trigger` → `fonction spécifique` |
| **Livre déjà emprunté → bloqué** | `trigger` → `fonction spécifique` |
| **Durée emprunt = 14 jours** | **Par défaut** `date_retour_prevue = date_emprunt + INTERVAL '14 days'` |
| **Retour enregistré → livre disponible** | `trigger` → `fonction spécifique` |

## 🔧 Vues métier utiles

À implémenter

## 🚀 Installation

```bash
cd database/        # Se positionner sur le dossier database/
psql -U minilib_user -d minilib -f schema.sql      # Tables + contraintes basiques
psql -U minilib_user -d minilib -f constraints.sql  # Triggers métiers
```

**Auteur** : Yoann Le Goff