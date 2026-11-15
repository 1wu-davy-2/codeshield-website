import { useEffect, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useReveal } from "../lib/hooks.js";
import EncryptionLab from "./EncryptionLab.jsx";
import { Icon } from "./ui.jsx";

export default function LabPage({ initialProduct = "python", onCopy }) {
  const { t, mailto } = useI18n();
  const [product, setProduct] = useState(initialProduct);
  useReveal();

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  return (
    <main id="main" className="lab-page">
      <section className="lab-page-head">
        <div className="container">
          <a className="lab-back-link" href="#top">
            <Icon name="arrow-right" className="icon icon-xs" />
            {t("labPage.back")}
          </a>
          <div className="lab-page-head-grid">
            <div className="lab-page-copy reveal">
              <span className="eyebrow"><i aria-hidden="true" />{t("labPage.eyebrow")}</span>
              <h1>{t("labPage.title")}</h1>
              <p>{t("labPage.lead")}</p>
              <div className="lab-page-chips">
                <span><Icon name="cloud-off" className="icon icon-xs" />{t("labPage.local")}</span>
                <span><Icon name="layers" className="icon icon-xs" />{t("labPage.formats")}</span>
              </div>
            </div>
            <div className="lab-page-aside reveal" style={{ "--d": ".08s" }}>
              <span className="lab-page-aside-label">PROTECTION LAB / 02</span>
              <div className="lab-page-aside-row"><span>PYTHON</span><b>PYSHIELD</b></div>
              <div className="lab-page-aside-row"><span>JAVA</span><b>JAVASHIELD</b></div>
              <div className="lab-page-aside-row"><span>OUTPUT</span><b>LOCAL ONLY</b></div>
            </div>
          </div>
        </div>
      </section>

      <EncryptionLab
        activeProduct={product}
        setActiveProduct={setProduct}
        onCopy={onCopy}
        standalone
      />

      <footer className="lab-page-footer">
        <div className="container">
          <span>{t("labPage.footerNote")}</span>
          <div>
            <a href="#top">{t("labPage.back")}</a>
            <a href={mailto("demo")}>{t("labPage.contact")}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
