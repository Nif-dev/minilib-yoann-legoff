--% database/seed.sql
--? Données de test de la base de données minilib
-- Éxécuter après schéma avec psql -U minilib_user -d minilib -f database/seed.sql

-- Livres
INSERT INTO livres (isbn, titre, auteur, annee, genre)
VALUES
    ('9780132350884', 'Clean Code', 'Robert C. Martin', 2008, 'Informatique'),
    ('9780201633610', 'Design Patterns', 'Gang of four', 1994, 'Informatique'),
    ('9783140464079', 'Le Petit Prince', 'Antoine de Saint-Exupéry', 1943, 'Roman'),
    ('9782070360024', '1984', 'George Orwell', 1949, 'Roman'),
    ('9780820148567', 'The Pragmatic Programmer', 'Andrew Hunt', 1999, 'Informatique')
    ;


-- Adherents
INSERT INTO adherents (numero_adherent, nom, prenom, email)
VALUES
    ('ADH-001', 'Côme', 'Wicémichel', 'ref-culte@mail.com'),
    ('ADH-002', 'Jules', 'Verne', 'jules@verne.com'),
    ('ADH-003', 'Marcel', 'Proust', 'marcel@proust.com'),
    ('ADH-004', 'Victor', 'Hugo', 'victor@hugo.com')
    ;

-- Simule un emprunt en cours (Le petit prince emprunté par Côme)
INSERT INTO emprunts (livre_id, adherent_id, date_retour_prevue)
VALUES
    (3, 1, CURRENT_DATE + INTERVAL '14 DAYS')
    ;

-- Marque le livre comme indisponible
UPDATE livres SET disponible = false WHERE id = 3;


