//% frontend/src/components/ModalAdherentAjout.tsx
//? Formulaire de création d'un nouvel adherent

import { useState } from "react";

import type { CreateAdherentDTO } from "../types/index";
import { createAdherent } from "../services/api/adherentService";

interface ModalAdherentAjoutProps {
    
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export default function ModalAdherentAjout({ 
    isOpen,
    onClose
}: ModalAdherentAjoutProps) {

    const [chargement, setChargement] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [erreur, setErreur] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [champs, setChamps] = useState<string[]>([]);

    const clearInfos = () => {
        setChargement(false);
        setMessage(null);
        setErreur(null);
        setErrorMessage(null);
        setChamps([]);
    }

    // Données du formulaire
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    
    
    const newAdherent: CreateAdherentDTO = {
        nom: nom,
        prenom: prenom,
        email: email
    }

    const ajouterLivre = async () => {
        clearInfos();
        setChargement(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const response = await createAdherent(newAdherent);

            if (!response.success) {
                setChargement(false);
                setErreur(response.error ?? "Erreur inconnue"); 
                // message renvoyé par l'API - typiquement un message d'erreur 
                setErrorMessage((response.message ?? response.error ?? '' )+ " : Adhérent non ajouté"); 
                // récupération des champs de formulaires fautifs
                if (response.champs) {
                    setChamps(response.champs);
                }
                return;
            }
            setMessage(response.message ?? 'Adhérent ajouté');
            // autres traitements sur la réponse api si besoin

        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
        setChargement(false);
    }

    return (
        isOpen && (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Ajout d'un nouvel adhérent</p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                {/* contenu du formulaire */}
                <div className="modal-card-body">
                    {/* prénom de l'adhérent */}
                    <div className="field">
                        <label htmlFor="prenom_field" className="label">Prénom</label>
                        <div id="prenom_field" className="control">
                            <input className="input" type="text" required placeholder="Prénom..."
                                onChange={(e) => setPrenom(e.target.value)} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* nom de l'adhérent */}
                    <div className="field">
                        <label htmlFor="nom_field" className="label">Nom</label>
                        <div id="nom_field" className="control">
                            <input className="input" type="text" required placeholder="Nom..."
                                onChange={(e) => setNom(e.target.value)} />
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    
                    {/* email de l'adhérent */}
                    <div className="field">
                        <label htmlFor="email_field" className="label">Email</label>
                        <div id="email_field" className="control">
                            <input className="input" type="text" required placeholder="Email..." 
                                onChange={(e) => setEmail(e.target.value)} />
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
                                disabled={erreur !== null || chargement || nom === '' || prenom === '' || email === ''} 
                                className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                                onClick={() => ajouterLivre()}
                                >
                                Inscription !
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