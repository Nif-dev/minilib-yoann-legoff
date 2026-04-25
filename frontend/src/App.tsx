//% frontend/src/App.tsx
//? Point d'entrée de l'application

import { Outlet } from 'react-router-dom';

import { NavBar } from './components/common/NavBar';

import './App.css'
function App() {

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        {/* Injection des routes comme composants enfants */}
        <Outlet /> 
      </main>
      <footer></footer>
    </>
  )
}

export default App
