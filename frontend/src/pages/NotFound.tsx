//% src/pages/NotFound.tsx
//? Page 404 - Page non trouvée

import { Link } from 'react-router-dom';

const NotFound = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>404 - Page Non Trouvée</h1>
        <p>Cette route n'existe pas.</p>
        <Link to="/">← Retour Accueil</Link>
    </div>
);

export default NotFound;