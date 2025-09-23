import "./Card.css";
interface CardProps{
    imageUrl: string;
    artistName: string;
    songName: string;
    listenersAmount: string;
    onClick?: () => void; 
}

function Card({imageUrl, artistName, songName, listenersAmount, onClick}: CardProps) {

  return (
    <>
        <div 
            className={`card ${onClick ? 'card--clickable' : ''}`}
            onClick={onClick}
        >
            <img className="card-image" src={imageUrl} alt="" />
            <div className="card-description">
                <p className="card-description-artist">{songName}</p>
                <p className="card-description-song-name">{artistName}</p>
                <p className="card-description-listeners-amount">{listenersAmount}</p>
            </div>
        </div>
    </>
  )
}

export { Card };
export type { CardProps };
