//% frontend/src/services/api/empruntService.ts
//? Services API Emprunts

import type { ApiResponse, Emprunt, EmpruntAvecDetails, CreateEmpruntDTO } from '../../types';
import { apiRequest } from './api';

/**
* Requête de recherche de tous les emprunts
*/
export async function getEmprunts(): Promise<ApiResponse<EmpruntAvecDetails[]>> {
    return apiRequest<EmpruntAvecDetails[]>('/emprunts');
}

/**
*  Requête de recherche d'un emprunt unique par son id
* @param {number} id - id de l'emprunt recherché
*/
export async function getEmpruntByID(id: number): Promise<ApiResponse<EmpruntAvecDetails>> {
    return apiRequest<EmpruntAvecDetails>(`/emprunts/${id}`);
}

/**
*  Requête de création d'un emprunt 
* @param {CreateEmpruntDTO} data - données de l'emprunt
*/
export async function createEmprunt(data: CreateEmpruntDTO): Promise<ApiResponse<Emprunt>> {
    return apiRequest<EmpruntAvecDetails>('/emprunts', {
        method: 'post',
        body: JSON.stringify(data) });
}

/**
*  Requête de retour d'un emprunt, par l'id du livre
* @param {number} id - id du livre
*/
export async function retourEmprunt(id: number): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/emprunts/${id}/retour`, { method: 'put' });
}

/**
*  Requête de recherche de tous les emprunts en retard
*/
export async function getRetards (): Promise<ApiResponse<EmpruntAvecDetails[]>> {
    return apiRequest<EmpruntAvecDetails[]>('/emprunts/retards');
}