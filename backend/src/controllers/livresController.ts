//% backend/src/controllers/livresController.ts
//? Controller associé à la route livresRouter
// logique métier entre les routes et les données

// Import des types api et model
import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiResponseError, Livre, FiltresRechercheLivres, CreateLivreDTO, UpdateLivreDTO }  from '../types/index.ts';

// Import des fonctions du model
import * as livresModel from '../models/livresModel.ts';

/**
 * Récupère tous les livres avec filtres optionnels via query params
 * GET /api/v1/livres?genre=informatique&disponible=true&recherche=clean
 *
 * @param { Request <FiltresRechercheLivres> } req - Requête Express - filtres optionnels
 * @param { Response <ApiResponse <Livre[]> | <ApiResponseError> > } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const getLivres = async (
    req: Request <FiltresRechercheLivres>,
    res: Response <ApiResponse<Livre[] | ApiResponseError>>,
    next: NextFunction
) => {
    
    try{
        // req.query = { genre: 'informatique', disponible: true } depuis l'url ( ?genre=...&disponible=true )
        const filtres: FiltresRechercheLivres = req.query || {};
        
        // appel de la fonction du model avec les filtres optionnels
        const livres = await livresModel.findAll(filtres);
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
 * @param { Request <Pick<FiltresRechercheLivres, 'recherche'>> } req - Requête Express - champ de recherche obligatoire
 * @param { Response <ApiResponse <Livre[]> | ApiResponseError> } res - Réponse Express 
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const queryLivres = async (
    req: Request <Pick<FiltresRechercheLivres, 'recherche'>>, 
    res: Response <ApiResponse<Livre[]> | ApiResponseError>,
    next: NextFunction
) => {

    try{

        // req.query = { q: 'antoine' } avec url ( /recherche?q=antoine )
        const { q } = req.query;
        //* validation supplementaire de la requête , deja traité par middleware mais {q: string} dans le scope
        if (!q || q === '' || typeof q !== 'string') {
            res.status(400).json({ 
                error: 'Champ(s) manquant(s)',
                champs: ['Recherche obligatoire : q=...'],
            });
            return;
        }
        
        // appel de la fonction du model
        
        const recherche = q.toLowerCase();
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
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }

    
}


/**
 * Récupère un livre par son id
 * GET /api/v1/livres/:id
 *
 * @param { Request <{ id: string }> } req - Requête Express
 * @param { Response <ApiResponse <Livre> | ApiResponseError> } res - Résponse Express
 */
export const getLivreById = async (
    req: Request <{ id: string }>, 
    res: Response <ApiResponse<Livre> | ApiResponseError>, 
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
 * @param { Response <ApiResponse <Livre> | ApiResponseError> } res - Résponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const createLivre = async (
    req: Request <CreateLivreDTO>, 
    res: Response <ApiResponse<Livre> | ApiResponseError>,
    next: NextFunction
) => {
    
    try{
        //* Vérification isbn doublons
        const livre: Livre | null = await livresModel.findByISBN(req.body.isbn);
        if (livre) {    // doublon d'isbn 
            res.status(400).json({ 
                error: 'ISBN doublon',
                message: `ISBN ${req.body.isbn} doublon, livre déjà existant id : ${livre.id}` ,
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
        res.status(201).json({
            success: true,
            data: nouveau
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
 * @param { Response <ApiResponse <Livre> | ApiResponseError> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */

export const updateLivre = async (
    req: Request <{ id: string }, UpdateLivreDTO>, 
    res: Response <ApiResponse <Livre> | ApiResponseError>,
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
                error: 'Livre non modifié',
                message: `Livre non rencontré avec id : ${id} , mise à jour impossible`
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
 * @param { Response <ApiResponse <null> | ApiResponseError> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
export const deleteLivre = async (
    req: Request <{ id: string }>, 
    res: Response <ApiResponse <null> | ApiResponseError>,
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
            await livresModel.remove(idNumber);
            // res.status(204).json(); 
            //* JSON vide sinon bruno qui attend un retour va boucler... meme avec 204 (no content) - choix 200 > 204
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
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};
