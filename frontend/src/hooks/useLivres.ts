//% src/hooks/useLivres.ts
// ? Hook de gestion des livres

import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import type { ApiResponse, Livre, CreateLivreDTO, UpdateLivreDTO, FiltresRechercheLivres  } from '../types';
import { getLivres, queryLivres, createLivre, updateLivre, deleteLivre } from '../services/api/livreService';

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

 * @function chargerLivres <Promise<ApiResponse<Livre[]>>> -- Fonction de chargement des livres
 * @function rechercherLivres <Promise<ApiResponse<Livre[]>>> -- Fonction de recherche de livres avec filtres
 * @function ajouterLivre <Promise<ApiResponse<Livre>>> -- Fonction d'ajout d'un livre
 * @function modifierLivre <Promise<ApiResponse<Livre>>> -- Fonction de modification d'un livre
 * @function supprimerLivre <Promise<ApiResponse<void>>> -- Fonction de suppression d'un livre
 */
export const useLivres = () => {
    const context = useContext(AppContext);
    if (!context.emprunts) throw new Error('useLivres doit être dans AppProvider');

    // *livres* est transmis/accessibles,aux composants utilisant le contexte via les hooks, mais pas le *set* - reste privé pour éviter des mutations directes
    const { livres, setLivres } = context;

    // *livresDispo* tableau contenant les livres disponibles uniquement - évite de filter à chaque besoin dans les composants de vue
    const [livresDispo, setLivresDispo] = useState<Livre[]>([])

    // Mise à jour de la liste des livres disponibles, à chaque mutation sur *livres*
    useEffect(()=> 
        { const tmpLivresDispo = livres.filter(livre => livre.disponible)
            setLivresDispo(tmpLivresDispo);
        } ,[livres]
    )

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


    //? Actions isolées
    /**
     *  Chargement des livres depuis l'API
     * @function setLivres(response.data)
     * @returns {Promise<ApiResponse<Livre[]>>}
     */
    const chargerLivres = async ()
    :Promise<ApiResponse<Livre[]>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await getLivres();
            if (response.success) {
                setLivres(response.data ?? []);
                setMessage(response.message || 'Livres chargés');
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
     *  Recherche des livres depuis l'API
     * - envoi d'une requête GET avec des filtres
     * - mise à jour de la liste des livres
     * @param filtres -- Filtres de recherche
     * @function setLivres(response.data)
     * @returns {Promise<ApiResponse<Livre[]>>}
     */
    const rechercherLivres = async (filtres: FiltresRechercheLivres)
    : Promise<ApiResponse<Livre[]>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await queryLivres(filtres);
            if (response.success) {
                setLivres(prev => {
                    const map = new Map([...prev, ...(response.data ?? [])].map(item => [item.id, item]));
                    return Array.from(map.values());
                });
                setMessage(response.message || 'Livres chargés');
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
        
    }

    /**
     *  Ajout d'un nouveau livre via l'API
     *  - mutation locale et serveur si action réussie
     * @param {CreateLivreDTO} dto - Données du livre à créer
     * @returns {Promise<ApiResponse<Livre>>} Résultat de la requête
     */
    const ajouterLivre = async ( dto: CreateLivreDTO )
    : Promise<ApiResponse<Livre>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await createLivre(dto);
            if (!response.success || !response.data) {
                setErreur(response.error || 'Échec création');
                if (response.champs) setChampsErreurs(response.champs);
                if (response.message) setMessage(response.message);
                return response;
            }
            const nouveauLivre = response.data;
            // Mutation locale
            setLivres(prev => [...prev, nouveauLivre]);
            setMessage(response.message || 'Livre créé');
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    };

    /**
     *  Modification d'un livre via l'API
     *  - mutation locale et serveur si action réussie
     * @param {number} id - id du livre à modifier
     * @param {UpdateLivreDTO} dto - Données du livre à modifier
     * @returns {Promise<ApiResponse<Livre>>} Résultat de la requête
     */
    const modifierLivre = async ( id: number, dto: UpdateLivreDTO )
    : Promise<ApiResponse<Livre>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await updateLivre(id, dto);
            if (!response.success || !response.data) {
                setErreur(response.error || 'Échec modification');
                if (response.champs) setChampsErreurs(response.champs);
                if (response.message) setMessage(response.message);
                return response;
            }
            const livreModifie = response.data;
            // Mutation locale
            setLivres(prev => prev.map(livre => livre.id === livreModifie.id ? livreModifie : livre));
            setMessage(response.message || 'Livre modifié');
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    }

    /**
     *  Suppression d'un livre via l'API
     *  - mutation locale et serveur si action réussie
     * @param {number} id - id du livre à supprimer
     * @returns {Promise<ApiResponse<void>>} Résultat de la requête
     */
    const supprimerLivre = async (id: number)
    : Promise<ApiResponse<void>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await deleteLivre(id);
            if (!response.success) {
                setErreur(response.error || 'Échec modification');
                if (response.champs) setChampsErreurs(response.champs);
                if (response.message) setMessage(response.message);
                return response;
            }
            setLivres(prev => prev.filter(livre => livre.id !== id));
            setMessage(response.message || 'Livre supprimé');
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    }

    return {
        erreur,
        chargement,
        message,
        champsErreurs,
        resetFeedback,
        // Livres
        livres,
        livresDispo,
        chargerLivres,
        rechercherLivres,
        ajouterLivre,
        modifierLivre,
        supprimerLivre,
    };
    };