import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Icon } from "./ui.jsx";

export function Footer({ onCopy, onSoon, onLegal }) {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="CodeShield">
            <span className="brand-mark">
              <Icon name="logo" />
            </span>
            <span className="brand-name">
              Code<span>Shield</span>
            </span>
          </a>
          <p>{t("footer.tagline")}</p>
          <button className="email-link" type="button" onClick={() => onCopy("hello@codeshield.dev", true)}>
            <Icon name="mail" className="icon icon-sm" />
            <span>hello@codeshield.dev</span>
          </button>
        </div>

        <div className="footer-col">
          <h4>{t("footer.product")}</h4>
          <a href="#capabilities">{t("footer.product1")}</a>
          <a href="#/lab">{t("footer.product2")}</a>
          <a href="#security">{t("footer.product3")}</a>
          <a href="#pricing">{t("footer.product4")}</a>
        </div>

        <div className="footer-col">
          <h4>{t("footer.resources")}</h4>
          <a href="#faq">{t("footer.resources1")}</a>
          <a href="#/docs">{t("footer.resources2")}</a>
          <button type="button" className="footer-link" onClick={onSoon}>
            {t("footer.resources3")}
          </button>
          <button type="button" className="footer-link" onClick={onSoon}>
            {t("footer.resources4")}
          </button>
        </div>

        <div className="footer-col">
          <h4>{t("footer.company")}</h4>
          <a href="#/contact">{t("footer.company1")}</a>
          <button type="button" className="footer-link" onClick={() => onLegal("privacy")}>
            {t("footer.company2")}
          </button>
          <button type="button" className="footer-link" onClick={() => onLegal("eula")}>
            {t("footer.company3")}
          </button>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {year} CodeShield. {t("footer.rights")}
        </span>
        <span className="footer-langs">简体中文 · English · 日本語 · 한국어</span>
        <span className="footer-made">{t("footer.made")}</span>
      </div>
    </footer>
  );
}

export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 620);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      className={`to-top${visible ? " is-visible" : ""}`}
      id="toTop"
      type="button"
      aria-label={t("common.backToTop")}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        })
      }
    >
      <Icon name="arrow-up" />
    </button>
  );
}

export function LegalDialog({ legal, onClose }) {
  const { t, dict } = useI18n();
  const dialogRef = useRef(null);
  const data = legal ? dict.legal?.[legal] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (legal && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    } else if (!legal && dialog.open) {
      dialog.close();
    }
  }, [legal]);

  return (
    <dialog
      className="legal-dialog"
      id="legalDialog"
      aria-labelledby="legalTitle"
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <h3 id="legalTitle">{data?.title || t("legal.privacy.title")}</h3>
        <button className="icon-btn" type="button" aria-label={t("common.close")} onClick={onClose}>
          <Icon name="x" className="icon icon-sm" />
        </button>
      </div>
      <div
        className="dialog-body"
        id="legalBody"
        dangerouslySetInnerHTML={{ __html: data?.body || dict.legal?.privacy?.body || "" }}
      />
      <div className="dialog-foot">
        <button className="btn btn-outline btn-sm" type="button" onClick={onClose}>
          {t("common.close")}
        </button>
      </div>
    </dialog>
  );
}

export function Toast({ message }) {
  return (
    <div className={`toast${message ? " show" : ""}`} id="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
