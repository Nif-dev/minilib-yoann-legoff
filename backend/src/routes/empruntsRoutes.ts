//% backend/src/models/empruntsModel.ts
//? Route Express pour les emprunts
// Toutes les routes sont préfixées par /api/v1/emprunts

import express from 'express';
const router = express.Router();

import * as controller from '../controllers/empruntsController.ts';

import validateIdParam from '../middleware/validateIdParam.ts';
import asyncWrapper from '../middleware/asyncWrapper.ts';

//* Endpoints

// Récupérer tous les emprunts en retard
// GET /api/v1/emprunts/retards
router.get('/retards', asyncWrapper(controller.getRetards));

// Récupérer tous les emprunts
// GET /api/v1/emprunts
router.get('/', asyncWrapper(controller.getEmprunts));

// Détails d'un emprunt (id en param)
// GET /api/v1/emprunts/:id
router.get('/:id',validateIdParam, asyncWrapper(controller.getEmpruntById));

// Création d'un nouvel emprunt (données JSON -> body request)
// POST /api/v1/emprunts
router.post('/', asyncWrapper(controller.createEmprunt));

// Retour d'un emprunt (id en param)
// PUT /api/v1/emprunts/:id/retour
router.put('/:id/retour',validateIdParam, asyncWrapper(controller.retourLivre));

export default router;

