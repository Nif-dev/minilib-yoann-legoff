//% frontend/src/components/ModalAdherentModifier.tsx
//? Formulaire de modification d'un adherent

import { useState } from "react";

import { useAdherents } from "../../hooks";
import type { UpdateAdherentDTO } from "../../types";


interface ModalAdherentModifierProps {
    readonly adherentID: number
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export default function ModalAdherentModifier({ 
    adherentID,
    isOpen,
    onClose
}: ModalAdherentModifierProps) {

    // utilisation des hooks de gestion des adhérents
    const {
        adherents,
        modifierAdherent,
        chargement,
        message,
        erreur,
        champsErreurs,
        resetFeedback
    } = useAdherents();

    // Adhérent chargé pour modification
    const adherent = adherents.find(adh => adh.id === adherentID);
    

    // Données du formulaire
    const [nom, setNom] = useState(adherent?.nom || '');
    const [prenom, setPrenom] = useState(adherent?.prenom || '');
    const [email, setEmail] = useState(adherent?.email || '');

    
    const modifiedAdherent: UpdateAdherentDTO = {
        nom: nom,
        prenom: prenom,
        email: email
    }

    // fonction de modification adhérent - callback
    const modificationAdherent = async () => {
        if (nom === adherent?.nom && prenom === adherent?.prenom && email === adherent?.email) {
            return;
        }
        await modifierAdherent(adherentID,modifiedAdherent);
    }

    // reset des champs
    const resetChamps = () => {
        setNom(adherent?.nom || '');
        setPrenom(adherent?.prenom || '');
        setEmail(adherent?.email || '');
    }

    return (
        isOpen && (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Modification de l'adhérent</p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                {/* contenu du formulaire */}
                <div className="modal-card-body">
                    {/* prénom de l'adhérent */}
                    <div className="field">
                        <label htmlFor="prenom_field" className="label">Prénom</label>
                        <div id="prenom_field" className="control">
                            <input className="input" type="text" 
                                required placeholder="Prénom..."
                                onChange={(e) => setPrenom(e.target.value)} 
                                value={prenom}/>
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    {/* nom de l'adhérent */}
                    <div className="field">
                        <label htmlFor="nom_field" className="label">Nom</label>
                        <div id="nom_field" className="control">
                            <input className="input" type="text" 
                                required placeholder="Nom..."
                                onChange={(e) => setNom(e.target.value)} 
                                value={nom}/>
                        </div>
                        <p className="help is-danger ml-3"></p>
                    </div>
                    
                    {/* email de l'adhérent */}
                    <div className="field">
                        <label htmlFor="email_field" className="label">Email</label>
                        <div id="email_field" className="control">
                            <input className="input" type="text" 
                                required placeholder="Email..." 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email}/>
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
                                disabled={erreur !== null || chargement || nom === '' || prenom === '' || email === ''} 
                                className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                                onClick={() => {
                                    resetFeedback();
                                    modificationAdherent();
                                }}
                                > Modifier l'adhérent
                            </button>

                            <button type="button" 
                                disabled={chargement}
                                className="button is-link is-light"
                                onClick={()=> {
                                    resetChamps(); 
                                    resetFeedback();
                                }} 
                                > Annuler modification
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
                    </div>
                </footer>
            </div>
        </div>)
    );
}