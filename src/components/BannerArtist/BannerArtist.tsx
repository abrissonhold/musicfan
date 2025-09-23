import { useState } from "react";
import { ShareModal } from "../ShareModal/ShareModal";
import "./BannerArtist.css"
interface BannerArtistProps {
    imageUrl: string;
    name: string;
    listeners: string;
}
function BannerArtist({ imageUrl, name, listeners }: BannerArtistProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <section className="banner-artist" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}>
                <div className="banner-artist-body">
                    <div className="basic-banner-header">
                        <p className="basic-banner-header-name">{name}</p>
                    </div>
                    <p className="banner-artist-body-listeners">{listeners} oyentes</p>
                    <div className="banner-artist-actions">
                        <button
                            className="basic-banner-share-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                            title={`Compartir "${name}"`}
                        >   Compartir
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
};

export { BannerArtist };
export type { BannerArtistProps };

