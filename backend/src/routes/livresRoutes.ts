//% backend/src/routes/livresRouter.ts
//? Router Express pour les livres
// Toutes les routes sont préfixées par /api/v1/livres

import express from 'express';
const router = express.Router();

import * as controller from '../controllers/livresController.ts';

import validateLivre from '../middleware/validateLivre.ts';
// import validateRecherche from '../middleware/validateRecherche.ts';

import validateIdParam from '../middleware/validateIdParam.ts';
import asyncWrapper from '../middleware/asyncWrapper.ts';

//* Endpoints

// Récupérer tous les livres
// GET /api/v1/livres
router.get('/', asyncWrapper(controller.getLivres));

// Route de recherche (OPTIONNELS: filtres -> query params)
// GET /api/v1/livres/recherche?q=clean
router.get('/recherche', asyncWrapper(controller.queryLivres));
// router.get('/recherche',validateRecherche, asyncWrapper(controller.queryLivres));

// Détails d'un livre (id en param)
// GET /api/v1/livres/:id
router.get('/:id',validateIdParam, asyncWrapper(controller.getLivreById));

// Création d'un nouveau livre (données JSON -> body request)
// POST /api/v1/livres
router.post('/', validateLivre, asyncWrapper(controller.createLivre));

// Mise à jour d'un livre existant (id en param, données JSON -> body request)
// PUT /api/v1/livres/:id
router.put('/:id',validateIdParam, asyncWrapper(controller.updateLivre));

// Suppression d'un livre (id en param)
// DELETE /api/v1/livres/:id
router.delete('/:id',validateIdParam, asyncWrapper(controller.deleteLivre));

export default router;