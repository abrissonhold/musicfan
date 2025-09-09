import "./Header.css"
interface HeaderProps{
    navItems: Array<string>;
}
function Header({navItems}: HeaderProps) {

  return (
    <>
        <header className="header">
            <nav className="header-nav">
                <img alt="Company Logo" src="src\assets\logoWhite.png" loading="lazy" className="navbar-image1" />
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
