import "./ArtistDetails.css"
import { Header } from "../../components/Header/Header";
import { BannerArtist, type BannerArtistProps } from "../../components/BannerArtist/BannerArtist";
import { Footer } from "../../components/Footer/Footer";
import { Tracklist, type TrackListProps } from "../../components/Tracklist/Tracklist";
import { SimilarGallery, type SimilarGalleryProps } from "../../components/SimilarGallery/SimilarGallery";
import { useEffect, useState } from "react";
import { baseUrl, API_KEY } from "../../helpers/constants";
import { injectParams, updateHistory } from "../../helpers/helper";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { TrackItemProps } from "../../components/TrackItem/TrackItem";
import type { SearchCardProps } from "../../components/SearchCard/SearchCard";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";
import type { ReferenceItem } from "../History/History";

interface ArtistResponse {
    name: string;
    image: string;
    stats: Stats;
    tags: Array<Tag>;
    mbid: string;
    bio: Bio;
}

interface Stats {
    listeners: string
    playcount: string;
}

interface Tag {
    name: string;
    url: string;
}

interface Bio {
    content: string;
    published: string;
    summary: string;
}

interface Track {
    name: string;
    image: string;
    listeners: string;
    mbid: string;
}

interface SimilarArtist {
    image: string;
    name: string;
    mbid: string;
}

