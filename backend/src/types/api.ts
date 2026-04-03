//% backend/src/types/api.ts
//? Typage provenant de l'API

/**
 * Wrapper / Interface pour toutes les réponses provenant de l'API
 * (success, data, message, total, error, champs)
*
* @interface ApiResponse
* @template T - Type de donnée attendu
 */
export interface ApiResponse<T> {
    success:   boolean;        // true = requête reussie || false = échec donc error associé
    data?:       T;             // données attendues par la requête et son type spécifique
    message?:   string;         // message de confirmation ou d'informations complémentaires - indicatif utilisateur
    error?:      string;        // message d'erreur, si requête échoue - donne indicatif technique
    total?:     number;         // pour les listes de données
    champs?:    string[];       // champs manquants pour les erreurs 400
}

//? Clarification des champs de l'interface
// Le champ success est OBLIGATOIRE, il indique si une requête a bien aboutie ou non, que ce soit une erreur ou pas
// Le champ error est facultatif, il indique qu'une erreur a été levé dans le traitement de la requête
// Le champ message est facultatif, il indique un message complémentaire à la réponse quel que soit le success
//* message =/= error 
// Le champ data n'est pas obligatoire, il contient la données attendue par la requête, type T selon la requête


// si success === true, alors error est absent ;

// si success === false, alors error est renseigné ;

// message peut exister dans les deux cas, mais ne doit pas remplacer error.