//% frontend/src/components/ModalAdherentSupprimer.tsx
//? Confirmation de suppression d'un adherent

import { useState } from "react";

import { useAdherents } from "../../hooks";

interface ModalAdherentSupprimerProps {
    readonly adherentID: number
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

/**
 *  Composant Modal de suppression d'adhérent
 * @export function ModalAdherentSupprimer
 * @param adherentID
 * @param isOpen
 * @param onClose
 * @returns ModalAdherentSupprimer -> visuel de suppression d'adhérent
 */
export default function ModalAdherentSupprimer({ 
    adherentID,
    isOpen,
    onClose
}: ModalAdherentSupprimerProps) {

    // utilisation des hooks de gestion des adhérents
    const {
        adherents,
        supprimerAdherent,
        chargement,
        message,
        erreur,
        champsErreurs,
        resetFeedback
    } = useAdherents();

    const [confirmationSuppression, setConfirmationSuppression] = useState<boolean>(false)

    const [voirDetails, setVoirDetails] = useState<boolean>(false)

    // Adhérent chargé pour modification
    const adherent = adherents.find(adh => adh.id === adherentID);

    // Détails de l'adhérent
    const prenom = adherent?.prenom
    const nom = adherent?.nom
    const email = adherent?.email
    const code = adherent?.numero_adherent

    // fonction d'appel API via hook
    const suppressionAdherent = async () => {
        await supprimerAdherent(adherentID);
    }

    if (!isOpen) return null;

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">
                        Suppression de l'adhérent : {code}
                    </p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                {/* contenu du modal détails de l'adhérent */}
                <div className="modal-card-body">
                    <button className="button is-small is-primary is-light"
                        onClick={() => voirDetails? setVoirDetails(false) : setVoirDetails(true)}
                        >{voirDetails? 'Cacher détails' : 'Voir détails'}
                    </button>
                    { voirDetails && ( <div>
                        {/* prénom de l'adhérent */}
                        <div className="field">
                            <label htmlFor="prenom_field" className="label">Prénom</label>
                            <div id="prenom_field" className="control">
                                <input className="input"
                                    readOnly disabled
                                    value={prenom}/>
                            </div>
                            <p className="help is-danger ml-3"></p>
                        </div>
                        {/* nom de l'adhérent */}
                        <div className="field">
                            <label htmlFor="nom_field" className="label">Nom</label>
                            <div id="nom_field" className="control">
                                <input className="input" type="text" 
                                    readOnly disabled
                                    value={nom}/>
                            </div>
                            <p className="help is-danger ml-3"></p>
                        </div>
                        {/* code de l'adhérent */}
                        <div className="field">
                            <label htmlFor="code_field" className="label">Code ADH</label>
                            <div id="nom_field" className="control">
                                <input className="input" type="text"
                                    readOnly disabled
                                    value={code}/>
                            </div>
                            <p className="help is-danger ml-3"></p>
                        </div>
                        {/* email de l'adhérent */}
                        <div className="field">
                            <label htmlFor="email_field" className="label">Email</label>
                            <div id="email_field" className="control">
                                <input className="input" type="text"
                                    readOnly disabled
                                    value={email}/>
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
                                        className={erreur ? "button is-danger is-inactive" : "button is-danger is-light"} 
                                        disabled={erreur !== null || chargement } 
                                        onClick={() => {
                                            resetFeedback();
                                            setConfirmationSuppression(true)
                                        }}
                                        > Désactiver l'adhérent
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
                            )}
                            {confirmationSuppression && (
                                <div>
                                    <p>
                                        Confirmer la suppression ?
                                    </p>
                                    <button type="button" 
                                        className="button is-success is-light m-1" 
                                        onClick={() => 
                                            suppressionAdherent()
                                        }
                                        > Oui
                                    </button>
                                    <button type="button" 
                                        className="button is-link is-light m-1" 
                                        onClick={() => 
                                            setConfirmationSuppression(false)
                                        }
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