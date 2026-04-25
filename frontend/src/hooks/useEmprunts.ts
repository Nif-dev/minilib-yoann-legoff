//% src/hooks/useEmprunts.ts
// ? Hook de gestion des emprunts

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { ApiResponse, Emprunt, EmpruntAvecDetails, CreateEmpruntDTO } from '../types';
import { getEmprunts, createEmprunt, retourEmprunt } from '../services/api/empruntService';

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

 * @function chargerEmprunts <Promise<ApiResponse<Emprunt[]>>> -- Fonction de chargement des emprunts
 * @function ajouterEmprunt <Promise<ApiResponse<Emprunt>>> -- Fonction d'ajout d'un emprunt
 * @function retourEmprunt <Promise<ApiResponse<void>>> -- Fonction de retour d'un emprunt
 */
export const useEmprunts = () => {
    const context = useContext(AppContext);
    if (!context.emprunts) throw new Error('useEmprunts doit être dans AppProvider');

    // *emprunts* est transmis/accessibles,aux composants utilisant le contexte via les hooks, mais pas le *set* - reste privé pour éviter des mutations directes
    const { emprunts, setEmprunts, setRetards } = context;

     // States locaux pour feedback (exposés aux composants enfants)
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


    //? Actions isolées -- spécifiques aux emprunts
    /**
     *  Chargement des emprunts depuis l'API
     * @function setEmprunts(response.data)
     * @returns {Promise<ApiResponse<Emprunt[]>>}
     */
    const chargerEmprunts = async ()
    :Promise<ApiResponse<EmpruntAvecDetails[]>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await getEmprunts();
            if (response.success) {
                setEmprunts(response.data ?? []);
                setMessage(response.message || 'Emprunts chargés');
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
     *  Ajout d'un nouvel emprunt via l'API
     *  - mutation locale et serveur si action réussie
     * @param {CreateEmpruntDTO} dto - Données de l'emprunt à créer 
     * @returns {Promise<ApiResponse<Emprunt>>} Résultat de la requête
     */
    const ajouterEmprunt = async ( dto: CreateEmpruntDTO )
    : Promise<ApiResponse<Emprunt>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await createEmprunt(dto);
            if (!response.success || !response.data) {
                setErreur(response.error || 'Échec création');
                if (response.champs) setChampsErreurs(response.champs);
                if (response.message) setMessage(response.message);
                return response;
            }
            const empruntBase = response.data;

            const { livres, adherents } = context; // Context au moment exécution

            const empruntComplet: EmpruntAvecDetails = {
                ...empruntBase,  // TOUS les champs Emprunt
                titre_livre: livres.find(l => l.id === dto.livre_id)?.titre || 'Inconnu',
                nom_adherent: `${adherents.find(a => a.id === dto.adherent_id)?.nom || ''} ${adherents.find(a => a.id === dto.adherent_id)?.prenom || ''}`.trim() || 'Inconnu',
                en_retard: empruntBase.date_retour_effective === null && 
                        empruntBase.date_retour_prevue < new Date()
            };
            // Mutation locale
            setEmprunts(prev => [...prev, empruntComplet]);
            if(empruntComplet.en_retard) setRetards(prev => [...prev, empruntComplet]);
            setMessage(response.message || 'Emprunt créé');
            return response;
        
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    };

    /**
     *  Retour d'un emprunt via l'API
     *  - mutation locale et serveur si action réussie
     * @param {number} id - Identifiant de l'emprunt à retourner
     * @returns {Promise<ApiResponse<void>>} Résultat de la requête
     */
    const rendreLivre = async ( id: number )
    : Promise<ApiResponse<void>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await retourEmprunt(id);
            
            if (!response.success) {
                setErreur(response.error || 'Échec retour');
                if (response.champs) setChampsErreurs(response.champs);
                setMessage(response.message || 'Vérifiez les champs');
                return response;
            }
            // Mutation locale
            const { livres, setLivres } = context; 
            const livreIndex = livres.findIndex(l => l.id === id);
            if (livreIndex !== -1) {
                const nouveauxLivres = [...livres]; 
                nouveauxLivres[livreIndex] = {
                    ...nouveauxLivres[livreIndex],
                    disponible: true
            };
                setLivres(nouveauxLivres); 
            }

            setEmprunts(prev => prev.filter(emprunt => emprunt.id !== id));
            setRetards(prev => prev.filter(emprunt => emprunt.id !== id));
            setMessage(response.message || 'Livre rendu');
            return response;
        } catch (err) {
            setErreur(err instanceof Error ? err.message : 'Erreur chargement');
            return { success: false, error: err instanceof Error ? err.message : 'Erreur chargement'};
        } finally {
            setChargement(false);
        }
    };

    return {
        erreur,
        chargement,
        message,
        champsErreurs,
        resetFeedback,
        // Emprunts
        emprunts,
        chargerEmprunts,
        ajouterEmprunt,
        rendreLivre,
    };
};