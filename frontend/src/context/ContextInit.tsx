//% frontend/src/context/ContextInit.tsx
//? Initialisation du contexte de l'application

import { useEffect } from 'react';
import { useLivres, useAdherents, useEmprunts } from '../hooks'

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