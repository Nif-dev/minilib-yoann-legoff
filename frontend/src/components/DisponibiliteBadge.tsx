//% frontend/src/components/DisponibiliteBadge.tsx
//? Badge de disponibilité d'un livre

// Composant simple - prend en paramétre la disponibilité d'un livre
// => affiche "disponible" ou "indisponible"

interface DisponibiliteBadgeProps {
    readonly disponibilite: boolean
}
export default function DisponibiliteBadge( disponibilite: DisponibiliteBadgeProps ) {

    return (
        <span style={disponibilite.disponibilite?{color: "green"}: {color:"red"}}>
            {disponibilite.disponibilite ? 'Disponible' : 'Emprunté'}
        </span>
    );
}
