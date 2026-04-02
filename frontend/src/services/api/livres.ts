//% frontend/src/services/api/livres.ts
//? Services API pour les livres

import type { ApiResponse, Livre, CreateLivreDTO, FiltresRechercheLivres } from '../../types';
import { apiRequest } from './api';

//? Usage dans un composant :
// const reponse = await getLivres({ genre: "roman", disponible: true });
// const livres = reponse.data;
// const totalLivres = reponse.total;

/**
 * Récupère tous les livres avec filtres optionnels.
 * @param { FiltresRechercheLivres } filtres - genre, disponible, recherche
 */
export async function getLivres(filtres: FiltresRechercheLivres = {}): Promise<ApiResponse<Livre[]>> {
    // Construire les query params depuis les filtres non-undefined
    const params = new URLSearchParams();
    if (filtres.genre) params.append("genre", filtres.genre);
    if (filtres.recherche) params.append("recherche", filtres.recherche);
    if (filtres.disponible !== undefined)
    params.append("disponible", String(filtres.disponible));

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Livre[]>(`/livres${query}`);
}
/**
 * Récupère un livre par son id.
 */
export async function getLivreById(id: number): Promise<ApiResponse<Livre>> {
    return apiRequest<Livre>(`/livres/${id}`);
}
/**
 * Crée un nouveau livre.
 * @param { CreateLivreDTO } data - Données de création
 */
export async function creerLivre(data: CreateLivreDTO): Promise<ApiResponse<Livre>> {
    return apiRequest<Livre>("/livres", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
/**
 * Supprime un livre.
 */
export async function supprimerLivre(id: number): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/livres/${id}`, { method: "DELETE" });
}