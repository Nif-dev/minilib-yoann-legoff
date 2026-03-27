//% backend/src/middleware/validateAdherent.js
//? Middleware de validation des données de livres

import { Request, Response, NextFunction } from 'express';
import { ApiResponseError } from '../types/api.ts';

/**
 * Middleware Express qui valide le body d'une requête de création ou mise à jour de livre. (POST/PUT)
 * S'utilise comme suit : router.post('/livres', validateLivre, controller.createLivre);
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponseError> } res - Résponse Express
 * @param { NextFunction } next - Fonction de rappel pour passer au middleware suivant
 */
const validateAdherent = (req: Request, res: Response <ApiResponseError>, next: NextFunction) => {
    const { nom, prenom, email } = req.body;
    const erreurs = [];

    if (!nom || nom.trim() === '') erreurs.push('Le champ nom est obligatoire');
    if (nom && nom.length > 50) erreurs.push('Le champ nom ne doit pas avoir plus de 50 caractères');
    if ( nom && nom.length < 2) erreurs.push('Le champ nom doit avoir au moins 2 caractères');

    if (!prenom || prenom.trim() === '') erreurs.push('Le champ prénom est obligatoire');
    if (prenom && prenom.length > 50) erreurs.push('Le champ prénom ne doit pas avoir plus de 50 caractères');
    if ( prenom && prenom.length < 2) erreurs.push('Le champ prénom doit avoir au moins 2 caractères');

    if (!email || email.trim() === '') erreurs.push('Le champ email est obligatoire');
    // TODO regex email

    if (erreurs.length > 0) {
        res.status(400).json({ 
            error: "Format invalide",
            champs: erreurs 
        });
    } else {
        next(); // Passe au middleware suivant
    }
};

export default validateAdherent;
