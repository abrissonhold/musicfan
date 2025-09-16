import "./Header.css"
import SearchBar from "../SearchBar/SearchBar";
function Header() {

  return (
    <>
        <header className="header">
            <nav className="header-nav">
                <img alt="Company Logo" src="src\assets\logoWhite.png" loading="lazy" className="navbar-image1" />
                <SearchBar></SearchBar>
                <ul className="header-nav-list">
                    <li className="header-nav-list-item">Exitos</li>
                    <li className="header-nav-list-item">Tus favoritos</li>
                    <li className="header-nav-list-item">Artistas destacados</li>
                    {/* { navItems.map((item: string, index: number) => 
                    <li className="header-nav-list-item" key={index}>
                        {item}
                    </li>)}               */}
                </ul>
            </nav>
        </header>
    </>
  )
}

export { Header };
