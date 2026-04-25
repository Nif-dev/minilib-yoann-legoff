//% frontend/src/services/api/livres.ts
//? Services API pour les livres

import type { ApiResponse, Livre, CreateLivreDTO, FiltresRechercheLivres, UpdateLivreDTO } from '../../types';
import { apiRequest } from './api';

//? Usage dans un composant :
//* exemple :
// const reponse = await getLivres({ genre: "roman", disponible: true });
//* la réponse est de type ApiResponse<T>, ici T = Livre[], 
//* ce qui permet d'accéder à tout les éléments de la réponse de l'API
// const livres = reponse.data;
// const totalLivres = reponse.total;

/**
 *  Requête de recherche de tous les livres
 */
export async function getLivres()
: Promise<ApiResponse<Livre[]>> {
    return apiRequest<Livre[]>(`/livres`);
}

/**
 *  Requête de récuperation de livres par une recherche, filtres
 * @param { FiltresRechercheLivres } filtres - genre, disponible, recherche
 */
export async function queryLivres(
    filtres: FiltresRechercheLivres
) : Promise<ApiResponse<Livre[]>> {
// Construire les query params depuis les filtres 'non-undefined'
    const params = new URLSearchParams();
    if (filtres.genre) params.append("genre", filtres.genre);
    if (filtres.recherche) params.append("recherche", filtres.recherche);
    if (filtres.disponible  !== undefined) params.append("disponible", String(filtres.disponible));

    const query = params.toString()
        ? `?${params.toString()}` 
        : "" 
    ;
    
    return apiRequest<Livre[]>(`/livres/recherche${query}`);
}

/**
 *  Requête de récupération d'un livre par son id.
 * @param { number } id - id du livre rechercher
 */
export async function getLivreById(
    id: number
) : Promise<ApiResponse<Livre>> {
    return apiRequest<Livre>(`/livres/${id}`);
}

/**
 *  Requête de création d'un nouveau livre.
 * @param { CreateLivreDTO } data - Données de création
 */
export async function createLivre(
    data: CreateLivreDTO
) : Promise<ApiResponse<Livre>> {
    return apiRequest<Livre>("/livres", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 *  Requête de modification d'un livre existant.
 * @param { number } id - id du livre à modifier
 * @param { UpdateLivreDTO } data - Données de modification
 */
export async function updateLivre(
    id: number, 
    data: UpdateLivreDTO
): Promise<ApiResponse<Livre>> {
    return apiRequest<Livre>(`/livres/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

/**
 *  Requête de suppression d'un livre.
 * @param { number } id - id du livre à supprimer
 */
export async function deleteLivre(
    id: number
) : Promise<ApiResponse<void>> {
    return apiRequest<void>(`/livres/${id}`, { method: "DELETE" });
}