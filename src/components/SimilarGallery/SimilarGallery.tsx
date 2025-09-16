import "./SimilarGallery.css";
import { SearchCard, type SearchCardProps } from "../SearchCard/SearchCard";
interface SimilarGalleryProps{
    similarCardProps: Array<SearchCardProps>;
    title: string;
}
function SimilarGallery({similarCardProps, title}: SimilarGalleryProps){
    return (
        <>
            <section className="similar-gallery">
                <div className="similar-gallery-header">
                    <p className="similar-gallery-header-title">{title}</p>
                </div>
                <div className="similar-gallery-body">
                    {similarCardProps.map((item: SearchCardProps, index: number) => <SearchCard {...item} key={index}></SearchCard>)}
                </div>
            </section>
        </>
    )
}
export {SimilarGallery};
export type {SimilarGalleryProps};