//% frontend/src/components/NavBar.tsx
//? Barre de navigation

import { Link } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
    const [isActive, setIsActive] = useState(false);


    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <button className={`navbar-burger ${isActive ? 'is-active' : ''}`}
                    onClick={() => setIsActive(!isActive)}
                    aria-expanded={isActive}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className="navbar-start">
                    <Link to="/" className="navbar-item" >
                        <img src="/favicon.ico" alt="favicon renard Nif"/>
                    </Link>
                </div>
                <div className="navbar-item is-flex is-justify-content-center">
                    <Link to="/livres" className="button navbar-item">Livres</Link>
                    <Link to="/404" className="button navbar-item">404 temp</Link> 
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;