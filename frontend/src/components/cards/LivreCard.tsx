//% frontend/src/components/LivreCard.tsx
//? Carte de présentation d'un livre

// On réutilise l'interface Livre du backend — cohérence garantie
import type { Livre } from "../../types/index";

import DisponibiliteBadge from "../ui/DisponibiliteBadge";

// Interface des props du composant
interface LivreCardProps {
    readonly livre: Livre;
    readonly onSupprimer?: (id: number) => void; // prop optionnelle — callback depuis le parent
    readonly onEmprunter?: (id: number) => void;
    readonly onModifier?: (id: number) => void;
}

/**
 * Composant d'affichage d'un livre uniques, sous forme de card
 *
 * @export
 * @param {LivreCardProps} { 
 *     livre, 
 *     onSupprimer,
 *     onEmprunter, 
 *     onModifier 
 * }
 */
export default function LivreCard({ 
    livre, 
    onSupprimer,
    onEmprunter,
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
            <div className="card-footer">
            {onSupprimer && 
                    <button 
                        className="button is-danger is-light card-footer-item" 
                        onClick={() => onSupprimer?.(livre.id)}
                        >Supprimer
                    </button>
            }
            {onModifier && 
                    <button 
                        title="Modifier" 
                        className="button is-warning is-light card-footer-item" 
                        onClick={() => onModifier?.(livre.id)}
                        >Modifier
                    </button>}
            {onEmprunter && 
                    <button 
                        title="Emprunter" 
                        className="button is-success is-light card-footer-item" 
                        onClick={() => onEmprunter?.(livre.id)}
                        >Emprunter
                    </button>}
            
            
            </div>
        </div>
    );
}

