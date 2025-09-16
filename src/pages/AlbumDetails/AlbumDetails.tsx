import { useEffect, useState } from "react";
import { BasicBanner, type BasicBannerProps } from "../../components/BasicBanner/BasicBanner";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import "./AlbumDetails.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { baseUrl, API_KEY } from "../../helpers/constants";
import { injectParams } from "../../helpers/helper";
import { Tracklist, type TrackListProps } from "../../components/Tracklist/Tracklist";
import type { TrackItemProps } from "../../components/TrackItem/TrackItem";

interface Album {
    artist: string;
    image: Image[];
    listeners: string;
    name: string;
    playcount: string;
    tracks: Tracks;
    wiki: Wiki;
    artistMbid?: string; 
}

interface Image {
    size: string;
    "#text": string;
}

interface Tracks {
    track: Track[];
}

interface Track {
    name: string;
    duration: number;
    mbid?: string;
}

interface Wiki {
    content: string;
    published: string;
    summary: string;
}

function AlbumDetails() {
    const [album, setAlbum] = useState<Album>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");

    const navigateToTrack = (trackName: string, artistName: string, mbid?: string) => {
        if (mbid) {
            navigate(`/track?q=${mbid}`);
        } else {
            const searchQuery = `${trackName} ${artistName}`;
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const navigateToArtist = (artistMbid: string) => {
        navigate(`/artist?q=${artistMbid}`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    useEffect(() => {
        if (!query) {
            setError("No se proporcionó un ID de álbum válido");
            setLoading(false);
            return;
        }

        const fetchAlbum = async () => {
            try {
                setLoading(true);
                setError(null);

                const albumParams = {
                    method: 'album.getinfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                
                const albumUrl = injectParams(baseUrl, albumParams);
                const response = await fetch(albumUrl);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const parsedResponse = await response.json();
                const albumData = parsedResponse.album;
                
                if (!albumData) {
                    throw new Error("No se encontró información del álbum");
                }
                if (albumData?.artist) {
                    try {
                        const artistSearchParams = {
                            method: 'artist.search',
                            api_key: API_KEY,
                            format: 'json',
                            artist: albumData.artist,
                            limit: 1
                        };
                        const artistSearchUrl = injectParams(baseUrl, artistSearchParams);
                        const artistSearchResponse = await fetch(artistSearchUrl);
                        
                        if (artistSearchResponse.ok) {
                            const artistSearchData = await artistSearchResponse.json();
                            const foundArtist = artistSearchData?.results?.artistmatches?.artist?.[0];
                            if (foundArtist?.mbid) {
                                albumData.artistMbid = foundArtist.mbid;
                            }
                        }
                    } catch (e) {
                        console.warn(`Could not find mbid for artist: ${albumData.artist}`, e);
                    }
                }

                if (albumData?.tracks?.track && Array.isArray(albumData.tracks.track)) {
                    const trackPromises = albumData.tracks.track.map(async (track: Track) => {
                        try {
                            const trackSearchParams = {
                                method: 'track.search',
                                api_key: API_KEY,
                                format: 'json',
                                track: track.name,
                                artist: albumData.artist,
                                limit: 1
                            };
                            const trackSearchUrl = injectParams(baseUrl, trackSearchParams);
                            const trackSearchResponse = await fetch(trackSearchUrl);
                            
                            if (trackSearchResponse.ok) {
                                const trackSearchData = await trackSearchResponse.json();
                                const foundTrack = trackSearchData?.results?.trackmatches?.track?.[0];
                                if (foundTrack?.mbid) {
                                    track.mbid = foundTrack.mbid;
                                }
                            }
                        } catch (e) {
                            console.warn(`Could not find mbid for track: ${track.name}`, e);
                        }
                        return track;
                    });
                    await Promise.allSettled(trackPromises);
                }
                
                setAlbum(albumData);
            } catch (e) {
                console.error("Fetching Error: ", e);
                setError(e instanceof Error ? e.message : "Error al cargar el álbum");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [query]);

    const formatDescription = (content: string): string => {
        if (!content) return "";
        
        return content
            .replace(/<[^>]*>/g, '') // Remueve parte de las tags HTML
            .replace(/\n\s*\n/g, '\n\n') 
            .trim();
    };

    if (loading) {
        return (
            <>
                <Header isSearching={true} onLogoClick={handleBackToHome} />
                <div className="album-description loading">
                    <div className="album-description-text">
                        Cargando información del álbum...
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !album) {
        return (
            <>
                <Header onLogoClick={handleBackToHome} />
                <div className="album-description empty">
                    <div className="album-description-text">
                        {error || "No se pudo cargar la información del álbum"}
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
                <Footer />
            </>
        );
    }

    const navigateToArtistHandler = album.artistMbid !== undefined
        ? () => navigateToArtist(album.artistMbid as string)
        : undefined;
        
    const basicBannerProps = getBasicBannerProps(album, navigateToArtistHandler);
    const tracklistProps = getTracklistProps(album, navigateToTrack);
    
    const descriptionContent = formatDescription(album.wiki?.content || album.wiki?.summary || '');
    const hasLongContent = descriptionContent.length > 1000;

    return (
        <>
            <Header onLogoClick={handleBackToHome} />
            <BasicBanner {...basicBannerProps} />

            {descriptionContent && (
                <section className="album-description">
                    <div className={`album-description-text ${hasLongContent ? 'long-content' : ''}`}>
                        {descriptionContent}
                    </div>
                </section>
            )}

            {album.tracks?.track && album.tracks.track.length > 0 && (
                <Tracklist {...tracklistProps} />
            )}

            <Footer />
        </>
    );
}

function getBasicBannerProps(album: Album, onArtistClick?: () => void): BasicBannerProps {
    const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
    
    return {
        imageUrl: album.image?.[3]?.['#text'] || album.image?.[2]?.['#text'] || defaultImage,
        artist: album.artist,
        name: album.name,
        listeners: album.listeners,
        onArtistClick: onArtistClick
    };
}

function getTracklistProps(
    album: Album, 
    navigateToTrack: (trackName: string, artistName: string, mbid?: string) => void
): TrackListProps {
    if (!album.tracks?.track || !Array.isArray(album.tracks.track)) {
        return {
            trackItemProps: [],
            title: "Canciones del álbum"
        };
    }

    const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
    const albumImage = album.image?.[3]?.['#text'] || album.image?.[2]?.['#text'] || defaultImage;

    const trackItemProps: Array<TrackItemProps> = album.tracks.track.map((currentTrack: Track, index: number) => ({
        index: index + 1,
        imageUrl: albumImage,
        name: currentTrack.name,
        listeners: String(currentTrack.duration || '0'), // Last.fm no proporciona listeners por track en album.getinfo
        onClick: () => navigateToTrack(currentTrack.name, album.artist, currentTrack.mbid)
    }));
    
    return {
        trackItemProps: trackItemProps,
        title: `Canciones del álbum (${trackItemProps.length})`
    };
}

export { AlbumDetails };