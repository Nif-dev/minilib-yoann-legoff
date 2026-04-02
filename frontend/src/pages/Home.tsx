//% frontend/src/pages/Home.tsx
//? Page d'accueil de l'application MiniLib

import { Link } from "react-router-dom";
import { ApiTestButton } from "../components/ApiTestButton";

import { getLivres } from "../services/api/livres";

const Home = () => (
    <section className="section">
        <h1 className="title">Bienvenue sur Minilib !</h1>
        <p className="subtitle">Application web complète de gestion de bibliothèque municipale.</p>

{/* Bouton pour tester l'API - spécifier le service et le message de succès */}
        <ApiTestButton 
            serviceFn={getLivres}
            successMsg="API Livres OK !" 
            label="Test getLivres">
        </ ApiTestButton>
        
        <br />
        
        <Link 
            to="/livres" 
            className="button is-primary mt-6">
            Gestion des livres
        </Link> 

    </section>

);

export default Home;