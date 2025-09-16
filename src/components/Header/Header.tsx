import React, { useState, useEffect } from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";

interface HeaderProps {
    onLogoClick?: () => void;
    activeSection?: string;
    isSearching?: boolean;
}

function Header({ onLogoClick, activeSection, isSearching }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isMobileMenuOpen && !target.closest(".header-nav")) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMobileMenuOpen]);

    const navItems = [
        { label: "Éxitos", section: "hits" },
        { label: "Tus favoritos", section: "favorites" },
        { label: "Artistas destacados", section: "artists" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (section: string) => {
        //agregar lógica de navegación
        console.log(`Navegando a: ${section}`);

        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogoClick = () => {
        onLogoClick?.();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className={`header ${isSearching ? "searching" : ""}`}>
                <nav className="header-nav">
                    { }
                    <img
                        alt="MusicFan Logo"
                        src="/src/assets/logoWhite.png"
                        loading="lazy"
                        className="navbar-image1"
                        onClick={handleLogoClick}
                        style={{ cursor: "pointer" }}
                    />

                    {/* SearchBar Container */}
                    <div className="header-search-container">
                        <SearchBar />
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="header-nav-list">
                        {navItems.map((item, index) => (
                            <li
                                key={index}
                                className={`header-nav-list-item music-note ${activeSection === item.section ? "active" : ""
                                    }`}
                                onClick={() => handleNavClick(item.section)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleNavClick(item.section);
                                    }
                                }}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>

                {/* Mobile Navigation Menu */}
                <div className={`mobile-nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
                    <ul className="mobile-nav-list">
                        {navItems.map((item, index) => (
                            <li
                                key={index}
                                className={`mobile-nav-list-item ${activeSection === item.section ? "active" : ""
                                    }`}
                                onClick={() => handleNavClick(item.section)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleNavClick(item.section);
                                    }
                                }}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
        </>
    );
}

export { Header };
export type { HeaderProps };
