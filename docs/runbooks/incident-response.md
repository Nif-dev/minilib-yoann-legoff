# Runbook — Rollback en cas d'incident en production
 
## Contexte d'utilisation
 
Ce runbook s'applique quand une nouvelle version déployée en production
cause un dysfonctionnement majeur (S1 ou S2) et qu'un retour à la
version précédente est nécessaire.
 
## Préalables
 
- [ ] Confirmer qu'un rollback est nécessaire (pas un simple bug à patcher)
- [ ] Avoir les accès SSH au serveur de production
- [ ] Avoir les credentials AWS (si rollback infrastructure)
- [ ] Prévenir l'équipe via #incidents-prod
 
## Procédure
 
### 1. Identifier la version cible
 
```bash
git fetch --tags
git tag --list --sort=-v:refname | head -5
# Choisir le dernier tag stable précédent (ex: v1.2.5)
```
 
### 2. Déclencher le rollback applicatif
 
```bash
# Via GitHub Actions
gh workflow run rollback.yml -f version=v1.2.5
 
# OU manuellement en SSH
ssh deploy@prod.minilib.fr
cd /opt/minilib
docker compose pull && docker compose up -d
```
 
### 3. Vérifier la santé du système
 
```bash
curl https://app.minilib.fr/health
# Réponse attendue : { "status": "ok", "version": "1.2.5" }
```
 
Vérifications :
 
- [ ] Health endpoint répond 200
- [ ] Connexion utilisateur fonctionne
- [ ] Lecture du catalogue fonctionne
- [ ] Création d'emprunt fonctionne
 
### 4. Si la BDD nécessite un rollback de migration
 
```bash
# ATTENTION — peut entraîner perte de données récentes
ssh deploy@prod.minilib.fr
cd /opt/minilib
docker compose exec backend npm run db:migrate:undo
```
 
### 5. Communiquer
 
- [ ] Message dans #incidents-prod : "Rollback effectué vers v1.2.5"
- [ ] Mail aux stakeholders (template dans templates/incident-resolved.md)
- [ ] Mise à jour du status page
 
### 6. Post-incident
 
- [ ] Créer une issue post-mortem dans les 24h
- [ ] Identifier la cause racine du problème
- [ ] Planifier la nouvelle tentative avec correctif
 
## Escalade
 
Si le rollback échoue ou pose des problèmes :
 
1. Contacter Bob Dupont (Lead Backend) — +33 X XX XX XX XX
2. Si indisponible, contacter Alice Martin — +33 X XX XX XX XX
3. En dernier recours, contacter le directeur technique
 
## Historique
 
| Date       | Auteur | Modification                    |
|------------|--------|---------------------------------|
| 2025-04-12 | Bob    | Création initiale               |
| 2025-04-22 | Alice  | Ajout étape rollback BDD        |
| 2025-04-28 | Bob    | Ajout vérifications post-rollback |
