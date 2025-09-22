import { baseUrl, API_KEY, defaultImage } from "./constants";
import { injectParams } from "./helper";

interface Artist {
    name: string;
    mbid: string;
    image: string;    
    stats: {
        playcount: string;
        listeners: string;
    }
}
interface Album {
    artist: string;
    mbid: string;
    image: string;
    name: string;
    playcount: string;
}
interface Track {
    name: string;
    mbid: string;
    image: string;
    playcount: string;
}
interface ArtistSearch{
    name: string;
    mbid: string;
    image: string;
    listeners: string;
}
async function getTrackInfo(mbid: string){
    const trackInfoParams = {
        method: "track.getInfo",
        api_key: API_KEY,
        mbid: mbid,
        format: "json",
    };
    let trackInfoUrl = injectParams(baseUrl, trackInfoParams);
    const trackInfo = await fetch(trackInfoUrl);
    if (!trackInfo.ok) throw new Error("Track info retrieval Error");
    const retrievedTrackInfo = await trackInfo.json();
    const track = retrievedTrackInfo.track;
    track.image = track?.album?.image[3]["#text"]
    ? track?.album?.image[3]["#text"]
    : defaultImage;
    return track as Track;
}
async function getArtistInfo(mbid: string): Promise<Artist>{
    const artistInfoParams = {
        method: 'artist.getinfo',
        api_key: API_KEY,
        format: 'json',
        mbid: mbid,
    };
    const artistInfoUrl = injectParams(baseUrl, artistInfoParams);
    const response = await fetch(artistInfoUrl);
    if (!response.ok) throw new Error('Network Error');
    const parsedResponse = await response.json();
    const artistInfo: Artist = parsedResponse.artist;
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
    return artistInfo;
}
async function getAlbumInfo(mbid: string){
    const albumParams = {
        method: 'album.getinfo',
        api_key: API_KEY,
        format: 'json',
        mbid: mbid,
    };    
    const albumUrl = injectParams(baseUrl, albumParams);
    const response = await fetch(albumUrl);    
    if (!response.ok) throw new Error('Network Error');
    
    const parsedResponse = await response.json();
    const albumInfo = parsedResponse.album;
    albumInfo.image = albumInfo.image[2]['#text'] ? albumInfo.image[2]['#text'] : defaultImage; 
    albumInfo.mbid = albumInfo.mbid ? albumInfo.mbid : mbid;
    return albumInfo as Album;
}
async function getTrackSearch(query: string) {
    try{
        const searchParams = {
            method: "track.search",
            api_key: API_KEY,
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
            currentTrack.image = retrievedTrackInfo?.track?.album?.image[3]["#text"]
            ? retrievedTrackInfo?.track?.album?.image[3]["#text"]
            : defaultImage;
        }
        return trackMatches;
    }
    catch(e){
        console.error("Error fetching track search: ", e);
    }
}
async function getAlbumSearch(query: string) {
    try{
        const searchParams = {
            method: "album.search",
            api_key: API_KEY,
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
            : defaultImage;
        }
        return albumMatches;
    }
    catch(e){
        console.error("Error fetching album search: ", e);
    }
}
async function getArtistSearch(query: string) {
    try{
        const artistSearchParams = {
            method: "artist.search",
            api_key: API_KEY,
            artist: query,
            format: "json",
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
            : defaultImage;
        }
        return artists;
    }
    catch(e){
        console.error("Error fetching artist search: ", e);
    }
}
export {
    getTrackInfo,
    getAlbumInfo,
    getArtistInfo,
    getTrackSearch,
    getAlbumSearch,
    getArtistSearch,
}
export type {
    Track,
    Album,
    Artist,
    ArtistSearch,
}