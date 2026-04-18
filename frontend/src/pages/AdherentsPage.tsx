//% frontend/src/pages/AdherentsPage.tsx
//? Page de gestion des Adherents

import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

// import type { Adherent } from '../types/index';
// import { getAdherents } from '../services/api/adherentService';

import AdherentCard from '../components/AdherentCard';
import SkeletonAdherents from '../components/SkeletonAdherents';

import ModalAdherentAjout from '../components/ModalAdherentAjout';


export default function AdherentsPage() {
        // Récupération des données du context
    const {
        adherents,
        // setAdherents,
        chargementContext,
        erreurContext
    } = useContext(AppContext);

    // Données propres à la page
    const [chargement, setChargement] = useState<boolean>(chargementContext);
    const [erreur, setErreur] = useState<string | null>(erreurContext);

    const [recherche, setRecherche] = useState<string>('');
    
    const [isModalAjoutOpen, setIsModalAjoutOpen] = useState<boolean>(false);

    // Chargement des adhérents au montage (tous !)
    useEffect(() => {
        const chargerAdherents = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                // attendre 2s pour simuler chargement plus lent
                // await new Promise(resolve => setTimeout(resolve, 500)); 
                
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

    // Affichage filtrée des adhérents
    const adherentsAffiches = adherents.filter((adherent) => 
        (!recherche 
            || adherent.nom.toLowerCase().includes(recherche.toLowerCase()) 
            || adherent.prenom.toLowerCase().includes(recherche.toLowerCase())
        )
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
        <>
            {/* Contenu principal */}
        <section className='section'>
            {/* Header */}
                <div className='sticky-header'>
                {/* Titre */}
                <div className='mb-4'>
                    <h1 className="title">Adhérents</h1>
                    {!chargement && adherents.length === 0 && 
                        <p className="subtitle ">Aucun adhérent trouvé</p>
                    }
                    {!chargement && 
                        <p className="subtitle ">{adherents.length} adhérent(s) {adherents.length === adherentsAffiches.length ? '' : ' - ' + adherentsAffiches.length + ' correspondants à la recherche'}</p>
                    }
                </div>
                <div className="is-flex is-justify-content-space-between">
                    {/* Bouton action - nouvel adhérent */}
                    <div>
                        <button className ="button" onClick={() => setIsModalAjoutOpen(true)}>Ajouter un adhérent</button>
                    </div>
                    {/* Champs de recherche */}
                    <div className='is-flex is-align-items-center'>
                        <div className='field'>
                            <div className="control">
                                <input className="input is-rounded" type="text" placeholder="Rechercher un adhérent" value={recherche} onChange={(e) => setRecherche(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
            {/* Affichage des adhérents */}
            <div className='columns is-multiline my-4 mx-1' style={{overflowY:'auto', flex:1}}>
                {adherentsAffiches.map((adh) => (
                    <div key={adh.numero_adherent} className='column is-half'>
                        <AdherentCard adherent={adh} nouvelEmprunt={() => {}} />
                        
                    </div>
                ))}
            </div>
        </section>

            {/* Modals - hors flow classique */}
        <section>    
            {/* Modal ajouter adhérent */}
            {isModalAjoutOpen && <ModalAdherentAjout    
                isOpen={isModalAjoutOpen}  
                onClose={() => setIsModalAjoutOpen(false)} />}
        </section>
            
        </>
    );
}