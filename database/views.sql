--% database/views.sql
--? Vues métier de la base de données minilib - PostgreSQL 18
-- Éxécuter avec psql -U minilib_user -d minilib -f database/views.sql

-- Les vues sont alignées avec les types attendus par le back-end - cf backend/types/ 


--! Vues de recherche adherents
--* Liste de tous les adhérents
CREATE OR REPLACE VIEW v_adherents AS
SELECT 
    id, 
    numero_adherent, 
    prenom, 
    nom, 
    email, 
    actif, 
    created_at
FROM adherents;


--! Vues de recherche livres
--* Liste de tous les livres
CREATE OR REPLACE VIEW v_livres AS
SELECT 
    id, 
    isbn, 
    titre, 
    auteur, 
    annee, 
    genre, 
    disponible
FROM livres;


--! Vues de recherche emprunts
--* Liste des emprunts en cours
CREATE OR REPLACE VIEW v_emprunts AS
SELECT 
    emprunts.id,                                
    livres.titre                                AS titre_livre, 
    adherents.prenom || ' ' || adherents.nom    AS nom_adherent,
    emprunts.date_retour_prevue,
    emprunts.date_retour_effective,                
    CURRENT_DATE > emprunts.date_retour_prevue  AS en_retard,
    CURRENT_DATE - emprunts.date_retour_prevue  AS jours_retard
FROM emprunts
JOIN livres         
    ON emprunts.livre_id = livres.id
JOIN adherents      
    ON emprunts.adherent_id = adherents.id