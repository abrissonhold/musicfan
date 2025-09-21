import { baseUrl, API_KEY, defaultImage } from "./constants";
import { injectParams } from "./helper";

interface Artist {
    name: string;
    mbid: string;
    image: string;    
}
interface Album {
    artist: string;
    mbid: string;
    image: string;
    name: string;
}
interface Track {
    name: string;
    mbid: string;
    image: string;
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
export {
    getTrackInfo,
    getAlbumInfo,
    getArtistInfo,
}