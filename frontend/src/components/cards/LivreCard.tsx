//% frontend/src/components/LivreCard.tsx
//? Carte de présentation d'un livre

// On réutilise l'interface Livre du backend — cohérence garantie
import type { Livre } from "../../types/index";

import DisponibiliteBadge from "../ui/DisponibiliteBadge";

interface LivreCardProps {
    readonly livre: Livre;
    readonly onSupprimer?: (id: number) => void; // prop optionnelle — callback depuis le parent
    readonly onEmprunter?: (id: number) => void;
    readonly onModifier?: (id: number) => void;
}

/**
 *  Composant d'affichage d'un livre unique, sous forme de card
 * @export function Livrecard
 * @param livre
 * @param onSupprimer
 * @param onEmprunter
 * @param onModifier
 * @returns LivreCard -> rendu d'un livre sous forme de carte
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
            
            {/* les actions sont optionnels, leurs affichages aussi, distinctement */}
            <div className="card-footer">

                {onSupprimer && 
                    <button type="button" title="Supprimer"
                        className="card-footer-item button is-danger is-light" 
                        onClick={() => onSupprimer?.(livre.id)}
                        >Supprimer
                    </button>}
                
                {onModifier && 
                    <button type="button" title="Modifier" 
                        className="card-footer-item button is-warning is-light" 
                        onClick={() => onModifier?.(livre.id)}
                        >Modifier
                    </button>}
                
                {onEmprunter && 
                    <button type="button" title="Emprunter" 
                        className="card-footer-item button is-success is-light" 
                        onClick={() => onEmprunter?.(livre.id)}
                        >Emprunter
                    </button>}
            
            </div>
        </div>
    );
}

