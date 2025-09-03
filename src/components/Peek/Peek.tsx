import "./Peek.css"
interface PeekProps{
  imageUrl: string;
  title: string;
  description: string;
}
function Peek({imageUrl, title, description}: PeekProps) {

  return (
    <>
        <div className="peek">
            <img className="peek-image" src={imageUrl} alt="" />
            <div className="peek-description">
                <p className="peek-description-title">{title}</p>
                <p className="peek-description-description">{description}</p>
            </div>
        </div>
    </>
  )
}

export { Peek };
export type { PeekProps };
