//% frontend/src/components/SkeletonAdherents.tsx
//? Skeleton loader identique à AdherentCard

export default function SkeletonAdherents() {
    return (
        <div className="columns is-multiline">
            {/* 6 adherents shimmer */}
            {new Array(6).fill(0).map((_, i) => (
                <div key={i+1} className="column is-half">
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