//% frontend/src/components/ModalLivresRecherche.tsx
//? Modal de recherche de livres

type ModalLivresRechercheProps = {
    // Etats du composant, définis par le parent
    readonly isOpen: boolean;
    readonly recherche: string;
    readonly genre: string;
    readonly disponible: string | undefined;
    // Fonctions callback, définies par le parent
    readonly onClose: () => void;
    readonly onReset: () => void;
    readonly onSearch: () => void;
    readonly onRechercheChange: (value: string) => void;
    readonly onGenreChange: (value: string) => void;
    readonly onDisponibleChange: (value: string | undefined) => void;
};

export default function ModalLivresRecherche({
    isOpen,
    recherche,
    genre,
    disponible,
    onClose,
    onReset,
    onSearch,
    onRechercheChange,
    onGenreChange,
    onDisponibleChange,
    }: ModalLivresRechercheProps) {
    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={onClose}></div>

        <div className="modal-card">
            <header className="modal-card-head">
            <p className="modal-card-title">Filtres avancés</p>
            <button
                className="button is-rounded is-small mr-6"
                onClick={onReset}
                aria-label="clear"
            >
                Reset
            </button>
            <button className="delete" onClick={onClose} aria-label="close"></button>
            </header>

            <section className="modal-card-body">
                <div className="field">
                    <div className="control">
                        <label className="label" htmlFor="recherche-livre">Recherche</label>
                        <input
                            id="recherche-livre"
                            className="input is-rounded"
                            type="text"
                            placeholder="Titre ou auteur..."
                            value={recherche}
                            onChange={(e) => onRechercheChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <label className="label" htmlFor="genre-livre">Genre</label>
                        <input
                            id="genre-livre"
                            className="input is-rounded"
                            type="text"
                            placeholder="Genre littéraire..."
                            value={genre}
                            onChange={(e) => onGenreChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label" htmlFor="disponibilite-livre">Disponibilité</label>
                    <div className="control" id="disponibilite-livre">
                        <label className="radio mr-6">
                            <input
                                type="radio"
                                name="dispo"
                                checked={disponible === undefined}
                                onChange={() => onDisponibleChange(undefined)} 
                            />
                            Tous
                        </label>

                        <label className="radio mr-6">
                            <input
                                type="radio"
                                name="dispo"
                                checked={disponible === 'true'}
                                onChange={() => onDisponibleChange('true')}
                            />
                            Disponible
                        </label>

                        <label className="radio mr-6">
                            <input
                                type="radio"
                                name="dispo"
                                checked={disponible === 'false'}
                                onChange={() => onDisponibleChange('false')}
                            />
                            Indisponible
                        </label>
                    </div>
                </div>
            </section>

            <footer className="modal-card-foot is-flex is-justify-content-space-between">
                <button className="button" onClick={onClose}>
                    Annuler
                </button>
                <button className="button is-warning is-light" onClick={onSearch}>
                    Rechercher
                </button>
                <button className="button is-primary" onClick={onClose}>
                    Appliquer les filtres
                </button>
            </footer>
        </div>
        </div>
    );
}