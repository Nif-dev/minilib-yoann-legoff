//% backend/src/controllers/adherentsController.js
//? Controller associé à la route adherentsRouter
// logique métier entre les routes et les données

//! Import des types et fonctions du model
/** @import { Request, Response, NextFunction } from 'express'; */
/** @import { ApiResponse, ApiResponseError, Adherent }  from '../types/index.js'; */
import * as adherentsModel from '../models/adherentsModel.js';

/** 
* Retourne tous les adhérents actifs de la base de données
* GET /api/v1/adherents
* 
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <Adherent[]> | ApiResponseError>} res - Résponse Express
*/
export const getAdherents = async (req, res) => {
    // appel de la fonction du model

        const adherents = await adherentsModel.findAll();
        res.status(200).json({ 
            success: true,
            data: adherents,
            total: adherents.length,
        });
    

};

/** 
* Retourne un adhérent par son id
* GET /api/v1/adherents/:id
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <Adherent | null> | ApiResponseError>} res - Résponse Express
*/
export const getAdherentById = async (req, res) => {
    // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) { // id est obligatoire
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['id'],
        });
    }
    if (Number.isNaN(Number(id))) { // id doit avoir un format numérique
        res.status(400).json({ 
            error: 'Champs id non numérique',
            champs: ['id'],
        });
    }
    // appel de la fonction du model

        const adherents = await adherentsModel.findById(Number(id));
        if (!adherents) {
            res.status(404).json({ 
                error: 'Adhérent non trouvé',
                message: `Adhérent non rencontré avec id : ${id}`
            });
        }
        res.status(200).json({
            success: true,
            data: adherents,
        });
    
};

/** 
* Création d'un nouvel adhérent
* POST /api/v1/adherents
* Body JSON attendu : { nom, prenom, email }
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <Adherent> | ApiResponseError>} res - Résponse Express
*/
export const createAdherent = async (req, res) => {
    //todo Corps de la requête validé via middleware sur adherentsRouter
    // Vérification params de la requêtes temp
    const champsManquants = [];
    if (!req.body.nom) {
        champsManquants.push('nom');
    }
    if (!req.body.prenom) {
        champsManquants.push('prenom');
    }
    if (!req.body.email) {
        champsManquants.push('email');
    }
    if (champsManquants.length > 0) {
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: champsManquants,
        });
    }

    // appel de la fonction du model
        const nouveau = await adherentsModel.create(req.body);
        res.status(201).json({
            success: true,
            data: nouveau
        });
    

};

/**
* Mise à jour d'un adhérent existant
* PUT /api/v1/adherents/:id
* Body JSON attendu : { nom, prenom, email }
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <Adherent> | ApiResponseError>} res - Résponse Express
*/
export const updateAdherent = async (req, res) => {

        // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) { // id est obligatoire
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['id'],
        });
    }
    if (Number.isNaN(Number(id))) { // id doit avoir un format numérique
        res.status(400).json({ 
            error: 'Champs id non numérique',
            champs: ['id'],
        });
    }
        // appel de la fonction du model
        const misAJour = await adherentsModel.update(Number(id), req.body);
        if (misAJour === null) {
            res.status(404).json({
                error: 'Adhérent non rencontré',
                message: `Adhérent non rencontré avec id : ${id}, mise à jour impossible`
            });
        } else {
            res.status(200).json({
                success: true,
                data: misAJour
            });
        }
    
};


/**
* Suppression** d'un adhérent
* DELETE /api/v1/adherents/:id
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <null> | ApiResponseError>} res - Résponse Express
*/
export const deleteAdherent = async (req, res) => {
    // validation temporaire de l'id de la requête
    const { id } = req.params;
    if (!id) { // id est obligatoire
        res.status(400).json({ 
            error: 'Champs manquants',
            champs: ['id'],
        });
    }
    if (Number.isNaN(Number(id))) { // id doit avoir un format numérique
        res.status(400).json({ 
            error: 'Champs id non numérique',
            champs: ['id'],
        });
    }

        const adherent = await adherentsModel.findById(Number(id));
        if (adherent) {
            adherentsModel.desactiver(Number(id));
            res.status(200).json(
                {
                    success: true,
                    data: null,
                    message: `Adhérent désactivé avec id : ${id}`
                }
            ); 
        } else {
            res.status(404).json({
                error: 'Adhérent non rencontré',
                message: `Adhérent non rencontré avec id : ${id}, désactivation impossible`
            });
        }

};