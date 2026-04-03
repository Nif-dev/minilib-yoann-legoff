//% backend/src/middleware/validateRecherche.ts
//? Middleware de validation d'une recherche de livre

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.ts';
import { ERRORS } from '../constants/errors.ts';

/**
 * Middleware Express qui valide le body d'une requête de recherche de livre. (POST/PUT)
 * S'utilise comme suit : router.post('/livres', validateLivre, controller.createLivre);
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse<null>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel pour passer au middleware suivant
 */
const validateRecherche = (req: Request, res: Response <ApiResponse<null>>, next: NextFunction) => {
    const { q } = req.query;
    const erreurs = [];
    if (!q || q === '') {
        erreurs.push('Le champ recherche ne peut etre vide');
        res.status(400).json({ 
            success: false,
            error: ERRORS.REQUIRED_FIELD('recherche').error, 
            message: ERRORS.REQUIRED_FIELD('recherche').message,
            champs: erreurs 
        });
        return;
    };
    
    if (q && typeof q !== 'string' ){
        erreurs.push('Le champ recherche doit etre une chaine de caractères');
        res.status(400).json({ 
            success: false,
            error: ERRORS.INVALID_FIELD('recherche').error, 
            message: ERRORS.INVALID_FIELD('recherche').message,
            champs: erreurs 
        });
        return;
    } 
    
    // ces 2 validations imposent aux précédentes un 'early return' pour ne pas bloquer le middleware cause typage sur Node
    if (q && q.length < 3) erreurs.push('Le champ recherche doit avoir au moins 3 caractères');
    if (q && q.length > 50) erreurs.push('Le champ recherche ne doit pas avoir plus de 50 caractères');
    
    if (erreurs.length > 0) {
        res.status(400).json({ 
            success: false,
            error: ERRORS.INVALID_FIELDS().error,
            message: ERRORS.INVALID_FIELDS().message,
            champs: erreurs
        });
    } else {
        next(); // Passe au middleware suivant
    }
};

export default validateRecherche;
