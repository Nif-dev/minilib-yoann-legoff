//% frontend/src/components/SkeletonLivres.tsx
//? Skeleton loader identique à LivreCard

export default function SkeletonLivres() {
    return (
        <div className="columns is-multiline">
            {/* 8 livres shimmer */}
            {new Array(8).fill(0).map((_, i) => (
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