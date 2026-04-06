//% frontend/src/pages/AdherentsPage.tsx
//? Page de gestion des Adherents

import { useState, useEffect } from 'react';
import { getAdherents } from '../services/api/adherentService';
import type { Adherent } from '../types/index';

import AdherentCard from '../components/AdherentCard';
import SkeletonAdherents from '../components/SkeletonAdherents';


export default function AdherentsPage() {

    // Les 3 états à toujours prévoir pour un fetch
    const [adherents, setAdherents] = useState<Adherent[]>([]);
    const [chargement, setChargement] = useState<boolean>(true);
    const [erreur, setErreur] = useState<string | null>(null);


    // Filtres de recherche (nouvel appel API par getLivres)
    // const [recherche, setRecherche] = useState<string>('');
    
    // Affichage filtrée des Adhérents ( pas de nouvelles requête API pour le moment )
    // const adherentsAffiches = adherents.filter((adh) =>
    //     (!recherche || adh.nom.toLowerCase().includes(recherche.toLowerCase()) || adh.prenom.toLowerCase().includes(recherche.toLowerCase())) 
    // );

    // Reset des filtres
    // const resetFiltres = () => {
    //     setRecherche('');
    // }

    // Chargement des adhérents au montage (tous !)
    useEffect(() => {
        const chargerAdherents = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                // attendre 2s pour simuler chargement plus lent
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                const response = await getAdherents();
                const data: Adherent[] = response.data;
                setAdherents(data);
                
            } catch (err) {
                setErreur(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setChargement(false); // toujours exécuté
            }
            
        };
        // et on l'appelle immédiatement — useEffect ne peut pas être async lui-même
        chargerAdherents();
        }, []   // [] = une seule fois au montage
    ); 

    
    //* Rendu conditionnel selon état
    if (chargement) return (
        <div className='section'>
            <h1 className='title'>Chargement...</h1>
                <SkeletonAdherents />
        </div>
    );
    if (erreur) return (
        <div className='section'>
            <h1 className='title'>Erreur : {erreur}</h1>
            <SkeletonAdherents />
        </div>
    );

    // Rendu normal si chargement OK
    return (

        <div className='section'>
            <h1 className='title'>Gestion des Adhérents</h1>
            <div className='columns is-multiline'>
                {adherents.map((adh) => (
                    <div key={adh.numero_adherent} className='column is-full'>
                        <AdherentCard adherent={adh} />
                    </div>
                ))}
            </div>
        </div>
    );
}