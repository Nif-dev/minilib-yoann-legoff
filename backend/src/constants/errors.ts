//% backend/src/constants/errors.ts
//? Codes et messages d'erreurs centralisés

/**
 *  Objet contenant les codes et les messages d'erreurs communs de l'API
 * @property { () => { error: string; message: string; } }
 * @return - { error: string; message: string; }
 * @example *Utilisation dans un controller*
 * - {res.status(400).json({
 *     error: ERRORS.GENERIC().error,
 *     message: ERRORS.GENERIC().message });
 *    }
 */
export const ERRORS = {
    GENERIC: () => ({
        error: "INTERNAL_ERROR",
        message: "Une erreur interne est survenue",
    }),
    VALIDATION: () => ({
        error: "VALIDATION_ERROR",
        message: "Données invalides",
    }),
    REQUIRED_FIELD: (field: string) => ({
        error: "REQUIRED_FIELD",
        message: `Le champ ${field} est requis`,
    }),
    REQUIRED_FIELDS: () => ({
        error: "REQUIRED_FIELDS",
        message: `Un ou plusieurs champs sont requis`,
    }),
    INVALID_FIELD: (field: string) => ({
        error: "INVALID_FIELD",
        message: `Le champ ${field} est invalide`,
    }),
    INVALID_FIELDS: () => ({
        error: "INVALID_FIELDS",
        message: `Un ou plusieurs champs sont invalides`,
    }),
    RESOURCE_NOT_FOUND_ID: (resource: string, id: string | number) => ({
        error: "RESOURCE_NOT_FOUND",
        message: `${resource} avec l'ID ${id} non trouvé`,
    }),
    RESOURCES_NOT_FOUND: (resource: string) => ({
        error: "NO_RESOURCE_FOUND",
        message: `Aucun ${resource} trouvé`,
    }),
    UNAUTHORIZED: () => ({
        error: "UNAUTHORIZED",
        message: "Accès non autorisé",
    }),
    FORBIDDEN: () => ({
        error: "FORBIDDEN",
        message: "Action interdite",
    }),
    DUPLICATE: (resource: string) => ({
        error: `DUPLICATE_RESOURCE : "${resource}"`,
        message: `${resource} déjà existant`,
    }),
    RESOURCE_NOT_CREATED: (resource: string) => ({
        error: "RESOURCE_NOT_CREATED",
        message: `Aucun ${resource} créé`,
    }),
    RESOURCE_NOT_UPDATED: (resource: string) => ({
        error: "RESOURCE_NOT_UPDATED",
        message: `${resource} non mis à jour`,
    }),
    RESOURCE_NOT_DELETED: (resource: string) => ({
        error: "RESOURCE_NOT_DELETED",
        message: `${resource} non supprimé`,
    }),
};