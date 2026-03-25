//% backend/src/controllers/livresController.js
//? Controller associé à la route livresRouter
// logique métier entre les routes et les données

//! Import des types et fonctions du model
/** @import { Request, Response, NextFunction } from 'express'; */
/** @import { ApiResponse, ApiResponseError, Livre, FiltresRechercheLivres }  from '../types/index.js'; */
import e from 'express';
import * as livresModel from '../models/livresModel.js';

/**
 * Récupère tous les livres avec filtres optionnels via query params
 * GET /api/v1/livres?genre=informatique&disponible=true&recherche=clean
 *
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <Livre[]> | ApiResponseError> } res - Résponse Express
 */
export const getLivres = async (req, res) => {
    // req.query = { genre: 'informatique', disponible: true } depuis l'url ( ?genre=...&disponible=true )

    /** @type {FiltresRechercheLivres} filtres */
    const filtres = req.query || {};
    // appel de la fonction du model avec les filtres optionnels

        const livres = await livresModel.findAll(filtres);
        res.status(200).json({
            success: true,
            data: livres,
            total: livres.length,
            });

}

/**  
 * Route de recherche par auteur ou titre ( 1 champ de recherche obligatoire -> query params)
 * GET /api/v1/livres/recherche?q=antoine
 *
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <Livre[]> | ApiResponseError> } res - Résponse Express
 */
export const queryLivres = async (req, res) => {
    // req.query = { q: 'antoine' } avec url ( /recherche?q=antoine )
    const { q } = req.query;
    //* validation temporaire de la requête ( q est obligatoire , de type string et de longueur > 3 )
    if (!q || q === '' || typeof q !== 'string') {
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['query param /recherche?q= ...'],
        });
        return;
    }
    if (q && q.length < 3) {
        res.status(400).json({ 
            error: 'Champs trop court > 3 caractères',
            champs: ['query param /recherche?q= ...'],
        });
        return;
    }
    // appel de la fonction du model
        /** @type {string} recherche */
        const recherche = q.toString();
        const results = await livresModel.findAll({ recherche: recherche });
        if (results.length === 0) { // aucun livre trouvé - résultat bon mais vide
            res.status(200).json({ 
                success: false,
                data: [],
                message: `Aucun livre pour :  ${recherche} `,
            });
            
        } else {
            res.status(200).json({ 
                success: true,
                data: results,
                total: results.length,
            });
        }

    
}


/**
 * Récupère un livre par son id
 * GET /api/v1/livres/:id
 *
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <Livre> | ApiResponseError> } res - Résponse Express
 */
export const getLivreById = async (req, res) => {
    // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) { // id est obligatoire
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['id'],
        });
    }
    if (Number.isNaN(Number(id))) { // id doit avoir un format numérique
        res.status(400).json({ 
            error: 'Champs id non numérique',
            champs: ['id'],
        });
    }
    // appel de la fonction du model
        const livre = await livresModel.findById(Number(id));
        if (livre) {
            res.status(200).json({ 
                success: true,
                data: livre
            });
        } else {
            res.status(404).json({ 
                error: 'Livre non trouvé',
                message: `Livre non rencontré avec id : ${id}`
            });
        }
    
}   

/**
 * Création d'un nouveau livre
 * POST /api/v1/livres
 * Body JSON attendu : { isbn, titre, auteur, annee, genre }
 *
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <Livre> | ApiResponseError> } res - Résponse Express
 */
export const createLivre = async (req, res) => {
    //* Corps de la requête validé via middleware sur livresRouter

    //* Vérification isbn doublons
    /** @type { Livre | null } livre */
    const livre = await livresModel.findByISBN(req.body.isbn);
    if (livre) {    // doublon d'isbn 
        return res.status(400).json({ 
            error: 'ISBN doublon',
            message: `ISBN ${req.body.isbn} doublon, livre deja existant id : ${livre.id}` ,
        });
    }
    // appel de la fonction du model
    const nouveau = await livresModel.create(req.body);
    res.status(201).json({
        success: true,
        data: nouveau
    });
    

}

/** 
 * Mise à jour d'un livre existant
 * PUT /api/v1/livres/:id
 *
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <Livre> | ApiResponseError> } res - Réponse Express
 */

export const updateLivre = async (req, res) => {
    //* Corps de la requête validé via middleware sur livresRouter
    // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) { // id est obligatoire
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['id'],
        });
    }
    if (Number.isNaN(Number(id))) { // id doit avoir un format numérique
        res.status(400).json({ 
            error: 'Champs id non numérique',
            champs: ['id'],
        });
    }
        // appel de la fonction du model
        const misAJour = await livresModel.update(Number(id), req.body);
        if (misAJour == null) {
            res.status(404).json({ 
                error: 'Livre non modifié',
                message: `Livre non rencontré avec id : ${id} , mise à jour impossible`
            });
        } else {
            res.status(200).json({
                success: true,
                data: misAJour
            });
        }

}

/** 
 * Suppression d'un livre
 * DELETE /api/v1/livres/:id
 *
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <null> | ApiResponseError> } res - Réponse Express
 */
export const deleteLivre = async (req, res) => {
    // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) { // id est obligatoire
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['id'],
        });
    }
    if (Number.isNaN(Number(id))) { // id doit avoir un format numérique
        res.status(400).json({ 
            error: 'Champs id non numérique',
            champs: ['id'],
        });
    }

        const livre = await livresModel.findById(Number(id));
        if (livre) {
            await livresModel.remove(Number(id));
            //res.status(204).json(); //* JSON vide sinon bruno qui attend un retour va boucler... meme avec 204 (no content) - inattendu
            res.status(200).json({
                success: true,
                data: null,
                message: `Livre supprimé avec id : ${id}`
            });
        } else {
            res.status(404).json({ 
                error: 'Livre non supprimé',
                message: `Livre non rencontré avec id : ${id}, suppression impossible`
            });
        }
    
};
