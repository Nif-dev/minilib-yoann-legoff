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

// Récupérer tous les emprunts
// GET /api/v1/emprunts
router.get('/', asyncWrapper(controller.getEmprunts));

// Création d'un nouvel emprunt (données JSON -> body request)
// POST /api/v1/emprunts
router.post('/', asyncWrapper(controller.createEmprunt));

export default router;

