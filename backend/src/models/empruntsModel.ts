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
                livres.titre AS titre_livre, 
                adherents.nom || ' ' || adherents.prenom AS nom_adherent,
                emprunts.date_retour_prevue,
                CURRENT_DATE > emprunts.date_retour_prevue AS en_retard,
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
                livres.titre                                AS titre_livre, 
                adherents.nom || ' ' || adherents.prenom    AS nom_adherent,
                emprunts.date_retour_prevue,
                CURRENT_DATE > emprunts.date_retour_prevue  AS en_retard
            FROM emprunts
            JOIN livres         
                ON emprunts.livre_id = livres.id
            JOIN adherents      
                ON emprunts.adherent_id = adherents.id
            WHERE emprunts.date_retour_effective IS NULL
            ORDER BY emprunts.id
            `);
        return result.rows;
    } catch (error) {
        throw new Error(`Recherche de tous les emprunts échouée : ${error}`);
    }
};


export const countEmpruntByAdherent = async (adherentId: number)
: Promise <number> => {
    try{
        const result: QueryResult = await pool.query(`
            SELECT COUNT(*) AS nb_emprunts
            FROM emprunts
            WHERE adherent_id = $1
            AND date_retour_effective IS NULL
        `, [adherentId]);
        return result.rows[0].nb_emprunts;
    } catch (error) {
        throw new Error(`Recherche du nombre d'emprunts de l'adherent ${adherentId} échouée : ${error}`);
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

        // Création de l'emprunt
        const result = await pool.query(`
            INSERT INTO emprunts (livre_id, adherent_id, date_retour_prevue)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [newEmprunt.livre_id, newEmprunt.adherent_id, returnDate]);
        
        // Si la requête échoue
        if (result.rowCount === 0) throw new Error('Création de l\'emprunt impossible');

        // Passage du livre en indisponible
        await pool.query(`
            UPDATE livres
            SET disponible = false
            WHERE id = $1
        `, [newEmprunt.livre_id]);
        return result.rows[0];

    } catch (error) {
        throw new Error(`Création de l'emprunt échouée : ${error}`);
    }
};

export const findById = async (id: number)
: Promise <EmpruntAvecDetails | null> => {
    try{
        // Recherche de l'emprunt
        const result: QueryResult = await pool.query(`
            SELECT 
                emp.*, 
                livres.titre                                AS titre_livre, 
                adherents.nom || ' ' || adherents.prenom    AS adherent,
                CASE
                    WHEN emp.date_retour_effective IS NULL THEN 'en_cours'
                    WHEN CURRENT_DATE > emp.date_retour_prevue THEN 'en_retard'
                    ELSE 'rendu'
                END                                         AS statut,
                CASE
                    WHEN emp.date_retour_effective IS NULL 
                        AND CURRENT_DATE > emp.date_retour_prevue 
                    THEN CURRENT_DATE - emp.date_retour_prevue
                    ELSE NULL
                END                                         AS jours_retard
            FROM emprunts emp
            JOIN livres
                ON emp.livre_id = livres.id
            JOIN adherents
                ON emp.adherent_id = adherents.id
            WHERE emp.id = $1
        `, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Recherche de l'emprunt ${id} échouée : ${error}`);
    }
};


export const returnEmprunt = async (id: number)
: Promise <Emprunt | null> => {
    try{
        // Retour de l'emprunt
        const result: QueryResult = await pool.query(`
            UPDATE emprunts
            SET date_retour_effective = CURRENT_DATE
            WHERE id = $1
            AND date_retour_effective IS NULL
            RETURNING *
        `, [id]);
        if (result.rowCount === 0) return null
        
        // Passage du livre en disponible
        await pool.query(`
            UPDATE livres
            SET disponible = true
            WHERE id = $1
        `, [result.rows[0].livre_id]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Retour de l'emprunt ${id} échoué : ${error}`);
    }
};