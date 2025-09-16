import { useState } from "react";
import "./BasicBanner.css";
import { ShareModal } from "../ShareModal/ShareModal";

interface BasicBannerProps{
    imageUrl: string;
    artist: string;
    name: string;
    listeners: string;
    artistMbid?: string; 
    onArtistClick?: () => void; 
}

function BasicBanner({imageUrl, artist, name, listeners, artistMbid, onArtistClick}: BasicBannerProps){
    const [open, setOpen] = useState(false);
    const handleArtistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onArtistClick) {
            onArtistClick();
        }
    };

    return (
        <>  
            <section className="basic-banner" style={{backgroundImage: imageUrl ? `url(${imageUrl})` : "none"}}>
                <div className="basic-banner-header">
                    {onArtistClick ? (
                        <p 
                            className="basic-banner-header-artist basic-banner-header-artist--clickable"
                            onClick={handleArtistClick}
                            title={`Ver perfil de ${artist}`}
                        >
                            {artist}
                        </p>
                    ) : (
                        <p className="basic-banner-header-artist">{artist}</p>
                    )}
                    <p className="basic-banner-header-name">{name}</p>
                </div>
                <div className="basic-banner-body">
                    <p className="basic-banner-body-listeners">{listeners}</p>
                    <div>
                    <button onClick={() => setOpen(true)}>Share</button>
                        <ShareModal isOpen={open} onClose={() => setOpen(false)}  title={name}/>
                    </div>
                </div>
            </section>
        </>
    )
}

export {BasicBanner};
export type {BasicBannerProps};