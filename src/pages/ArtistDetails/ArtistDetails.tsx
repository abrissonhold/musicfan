import "./ArtistDetails.css"
import { Header } from "../../components/Header/Header";
import { BannerArtist } from "../../components/BannerArtist/BannerArtist";
import { Footer } from "../../components/Footer/Footer";
import { Tracklist } from "../../components/Tracklist/Tracklist";
import { SimilarGallery } from "../../components/SimilarGallery/SimilarGallery";
function ArtistDetails(){
    return(
        <>
            <Header></Header>
            <BannerArtist></BannerArtist>
            <section className="artist-description">
                <p className="artist-description-text"></p>
            </section>
            <Tracklist></Tracklist>
            <SimilarGallery></SimilarGallery>
            <Footer></Footer>
        </>
    )
}
export {ArtistDetails};