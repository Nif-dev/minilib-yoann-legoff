//% frontend/src/components/ModalEmpruntAjout.tsx
//? Formulaire de création d'un nouvel emprunt

import { useState } from "react";

import type { CreateEmpruntDTO } from "../types/index";
import { createEmprunt } from "../services/api/empruntService";


interface ModalEmpruntAjoutProps {
    readonly newEmpruntVisible: boolean;
    readonly idLivre?: number;
    readonly idAdherent?: number;
    readonly onClose: () => void;
}

export default function ModalEmpruntAjout({ 
    newEmpruntVisible, 
    idLivre, 
    idAdherent, 
    onClose }
: ModalEmpruntAjoutProps) {

    const [erreur, setErreur] = useState<string | null>(null);
    const [chargement, setChargement] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const [livre_id, setLivre_id] = useState(idLivre || 0);
    const [adherent_id, setAdherent_id] = useState(idAdherent || 0);

    const emprunterLivre = async (idLivre: number, idAdherent: number) => {
        const newEmprunt: CreateEmpruntDTO = {
            livre_id: idLivre,
            adherent_id: idAdherent
        }
        clearInfos();
        setChargement(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const response = await createEmprunt(newEmprunt);
            const message = response.success? 
                (response.message || 'Livre emprunté') 
                : (response.message || "Livre non emprunté");
            setMessage(response.message ?? message);
        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
        setChargement(false);
    }
    const clearInfos = () => {
        setChargement(false);
        setErreur(null);
        setMessage(null);
    }


    return (
        newEmpruntVisible && (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Nouvel emprunt</p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                <section className="modal-card-body">
                    
                    <form>
                        <label>
                            Livre:
                            <input
                                type="number"
                                value={livre_id}
                                onChange={(e) => {
                                    setLivre_id(Number(e.target.value))
                                    clearInfos();
                                }}
                            />
                        </label>
                        <label>
                            Adhérent:
                            <input
                                type="number"
                                value={adherent_id}
                                onChange={(e) => {
                                    setAdherent_id(Number(e.target.value))
                                    clearInfos();
                                }}
                                />
                        </label>
                    </form>
                    { chargement && <div className="has-text-success has-text-centered my-4">Requête en cours ...</div> }
                    {message && <div className="has-text-success has-text-centered my-4">{message}</div>}
                    {erreur && <div className="has-text-danger has-text-centered my-4">{erreur}</div>}
                    
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons">
                        <button type='button' 
                            disabled={livre_id === 0 || adherent_id === 0 || erreur !== null} 
                            className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                            onClick={() => emprunterLivre(livre_id, adherent_id)}
                            >
                                Valider emprunt
                        </button>

                        <button type='button' className="button" onClick={onClose}>Annuler</button>
                    </div>
                </footer>
            </div>
        </div>)
    );
}