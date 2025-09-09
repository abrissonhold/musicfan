import "./Footer.css";
import React from "react";

type FooterProps = {
  columnTitle?: string;
  link1?: string;
  link2?: string;
  link3?: string;
  link4?: string;
  copyright?: string;
};

const Footer: React.FC<FooterProps> = ({
  columnTitle = "Explore",
  link1 = "Éxitos",
  link2 = "Tus Favs",
  link3 = "Géneros",
  link4 = "Artistas",
  copyright = "© 2025 MusicFan. All Rights Reserved."
}) => {
  return (
    <footer className="footer-container">
      <div className="footer-max-width">
        <div className="footer-content">
          <div className="footer-links">
            <div className="footer-column">
              <strong className="footer-column-title">{columnTitle}</strong>
              <div className="footer-column-links">
                <a href="index.html" target="_blank">
                  {link1}
                </a>
                <a href="index.html" target="_blank">
                  {link2}
                </a>
                <a href="index.html" target="_blank">
                  {link3}
                </a>
                <a href="index.html" target="_blank">
                  {link4}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-credits">
          <div className="footer-row">
            <span className="footer-text">{copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };