# Runbooks

Un runbook est un document procédural qui décrit pas à pas comment réagir à une situation donnée en production. C’est ce qui permet à un dev d’astreinte à 3h du matin de résoudre un incident sans avoir à réveiller un expert.

## Index des runbooks

- [Incident response](./incident-response.md) — gestion d’incident.
- [Database backup](./database-backup.md) — sauvegarde et restauration de la base.
- [Deployment rollback](./deployment-rollback.md) — retour arrière après déploiement.


## Quand un runbook est utile

- Procédure de déploiement manuel (en dehors du CI/CD automatique).
- Procédure de rollback en cas d’incident en prod.
- Réponse à un type d’incident récurrent (BDD pleine, pic de trafic, etc.).
- Restauration depuis backup.
- Onboarding d’un nouvel utilisateur sur un système complexe.
- Tâches manuelles trimestrielles (renouvellement certificats, etc.).


## Bonnes pratiques runbook
- Étapes numérotées avec checkboxes pour suivre la progression.
- Commandes copiables, exactes, testées au moins une fois.
- Lien vers les contacts d’escalade (avec numéros à jour).
- Tests de la procédure : faire tourner le runbook au moins une fois par trimestre, hors incident, pour valider qu’il fonctionne.
- Versionnage : git log montre l’évolution, mais une section "Historique" en fin de runbook aide à suivre les changements importants.
