import React, { useState, useEffect } from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";

interface HeaderProps {
    onLogoClick?: () => void;
    isSearching?: boolean;
    onToggleSidebar?: (isOpen: boolean) => void;
}

function Header({ onLogoClick, isSearching, onToggleSidebar }: HeaderProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile && isSidebarOpen) {
                setIsSidebarOpen(false);
                onToggleSidebar?.(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [isSidebarOpen, onToggleSidebar]);

    const handleLogoClick = () => {
        onLogoClick?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.href = "/";
    };

    const handleToggleFavorites = () => {
        if (isMobile) {
            const newState = !isSidebarOpen;
            setIsSidebarOpen(newState);
            onToggleSidebar?.(newState);
        } else {
            const sidebar = document.querySelector('.playlist-menu');
            if (sidebar) {
                sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleHistoryClick = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
            onToggleSidebar?.(false);
        }
        window.location.href = "/history";
    };

    const handleOverlayClick = () => {
        console.log('Overlay clicked - closing sidebar');
        setIsSidebarOpen(false);
        onToggleSidebar?.(false);
    };

    const playlist = localStorage.getItem("favorites") || '{"tracks":["Empty"]}';
    const parsedPlaylist = JSON.parse(playlist);
    const playlistMenuProps: PlaylistProps = { tracks: parsedPlaylist };

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
                        {isMobile && (
                            <img
                                alt="Favoritos"
                                src="/src/assets/fav.png"
                                className="navbar-image1 header-action-btn favorites-btn"
                                onClick={handleToggleFavorites}
                                title="Ver favoritos"
                            />
                        )}
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
            {isMobile && isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={handleOverlayClick}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        backdropFilter: 'blur(2px)'
                    }}
                />          
            )}
            {isMobile && (
                <div
                    className={`mobile-sidebar ${isSidebarOpen ? 'mobile-sidebar--open' : ''}`}
                    style={{
                        position: 'fixed',
                        top: '0',
                        right: isSidebarOpen ? '0' : '-100%',
                        width: '80%',
                        maxWidth: '400px',
                        height: '100vh',
                        backgroundColor: '#050625',
                        zIndex: 1000,
                        transition: 'right 0.3s ease-in-out',
                        borderLeft: '1px solid rgba(150, 133, 198, 0.2)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '15px',
                            borderBottom: '1px solid rgba(150, 133, 198, 0.2)'
                        }}>
                        <PlaylistMenu {...playlistMenuProps} />

                        <button
                            onClick={handleOverlayClick}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div>
                        <PlaylistMenu {...playlistMenuProps} />
                    </div>
                </div>
            )}
        </>
    );
}

export { Header };
export type { HeaderProps };