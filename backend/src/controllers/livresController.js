//% backend/src/controllers/livresController.js
//? Controller associé à la route livresRouter
// logique métier entre les routes et les données

import * as livresModel from '../models/livresModel.js';

/**
 * Récupère tous les livres avec filtres optionnels via query params
 * GET /api/v1/livres?genre=informatique&disponible=true&recherche=clean
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
export const getLivres = async (req, res) => {
    // req.query = { genre: 'informatique', disponible: true } depuis l'url ( ?genre=...&disponible=true )
    const { genre, disponible, recherche } = req.query;
    
    try {
        // appel de la fonction du model avec les filtres
        const livres = await livresModel.findAll({ genre, disponible, recherche });
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
export const queryLivres = async (req, res) => {
    // req.query = { q: 'antoine' } avec url ( /recherche?q=antoine )
    const { q } = req.query;
    // validation temporaire de la requête
    if (!q) {
        return res.status(400).json({ message: 'Paramètre de recherche "q" obligatoire' });
    }
    
    try {
        const results = await livresModel.findAll({ recherche: q });
        res.status(200).json({ query: q, total: results.length, results });
    
    } catch (error) {
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
export const getLivreById = async (req, res) => {
    // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Paramètre "id" obligatoire' });
    }

    try {
        const livre = await livresModel.findById(id);
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
export const createLivre = async (req, res) => {
    //* Corps de la requête validé via middleware sur livresRouter

    //* Vérification isbn doublons
    const livre = await livresModel.findByISBN(req.body.isbn);
    if (livre) {
        return res.status(400).json({ message: 'ISBN doublon' });
    }
    
    try {
        const nouveau = await livresModel.create(req.body);
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

export const updateLivre = async (req, res) => {
    //* Corps de la requête validé via middleware sur livresRouter

    try {
        
        const misAJour = await livresModel.update(req.params.id, req.body);
        if (misAJour === null) {
            res.status(404).json({ message: `Livre non trouvé avec id : ${req.params.id}`  });
        } else {
            res.status(200).json(misAJour);
        }
    
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du livre',
            error: error,
        });
    }
}

/** 
 * Suppression d'un livre
 * DELETE /api/v1/livres/:id
 *
 * @param {import ('express').Request} req - Requête Express
 * @param {import ('express').Response} res - Résponse Express
 */
export const deleteLivre = async (req, res) => {
        // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Paramètre "id" obligatoire' });
    }

    try {
        const livre = await livresModel.findById(id);
        if (livre) {
            livresModel.remove(req.params.id);
            res.status(204).json(); 
            //* JSON vide sinon bruno qui attend un retour va boucler... meme avec 204 (no content) - inattendu
        } else {
            res.status(404).json({ message: `Livre non trouvé avec id : ${id}` });
        }
    
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du livre',
            error: error,
        });
    }
};
