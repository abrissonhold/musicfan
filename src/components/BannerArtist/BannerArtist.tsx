import "./BannerArtist.css"
interface BannerArtistProps{
    imageUrl: string;
    title: string;
    listeners: string;
}
function BannerArtist({imageUrl, title, listeners}: BannerArtistProps){
    return (
        <>
            <section className="Banner-artist" style={{backgroundImage: imageUrl ? `url(${imageUrl})` : "none"}}>
                <h1 className="Banner-artist-title">{title}</h1>
                <div className="Banner-artist-body">
                    <p className="Banner-artist-body-listeners">{listeners}</p>
                </div>
            </section>
        </>
    )
};

export {BannerArtist};
export type {BannerArtistProps};

