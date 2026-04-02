//% frontend/src/pages/LivresPage.tsx
//? Page de gestion des livres

import { useState, useEffect } from 'react';
import { getLivres } from '../services/api/livreService';
import type { FiltresRechercheLivres, Livre } from '../types/index';
import ListeLivres from '../components/ListeLivres';
import SkeletonLivres from '../components/SkeletonLivres';

export default function LivresPage() {

    // Les 3 états à toujours prévoir pour un fetch
    const [livres, setLivres] = useState<Livre[]>([]);
    const [chargement, setChargement] = useState<boolean>(true);
    const [erreur, setErreur] = useState<string | null>(null);


    // Filtres de recherche (nouvel appel API par getLivres)
    const [filtres, setFiltres] = useState<FiltresRechercheLivres>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [recherche, setRecherche] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [disponible, setDisponible] = useState<string | undefined>(undefined); // undefined pour tout ou 'true' ou 'false'

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
    const rechercherLivres = async () => {
        try {
            setIsModalOpen(false);
            setChargement(true);
            const response = await getLivres(filtres);
            const data: Livre[] = response.data;
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
                // attendre 2s pour simuler chargement plus lent
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                const response = await getLivres();
                const data: Livre[] = response.data;
                setLivres(data);
                
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

        <div className='section'>
            <div className='is-flex is-justify-content-space-between'>
                <h1 className='title'>Catalogue ({livres.length} livres)</h1>
                <div className='is-flex is-align-items-center'>
                    <button 
                        className={`button is-rounded is-small mx-2 
                            ${(filtres?.disponible || filtres?.genre) ? 'is-dark ' : 'is-light'}`
                        }
                        onClick={() => setIsModalOpen(true)}>
                            <p>Filtres + </p>
                        </button>
                    {/* Champs de recherche */}
                    <div className='field'>
                        <div className="control">
                            <input className="input is-rounded" type="text" placeholder="Rechercher un livre" value={recherche} onChange={(e) => setRecherche(e.target.value)} 
                            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    rechercherLivres();
                }
            }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Modal filtres */}
                <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
                    <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Filtres avancés</p>
                            <button 
                                className="button is-rounded is-small mr-6" 
                                onClick={() => resetFiltres()}
                                aria-label="clear"
                            > Reset</button>
                            <button 
                                className="delete" 
                                onClick={() => setIsModalOpen(false)}
                                aria-label="close"
                            ></button>
                        </header>
                        <section className="modal-card-body">
                            {/* Champ de recherche titre ou auteur */}
                            <div className="field">
                                <label className="label">Recherche</label>
                                <div className="control">
                                    <input 
                                        className="input is-rounded" 
                                        type="text" 
                                        placeholder="Titre ou auteur..."
                                        value={recherche}
                                        onChange={(e) => setRecherche(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Champ de recherche par genre littéraire */}
                            <div className="field">
                                <label className="label">Genre</label>
                                <div className="control">
                                    <input 
                                        className="input is-rounded" 
                                        type="text" 
                                        placeholder="Genre littéraire..."
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Disponibilité</label>
                                <div className="control">
                                    <label className="radio mr-6">
                                        <input 
                                            type="radio" 
                                            name="dispo" 
                                            checked={disponible === ''}
                                            onChange={() => setDisponible('')}
                                        />
                                        Tous
                                    </label>
                                    <label className="radio mr-6">
                                        <input 
                                            type="radio" 
                                            name="dispo" 
                                            checked={disponible === 'true'}
                                            onChange={() => setDisponible('true')}
                                        />
                                        Disponible
                                    </label>
                                    <label className="radio mr-6">
                                        <input 
                                            type="radio" 
                                            name="dispo" 
                                            checked={disponible === 'false'}
                                            onChange={() => setDisponible('false')}
                                        />
                                        Indisponible
                                    </label>
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success" onClick={rechercherLivres}>
                                Rechercher
                            </button>
                            <button className="button" onClick={() => setIsModalOpen(false)}>
                                Annuler
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
            <ListeLivres livres={livres} />
        </div>
    );
}