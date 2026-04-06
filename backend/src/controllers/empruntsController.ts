//% backend/src/routes/adherentsRoutes.ts
//? Route de gestion des adhérents
// logique métier entre les routes et les données

// Import des types et fonctions du model
import { Request, Response, NextFunction } from 'express';
import { ApiResponse, CreateEmpruntDTO, Emprunt, EmpruntAvecDetails,  }  from '../types/index.ts';
import { ERRORS } from '../constants/errors.ts';

// Import des fonctions des models
import * as empruntsModel from '../models/empruntsModel.ts';

import { findDispoById } from '../models/livresModel.ts';

/**
* Retourne tous les emprunts en retard
* GET /api/v1/emprunts/retards
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <EmpruntAvecDetails[]>> }res - Réponse Express
* @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
*/
export const getRetards = async (
    req: Request, 
    res: Response <ApiResponse <EmpruntAvecDetails[]>>,
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
* @param { Response <ApiResponse <EmpruntAvecDetails[]>> } res - Résponse Express
 */
export const getEmprunts = async (
    req: Request, 
    res: Response <ApiResponse <EmpruntAvecDetails[]>>,
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
* @param { Request <CreateEmpruntDTO> } req - Requête Express 
* @param { Response <ApiResponse <Emprunt>> } res - Résponse Express
*/
export const createEmprunt = async (
    req: Request <CreateEmpruntDTO>, 
    res: Response <ApiResponse <Emprunt>>, 
    next: NextFunction
) => {

    try{
        const requeteEmprunt: CreateEmpruntDTO = req.body;
        
        const idLivre =req.body.livre_id = Number(req.body.livre_id);
        // vérification de la disponibilité du livre
        const livreDispo = await findDispoById(idLivre);
        if (!livreDispo) {
            res.status(400).json({
                success: false,
                error: ERRORS.DUPLICATE('emprunt').error,
                message: ERRORS.DUPLICATE('emprunt').message + ', le livre est indisponible',
            });
            return;
        }

        const idAdherent = req.body.adherent_id = Number(req.body.adherent_id);
        // vérification de l'adherent / nombre d'emprunts
        const empruntsDeAdherent = await empruntsModel.countEmpruntByAdherent(idAdherent);

        if (!empruntsDeAdherent) {
            res.status(400).json({
                success: false,
                error: ERRORS.RESOURCE_NOT_FOUND_ID('adherent', idAdherent).error,
                message: ERRORS.RESOURCE_NOT_FOUND_ID('adherent', idAdherent).message + ', emprunt impossible',
            });
            return;
        }
        if (empruntsDeAdherent >= 3) {
            res.status(400).json({
                success: false,
                error: ERRORS.FORBIDDEN().error,
                message: ERRORS.FORBIDDEN().message + ` : L'adherent ${idAdherent} a ${empruntsDeAdherent} emprunts en cours`
            });
            return;
        }

        // appel de la fonction du model
        const nouveau = await empruntsModel.create(requeteEmprunt);
        if (!nouveau) {
            res.status(400).json({
                success: false,
                error: ERRORS.RESOURCE_NOT_CREATED('emprunt').error,
                message: ERRORS.RESOURCE_NOT_CREATED('emprunt').message
            });
        } 
        res.status(201).json({
            success: true,
            message: `Nouvel emprunt ajouté, l'adherent ${idAdherent} a maintenant ${empruntsDeAdherent+1} emprunts en cours`,
            data: nouveau,
        });
        
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};


export const retourLivre = async (
    req: Request <{id: string}>, 
    res: Response <ApiResponse <Emprunt>>, 
    next: NextFunction
) => {

    // Récupérer l'id de la requête, validation par middleware sur route
    const { id } = req.params;

    // id doit avoir un format numérique pour la requête
    const idNumber = Number(id);

    try{
        // appel de la fonction du model
        const retour = await empruntsModel.returnEmprunt(idNumber);
        if (retour === null) {
            res.status(400).json({
                success: false,
                error: ERRORS.RESOURCE_NOT_UPDATED('emprunt').error,
                message: ERRORS.RESOURCE_NOT_UPDATED('emprunt').message
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: `Livre retourné`,
            data: retour,
        });
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
}

export const getEmpruntById = async (
    req: Request <{id: string}>, 
    res: Response <ApiResponse <EmpruntAvecDetails>>, 
    next: NextFunction
) => {

    // Récupérer l'id de la requête, validation par middleware sur route
    const { id } = req.params;

    // id doit avoir un format numérique pour la requête
    const idNumber = Number(id);

    try{
        // appel de la fonction du model
        const emprunt = await empruntsModel.findById(idNumber);
        if (emprunt === null) {
            res.status(400).json({
                success: false,
                error: ERRORS.RESOURCE_NOT_FOUND_ID('emprunt', id).error,
                message: ERRORS.RESOURCE_NOT_FOUND_ID('emprunt', id).message
            });
            return;
        }
        if (emprunt.date_retour_effective)
        res.status(200).json({
            success: true,
            data: emprunt
        });
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
}