//% frontend/src/components/ListeLivres.tsx
//? Composant de liste de livres

import type { Livre } from "../types/index";
import LivreCard from "./LivreCard";

interface ListeLivresProps {
    readonly livres: Livre[];
    readonly onModifier?: (id: number) => void
}

export default function ListeLivres({ 
    livres, 
    onModifier 
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
                            {...(livre.disponible && 
                                { onModifier : () => onModifier?.(livre.id) }
                            )}
                            />
                    </li>
                ))}
            </ul>
        </div>
    );
}