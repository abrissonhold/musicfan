import { Peek, type PeekProps } from "../Peek/Peek"
import "./PeekGallery.css"
interface PeekGalleryProps{
  peekPropsArray: Array<PeekProps>;
  upperSubtitle: string;
  title: string;
  lowerSubtitle: string;
}
function PeekGallery({peekPropsArray, upperSubtitle, title, lowerSubtitle}: PeekGalleryProps) {

  return (
    <>
        <section className="peek-gallery">
            <div className="peek-gallery-header">
                <p className="peek-gallery-header-subtitle">{upperSubtitle}</p>
                <p className="peek-gallery-header-title">{title}</p>
                <p className="peek-gallery-header-subtitle">{lowerSubtitle}</p>
            </div>   
            <div className="peek-gallery-body">
              {peekPropsArray.map((item: PeekProps, index: number) => <Peek {...item} key={index}></Peek>)}
            </div>         
        </section>
    </>
  )
}

export {
  PeekGallery
};
export type { PeekGalleryProps };
