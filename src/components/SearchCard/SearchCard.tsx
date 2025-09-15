import "./SearchCard.css"
interface SearchCardProps{
    imageUrl: string;
    artistName: string;
    songName: string;
    listenersAmount: string;
}
function SearchCard({imageUrl, artistName, songName, listenersAmount}: SearchCardProps) {

  return (
    <>
        <div className="search-card">
            <img className="search-card-image" src={imageUrl} alt="" />
            <div className="search-card-description">
                <p className="search-card-description-artist">{artistName}</p>
                <p className="search-card-description-song-name">{songName}</p>
                <p className="search-card-description-listeners-amount">{listenersAmount}</p>
            </div>
        </div>
    </>
  )
}

export { SearchCard };
export type { SearchCardProps };
