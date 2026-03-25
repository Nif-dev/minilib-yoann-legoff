//% backend/src/models/adherentsModel.js
//? Model de Adhérent, fonctions de manipulation des adhérents
//? Annotations TypeScript via JSDoc - compatible Node.js sans compilation 

/**
* Accès aux données adhérents via PostgreSQL.
* Toutes les fonctions sont async - elles retournent des promesses.
*
* @module adherentsModel
*/
import pool from '../config/database.js';

/** @import { Adherent, CreateAdherentDTO, UpdateAdherentDTO } from '../types/index.js'*/

/**
* Génère un numéro adhérent unique au format ADH-XXX.
* @async
* @returns {Promise <string> } Numéro adhérent (ADH-XXX)
*/
const genererNumeroAdherent = async () => {
    // Récupère le nombre d'adhérents
    const result = await pool.query(
        'SELECT COUNT(*) FROM adherents'
    );
    
    const count = Number.parseInt(result.rows[0].count) + 1;
    
    return `ADH-${String(count).padStart(3, '0')}`;
};

/**
* Crée un nouvel adhérent avec numéro automatique.
* @async
* @param {CreateAdherentDTO} data - { nom, prenom, email }
* @returns {Promise <Adherent> } - Adhérent créé avec son id
*/
export const create = async (data) => {
    const numero = await genererNumeroAdherent();
    const result = await pool.query(
        `INSERT INTO adherents (numero_adherent, nom, prenom, email)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [numero, data.nom, data.prenom, data.email]
    );
    return result.rows[0];
};

/** 
* Retourne tous les adhérents actifs de la base de données
* @async 
* @returns {Promise<Adherent[]>} Tous les adhérents actifs
*/
export const findAll = async () => {
    const result = await pool.query(
        'SELECT * FROM adherents WHERE actif = true ORDER BY numero_adherent'
    );
    return result.rows;
};

/**
* Trouve un adhérent par son id
* @async
* @param {number} id - id de l'adhérent recherché
* @returns {Promise<Adherent|null>} - Adhérent trouvé ou null si non trouvé
*/
export const findById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM adherents WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

/**
* Modifie un adhérent existant par son id 
*
* @async
* @param {number} id - id de l'adhérent à modifier
* @param {UpdateAdherentDTO} data - champs à modifier
* @returns {Promise<Adherent | null>} - Adhérent modifié
*/
export const update = async (id, data) => {
    // Construction de la requête - SET dynamique
    const champs = Object.keys(data);
    const valeurs = Object.values(data);
    if (champs.length === 0) return findById(id);

    const setClause = champs.map((champ, index) => `${champ} = $${index + 1}`).join(', ');
    const result = await pool.query(
        `UPDATE adherents SET ${setClause} WHERE id = $${champs.length + 1} RETURNING *`,
        [...valeurs, id]
    );
    // $$ pour indiquer que c'est une valeur dynamique - $1, $2, etc
    // SPREAD : on garde l'existant, on écrase avec les modifs
    return result.rows[0] || null;
};

/**
* Désactive un adhérent (soft delete — on ne supprime jamais en BDD).
* @async
* @param {number} id
* @returns {Promise<Adherent|null>} Adhérent rendu inactif ou null si non trouvé
*/
export const desactiver = async (id) => {
    const result = await pool.query(
        'UPDATE adherents SET actif = false WHERE id = $1 RETURNING *',
        [id]
    );
return result.rows[0] || null;
};