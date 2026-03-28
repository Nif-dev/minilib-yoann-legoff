//% backend/src/middleware/validateLivre.ts
//? Middleware de validation des données de livres

import { Request, Response, NextFunction } from 'express';
import { ApiResponseError } from '../types/index.ts';

/**
 * Middleware Express qui valide le body d'une requête de création ou mise à jour de livre. (POST/PUT)
 * S'utilise comme suit : router.post('/livres', validateLivre, controller.createLivre);
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponseError> } res - Résponse Express
 * @param { NextFunction } next - Fonction de rappel pour passer au middleware suivant
 */
const validateLivre = (req: Request, res: Response <ApiResponseError>, next: NextFunction) => {
    const { isbn, titre, auteur } = req.body;
    const erreurs = [];
    if (!isbn || isbn.trim() === '') erreurs.push('Le champ ISBN est obligatoire');
    // Validation de l'ISBN - 13 chiffres obligatoirement
    if (isbn && isbn.length !== 13) erreurs.push('Le champ ISBN doit avoir 13 chiffres');
    if (!titre || titre.trim() === '') erreurs.push('Le champ titre est obligatoire');
    if (!auteur || auteur.trim() === '') erreurs.push('Le champ auteur est obligatoire');

    if (erreurs.length > 0) {
        res.status(400).json({ 
            error: "Format invalide", 
            champs: erreurs 
        });
    } else {
        next(); // Passe au middleware suivant
    }
};

export default validateLivre;
