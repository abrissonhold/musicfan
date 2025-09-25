import { useEffect, useState } from "react";
import "./History.css"
import { getAlbumInfo, getArtistInfo, getTrackInfo } from "../../helpers/apiCalls";
import { Header } from "../../components/Header/Header";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";
import { Tracklist, type TrackListProps } from "../../components/Tracklist/Tracklist";
import type { TrackItemProps } from "../../components/TrackItem/TrackItem";
import { useNavigate } from "react-router-dom";
interface HistoryItem {
    name: string;
    image: string;
    mbid: string;
}
function History(){
    const [visitedItems, setVisitedItems] = useState<HistoryItem[]>([]);
    useEffect(() => {
        const retrieveItems = async () => {
            const referenceItems = localStorage.getItem("history") ? localStorage.getItem("history") : '';
            if(referenceItems === '') return;
            const parsedHistoryItems: Array<HistoryItem> = JSON.parse(referenceItems as string);
            const historyItems: Array<HistoryItem> = [];
            console.log(historyItems);
            setVisitedItems(parsedHistoryItems);
        }        
        retrieveItems();
    },[])
    const playlist = localStorage.getItem("favorites") != null ? localStorage.getItem("favorites") : JSON.stringify({tracks: ['Empty']});
    const parsedPlaylist = JSON.parse(playlist as string);        
    const playlistMenuProps: PlaylistProps = {
        tracks: parsedPlaylist
    }    
    const itemListProps = getTracklistProps(visitedItems);
    return (
        <>
            <div className="history">
                <Header></Header>
                <div className="gridded-content">
                    <PlaylistMenu {...playlistMenuProps}></PlaylistMenu>
                    <div className="main-content">
                        <Tracklist {...itemListProps}></Tracklist>
                    </div>
                </div>
            </div>
        </>
    )
}
function getTracklistProps(items: HistoryItem[]){
    const navigate = useNavigate();
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };
    const visitedItemsProps: Array<TrackItemProps> = items.map((currentItem: HistoryItem, index: number) => {
        const trackItemProp: TrackItemProps = {
            index: index+1,
            imageUrl: currentItem.image,
            name: currentItem.name,
            onClick: () => navigateToTrack(currentItem.mbid)
        }
        return trackItemProp;
    })         
    return {
        trackItemProps: visitedItemsProps,
        title: `Resultados`
    };
}
export { History };
export type { HistoryItem };