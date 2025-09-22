import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";

interface HeaderProps {
    onLogoClick?: () => void;
    isSearching?: boolean;
    onFavoritesClick?: () => void; 
}

function Header({ onLogoClick, isSearching, onFavoritesClick }: HeaderProps) {
    const handleLogoClick = () => {
        onLogoClick?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.href = "/";
    };

    return (
        <header className={`header ${isSearching ? "searching" : ""}`}>
            <nav className="header-nav">
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
                        src="/src/assets/fav.png"
                        className="navbar-image1"
                        onClick={onFavoritesClick}
                    />
                </div>
                <div className="header-history-container">
                    <img
                        alt="Icono de Historial"
                        src="src/assets/historial.svg"
                        className="navbar-image1"
                        onClick={() => {
                            window.location.href = "/history";
                        }}
                    />
                </div>
            </nav>
        </header>
    );
}

export { Header };
export type { HeaderProps };
