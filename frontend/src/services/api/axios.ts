//% src/services/api/axios.ts
//? Configuration de l'instance Axios, gestion des appels API

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/** Configuration de l'instance centrale Axios */
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

/** Intercepteur pour la gestion d'erreur liées aux requêtes API */
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

/** Helper générique : typé + retourne data direct */
export const apiCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
};


//? Usage dans un service API : 
// export const getAdherents = ()
//: Promise <Adherent[]> => apiCall <Adherent[]> ({ method: 'get', url: '/adherents' });
export default api;
