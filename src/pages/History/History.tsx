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
    type: string;
}
interface ReferenceItem {
    mbid: string;
    type: string;
}
function History(){
    const [visitedItems, setVisitedItems] = useState<HistoryItem[]>([]);
    useEffect(() => {
        const retrieveItems = async () => {
            const referenceItems = localStorage.getItem("history") ? localStorage.getItem("history") : '';
            const parsedReferenceItems: Array<ReferenceItem> = JSON.parse(referenceItems as string);
            const historyItems: Array<HistoryItem> = [];
            for(const currentItem of parsedReferenceItems){
                switch(currentItem.type){
                    case "artist":
                        const retrievedArtist = await getArtistInfo(currentItem.mbid);
                        const mappedHistoryItemArtist: HistoryItem = {
                            name: retrievedArtist.name,
                            image: retrievedArtist.image,
                            mbid: retrievedArtist.mbid,
                            type: 'artist'
                        }
                        historyItems.push(mappedHistoryItemArtist);
                        break;
                    case "album":
                        const retrievedAlbum = await getAlbumInfo(currentItem.mbid);
                        const mappedHistoryItemAlbum: HistoryItem = {
                            name: retrievedAlbum.name,
                            image: retrievedAlbum.image,
                            mbid: retrievedAlbum.mbid,
                            type: 'album'
                        }
                        historyItems.push(mappedHistoryItemAlbum);
                        break;
                    case "track":
                        const retrievedTrack = await getTrackInfo(currentItem.mbid);
                        const mappedHistoryItemTrack: HistoryItem = {
                            name: retrievedTrack.name,
                            image: retrievedTrack.image,
                            mbid: retrievedTrack.mbid,
                            type: 'track'
                        }
                        historyItems.push(mappedHistoryItemTrack);
                        break;
                }
            }
            console.log(historyItems);
            setVisitedItems(historyItems);
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
    const navigateToArtist = (mbid: string) => {
        navigate(`/artist?q=${mbid}`);
    };
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    const navigateToAlbum = (mbid: string) => {
        navigate(`/album?q=${mbid}`);
    };    
    const visitedItemsProps: Array<TrackItemProps> = items.map((currentItem: HistoryItem, index: number) => {
        let navigateCB: (mbid: string) => void;
        switch(currentItem.type){
            case 'artist':
                navigateCB = navigateToArtist;
                break;
            case 'album':
                navigateCB = navigateToAlbum;
                break;
            case 'track':
                navigateCB = navigateToTrack;
                break;
        }
        const trackItemProp: TrackItemProps = {
            index: index,
            imageUrl: currentItem.image,
            name: currentItem.name,
            onClick: () => navigateCB(currentItem.mbid)
        }
        return trackItemProp;
    })   
    
    return {
        trackItemProps: visitedItemsProps,
        title: `Resultados`
    };
}
export { History };
export type {ReferenceItem};