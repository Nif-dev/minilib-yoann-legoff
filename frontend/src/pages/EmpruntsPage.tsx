//% frontend/src/pages/EmpruntsPage.tsx
//? Page de gestion des Emprunts

import { useState, useEffect } from 'react';

import type { EmpruntAvecDetails } from '../types/index';
import { getEmprunts, retourEmprunt } from '../services/api/empruntService';

import ListeEmprunts from '../components/ListeEmprunts';
import SkeletonEmprunts from '../components/SkeletonEmprunts';

import ModalEmpruntAjout from '../components/ModalEmpruntAjout';

export default function EmpruntsPage() {
    const [emprunts, setEmprunts] = useState<EmpruntAvecDetails[]>([]);
    const [chargement, setChargement] = useState<boolean>(true);
    const [erreur, setErreur] = useState<string | null>(null);

    const [recherche, setRecherche] = useState<string>('');
    const [newEmpruntVisible, setNewEmpruntVisible] = useState<boolean>(false);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    /**
     * Fonction de retour d'un livre, appelle le service spécifique
     * Génére un message d'alerte et met à jour la liste des emprunts
     * @param {number} id - id du livre rendu
     */
    const rendreLivre = async (id: number) => {
        try {
            const empruntARendre = emprunts.find((emprunt) => emprunt.id === id);
            if (empruntARendre) {

                const response = await retourEmprunt(empruntARendre.id);
                const message = response.success? "Livre rendu" : "Livre non rendu";
                setAlertMessage(response.message || message);
                if (response.success) {
                    setEmprunts(emprunts.filter((emprunt) => emprunt.id !== id));
                }
            }
        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
    }
    
    /**
     * Affiche un message en cas de retour de livre (réussi ou non)
     */
    useEffect(() => {
        if (alertMessage) {
            alert(alertMessage);
            setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
        }
    }, [alertMessage]);

    useEffect(() => {
        if(erreur) {
            alert(erreur);
            setTimeout(() => {
                setErreur(null);
            }, 3000);
        }
    }, [erreur]);


    // Chargement des emprunts au montage (tous !)
    useEffect(() => {
        const chargerEmprunts = async () => { 
            // async directement dans useEffect : on déclare une fonction async
            try {
                setChargement(true);
                // attendre 2s pour simuler chargement plus lent
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                const response = await getEmprunts();
                const data: EmpruntAvecDetails[] = response.data?? [];
                setEmprunts(data);
                
            } catch (err) {
                setErreur(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setChargement(false); // toujours exécuté
            }
        };
        chargerEmprunts();
    }, []);

    // Affichage filtrée des livres ( avant de faire une requête API )
    const empruntsAffiches = emprunts.filter((emprunt) =>
        (!recherche 
            || emprunt.titre_livre.toLowerCase().includes(recherche.toLowerCase()) 
            || emprunt.nom_adherent.toLowerCase().includes(recherche.toLowerCase())
        ) 
    );

    //* Rendu conditionnel selon état
    if (chargement) return (
            <div className='section'>
                <h1 className='title'>Chargement...</h1>
                    <SkeletonEmprunts />
            </div>
    );
    if (erreur) return (
            <div className='section'>
                <h1 className='title'>Erreur : {erreur}</h1>
                <SkeletonEmprunts />
            </div>
    );

    return (
        <section className="section">
            {/* Titre */}
            <div className='mb-4'>
                <h1 className="title">Emprunts</h1>
                {!chargement && emprunts.length === 0 && 
                    <p className="subtitle ">Aucun emprunt en cours</p>
                }
                {!chargement && 
                    <p className="subtitle ">{emprunts.length} emprunt(s) en cours {emprunts.length === empruntsAffiches.length ? '' : ' - ' + empruntsAffiches.length + ' correspondants à la recherche'}</p>
                }
            </div>
            <div className="is-flex is-justify-content-space-between">
                {/* Bouton action - nouvel emprunt */}
                <div>
                    <button className ="button" onClick={() => setNewEmpruntVisible(true)}>Emprunter un livre</button>
                </div>
                {/* Champs de recherche */}
                <div className='is-flex is-align-items-center'>
                    <div className='field'>
                        <div className="control">
                            <input className="input is-rounded" type="text" placeholder="Rechercher un emprunt" value={recherche} onChange={(e) => setRecherche(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Affichage des messages */}
            <div>
                {/* Affichage d'erreur */}
                {erreur && <p>Erreur : {erreur}</p>}
                {/* Affichage de l'alerte livre rendu */}
                {alertMessage && <p>Alert : {alertMessage}</p>} 
            </div>

            {/* Affichage des emprunts */}
            <ListeEmprunts emprunts={empruntsAffiches} rendreLivre={rendreLivre}/>

            {/* Formulaire de nouvel emprunt */}
            <ModalEmpruntAjout 
                newEmpruntVisible={newEmpruntVisible} 
                onClose={() => {
                    setNewEmpruntVisible(false); 
                    location.reload(); // rafraichi la page - nouvel emprunt ou non
                }} />
        </section>
        
    );
}