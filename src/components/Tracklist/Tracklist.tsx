import "./Tracklist.css"
import { TrackItem, type TrackItemProps } from "../TrackItem/TrackItem";
interface TrackListProps{
    trackItemProps: Array<TrackItemProps>;
    title: string;
}
function Tracklist({trackItemProps, title}: TrackListProps){
    return (
        <>
            <section className="tracklist">
                <div className="tracklist-header">
                    <p className="tracklist-header-title">{title}</p>                    
                </div>
                <div className="tracklist-body">
                    {trackItemProps.map((item: TrackItemProps, index: number) => <TrackItem {...item} key={index}></TrackItem>)}
                </div>
            </section>
        </>
    )
}
export {Tracklist};