//% frontend/src/pages/LivresPage.tsx
//? Page de gestion des livres

import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

import type { FiltresRechercheLivres, Livre } from '../types/index';
import { queryLivres } from '../services/api/livreService';

import ListeLivres from '../components/ListeLivres';
import SkeletonLivres from '../components/SkeletonLivres';

import ModalLivresRecherche from '../components/ModalLivresRecherche';
import ModalLivreAjout from '../components/ModalLivreAjout';
import ModalLivreModifier from '../components/ModalLivreModifier';

export default function LivresPage() {

    // Récupération des données du context
    const {
        livres,
        setLivres,
        chargementContext,
        erreurContext,
    } = useContext(AppContext);

    // Données propres à la page
    const [chargement, setChargement] = useState<boolean>(chargementContext);
    const [erreur, setErreur] = useState<string | null>(erreurContext);

    // Gestion des modals 
    const [isModalRechercheOpen, setIsModalRechercheOpen] = useState<boolean>(false);
    const [isModalAjoutOpen, setIsModalAjoutOpen] = useState<boolean>(false);
    const [isModalModifierOpen, setIsModalModifierOpen] = useState(false);
    
    const [livreAModifierID, setLivreAModifierID] = useState<number>(0);
    
    // Filtres de recherche (nouvel appel API par getLivres)
    const [filtres, setFiltres] = useState<FiltresRechercheLivres>();
    const [recherche, setRecherche] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [disponible, setDisponible] = useState<string | undefined>(undefined); // undefined pour tout ou 'true' ou 'false'
    
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
        setFiltres({});
    }
    // Gestion de la recherche
    useEffect(() => {
        const nouveauxFiltres: FiltresRechercheLivres = {}
        if (recherche) nouveauxFiltres.recherche = recherche;
        if (genre) nouveauxFiltres.genre = genre;
        if (disponible && disponible !== '') nouveauxFiltres.disponible = disponible;
        setFiltres(nouveauxFiltres);
    }, [genre, recherche, disponible]);

    // Fonction de recherche
    const handleRechercherLivres = async () => {
        try {
            setIsModalRechercheOpen(false);
            setChargement(true);
            const response = await queryLivres(filtres);
            const data: Livre[] = response.data ?? [];
            setLivres(data);
        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setChargement(false);
        }
    };

    // Chargement des livres au montage (tout les livres !)
    useEffect(() => {
        const chargerLivres = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                // attendre 0.5s pour simuler chargement
                // await new Promise(resolve => setTimeout(resolve, 500)); 
                //! ancienne logique appel API ici - maintenant Context
                
            } catch (err) {
                setErreur(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setChargement(false); // toujours exécuté
            }
            
        };
        // et on l'appelle immédiatement — useEffect ne peut pas être async lui-même
        chargerLivres();
        }, []   // [] = une seule fois au montage
    ); 

    // Gestion pour la modal de modification
    const handleModalModification = (id: number) => {
        setLivreAModifierID(id);
        setIsModalModifierOpen(true);
    }
    const livreAModifier = livreAModifierID ? livres.find(livre => livre.id === livreAModifierID) : null;
    
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
            <ListeLivres livres={livresAffiches} onModifier={handleModalModification}/>

        </section>

            {/* Modals - hors flow classique */}
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

        </section>
            
        </>
    );
}