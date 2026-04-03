//% backend/src/controllers/livresController.ts
//? Controller associé à la route livresRouter
// logique métier entre les routes et les données

// Import des types api et model
import { Request, Response, NextFunction } from 'express';
import { ApiResponse, Livre, FiltresRechercheLivres, CreateLivreDTO, UpdateLivreDTO }  from '../types/index.ts';
import { ERRORS } from '../constants/errors.ts';

// Import des fonctions du model
import * as livresModel from '../models/livresModel.ts';

/**
 * Récupère tous les livres 
 * GET /api/v1/livres
 *
 * @param { Request } req - Requête Express - filtres optionnels
 * @param { Response <ApiResponse <Livre[]>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const getLivres = async (
    req: Request,
    res: Response <ApiResponse <Livre[]>>,
    next: NextFunction
) => {
    
    try{
        // appel de la fonction du model 
        const livres: Livre[] = await livresModel.findAll();

        if (!livres){
            res.status(404).json({ 
                success: false,
                error: ERRORS.RESOURCES_NOT_FOUND('livres').error,
                message: ERRORS.RESOURCES_NOT_FOUND('livres').message,
            });
            return;
        }
        if (livres.length === 0) {
            res.status(200).json({ 
                success: true,
                total: livres.length,        // 0
                message: 'Pas de livres trouvés',
                data: livres,                // []
            });
            return;
        }
        res.status(200).json({
            success: true,
            total: livres.length,
            data: livres,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};

/**  
 * Route de recherche par auteur ou titre ( 1 champ de recherche obligatoire -> query params)
 * GET /api/v1/livres/recherche?q=antoine
 *
 * @param { Request <FiltresRechercheLivres> } req - Requête Express - champ de recherche obligatoire
 * @param { Response <ApiResponse <Livre[]>> } res - Réponse Express 
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const queryLivres = async (
    req: Request <FiltresRechercheLivres>, 
    res: Response <ApiResponse <Livre[]>>,
    next: NextFunction
) => {

    try{
        
        const filtres: FiltresRechercheLivres = req.query;
        // appel de la fonction du model
        
        const results = await livresModel.findAll(filtres);

        if (!results) {
            res.status(404).json({ 
                success: false,
                error: ERRORS.RESOURCES_NOT_FOUND('livres').error,
                message: ERRORS.RESOURCES_NOT_FOUND('livres').message,
            });
            return;
        }

        if (results.length === 0) { // aucun livre trouvé - résultat bon mais vide
            res.status(200).json({ 
                success: true,
                total: results.length,
                message: `Aucun livre pour avec ces filtres.`,
                champs: Object.keys(filtres),       // champs de recherche pk pas ?
                data: results,
            });
            
        } else {
            res.status(200).json({ 
                success: true,
                total: results.length,
                data: results,
            });
        }
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }

    
}


/**
 * Récupère un livre par son id
 * GET /api/v1/livres/:id
 *
 * @param { Request <{ id: string }> } req - Requête Express
 * @param { Response <ApiResponse <Livre>> } res - Réponse Express
 */
