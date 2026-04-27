//% frontend/src/components/AdherentCard.tsx
//? Carte de présentation d'un adhérent

// On réutilise l'interface Adherent du backend — cohérence garantie
import type { Adherent } from "../../types/index";

import { useState } from "react";

interface AdherentCardProps {
    readonly adherent: Adherent;
    readonly onAction: (action: 'modifier' | 'supprimer' | 'emprunter', id: number) => void;
    }

/**
 *  Composant de carte de présentation d'un adhérent
 * @export function AdherentCard
 * @param adherent
 * @param onAction - action + id d'un adhérent
 * @enum => onAction - modifier - supprimer - emprunt
 * @returns AdherentCard -> rendu d'un adhérent sous forme de carte
 */
export default function AdherentCard({ 
    adherent,
    onAction
}: AdherentCardProps) {

    const date = new Date(adherent.created_at);
    
    const [ showEmail, setShowEmail ] = useState(false);

    // Obfuscation de l'email sur l'affichage
    const emailObf = () => {
        let obf = '';
        for (let i = 0; i < adherent.email.length; i++) {
            obf += '*';
        } 
        return obf
    }

    const toggleEmail = () => {
        setShowEmail(!showEmail);
    }

    return (
        <div className="card">
            <div className="card-content">
                <div className="is-flex is-justify-content-space-between">
                    <div className="title is-4 mb-2">
                        {adherent.prenom} {adherent.nom}
                        
                    </div>
                    
                    <div className="has-text-grey is-size-7">
                        <p>
                            {adherent.numero_adherent}
                        </p>
                        <p className="has-text-grey">
                            id: {adherent.id}
                        </p>
                        
                    </div>
                </div>
                <div className="subtitle is-6"> 
                    <p>
                        Inscrit depuis le : {date.toLocaleDateString()}
                    </p>
                    <div className="is-flex is-right is-align-items-center mt-3">
                        <p className="has-text-grey is-size-5">Email</p>
                        <button className="button is-small is-light ml-3" onClick={toggleEmail}>
                            {showEmail ? 'Cacher' : 'Afficher'}
                        </button>
                    </div>
                    <div>
                        { showEmail && <p> {adherent.email}</p>}
                        <strong>{ !showEmail && <p> {emailObf()}</p>}</strong>
                        </div>
                </div>
            </div>

            {/* Boutons d'actions */}
            <div className="card-footer">
            
                <button type="button" title="Supprimer"
                    className="card-footer-item button is-danger is-light"
                    onClick={() => onAction('supprimer', adherent.id)}
                    >Désactiver 
                </button>
            
                <button type="button" title="Modifier"
                    className="card-footer-item button is-warning is-light"
                    onClick={() => onAction('modifier', adherent.id)}
                    > Modifier
                </button>
            
                <button type="button" title="Emprunter"
                    className="card-footer-item button is-primary is-light" 
                    onClick={() => onAction('emprunter', adherent.id)}
                    > Nouvel emprunt
                </button>
            
            </div>
        
        </div>
    );
}

