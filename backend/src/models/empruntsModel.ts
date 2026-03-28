//% backend/src/models/empruntsModel.ts
//? Model de Emprunt, fonctions de manipulation des emprunts

/**
 * Accès aux données d'emprunts via PostgreSQL
 * Toutes les fonctions sont async - elles retournent des promesses 
 * 
 * @module empruntsModel
 */
import { QueryResult } from 'pg';
import pool from "../config/database.ts";

import { Emprunt, CreateEmpruntDTO, EmpruntAvecDetails } from '../types/index.ts';

/**
* Accès aux emprunts en retard
*  
* @async 
* @returns {Promise<EmpruntAvecDetails[]>} - Tous les emprunts en retard
*/ 
export const findRetards = async ()
: Promise <EmpruntAvecDetails[]> => {
    try{
        const result: QueryResult = await pool.query(`
            SELECT 
            emprunts.id, 
            livres.titre, 
            adherents.nom || ' ' || 
            adherents.prenom AS adherent,
            emprunts.date_retour_prevue,
            CURRENT_DATE - emprunts.date_retour_prevue AS jours_retard
            FROM emprunts
        JOIN livres         
            ON emprunts.livre_id = livres.id
        JOIN adherents      
            ON emprunts.adherent_id = adherents.id
        WHERE 
            emprunts.date_retour_effective IS NULL 
            AND emprunts.date_retour_prevue < CURRENT_DATE
        ORDER BY jours_retard DESC
        `);
        return result.rows;
    } catch (error) {
        throw new Error(`Recherche de tous les emprunts en retard échouée : ${error}`);
    }
};

/** 
* Accès à tous les emprunts
*  
* @async 
* @returns {Promise<EmpruntAvecDetails[]>} - Tous les emprunts 
 */
export const findAll = async ()
: Promise <EmpruntAvecDetails[]> => {
    try{

        const result = await pool.query(`
            SELECT 
                emprunts.id, 
                livres.titre, 
                adherents.nom || ' ' || 
                adherents.prenom AS adherent,
                emprunts.date_retour_prevue,
                CURRENT_DATE - emprunts.date_retour_prevue AS jours_retard
            FROM emprunts
            JOIN livres         
                ON emprunts.livre_id = livres.id
            JOIN adherents      
                ON emprunts.adherent_id = adherents.id
            ORDER BY emprunts.id
            `);
        return result.rows;
    } catch (error) {
        throw new Error(`Recherche de tous les emprunts échouée : ${error}`);
    }
};

/**
 * Création d'un nouvel emprunt
 * 
 * @param {CreateEmpruntDTO} newEmprunt 
 * @returns 
 */
export const create = async (newEmprunt: CreateEmpruntDTO)
: Promise <Emprunt> => {
    try{
        const returnDate = new Date(Date.now() + 7*24*60*60*1000); // 7 jours de délai
        const result = await pool.query(
            'INSERT INTO emprunts (livre_id, adherent_id, date_retour_prevue) VALUES ($1, $2, $3) RETURNING *',
            [newEmprunt.livre_id, newEmprunt.adherent_id, returnDate]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`Création de l'emprunt ${newEmprunt.livre_id} - ${newEmprunt.adherent_id} échouée : ${error}`);
    }
};