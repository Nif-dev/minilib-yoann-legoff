//% src/hooks/useAdherents.ts
// ? Hook de gestion des adherents

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { ApiResponse, Adherent, CreateAdherentDTO, UpdateAdherentDTO  } from '../types';
import { getAdherents, createAdherent, updateAdherent, deleteAdherent } from '../services/api/adherentService';

/**
 *  Hook centralisant les valeurs et actions concernant les adhérents
 * @property adherents <Adherent[]> -- Liste des adhérents
 * @property erreur <string> -- Message d'erreur pour feedback
 * @property chargement <boolean> -- Etat de chargement des adhérents
 * @property message <string> -- Message d'information pour feedback
 * @property champsErreurs <string[]> -- Liste des champs ayant des erreurs de validation
 * @function resetFeedback -- Fonction de remise à zéro des feedback

 * @private setters -- Fonctions privées de mise à jour des valeurs dans le contexte
 * - évitant de modifier directement les valeurs dans le contexte depuis les composants

 * @function chargerAdherents <Promise<ApiResponse<Adherent[]>>> -- Fonction de chargement des adhérents
 * @function chargerAdherent <Promise<ApiResponse<Adherent>>> -- Fonction de chargement d'un adhérent
 * @function ajouterAdherent <Promise<ApiResponse<Adherent>>> -- Fonction d'ajout d'un adhérent
 * @function modifierAdherent <Promise<ApiResponse<Adherent>>> -- Fonction de modification d'un adhérent
 * @function supprimerAdherent <Promise<ApiResponse<void>>> -- Fonction de suppression d'un adhérent
 */
export const useAdherents = () => {
    const context = useContext(AppContext);
    if (!context.emprunts) throw new Error('useAdherents doit être dans AppProvider');

    // *adherents* est transmis/accessibles,aux composants utilisant le contexte via les hooks, mais pas le *set* - reste privé pour éviter des mutations directes
    const { adherents, setAdherents } = context;

     // States locaux pour feedback (exposés aux composants enfants) - mais pas les setters
    const [erreur, setErreur] = useState<string | null>(null);
    const [chargement, setChargement] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [champsErreurs, setChampsErreurs] = useState<string[]>([]);

    /**
     *  Fonction de remise à zéro du feedback API
     * @function setErreur(null)
     * @function setMessage(null)
     * @function setChampsErreurs([]) -- vide
     */
    const resetFeedback = () => {
        setErreur(null);
        setMessage(null);
        setChampsErreurs([]);
    };

    //? Actions isolées -- spécifiques aux adhérents
    /**
     *  Chargement des adhérents depuis l'API
     * @function setAdherents(response.data)
     * @return {Promise<ApiResponse<Adherent[]>>}
     */
    const chargerAdherents = async ()
    :Promise<ApiResponse<Adherent[]>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await getAdherents();
            if (response.success) {
                setAdherents(response.data ?? []);
                setMessage(response.message || 'Adhérents chargés');
            } else {
                setErreur(response.error || 'Échec chargement');
            }
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    };

    /**
     *  Ajout d'un nouvel adhérent via l'API
     *  - mutation locale et serveur si action réussie
     * @param {CreateAdherentDTO} dto - Données de l'adhérent à créer 
     * @returns {Promise<ApiResponse<Adherent>>} Résultat de la requête
     */
    const ajouterAdherent = async ( dto: CreateAdherentDTO )
    : Promise<ApiResponse<Adherent>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await createAdherent(dto);
            if (!response.success || !response.data) {
                setErreur(response.error || 'Échec création');
                if (response.champs) setChampsErreurs(response.champs);
                if (response.message) setMessage(response.message);
                return response;
            }
            const nouveauLivre = response.data;
            // Mutation locale
            setAdherents(prev => [...prev, nouveauLivre]);
            setMessage(response.message || 'Adhérent créé');
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    };

    /**
     *  Modification d'un adhérent via l'API
     *  - mutation locale et serveur si action réussie
     * @param {number} id - id de l'adhérent à modifier
     * @param {UpdateAdherentDTO} dto - Données de l'adhérent à modifier 
     * @returns {Promise<ApiResponse<Adherent>>} Résultat de la requête
     */
    const modifierAdherent = async ( id: number, dto: UpdateAdherentDTO )
    : Promise<ApiResponse<Adherent>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await updateAdherent(id, dto);
            if (!response.success || !response.data) {
                setErreur(response.error || 'Échec modification');
                if (response.champs) setChampsErreurs(response.champs);
                if (response.message) setMessage(response.message);
                return response;
            }
            const adherentModifie = response.data;
            // Mutation locale
            setAdherents(prev => prev.map(adherent => adherent.id === adherentModifie.id ? adherentModifie : adherent));
            setMessage(response.message || 'Adhérent modifié');
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    }

    /**
     *  Suppression d'un adhérent via l'API
    * - mutation locale et serveur si action réussie
    * - (désactivation, pas suppression dans la base de données)
     * @param {number} id - id de l'adhérent à supprimer 
     * @returns {Promise<ApiResponse<void>>} Résultat de la requête
     */
    const supprimerAdherent = async ( id: number )
    : Promise<ApiResponse<void>> => {
        setChargement(true);
        resetFeedback();
        try{
            const response = await deleteAdherent(id);
            if (!response.success) {
                setErreur(response.error || 'Échec suppression');
                if (response.message) setMessage(response.message);
                return response;
            }
            return response;

        } catch(err) {
            setErreur(err instanceof Error ? err.message : 'Erreur Chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false)
        }
    }

    return {
        erreur,
        chargement,
        message,
        champsErreurs,
        resetFeedback,
        // Adherents
        adherents,
        chargerAdherents,
        ajouterAdherent,
        modifierAdherent,
        supprimerAdherent,
    };
};