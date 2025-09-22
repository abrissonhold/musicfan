import { useEffect, useState } from "react";
import "./BasicBanner.css";
import { ShareModal } from "../ShareModal/ShareModal";
import { addToFavorites, isFavorite } from "../../helpers/helper";

interface BasicBannerProps {
    imageUrl: string;
    artist: string;
    name: string;
    listeners: string;
    onArtistClick?: () => void;
    mbid?: string;
    showFavoriteButton?: boolean;
    type?: "artist" | "album" | "track";
}

function BasicBanner({ imageUrl, artist, name, listeners, mbid, onArtistClick, showFavoriteButton, type }: BasicBannerProps) {
    const [open, setOpen] = useState(false);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        if (mbid && showFavoriteButton) {
            setIsFav(isFavorite(mbid));
        }
    }, [mbid, showFavoriteButton]);

    useEffect(() => {
        const handleFavoritesUpdate = () => {
            if (mbid && showFavoriteButton) {
                setIsFav(isFavorite(mbid));
            }
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    }, [mbid, showFavoriteButton]);

    const handleArtistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onArtistClick) {
            onArtistClick();
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!mbid || mbid.trim() === '') {
            console.warn('Cannot toggle favorite: no valid MBID');
            return;
        }

        const newFavState = addToFavorites(mbid);
        setIsFav(newFavState);
    };

    return (
        <>
            <section 
                className="basic-banner" 
                style={{ 
                    backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                    backgroundColor: !imageUrl ? 'var(--dl-color-theme-neutral-light)' : 'transparent'
                }}
            >
                <div className="basic-banner-overlay">
                    <div className="basic-banner-header">
                        {onArtistClick ? (
                            <p
                                className="basic-banner-header-artist basic-banner-header-artist--clickable"
                                onClick={handleArtistClick}
                                title={`Ver perfil de ${artist}`}
                            >
                                {artist}
                            </p>
                        ) : (
                            <p className="basic-banner-header-artist">{artist}</p>
                        )}
                        <p className="basic-banner-header-name">{name}</p>
                    </div>
                    
                    <div className="basic-banner-body">
                        <div className="basic-banner-stats">
                            <p className="basic-banner-body-listeners">
                                {listeners ? `${parseInt(listeners).toLocaleString()} oyentes` : 'Oyentes no disponibles'}
                            </p>
                        </div>

                        <div className="basic-banner-actions">
                            {showFavoriteButton && mbid && (                                 
                                <img
                                    className={`basic-banner-fav-icon ${isFav ? 'is-favorite' : ''}`}
                                    onClick={handleToggleFavorite}
                                    title={isFav ? `Quitar "${name}" de favoritos` : `Agregar "${name}" a favoritos`}
                                    src={isFav ? "/src/assets/fav.png" : "/src/assets/noFav.png"}
                                    alt={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                                    />
                            )}

                            <button 
                                className="basic-banner-share-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(true);
                                }}
                                title={`Compartir "${name}"`}
                            >   Compartir
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <ShareModal isOpen={open} onClose={() => setOpen(false)} title={name}/>
        </>
    );
}

export { BasicBanner };
export type { BasicBannerProps };