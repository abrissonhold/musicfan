import "./Footer.css"
interface FooterProps{
  footerItems: Array<string>;
}
function Footer({footerItems}: FooterProps) {

  return (
    <>
        <footer className="footer">
            <ul className="footer-list">
              {footerItems.map((item: string, index: number) => 
                <li className="footer-list-item">
                  {item}
                </li>
              )}                
            </ul>
        </footer>
    </>
  )
}

export { Footer };
export type { FooterProps };
