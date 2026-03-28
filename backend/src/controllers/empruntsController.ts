//% backend/src/routes/adherentsRoutes.js
//? Route de gestion des adhérents
// logique métier entre les routes et les données

// Import des types et fonctions du model
import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiResponseError, Emprunt, EmpruntAvecDetails }  from '../types/index.ts';

// Import des fonctions des models
import * as empruntsModel from '../models/empruntsModel.ts';

import { findDispoById } from '../models/livresModel.ts';

/**
* Retourne tous les emprunts en retard
* GET /api/v1/emprunts/retards
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <EmpruntAvecDetails[]> | ApiResponseError> }res - Réponse Express
* @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
*/
export const getRetards = async (
    req: Request, 
    res: Response <ApiResponse <EmpruntAvecDetails[]> | ApiResponseError>,
    next: NextFunction
) => {

    try{
        // appel de la fonction du model
        const retards = await empruntsModel.findRetards();
        res.status(200).json({ 
            success: true,
            total: retards.length,
            data: retards,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};

/**
* Retourne tous les emprunts
* GET /api/v1/emprunts
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <EmpruntAvecDetails[]> | ApiResponseError> } res - Résponse Express
 */
export const getEmprunts = async (
    req: Request, 
    res: Response <ApiResponse <EmpruntAvecDetails[]> | ApiResponseError>,
    next: NextFunction
) => {

    try{
        const emprunts = await empruntsModel.findAll();
        res.status(200).json({ 
            success: true,
            total: emprunts.length,
            data: emprunts,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};

/**
* Ajoute un nouvel emprunt
* POST /api/v1/emprunts
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <Emprunt> | ApiResponseError> } res - Résponse Express
*/
export const createEmprunt = async (
    req: Request, 
    res: Response <ApiResponse <Emprunt> | ApiResponseError>, 
    next: NextFunction
) => {

    try{

        const idLivre =req.body.livreId = Number(req.body.livreId);
        // vérification de la disponibilité du livre
        const livreDispo = await findDispoById(idLivre);
        if (!livreDispo) {
            res.status(400).json({ 
                error: 'Livre indisponible',
                message: 'Livre indisponible'
            });
            return;
        }
        // appel de la fonction du model
        const nouveau = await empruntsModel.create(req.body);
        if (!nouveau) {
            res.status(400).json({ 
                error: 'Emprunt non ajouté',
                message: 'Emprunt non ajouté'
            });
        } 
        res.status(201).json({
            success: true,
            data: nouveau
        });
        
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};