//% frontend/src/context/AppContext.tsx
//? Contexte global de gestion de objets de l'app (cache et actions)

import { createContext, useState, useEffect } from "react";

import type { Livre, Adherent, EmpruntAvecDetails } from '../types';

import { getLivres } from '../services/api/livreService';
import { getAdherents } from '../services/api/adherentService';
import { getEmprunts, getRetards } from '../services/api/empruntService';

/**
 *
 * @interface AppContextType
 */
interface AppContextType {
    livres: Livre[];
    setLivres: (livres: Livre[]) => void;
    adherents: Adherent[];
    setAdherents: (adherents: Adherent[]) => void;
    emprunts: EmpruntAvecDetails[];
    setEmprunts: (emprunts: EmpruntAvecDetails[]) => void;
    retards: EmpruntAvecDetails[];
    setRetards: (retards: EmpruntAvecDetails[]) => void;

    chargementContext: boolean;
    setChargementContext: (chargementContext: boolean) => void;
    erreurContext: string | null;
    setErreurContext: (erreurContext: string) => void;
}

const AppContext = createContext<AppContextType>( {
    livres: [],
    setLivres: () => {},
    adherents: [],
    setAdherents: () => {},
    emprunts: [],
    setEmprunts: () => {},
    retards: [],
    setRetards: () => {},
    chargementContext: false,
    setChargementContext: () => {},
    erreurContext: null,
    setErreurContext: () => {}
})


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

    const [chargementContext, setChargementContext] = useState<boolean>(false);
    const [erreurContext, setErreurContext] = useState<string | null>(null);
    
    useEffect(() => {
        const chargerApp = async () => {
            setChargementContext(true);
            try {
            await Promise.all([
                chargerLivres(),
                chargerAdherents(),
                chargerEmprunts(),
                chargerRetards(),
            ]);
            } finally {
                setChargementContext(false);
            }
        };
        chargerApp();
    }, []);

    const chargerLivres = async () => {
        try {
            const response = await getLivres();
            const data: Livre[] = response.data ?? [];
            setLivres(data);
            
        } catch (err) {
            setErreurContext(err instanceof Error ? err.message : "Erreur inconnue");
        }
    };

    const chargerAdherents = async () => {
        try {
            const response = await getAdherents();
            const data: Adherent[] = response.data ?? [];
            setAdherents(data);

        } catch (err) {
            setErreurContext(err instanceof Error ? err.message : "Erreur inconnue");
        } 
    }

    const chargerEmprunts = async () => {
        try {
            const response = await getEmprunts();
            const data: EmpruntAvecDetails[] = response.data ?? [];
            setEmprunts(data);
            
        } catch (err) {
            setErreurContext(err instanceof Error ? err.message : "Erreur inconnue");
        }
    }

    const chargerRetards = async () => {
        try {
            const response = await getRetards();
            const data: EmpruntAvecDetails[] = response.data ?? [];
            setRetards(data);
            
        } catch (err) {
            setErreurContext(err instanceof Error ? err.message : "Erreur inconnue");
        } 
    }

    return (
        <AppContext value={{ 
            livres, setLivres, 
            adherents, setAdherents, 
            emprunts, setEmprunts, 
            retards, setRetards,
            chargementContext, setChargementContext,
            erreurContext, setErreurContext
        }}>
            {children}
        </AppContext>
    );
}

export { AppContext, AppProvider }