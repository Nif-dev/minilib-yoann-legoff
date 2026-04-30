# ADR 0001 — PostgreSQL plutôt que MongoDB

## Statut

Accepté — 2025-03-15 

## Contexte

MiniLib gère un catalogue de livres, prêts, utilisateurs et historiques.  
L'application est :  
- Monolithique (un seul backend Node.js/Express)  
- Relations complexes : `users` → `loans` → `books` → `categories`  
- Requêtes analytiques : rapports prêts/mois, top livres, etc.  
- 3 utilisateurs internes, croissance modérée attendue  
- Équipe junior → **apprentissage SQL natif prioritaire**  

Choisir entre SQL relationnel (PostgreSQL) et NoSQL document (MongoDB).

## Décision

**PostgreSQL natif** avec `pg` (requêtes préparées `?` placeholders) et migrations SQL manuelles.  
Pas d'ORM → maîtrise totale SQL, triggers, fonctions stockées modernes.

## Alternatives considérées

### MongoDB (rejetée)

**Pour :**  
- Schéma flexible  
- Échelle horizontale  
- JSON natif  

**Contre :**  
- Joins manuels lents 
- Pas d'apprentissage SQL structuré  
- Surkill pour relations fixes  

### PostgreSQL natif (retenue)

**Pour :**  
- **Pédagogie** : maîtrise SQL pur → compétences transférables partout  
- **Fonctions modernes** : JSONB, window functions, CTE, triggers avancés 
- Relations performantes (JOINs)  
- ACID pour transactions critiques (prêts)  
- Écosystème gratuit, mature  

**Contre :**  
- Écriture SQL manuelle (mais pgAdmin/pgModeler aide)  
- Migrations à gérer (flyway ou scripts)  



## Conséquences

### Positives  
- **Apprentissage** : équipe comprend vraiment les queries (EXPLAIN ANALYZE)  
- **Performance** : requêtes préparées = zéro injection SQL  
- **Puissance** : triggers auto (ex: `update_last_loan_date()`), vues matérialisées  
- **Outils** : pgAdmin, DBeaver, `psql` CLI  

### Négatives  
- Pas de types TS auto (mais docs + pgModeler génèrent schémas)  
- Plus verbeux que Prisma  

## Références  
- [PostgreSQL vs MongoDB](https://www.mongodb.com/resources/compare/mongodb-postgresql) 
- [Prepared statements Node.js pg](https://node-postgres.com/features/queries#prepared-statements)  
- Discussion équipe 2025-03-14