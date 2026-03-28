//% backend/src/routes/apiDocRouter.js
//? Point d'entrée de la documentation Swagger OpenAPI

import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

try {
    const openapiPath = path.join(__dirname, '../../openapi.yaml');
    const yamlContent = readFileSync(openapiPath, 'utf8');
    const openapiSpec = yaml.load(yamlContent);
    /** @ts-ignore tslint pb surcharge */
    router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
    
} catch (error) {
    /** @type {Error} error */
    console.error('Swagger init failed:', error);
    // Fallback
    router.get('/docs', (req, res) => {
        res.status(500).json({ error: 'Swagger non disponible' });
    });
}

export default router;