import "./Footer.css";
import React from "react";
import { Link } from "react-router-dom";

type FooterProps = {
  columnTitle?: string;
  copyright?: string;
};

const Footer: React.FC<FooterProps> = ({
  columnTitle = "Explore",
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
                <Link to="/index">Éxitos</Link>
                <Link to="/history">Historial</Link>
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
