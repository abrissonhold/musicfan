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
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const query = searchParams.get("q");

    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    const navigateToArtist = (artistMbid: string) => {
        navigate(`/artist?q=${artistMbid}`);
    };

    const navigateToAlbum = (albumMbid: string) => {
        navigate(`/album?q=${albumMbid}`);
    };

    useEffect(() => {
        
        const fetchTrack = async () => {
            try {
                const trackParams = {
                    method: 'track.getInfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const trackUrl = injectParams(baseUrl, trackParams);
                const response = await fetch(trackUrl);
                if (!response.ok) throw new Error('Network Error');
                const parsedResponse = await response.json();
                const trackData = parsedResponse.track;
                
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
                const referenceItem: ReferenceItem = {
                    mbid: trackData.mbid,
                    type: "track"
                };
                updateHistory(referenceItem);
                setTrack(trackData);
            }
            catch (e) {
                console.error("Fetching Error: ", e);
            }
        }
        fetchTrack();
    }, [query]);

    useEffect(() => {
        const fetchSimilarTracks = async () => {
            try {
                if (track) {
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
                    const similarTracks = parsedResponse.similartracks.track;
                    
                    for (const currentTrack of similarTracks) {
                        const trackParams = {
                            method: 'track.getInfo',
                            api_key: API_KEY,
                            format: 'json',
                            mbid: currentTrack.mbid,
                        };
                        const trackUrl = injectParams(baseUrl, trackParams);
                        const response = await fetch(trackUrl);
                        if (!response.ok) throw new Error('Network Error');
                        const parsedResponse = await response.json();
                        currentTrack.image = parsedResponse?.track?.album?.image[3]['#text'] ?
                            parsedResponse?.track?.album?.image[3]['#text'] :
                            'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }
                    setSimilarTracks(similarTracks);
                }
            }
            catch (e) {
                console.error('Fetching Error: ', e);
            }
        }
        fetchSimilarTracks();
    }, [track]);

    if (track && similarTracks.length >= 0) { 
        const navigateToArtistHandler = track.artist.mbid 
            ? () => navigateToArtist(track.artist.mbid)
            : undefined;

        const navigateToAlbumHandler = track.album?.mbid && typeof track.album.mbid === "string"
            ? () => navigateToAlbum(track.album!.mbid as string)
            : undefined;

        const basicBannerProps = getBasicBannerProps(track, navigateToArtistHandler);
        const similarGalleryProps = getSimilarGalleryProps(similarTracks, navigateToTrack);
        const fromAlbum = track.album ? track.album.title : '';
        let trackWikiContent = track.wiki?.content
        ? track.wiki.content
        : "No hay una descripción disponible.";
        trackWikiContent = trackWikiContent;        
        const playlist = localStorage.getItem("favorites") != null ? localStorage.getItem("favorites") : JSON.stringify({tracks: ['Empty']});
        const parsedPlaylist = JSON.parse(playlist as string);  
        const playlistMenuProps: PlaylistProps = {
            tracks: parsedPlaylist
        }
        return (
            <>
                <Header></Header>
                <div className="gridded-content">
                    <PlaylistMenu {...playlistMenuProps}></PlaylistMenu>
                    <div className="main-content">
                        <BasicBanner {...basicBannerProps}></BasicBanner>
                                <section className="track-description">
                                    <p className="track-description-text">
                                        <div>
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
                                        {trackWikiContent}                                                                                                                          
                                    </p>                                    
                                </section>
                                {similarTracks.length > 0 && (
                                    <SimilarGallery {...similarGalleryProps}></SimilarGallery>
                                )}
                    </div>
                </div>
                <Footer></Footer>
            </>
        )
    }
}

function getBasicBannerProps(track: Track, onArtistClick?: () => void) {
    const basicBannerProps: BasicBannerProps = {
        imageUrl: track.album.image[3]['#text'] ? track.album.image[3]['#text'] : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
        artist: track.artist.name,
        name: track.name,
        listeners: track.listeners,
        onArtistClick: onArtistClick
    };
    return basicBannerProps;
}

function getSimilarGalleryProps(similarTracks: SimilarTrack[], navigate: (mbid: string) => void) {
    const searchCardProps = similarTracks.map((currentTrack: SimilarTrack) => {
        const searchCardProp: SearchCardProps = {
            type: "track",
            imageUrl: currentTrack.image,
            title: currentTrack.name,
            subtitle: currentTrack.artist.name,
            listenersAmount: currentTrack.playcount,
            onClick: () => {
                console.log('Hace click');
                if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                    navigate(currentTrack.mbid);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    console.warn('No valid MBID for track:', currentTrack.name);
                }
            },
            mbid: currentTrack.mbid
        }
        return searchCardProp;
    });

    const similarGalleryProps: SimilarGalleryProps = {
        similarCardProps: searchCardProps,
        title: "Canciones Similares"
    }
    return similarGalleryProps;
}

export { TrackDetails };