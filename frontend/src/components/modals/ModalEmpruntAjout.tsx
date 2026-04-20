//% frontend/src/components/ModalEmpruntAjout.tsx
//? Formulaire de création d'un nouvel emprunt

import { useState } from "react";

import { useLivres, useAdherents, useEmprunts } from "../../hooks";
import type { CreateEmpruntDTO } from "../../types";

interface ModalEmpruntAjoutProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly idLivre?: number;
    readonly idAdherent?: number;

}

export default function ModalEmpruntAjout({ 
    isOpen, 
    onClose, 
    idLivre, 
    idAdherent,
} : ModalEmpruntAjoutProps) {

    const { livres } = useLivres();
    const { adherents } = useAdherents();

    const livresDispo = livres.filter(livre => livre.disponible);

    const [livre_id, setLivre_id] = useState(idLivre || 0);
    const [adherent_id, setAdherent_id] = useState(idAdherent || 0);

    // utilisation des hooks de gestion des emprunts
    const { 
        ajouterEmprunt, 
        chargement, 
        message, 
        erreur, 
        champsErreurs, 
        resetFeedback 
    } = useEmprunts();

    const newEmprunt: CreateEmpruntDTO = {
        livre_id: livre_id,
        adherent_id: adherent_id
    }

    // fonction d'emprunt - callback
    const emprunterLivre = async () => {
        await ajouterEmprunt(newEmprunt);
    };


    // UX : clear erreur sur saisie
    const onFieldChange = () => {
        if (erreur) resetFeedback();
    };

    if (!isOpen) return null;

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Nouvel emprunt</p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                <div className="modal-card-body">
                    <div className="is-flex is-justify-content-space-evenly">
                    {/* id de l'adhérent */}
                    <div className="field">
                        <label htmlFor="adherent_field" className="label has-text-centered">Adhérent</label>
                        <div id="adherent_field" className="control ">
                            { idAdherent 
                            ? // adhérent bloqué
                            <div className="select">
                                <select disabled>
                                    <option>{adherents.find(adherent => adherent.id === idAdherent)?.nom} {adherents.find(adherent => adherent.id === idAdherent)?.prenom}</option>
                                </select>
                            </div>
                            : // adhérent libre
                            <div className="select">
                                <select onChange={(e) => {
                                    setAdherent_id(Number(e.target.value)); 
                                    onFieldChange()
                                }}>
                                    <option value={0}>Sélectionnez un adhérent</option>
                                    {adherents.map((adherent) => (
                                        <option key={adherent.id} value={adherent.id}>{adherent.nom} {adherent.prenom}</option>
                                    ))}
                                </select>
                            </div>
                            }
                        </div>
                    </div>
                    {/* id du livre (uniquement disponibles) */}
                    <div className="field">
                        <label htmlFor="livre_field" className="label has-text-centered">Livre</label>
                        <div id="livre_field" className="control ">
                            { idLivre 
                            ? // livre bloqué
                            <div className="select">
                                <select disabled>
                                    <option>{livres.find(livre => livre.id === idLivre)?.titre}</option>
                                </select>
                            </div>
                            : // livre libre
                            <div className="select is-small">
                                <select onChange={(e) => {
                                    setLivre_id(Number(e.target.value));
                                    onFieldChange();
                                }}>
                                    <option value={0}>Sélectionnez un livre</option>
                                    {livresDispo.map((livre) => (
                                        <option key={livre.id} value={livre.id}>{livre.titre}</option>
                                    ))}
                                </select>
                            </div>
                            }
                        </div>
                    </div>
                    </div>
                    {/* affichage des messages /erreurs */}
                    <div className="field has-text-centered">

                        { chargement && <div className="has-text-success has-text-centered my-4">Requête en cours ...</div> }
                        
                        {!erreur && message && <div className="has-text-success has-text-centered my-4">{message}</div>}
                        
                        {erreur && message && <div className="has-text-danger has-text-centered my-4">{message}</div>}
                        
                        
                        
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
                                disabled={erreur !== null || chargement || adherent_id === 0 || livre_id === 0 } 
                                className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                                onClick={() => emprunterLivre()}
                                >
                                Valider Emprunt !
                            </button>
                            
                            <button type="button" 
                                disabled={chargement}
                                onClick={() => {
                                    onClose();
                                    resetFeedback();
                                }} 
                                className="button is-link is-light"
                                >
                                Fermer
                                </button>
                        
                        </div>
                    </div>
                </footer>
            </div>
        </div>)
}