function ArtistDetails() {
    const [artist, setArtist] = useState<ArtistResponse>();
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");
    
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigateToArtist = (mbid: string) => {
        navigate(`/artist?q=${mbid}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if (!query) {
            setError("No se proporcionó un ID de artista válido");
            setLoading(false);
            return;
        }

        const fetchArtist = async () => {
            try {
                setLoading(true);
                setError(null);

                const artistInfoParams = {
                    method: 'artist.getinfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const artistInfoUrl = injectParams(baseUrl, artistInfoParams);
                const response = await fetch(artistInfoUrl);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const parsedResponse = await response.json();
                const artistInfo = parsedResponse.artist;
                
                if (!artistInfo) {
                    throw new Error("No se encontró información del artista");
                }


                try {
                    const artistTopAlbumsParams = {
                        method: 'artist.gettopalbums',
                        api_key: API_KEY,
                        mbid: artistInfo.mbid,
                        limit: 1,
                        format: 'json'
                    };
                    const artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
                    const responseArtist = await fetch(artistTopAlbumsUrl);
                    
                    if (responseArtist.ok) {
                        const artistTopAlbumsResponse = await responseArtist.json();
                        const topAlbumImage = artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'];
                        if (topAlbumImage) {
                            artistInfo.image = topAlbumImage;
                        }
                    }
                } catch (e) {
                    console.warn('Could not fetch artist image from top albums', e);
                }

                const referenceItem: ReferenceItem = {
                    mbid: artistInfo.mbid,
                    type: "artist"
                };
                updateHistory(referenceItem);
                
                setArtist(artistInfo);
            } catch (e) {
                console.error('Fetching Artist Data Error: ', e);
                setError(e instanceof Error ? e.message : "Error al cargar el artista");
            } finally {
                setLoading(false);
            }
        };
        
        fetchArtist();
    }, [query]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            if (!artist) return;
            
            try {
                const artistTopTracksParams = {
                    method: 'artist.gettoptracks',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: artist.mbid,
                    limit: 10,
                };
                const artistTopTracksUrl = injectParams(baseUrl, artistTopTracksParams);
                const response = await fetch(artistTopTracksUrl);
                
                if (!response.ok) throw new Error('Network Error');
                
                const parsedResponse = await response.json();
                const topTracks = parsedResponse.toptracks.track || [];
                
                const trackPromises = topTracks.map(async (currentTrack: Track) => {
                    if (!currentTrack.mbid) return currentTrack;
                    
                    try {
                        const trackInfoParams = {
                            method: 'track.getInfo',
                            api_key: API_KEY,
                            mbid: currentTrack.mbid,
                            format: 'json'
                        };
                        const trackInfoUrl = injectParams(baseUrl, trackInfoParams);
                        const trackInfo = await fetch(trackInfoUrl);
                        
                        if (trackInfo.ok) {
                            const retrievedTrackInfo = await trackInfo.json();
                            currentTrack.image = retrievedTrackInfo?.track?.album?.image[3]['#text'] ||
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
                    .map(result => (result as PromiseFulfilledResult<Track>).value);
                
                setTopTracks(resolvedTracks);
            } catch (e) {
                console.error('Fetching top tracks error: ', e);
            }
        };
        
        fetchTopTracks();
    }, [artist]);

    useEffect(() => {
        const fetchSimilarArtist = async () => {
            if (!artist) return;
            
            try {
                const similarArtistParams = {
                    method: 'artist.getsimilar',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: artist.mbid,
                    limit: 5,
                };
                const similarArtistUrl = injectParams(baseUrl, similarArtistParams);
                const response = await fetch(similarArtistUrl);
                
                if (!response.ok) throw new Error('Network Error');
                
                const parsedResponse = await response.json();
                const similarArtists = parsedResponse.similarartists.artist || [];
                
                const artistPromises = similarArtists.map(async (currentArtist: SimilarArtist) => {
                    if (!currentArtist.mbid) return currentArtist;
                    
                    try {
                        const artistTopAlbumsParams = {
                            method: 'artist.gettopalbums',
                            api_key: API_KEY,
                            mbid: currentArtist.mbid,
                            limit: 1,
                            format: 'json'
                        };
                        const artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
                        const responseArtist = await fetch(artistTopAlbumsUrl);
                        
                        if (responseArtist.ok) {
                            const artistTopAlbumsResponse = await responseArtist.json();
                            currentArtist.image = artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'] ||
                                                 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                        } else {
                            currentArtist.image = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                        }
                    } catch (e) {
                        console.warn(`Could not fetch image for artist: ${currentArtist.name}`, e);
                        currentArtist.image = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }
                    
                    return currentArtist;
                });
                
                const artistsWithImages = await Promise.allSettled(artistPromises);
                const resolvedArtists = artistsWithImages
                    .filter(result => result.status === 'fulfilled')
                    .map(result => (result as PromiseFulfilledResult<SimilarArtist>).value);
                
                setSimilarArtists(resolvedArtists);
            } catch (e) {
                console.error('Fetching similar artists error: ', e);
            }
        };
        
        fetchSimilarArtist();
    }, [artist]);

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
                        <div className="artist-description loading">
                            <div className="artist-description-text">
                                Cargando información del artista...
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !artist) {
        return (
            <>
                <Header onLogoClick={handleBackToHome} />
                <div className="gridded-content">
                    <div className="playlist-loading">
                        <p>Error en playlist</p>
                    </div>
                    <div className="main-content">
                        <div className="artist-description empty">
                            <div className="artist-description-text">
                                {error || "No se pudo cargar la información del artista"}
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

    const bannerArtistProps = getBannerArtistProps(artist);
    const tracklistProps = getTracklistProps(topTracks, navigateToTrack);
    const similarArtistProps = getSimilarGalleryProps(similarArtists, navigateToArtist);
    
    const descriptionContent = formatDescription(artist.bio?.content || artist.bio?.summary || '');
    const hasLongContent = descriptionContent.length > 1000;
    
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
                    <BannerArtist {...bannerArtistProps} />
                    
                    {descriptionContent && (
                        <section className="album-description">
                            <div className={`album-description-text ${hasLongContent ? 'long-content' : ''}`}>
                                {descriptionContent}
                            </div>
                        </section>
                    )}
                    
                    {topTracks.length > 0 && (
                        <Tracklist {...tracklistProps} />
                    )}
                    
                    {similarArtists.length > 0 && (
                        <SimilarGallery {...similarArtistProps} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

function getBannerArtistProps(artistInfo: ArtistResponse): BannerArtistProps {
    return {
        imageUrl: artistInfo.image || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
        name: artistInfo.name,
        listeners: artistInfo.stats.listeners
    };
}

function getTracklistProps(topTracks: Array<Track>, navigate: (mbid: string) => void): TrackListProps {
    const trackItemProps: Array<TrackItemProps> = topTracks.map((currentTrack: Track, index: number) => ({
        index: index + 1,
        imageUrl: currentTrack.image,
        name: currentTrack.name,
        listeners: currentTrack.listeners,
        trackMbid: currentTrack.mbid,
        showListeners: true,
        showFavoriteButton: true,
        onClick: () => {
            if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                navigate(currentTrack.mbid);
            } else {
                console.warn('No valid MBID for track:', currentTrack.name);
            }
        }
    }));

    return {
        trackItemProps: trackItemProps,
        title: `Mejores canciones (${trackItemProps.length})`
    };
}

function getSimilarGalleryProps(similarArtist: SimilarArtist[], navigate: (mbid: string) => void): SimilarGalleryProps {
    const searchCardProps = similarArtist.map((currentArtist: SimilarArtist) => {
        const searchCardProp: SearchCardProps = {
            type: "artist",
            imageUrl: currentArtist.image,
            title: currentArtist.name,
            subtitle: undefined,
            listenersAmount: undefined,
            onClick: () => {
                if (currentArtist.mbid && currentArtist.mbid.trim() !== '') {
                    navigate(currentArtist.mbid);
                } else {
                    console.warn('No valid MBID for artist:', currentArtist.name);
                }
            },
            mbid: currentArtist.mbid,
        };
        return searchCardProp;
    });

    return {
        similarCardProps: searchCardProps,
        title: `Artistas Similares (${searchCardProps.length})`
    };
}

export { ArtistDetails };