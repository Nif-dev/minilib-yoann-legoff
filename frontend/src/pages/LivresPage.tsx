//% frontend/src/pages/LivresPage.tsx
//? Page de gestion des livres

import { useState, useEffect } from 'react';
import { useLivres } from '../hooks';
import type { FiltresRechercheLivres } from '../types';

import ListeLivres from '../components/listes/ListeLivres';
import SkeletonLivres from '../components/skeletons/SkeletonLivres';

import ModalLivresRecherche from '../components/modals/ModalLivresRecherche';
import ModalLivreAjout from '../components/modals/ModalLivreAjout';
import ModalLivreModifier from '../components/modals/ModalLivreModifier';
import ModalLivreSupprimer from '../components/modals/ModalLivreSupprimer';
import ModalEmpruntAjout from "../components/modals/ModalEmpruntAjout";

export default function LivresPage() {

    // Hook : TOUT le métier (données + actions + états)
    const { 
        livres, 
        chargerLivres, 
        rechercherLivres,
        chargement, 
        erreur 
    } = useLivres();

    // Gestion des modals global
    const [isModalRechercheOpen, setIsModalRechercheOpen] = useState<boolean>(false);
    const [isModalAjoutOpen, setIsModalAjoutOpen] = useState<boolean>(false);

    // Gestion des modals spécifiques à un item - Livre Card ici
    const [isModalModifierOpen, setIsModalModifierOpen] = useState(false);
    const [isModalEmpruntOpen, setIsModalEmpruntOpen] = useState(false);
    const [isModalSuppressionOpen, setIsModalSuppressionOpen] = useState(false);
    const [livreIdAction, setLivreIdAction] = useState<number>(0);

    // Filtres de recherche (nouvel appel API par queryLivres dans le hook)
    const [recherche, setRecherche] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [disponible, setDisponible] = useState<string | undefined>(undefined); // undefined pour tous
    
    const filtres: FiltresRechercheLivres = {
        recherche: recherche || undefined,
        genre: genre || undefined,
        disponible: disponible || undefined
    };
    
    // Affichage filtrée des livres ( avant de faire une requête API )
    const livresAffiches = livres.filter((livre) =>
        (!recherche || livre.titre.toLowerCase().includes(recherche.toLowerCase())) &&
        (!genre || livre.genre.toLowerCase().includes(genre.toLowerCase())) &&
        (disponible === undefined || String(livre.disponible) === disponible)
    );

    // Reset des filtres
    const resetFiltres = () => {
        setRecherche('');
        setGenre('');
        setDisponible(undefined);
    }

    // Fonction de recherche
    const handleRechercherLivres = async () => {
        setIsModalRechercheOpen(false);
        await rechercherLivres(filtres); // Hook gère tout !
    };

    // Chargement des livres au montage (tout les livres !)
    useEffect(() => {
        chargerLivres();
        }, []   // [] = une seule fois au montage
    ); 

    // Gestion pour la modal de modification
    const handleModalModification = (id: number) => {
        setLivreIdAction(id);
        setIsModalModifierOpen(true);
    }
    const livreAModifier = livreIdAction ? livres.find(livre => livre.id === livreIdAction) : null;
    
    // Gestion pour la modal d'emprunt
    const handleModalEmprunt = (id: number) => {
        setLivreIdAction(id);
        setIsModalEmpruntOpen(true);
    }


    // Gestion pour la modal de suppression
    const handleModalSuppression = (id: number) => {
        setLivreIdAction(id);
        setIsModalSuppressionOpen(true);
    }

    //* Rendu conditionnel selon état
    if (chargement) return (
        <div className='section'>
            <h1 className='title'>Chargement...</h1>
                <SkeletonLivres />
        </div>
    );
    if (erreur) return (
        <div className='section'>
            <h1 className='title'>Erreur : {erreur}</h1>
            <SkeletonLivres />
        </div>
    );

    // Rendu normal si chargement OK
    return (
        <>
            {/* Contenu principal */}
        <section className='section'>
            {/* Header */}
            <div className="sticky-header">
                {/* Titre */}
                <div className='mb-4'> 
                    <h1 className='title'>Catalogue de livres</h1>
                    {!chargement && livres.length === 0 && 
                        <p className="subtitle ">Aucun livre trouvé avec ces filtres</p>
                    }
                    {!chargement && 
                        <p className="subtitle ">{livres.length} livre(s)  {livres.length === livresAffiches.length ? '' : '- '+livresAffiches.length + ' correspondants à la recherche'}</p>
                    }
                </div>
                {/* Actions */}
                <div className='is-flex is-justify-content-space-between'>
                    
                    {/* Bouton action - nouveau livre */}
                    <div>
                        <button className ="button" onClick={() => setIsModalAjoutOpen(true)}>Ajouter un livre</button>
                    </div>
                    {/* Champs de recherche */}
                    <div className='is-flex is-align-items-center'>
                        <button 
                            className={`button is-rounded is-small mx-2 
                                ${(filtres?.disponible || filtres?.genre) ? 'is-dark ' : 'is-light'}`
                            }
                            onClick={() => setIsModalRechercheOpen(true)}>
                                <p>Filtres + </p>
                            </button>
                        <div className='field'>
                            <div className="control">
                                <input className="input is-rounded" type="text" placeholder="Rechercher un livre" value={recherche} onChange={(e) => setRecherche(e.target.value)} 
                                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleRechercherLivres();
                    }
                }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Affichage des messages */}
            <div>
                {/* Affichage d'erreur */}
                {erreur && <p>Erreur : {erreur}</p>}
            </div>

            {/* Affichage des livres */}
            <ListeLivres livres={livresAffiches} onModifier={handleModalModification} onEmprunter={handleModalEmprunt} onSupprimer={handleModalSuppression}/>

        </section>

            {/* Modals - hors flow classique de la page */}
        <section>
            {/* Modal filtres */}
            {isModalRechercheOpen && <ModalLivresRecherche
                isOpen={isModalRechercheOpen}
                recherche={recherche}
                genre={genre}
                disponible={disponible}
                onClose={() => setIsModalRechercheOpen(false)}
                onReset={resetFiltres}
                onSearch={handleRechercherLivres}
                onRechercheChange={setRecherche}
                onGenreChange={setGenre}
                onDisponibleChange={setDisponible}
                />}

            {/* Modal ajouter livre */}
            {isModalAjoutOpen && <ModalLivreAjout
                isOpen={isModalAjoutOpen}
                onClose={() => setIsModalAjoutOpen(false)}
            />}

            {/* Modal modifier livre */}
            {isModalModifierOpen && livreAModifier && <ModalLivreModifier
                isOpen={isModalModifierOpen}
                onClose={() => setIsModalModifierOpen(false)}
                oldLivre={livreAModifier}
                />}

            {/* Modal emprunter le livre */}
            { isModalEmpruntOpen && livreIdAction !== 0 && <ModalEmpruntAjout
                isOpen={isModalEmpruntOpen}
                idLivre={livreIdAction}
                onClose={() => setIsModalEmpruntOpen(false)}
            />}

            {/* Modal supprimer livre */}
            {isModalSuppressionOpen && livreIdAction !== 0 && <ModalLivreSupprimer
                isOpen={isModalSuppressionOpen}
                livreID={livreIdAction}
                onClose={() => setIsModalSuppressionOpen(false)}
            />}
        </section>
            
        </>
    );
}