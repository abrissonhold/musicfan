import { SearchCard, type SearchCardProps } from "../SearchCard/SearchCard";
import "./SearchCardGallery.css"
interface SearchGalleryProps {
    searchCardPropsArray: Array<SearchCardProps>;
    galleryTitle: string;
    seeMoreRedirect: () => void;
}
function SearchCardGallery({ searchCardPropsArray, galleryTitle, seeMoreRedirect }: SearchGalleryProps) {

    return (
        <>
            <section className="card-search-gallery">
                <div className="card-search-gallery-header">
                    <p className="card-search-gallery-header-title">{galleryTitle}</p>
                    <button onClick={seeMoreRedirect}>Ver mas</button>
                </div>
                <div className="card-search-gallery-body">
                    {searchCardPropsArray.map((item: SearchCardProps, index: number) => <SearchCard {...item} key={index}></SearchCard>)}
                </div>
            </section>
        </>
    )
}

export { SearchCardGallery }; export type { SearchGalleryProps };

