//% backend/src/routes/adherentsRoutes.js
//? Route Express pour les adhérents
// Toutes les routes sont préfixées par /api/v1/adherents

import express from 'express';
const router = express.Router();

import * as controller from '../controllers/adherentsController.js';

import validateIdParam from '../middleware/validateIdParam.js';
import asyncWrapper from '../middleware/asyncWrapper.js';

//* Endpoints

// Récupérer tous les adhérents
// GET /api/v1/adherents
router.get('/', asyncWrapper(controller.getAdherents));

// Détails d'un adhérent (id en param)
// GET /api/v1/adherents/:id
router.get('/:id',validateIdParam, asyncWrapper(controller.getAdherentById));

// Création d'un nouvel adhérent (données JSON -> body request)
// POST /api/v1/adherents
router.post('/', asyncWrapper(controller.createAdherent));

// Mise à jour d'un adhérent existant
// PUT /api/v1/adherents/:id
router.put('/:id',validateIdParam, asyncWrapper(controller.updateAdherent));

// Suppression d'un adhérent
// DELETE /api/v1/adherents/:id
router.delete('/:id',validateIdParam, asyncWrapper(controller.deleteAdherent));

export default router;