//% backend/src/models/livresData.js
//? Model de Livre, fonctions de manipulation des livres

//! Données de test en mémoire pour les livres
let livres = [
  {
    "id": 1,
    "isbn": "9780132350884",
    "titre": "Clean Code",
    "auteur": "Robert C. Martin",
    "annee": 2008,
    "genre": "Informatique",
    "disponible": true
  },
  {
    "id": 2,
    "isbn": "9780201633610",
    "titre": "Design Patterns",
    "auteur": "Gang of four",
    "annee": 1994,
    "genre": "Informatique",
    "disponible": true
  },
  {
    "id": 3,
    "isbn": "97820706125758",
    "titre": "Le Petit Prince",
    "auteur": "Antoine de Saint-Exupéry",
    "annee": 1943,
    "genre": "Roman",
    "disponible": false
  },
  {
    "id": 4,
    "isbn": "9782070360024",
    "titre": "1984",
    "auteur": "George Orwell",
    "annee": 1949,
    "genre": "Roman",
    "disponible": true
  },
  {
    "id": 5,
    "isbn": "97808201485677",
    "titre": "The Pragmatic Programmer",
    "auteur": "Andrew Hunt",
    "annee": 1999,
    "genre": "Informatique",
    "disponible": true
  }
]


// Compteur pour générer des IDs uniques
let nextID = livres.length +1;


/**
 * Retourne tous les livres avec filtrage optionnel
 *
 * @param {Object} [filtres = {}] - Critères de filtrage
 * @param {string} [filtres.genre] - Filtrer par genre
 * @param {boolean} [filtres.disponible] - Filtrer par disponibilité
 * @param {string} [filtres.recherche] - Recherche par titre ou auteur
 * @returns {Livre[]} - Tableau de livres filtré 
 */
const findAll = (filtres ={}) => {
    const { genre, disponible, recherche } = filtres;

  // Conversion propre de string a boolean avec switch
    let disponibleBool;
    switch (disponible) {
        case 'true':
            disponibleBool = true;
            break;
        case 'false':
            disponibleBool = false;
            break;
        default:
            disponibleBool = undefined;
    }

    return livres.filter(livre => {
        
        if (disponibleBool !== undefined && livre.disponible !== disponibleBool) {
            return false;
        }
        if (genre && livre.genre !== genre) {
            return false;
        }
        if (recherche) {
            const t = recherche.toLowerCase();
            if (!livre.titre.toLowerCase().includes(t) 
                && !livre.auteur.toLowerCase().includes(t)) return false;
            }
        
        return true;
    });
}

/**
 * Retourne un livre par son ID
 *
 * @param {number} id - ID du livre recherché
 * @returns {Livre | undefined} - Livre correspondant au ID fourni
 */
const findById = id => livres.find(livre => livre.id === Number (id));


/**
 * Ajoute un livre et l'ajoute en mémoire (temp )
 *
 * @param {Omit<Livre, 'id' | 'disponible'>} data - Données du livre à ajouter, sans id ni disponibilité
 * @returns {Livre} - Livre ajouté avec son id et disponibilité par défaut = true
 */
const create = (data) => {
    const nouveau = {
        id: nextID++,
        disponible: true, // par défaut un nouveau livre est disponible
        ...data
    }
    // Ajout du livre en mémoire - tableau livres
    livres.push(nouveau);

    // Retourne le livre ajouté
    return nouveau;
}

/**
 * Modifie un livre existant par son ID
 *
 * @param {number} id - id du livre à modifier
 * @param {Partial<Livre>} data - Données du livre à modifier (partiels)
 * @returns {Livre | null} - Livre mis à jour si trouvé, sinon null
 */
const update = (id, data) => {
    const indexMaj = livres.findIndex(livre => livre.id === Number (id));
    if (indexMaj === -1 ) return null;

    // Spread : on garde l'existant, on écrase avec les modifs
    livres[indexMaj] = {
        ...livres[indexMaj],
        ...data
    }
    return livres[indexMaj];
}

/** 
 * Supprime un livre par son ID
 *
 * @param {number} id - id du livre à supprimer
 * @returns {boolean} - true si le livre est supprimé, sinon false (non trouvé)
 */

const remove = id => {
    const avant = livres.length;
    livres = livres.filter(livre => livre.id !== Number (id));
    return livres.length < avant; // true si un élément a été supprimé
};

// Export de toutes les fonctions -pattern CommonJS
export {
    findAll,
    findById,
    create,
    update,
    remove
}