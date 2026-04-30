# ADR 0002 — React plutôt que Vue.js

## Statut

Accepté — 2025-03-20

## Contexte

MiniLib frontend : dashboard bibliothécaires, formulaires prêts, tableaux catalogues.  
Contraintes :  
- Équipe TypeScript (hooks, context)  
- Intégration CI/CD GitHub Actions  
- Possibilité React Native plus tard (app mobile ?)  
- Marché emploi France (React dominant)  

Choisir framework JS moderne.

## Décision

**React 18+** avec TypeScript, Vite, hooks/context, Bulma (librairie CSS open-source).  
Pas de framework meta (Next.js trop lourd pour MVP).

## Alternatives considérées

### Angular 17 (rejetée)
- Très lourd pour un projet de cette taille
- Courbe d'apprentissage très raide
- Aucune expérience dans l'équipe
 
### Next.js 14 (rejetée)
- Excellent framework tout-en-un
- SSR inutile pour une app interne authentifiée
- Complexité supplémentaire (App Router, Server Components)
- Notre besoin se limite à du CSR

### Vue.js (rejetée)

**Pour :**  
- Courbe apprentissage douce (templates HTML)  
- Bundle plus petit  
- Composition API proche React hooks

**Contre :**  
- Écosystème plus petit (libs, jobs)  
- Moins mature TypeScript (React leader)  
- Pas de React Native équivalent fiable  
- El Panda a dit non ...

### React (retenue)

**Pour :**  
- Écosystème immense (libs testées)  
- TypeScript excellent (types auto)  
- Marché emploi dominant 2026
- Hooks matures, concurrent mode  
- React Native pour mobile futur  

**Contre :**  
- JSX à apprendre  
- Boilerplate state (mais context/Zustand simple)  

## Conséquences

### Positives  
- **Productivité** : équipe connaît déjà (formation AFPA)  
- **Évolutif** : SPA → SSR → mobile seamless  
- **Outils** : VSCode extensions, GitHub Copilot React  

### Négatives  
- Bundle potentiellement plus gros (tree-shaking Vite compense)  
- Courbe JSX pour juniors (1 jour de ramp-up)  

## Références  
- [React vs Vue 2026](https://amine.ma/en/articles/react-vue-js-which-technology-modern-web) 
- Stack Overflow Survey 2025 (React #1 frontend)  
- Discussion équipe 2025-03-18