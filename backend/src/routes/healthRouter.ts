//% backend/src/routes/healthRouter.ts
//? Route de health check du serveur

import express from 'express';
// Import du controller associé
import healthController from '../controllers/healthController.ts';

const router = express.Router();
router.get('/', healthController);

export default router;