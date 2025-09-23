import React, { useState, useEffect } from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";

interface HeaderProps {
    onLogoClick?: () => void;
    isSearching?: boolean;
}

function Header({ onLogoClick, isSearching }: HeaderProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile && isPlaylistVisible) {
                setIsPlaylistVisible(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [isPlaylistVisible]);

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
        if (isPlaylistVisible) {
            setIsPlaylistVisible(false);
        }
        onLogoClick?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.href = "/";
    };

    const handleToggleFavorites = () => {
        if (isMobile) {
            setIsPlaylistVisible(prev => !prev);
        } else {
            const sidebar = document.querySelector('.playlist-menu--desktop');
            if (sidebar) {
                sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleHistoryClick = () => {
        if (isPlaylistVisible) {
            setIsPlaylistVisible(false);
        }
        window.location.href = "/history";
    };

    const handleClosePlaylist = () => {
        setIsPlaylistVisible(false);
    };

    const playlistMenuProps: PlaylistProps = {
        tracks: [],
        isVisible: isPlaylistVisible,
        onClose: handleClosePlaylist
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
                        {isMobile && <div >
                            <img
                                alt="Favoritos"
                                src="/src/assets/fav.png"
                                className={`navbar-image1 header-action-btn favorites-btn ${isMobile && isPlaylistVisible ? 'favorites-btn--active' : ''
                                    } ${hasFavorites() ? 'has-favorites' : ''}`}
                                onClick={handleToggleFavorites}
                                title={isMobile ?
                                    (isPlaylistVisible ? "Cerrar favoritos" : "Ver favoritos") :
                                    "Ver favoritos"
                                }
                            />
                        </div>
                        }
                        <img
                            alt="Historial"
                            src="src/assets/historial.svg"
                            className="navbar-image1 header-action-icon header-action-btn history-btn"
                            onClick={handleHistoryClick}
                            title="Ver historial"
                        />
                    </div>
                </nav>
            </header>

            {isMobile && (
                <PlaylistMenu {...playlistMenuProps} />
            )}
        </>
    );
}

export { Header };
export type { HeaderProps };