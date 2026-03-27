//% backend/src/types/adherent.pg.ts
//? Typage des données PostgreSQL pour la table adherents

// Interface basique de la table sur PostgreSQL
// sert de base pour les autres interfaces plus légères/spécialisées
//* usage sur les requêtes ( repository / model )
export interface AdherentRow {
    id: number;
    numero_adherent: string;
    nom: string;
    prenom: string;
    email: string;
    actif: boolean;
    created_at: string;  // ISO string
    updated_at: string;
}

// Types utilitaires
export type AdherentListRow = Pick<AdherentRow, 'id' | 'nom' | 'prenom' | 'numero_adherent'>; // plus légers que AdherentRow
export type AdherentCountRow = { count: string }; // spécifique pour le nombre d'adhérents uniquement