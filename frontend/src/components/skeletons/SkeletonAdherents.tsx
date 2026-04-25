//% frontend/src/components/SkeletonAdherents.tsx
//? Skeleton loader identique à AdherentCard

interface SkeletonAdherentsProps {
    readonly nombreAdherents?: number
}

/**
 *  Composant de skeleton loader calqué sur le rendu de AdherentCard
 *  Ici une liste fantôme de 6 adhérents par défaut
 * @param nombreAdherents
 * @returns SkeletonAdherents -> visuel shimmer de la liste des adhérents
 */
export default function SkeletonAdherents({ 
    nombreAdherents
}: SkeletonAdherentsProps) {

    // shimmer pour 6 cards adhérent par défaut
    const nombreShimmer = nombreAdherents || 6 

    return (
        <div className="columns is-multiline">
            {new Array(nombreShimmer).fill(0).map((_, i) => (
                <div key={i+1} className="column is-one-third">
                    <div className="card">
                        <div className="card-content">
                            {/* Titre shimmer */}
                            <div className="title is-4 mb-2 skeleton-line skeleton-line-long"></div>
                            
                            {/* Sous-titre shimmer */}
                            <div className="subtitle is-6 skeleton-half"></div>
                            
                            {/* Genre shimmer (50%) */}
                            <div className="subtitle is-6 skeleton-line"></div>
                            
                            {/* Badge shimmer */}
                            <div className="skeleton-badge"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}