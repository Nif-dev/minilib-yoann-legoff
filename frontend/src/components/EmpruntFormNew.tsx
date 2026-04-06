//% frontend/src/components/EmpruntFormNew.tsx
//? Formulaire de création d'un nouvel emprunt

import { useState } from "react";
interface EmpruntFormNewProps {
    readonly newEmpruntVisible: boolean;
    readonly idLivre?: number;
    readonly idAdherent?: number;
    readonly emprunterLivre: (livre_id: number, adherent_id: number) => void;
    readonly onClose: () => void;
}

export default function EmpruntFormNew({ 
    newEmpruntVisible, 
    idLivre, 
    idAdherent, 
    emprunterLivre, 
    onClose }
: EmpruntFormNewProps) {

    const [livre_id, setLivre_id] = useState(idLivre || 0);
    const [adherent_id, setAdherent_id] = useState(idAdherent || 0);

    return (
        newEmpruntVisible && (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
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
                                onChange={(e) => setLivre_id(Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Adhérent:
                            <input
                                type="number"
                                value={adherent_id}
                                onChange={(e) => setAdherent_id(Number(e.target.value))}
                                />
                        </label>
                    </form>
                </section>

                <footer className="modal-card-foot">
                    <div className="buttons">
                        <button type='button' className='button is-success' onClick={() => emprunterLivre(livre_id, adherent_id)}>Valider emprunt</button>
                        <button type='button' className="button" >Annuler</button>
                    </div>
                </footer>
            </div>
        </div>)
    );
}