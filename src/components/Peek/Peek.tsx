import "./Peek.css"

interface PeekProps {
  imageUrl: string;
  title: string;
  description: string;
  onClick?: () => void;
}

function Peek({ imageUrl, title, description, onClick }: PeekProps) {
    return (
    <>
        <div 
            className={`peek ${onClick ? 'peek--clickable' : ''}`}
            onClick={onClick}
        >
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
