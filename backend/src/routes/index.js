//% backend/src/routes/index.js
//? Point d'entrée des routes

import express from 'express';

// Import des routes spécifiques de l'api
import healthRouter from './healthRouter.js';
import livresRouter from './livresRoutes.js';
import adherentsRouter from './adherentsRoutes.js';

/**
 * Router - pour définir et organiser les routes de l'application.
 */
const router = express.Router();

    //* Endpoints de l'API

    // dirige les appels vers la route associé healthRouter
    router.use('/health',healthRouter);

    // dirige les appels vers la route associé livresRouter
    router.use('/livres',livresRouter);

    // dirige les appels vers la route associé adherentsRouter
    router.use('/adherents',adherentsRouter);

export default router;
