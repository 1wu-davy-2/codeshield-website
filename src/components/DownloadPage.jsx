import { useEffect } from "react";
import { useI18n } from "../i18n/index.jsx";
import DOWNLOAD_COPY from "../i18n/download.js";
import { GITHUB_RELEASES, PLATFORM_DOWNLOADS, SHA256SUMS } from "../lib/links.js";
import { useReveal } from "../lib/hooks.js";
import { Icon } from "./ui.jsx";

const PLATFORMS = ["windows", "linux", "macos"];
const PLATFORM_ICONS = { windows: "windows", linux: "terminal", macos: "apple" };

function platformMeta(id) {
  return PLATFORM_DOWNLOADS.find((item) => item.id === id) || null;
}

export default function DownloadPage() {
  const { lang } = useI18n();
  const copy = DOWNLOAD_COPY[lang] || DOWNLOAD_COPY.en;
  useReveal();

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") || "";
    document.title = `${copy.metaTitle} · CodeShield`;
    if (meta) meta.setAttribute("content", copy.metaDescription);
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription) meta.setAttribute("content", previousDescription);
    };
  }, [copy.metaTitle, copy.metaDescription]);

  return (
    <main className="download-page" id="main">
      <section className="download-hero">
        <div className="container">
          <a className="download-back" href="#top">
            <Icon name="arrow-right" className="icon icon-xs" />
            {copy.back}
          </a>
          <span className="download-kicker">{copy.kicker}</span>
          <h1>{copy.title}</h1>
          <p className="download-lead">{copy.lead}</p>
          <ul className="download-facts">
            {copy.facts.map((fact) => (
              <li key={fact}>
                <Icon name="check" className="icon icon-xs" />
                <span>{fact}</span>
              </li>
            ))}
            <li className="is-muted">
              <Icon name="clock" className="icon icon-xs" />
              <span>{copy.snapshot}</span>
            </li>
          </ul>

          <div className="download-grid">
            {PLATFORMS.map((id, index) => {
              const meta = platformMeta(id);
              const text = copy.platforms[id];
              const coming = !meta;
              return (
                <article
                  className={`download-card reveal${coming ? " is-coming" : ""}`}
                  key={id}
                  style={{ "--d": `${index * 0.06}s` }}
                >
                  <span className={`download-icon ${id}`} aria-hidden="true">
                    <Icon name={PLATFORM_ICONS[id]} />
                  </span>
                  <div className="download-card-head">
                    <h2>{text.name}</h2>
                    {coming ? <span className="download-soon">{copy.soon}</span> : null}
                  </div>
                  <span className="download-os">{text.meta}</span>

                  {coming ? (
                    <span className="download-btn is-disabled" aria-disabled="true">
                      <Icon name="clock" className="icon icon-sm" />
                      {text.cta}
                    </span>
                  ) : (
                    <a
                      className="download-btn"
                      href={meta.url}
                      target="_blank"
                      rel="noreferrer"
                      title={`${text.cta} · ${meta.file}`}
                    >
                      <Icon name="box" className="icon icon-sm" />
                      <span>{text.cta}</span>
                    </a>
                  )}

                  <p className="download-note">
                    {meta ? <code>{meta.file}</code> : null}
                    <span>{meta ? `${meta.size} · ${text.note}` : text.note}</span>
                  </p>
                </article>
              );
            })}
          </div>

          <div className="download-verify reveal">
            <span className="download-verify-title">{copy.verifyTitle}</span>
            <a href={SHA256SUMS} target="_blank" rel="noreferrer">
              <Icon name="fingerprint" className="icon icon-xs" />
              {copy.sha}
            </a>
            <a href={GITHUB_RELEASES} target="_blank" rel="noreferrer">
              <Icon name="github" className="icon icon-xs" />
              {copy.releases}
            </a>
            <a href="#/docs/quick-start">
              <Icon name="doc" className="icon icon-xs" />
              {copy.docs}
            </a>
          </div>

          <p className="download-footnote">
            <Icon name="warning" className="icon icon-xs" />
            <span>{copy.note}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
