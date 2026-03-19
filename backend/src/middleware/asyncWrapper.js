//% backend/src/middleware/asyncWrapper.js
//? Middleware de gestion des promesses

/** 
 * Enveloppe un handler Express async pour propager les erreurs.
 * 
 * @param {Function} fn - Handler async (req, res, next)
 * @returns {Function} - Handler avec gestio d'erreur automatique
 */
const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncWrapper;