//% frontend/src/types/api/livres.ts
//? Typage du Model Livre

/**
 * Représente un livre dans le catalogue de MiniLib
 * Correspond aux colonnes de la table livres dans PostgreSQL
 *
 * @interface Livre
 */
export interface Livre {
    id:         number;
    isbn:       string;
    titre:      string;
    auteur:     string;
    annee:      number;
    genre:      string;
    disponible: boolean;
}

/**
 * Représente un livre et son nombre d'emprunts
 *
 * @interface LivreAvecStats
*/
export interface LivreAvecStats extends Livre {
    nb_emprunts_total: number; // calculé dynamiquement par COUNT() dans la requête SQL
}


/** 
 * Données de création d'un nouveau livre
 * Pas d'id (serial) ni disponibilité (par défaut = true)
 *
 * @interface CreateLivreDTO
*/
export interface CreateLivreDTO {
    isbn:       string;
    titre:      string;
    auteur:     string;
    annee?:     number;
    genre?:     string;
}

/**
 * Données de modification d'un livre existant
 * Tous les champs sont optionnels
 *
 * @interface UpdateLivreDTO
 */
export interface UpdateLivreDTO {
    isbn?: string;
    titre?: string;
    auteur?: string;
    annee?: string;
    genre?: string;
    disponible?: boolean;
}

/**
 * Filtres de recherche de livres
 *
 * @interface FiltresRechercheLivres
*/
export interface FiltresRechercheLivres {
    genre?:         string;
    disponible?:    string | boolean;
    recherche?:     string;
}
