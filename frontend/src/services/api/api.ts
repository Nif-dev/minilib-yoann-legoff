//% src/services/api/api.ts
//? Point d'entrée des services API, gestion des appels API


/** Configuration de l'URL de base et les headers communs */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

// todo Bonne pratique ? à voir avec El, différence entre traitement data seul ou corps réponse complet
// Type générique pour les appels API
import type { ApiResponse } from "../../types/api";


// Type générique pour uniformiser les réponses d'erreurs
export interface ApiError {
    erreur: string;
    champs?: string[];
}

/**
* Fonction de base pour les appels API
* Effectue une requête HTTP vers l'API Minilib
* Lance une erreur si la requête n'a pas abouti ( status 4xx ou 5xx )
* 
* @param { string } endpoint - Endpoint de l'API (chemin relatif ex : '/livres' ou '/adherents/:id')
* @param { object } options - Options de la requête HTTP ( method, corps, headers )
* @returns { Promise <T> } - Résultat de l'appel API
*/
export async function apiRequest <T>(endpoint: string, options?: RequestInit)
: Promise<ApiResponse<T>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json', ...options?.headers
            },
            ...options } // options peut contenir method, body, etc.
    );

    if (!response.ok) {
        const erreur: ApiError = await response.json().catch(() => ({
            erreur: `Erreur HTTP ${response.status}`,
        }));
    throw new Error(erreur.erreur);
    }

    return response.json() as Promise<ApiResponse<T>>;
}