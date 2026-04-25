//% frontend/src/components/AdherentCard.tsx
//? Carte de présentation d'un adhérent

// On réutilise l'interface Adherent du backend — cohérence garantie
import type { Adherent } from "../../types/index";

// Interface des props du composant
interface AdherentCardProps {
    readonly adherent: Adherent;
    readonly onAction: (action: 'modifier' | 'supprimer' | 'emprunt', id: number) => void;
    }

// Composant avec ses props typées
export default function AdherentCard({ 
    adherent,
    onAction
}: AdherentCardProps) {

    const date = new Date(adherent.created_at);
    

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
                <p className="subtitle is-6"> 
                    Inscrit depuis le : {date.toLocaleDateString()}
                </p>
            </div>

            {/* Boutons d'actions */}
            <div className="card-footer">
            
                <button 
                    className="button is-danger is-light card-footer-item"
                    onClick={() => onAction('supprimer', adherent.id)}
                    >Désactiver 
                </button>
            
                <button type="button"
                    className="button card-footer-item is-warning is-light"
                    onClick={() => onAction('modifier', adherent.id)}
                    > Modifier
                </button>
            
                <button type="button"
                    className="button card-footer-item is-primary is-light" 
                    onClick={() => onAction('emprunt', adherent.id)}
                    > Nouvel emprunt
                </button>
            
            </div>
        
        </div>
    );
}

