import { useEffect, useState } from "react";
import "./History.css"
import { Header } from "../../components/Header/Header";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";
import { Tracklist } from "../../components/Tracklist/Tracklist";
import type { TrackItemProps } from "../../components/TrackItem/TrackItem";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../helpers/useIsMobile";

interface HistoryItem {
    name: string;
    image: string;
    mbid: string;
}
function History() {
    const [visitedItems, setVisitedItems] = useState<HistoryItem[]>([]);
    const isMobile = useIsMobile();
    const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);

    const handleTogglePlaylist = () => {
        setIsPlaylistVisible(prev => !prev);
    };

    useEffect(() => {
        const retrieveItems = async () => {
            const referenceItems = localStorage.getItem("history") || '';
            if (referenceItems === '') return;
            const parsedHistoryItems: Array<HistoryItem> = JSON.parse(referenceItems);
            setVisitedItems(parsedHistoryItems);
        }
        retrieveItems();
    }, [])
    const playlist = localStorage.getItem("favorites") || JSON.stringify({ tracks: ['Empty'] });
    const parsedPlaylist = JSON.parse(playlist);

    const playlistMenuProps: PlaylistProps = {
        tracks: parsedPlaylist,
        isVisible: isPlaylistVisible,
        onClose: () => setIsPlaylistVisible(false)
    }
    const itemListProps = getTracklistProps(visitedItems);
    return (
        <>
            <div className="history">
                <Header
                    isMobile={isMobile}
                    isPlaylistVisible={isPlaylistVisible}
                    onTogglePlaylist={handleTogglePlaylist}
                />
                <div className="gridded-content">
                    {!isMobile && <PlaylistMenu {...playlistMenuProps} />}
                    <div className="main-content">
                        <Tracklist {...itemListProps}></Tracklist>
                    </div>
                </div>
            {isMobile && <PlaylistMenu {...playlistMenuProps} />}
            </div>
        </>
    )
}
function getTracklistProps(items: HistoryItem[]) {
    const navigate = useNavigate();
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };
    const visitedItemsProps: Array<TrackItemProps> = items.map((currentItem: HistoryItem, index: number) => {
        const trackItemProp: TrackItemProps = {
            index: index + 1,
            imageUrl: currentItem.image,
            name: currentItem.name,
            onClick: () => navigateToTrack(currentItem.mbid)
        }
        return trackItemProp;
    })
    return {
        trackItemProps: visitedItemsProps,
        title: `Historial`
    };
}
export { History };
export type { HistoryItem };