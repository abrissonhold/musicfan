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

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const albumParams = {
                    method: 'album.getinfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const albumUrl = injectParams(baseUrl, albumParams);
                const response = await fetch(albumUrl);
                if (!response.ok) throw new Error("Network Error");
                const parsedResponse = await response.json();
                const albumData = parsedResponse.album;
                
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
                if (albumData?.tracks?.track) {
                    for (const track of albumData.tracks.track) {
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
                    }
                }
                
                setAlbum(albumData);
            }
            catch (e) {
                console.error("Fetching Error: ", e);
            }
        }
        fetchAlbum();
    }, [query]);

    if (album) {
        const navigateToArtistHandler = album.artistMbid !== undefined
            ? () => navigateToArtist(album.artistMbid as string)
            : undefined;
        const basicBannerProps = getBasicBannerProps(album, navigateToArtistHandler);
        const tracklistProps = getTracklistProps(album, navigateToTrack);
        
        return (
            <>
                <Header></Header>
                <BasicBanner {...basicBannerProps}></BasicBanner>
                <section className="album-description">
                    <p className="album-description-text">{album.wiki.content}</p>
                </section>
                <Tracklist {...tracklistProps}></Tracklist>
                <Footer></Footer>
            </>
        )
    }
}

function getBasicBannerProps(album: Album, onArtistClick?: () => void) {
    const basicBannerProps: BasicBannerProps = {
        imageUrl: album.image[3]['#text'] ? album.image[3]['#text'] : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
        artist: album.artist,
        name: album.name,
        listeners: album.listeners,
        onArtistClick: onArtistClick
    };
    return basicBannerProps;
}

function getTracklistProps(
    album: Album, 
    navigateToTrack: (trackName: string, artistName: string, mbid?: string) => void
) {
    const trackItemProps: Array<TrackItemProps> = album.tracks.track.map((currentTrack: Track, index: number) => {
        const currentTrackItemProp: TrackItemProps = {
            index: index + 1,
            imageUrl: album.image[3]['#text'] ? album.image[3]['#text'] : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
            name: currentTrack.name,
            listeners: '0',
            onClick: () => navigateToTrack(currentTrack.name, album.artist, currentTrack.mbid)
        }
        return currentTrackItemProp;
    })
    
    const tracklistProps: TrackListProps = {
        trackItemProps: trackItemProps,
        title: "Canciones del album"
    }
    return tracklistProps;
}

export { AlbumDetails };