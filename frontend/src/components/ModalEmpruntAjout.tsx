//% frontend/src/components/ModalEmpruntAjout.tsx
//? Formulaire de création d'un nouvel emprunt

import { useState } from "react";

import type { CreateEmpruntDTO } from "../types/index";
import { createEmprunt } from "../services/api/empruntService";


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

    const [chargement, setChargement] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [erreur, setErreur] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [champs, setChamps] = useState<string[]>([]);

    const [livre_id, setLivre_id] = useState(idLivre || 0);
    const [adherent_id, setAdherent_id] = useState(idAdherent || 0);

    const newEmprunt: CreateEmpruntDTO = {
        livre_id: livre_id,
        adherent_id: adherent_id
    }

    const emprunterLivre = async () => {
        clearInfos();
        setChargement(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const response = await createEmprunt(newEmprunt);
            if(!response.success) {
                setChargement(false);
                setErreur(response.error ?? "Erreur inconnue"); 
                // message renvoyé par l'API - typiquement un message d'erreur 
                setErrorMessage(response.message ?? response.error ?? "Livre non emprunté"); 
                // récupération des champs de formulaires fautifs
                if (response.champs) {
                    setChamps(response.champs);
                }
                return;
            }
            setMessage(response.message ?? 'Livre emprunté');

        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
        setChargement(false);
    }
    
    const clearInfos = () => {
        setChargement(false);
        setMessage(null);
        setErreur(null);
        setErrorMessage(null);
        setChamps([]);
    }


    return (
        isOpen && (
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
                            <input className="input has-text-centered" type="number" required placeholder="ID adhérent..."
                                onChange={(e) => setAdherent_id(Number(e.target.value))} />
                        </div>
                    </div>
                    {/* id du livre */}
                    <div className="field">
                        <label htmlFor="livre_field" className="label has-text-centered">Livre</label>
                        <div id="livre_field" className="control ">
                            <input className="input has-text-centered" type="number" required placeholder="ID livre"
                                onChange={(e) => setLivre_id(Number(e.target.value))} />
                        </div>
                    </div>
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
                        <div className="control buttons ">
                            
                            {erreur
                            ? <button type="button"
                                disabled={chargement} 
                                className="button is-warning " 
                                onClick={() => clearInfos()}
                                >
                                Correction OK ?
                            </button>
                            : <button type='button' 
                                disabled={erreur !== null || chargement || adherent_id === 0 || livre_id === 0 } 
                                className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                                onClick={() => emprunterLivre()}
                                >
                                Valider Emprunt !
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
        </div>)
    );
}