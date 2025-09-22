import { useEffect, useState } from "react";
import "./SearchCard.css";
import { addToFavorites, isFavorite } from "../../helpers/helper";

type CardType = "artist" | "album" | "track";

interface SearchCardProps {
  type: CardType;
  imageUrl: string;
  title: string;
  subtitle?: string;
  listenersAmount?: string | null;
  mbid: string;
  onClick?: () => void;
}

function SearchCard({ type, imageUrl, title, subtitle, listenersAmount, mbid, onClick }: SearchCardProps) {
  const [isFav, setIsFav] = useState<boolean>(false);

  useEffect(() => {
    setIsFav(isFavorite(mbid));
    
    const handleFavoritesUpdate = (event: CustomEvent) => {
      setIsFav(isFavorite(mbid));
    };
    
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate as EventListener);
    return () => window.removeEventListener("favoritesUpdated", handleFavoritesUpdate as EventListener);
  }, [mbid]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!mbid || mbid.trim() === '') {
      console.warn('Cannot toggle favorite: no valid MBID');
      return;
    }
    const newFavState = addToFavorites(mbid);
    setIsFav(newFavState);
    
    console.log(`Track "${title}" ${newFavState ? 'added to' : 'removed from'} favorites`);
  };

  return (
    <div className="search-card">
      <img
        className="search-card-image"
        src={imageUrl}
        alt={title}
        onClick={onClick}
      />
      <div className="search-card-description">
        <div className="search-card-description-box">
          <p className="search-card-title">{title}</p>
          {(type === "album" || type === "track") && subtitle && (
            <p className="search-card-subtitle">{subtitle}</p>
          )}
          {type === "artist" && listenersAmount && (
            <p className="search-card-listeners">
              {listenersAmount} oyentes
            </p>
          )}
        </div>

        {type === "track" && (
          <div className="search-card-description-favorites">
            <img
              className="search-card-description-favorites-image"
              src={isFav ? "src/assets/fav.png" : "src/assets/noFav.png"}
              alt={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
              title={isFav ? `Quitar "${title}" de favoritos` : `Agregar "${title}" a favoritos`}
              onClick={handleFavoriteToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { SearchCard };
export type { SearchCardProps };