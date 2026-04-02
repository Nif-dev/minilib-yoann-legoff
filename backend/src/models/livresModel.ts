//% backend/src/models/livresData.ts
//? Model de Livre, fonctions de manipulation des livres
//? Annotations TypeScript via JSDoc - compatible Node.js sans compilation 

/**
 * Accès aux données de livres via PostgreSQL
 * Toutes les fonctions sont async - elles retournent des promesses 
 * 
 * @module livresModel
 */
import { QueryResult } from 'pg';
import pool from "../config/database.ts";

import { Livre, CreateLivreDTO, FiltresRechercheLivres, UpdateLivreDTO } from '../types/index.ts';

/**
 * Création d'un livre
 *
 * @async
 * @param {CreateLivreDTO} newLivre - livre { isbn, titre, auteur, annee, genre }
 * @returns {Promise<Livre>} - Livre créé avec son id
 */
export const create = async (newLivre: CreateLivreDTO)
: Promise<Livre> => {
    try{
        const result: QueryResult = await pool.query(
            'INSERT INTO livres (isbn, titre, auteur, genre, annee) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [newLivre.isbn, newLivre.titre, newLivre.auteur, newLivre.genre, newLivre.annee]
        );
        // RETURNING * renvoie la ligne insérée, donc le livre créé avec son id ( SERIAL )
        return result.rows[0];
    } catch (error) {
        throw new Error(`Création du livre ${newLivre.titre} - ${newLivre.auteur} échouée : ${error}`);
    }
};

/**
 * Retourne tous les livres avec filtrage optionnel
 *
 * @async
 * @param {FiltresRechercheLivres} filtres - Critères de filtrage
 * @returns {Promise<Livre[]> } - Tableau de livres  
 */
export const findAll = async (filtres: FiltresRechercheLivres)
: Promise<Livre[]> => {
    const conditions: string[] = [];
    const valeurs: any[] = [];
    let idx = 1;

    if (filtres.genre !== undefined) {
        conditions.push(`genre ILIKE $${idx}`);
        valeurs.push(filtres.genre);
        idx++;
    }

    if (filtres.disponible !== undefined) {
        const dispo = filtres.disponible === 'true' || filtres.disponible === true;
        conditions.push(`disponible = $${idx}`);
        valeurs.push(dispo);
        idx++;
    }

    if (filtres.recherche !== undefined) {
        conditions.push(`(titre ILIKE $${idx} OR auteur ILIKE $${idx})`);
        valeurs.push(`%${filtres.recherche}%`);
        idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')} ` : '';
    console.log("🚀 ~ findAll ~ where:", where)
    // Envoi de la requête SQL dynamiquement
    try{
        const result: QueryResult = await pool.query(
            `SELECT * FROM livres ${where} ORDER BY titre`,
            valeurs
        );
        return result.rows;
    } catch (error) {
        throw new Error(`Recherche de tous les livres échouée : ${error}`);
    }
};

/**
 * Trouve un livre par son id
 *
 * @async
 * @param {number} id - Id du livre recherché
 * @returns {Promise<Livre | null>} - Livre trouvé ou null si non trouvé
 */
export const findById = async (id: number)
: Promise <Livre | null> => {
    try{
        const result: QueryResult = await pool.query(
            'SELECT * FROM livres WHERE id = $1', 
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Recherche du livre ${id} échouée : ${error}`);
    }
};

/**
 * Modifie un livre existant par son id
 *
 * @async
 * @param {number} id - id du livre à modifier
 * @param {UpdateLivreDTO} majLivre - champs à modifier
 * @returns {Promise<Livre | null>} - Livre modifié - null si non trouvé ou pas de champs à modifier / TEMP
 */
export const update = async (id: number, majLivre: UpdateLivreDTO)
: Promise <Livre | null> => {
    //Construction de la requête - SET dynamique
    const champs = Object.keys(majLivre);
    const valeurs = Object.values(majLivre);
    if (champs.length === 0) return findById(id);

    const setClause = champs.map((champ, index) => `${champ} = $${index + 1}`).join(', ');

    try{
        const result: QueryResult = await pool.query(
            `UPDATE livres SET ${setClause} WHERE id = $${champs.length + 1} RETURNING *`,
            [...valeurs, id]
        );
        // $$ pour indiquer que c'est une valeur dynamique - $1, $2, etc
        // SPREAD : on garde l'existant, on écrase avec les modifs
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Modification du livre ${id} échouée : ${error}`);
    }
};

/**
 * Supprime un livre par son id
 *
 * @async
 * @param {number} id - id du livre à supprimer
 * @returns {Promise<boolean>} - true si le livre est supprimé, sinon false (non trouvé)
 */
export const remove = async (id: number)
: Promise <boolean> => {
    try{
        const deleting: QueryResult = await pool.query(
            'DELETE FROM livres WHERE id = $1 RETURNING id',
            [id]
        );
        return deleting.rowCount === 1; 
        //? 1 ligne supprimée = true - 0 = false
    } catch (error) {
        throw new Error(`Suppression du livre ${id} échouée : ${error}`);
    }
};

/**
 * Trouve un livre par son isbn
 * Objectif éviter les doublons
 * 
 * @async
 * @param {string} isbn - isbn du livre à rechercher
 * @returns {Promise<Livre | null>} - Livre trouvé ou null si non trouvé
*/
export const findByISBN = async (isbn: string):
Promise <Livre | null> => {
    try{
        const result: QueryResult = await pool.query(
            'SELECT * FROM livres WHERE isbn = $1', 
            [isbn]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Recherche du livre ${isbn} échouée : ${error}`);
    }
};

/**
 * Trouve si un livre est disponible par son id
 * 
 * @async
 * @param {number} id - id du livre à rechercher
 * @returns {Promise<boolean>} - true si le livre est disponible, sinon false
*/
export const findDispoById = async (id: number)
: Promise <boolean> => {
    try{
        const result: QueryResult = await pool.query(
            'SELECT * FROM livres WHERE id = $1 AND disponible = true', 
            [id]
        );
        return (result.rowCount === 1) ;
        //? 1 ligne trouvée = true
    } catch (error) {
        throw new Error(`Recherche du livre ${id} échouée : ${error}`);
    }
};