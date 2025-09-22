import { useEffect, useState } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";
import type { SearchCardProps } from "../../components/SearchCard/SearchCard";
import {
    SearchCardGallery,
    type SearchGalleryProps,
} from "../../components/SearchCardGallery/SearchCardGallery";
import "./Search.css";
import { useSearchParams, useNavigate } from "react-router-dom";

interface Track {
    name: string;
    artist: string;
    image: string;
    listeners: string;
    mbid: string;
    streamable: string;
}
interface Album {
    name: string;
    artist: string;
    image: string;
    mbid: string;
    streamable: string;
}
interface Artist {
    image: string;
    mbid: string;
    name: string;
    listeners: string;
}

function Search() {
    const API_KEY = "38c33b10c98373d07e536e89fee77c1e";
    const baseUrl = new URL("https://ws.audioscrobbler.com/2.0/?");
    const [tracks, setTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q");

    const navigateToArtist = (mbid: string) => {
        navigate(`/artist?q=${mbid}`);
    };
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    const navigateToAlbum = (mbid: string) => {
        navigate(`/album?q=${mbid}`);
    };    
    const navigateToSeeMore = (query: string, type: string) => {
        navigate(`/seeMore?q=${query}&type=${type}`);
    }
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const searchParams = {
                    method: "track.search",
                    api_key: API_KEY,
                    limit: 6,
                    format: "json",
                    track: query,
                };
                const searchUrl = injectParams(baseUrl, searchParams);
                const response = await fetch(searchUrl);
                if (!response.ok) throw new Error("Network error");
                const searchResponse = await response.json();
                const trackMatches = searchResponse.results.trackmatches.track;
                for (const currentTrack of trackMatches) {
                    const trackInfoParams = {
                        method: "track.getInfo",
                        api_key: API_KEY,
                        mbid: currentTrack.mbid,
                        format: "json",
                    };
                    let trackInfoUrl = injectParams(baseUrl, trackInfoParams);
                    const trackInfo = await fetch(trackInfoUrl);
                    if (!trackInfo.ok) throw new Error("Track info retrieval Error");
                    const retrievedTrackInfo = await trackInfo.json();
                    currentTrack.image = retrievedTrackInfo?.track?.album?.image[3][
                        "#text"
                    ]
                        ? retrievedTrackInfo?.track?.album?.image[3]["#text"]
                        : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
                }
                setTracks(trackMatches);
            } catch (e) {
                console.error("Error fetching: ", e);
            }
        };
        fetchTracks();
    }, [query]);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const searchParams = {
                    method: "album.search",
                    api_key: API_KEY,
                    limit: 6,
                    format: "json",
                    album: query,
                };
                const searchUrl = injectParams(baseUrl, searchParams);
                const response = await fetch(searchUrl);
                if (!response.ok) throw new Error("Network error");
                const searchResponse = await response.json();
                const albumMatches = searchResponse.results.albummatches.album;
                for (const currentTrack of albumMatches) {
                    currentTrack.image = currentTrack.image[2]["#text"]
                        ? currentTrack.image[2]["#text"]
                        : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
                }
                setAlbums(albumMatches);
            } catch (e) {
                console.error("Error fetching: ", e);
            }
        };
        fetchAlbums();
    }, [query]);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const artistSearchParams = {
                    method: "artist.search",
                    api_key: API_KEY,
                    artist: query,
                    format: "json",
                    limit: 6,
                };
                const artistSearchUrl = injectParams(baseUrl, artistSearchParams);
                const response = await fetch(artistSearchUrl);
                if (!response.ok) throw new Error("Network Error");
                const parsedResponse = await response.json();
                const artists = parsedResponse.results.artistmatches.artist;
                for (const currentArtist of artists) {
                    const artistTopAlbumsParams = {
                        method: "artist.gettopalbums",
                        api_key: API_KEY,
                        mbid: currentArtist.mbid,
                        limit: 1,
                        format: "json",
                    };
                    let artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
                    const responseArtist = await fetch(artistTopAlbumsUrl);
                    if (!responseArtist.ok)
                        throw new Error("Artists top albums retrieval Error");
                    const artistTopAlbumsResponse = await responseArtist.json();
                    currentArtist.image = artistTopAlbumsResponse.topalbums?.album[0]
                        ?.image[2]["#text"]
                        ? artistTopAlbumsResponse.topalbums?.album[0]?.image[2]["#text"]
                        : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
                }
                setArtists(artists);
            } catch (e) {
                console.error("Fetching Error: ", e);
            }
        };
        fetchArtist();
    }, [query]);

    if (artists && albums && tracks) {
        const tracksGalleryProps = getTracksProps(tracks, navigateToTrack, navigateToSeeMore, query ? query : '', 'track');
        const albumGaleryProps = getAlbumsProps(albums, navigateToAlbum, navigateToSeeMore, query ? query : '', 'album');
        const artistGalleryProps = getArtistsProps(artists, navigateToArtist, navigateToSeeMore, query ? query : '', 'artist');
        const playlist = localStorage.getItem("favorites") != null ? localStorage.getItem("favorites") : JSON.stringify({tracks: ['Empty']});
        const parsedPlaylist = JSON.parse(playlist as string);        
        const playlistMenuProps: PlaylistProps = {
            tracks: parsedPlaylist
        }
        return (
            <>
                <div className="search">
                    <Header></Header>
                    <div className="gridded-content">
                        <PlaylistMenu {...playlistMenuProps}></PlaylistMenu>
                        <div className="main-content">
                            {tracksGalleryProps.searchCardPropsArray.length > 0 ? <SearchCardGallery {...tracksGalleryProps}></SearchCardGallery> : <SearchCardGallery galleryTitle="No hay canciones que coincidan con tu búsqueda" searchCardPropsArray={[]} seeMoreRedirect={() => ''}></SearchCardGallery>}
                            {albumGaleryProps.searchCardPropsArray.length > 0 ? <SearchCardGallery {...albumGaleryProps}></SearchCardGallery> : <SearchCardGallery galleryTitle="No hay álbumes que coincidan con tu búsqueda" searchCardPropsArray={[]} seeMoreRedirect={() => ''}></SearchCardGallery>}
                            {artistGalleryProps.searchCardPropsArray.length > 0 ? <SearchCardGallery {...artistGalleryProps}></SearchCardGallery> : <SearchCardGallery galleryTitle="No hay artistas que coincidan con tu búsqueda" searchCardPropsArray={[]} seeMoreRedirect={() => ''}></SearchCardGallery>}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export { Search };

function getArtistsProps(artists: Artist[], navigate: (mbid: string) => void, seeMore: (query: string, type: string) => void, query: string, type: string) {
    return {
        galleryTitle: "Artistas",
        searchCardPropsArray: artists.map(a => ({
            type: "artist" as const,
            imageUrl: a.image,
            title: a.name,
            listenersAmount: a.listeners,
            onClick: () => navigate(a.mbid),
            mbid: a.mbid,
        })),
        seeMoreRedirect: () => seeMore(query, type)
    };
}

function getAlbumsProps(albums: Album[], navigate: (mbid: string) => void, seeMore: (query: string, type: string) => void, query: string, type: string) {
    return {
        galleryTitle: "Álbumes",
        searchCardPropsArray: albums.map(al => ({
            type: "album" as const,
            imageUrl: al.image,
            title: al.name,
            subtitle: al.artist,
            onClick: () => navigate(al.mbid),
            mbid: al.mbid
        })),
        seeMoreRedirect: () => seeMore(query, type)
    };
}

function getTracksProps(tracks: Track[], navigate: (mbid: string) => void, seeMore: (query: string, type: string) => void, query: string, type: string) {
    return {
        galleryTitle: "Canciones",
        searchCardPropsArray: tracks.map(t => ({
            type: "track" as const,
            imageUrl: t.image,
            title: t.name,
            subtitle: t.artist,
            onClick: () => navigate(t.mbid),
            mbid: t.mbid
        })),
        seeMoreRedirect: () => seeMore(query, type)
    };
}
function injectParams(baseUrl: URL, params: Object) {
    const newUrl = new URL(baseUrl.toString());
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            newUrl.searchParams.append(key, String(value));
        }
    });
    return newUrl;
}
