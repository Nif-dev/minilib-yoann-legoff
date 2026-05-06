--% database/views.sql
--? Vues métier de la base de données minilib - PostgreSQL 18
-- Éxécuter avec psql -U minilib_user -d minilib -f database/views.sql

-- Les vues sont alignées avec les types attendus par le back-end - cf backend/types/ 

--* Liste des adhérents
CREATE OR REPLACE VIEW v_adherents_actifs AS
SELECT id, numero_adherent, prenom, nom, email, actif, created_at
FROM adherents
WHERE actif = true;