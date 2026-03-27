//% backend/src/routes/healthRouter.js
//? Route de health check du serveur

import express from 'express';
// Import du controller associé
import healthController from '../controllers/healthController.js';

const router = express.Router();
router.get('/', healthController);

export default router;