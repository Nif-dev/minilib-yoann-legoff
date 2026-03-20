//% backend/src/models/adherentsModel.js
//? Model de Adhérent, fonctions de manipulation des adhérents

/**
* Accès aux données adhérents via PostgreSQL.
* Toutes les fonctions sont async - elles retournent des promesses.
*
* @module adherentsModel
*/
import pool from '../config/database.js';

/**
* Génère un numéro adhérent unique au format ADH-XXX.
* @async
* @returns {Promise<string>} Numéro adhérent (ADH-XXX)
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
* Retourne tous les adhérents actifs de la base de données
* @async 
* @returns {Promise<Array>} Tous les adhérents actifs
*/
export const findAll = async () => {
    const result = await pool.query(
        'SELECT * FROM adherents WHERE actif = true ORDER BY nom, prenom'
    );
    return result.rows;
};

/**
* Trouve un adhérent par son id
* @async
* @param {number} id - id de l'adhérent recherché
* @returns {Promise<Object|null>} - Adhérent trouvé ou null si non trouvé
*/
export const findById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM adherents WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

/**
* Crée un nouvel adhérent avec numéro automatique.
* @async
* @param {Object} data - { nom, prenom, email }
* @returns {Promise<Object>} Adhérent créé
*/
export const create = async ({ nom, prenom, email }) => {
const numero = await genererNumeroAdherent();
const result = await pool.query(
`INSERT INTO adherents (numero_adherent, nom, prenom, email)
VALUES ($1, $2, $3, $4) RETURNING *`,
[numero, nom, prenom, email]
);
return result.rows[0];
};

/**
* Désactive un adhérent (soft delete — on ne supprime jamais en BDD).
* @async
* @param {number} id
* @returns {Promise<Object|null>} Adhérent mis à jour
*/
export const desactiver = async (id) => {
    const result = await pool.query(
        'UPDATE adherents SET actif = false WHERE id = $1 RETURNING *',
        [id]
    );
return result.rows[0] || null;
};