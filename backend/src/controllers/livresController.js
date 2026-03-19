//% backend/src/controllers/livresController.js
//? Controller associé à la route livresRouter
// logique métier entre les routes et les données

import * as livresModel from '../models/livresData.js';

/**
 * Récupère tous les livres avec filtres optionnels via query params
 * GET /api/v1/livres?genre=informatique&disponible=true&recherche=clean
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
const getLivres = (req, res) => {
    try {
        // req.query = { genre: 'informatique', disponible: true } depuis l'url ( ?genre=...&disponible=true )
        const { genre, disponible, recherche } = req.query;

        // appel de la fonction du model avec les filtres
        const livres = livresModel.findAll({ genre, disponible, recherche });
        res.status(200).json(livres);

    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des livres',
            error: error,
        });
    }
}

/**  
 * Route de recherche par auteur ou titre ( 1 champ de recherche obligatoire -> query params)
 * GET /api/v1/livres/recherche?q=antoine
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
const queryLivres = (req, res) => {
    try {
        const { q } = req.query;
        console.log("🚀 ~ queryLivres ~ recherche:", q)
        if (!q) {
            return res.status(400).json({ message: 'Paramètre de recherche q obligatoire' });
        }
        const results = livresModel.findAll({ recherche: q });
        console.log("🚀 ~ queryLivres ~ results:", results)
        res.status(200).json({ query: q, total: results.length, results });
    } catch (error) {
        console.log("🚀 ~ queryLivres ~ error:", error)
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des livres',
            error: error,
        });
    }
}


/**
 * Récupère un livre poar son id
 * GET /api/v1/livres/:id
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
const getLivreById = (req, res) => {
    try {
        const livre = livresModel.findById(req.params.id);
        if (livre) {
            res.status(200).json(livre);
        } else {
            res.status(404).json({ message: 'Livre non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du livre',
            error: error,
        });
    }
}   

/**
 * Création d'un nouveau livre
 * POST /api/v1/livres
 * Body JSON attendu : { isbn, titre, auteur, annee, genre }
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
const createLivre = (req, res) => {
    // Récupération des données du corps de la requête
    const { isbn, titre, auteur } = req.body;

    // Validation des données
    const champsManquants = [];
    if (!isbn) champsManquants.push('isbn');
    if (!titre) champsManquants.push('titre');
    if (!auteur) champsManquants.push('auteur');

    // Si des champs sont manquants, renvoyer une information
    if (champsManquants.length > 0) {
        res.status(400).json({ 
            message: 'Champs obligatoires manquants',
            champs: champsManquants 
        });
        return;
    }

    try {
        const nouveau = livresModel.create(req.body);
        res.status(201).json(nouveau);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la création du livre',
            error: error,
        });
    }
}

/** 
 * Mise à jour d'un livre existant
 * PUT /api/v1/livres/:id
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */

const updateLivre = (req, res) => {
    const misAJour = livresModel.update(req.params.id, req.body);
    if (misAJour === null) {
        res.status(404).json({ message: `Livre non trouvé avec id : ${req.params.id}`  });
    } else {
        res.status(200).json(misAJour);
    }
}

/** 
 * Suppression d'un livre
 * DELETE /api/v1/livres/:id
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
const deleteLivre = (req, res) => {
    try {
        const livre = livresModel.findById(req.params.id);
        if (livre) {
            livresModel.remove(req.params.id);
            res.status(204).json(); //JSON vide cause bruno qui attend un retour meme avec 204 (no content) - inattendu
        } else {
            res.status(404).json({ message: `Livre non trouvé avec id : ${req.params.id}` });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du livre',
            error: error,
        });
    }
};

export {
    getLivres,
    queryLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
};
