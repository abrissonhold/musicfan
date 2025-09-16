import "./TrackDetails.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { BasicBanner, type BasicBannerProps } from "../../components/BasicBanner/BasicBanner";
import { SimilarGallery, type SimilarGalleryProps } from "../../components/SimilarGallery/SimilarGallery";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { baseUrl, API_KEY } from "../../helpers/constants";
import { injectParams } from "../../helpers/helper";
import type { SearchCardProps } from "../../components/SearchCard/SearchCard";
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
}
function TrackDetails(){
    const [track, setTrack] = useState<Track>();
    const [similarTracks, setSimilarTracks] = useState();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    useEffect(() => {
        const fetchTrack = async () => {
            try{
                const trackParams = {
                    method: 'track.getInfo',
                    api_key: API_KEY,
                    format: 'json',
                    mbid: query,
                };
                const trackUrl = injectParams(baseUrl, trackParams);
                const response = await fetch(trackUrl);
                if(!response.ok) throw new Error('Network Error');
                const parsedResponse = await response.json();
                const track = parsedResponse.track;
                setTrack(track)
            }
            catch(e){
                console.error("Fetching Error: ", e);
            }
        }
        fetchTrack();
    }, [query])
    useEffect(() => {
        const fetchSimilarTracks = async () => {
            try{
                if(track){
                    const similarTracksParams = {
                        method: 'track.getsimilar',
                        api_key: API_KEY,
                        format: 'json',
                        mbid: track.mbid,
                        limit: 5
                    };
                    const similarTracksUrl = injectParams(baseUrl, similarTracksParams);
                    const response = await fetch(similarTracksUrl);
                    if(!response.ok) throw new Error('Network Error');
                    const parsedResponse = await response.json();
                    const similarTracks = parsedResponse.similartracks.track;
                    for(const currentTrack of similarTracks){
                        const trackParams = {
                            method: 'track.getInfo',
                            api_key: API_KEY,
                            format: 'json',
                            mbid: currentTrack.mbid,
                        };
                        const trackUrl = injectParams(baseUrl, trackParams);
                        const response = await fetch(trackUrl);
                        if(!response.ok) throw new Error('Network Error');
                        const parsedResponse = await response.json();
                        currentTrack.image = parsedResponse?.track?.album?.image[3]['#text'] ? 
                        parsedResponse?.track?.album?.image[3]['#text'] :
                        'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }
                    setSimilarTracks(similarTracks);
                }                
            }
            catch(e){
                console.error('Fetching Error: ', e);
            }
        }
        fetchSimilarTracks();
    }, [track]);
    if(track && similarTracks){
        const basicBannerProps = getBasicBannerProps(track);
        const similarGalleryProps = getSimilarGalleryProps(similarTracks);
        return (
            <>
                <Header></Header>
                <BasicBanner {...basicBannerProps}></BasicBanner>
                <section className="track-description">
                    <p className="track-description-text">{track.wiki.content}</p>
                </section>
                <SimilarGallery {...similarGalleryProps}></SimilarGallery>
                <Footer></Footer>
            </>
        )
    }
}
function getBasicBannerProps(track: Track){
    const basicBannerProps: BasicBannerProps = {
        imageUrl: track.album.image[3]['#text'] ? track.album.image[3]['#text'] : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
        artist: track.artist.name,
        name: track.name,
        listeners: track.listeners
    };
    return basicBannerProps;
}
function getSimilarGalleryProps(similarTracks: SimilarTrack[]){
    const searchCardProps = similarTracks.map((currentTrack: SimilarTrack) => {
        const searchCardProp: SearchCardProps = {
            imageUrl: currentTrack.image,
            artistName: currentTrack.artist.name,
            songName: currentTrack.name,
            listenersAmount: currentTrack.playcount
        }
        return searchCardProp;
    })
    const similarGalleryProps: SimilarGalleryProps = {
        similarCardProps: searchCardProps,
        title: "Artistas Similares"
    }
    return similarGalleryProps;
}
export { TrackDetails };