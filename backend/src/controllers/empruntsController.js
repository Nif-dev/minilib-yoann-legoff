//% backend/src/routes/adherentsRoutes.js
//? Route de gestion des adhérents
// logique métier entre les routes et les données

//! Import des types et fonctions du model
/** @import { Request, Response, NextFunction } from 'express'; */
/** @import { ApiResponse, ApiResponseError, EmpruntAvecDetails }  from '../types/index.js'; */
import * as empruntsModel from '../models/empruntsModel.js';

/**
* Retourne tous les emprunts en retard
* GET /api/v1/emprunts/retards
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <EmpruntAvecDetails[]> | ApiResponseError> } res - Résponse Express
*/
export const getRetards = async (req, res) => {

        const retards = await empruntsModel.findRetards();
        res.status(200).json({ 
            success: true,
            total: retards.length,
            data: retards,
        });
    
};

/**
* Retourne tous les emprunts
* GET /api/v1/emprunts
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <EmpruntAvecDetails[]> | ApiResponseError> } res - Résponse Express
 */
export const getEmprunts = async (req, res) => {

        const emprunts = await empruntsModel.findAll();
        res.status(200).json({ 
            success: true,
            total: emprunts.length,
            data: emprunts,
        });
    
};

/**
* Ajoute un nouvel emprunt
* POST /api/v1/emprunts
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <EmpruntAvecDetails> | ApiResponseError> } res - Résponse Express
*/
export const createEmprunt = async (req, res) => {

    // appel de la fonction du model
        const nouveau = await empruntsModel.create(req.body);
        res.status(201).json({
            success: true,
            data: nouveau
        });
    
};