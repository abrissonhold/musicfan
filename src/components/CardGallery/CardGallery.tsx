import {Card, type CardProps } from "../Card/Card"
import "./CardGallery.css"
interface CardGalleryProps{
    cardPropsArray: Array<CardProps>;
    galleryTitle: string;
    gallerySubtitle: string;
}
function CardGallery({cardPropsArray, galleryTitle, gallerySubtitle}: CardGalleryProps) {

  return (
    <>
        <section className="card-gallery">
            <div className="card-gallery-header">
                <p className="card-gallery-header-title">{galleryTitle}</p>
                <p className="card-gallery-header-subtitle">{gallerySubtitle}</p>
            </div>
            <div className="card-gallery-body">
                {cardPropsArray.map((item: CardProps, index: number) => <Card {...item} key={index}></Card>)}
            </div>
        </section>
    </>
  )
}

export { CardGallery };
export type { CardGalleryProps };
