//% backend/src/controllers/adherentsController.js
//? Controller associé à la route adherentsRouter
// logique métier entre les routes et les données

import * as adherentsModel from '../models/adherentsModel.js';

/** 
* Retourne tous les adhérents actifs de la base de données
* GET /api/v1/adherents
* 
* @param {import ('express').Request} req - Requête Express 
* @param {import ('express').Response} res - Résponse Express
*/
export const getAdherents = async (req, res) => {

    try {
        const adherents = await adherentsModel.findAll();
        res.status(200).json({ total: adherents.length, adherents});
    
    } catch (err) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des adhérents', 
            error: err 
        });
    }
};

/** 
* Retourne un adhérent par son id
* GET /api/v1/adherents/:id
*
* @param {import ('express').Request} req - Requête Express
* @param {import ('express').Response} res - Résponse Express
*/
export const getAdherentById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Paramètre "id" obligatoire' });
    }

    try {
        const adherents = await adherentsModel.findById(id);
        res.status(200).json(adherents);
    
    } catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la récupération de l\'adhérent',
            error: err
        })
    }
};

/** 
* Création d'un nouvel adhérent
* POST /api/v1/adherents
* Body JSON attendu : { nom, prenom, email }
*
* @param {import ('express').Request} req - Requête Express
* @param {import ('express').Response} res - Résponse Express
*/
export const createAdherent = async (req, res) => {
    //todo Corps de la requête validé via middleware sur adherentsRouter
    // Vérification params de la requêtes temp
    if (!req.body.nom) {
        return res.status(400).json({ message: 'Paramètre "nom" obligatoire' });
    }
    if (!req.body.prenom) {
        return res.status(400).json({ message: 'Paramètre "prenom" obligatoire' });
    }
    if (!req.body.email) {
        return res.status(400).json({ message: 'Paramètre "email" obligatoire' });
    }

    try {
        const adherents = await adherentsModel.create(req.body);
        res.status(201).json(adherents);
    
    } catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la création de l\'adhérent',
            error: err
        })
    }
};

/**
* Mise à jour d'un adhérent existant
* PUT /api/v1/adherents/:id
* Body JSON attendu : { nom, prenom, email }
*
* @param {import ('express').Request} req - Requête Express
* @param {import ('express').Response} res - Résponse Express
*/
export const updateAdherent = async (req, res) => {
        
    console.log("🚀 ~ updateAdherent ~ updateAdherent: Lancement")

    //todo Corps de la requête validé via middleware sur adherentsRouter
    // Vérification params de la requêtes temp
    // if (!req.body.nom) {
    //     return res.status(400).json({ message: 'Paramètre "nom" obligatoire' });
    // }
    // if (!req.body.prenom) {
    //     return res.status(400).json({ message: 'Paramètre "prenom" obligatoire' });
    // }
    // if (!req.body.email) {
    //     return res.status(400).json({ message: 'Paramètre "email" obligatoire' });
    // }

    const { id } = req.params;
    //todo Corps de la requête validé via middleware sur adherentsRouter
    // Vérification params de la requêtes temp
    if (!id) {
        console.log("🚀 ~ updateAdherent ~ id:", id)
        return res.status(400).json({ message: 'Paramètre "id" obligatoire' });
    }

    try {
        const misAJour = await adherentsModel.update(id, req.body);
        if (misAJour === null) {
            res.status(404).json({ 
                message: `Adhérent non rencontré avec id : ${id}`  
            });
        }
        res.status(200).json(misAJour);
    
    } catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'adhérent',
            error: err
        })
    }
};


/**
* Suppression d'un adhérent
* DELETE /api/v1/adherents/:id
*
* @param {import ('express').Request} req - Requête Express
* @param {import ('express').Response} res - Résponse Express
*/
export const deleteAdherent = async (req, res) => {
    const { id } = req.params;
    //todo Corps de la requête validé via middleware sur adherentsRouter
    // Vérification params de la requêtes temp
    if (!id) {
        return res.status(400).json({ message: 'Paramètre "id" obligatoire' });
    }

    try {
        const adherent = await adherentsModel.findById(id);
        if (adherent) {
            adherentsModel.remove(req.params.id);
            res.status(204).json(); 
            //* JSON vide sinon bruno qui attend un retour va boucler... meme avec 204 (no content) - inattendu
        } else {
            res.status(404).json({ message: `Adhérent non rencontré avec id : ${id}` });
        }
    
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la suppression de l\'adhérent',
            error: error,
        });
    }
};