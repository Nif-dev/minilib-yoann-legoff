//% src/hooks/useEmprunts.ts
// ? Hook de gestion des emprunts

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { ApiResponse, Emprunt, EmpruntAvecDetails, CreateEmpruntDTO } from '../types';
import { getEmprunts, createEmprunt, retourEmprunt } from '../services/api/empruntService';


export const useEmprunts = () => {
    const context = useContext(AppContext);
    if (!context.emprunts) throw new Error('useEmprunts doit être dans AppProvider');

    const { emprunts, setEmprunts, setRetards } = context;

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
    // Chargement des emprunts
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

    // Ajout d'un emprunt
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

    // Retour d'un livre
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
        emprunts,
        erreur,
        chargement,
        message,
        champsErreurs,
        chargerEmprunts,
        ajouterEmprunt,
        rendreLivre,
        resetFeedback
    };
};