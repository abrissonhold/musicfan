import "./ArtistDetails.css"
import { Header } from "../../components/Header/Header";
import { BannerArtist, type BannerArtistProps } from "../../components/BannerArtist/BannerArtist";
import { Footer } from "../../components/Footer/Footer";
import { Tracklist, type TrackListProps } from "../../components/Tracklist/Tracklist";
import { SimilarGallery, type SimilarGalleryProps } from "../../components/SimilarGallery/SimilarGallery";
import { useEffect, useState } from "react";
import { baseUrl, API_KEY } from "../../helpers/constants";
import { injectParams } from "../../helpers/helper";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { TrackItemProps } from "../../components/TrackItem/TrackItem";
import type { SearchCardProps } from "../../components/SearchCard/SearchCard";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";

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
    mbid: string; // Add mbid for tracks
}

interface SimilarArtist {
    image: string;
    name: string;
    mbid: string; // Add mbid for similar artists
}

function ArtistDetails() {
    const [artist, setArtist] = useState<ArtistResponse>();
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");
    
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    const navigateToArtist = (mbid: string) => {
        navigate(`/artist?q=${mbid}`);
    };

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const artistInfoParams = {
                    method: 'artist.getinfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const artistInfoUrl = injectParams(baseUrl, artistInfoParams);
                const response = await fetch(artistInfoUrl);
                if (!response.ok) throw new Error('Network Error');
                const parsedResponse = await response.json();
                const artistInfo = parsedResponse.artist;
                const artistTopAlbumsParams = {
                    method: 'artist.gettopalbums',
                    api_key: API_KEY,
                    mbid: artistInfo.mbid,
                    limit: 1,
                    format: 'json'
                }
                let artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
                const responseArtist = await fetch(artistTopAlbumsUrl);
                if (!responseArtist.ok) throw new Error('Artists top albums retrieval Error');
                const artistTopAlbumsResponse = await responseArtist.json();
                artistInfo.image = artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'];
                setArtist(artistInfo);
            }
            catch (e) {
                console.error('Fetching Artist Data Error: ', e);
            }
        }
        fetchArtist();
    }, [query]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                if (artist) {
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
                    const topTracks = parsedResponse.toptracks.track
                    for (const currentTrack of topTracks) {
                        const trackInfoParams = {
                            method: 'track.getInfo',
                            api_key: API_KEY,
                            mbid: currentTrack.mbid,
                            format: 'json'
                        }
                        let trackInfoUrl = injectParams(baseUrl, trackInfoParams);
                        const trackInfo = await fetch(trackInfoUrl);
                        if (!trackInfo.ok) throw new Error("Track info retrieval Error"); // Fix: use trackInfo response
                        const retrievedTrackInfo = await trackInfo.json();
                        currentTrack.image = retrievedTrackInfo?.track?.album?.image[3]['#text'] ?
                            retrievedTrackInfo?.track?.album?.image[3]['#text'] :
                            'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }
                    setTopTracks(topTracks);
                }
            }
            catch (e) {
                console.error('Fetching error: ', e);
            }
        }
        fetchTopTracks();
    }, [artist]);

    useEffect(() => {
        const fetchSimilarArtist = async () => {
            try {
                if (artist) {
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
                    const similarArtists = parsedResponse.similarartists.artist;
                    for (const currentArtist of similarArtists) { // Changed variable name to avoid confusion
                        const artistTopAlbumsParams = {
                            method: 'artist.gettopalbums',
                            api_key: API_KEY,
                            mbid: currentArtist.mbid,
                            limit: 1,
                            format: 'json'
                        }
                        let artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
                        const responseArtist = await fetch(artistTopAlbumsUrl);
                        if (!responseArtist.ok) throw new Error('Artists top albums retrieval Error');
                        const artistTopAlbumsResponse = await responseArtist.json();
                        currentArtist.image = artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'];
                    }
                    setSimilarArtists(similarArtists);
                }
            }
            catch (e) {
                console.error('Fetching Error: ', e);
            }
        }
        fetchSimilarArtist();
    }, [artist]);

    if (artist) {
        const bannerArtistProps = getBannerArtistProps(artist);
        const tracklistProps = getTracklistProps(topTracks, navigateToTrack);
        const similarArtistProps = getSimilarGalleryProps(similarArtists, navigateToArtist);
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
                        <BannerArtist {...bannerArtistProps}></BannerArtist>
                        <section className="artist-description">
                            <p className="artist-description-text">{artist.bio.content}</p>
                        </section>
                        <Tracklist {...tracklistProps}></Tracklist>
                        <SimilarGallery {...similarArtistProps}></SimilarGallery>
                    </div>
                </div>
                <Footer></Footer>
            </>
        )
    }
}


function getBannerArtistProps(artistInfo: ArtistResponse) {
    const bannerArtistProps: BannerArtistProps = {
        imageUrl: artistInfo.image,
        name: artistInfo.name,
        listeners: artistInfo.stats.listeners
    }
    return bannerArtistProps;
}

function getTracklistProps(topTracks: Array<Track>, navigate: (mbid: string) => void) {
    const trackItemProps: Array<TrackItemProps> = topTracks.map((currentTrack: Track, index: number) => {
        const currentTrackItemProp: TrackItemProps = {
            index: index + 1,
            imageUrl: currentTrack.image,
            name: currentTrack.name,
            listeners: currentTrack.listeners,
            onClick: () => {
                if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                    navigate(currentTrack.mbid);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    console.warn('No valid MBID for track:', currentTrack.name);
                }
            }
        }
        return currentTrackItemProp;
    })

    const tracklistProps: TrackListProps = {
        trackItemProps: trackItemProps,
        title: "Mejores canciones"
    };
    return tracklistProps;
}

function getSimilarGalleryProps(similarArtist: SimilarArtist[], navigate: (mbid: string) => void) {
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
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    console.warn('No valid MBID for artist:', currentArtist.name);
                }
            },
            mbid: currentArtist.mbid,
        }
        return searchCardProp;
    })

    const similarGalleryProps: SimilarGalleryProps = {
        similarCardProps: searchCardProps,
        title: "Artistas Similares"
    }
    return similarGalleryProps;
}

export { ArtistDetails };