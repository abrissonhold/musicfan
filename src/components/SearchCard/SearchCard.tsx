import "./SearchCard.css";

type CardType = "artist" | "album" | "track";

interface SearchCardProps {
  type: CardType;
  imageUrl: string;
  title: string;     
  subtitle?: string;   
  listenersAmount?: string | null;
  onClick?: () => void;
}

function SearchCard({ type, imageUrl, title, subtitle, listenersAmount, onClick }: SearchCardProps) {
  return (
    <div className="search-card" onClick={onClick}>
      <img className="search-card-image" src={imageUrl} alt={title} />
      <div className="search-card-description">
        {/* Título principal: depende del tipo */}
        <p className="search-card-title">{title}</p>

        {/* Subtítulo solo para album o track */}
        {(type === "album" || type === "track") && subtitle && (
          <p className="search-card-subtitle">{subtitle}</p>
        )}

        {/* Listeners solo para artista */}
        {type === "artist" && listenersAmount && (
          <p className="search-card-listeners">
            {listenersAmount} oyentes
          </p>
        )}
      </div>
    </div>
  );
}

export { SearchCard };
export type { SearchCardProps };