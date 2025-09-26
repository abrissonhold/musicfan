import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";

interface HeaderProps {
    onLogoClick?: () => void;
    isSearching?: boolean;
    isMobile: boolean;
    isPlaylistVisible: boolean;
    onTogglePlaylist: () => void;
}

function Header({ onLogoClick, isSearching, isMobile, isPlaylistVisible, onTogglePlaylist }: HeaderProps) {
    const hasFavorites = () => {
        try {
            const favorites = localStorage.getItem("favorites");
            if (!favorites) return false;
            const parsedFavorites = JSON.parse(favorites);
            return parsedFavorites && parsedFavorites.length > 0;
        } catch {
            return false;
        }
    };

    const handleLogoClick = () => {
        onLogoClick?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.href = "/";
    };

    const handleToggleFavorites = () => {
        onTogglePlaylist();
    };

    const handleHistoryClick = () => {
        window.location.href = "/history";
    };

    return (
        <>
            <header className={`header ${isSearching ? "searching" : ""}`}>
                <nav className="header-nav">
                    <div className="logo-container" onClick={handleLogoClick}>
                        <img
                            alt="MusicFan Logo"
                            src="/src/assets/logoWhite.png"
                            loading="lazy"
                            className="navbar-image1"
                        />
                    </div>

                    <div className="header-search-container">
                        <SearchBar />
                    </div>

                    <div className="header-actions">
                        <img
                            alt="Historial"
                            src="/src/assets/historial.svg"
                            className="navbar-image1 header-action-icon header-action-btn history-btn"
                            onClick={handleHistoryClick}
                            title="Ver historial"
                        />
                        {isMobile && (
                            <div className="mobile-menu-trigger" onClick={handleToggleFavorites}>
                                <img
                                    alt="Favoritos"
                                    src="/src/assets/fav.png"
                                    className={`navbar-image1 header-action-btn favorites-btn ${isPlaylistVisible ? 'favorites-btn--active' : ''
                                        } ${hasFavorites() ? 'has-favorites' : ''}`}
                                    title={isPlaylistVisible ? "Cerrar favoritos" : "Ver favoritos"}
                                />
                            </div>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}

export { Header };
export type { HeaderProps };