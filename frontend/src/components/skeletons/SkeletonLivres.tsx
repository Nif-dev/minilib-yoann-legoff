//% frontend/src/components/SkeletonLivres.tsx
//? Skeleton loader identique à LivreCard

interface SkeletonLivresProps {
    readonly nombreLivres?: number
}

/**
 *  Composant de skeleton loader calqué sur le rendu de LivreCard
 *  Ici une liste fantôme de 8 livres par défaut
 * @param nombreLivres
 * @returns SkeletonLivres -> visuel shimmer de la liste des livres
 */
export default function SkeletonLivres({ 
    nombreLivres
}: SkeletonLivresProps) {

    // shimmer pour 8 cards livre par défaut
    const nombreShimmer = nombreLivres || 8 

    return (
        <div className="columns is-multiline">
            {new Array(nombreShimmer).fill(0).map((_, i) => (
                <div key={i+1} className="column is-one-quarter">
                    <div className="card">
                        <div className="card-content">
                            {/* Titre shimmer */}
                            <div className="title is-4 mb-2 skeleton-line skeleton-line-long"></div>
                            
                            {/* Sous-titre shimmer */}
                            <div className="subtitle is-6 skeleton-line"></div>
                            
                            {/* Genre shimmer (50%) */}
                            <div className="subtitle is-6 skeleton-line skeleton-half"></div>
                            
                            {/* Badge shimmer */}
                            <div className="skeleton-badge"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}