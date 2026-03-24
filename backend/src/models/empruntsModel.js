//% backend/src/models/empruntsModel.js
//? Model de Emprunt, fonctions de manipulation des emprunts

/**
 * Accès aux données d'emprunts via PostgreSQL
 * Toutes les fonctions sont async - elles retournent des promesses 
 * 
 * @module empruntsModel
 */
import pool from "../config/database.js";

/**
* Accès aux emprunts en retard
*  
* @async 
* @returns {Promise<Array>} - Tous les emprunts en retard
*/ 
export const findRetards = async () => {
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
        WHERE 
            emprunts.date_retour_effective IS NULL 
            AND emprunts.date_retour_prevue < CURRENT_DATE
        ORDER BY jours_retard DESC
`);
    return result.rows;
};