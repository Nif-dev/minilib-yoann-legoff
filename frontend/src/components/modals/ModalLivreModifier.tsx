//% frontend/src/components/ModalLivreModifier.tsx
//? Formulaire de modification d'un livre existant

import { useState } from "react";

import type { Livre, UpdateLivreDTO } from "../../types/index";
import { updateLivre } from "../../services/api/livreService";

interface ModalLivreModifierProps {
    
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly oldLivre: Livre; // id du livre à modifier
}

export default function ModalLivreModifier({ 
    isOpen, 
    onClose, 
    oldLivre 
}: ModalLivreModifierProps) {

    const [chargement, setChargement] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [erreur, setErreur] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [champs, setChamps] = useState<string[]>([]);

    
    const modalOpen = isOpen;

    const clearInfos = () => {
        setChargement(false);
        setMessage(null);
        setErreur(null);
        setErrorMessage(null);
        setChamps([]);
    }

    const resetLivre = () => {
        setISBN(oldLivre.isbn);
        setTitre(oldLivre.titre);
        setAuteur(oldLivre.auteur);
        setGenre(oldLivre.genre);
        setAnnee(oldLivre.annee);
    }

    const idLivre = oldLivre.id;

    // Données du formulaire
    const [isbn, setISBN] = useState(oldLivre.isbn);
    const [titre, setTitre] = useState(oldLivre.titre);
    const [auteur, setAuteur] = useState(oldLivre.auteur);
    const [genre, setGenre] = useState(oldLivre.genre);
    const [annee, setAnnee] = useState(oldLivre.annee);
    
    // Données de modification du livre
    const newLivre: UpdateLivreDTO = {
        isbn: isbn,
        titre: titre,
        auteur: auteur,
        genre: genre,
        annee: annee.toString(),
    }


    const ajouterLivre = async () => {
        clearInfos();
        setChargement(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const response = await updateLivre(idLivre, newLivre);

            if (!response.success) {
                setChargement(false);
                setErreur(response.error ?? "Erreur inconnue"); 
                // message renvoyé par l'API - typiquement un message d'erreur 
                setErrorMessage(response.message ?? response.error ?? "Livre non modifié"); 
                // récupération des champs de formulaires fautifs
                if (response.champs) {
                    setChamps(response.champs);
                }
                return;
            }
            setMessage(response.message ?? 'Livre modifié');
            // autres traitements sur la réponse api si besoin

        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
        setChargement(false);
    }

    return (
        modalOpen && (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">
                        Modification du livre {oldLivre.titre},
                        <span className="has-text-grey is-small">id : {oldLivre.id}</span>
                    </p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                {/* contenu du formulaire */}
                <div className="modal-card-body">
                    {/* titre du livre */}
                    <div className="field">
                        <label htmlFor="titre_field" className="label">Titre</label>
                        <div id="titre_field" className="control">
                            <input className="input" type="text" placeholder="Titre du livre..."
                                onChange={(e) => setTitre(e.target.value)} 
                                value={titre}/>
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* auteur du livre */}
                    <div className="field">
                        <label htmlFor="auteur_field" className="label">Auteur</label>
                        <div id="auteur_field" className="control">
                            <input className="input" type="text" placeholder="Auteur du livre..."
                                onChange={(e) => setAuteur(e.target.value)}
                                value={auteur} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* isbn du livre */}
                    <div className="field">
                        <label htmlFor="isbn_field" className="label">ISBN</label>
                        <div id="isbn_field" className="control">
                            <input className="input" type="text" placeholder="ISBN du livre..." 
                                onChange={(e) => setISBN(e.target.value)} 
                                value={isbn}/>
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* genre du livre */}
                    <div className="field">
                        <label htmlFor="genre_field" className="label">Genre</label>
                        <div id="genre_field" className="control">
                            <input className="input" type="text" placeholder="Genre du livre..." 
                                onChange={(e) => setGenre(e.target.value)} 
                                value={genre}/>
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* année du livre */}
                    <div className="field">
                        <label htmlFor="annee_field" className="label">Année</label>
                        <div id="annee_field" className="control">
                            <input className="input" type="number" placeholder="Année de publication..." 
                                onChange={(e) => setAnnee(Number.parseInt(e.target.value))} 
                                value={annee}/>
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* affichage des messages /erreurs */}
                    <div className="field has-text-centered">

                        { chargement && <div className="has-text-success has-text-centered my-4">Requête en cours ...</div> }
                        
                        {message && <div className="has-text-success has-text-centered my-4">{message}</div>}
                        
                        {errorMessage && <div className="has-text-danger has-text-centered my-4">{errorMessage}</div>}
                        
                        {champs.length > 0 && <div className="has-text-danger has-text-left my-4">
                            <ul>
                                {champs.map((champ, index) => (
                                    <li key={index+1}> - {champ}</li>
                                ))}
                            </ul>
                        </div>}
                    </div>
                    
                </div>

                {/* Actions du formulaire */}
                <footer className="modal-card-foot">
                    <div className="field is-grouped">
                        <div className="control buttons">
                            
                            {/* si erreur, bouton pour inciter à corriger */}
                            {erreur
                            ? <button type="button"
                                disabled={chargement} 
                                className="button is-warning " 
                                onClick={() => clearInfos()}
                                >Correction OK ?
                            </button>
                            : <button type='button' 
                                disabled={erreur !== null || chargement } 
                                className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                                onClick={() => ajouterLivre()}
                                >Modifier le livre
                            </button>
                            }
                            {/* bouton de reset du formulaire */}
                            <button type="button" 
                                disabled={chargement} 
                                className="button is-warning" 
                                onClick={resetLivre}
                                >Reset
                            </button>
                            {/* bouton de fermeture du formulaire */}
                            <button type="button" 
                                onClick={onClose} 
                                className="button is-link is-light"
                                >Fermer
                                </button>
                        
                        </div>
                    </div>
                </footer>
            </div>
        </div>)
    );
}