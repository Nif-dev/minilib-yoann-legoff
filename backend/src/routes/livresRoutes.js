//% backend/src/routes/livresRouter.js
//? Router Express pour les livres
// Toutes les routes sont préfixées par /api/v1/livres

import express from 'express';
const router = express.Router();

import * as controller from '../controllers/livresController.js';

import validateLivre from '../middleware/validateLivre.js';

//* Endpoints

// Récupérer tous les livres (OPTIONNELS: filtres -> query params)
// GET /api/v1/livres
router.get('/', controller.getLivres);

// Détails d'un livre (id en param)
// GET /api/v1/livres/:id
router.get('/:id', controller.getLivreById);

// Création d'un nouveau livre (données JSON -> body request)
// POST /api/v1/livres
router.post('/', validateLivre, controller.createLivre);

// Mise à jour d'un livre existant (id en param, données JSON -> body request)
// PUT /api/v1/livres/:id
//? ici validateLivre oblige de renvoyer tout les champs du livre a la place d'une simple modif
// router.put('/:id', validateLivre, controller.updateLivre);  
router.put('/:id', controller.updateLivre);

// Suppression d'un livre (id en param)
// DELETE /api/v1/livres/:id
router.delete('/:id', controller.deleteLivre);

export default router;