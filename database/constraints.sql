--% database/constraints.sql
--? Contraintes métiers de la base de données minilib - PostgreSQL 18
-- Éxécuter avec psql -U minilib_user -d minilib -f database/constraints.sql

--* Un adhérent ne peut pas emprunter plus de 3 livres en simultané
-- Fonction de vérification de la contrainte
CREATE OR REPLACE FUNCTION fn_check_max_emprunts_par_adherent()
RETURNS TRIGGER AS $$
    DECLARE 
        -- Nombre maximum de livres empruntables par adhérent
        max_emprunts CONSTANT INT := 3; 
        -- Nombre de livres empruntés par adhérent actuellement
        nb_emprunts_actifs INT; 

    BEGIN
        -- Compte les emprunts pour l'adhérent de la ligne NEW
        --? NEW est une variable automatique de type RECORD, contient la ligne en cours de modification ( INSERT ou UPDATE par exemple )
        SELECT COUNT(*) INTO nb_emprunts_actifs
        FROM emprunts
        WHERE adherent_id = NEW.adherent_id 
            AND date_retour_effective IS NULL;

        -- Si, avec la nouvelle ligne on dépasse la limite de 3 emprunts en cours
        IF (nb_emprunts_actifs >= max_emprunts) 
        THEN
            RAISE EXCEPTION
                'Adhérent ID % : limite de % emprunts en cours atteinte.',
                NEW.adherent_id,
                max_emprunts;
        END IF;

        RETURN NEW;
    END;
$$ --? $$ sert ici de delimiter pour la function un peu comme { } mais avec une chaine de caractères : ici une procédure plpgsql
-- indique langage procédural pl pour pgsql, et non SQL pur
LANGUAGE plpgsql; 

-- Trigger qui vérifie la limite de 3 emprunts en cours avant insert/maj
DROP TRIGGER IF EXISTS trigger_limit_emprunts_par_adherent ON emprunts;
CREATE TRIGGER trigger_limit_emprunts_par_adherent
    BEFORE INSERT ON emprunts
    FOR EACH ROW
    EXECUTE FUNCTION fn_check_max_emprunts_par_adherent();

--* un livre devient indisponible si emprunté
--* un livre indisponible ne peut pas être emprunté
-- Fonction de vérification de la contrainte
CREATE OR REPLACE FUNCTION fn_check_et_set_livre_indisponible()
RETURNS TRIGGER AS $$
    DECLARE
        -- Statut de disponibilité du livre
        livre_disponible BOOLEAN;
    BEGIN
        -- Récupère le statut de disponibilité du livre
        SELECT disponible INTO livre_disponible
        FROM livres
        WHERE id = NEW.livre_id;
        -- Si le livre est indisponible
        IF (livre_disponible = false) 
        THEN
            RAISE EXCEPTION
                'Livre ID % : indisponible.',
                NEW.livre_id;
        END IF;
        -- Si disponible, met le livre en indisponible pour emprunt
        IF (livre_disponible = true) 
        THEN
            UPDATE livres
            SET disponible = false
            WHERE id = NEW.livre_id;
        END IF;
        -- Retourne la ligne modifiée
        RETURN NEW;
    END;
$$
LANGUAGE plpgsql;

-- Trigger BEFORE INSERT : vérifie + rend indisponible
DROP TRIGGER IF EXISTS trigger_livre_indisponible_emprunt ON emprunts;
CREATE TRIGGER trg_livre_indisponible_emprunt
    BEFORE INSERT ON emprunts
    FOR EACH ROW
    EXECUTE FUNCTION fn_check_et_set_livre_indisponible();

--* un livre redevient disponible quand il est rendu
-- Fonction de mise à jour de la disponibilité, petit check sur statut avant mise à jour
CREATE OR REPLACE FUNCTION fn_set_livre_disponible_retour()
RETURNS TRIGGER AS $$
    BEGIN
        -- Si date_retour_effective fait partie de la modification ( = emprunt rendu )
        IF NEW.date_retour_effective IS NOT NULL THEN
            -- Livre redevient disponible
            UPDATE livres 
            SET disponible = TRUE 
            WHERE id = NEW.livre_id;
        END IF;
        
        RETURN NEW;
    END;
$$ 
LANGUAGE plpgsql;

-- Trigger BEFORE UPDATE : met disponible si livre rendu
DROP TRIGGER IF EXISTS trigger_livre_disponible_retour ON emprunts;
CREATE TRIGGER trigger_livre_disponible_retour
    BEFORE UPDATE OF date_retour_effective ON emprunts
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_livre_disponible_retour();