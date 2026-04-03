//% backend/src/middleware/validateIdParam.ts
//? Middleware de validation d'ID dans req.params.id

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.ts';
import { ERRORS } from '../constants/errors.ts';

/**
 * Middleware de validation d'ID dans req.params.id
 * Vérifie : existence + entier positif
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse<>> } res - Réponse Express
 * @param { NextFunction } next - Prochain middleware
 */
const validateIdParam = (req: Request, res: Response <ApiResponse<null>>, next: NextFunction) => {
    const { id } = req.params;

    // 1) ID obligatoire
    if (!id) {
        res.status(400).json({
            success: false,
            error: ERRORS.REQUIRED_FIELD('id').error,
            message: ERRORS.REQUIRED_FIELD('id').message
        });
        return;
    }

    // 2) ID valide (entier positif)
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({
            success: false,
            error: ERRORS.INVALID_FIELD('id').error,
            message: ERRORS.INVALID_FIELD('id').message,
            champs: ['Paramètre "id" doit être un entier positif non nul']
        });
        return;
    }

    next();
};

export default validateIdParam;