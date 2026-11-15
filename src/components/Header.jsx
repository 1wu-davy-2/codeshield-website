import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useTheme } from "../lib/hooks.js";
import { Icon } from "./ui.jsx";

const NAV_ITEMS = [
  { id: "product", key: "nav.product" },
  { id: "lab", key: "nav.lab", href: "#/lab" },
  { id: "docs", key: "nav.docs", href: "#/docs" },
  { id: "capabilities", key: "nav.capabilities" },
  { id: "security", key: "nav.security" },
  { id: "pricing", key: "nav.pricing" },
  { id: "faq", key: "nav.faq" }
];

const SCAN_ITEMS = [
  ...NAV_ITEMS.filter((item) => !item.href),
  { id: "workspace", nav: "product" }
];

export default function Header({ view = "site" }) {
  const { t, lang, setLang, languages, mailto } = useI18n();
  const { toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  const langWrapRef = useRef(null);
  const langButtonRef = useRef(null);
  const langItemRefs = useRef([]);
  const mobileNavRef = useRef(null);
  const navToggleRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 8);
      if (view !== "site") {
        setActive(view === "lab" ? "lab" : "docs");
        return;
      }
      const header = document.querySelector(".site-header");
      const offset = (header?.offsetHeight || 72) + 120;
      let nextActive = "";
      for (const item of SCAN_ITEMS) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          nextActive = item.nav || item.id;
          break;
        }
      }
      setActive(nextActive);
    };
    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [view]);

  useEffect(() => {
    if (!langOpen) return undefined;
    const selectedIndex = Math.max(
      0,
      languages.findIndex((item) => item.code === lang)
    );
    langItemRefs.current[selectedIndex]?.focus();

    const onPointerDown = (event) => {
      if (!langWrapRef.current?.contains(event.target)) setLangOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setLangOpen(false);
        langButtonRef.current?.focus();
      }
    };
    document.addEventListener("click", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [langOpen, lang, languages]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileOpen);
    if (mobileOpen) {
      window.requestAnimationFrame(() => {
        mobileNavRef.current?.querySelector("a, button")?.focus();
      });
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        navToggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 980) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("nav-open");
    };
  }, [mobileOpen]);

  const chooseLanguage = useCallback(
    (code) => {
      setLang(code);
      setLangOpen(false);
      langButtonRef.current?.focus();
    },
    [setLang]
  );

  const onLanguageMenuKeyDown = (event) => {
    const items = languages;
    const currentIndex = langItemRefs.current.findIndex((item) => item === document.activeElement);
    let nextIndex = null;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else if (event.key === "Escape") {
      event.preventDefault();
      setLangOpen(false);
      langButtonRef.current?.focus();
      return;
    } else if (event.key === "Tab") {
      setLangOpen(false);
      return;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    langItemRefs.current[nextIndex]?.focus();
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${view === "lab" ? " is-lab" : ""}${view === "docs" ? " is-docs" : ""}`}
        id="siteHeader"
      >
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="CodeShield">
            <span className="brand-mark">
              <Icon name="logo" />
            </span>
            <span className="brand-name">
              Code<span>Shield</span>
            </span>
          </a>

          <nav className="site-nav" id="siteNav" aria-label={t("common.primaryNav")}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href || `#${item.id}`}
                className={active === item.id ? "is-active" : undefined}
                onClick={closeMobile}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="lang-wrap" ref={langWrapRef}>
              <button
                className="lang-button"
                id="langButton"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t("common.language")}
                ref={langButtonRef}
                onClick={() => setLangOpen((open) => !open)}
              >
                <Icon name="globe" className="icon icon-sm" />
                <span id="langLabel">{languages.find((item) => item.code === lang)?.short || "中文"}</span>
                <Icon name="chevron-down" className="icon icon-xs chevron" />
              </button>
              {langOpen ? (
                <div
                  className="lang-menu"
                  id="langMenu"
                  role="listbox"
                  aria-label={t("common.language")}
                  onKeyDown={onLanguageMenuKeyDown}
                >
                  {languages.map((item, index) => (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      data-lang={item.code}
                      aria-selected={item.code === lang}
                      ref={(node) => {
                        langItemRefs.current[index] = node;
                      }}
                      onClick={() => chooseLanguage(item.code)}
                    >
                      <span>{item.label}</span>
                      <Icon name="check" className="icon icon-xs tick" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              className="icon-btn theme-toggle"
              id="themeToggle"
              type="button"
              aria-label={t("common.themeToggle")}
              onClick={toggleTheme}
            >
              <Icon name="sun" className="icon icon-sun" />
              <Icon name="moon" className="icon icon-moon" />
            </button>

            <a className="btn btn-primary btn-sm header-cta" href={mailto("trial")}>
              {t("nav.trial")}
            </a>

            <button
              className="icon-btn nav-toggle"
              id="navToggle"
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobileNav"
              aria-label={mobileOpen ? t("common.close") : t("common.menu")}
              ref={navToggleRef}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <Icon name="menu" className="icon icon-menu" />
              <Icon name="x" className="icon icon-close" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="mobile-nav" id="mobileNav" ref={mobileNavRef}>
          <nav aria-label={t("common.mobileNav")}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href || `#${item.id}`}
                className={active === item.id ? "is-active" : undefined}
                onClick={closeMobile}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>
          <a className="btn btn-primary btn-block" href={mailto("trial")} onClick={closeMobile}>
            {t("nav.trial")}
          </a>
        </div>
      ) : null}
    </>
  );
}
