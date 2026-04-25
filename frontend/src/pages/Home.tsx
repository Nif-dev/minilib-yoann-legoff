//% frontend/src/pages/Home.tsx
//? Page d'accueil de l'application MiniLib

import { Link } from "react-router-dom";

/**
 *  Composant principal de la page d'accueil
 */
export default function Home () {

    return (
        <section className="section">
            <h1 className="title">Bienvenue sur Minilib !</h1>
            <p className="subtitle">Application web complète de gestion de bibliothèque municipale.</p>
            <br />

            <Link 
                to="/livres" 
                className="button is-primary mt-6">
                Gestion des livres
            </Link> 

            <Link 
                to="/adherents" 
                className="button is-warning mt-6 ml-4">
                Gestion des adhérents
            </Link>

            <Link 
                to="/emprunts" 
                className="button is-info mt-6 ml-4">
                Gestion des emprunts
            </Link>

        </section>
        
    );
}
