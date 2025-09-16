import { useEffect, useState } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { PlaylistMenu } from "../../components/PlaylistMenu/PlaylistMenu";
import type { SearchCardProps } from "../../components/SearchCard/SearchCard";
import { SearchCardGallery, type SearchGalleryProps } from "../../components/SearchCardGallery/SearchCardGallery";
import "./Search.css"
import { useSearchParams } from "react-router-dom";

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
    const API_KEY = '38c33b10c98373d07e536e89fee77c1e'
    const baseUrl = new URL('https://ws.audioscrobbler.com/2.0/?');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    useEffect(() => {
        const fetchTracks = async () => {
            try{
                const searchParams = {
                    method: 'track.search',
                    api_key: API_KEY,
                    limit: 5,
                    format: 'json',
                    track: query
                };
                const searchUrl = injectParams(baseUrl, searchParams);
                const response = await fetch(searchUrl);
                if(!response.ok) throw new Error("Network error");
                const searchResponse = await response.json();
                const trackMatches = searchResponse.results.trackmatches.track;
                for(const currentTrack of trackMatches){
                    const trackInfoParams = {
                        method: 'track.getInfo',
                        api_key: API_KEY,
                        mbid: currentTrack.mbid,
                        format: 'json'
                    }
                    let trackInfoUrl = injectParams(baseUrl, trackInfoParams);            
                    const trackInfo = await fetch(trackInfoUrl);
                    if(!response.ok) throw new Error("Track info retrieval Error");
                    const retrievedTrackInfo = await trackInfo.json();
                    currentTrack.image = retrievedTrackInfo?.track?.album?.image[3]['#text'] ? 
                    retrievedTrackInfo?.track?.album?.image[3]['#text'] :
                    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                }   
                setTracks(trackMatches);
            }
            catch(e){
                console.error("Error fetching: ", e);
            }
        }                    
        fetchTracks();
    }, [query]);

    useEffect(() => {
        const fetchAlbums = async () => {
            try{
                const searchParams = {
                    method: 'album.search',
                    api_key: API_KEY,
                    limit: 5,
                    format: 'json',
                    album: query
                };
                const searchUrl = injectParams(baseUrl, searchParams);
                const response = await fetch(searchUrl);
                if(!response.ok) throw new Error("Network error");
                const searchResponse = await response.json();
                const albumMatches = searchResponse.results.albummatches.album;
                for(const currentTrack of albumMatches){                    
                    currentTrack.image = currentTrack.image[2]['#text'] ? 
                    currentTrack.image[2]['#text'] :
                    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                }   
                setAlbums(albumMatches);
            }
            catch(e){
                console.error('Error fetching: ', e);
            }
        }
        fetchAlbums();
    }, [query]);

    useEffect(() => {
        const fetchArtist = async () => {
            try{
                const artistSearchParams = {
                    method: 'artist.search',
                    api_key: API_KEY,
                    artist: query,
                    format: 'json',
                    limit: 5,
                }
                const artistSearchUrl = injectParams(baseUrl, artistSearchParams);
                const response = await fetch(artistSearchUrl);
                if(!response.ok) throw new Error("Network Error");
                const parsedResponse = await response.json();
                const artists = parsedResponse.results.artistmatches.artist;
                for(const currentArtist of artists){
                    const artistTopAlbumsParams = {
                        method: 'artist.gettopalbums',
                        api_key: API_KEY,
                        mbid: currentArtist.mbid,
                        limit: 1,
                        format: 'json'
                    }
                    let artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
                    const responseArtist = await fetch(artistTopAlbumsUrl);
                    if(!responseArtist.ok) throw new Error('Artists top albums retrieval Error');
                    const artistTopAlbumsResponse = await responseArtist.json();
                    currentArtist.image = artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'] ? 
                    artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'] : 
                    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                }
                setArtists(artists);
            }
            catch(e){
                console.error("Fetching Error: ", e);
            }
        }
        fetchArtist();
    }, [query]);

    const tracksGalleryProps= getTracks(tracks);
    const albumGaleryProps = getAlbums(albums);
    const artistGalleryProps = getArtistsProps(artists);
    return (
        <>
            <div className="search">
                <Header></Header>
                <div className="gridded-content">
                    <PlaylistMenu></PlaylistMenu>
                    <div className="main-content">
                        <SearchCardGallery {...tracksGalleryProps}></SearchCardGallery>
                        <SearchCardGallery {...albumGaleryProps}></SearchCardGallery>
                        <SearchCardGallery {...artistGalleryProps}></SearchCardGallery>
                    </div>
                </div>                
            </div>
        </>
    )
}
export { Search }
function getTracks(tracks: Track[]){
    const trackData: SearchCardProps[] = [];
    tracks.forEach((currentTrack) => {
        const track: SearchCardProps = {
            imageUrl: currentTrack.image,
            artistName: currentTrack.artist,
            songName: currentTrack.name,
            listenersAmount: currentTrack.listeners
        }
        trackData.push(track);
    })
    const trackGalleryProps: SearchGalleryProps = {
        searchCardPropsArray: trackData,
        galleryTitle: "Canciones"
    };
    return trackGalleryProps;
}
function getAlbums(albums: Album[]){
    const albumData: SearchCardProps[] = [];
    albums.forEach((currentAlbum) => {
        const album: SearchCardProps = {
            imageUrl: currentAlbum.image,
            artistName: currentAlbum.artist,
            songName: currentAlbum.name,
            listenersAmount: ""
        }
        albumData.push(album);
    })
    const albumGalleryProps: SearchGalleryProps = {
        searchCardPropsArray: albumData,
        galleryTitle: "Albums"
    };
    return albumGalleryProps;
}
function getArtistsProps(artists: Artist[]){
    const artistCards: SearchCardProps[] = [];
    artists.forEach((currentArtist: Artist) => {
        const artistCard: SearchCardProps = {
            imageUrl: currentArtist.image,
            artistName: currentArtist.name,
            songName: '',
            listenersAmount: `Listeners: ${currentArtist.listeners}`
        }
        artistCards.push(artistCard);
    })
    const artistGalleryProps: SearchGalleryProps = {
        searchCardPropsArray: artistCards,
        galleryTitle: "Artistas"
    };
    return artistGalleryProps;
}

function injectParams(baseUrl: URL, params: Object){
  const newUrl = new URL(baseUrl.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      newUrl.searchParams.append(key, String(value));
    }
  });
  return newUrl;
}