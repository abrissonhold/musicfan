import "./TrackItem.css"
interface TrackItemProps{
    index: number;
    imageUrl: string;
    name: string;
    listeners: string;
    onClick: () => void;
}
function TrackItem({index, imageUrl, name, listeners, onClick}: TrackItemProps){
    return (
        <>
        <div className="track-item" onClick={onClick}>
            <p className="track-item-index">{index}</p>
            <img src={imageUrl} alt="" className="track-item-image" />
            <p className="track-item-name">{name}</p>
            <p className="track-item-listeners">{listeners}</p>
        </div>
        </>
    )
}
export {TrackItem};
export type {TrackItemProps};