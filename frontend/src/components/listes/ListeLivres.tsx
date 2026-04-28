//% frontend/src/components/ListeLivres.tsx
//? Composant de liste de livres

import type { Livre } from "../../types/index";
import LivreCard from "../cards/LivreCard";

interface ListeLivresProps {
    readonly livres: Livre[];
    readonly onModifier?: (id: number) => void
    readonly onEmprunter?: (id: number) => void
    readonly onSupprimer?: (id: number) => void
}

/**
 *  Composant de liste de livres - liste de cards
 * @export function ListeLivres
 * @param livres
 * @param onModifier
 * @param onEmprunter
 * @param onSupprimer
 * @returns ListeLivres -> JSX de la liste de livres
 */
export default function ListeLivres({ 
    livres, 
    onEmprunter,
    onModifier, 
    onSupprimer
}: ListeLivresProps) {

    if (!livres?.length) {
        return <p className="subtitle m-6">Aucun livre pour cette recherche</p>;
    }

    return (
        <div className="my-4">
            <ul className="liste-livres columns is-multiline">
                {livres?.map((livre) => (
                    <li className="column is-one-quarter" key={livre.id}> 
                    {/* key est indispensable ! - React identifie chaque élément */}
                        {/* <LivreCard livre={livre} /> */}
                        <LivreCard 
                            livre={livre} 
                            onSupprimer={onSupprimer}
                            onModifier={onModifier}
                            {...(livre.disponible && 
                                {
                                // onModifier : () => onModifier?.(livre.id), 
                                onEmprunter : () => onEmprunter?.(livre.id),
                                // onSupprimer : () => onSupprimer?.(livre.id)
                                }
                            )}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}