import "./Header.css"
import SearchBar from "../SearchBar/SearchBar";
interface HeaderProps{
    navItems: Array<string>;
}
import { useNavigate } from 'react-router-dom';
function Header({navItems}: HeaderProps) {

    const navigate = useNavigate();    
  return (
    <>
        <header className="header">
            <nav className="header-nav">
                <img alt="Company Logo" src="src\assets\logoWhite.png" loading="lazy" className="navbar-image1" />
                <SearchBar></SearchBar>
                <ul className="header-nav-list">
                    { navItems.map((item: string, index: number) => 
                    <li className="header-nav-list-item" key={index}>
                        {item}
                    </li>)}              
                </ul>
            </nav>
        </header>
    </>
  )
}

export { Header };
export type { HeaderProps };
