import { useEffect, useState } from "react";
import "./PlaylistMenu.css"
import { API_KEY, baseUrl } from "../../helpers/constants";
import { injectParams } from "../../helpers/helper";
import { Tracklist, type TrackListProps } from "../Tracklist/Tracklist";
import { type TrackItemProps } from "../TrackItem/TrackItem";
import { useNavigate } from "react-router-dom";

interface PlaylistProps {
    tracks: string[];
}

interface Track {
    name: string;
    image: string;
    artist: string;
    playcount: string;
    mbid: string;
}

function PlaylistMenu({ tracks }: PlaylistProps) {
    const [tracksList, setTracksList] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    useEffect(() => {
        const fetchTracks = async () => {
            if (!tracks || tracks.length === 0) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const tracksInfo = [];

                for (let i = 0; i < tracks.length; i++) {
                    try {
                        const trackInfoParams = {
                            method: "track.getInfo",
                            api_key: API_KEY,
                            mbid: tracks[i],
                            format: "json",
                        };

                        const trackInfoUrl = injectParams(baseUrl, trackInfoParams);
                        const trackInfo = await fetch(trackInfoUrl);
                        
                        if (!trackInfo.ok) {
                            console.warn(`Error fetching track ${tracks[i]}: ${trackInfo.status}`);
                            continue; 
                        }

                        const retrievedTrackInfo = await trackInfo.json();
                        
                        if (!retrievedTrackInfo.track) {
                            console.warn(`No track data found for ${tracks[i]}`);
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
                            mbid: retrievedTrackInfo.track.mbid || tracks[i]
                        };

                        tracksInfo.push(mappedTrack);
                    } catch (trackError) {
                        console.error(`Error processing track ${tracks[i]}:`, trackError);
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
    }, [tracks]);

    if (loading) {
        return (
            <div className="playlist-menu">
                <div className="playlist">
                    <div className="playlist-loading">
                        <p>Cargando tu playlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlist-menu">
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

    if (!tracks || tracks.length === 0) {
        return (
            <div className="playlist-menu">
                <div className="playlist">
                    <div className="playlist-empty">
                        <p>No tienes canciones en tu playlist aún</p>
                        <p>Agrega algunas canciones a tus favoritos para verlas aquí</p>
                    </div>
                </div>
            </div>
        );
    }

    if (tracksList.length > 0) {
        const trackItemProps = getTrackItemProps(tracksList, navigateToTrack);
        return (
            <div className="playlist-menu">
                <div className="playlist">
                    <Tracklist {...trackItemProps} />
                </div>
            </div>
        );
    }

    return null;
}

function getTrackItemProps(tracks: Track[], navigate: (mbid: string) => void): TrackListProps {
    const trackItemProps: Array<TrackItemProps> = tracks.map((currentTrack: Track, index: number) => ({
        index: index + 1,
        imageUrl: currentTrack.image,
        name: currentTrack.name,
        showListeners: false, 
        onClick: () => {
            console.log('Navigating to track:', currentTrack);
            if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                navigate(currentTrack.mbid);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.warn('No valid MBID for track:', currentTrack.name);
            }
        }
    }));

    const trackListProps: TrackListProps = {
        trackItemProps: trackItemProps,
        title: `Favoritos (${trackItemProps.length})`
    };

    return trackListProps;
}

export { PlaylistMenu };
export type { PlaylistProps };