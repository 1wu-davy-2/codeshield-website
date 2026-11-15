import { useCallback, useEffect, useRef, useState } from "react";
import { I18nProvider, useI18n } from "./i18n/index.jsx";
import { copyToClipboard, useReveal } from "./lib/hooks.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import {
  Architecture,
  Capabilities,
  Compare,
  ExecutionFlow,
  How,
  OperationUI,
  Product,
  Proof,
  Security
} from "./components/Sections.jsx";
import { FAQ, FinalCTA, Pricing } from "./components/Pricing.jsx";
import { BackToTop, Footer, LegalDialog, Toast } from "./components/Footer.jsx";

function Site() {
  const { t } = useI18n();
  useReveal();
  const [legal, setLegal] = useState(null);
  const [toast, setToast] = useState("");
  const [activeProduct, setActiveProduct] = useState("python");
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);

  const onCopy = useCallback(
    async (text, isEmail) => {
      await copyToClipboard(text);
      showToast(t(isEmail ? "toast.emailCopied" : "toast.copied"));
    },
    [showToast, t]
  );

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        {t("a11y.skip")}
      </a>
      <Header />
      <main id="main">
        <Hero onCopy={onCopy} />
        <Proof />
        <Product onCopy={onCopy} activeProduct={activeProduct} setActiveProduct={setActiveProduct} />
        <ExecutionFlow activeProduct={activeProduct} setActiveProduct={setActiveProduct} />
        <OperationUI setActiveProduct={setActiveProduct} />
        <Capabilities />
        <How />
        <Architecture />
        <Security />
        <Compare />
        <Pricing />
        <FAQ />
        <FinalCTA onCopy={onCopy} />
      </main>
      <Footer onCopy={onCopy} onSoon={() => showToast(t("toast.soon"))} onLegal={setLegal} />
      <BackToTop />
      <LegalDialog legal={legal} onClose={() => setLegal(null)} />
      <Toast message={toast} />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Site />
    </I18nProvider>
  );
}
