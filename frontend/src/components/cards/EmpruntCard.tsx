//% frontend/src/components/EmpruntCard.tsx
//? Carte de présentation d'un emprunt

// On réutilise l'interface Adherent du backend — cohérence garantie
import type { EmpruntAvecDetails } from "../../types/index";

// Interface des props du composant
interface EmpruntCardProps {
    readonly emprunt: EmpruntAvecDetails;
    readonly rendreLivre: (id: number) => void
    }

// Composant avec ses props typées
export default function EmpruntCard({ 
    emprunt,
    rendreLivre 
}: EmpruntCardProps) {

    const dateEmprunt = new Date(emprunt.date_emprunt);
    const dateRetourPrevu = new Date(emprunt.date_retour_prevue);
    const dateRetourEffective = emprunt.date_retour_effective ? new Date(emprunt.date_retour_effective) : null;
    
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
                <p className="subtitle is-6"> 
                    Retour prevu le : {dateRetourPrevu.toLocaleDateString()}
                </p>
                {emprunt.en_retard && (
                    <p className="subtitle is-6 tag is-warning"> 
                        En retard depuis le : {dateRetourEffective?.toLocaleDateString()}
                    </p>
                )}
            </div>
            <div className="card-footer">
                <div>
                    {!dateRetourEffective && (    
                        <button className="button is-success is-light m-1" 
                        onClick={() => rendreLivre(emprunt.id)}> 
                        Retour du livre
                    </button>
                    )}
                </div>
                <div className="card-footer-item is-size-7 has-text-grey">emprunt n°: {emprunt.id}</div>
            </div>
            
        </div>
    );
}

