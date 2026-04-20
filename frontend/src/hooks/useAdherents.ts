//% src/hooks/useAdherents.ts
// ? Hook de gestion des adherents

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { ApiResponse, Adherent, CreateAdherentDTO, UpdateAdherentDTO  } from '../types';
import { getAdherents, createAdherent, updateAdherent } from '../services/api/adherentService';


export const useAdherents = () => {
    const context = useContext(AppContext);
    if (!context.emprunts) throw new Error('useAdherents doit être dans AppProvider');

    const { adherents, setAdherents } = context;

     // States locaux pour feedback (exposés aux composants enfants)
    const [erreur, setErreur] = useState<string | null>(null);
    const [chargement, setChargement] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [champsErreurs, setChampsErreurs] = useState<string[]>([]);

    const resetFeedback = () => {
        setErreur(null);
        setMessage(null);
        setChampsErreurs([]);
    };


    //? Actions isolées
    // Chargement des adhérents
    const chargerAdherents = async ()
    :Promise<ApiResponse<Adherent[]>> => {
        setChargement(true);
        resetFeedback();
        try {
            const response = await getAdherents();
            if (response.success) {
                setAdherents(response.data ?? []);
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

    // Ajout d'un adhérent
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

    // Modification d'un adhérent
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

    return {
        adherents,
        erreur,
        chargement,
        message,
        champsErreurs,
        chargerAdherents,
        ajouterAdherent,
        modifierAdherent,
        resetFeedback
    };
};