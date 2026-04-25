//% frontend/src/components/DisponibiliteBadge.tsx
//? Badge de disponibilité d'un livre

interface DisponibiliteBadgeProps {
    readonly disponibilite: boolean
}

/**
 *  Composant de badge de disponibilité d'un livre
 *  affiche "disponible" ou "indisponible"
 * @param disponibilite - boolean obligatoire
 * @returns DisponibiliteBadge -> badge de disponibilité d'un livre
 */
export default function DisponibiliteBadge( disponibilite: DisponibiliteBadgeProps ) {

    return (
        <span className = {`tag is-${disponibilite.disponibilite ? 'success' : 'danger'}`}  >
            {disponibilite.disponibilite ? 'Disponible' : 'Emprunté'}
        </span>
    );
}
