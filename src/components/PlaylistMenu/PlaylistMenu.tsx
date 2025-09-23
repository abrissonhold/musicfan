import { useEffect, useState } from "react";
import "./PlaylistMenu.css";
import { API_KEY, baseUrl } from "../../helpers/constants";
import { injectParams, getFavorites, clearFavorites } from "../../helpers/helper";
import { Tracklist, type TrackListProps } from "../Tracklist/Tracklist";
import { type TrackItemProps } from "../TrackItem/TrackItem";
import { useNavigate } from "react-router-dom";

interface PlaylistProps {
    tracks: string[];
    isVisible?: boolean;
    onClose?: () => void;
}

interface Track {
    name: string;
    image: string;
    artist: string;
    playcount: string;
    mbid: string;
}

function PlaylistMenu({ tracks: initialTracks, isVisible = true, onClose }: PlaylistProps) {
    const [tracksList, setTracksList] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavorites());
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
        if (isMobile && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        const handleFavoritesUpdate = (event: any) => {
            const newFavorites = event.detail || getFavorites();
            setFavoriteIds(newFavorites);
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    }, []);

    useEffect(() => {
        const fetchTracks = async () => {
            if (!favoriteIds || favoriteIds.length === 0) {
                setTracksList([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const tracksInfo: Track[] = [];

                for (let i = 0; i < favoriteIds.length; i++) {
                    try {
                        const trackInfoParams = {
                            method: "track.getInfo",
                            api_key: API_KEY,
                            mbid: favoriteIds[i],
                            format: "json",
                        };

                        const trackInfoUrl = injectParams(baseUrl, trackInfoParams);
                        const trackInfo = await fetch(trackInfoUrl);

                        if (!trackInfo.ok) {
                            console.warn(`Error fetching track ${favoriteIds[i]}: ${trackInfo.status}`);
                            continue;
                        }

                        const retrievedTrackInfo = await trackInfo.json();

                        if (!retrievedTrackInfo.track) {
                            console.warn(`No track data found for ${favoriteIds[i]}`);
                            continue;
                        }

                        const albumImage = retrievedTrackInfo?.track?.album?.image?.[3]?.["#text"] ||
                            retrievedTrackInfo?.track?.album?.image?.[2]?.["#text"] ||
                            "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";

                        const mappedTrack: Track = {
                            name: retrievedTrackInfo.track.name,
                            image: albumImage,
                            artist: retrievedTrackInfo.track.artist.name,
                            playcount: retrievedTrackInfo.track.playcount || '0',
                            mbid: retrievedTrackInfo.track.mbid || favoriteIds[i]
                        };

                        tracksInfo.push(mappedTrack);
                    } catch (trackError) {
                        console.error(`Error processing track ${favoriteIds[i]}:`, trackError);
                        continue;
                    }
                }

                setTracksList(tracksInfo);
            } catch (e) {
                console.error("Error fetching tracks:", e);
                setError("Error al cargar la playlist");
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [favoriteIds]);

    const handleClearFavorites = () => {
        if (favoriteIds.length === 0) return;
        clearFavorites();
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const menuClasses = [
        'playlist-menu',
        isMobile ? 'playlist-menu--mobile' : 'playlist-menu--desktop',
        isMobile && isVisible ? 'playlist-menu--visible' : '',
        isMobile && !isVisible ? 'playlist-menu--hidden' : ''
    ].filter(Boolean).join(' ');

    if (loading) {
        return (
            <div className={menuClasses}>
                <div className="playlist-header">
                    <h3 className="playlist-title">Favoritos</h3>
                    {isMobile && (
                        <button className="playlist-close-btn" onClick={handleClose}>
                            ×
                        </button>
                    )}
                </div>
                <div className="playlist">
                    <div className="playlist-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando tu playlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={menuClasses}>
                <div className="playlist-header">
                    <h3 className="playlist-title">Favoritos</h3>
                    {isMobile && (
                        <button className="playlist-close-btn" onClick={handleClose}>
                            ×
                        </button>
                    )}
                </div>
                <div className="playlist">
                    <div className="playlist-error">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (favoriteIds.length == 0 || favoriteIds == null) {
        return (
            <div className={menuClasses}>
                <div className="playlist-header">
                    <h3 className="playlist-title">Favoritos</h3>
                    {isMobile && (
                        <button className="playlist-close-btn" onClick={handleClose}>
                            ×
                        </button>
                    )}
                </div>
                <div className="playlist">
                    <div className="playlist-empty">
                        <p>No tienes canciones favoritas aún</p>
                    </div>
                </div>
            </div>
        );
    }

    const trackItemProps = getTrackItemProps(tracksList, navigateToTrack);

    return (
        <div className={menuClasses}>
            <div className="playlist-header">
                <div className="playlist-title-container">

                </div>
                {isMobile && (
                    <button className="playlist-close-btn" onClick={handleClose}>
                        ×
                    </button>
                )}
            </div>

            <div className="playlist">
                <Tracklist {...trackItemProps} />
            </div>
            <div className="borrar">
                <img
                    src="src/assets/eliminar.svg"
                    alt="Limpiar favoritos"
                    className="clear-favorites-btn"
                    onClick={handleClearFavorites}
                    title="Limpiar todos los favoritos"
                />
            </div>

        </div>
    );
}

function getTrackItemProps(tracks: Track[], navigate: (mbid: string) => void): TrackListProps {
    const trackItemProps: Array<TrackItemProps> = tracks.map((currentTrack: Track, index: number) => ({
        index: index + 1,
        imageUrl: currentTrack.image,
        name: currentTrack.name,
        trackMbid: currentTrack.mbid,
        showListeners: false,
        showFavoriteButton: false,
        onClick: () => {
            if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                navigate(currentTrack.mbid);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.warn('No valid MBID for track:', currentTrack.name);
            }
        }
    }));

    return {
        trackItemProps: trackItemProps,
        title: `Favoritos`
    };
}

export { PlaylistMenu };
export type { PlaylistProps };