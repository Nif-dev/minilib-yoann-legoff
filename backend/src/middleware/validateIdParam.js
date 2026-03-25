//% backend/src/middleware/validateIdParam.js
//? Middleware de validation d'ID dans req.params.id

/** @import { Request, Response, NextFunction } from 'express'; */
/** @import { ApiResponse } from '../types/index.js'; */

/**
 * Middleware de validation d'ID dans req.params.id
 * Vérifie : existence + entier positif
 * 
 * @param { Request } req - Requête Express
 * @param { Response } res - Résponse Express
 * @param { NextFunction } next - Prochain middleware
 */
const validateIdParam = (req, res, next) => {
    const { id } = req.params;

    // 1) ID obligatoire
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Paramètre "id" obligatoire'
        });
        return;
    }

    // 2) ID valide (entier positif)
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        res.status(400).json({
            success: false,
            message: 'Paramètre "id" invalide (entier positif requis)'
        });
        return;
    }

    next();
};

export default validateIdParam;