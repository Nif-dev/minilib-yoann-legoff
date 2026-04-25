//% frontend/src/pages/EmpruntsPage.tsx
//? Page de gestion des Emprunts

import { useState, useEffect } from 'react';
import { useEmprunts } from '../hooks';

import ListeEmprunts from '../components/listes/ListeEmprunts';

import SkeletonEmprunts from '../components/skeletons/SkeletonEmprunts';

import ModalEmpruntAjout from '../components/modals/ModalEmpruntAjout';

/**
 *  Page d'affichage et de gestion des emprunts
 * - Gestion des emprunts - centralise la logique et expose les actions aux composants enfants
 * - Récupère et affiche les emprunts à chaque chargement du composant
 * - Gestion des modals au niveau de la page
 */
export default function EmpruntsPage() {

        // Hook : TOUT le métier (données + actions + états)
    const { 
        emprunts, 
        chargerEmprunts, 
        rendreLivre, 
        chargement, 
        erreur 
    } = useEmprunts();

    // Fonction de retour d'un emprunt
    const handleRetourLivre = (id: number) => {
        rendreLivre(id);
    }

    // Données propres à la page
    const [recherche, setRecherche] = useState<string>('');

    // Gestion des modals global
    const [newEmpruntVisible, setNewEmpruntVisible] = useState<boolean>(false);

    // Chargement des emprunts au montage (tous !)
    useEffect(() => {
        chargerEmprunts();
    }, []);
    
    // Affichage filtrée par titre de livre ou nom d'adhérent ( UI pure, pas de requête API )
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

    // Rendu principal
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
            <ListeEmprunts emprunts={empruntsAffiches} onRetourLivre={handleRetourLivre}/>
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