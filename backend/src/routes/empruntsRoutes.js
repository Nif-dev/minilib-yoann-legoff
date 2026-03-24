//% backend/src/models/empruntsModel.js
//? Route Express pour les emprunts
// Toutes les routes sont préfixées par /api/v1/emprunts

import express from 'express';
const router = express.Router();

import * as controller from '../controllers/empruntsController.js';

import asyncWrapper from '../middleware/asyncWrapper.js';

//* Endpoints

// Récupérer tous les emprunts en retard
// GET /api/v1/emprunts/retards
router.get('/retards', asyncWrapper(controller.getRetards));

export default router;