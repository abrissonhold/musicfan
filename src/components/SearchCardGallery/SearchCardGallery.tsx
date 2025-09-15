import { SearchCard, type SearchCardProps } from "../SearchCard/SearchCard";
import "./SeatchCardGallery.css"
interface SearchGalleryProps{
    searchCardPropsArray: Array<SearchCardProps>;
    galleryTitle: string;
}
function SearchCardGallery({searchCardPropsArray, galleryTitle}: SearchGalleryProps) {

  return (
    <>
        <section className="card-search-gallery">
            <div className="card-search-gallery-header">
                <p className="card-search-gallery-header-title">{galleryTitle}</p>
            </div>
            <div className="card-search-gallery-body">
                {searchCardPropsArray.map((item: SearchCardProps, index: number) => <SearchCard {...item} key={index}></SearchCard>)}
            </div>
        </section>
    </>
  )
}

export { SearchCardGallery };    export type { SearchGalleryProps };

