//% backend/src/types/index.ts
//? Centralisation des types de l'application
// Usage : `import { Livre, Adherent, CreateEmpruntDto } from '../types/index.ts';`

// type documentation api Swagger
export * from './api.ts';

// types de données internes de l'application
export * from './livre.ts';
export * from './adherent.ts';
export * from './emprunt.ts';

// types de données PostgreSQL spécifiques
// ! non utilisé pour l'instant
// export * from './livre.pg.ts';
// export * from './adherent.pg.ts';
// export * from './emprunt.pg.ts';