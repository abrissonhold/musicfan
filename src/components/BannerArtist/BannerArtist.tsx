import { useState } from "react";
import { ShareModal } from "../ShareModal/ShareModal";
import "./BannerArtist.css"
interface BannerArtistProps{
    imageUrl: string;
    name: string;
    listeners: string;
}
function BannerArtist({imageUrl, name, listeners}: BannerArtistProps){
    const [open, setOpen] = useState(false);
    return (
        <>
            <section className="banner-artist" style={{backgroundImage: imageUrl ? `url(${imageUrl})` : "none"}}>
                <h1 className="banner-artist-name">{name}</h1>
                <div className="banner-artist-body">
                    <p className="banner-artist-body-listeners">{listeners} oyentes</p>
                    <div>
                    <button onClick={() => setOpen(true)}>Share</button>
                        <ShareModal isOpen={open} onClose={() => setOpen(false)}  title={name}/>
                    </div>
                </div>
            </section>
        </>
    )
};

export {BannerArtist};
export type {BannerArtistProps};

