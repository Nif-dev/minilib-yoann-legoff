//% frontend/src/components/ModalLivreAjout.tsx
//? Formulaire de création d'un nouveau livre

import { useState } from "react";

import type { CreateLivreDTO } from "../types/index";
import { creerLivre } from "../services/api/livreService";

interface ModalLivreAjoutProps {
    
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export default function ModalLivreAjout({ isOpen, onClose }: ModalLivreAjoutProps) {

    const [erreur, setErreur] = useState<string | null>(null);
    const [chargement, setChargement] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const modalOpen = isOpen;

    const clearInfos = () => {
        setChargement(false);
        setErreur(null);
        setMessage(null);
    }

    const [isbn, setISBN] = useState('');
    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [genre, setGenre] = useState('');
    const [annee, setAnnee] = useState(0);

    const newLivre: CreateLivreDTO = {
        isbn: isbn,
        titre: titre,
        auteur: auteur,
        genre: genre,
        annee: annee,
    }

    const ajouterLivre = async () => {
        clearInfos();
        setChargement(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            const response = await creerLivre(newLivre);
            const message = response.success? 
                (response.message || 'Livre ajouté') 
                : (response.message || "Livre non ajouté");
            setMessage(response.message ?? message);
        } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
        setChargement(false);
    }

    return (
        modalOpen && (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                <header className="modal-card-head">
                    <p className="modal-card-title">Ajout d'un nouveau livre</p>
                    <button type="button" className="delete" aria-label="close" onClick={onClose}>
                    </button>
                </header>

                <section className="modal-card-body">
                    <div className="field">
  <label className="label">Name</label>
  <div className="control">
    <input className="input" type="text" placeholder="Text input" />
  </div>
</div>

<div className="field">
  <label className="label">Username</label>
  <div className="control has-icons-left has-icons-right">
    <input className="input is-success" type="text" placeholder="Text input" value="bulma" />
    <span className="icon is-small is-left">
      <i className="fas fa-user"></i>
    </span>
    <span className="icon is-small is-right">
      <i className="fas fa-check"></i>
    </span>
  </div>
  <p className="help is-success">This username is available</p>
</div>

<div className="field">
  <label className="label">Email</label>
  <div className="control has-icons-left has-icons-right">
    <input className="input is-danger" type="email" placeholder="Email input" value="hello@" />
    <span className="icon is-small is-left">
      <i className="fas fa-envelope"></i>
    </span>
    <span className="icon is-small is-right">
      <i className="fas fa-exclamation-triangle"></i>
    </span>
  </div>
  <p className="help is-danger">This email is invalid</p>
</div>

<div className="field">
  <label className="label">Subject</label>
  <div className="control">
    <div className="select">
      <select>
        <option>Select dropdown</option>
        <option>With options</option>
      </select>
    </div>
  </div>
</div>

<div className="field">
  <label className="label">Message</label>
  <div className="control">
    <textarea className="textarea" placeholder="Textarea"></textarea>
  </div>
</div>

<div className="field is-grouped">
  <div className="control">
    <button className="button is-link">Submit</button>
  </div>
  <div className="control">
    <button className="button is-link is-light">Cancel</button>
  </div>
</div>
                    <form>
                        <label>
                            Titre:
                            <input
                                type="text"
                                value={titre}
                                onChange={(e) => {
                                    setTitre(e.target.value);
                                    clearInfos();
                                }}
                            />
                        </label>
                        <label>
                            ISBN:
                            <input
                                type="text"
                                value={isbn}
                                onChange={(e) => {
                                    setISBN(e.target.value)
                                    clearInfos();
                                }}
                                />
                        </label>
                        <label>
                            Auteur:
                            <input
                                type="text"
                                value={auteur}
                                onChange={(e) => {
                                    setAuteur(e.target.value)
                                    clearInfos();
                                }}
                                />
                        </label>
                        <label>
                            Genre:
                            <input
                                type="text"
                                value={genre}
                                onChange={(e) => {
                                    setGenre(e.target.value)
                                    clearInfos();
                                }}
                                />
                        </label>
                        <label>
                            Annee:
                            <input
                                type="number"
                                value={annee}
                                onChange={(e) => {
                                    setAnnee(Number(e.target.value))
                                    clearInfos();
                                }}
                                />
                        </label>

                    </form>
                    { chargement && <div className="has-text-success has-text-centered my-4">Requête en cours ...</div> }
                    {message && <div className="has-text-success has-text-centered my-4">{message}</div>}
                    {erreur && <div className="has-text-danger has-text-centered my-4">{erreur}</div>}
                    
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons">
                        <button type='button' 
                            disabled={isbn === '' || titre === '' || erreur !== null} 
                            className={erreur ? "button is-danger is-inactive" : "button is-success"} 
                            onClick={() => ajouterLivre()}
                            >
                                Ajouter le livre !
                        </button>

                        <button type='button' className="button" onClick={onClose}>Annuler</button>
                    </div>
                </footer>
            </div>
        </div>)
    );
}