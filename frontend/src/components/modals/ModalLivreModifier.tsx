//% frontend/src/components/ModalLivreModifier.tsx
//? Formulaire de modification d'un livre existant

import { useState } from "react";

import type { UpdateLivreDTO } from "../../types/index";
import { useLivres } from "../../hooks";

interface ModalLivreModifierProps {
    readonly livreID: number
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

/**
 *  Composant Modal de modification d'un livre
 * @export function ModalLivreModifier
 * @param livreID
 * @param isOpen
 * @param onClose
 * @returns ModalLivreModifier -> visuel formulaire de modification d'un livre
 */
export default function ModalLivreModifier({ 
    livreID,
    isOpen, 
    onClose 
}: ModalLivreModifierProps) {

    // utilisation des hooks de gestion des livres
    const {
        livres,
        modifierLivre,
        chargement,
        message,
        erreur,
        champsErreurs,
        resetFeedback
    } = useLivres();

    // Livre chargé pour modification
    const livre = livres.find(livre => livre.id === livreID);

        // Données du formulaire
    const [isbn, setISBN] = useState(livre?.isbn);
    const [titre, setTitre] = useState(livre?.titre);
    const [auteur, setAuteur] = useState(livre?.auteur);
    const [genre, setGenre] = useState(livre?.genre);
    const [annee, setAnnee] = useState(livre?.annee);

    // reset des champs du formulaire
    const resetChamps = () => {
        setISBN(livre?.isbn);
        setTitre(livre?.titre);
        setAuteur(livre?.auteur);
        setGenre(livre?.genre);
        setAnnee(livre?.annee);
    }
    
    // DTO de modification du livre pour l'API
    const newLivre: UpdateLivreDTO = {
        isbn: isbn,
        titre: titre,
        auteur: auteur,
        genre: genre,
        annee: annee?.toString(),
    }

    // fonction d'appel API via hook + contrôle qu'une modif ait lieu
    const modificationLivre = async () => {
        if (isbn === livre?.isbn && 
            titre === livre?.titre && 
            auteur === livre?.auteur && 
            genre === livre?.genre && 
            annee === livre?.annee) 
            return;
        await modifierLivre(livreID,newLivre);
    }

    if (!isOpen) return null;

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">
                        Modification du livre
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
                        { !erreur && message && <div className="has-text-success has-text-centered my-4">{message}</div>}
                        { erreur && message && <div className="has-text-danger has-text-centered my-4">{message}</div>}
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
                        <div className="control buttons ">
                            
                            <button type='button' 
                                className={erreur ? "button is-danger is-inactive" : "button is-success is-light"} 
                                disabled={erreur !== null || chargement || champsErreurs.length > 0} 
                                onClick={() => {
                                    resetFeedback();
                                    modificationLivre();
                                }}
                                > Modifier le livre
                            </button>

                            <button type="button" 
                                className="button is-warning is-light"
                                disabled={chargement}
                                onClick={()=> {
                                    resetChamps(); 
                                    resetFeedback();
                                }} 
                                > Annuler les modifications
                            </button>
                            
                            <button type="button" 
                                className="button is-link is-light"
                                disabled={chargement}
                                onClick={()=> {
                                    onClose();
                                    resetFeedback();
                                }} 
                                > Fermer
                            </button>
                        
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}