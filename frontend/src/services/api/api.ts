//% src/services/api/api.ts
//? Point d'entrée des services API, gestion des appels API


/** Configuration de l'URL de base et les headers communs */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

// todo Bonne pratique ? à voir avec El, différence entre traitement data seul ou corps réponse complet
// Type générique pour les appels API
import type { ApiResponse } from "../../types/api";


// Type générique pour uniformiser les réponses d'erreurs
// export interface ApiError {
//     success: false;
//     error: string;
//     message?: string;
//     champs?: string[];
// }

/**
* Fonction de base pour les appels API
* Effectue une requête HTTP vers l'API Minilib
* Lance une erreur si la requête contient une erreur gérée par l'API
* 
* @param { string } endpoint - Endpoint de l'API (chemin relatif ex : '/livres' ou '/adherents/:id')
* @param { object } options - Options de la requête HTTP ( method, corps, headers )
* @returns { Promise <T> } - Résultat de l'appel API
*/
export async function apiRequest <T>(endpoint: string, options?: RequestInit)
: Promise<ApiResponse<T>> {
    try{
        // Appel de l'API, factory de la requête
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json', ...options?.headers
            },
            ...options } // options peut contenir method, body, etc.
        );

        // Gestion de la non-réponse de l'API
        if (!response) {
            throw new Error(`Serveur indisponible`);
        }

        // Traitement de la réponse de l'API
        const apiResponse = (await response.json()) as ApiResponse<T>;
        
        //! TEMP - Logs console des erreurs renvoyées par l'API
        if (!apiResponse.success) {
            console.error(
                apiResponse.message ??
                apiResponse.error ??
                `Erreur API : ${response.status}`
            );
        }

        // Forward de la réponse API vers les services appelants
        return apiResponse;

    // Gestion des erreurs de l'API
    } catch (error) {
        // interception des cas type "Failed to fetch" / réseau
        if (error instanceof Error && error.message.includes("Failed to fetch")) {
                throw new Error("Serveur indisponible. Impossible de contacter l'API.");
        }
        // traitement des autres erreurs
        const msg = error instanceof Error ? error.message : "Erreur réseau inconnue.";
        throw new Error(msg);
    }

}