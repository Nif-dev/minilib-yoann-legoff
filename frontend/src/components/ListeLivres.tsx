//% frontend/src/components/ListeLivres.tsx
//? Composant de liste de livres

import type { Livre } from "../types/index";
import LivreCard from "./LivreCard";

interface ListeLivresProps {
    readonly livres: Livre[];
}

export default function ListeLivres({ livres }: ListeLivresProps) {

    if (!livres?.length) {
        console.log(livres)
        return <p>Aucun livre dans le catalogue</p>;
    }

    return (
        <div>
            <ul className="liste-livres columns is-multiline">
                {livres?.map((livre) => (
                    <li className="column is-one-quarter" key={livre.id}> 
                    {/* key est indispensable ! - React identifie chaque élément */}
                        <LivreCard livre={livre} />
                    </li>
                ))}
            </ul>
        </div>
    );
}