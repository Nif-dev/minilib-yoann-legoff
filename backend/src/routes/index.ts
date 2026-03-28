//% backend/src/routes/index.ts
//? Point d'entrée des routes

import express from 'express';

// Import des routes spécifiques de l'api
import healthRouter from './healthRouter.ts';
import livresRouter from './livresRoutes.ts';
import adherentsRouter from './adherentsRoutes.ts';
import empruntsRouter from './empruntsRoutes.ts';

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

    // dirige les appels vers la route associé empruntsRouter
    router.use('/emprunts',empruntsRouter);

export default router;
