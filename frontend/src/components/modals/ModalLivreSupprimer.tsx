//% frontend/src/components/ModalLivreSupprimer.tsx
//? Confirmation de suppression d'un livre

import { useState } from "react";

import { useLivres } from "../../hooks";

interface ModalLivreSupprimerProps {
    readonly livreID: number
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

/**
 *  Composant Modal de suppression d'un livre
 * @export function ModalLivreSupprimer
 * @param livreID
 * @param isOpen
 * @param onClose
 * @returns ModalLivreSupprimer -> visuel de suppression d'un livre
 */
export default function ModalLivreSupprimer({ 
    livreID,
    isOpen,
    onClose
}: ModalLivreSupprimerProps) {

    // utilisation des hooks de gestion des adhérents
    const {
        livres,
        supprimerLivre,
        chargement,
        message,
        erreur,
        champsErreurs,
        resetFeedback
    } = useLivres();

    const [confirmationSuppression, setConfirmationSuppression] = useState<boolean>(false)

    const [voirDetails, setVoirDetails] = useState<boolean>(false)

    // Livre chargé pour modification
    const livre = livres.find(livre => livre.id === livreID);
    
    // Détails du livre
    const titre = livre?.titre;
    const isbn = livre?.isbn;
    const auteur = livre?.auteur;
    const annee = livre?.annee;

    // fonction d'appel API via hook
    const suppressionLivre = async () => {
        await supprimerLivre(livreID);
    }

    if (!isOpen) return null;

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">
                        Suppression du livre : {livreID}
                    </p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                {/* contenu du modal détails du livre */}
                <div className="modal-card-body">
                    <button className="button is-small is-primary is-light"
                        onClick={() => voirDetails? setVoirDetails(false) : setVoirDetails(true)}
                        >{voirDetails? 'Cacher détails' : 'Voir détails'}
                    </button>
                    { voirDetails && ( <div>
                        {/* titre du livre */}
                        <div className="field">
                            <label htmlFor="titre_field" className="label">Titre</label>
                            <div id="titre_field" className="control">
                                <input className="input"
                                    readOnly disabled
                                    value={titre}/>
                            </div>
                        </div>
                        {/* auteur du livre */}
                        <div className="field">
                            <label htmlFor="auteur_field" className="label">Auteur</label>
                            <div id="auteur_field" className="control">
                                <input className="input" type="text" 
                                    readOnly disabled
                                    value={auteur}/>
                            </div>
                        </div>
                        {/* année de sortie du livre */}
                        <div className="field">
                            <label htmlFor="annee_field" className="label">Année de sortie</label>
                            <div id="annee_field" className="control">
                                <input className="input" type="text"
                                    readOnly disabled
                                    value={annee}/>
                            </div>
                            <p className="help is-danger ml-3"></p>
                        </div>
                        {/* isbn du livre */}
                        <div className="field">
                            <label htmlFor="isbn_field" className="label">ISBN</label>
                            <div id="isbn_field" className="control">
                                <input className="input" type="text"
                                    readOnly disabled
                                    value={isbn}/>
                            </div>
                            <p className="help is-danger ml-3"></p>
                        </div>
                    </div>
                    )}

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
                <div className="modal-card-foot">
                    <div className="field is-grouped">
                        <div className="control buttons ">
                            {!confirmationSuppression && (
                                <div className="is-flex is-justify-content-space-between p-1">
                                    <button type='button' 
                                        disabled={erreur !== null || chargement } 
                                        className={erreur ? "button is-danger is-inactive" : "button is-danger is-light"} 
                                        onClick={() => {
                                            resetFeedback();
                                            setConfirmationSuppression(true)
                                            
                                        }}
                                        > Supprimer le livre
                                    </button>
                                
                                    <button type="button" 
                                        disabled={chargement}
                                        onClick={()=> {
                                            onClose();
                                            resetFeedback();
                                        }} 
                                        className="button is-link is-light"
                                        > Fermer
                                    </button>
                            </div>
                            )}
                            {confirmationSuppression && (
                                <div>
                        <p>
                            Confirmer la suppression ?
                        </p>
                        <button className="button is-success is-light m-1" 
                            onClick={() => suppressionLivre()}
                            > Oui
                        </button>
                        <button className="button is-link is-light m-1" 
                            onClick={() => setConfirmationSuppression(false)}
                            > Annuler
                        </button>
                    </div>
                            )}
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}