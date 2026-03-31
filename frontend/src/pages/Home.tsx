//% frontend/src/pages/Home.tsx
//? Page d'accueil de l'application MiniLib

import { ApiTestButton } from "../components/ApiTestButton";

import { getAdherents } from "../services/api/adherents";

const Home = () => (
    <section className="section">
        <h1 className="title">Bienvenue sur Minilib !</h1>
        <p className="subtitle">Application web complète de gestion de bibliothèque municipale.</p>

{/* Bouton pour tester l'API - spécifier le service et le message de succès */}
        <ApiTestButton 
            serviceFn={getAdherents}
            successMsg="API Adhérents OK !" 
            label="Test adhérents"/>
    </section>
);

export default Home;