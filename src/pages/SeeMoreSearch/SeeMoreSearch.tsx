import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { PlaylistMenu, type PlaylistProps } from "../../components/PlaylistMenu/PlaylistMenu";
import { Tracklist, type TrackListProps } from "../../components/Tracklist/Tracklist";
import "./SeeMoreSearch.css";
import { useEffect, useState } from "react";
import { getAlbumSearch, getArtistSearch, getTrackSearch, type Album, type Artist, type ArtistSearch, type Track } from "../../helpers/apiCalls";
import type { TrackItemProps } from "../../components/TrackItem/TrackItem";
import { defaultImage } from "../../helpers/constants";

interface ResultItem {
    name: string;
    mbid: string;
    image: string;
    playcount: string;
}

function SeeMoreSearch(){
    const [items, setItems] = useState<Array<ResultItem>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const type = searchParams.get("type");
    const navigate = useNavigate();
    const PageSize = 10;
    
    const navigateToArtist = (mbid: string) => {
        navigate(`/artist?q=${mbid}`);
    };
    const navigateToTrack = (mbid: string) => {
        navigate(`/track?q=${mbid}`);
    };

    const navigateToAlbum = (mbid: string) => {
        navigate(`/album?q=${mbid}`);
    };    

    useEffect(() => {
        const fetchItems = async () => {
            switch(type){
                case "artist":
                    const artists = await getArtistSearch(query ? query : '');
                    const mappedArtists = artists.map((currentArtist: ArtistSearch) => {
                        const mappedArtist: ResultItem = {
                            name: currentArtist.name,
                            mbid: currentArtist.mbid,
                            image: currentArtist.image,
                            playcount: currentArtist.listeners
                        };
                        return mappedArtist; 
                    })
                    setItems(mappedArtists);
                    break;
                case "album":
                    const albums = await getAlbumSearch(query ? query : '');
                    const mappedAlbums = albums.map((currentAlbum: Album) => {
                        const mappedAlbum: ResultItem = {
                            name: currentAlbum.name,
                            mbid: currentAlbum.mbid,
                            image: currentAlbum.image,
                            playcount: currentAlbum.playcount
                        };
                        return mappedAlbum; 
                    })
                    setItems(mappedAlbums);
                    break;
                case "track":
                    const tracks = await getTrackSearch(query ? query : '');
                    const mappedTracks = tracks.map((currentTrack: Track) => {
                        const mappedTrack: ResultItem = {
                            name: currentTrack.name,
                            mbid: currentTrack.mbid,
                            image: currentTrack.image,
                            playcount: currentTrack.playcount
                        };
                        return mappedTrack; 
                    })
                    setItems(mappedTracks);
                    break;
            }
        };
        fetchItems();
    },[query]);
    console.log(`Current Query: ${query}`)
    console.log(`Current Type: ${type}`)
    if(items.length != 0){
        console.log(`Current Items: ${items[0].name}`)        
    }
    const playlist = localStorage.getItem("favorites") != null ? localStorage.getItem("favorites") : JSON.stringify({tracks: ['Empty']});
    const parsedPlaylist = JSON.parse(playlist as string);        
    const playlistMenuProps: PlaylistProps = {
        tracks: parsedPlaylist
    }
    let itemListProps: TrackListProps = {
        trackItemProps: [],
        title: ""
    };
    let startIndex = (currentPage - 1) * PageSize;
    let slicedItems;
    switch(type){
        case "artist":
            slicedItems = items.slice(startIndex, startIndex + PageSize);
            itemListProps = getTracklistProps(slicedItems, navigateToArtist, startIndex);            
            break;
        case "album":
            slicedItems = items.slice(startIndex, startIndex + PageSize);
            itemListProps = getTracklistProps(slicedItems, navigateToAlbum, startIndex);
            break;
        case "track":
            slicedItems = items.slice(startIndex, startIndex + PageSize);
            itemListProps = getTracklistProps(slicedItems, navigateToTrack, startIndex);
            break;
    }
    
    return (
        <>
            <div className="search">
                <Header></Header>
                <div className="gridded-content">
                    <PlaylistMenu {...playlistMenuProps}></PlaylistMenu>
                    <div className="main-content">
                        <Tracklist {...itemListProps}></Tracklist>
                        <div className="pagination">
                            {(items.length > (currentPage * PageSize)) ? <button onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>: ''}
                            {currentPage > 1 ? <button onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button> : ''}                                                   
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function getTracklistProps(items: Array<ResultItem>, navigate: (mbid: string) => void, startIndex: number): TrackListProps {    

    const listItemProps: Array<TrackItemProps> = items.map((currentItem: ResultItem, index: number) => ({
        index: startIndex + index + 1,
        imageUrl: currentItem.image,
        name: currentItem.name,
        listeners: currentItem.playcount, 
        onClick: () => navigate(currentItem.mbid)
    }));
    
    return {
        trackItemProps: listItemProps,
        title: `Resultados`
    };
}

export {SeeMoreSearch};