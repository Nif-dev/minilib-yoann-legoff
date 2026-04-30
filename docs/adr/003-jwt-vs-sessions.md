# ADR 0003 — Authentification par sessions plutôt que JWT
 
## Statut
 
Accepté — 2025-04-12
 
## Contexte
 
MiniLib a besoin d'un mécanisme d'authentification pour son interface web.
L'application est :
 
- Utilisée en interne par 3 bibliothécaires
- Accessible uniquement depuis le navigateur (pas d'app mobile prévue)
- Backend Node.js + Express, frontend React
- Pas d'architecture microservices, un seul backend
 
L'équipe doit choisir entre sessions côté serveur (avec cookie HTTPOnly)
et JWT.
 
## Décision
 
Utiliser des sessions côté serveur stockées en mémoire (express-session
avec connect-redis pour la persistance), authentifiées via cookie
HTTPOnly Secure SameSite=Strict.
 
## Alternatives considérées
 
### JWT (rejetée)
 
**Pour** :
- Stateless, pas de session côté serveur à gérer
- Standard moderne, populaire dans les API publiques
 
**Contre** :
- Révocation immédiate impossible nativement
- Stockage côté client : localStorage vulnérable XSS, cookie moins idéal qu'avec session
- Surcoût de complexité (refresh tokens, rotation)
- Pas de bénéfice réel dans notre contexte (un seul backend, pas de microservices)
 
### Sessions (retenue)
 
**Pour** :
- Plus simple à implémenter et à débugger
- Révocation immédiate (suppression de la session côté serveur)
- Cookie HTTPOnly = protection XSS native
- Largement éprouvé, peu de risques de mauvaise implémentation
 
**Contre** :
- Stateful (mais Redis gère ça facilement)
- Moins "moderne" en apparence
 
## Conséquences
 
### Positives
 
- Implémentation rapide (express-session est mature)
- Sécurité accrue (cookie HTTPOnly)
- Révocation immédiate possible (logout, ban utilisateur)
 
### Négatives
 
- Si on ajoute une app mobile native, il faudra réévaluer (passage à JWT
  potentiel, ou Bearer auth pour mobile uniquement)
- Dépendance à Redis pour la persistance des sessions
 
## Références
 
- [OWASP Session Management Cheat Sheet](https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html)
- ADR-0001 (PostgreSQL choisi comme BDD)
- Discussion en COPROJ du 2025-04-10
