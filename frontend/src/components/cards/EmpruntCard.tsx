//% frontend/src/components/EmpruntCard.tsx
//? Carte de présentation d'un emprunt

// On réutilise l'interface Emprunt du backend — cohérence garantie
import type { EmpruntAvecDetails } from "../../types/index";

import { useState } from "react";

interface EmpruntCardProps {
    readonly emprunt: EmpruntAvecDetails;
    readonly onRetourLivre: (id: number) => void
}

/**
 *  Composant de carte de présentation d'un emprunt
 * @export function EmpruntCard
 * @param emprunt
 * @param onRetourLivre - action de retour d'un livre emprunté + id de l'emprunt
 * @returns EmpruntCard -> rendu d'un emprunt sous forme de carte
 */
export default function EmpruntCard({ 
    emprunt,
    onRetourLivre 
}: EmpruntCardProps) {
    
    const dateEmprunt = new Date(emprunt.date_emprunt);
    const dateRetourPrevu = new Date(emprunt.date_retour_prevue);
    const dateRetourEffective = emprunt.date_retour_effective ? new Date(emprunt.date_retour_effective) : null;
    
    const [ confirmationRetour, setConfirmationRetour ] = useState(false);

    return (
        <div className="card">
            <header className="card-header">
                <div className="card-header-title is-size-4">
                        {emprunt.titre_livre}
                </div>
                
            </header>
            <div className="card-content">
                <p className="subtitle is-6">
                    Emprunté par : <b>{emprunt.nom_adherent}</b>
                </p>
                <p className="subtitle is-6"> 
                    Depuis le : {dateEmprunt.toLocaleDateString()}
                </p>
                {!emprunt.en_retard && <p className="subtitle is-6"> 
                    Retour prevu le : {dateRetourPrevu.toLocaleDateString()}
                </p>}
                {emprunt.en_retard && (
                    <p className="subtitle is-6 button is-warning"> 
                        Retard depuis le : <br /> {dateRetourPrevu.toLocaleDateString()}
                    </p>
                )}
            </div>
            <div className="card-footer">
                <div>
                    {!dateRetourEffective && !confirmationRetour && (    
                        <div className="is-flex is-justify-content-space-between">
                            <button 
                                className="card-footer-item button is-success is-light" 
                                onClick={() => setConfirmationRetour(true)}
                                > Retour du livre
                            </button>
                            <span className="card-footer-item has-text-grey"
                                > emprunt n°: {emprunt.id}
                            </span>
                        </div>
                    )}
                    {confirmationRetour && (
                    <div className="is-flex is-justify-content-space-between">
                        <button className="card-footer-item button is-success is-light" 
                            onClick={() => onRetourLivre(emprunt.id)}
                            > Confirmer le retour
                        </button>
                        <button className="card-footer-item button is-danger is-light" 
                            onClick={() => setConfirmationRetour(false)}
                            > Annuler
                        </button>
                    </div>
                    )}
                </div>
                
            </div>
            
        </div>
    );
}

