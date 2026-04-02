//% frontend/src/components/LivreCard.tsx
//? Carte de présentation d'un livre

// On réutilise l'interface Livre du backend — cohérence garantie
import type { Livre } from "../types/index";

import DisponibiliteBadge from "./DisponibiliteBadge";

// Interface des props du composant
interface LivreCardProps {
    readonly livre: Livre;
    readonly onSupprimer?: (id: number) => void; // prop optionnelle — callback depuis le parent
}

// Composant avec ses props typées
export default function LivreCard({ livre, onSupprimer }: LivreCardProps) {

    return (
        <div className="card">
            <div className="card-content">
                <p className="title is-4 mb-2">{livre.titre}</p>
                <p className="subtitle is-6">
                    {livre.auteur} — {livre.annee ? livre.annee : ""}
                </p>
                {livre.genre &&
                    (<p className="subtitle is-6">{livre.genre}</p>)
                }
                <DisponibiliteBadge disponibilite={livre.disponible} />
            </div>
            
            {/* onSupprimer est optionnel, et son affichage aussi */}
            {onSupprimer && (
                <footer className="card-footer">
                    <button className="button card-footer-item" onClick={() => onSupprimer(livre.id)}>
                        Supprimer
                    </button>
                </footer>
            )}
        </div>
    );
}

// Utilisation — TypeScript vérifie que livre est bien un Livre :
// <LivreCard livre={monLivre} />
// <LivreCard livre={monLivre} onSupprimer={(id) => console.log(id)} />
//! onSupprimer est défini par le parent, déclenché par le composant LivreCard
