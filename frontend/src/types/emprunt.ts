//% frontend/src/types/api/emprunts.ts
//? Typage du Model Emprunt

/**
 * Représente un emprunt dans le catalogue de MiniLib
 * Correspond aux colonnes de la table emprunts dans PostgreSQL
 *
 * @interface Emprunt
 */
export interface Emprunt {
    id:                     number;
    livre_id:               number;
    adherent_id:            number;
    date_emprunt:           Date;
    date_retour_prevue:     Date;
    date_retour_effective:  Date | null; // null = pas encore rendu
}

/**
 * Interface enrichie avec les données jointes (JOIN SQL)
 *
 * @interface EmpruntAvecDetails
*/
export interface EmpruntAvecDetails extends Emprunt {
titre_livre:    string; // depuis livres.titre
nom_adherent:   string; // depuis adherents.nom + prenom
en_retard:      boolean; // calculé : date_retour_prevue < aujourd'hui
}

/**
 * Données de création d'un nouvel emprunt
 * Pas d'id (serial)
 *
 * @interface CreateEmpruntDTO
 */
export interface CreateEmpruntDTO {
livre_id: number;
adherent_id: number;
}

//? type littéral - uniquement ces valeurs précises
/**
 * Statut d'un emprunt - en cours, rendu, en retard
 *
 * @type StatutEmprunt
 */
export type StatutEmprunt = 'en_cours' | 'rendu' | 'en_retard';