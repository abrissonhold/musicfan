import { useEffect, useState } from "react";
import { BasicBanner, type BasicBannerProps } from "../../components/BasicBanner/BasicBanner";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import "./AlbumDetails.css";
import { useSearchParams } from "react-router-dom";
import { SimilarGallery } from "../../components/SimilarGallery/SimilarGallery";
import { baseUrl ,API_KEY } from "../../helpers/constants";
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
    duration: number
}
interface Wiki {
    content: string;
    published: string;
    summary: string;
}
function AlbumDetails(){
    const [album, setAlbum ] = useState<Album>();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    useEffect(() => {
        const fetchAlbum = async () => {
            try{
                const albumParams = {
                    method: 'album.getinfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const albumUrl = injectParams(baseUrl, albumParams);
                const response = await fetch(albumUrl);
                if(!response.ok) throw new Error("Network Error");
                const parsedResponse = await response.json();
                const album = parsedResponse.album;
                setAlbum(album);
            }
            catch(e){
                console.error("Fetching Error: ", e);
            }
        }
        fetchAlbum();
    }, [query]);   
    if(album){
        const basicBannerProps = getBasicBannerProps(album);
        const tracklistProps = getTracklistProps(album);
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
function getBasicBannerProps(album: Album){
    const basicBannerProps: BasicBannerProps = {
        imageUrl: album.image[3]['#text'] ? album.image[3]['#text'] : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
        artist: album.artist,
        name: album.name,
        listeners: album.listeners
    };
    return basicBannerProps;
}
function getTracklistProps(album: Album){
    const trackItemProps: Array<TrackItemProps> = album.tracks.track.map((currentTrack: Track, index: number) => {
        const currentTrackItemProp: TrackItemProps = {
            index: index + 1,
            imageUrl: album.image[3]['#text'] ? album.image[3]['#text'] : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
            name: currentTrack.name,
            listeners: '0'
        }
        return currentTrackItemProp;
    })
    const tracklistProps: TrackListProps = {
        trackItemProps: trackItemProps,
        title: "Canciones del album"
    }
    return tracklistProps;
}
export {AlbumDetails};