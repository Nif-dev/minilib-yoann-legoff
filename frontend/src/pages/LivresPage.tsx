//% frontend/src/pages/LivresPage.tsx
//? Page de gestion des livres

import { useState, useEffect } from 'react';
import { getLivres } from '../services/api/livres';
import type { Livre } from '../types/index';
import ListeLivres from '../components/ListeLivres';

export default function LivresPage() {

    // Les 3 états à toujours prévoir pour un fetch
    const [livres, setLivres] = useState<Livre[]>([]);
    const [chargement, setChargement] = useState<boolean>(true);
    const [erreur, setErreur] = useState<string | null>(null);
    useEffect(() => {
        const chargerLivres = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                const response = await getLivres();
                const data: Livre[] = response.data;
                setLivres(data);
            
            } catch (err) {
                setErreur(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setChargement(false); // toujours exécuté
            }
            
        };
        // et on l'appelle immédiatement — useEffect ne peut pas être async lui-même
        chargerLivres();
        }, []   // [] = une seule fois au montage
    ); 

    // Rendu conditionnel selon état
    if (chargement)     return <p>Chargement...</p>;
    
    if (erreur)         return <p>{erreur}</p>;

    // Rendu normal si chargement OK
    return (
        <div>
            <h1 className='title'>Catalogue ({livres.length} livres)</h1>
            <ListeLivres livres={livres} />
        </div>
    );
}