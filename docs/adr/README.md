# Architecture Decision Records (ADR)

Un ADR est un fichier court (1-2 pages) qui documente une décision architecturale prise par l’équipe. Format proposé par Michael Nygard en 2011, devenu standard. C’est l’outil le plus efficace pour conserver la mémoire des décisions techniques d’un projet.

## Index des ADR : 

- 
- 
- **[ADR003](./003-jwt-vs-sessions.md)** : choix serverless ou JWT pour authentification



## Pourquoi des ADR
- Capturer le pourquoi d’un choix au moment où on le fait — la mémoire humaine est volatile.
- Permettre aux nouveaux arrivants de comprendre l’historique technique du projet.
- Éviter de redébattre les mêmes choix chaque trimestre.
- Justifier les décisions face à un audit ou une recette client.
- Identifier les choix qui peuvent être remis en question quand le contexte change.

## Statut d'un ADR 


| Statut        | Signification                      |
|---------------|------------------------------------|
| Proposed      | En discussion, pas encore adopté.  |
| Accepted      | Décision prise et appliquée.       |
| Rejected      | Proposition rejetée — gardée pour mémoire.  |
| Deprecated      | Décision encore en place mais qui sera retirée.  |
| Superseded by ADR-XXXX     | DRemplacée par une nouvelle décision. Ne JAMAIS supprimer un ADR.  |

La règle de l’ADR — ne jamais supprimer
Un ADR rejeté reste dans le repo : il documente une réflexion utile.
Un ADR remplacé par un autre reste aussi : on met son statut en "Superseded by ADR-NNNN".
Cela permet de retracer pourquoi le projet a évolué dans une direction.
C’est aussi très précieux en audit — montre la rigueur de la gouvernance technique.


## Outils

adr-manager (web)
Interface web pour créer des ADR
En ligne

https://adr.github.io/adr-manager/#/