# Conventions de nommage

Ce document centralise **toutes les conventions de nommage** du projet.  
Il garantit la cohérence entre frontend (React/TS), backend (Node.js/TS), base de données (PostgreSQL), Docker et outils associés.  
Respectez ces règles partout pour faciliter la maintenance et la collaboration [web:12][web:15].

## Pourquoi ces conventions ?

- **Cohérence** : un style par contexte, adapté aux langages et outils standards.
- **Lisibilité** : éviter les ambiguïtés (ex: `user_id` vs `id`).
- **Outils** : compatibilité Prisma, Docker, GitHub Actions, etc.
- **Évolutivité** : prêt pour microservices ou refactoring.

## Table de référence

| Contexte                      | Convention          | Exemple                     |
|-------------------------------|---------------------|-----------------------------|
| Fichiers et dossiers          | `kebab-case`        | `user-profile.tsx`          |
| Variables/fonctions JS, TS, Java, C# | `camelCase`     | `getUserById`               |
| Variables/fonctions Python, Ruby, Rust | `snake_case` | `get_user_by_id`            |
| Classes, types, interfaces    | `PascalCase`        | `UserController`, `ApiResponse` |
| Constantes globales           | `UPPER_SNAKE_CASE`  | `MAX_RETRY_COUNT`           |
| Variables d’environnement    | `UPPER_SNAKE_CASE`  | `DATABASE_URL`              |
| Classes et IDs CSS            | `kebab-case`        | `.user-profile-card`        |
| Composants frontend (nom)     | `PascalCase`        | `UserProfile`               |
| Composants frontend (fichier) | `kebab-case`        | `user-profile.tsx`          |
| Hooks React, composables Vue  | `camelCase` + `use` | `useUserData`               |
| Tables BDD                    | `snake_case` pluriel| `users`, `order_items`      |
| Colonnes BDD                  | `snake_case`        | `created_at`, `user_id`     |
| URLs REST                     | `kebab-case` pluriel| `/api/v1/users/42/orders`   |
| Réponses JSON                 | `snake_case` OU `camelCase` (cohérent) | `"created_at"` / `"createdAt"` |
| Middlewares                   | `camelCase` + `Middleware` | `authMiddleware`      |
| Schémas validation            | `camelCase` + `Schema` | `createUserSchema`       |
| Événements custom             | `UPPER_SNAKE_CASE`  | `USER_CREATED`              |
| Jobs / Queues                 | `camelCase` + `Job/Queue` | `sendEmailJob`, `emailQueue` |
| Microservices, containers     | `kebab-case`        | `user-service`, `minilib-backend` |
| Assets                        | `kebab-case` + préfixe | `icon-home.svg`, `logo-dark.png` |
| Configuration                 | `kebab-case`        | `docker-compose.yml`        |
| Logs                          | `kebab-case` + date | `app-2025-04-28.log`        |
| Fichiers i18n                 | codes ISO           | `en.json`, `fr.json`, `zh-CN.json` |
| Clés i18n                     | `dot.notation`      | `pages.home.title`          |
| Métriques Prometheus          | `snake_case` + suffixe | `http_requests_total`    |
| Tests (fichiers)              | `.test.ts` ou `_test.py` | `user-service.test.ts` |
| Tests (descriptions)          | phrase descriptive  | `"should return null when id does not exist"` |
| Documentation                 | `kebab-case`        | `installation-guide.md`     |

## Règles supplémentaires

- **Préfixes/suffixes obligatoires** : `user_id` (pas `id`), `created_at` (pas `date`).
- **Pluriel pour tables** : `users` (pas `user`) [web:14][web:17].
- **JSON** : choisissez **un seul style** pour tout le projet (recommandé : `snake_case` pour cohérence BDD).
- **Exceptions** : autorisées uniquement via [ADR](../adr/README.md) avec justification.

## Vérification automatique

- **ESLint/Prettier** : config pour JS/TS/React.
- **SQL linter** (pgfmt ou sql-lint) pour BDD.
- **GitHub Actions** : checks naming dans CI/CD.

## Liens utiles

- [ESLint rules naming](https://eslint.org/docs/rules/camelcase)
- [Prisma naming conventions](https://www.prisma.io/docs/concepts/components/prisma-schema/naming)
- [Docker naming best practices](https://docs.docker.com/reference/cli/docker/image/tag/)

**Épinglez cette table dans vos partages de projet !**  
Pour toute question ou proposition de changement : ouvrir une [issue](../issues/new).