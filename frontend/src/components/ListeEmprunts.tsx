//% frontend/src/components/ListeEmprunts.tsx
//? Composant de liste d'emprunts

import type { EmpruntAvecDetails } from "../types/index";
import EmpruntCard from "./EmpruntCard";

interface ListeEmpruntsProps {
    readonly emprunts: EmpruntAvecDetails[];
    readonly rendreLivre: (id: number) => void
}

export default function ListeEmprunts({ emprunts, rendreLivre }: ListeEmpruntsProps) {

    if (!emprunts?.length) {
        return <p>Aucun livre pour cette recherche</p>;
    }

    return (
        <div>
            <ul className="liste-livres columns is-multiline">
                {emprunts?.map((emprunt) => (
                    <li className="column is-one-quarter" key={emprunt.id}> 
                    {/* key est indispensable ! - React identifie chaque élément */}
                        <EmpruntCard emprunt={emprunt} rendreLivre={rendreLivre}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}