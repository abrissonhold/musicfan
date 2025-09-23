import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./ShareModal.css";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
}

function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [pbody, setpbody] = useState("");

  const pageUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  const pageTitle =
    title ?? (typeof document !== "undefined" ? document.title : "Share");

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sendEmail = () => {
    if (!email) {
      return;
    }
    const subject = encodeURIComponent(`Check this page: ${pageTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI wanted to share this page with you:\n${pageUrl} ${pbody}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return createPortal(
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__actions">        
          <h2 id="share-modal-title" className="modal__title">
          {pageTitle}
        </h2>
        </div>
        <div className="modal-email">
          <div>
            <input
              type="email"
              placeholder="Enter email address"
              className="modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="body"
              placeholder="Enter body text"
              className="modal__input"
              value={pbody}
              onChange={(e) => setpbody(e.target.value)}
            />          
            <button className="button" onClick={sendEmail}>
            Send Email
          </button>
          </div>
        </div>


      </div>
    </div>,
    document.body
  );
};

export { ShareModal }