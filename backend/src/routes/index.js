//% backend/src/routes/index.js
//? Point d'entrée des routes

import express from 'express';

// Import des controllers spécifiques de l'api
import { healthController } from '../controllers/healthController.js';

/**
 * Router - Classe pour définir et organiser les routes de l'application.
 * Cette classe regroupe les routes par fonctionnalité.
 */
export default class Router {
    constructor() {
        this.router = express.Router();

        //Instanciation des controllers
        this.healthController = healthController;

        // Initialisation des routes
        this.defineRoutes();
    }


    /**
    ** Fonction pour définir les routes de l'application. 
    */
    defineRoutes() {
        
        //* Endpoints Root de l'API ('/' + '/health')
        // Route de health check, prend en parametre req et res et les utilise dans le controller associé
        this.router.get('/health',(req, res) => this.healthController);
    }

    /**
     * Fournit l'objet Router de l'API
     *
     * @return {express.Router} - L'objet Router contenant les routes de l'API 
     * @memberof Router
     */
    getRouter() {
        return this.router;
    }
}
