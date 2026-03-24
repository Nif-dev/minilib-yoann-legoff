//% backend/src/routes/adherentsRoutes.js
//? Route de gestion des adhérents
// logique métier entre les routes et les données

import * as empruntsModel from '../models/empruntsModel.js';

/**
* Retourne tous les emprunts en retard
* GET /api/v1/emprunts/retards
*
* @param {import ('express').Request} req - Requête Express 
* @param {import ('express').Response} res - Résponse Express
*/
export const getRetards = async (req, res) => {
    try {
        console.log('getRetards');
        const retards = await empruntsModel.findRetards();
        res.status(200).json({ total: retards.length, retards});
    
    } catch (err) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des retards', 
            error: err 
        });
    }
};