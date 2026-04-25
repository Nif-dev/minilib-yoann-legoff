//% frontend/src/pages/AdherentsPage.tsx
//? Page de gestion des Adherents

import { useState, useEffect } from 'react';
import { useAdherents } from '../hooks';

import ListeAdherents from '../components/listes/ListeAdherents';

import SkeletonAdherents from '../components/skeletons/SkeletonAdherents';

import ModalAdherentAjout  from '../components/modals/ModalAdherentAjout';
import ModalAdherentModifier from '../components/modals/ModalAdherentModifier';
import ModalAdherentSupprimer from '../components/modals/ModalAdherentSupprimer';

import ModalEmpruntAjout from '../components/modals/ModalEmpruntAjout';

/**
 *  Page d'affichage et de gestion des adhérents
 * - Gestion des adhérents - centralise la logique et expose les actions aux composants enfants
 * - Récupère et affiche les adhérents à chaque chargement du composant
 * - Gestion des modals au niveau de la page
 */
export default function AdherentsPage() {

    // Hook : TOUT le métier (données + actions + états)
    const {
        adherents,
        chargerAdherents,
        chargement,
        erreur
    } = useAdherents();

    // Données propres à la page
    const [recherche, setRecherche] = useState<string>('');

    // Affichage filtrée des adhérents
    const adherentsAffiches = adherents.filter((adherent) => 
        (!recherche 
            || adherent.nom.toLowerCase().includes(recherche.toLowerCase()) 
            || adherent.prenom.toLowerCase().includes(recherche.toLowerCase())
        )
    );

    // Gestion des modals global
    const [isModalAjoutOpen, setIsModalAjoutOpen] = useState<boolean>(false);

    // Gestion des modals spécifiques à un item - Adherent Card ici
    const [isModalModifierOpen, setIsModalModifierOpen] = useState<boolean>(false);
    const [isModalSupprimerOpen, setIsModalSupprimerOpen] = useState<boolean>(false);
    const [isModalEmpruntOpen, setIsModalEmpruntOpen] = useState<boolean>(false);
    const [adherentIdAction, setAdherentIdAction] = useState<number>();

    // Chargement des adhérents au montage (tous !)
    useEffect(() => {
        chargerAdherents();
        }, []   // [] = une seule fois au montage
    ); 

    // Gestion des actions sur chaque adhérent ( card-footer )
    const handleCardAction = (action: string, id: number) => {
    switch(action) {
        case 'modifier':
            setAdherentIdAction(id);
            setIsModalModifierOpen(true);
            break;
        case 'supprimer':
            setAdherentIdAction(id);
            setIsModalSupprimerOpen(true)
            break;
        case 'emprunt':
            setAdherentIdAction(id);
            setIsModalEmpruntOpen(true);
            break;
    }
};

    
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
            <ListeAdherents 
                adherents={adherentsAffiches}
                onAction={handleCardAction}
            />
        </section>

            {/* Modals - hors flow classique */}
        <section>    
            {/* Modal ajouter adhérent */}
            {isModalAjoutOpen && <ModalAdherentAjout    
                isOpen={isModalAjoutOpen}  
                onClose={() => setIsModalAjoutOpen(false)} />}

            {/* Modal modifier adhérent */}
            {isModalModifierOpen && <ModalAdherentModifier    
                adherentID={adherentIdAction!} 
                isOpen={isModalModifierOpen}  
                onClose={() => setIsModalModifierOpen(false)} />}

            {/* Modal emprunt */}
            {isModalEmpruntOpen && <ModalEmpruntAjout
                adherentIdLock={adherentIdAction}    
                isOpen={isModalEmpruntOpen}  
                onClose={() => setIsModalEmpruntOpen(false)} />}

            {/* Modal suppression */}
            {isModalSupprimerOpen && <ModalAdherentSupprimer 
                adherentID={adherentIdAction!}
                isOpen={isModalSupprimerOpen}
                onClose={() => setIsModalSupprimerOpen(false)} />}
            
        </section>
            
        </>
    );
}