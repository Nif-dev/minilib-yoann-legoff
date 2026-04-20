//% frontend/src/context/AppContext.tsx
//? Contexte global de gestion de objets de l'app (cache uniquement - actions en HOOKS)

import React, { createContext, useState } from "react";

import type { Livre, Adherent, EmpruntAvecDetails } from '../types';

/**
 *
 * @interface AppContextType
 */
interface AppContextType {
    livres: Livre[];
    setLivres: React.Dispatch<React.SetStateAction<Livre[]>>;
    adherents: Adherent[];
    setAdherents: React.Dispatch<React.SetStateAction<Adherent[]>>;
    emprunts: EmpruntAvecDetails[];
    setEmprunts: React.Dispatch<React.SetStateAction<EmpruntAvecDetails[]>>;
    retards: EmpruntAvecDetails[];
    setRetards: React.Dispatch<React.SetStateAction<EmpruntAvecDetails[]>>;
};

const AppContext = createContext<AppContextType>( {
    livres: [], setLivres: () => {},
    adherents: [], setAdherents: () => {},
    emprunts: [], setEmprunts: () => {},
    retards: [], setRetards: () => {},
});

/**
 * Composant fournisseur de contexte de l'application
 * Fournit les objets de l'application à l'ensemble de l'application.
 * 
 */
const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [livres, setLivres] = useState<Livre[]>([]);
    const [adherents, setAdherents] = useState<Adherent[]>([]);
    const [emprunts, setEmprunts] = useState<EmpruntAvecDetails[]>([]);
    const [retards, setRetards] = useState<EmpruntAvecDetails[]>([]);

    return (
        <AppContext value={{ 
            livres, setLivres, 
            adherents, setAdherents, 
            emprunts, setEmprunts, 
            retards, setRetards,
        }}>
            {children}
        </AppContext>
    );
}

export { AppContext, AppProvider }