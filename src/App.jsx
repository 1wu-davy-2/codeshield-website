import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { I18nProvider, useI18n } from "./i18n/index.jsx";
import { copyToClipboard, useReveal } from "./lib/hooks.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import LabPage from "./components/LabPage.jsx";
import { isDocsPage } from "./docs/routes.js";
import {
  Architecture,
  Capabilities,
  Compare,
  OperationUI,
  Product,
  Proof,
  Security
} from "./components/Sections.jsx";
import { FAQ, FinalCTA, Pricing } from "./components/Pricing.jsx";
import { BackToTop, Footer, LegalDialog, Toast } from "./components/Footer.jsx";

// The docs bundle carries eight pages of prose; load it only when requested.
const DocsPage = lazy(() => import("./docs/DocsPage.jsx"));
const ContactPage = lazy(() => import("./components/ContactPage.jsx"));

function getRoute() {
  const hash = window.location.hash || "";
  if (hash.startsWith("#/docs")) {
    // `#/docs`, `#/docs/build`, `#/docs/build#troubleshooting`
    const rest = hash.slice("#/docs".length);
    const [path, anchor = ""] = rest.split("#");
    const pageId = path.replace(/^\/+|\/+$/g, "") || "index";
    return {
      view: "docs",
      product: null,
      pageId: isDocsPage(pageId) ? pageId : "index",
      anchor: anchor ? decodeURIComponent(anchor) : ""
    };
  }
  if (hash.startsWith("#/contact")) {
    return { view: "contact", product: null };
  }
  if (hash.startsWith("#/lab")) {
    const product = hash.split("/")[2] === "java" ? "java" : "python";
    return { view: "lab", product };
  }
  return { view: "site", product: null };
}

function Marketing({ onCopy, onSoon, onLegal }) {
  const { t } = useI18n();
  useReveal();
  const [activeProduct, setActiveProduct] = useState("python");

  useEffect(() => {
    if (!window.location.hash || window.location.hash.startsWith("#/")) return undefined;
    let frame = 0;
    const alignHashTarget = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      const header = document.querySelector(".site-header");
      const offset = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 18;
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, offset));
      root.style.scrollBehavior = previousBehavior;
    };
    const scheduleAlign = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(alignHashTarget);
    };
    scheduleAlign();
    if (document.readyState !== "complete") {
      window.addEventListener("load", scheduleAlign, { once: true });
    }
    const observer = "ResizeObserver" in window ? new ResizeObserver(scheduleAlign) : null;
    observer?.observe(document.body);
    const observerTimer = window.setTimeout(() => observer?.disconnect(), 1800);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", scheduleAlign);
      observer?.disconnect();
      window.clearTimeout(observerTimer);
    };
  }, []);

  return (
    <>
      <main id="main">
        <Hero />
        <Proof />
        <Product onCopy={onCopy} activeProduct={activeProduct} setActiveProduct={setActiveProduct} />
        <OperationUI setActiveProduct={setActiveProduct} />
        <Capabilities />
        <Architecture />
        <Security />
        <Compare />
        <Pricing />
        <FAQ />
        <FinalCTA onCopy={onCopy} />
      </main>
      <Footer onCopy={onCopy} onSoon={onSoon} onLegal={onLegal} />
    </>
  );
}

function Shell() {
  const { t } = useI18n();
  const [route, setRoute] = useState(getRoute);
  const [legal, setLegal] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);

  const onSoon = useCallback(() => showToast(t("toast.soon")), [showToast, t]);

  const onCopy = useCallback(
    async (text, isEmail) => {
      await copyToClipboard(text);
      showToast(t(isEmail ? "toast.emailCopied" : "toast.copied"));
    },
    [showToast, t]
  );

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (route.view === "lab") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [route.view, route.product]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href={route.view === "docs" ? "#/docs#main" : "#main"}>
        {t("a11y.skip")}
      </a>
      <Header view={route.view} />
      {route.view === "docs" ? (
        <Suspense fallback={<div className="docs-loading" />}>
          <DocsPage pageId={route.pageId} anchor={route.anchor} />
        </Suspense>
      ) : route.view === "lab" ? (
        <LabPage initialProduct={route.product} onCopy={onCopy} />
      ) : route.view === "contact" ? (
        <>
          <Suspense fallback={<div className="page-loading" />}>
            <ContactPage />
          </Suspense>
          <Footer onCopy={onCopy} onSoon={onSoon} onLegal={setLegal} />
        </>
      ) : (
        <Marketing
          onCopy={onCopy}
          onSoon={onSoon}
          onLegal={setLegal}
        />
      )}
      <BackToTop />
      <LegalDialog legal={legal} onClose={() => setLegal(null)} />
      <Toast message={toast} />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
