import "./Card.css";
interface CardProps{
    imageUrl: string;
    artistName: string;
    songName: string;
    listenersAmount: string;
}

function Card({imageUrl, artistName, songName, listenersAmount}: CardProps) {

  return (
    <>
        <div className="card">
            <img className="card-image" src={imageUrl} alt="" />
            <div className="card-description">
                <p className="card-description-artist">{artistName}</p>
                <p className="card-description-song-name">{songName}</p>
                <p className="card-description-listeners-amount">{listenersAmount}</p>
            </div>
        </div>
    </>
  )
}

export { Card };
export type { CardProps };
