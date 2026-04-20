//% frontend/src/pages/EmpruntsPage.tsx
//? Page de gestion des Emprunts

import { useState, useEffect } from 'react';
import { useEmprunts } from '../hooks';

import ListeEmprunts from '../components/listes/ListeEmprunts';
import SkeletonEmprunts from '../components/skeletons/SkeletonEmprunts';

import ModalEmpruntAjout from '../components/modals/ModalEmpruntAjout';

export default function EmpruntsPage() {

        // Hook : TOUT le métier (données + actions + états)
    const { 
        emprunts, 
        chargerEmprunts, 
        rendreLivre, 
        chargement, 
        erreur 
    } = useEmprunts();

    const [recherche, setRecherche] = useState<string>('');
    const [newEmpruntVisible, setNewEmpruntVisible] = useState<boolean>(false);

    // Chargement des emprunts au montage (tous !)
    useEffect(() => {
        chargerEmprunts();
    }, []);
    
    // Affichage filtrée des livres ( UI pure, pas de requête API )
    const empruntsAffiches = emprunts.filter((emprunt) =>
        !recherche 
            || emprunt.titre_livre.toLowerCase().includes(recherche.toLowerCase()) 
            || emprunt.nom_adherent.toLowerCase().includes(recherche.toLowerCase())
        
    );

    //* Rendu conditionnel selon état
    if (chargement) return (
            <div className='section'>
                <h1 className='title'>Chargement...</h1>
                    <SkeletonEmprunts />
            </div>
    );
    if (erreur) return (
            <div className='section'>
                <h1 className='title'>Erreur : {erreur}</h1>
                <SkeletonEmprunts />
            </div>
    );

    return (
        <>
            {/* Contenu principal */}
        <section className="section">
            {/* Header */}
            <div className="sticky-header">
                {/* Titre */}
                <div className='mb-4'>
                    <h1 className="title">Emprunts</h1>
                    {!chargement && emprunts.length === 0 && 
                        <p className="subtitle ">Aucun emprunt en cours</p>
                    }
                    {!chargement && 
                        <p className="subtitle ">{emprunts.length} emprunt(s) en cours {emprunts.length === empruntsAffiches.length ? '' : ' - ' + empruntsAffiches.length + ' correspondants à la recherche'}</p>
                    }
                </div>
                <div className="is-flex is-justify-content-space-between">
                    {/* Bouton action - nouvel emprunt */}
                    <div>
                        <button className ="button" onClick={() => setNewEmpruntVisible(true)}>Emprunter un livre</button>
                    </div>
                    {/* Champs de recherche */}
                    <div className='is-flex is-align-items-center'>
                        <div className='field'>
                            <div className="control">
                                <input className="input is-rounded" type="text" placeholder="Rechercher un emprunt" value={recherche} onChange={(e) => setRecherche(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Affichage des emprunts */}
            <ListeEmprunts emprunts={empruntsAffiches} rendreLivre={rendreLivre}/>
        </section>

            {/* Modals - hors flow classique */}
        <section>
            {/* Formulaire de nouvel emprunt */}
            <ModalEmpruntAjout 
                isOpen={newEmpruntVisible} 
                onClose={() => {setNewEmpruntVisible(false)}}
            />
        </section>
        </>
    );
}