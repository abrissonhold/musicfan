import "./Header.css"
interface HeaderProps{
    navItems: Array<string>;
}
function Header({navItems}: HeaderProps) {

  return (
    <>
        <header className="header">
            <nav className="header-nav">
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
