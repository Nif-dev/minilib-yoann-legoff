//% frontend/src/services/api/adherents.ts
//? Services API Adhérents

import type { ApiResponse, Adherent, CreateAdherentDTO, UpdateAdherentDTO } from '../../types';
import { apiRequest } from './api';

/**
*  Requête de recherche de tous les adhérents actifs
*/
export async function getAdherents()
: Promise <ApiResponse<Adherent[]>> {
    return apiRequest <Adherent[]> ('/adherents' );
}

/**
*  Requête de recherche d'un adhérent unique par son id

* @param {number} id - id de l'adhérent recherché
*/
export async function getAdherentByID ( 
    id: number 
) : Promise<ApiResponse<Adherent>> {
    return apiRequest<Adherent>(`/adherents/${id}`);
}

/**
*  Requête de création d'un nouvel adhérent
* @param {CreateAdherentDTO} data - données de l'adhérent
*/
export async function createAdherent( data: CreateAdherentDTO )
: Promise<ApiResponse<Adherent>> {
    return apiRequest<Adherent>('/adherents', {
        method: 'post',
        body: JSON.stringify(data) });
}
/**
*  Requête de mise à jour d'un adhérent existant
* @param {number} id - id de l'adhérent à modifier
* @param {UpdateAdherentDTO} data - nouvelles données de l'adhérent
*/
    export async function updateAdherent ( 
        id: number, 
        data:UpdateAdherentDTO
    ) : Promise<ApiResponse<Adherent>> {
    return apiRequest<Adherent>(`/adherents/${id}`, {
        method: 'put',
        body: JSON.stringify(data) });

}
/**
*  Requête de suppression d'un adhérent existant
* @param {number} id - id de l'adhérent à supprimer
*/
export async function deleteAdherent (id: number)
: Promise<ApiResponse<void>> {
    return apiRequest<void>(`/adherents/${id}`, { method: 'delete' });
}