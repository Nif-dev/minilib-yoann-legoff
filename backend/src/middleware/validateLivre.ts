//% backend/src/middleware/validateLivre.ts
//? Middleware de validation des données de livres

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.ts';
import { ERRORS } from '../constants/errors.ts';

/**
 * Middleware Express qui valide le body d'une requête de création ou mise à jour de livre. (POST/PUT)
 * S'utilise comme suit : router.post('/livres', validateLivre, controller.createLivre);
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse<null>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel pour passer au middleware suivant
 */
const validateLivre = (req: Request, res: Response <ApiResponse<null>>, next: NextFunction) => {
    const { isbn, titre, auteur } = req.body;
    const erreurs = [];
    // Validation de l'ISBN - présent + 13 chiffres obligatoirement
    if (!isbn || isbn.trim() === '') erreurs.push('Le champ ISBN est obligatoire');
    if (isbn && isbn.length !== 13) erreurs.push('Le champ ISBN doit avoir 13 chiffres');

    // Validation du titre - obligatoire 
    if (!titre || titre.trim() === '') erreurs.push('Le champ titre est obligatoire');

    // Validation de l'auteur - obligatoire et au moins 2 caractères
    if (!auteur || auteur.trim() === '') erreurs.push('Le champ auteur est obligatoire');
    if (auteur && auteur.length < 2) erreurs.push('Le champ auteur doit avoir au moins 2 caractères');

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

export default validateLivre;
