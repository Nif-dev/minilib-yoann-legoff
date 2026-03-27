//% backend/src/middleware/asyncWrapper.ts
//? Middleware de gestion des promesses

import { Request, Response, NextFunction } from 'express';

/** 
 * Enveloppe un handler Express async pour propager les erreurs.
 * 
 * @param {Function} fn - Handler Express async
 * @param {Request} req - Requête Express
 * @param {Response} res - Résponse Express
 * @param {NextFunction} next - Fonction de rappel
 * @returns {Function} Middleware Express
 */
const asyncWrapper = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncWrapper;