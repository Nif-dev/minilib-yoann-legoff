//% frontend/src/context/ContextInit.tsx
//? Initialisation du contexte de l'application

import { useEffect } from 'react';
import { useLivres, useAdherents, useEmprunts } from '../hooks'

/**
 *  Initialisation du contexte de l'application
 * @property chargerAdherents
 * @property chargerLivres 
 * @property chargerEmprunts 
 * @function useEffect - Charge les objets de l'application au chargement du composant
 * @returns null
 */
export const ContextInit = () => {

    const chargerAdherents = useAdherents().chargerAdherents;
    const chargerLivres = useLivres().chargerLivres;
    const chargerEmprunts = useEmprunts().chargerEmprunts;

    useEffect(() => {
        chargerAdherents();
        chargerLivres();
        chargerEmprunts();
    }, []);

    return null
}