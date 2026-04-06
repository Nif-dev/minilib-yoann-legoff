//% frontend/src/components/AdherentCard.tsx
//? Carte de présentation d'un adhérent

// On réutilise l'interface Adherent du backend — cohérence garantie
import type { Adherent } from "../types/index";

// Interface des props du composant
interface AdherentCardProps {
    readonly adherent: Adherent;
    }

// Composant avec ses props typées
export default function AdherentCard({ adherent }: AdherentCardProps) {

    const date = new Date(adherent.created_at);

    return (
        <div className="card">
            <div className="card-content">
                <p className="title is-4 mb-2">
                    {adherent.prenom} {adherent.nom}
                </p>
                <p className="subtitle is-6">
                    {adherent.numero_adherent}
                </p>
                <p className="subtitle is-6"> 
                    Inscrit depuis le : {date.toLocaleDateString()}
                </p>
            </div>
            
        </div>
    );
}

