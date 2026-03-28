//% backend/src/controllers/adherentsController.js
//? Controller associé à la route adherentsRouter
// logique métier entre les routes et les données

// Import des types et fonctions du model
import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiResponseError, Adherent, CreateAdherentDTO, UpdateAdherentDTO }  from '../types/index.ts';

// Import des fonctions du model
import * as adherentsModel from '../models/adherentsModel.ts';

/** 
* Retourne tous les adhérents actifs de la base de données
* GET /api/v1/adherents
* 
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <Adherent[]> | ApiResponseError>} res - Résponse Express
* @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
*/
export const getAdherents = async (
    req: Request, 
    res: Response <ApiResponse <Adherent[]> | ApiResponseError>, 
    next: NextFunction
) => {
    
    try{
        // appel de la fonction du model
        const adherents: Adherent[] = await adherentsModel.findAll();
        res.status(200).json({ 
            success: true,
            total: adherents.length,
            data: adherents,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};

/** 
* Retourne un adhérent par son id
* GET /api/v1/adherents/:id
*
* @param { Request< { id: string } > } req - Requête Express 
* @param { Response <ApiResponse <Adherent | null> | ApiResponseError>} res - Réponse Express
* @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
*/
export const getAdherentById = async (
    req: Request< { id: string } >, 
    res: Response <ApiResponse <Adherent | null> | ApiResponseError>,
    next: NextFunction
) => {
    
    // Récupérer l'id de la requête, validation par middleware sur route
    const { id } = req.params;

    // id doit avoir un format numérique pour la requête
    const idNumber = Number(id);
    
    try{
        // appel de la fonction du model
        const adherents = await adherentsModel.findById(idNumber);
        if (!adherents) {
            res.status(404).json({ 
                error: 'Adhérent non trouvé',
                message: `Adhérent non rencontré avec id : ${id}`
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: adherents,
        });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};

/** 
* Création d'un nouvel adhérent
* POST /api/v1/adherents
* Body JSON attendu : { nom, prenom, email }
*
* @param { Request <CreateAdherentDTO> } req - Requête Express 
* @param { Response <ApiResponse <Adherent> | ApiResponseError>} res - Réponse Express
* @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
*/
export const createAdherent = async (
    req: Request <CreateAdherentDTO>, 
    res: Response <ApiResponse <Adherent> | ApiResponseError>,
    next: NextFunction
) => {

    // Récupérer les données de la requête
    const nouveauData: CreateAdherentDTO = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
    };
    const emailCheck: Pick<CreateAdherentDTO, 'email'> = {
        email: req.body.email,
    };

    try{
        // Vérification doublons email
        const doublonEmail: Adherent | null = await adherentsModel.findByEmail(emailCheck);
        if (doublonEmail) {
            res.status(409).json({
                error: 'Email déjà utilisé',
                message: `Doublon email : ${nouveauData.email}`,
            });
            return;
        }
        // appel de la fonction du model
        const nouveau: Adherent = await adherentsModel.create(nouveauData);
        res.status(201).json({
            success: true,
            data: nouveau
        });
    
    } catch (error) {
        console.log('[CTRL] Erreur lors de la création d\'un adhérent', error);
        return next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};

/**
* Mise à jour d'un adhérent existant
* PUT /api/v1/adherents/:id
* Body JSON attendu : { nom, prenom, email }
*
* @param { Request < { id: string }, UpdateAdherentDTO> } req - Requête Express 
* @param { Response <ApiResponse <Adherent> | ApiResponseError>} res - Réponse Express
* @param { NextFunction } next - Fonction de rappel / middleware gestion des erreurs globales
*/
export const updateAdherent = async (
    req: Request < { id: string }, UpdateAdherentDTO >, 
    res: Response,
    next: NextFunction
) => {

    // Récupérer l'id de la requête, validation par middleware sur route
    const { id } = req.params;

    // id doit avoir un format numérique pour la requête
    const idNumber = Number(id);
    
    // Récupérer les données de la requête
    const misAJourData: UpdateAdherentDTO = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
    };
    
    try{
        // appel de la fonction du model
        const misAJour: Adherent | null = await adherentsModel.update(idNumber, misAJourData);
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
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
    
};


/**
* Suppression** d'un adhérent
* DELETE /api/v1/adherents/:id
*
* @param { Request } req - Requête Express 
* @param { Response <ApiResponse <null> | ApiResponseError>} res - Résponse Express
*/
export const deleteAdherent = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    // Récupérer l'id de la requête, validation par middleware sur route
    const { id } = req.params;

    // id doit avoir un format numérique pour la requête
    const idNumber = Number(id);

    try{
        // appel de la fonction du model
            const supprime: Adherent | null = await adherentsModel.desactiver(idNumber);
            if (supprime === null) {
                res.status(404).json({
                    error: 'Adhérent non rencontré',
                    message: `Adhérent non rencontré avec id : ${id}, désactivation impossible`
                });
            }
            res.status(200).json({
                success: true,
                data: null,
                message: `Adhérent désactivé avec id : ${id}`
            });
    
    } catch (error) {
        next(error as Error); // Envoi de l'erreur au middleware suivant
    }
};