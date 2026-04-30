# Conventions Git (branches, commits, PRs)

Ce document définit les **conventions Git** pour le projet : branches, commits, PRs, tags et workflow.  
Ces règles suivent **Conventional Commits** et **GitHub Flow** pour un historique propre, automatisable (CI/CD, changelog) [web:12].  
Elles facilitent les reviews et la collaboration en équipe.

## Table de référence

| Élément       | Convention                  | Exemple                          |
|---------------|-----------------------------|----------------------------------|
| Branches      | `type/description-courte`   | `feature/user-auth`              |
| Commits       | `type(scope): description`  | `feat(auth): add login flow`     |
| Tags          | `vMAJOR.MINOR.PATCH`        | `v1.2.3`                         |
| Pre-releases  | `vX.Y.Z-alpha.N`            | `v2.0.0-beta.1`                  |
| PRs           | `[Type] Description claire` | `[Feature] Add password reset`   |
| Issues        | `[Type] Description`        | `[Bug] Login fails on Safari`    |
| Workflow      | GitHub Flow                 | `main` + branches feature        |
| Format commits| Conventional Commits        | `@commitlint/config-conventional`|

## Types de commits

| Type   | Description                          | Exemple                  |
|--------|--------------------------------------|--------------------------|
| `feat` | Nouvelle fonctionnalité              | `feat(auth): add OAuth`  |
| `fix`  | Correction de bug                    | `fix(ui): fix button alignment` |
| `docs` | Documentation                        | `docs: update API reference` |
| `style`| Formatage, sans changement fonctionnel | `style: format imports` |
| `refactor`| Refactoring code                   | `refactor(auth): extract utils` |
| `test` | Ajout/modif tests                    | `test(api): add coverage` |
| `chore`| Tâches maintenance (CI, deps)        | `chore: update deps`     |

## Workflow : nouvelle feature

```bash
# 1. Récupérer la dernière version de main
git checkout main
git pull

# 2. Créer une branche feature avec un nom explicite
git checkout -b feature/add-loan-history

# 3. Développer en commits atomiques et conventionnels
git add src/services/loan-history.ts
git commit -m "feat(loans): add service to fetch loan history"

git add src/api/loan-routes.ts
git commit -m "feat(api): expose GET /loans/history endpoint"

git add src/api/__tests__/loan-routes.test.ts
git commit -m "test(api): cover loan history endpoint"

# 4. Mettre à jour avec main régulièrement (rebase)
git fetch origin
git rebase origin/main

# 5. Pousser la branche
git push origin feature/add-loan-history

# 6. Ouvrir une PR sur GitHub
#    Titre: [Feature] Add loan history endpoint
#    Description: pourquoi + comment tester + captures
#    Lier issue: Closes #42
```

**Après review et CI verte :**
- Merger via **squash** (1 commit propre par PR).
- Supprimer branches :
```bash
git checkout main
git pull
git branch -d feature/add-loan-history
git push origin --delete feature/add-loan-history
```

## Outils d'automatisation

- **Commitlint** : valide les commits (`npm run commit` ou husky).
- **GitHub Actions** : checks naming, changelog auto via semantic-release.
- **Changelog** : généré auto depuis commits → `CHANGELOG.md`.

## Bonnes pratiques

- **Commits atomiques** : 1 changement logique par commit.
- **Messages < 72 chars** : première ligne, puis détail si besoin.
- **Rebase avant push** : historique linéaire (pas de merge commits).
- **PR templates** : voir `.github/PULL_REQUEST_TEMPLATE.md`.
- **Hotfix** : branche `hotfix/urgent-bug-42`.

## Modèle PR (Pull Request)

Copiez ce template dans **toutes vos PRs** pour standardiser les reviews :

```markdown
**[Feature/Bug/Refactor/Docs] Titre clair et concis**

### Pourquoi ?  
*(Contexte métier, issue résolue, bénéfice utilisateur)*  
- Résout #42  
- Améliore UX login (temps de chargement -30%)  
- Conformité RGPD  

### Comment tester ?  
*(Étapes précises de validation)*  
1. `npm run dev`  
2. Aller sur `/login`  
3. Cliquer "Mot de passe oublié"  
4. Vérifier email envoyé  

### Captures avant/après  
*(Screenshots, GIFs, vidéos)*  
**Avant :** ![before]  
**Après :** ![after]  

### Checklist  
- [ ] Tests unitaires ajoutés  
- [ ] Tests e2e mis à jour  
- [ ] Documentation modifiée  
- [ ] Lint & Prettier OK  
- [ ] CI passe au vert  

### Notes pour reviewer  
*(Points sensibles, décisions à valider)*  
- Le middleware `authMiddleware` a été déplacé vers `src/middlewares/`  
```

## Version courte (hotfix urgent)

```markdown
**[Hotfix] Titre**  
**Résout :** #123  
**Test :** `npm run test:api` + `/login` sur Safari  
**Checklist :**  
- [x] Tests  
- [x] CI  
```

**Respectez ces règles partout !** Violations → auto-rejet CI.  
Pour déroger : justification dans PR + approbation maintainer.