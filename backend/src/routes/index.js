//% backend/src/routes/index.js
//? Point d'entrée des routes

import express from 'express';

// Import des routes spécifiques de l'api
import healthRouter from './healthRouter.js';

/**
 * Router - Classe pour définir et organiser les routes de l'application.
 * Cette classe regroupe les routes par fonctionnalité.
 */
export default class Router {
    constructor() {
        this.router = express.Router();
        // Initialisation des routes
        this.defineRoutes();
    }

    /**
    ** Fonction pour définir les routes de l'application
    */
    defineRoutes() {
        
        //* Endpoints de l'API
        // dirige les appels vers la route associé healthRouter
        this.router.use('/health',healthRouter);
    }

    /**
     * Fournit l'objet Router de l'API
     * Centralise les routes du serveur
     *  
     * @return {express.Router} - L'objet Router contenant les routes de l'API 
     * @memberof Router
     */
    getRouter() {
        return this.router;
    }
}
