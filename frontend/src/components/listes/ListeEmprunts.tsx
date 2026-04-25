//% frontend/src/components/ListeEmprunts.tsx
//? Composant de liste d'emprunts

import type { EmpruntAvecDetails } from "../../types/index";
import EmpruntCard from "../cards/EmpruntCard";

interface ListeEmpruntsProps {
    readonly emprunts: EmpruntAvecDetails[];
    readonly onRetourLivre: (id: number) => void
}

/**
 *  Composant de liste d'emprunts - liste de cards
 * @export function ListeEmprunts
 * @param emprunts
 * @param onRetourLivre - callback
 * @returns ListeEmprunts -> JSX de la liste d'emprunts
 */
export default function ListeEmprunts({ 
    emprunts, 
    onRetourLivre 
}: ListeEmpruntsProps) {

    if (!emprunts?.length) {
        return <p>Aucun emprunts en cours !</p>;
    }

    return (
        <div className="my-4">
            <ul className="liste-livres columns is-multiline">
                {emprunts?.map((emprunt) => (
                    <li className="column is-one-quarter" 
                        key={emprunt.id}> 
                    {/* key est indispensable ! - React identifie chaque élément */}
                        <EmpruntCard 
                            emprunt={emprunt} 
                            onRetourLivre={onRetourLivre}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}