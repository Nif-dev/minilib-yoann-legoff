//% frontend/src/services/api/adherents.ts
//? Services API Adhérents

import { apiCall } from './axios';

import type { Adherent, CreateAdherentDTO, UpdateAdherentDTO } from '../../types/api/index';

/**
* Requête de recherche de tous les adhérents
* 
* @returns {Promise<Adherent[]>} Liste des adhérents 
*/
export const getAdherents = 
()
: Promise <Adherent[]> => apiCall <Adherent[]> ({
    method: 'get', url: '/adherents' });

/**
* Requête de recherche d'un adhérent unique par son id
* 
* @param {number} id - id de l'adhérent recherché
* @returns {Promise<Adherent>} Adhérent trouvé
*/
export const getAdherent = 
( id: number )
: Promise<Adherent> => apiCall <Adherent> ({
    method: 'get', url: `/adherents/${id}` });

/**
* Requête de création d'un nouvel adhérent
* 
* @param {CreateAdherentDTO} data - données de l'adhérent
* @returns {Promise<Adherent>} Adhérent créé
*/
export const createAdherent = 
( data: CreateAdherentDTO )
: Promise<Adherent> => apiCall({ 
    method: 'post', url: '/adherents', data });

/**
* Requête de mise à jour d'un adhérent existant
* 
* @param {number} id - id de l'adhérent à modifier
* @param {UpdateAdherentDTO} data - nouvelles données de l'adhérent
* @returns {Promise<Adherent>} Adhérent modifié
*/
    export const updateAdherent = 
( id: number, data:UpdateAdherentDTO)
: Promise<Adherent> => apiCall({ 
    method: 'put', url: `/adherents/${id}`, data });

/**
* Requête de suppression d'un adhérent existant
* 
* @param {number} id - id de l'adhérent à supprimer
* @returns {Promise<void>} 
*/
export const deleteAdherent = 
(id: number)
: Promise<void> => apiCall({ 
    method: 'delete', url: `/adherents/${id}` });