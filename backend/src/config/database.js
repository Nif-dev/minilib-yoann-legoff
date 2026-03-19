//% backend/src/config/database.js
//? Configuration de la base de données

/**
 * Pool de connexions PostgreSQL partagé dans toute l'application
 * 
 * @module database
*/
import pg from 'pg';
const { Pool } = pg;

// Config PostgreSQL via variables d'environnement
const pool = new Pool({
    host:               process.env.DB_HOST     || 'localhost',
    port:               process.env.DB_PORT     || 5432,
    database:           process.env.DB_NAME     || 'minilib',
    user:               process.env.DB_USER     || 'minilib_user',
    password:           process.env.DB_PASSWORD, 
    max:                10,
    idleTimeoutMillis:  30000,
});

// Logs de connexion / erreur si échec
pool.on('connect', () => {
    console.log('[DB] Pool PostgreSQL connecté');
});
pool.on('error', (err) => {
    console.error('[DB] Erreur connexion pool PostgreSQL', err.message);
});

export default pool;