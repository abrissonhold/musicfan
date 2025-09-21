import "./TrackDetails.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { BasicBanner, type BasicBannerProps } from "../../components/BasicBanner/BasicBanner";
import { SimilarGallery, type SimilarGalleryProps } from "../../components/SimilarGallery/SimilarGallery";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { baseUrl, API_KEY } from "../../helpers/constants";
import { injectParams, updateHistory } from "../../helpers/helper";
import type { SearchCardProps } from "../../components/SearchCard/SearchCard";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";
import type { ReferenceItem } from "../History/History";

interface Track {
    artist: Artist;
    listeners: string;
    mbid: string;
    name: string;
    album: Album;
    wiki: Wiki;
}

interface Artist {
    mbid: string;
    name: string;
}

interface Album {
    image: Image[];
    artist: string;
    title: string;
    mbid?: string; 
}

interface Image {
    size: string;
    '#text': string;
}

interface Wiki {
    content: string;
    published: string;
    summary: string;
}

interface SimilarTrack {
    artist: Artist;
    name: string;
    image: string;
    playcount: string;
    mbid: string;
}

function TrackDetails() {
    const [track, setTrack] = useState<Track>();
    const [similarTracks, setSimilarTracks] = useState<SimilarTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");

    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigateToArtist = (artistMbid: string) => {
        navigate(`/artist?q=${artistMbid}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigateToAlbum = (albumMbid: string) => {
        navigate(`/album?q=${albumMbid}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // Fetch track info
    useEffect(() => {
        if (!query) {
            setError("No se proporcionó un ID de canción válido");
            setLoading(false);
            return;
        }

        const fetchTrack = async () => {
            try {
                setLoading(true);
                setError(null);

                const trackParams = {
                    method: 'track.getInfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const trackUrl = injectParams(baseUrl, trackParams);
                const response = await fetch(trackUrl);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const parsedResponse = await response.json();
                const trackData = parsedResponse.track;
                
                if (!trackData) {
                    throw new Error("No se encontró información de la canción");
                }
                
                // Buscar MBID del álbum si está disponible
                if (trackData?.album?.title && trackData?.album?.artist) {
                    try {
                        const albumSearchParams = {
                            method: 'album.search',
                            api_key: API_KEY,
                            format: 'json',
                            album: trackData.album.title,
                            limit: 10
                        };
                        const albumSearchUrl = injectParams(baseUrl, albumSearchParams);
                        const albumSearchResponse = await fetch(albumSearchUrl);
                        
                        if (albumSearchResponse.ok) {
                            const albumSearchData = await albumSearchResponse.json();
                            const albums = albumSearchData?.results?.albummatches?.album || [];
                            
                            const matchingAlbum = albums.find((album: any) => 
                                album.artist.toLowerCase() === trackData.album.artist.toLowerCase()
                            );
                            
                            if (matchingAlbum?.mbid) {
                                trackData.album.mbid = matchingAlbum.mbid;
                            }
                        }
                    } catch (e) {
                        console.warn(`Could not find mbid for album: ${trackData.album.title}`, e);
                    }
                }

                // Actualizar historial
                const referenceItem: ReferenceItem = {
                    mbid: trackData.mbid,
                    type: "track"
                };
                updateHistory(referenceItem);
                
                setTrack(trackData);
            } catch (e) {
                console.error("Fetching Error: ", e);
                setError(e instanceof Error ? e.message : "Error al cargar la canción");
            } finally {
                setLoading(false);
            }
        };
        
        fetchTrack();
    }, [query]);

    // Fetch similar tracks
    useEffect(() => {
        const fetchSimilarTracks = async () => {
            if (!track) return;
            
            try {
                const similarTracksParams = {
                    method: 'track.getsimilar',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: track.mbid,
                    limit: 5
                };
                const similarTracksUrl = injectParams(baseUrl, similarTracksParams);
                const response = await fetch(similarTracksUrl);
                
                if (!response.ok) throw new Error('Network Error');
                
                const parsedResponse = await response.json();
                const similarTracks = parsedResponse.similartracks.track || [];
                
                // Get similar tracks images
                const trackPromises = similarTracks.map(async (currentTrack: SimilarTrack) => {
                    if (!currentTrack.mbid) return currentTrack;
                    
                    try {
                        const trackParams = {
                            method: 'track.getInfo',
                            api_key: API_KEY,
                            format: 'json',
                            mbid: currentTrack.mbid,
                        };
                        const trackUrl = injectParams(baseUrl, trackParams);
                        const response = await fetch(trackUrl);
                        
                        if (response.ok) {
                            const parsedResponse = await response.json();
                            currentTrack.image = parsedResponse?.track?.album?.image[3]['#text'] ||
                                               'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                        } else {
                            currentTrack.image = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                        }
                    } catch (e) {
                        console.warn(`Could not fetch image for track: ${currentTrack.name}`, e);
                        currentTrack.image = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }
                    
                    return currentTrack;
                });
                
                const tracksWithImages = await Promise.allSettled(trackPromises);
                const resolvedTracks = tracksWithImages
                    .filter(result => result.status === 'fulfilled')
                    .map(result => (result as PromiseFulfilledResult<SimilarTrack>).value);
                
                setSimilarTracks(resolvedTracks);
            } catch (e) {
                console.error('Fetching similar tracks error: ', e);
            }
        };
        
        fetchSimilarTracks();
    }, [track]);

    const formatDescription = (content: string): string => {
        if (!content) return "";
        
        return content
            .replace(/<[^>]*>/g, '') 
            .replace(/\n\s*\n/g, '\n\n') 
            .trim();
    };

    // Estados de carga y error
    if (loading) {
        return (
            <>
                <Header isSearching={true} onLogoClick={handleBackToHome} />
                <div className="gridded-content">
                    <div className="playlist-loading">
                        <p>Cargando playlist...</p>
                    </div>
                    <div className="main-content">
                        <div className="track-description loading">
                            <div className="track-description-text">
                                Cargando información de la canción...
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !track) {
        return (
            <>
                <Header onLogoClick={handleBackToHome} />
                <div className="gridded-content">
                    <div className="playlist-loading">
                        <p>Error en playlist</p>
                    </div>
                    <div className="main-content">
                        <div className="track-description empty">
                            <div className="track-description-text">
                                {error || "No se pudo cargar la información de la canción"}
                                <br />
                                <button 
                                    onClick={handleBackToHome}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem 1rem',
                                        background: 'var(--dl-gradient-primary)',
                                        border: 'none',
                                        borderRadius: 'var(--dl-layout-radius-buttonradius)',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Renderizado principal
    const navigateToArtistHandler = track.artist.mbid 
        ? () => navigateToArtist(track.artist.mbid)
        : undefined;

    const navigateToAlbumHandler = track.album?.mbid && typeof track.album.mbid === "string"
        ? () => navigateToAlbum(track.album!.mbid as string)
        : undefined;

    const basicBannerProps = getBasicBannerProps(track, navigateToArtistHandler);
    const similarGalleryProps = getSimilarGalleryProps(similarTracks, navigateToTrack);
    
    const fromAlbum = track.album ? track.album.title : '';
    const descriptionContent = formatDescription(track.wiki?.content || track.wiki?.summary || '');
    const hasDescription = descriptionContent.length > 0;
    const hasLongContent = descriptionContent.length > 1000;
    
    // Playlist configuration
    const playlist = localStorage.getItem("favorites") != null 
        ? localStorage.getItem("favorites") 
        : JSON.stringify({tracks: ['Empty']});
    const parsedPlaylist = JSON.parse(playlist as string);
    const playlistMenuProps: PlaylistProps = {
        tracks: parsedPlaylist
    };

    return (
        <>
            <Header onLogoClick={handleBackToHome} />
            <div className="gridded-content">
                <PlaylistMenu {...playlistMenuProps} />
                <div className="main-content">
                    <BasicBanner {...basicBannerProps} />
                    
                    {/* Información del track */}
                    <section className="track-description">
                        <div className={`track-description-text ${hasLongContent ? 'long-content' : ''}`}>
                            {/* Información del álbum */}
                            {fromAlbum && (
                                <div className="track-album-info">
                                    Pertenece al álbum{' '}
                                    {navigateToAlbumHandler ? (
                                        <span 
                                            className="track-description-album-link"
                                            onClick={navigateToAlbumHandler}
                                            title={`Ver álbum ${fromAlbum}`}
                                        >
                                            "{fromAlbum}"
                                        </span>
                                    ) : (
                                        `"${fromAlbum}"`
                                    )}
                                </div>
                            )}
                            
                            {/* Descripción de la canción */}
                            {hasDescription ? (
                                <div className="track-wiki-content">
                                    {descriptionContent}
                                </div>
                            ) : (
                                <div className="track-no-description">
                                    No hay una descripción disponible para esta canción.
                                </div>
                            )}
                        </div>                                    
                    </section>
                    
                    {/* Canciones similares */}
                    {similarTracks.length > 0 && (
                        <SimilarGallery {...similarGalleryProps} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

function getBasicBannerProps(track: Track, onArtistClick?: () => void): BasicBannerProps {
    const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
    
    return {
        imageUrl: track.album.image[3]['#text'] || track.album.image[2]?.['#text'] || defaultImage,
        artist: track.artist.name,
        name: track.name,
        listeners: track.listeners,
        onArtistClick: onArtistClick
    };
}

function getSimilarGalleryProps(similarTracks: SimilarTrack[], navigate: (mbid: string) => void): SimilarGalleryProps {
    const searchCardProps = similarTracks.map((currentTrack: SimilarTrack) => {
        const searchCardProp: SearchCardProps = {
            type: "track",
            imageUrl: currentTrack.image,
            title: currentTrack.name,
            subtitle: currentTrack.artist.name,
            listenersAmount: currentTrack.playcount,
            onClick: () => {
                if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                    navigate(currentTrack.mbid);
                } else {
                    console.warn('No valid MBID for track:', currentTrack.name);
                }
            },
            mbid: currentTrack.mbid
        };
        return searchCardProp;
    });

    return {
        similarCardProps: searchCardProps,
        title: `Canciones Similares (${searchCardProps.length})`
    };
}

export { TrackDetails };