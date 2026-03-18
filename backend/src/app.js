//% backend/src/app.js
//? Point d'entrée du serveur Express

import express from 'express';
import cors from 'cors';



// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5173;

// ----------- Middlewares -----------------
app.use(cors());
app.use(express.json()); // Parse le body JSON des requêtes


// Middleware de logging minimaliste
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Requête ${req.method} depuis ${req.url}`);
    next();
});

// Middleware de gestion des erreurs serveur - 500
app.use((err, req, res, next) => {
    console.error('Erreur serveur:',err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});


// ----------- Routes -----------------
// Import du Router
//! je vais favoriser un import via routes/index.js, via middleware 
import apiRouter from './routes/index.js';

app.use('/api/v1', apiRouter);


// ----------- Lancement du serveur -----------------
app.listen(PORT, () => {
    console.log(`Serveur Minilib en ligne sur http://localhost:${PORT}`);
    console.log(`Environnement : ${process.env.NODE_ENV}`);
});

export default app;