export const getLivreById = async (
    req: Request <{ id: string }>, 
    res: Response <ApiResponse<Livre>>, 
    next: NextFunction
) => {

    try{
        // Récupérer l'id de la requête, validation par middleware sur route
        const { id } = req.params;
        
        // id doit avoir un format numérique pour la requête
        const idNumber = Number(id);

    // appel de la fonction du model
        const livre = await livresModel.findById(idNumber);
        if (!livre) {
            res.status(404).json({ 
                success: false,
                error: ERRORS.RESOURCE_NOT_FOUND_ID('livre', id).error,
                message: ERRORS.RESOURCE_NOT_FOUND_ID('livre', id).message
            });
            return;
        }
        res.status(200).json({ 
            success: true,
            data: livre,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }   
}

/**
 * Création d'un nouveau livre
 * POST /api/v1/livres
 * Body JSON attendu : CreateLivreDTO { isbn, titre, auteur, annee, genre }
 *
 * @param { Request <CreateLivreDTO> } req - Requête Express
 * @param { Response <ApiResponse <Livre>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const createLivre = async (
    req: Request <CreateLivreDTO>, 
    res: Response <ApiResponse<Livre>>,
    next: NextFunction
) => {
    
    try{
        //* Vérification isbn doublons
        const livre: Livre | null = await livresModel.findByISBN(req.body.isbn);
        if (livre) {    // doublon d'isbn 
            res.status(409).json({ 
                success: false,
                error: ERRORS.DUPLICATE('livre').error,
                message: ERRORS.DUPLICATE('livre').message + ` - ISBN ${req.body.isbn} en doublon` ,
            });
            return;
        }

        //* Corps de la requête validé via middleware sur livresRouter
        const createData: CreateLivreDTO = {
            isbn: req.body.isbn,
            titre: req.body.titre,
            auteur: req.body.auteur,
            annee: req.body.annee,
            genre: req.body.genre
        }
        // appel de la fonction du model
        const nouveau = await livresModel.create(createData);

        if (!nouveau) {
            res.status(500).json({ 
                success: false,
                error: ERRORS.RESOURCE_NOT_CREATED('livre').error,
                message: ERRORS.RESOURCE_NOT_CREATED('livre').message,
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: 'Livre créé.',
            data: nouveau,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }

}

/** 
 * Mise à jour d'un livre existant
 * PUT /api/v1/livres/:id
 *
 * @param { Request <{ id: string }, UpdateLivreDTO> } req - Requête Express
 * @param { Response <ApiResponse <Livre>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */

export const updateLivre = async (
    req: Request <{ id: string }, UpdateLivreDTO>, 
    res: Response <ApiResponse <Livre>>,
    next: NextFunction
) => {

    try{
        // Récupérer l'id de la requête, validation par middleware sur route
        const { id } = req.params;
        
        // id doit avoir un format numérique pour la requête
        const idNumber = Number(id);
        
        //* Corps de la requête validé via middleware sur livresRouter
        const misAJourData: UpdateLivreDTO = req.body;
        // appel de la fonction du model
        const misAJour = await livresModel.update(idNumber, misAJourData);
        if (misAJour == null) {
        res.status(404).json({ 
                success: false,
                error: ERRORS.RESOURCE_NOT_FOUND_ID('livre', id).error,
                message: ERRORS.RESOURCE_NOT_FOUND_ID('livre', id).message + ` - mise à jour impossible`
            });
        } else {
            res.status(200).json({
                success: true,
                data: misAJour
            });
        }
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
}

/** 
 * Suppression d'un livre
 * DELETE /api/v1/livres/:id
 *
 * @param { Request <{ id: string }> } req - Requête Express
 * @param { Response <ApiResponse <null>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const deleteLivre = async (
    req: Request <{ id: string }>, 
    res: Response <ApiResponse <null>>,
    next: NextFunction
) => {

    try{

        // Récupérer l'id de la requête, validation par middleware sur route
        const { id } = req.params;

        // id doit avoir un format numérique pour la requête
        const idNumber = Number(id);
        
        // appel de la fonction du model
        const livre = await livresModel.findById(idNumber);
        if (livre) {
            const deleted =await livresModel.remove(idNumber);

            if (!deleted) {
                res.status(500).json({ 
                    success: false,
                    error: ERRORS.RESOURCE_NOT_DELETED('livre').error,
                    message: ERRORS.RESOURCE_NOT_DELETED('livre').message
                });
                return;
            }
            // res.status(204).json(); 
            //* - choix 200 > 204 
            res.status(200).json({
                success: true,
                message: `Livre supprimé avec id : ${id}`
            });
        } else {
            res.status(404).json({ 
                success: false,
                error: ERRORS.RESOURCE_NOT_FOUND_ID('livre', idNumber).error,
                message: ERRORS.RESOURCE_NOT_FOUND_ID('livre', idNumber).message + ` - suppression impossible`
            });
        }
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};
