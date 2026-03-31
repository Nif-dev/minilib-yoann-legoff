//% frontend/src/components/NavBar.tsx
//? Barre de navigation

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

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
                    <a href='/' className="navbar-item" >
                        <img src="/favicon.ico" alt="favicon renard Nif"/>
                    </a>
                </div>
                <div className="navbar-item is-flex is-justify-content-center">
                    <button
                        className="button"
                        onClick={() => navigate('/app')}>
                        Navigation - 404 - pour le moment
                    </button>
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