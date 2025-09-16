import "./BannerArtist.css"
interface BannerArtistProps{
    imageUrl: string;
    name: string;
    listeners: string;
}
function BannerArtist({imageUrl, name, listeners}: BannerArtistProps){
    return (
        <>
            <section className="banner-artist" style={{backgroundImage: imageUrl ? `url(${imageUrl})` : "none"}}>
                <h1 className="banner-artist-name">{name}</h1>
                <div className="banner-artist-body">
                    <p className="banner-artist-body-listeners">{listeners}</p>
                </div>
            </section>
        </>
    )
};

export {BannerArtist};
export type {BannerArtistProps};

