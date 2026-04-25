//% frontend/src/components/SkeletonEmprunts.tsx
//? Skeleton loader identique à EmpruntCard

interface SkeletonEmpruntsProps {
    readonly nombreEmprunts?: number
}

/**
 *  Composant de skeleton loader calqué sur le rendu de EmpruntCard
 *  Ici une liste fantôme de 8 emprunts par défaut
 * @param nombreEmprunts
 * @returns SkeletonEmprunts -> visuel shimmer de la liste des emprunts
 */
export default function SkeletonEmprunts({
    nombreEmprunts
}: SkeletonEmpruntsProps) {

    // shimmer pour 8 cards emprunt par défaut
    const nombreShimmer = nombreEmprunts || 8 

    return (
        <div className="columns is-multiline">
            {new Array(nombreShimmer).fill(0).map((_, i) => (
                <div key={i+1} className="column is-one-quarter">
                    <div className="card m-4">
                        <div className="card-header p-5">
                            {/* Titre shimmer */}
                            <div className="title is-4  skeleton-line skeleton-line-long"></div>
                        </div>
                        <div className="card-content ">
                            {/* Titre shimmer */}
                            <div className="title is-4 mb-2 skeleton-line skeleton-line-long"></div>
                            
                            {/* Sous-titre shimmer */}
                            <div className="subtitle is-6 skeleton-half"></div>
                            
                            {/* Genre shimmer (50%) */}
                            <div className="subtitle is-6 skeleton-line"></div>
                            
                            {/* Genre shimmer (50%) */}
                            <div className="subtitle is-6 skeleton-line"></div>
                        </div>
                        <div className="card-footer is-flex is-justify-content-center p-2">
                            {/* Badge shimmer */}
                            <div className=" skeleton-badge"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}