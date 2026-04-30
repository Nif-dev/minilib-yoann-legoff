# Contributing to MiniLib
 
Merci de votre intérêt pour contribuer à MiniLib !
 
## 🛠️ Configuration de développement
 
```bash
git clone https://github.com/user/minilib.git
cd minilib
npm install
cp .env.example .env
docker compose up -d postgres
npm run dev
```
 
## 🌳 Workflow Git
 
Nous suivons GitHub Flow :
 
1. Créer une branche depuis `dev` : `git switch -c feature/my-feature`
2. Commiter avec [Conventional Commits](https://www.conventionalcommits.org/)
3. Pousser et ouvrir une Pull Request
4. Attendre la review et la CI verte
5. Merge avec squash
 
## 📝 Conventions de code
 
- **Nommage** : voir [Guide de nommage universel](./docs/conventions/naming.md)
- **Tests** : tout nouveau code doit être testé (couverture > 70%)
- **Linting** : `npm run lint` doit passer
- **TypeScript strict** : pas de `any` non justifié
 
## ✅ Avant d'ouvrir une PR
 
- [ ] Tests ajoutés/mis à jour
- [ ] `npm run lint` passe
- [ ] `npm run test` passe
- [ ] Documentation mise à jour si nécessaire
- [ ] Self-review effectuée
- [ ] PR liée à une issue (`Closes #42`)
 
## 🐛 Signaler un bug
 
Utiliser le template d'issue Bug Report.
 
## 💡 Proposer une fonctionnalité
 
Ouvrir une issue Feature Request avant de coder, pour discussion.
 
## 📜 Code de conduite
 
Voir [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
