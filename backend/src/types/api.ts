//% backend/src/types/api.ts
//? Typage des réponses de l'API

/**
 * Wrapper / Interface pour toutes les réponses en sorties de l'API
 * (success, data, message, error)
*
* @interface ApiResponse
* @template T - Type de donnée attendu
 */
export interface ApiResponse<T> {
    data:       T;
    success?:   boolean;
    message?:   string;
    total?:     number; // pour les listes
}

export interface ApiResponseError {
    error:      string;
    champs?:    string[]; // champs manquants pour les 400
    message?:   string;
}