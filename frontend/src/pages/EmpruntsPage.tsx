//% frontend/src/pages/EmpruntsPage.tsx
//? Page de gestion des Emprunts

import { useState, useEffect } from 'react';
import { getEmprunts } from '../services/api/empruntService';
import type { EmpruntAvecDetails } from '../types/index';
import EmpruntCard from '../components/EmpruntCard';

export default function EmpruntsPage() {
    const [emprunts, setEmprunts] = useState<EmpruntAvecDetails[]>([]);
    const [chargement, setChargement] = useState<boolean>(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        const chargerEmprunts = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                // attendre 2s pour simuler chargement plus lent
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                const response = await getEmprunts();
                const data: EmpruntAvecDetails[] = response.data;
                setEmprunts(data);
                
            } catch (err) {
                setErreur(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setChargement(false); // toujours exécuté
            }
            
        };
        chargerEmprunts();
    }, []);

    return (
        <section className="section">
            <h1>Emprunts</h1>
            {chargement && <p>Chargement...</p>}
            {erreur && <p>{erreur}</p>}
            {!chargement && emprunts.length === 0 && <p>Aucun emprunt disponible</p>}
            {!chargement && emprunts.length > 0 && (
                emprunts.map((emprunt) => (
                    <div key={emprunt.id}>
                        <EmpruntCard emprunt={emprunt} />
                    </div>
                    
                ))
                
            )}
        </section>
    );
}