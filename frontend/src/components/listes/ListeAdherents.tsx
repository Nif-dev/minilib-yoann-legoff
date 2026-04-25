//% frontend/src/components/ListeAdherents.tsx
//? Composant de liste d'adhérents

import type { Adherent } from "../../types/index";
import AdherentCard from "../cards/AdherentCard";

interface ListeAdherentsProps {
    readonly adherents: Adherent[];
    readonly onAction: (action: 'modifier' | 'supprimer' | 'emprunter' , id: number) => void
}

/**
 *  Composant de liste d'adhérents - liste de cards
 * @export function ListeAdherents
 * @param adherents
 * @param onAction
 * @returns ListeAdherents -> JSX de la liste des adhérents
 */
export default function ListeAdherents({ 
    adherents,
    onAction
}: ListeAdherentsProps) {

    if (!adherents?.length) {
        return <p className="subtitle m-6">Aucun adhérents ne correspond à cette recherche</p>;
    }

    return (
        <div className="my-4">
            <ul className="columns is-multiline">
                {adherents?.map((adh) => (
                    <li className="column is-one-third" 
                        key={adh.id}> 
                        <AdherentCard 
                            adherent={adh} 
                            onAction={onAction}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}