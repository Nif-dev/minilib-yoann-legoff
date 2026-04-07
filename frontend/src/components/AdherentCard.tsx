//% frontend/src/components/AdherentCard.tsx
//? Carte de présentation d'un adhérent

// On réutilise l'interface Adherent du backend — cohérence garantie
import type { Adherent } from "../types/index";

// Interface des props du composant
interface AdherentCardProps {
    readonly adherent: Adherent;
    readonly nouvelEmprunt: () => void;
    }

// Composant avec ses props typées
export default function AdherentCard({ 
    adherent,
    nouvelEmprunt
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
            <div className="card-footer">
                <div className="card-footer-item">
                    <button>Désactiver *a venir*</button>
                </div>
                <div className="card-footer-item">
                    <button>Modifier *a venir*</button>
                </div>
                <div className="card-footer-item">
                    <button className="button is-success is-light m-1" 
                        onClick={nouvelEmprunt}>
                            Nouvel emprunt *a venir*
                        </button>
                </div>
            </div>
            
        </div>
    );
}

