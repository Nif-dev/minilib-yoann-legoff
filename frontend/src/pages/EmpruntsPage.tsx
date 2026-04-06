//% frontend/src/pages/EmpruntsPage.tsx
//? Page de gestion des Emprunts

import { useState, useEffect } from 'react';
import { createEmprunt, getEmprunts, retourEmprunt } from '../services/api/empruntService';
import type { EmpruntAvecDetails, CreateEmpruntDTO } from '../types/index';
import EmpruntCard from '../components/EmpruntCard';
import EmpruntFormNew from '../components/EmpruntFormNew';

export default function EmpruntsPage() {
    const [emprunts, setEmprunts] = useState<EmpruntAvecDetails[]>([]);
    const [chargement, setChargement] = useState<boolean>(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [newEmpruntVisible, setNewEmpruntVisible] = useState<boolean>(false);

    const rendreLivre = async (id: number) => {
        try {
            const empruntARendre = emprunts.find((emprunt) => emprunt.id === id);
            if (empruntARendre) {

                const response = await retourEmprunt(empruntARendre.id);
                const message = response.success? "Livre rendu" : "Livre non rendu";
                alert(message);
            }
        } catch (err) {
            console.log("🚀 ~ rendreLivre ~ err:", err)
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
    }

    const emprunterLivre = async (idLivre: number, idAdherent: number) => {
        const newEmprunt: CreateEmpruntDTO = {
            livre_id: idLivre,
            adherent_id: idAdherent
        }
        try {
            const response = await createEmprunt(newEmprunt);
            const message = response.success? 
                (response.message || 'Livre emprunté') 
                : (response.message || "Livre non emprunté");
            alert(message);
        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
    }

    // Chargement des emprunts au montage (tous !)
    useEffect(() => {
        const chargerEmprunts = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                // attendre 2s pour simuler chargement plus lent
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                const response = await getEmprunts();
                const data: EmpruntAvecDetails[] = response.data? response.data : [];
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
            <EmpruntFormNew newEmpruntVisible={newEmpruntVisible} emprunterLivre={emprunterLivre} onClose={() => setNewEmpruntVisible(false)} />
            <div className="is-flex">
                <h1 className="title mr-4">Emprunts</h1>
                <button className ="button" onClick={() => setNewEmpruntVisible(true)}>Emprunter un livre</button>
            </div>
            {chargement && <p>Chargement...</p>}
            {erreur && <p>{erreur}</p>}
            {/* Affichage des emprunts */}
            {!chargement && emprunts.length === 0 && <p>Aucun emprunt en cours</p>}
            {!chargement && emprunts.length > 0 && (
                emprunts.map((emprunt) => (
                    <div key={emprunt.id}>
                        <EmpruntCard emprunt={emprunt} rendreLivre={() => {
                            rendreLivre(emprunt.id);
                        }} />
                    </div>
                    
                ))
                
            )}
        </section>
    );
}