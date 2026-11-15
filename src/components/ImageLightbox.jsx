import { useEffect, useRef } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Icon } from "./ui.jsx";

/**
 * Full-screen viewer for the workspace screenshots.
 * Uses a native <dialog> so Esc, focus handling and the backdrop are free.
 */
export default function ImageLightbox({ item, onClose }) {
  const { t } = useI18n();
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item) {
      if (!dialog.open) {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        // focus the dialog itself so the close button does not open pre-focused
        dialog.focus?.({ preventScroll: true });
      }
      document.body.classList.add("lightbox-open");
      return;
    }
    if (dialog.open) dialog.close();
    document.body.classList.remove("lightbox-open");
  }, [item]);

  useEffect(() => {
    return () => document.body.classList.remove("lightbox-open");
  }, []);

  return (
    <dialog
      className="lightbox"
      ref={dialogRef}
      tabIndex={-1}
      aria-label={item?.caption || t("ui.zoom")}
      onClose={() => {
        document.body.classList.remove("lightbox-open");
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {item ? (
        <div className="lightbox-inner">
          <figure className="lightbox-figure">
            <img className="lightbox-img" src={item.src} alt={item.alt} />
            <button
              className="lightbox-close"
              type="button"
              aria-label={t("common.close")}
              onClick={onClose}
            >
              <Icon name="x" className="icon icon-sm" />
            </button>
          </figure>
          <div className="lightbox-bar">
            <span className="lightbox-caption">{item.caption}</span>
            <span className="lightbox-actions">
              <span className="lightbox-hint">{t("ui.escHint")}</span>
              <a className="lightbox-original" href={item.src} target="_blank" rel="noreferrer">
                {t("ui.openOriginal")}
                <Icon name="arrow-up-right" className="icon icon-xs" />
              </a>
            </span>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
