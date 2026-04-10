//% frontend/src/components/LivreCard.tsx
//? Carte de présentation d'un livre

// On réutilise l'interface Livre du backend — cohérence garantie
import type { Livre } from "../types/index";

import DisponibiliteBadge from "./DisponibiliteBadge";

// Interface des props du composant
interface LivreCardProps {
    readonly livre: Livre;
    readonly onSupprimer?: (id: number) => void; // prop optionnelle — callback depuis le parent
    readonly onModifier?: (id: number) => void;
}

/**
 * Composant d'affichage d'un livre uniques, sous forme de card
 *
 * @export
 * @param {LivreCardProps} { 
 *     livre, 
 *     onSupprimer, 
 *     onModifier 
 * }
 * @return {*} 
 */
export default function LivreCard({ 
    livre, 
    onSupprimer, 
    onModifier 
}: LivreCardProps) {

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
                <div className="is-flex is-justify-content-space-between">
                    <DisponibiliteBadge disponibilite={livre.disponible} />
                    
                    <div className="has-text-grey is-size-7">id: {livre.id}</div>
                    </div>
            </div>
            
            {/* onSupprimer et onModifier sont optionnels, leur affichage aussi */}
            <footer className="card-footer">
            {onSupprimer && (
                    <button 
                        className="button card-footer-item" 
                        onClick={() => onSupprimer(livre.id)}
                        >Supprimer
                    </button>
            )}
            {onModifier && <button 
                        title="Modifier" 
                        className="button card-footer-item" 
                        onClick={() => onModifier?.(livre.id)}
                        >Modifier
                    </button>}
            
            </footer>
        </div>
    );
}

// Utilisation — TypeScript vérifie que livre est bien un Livre :
// <LivreCard livre={monLivre} />
// <LivreCard livre={monLivre} onSupprimer={(id) => console.log(id)} />
//! onSupprimer est défini par le parent, déclenché par le composant LivreCard
