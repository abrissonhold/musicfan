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

function Search() {
    const API_KEY = '38c33b10c98373d07e536e89fee77c1e'
    const baseUrl = new URL('https://ws.audioscrobbler.com/2.0/?');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
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
                console.log(trackMatches);
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
                console.log(searchResponse);
                const albumMatches = searchResponse.results.albummatches.album;
                console.log(albumMatches);
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

    const navItems = [
        "Exitos",
        "Tus favoritos",
        "Artistas destacados"
    ];
    const tracksGalleryProps= getTracks(tracks);
    const albumGaleryProps = getAlbums(albums);
    console.log(query);
    return (
        <>
            <div className="search">
                <Header navItems={navItems}></Header>
                <div className="gridded-content">
                    <PlaylistMenu></PlaylistMenu>
                    <div className="main-content">
                        <SearchCardGallery {...tracksGalleryProps}></SearchCardGallery>
                        <SearchCardGallery {...albumGaleryProps}></SearchCardGallery>
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

function injectParams(baseUrl: URL, params: Object){
  const newUrl = new URL(baseUrl.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      newUrl.searchParams.append(key, String(value));
    }
  });
  return newUrl;
}