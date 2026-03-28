//% backend/src/routes/healthRoute.ts
//? Route de health check du serveur

// Import des types 
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.ts';

/**
 * Route de health check du serveur
 * 
 * @param { Request } req - Requête Express
 * @param { Response <ApiResponse <any>> } res - Réponse Express
 * @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
 */
const healthController = (
    req: Request, 
    res: Response <ApiResponse<{ timestamp: string; }>>,
    next: NextFunction
) => {

    try{
        // création de la réponse ping / health check
        res.status(200).json({ 
            success: true,
            message: 'Le serveur, il est vivant !',
            data: {
                timestamp: new Date().toISOString(),
            }
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
}

export default healthController;