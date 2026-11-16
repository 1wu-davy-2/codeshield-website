import { useEffect, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { GITHUB_RELEASES } from "../lib/links.js";
import UpgradeDialog from "./UpgradeDialog.jsx";
import { Icon, SectionHead } from "./ui.jsx";

const EDITIONS = [
  {
    id: "trial",
    key: "pricing.trial",
    cta: "trial",
    ctaClass: "btn btn-outline btn-block",
    features: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "pro",
    key: "pricing.pro",
    cta: "pro",
    ctaClass: "btn btn-primary btn-block",
    features: [1, 2, 3, 4, 5, 6, 7, 8],
    featured: true
  },
  {
    id: "ent",
    key: "pricing.ent",
    cta: "enterprise",
    ctaClass: "btn btn-outline btn-block",
    features: [1, 2, 3, 4, 5, 6, 7, 8]
  }
];

export function Pricing() {
  const { t, mailto } = useI18n();
  const [upgradeEdition, setUpgradeEdition] = useState(null);

  // Arriving via the "start trial" CTAs lands on #pricing — flag the trial card briefly.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let timer = null;
    const flag = () => {
      if (window.location.hash !== "#pricing") return;
      const card = document.getElementById("pricing")?.querySelector(".price-card");
      if (!card) return;
      card.classList.remove("is-flash");
      void card.offsetWidth;
      card.classList.add("is-flash");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => card.classList.remove("is-flash"), 1500);
    };
    flag();
    window.addEventListener("hashchange", flag);
    return () => {
      window.removeEventListener("hashchange", flag);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <SectionHead
          eyebrow={t("pricing.eyebrow")}
          title={t("pricing.title")}
          lead={t("pricing.lead")}
          center
        />

        <div className="pricing-grid">
          {EDITIONS.map((edition, index) => (
            <article
              className={`price-card${edition.featured ? " featured" : ""} reveal`}
              key={edition.id}
              style={{ "--d": `${index * 0.06}s` }}
            >
              <div className="price-head">
                <h3>{t(`${edition.key}.name`)}</h3>
                <span className={`price-tag${edition.featured ? " popular" : ""}`}>{t(`${edition.key}.tag`)}</span>
              </div>
              <div className="price">
                <span className="amount">{t(`${edition.key}.price`)}</span>
                <span className="period">{t(`${edition.key}.period`)}</span>
              </div>
              <p className="price-desc">{t(`${edition.key}.desc`)}</p>
              {edition.id === "trial" ? (
                <>
                  <a className={edition.ctaClass} href="#/download">
                    <Icon name="box" className="icon icon-sm" />
                    {t(`${edition.key}.cta`)}
                  </a>
                  <a className="price-cta-note" href={GITHUB_RELEASES} target="_blank" rel="noreferrer">
                    {t(`${edition.key}.otherPlatforms`)}
                    <Icon name="arrow-up-right" className="icon icon-xs" />
                  </a>
                </>
              ) : (
                <button
                  className={edition.ctaClass}
                  type="button"
                  onClick={() => setUpgradeEdition(edition.id === "pro" ? "pro" : "enterprise")}
                >
                  {t(`${edition.key}.cta`)}
                </button>
              )}
              <ul className="price-features">
                {edition.features.map((feature) => {
                  const isMuted = edition.id === "trial" && feature === 6;
                  return (
                    <li className={isMuted ? "muted" : undefined} key={feature}>
                      <Icon name={isMuted ? "minus" : "check"} className="icon icon-sm" />
                      <span>{t(`${edition.key}.f${feature}`)}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <p className="pricing-note reveal">{t("pricing.note")}</p>
        <div className="guarantees reveal">
          {["pricing.guarantee1", "pricing.guarantee2", "pricing.guarantee3"].map((key) => (
            <span key={key}>
              <Icon name="check" className="icon icon-xs" />
              <span>{t(key)}</span>
            </span>
          ))}
        </div>
      </div>
      {upgradeEdition ? (
        <UpgradeDialog edition={upgradeEdition} onClose={() => setUpgradeEdition(null)} />
      ) : null}
    </section>
  );
}

const FAQS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];

export function FAQ() {
  const { t } = useI18n();
  return (
    <section className="section" id="faq">
      <div className="container">
        <SectionHead eyebrow={t("faq.eyebrow")} title={t("faq.title")} center />
        <div className="faq-list">
          {FAQS.map((key) => (
            <details className="faq-item reveal" key={key}>
              <summary>
                <span>{t(`faq.${key}`)}</span>
                <span className="faq-icon" aria-hidden="true">
                  <Icon name="plus" className="icon icon-sm" />
                </span>
              </summary>
              <div className="faq-a">
                <p>{t(`faq.a${key.slice(1)}`)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA({ onCopy }) {
  const { t, mailto } = useI18n();
  return (
    <section className="final-cta">
      <div className="container">
        <div className="cta-panel reveal">
          <div className="cta-glow cta-glow-a" aria-hidden="true" />
          <div className="cta-glow cta-glow-b" aria-hidden="true" />
          <div className="cta-grid" aria-hidden="true" />
          <div className="cta-content">
            <span className="badge badge-on-dark">
              <Icon name="sparkle" className="icon icon-xs" />
              <span>CodeShield</span>
            </span>
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.lead")}</p>
            <div className="cta-actions">
              <a className="btn btn-white btn-lg" href="#pricing">
                <span>{t("cta.primary")}</span>
                <Icon name="arrow-right" className="icon icon-sm" />
              </a>
              <a className="btn btn-ghost-light btn-lg" href={mailto("demo")}>
                {t("cta.secondary")}
              </a>
            </div>
            <button className="email-chip" type="button" onClick={() => onCopy("hello@codeshield.dev", true)}>
              <Icon name="mail" className="icon icon-sm" />
              <span>hello@codeshield.dev</span>
              <Icon name="copy" className="icon icon-xs" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
