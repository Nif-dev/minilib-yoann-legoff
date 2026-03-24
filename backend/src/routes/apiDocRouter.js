//% backend/src/routes/index.js
//? Point d'entrée de la documentation Swagger OpenAPI

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';

const router = express.Router();
// CHEMIN ABSOLU pour test
const openapiPath = '/home/nif-dev/dev/www/minilib-yoann-legoff/backend/openapi.yaml';
console.log('🔍 Test chemin :', openapiPath);

const openapiSpec = yaml.load(readFileSync(openapiPath, 'utf8'));

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
export default router;