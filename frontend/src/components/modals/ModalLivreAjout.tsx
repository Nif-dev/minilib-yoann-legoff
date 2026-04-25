//% frontend/src/components/ModalLivreAjout.tsx
//? Formulaire de création d'un nouveau livre

import { useState } from "react";

import type { CreateLivreDTO } from "../../types/index";
import { useLivres } from "../../hooks";

interface ModalLivreAjoutProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

/**
 *  Composant Modal de création de livre
 * @export function ModalLivreAjout
 * @param isOpen
 * @param onClose
 * @returns ModalLivreAjout -> visuel formulaire de création de livre
 */
export default function ModalLivreAjout({ 
    isOpen, 
    onClose 
}: ModalLivreAjoutProps) {

    // utilisation des hooks de gestion des livres
    const {
        ajouterLivre,
        chargement,
        message,
        erreur,
        champsErreurs,
        resetFeedback
    } = useLivres();

    // Données du formulaire
    const [isbn, setISBN] = useState('');
    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [genre, setGenre] = useState('');
    const [annee, setAnnee] = useState(2000);
    
    // DTO pour la création d'un livre
    const newLivre: CreateLivreDTO = {
        isbn: isbn,
        titre: titre,
        auteur: auteur,
        genre: genre,
        annee: annee,
    }

    // fonction appel API via hook
    const ajoutLivre = async () => {
        await ajouterLivre(newLivre);
    }

    if (!isOpen) return null;

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Ajout d'un nouveau livre</p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                {/* contenu du formulaire */}
                <div className="modal-card-body">
                    {/* titre du livre */}
                    <div className="field">
                        <label htmlFor="titre_field" className="label">Titre</label>
                        <div id="titre_field" className="control">
                            <input className="input" type="text" required placeholder="Titre du livre..."
                                onChange={(e) => setTitre(e.target.value)} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* auteur du livre */}
                    <div className="field">
                        <label htmlFor="auteur_field" className="label">Auteur</label>
                        <div id="auteur_field" className="control">
                            <input className="input" type="text" required placeholder="Auteur du livre..."
                                onChange={(e) => setAuteur(e.target.value)} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* isbn du livre */}
                    <div className="field">
                        <label htmlFor="isbn_field" className="label">ISBN</label>
                        <div id="isbn_field" className="control">
                            <input className="input" type="text" required placeholder="ISBN du livre..." 
                                onChange={(e) => setISBN(e.target.value)} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* genre du livre */}
                    <div className="field">
                        <label htmlFor="genre_field" className="label">Genre</label>
                        <div id="genre_field" className="control">
                            <input className="input" type="text" placeholder="Genre du livre..." 
                                onChange={(e) => setGenre(e.target.value)} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* année du livre */}
                    <div className="field">
                        <label htmlFor="annee_field" className="label">Année</label>
                        <div id="annee_field" className="control">
                            <input className="input" type="number" min="-1000"
                            max={new Date().getFullYear()} placeholder="Année de publication..." 
                                onChange={(e) => setAnnee(Number(e.target.value))} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* affichage des messages /erreurs */}
                    <div className="field has-text-centered">
                        { chargement && <div className="has-text-success has-text-centered my-4">Requête en cours ...</div> }
                        {message && <div className="has-text-success has-text-centered my-4">{message}</div>}
                        {erreur && <div className="has-text-danger has-text-centered my-4">{erreur}</div>}
                        {champsErreurs.length > 0 && <div className="has-text-danger has-text-left my-4">
                            <ul>
                                {champsErreurs.map((champ, index) => (
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
                            
                            {erreur
                            ? <button type="button"
                                disabled={chargement} 
                                className="button is-warning " 
                                onClick={() => resetFeedback()}
                                >
                                Correction OK ?
                            </button>
                            : <button type='button' 
                                disabled={erreur !== null || chargement || titre === '' || auteur === '' || isbn === ''} 
                                className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                                onClick={() => ajoutLivre()}
                                >
                                Ajouter le livre !
                            </button>
                            }
                            <button type="button" 
                                onClick={onClose} 
                                className="button is-link is-light"
                                >
                                Fermer
                                </button>
                        
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}