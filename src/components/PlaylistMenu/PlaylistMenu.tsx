import { useEffect, useState } from "react";
import "./PlaylistMenu.css"
import { API_KEY, baseUrl } from "../../helpers/constants";
import { injectParams } from "../../helpers/helper";
import { Tracklist, type TrackListProps } from "../Tracklist/Tracklist";
import { TrackItem, type TrackItemProps } from "../TrackItem/TrackItem";
import { useNavigate } from "react-router-dom";
interface PlaylistProps{
    tracks: string[];
}
interface Track {
    name: string;
    image: string;
    artist: string;
    playcount: string;
    mbid: string;
}
function PlaylistMenu({tracks}: PlaylistProps) {
    const [tracksList, setTracksList] = useState<Track[]>([]);
    const navigate = useNavigate();

    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    useEffect(() => {
        const fetchTracks = async () => {
            const tracksInfo = [];
            for(let i = 0; i < tracks.length; i++){
                const trackInfoParams = {
                    method: "track.getInfo",
                    api_key: API_KEY,
                    mbid: tracks[i],
                    format: "json",
                };
                let trackInfoUrl = injectParams(baseUrl, trackInfoParams);
                const trackInfo = await fetch(trackInfoUrl);
                if (!trackInfo.ok) throw new Error("Track info retrieval Error");
                const retrievedTrackInfo = await trackInfo.json();
                retrievedTrackInfo.image = retrievedTrackInfo?.track?.album?.image[3][
                    "#text"
                ]
                ? retrievedTrackInfo?.track?.album?.image[3]["#text"]
                : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";     
                const mappedTrack: Track = {
                    name: retrievedTrackInfo.track.name,
                    image: retrievedTrackInfo.image,
                    artist: retrievedTrackInfo.track.artist.name,
                    playcount: '',
                    mbid: retrievedTrackInfo.track.mbid
                }           
                tracksInfo.push(mappedTrack);
            }
            setTracksList(tracksInfo);
        }
        fetchTracks();
    }, []);   
    if(tracksList){
        const trackItemProps = getTrackItemProps(tracksList, navigateToTrack);
        return (
        <>      
            <div className="playlist-menu">
                <div className="playlist">
                    <Tracklist {...trackItemProps}></Tracklist>
                </div>
            </div>      
        </>
    )
    }
    
}
function getTrackItemProps(tracks: Track[], navigate: (mbid: string) => void){
    const trackItemProps: Array<TrackItemProps> = tracks.map((currentTrack: Track, index: number) => ({
        index: index + 1,
        imageUrl: currentTrack.image,
        name: currentTrack.name,
        listeners: String(currentTrack.playcount || '0'), // Last.fm no proporciona listeners por track en album.getinfo
        onClick: () => {
            console.log(currentTrack);
            if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
                navigate(currentTrack.mbid);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.warn('No valid MBID for track:', currentTrack.name);
            }
        }
    }));
    const trackListProps: TrackListProps = {
        trackItemProps: trackItemProps,
        title: "Favoritos"
    }
    return trackListProps;
}
export { PlaylistMenu }
export type {PlaylistProps}