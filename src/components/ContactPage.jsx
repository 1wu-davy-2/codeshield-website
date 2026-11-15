import { useEffect } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Icon, SectionHead } from "./ui.jsx";
import { useReveal } from "../lib/hooks.js";
import { CONTACT, EXPERIENCE_SLOTS, SHOT_SLOTS } from "../lib/contact.js";

function assetUrl(path) {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function ContactRow({ label, value, href, emptyLabel, mono = false }) {
  return (
    <li className="contact-row">
      <span className="cr-label">{label}</span>
      {value ? (
        href ? (
          <a className={`cr-value${mono ? " is-mono" : ""}`} href={href}>
            {value}
          </a>
        ) : (
          <span className={`cr-value${mono ? " is-mono" : ""}`}>{value}</span>
        )
      ) : (
        <span className="cr-value is-empty">{emptyLabel}</span>
      )}
    </li>
  );
}

export default function ContactPage() {
  const { t, mailto } = useI18n();
  useReveal();
  const experience = CONTACT.experience || [];
  const shots = CONTACT.shots || [];

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") || "";
    document.title = `${t("contact.metaTitle")} · CodeShield`;
    if (meta) meta.setAttribute("content", t("contact.metaDescription"));
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription) meta.setAttribute("content", previousDescription);
    };
  }, [t]);

  const facts = [
    { label: t("contact.fact1Label"), value: t("contact.fact1Value") },
    { label: t("contact.fact2Label"), value: t("contact.fact2Value") },
    { label: t("contact.fact3Label"), value: t("contact.fact3Value") }
  ];

  return (
    <main className="contact-page" id="main">
      <section className="contact-hero">
        <div className="container contact-grid">
          <div className="contact-intro reveal">
            <span className="eyebrow">
              <i aria-hidden="true" />
              <span>{t("contact.eyebrow")}</span>
            </span>
            <h1>{t("contact.title")}</h1>
            <p className="lead">{t("contact.lead")}</p>

            <ul className="contact-facts">
              {facts.map((fact) => (
                <li key={fact.label}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </li>
              ))}
            </ul>

            <div className="contact-actions">
              <a className="btn btn-primary btn-lg" href={`mailto:${CONTACT.email}`}>
                <span>{t("contact.ctaMail")}</span>
                <Icon name="mail" className="icon icon-sm" />
              </a>
              <a className="btn btn-outline btn-lg" href={mailto("demo")}>
                {t("contact.ctaDemo")}
              </a>
            </div>
          </div>

          <aside className="contact-card reveal">
            <div className="contact-card-head">
              <h2>{t("contact.cardTitle")}</h2>
              <p>{t("contact.cardNote")}</p>
            </div>

            <ul className="contact-rows">
              <ContactRow
                label={t("contact.emailLabel")}
                value={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
                emptyLabel={t("contact.ph")}
                mono
              />
              <ContactRow label={t("contact.wechatLabel")} value={CONTACT.wechat} emptyLabel={t("contact.ph")} mono />
              <ContactRow label={t("contact.phoneLabel")} value={CONTACT.phone} emptyLabel={t("contact.ph")} mono />
              <ContactRow label={t("contact.locationLabel")} value={CONTACT.location} emptyLabel={t("contact.ph")} />
            </ul>

            <div className="contact-qr">
              <div className={`qr-frame${CONTACT.wechatQr ? "" : " is-empty"}`}>
                {CONTACT.wechatQr ? (
                  <img src={assetUrl(CONTACT.wechatQr)} alt={t("contact.qrTitle")} />
                ) : (
                  <>
                    <Icon name="qr" />
                    <span>{t("contact.ph")}</span>
                  </>
                )}
              </div>
              <div className="qr-meta">
                <strong>{t("contact.qrTitle")}</strong>
                <span>{CONTACT.wechatQr ? t("contact.qrReady") : t("contact.qrHint")}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section contact-exp">
        <div className="container">
          <SectionHead
            eyebrow={t("contact.expEyebrow")}
            title={t("contact.expTitle")}
            lead={t("contact.expLead")}
          />
          <ol className="exp-list">
            {(experience.length ? experience : Array.from({ length: EXPERIENCE_SLOTS }, () => null)).map(
              (item, index) =>
                item ? (
                  <li className="exp-item" key={index}>
                    <div className="exp-time">{item.period}</div>
                    <div className="exp-body">
                      <h3>
                        {item.org}
                        {item.role ? <span className="exp-role">{item.role}</span> : null}
                      </h3>
                      {item.points?.length ? (
                        <ul className="exp-points">
                          {item.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{item.summary}</p>
                      )}
                    </div>
                  </li>
                ) : (
                  <li className="exp-item is-empty" key={index}>
                    <div className="exp-time">{t("contact.expHint")}</div>
                    <div className="exp-body">
                      <h3>
                        {t("contact.expSlot")}
                        <span className="ph-tag">{t("contact.ph")}</span>
                      </h3>
                      <p>{t("contact.expFill")}</p>
                    </div>
                  </li>
                )
            )}
          </ol>
        </div>
      </section>

      <section className="section contact-proof">
        <div className="container">
          <SectionHead
            eyebrow={t("contact.shotsEyebrow")}
            title={t("contact.shotsTitle")}
            lead={t("contact.shotsLead")}
          />
          <div className="proof-grid">
            {(shots.length ? shots : Array.from({ length: SHOT_SLOTS }, () => null)).map((shot, index) =>
              shot ? (
                <figure className="proof-shot" key={index}>
                  <img src={assetUrl(shot.src)} alt={shot.caption} loading="lazy" />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ) : (
                <div className="proof-shot is-empty" key={index}>
                  <Icon name="image" />
                  <strong>{t("contact.shotSlot")}</strong>
                  <span>{t("contact.shotHint")}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="contact-end">
        <div className="container">
          <div className="contact-end-inner reveal">
            <div>
              <h2>{t("contact.endTitle")}</h2>
              <p>{t("contact.endLead")}</p>
            </div>
            <a className="btn btn-primary btn-lg" href={`mailto:${CONTACT.email}`}>
              <span>{t("contact.endCta")}</span>
              <Icon name="arrow-right" className="icon icon-sm" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
