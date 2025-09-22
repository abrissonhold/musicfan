import { useEffect, useState } from "react";
import "./SearchCard.css";

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
  const addToFav = (mbid: string) => {
    const playlist = localStorage.getItem("favorites") != null ? localStorage.getItem("favorites") : "";
    const parsedPlaylist: string[] = playlist === "" ? [] : JSON.parse(playlist as string);
    const mbidIndex = parsedPlaylist.findIndex((id: string) => id === mbid);
    if(mbidIndex != -1){
      parsedPlaylist.splice(mbidIndex, 1);
      setIsFav(false);
    }
    else{
      parsedPlaylist.push(mbid);
      setIsFav(true);
    }
    localStorage.setItem("favorites", JSON.stringify(parsedPlaylist));
  }  
  
  useEffect(() => {
    const verifyIsFav = (mbid: string) => {
      const playlist = localStorage.getItem("favorites") != null ? localStorage.getItem("favorites") : "";
      const parsedPlaylist: string[] = playlist === "" ? [] : JSON.parse(playlist as string);
      const mbidIndex = parsedPlaylist.findIndex((id: string) => id === mbid);
      if(mbidIndex != -1){
        setIsFav(true);
      }
      else{
        setIsFav(false);
      }
    }
    verifyIsFav(mbid);
  }, [])
  return (
    <div className="search-card">
      <img className="search-card-image" src={imageUrl} alt={title} onClick={onClick}/>
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
        {( type === "track") && (
            <div className="search-card-description-favorites">
              {isFav ? 
              <img className="search-card-description-favorites-image" src='src\assets\fav.png' alt="" onClick={() => addToFav(mbid)}/> :
              <img className="search-card-description-favorites-image" src='src\assets\noFav.png' alt="" onClick={() => addToFav(mbid)}/>         
              }
            </div>
          )}   
        
      </div>
    </div>
  );
}

export { SearchCard };
export type { SearchCardProps };