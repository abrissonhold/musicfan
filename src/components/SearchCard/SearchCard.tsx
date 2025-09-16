import "./SearchCard.css";

interface SearchCardProps {
    imageUrl: string;
    artistName: string | undefined;
    songName: string;
    listenersAmount: string | undefined;
    onClick?: () => void; // Nueva prop opcional para manejar clicks
}

function SearchCard({ imageUrl, artistName, songName, listenersAmount, onClick }: SearchCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div 
            className={`search-card ${onClick ? 'search-card-clickable' : ''}`}
            onClick={handleClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            } : undefined}
        >
            <div className="search-card-image-container">
                <img 
                    src={imageUrl} 
                    alt={`${songName} ${artistName ? `by ${artistName}` : ''}`}
                    className="search-card-image"
                />
                {onClick && (
                    <div className="search-card-overlay">
                        <span className="search-card-play-button">▶</span>
                    </div>
                )}
            </div>
            <div className="search-card-info">
                <h3 className="search-card-title">{songName}</h3>
                {artistName && (
                    <p className="search-card-artist">{artistName}</p>
                )}
                {listenersAmount && (
                    <p className="search-card-listeners">{listenersAmount}</p>
                )}
            </div>
        </div>
    );
}

export { SearchCard };
export type { SearchCardProps };