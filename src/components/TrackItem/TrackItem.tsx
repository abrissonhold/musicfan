import { useEffect, useState } from "react";
import "./TrackItem.css";
import { addToFavorites, isFavorite } from "../../helpers/helper";

interface TrackItemProps {
    index: number;
    imageUrl: string;
    name: string;
    listeners?: string;
    onClick: () => void;
    showListeners?: boolean;
    showFavoriteButton?: boolean;
    trackMbid?: string;
}

function TrackItem({index, imageUrl, name, listeners, onClick, showListeners = true, showFavoriteButton = true, trackMbid}: TrackItemProps) {
    const [isFav, setIsFav] = useState<boolean>(false);

    useEffect(() => {
        if (trackMbid) {
            setIsFav(isFavorite(trackMbid));
        }
    }, [trackMbid]);

    useEffect(() => {
        const handleFavoritesUpdate = () => {
            if (trackMbid) {
                setIsFav(isFavorite(trackMbid));
            }
        };

        window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
        return () =>
            window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    }, [trackMbid]);

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!trackMbid || trackMbid.trim() === "") {
            console.warn("Cannot add track to favorites: no valid MBID");
            return;
        }

        setIsFav(addToFavorites(trackMbid));
    };

    return (
        <div className="track-item" onClick={onClick}>
            <p className="track-item-index">{index}</p>
            <div className="track-item-data">
                <img src={imageUrl} alt="" className="track-item-image" />
                <p className="track-item-name">{name}</p>
            </div>        
            {showListeners && listeners && (
                <p className="track-item-listeners">{listeners}</p>
            )}

            {showFavoriteButton && (
                <div className="track-item-favorite">
                    <img
                        className="track-item-favorite-image"
                        src={isFav ? "src/assets/fav.png" : "src/assets/noFav.png"}
                        alt={isFav ? "Remove from favorites" : "Add to favorites"}
                        onClick={handleFavoriteToggle}
                        title={
                            isFav
                                ? `Quitar "${name}" de favoritos`
                                : `Agregar "${name}" a favoritos`
                        }
                    />
                </div>
            )}
        </div>
    );
}

export { TrackItem };
export type { TrackItemProps };
