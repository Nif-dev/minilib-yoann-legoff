//% backend/src/middleware/validateIdParam.ts
//? Middleware de validation d'ID dans req.params.id

import { Request, Response, NextFunction } from 'express';
import { ApiResponseError } from '../types/index.ts';

/**
 * Middleware de validation d'ID dans req.params.id
 * Vérifie : existence + entier positif
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponseError> } res - Résponse Express
 * @param { NextFunction } next - Prochain middleware
 */
const validateIdParam = (req: Request, res: Response <ApiResponseError>, next: NextFunction) => {
    const { id } = req.params;

    // 1) ID obligatoire
    if (!id) {
        res.status(400).json({
            error: 'Paramètre "id" manquant',
            message: 'Paramètre "id" obligatoire'
        });
        return;
    }

    // 2) ID valide (entier positif)
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({
            error: 'Paramètre "id" invalide',
            message: 'Paramètre "id" doit être un entier positif non nul'
        });
        return;
    }

    next();
};

export default validateIdParam;