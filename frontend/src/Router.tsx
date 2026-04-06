//% frontend/src/Router.tsx
//? Routeur de l'application

import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';  // Layout root de l'application

//* Pages de l'application
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import LivresPage from './pages/LivresPage.tsx';
import AdherentsPage from './pages/AdherentsPage.tsx';
import EmpruntsPage from './pages/EmpruntsPage.tsx';

// Ajoute tes pages/services

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: "livres/", element: <LivresPage /> },
            { path: "adherents/", element: <AdherentsPage /> },
            { path: "emprunts/", element: <EmpruntsPage /> },
            // { path: "services", element: <Services /> },  // Exemple
        ],
    },
]);
