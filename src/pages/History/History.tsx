import { useEffect, useState } from "react";
import "./History.css"
import { getAlbumInfo, getArtistInfo, getTrackInfo } from "../../helpers/apiCalls";
interface HistoryItem {
    name: string;
    image: string;
    mbid: string;
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
                            mbid: retrievedArtist.mbid
                        }
                        historyItems.push(mappedHistoryItemArtist);
                        break;
                    case "album":
                        const retrievedAlbum = await getAlbumInfo(currentItem.mbid);
                        const mappedHistoryItemAlbum: HistoryItem = {
                            name: retrievedAlbum.name,
                            image: retrievedAlbum.image,
                            mbid: retrievedAlbum.mbid
                        }
                        historyItems.push(mappedHistoryItemAlbum);
                        break;
                    case "track":
                        const retrievedTrack = await getTrackInfo(currentItem.mbid);
                        const mappedHistoryItemTrack: HistoryItem = {
                            name: retrievedTrack.name,
                            image: retrievedTrack.image,
                            mbid: retrievedTrack.mbid
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
    return (
        <>
            <div className="history">
            
            </div>
        </>
    )
}
export { History };
export type {ReferenceItem};