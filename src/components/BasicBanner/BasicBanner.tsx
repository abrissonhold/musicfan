import "./BasicBanner.css";
interface BasicBannerProps{
    imageUrl: string;
    artist: string;
    name: string;
    listeners: string;
}
function BasicBanner({imageUrl, artist, name, listeners}: BasicBannerProps){
    return (
        <>  
            <section className="basic-banner" style={{backgroundImage: imageUrl ? `url(${imageUrl})` : "none"}}>
                <div className="basic-banner-header">
                    <p className="basic-banner-header-artist">{artist}</p>
                    <p className="basic-banner-header-name">{name}</p>
                </div>
                <div className="basic-banner-body">
                    <p className="basic-banner-body-listeners">{listeners}</p>
                </div>
            </section>
        </>
    )
}
export {BasicBanner};
export type {BasicBannerProps};