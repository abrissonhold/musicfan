import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";

interface HeaderProps {
    onLogoClick?: () => void;
    isSearching?: boolean;
}

function Header({ onLogoClick, isSearching }: HeaderProps) {
    
    const handleLogoClick = () => {
        onLogoClick?.();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.href = "/";
    };

    return (
        <header className={`header ${isSearching ? "searching" : ""}`}>
            <nav className="header-nav">
                {/* Logo */}
                <div className="logo-container">
                    <img
                        alt="MusicFan Logo"
                        src="/src/assets/logoWhite.png"
                        loading="lazy"
                        className="navbar-image1"
                        onClick={handleLogoClick}
                    />
                </div>

                <div className="header-search-container">
                    <SearchBar />
                </div>

                <div className="logo-container header-actions">
                    <img
                        alt="Icono de Favoritos"
                        src="src/assets/fav.png"
                        className="navbar-image1"
                        onClick={() => console.log('implementar favoritos')}
                    />
                </div>
            </nav>
        </header>
    );
}

export { Header };
export type { HeaderProps };