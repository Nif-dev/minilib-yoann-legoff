//% backend/src/types/adherents.ts
//? Typage du Model Adherent

/**
 * Représente un adherent dans le catalogue de MiniLib
 * Correspond aux colonnes de la table adherents dans PostgreSQL
 *
 * @interface Adherent
 */
export interface Adherent {
    id:                 number;
    numero_adherent:    string;
    nom:                string;
    prenom:             string;
    email:              string;
    actif:              boolean;
    created_at:         Date;
}

/** 
 * Données de création d'un nouvel adherent
 * Pas d'id (serial) ni actif (par défaut = true)
 *
 * @interface CreateAdherentDTO
*/
export interface CreateAdherentDTO {
    nom :           string;
    prenom :        string;
    email :         string;
}

/** 
 * Données de modification d'un adherent existant
 * Tous les champs sont optionnels
 *
 * @interface UpdateAdherentDTO
*/
export interface UpdateAdherentDTO {
    nom?:           string;
    prenom?:        string;
    email?:         string;
}