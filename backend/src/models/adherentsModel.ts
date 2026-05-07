//% backend/src/models/adherentsModel.ts
//? Model de Adhérent, fonctions de manipulation des adhérents
//? Annotations TypeScript via JSDoc - compatible Node.js sans compilation 

/**
* Accès aux données adhérents via PostgreSQL.
* Toutes les fonctions sont async - elles retournent des promesses.
*
* @module adherentsModel
*/
import { QueryResult } from 'pg';
import pool from '../config/database.ts';

import { Adherent, CreateAdherentDTO, UpdateAdherentDTO } from '../types/index.ts'

/**
* Génère un numéro adhérent unique au format ADH-XXX.
* @async
* @returns {Promise <string> } Numéro adhérent (ADH-XXX)
*/
const genererNumeroAdherent = async ()
: Promise <string> => {
    // Récupère le nombre d'adhérents
    try {
        const result: QueryResult <{ count: string }> 
        = await pool.query(
            'SELECT COUNT(*) FROM adherents'
        );
        
        const count: number = Number.parseInt(result.rows[0].count) + 1;
        // ADH-XXX (numero adhérent)    
        return `ADH-${String(count).padStart(3, '0')}`;
    } catch (error) {
        throw new Error(`Génération du numéro adhérent échouée : ${error}`);
    }
};

/**
* Crée un nouvel adhérent avec numéro automatique.
* @async
* @param {CreateAdherentDTO} data - { nom, prenom, email }
* @returns {Promise <Adherent> } - Adhérent créé avec son id
*/
export const create = async (data: CreateAdherentDTO)
: Promise <Adherent> => {
    const numero: string = await genererNumeroAdherent();
    try{
        const result: QueryResult = await pool.query(
            `INSERT INTO adherents (numero_adherent, nom, prenom, email)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [numero, data.nom, data.prenom, data.email]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Création de l'adhérent ${data.nom} ${data.prenom} échouée : ${error}`);
    }
};

/** 
* Retourne tous les adhérents actifs de la base de données
* @async 
* @returns {Promise<Adherent[]>} Tous les adhérents actifs
*/
export const findAll = async ()
: Promise <Adherent[]> => {
    try{
        const result: QueryResult = await pool.query(
            'SELECT * FROM v_adherents WHERE actif = true ORDER BY numero_adherent'
        );
        return result.rows;
    } catch (error) {
        throw new Error(`Recherche de tous les adhérents actifs échouée : ${error}`);
    }
};

/**
* Trouve un adhérent par son id
* @async
* @param {number} id - id de l'adhérent recherché
* @returns {Promise<Adherent|null>} - Adhérent trouvé ou null si non trouvé
*/
export const findById = async (id: number)
: Promise <Adherent | null> => {
    try {
        const result: QueryResult = await pool.query(
            'SELECT * FROM v_adherents WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Recherche de l'adhérent ${id} échouée : ${error}`);
    }
};

/**
 * Trouve un adhérent par son email
 * @async
 * @param {Pick<Adherent, 'email'>} email - email de l'adhérent recherché depuis l'objet Adherent, avec destructuration
 * @returns {Promise<Adherent|null>} - Adhérent trouvé ou null si non trouvé
 */
export const findByEmail = async ({email}: Pick<Adherent, 'email'>) // email: string depuis l'interface
: Promise <Adherent | null> => {
    try{
        const result: QueryResult = await pool.query(
            'SELECT * FROM v_adherents WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Recherche de l'adhérent ${email} échouée : ${error}`);
    }
};

/**
* Modifie un adhérent existant par son id 
*
* @async
* @param {number} id - id de l'adhérent à modifier
* @param {UpdateAdherentDTO} data - champs à modifier
* @returns {Promise<Adherent | null>} - Adhérent modifié
*/
export const update = async (id: number, data: UpdateAdherentDTO)
: Promise <Adherent | null> => {
    // Construction de la requête - SET dynamique
    const champs = Object.keys(data);
    const valeurs = Object.values(data);
    try{
        if (champs.length === 0) return findById(id);
        // usage de champs dynamiques puis string interpolation dans la requête    
        const setClause = champs.map((champ, index) => `${champ} = $${index + 1}`).join(', ');
        const result = await pool.query(
            `UPDATE adherents SET ${setClause} WHERE id = $${champs.length + 1} RETURNING *`,
            [...valeurs, id]
        );
        // $$ pour indiquer que c'est une valeur dynamique - $1, $2, etc
        // SPREAD : on garde l'existant, on écrase avec les modifs
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Modification de l'adhérent ${id} échouée : ${error}`);
    }
};

/**
* Désactive un adhérent (soft delete — on ne supprime jamais en BDD).
* @async
* @param {number} id
* @returns {Promise<Adherent|null>} Adhérent rendu inactif ou null si non trouvé
*/
export const desactiver = async (id: number)
: Promise <Adherent | null> => {
    try{
        const result = await pool.query(
            'UPDATE adherents SET actif = false WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Désactivation de l'adhérent ${id} échouée : ${error}`);
    }
};