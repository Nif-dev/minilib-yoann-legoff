//% backend/src/app.ts
//? Point d'entrée du serveur Express

import express from 'express';
import cors from 'cors';

import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ERRORS } from './constants/errors.ts';

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5173;

// ----------- Middlewares -----------------
app.use(cors());
app.use(express.json()); // Parse le body JSON des requêtes


/**
 * Middleware de logging minimaliste
 * 
 * @param { Request } req - Requête Express
 * @param { Response } res - Résponse Express
 * @param { NextFunction } next - Fonction de rappel pour passer au middleware suivant
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toLocaleString()}] Requête ${req.method} depuis ${req.url}`);
    next();
});

/**
 * Middleware de gestion des erreurs serveur - 500
 * 
 * @param { Error } err - Erreur serveur
 * @param {Request } req - Requête Express
 * @param { Response } res - Résponse Express
 * @param { NextFunction } next - Fonction de rappel pour passer au middleware suivant
 * @type { ErrorRequestHandler }
 */
const errorHandler: ErrorRequestHandler = (err:Error, req:Request, res:Response<ApiResponse<null>>, next: NextFunction) => {
    console.error('Erreur serveur:', err.message);
    //* Obfuscation des erreurs en sortie d'API - pas d'exposition de données sensibles
    res.status(500).json({ 
        success: false,
        error: ERRORS.GENERIC().error,
        message: ERRORS.GENERIC().message,
    });
}


// ----------- Routes -----------------
//* Import du Router - routes/index.ts, regroupant les routes de l'api par domains
import apiRouter from './routes/index.ts';

app.use('/api/v1', apiRouter);

// Import de la documentation Swagger OpenAPI, route unique
import apiDocRouter from './routes/apiDocRouter.js';
import { ApiResponse } from './types/api.ts';
app.use('/api', apiDocRouter);

// ----------- Middleware de gestion des erreurs -----------------
app.use(errorHandler);
// ----------- Lancement du serveur -----------------
app.listen(PORT, () => {
    console.log(`Serveur Minilib en ligne sur http://localhost:${PORT}`);
    console.log(`Environnement : ${process.env.NODE_ENV}`);
});

export default app;
