//% backend/src/middleware/asyncWrapper.js
//? Middleware de gestion des promesses

/** @import { Request, Response, NextFunction } from 'express'; */

/** 
 * Enveloppe un handler Express async pour propager les erreurs.
 * 
 * @param {any} fn - Handler Express async
 */
const asyncWrapper = fn => 
    /** Typage JSDoc - compatible Node.js sans compilation TypeScript
    * @param { Request } req - Requête Express
    * @param { Response } res - Résponse Express
    * @param { NextFunction } next - Prochain middleware
    */
    (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncWrapper;